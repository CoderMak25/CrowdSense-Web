/**
 * Simple Statistical Anomaly Detector
 * Uses Z-Score to identify unexpected deviations from recent trends
 */

const CrowdReading = require('../models/CrowdReading');

/**
 * Detects if the current total count for a venue is anomalous
 * @param {String} venueId 
 * @param {Number} currentTotalCount 
 */
const detectAnomaly = async (venueId, currentTotalCount) => {
    try {
        // Fetch last 100 FUSION readings for this venue
        // Note: For venue-wide anomaly, we should really look at aggregated venue counts over time.
        // For this demo, we'll approximate using recent zone readings.
        
        const recentReadings = await CrowdReading.find({
            venueId,
            sensorSource: 'FUSION'
        })
        .sort({ timestamp: -1 })
        .limit(100);

        if (recentReadings.length < 10) {
            return { isAnomaly: false, zScore: 0 }; // Not enough data
        }

        // Extract counts
        const counts = recentReadings.map(r => r.count);

        // Calculate mean
        const sum = counts.reduce((acc, val) => acc + val, 0);
        const mean = sum / counts.length;

        // Calculate standard deviation
        const squaredDiffs = counts.map(val => Math.pow(val - mean, 2));
        const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / counts.length;
        const stdDev = Math.sqrt(variance);

        if (stdDev === 0) return { isAnomaly: false, zScore: 0 };

        // Calculate z-score for current count
        const zScore = (currentTotalCount - mean) / stdDev;

        // If z > 3, it's considered an anomaly (over 3 standard deviations from mean)
        const isAnomaly = zScore > 3;

        return {
            isAnomaly,
            zScore,
            severity: isAnomaly ? (zScore > 5 ? 'CRITICAL' : 'WARNING') : 'NORMAL'
        };

    } catch (error) {
        console.error("Anomaly Detection Error:", error);
        return { isAnomaly: false, zScore: 0 };
    }
};

module.exports = { detectAnomaly };
