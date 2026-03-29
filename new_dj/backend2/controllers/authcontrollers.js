const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user (Patient or Doctor)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role, mobile } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Please compile all fields" });
  }
  
  // Hardened Input Validation Pattern Matching
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format structure detected" });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: "Insecure Password Requirements: Must be at least 6 characters" });
  }

  if (role !== "patient" && role !== "doctor") {
    return res.status(400).json({ message: "Role must be 'patient' or 'doctor'" });
  }

  try {
    const Model = role === "doctor" ? Doctor : Patient;
    
    // Check if user exists
    const userExists = await Model.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user (password is hashed in model pre-save hook)
    const userData = {
      name,
      email,
      password,
      role,
    };
    
    if (role === "patient" && mobile) {
      userData.mobile = mobile;
    }

    const user = await Model.create(userData);

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user in patient collection first, then doctor
    let user = await Patient.findOne({ email });
    
    if (!user) {
      user = await Doctor.findOne({ email });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
