import { create } from 'zustand';
import api from '../services/api';

const useVenueStore = create((set, get) => ({
  venues: [],
  selectedVenue: null,
  isLoading: false,
  error: null,

  fetchVenues: async () => {
    set({ isLoading: true, error: null });
    try {
      let data = [];
      try {
          const res = await api.get('/venues');
          data = res.data;
      } catch (e) {
         if (process.env.NODE_ENV === 'development') {
             // Fallback dummy data if backend unseeded
             data = [
                 { _id: '1', venueId: 'csmt01', name: 'Central Station', type: 'railway', currentStatus: 'HIGH' },
                 { _id: '2', venueId: 'phoenix03', name: 'Railway Mall', type: 'mall', currentStatus: 'LOW' },
                 { _id: '3', venueId: 'wankhede05', name: 'City Stadium', type: 'stadium', currentStatus: 'MEDIUM' }
             ];
         } else throw e;
      }

      set({ venues: data, isLoading: false });
      
      // Auto-select first venue if none currently selected
      const currentSelected = get().selectedVenue;
      if (!currentSelected && data.length > 0) {
         get().selectVenue(data[0].venueId);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  selectVenue: async (venueId) => {
      set({ isLoading: true });
      try {
          let venueObj = null;
          try {
              const res = await api.get(`/venues/${venueId}`);
              venueObj = res.data;
          } catch (e) {
              if (process.env.NODE_ENV === 'development') {
                  venueObj = get().venues.find(v => v.venueId === venueId) || { name: 'Demo Venue', zones: [] };
              } else throw e;
          }
          
          set({ selectedVenue: venueObj, isLoading: false });
      } catch (error) {
          set({ error: error.message, isLoading: false });
      }
  }
}));

export default useVenueStore;
