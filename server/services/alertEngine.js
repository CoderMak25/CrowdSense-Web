/**
 * Alert Engine Service
 * Evaluates zone thresholds and risk scores to trigger relevant alerts 
 * and broadcast them via WebSockets & SMS/WhatsApp
 */

const Alert = require('../models/Alert');
const Venue = require('../models/Venue');
const { sendWhatsApp, sendSMS } = require('./twilioService');
const { redisPubSub } = require('../config/redis');
const { ALERT_LEVELS, REDIS_KEYS } = require('../config/constants');

// Memory cache for alert cooldowns: Map<"venueId:zoneId", timestamp>
const cooldowns = new Map();
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Checks if a zone has exceeded its defined thresholds and triggers an alert if so
 * @param {String} venueId 
 * @param {Object} venueName
 * @param {Object} zone 
 * @param {Object} fusionReading
 * @param {Object} riskData
 */
const checkThresholdsAndAlert = async (venueId, venueName, zone, fusionReading, riskData) => {
    try {
        const cooldownKey = `${venueId}:${zone.zoneId}`;
        const lastAlertTime = cooldowns.get(cooldownKey) || 0;
        
        // Immediate CRITICAL override for CRUSH motion
        const isCrush = fusionReading.sensorBreakdown && fusionReading.sensorBreakdown.motion === 'CRUSH';
        
        // Don't alert if on cooldown unless CRUSH detected
        if (Date.now() - lastAlertTime < COOLDOWN_MS && !isCrush) {
            return;
        }

        let alertLevel = null;
        let message = '';
        
        // Determine level
        if (isCrush) {
             alertLevel = ALERT_LEVELS.CRITICAL;
             message = `Immediate CRUSH hazard detected in ${zone.name}.`;
        } else if (fusionReading.count >= zone.thresholds.critical) {
             alertLevel = ALERT_LEVELS.CRITICAL;
             message = `Critical overcrowding in ${zone.name} (${fusionReading.count} pax / ${zone.capacity} cap).`;
        } else if (fusionReading.count >= zone.thresholds.high) {
             alertLevel = ALERT_LEVELS.HIGH;
             message = `High density warning in ${zone.name}.`;
        } else if (fusionReading.count >= zone.thresholds.medium) {
             // We may not want to trigger actual system alerts for MEDIUM, just UI updates
             // But for completeness we return it so the WebSocket can push it if needed
             // We won't trigger SMS/WhatsApp for MEDIUM usually
        }

        if (alertLevel) {
            
            // 1. Save to DB
            const activeSensors = Object.keys(fusionReading.sensorBreakdown).filter(k => k !== 'motion' && fusionReading.sensorBreakdown[k] > 0);
            if (fusionReading.sensorBreakdown.motion) activeSensors.push('MOTION');

            const alert = new Alert({
                venueId,
                zoneId: zone.zoneId,
                venueName,
                zoneName: zone.name,
                level: alertLevel,
                riskScore: riskData.score,
                triggeringSensors: activeSensors,
                message,
                timestamp: new Date()
            });

            // 2. Notifications if HIGH or CRITICAL
            if (alertLevel === ALERT_LEVELS.HIGH || alertLevel === ALERT_LEVELS.CRITICAL) {
                 // Format WhatsApp payload
                 const msgPayload = `⚠️ CrowdSense Alert\nVenue: ${venueName}\nZone: ${zone.name}\nLevel: ${alertLevel}\nRisk Score: ${riskData.score}/100\nTime: ${new Date().toLocaleTimeString()}`;
                 
                 // In a real app we'd fetch subscribed operators for this venue
                 // Using hardcoded env var numbers for demo
                 const demoWhatsappStatus = await sendWhatsApp(process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886', msgPayload);
                 const demoSmsStatus = await sendSMS(process.env.TWILIO_SMS_NUMBER || '+1234567890', `CrowdSense Alert: ${alertLevel} in ${zone.name}`);
                 
                 alert.whatsappSent = demoWhatsappStatus;
                 alert.smsSent = demoSmsStatus;
            }

            await alert.save();
            
            // 3. Mark cooldown
            cooldowns.set(cooldownKey, Date.now());

            // 4. Redis PubSub broadcast to inform WebSockets
            const payload = {
                type: 'ALERT',
                alert: alert.toObject()
            };
            
            redisPubSub.publish(REDIS_KEYS.LIVE_ROOM(venueId), JSON.stringify(payload));
        }

    } catch (error) {
        console.error("Alert Engine Error:", error);
    }
};

module.exports = { checkThresholdsAndAlert };
