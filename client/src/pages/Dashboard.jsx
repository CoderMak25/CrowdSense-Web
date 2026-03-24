import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import useVenueStore from '../store/venueStore';
import useCrowdData from '../hooks/useCrowdData';
import StatCards from '../components/dashboard/StatCards';

import ZoneAnalytics from '../components/dashboard/ZoneAnalytics';
import AlertLog from '../components/dashboard/AlertLog';
import SensorGrid from '../components/dashboard/SensorGrid';
import RiskScore from '../components/dashboard/RiskScore';
import YoloFeed from '../components/dashboard/YoloFeed';

const Dashboard = () => {
  const { selectedVenue } = useVenueStore();
  const { zones, riskScore, isLoading } = useCrowdData(selectedVenue?.venueId);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-textpri mb-1">Dashboard</h1>
          <p className="text-sm text-textsec">Monitor and prevent crowd surges across all venues.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
             className="px-4 py-2 bg-pagebg border border-bordercol rounded-lg text-sm font-medium text-textpri focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
             value={selectedVenue?.venueId || ''}
             onChange={(e) => useVenueStore.getState().selectVenue(e.target.value)}
          >
             {useVenueStore.getState().venues.map(v => (
                 <option key={v.venueId} value={v.venueId}>{v.name}</option>
             ))}
          </select>
          <button className="px-4 py-2 bg-white border border-bordercol rounded-lg text-sm font-medium text-primary hover:bg-gray-50 transition-colors shadow-sm hidden md:block">
            Export Data
          </button>
          <button className="px-4 py-2 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primarylight transition-colors shadow-sm flex items-center gap-2">
            <PlusCircle size={18} strokeWidth={1.5} />
            Add Venue
          </button>
        </div>
      </div>

      <StatCards riskScore={riskScore} zones={zones} isLoading={isLoading} />

      {/* Main Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
        {/* LEFT 60%: Zone Analytics */}
        <div className="lg:col-span-3 bg-white border border-bordercol rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out flex flex-col min-h-[350px]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-textpri">Zone Analytics {selectedVenue ? `- ${selectedVenue.name}` : ''}</h2>
            <button className="text-textsec hover:text-textpri">•••</button>
          </div>
          <ZoneAnalytics zones={zones} />
        </div>

        {/* RIGHT 40%: Live Alerts */}
        <div className="lg:col-span-2 bg-white border border-bordercol rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out flex flex-col min-h-[350px]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-textpri">Live Alerts</h2>
            <button className="px-3 py-1 text-xs font-medium text-primary border border-primary/30 rounded-full hover:bg-accentbg transition-colors flex items-center">
              Configure
            </button>
          </div>
          <AlertLog />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
        
        {/* LEFT 40%: Sensor Status */}
        <div className="lg:col-span-4 bg-white border border-bordercol rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out">
          <SensorGrid />
        </div>

        {/* CENTER 30%: Stampede Risk */}
        <div className="lg:col-span-3 bg-white border border-bordercol rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out flex flex-col items-center">
          <RiskScore riskScore={riskScore} />
        </div>

        {/* RIGHT 30%: Live Feed Stack */}
        <div className="lg:col-span-3 flex flex-col gap-5">
           <YoloFeed zones={zones} />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
