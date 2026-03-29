const express = require("express");
const router = express.Router();
const { addVisit, getPatientVisits } = require("../controllers/visitController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/visit/add
// @desc    Add a new visit
// @access  Private
router.post("/add", protect, addVisit);

// @route   GET /api/visit/:patient_id
// @desc    Get visits for a specific patient
// @access  Private
router.get("/:patient_id", protect, getPatientVisits);

module.exports = router;
