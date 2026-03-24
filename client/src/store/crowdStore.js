import { create } from 'zustand';

const useCrowdStore = create((set, get) => ({
  readings: new Map(), // zoneId -> reading object
  riskScore: 0,
  riskFactors: [],
  lastUpdated: null,

  setInitialData: (data) => {
    const newMap = new Map();
    if (data.zones) {
        data.zones.forEach(zone => {
            newMap.set(zone.zoneId, zone);
        });
    }
    
    set({
      readings: newMap,
      riskScore: data.overallRiskScore || 0,
      riskFactors: data.riskFactors || [],
      lastUpdated: data.timestamp || new Date()
    });
  },

  updateFromWebSocket: (liveData) => {
     // Expected liveData: { venueId, zones: [...], riskScore, timestamp }
     const currentMap = new Map(get().readings);
     
     if (liveData.zones) {
         liveData.zones.forEach(zone => {
             // Merge with existing or add new
             currentMap.set(zone.zoneId, { ...currentMap.get(zone.zoneId), ...zone });
         });
     }

     set({
         readings: currentMap,
         riskScore: liveData.riskScore !== undefined ? liveData.riskScore : get().riskScore,
         lastUpdated: liveData.timestamp || new Date()
     });
  },

  getZoneReading: (zoneId) => {
      return get().readings.get(zoneId);
  },
  
  getAllReadings: () => {
      return Array.from(get().readings.values());
  }
}));

export default useCrowdStore;
