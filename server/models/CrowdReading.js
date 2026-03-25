const mongoose = require('mongoose');

const crowdReadingSchema = new mongoose.Schema({
  venueId: { type: String, required: true },
  zoneId: { type: String, required: true },
  count: { type: Number, required: true },
  densityLabel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    required: true
  },
  densityValue: Number,
  sensorSource: {
    type: String,
    enum: ['CCTV', 'BLE', 'GPS', 'MOTION', 'WIFI', 'CELLULAR', 'NETWORK', 'SMS', 'APP_EVENTS', 'FUSION']
  },
  confidence: { type: Number, min: 0, max: 1 },
  sensorBreakdown: {
    cctv: Number,
    ble: Number,
    gps: Number,
    motion: String,
    wifi: Number,
    cellular: Number,
    network: Number,
    sms: Number,
    appEvents: Number
  },
  riskScore: { type: Number, default: 0.0 },
  crowdLevel: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'], default: 'LOW' },
  triggeredBy: [String],
  isAnomaly: { type: Boolean, default: false },
  densityScore: { type: Number, default: 0.0 },
  motionScore: { type: Number, default: 0.0 },
  surgeRateScore: { type: Number, default: 0.0 },
  anomalyScore: { type: Number, default: 0.0 },
  timestamp: { type: Date, default: Date.now, index: true }
});

// Index to query the latest reading per zone efficiently
crowdReadingSchema.index({ venueId: 1, zoneId: 1, timestamp: -1 });

module.exports = mongoose.model('CrowdReading', crowdReadingSchema);
