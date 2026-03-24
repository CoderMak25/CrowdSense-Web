/**
 * Utility to parse incoming SMS reports from commuters
 * Format expected: "STATION_CODE REPORT_CODE" (e.g., "CSMT CROWD")
 */

const REPORT_TYPES = ['CROWD', 'SAFE', 'WATER', 'HELP'];

// Common typos mappings
const TYPO_MAP = {
    'CRWD': 'CROWD',
    'CROWED': 'CROWD',
    'SAFF': 'SAFE',
    'SAF': 'SAFE',
    'H2O': 'WATER',
    'HLP': 'HELP',
    'SOS': 'HELP'
};

/**
 * Parses raw SMS body into structured report
 * @param {String} body - Raw SMS text
 * @returns {Object|null} Parsed data or null if invalid
 */
const parse = (body) => {
    try {
        if (!body) return null;

        // Clean up text
        const cleanBody = body.trim().toUpperCase().replace(/\s+/g, ' ');
        const parts = cleanBody.split(' ');

        if (parts.length < 2) return null; // Needs at least station + report

        const rawCode = parts[0];
        let rawReport = parts[1];

        // 1. Map typos for report type
        if (TYPO_MAP[rawReport]) {
            rawReport = TYPO_MAP[rawReport];
        }

        // 2. Validate report type
        if (!REPORT_TYPES.includes(rawReport)) {
            return null;
        }

        // Default confidence based on manual entry nature
        let confidence = 0.55; 

        // Could add logic to verify STATION_CODE against DB here 
        // but for now return parsed structure

        return {
            stationCode: rawCode,
            reportType: rawReport,
            confidence: confidence,
            // If they added extra text, capture it
            extraInfo: parts.slice(2).join(' ') || null 
        };

    } catch (error) {
        console.error("SMS Parse Error:", error);
        return null;
    }
};

module.exports = { parse };
