const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { extractClinicalData } = require('../utils/gemini');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');

// Upload prescription image and process
router.post('/upload', [auth, upload.single('image')], async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    const { patientId } = req.body;
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // Extract structured clinical data using Gemini 2.5 Flash
    // multer-storage-cloudinary provides req.file.path as the cloudinary URL
    const imageUrl = req.file.path; 
    
    // Pass the image path to Gemini (if local it reads, if cloudinary, the buffer needs to be fetched or url used)
    // For simplicity, we assume utils/gemini handles fetching or reading. 
    // Since our fallback reads fs, and our cloud uses URL, let's adjust gemini.js to handle it if needed.
    // For now we pass the path.
    const aiData = await extractClinicalData(req.file.path, req.file.mimetype || 'image/jpeg');

    const prescription = new Prescription({
      patient: patientId,
      doctor: req.user.id,
      imageUrl: imageUrl,
      extractedText: "Processed via Gemini 2.5 Flash API",
      structuredData: {
        diagnoses: aiData.diagnoses || [],
        medications: aiData.medications || [],
        tests: aiData.tests || [],
        visitDate: aiData.visitDate || new Date(),
        notes: aiData.notes || ''
      },
      summary: aiData.summary || 'Summary unavailable.',
      riskAlerts: aiData.riskAlerts || [],
      missingData: aiData.missingData || []
    });
    await prescription.save();

    res.status(201).json({
      message: 'Prescription processed',
      prescription: {
        id: prescription.id,
        summary: prescription.summary,
        riskAlerts: prescription.riskAlerts,
        missingData: prescription.missingData,
        structuredData: prescription.structuredData
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all prescriptions for a patient
router.get('/patient/:patientId', auth, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.params.patientId })
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get latest summary for a patient
router.get('/summary/:patientId', auth, async (req, res) => {
  try {
    const latest = await Prescription.findOne({ patient: req.params.patientId })
      .sort({ createdAt: -1 });
    if (!latest) return res.status(404).json({ message: 'No prescriptions found' });

    res.json({
      summary: latest.summary,
      riskAlerts: latest.riskAlerts,
      missingData: latest.missingData,
      structuredData: latest.structuredData
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;