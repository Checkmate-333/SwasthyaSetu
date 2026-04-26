const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  abhaId: { type: String, unique: true, sparse: true },
  mobile: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  address: String,
  chronicConditions: [String],
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    notes: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

PatientSchema.index({ abhaId: 1, mobile: 1 });

module.exports = mongoose.model('Patient', PatientSchema);