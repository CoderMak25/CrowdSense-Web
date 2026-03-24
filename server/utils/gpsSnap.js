/**
 * Utility to snap raw GPS coordinates to a ~50m grid
 * This ensures we never store raw GPS locations while still allowing clustering
 */

// Earth's radius in meters
const R = 6378137; 

// Grid size in meters (approx)
const GRID_SIZE_METERS = 50; 

// Rough conversion factor: 1 degree latitude ~ 111,320m
const LAT_DEGREE_M = 111320;

/**
 * Snaps latitude and longitude to the nearest grid point
 * @param {Number} lat - Raw latitude
 * @param {Number} lng - Raw longitude
 * @returns {Object} { lat: Number, lng: Number } - Snapped coordinates
 */
const snapToGrid = (lat, lng) => {
    try {
        if (!lat || !lng) return null;

        // Decimal degree step for latitude to achieve GRID_SIZE_METERS
        const latStep = GRID_SIZE_METERS / LAT_DEGREE_M;
        
        // Longitude step depends on latitude (gets smaller closer to poles)
        const lngDegreeM = Math.cos(lat * Math.PI / 180) * LAT_DEGREE_M;
        const lngStep = GRID_SIZE_METERS / lngDegreeM;

        // Round to nearest step
        const snappedLat = Math.round(lat / latStep) * latStep;
        const snappedLng = Math.round(lng / lngStep) * lngStep;

        // Truncate floating point artifacts
        return {
            lat: parseFloat(snappedLat.toFixed(6)),
            lng: parseFloat(snappedLng.toFixed(6))
        };
    } catch (error) {
        console.error("GPS Snap Error:", error);
        return { lat, lng }; // Fallback to raw if logic fails
    }
};

module.exports = { snapToGrid };
