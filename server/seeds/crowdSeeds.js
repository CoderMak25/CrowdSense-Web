const mongoose = require('mongoose');
const CrowdReading = require('../models/CrowdReading');
const Venue = require('../models/Venue');

// Function generates a gaussian random number (approximate)
const gaussianRandom = (mean, stdDev) => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); 
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) num = gaussianRandom(mean, stdDev); 
    num *= stdDev; // Stretch to fill range
    num += mean; // offset to mean
    return Math.max(0, Math.round(num));
};

const getTrafficMultiplier = (hour) => {
    // Simulate Mumbai rush hours
    if (hour >= 7 && hour <= 10) return 0.9; // Morning rush
    if (hour >= 17 && hour <= 20) return 0.85; // Evening rush
    if (hour >= 0 && hour <= 5) return 0.05; // Night
    return 0.5; // Day normal
};

const seedCrowdData = async () => {
    try {
        await CrowdReading.deleteMany();
        
        const venues = await Venue.find();
        if (venues.length === 0) {
            console.error("Run venueSeeds first");
            return;
        }

        const readings = [];
        const now = new Date();
        
        // Generate historical data for last 7 days, 1 reading per 30 minutes per zone
        for (let daysAgo = 7; daysAgo >= 0; daysAgo--) {
            for (let hour = 0; hour < 24; hour++) {
                for (let min = 0; min < 60; min += 30) {
                    const timestamp = new Date(now);
                    timestamp.setDate(timestamp.getDate() - daysAgo);
                    timestamp.setHours(hour, min, 0, 0);

                    // Skip Future times on day 0
                    if (daysAgo === 0 && timestamp > now) continue;

                    const trafficMod = getTrafficMultiplier(hour);

                    for (const venue of venues) {
                        for (const zone of venue.zones) {
                            
                            // Base capacity drives the random generation
                            const meanCount = Math.round(zone.capacity * trafficMod);
                            // Vary standard deviation based on traffic (more variance during rush hours)
                            let currentCount = gaussianRandom(meanCount, zone.capacity * (trafficMod > 0.5 ? 0.3 : 0.1));
                            
                            // Add some random noise/spikes (5% chance)
                            if (Math.random() < 0.05 && trafficMod > 0.5) {
                                currentCount = Math.round(currentCount * 1.5);
                            }

                            // Clamp
                            currentCount = Math.min(currentCount, zone.capacity + Math.floor(zone.capacity * 0.2));

                            let densityLabel = 'LOW';
                            if (currentCount >= zone.thresholds.critical) densityLabel = 'CRITICAL';
                            else if (currentCount >= zone.thresholds.high) densityLabel = 'HIGH';
                            else if (currentCount >= zone.thresholds.medium) densityLabel = 'MEDIUM';

                            // Generate dummy sensor breakdown
                            const breakdown = { cctv: Math.round(currentCount * 1.05) };
                            if (venue.sensors.ble) breakdown.ble = Math.round(currentCount * 0.8);

                            readings.push({
                                venueId: venue.venueId,
                                zoneId: zone.zoneId,
                                count: currentCount,
                                densityLabel,
                                densityValue: (currentCount / zone.capacity) * 100,
                                sensorSource: 'FUSION',
                                confidence: 0.85 + (Math.random() * 0.1),
                                sensorBreakdown: breakdown,
                                timestamp
                            });
                        }
                    }
                }
            }
        }

        // Batch insert
        const batchSize = 1000;
        for (let i = 0; i < readings.length; i += batchSize) {
             const batch = readings.slice(i, i + batchSize);
             await CrowdReading.insertMany(batch);
        }

        console.log(`Seeded ${readings.length} historical crowd readings`);

    } catch (error) {
        console.error("Seed error", error);
    }
};

module.exports = { seedCrowdData };
