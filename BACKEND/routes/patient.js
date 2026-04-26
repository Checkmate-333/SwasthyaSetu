const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Patient = require('../models/Patient');

// Get patient by ID or ABHA or mobile
router.get('/:identifier', auth, async (req, res) => {
  try {
    let patient;
    const identifier = req.params.identifier;
    if (identifier.match(/^[0-9]{10}$/)) {
      patient = await Patient.findOne({ mobile: identifier }).populate('user');
    } else if (identifier.startsWith('ABHA:')) {
      patient = await Patient.findOne({ abhaId: identifier }).populate('user');
    } else if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      patient = await Patient.findById(identifier).populate('user');
    } else {
      return res.status(400).json({ message: 'Invalid identifier format' });
    }

    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create or update patient
router.post('/', auth, async (req, res) => {
  try {
    const { abhaId, mobile, name, age, gender, address, chronicConditions, medicalHistory } = req.body;

    let patient = await Patient.findOne({ $or: [{ abhaId }, { mobile }] });
    if (patient) {
      // Update
      patient.name = name || patient.name;
      patient.age = age;
      patient.gender = gender;
      patient.address = address;
      patient.chronicConditions = chronicConditions;
      patient.medicalHistory = medicalHistory;
      patient.updatedAt = Date.now();
      await patient.save();
      res.json({ message: 'Patient updated', patient });
    } else {
      // Create
      patient = new Patient({
        user: req.user.id,
        abhaId,
        mobile,
        name,
        age,
        gender,
        address,
        chronicConditions,
        medicalHistory
      });
      await patient.save();
      res.status(201).json({ message: 'Patient created', patient });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;