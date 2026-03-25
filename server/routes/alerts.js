const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const AlertSubscription = require('../models/AlertSubscription');
const AlertEngine = require('../services/alertEngine');
const { sendWhatsApp, sendSMS, formatAlertMessage } = require('../services/twilioClient');

// POST /api/v1/alerts/subscribe
router.post('/subscribe', async (req, res) => {
    try {
        const { venueId, phone, name, viaWhatsapp, viaSms, severityFilter } = req.body;
        const sub = await AlertSubscription.findOneAndUpdate(
            { venueId, phone },
            { name, viaWhatsapp, viaSms, severityFilter, createdAt: new Date() },
            { upsert: true, new: true }
        );
        res.status(200).json({ subscriptionId: sub._id, message: "Subscribed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/v1/alerts/:venueId
router.get('/:venueId', async (req, res) => {
    try {
        const alerts = await Alert.find({ venueId: req.params.venueId })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/v1/alerts/:venueId/subscribers
router.get('/:venueId/subscribers', async (req, res) => {
    try {
        const subs = await AlertSubscription.find({ venueId: req.params.venueId });
        res.json(subs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/v1/alerts/unsubscribe/:phone
router.delete('/unsubscribe/:phone', async (req, res) => {
    try {
        await AlertSubscription.deleteMany({ phone: req.params.phone });
        res.json({ message: "Unsubscribed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/v1/alerts/:venueId/test
router.post('/:venueId/test', async (req, res) => {
    try {
        const { phone, severity } = req.body;
        const venueId = req.params.venueId;
        
        const riskScore = severity === "CRITICAL" ? 87 : 56;
        const crowdLevel = severity;
        const triggeredBy = ["MANUAL_TEST"];

        const waMsg = formatAlertMessage(venueId, "TEST-ZONE", riskScore, crowdLevel, triggeredBy, true);
        const smsMsg = formatAlertMessage(venueId, "TEST-ZONE", riskScore, crowdLevel, triggeredBy, false);

        const waSent = await sendWhatsApp(phone, waMsg);
        const smsSent = await sendSMS(phone, smsMsg);

        res.json({ 
            whatsappSid: waSent.sid, 
            smsSid: smsSent.sid, 
            message: "Test alert sent" 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Twilio SMS Webhook
 */
router.post('/webhook/sms', express.urlencoded({ extended: true }), async (req, res) => {
    try {
        const { From, Body } = req.body;
        console.log(`[SMS Webhook] From: ${From}, Body: ${Body}`);

        // Very basic parsing for demo: "CST CRUSH", "DADAR HIGH"
        const parts = Body.split(' ');
        const stationCode = parts[0]?.toUpperCase();
        const report = parts[1]?.toUpperCase();

        // TwiML response
        const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>Thanks! Your report for ${stationCode} helps keep Mumbai safe.</Message></Response>`;
        
        res.type('text/xml').send(twiml);
    } catch (error) {
        console.error("SMS Webhook error:", error);
        res.status(500).send('<Response><Message>Error processing report.</Message></Response>');
    }
});

module.exports = router;
