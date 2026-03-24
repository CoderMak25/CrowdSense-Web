import { formatDistanceToNow } from 'date-fns';
import useAlertStore from '../../store/alertStore';
import { AlertTriangle, AlertOctagon, Info } from 'lucide-react';

const getAlertIcon = (level) => {
    switch (level) {
        case 'CRITICAL': return <AlertOctagon className="text-lvlCrit w-5 h-5 flex-shrink-0" />;
        case 'HIGH': return <AlertTriangle className="text-lvlHigh w-5 h-5 flex-shrink-0" />;
        default: return <Info className="text-lvlMed w-5 h-5 flex-shrink-0" />;
    }
};

const getRowClass = (level) => {
    switch (level) {
        case 'CRITICAL': return 'bg-lvlCrit/5 border-l-2 border-l-lvlCrit';
        case 'HIGH': return 'bg-lvlHigh/5 border-l-2 border-l-lvlHigh';
        default: return 'hover:bg-gray-50 border-l-2 border-l-transparent';
    }
};

const AlertLog = () => {
    const alerts = useAlertStore(state => state.alerts);

    const displayAlerts = alerts.length > 0 ? alerts : [
        { _id: '1', level: 'CRITICAL', zoneName: 'Platform 1', message: 'Critical overcrowding detected', timestamp: new Date(Date.now() - 60000) },
        { _id: '2', level: 'HIGH', zoneName: 'Gate A', message: 'High density warning', timestamp: new Date(Date.now() - 3600000) }
    ];

    if (displayAlerts.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-textmuted mt-4">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                    <Info className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm font-medium">No active alerts</p>
                <p className="text-xs mt-1">Venue conditions are nominal.</p>
            </div>
        );
    }

    return (
        <div className="mt-4 flex-1 overflow-y-auto -mx-6 px-4 space-y-2">
            {displayAlerts.map((alert) => (
                <div key={alert._id} className={`p-4 rounded-r-xl rounded-l-sm transition-colors flex gap-4 ${getRowClass(alert.level)}`}>
                    <div className="pt-0.5">
                        {getAlertIcon(alert.level)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-semibold text-textpri truncate pr-2">
                                {alert.zoneName}
                            </span>
                            <span className="text-[10px] text-textsec font-mono whitespace-nowrap pt-0.5">
                                {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                            </span>
                        </div>
                        <p className="text-xs text-textsec leading-relaxed line-clamp-2">
                            {alert.message}
                        </p>
                        
                        {alert.level === 'CRITICAL' && (
                            <div className="mt-3 flex gap-2">
                                <button className="px-3 py-1.5 bg-textpri text-white text-[10px] font-medium rounded shadow-sm hover:bg-gray-800 transition-colors">
                                    Dispatch Guards
                                </button>
                                <button className="px-3 py-1.5 bg-white border border-bordercol text-textpri text-[10px] font-medium rounded shadow-sm hover:bg-gray-50 transition-colors">
                                    Dismiss
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AlertLog;
