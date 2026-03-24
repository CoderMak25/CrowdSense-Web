const mongoose = require('mongoose');

const sensorLogSchema = new mongoose.Schema({
  venueId: String,
  sensorType: String,
  rawValue: mongoose.Schema.Types.Mixed,
  processedValue: Number,
  confidence: Number,
  timestamp: { type: Date, default: Date.now }
});

// Index to allow querying latest sensor readings quickly
sensorLogSchema.index({ venueId: 1, sensorType: 1, timestamp: -1 });

module.exports = mongoose.model('SensorLog', sensorLogSchema);
