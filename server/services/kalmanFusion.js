/**
 * Kalman-inspired Sensor Fusion Service
 * Fuses data from multiple diverse sensors into a single confidence-weighted density estimate
 */

const CrowdReading = require('../models/CrowdReading');
const SensorLog = require('../models/SensorLog');
const { SENSOR_WEIGHTS, DENSITY_THRESHOLDS } = require('../config/constants');
const { redisClient } = require('../config/redis');

/**
 * Executes a fusion cycle for a specific zone in a venue
 * @param {String} venueId 
 * @param {String} zoneId 
 */
const runFusionForZone = async (venueId, zoneId) => {
    try {
        // 1. Get raw sensor readings from the last 60 seconds for this zone
        const sixtySecondsAgo = new Date(Date.now() - 60000);
        
        // This assumes SensorLog stores raw readings with zoneId 
        // We'll query CrowdReading table for the latest individual sensor estimates instead
        // because the individual ingests transform raw -> estimated count
        
        const recentReadings = await CrowdReading.find({
            venueId,
            zoneId,
            timestamp: { $gte: sixtySecondsAgo },
            sensorSource: { $ne: 'FUSION' } // Exclude previous fusion results
        }).sort({ timestamp: -1 });

        if (!recentReadings || recentReadings.length === 0) {
            return null; // No new data to fuse
        }

        // 2. Group by sensor source, taking only the LATEST reading per source
        const latestBySource = new Map();
        for (const reading of recentReadings) {
            if (!latestBySource.has(reading.sensorSource)) {
                latestBySource.set(reading.sensorSource, reading);
            }
        }

        // 3. Apply Kalman-inspired weighted average fusion
        // Formula: fused = Σ(estimate × weight × confidence) / Σ(weight × confidence)
        
        let weightedSum = 0;
        let weightConfidenceSum = 0;
        const breakdown = {};
        
        let hasCrushMotion = false;

        for (const [source, reading] of latestBySource.entries()) {
            // Motion sensors provide labels, not counts. Handled differently.
            if (source === 'MOTION') {
                breakdown.motion = reading.densityLabel; // e.g. 'FREE', 'CRUSH'
                if (reading.densityLabel === 'CRUSH') hasCrushMotion = true;
                continue; 
            }

            const baseWeight = SENSOR_WEIGHTS[source] || 0.5;
            const confidence = reading.confidence || 0.5;
            const effectiveWeight = baseWeight * confidence;

            weightedSum += (reading.count * effectiveWeight);
            weightConfidenceSum += effectiveWeight;
            
            // Store for breakdown
            breakdown[source.toLowerCase()] = reading.count;
        }

        // 4. Calculate fused count
        let fusedCount = 0;
        if (weightConfidenceSum > 0) {
            fusedCount = Math.round(weightedSum / weightConfidenceSum);
        }

        // 5. Determine density label based on thresholds
        // Note: Real app would fetch specific zone capacity/thresholds from Venue model.
        // For simplicity, using absolute numbers based on constants for this demo.
        let densityLabel = 'LOW';
        if (hasCrushMotion) {
            densityLabel = 'CRITICAL';
        } else if (fusedCount >= DENSITY_THRESHOLDS.CRITICAL) {
            densityLabel = 'CRITICAL';
        } else if (fusedCount >= DENSITY_THRESHOLDS.HIGH) {
            densityLabel = 'HIGH';
        } else if (fusedCount >= DENSITY_THRESHOLDS.MEDIUM) {
            densityLabel = 'MEDIUM';
        }

        // Calculate a blended confidence for the fusion
        const fusionConfidence = weightConfidenceSum > 0 ? 
            Math.min((weightConfidenceSum / latestBySource.size), 1.0) : 0.5;

        // 6. Save FUSION reading
        const fusionReading = new CrowdReading({
            venueId,
            zoneId,
            count: fusedCount,
            densityLabel,
            sensorSource: 'FUSION',
            confidence: parseFloat(fusionConfidence.toFixed(2)),
            sensorBreakdown: breakdown
        });

        await fusionReading.save();
        
        return fusionReading;

    } catch (error) {
        console.error(`Fusion Error for Venue ${venueId}, Zone ${zoneId}:`, error);
        return null;
    }
};

module.exports = { runFusionForZone };
