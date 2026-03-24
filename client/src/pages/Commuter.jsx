import { useState } from 'react';
import { Search, MapPin, Activity, BellRing, Phone, ShieldCheck } from 'lucide-react';
import useVenueStore from '../store/venueStore';
import useCrowdData from '../hooks/useCrowdData';
import { useWebSocket } from '../hooks/useWebSocket';

const Commuter = () => {
    const { venues } = useVenueStore();
    const [selectedId, setSelectedId] = useState('csmt01'); // Default demo
    const { zones, riskScore, isLoading } = useCrowdData(selectedId);
    useWebSocket(selectedId); // hook up live socket
    
    const venue = venues.find(v => v.venueId === selectedId);

    const getStatusColor = (label) => {
        switch (label) {
            case 'CRITICAL': return 'bg-lvlCrit text-white';
            case 'HIGH': return 'bg-lvlHigh text-white';
            case 'MEDIUM': return 'bg-lvlMed text-white';
            case 'LOW': return 'bg-lvlLow text-white';
            default: return 'bg-gray-200 text-textsec';
        }
    };

    const isAlerting = riskScore >= 80 || zones.some(z => z.densityLabel === 'CRITICAL');

    return (
        <div className="max-w-md mx-auto min-h-screen bg-pagebg shadow-2xl relative overflow-hidden flex flex-col font-sans">
            
            {/* Header */}
            <div className={`p-6 pb-8 transition-colors ${isAlerting ? 'bg-lvlCrit' : 'bg-primary'} rounded-b-3xl shadow-md relative z-10`}>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <ShieldCheck className="text-white w-4 h-4" />
                        </div>
                        <span className="text-white font-semibold tracking-tight text-lg">SafeTransit</span>
                    </div>
                    <button className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors relative">
                        <BellRing className="text-white w-4 h-4" />
                        {isAlerting && <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-ping"></span>}
                    </button>
                </div>

                <h1 className="text-white text-2xl font-bold mb-1">Check Live Crowds</h1>
                <p className="text-white/80 text-sm mb-5">Plan your journey safely</p>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textmuted w-5 h-5" />
                    <select 
                        className="w-full bg-white rounded-xl pl-10 pr-4 py-3.5 text-textpri outline-none font-medium appearance-none shadow-sm"
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                    >
                        {venues.map(v => (
                            <option key={v.venueId} value={v.venueId}>{v.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Emergency Banner */}
            {isAlerting && (
                <div className="mx-4 mt-4 bg-[#fef2f2] border border-[#fecaca] rounded-xl p-4 flex gap-3 animate-in fade-in slide-in-from-top-2">
                    <Activity className="text-lvlCrit shrink-0 animate-pulse" />
                    <div>
                        <h3 className="text-lvlCrit font-bold text-sm">Critical Crowd Alert</h3>
                        <p className="text-[#991b1b] text-xs mt-0.5">Please avoid {venue?.name} if possible. Heavy congestion detected.</p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-textpri uppercase tracking-wider">Live Status</h2>
                    <span className="text-[10px] bg-lvlLow/15 text-lvlLow px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-lvlLow animate-pulse"></span> LIVE
                    </span>
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-xl"></div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {zones.map((zone) => (
                            <div key={zone.zoneId} className="bg-white border border-bordercol rounded-xl p-4 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-textsec border border-bordercol/50">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-textpri">{zone.zoneName}</h3>
                                        {/* Commuters dont see counts, just qualitative status */}
                                        <p className="text-xs text-textsec mt-0.5">Waiting: ~{Math.ceil((zone.count || 0) / 10)} mins</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-tight ${getStatusColor(zone.densityLabel)}`}>
                                    {zone.densityLabel}
                                </div>
                            </div>
                        ))}
                        {zones.length === 0 && (
                            <div className="text-center text-textsec text-sm py-4">No zone data available</div>
                        )}
                    </div>
                )}

                <div className="mt-8">
                     <h2 className="text-sm font-bold text-textpri uppercase tracking-wider mb-3">Report Crowding</h2>
                     <div className="bg-white border text-center border-bordercol rounded-xl p-5 shadow-sm">
                         <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                             <Phone className="w-5 h-5 text-textsec" />
                         </div>
                         <p className="text-sm font-medium text-textpri mb-1">SMS Reporting System</p>
                         <p className="text-xs text-textsec mb-4">You can report sudden crowd surges directly via SMS without internet.</p>
                         <div className="bg-pagebg rounded-lg p-3 text-xs font-mono text-textpri inline-block">
                             Text: <span className="font-bold text-primary">CSMT01 CROWD</span> to <span className="font-bold cursor-pointer underline">777-888-9999</span>
                         </div>
                     </div>
                </div>

            </div>
            
            <div className="p-4 text-center text-xs text-textmuted border-t border-bordercol/50">
                Powered by CrowdSense AI
            </div>

        </div>
    );
};

export default Commuter;
