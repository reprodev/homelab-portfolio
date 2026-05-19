import React from 'react';
import Card from './Card';
import Badge from './Badge';
import RationaleSection from './RationaleSection';
import { LayoutGrid, Globe, Shield, Terminal, Boxes, Zap, ExternalLink } from 'lucide-react';
import { DockerLogo, PlexLogo } from './BrandLogos';

const Sparkline = ({ type, ddosActive, drStep }) => {
  const [points, setPoints] = React.useState(Array.from({ length: 20 }, () => 15));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPoints(prev => {
        let val;
        if (ddosActive && type === 'network') {
          val = 70 + Math.random() * 25; // Network spikes to 95%
        } else if (ddosActive && type === 'cpu') {
          val = 80 + Math.random() * 15; // CPU spikes to 95%
        } else if ((drStep === 2 || drStep === 3) && type === 'disk') {
          val = 60 + Math.random() * 35; // Disk IO spikes during backup restore
        } else {
          val = 15 + Math.sin(Date.now() / 400) * 8 + Math.random() * 5; // Idle wave
        }
        return [...prev.slice(1), val];
      });
    }, 150);
    return () => clearInterval(interval);
  }, [ddosActive, drStep, type]);

  const width = 190;
  const height = 45;
  const maxVal = 100;
  const xStep = width / (points.length - 1);
  
  // Map points to SVG coordinates
  const pathD = points.map((p, i) => {
    const x = i * xStep;
    const y = height - (p / maxVal) * height;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const strokeColor = ddosActive && (type === 'network' || type === 'cpu')
    ? 'stroke-red-500'
    : (drStep === 2 || drStep === 3) && type === 'disk'
      ? 'stroke-amber-500'
      : 'stroke-emerald-400';

  return (
    <svg className="w-full h-[45px]" viewBox={`0 0 ${width} ${height}`}>
      <path d={pathD} fill="none" className={`transition-all duration-300 ${strokeColor}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const WorkloadLayer = () => {
  const [isTranscoding, setIsTranscoding] = React.useState(false);
  const [transcodeSpeed, setTranscodeSpeed] = React.useState(4.2);
  const [gpuLoad, setGpuLoad] = React.useState(34);
  const [bufferLevel, setBufferLevel] = React.useState(65);

  const [ddosActive, setDdosActive] = React.useState(false);
  const [drStep, setDrStep] = React.useState(0);

  React.useEffect(() => {
    if (!isTranscoding) return;
    const interval = setInterval(() => {
      setTranscodeSpeed(parseFloat((3.8 + Math.random() * 0.8).toFixed(1)));
      setGpuLoad(Math.floor(29 + Math.random() * 11));
      setBufferLevel(prev => {
        const next = prev + (Math.random() > 0.5 ? 2 : -2);
        return Math.min(Math.max(next, 55), 75);
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isTranscoding]);

  React.useEffect(() => {
    const handleDdos = (e) => {
      setDdosActive(e.detail.active);
    };
    const handleDr = (e) => {
      setDrStep(e.detail.step);
    };

    window.addEventListener('homelab-ddos', handleDdos);
    window.addEventListener('homelab-dr', handleDr);

    return () => {
      window.removeEventListener('homelab-ddos', handleDdos);
      window.removeEventListener('homelab-dr', handleDr);
    };
  }, []);
  return (
    <section className="mb-24">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-2 border-b border-white/5 pb-4">
        <h3 className="text-3xl font-extralight tracking-tight text-white m-0">Layer 4: Distributed Services & Workloads</h3>
        <span className="text-sm font-mono text-slate-400">
          Core Skills: <strong className="text-emerald-400 font-normal">Docker Ecosystem, Microservices, Reverse Proxy, Observability</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Docker Pool */}
        <div className="lg:col-span-2 space-y-6">
          <Card 
            title={
              <div className="flex items-center gap-3">
                <DockerLogo className="w-6 h-6 text-[#2496ED]" />
                <div className="flex flex-col">
                  <span className="leading-tight">Docker Container Pool</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#2496ED]/70 font-black mt-1">Declarative Workloads</span>
                </div>
              </div>
            }
            glowColor="rgba(36, 150, 237, 0.15)"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
              <div>
                <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2 italic">Productivity & Access</h4>
                <div className="space-y-3">
                  <ServiceItem name="Nextcloud" tag="AIO - Data Hub" color="azure" />
                  <ServiceItem name="Vaultwarden" tag="Bitwarden Core" color="emerald" />
                  <ServiceItem name="Guacamole" tag="RDP Gatehouse" color="amber" />
                  <ServiceItem name="Homepage" tag="Services Dashboard" color="emerald" />
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2 italic">Network Utilities</h4>
                <div className="space-y-3">
                  <ServiceItem name="Nginx Proxy Mgr." tag="Edge Certs" color="azure" />
                  <ServiceItem name="Pi-hole" tag="Recursive DNS" color="emerald" />
                  <ServiceItem name="Uptime Kuma" tag="Telemetry Hub" color="emerald" />
                  <ServiceItem name="Dozzle" tag="Log Aggregation" color="muted" />
                </div>
              </div>
            </div>
          </Card>

          {/* High-Performance Host Workload (PLEX) */}
          <Card 
            title={
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-[#EBA000]/10 border border-[#EBA000]/20 rounded-lg">
                  <PlexLogo className="w-5 h-5 text-[#EBA000]" />
                </div>
                <div className="flex flex-col">
                  <span className="leading-tight">Performance Host Workloads</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#EBA000]/70 font-black mt-1">Native GPU acceleration</span>
                </div>
              </div>
            }
            glowColor="rgba(235, 160, 0, 0.1)"
          >
             <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group/plex">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#EBA000]/10 rounded-xl flex items-center justify-center border border-[#EBA000]/20 group-hover/plex:scale-110 transition-transform">
                    <PlexLogo className="w-7 h-7 text-[#EBA000]" />
                  </div>
                  <div>
                    <h5 className="text-lg font-black text-white italic uppercase tracking-tight text-left">Plex Media Server</h5>
                    <p className="text-[10px] text-slate-500 font-mono text-left">Running natively on ZuluServer (Ubuntu)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsTranscoding(!isTranscoding)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-[9px] font-black uppercase transition-all duration-300 relative z-20 ${
                      isTranscoding 
                        ? 'bg-amber-500 text-black border border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)] animate-pulse' 
                        : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {isTranscoding ? '⏹ Stop HW Stream' : '▶ Simulate 4K transcode'}
                  </button>
                  <div className="hidden sm:flex gap-2">
                    <Badge color="amber">IHD Graphics Passthrough</Badge>
                    <Badge color="azure">Native Performance</Badge>
                  </div>
                </div>
             </div>
             
             {isTranscoding && (
               <div className="mt-4 p-4 bg-black/60 border border-amber-500/20 rounded-2xl space-y-4 relative overflow-hidden crt-screen">
                 <div className="flex justify-between items-center text-[8px] font-mono text-amberGold border-b border-white/5 pb-2 relative z-20 crt-text">
                   <span>INTEL QUICK SYNC VIDEO (QSV) DECODE/ENCODE PIPELINE</span>
                   <span className="flex items-center gap-1.5 uppercase font-bold text-emerald-400">
                     <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> Hardware Active
                   </span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-between gap-4 font-mono text-[10px] py-2 relative z-20 text-slate-300">
                   <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-xl border border-white/5 relative">
                     <span className="text-slate-500 font-extrabold uppercase text-[7px] tracking-wider mb-1">Source Stream</span>
                     <span className="text-white font-black uppercase text-[10px] italic">4K HEVC HDR10</span>
                     <span className="text-slate-400 text-[8px] mt-0.5">Bitrate: 68 Mbps</span>
                   </div>

                   <div className="flex flex-col items-center justify-center p-3 bg-amber-500/5 rounded-xl border border-amber-500/20 relative group">
                     <span className="text-amberGold font-extrabold uppercase text-[7px] tracking-wider mb-1 crt-text">GPU Transcoder</span>
                     <span className="text-amber-400 font-black uppercase text-[10px] italic flex items-center gap-1">
                       <Zap size={10} className="animate-bounce" /> QSV Engine
                     </span>
                     <span className="text-slate-400 text-[8px] mt-0.5">Speed: {transcodeSpeed}x</span>
                   </div>

                   <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-xl border border-white/5">
                     <span className="text-slate-500 font-extrabold uppercase text-[7px] tracking-wider mb-1">Destination</span>
                     <span className="text-white font-black uppercase text-[10px] italic text-emerald-400">1080P H.264 SDR</span>
                     <span className="text-slate-400 text-[8px] mt-0.5">Bitrate: 8 Mbps</span>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[9px] border-t border-white/5 pt-3 relative z-20 crt-text text-slate-300 text-left">
                   <div className="space-y-1.5">
                     <div className="flex justify-between">
                       <span>Intel UHD Graphics 730 Load</span>
                       <span className="text-amber-400 font-bold">{gpuLoad}%</span>
                     </div>
                     <div className="h-1 w-full bg-white/5 border border-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: `${gpuLoad}%` }} />
                     </div>
                   </div>

                   <div className="space-y-1.5">
                     <div className="flex justify-between">
                       <span>Hardware Transcode Buffer Fill</span>
                       <span className="text-emerald-400 font-bold">{bufferLevel}%</span>
                     </div>
                     <div className="h-1 w-full bg-white/5 border border-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-400 rounded-full transition-all duration-700" style={{ width: `${bufferLevel}%` }} />
                     </div>
                   </div>
                 </div>
               </div>
             )}

             <p className="text-[11px] text-slate-500 italic mt-4 leading-relaxed px-2 text-left">
               Strategically deployed as a native host-OS application to ensure direct access to <strong>Intel QuickSync GPU</strong> instructions for 4K HW transcoding, bypassing containerized driver overhead.
             </p>
          </Card>
        </div>

        {/* Logical Stack Integration */}
        <Card title="Observability Stack" glowColor="rgba(16, 185, 129, 0.1)">
          <div className="space-y-6">
            {/* Real-time Observability Sparklines HUD */}
            <div className="p-4 bg-black/60 border border-white/5 rounded-2xl space-y-4 crt-screen">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-emerald-400 border-b border-white/5 pb-1 relative z-20 crt-text">
                <span>Grafana Live Telemetry</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> Real-time
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 relative z-20 font-mono text-[9px] text-left">
                {/* CPU Sparkline */}
                <div className="flex flex-col bg-white/5 border border-white/5 rounded-xl p-2 text-slate-300">
                  <span className="text-slate-500 font-extrabold uppercase text-[7px] leading-none mb-1">Sim CPU</span>
                  <span className={`text-[11px] font-black italic ${ddosActive ? 'text-red-400' : 'text-emerald-400'}`}>
                    {ddosActive ? '94.6%' : '14.2%'}
                  </span>
                  <div className="mt-1">
                    <Sparkline type="cpu" ddosActive={ddosActive} drStep={drStep} />
                  </div>
                </div>

                {/* Net Sparkline */}
                <div className="flex flex-col bg-white/5 border border-white/5 rounded-xl p-2 text-slate-300">
                  <span className="text-slate-500 font-extrabold uppercase text-[7px] leading-none mb-1">Sim Net</span>
                  <span className={`text-[11px] font-black italic ${ddosActive ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                    {ddosActive ? '892 MB/s' : '412 KB/s'}
                  </span>
                  <div className="mt-1">
                    <Sparkline type="network" ddosActive={ddosActive} drStep={drStep} />
                  </div>
                </div>

                {/* Disk IO Sparkline */}
                <div className="flex flex-col bg-white/5 border border-white/5 rounded-xl p-2 text-slate-300">
                  <span className="text-slate-500 font-extrabold uppercase text-[7px] leading-none mb-1">Sim Disk</span>
                  <span className={`text-[11px] font-black italic ${(drStep === 2 || drStep === 3) ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                    {(drStep === 2 || drStep === 3) ? '280 MB/s' : '1.8 MB/s'}
                  </span>
                  <div className="mt-1">
                    <Sparkline type="disk" ddosActive={ddosActive} drStep={drStep} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={14} className="text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-widest text-white">Full-Stack Metrics</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge color="emerald">Prometheus</Badge>
                <Badge color="azure">Grafana</Badge>
                <Badge color="muted">Netdata</Badge>
              </div>
            </div>

            <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} className="text-slate-400" />
                <span className="text-xs font-black uppercase tracking-widest text-white">Edge Security</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge color="muted">Authelia</Badge>
                <Badge color="amber">CrowdSec</Badge>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
               <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-4 italic">Future Roadmap</h4>
               <Badge color="azure" className="w-full justify-center py-2 opacity-50">K3s Migration Phase 2</Badge>
            </div>
          </div>
        </Card>
      </div>

      <RationaleSection title="Rationale: Container-First Abstraction" color="azure" icon={Boxes}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-azure" /> Strategic Abstraction
            </h6>
            <p className="text-slate-400 text-xs font-medium leading-relaxed italic border-l-2 border-white/5 pl-4 ml-1">
              Decoupling services from the host OS via <strong>Docker</strong> ensures that the core infrastructure remains "clean". This containerized approach allows for rapid testing, easy migration between Proxmox nodes, and simplified dependency management across the entire distributed fleet.
            </p>
          </div>
          <div>
            <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Operational Flow
            </h6>
            <ul className="text-slate-400 text-xs space-y-3 list-none p-0">
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 font-bold">◃</span>
                <span><strong>GitOps Reconciliation:</strong> Instead of imperative updates, the system utilizes a declarative pull-model via Git repositories to sync container states.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 font-bold">◃</span>
                <span><strong>Persistence:</strong> Named Docker volumes are backed up daily using the Layer 3.5 pipeline to ensure no data loss during service migrations.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 font-bold">◃</span>
                <span><strong>Isolation:</strong> Services are partitioned into distinct network bridges to prevent lateral movement between workloads.</span>
              </li>
            </ul>
          </div>
        </div>
      </RationaleSection>
    </section>
  );
};

const ServiceItem = ({ name, tag, color }) => {
  const glowColors = {
    azure: "bg-azure shadow-[0_0_8px_#3b82f6]",
    emerald: "bg-emerald-500 shadow-[0_0_8px_#10b981]",
    amber: "bg-amber-500 shadow-[0_0_8px_#f59e0b]",
    muted: "bg-slate-700 shadow-none"
  };

  return (
    <div className="flex items-center justify-between p-3.5 bg-slate-900 border border-white/10 rounded-2xl hover:border-white/30 transition-all group/item shadow-lg relative overflow-hidden">
      <div className={`absolute top-0 left-0 bottom-0 w-1 transition-opacity ${glowColors[color]}`} />
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-[13px] font-black text-white italic tracking-tight uppercase leading-none mb-1 group-hover/item:text-azure-light transition-colors">{name}</span>
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black opacity-60 italic">{tag}</span>
        </div>
      </div>
      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${glowColors[color]}`} />
    </div>
  );
};

const Activity = ({ className, size, strokeWidth }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);

export default WorkloadLayer;
