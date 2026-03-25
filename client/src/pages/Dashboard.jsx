import { Plus } from 'lucide-react';
import useVenueStore from '../store/venueStore';
import useCrowdData from '../hooks/useCrowdData';
import StatCards from '../components/dashboard/StatCards';
import ZoneAnalytics from '../components/dashboard/ZoneAnalytics';
import AlertLog from '../components/dashboard/AlertLog';
import VenueList from '../components/dashboard/VenueList';
import SensorGrid from '../components/dashboard/SensorGrid';
import RiskScore from '../components/dashboard/RiskScore';
import YoloFeed from '../components/dashboard/YoloFeed';

const Dashboard = () => {
  const { selectedVenue } = useVenueStore();
  const { zones, riskScore, isLoading } = useCrowdData(selectedVenue?.venueId);

  return (
    <div className="w-full h-full">
        <div className="max-w-[1400px] mx-auto w-full space-y-6 pb-12">
            
            {/* Page Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-[#0D0D0D] tracking-tight">Dashboard</h1>
                    <p className="text-sm font-light text-[#6B6B6B] mt-1">Monitor and prevent crowd surges across all venues.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-[#FFFFFF] border border-[#E8E8E8] text-[#0D0D0D] text-sm font-normal px-5 py-2.5 rounded-full hover:bg-[#F5F5F5] active:scale-[0.98] transition-all flex items-center gap-2">
                        Export Data
                    </button>
                    <button className="bg-gradient-to-r from-[#1A5C38] to-[#2D8B55] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm border-none">
                        <Plus className="w-4 h-4" strokeWidth={2} />
                        Add Venue
                    </button>
                </div>
            </div>

            {/* 4-Column Grid Layout Mapping Required HTML */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* ROW 1: STAT CARDS */}
                <StatCards riskScore={riskScore} zones={zones} isLoading={isLoading} />

                {/* ROW 2: Analytics, Alerts, Venues */}
                
                {/* Zone Analytics (Spans 2 cols) */}
                <div className="ui-card lg:col-span-2 flex flex-col min-h-[360px]">
                    <div className="mb-6">
                        <h2 className="text-base font-medium text-[#0D0D0D]">Zone Analytics</h2>
                        <p className="text-xs font-light text-[#6B6B6B] mt-0.5">Live crowd density per zone</p>
                    </div>
                    <ZoneAnalytics zones={zones} />
                </div>

                {/* Live Alerts (Spans 1 col) */}
                <div className="ui-card flex flex-col">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-base font-medium text-[#0D0D0D]">Live Alerts</h2>
                        <button className="text-[11px] font-medium text-[#1A5C38] border border-[#1A5C38]/20 bg-[#EBF5EF] px-2.5 py-1 rounded-full hover:bg-[#1A5C38]/10 transition-colors">
                            + Configure
                        </button>
                    </div>
                    <AlertLog />
                </div>

                {/* Active Venues (Spans 1 col) */}
                <div className="ui-card flex flex-col">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-base font-medium text-[#0D0D0D]">Venues</h2>
                        <button className="text-[11px] font-medium text-[#6B6B6B] border border-[#E8E8E8] bg-[#FFFFFF] px-2.5 py-1 rounded-full hover:bg-[#F5F5F5] transition-colors">
                            + New
                        </button>
                    </div>
                    <VenueList />
                </div>

                {/* ROW 3: Sensors, Risk, Feed */}
                
                {/* Sensor Status (Spans 2 cols) */}
                <div className="ui-card lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-base font-medium text-[#0D0D0D]">Sensor Status</h2>
                        <button className="text-[11px] font-medium text-[#6B6B6B] border border-[#E8E8E8] bg-[#FFFFFF] px-2.5 py-1 rounded-full hover:bg-[#F5F5F5] transition-colors">
                            + Add Sensor
                        </button>
                    </div>
                    <SensorGrid />
                </div>

                {/* Stampede Risk (Spans 1 col) */}
                <div className="ui-card flex flex-col items-center justify-between text-center relative">
                    <h2 className="text-base font-medium text-[#0D0D0D] w-full text-left mb-2">Stampede Risk Score</h2>
                    <RiskScore riskScore={riskScore} />
                </div>

                {/* Live Feed (Spans 1 col) */}
                <div className="ui-card flex flex-col relative group !p-0 overflow-hidden border-none" style={{ background: 'transparent' }}>
                    <YoloFeed zones={zones} />
                </div>

            </div>
        </div>
    </div>
  );
};

export default Dashboard;
