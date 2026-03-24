import { useState } from 'react';
import { Play, Square, Settings2, Activity } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Simulation = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [scenario, setScenario] = useState('surge_festive');

    const startSim = async () => {
        setIsRunning(true);
        toast.success("Simulation Sequence Initiated");
        try {
            await api.get('/demo/simulate');
        } catch (e) {
            toast.error("Simulation failed to start");
            setIsRunning(false);
        }
    };

    const stopSim = async () => {
        setIsRunning(false);
        toast("Simulation Halted", { icon: '🛑' });
        try {
            await api.get('/demo/reset');
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-textpri mb-1">Stress Test Simulation</h1>
                <p className="text-sm text-textsec">Trigger controlled crowd anomalies to test system response.</p>
            </div>

            <div className={`border-2 rounded-2xl p-8 transition-colors ${isRunning ? 'border-primary/50 bg-primary/5' : 'border-bordercol bg-white'} shadow-sm relative overflow-hidden`}>
                
                {/* Background pulse effect when running */}
                {isRunning && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
                )}
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isRunning ? 'bg-primary text-white animate-bounce' : 'bg-gray-100 text-textsec'}`}>
                            <Activity size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-textpri">Control Panel</h2>
                            <p className="text-sm text-textmuted font-mono">{isRunning ? 'Running Sequence...' : 'System Idle'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-textpri mb-2">Scenario Profile</label>
                            <div className="relative">
                                <Settings2 className="absolute left-3 top-1/2 -translate-y-1/2 text-textmuted" size={16} />
                                <select 
                                    className="w-full pl-10 pr-4 py-2.5 bg-pagebg border border-bordercol rounded-lg text-sm text-textpri outline-none focus:ring-2 ring-primary/20"
                                    value={scenario}
                                    onChange={(e) => setScenario(e.target.value)}
                                    disabled={isRunning}
                                >
                                    <option value="surge_festive">Festive Return Rush (30s)</option>
                                    <option value="train_cancel">Train Cancellation Spillage (45s)</option>
                                    <option value="stampede_drill">Stampede Red-Drill (15s)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-textpri mb-2">Target Inject Venue</label>
                            <div className="px-4 py-2.5 bg-gray-50 border border-bordercol rounded-lg text-sm text-textsec font-mono">
                                csmt01 [Demo Default]
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-bordercol/50">
                        {!isRunning ? (
                            <button 
                                onClick={startSim}
                                className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium shadow-sm hover:bg-primarylight transition-colors flex items-center gap-2"
                            >
                                <Play size={18} fill="currentColor" /> Run Scenario
                            </button>
                        ) : (
                            <button 
                                onClick={stopSim}
                                className="px-6 py-2.5 bg-lvlCrit text-white rounded-lg font-medium shadow-sm hover:bg-red-600 transition-colors flex items-center gap-2"
                            >
                                <Square size={18} fill="currentColor" /> Emergency Stop
                            </button>
                        )}
                        
                        <div className="text-xs text-textsec">
                            Ensure websocket dashboard is open in another tab to observe real-time impact.
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-bordercol rounded-2xl p-6 shadow-sm">
                 <h3 className="text-sm font-semibold text-textpri mb-4">Injection Log</h3>
                 <div className="h-48 bg-gray-900 rounded-lg p-4 font-mono text-[10px] text-green-400 overflow-y-auto space-y-1">
                     <p>{">"} System Ready. Engine loaded predicting engine v2.0</p>
                     {isRunning && (
                         <>
                           <p className="text-yellow-400">{">"} 00:01 - Emitting 500+ fake CCTV detections over 30s...</p>
                           <p className="text-yellow-400">{">"} 00:02 - Triggering Fusion cycle immediately...</p>
                         </>
                     )}
                 </div>
            </div>
        </div>
    );
};

export default Simulation;
