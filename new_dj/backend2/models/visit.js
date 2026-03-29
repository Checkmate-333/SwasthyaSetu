const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Patient",
    },
    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Doctor",
    },
    symptoms: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Visit = mongoose.model("Visit", visitSchema);
module.exports = Visit;
