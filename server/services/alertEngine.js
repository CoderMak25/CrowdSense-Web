const Alert = require('../models/Alert');
const AlertSubscription = require('../models/AlertSubscription');
const { redisClient } = require('../config/redis');
const { sendWhatsApp, sendSMS, formatAlertMessage } = require('./twilioClient');

class AlertEngine {
    /**
     * Determine if an alert should fire based on risk and cooldown
     */
    static async shouldAlert(venueId, zoneId, riskScore, motionLabel) {
        let severity = null;
        let reason = "";

        if (motionLabel === 'CRUSH') {
            severity = "CRITICAL";
            reason = "CRUSH_MOTION_DETECTED";
        } else if (riskScore >= 75) {
            severity = "CRITICAL";
            reason = "RISK_SCORE_CRITICAL";
        } else if (riskScore >= 50) {
            severity = "WARNING";
            reason = "RISK_SCORE_HIGH";
        }

        if (!severity) return { shouldFire: false };

        // Check cooldown in Redis
        const cooldownKey = `alert:cooldown:${venueId}:${zoneId}:${severity}`;
        const existing = await redisClient.get(cooldownKey);
        
        if (existing) {
            console.log(`[AlertEngine] Cooldown active for ${venueId}:${zoneId}:${severity}`);
            return { shouldFire: false };
        }

        return { shouldFire: true, severity, reason };
    }

    /**
     * Dispatch alerts to all subscribers
     */
    static async fireAlert(venueId, zoneId, riskScore, crowdLevel, triggeredBy, severity) {
        try {
            // 1. Fetch Subscribers
            const subscribers = await AlertSubscription.find({ 
                venueId, 
                severityFilter: { $in: severity === "CRITICAL" ? ["WARNING", "CRITICAL"] : ["WARNING"] } 
            });

            if (!subscribers || subscribers.length === 0) {
                console.log(`[AlertEngine] No subscribers for ${venueId}`);
                return { whatsappSentCount: 0, smsSentCount: 0 };
            }

            const waMsg = formatAlertMessage(venueId, zoneId, riskScore, crowdLevel, triggeredBy, true);
            const smsMsg = formatAlertMessage(venueId, zoneId, riskScore, crowdLevel, triggeredBy, false);

            let waCount = 0;
            let smsCount = 0;
            const recipientPhones = [];

            // 2. Dispatch
            const sendPromises = subscribers.map(async (sub) => {
                recipientPhones.push(sub.phone);
                if (sub.viaWhatsapp) {
                    const res = await sendWhatsApp(sub.phone, waMsg);
                    if (!res.error) waCount++;
                }
                if (sub.viaSms) {
                    const res = await sendSMS(sub.phone, smsMsg);
                    if (!res.error) smsCount++;
                }
            });

            await Promise.all(sendPromises);

            // 3. Log Alert to DB
            const alert = new Alert({
                venueId,
                zoneId,
                severity,
                riskScore,
                crowdLevel,
                triggeredBy,
                message: waMsg,
                whatsappSent: waCount > 0,
                smsSent: smsCount > 0,
                recipients: recipientPhones,
                status: "ACTIVE"
            });
            await alert.save();

            // 4. Set Cooldown in Redis
            const cooldownKey = `alert:cooldown:${venueId}:${zoneId}:${severity}`;
            await redisClient.set(cooldownKey, "1", "EX", 300); // 5 min cooldown

            return { 
                alertId: alert._id, 
                whatsappSentCount: waCount, 
                smsSentCount: smsCount 
            };

        } catch (error) {
            console.error("AlertEngine Firing Error:", error);
            return { error: error.message };
        }
    }
}

module.exports = AlertEngine;
