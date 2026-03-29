const Visit = require("../models/Visit");
const Patient = require("../models/Patient");

// @desc    Add a new visit
// @route   POST /api/visit/add
// @access  Private (Doctor only)
const addVisit = async (req, res) => {
  const { patient_id, symptoms, diagnosis } = req.body;

  // Ensure only doctors can add visit records
  if (req.user && req.user.role !== "doctor") {
    return res.status(403).json({ message: "Only doctors can add visits" });
  }

  if (!patient_id || !symptoms || !diagnosis) {
    return res.status(400).json({ message: "Please provide patient_id, symptoms, and diagnosis" });
  }

  try {
    // Check if patient exists
    const patientExists = await Patient.findById(patient_id);
    if (!patientExists) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const visit = new Visit({
      patient_id,
      doctor_id: req.user._id,
      symptoms,
      diagnosis,
    });

    const createdVisit = await visit.save();
    res.status(201).json(createdVisit);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all visits for a specific patient
// @route   GET /api/visit/:patient_id
// @access  Private
const getPatientVisits = async (req, res) => {
  const { patient_id } = req.params;

  try {
    // If the logged-in user is a patient, they can only view their own visits
    if (req.user && req.user.role === "patient" && req.user._id.toString() !== patient_id) {
       return res.status(403).json({ message: "Not authorized to view these visits" });
    }

    const visits = await Visit.find({ patient_id })
      .populate("doctor_id", "name email")
      .sort({ date: -1 });
      
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addVisit,
  getPatientVisits,
};
