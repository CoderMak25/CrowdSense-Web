import { NavLink } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useAlertStore from '../../store/alertStore';
import { 
    Users, 
    LayoutDashboard, 
    Route, 
    MapPin, 
    PlayCircle, 
    BarChart3, 
    Building2, 
    Bell, 
    Settings, 
    HelpCircle, 
    LogOut,
    Smartphone
} from 'lucide-react';

const Sidebar = () => {
    const { logout } = useAuthStore();
    const unreadAlerts = useAlertStore(state => state.unreadCount);

    const navItemClass = ({ isActive }) =>
    `group flex items-center justify-between h-[44px] px-3 rounded-lg relative transition-colors ${
      isActive
        ? 'text-primary bg-accentbg'
        : 'text-textsec hover:bg-gray-50 hover:text-textpri'
    }`;

  return (
    <aside className="w-[260px] flex-shrink-0 bg-white border-r border-bordercol flex flex-col h-full hidden md:flex z-20">
      {/* Logo */}
      <div className="h-[64px] px-6 flex items-center gap-3 border-b border-bordercol/50">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
          <Users size={18} strokeWidth={1.5} />
        </div>
        <span className="font-semibold text-lg text-textpri tracking-tight">CrowdSense</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-8">
        {/* MENU Section */}
        <div>
          <h3 className="text-[10px] text-textmuted uppercase tracking-[0.15em] font-medium px-3 mb-3">Menu</h3>
          <nav className="flex flex-col gap-1">
            <NavLink to="/" className={navItemClass} end>
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-full"></div>}
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className={`${isActive ? 'text-primary' : 'text-textsec group-hover:text-textpri'} transition-colors w-5 h-5`} strokeWidth={1.5} />
                    <span className="text-sm font-medium">Dashboard</span>
                  </div>
                </>
              )}
            </NavLink>

            <NavLink to="/commuter" className={navItemClass}>
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-full"></div>}
                  <div className="flex items-center gap-3">
                    <Route className={`${isActive ? 'text-primary' : 'text-textsec group-hover:text-textpri'} transition-colors w-5 h-5`} strokeWidth={1.5} />
                    <span className="text-sm font-medium">Commuter</span>
                  </div>
                </>
              )}
            </NavLink>

            <NavLink to="/map" className={navItemClass}>
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-full"></div>}
                  <div className="flex items-center gap-3">
                    <MapPin className={`${isActive ? 'text-primary' : 'text-textsec group-hover:text-textpri'} transition-colors w-5 h-5`} strokeWidth={1.5} />
                    <span className="text-sm font-medium">City Map</span>
                  </div>
                </>
              )}
            </NavLink>

            <NavLink to="/simulation" className={navItemClass}>
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-full"></div>}
                  <div className="flex items-center gap-3">
                    <PlayCircle className={`${isActive ? 'text-primary' : 'text-textsec group-hover:text-textpri'} transition-colors w-5 h-5`} strokeWidth={1.5} />
                    <span className="text-sm font-medium">Simulation</span>
                  </div>
                </>
              )}
            </NavLink>

            <NavLink to="/analytics" className={navItemClass}>
               {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-full"></div>}
                  <div className="flex items-center gap-3">
                    <BarChart3 className={`${isActive ? 'text-primary' : 'text-textsec group-hover:text-textpri'} transition-colors w-5 h-5`} strokeWidth={1.5} />
                    <span className="text-sm font-medium">Analytics</span>
                  </div>
                </>
              )}
            </NavLink>

            <NavLink to="/venue" className={navItemClass}>
               {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-full"></div>}
                  <div className="flex items-center gap-3">
                    <Building2 className={`${isActive ? 'text-primary' : 'text-textsec group-hover:text-textpri'} transition-colors w-5 h-5`} strokeWidth={1.5} />
                    <span className="text-sm font-medium">Venue Setup</span>
                  </div>
                </>
              )}
            </NavLink>

            <button className="group flex items-center justify-between h-[44px] px-3 rounded-lg text-textsec hover:bg-gray-50 hover:text-textpri transition-colors w-full">
              <div className="flex items-center gap-3">
                <Bell className="text-textsec group-hover:text-textpri transition-colors w-5 h-5" strokeWidth={1.5} />
                <span className="text-sm font-medium">Alerts</span>
              </div>
              {unreadAlerts > 0 && (
                <span className="bg-lvlLow/15 text-lvlLow px-2 py-0.5 text-xs font-medium rounded-full font-mono">{unreadAlerts}</span>
              )}
            </button>
          </nav>
        </div>

        {/* GENERAL Section */}
        <div>
          <h3 className="text-[10px] text-textmuted uppercase tracking-[0.15em] font-medium px-3 mb-3">General</h3>
          <nav className="flex flex-col gap-1">
            <button className="group flex items-center justify-between h-[44px] px-3 rounded-lg text-textsec hover:bg-gray-50 hover:text-textpri transition-colors w-full">
              <div className="flex items-center gap-3">
                <Settings className="text-textsec group-hover:text-textpri transition-colors w-5 h-5" strokeWidth={1.5} />
                <span className="text-sm font-medium">Settings</span>
              </div>
            </button>
            <button className="group flex items-center justify-between h-[44px] px-3 rounded-lg text-textsec hover:bg-gray-50 hover:text-textpri transition-colors w-full">
              <div className="flex items-center gap-3">
                <HelpCircle className="text-textsec group-hover:text-textpri transition-colors w-5 h-5" strokeWidth={1.5} />
                <span className="text-sm font-medium">Help</span>
              </div>
            </button>
            <button onClick={logout} className="group flex items-center justify-between h-[44px] px-3 rounded-lg text-textsec hover:bg-gray-50 hover:text-textpri transition-colors mt-2 w-full">
              <div className="flex items-center gap-3">
                <LogOut className="text-textsec group-hover:text-textpri transition-colors w-5 h-5" strokeWidth={1.5} />
                <span className="text-sm font-medium">Logout</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Promo Card */}
      <div className="p-4 mt-auto">
        <div className="bg-primary rounded-2xl p-4 text-center">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Smartphone className="text-white w-5 h-5" strokeWidth={1.5} />
          </div>
          <h4 className="text-white text-sm font-medium mb-1">Download our Mobile App</h4>
          <p className="text-white/70 text-xs mb-4">Get crowd data on the go</p>
          <button className="w-full border border-white/20 text-white rounded-lg py-2 text-xs font-medium hover:bg-white/10 transition-colors">Download</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
