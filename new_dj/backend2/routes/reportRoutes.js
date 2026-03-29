const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadReport, processReport } = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/report/upload
// @desc    Upload a report or prescription file directly
// @access  Private
router.post("/upload", protect, upload.single("file"), uploadReport);

// @route   POST /api/report/process
// @desc    Upload file, trigger OCR, map structured data, and save implicitly
// @access  Private
router.post("/process", protect, upload.single("file"), processReport);

module.exports = router;
