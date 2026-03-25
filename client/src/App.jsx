import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';

// Layouts
import Layout from './components/layout/Layout';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Commuter from './pages/Commuter';
import CityMap from './pages/CityMap';
import Simulation from './pages/Simulation';
import Analytics from './pages/Analytics';
import VenueSetup from './pages/VenueSetup';
import Login from './pages/Login';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return children; // Bypass for now — Firebase auth coming later
  }
  return children;
};

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/commuter" element={<Commuter />} />

      {/* App Routes with Sidebar Layout */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="commuter" element={<Commuter />} />
        <Route path="map" element={<CityMap />} />
        <Route path="simulation" element={<Simulation />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="venue" element={<VenueSetup />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
