import { useState, useEffect } from 'react';
import useVenueStore from '../store/venueStore';
import api from '../services/api';
import { Calendar, Download, TrendingUp, AlertTriangle } from 'lucide-react';

// A simple CSS-based Bar Chart to avoid large dependencies like Recharts for a clean demo
const SimpleBarChart = ({ data }) => {
    if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center text-textsec">No data available</div>;

    const maxVal = Math.max(...data.map(d => d.peak));

    return (
        <div className="h-64 flex items-end gap-2 pb-6 pt-2 w-full mt-4 border-b border-bordercol relative">
            {/* Y-Axis lines */}
            <div className="absolute top-0 w-full border-t border-bordercol/50 border-dashed z-0"></div>
            <div className="absolute top-1/2 w-full border-t border-bordercol/50 border-dashed z-0"></div>
            
            {data.map((item, i) => {
                const heightPct = (item.peak / maxVal) * 100;
                return (
                    <div key={i} className="flex-1 flex flex-col justify-end items-center h-full relative z-10 group">
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-textpri text-white text-[10px] px-2 py-1 rounded whitespace-nowrap transition-opacity pointer-events-none mb-2 font-mono">
                            {item.peak.toLocaleString()} max
                        </div>
                        {/* Bar */}
                        <div 
                           className="w-full max-w-[40px] bg-primary/20 hover:bg-primary rounded-t-sm transition-colors cursor-pointer"
                           style={{ height: `${Math.max(5, heightPct)}%` }}
                        ></div>
                        {/* X-Axis Label */}
                        <div className="absolute -bottom-6 text-[10px] text-textsec font-mono whitespace-nowrap transform -rotate-45 origin-top-left mt-1">
                            {item.date.split('-').slice(1).join('/')}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const Analytics = () => {
  const { venues, selectedVenue, selectVenue } = useVenueStore();
  const [data, setData] = useState(null);
  const [range, setRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!selectedVenue) return;
      setLoading(true);
      try {
          const res = await api.get(`/analytics/${selectedVenue.venueId}?range=${range}`);
          setData(res.data);
      } catch (err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
    };
    fetchAnalytics();
  }, [selectedVenue, range]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-textpri mb-1">Historical Analytics</h1>
          <p className="text-sm text-textsec">Long-term trends and post-incident analysis.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-bordercol shadow-sm">
          {['7d', '30d', '90d'].map((r) => (
             <button 
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${range === r ? 'bg-primary text-white shadow' : 'text-textsec hover:bg-gray-50'}`}
             >
                 {r.toUpperCase()}
             </button>
          ))}
        </div>
      </div>

      {loading ? (
          <div className="h-96 flex items-center justify-center text-textsec">Loading intelligence...</div>
      ) : (
          <>
            <div className="bg-white border border-bordercol rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-base font-semibold text-textpri">Peak Density Trends</h2>
                        <p className="text-xs text-textsec">Maximum daily crowd counts across all zones</p>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-textsec border border-bordercol rounded-lg hover:bg-gray-50 transition-colors">
                        <Download size={14} /> Export CSV
                    </button>
                </div>
                
                <SimpleBarChart data={data?.dailyCounts || []} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div className="bg-white border border-bordercol rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-base font-semibold text-textpri">Alert Frequency</h2>
                        <AlertTriangle className="text-textmuted" size={18} />
                    </div>
                    <div className="space-y-4">
                        {Object.entries(data?.alerts || {}).map(([level, count]) => (
                            <div key={level}>
                                <div className="flex justify-between text-sm mb-1 font-medium text-textpri">
                                    <span>{level} Warnings</span>
                                    <span>{count}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${level === 'CRITICAL' ? 'bg-lvlCrit' : level === 'HIGH' ? 'bg-lvlHigh' : 'bg-lvlMed'}`} 
                                      style={{ width: `${Math.min((count / 50) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {(!data?.alerts || Object.keys(data.alerts).length === 0) && (
                            <p className="text-sm text-textsec">No alerts recorded in this period.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white border border-bordercol rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-base font-semibold text-textpri">Sensor Yield Confidence</h2>
                        <TrendingUp className="text-textmuted" size={18} />
                    </div>
                    <div className="space-y-4">
                        {Object.entries(data?.sensorReliability || {}).map(([sensor, conf]) => (
                            <div key={sensor} className="flex items-center justify-between border-b border-bordercol/30 pb-3 last:border-0 last:pb-0">
                                <span className="text-sm font-medium text-textpri capitalize">{sensor} Feed</span>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${conf > 0.85 ? 'bg-lvlLow/15 text-lvlLow' : 'bg-lvlMed/15 text-lvlMed'}`}>
                                        {(conf * 100).toFixed(1)}% Acc
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </>
      )}

    </div>
  );
};

export default Analytics;
