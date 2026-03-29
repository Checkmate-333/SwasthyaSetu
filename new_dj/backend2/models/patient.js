const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "patient",
      enum: ["patient"],
    },
    mobile: {
      type: String,
    },
    health_id: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving and generate health_id
patientSchema.pre("save", async function (next) {
  if (this.isNew || !this.health_id) {
    this.health_id = uuidv4();
  }

  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
patientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
