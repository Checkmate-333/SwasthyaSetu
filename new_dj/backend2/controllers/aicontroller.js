const Patient = require("../models/Patient");
const Visit = require("../models/Visit");
const Prescription = require("../models/Prescription");
const Report = require("../models/Report");
const axios = require("axios");

const FLASK_BASE_URL = process.env.FLASK_BASE_URL || "http://localhost:5001";

// @desc    Fetch comprehensive patient history and request an AI clinical summary
// @route   GET /api/ai-summary/:patient_id
// @access  Private
const getAiSummary = async (req, res) => {
  const { patient_id } = req.params;

  try {
    // RBAC Enforced Boundary Context Checkout
    if (req.user && req.user.role === 'patient' && req.user._id.toString() !== patient_id) {
        return res.status(403).json({ message: "Security Violation: Not authorized to parse native intelligence summaries of foreign documents." });
    }

    // 1. Fetch patient core data
    const patient = await Patient.findById(patient_id).select("-password -__v").lean();
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // 2. Fetch all visits, resolving nested prescriptions
    const visits = await Visit.find({ patient_id }).select("-__v").lean();
    for (let visit of visits) {
      const ps = await Prescription.find({ visit_id: visit._id }).select("-__v").lean();
      visit.prescriptions = ps;
    }

    // 3. Fetch all reports, containing optionally structured_data and OCR texts
    const reports = await Report.find({ patient_id }).select("-__v").lean();

    // 4. Group data package representing the clinical history
    const patientHistory = {
      patient,
      visits,
      reports,
    };

    // 5. Query Flask Gemini-integrating microservice
    const aiResponse = await axios.post(`${FLASK_BASE_URL}/ai-summary`, patientHistory);

    // 6. Return mapped AI payload to client along with raw historic states
    res.json({
      patient_id: patient._id,
      patient_name: patient.name,
      generated_at: new Date(),
      ai_summary: aiResponse.data,
      visits: visits,
      reports: reports
    });
    
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ message: "Flask AI Endpoint Error", error: error.response.data });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAiSummary,
};
