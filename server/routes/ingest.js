const express = require('express');
const router = express.Router();
const CrowdReading = require('../models/CrowdReading');
const SensorLog = require('../models/SensorLog');
const { runFusionForZone } = require('../services/kalmanFusion');
const { snapToGrid } = require('../utils/gpsSnap');
const { deduplicate } = require('../utils/bleDedup');
const { parse } = require('../utils/smsParser');
const { ingestLimiter, smsLimiter } = require('../middleware/rateLimit');

// All ingests except SMS require API Keys in real world. 
// Skipping strict auth here to allow easy hardware integration for demo

// @desc    Ingest CCTV head count
// @route   POST /api/ingest/cctv
router.post('/cctv', ingestLimiter, async (req, res, next) => {
    try {
        const { venueId, zoneId, count, frameId, confidence } = req.body;

        await SensorLog.create({
            venueId,
            sensorType: 'CCTV',
            rawValue: { frameId, count },
            processedValue: count,
            confidence: confidence || 0.90
        });

        await CrowdReading.create({
            venueId,
            zoneId,
            count: count,
            densityLabel: 'UNKNOWN', // Fusion handles this
            sensorSource: 'CCTV',
            confidence: confidence || 0.90
        });

        res.status(201).json({ success: true });

        // Trigger fusion async
        runFusionForZone(venueId, zoneId);

    } catch (error) {
        next(error);
    }
});

// @desc    Ingest BLE scan data
// @route   POST /api/ingest/ble
router.post('/ble', ingestLimiter, async (req, res, next) => {
    try {
        const { venueId, zoneId, devices, confidence } = req.body;

        const estimatedCount = deduplicate(devices, 'default');

        await SensorLog.create({
            venueId,
            sensorType: 'BLE',
            rawValue: devices,
            processedValue: estimatedCount,
            confidence: confidence || 0.65
        });

        await CrowdReading.create({
            venueId,
            zoneId,
            count: estimatedCount,
            densityLabel: 'UNKNOWN',
            sensorSource: 'BLE',
            confidence: confidence || 0.65
        });

        res.status(201).json({ success: true, estimatedCount });
        runFusionForZone(venueId, zoneId);
    } catch (error) {
        next(error);
    }
});

// @desc    Ingest Motion Classification
// @route   POST /api/ingest/motion
router.post('/motion', ingestLimiter, async (req, res, next) => {
    try {
        const { venueId, zoneId, label, confidence } = req.body;

        await SensorLog.create({
            venueId,
            sensorType: 'MOTION',
            rawValue: label,
            processedValue: 0,
            confidence: confidence || 0.80
        });

        await CrowdReading.create({
            venueId,
            zoneId,
            count: 0, // Motion doesn't give counts
            densityLabel: label, // e.g., CRUSH, FREE
            sensorSource: 'MOTION',
            confidence: confidence || 0.80
        });

        res.status(201).json({ success: true });
        runFusionForZone(venueId, zoneId);
    } catch (error) {
        next(error);
    }
});

// @desc    Ingest Twilio SMS Webhook
// @route   POST /api/ingest/sms
router.post('/sms', express.urlencoded({ extended: true }), smsLimiter, async (req, res, next) => {
    try {
        const body = req.body.Body;
        const from = req.body.From;

        const parsed = parse(body);

        if (!parsed) {
            const twiml = new require('twilio').twiml.MessagingResponse();
            twiml.message('Format not recognized. Please reply with: "STATION_CODE CROWD|SAFE|WATER|HELP".');
            return res.type('text/xml').send(twiml.toString());
        }

        // For demo, assuming CSMT = zone1, CROWD = 100 people etc.
        // Needs a real DB lookup map in production
        let estimatedCount = parsed.reportType === 'CROWD' ? 100 : 20;

        await SensorLog.create({
            venueId: parsed.stationCode,
            sensorType: 'SMS',
            rawValue: body,
            processedValue: estimatedCount,
            confidence: parsed.confidence
        });

        await CrowdReading.create({
            venueId: parsed.stationCode,
            zoneId: 'zone1', // simplified for demo
            count: estimatedCount,
            densityLabel: 'UNKNOWN',
            sensorSource: 'SMS',
            confidence: parsed.confidence
        });

        runFusionForZone(parsed.stationCode, 'zone1');

        const twiml = new require('twilio').twiml.MessagingResponse();
        twiml.message('Thank you for your report. Information has been securely logged.');
        res.type('text/xml').send(twiml.toString());

    } catch (error) {
        console.error('SMS Webhook Error', error);
        res.status(500).end();
    }
});

module.exports = router;
