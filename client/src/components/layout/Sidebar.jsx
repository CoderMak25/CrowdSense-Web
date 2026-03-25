import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useAlertStore from '../../store/alertStore';
import { 
    Waves,
    LayoutDashboard, 
    Map, 
    PlayCircle, 
    BarChart2, 
    Settings2, 
    Settings, 
    HelpCircle, 
    LogOut,
    Smartphone,
    Menu,
    X,
    Users
} from 'lucide-react';

const Sidebar = () => {
    const { logout } = useAuthStore();
    const unreadAlerts = useAlertStore(state => state.unreadCount);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItemClass = ({ isActive }) => {
        return isActive 
            ? "flex items-center h-10 px-3 mx-2 rounded-[10px] gap-3 text-[#0D0D0D] bg-transparent relative group cursor-pointer transition-all duration-150 font-medium"
            : "flex items-center h-10 px-3 mx-2 rounded-[10px] gap-3 text-[#6B6B6B] hover:bg-[#F5F5F5] group cursor-pointer transition-all duration-150 font-normal";
    };

    const sidebarContent = (
      <>
        {/* Logo */}
        <div className="pt-6 pl-5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EBF5EF] flex items-center justify-center text-[#1A5C38]">
                <Waves className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="text-lg font-semibold text-[#0D0D0D]">CrowdSense</span>
        </div>

        <div className="flex-1 overflow-y-auto mt-6 pb-6">
            {/* Menu Section */}
            <div className="text-[10px] font-medium text-[#9E9E9E] tracking-widest uppercase mb-2 pl-5">MENU</div>
            <nav className="space-y-1">
                {[
                    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
                    { path: '/dashboard/commuter', icon: Users, label: 'Commuter' },
                    { path: '/dashboard/map', icon: Map, label: 'City Map' },
                    { path: '/dashboard/simulation', icon: PlayCircle, label: 'Simulation' },
                    { path: '/dashboard/analytics', icon: BarChart2, label: 'Analytics', badge: unreadAlerts > 0 ? `${unreadAlerts}+` : null },
                    { path: '/dashboard/venue', icon: Settings2, label: 'Venue Setup' }
                ].map((item) => (
                    <NavLink key={item.path} to={item.path} end={item.end} className={navItemClass} onClick={() => setMobileOpen(false)}>
                        {({ isActive }) => (
                            <>
                                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-gradient-to-b from-[#1A5C38] to-[#3D9E68] rounded-r-md"></div>}
                                <item.icon className={`w-[18px] h-[18px] ml-1 ${isActive ? 'text-[#1A5C38]' : 'text-[#9E9E9E] group-hover:text-[#6B6B6B] transition-colors'}`} strokeWidth={isActive ? 2 : 1.5} />
                                <span className={`text-sm ${isActive ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                                {item.badge && (
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1A5C38] text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">{item.badge}</span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* GENERAL Section */}
            <div className="text-[10px] font-medium text-[#9E9E9E] tracking-widest uppercase mt-8 mb-2 pl-5">GENERAL</div>
            <nav className="space-y-1">
                <a href="#" className="flex items-center h-10 px-3 mx-2 rounded-[10px] gap-3 text-[#6B6B6B] hover:bg-[#F5F5F5] group cursor-pointer transition-colors duration-150">
                    <Settings className="w-[18px] h-[18px] text-[#9E9E9E] group-hover:text-[#6B6B6B] transition-colors ml-1" strokeWidth={1.5} />
                    <span className="text-sm font-normal">Settings</span>
                </a>
                <a href="#" className="flex items-center h-10 px-3 mx-2 rounded-[10px] gap-3 text-[#6B6B6B] hover:bg-[#F5F5F5] group cursor-pointer transition-colors duration-150">
                    <HelpCircle className="w-[18px] h-[18px] text-[#9E9E9E] group-hover:text-[#6B6B6B] transition-colors ml-1" strokeWidth={1.5} />
                    <span className="text-sm font-normal">Help</span>
                </a>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full flex items-center h-10 px-3 mx-2 rounded-[10px] gap-3 text-[#6B6B6B] hover:bg-[#F5F5F5] group cursor-pointer transition-colors duration-150 text-left">
                    <LogOut className="w-[18px] h-[18px] text-[#9E9E9E] group-hover:text-[#6B6B6B] transition-colors ml-1" strokeWidth={1.5} />
                    <span className="text-sm font-normal">Logout</span>
                </button>
            </nav>
        </div>

        {/* Promo Card Without Gradient Background (Just #1A5C38) */}
        <div className="bg-[#1A5C38] rounded-[16px] p-[20px] text-white border border-transparent transition-all duration-150 ease-[ease] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-px mx-3 mb-4 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,50 C20,70 40,30 60,50 C80,70 100,40 100,40 L100,100 L0,100 Z" fill="#FFFFFF"></path>
                    <path d="M0,70 C30,90 50,50 80,70 C100,90 100,60 100,60 L100,100 L0,100 Z" fill="#FFFFFF" opacity="0.5"></path>
                </svg>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center mb-3 relative z-10">
                <Smartphone className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <h4 className="text-sm font-normal text-white relative z-10 leading-snug flex flex-col">
                Download our
                <span className="font-semibold">Mobile App</span>
            </h4>
            <p className="text-xs text-white/65 mt-1 relative z-10">Get crowd data on the go</p>
            <button className="mt-3 w-full border border-white/30 hover:border-white bg-white/5 hover:bg-white/10 text-white text-sm font-normal py-1.5 rounded-full transition-all duration-200 active:scale-95 relative z-10">
                Download
            </button>
        </div>
      </>
    );

  return (
    <>
      <button 
        className="md:hidden fixed top-4 right-4 z-[60] w-10 h-10 bg-white border border-[#E8E8E8] rounded-xl flex items-center justify-center shadow-sm"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-[50] md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`
        flex flex-col w-[240px] transition-transform duration-300 ease-in-out flex-shrink-0
        ${mobileOpen 
          ? 'fixed inset-y-0 left-0 z-[55] bg-white shadow-2xl translate-x-0 h-screen overflow-y-auto' 
          : 'fixed md:static -translate-x-full md:translate-x-0 h-full bg-transparent'
        }
      `}>
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
