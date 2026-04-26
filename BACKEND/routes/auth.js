const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Register
router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('mobile').optional().isMobilePhone(),
  body('abhaId').optional()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, mobile, abhaId, role } = req.body;

  try {
    let user = await User.findOne({ $or: [{ email }, { mobile }, { abhaId }] });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password, mobile, abhaId, role });
    await user.save();

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user.id, name, email, role } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', [
  body('identifier').notEmpty(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }, { abhaId: identifier }]
    });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
// Request OTP (Mock)
router.post('/request-otp', [
  body('mobileNumber').isLength({ min: 10, max: 10 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Invalid mobile number' });

  const { mobileNumber } = req.body;
  // In a real app, integrate an SMS gateway here.
  // We're returning a mock OTP for demo purposes.
  const mockOtp = '123456';
  
  res.json({ success: true, message: 'OTP request successful', mockOtp });
});

// Verify OTP (Mock)
router.post('/verify-otp', [
  body('mobileNumber').isLength({ min: 10, max: 10 }),
  body('otp').isLength({ min: 6, max: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Invalid input' });

  const { mobileNumber, otp, name, role } = req.body;

  // Verify mock OTP
  if (otp !== '123456') {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  try {
    // Find or create user
    let user = await User.findOne({ mobile: mobileNumber });
    
    if (!user) {
      // Create a default user based on mobile number if not existing
      user = new User({ 
        name: name || 'Doctor', 
        email: `${mobileNumber}@swasthyasetu.in`, 
        password: 'defaultPassword123', // required by schema 
        mobile: mobileNumber,
        role: role || 'doctor' 
      });
      await user.save();
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_super_secret_key_change_me', { expiresIn: '7d' });

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, mobile: user.mobile, role: user.role }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;