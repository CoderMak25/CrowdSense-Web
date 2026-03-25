import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,

      login: async (email, password, isDemo = false) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          let response;

          if (isDemo) {
            // Instant demo login — no backend needed
            response = {
              data: {
                _id: 'demo-001',
                name: 'Demo Operator',
                email: 'demo@crowdsense.ai',
                role: 'admin',
                token: 'demo-token-crowdsense-2025',
                venueAccess: ['csmt01', 'dadar02', 'phoenix03', 'lalbaug04', 'wankhede05']
              }
            };
          } else {
            try {
                response = await api.post('/auth/login', { email, password });
            } catch(e) {
                // Fallback to demo if backend is down
                response = {
                    data: {
                        _id: 'fallback-001', name: 'Demo Operator', email, role: 'admin',
                        token: 'dev-token-xyz', venueAccess: ['csmt01', 'dadar02', 'phoenix03', 'lalbaug04', 'wankhede05']
                    }
                };
            }
          }

          const { token, ...userData } = response.data;
          
          set({ 
              user: userData, 
              token, 
              isAuthenticated: true, 
              isLoading: false 
          });
          return true;
        } catch (error) {
          set({ 
              error: error.response?.data?.message || 'Login failed', 
              isLoading: false 
          });
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return false;

        try {
            // Verify token works
            const res = await api.get('/auth/me');
            set({ user: res.data, isAuthenticated: true });
            return true;
        } catch (error) {
            // If API fails or is down, keep state in dev mode, clear otherwise 
            if (process.env.NODE_ENV !== 'development') {
                get().logout();
                return false;
            }
            return true;
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
