const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  visit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Visit",
    required: true,
  },
  file_url: {
    type: String,
    required: true,
  },
  raw_text: {
    type: String,
  },
  structured_data: {
    type: Object,
  },
  uploaded_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", reportSchema);
