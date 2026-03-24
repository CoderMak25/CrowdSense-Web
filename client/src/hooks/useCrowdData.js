import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import useCrowdStore from '../store/crowdStore';
import { INTERVALS } from '../utils/constants';

export const useCrowdData = (venueId) => {
  const setInitialData = useCrowdStore(state => state.setInitialData);
  const getAllReadings = useCrowdStore(state => state.getAllReadings);
  const riskScore = useCrowdStore(state => state.riskScore);

  // Initial fetch via React Query, then WS takes over (or it acts as fallback polling)
  const { data, isLoading, error, isRefetching } = useQuery({
    queryKey: ['density', venueId],
    queryFn: async () => {
      if (process.env.NODE_ENV === 'development') {
          // Fake delay + sample data
          await new Promise(r => setTimeout(r, 600));
          return {
             venueId,
             overallRiskScore: 72,
             timestamp: new Date().toISOString(),
             zones: [
                { zoneId: 'z_csmt_main', zoneName: 'Concourse Main', count: 1850, densityLabel: 'HIGH', confidence: 0.92, sensorSources: ['CCTV','BLE'] },
                { zoneId: 'z_csmt_p1', zoneName: 'Platform 1', count: 320, densityLabel: 'LOW', confidence: 0.85, sensorSources: ['CCTV'] },
                { zoneId: 'z_csmt_p2', zoneName: 'Platform 2', count: 500, densityLabel: 'MEDIUM', confidence: 0.88, sensorSources: ['CCTV','WIFI'] },
                { zoneId: 'z_csmt_gatea', zoneName: 'Gate A', count: 90, densityLabel: 'LOW', confidence: 0.95, sensorSources: ['CCTV'] }
             ]
          };
      }
      const res = await api.get(`/density/${venueId}`);
      return res.data;
    },
    enabled: !!venueId,
    refetchInterval: INTERVALS.VENUE_SYNC, 
    staleTime: 10000 // Treat as fresh for 10s before refetch checks
  });

  // Sync React Query initial load exactly once to Zustand
  useEffect(() => {
    if (data) {
       setInitialData(data);
    }
  }, [data, setInitialData]);

  return {
    // Return zustand live state
    zones: getAllReadings(),
    riskScore,
    // Return query loading states
    isLoading,
    isRefetching,
    error
  };
};

export default useCrowdData;
