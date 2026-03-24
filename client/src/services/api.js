import axios from 'axios';
import toast from 'react-hot-toast';

// Base URL setup from env variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // Add auth token to headers if available
    const authStore = JSON.parse(localStorage.getItem('auth-storage'));
    if (authStore && authStore.state && authStore.state.token) {
      config.headers.Authorization = `Bearer ${authStore.state.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Global 401 handling - redirect to login
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        // We'd ideally call authStore.logout() here, but we avoid circular deps
        // Simple local storage clear is an alternative
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
        return Promise.reject(error);
    }
    
    // Global 500 error toast
    if (error.response && error.response.status >= 500) {
       toast.error(error.response.data?.message || 'Server error occurred');
    } else if (error.response && error.response.data && error.response.data.message) {
         // Show toast only for forms, not background silent fetching
         if(originalRequest.method !== 'get') {
             toast.error(error.response.data.message);
         }
    }

    return Promise.reject(error);
  }
);

export default api;
