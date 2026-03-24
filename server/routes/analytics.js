const express = require('express');
const router = express.Router();
const CrowdReading = require('../models/CrowdReading');
const Alert = require('../models/Alert');
const { protect } = require('../middleware/auth');

// @desc    Get analytics for a venue
// @route   GET /api/analytics/:venueId
// @access  Private
router.get('/:venueId', protect, async (req, res, next) => {
    try {
        const { venueId } = req.params;
        const { range = '30d' } = req.query;

        let days = 30;
        if (range === '7d') days = 7;
        if (range === '90d') days = 90;

        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        // 1. Daily Counts (Peak density per day)
        // MongoDB aggregation to group by day and find max count
        const dailyCounts = await CrowdReading.aggregate([
            {
                $match: {
                    venueId,
                    sensorSource: 'FUSION',
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$timestamp" },
                        month: { $month: "$timestamp" },
                        day: { $dayOfMonth: "$timestamp" }
                    },
                    peakCount: { $max: "$count" },
                    avgCount: { $avg: "$count" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        // Format dates
        const formattedDaily = dailyCounts.map(day => ({
             date: `${day._id.year}-${String(day._id.month).padStart(2,'0')}-${String(day._id.day).padStart(2,'0')}`,
             peak: Math.round(day.peakCount),
             avg: Math.round(day.avgCount)
        }));

        // 2. Alert Frequency
        const alerts = await Alert.aggregate([
            {
                $match: {
                    venueId,
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: "$level",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 3. Sensor Reliability (Average confidence)
        const sensorReliability = await CrowdReading.aggregate([
            {
                $match: {
                    venueId,
                    sensorSource: { $ne: 'FUSION' },
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: "$sensorSource",
                    avgConfidence: { $avg: "$confidence" }
                }
            }
        ]);

        res.json({
            dailyCounts: formattedDaily,
            alerts: alerts.reduce((acc, curr) => { acc[curr._id] = curr.count; return acc; }, {}),
            sensorReliability: sensorReliability.reduce((acc, curr) => { acc[curr._id] = parseFloat(curr.avgConfidence.toFixed(2)); return acc; }, {})
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
