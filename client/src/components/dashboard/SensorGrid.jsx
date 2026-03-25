import { MapPin, Bluetooth, Cctv, Activity, Wifi, WifiOff } from 'lucide-react';

const SensorGrid = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            
            <div className="flex items-center justify-between h-12 group hover:bg-[#F5F5F5] rounded-lg px-2 -mx-2 transition-colors cursor-default">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-blue-600" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#0D0D0D] leading-tight">GPS Array</span>
                        <span className="text-[11px] font-light text-[#6B6B6B] mt-0.5">Last reading: 2s ago</span>
                    </div>
                </div>
                <span className="text-[10px] font-medium text-[#1A5C38] bg-[#EBF5EF] px-2 py-0.5 rounded-full border border-[#3D9E68]/20">Completed</span>
            </div>

            <div className="flex items-center justify-between h-12 group hover:bg-[#F5F5F5] rounded-lg px-2 -mx-2 transition-colors cursor-default">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                        <Bluetooth className="w-4 h-4 text-cyan-600" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#0D0D0D] leading-tight">BLE Beacons</span>
                        <span className="text-[11px] font-light text-[#6B6B6B] mt-0.5">Last reading: 1s ago</span>
                    </div>
                </div>
                <span className="text-[10px] font-medium text-[#856404] bg-[#FFF3CD] px-2 py-0.5 rounded-full">In Progress</span>
            </div>

            <div className="flex items-center justify-between h-12 group hover:bg-[#F5F5F5] rounded-lg px-2 -mx-2 transition-colors cursor-default">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Cctv className="w-4 h-4 text-indigo-600" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#0D0D0D] leading-tight">CCTV Vision</span>
                        <span className="text-[11px] font-light text-[#6B6B6B] mt-0.5">Last reading: 0.5s ago</span>
                    </div>
                </div>
                <span className="text-[10px] font-medium text-[#1A5C38] bg-[#EBF5EF] px-2 py-0.5 rounded-full border border-[#3D9E68]/20">Completed</span>
            </div>

            <div className="flex items-center justify-between h-12 group hover:bg-[#F5F5F5] rounded-lg px-2 -mx-2 transition-colors cursor-default">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Activity className="w-4 h-4 text-purple-600" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#0D0D0D] leading-tight">Accelerometer</span>
                        <span className="text-[11px] font-light text-[#6B6B6B] mt-0.5">Last reading: 5s ago</span>
                    </div>
                </div>
                <span className="text-[10px] font-medium text-[#6B6B6B] bg-[#F0F0F0] px-2 py-0.5 rounded-full">Pending</span>
            </div>
            
            <div className="flex items-center justify-between h-12 group hover:bg-[#F5F5F5] rounded-lg px-2 -mx-2 transition-colors cursor-default">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Wifi className="w-4 h-4 text-orange-600" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#0D0D0D] leading-tight">WiFi Probes</span>
                        <span className="text-[11px] font-light text-[#6B6B6B] mt-0.5">Last reading: 12s ago</span>
                    </div>
                </div>
                <span className="text-[10px] font-medium text-[#856404] bg-[#FFF3CD] px-2 py-0.5 rounded-full">In Progress</span>
            </div>

            <div className="flex items-center justify-between h-12 group hover:bg-[#F5F5F5] rounded-lg px-2 -mx-2 transition-colors cursor-default">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <WifiOff className="w-4 h-4 text-slate-500" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col">
                        {/* Note text-[#9E9E9E] was combined with text-[#0D0D0D] in HTML snippet — keeping muted variant */}
                        <span className="text-sm font-medium text-[#9E9E9E] leading-tight">Cellular Data</span>
                        <span className="text-[11px] font-light text-[#DC2626] mt-0.5">Offline</span>
                    </div>
                </div>
                <span className="text-[10px] font-medium text-[#6B6B6B] bg-[#F0F0F0] px-2 py-0.5 rounded-full">Pending</span>
            </div>

        </div>
    );
};

export default SensorGrid;
