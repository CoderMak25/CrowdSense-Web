import { Link } from 'react-router-dom';
import { Shield, Activity, Bell, MapPin, BarChart3, Smartphone, Zap, ArrowRight, Video, ChevronRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F5] overflow-x-hidden font-sans text-[#0D0D0D]">
      
      {/* Floating Pill Navigation */}
      <div className="fixed top-6 left-0 right-0 z-50 px-4 md:px-8 flex justify-center">
        <nav className="w-full max-w-5xl bg-white/90 backdrop-blur-md border border-[#E8E8E8] shadow-sm rounded-full h-16 flex items-center justify-between px-6 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#EBF5EF] flex items-center justify-center text-[#1A5C38]">
              <Shield size={18} strokeWidth={2} />
            </div>
            <span className="font-semibold text-lg tracking-tight">Crowd<span className="text-[#1A5C38]">Sense</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6B6B6B]">
            <a href="#features" className="hover:text-[#0D0D0D] transition-colors">Platform</a>
            <a href="#tech" className="hover:text-[#0D0D0D] transition-colors">Technology</a>
            <a href="#contact" className="hover:text-[#0D0D0D] transition-colors">Contact</a>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-5 py-2.5 bg-gradient-to-r from-[#1A5C38] to-[#2D8B55] text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-200">
              Go to Dashboard
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 lg:px-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#E8E8E8] shadow-sm rounded-full text-xs font-medium text-[#6B6B6B] mb-8">
            <span className="w-2 h-2 rounded-full bg-[#3D9E68] animate-pulse"></span>
            SIH 2025 Finalist — Crowd Intelligence
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-[80px] font-semibold tracking-tight leading-[1.05] mb-6">
            Prevent surges.
            <br />
            <span className="text-[#9E9E9E]">Protect cities.</span>
          </h1>
          
          <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Unifying CCTV, WiFi, and Bluetooth data into a single source of truth for real-time crowd management and automated alerts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#1A5C38] to-[#2D8B55] text-white font-medium rounded-full shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-200 flex items-center justify-center gap-2">
              Get Started <ArrowRight size={18} />
            </Link>
            <Link to="/commuter" className="w-full sm:w-auto px-8 py-3.5 bg-white border border-[#E8E8E8] text-[#0D0D0D] font-medium rounded-full shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-200 flex items-center justify-center gap-2">
              <Smartphone size={18} /> Public View
            </Link>
          </div>
        </div>

        {/* Hero Dashboard Preview (Styled like the real dashboard) */}
        <div className="w-full max-w-5xl mt-20 relative mx-auto group perspective-1000">
          <div className="ui-card flex flex-col md:flex-row gap-4 p-4 md:p-6 bg-white border border-[#E8E8E8] shadow-xl rounded-[24px]">
            {/* Left dark panel snippet */}
            <div className="ui-card-dark stat-card-gradient w-full md:w-1/3 flex flex-col relative overflow-hidden !rounded-[16px] p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="text-sm font-normal text-white/80">Total Persons Detected</span>
                </div>
                <div className="text-5xl font-semibold text-white tracking-tight relative z-10 mb-4">12,482</div>
                <div className="inline-flex w-max items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-full text-[12px] font-normal text-white relative z-10">
                    <Activity className="w-3 h-3" strokeWidth={2} />
                    Live counting
                </div>
            </div>
            
            {/* Right panels snippet */}
            <div className="flex-1 grid grid-cols-2 gap-4">
               <div className="bg-[#F5F5F5] border border-[#E8E8E8] rounded-[16px] p-5 flex flex-col justify-between hover:bg-white transition-colors">
                  <span className="text-sm font-normal text-[#6B6B6B]">Active Sensors</span>
                  <div className="text-4xl font-semibold text-[#0D0D0D] mt-2">14</div>
               </div>
               <div className="bg-[#F5F5F5] border border-[#E8E8E8] rounded-[16px] p-5 flex flex-col justify-between hover:bg-white transition-colors relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#DC2626]"></div>
                  <span className="text-sm font-normal text-[#6B6B6B]">Alerts Fired</span>
                  <div className="text-4xl font-semibold text-[#DC2626] mt-2">2</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-4 lg:px-8 max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-[#0D0D0D] mb-4">Core Platform</h2>
          <p className="text-[#6B6B6B] max-w-xl font-light">Hardware-agnostic crowd sensing infrastructure deployed in minutes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Video, title: 'Multi-Sensor Fusion', desc: 'Combines CCTV, BLE, and WiFi data through weighted Kalman filters.' },
            { icon: Activity, title: 'Risk Engine', desc: 'Predicts stampedes using density, surge rates, and localized anomaly detection.' },
            { icon: Bell, title: 'Twilio Integration', desc: 'Automated SMS & WhatsApp alerts to officials within 3 seconds of a breach.' },
            { icon: MapPin, title: 'Geospatial View', desc: 'City-wide monitoring canvas highlighting structural zones at risk.' },
            { icon: BarChart3, title: 'Deep Analytics', desc: 'Forecasting and historical trends designed specifically for civil authorities.' },
            { icon: Smartphone, title: 'Commuter App', desc: 'Mobile-first PWA for citizens to identify safe transit windows.' },
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="ui-card flex flex-col group cursor-default">
                <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#1A5C38] mb-5 border border-[#E8E8E8] group-hover:bg-[#EBF5EF] transition-colors">
                  <Icon size={18} strokeWidth={2} />
                </div>
                <h3 className="text-base font-medium text-[#0D0D0D] mb-2">{feat.title}</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed font-light">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technical Overview - Dark contrast section styled lightly */}
      <section id="tech" className="py-24 px-4 lg:px-8 border-t border-[#E8E8E8] bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#0D0D0D] mb-6 border border-[#E8E8E8]">
               <Zap size={18} />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0D0D0D] mb-6">
              Production Grade
            </h2>
            <p className="text-[#6B6B6B] text-base leading-relaxed mb-8 font-light">
              Built on a Node.js/Redis real-time data bus capable of processing thousands of sensor ticks per second. Ready for extreme high-density deployments.
            </p>

            <div className="space-y-3">
              {[
                'Distributed WebSocket architecture',
                'Z-score anomaly detection algorithms',
                'Redis-backed Pub/Sub streams',
                'O(1) Time-complexity aggregations',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A5C38]"></div>
                  <span className="text-sm text-[#0D0D0D] font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0D0D0D] rounded-[24px] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3D9E68] rounded-full blur-[60px] opacity-20"></div>
            
            <div className="font-mono-custom text-xs text-white/40 mb-6 uppercase tracking-widest">Stack Architecture</div>
            <div className="space-y-4">
              {[
                { label: 'Client', tech: 'React / Zustand / Tailwind 4' },
                { label: 'Server', tech: 'Node.js / Express / Socket.io' },
                { label: 'Database', tech: 'MongoDB / Mongoose' },
                { label: 'Cache/Bus', tech: 'Redis / IORedis' },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0">
                  <span className="text-[#3D9E68] font-mono-custom text-xs">{row.label}</span>
                  <span className="text-white/80 font-mono-custom text-xs">{row.tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-20 lg:py-24 px-4 lg:px-8 bg-[#F5F5F5] text-center border-t border-[#E8E8E8]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold text-[#0D0D0D] mb-6 tracking-tight">Experience Live Telemetry</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#1A5C38] to-[#2D8B55] text-white font-medium rounded-full hover:shadow-lg hover:-translate-y-px transition-all duration-200">
              Launch Demo
            </Link>
          </div>
          <div className="mt-16 pt-8 border-t border-[#E8E8E8] flex flex-col md:flex-row items-center justify-between text-xs text-[#9E9E9E] font-medium gap-4">
            <span>© 2026 CrowdSense Platform</span>
            <span>SIH 2025 Submission</span>
          </div>
        </div>
      </footer>
      
    </div>
  );
};

export default Landing;
