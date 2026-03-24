const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  venueId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['railway', 'mall', 'pandal', 'stadium', 'hospital'],
    required: true
  },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  zones: [{
    zoneId: String,
    name: String,
    capacity: Number,
    polygon: [[Number]],
    thresholds: {
      low: { type: Number, default: 30 },
      medium: { type: Number, default: 60 },
      high: { type: Number, default: 80 },
      critical: { type: Number, default: 95 }
    }
  }],
  sensors: {
    cctv: { type: Boolean, default: false },
    gps: { type: Boolean, default: false },
    ble: { type: Boolean, default: false },
    accelerometer: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    cellular: { type: Boolean, default: false },
    network: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    appEvents: { type: Boolean, default: false }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Venue', venueSchema);
