import { Video, Maximize } from 'lucide-react';
import { useState, useEffect } from 'react';

// Generates fake bouncing bounding boxes for the "Live Feed" effect
const BoundingBox = ({ initialX, initialY, color }) => {
    const [pos, setPos] = useState({ x: initialX, y: initialY });
    
    useEffect(() => {
        const interval = setInterval(() => {
            setPos(prev => ({
                x: prev.x + (Math.random() * 4 - 2), // jitter x
                y: prev.y + (Math.random() * 4 - 2)  // jitter y
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div 
            className="absolute border-2 transition-all duration-1000 ease-in-out"
            style={{ 
                left: `${pos.x}%`, 
                top: `${pos.y}%`, 
                width: '15%', 
                height: '35%', 
                borderColor: color,
                boxShadow: `0 0 8px ${color}40 inset, 0 0 8px ${color}40`
            }}
        >
            <div className="absolute -top-4 w-full text-center" style={{ color: color, fontSize: '8px', fontWeight: 'bold' }}>
                person 0.9{Math.floor(Math.random()*9)}
            </div>
        </div>
    );
};

const YoloFeed = ({ zones }) => {
    // Determine overall status from zones
    const isCritical = zones?.some(z => z.densityLabel === 'CRITICAL');
    const borderColor = isCritical ? 'border-lvlCrit' : 'border-lvlLow';
    const boxColors = isCritical ? ['#EF4444', '#EF4444', '#EF4444'] : ['#22C55E', '#22C55E', '#F59E0B'];

    return (
        <div className="bg-[#0f172a] rounded-2xl overflow-hidden relative shadow-sm hover:shadow-md transition-shadow h-full min-h-[250px] group flex flex-col border border-[#1e293b]">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex items-center gap-2">
                    <Video size={16} className={`animate-pulse ${isCritical ? 'text-lvlCrit' : 'text-lvlLow'}`} />
                    <span className="text-white text-xs font-medium font-mono">CAM-MainEntrance</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-white/70 text-[10px] uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded backdrop-blur">YOLOv8 Analysis</span>
                   <button className="text-white/70 hover:text-white bg-black/40 p-1 rounded backdrop-blur transition-colors">
                       <Maximize size={14} />
                   </button>
                </div>
            </div>

            {/* Video Content Fake Grid background */}
            <div className="flex-1 w-full h-full relative" 
                 style={{ 
                     backgroundImage: 'radial-gradient(circle, #1e293b 1px, transparent 1px)', 
                     backgroundSize: '20px 20px',
                     backgroundPosition: '0 0'
                 }}>
                
                {/* Simulated Bounding Boxes */}
                <BoundingBox initialX={20} initialY={30} color={boxColors[0]} />
                <BoundingBox initialX={45} initialY={40} color={boxColors[1]} />
                <BoundingBox initialX={70} initialY={25} color={boxColors[2]} />
                {isCritical && <BoundingBox initialX={55} initialY={20} color="#EF4444" />}
                {isCritical && <BoundingBox initialX={35} initialY={50} color="#EF4444" />}
                
                {/* Filter overlay */}
                <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent pointer-events-none"></div>

                {/* Status Bar Overlay */}
                <div className={`absolute bottom-0 left-0 right-0 text-center py-1.5 border-t ${borderColor} bg-black/60 backdrop-blur z-20`}>
                    <p className={`text-[10px] font-mono font-medium uppercase tracking-[0.2em] ${isCritical ? 'text-lvlCrit' : 'text-lvlLow'}`}>
                        {isCritical ? 'DANGER: CRUSH DETECTED' : 'NOMINAL FLOW'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default YoloFeed;
