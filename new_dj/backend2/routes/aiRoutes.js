const express = require("express");
const router = express.Router();
const { getAiSummary } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// @route   GET /api/ai-summary/:patient_id
// @desc    Generate rich medical summary interacting with Python AI Layer
// @access  Private
router.get("/:patient_id", protect, getAiSummary);

module.exports = router;
