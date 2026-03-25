const mongoose = require('mongoose');

const alertSubscriptionSchema = new mongoose.Schema({
  venueId: { type: String, required: true },
  phone: { type: String, required: true },
  name: String,
  viaWhatsapp: { type: Boolean, default: true },
  viaSms: { type: Boolean, default: true },
  severityFilter: { 
    type: String, 
    enum: ["WARNING", "CRITICAL"],
    default: "WARNING" 
  },
  createdAt: { type: Date, default: Date.now }
});

// Unique index to prevent duplicate subs
alertSubscriptionSchema.index({ venueId: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model('AlertSubscription', alertSubscriptionSchema);
