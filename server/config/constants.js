module.exports = {
  // Sensor confidence weights for Kalman Fusion
  SENSOR_WEIGHTS: {
    CCTV: 0.90,
    OFFLINE_AI: 0.85,
    MOTION: 0.80,
    GPS: 0.75,
    CELLULAR: 0.70,
    BLE: 0.65,
    NETWORK: 0.65,
    WIFI: 0.60,
    APP_EVENTS: 0.60,
    SMS: 0.55
  },

  // Density level thresholds
  DENSITY_THRESHOLDS: {
    LOW: 30,      // Below 30% of capacity
    MEDIUM: 60,   // Below 60% of capacity
    HIGH: 80,     // Below 80% of capacity
    CRITICAL: 100 // Above 80% is critical
  },

  // Alert levels based on risk score or sensor consensus
  ALERT_LEVELS: {
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL'
  },

  // Motion labels
  MOTION_LABELS: {
    FREE: 'FREE',
    SHUFFLE: 'SHUFFLE',
    STILL: 'STILL',
    CRUSH: 'CRUSH'
  },

  // Redis Keys
  REDIS_KEYS: {
    LIVE_ROOM: (venueId) => `crowdsense:live:${venueId}`,
    DENSITY_CACHE: (venueId) => `cache:density:${venueId}`
  }
};
