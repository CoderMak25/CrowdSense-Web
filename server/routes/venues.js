const express = require('express');
const router = express.Router();
const Venue = require('../models/Venue');
const CrowdReading = require('../models/CrowdReading');
const { protect, requireRole } = require('../middleware/auth');

// @desc    Get all venues with current crowd summary
// @route   GET /api/venues
// @access  Private
router.get('/', protect, async (req, res, next) => {
    try {
        const query = req.user.role === 'admin' ? {} : { venueId: { $in: req.user.venueAccess } };
        const venues = await Venue.find(query);
        
        // Fetch current snapshot per venue
        const venuesWithSummary = [];
        for (const venue of venues) {
             const recentReading = await CrowdReading.findOne({
                 venueId: venue.venueId,
                 sensorSource: 'FUSION'
             }).sort({ timestamp: -1 });

             venuesWithSummary.push({
                 _id: venue._id,
                 venueId: venue.venueId,
                 name: venue.name,
                 type: venue.type,
                 location: venue.location,
                 isActive: venue.isActive,
                 currentStatus: recentReading ? recentReading.densityLabel : 'UNKNOWN',
                 lastUpdated: recentReading ? recentReading.timestamp : null
             });
        }

        res.json(venuesWithSummary);
    } catch (error) {
        next(error);
    }
});

// @desc    Get single venue detail
// @route   GET /api/venues/:venueId
// @access  Private
router.get('/:venueId', protect, async (req, res, next) => {
    try {
        const venue = await Venue.findOne({ venueId: req.params.venueId });
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        res.json(venue);
    } catch (error) {
        next(error);
    }
});

// @desc    Create new venue
// @route   POST /api/venues
// @access  Private/Admin
router.post('/', protect, requireRole('admin', 'operator'), async (req, res, next) => {
    try {
        const duplicate = await Venue.findOne({ venueId: req.body.venueId });
        if (duplicate) {
            return res.status(400).json({ message: 'Venue ID already exists' });
        }
        
        const venue = await Venue.create(req.body);
        res.status(201).json(venue);
    } catch (error) {
        next(error);
    }
});

// @desc    Update zone thresholds
// @route   PUT /api/venues/:venueId/thresholds
// @access  Private
router.put('/:venueId/thresholds', protect, async (req, res, next) => {
    try {
        const { zoneId, thresholds } = req.body;

        const venue = await Venue.findOneAndUpdate(
            { venueId: req.params.venueId, 'zones.zoneId': zoneId },
            { $set: { 'zones.$.thresholds': thresholds } },
            { new: true }
        );

        if (!venue) {
            return res.status(404).json({ message: 'Venue or zone not found' });
        }

        res.json(venue);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
