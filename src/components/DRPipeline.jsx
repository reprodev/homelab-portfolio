import React from 'react';
import Card from './Card';
import Badge from './Badge';
import RationaleSection from './RationaleSection';
import { ShieldCheck, CloudLightning, Database } from 'lucide-react';
import { WindowsLogo, DropboxLogo } from './BrandLogos';

const VeeamLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0L2 4.2V11c0 6.1 4.3 11.7 10 13 5.7-1.3 10-6.9 10-13V4.2L12 0zm0 2.2l8 3.4V11c0 5.1-3.5 9.8-8 10.8-4.5-1-8-5.7-8-10.8V5.6l8-3.4zM11 7v10h2V7h-2z"/>
    <path d="M7 10h2v4H7zM15 10h2v4h-2z"/>
  </svg>
);

const DRPipeline = () => {
  return (
    <section className="mb-24">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-2 border-b border-white/5 pb-4">
        <h3 className="text-3xl font-extralight tracking-tight text-white m-0">Layer 3.5: Disaster Recovery & Continuity</h3>
        <span className="text-sm font-mono text-slate-400">
          Core Skills: <strong className="text-emerald-400 font-normal">Veeam VBR, Immutable Repositories, RPO/RTO Optimization</strong>
        </span>
      </div>
      <Card title={
        <div className="flex items-center gap-3">
          <VeeamLogo className="w-6 h-6 text-emerald-400" />
          <div className="flex flex-col">
            <span className="leading-tight">3-2-1 Backup Strategy</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/70 font-black mt-1">Enterprise-Grade Resilience</span>
          </div>
        </div>
      } glowColor="rgba(16, 185, 129, 0.15)">
        <div className="p-6 md:p-10 bg-black/40 border border-white/5 rounded-[2rem] mt-6 relative overflow-hidden group">
          
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
              <h5 className="font-bold text-lg text-white mb-4 italic uppercase tracking-tight leading-none tracking-tighter">Compute Fleet</h5>
              <div className="flex flex-col gap-2 w-full max-w-[200px]">
                <Badge color="azure" className="justify-center text-[10px] py-1.5 opacity-80 uppercase tracking-widest font-black italic">ZuluServer</Badge>
                <Badge color="amber" className="justify-center text-[10px] py-1.5 opacity-80 uppercase tracking-widest font-black italic">HA Cluster</Badge>
                <Badge color="success" className="justify-center text-[10px] py-1.5 opacity-80 uppercase tracking-widest font-black italic">K3s Payloads</Badge>
              </div>
            </div>

            <div className="md:hidden flex justify-center text-slate-800 text-3xl">↓</div>

            {/* Step 2: Knightbox (The Veeam Core) */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-azure-light/20 rounded-[2rem] flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)] border border-emerald-500/30 group-hover:rotate-3 transition-all duration-500 relative">
                  <VeeamLogo className="w-12 h-12 text-emerald-400" />
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded-full border border-emerald-500/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[8px] font-black text-emerald-400 uppercase">Live</span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 flex items-center gap-2 px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-[9px] font-black text-emerald-400 uppercase tracking-tighter backdrop-blur-md italic">
                  <WindowsLogo className="w-2.5 h-2.5 mb-0.5" />
                  Target: Local
                </div>
              </div>
              <h5 className="font-bold text-lg text-white mb-2 italic uppercase tracking-tight leading-none tracking-tighter">Veeam Backup Repo</h5>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black border-b border-white/5 pb-2 mb-4">Host: Knightbox</p>
              
              <div className="flex flex-col gap-2 w-full max-w-[220px]">
                <div className="flex flex-col p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl group-hover:bg-emerald-500/10 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Workflow</span>
                    <span className="text-[9px] text-slate-500 font-mono">06:30 UTC</span>
                  </div>
                  <div className="space-y-2">
                    <div className="px-2 py-1 bg-black/40 border border-white/5 rounded text-[9px] text-slate-400 italic">LZ4 Dynamic Compression</div>
                    <div className="px-2 py-1 bg-black/40 border border-white/5 rounded text-[9px] text-slate-400 italic">Saturday Active Fulls</div>
                    <div className="px-2 py-1 bg-emerald-400/10 border border-emerald-400/20 rounded text-[9px] text-emerald-400 font-black uppercase tracking-widest">7 Restore Points</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:hidden flex justify-center text-slate-800 text-3xl">↓</div>

            {/* Step 3: Offsite Archive */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
                  <DropboxLogo className="w-10 h-10 text-[#0061FF]" />
                </div>
                <div className="absolute -bottom-2 -right-2 px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-[9px] font-black text-purple-400 uppercase tracking-tighter backdrop-blur-md italic">Target: Cloud</div>
              </div>
              <h5 className="font-bold text-lg text-white mb-4 italic uppercase tracking-tight leading-none tracking-tighter">Offsite Archive</h5>
              <div className="flex flex-col gap-2 w-full max-w-[200px]">
                <Badge color="danger" className="justify-center text-[10px] py-1.5 opacity-80 uppercase tracking-widest font-black italic tracking-tighter">Dropbox Sync</Badge>
                <div className="p-3 border border-white/5 rounded-xl bg-black/20">
                  <span className="text-[9px] text-slate-500 leading-tight block italic">Air-gapped protection via encrypted cloud Copy Jobs.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <RationaleSection title="Rationale: Data Durability & The 3-2-1 Rule" color="emerald" icon={ShieldCheck}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Business Continuity
            </h6>
            <p className="text-slate-400 text-xs font-medium leading-relaxed italic border-l-2 border-white/5 pl-4 ml-1">
              Data durability is achieved via the <strong>3-2-1 Strategy</strong>: 3 copies of data, across 2 different media types, with 1 copy stored securely offsite. This ensures that even a complete physical site failure or ransomware incident cannot result in total data loss.
            </p>
          </div>
          <div>
            <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-azure" /> The Logic Flow
            </h6>
            <ul className="text-slate-400 text-xs space-y-3 list-none p-0">
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 font-bold">◃</span>
                <span><strong>Primary Capture:</strong> Veeam VBR performs block-level incremental backups of the Proxmox VMs.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 font-bold">◃</span>
                <span><strong>Reduction:</strong> LZ4 compression and deduplication minimize storage footprint on the local repository.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 font-bold">◃</span>
                <span><strong>Cloud Bridge:</strong> A secondary Copy Job pushes encrypted data to Dropbox for long-term offsite archival.</span>
              </li>
            </ul>
          </div>
        </div>
      </RationaleSection>
    </section>
  );
};

export default DRPipeline;
