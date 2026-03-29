const Report = require("../models/Report");
const Visit = require("../models/Visit");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const FLASK_BASE_URL = process.env.FLASK_BASE_URL || "http://localhost:5001";

// @desc    Upload a report/prescription image directly
// @route   POST /api/report/upload
// @access  Private
const uploadReport = async (req, res) => {
  try {
    const { patient_id, visit_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!patient_id || !visit_id) {
      return res.status(400).json({ message: "patient_id and visit_id are required" });
    }

    // Optionally verify visit exists
    const visitExists = await Visit.findById(visit_id);
    if (!visitExists) {
      return res.status(404).json({ message: "Visit not found" });
    }

    // Windows paths might use \ instead of /, let's normalize this
    const normalizedPath = req.file.path.replace(/\\/g, "/");

    const report = new Report({
      patient_id,
      visit_id,
      file_url: `/${normalizedPath}`,
    });

    const createdReport = await report.save();
    res.status(201).json(createdReport);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Process a report (Upload -> OCR -> Structure -> Save)
// @route   POST /api/report/process
// @access  Private
const processReport = async (req, res) => {
  try {
    const { patient_id, visit_id } = req.body;

    // Boundary Tenancy Verification
    if (req.user && req.user.role === 'patient' && req.user._id.toString() !== patient_id) {
      return res.status(403).json({ message: "Security Violation: Not authorized to queue reports assigning to foreign schemas." });
    }

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    if (!patient_id) return res.status(400).json({ message: "patient_id is required" });

    // 1. Send Image to Flask OCR Endpoint
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    const ocrResponse = await axios.post(`${FLASK_BASE_URL}/ocr`, formData, {
      headers: { ...formData.getHeaders() },
    });

    const rawText = ocrResponse.data.raw_text;

    // 2. Transmit raw OCR text to Flask Structure NLP Parsing
    const structureResponse = await axios.post(`${FLASK_BASE_URL}/structure`, {
      raw_text: rawText,
    });

    const structuredData = structureResponse.data;

    // 3. Save MongoDB Entry
    const normalizedPath = req.file.path.replace(/\\/g, "/");
    const report = new Report({
      patient_id,
      visit_id, // can be optional
      file_url: `/${normalizedPath}`,
      raw_text: rawText,
      structured_data: structuredData,
    });

    const savedReport = await report.save();
    res.status(201).json(savedReport);

  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ message: "Flask Service Error", error: error.response.data });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  uploadReport,
  processReport,
};
