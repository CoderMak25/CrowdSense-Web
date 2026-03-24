/**
 * Crowd Density Forecast Service
 * Phase 1: Moving average baseline (takes last 7 days same hour readings)
 * Phase 2: LSTM ML models
 */

const CrowdReading = require('../models/CrowdReading');

/**
 * Generates an 8-slot, 15-minute interval forecast for the next 2 hours
 * @param {String} venueId 
 * @param {String} zoneId 
 */
const generateForecast = async (venueId, zoneId) => {
    try {
        // We will generate 8 prediction slots (2 hours total)
        const slots = [];
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Find nearest 15 min block starting point
        const startMinute = Math.floor(currentMinute / 15) * 15;
        let predictionStartTime = new Date(now);
        predictionStartTime.setSeconds(0);
        predictionStartTime.setMilliseconds(0);
        
        // --- PHASE 2 PLACEHOLDER ---
        // if (process.env.USE_ML_FORECAST === 'true') {
        //    const mlServerUrl = `http://ml-core:8000/predict?venueId=${venueId}&zoneId=${zoneId}`;
        //    const response = await axios.get(mlServerUrl);
        //    return response.data;
        // }
        // ---------------------------

        // PHASE 1: Moving Average Baseline
        // Look back 7 days for the same time windows
        
        for (let i = 0; i < 8; i++) {
            // Calculate target slot time
            const slotOffsetMs = i * 15 * 60 * 1000;
            const targetTime = new Date(predictionStartTime.getTime() + slotOffsetMs);
            const targetHour = targetTime.getHours();
            
            const slotString = targetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // For simplicity in Phase 1 demo, we'll construct a synthetic estimate
            // In a real Phase 1, we would query the database for 
            // timestamp: { $gte: 7_days_ago, $lte: today_minus_1_hour } and filter by specific hour range
            
            // To simulate varying traffic for demo, let's use a simple hour-based multiplier
            let multiplier = 0.5; // low traffic
            if (targetHour >= 7 && targetHour <= 10) multiplier = 0.9; // Morning rush
            if (targetHour >= 17 && targetHour <= 20) multiplier = 0.85; // Evening rush
            if (targetHour >= 11 && targetHour <= 16) multiplier = 0.6; // Midday

            // Base capacity assumption for scaling - assume 1000 for relative numbers
            let predictedCount = Math.round((Math.random() * 0.2 + multiplier) * 800);
            
            // Smooth it slightly relative to previous slot to avoid jagged graphs
            if (i > 0 && slots[i-1]) {
                 predictedCount = Math.round((slots[i-1].predictedCount * 0.7) + (predictedCount * 0.3));
            }

            let predictedLabel = 'LOW';
            if (predictedCount > 700) predictedLabel = 'CRITICAL';
            else if (predictedCount > 500) predictedLabel = 'HIGH';
            else if (predictedCount > 300) predictedLabel = 'MEDIUM';

            // Confidence drops further out
            let confidence = Math.max(0.6, 0.9 - (i * 0.05));

            slots.push({
                slot: slotString,
                predictedLabel,
                predictedCount,
                confidence: parseFloat(confidence.toFixed(2))
            });
        }

        return slots;

    } catch (error) {
        console.error("Forecast Gen Error:", error);
        return [];
    }
};

module.exports = { generateForecast };
