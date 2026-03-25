import { Pause } from 'lucide-react';

const YoloFeed = ({ zones }) => {
    return (
        <div className="ui-card-dark stat-card-gradient flex flex-col relative group h-full p-5 !border-none !rounded-[16px]">
            <div className="flex justify-between items-center mb-4 relative z-10">
                <h2 className="text-base font-medium text-white">Live Feed</h2>
                <span className="bg-white/15 text-white text-[11px] font-medium px-2 py-0.5 rounded-full">CAM-04</span>
            </div>
            
            {/* Video Placeholder Area */}
            <div className="w-full bg-black rounded-[10px] aspect-[4/3] sm:aspect-video lg:aspect-[4/3] relative overflow-hidden flex-1 shadow-inner border border-white/10 z-10">
                {/* Overlay Image (simulating feed) */}
                <div className="absolute inset-0 bg-[#2D7A4F]/20 mix-blend-overlay"></div>
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                {/* Badges Overlay */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-white/10">
                    <div className="w-1.5 h-1.5 bg-[#DC2626] rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-semibold text-white uppercase tracking-wider">Live</span>
                </div>
                
                <div className="absolute top-2 left-1/2 -translate-x-1/2">
                    <span className="text-xs font-semibold text-white drop-shadow-md">94 persons</span>
                </div>
                
                {/* Simulated Detection Boxes */}
                <div className="absolute top-[30%] left-[20%] w-12 h-20 border-2 border-[#3D9E68] rounded-sm">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3D9E68] text-[8px] font-mono-custom text-white px-1 rounded-sm">.92</div>
                </div>
                <div className="absolute top-[45%] left-[60%] w-10 h-16 border-2 border-[#3D9E68] rounded-sm">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3D9E68] text-[8px] font-mono-custom text-white px-1 rounded-sm">.88</div>
                </div>
                <div className="absolute top-[60%] left-[40%] w-14 h-24 border-2 border-[#1A5C38] rounded-sm">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1A5C38] text-[8px] font-mono-custom text-white px-1 rounded-sm">.75</div>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-2 right-2 flex items-center gap-2">
                    <button className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center backdrop-blur-sm transition-colors">
                        <Pause className="w-3 h-3 text-white fill-white" />
                    </button>
                    <span className="text-[10px] font-mono-custom text-white/50 bg-black/40 px-1 rounded">28.4 fps</span>
                </div>
            </div>
        </div>
    );
};

export default YoloFeed;
