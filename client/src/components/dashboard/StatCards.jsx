import { useEffect, useState } from 'react';
import { ArrowUpRight, AlertTriangle, CheckCircle } from 'lucide-react';
import useVenueStore from '../../store/venueStore';

const CountUp = ({ end, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end); // Ensure exact finish
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <>{count.toLocaleString()}</>;
};

const StatCards = ({ riskScore, zones, isLoading }) => {
  const { venues } = useVenueStore();
  
  // Aggregate data
  const totalCount = zones.reduce((sum, z) => sum + (z.count || 0), 0);
  const activeZones = zones.filter(z => z.densityLabel !== 'OFFLINE').length;
  const onlineVenues = venues.filter(v => v.isActive).length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5 shrink-0">
      {/* Card 1 (Dark - Total Persons) */}
      <div className="bg-primary rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-colors"></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
          <span className="text-sm font-medium text-white/70">Total Persons Detected</span>
          <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </button>
        </div>
        <div className="text-4xl font-mono font-semibold text-white mb-4 relative z-10">
          {isLoading ? '...' : <CountUp end={totalCount} />}
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-medium relative z-10">
          <span>↑ Increased from last hour</span>
        </div>
      </div>

      {/* Card 2 (Active Zones) */}
      <div className="bg-white border border-bordercol rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-medium text-textsec">Active Zones</span>
          <button className="w-8 h-8 rounded-full border border-bordercol flex items-center justify-center text-textsec hover:bg-gray-50 transition-colors">
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </button>
        </div>
        <div className="text-4xl font-mono font-semibold text-textpri mb-4">
          {isLoading ? '-' : activeZones}
        </div>
        <div className="text-xs text-textmuted">{onlineVenues} / {venues.length} venues online</div>
      </div>

      {/* Card 3 (Alerts) */}
      <div className="bg-white border border-bordercol rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-medium text-textsec">Alerts Fired Today</span>
          <div className="w-8 h-8 flex items-center justify-center text-lvlHigh">
            <AlertTriangle size={20} strokeWidth={1.5} />
          </div>
        </div>
        <div className="text-4xl font-mono font-semibold text-lvlHigh mb-4">
           {isLoading ? '-' : <CountUp end={3} duration={800} />} {/* Hardcoded for demo UI spec */}
        </div>
        <div className="text-xs text-textmuted">↓ 2% vs yesterday</div>
      </div>

      {/* Card 4 (Confidence) */}
      <div className="bg-white border border-bordercol rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-medium text-textsec">Avg Confidence Score</span>
          <div className="w-8 h-8 flex items-center justify-center text-lvlLow">
            <CheckCircle size={20} strokeWidth={1.5} />
          </div>
        </div>
        <div className="text-4xl font-mono font-semibold text-textpri mb-4">
          {isLoading ? '-' : <CountUp end={94} duration={800} />}<span className="text-2xl text-textsec">%</span>
        </div>
        <div className="text-xs text-textmuted">Across 9 sensors</div>
      </div>
    </div>
  );
};

export default StatCards;
