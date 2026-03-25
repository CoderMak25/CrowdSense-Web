import { Train, ShoppingBag, Star, Tent } from 'lucide-react';

const VenueList = () => {
    return (
        <div className="space-y-4 flex-1 overflow-y-auto pr-1 h-full">
            <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                        <Train className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-[#0D0D0D]">CSMT Railway</h4>
                        <p className="text-xs font-light text-[#6B6B6B]">Last surge: 2h ago</p>
                    </div>
                </div>
                <span className="bg-[#EBF5EF] text-[#1A5C38] text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 border border-[#3D9E68]/20">LOW</span>
            </div>

            <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                        <Train className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-[#0D0D0D]">Dadar Station</h4>
                        <p className="text-xs font-light text-[#6B6B6B]">Last surge: 10m ago</p>
                    </div>
                </div>
                <span className="bg-[#FFF3CD] text-[#EA580C] text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0">HIGH</span>
            </div>

            <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
                        <ShoppingBag className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-[#0D0D0D]">Phoenix Mall</h4>
                        <p className="text-xs font-light text-[#6B6B6B]">Last surge: 1d ago</p>
                    </div>
                </div>
                <span className="bg-[#FEF3C7] text-[#D97706] text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0">MEDIUM</span>
            </div>

            <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                        <Star className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-[#0D0D0D]">Lalbaugcha Raja</h4>
                        <p className="text-xs font-light text-[#6B6B6B]">Last surge: Live</p>
                    </div>
                </div>
                <span className="bg-[#FEE2E2] text-[#DC2626] text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 border border-[#DC2626]/20">CRITICAL</span>
            </div>
            
            <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                        <Tent className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-[#0D0D0D]">Wankhede</h4>
                        <p className="text-xs font-light text-[#6B6B6B]">Last surge: 3d ago</p>
                    </div>
                </div>
                <span className="bg-[#EBF5EF] text-[#1A5C38] text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 border border-[#3D9E68]/20">LOW</span>
            </div>
        </div>
    );
};

export default VenueList;
