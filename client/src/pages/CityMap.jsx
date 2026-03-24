import { useState } from 'react';
import useVenueStore from '../store/venueStore';
import { Network, MapPin } from 'lucide-react';

// For demo purposes, we build a static visual map using absolute positioning
// In production, you would drop in Mapbox GL JS or Google Maps here
const CityMap = () => {
  const { venues, selectVenue } = useVenueStore();
  const [hovered, setHovered] = useState(null);

  const getStatusColor = (status) => {
      switch(status) {
          case 'CRITICAL': return 'bg-lvlCrit shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse';
          case 'HIGH': return 'bg-lvlHigh shadow-[0_0_15px_rgba(249,115,22,0.6)]';
          case 'MEDIUM': return 'bg-lvlMed shadow-[0_0_15px_rgba(245,158,11,0.6)]';
          case 'LOW': return 'bg-lvlLow shadow-[0_0_10px_rgba(34,197,94,0.4)]';
          default: return 'bg-gray-400';
      }
  };

  // Convert lat/lng to percentage bounds for demo map
  const renderMapNodes = () => {
      // Just some hardcoded relative positioning to emulate a map spread
      const demoPositions = {
          'csmt01': { top: '35%', left: '48%' },
          'dadar02': { top: '55%', left: '52%' },
          'phoenix03': { top: '65%', left: '50%' },
          'lalbaug04': { top: '62%', left: '56%' },
          'wankhede05': { top: '42%', left: '46%' }
      };

      return venues.map(venue => {
          const pos = demoPositions[venue.venueId] || { top: '50%', left: '50%' };
          const isHovered = hovered === venue.venueId;

          return (
              <div 
                  key={venue.venueId}
                  className="absolute cursor-pointer transition-transform duration-200"
                  style={{ top: pos.top, left: pos.left, transform: isHovered ? 'scale(1.2) translate(-50%, -50%)' : 'translate(-50%, -50%)', zIndex: isHovered ? 40 : 10 }}
                  onMouseEnter={() => setHovered(venue.venueId)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => selectVenue(venue.venueId)}
              >
                  {/* The Node Pin */}
                  <div className={`w-4 h-4 rounded-full border-2 border-white ${getStatusColor(venue.currentStatus)} relative`}>
                      {/* Pulse Ring */}
                      {venue.currentStatus === 'CRITICAL' && (
                          <div className="absolute inset-0 rounded-full bg-lvlCrit animate-ping opacity-75"></div>
                      )}
                  </div>

                  {/* Node Label Map Popup */}
                  <div className={`absolute top-6 left-1/2 -translate-x-1/2 w-48 bg-white text-textpri rounded-xl shadow-lg border border-bordercol p-3 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      <p className="text-xs font-semibold mb-1 truncate">{venue.name}</p>
                      <div className="flex justify-between items-center text-[10px]">
                          <span className="text-textsec capitalize">{venue.type}</span>
                          <span className={`font-mono font-bold ${getStatusColor(venue.currentStatus).split(' ')[0].replace('bg-', 'text-')}`}>
                              {venue.currentStatus}
                          </span>
                      </div>
                  </div>
              </div>
          );
      });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] animate-in fade-in duration-300">
      <div className="flex items-end justify-between gap-4 mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-textpri mb-1">City Overview</h1>
          <p className="text-sm text-textsec">Live geographic map of your monitored grid.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-bordercol rounded-lg text-sm font-medium text-textpri hover:bg-gray-50 flex items-center gap-2">
            <Network size={16} /> Topology View
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[#1e293b] rounded-2xl border border-bordercol shadow-sm relative overflow-hidden group">
          {/* Map Overlay Styles */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
               style={{ 
                   backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
               }}>
          </div>
          
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur border border-white/10 rounded-lg p-3 z-20">
              <h3 className="text-white text-sm font-medium flex items-center gap-2 mb-2">
                 <MapPin size={14} className="text-primarylight" /> Mumbai Metro Grid
              </h3>
              <div className="flex flex-col gap-1 text-xs font-mono text-white/70">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-lvlCrit"></div> Critical (1+)</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-lvlHigh"></div> High (0)</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-lvlMed"></div> Moderate (2)</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-lvlLow"></div> Low (12)</div>
              </div>
          </div>

          {/* Render relative nodes */}
          <div className="absolute inset-0">
               {renderMapNodes()}
          </div>
          
          <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur rounded px-2 py-1 text-[10px] text-white/50 font-mono pointer-events-none">
              Mapbox | OpenStreetMap
          </div>
      </div>
    </div>
  );
};

export default CityMap;
