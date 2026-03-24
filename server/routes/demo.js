const express = require('express');
const router = express.Router();
const { redisPubSub } = require('../config/redis');
const Venue = require('../models/Venue');
const Alert = require('../models/Alert');
const CrowdReading = require('../models/CrowdReading');
const { runFusionForZone } = require('../services/kalmanFusion');
const { REDIS_KEYS } = require('../config/constants');

// Memory state for demo
let demoActive = false;
let demoInterval = null;

// @desc    Trigger simulated crowd surge
// @route   GET /api/demo/simulate
// @access  Public
router.get('/simulate', async (req, res, next) => {
    try {
        if (demoActive) {
             return res.json({ message: 'Demo already running' });
        }

        const venueId = 'csmt01'; // Demo venue
        const venue = await Venue.findOne({ venueId });
        
        if (!venue) {
             return res.status(404).json({ message: "Seed data not found" });
        }

        demoActive = true;
        let iteration = 0;
        
        // Target: Rapidly increase Main Hall density
        const targetZone = venue.zones.find(z => z.name === 'Concourse Main') || venue.zones[0];
        
        console.log("Starting Demo Simulation for", targetZone.name);

        demoInterval = setInterval(async () => {
             iteration++;
             
             // Base count starts at 100 and scales up rapidly
             const simulatedCount = 100 + Math.floor(Math.pow(iteration, 2.5) * 5); 
             
             await CrowdReading.create({
                 venueId,
                 zoneId: targetZone.zoneId,
                 count: simulatedCount,
                 densityLabel: 'UNKNOWN',
                 sensorSource: 'CCTV',
                 confidence: 0.95
             });

             // Force motion crush at iteration 10
             if (iteration === 10) {
                 await CrowdReading.create({
                     venueId,
                     zoneId: targetZone.zoneId,
                     count: 0,
                     densityLabel: 'CRUSH',
                     sensorSource: 'MOTION',
                     confidence: 0.99
                 });
             }

             // Trigger fusion which triggers alerts -> websockets
             await runFusionForZone(venueId, targetZone.zoneId);

             if (iteration >= 15) {
                  // Stop demo after ~30 seconds (2s interval)
                  clearInterval(demoInterval);
                  demoActive = false;
                  console.log("Demo Simulation Complete");
             }
        }, 2000);

        res.json({ success: true, message: 'Demo simulation started' });
    } catch (error) {
        demoActive = false;
        next(error);
    }
});

// @desc    Reset demo data
// @route   GET /api/demo/reset
// @access  Public
router.get('/reset', async (req, res, next) => {
    try {
        if (demoInterval) clearInterval(demoInterval);
        demoActive = false;

        res.json({ success: true, message: 'Demo reset' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
