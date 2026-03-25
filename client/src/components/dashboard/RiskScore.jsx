const RiskScore = ({ riskScore = 72 }) => {
    // Determine status text based on score
    const getStatusText = (score) => {
        if (score >= 80) return 'Critical';
        if (score >= 60) return 'Elevated';
        return 'Moderate';
    };

    return (
        <div className="flex flex-col items-center justify-between text-center relative w-full h-full">
            {/* SVG Donut Chart */}
            <div className="relative w-[160px] h-[160px] mt-4 mb-2 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-180 scale-x-[-1]">
                    {/* Background Track */}
                    <path 
                        className="text-[#E8E8E8]" 
                        strokeWidth="4.5" 
                        stroke="currentColor" 
                        fill="none" 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        strokeLinecap="round"
                    />
                    {/* Colored Fill */}
                    <path 
                        className="text-[#1A5C38]" 
                        strokeDasharray={`${riskScore}, 100`} 
                        strokeWidth="4.5" 
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="none" 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-semibold text-[#1A5C38] tracking-tight leading-none mt-2">
                        {riskScore}<span className="text-xl">%</span>
                    </span>
                    <span className="text-[10px] font-light text-[#6B6B6B] mt-1 uppercase tracking-wider">
                        {getStatusText(riskScore)}
                    </span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 w-full mt-auto pt-4">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3D9E68]"></div>
                    <span className="text-[11px] font-light text-[#6B6B6B]">Safe</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1A5C38]"></div>
                    <span className="text-[11px] font-light text-[#6B6B6B]">Risk</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-striped border border-[#E8E8E8]"></div>
                    <span className="text-[11px] font-light text-[#6B6B6B]">N/A</span>
                </div>
            </div>
        </div>
    );
};

export default RiskScore;
