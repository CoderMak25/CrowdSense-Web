import { Video } from 'lucide-react';

const AlertLog = () => {
    return (
        <div className="flex flex-col h-full">
            {/* Highlighted Alert (Critical) */}
            <div className="bg-[#FFFFFF] border border-[#DC2626]/20 rounded-[12px] p-4 mb-4 relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#DC2626] animate-pulse"></div>
                <h3 className="text-base font-semibold text-[#0D0D0D] leading-tight">Gate A — CRITICAL</h3>
                <p className="text-xs font-light text-[#6B6B6B] mt-1.5">Zone: Gate A | Risk Score: 87/100</p>
                <p className="text-[11px] font-mono-custom text-[#9E9E9E] mt-2 mb-3">08:42 AM – ongoing</p>
                <button className="w-full bg-gradient-to-r from-[#1A5C38] to-[#2D8B55] text-white text-sm font-medium py-2 rounded-full hover:opacity-90 transition-all flex justify-center items-center gap-2 relative z-10 shadow-sm border-none">
                    <Video className="w-4 h-4" strokeWidth={2} /> View Zone
                </button>
            </div>
            
            {/* Divider */}
            <div className="h-px w-full bg-[#E8E8E8] mb-3"></div>
            
            {/* Alert List */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                <div className="flex justify-between items-start group cursor-pointer hover:bg-[#F5F5F5] p-1.5 -mx-1.5 rounded-lg transition-colors">
                    <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#EA580C] mt-1.5 flex-shrink-0"></div>
                        <div>
                            <h4 className="text-sm font-medium text-[#0D0D0D]">Concourse B</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="bg-[#FFF3CD] text-[#856404] text-[10px] font-medium px-2 py-0.5 rounded-full">HIGH</span>
                            </div>
                        </div>
                    </div>
                    <span className="text-[11px] font-mono-custom text-[#9E9E9E] mt-1">08:15 AM</span>
                </div>
                
                <div className="flex justify-between items-start group cursor-pointer hover:bg-[#F5F5F5] p-1.5 -mx-1.5 rounded-lg transition-colors">
                    <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#D97706] mt-1.5 flex-shrink-0"></div>
                        <div>
                            <h4 className="text-sm font-medium text-[#0D0D0D]">Platform 4</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="bg-[#FEF3C7] text-[#D97706] text-[10px] font-medium px-2 py-0.5 rounded-full">MEDIUM</span>
                            </div>
                        </div>
                    </div>
                    <span className="text-[11px] font-mono-custom text-[#9E9E9E] mt-1">07:50 AM</span>
                </div>
            </div>
        </div>
    );
};

export default AlertLog;
