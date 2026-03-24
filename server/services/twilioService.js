/**
 * Twilio Service Wrapper
 * Handles sending WhatsApp alerts, SMS alerts, and programmatic SMS replies
 */

// If env vars are missing, we use a mock client to prevent crash in dev/demo
let client = null;

try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } else {
    console.warn("TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN missing. Using mock Twilio client.");
  }
} catch (e) {
  console.error("Failure loading twilio client", e);
}


/**
 * Send WhatsApp message via Twilio Sandbox
 * @param {String} to - Receiver phone number (e.g., whatsapp:+14155238886)
 * @param {String} message - Text body
 * @returns {Boolean} success status
 */
const sendWhatsApp = async (to, message) => {
    try {
        if (!client) {
            console.log(`[Mock Twilio WA] To: ${to} | Msg: ${message}`);
            return true;
        }

        const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
        const from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'; // default sandbox number

        await client.messages.create({
            body: message,
            from: from,
            to: formattedTo
        });

        return true;
    } catch (error) {
        console.error("WhatsApp Send Error:", error.message);
        return false; // Never crash main flow on Twilio failure
    }
};

/**
 * Send standard SMS via Twilio
 * @param {String} to - Receiver phone number (e.g., +1234567890)
 * @param {String} message - Text body
 * @returns {Boolean} success status
 */
const sendSMS = async (to, message) => {
    try {
        if (!client) {
            console.log(`[Mock Twilio SMS] To: ${to} | Msg: ${message}`);
            return true;
        }

        const from = process.env.TWILIO_SMS_FROM || '+14155238886';

        await client.messages.create({
            body: message,
            from: from,
            to: to
        });

        return true;
    } catch (error) {
        console.error("SMS Send Error:", error.message);
        return false;
    }
};

/**
 * Sends automated reply to commuter reports
 * @param {String} to - Commuter phone number
 * @param {String} message - Text body
 */
const sendSMSReply = async (to, message) => {
    // Can just reuse the sendSMS logic
    return sendSMS(to, message);
};

module.exports = {
    sendWhatsApp,
    sendSMS,
    sendSMSReply
};
