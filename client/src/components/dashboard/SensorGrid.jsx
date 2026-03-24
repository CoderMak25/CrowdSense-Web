import { CheckCircle2, Wifi, Video, Bluetooth, Smartphone } from 'lucide-react';

const SENSORS = [
    { id: 'cctv', name: 'CCTV Feeds', icon: Video, active: 42, total: 45, type: 'primary' },
    { id: 'ble', name: 'BLE Beacons', icon: Bluetooth, active: 118, total: 120, type: 'secondary' },
    { id: 'wifi', name: 'WiFi Probes', icon: Wifi, active: 8, total: 8, type: 'secondary' },
    { id: 'app', name: 'App Events', icon: Smartphone, active: 'Live', total: '-', type: 'virtual' },
];

const SensorGrid = () => {
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-textpri">Sensor Network Status</h2>
                <button className="text-sm font-medium text-primary hover:text-primarylight transition-colors">
                    Manage Network
                </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 flex-1">
                {SENSORS.map(s => {
                    const statusColor = s.active === s.total || s.active === 'Live' ? 'text-lvlLow' : 'text-lvlMed';
                    const Icon = s.icon;
                    
                    return (
                        <div key={s.id} className="border border-bordercol rounded-xl p-4 flex flex-col justify-between hover:border-primary/30 transition-colors group cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-textsec group-hover:bg-accentbg group-hover:text-primary transition-colors">
                                    <Icon size={16} strokeWidth={1.5} />
                                </div>
                                <CheckCircle2 size={16} className={statusColor} />
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-medium text-textpri mb-1">{s.name}</h3>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-xl font-mono font-semibold text-textpri">{s.active}</span>
                                    <span className="text-xs text-textmuted font-mono">/ {s.total} online</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SensorGrid;
