const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageUrl: String, // if we store uploaded image
  extractedText: String, // raw OCR output
  structuredData: {
    diagnoses: [String],
    medications: [{
      name: String,
      dosage: String,
      duration: String,
      frequency: String
    }],
    tests: [String],
    visitDate: Date,
    notes: String
  },
  summary: String, // AI-generated summary
  riskAlerts: [String],
  missingData: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);