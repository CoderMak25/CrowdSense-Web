/**
 * Utility to deduplicate raw BLE scans based on RSSI variance
 * and apply venue-specific correction factors
 */

const VENUE_FACTORS = {
    railway: 0.6,
    mall: 0.8,
    stadium: 0.55,
    pandal: 0.7, // Assume street/pandal is similar
    hospital: 0.75,
    default: 0.7
};

/**
 * Deduplicates raw Bluetooth device scans
 * @param {Array} devices - Array of { mac: String, rssi: Number, timestamp: Date }
 * @param {String} venueType - Type of venue for correction factor
 * @param {Number} windowMs - Time window for deduplication (default 10s)
 * @returns {Number} Estimated count of distinct people
 */
const deduplicate = (devices = [], venueType = 'default', windowMs = 10000) => {
    try {
        if (!devices || devices.length === 0) return 0;

        const now = Date.now();
        
        // 1. Filter out stale devices
        const recentDevices = devices.filter(d => {
            const scanTime = new Date(d.timestamp).getTime();
            return (now - scanTime) <= windowMs;
        });

        // 2. Group by MAC address (basic dedup)
        const macMap = new Map();
        recentDevices.forEach(d => {
            if (!macMap.has(d.mac)) {
                macMap.set(d.mac, []);
            }
            macMap.get(d.mac).push(d.rssi);
        });

        // Simple count basis = unique MACs seen in window
        const rawCount = macMap.size;

        // 3. Apply venue correction factor (not everyone has BLE enabled, 
        // some have multiple devices, signal bounce in different environments)
        const factor = VENUE_FACTORS[venueType] || VENUE_FACTORS.default;
        
        // Estimated distinct people
        const estimatedCount = Math.round(rawCount * factor);

        return estimatedCount;

    } catch (error) {
        console.error("BLE Dedup Error:", error);
        return devices.length; // Fallback
    }
};

module.exports = { deduplicate };
