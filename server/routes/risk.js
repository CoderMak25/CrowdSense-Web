const express = require('express');
const router = express.Router();
const CrowdReading = require('../models/CrowdReading');
const RiskScoreEngine = require('../services/riskScore');

// GET /api/v1/risk/:venue_id
router.get('/:venue_id', async (req, res) => {
    try {
        const readings = await CrowdReading.aggregate([
            { $match: { venueId: req.params.venue_id, sensorSource: 'FUSION' } },
            { $sort: { timestamp: -1 } },
            { $group: { _id: '$zoneId', latest: { $first: '$$ROOT' } } }
        ]);
        
        let overallRisk = 0;
        let validZones = 0;
        const zones = readings.map(r => {
            if(r.latest && r.latest.riskScore) {
                overallRisk += r.latest.riskScore;
                validZones++;
            }
            return r.latest;
        });
        
        const avgRisk = validZones > 0 ? (overallRisk / validZones) : 0;
        let overallLevel = 'LOW';
        if (avgRisk >= 75) overallLevel = 'CRITICAL';
        else if (avgRisk >= 50) overallLevel = 'HIGH';
        else if (avgRisk >= 25) overallLevel = 'MODERATE';

        res.json({
            venue_id: req.params.venue_id,
            overall_risk_score: avgRisk,
            overall_crowd_level: overallLevel,
            zones: zones,
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/v1/risk/:venue_id/anomalies
router.get('/:venue_id/anomalies', async (req, res) => {
    try {
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const anomalies = await CrowdReading.find({
            venueId: req.params.venue_id,
            isAnomaly: true,
            timestamp: { $gte: last24h }
        }).sort({ timestamp: -1 });
        res.json(anomalies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/v1/risk/:venue_id/history
router.get('/:venue_id/history', async (req, res) => {
    try {
        const { zone_id, from_time, to_time } = req.query;
        let query = { venueId: req.params.venue_id, sensorSource: 'FUSION' };
        if (zone_id) query.zoneId = zone_id;
        
        if (from_time || to_time) {
            query.timestamp = {};
            if (from_time) query.timestamp.$gte = new Date(from_time);
            if (to_time) query.timestamp.$lte = new Date(to_time);
        } else {
            // Default to last 2 hours
            query.timestamp = { $gte: new Date(Date.now() - 2 * 60 * 60 * 1000) };
        }

        const history = await CrowdReading.find(query)
            .select('zoneId riskScore crowdLevel densityValue count timestamp')
            .sort({ timestamp: 1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/v1/risk/:venue_id/test
router.post('/:venue_id/test', async (req, res) => {
    try {
        const { zone_id, density, motion_label, inject_anomaly } = req.body;
        // Mock recent history
        let recentDensities = Array(10).fill(density * 0.5); 
        if (inject_anomaly) recentDensities = Array(10).fill(density * 0.1); 

         const result = await RiskScoreEngine.compute(
            req.params.venue_id, zone_id, density, motion_label, density * 0.5, Date.now() - 60000, recentDensities
         );
         res.json({
             venueId: req.params.venue_id,
             zoneId: zone_id,
             ...result
         });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
