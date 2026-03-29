const express = require("express");
const router = express.Router();
const { getPatientById, searchPatient } = require("../controllers/patientController");
const { protect } = require("../middleware/authMiddleware");

// @route   GET /api/patient/search
// @desc    Search patient by mobile or health_id
// @access  Private
// Make sure this is BEFORE /:id to prevent matching "search" as an ID
router.get("/search", protect, searchPatient);

// @route   GET /api/patient/:id
// @desc    Get patient by ID
// @access  Private
router.get("/:id", protect, getPatientById);

module.exports = router;
