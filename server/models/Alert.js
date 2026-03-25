const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  venueId: { type: String, required: true },
  zoneId: String,
  severity: { 
    type: String, 
    enum: ["WARNING", "CRITICAL"],
    required: true
  },
  riskScore: Number,
  crowdLevel: String,
  triggeredBy: [String],
  message: String,
  whatsappSent: { type: Boolean, default: false },
  smsSent: { type: Boolean, default: false },
  recipients: [String],
  status: { 
    type: String, 
    enum: ["ACTIVE", "RESOLVED", "ACKNOWLEDGED"],
    default: "ACTIVE"
  },
  resolvedAt: Date,
  createdAt: { type: Date, default: Date.now, index: { expires: '90d' } }
});

// Index for venue history
alertSchema.index({ venueId: 1, createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
