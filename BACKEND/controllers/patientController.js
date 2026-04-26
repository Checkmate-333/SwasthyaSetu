// backend/controllers/patientController.js
const Patient = require('../models/Patient');
const MedicalRecord = require('../models/MedicalRecord');
const ClinicalSummary = require('../models/ClinicalSummary');
const { generateClinicalSummary } = require('../services/summaryService');

exports.createPatient = async (req, res) => {
  try {
    const { mobileNumber, ...patientData } = req.body;
    
    // Check if patient already exists
    const existingPatient = await Patient.findOne({ mobileNumber });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already exists' });
    }
    
    const patient = new Patient({ mobileNumber, ...patientData });
    await patient.save();
    
    res.status(201).json({
      success: true,
      data: patient,
      message: 'Patient created successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Get clinical summary
    let summary = await ClinicalSummary.findOne({ patientId: patient._id });
    if (!summary) {
      // Generate summary if not exists
      summary = await generateClinicalSummary(patient._id);
    }
    
    // Get recent medical records
    const recentRecords = await MedicalRecord.find({ patientId: patient._id })
      .sort({ visitDate: -1 })
      .limit(5);
    
    res.json({
      success: true,
      data: {
        patient,
        summary,
        recentRecords
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json({
      success: true,
      data: patient,
      message: 'Patient updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchPatients = async (req, res) => {
  try {
    const { query } = req.query;
    const searchRegex = new RegExp(query, 'i');
    
    const patients = await Patient.find({
      $or: [
        { name: searchRegex },
        { mobileNumber: searchRegex },
        { abhaId: searchRegex }
      ]
    }).limit(20);
    
    res.json({
      success: true,
      data: patients
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};