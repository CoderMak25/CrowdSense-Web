import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useEffect } from 'react';
import useVenueStore from '../../store/venueStore';

const Layout = () => {
  const fetchVenues = useVenueStore(state => state.fetchVenues);

  // Fetch initial base data
  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  return (
    <div className="flex h-screen overflow-hidden bg-pagebg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Topbar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
