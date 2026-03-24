import { create } from 'zustand';

const useAlertStore = create((set, get) => ({
  alerts: [],
  unreadCount: 0,

  setInitialAlerts: (alertsList) => {
      set({ 
          alerts: alertsList,
          unreadCount: 0 
      });
  },

  addLiveAlert: (newAlert) => {
      set((state) => {
          // Keep max 50 alerts in memory
          const updatedAlerts = [newAlert, ...state.alerts].slice(0, 50);
          return {
              alerts: updatedAlerts,
              unreadCount: state.unreadCount + 1
          };
      });
  },

  markAllRead: () => {
      set({ unreadCount: 0 });
  }
}));

export default useAlertStore;
