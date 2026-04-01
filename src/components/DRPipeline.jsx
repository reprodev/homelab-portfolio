import React from 'react';
import Card from './Card';
import Badge from './Badge';

const DRPipeline = () => {
  return (
    <section className="mb-24">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-2 border-b border-white/5 pb-4">
        <h3 className="text-3xl font-extralight tracking-tight text-white m-0">Layer 3.5: Disaster Recovery & Continuity</h3>
        <span className="text-sm font-mono text-slate-400">
          Core Skills: <strong className="text-emerald-400 font-normal">Veeam VBR, Immutable Repositories, RPO/RTO Optimization, LZ4 Compression</strong>
        </span>
      </div>
      <Card title={
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛡️</span>
          <div className="flex flex-col">
            <span className="leading-tight">3-2-1 Backup Strategy</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/70 font-black mt-1">Enterprise-Grade Resilience</span>
          </div>
        </div>
      } glowColor="rgba(16, 185, 129, 0.15)">
        <div className="p-6 md:p-10 bg-black/40 border border-white/5 rounded-[2rem] mt-6 relative overflow-hidden group">
          
          {/* Animated Data Path (SVG) */}
          <div className="absolute inset-0 pointer-events-none opacity-20 hidden md:block">
            <svg className="w-full h-full" viewBox="0 0 800 200" fill="none">
              <path d="M 120 100 L 680 100" stroke="url(#backup-flow)" strokeWidth="2" strokeDasharray="10 20" className="animate-pulse" />
              <defs>
                <linearGradient id="backup-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
              {/* Moving Pulse Bits */}
              <circle r="4" fill="#60a5fa">
                <animateMotion path="M 120 100 L 680 100" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle r="3" fill="#10b981">
                <animateMotion path="M 120 100 L 680 100" dur="3s" begin="1.5s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          <div className="flex flex-col md:flex-row items-stretch justify-between gap-12 relative z-10">
            
            {/* Step 1: Source */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-4xl shadow-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">🖥️</div>
                <div className="absolute -bottom-2 -right-2 px-2 py-1 bg-azure/20 border border-azure/30 rounded-lg text-[9px] font-black text-azure uppercase tracking-tighter backdrop-blur-md">Source</div>
              </div>
              <h5 className="font-bold text-lg text-white mb-4">Compute Fleet</h5>
              <div className="flex flex-col gap-2 w-full max-w-[200px]">
                <Badge color="azure" className="justify-center text-[10px] py-1.5 opacity-80">ZuluServer (Primary)</Badge>
                <Badge color="amber" className="justify-center text-[10px] py-1.5 opacity-80">HA-Fleet Cluster</Badge>
                <Badge color="teal" className="justify-center text-[10px] py-1.5 opacity-80">K3s Container Payloads</Badge>
              </div>
            </div>

            {/* Link 1 (Mobile Arrow) */}
            <div className="md:hidden flex justify-center text-slate-800 text-3xl">↓</div>

            {/* Step 2: Knightbox (The Veeam Core) */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-azure-light/20 rounded-[2rem] flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(16,185,129,0.15)] border border-emerald-500/30 group-hover:rotate-3 transition-all duration-500 relative">
                  🪟
                  {/* Status Indicator */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded-full border border-emerald-500/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[8px] font-black text-emerald-400 uppercase">Live</span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-[9px] font-black text-emerald-400 uppercase tracking-tighter backdrop-blur-md">Target: Local</div>
              </div>
              <h5 className="font-bold text-lg text-white mb-2">Veeam Backup Repo</h5>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold border-b border-white/5 pb-2 mb-4">Host: Knightbox</p>
              
              <div className="flex flex-col gap-2 w-full max-w-[220px]">
                <div className="flex flex-col p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl group-hover:bg-emerald-500/10 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-emerald-400">Veeam VBR Workflow</span>
                    <span className="text-[9px] text-slate-500 font-mono">02:00 UTC</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-1.5 py-0.5 bg-black/40 border border-white/5 rounded text-[9px] text-slate-300">LZ4 Block Compression</span>
                    <span className="px-1.5 py-0.5 bg-black/40 border border-white/5 rounded text-[9px] text-slate-300">Hardened Repository</span>
                    <span className="px-1.5 py-0.5 bg-black/40 border border-white/5 rounded text-[9px] text-slate-300">Daily Synthetic Fulls</span>
                    <span className="px-1.5 py-0.5 bg-emerald-400/10 border border-emerald-400/20 rounded text-[9px] text-emerald-400 font-bold">14D Retention</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Link 2 (Mobile Arrow) */}
            <div className="md:hidden flex justify-center text-slate-800 text-3xl">↓</div>

            {/* Step 3: Offsite Archive */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-4xl shadow-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">☁️</div>
                <div className="absolute -bottom-2 -right-2 px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-[9px] font-black text-purple-400 uppercase tracking-tighter backdrop-blur-md">Target: Offsite</div>
              </div>
              <h5 className="font-bold text-lg text-white mb-4">Cloud Disaster Recovery</h5>
              <div className="flex flex-col gap-2 w-full max-w-[200px]">
                <Badge color="danger" className="justify-center text-[10px] py-1.5 opacity-80">Dropbox Offsite Sync</Badge>
                <div className="p-2 border border-white/5 rounded-xl bg-black/20">
                  <span className="text-[9px] text-slate-500 leading-tight block">Veeam Copy Job automated schedule for air-gapped protection.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default DRPipeline;
