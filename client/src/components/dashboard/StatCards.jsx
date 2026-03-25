import { ArrowUpRight, TrendingUp, Activity, TrendingDown } from 'lucide-react';
import { useMemo } from 'react';
import useVenueStore from '../../store/venueStore';

const StatCards = ({ riskScore, zones, isLoading }) => {
    const { venues } = useVenueStore();
    
    const totalPersons = useMemo(() => zones.reduce((sum, z) => sum + (z.count || 0), 0), [zones]);
    const activeZones = zones.length;
    const alertsToday = useMemo(() => zones.filter(z => z.densityLabel === 'CRITICAL' || z.densityLabel === 'HIGH').length, [zones]);

    if (isLoading) {
        return (
            <>
                <div className="h-[180px] bg-gray-200 animate-pulse rounded-[16px]"></div>
                <div className="h-[180px] bg-gray-200 animate-pulse rounded-[16px]"></div>
                <div className="h-[180px] bg-gray-200 animate-pulse rounded-[16px]"></div>
                <div className="h-[180px] bg-gray-200 animate-pulse rounded-[16px]"></div>
            </>
        );
    }

    return (
        <>
            {/* Card 1 (Dark with gradient) */}
            <div className="ui-card-dark stat-card-gradient relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="text-sm font-normal text-white/80">Total Persons Detected</span>
                    <button className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <ArrowUpRight className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                    </button>
                </div>
                <div className="text-5xl font-semibold text-white tracking-tight relative z-10 mb-4 animate-[countUp_1.2s_ease-out]">
                    {totalPersons.toLocaleString()}
                </div>
                <div className="inline-flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-full text-[12px] font-normal text-white relative z-10">
                    <TrendingUp className="w-3 h-3" strokeWidth={2} />
                    Increased from last hour
                </div>
            </div>

            {/* Card 2 */}
            <div className="ui-card flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-normal text-[#6B6B6B]">Active Zones</span>
                    <button className="w-6 h-6 rounded-full border border-[#E8E8E8] flex items-center justify-center hover:bg-[#F5F5F5] transition-colors text-[#6B6B6B]">
                        <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                </div>
                <div className="text-5xl font-semibold text-[#0D0D0D] tracking-tight mb-4">{activeZones || 4}</div>
                <div className="inline-flex items-center gap-1.5 bg-[#F0F0F0] px-2.5 py-1 rounded-full text-[12px] font-normal text-[#6B6B6B]">
                    <Activity className="w-3 h-3 text-[#2D7A4F]" strokeWidth={2} />
                    {activeZones || 4} / {activeZones || 4} online
                </div>
            </div>

            {/* Card 3 */}
            <div className="ui-card flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-normal text-[#6B6B6B]">Alerts Fired Today</span>
                    <button className="w-6 h-6 rounded-full border border-[#E8E8E8] flex items-center justify-center hover:bg-[#F5F5F5] transition-colors text-[#6B6B6B]">
                        <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                </div>
                <div className="text-5xl font-semibold text-[#EA580C] tracking-tight mb-4">{alertsToday || 14}</div>
                <div className="inline-flex items-center gap-1.5 bg-[#F0F0F0] px-2.5 py-1 rounded-full text-[12px] font-normal text-[#6B6B6B]">
                    <TrendingDown className="w-3 h-3 text-[#6B6B6B]" strokeWidth={2} />
                    Down 2% vs yesterday
                </div>
            </div>

            {/* Card 4 */}
            <div className="ui-card flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-normal text-[#6B6B6B]">Avg Confidence Score</span>
                    <button className="w-6 h-6 rounded-full border border-[#E8E8E8] flex items-center justify-center hover:bg-[#F5F5F5] transition-colors text-[#6B6B6B]">
                        <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                </div>
                <div className="text-5xl font-semibold text-[#0D0D0D] tracking-tight mb-4">0.94</div>
                <div className="text-[12px] font-light text-[#6B6B6B] mt-1 pl-1">
                    Across 9 sensors
                </div>
            </div>
        </>
    );
};

export default StatCards;
