import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import Badge from './Badge';
import RationaleSection from './RationaleSection';
import { ShieldCheck, CloudLightning, Database, AlertOctagon, CheckCircle2, Play, RefreshCw } from 'lucide-react';
import { WindowsLogo, DropboxLogo } from './BrandLogos';
import { triggerDr, useSimEvent, SIM_EVENTS } from '../lib/simBus';

const VeeamLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0L2 4.2V11c0 6.1 4.3 11.7 10 13 5.7-1.3 10-6.9 10-13V4.2L12 0zm0 2.2l8 3.4V11c0 5.1-3.5 9.8-8 10.8-4.5-1-8-5.7-8-10.8V5.6l8-3.4zM11 7v10h2V7h-2z"/>
    <path d="M7 10h2v4H7zM15 10h2v4h-2z"/>
  </svg>
);

const DRPipeline = () => {
  const [drillActive, setDrillActive] = useState(false);
  const [drillStep, setDrillStep] = useState(0); // 0: Idle, 1: Outage, 2: Recovering, 3: Verifying, 4: Restored
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const runningRef = useRef(false); // re-entrancy guard (listener closures are stale)
  const timersRef = useRef([]); // pending drill timeouts, cleared on reset/unmount

  const clearDrillTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  // Button / tour entry points only broadcast intent on the global bus.
  const startFailoverDrill = () => triggerDr(1);
  const resetDrill = () => triggerDr(0);

  // Failover orchestration: owns the timeline and re-broadcasts each step so the
  // cockpit HUD, ambient orbs, workload sparklines and 3D topology react in sync.
  const runDrill = () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setDrillActive(true);
    setDrillStep(1);
    setProgress(0);
    setLogs(["[0.0s] [ALERT] Catastrophic host VM shutdown simulated.", "[0.4s] [ALERT] ZuluServer primary instance is [ OFFLINE ]."]);

    // Outage -> Decompression Recovery
    timersRef.current.push(setTimeout(() => {
      setDrillStep(2);
      triggerDr(2);
      setLogs(prev => [...prev, "[1.5s] [VEEAM] Initializing RTO failover routine from Knightbox repo...", "[2.0s] [VEEAM] Fetching incremental block metadata slices..."]);
    }, 1800));

    // Verifying
    timersRef.current.push(setTimeout(() => {
      setDrillStep(3);
      triggerDr(3);
      setLogs(prev => [...prev, "[4.2s] [STORAGE] Decompressing LZ4 block storage (482GB restored)...", "[4.8s] [TERRAFORM] apply -target=proxmox_virtual_environment_vm.zuluserver: standby from golden image 9001 [SUCCESS].", "[5.2s] [ANSIBLE] Re-binding network bridges and storage shares..."]);
    }, 4500));

    // Restored
    timersRef.current.push(setTimeout(() => {
      setDrillStep(4);
      triggerDr(4);
      setLogs(prev => [...prev, "[6.5s] [SYSTEM] Integrity check passed. Primary workloads [ ONLINE ].", "[7.0s] [SUCCESS] DR Failover drill complete. Zero data loss."]);
    }, 7000));
  };

  // Cancel any in-flight drill timeline on unmount (section collapse, page swap)
  useEffect(() => clearDrillTimers, []);

  // step 1 = start request (button or tour); step 0 = reset. Steps 2-4 are
  // emitted by runDrill itself and ignored here as control signals.
  useSimEvent(SIM_EVENTS.dr, ({ step }) => {
    if (step === 1) runDrill();
    else if (step === 0) {
      clearDrillTimers(); // kill any in-flight drill stages so reset actually sticks
      runningRef.current = false;
      setDrillActive(false);
      setDrillStep(0);
      setProgress(0);
      setLogs([]);
    }
  });

  // Progress bar animation during step 2 & 3
  useEffect(() => {
    let interval;
    if (drillStep === 2) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 60) {
            clearInterval(interval);
            return 60;
          }
          return prev + 4;
        });
      }, 100);
    } else if (drillStep === 3) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 8;
        });
      }, 80);
    } else if (drillStep === 0 || drillStep === 1) {
      setProgress(0);
    } else if (drillStep === 4) {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [drillStep]);

  return (
    <section className="mb-24">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-2 border-b border-white/5 pb-4">
        <h3 className="text-3xl font-extralight tracking-tight text-white m-0">Lifecycle 04: Disaster Recovery & Continuity</h3>
        <span className="text-sm font-mono text-slate-400">
          Core Skills: <strong className="text-emerald-400 font-normal">Veeam VBR, Immutable Repositories, RPO/RTO Optimization</strong>
        </span>
      </div>

      <Card title={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <VeeamLogo className="w-6 h-6 text-emerald-400" />
            <div className="flex flex-col text-left">
              <span className="leading-tight">3-2-1 Backup Strategy</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/70 font-black mt-1">Enterprise-Grade Resilience</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {drillStep === 4 ? (
              <button
                onClick={resetDrill}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-95 text-xs text-white font-mono font-bold tracking-tight uppercase transition-all shadow-md"
              >
                <RefreshCw size={12} className="animate-spin" /> Reset Dashboard
              </button>
            ) : (
              <button
                onClick={startFailoverDrill}
                disabled={drillActive}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-black tracking-tight uppercase transition-all shadow-xl
                  ${drillActive 
                    ? 'bg-amberGold/10 border border-amberGold/20 text-amberGold cursor-not-allowed animate-pulse'
                    : 'bg-[#ef4444] text-white hover:bg-red-500 hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] active:scale-95'
                  }`}
              >
                <Play size={12} fill="currentColor" /> {drillActive ? 'Failover Active' : 'Test Failover'}
              </button>
            )}
          </div>
        </div>
      } glowColor={drillStep === 1 ? "rgba(239, 68, 68, 0.25)" : drillStep === 2 || drillStep === 3 ? "rgba(245, 158, 11, 0.25)" : "rgba(16, 185, 129, 0.15)"}>
        
        {/* Dynamic Drill Alert Banner */}
        {drillActive && (
          <div className={`mt-4 px-4 py-3 rounded-2xl border flex items-center justify-between transition-all duration-500
            ${drillStep === 1 
              ? 'bg-red-500/10 border-red-500/20 text-red-400' 
              : drillStep === 2 || drillStep === 3 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}
          >
            <div className="flex items-center gap-3">
              {drillStep === 4 ? (
                <CheckCircle2 size={16} className="text-emerald-400" />
              ) : (
                <AlertOctagon size={16} className="animate-bounce" />
              )}
              <span className="text-[10px] font-mono tracking-wider uppercase font-black">
                {drillStep === 1 && "CRITICAL OUTAGE DRILL ACTIVE: ZULUSERVER OFFLINE!"}
                {drillStep === 2 && `FAILOVER RUNNING: SPINNING UP STANDBY VM (${progress}%)`}
                {drillStep === 3 && `RE-BINDING LAN NETWORK interfaces (${progress}%)`}
                {drillStep === 4 && "FAILOVER DRILL SUCCESSFUL. WORKLOAD RESTORED!"}
              </span>
            </div>
            {drillStep < 4 && (
              <span className="text-[9px] font-mono opacity-60 uppercase font-black italic">RTO Timer Running</span>
            )}
          </div>
        )}

        <div className="p-6 md:p-10 bg-black/40 border border-white/5 rounded-[2rem] mt-6 relative overflow-hidden group">
          
          {/* SVG Animated Connector Paths */}
          <div className="absolute inset-0 pointer-events-none opacity-25 hidden md:block">
            <svg className="w-full h-full" viewBox="0 0 800 200" fill="none">
              <path d="M 120 100 L 680 100" stroke="url(#backup-flow)" strokeWidth="2" strokeDasharray="10 20" />
              <defs>
                <linearGradient id="backup-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={drillStep === 1 ? "#ef4444" : drillStep >= 2 ? "#10b981" : "#3b82f6"} />
                  <stop offset="50%" stopColor={drillStep === 1 ? "#f59e0b" : drillStep >= 2 ? "#10b981" : "#10b981"} />
                  <stop offset="100%" stopColor={drillStep === 1 ? "#ef4444" : drillStep >= 2 ? "#818cf8" : "#818cf8"} />
                </linearGradient>
              </defs>
              
              {/* Dynamic pulses running backwards or forwards based on failover status */}
              {drillStep === 0 && (
                <>
                  <circle r="4" fill="#60a5fa">
                    <animateMotion path="M 120 100 L 680 100" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <circle r="3" fill="#10b981">
                    <animateMotion path="M 120 100 L 680 100" dur="3s" begin="1.5s" repeatCount="indefinite" />
                  </circle>
                </>
              )}
              {drillStep === 1 && (
                <circle r="5" fill="#ef4444" className="animate-ping">
                  <animateMotion path="M 120 100 L 680 100" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
              {(drillStep === 2 || drillStep === 3) && (
                <>
                  {/* Restoring: Data flows backward from Backup to Source */}
                  <circle r="5" fill="#f59e0b">
                    <animateMotion path="M 680 100 L 120 100" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle r="3.5" fill="#10b981">
                    <animateMotion path="M 680 100 L 120 100" dur="1.2s" begin="0.6s" repeatCount="indefinite" />
                  </circle>
                </>
              )}
              {drillStep === 4 && (
                <>
                  {/* Recovered: Double time active speed sync pulses */}
                  <circle r="4.5" fill="#10b981">
                    <animateMotion path="M 120 100 L 680 100" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle r="4" fill="#3b82f6">
                    <animateMotion path="M 120 100 L 680 100" dur="1.5s" begin="0.8s" repeatCount="indefinite" />
                  </circle>
                </>
              )}
            </svg>
          </div>

          <div className="flex flex-col md:flex-row items-stretch justify-between gap-12 relative z-10">
            
            {/* Step 1: Source Fleet VM Node */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className={`w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-4xl shadow-2xl border transition-all duration-500
                  ${drillStep === 1 
                    ? 'border-red-500 bg-red-950/20 scale-95 opacity-50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                    : drillStep === 2 || drillStep === 3
                      ? 'border-amber-500 bg-amber-950/10 shadow-[0_0_20px_rgba(245,158,11,0.2)] animate-pulse'
                      : 'border-white/10 group-hover:scale-110'
                  }`}
                >
                  {drillStep === 1 ? "⚠️" : "🖥️"}
                </div>
                <div className={`absolute -bottom-2 -right-2 px-2 py-1 border rounded-lg text-[9px] font-black uppercase tracking-tighter backdrop-blur-md transition-all
                  ${drillStep === 1 
                    ? 'bg-red-500/20 border-red-500/30 text-red-400' 
                    : drillStep === 2 || drillStep === 3
                      ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                      : 'bg-azure/20 border-azure/30 text-azure'
                  }`}
                >
                  {drillStep === 1 ? 'Outage' : drillStep === 2 || drillStep === 3 ? 'Restoring' : 'Source'}
                </div>
              </div>
              
              <h5 className="font-bold text-lg text-white mb-4 italic uppercase tracking-tight leading-none tracking-tighter">
                Compute Fleet
              </h5>
              
              <div className="flex flex-col gap-2 w-full max-w-[200px]">
                <div className={`flex justify-between items-center px-4 py-2 border rounded-xl font-mono text-[10px] font-bold tracking-wider uppercase transition-all duration-500
                  ${drillStep === 1 
                    ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                    : drillStep === 2 || drillStep === 3
                      ? 'bg-amber-500/5 border-amber-500/20 text-amber-400 animate-pulse'
                      : 'bg-slate-900 border-white/5 text-azure-light'
                  }`}
                >
                  <span>ZuluServer</span>
                  <span>{drillStep === 1 ? "OFFLINE" : drillStep === 2 || drillStep === 3 ? "REBUILDING" : "ONLINE"}</span>
                </div>
                <Badge color="amber" className="justify-center text-[10px] py-1.5 opacity-80 uppercase tracking-widest font-black italic">HA Cluster</Badge>
                {/* Was "K3s Payloads" — implied K3s runs production workloads that
                    are DR-protected. It's a rebuildable sandbox (see fleet.js), so
                    this now names what the drill actually restores. */}
                <Badge color="success" className="justify-center text-[10px] py-1.5 opacity-80 uppercase tracking-widest font-black italic">Docker Stack</Badge>
              </div>
            </div>

            <div className="md:hidden flex justify-center text-slate-800 text-3xl">↓</div>

            {/* Step 2: Knightbox (Veeam Core Repository Node) */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className={`w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-azure-light/20 rounded-[2rem] flex items-center justify-center border transition-all duration-500 relative
                  ${drillStep === 2 || drillStep === 3
                    ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.25)] scale-105'
                    : 'border-emerald-500/30 group-hover:rotate-3 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
                  }`}
                >
                  <VeeamLogo className={`w-12 h-12 transition-all ${drillStep === 2 || drillStep === 3 ? 'text-amber-400' : 'text-emerald-400'}`} />
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
              
              {/* Dynamic Timeline / Progress bar during drill */}
              <div className="w-full max-w-[220px]">
                {drillActive ? (
                  <div className="flex flex-col p-4 bg-white/5 border border-white/10 rounded-2xl text-left space-y-3 font-mono text-[9px] leading-relaxed crt-screen">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-amberGold border-b border-white/5 pb-1 relative z-20">
                      <span>Restoration Log</span>
                      <span className="animate-pulse">Active</span>
                    </div>
                    <div className="h-[90px] overflow-y-auto no-scrollbar space-y-1 text-slate-300 crt-text relative z-20">
                      {logs.map((log, index) => (
                        <div key={index} className={log.includes('ALERT') ? 'text-red-400 font-bold' : log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : ''}>
                          {log}
                        </div>
                      ))}
                    </div>
                    
                    {drillStep < 4 && (
                      <div className="space-y-1.5 pt-1 border-t border-white/5">
                        <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                          <span>Recompiling Blocks</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amberGold transition-all duration-300 shadow-[0_0_8px_#f59e0b]"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500/10 transition-colors">
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
                )}
              </div>
            </div>

            <div className="md:hidden flex justify-center text-slate-800 text-3xl">↓</div>

            {/* Step 3: Offsite Cloud Archive */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
                  <DropboxLogo className="w-10 h-10 text-[#0061FF]" />
                </div>
                <div className="absolute -bottom-2 -right-2 px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-[9px] font-black text-purple-400 uppercase tracking-tighter backdrop-blur-md italic">Target: Cloud</div>
              </div>
              <h5 className="font-bold text-lg text-white mb-4 italic uppercase tracking-tight leading-none tracking-tighter">Offsite Archive</h5>
              
              <div className="flex flex-col gap-2 w-full max-w-[200px]">
                {drillStep === 4 ? (
                  <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl text-left space-y-2.5 font-mono text-[9px]">
                    <div className="font-black uppercase tracking-wider text-emerald-400 text-[10px] border-b border-white/5 pb-1 flex items-center gap-1.5">
                      <CheckCircle2 size={10} /> Failover Analytics
                    </div>
                    <ul className="space-y-1 text-slate-300 leading-tight">
                      <li className="flex justify-between"><span className="text-slate-500 italic">RTO Restored</span><span className="text-white font-bold">4.8s</span></li>
                      <li className="flex justify-between"><span className="text-slate-500 italic">RPO Window</span><span className="text-white font-bold">&lt; 24h</span></li>
                      <li className="flex justify-between"><span className="text-slate-500 italic">Data Loss</span><span className="text-emerald-400 font-bold">0.00%</span></li>
                      <li className="flex justify-between"><span className="text-slate-500 italic">Integrity</span><span className="text-emerald-400 font-bold">100% OK</span></li>
                    </ul>
                  </div>
                ) : (
                  <>
                    <Badge color="danger" className="justify-center text-[10px] py-1.5 opacity-80 uppercase tracking-widest font-black italic tracking-tighter">Dropbox Sync</Badge>
                    <div className="p-3 border border-white/5 rounded-xl bg-black/20">
                      <span className="text-[9px] text-slate-500 leading-tight block italic">Air-gapped protection via encrypted cloud Copy Jobs.</span>
                    </div>
                  </>
                )}
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
