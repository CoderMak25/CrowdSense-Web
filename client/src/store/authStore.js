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

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Fake delay for demo
          await new Promise(resolve => setTimeout(resolve, 800));
          
          let response;
          try {
              response = await api.post('/auth/login', { email, password });
          } catch(e) {
              // Dev/Demo fallback if backend isn't seeded correctly yet
              if (process.env.NODE_ENV === 'development' && email === 'operator@crowdsense.ai') {
                  response = {
                      data: {
                          _id: '123', name: 'Demo Operator', email, role: 'operator',
                          token: 'dev-token-xyz', venueAccess: ['csmt01']
                      }
                  };
              } else {
                  throw e;
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
