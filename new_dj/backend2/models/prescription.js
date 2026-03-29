const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    visit_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Visit",
    },
    medicines: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String },
      },
    ],
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = Prescription;
