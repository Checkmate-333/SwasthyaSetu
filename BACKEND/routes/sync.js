const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SyncQueue = require('../models/SyncQueue');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');

// Add offline data to sync queue
router.post('/queue', auth, async (req, res) => {
  try {
    const { type, data } = req.body;
    if (!['prescription', 'patient_update'].includes(type)) {
      return res.status(400).json({ message: 'Invalid sync type' });
    }

    const syncItem = new SyncQueue({
      userId: req.user.id,
      type,
      data,
      status: 'pending'
    });
    await syncItem.save();
    res.status(201).json({ message: 'Queued for sync', id: syncItem.id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Process pending sync items (client should call after reconnection)
router.post('/process', auth, async (req, res) => {
  try {
    const pending = await SyncQueue.find({ userId: req.user.id, status: 'pending' });
    const results = [];

    for (const item of pending) {
      try {
        if (item.type === 'prescription') {
          // Create prescription from stored data
          const { patientId, imageUrl, extractedText, structuredData, summary, riskAlerts, missingData } = item.data;
          const prescription = new Prescription({
            patient: patientId,
            doctor: req.user.id,
            imageUrl,
            extractedText,
            structuredData,
            summary,
            riskAlerts,
            missingData
          });
          await prescription.save();
          results.push({ id: item.id, status: 'success' });
          item.status = 'synced';
          item.syncedAt = new Date();
        } else if (item.type === 'patient_update') {
          // Update patient info
          const { patientId, updates } = item.data;
          await Patient.findByIdAndUpdate(patientId, updates);
          results.push({ id: item.id, status: 'success' });
          item.status = 'synced';
          item.syncedAt = new Date();
        }
        await item.save();
      } catch (err) {
        console.error(`Failed to sync item ${item.id}:`, err);
        results.push({ id: item.id, status: 'failed', error: err.message });
        item.status = 'failed';
        await item.save();
      }
    }

    res.json({ message: 'Sync processed', results });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;