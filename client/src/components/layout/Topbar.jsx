import { Search, Command, Mail, Bell } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useAlertStore from '../../store/alertStore';

const Topbar = () => {
  const { user } = useAuthStore();
  const unreadAlerts = useAlertStore(state => state.unreadCount);

  return (
    <header className="h-[64px] bg-transparent flex items-center justify-between px-6 md:px-8 flex-shrink-0 z-10 relative">
      {/* Search */}
      <div className="flex items-center bg-white shadow-sm border border-transparent rounded-full h-11 w-full max-w-[320px] px-4 focus-within:border-[#1A5C38] focus-within:ring-1 focus-within:ring-[#1A5C38] transition-all">
          <Search className="w-4 h-4 text-[#9E9E9E]" strokeWidth={2} />
          <input 
              type="text" 
              placeholder="Search task" 
              className="bg-transparent border-none outline-none text-sm w-full ml-3 placeholder:text-[#9E9E9E] text-[#0D0D0D] p-0 focus:ring-0" 
          />
          <div className="bg-[#F5F5F5] text-[#6B6B6B] text-[11px] font-medium px-2 py-1 rounded-md flex items-center gap-1 flex-shrink-0 border border-[#E8E8E8]">
              <Command className="w-3 h-3" /> F
          </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0D0D0D] shadow-sm hover:shadow-md hover:-translate-y-px transition-all">
              <Mail className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </button>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0D0D0D] shadow-sm hover:shadow-md hover:-translate-y-px transition-all relative">
              <Bell className="w-[18px] h-[18px]" strokeWidth={1.5} />
              {unreadAlerts > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#DC2626] rounded-full border border-white"></span>
              )}
          </button>
          
          <div className="w-px h-6 mx-1"></div>
          
          <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-[#E8B5A1] overflow-hidden flex items-center justify-center shadow-sm">
                 {/* Using avatar style from image or fallback */}
                 <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'Totok'}&backgroundColor=e8b5a1`} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div className="hidden lg:flex flex-col">
                  <span className="text-sm font-medium text-[#0D0D0D] group-hover:text-[#1A5C38] transition-colors leading-none mb-1">
                      {user?.name || 'Totok Michael'}
                  </span>
                  <span className="text-xs font-light text-[#6B6B6B] leading-none">
                      {user?.email || 'tmichael20@gmail.com'}
                  </span>
              </div>
          </div>
      </div>
    </header>
  );
};

export default Topbar;
