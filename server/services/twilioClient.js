const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
const smsFrom = process.env.TWILIO_SMS_NUMBER || '+14155238886';

let client = null;
if (accountSid && authToken && !authToken.includes('placeholder')) {
    client = twilio(accountSid, authToken);
}

const isDemo = !client;

/**
 * Send WhatsApp via Twilio (Integrated with Templates as requested)
 */
const sendWhatsApp = async (to, message) => {
    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    try {
        if (isDemo) {
            console.log(`[DEMO MODE] WhatsApp to ${to}: ${message}`);
            return { sid: 'demo_wa_sid', status: 'demo' };
        }

        // USING CONTENT_SID TEMPLATE AS PER USER SNIPPET
        // NOTE: If you want to use the freeform alert we built, 
        // Comment this out and use the .messages.create({body: ...}) line instead.
        const msg = await client.messages.create({
            from: whatsappFrom,
            contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
            contentVariables: JSON.stringify({ "1": "12/1", "2": "3pm" }),
            to: formattedTo
        });

        /* 
        Original freeform alert (works if user joined sandbox session)
        const msg = await client.messages.create({
            body: message,
            from: whatsappFrom,
            to: formattedTo
        });
        */

        return { sid: msg.sid, status: msg.status };
    } catch (error) {
        console.error(`Twilio WhatsApp Error for ${to}:`, error.message);
        return { error: error.message };
    }
};

/**
 * Send SMS via Twilio
 */
const sendSMS = async (to, message) => {
    try {
        if (isDemo) {
            console.log(`[DEMO MODE] SMS to ${to}: ${message}`);
            return { sid: 'demo_sms_sid', status: 'demo' };
        }
        const msg = await client.messages.create({
            body: message,
            from: smsFrom,
            to: to
        });
        return { sid: msg.sid, status: msg.status };
    } catch (error) {
        console.error(`Twilio SMS Error for ${to}:`, error.message);
        return { error: error.message };
    }
};

/**
 * Format alert messages
 */
const formatAlertMessage = (venueId, zoneId, riskScore, crowdLevel, triggeredBy, isWhatsapp = true) => {
    const time = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
    
    if (isWhatsapp) {
        const levelEmoji = crowdLevel === 'CRITICAL' ? '🔴' : '🟡';
        return `🚨 *CROWDSENSE ALERT*
Venue: ${venueId}
Zone: ${zoneId || 'All'}
Risk Score: ${Math.round(riskScore)}/100
Level: ${levelEmoji} ${crowdLevel}
Triggered by: ${triggeredBy.join(', ')}
Time: ${time} IST`;
    } else {
        return `CROWDSENSE ALERT: ${venueId} ${zoneId || ''} Risk:${Math.round(riskScore)} ${crowdLevel}. ${triggeredBy.join(',')}. ${time} IST`.substring(0, 160);
    }
};

module.exports = {
    sendWhatsApp,
    sendSMS,
    formatAlertMessage,
    isDemo
};
