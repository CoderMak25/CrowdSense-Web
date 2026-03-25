import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-white p-2 md:p-3 gap-2 md:gap-3 overflow-hidden font-sans">
      
      {/* Sidebar Island */}
      <div className="hidden md:flex bg-[#F5F5F5] rounded-[24px] overflow-hidden flex-col flex-shrink-0 relative z-40 shadow-sm border border-[#E8E8E8]/50">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Mount Point */}
      <div className="md:hidden">
         <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden gap-2 md:gap-3">
        {/* Topbar Island */}
        <div className="bg-[#F5F5F5] rounded-[24px] flex-shrink-0 overflow-hidden shadow-sm border border-[#E8E8E8]/50">
          <Topbar />
        </div>
        
        {/* Main Content Island */}
        <div className="flex-1 bg-[#F5F5F5] rounded-[24px] overflow-hidden shadow-sm border border-[#E8E8E8]/50 relative flex flex-col">
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

    </div>
  );
};

export default Layout;
