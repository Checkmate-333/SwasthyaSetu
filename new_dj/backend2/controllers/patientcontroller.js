const Patient = require("../models/Patient");

// @desc    Get patient by ID
// @route   GET /api/patient/:id
// @access  Private
const getPatientById = async (req, res) => {
  try {
    // RBAC Context Checking: Patients can strictly only view their own explicitly mapped UUID Document
    if (req.user && req.user.role === 'patient' && req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: "Security Violation: Not authorized to access foreign cross-tenant patient data." });
    }
    
    const patient = await Patient.findById(req.params.id).select("-password");
    
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Search patient by mobile or health_id
// @route   GET /api/patient/search
// @access  Private
const searchPatient = async (req, res) => {
  const { mobile, health_id } = req.query;

  // Let's restrict searching to doctors based on user requirement
  // "Allow doctor to search patient by mobile or health_id"
  if (req.user && req.user.role !== "doctor") {
    return res.status(403).json({ message: "Only doctors are authorized to search for patients" });
  }

  try {
    let query = {};
    if (mobile) query.mobile = mobile;
    if (health_id) query.health_id = health_id;

    if (Object.keys(query).length === 0) {
      return res.status(400).json({ message: "Please provide mobile or health_id to search" });
    }

    const patient = await Patient.findOne(query).select("-password");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getPatientById,
  searchPatient,
};
