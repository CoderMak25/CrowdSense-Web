import { useEffect, useState } from 'react';

const RiskScore = ({ riskScore }) => {
    // Determine color based on score (0-100)
    let colorClass = 'text-lvlLow';
    let label = 'Nominal';
    
    if (riskScore >= 80) {
        colorClass = 'text-lvlCrit';
        label = 'Critical Warning';
    } else if (riskScore >= 60) {
        colorClass = 'text-lvlHigh';
        label = 'Elevated Risk';
    } else if (riskScore >= 40) {
        colorClass = 'text-lvlMed';
        label = 'Moderate';
    }

    // SVG styling math for gauge
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (riskScore / 100) * circumference;

    return (
        <>
            <div className="flex items-center justify-between w-full mb-6">
                <h2 className="text-base font-semibold text-textpri">Stampede Risk</h2>
                <div className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-mono text-textsec border border-gray-200">
                    Live Calc
                </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center relative w-full">
                <svg className="transform -rotate-90 w-40 h-40">
                    {/* Background Circle */}
                    <circle 
                        cx="80" cy="80" r={radius} 
                        stroke="currentColor" strokeWidth="12" fill="transparent"
                        className="text-gray-100" 
                    />
                    {/* Progress Circle */}
                    <circle 
                        cx="80" cy="80" r={radius} 
                        stroke="currentColor" strokeWidth="12" fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className={`${colorClass} transition-all duration-1000 ease-in-out`}
                    />
                </svg>
                
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-mono font-bold tracking-tighter ${colorClass}`}>
                        {riskScore || 0}
                    </span>
                    <span className="text-[10px] text-textmuted font-medium uppercase tracking-wider mt-1">/ 100</span>
                </div>
            </div>
            
            <div className="mt-4 text-center w-full">
                <p className={`text-sm font-semibold ${colorClass}`}>{label}</p>
                <p className="text-xs text-textsec mt-1 px-4 leading-relaxed">
                    Based on density, surge rates, and anomalies across all zones.
                </p>
            </div>
        </>
    );
};

export default RiskScore;
