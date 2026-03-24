import { Search, MessageSquare, Bell } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useAlertStore from '../../store/alertStore';
import { useWebSocket } from '../../hooks/useWebSocket';
import useVenueStore from '../../store/venueStore';

const Topbar = () => {
    const { user } = useAuthStore();
    const unreadCount = useAlertStore(state => state.unreadCount);
    // Bind WebSocket for connected venue
    const selectedVenue = useVenueStore(state => state.selectedVenue);
    const { status } = useWebSocket(selectedVenue?.venueId);

    const getInitials = (name) => {
        if (!name) return 'OP';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <header className="h-[64px] bg-white border-b border-bordercol flex items-center justify-between px-6 lg:px-8 shrink-0 z-10 w-full">
            <div className="flex-1 max-w-md relative flex items-center">
                <Search className="text-textmuted absolute left-4 w-4 h-4" strokeWidth={1.5} />
                <input 
                    type="text" 
                    placeholder="Search venue..." 
                    className="w-full bg-pagebg text-sm rounded-full pl-10 pr-12 py-2 outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30 transition-all placeholder:text-textmuted"
                />
                <div className="absolute right-3 px-1.5 py-0.5 rounded border border-bordercol text-[10px] text-textmuted font-mono bg-white">
                    ⌘F
                </div>
            </div>

            <div className="flex items-center gap-5 ml-4">
                
                {/* WS Status Indicator */}
                {status && (
                    <div className="flex items-center gap-1.5 hidden md:flex" title={`Connection: ${status}`}>
                        <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-lvlLow' : (status === 'connecting' ? 'bg-lvlMed' : 'bg-textmuted')}`}></div>
                        <span className="text-[10px] font-mono text-textmuted capitalize">{status}</span>
                    </div>
                )}

                <button className="text-textsec hover:text-textpri transition-colors relative">
                    <MessageSquare strokeWidth={1.5} className="w-[22px] h-[22px]" />
                </button>
                <button className="text-textsec hover:text-textpri transition-colors relative">
                    <Bell strokeWidth={1.5} className="w-[22px] h-[22px]" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 w-2 h-2 bg-lvlHigh rounded-full border-2 border-white"></span>
                    )}
                </button>
                
                <div className="h-6 w-px bg-bordercol hidden md:block"></div>
                
                <div className="flex items-center gap-3 cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-accentbg text-primary flex items-center justify-center text-sm font-semibold tracking-tight border border-primary/10">
                        {getInitials(user?.name)}
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-textpri leading-tight">{user?.name || 'Demo User'}</p>
                        <p className="text-[10px] text-textsec mt-0.5">{user?.email || 'admin@crowdsense.ai'}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
