const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { protect } = require('../middleware/auth');
const { checkThresholdsAndAlert } = require('../services/alertEngine');

// @desc    Get paginated alerts
// @route   GET /api/alerts
// @access  Private
router.get('/', protect, async (req, res, next) => {
    try {
        const { venueId, level, from, to, limit = 50, page = 1 } = req.query;

        const query = {};

        if (venueId) query.venueId = venueId;
        if (level) query.level = level;

        if (from || to) {
            query.timestamp = {};
            if (from) query.timestamp.$gte = new Date(from);
            if (to) query.timestamp.$lte = new Date(to);
        }

        // Role check - operators only see their venues
        if (req.user.role !== 'admin' && !venueId) {
             query.venueId = { $in: req.user.venueAccess };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const alerts = await Alert.find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Alert.countDocuments(query);

        res.json({
            alerts,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Test trigger an alert manually (For demo purposes)
// @route   POST /api/alerts/test
// @access  Private
router.post('/test', protect, async (req, res, next) => {
    try {
        const { venueId, zoneId, level, message } = req.body;

        // Create a fake fusion reading to trigger the engine
        const fakeReading = {
            count: 9999, // Force critical
            sensorBreakdown: { cctv: 50, ble: 50 }
        };

        const fakeZone = {
            zoneId: zoneId || 'zone1',
            name: 'Test Zone',
            capacity: 100,
            thresholds: { low: 30, medium: 60, high: 80, critical: 95 }
        };

        const riskData = { score: 95 };

        if (level === 'CRITICAL') {
            fakeReading.sensorBreakdown.motion = 'CRUSH'; // Forces immediate override
        }

        // Run engine logic
        await checkThresholdsAndAlert(venueId, 'Test Venue', fakeZone, fakeReading, riskData);

        res.json({ success: true, message: 'Test alert triggered' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
