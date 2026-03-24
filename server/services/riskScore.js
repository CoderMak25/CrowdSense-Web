/**
 * Risk Scoring Service
 * Calculates an overall venue risk score (0-100) based on zone data and anomalies
 */

const CrowdReading = require('../models/CrowdReading');
const { SENSOR_WEIGHTS } = require('../config/constants');
const { detectAnomaly } = require('./anomalyDetector');

/**
 * Calculates risk score for a venue based on current zone fusion data
 * @param {String} venueId 
 * @param {Array} currentZoneReadings - Array of recent FUSION readings per zone
 */
const calculateRiskScore = async (venueId, currentZoneReadings) => {
    try {
        if (!currentZoneReadings || currentZoneReadings.length === 0) {
            return { score: 0, factors: [] };
        }

        let baseScore = 0;
        let totalZones = currentZoneReadings.length;
        let crushBonus = 0;
        const factors = [];

        // 1. Calculate Base Density Score
        let totalDensityValue = 0;
        
        for (const reading of currentZoneReadings) {
            // Normalize count to a 0-100 scale (Assuming 150 is max capacity for calculation)
            // In a real app, use the actual zone.capacity
            let zoneDensity = Math.min((reading.count / 150) * 100, 100); 
            totalDensityValue += zoneDensity;

            if (reading.sensorBreakdown && reading.sensorBreakdown.motion === 'CRUSH') {
                crushBonus = 30;
                factors.push('CRUSH motion detected in ' + reading.zoneId);
            }
        }
        
        baseScore = totalDensityValue / totalZones;

        // 2. Calculate Surge Rate (Current vs 5 mins ago)
        let surgeBonus = 0;
        const fiveMinsAgo = new Date(Date.now() - 5 * 60000);
        
        // Aggregate count 5 mins ago
        let pastTotalCount = 0;
        let currentTotalCount = currentZoneReadings.reduce((sum, r) => sum + r.count, 0);

        for (const reading of currentZoneReadings) {
            const pastReading = await CrowdReading.findOne({
                venueId,
                zoneId: reading.zoneId,
                sensorSource: 'FUSION',
                timestamp: { $lte: fiveMinsAgo }
            }).sort({ timestamp: -1 });

            if (pastReading) {
                 pastTotalCount += pastReading.count;
            } else {
                 // If no reading 5 mins ago, assume current is baseline
                 pastTotalCount += reading.count;
            }
        }

        if (pastTotalCount > 0) {
            const surgeRate = (currentTotalCount - pastTotalCount) / pastTotalCount;
            if (surgeRate > 0) {
                // E.g. 50% surge -> 0.5 * 20 = +10 score
                surgeBonus = Math.min(surgeRate * 20, 20); 
                if (surgeBonus > 5) factors.push(`Rapid crowd surge (${(surgeRate*100).toFixed(0)}%)`);
            }
        }

        // 3. Anomaly Bonus
        let anomalyBonus = 0;
        const anomaly = await detectAnomaly(venueId, currentTotalCount);
        if (anomaly && anomaly.isAnomaly) {
            anomalyBonus = 20;
            factors.push(`Statistical anomaly detected (z=${anomaly.zScore.toFixed(2)})`);
        }

        // 4. Final Calculation
        let finalScore = baseScore + surgeBonus + crushBonus + anomalyBonus;
        
        // Clamp to 0-100
        finalScore = Math.max(0, Math.min(Math.round(finalScore), 100));

        return {
            score: finalScore,
            factors
        };

    } catch (error) {
        console.error("Risk Score Calc Error:", error);
        return { score: 0, factors: [] };
    }
};

module.exports = { calculateRiskScore };
