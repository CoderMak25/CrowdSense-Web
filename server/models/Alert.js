const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  venueId: String,
  zoneId: String,
  venueName: String,
  zoneName: String,
  level: {
    type: String,
    enum: ['MEDIUM', 'HIGH', 'CRITICAL']
  },
  riskScore: Number,
  triggeringSensors: [String],
  message: String,
  whatsappSent: { type: Boolean, default: false },
  smsSent: { type: Boolean, default: false },
  resolvedAt: Date,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);
