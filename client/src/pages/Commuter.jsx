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
            case 'CRITICAL': return 'bg-[#DC2626] text-white';
            case 'HIGH': return 'bg-[#F97316] text-white';
            case 'MEDIUM': return 'bg-[#EAB308] text-white';
            case 'LOW': return 'bg-[#3D9E68] text-white';
            default: return 'bg-[#E8E8E8] text-[#6B6B6B]';
        }
    };

    const isAlerting = riskScore >= 80 || zones.some(z => z.densityLabel === 'CRITICAL');

    return (
        <div className="max-w-md mx-auto min-h-screen bg-[#F5F5F5] shadow-2xl relative overflow-hidden flex flex-col font-sans">
            
            {/* Header */}
            <div className={`p-6 pb-8 transition-colors ${isAlerting ? 'bg-[#DC2626]' : 'bg-gradient-to-r from-[#1A5C38] to-[#2D8B55]'} rounded-b-[24px] shadow-sm relative z-10`}>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                            <ShieldCheck className="text-white w-5 h-5" strokeWidth={2} />
                        </div>
                        <span className="text-white font-semibold tracking-tight text-xl">SafeTransit</span>
                    </div>
                    <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors relative shadow-sm">
                        <BellRing className="text-white w-5 h-5" strokeWidth={1.5} />
                        {isAlerting && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>}
                    </button>
                </div>

                <h1 className="text-white text-2xl font-semibold mb-1 tracking-tight">Check Live Crowds</h1>
                <p className="text-white/80 text-sm mb-6 font-light">Plan your journey safely</p>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E9E9E] w-5 h-5" />
                    <select 
                        className="w-full bg-white shadow-sm rounded-full pl-12 pr-4 py-3.5 text-[#0D0D0D] outline-none font-medium appearance-none"
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
                <div className="mx-4 mt-6 bg-[#FEF2F2] border border-[#FECACA] rounded-[16px] p-4 flex gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <div className="w-10 h-10 rounded-full bg-[#FEE2E2] flex items-center justify-center shrink-0">
                        <Activity className="text-[#DC2626] w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-[#DC2626] font-semibold text-sm">Critical Crowd Alert</h3>
                        <p className="text-[#991b1b] text-xs mt-1 leading-relaxed">Please avoid {venue?.name} if possible. Heavy congestion detected.</p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto px-4 py-8">
                <div className="flex items-center justify-between mb-5 px-1">
                    <h2 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Live Status</h2>
                    <span className="text-[10px] bg-[#EBF5EF] text-[#1A5C38] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1.5 border border-[#1A5C38]/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1A5C38] animate-pulse"></span> LIVE
                    </span>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-white border border-[#E8E8E8] rounded-[16px] px-4 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {zones.map((zone) => (
                            <div key={zone.zoneId} className="ui-card flex items-center justify-between cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#6B6B6B] border border-[#E8E8E8]">
                                        <MapPin className="w-5 h-5" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-[#0D0D0D]">{zone.zoneName}</h3>
                                        <p className="text-xs text-[#6B6B6B] mt-0.5 font-light">Estimation: ~{Math.ceil((zone.count || 0) / 10)} mins</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase ${getStatusColor(zone.densityLabel)}`}>
                                    {zone.densityLabel}
                                </div>
                            </div>
                        ))}
                        {zones.length === 0 && (
                            <div className="text-center text-[#9E9E9E] text-sm py-8 font-light">No zone data available</div>
                        )}
                    </div>
                )}

                <div className="mt-10 mb-6">
                     <h2 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-4 px-1">Report System</h2>
                     <div className="ui-card text-center cursor-default">
                         <div className="w-12 h-12 bg-[#F5F5F5] border border-[#E8E8E8] rounded-full flex items-center justify-center mx-auto mb-4">
                             <Phone className="w-5 h-5 text-[#6B6B6B]" strokeWidth={1.5} />
                         </div>
                         <p className="text-sm font-medium text-[#0D0D0D] mb-1">SMS Reporting Offline</p>
                         <p className="text-xs text-[#6B6B6B] font-light mb-5">Report sudden crowd surges directly via SMS without internet.</p>
                         <div className="bg-[#F5F5F5] rounded-full px-4 py-2 border border-[#E8E8E8] text-xs font-mono-custom text-[#0D0D0D] inline-flex items-center gap-2">
                             <span>Text: <span className="font-semibold text-[#1A5C38]">CSMT01 CROWD</span></span>
                             <span className="w-px h-3 bg-[#E8E8E8]"></span>
                             <span className="font-semibold text-[#1A5C38]">777-888-9999</span>
                         </div>
                     </div>
                </div>
            </div>
            
            <div className="p-4 text-center text-xs text-[#9E9E9E] font-medium border-t border-[#E8E8E8] bg-white">
                Powered by CrowdSense AI Platform
            </div>

        </div>
    );
};

export default Commuter;
