const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/auth/register
// @desc    Register new patient/doctor
// @access  Public
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Login patient/doctor
// @access  Public
router.post("/login", loginUser);

// Example of a protected route using the middleware
// router.get("/profile", protect, (req, res) => {
//   res.json({ message: "Protected profile data", user: req.user });
// });

module.exports = router;
