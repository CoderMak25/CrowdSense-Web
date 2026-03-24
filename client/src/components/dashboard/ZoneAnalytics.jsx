import { Activity, Map as MapIcon } from 'lucide-react';

const getLevelClass = (level) => {
    switch (level) {
        case 'CRITICAL': return 'bg-lvlCrit/15 text-lvlCrit border-lvlCrit/30';
        case 'HIGH': return 'bg-lvlHigh/15 text-lvlHigh border-lvlHigh/30';
        case 'MEDIUM': return 'bg-lvlMed/15 text-lvlMed border-lvlMed/30';
        case 'LOW': return 'bg-lvlLow/15 text-lvlLow border-lvlLow/30';
        default: return 'bg-gray-100 text-textsec border-gray-200';
    }
};

const ZoneAnalytics = ({ zones }) => {
    if (!zones || zones.length === 0) {
        return <div className="h-48 flex items-center justify-center text-textsec">No zone data available</div>;
    }

    return (
        <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-bordercol/80">
                        <th className="pb-3 text-xs font-medium text-textmuted uppercase tracking-wider font-mono">Zone Name</th>
                        <th className="pb-3 text-xs font-medium text-textmuted uppercase tracking-wider font-mono">Live Count</th>
                        <th className="pb-3 text-xs font-medium text-textmuted uppercase tracking-wider font-mono">Status</th>
                        <th className="pb-3 text-xs font-medium text-textmuted uppercase tracking-wider font-mono text-right">Sensors Active</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-bordercol/30">
                    {zones.map((zone) => (
                        <tr key={zone.zoneId} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 pr-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-textsec group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-bordercol">
                                        <MapIcon size={16} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-sm font-medium text-textpri">{zone.zoneName}</span>
                                </div>
                            </td>
                            <td className="py-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-mono font-medium text-textpri">
                                        {zone.count?.toLocaleString() || 0}
                                    </span>
                                    {zone.densityLabel === 'CRITICAL' && (
                                        <Activity size={14} className="text-lvlCrit animate-pulse" />
                                    )}
                                </div>
                            </td>
                            <td className="py-4">
                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getLevelClass(zone.densityLabel)}`}>
                                    {zone.densityLabel}
                                </span>
                            </td>
                            <td className="py-4 text-right">
                                <div className="flex justify-end gap-1.5">
                                    {zone.sensorSources?.map(sensor => (
                                        <span key={sensor} className="px-1.5 py-0.5 max-w-[50px] truncate text-[10px] font-mono text-textsec bg-gray-100 rounded border border-gray-200" title={sensor}>
                                            {sensor}
                                        </span>
                                    ))}
                                    {(!zone.sensorSources || zone.sensorSources.length === 0) && (
                                         <span className="text-xs text-textmuted">-</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ZoneAnalytics;
