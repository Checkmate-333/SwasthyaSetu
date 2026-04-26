const mongoose = require('mongoose');

const SyncQueueSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['prescription', 'patient_update'], required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  status: { type: String, enum: ['pending', 'synced', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  syncedAt: Date
});

module.exports = mongoose.model('SyncQueue', SyncQueueSchema);