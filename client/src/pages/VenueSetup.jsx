import { useState } from 'react';
import useVenueStore from '../store/venueStore';
import { Settings, Save, Map as MapIcon, Wifi, Filter } from 'lucide-react';

const VenueSetup = () => {
    const { venues } = useVenueStore();
    const [selectedId, setSelectedId] = useState(venues[0]?.venueId || '');
    
    const venue = venues.find(v => v.venueId === selectedId);

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-textpri mb-1">Venue Configuration</h1>
                    <p className="text-sm text-textsec">Manage zone thresholds, sensors, and risk weightages.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Left Nav */}
                <div className="md:col-span-1 space-y-2">
                    {venues.map(v => (
                        <button 
                            key={v.venueId}
                            onClick={() => setSelectedId(v.venueId)}
                            className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                                selectedId === v.venueId 
                                    ? 'bg-primary border-primary text-white shadow-sm' 
                                    : 'bg-white border-bordercol text-textsec hover:bg-gray-50'
                            }`}
                        >
                            <span className="block truncate">{v.name}</span>
                            <span className={`text-[10px] font-mono mt-0.5 ${selectedId === v.venueId ? 'text-white/70' : 'text-textmuted'}`}>
                                {v.zones.length} Zones
                            </span>
                        </button>
                    ))}
                    <button className="w-full text-center px-4 py-3 rounded-xl border border-dashed border-bordercol text-sm font-medium text-primary hover:bg-gray-50 transition-colors mt-4">
                        + Register Venue
                    </button>
                </div>

                {/* Right Content */}
                <div className="md:col-span-3 space-y-6">
                    {venue ? (
                        <>
                            {/* General Settings */}
                            <div className="bg-white border border-bordercol rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-accentbg text-primary flex items-center justify-center">
                                        <Settings size={18} strokeWidth={1.5} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-textpri">General Profile</h2>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-textmuted uppercase tracking-wider mb-1.5">Venue Name</label>
                                        <input type="text" defaultValue={venue.name} className="w-full px-3 py-2 bg-pagebg border border-bordercol rounded-lg text-sm text-textpri focus:ring-1 focus:ring-primary outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-textmuted uppercase tracking-wider mb-1.5">Category</label>
                                        <select defaultValue={venue.type} className="w-full px-3 py-2 bg-pagebg border border-bordercol rounded-lg text-sm text-textpri focus:ring-1 focus:ring-primary outline-none">
                                            <option value="railway">Railway Transit</option>
                                            <option value="mall">Retail / Mall</option>
                                            <option value="stadium">Sports / Stadium</option>
                                            <option value="pandal">Festival Pandal</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Zone Thresholds */}
                            <div className="bg-white border border-bordercol rounded-2xl p-6 shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-accentbg text-primary flex items-center justify-center">
                                        <Filter size={18} strokeWidth={1.5} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-textpri">Zone Thresholds (Pax)</h2>
                                </div>

                                <div className="space-y-4">
                                    {venue.zones.map(zone => (
                                        <div key={zone.zoneId} className="border border-bordercol rounded-lg p-4 bg-gray-50/50">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-sm font-semibold text-textpri flex items-center gap-2">
                                                    <MapIcon size={14} className="text-textsec" /> {zone.name}
                                                </h3>
                                                <span className="text-[10px] font-mono text-textmuted bg-white border border-bordercol px-2 py-0.5 rounded">
                                                    Cap: {zone.capacity}
                                                </span>
                                            </div>

                                            {/* Threshold Inputs */}
                                            <div className="grid grid-cols-4 gap-3">
                                                <div>
                                                    <label className="block text-[10px] font-mono text-lvlLow mb-1 font-semibold">LOW</label>
                                                    <input type="number" defaultValue={zone.thresholds.low} className="w-full px-2 py-1.5 bg-white border border-bordercol rounded text-sm outline-none" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-mono text-lvlMed mb-1 font-semibold">MEDIUM</label>
                                                    <input type="number" defaultValue={zone.thresholds.medium} className="w-full px-2 py-1.5 bg-white border border-bordercol rounded text-sm outline-none" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-mono text-lvlHigh mb-1 font-semibold">HIGH</label>
                                                    <input type="number" defaultValue={zone.thresholds.high} className="w-full px-2 py-1.5 bg-white border border-bordercol rounded text-sm outline-none" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-mono text-lvlCrit mb-1 font-semibold">CRITICAL</label>
                                                    <input type="number" defaultValue={zone.thresholds.critical} className="w-full px-2 py-1.5 bg-white border border-bordercol rounded text-sm outline-none font-bold text-lvlCrit" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex justify-end">
                                <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium shadow-sm hover:bg-primarylight transition-colors flex items-center gap-2">
                                    <Save size={16} /> Save Changes
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="h-48 border-2 border-dashed border-bordercol rounded-2xl flex items-center justify-center text-textsec">
                            Select a venue to configure
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VenueSetup;
