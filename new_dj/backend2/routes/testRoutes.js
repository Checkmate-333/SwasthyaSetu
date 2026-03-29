const express = require("express");
const router = express.Router();
const { testServer } = require("../controllers/testController");

// @route   GET /api/test
// @desc    Test basic server functionality
// @access  Public
router.get("/", testServer);

module.exports = router;
