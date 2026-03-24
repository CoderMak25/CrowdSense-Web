const express = require('express');
const router = express.Router();
const CrowdReading = require('../models/CrowdReading');
const Venue = require('../models/Venue');
const { calculateRiskScore } = require('../services/riskScore');
const { generateForecast } = require('../services/lstmPredictor');
const { protect } = require('../middleware/auth');
const { redisClient } = require('../config/redis');
const { REDIS_KEYS } = require('../config/constants');

// @desc    Get current density for a venue
// @route   GET /api/density/:venueId
// @access  Private
router.get('/:venueId', protect, async (req, res, next) => {
    try {
        const { venueId } = req.params;
        
        // 1. Try cache first
        const cacheKey = REDIS_KEYS.DENSITY_CACHE(venueId);
        const cached = await redisClient.get(cacheKey);
        if (cached) {
             return res.json(JSON.parse(cached));
        }

        // 2. Fetch from DB
        const venue = await Venue.findOne({ venueId });
        if (!venue) {
             return res.status(404).json({ message: 'Venue not found' });
        }

        const recentZoneReadings = [];
        const thirtyMinsAgo = new Date(Date.now() - 30 * 60000);

        for (const zone of venue.zones) {
             const reading = await CrowdReading.findOne({
                 venueId,
                 zoneId: zone.zoneId,
                 sensorSource: 'FUSION',
                 timestamp: { $gte: thirtyMinsAgo }
             }).sort({ timestamp: -1 });

             if (reading) {
                 recentZoneReadings.push({
                     zoneId: zone.zoneId,
                     zoneName: zone.name,
                     count: reading.count,
                     densityLabel: reading.densityLabel,
                     densityValue: reading.densityValue, // % of threshold optionally
                     confidence: reading.confidence,
                     lastUpdated: reading.timestamp,
                     sensorSources: Object.keys(reading.sensorBreakdown || {})
                 });
             } else {
                 recentZoneReadings.push({
                     zoneId: zone.zoneId,
                     zoneName: zone.name,
                     count: 0,
                     densityLabel: 'OFFLINE',
                     confidence: 0,
                     lastUpdated: null,
                     sensorSources: []
                 });
             }
        }

        // 3. Calculate Risk Score
        const activeReadings = await CrowdReading.find({
            venueId,
            sensorSource: 'FUSION',
            timestamp: { $gte: new Date(Date.now() - 60000) }
        }).sort({ timestamp: -1 });
        
        // Need to deduplicate active readings by zoneId
        const latestReadingsMap = new Map();
        for (const reading of activeReadings) {
             if (!latestReadingsMap.has(reading.zoneId)) {
                  latestReadingsMap.set(reading.zoneId, reading);
             }
        }

        const riskData = await calculateRiskScore(venueId, Array.from(latestReadingsMap.values()));

        const responsePayload = {
             venueId,
             venueName: venue.name,
             zones: recentZoneReadings,
             overallRiskScore: riskData.score,
             riskFactors: riskData.factors,
             timestamp: new Date()
        };

        // 4. Cache for 10 seconds
        await redisClient.setex(cacheKey, 10, JSON.stringify(responsePayload));

        res.json(responsePayload);

    } catch (error) {
        next(error);
    }
});

// @desc    Get forecast for a venue
// @route   GET /api/density/:venueId/forecast
// @access  Public (Used by commuters)
router.get('/:venueId/forecast', async (req, res, next) => {
    try {
        const { venueId } = req.params;
        const venue = await Venue.findOne({ venueId });
        if (!venue) {
             return res.status(404).json({ message: 'Venue not found' });
        }

        // Generate forecast per zone
        const forecastMap = new Map(); // e.g. "08:15" => { zones: [...] }
        
        for (const zone of venue.zones) {
             const zoneForecast = await generateForecast(venueId, zone.zoneId);
             
             for (const slot of zoneForecast) {
                  if (!forecastMap.has(slot.slot)) {
                       forecastMap.set(slot.slot, { slot: slot.slot, zones: [] });
                  }
                  forecastMap.get(slot.slot).zones.push({
                       zoneId: zone.zoneId,
                       zoneName: zone.name,
                       predictedLabel: slot.predictedLabel,
                       predictedCount: slot.predictedCount,
                       confidence: slot.confidence
                  });
             }
        }

        res.json({
             venueId,
             venueName: venue.name,
             forecast: Array.from(forecastMap.values())
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get history for a venue
// @route   GET /api/density/:venueId/history
// @access  Private
router.get('/:venueId/history', protect, async (req, res, next) => {
    try {
        const { venueId } = req.params;
        const { from, to, zoneId } = req.query;

        // Default to last 2 hours
        const endDate = to ? new Date(to) : new Date();
        const startDate = from ? new Date(from) : new Date(endDate.getTime() - 2 * 3600 * 1000);

        const query = {
             venueId,
             sensorSource: 'FUSION',
             timestamp: { $gte: startDate, $lte: endDate }
        };

        if (zoneId) {
             query.zoneId = zoneId;
        }

        const history = await CrowdReading.find(query).sort({ timestamp: 1 });

        res.json(history);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
