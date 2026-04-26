// backend/controllers/medicalRecordController.js
const MedicalRecord = require('../models/MedicalRecord');
const ClinicalSummary = require('../models/ClinicalSummary');
const { generateClinicalSummary } = require('../services/summaryService');

exports.createMedicalRecord = async (req, res) => {
  try {
    const medicalRecord = new MedicalRecord(req.body);
    await medicalRecord.save();
    
    // Update clinical summary
    await generateClinicalSummary(medicalRecord.patientId);
    
    res.status(201).json({
      success: true,
      data: medicalRecord,
      message: 'Medical record created successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMedicalRecords = async (req, res) => {
  try {
    const { patientId, startDate, endDate, limit = 50 } = req.query;
    const query = {};
    
    if (patientId) query.patientId = patientId;
    if (startDate || endDate) {
      query.visitDate = {};
      if (startDate) query.visitDate.$gte = new Date(startDate);
      if (endDate) query.visitDate.$lte = new Date(endDate);
    }
    
    const records = await MedicalRecord.find(query)
      .sort({ visitDate: -1 })
      .limit(parseInt(limit))
      .populate('patientId', 'name mobileNumber');
    
    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMedicalRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patientId', 'name mobileNumber dateOfBirth');
    
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    // Update clinical summary
    await generateClinicalSummary(record.patientId);
    
    res.json({
      success: true,
      data: record,
      message: 'Medical record updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);
    
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    // Update clinical summary
    await generateClinicalSummary(record.patientId);
    
    res.json({
      success: true,
      message: 'Medical record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};