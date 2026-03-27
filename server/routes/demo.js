const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { redisClient } = require('../config/redis');

// Models
const Venue = require('../models/Venue');
const CrowdReading = require('../models/CrowdReading');
const SensorLog = require('../models/SensorLog');
const Alert = require('../models/Alert');
const AlertSubscription = require('../models/AlertSubscription');

// Managers & Scripts
const wsManager = require('../services/wsManager');
const { seedVenues } = require('../scripts/seedVenues');
const elphinstoneScript = require('../data/elphinstoneScript');

// State for Simulation
let simStatus = {
    running: false,
    currentTick: 0,
    totalTicks: 30,
    startTime: null,
    estimatedEnd: null,
    intervalId: null
};

router.get('/venues', async (req, res) => {
    try {
        const venues = await Venue.find();
        res.json(venues);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/status', async (req, res) => {
    try {
        res.json({
            venuesSeeded: await Venue.countDocuments(),
            totalReadings: await CrowdReading.countDocuments(),
            totalSnapshots: await CrowdReading.countDocuments({ sensorSource: 'FUSION' }),
            totalAlerts: await Alert.countDocuments(),
            totalSubscribers: await AlertSubscription.countDocuments(),
            wsConnectedClients: wsManager.getStats().totalClients,
            redisConnected: redisClient && redisClient.isReady,
            mongoConnected: mongoose.connection.readyState === 1,
            fusionCronRunning: true, // Cron registered via index.js
            readyForDemo: (await Venue.countDocuments() > 0),
            issues: []
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/seed', async (req, res) => {
    try {
        const result = await seedVenues();
        res.json(result);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/reset', async (req, res) => {
    try {
        const oneMinuteAgo = new Date(Date.now() - 60000);
        
        const logsCleared = await SensorLog.deleteMany({ timestamp: { $lt: oneMinuteAgo } });
        const snapsCleared = await CrowdReading.deleteMany({ sensorSource: 'FUSION' });
        const alertsCleared = await Alert.deleteMany({});
        
        let redisKeysCleared = 0;
        if (redisClient) {
            const keys = await redisClient.keys('alert:cooldown:*');
            if (keys.length > 0) {
                await redisClient.del(keys);
                redisKeysCleared = keys.length;
            }
        }

        res.json({
            cleared: {
                readings: logsCleared.deletedCount,
                snapshots: snapsCleared.deletedCount,
                alerts: alertsCleared.deletedCount,
                redisKeys: redisKeysCleared
            }
        });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/simulate/elphinstone', async (req, res) => {
    try {
        if (simStatus.running) return res.status(400).json({ error: "Simulation already running" });

        const { speedMultiplier = 1 } = req.body;
        // Interval is base 30s divided by multiplier
        const intervalMs = 30000 / speedMultiplier;
        
        simStatus.running = true;
        simStatus.currentTick = 0;
        simStatus.totalTicks = elphinstoneScript.length;
        simStatus.startTime = Date.now();
        simStatus.estimatedEnd = Date.now() + (elphinstoneScript.length * intervalMs);

        res.json({
            simulationId: "sim_" + Date.now(),
            totalTicks: simStatus.totalTicks,
            estimatedDuration: (elphinstoneScript.length * intervalMs) / 1000,
            message: "Simulation started"
        });

        // Loop Runner
        simStatus.intervalId = setInterval(async () => {
             if (!simStatus.running) {
                 clearInterval(simStatus.intervalId);
                 return;
             }

             if (simStatus.currentTick >= simStatus.totalTicks) {
                 clearInterval(simStatus.intervalId);
                 simStatus.running = false;
                 // Final Broadcast
                 wsManager.broadcastToVenue('cst-mumbai', {
                     event: "SIMULATION_COMPLETE",
                     message: "Simulation complete",
                     prevented: true,
                     narrative: "CrowdSense prevented this. 22 lives saved."
                 });
                 return;
             }

             const tickData = elphinstoneScript[simStatus.currentTick];
             // 1. Insert fake FUSION sensor reading to support History API charts
             try {
                const doc = new CrowdReading({
                    venueId: tickData.venueId,
                    zoneId: tickData.zoneId,
                    count: Math.round(tickData.density * 800), // arbitrary max zone cap
                    densityLabel: tickData.crowdLevel,
                    sensorSource: 'FUSION',
                    confidence: 0.99,
                    riskScore: tickData.riskScore,
                    crowdLevel: tickData.crowdLevel,
                    triggeredBy: tickData.triggeredBy,
                    isAnomaly: tickData.isAnomaly,
                });
                await doc.save();
             } catch(err) { console.error("Sim Error inserting Fake Reading:", err); }

             // 2. Broadcast CROWD_UPDATE
             wsManager.broadcastToVenue(tickData.venueId, {
                 event: "CROWD_UPDATE",
                 venueId: tickData.venueId,
                 zoneId: tickData.zoneId,
                 density: tickData.density,
                 riskScore: tickData.riskScore,
                 crowdLevel: tickData.crowdLevel,
                 triggeredBy: tickData.triggeredBy,
                 isAnomaly: tickData.isAnomaly,
                 motionLabel: tickData.motionLabel,
                 sensorSources: ['SIMULATION'],
                 narrative: tickData.narrative,
                 timestamp: new Date().toISOString()
             });

             // 3. Broadcast Alert on tick 21
             if (tickData.alertFired) {
                 wsManager.broadcastToVenue(tickData.venueId, {
                     event: "SIMULATION_ALERT",
                     message: tickData.alertMessage,
                     riskScore: tickData.riskScore,
                     narrative: tickData.narrative,
                     timestamp: new Date().toISOString()
                 });
             }

             simStatus.currentTick++;

        }, intervalMs);

    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/simulate/elphinstone/status', (req, res) => {
    res.json({
        running: simStatus.running,
        currentTick: simStatus.currentTick,
        totalTicks: simStatus.totalTicks,
        percentComplete: simStatus.running ? Math.round((simStatus.currentTick / simStatus.totalTicks) * 100) : 0,
        estimatedEnd: simStatus.estimatedEnd ? new Date(simStatus.estimatedEnd).toISOString() : null
    });
});

router.post('/simulate/elphinstone/stop', (req, res) => {
    simStatus.running = false;
    if (simStatus.intervalId) clearInterval(simStatus.intervalId);
    res.json({ message: "Simulation stopped cleanly" });
});

module.exports = router;
