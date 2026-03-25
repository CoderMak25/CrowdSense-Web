import { useMemo } from 'react';

const ZoneAnalytics = ({ zones }) => {
    // Generate bars based on zones or fallback to demo data to match the HTML look
    const displayZones = useMemo(() => {
        if (zones && zones.length > 0) {
            return zones.map(z => ({
                id: z.zoneId,
                name: z.zoneName.substring(0, 3).toUpperCase(),
                percentage: Math.min(100, Math.round((z.count / (z.capacity || 100)) * 100)),
                isActive: z.densityLabel === 'CRITICAL' || z.densityLabel === 'HIGH'
            }));
        }
        
        // Fallback demo data mapping perfectly to the provided HTML design
        return [
            { id: 'g-a', name: 'G-A', percentage: 70, isStriped: true },
            { id: 'pl-1', name: 'PL-1', percentage: 85, isSolid: true },
            { id: 'pl-2', name: 'PL-2', percentage: 65, isActive: true, activeValue: '74%' },
            { id: 'con', name: 'CON', percentage: 90, isSolid: true },
            { id: 'mal', name: 'MAL', percentage: 50, isStriped: true },
            { id: 'sta', name: 'STA', percentage: 60, isStriped: true },
            { id: 'pan', name: 'PAN', percentage: 45, isStriped: true },
        ];
    }, [zones]);

    return (
        <div className="flex-1 flex items-end justify-between px-2 pt-8 gap-3">
            {displayZones.map((z, i) => {
                if (z.isActive) {
                    // Active/Selected Bar with Label
                    return (
                        <div key={z.id} className="w-full flex flex-col items-center gap-3 group" style={{ height: `${z.percentage}%` }}>
                            <div className="w-full max-w-[48px] bg-[#3D9E68] rounded-full h-full shadow-sm relative group-hover:opacity-90 transition-opacity">
                                {/* Tooltip Bubble */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#FFFFFF] border border-[#E8E8E8] text-[#1A5C38] text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap z-10">
                                    {z.activeValue || `${z.percentage}%`}
                                    <div className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#FFFFFF] border-b border-r border-[#E8E8E8] rotate-45"></div>
                                </div>
                                {/* Selection dot indicator */}
                                <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full border border-[#1A5C38] bg-white"></div>
                            </div>
                            <span className="text-xs font-medium text-[#0D0D0D]">{z.name}</span>
                        </div>
                    );
                }

                if (z.isSolid) {
                    // Medium Density Bar
                    return (
                        <div key={z.id} className="w-full flex flex-col items-center gap-3 group" style={{ height: `${z.percentage}%` }}>
                            <div className="w-full max-w-[48px] bg-[#1A5C38] rounded-full h-full shadow-sm group-hover:opacity-90 transition-opacity"></div>
                            <span className="text-xs font-medium text-[#9E9E9E]">{z.name}</span>
                        </div>
                    );
                }

                // Inactive/Striped Bar
                return (
                    <div key={z.id} className="w-full flex flex-col items-center gap-3 group" style={{ height: `${z.percentage}%` }}>
                        <div className="w-full max-w-[48px] bg-striped rounded-full h-full border border-[#E8E8E8] group-hover:opacity-80 transition-opacity bg-white"></div>
                        <span className="text-xs font-medium text-[#9E9E9E]">{z.name}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default ZoneAnalytics;
