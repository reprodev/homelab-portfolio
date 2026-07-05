import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Zap, Globe, ShieldAlert } from 'lucide-react';
import { useSimEvent, SIM_EVENTS } from '../lib/simBus';

/*
  NOTE: InfraHUD is currently NOT mounted anywhere — LayerHUD superseded it as
  the fixed cockpit bar. Kept for reference/possible revival; if remounted, the
  telemetry interval below pauses while the tab is hidden.
*/
const InfraHUD = () => {
  const [latency, setLatency] = useState(12);
  const [cpu, setCpu] = useState(0.35);
  const [ddosActive, setDdosActive] = useState(false);
  const [drStep, setDrStep] = useState(0);

  // Simulated telemetry oscillation (skips ticks while the tab is hidden)
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.hidden) return;
      setLatency(() => {
        if (ddosActive) return 140 + Math.floor(Math.random() * 50); // High latency during attack
        return 10 + Math.floor(Math.random() * 8);
      });
      setCpu(() => {
        if (ddosActive) return 0.88 + Math.random() * 0.08; // CPU spikes to 90%+
        if (drStep > 0 && drStep < 4) return 0.62 + Math.random() * 0.18; // Disk restore activity
        return 0.15 + Math.random() * 0.1; // Peaceful idling
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [ddosActive, drStep]);

  // Event bus listeners — same simBus contracts as the rest of the site
  useSimEvent(SIM_EVENTS.ddos, ({ active }) => setDdosActive(active));
  useSimEvent(SIM_EVENTS.dr, ({ step }) => setDrStep(step));

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={`fixed bottom-0 left-0 right-0 z-[100] px-6 h-14 flex items-center justify-between transition-colors duration-500 border-t ${
        ddosActive 
          ? 'bg-red-950/80 border-red-500/30 backdrop-blur-xl shadow-[0_-5px_30px_rgba(239,68,68,0.15)]' 
          : drStep > 0 && drStep < 4
            ? 'bg-amber-950/80 border-amber-500/30 backdrop-blur-xl shadow-[0_-5px_30px_rgba(245,158,11,0.15)]'
            : 'hud-glass'
      }`}
    >
      <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide no-scrollbar w-full lg:w-auto">
        {/* WAF Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            {ddosActive ? (
              <>
                <ShieldAlert className="text-red-500 animate-bounce" size={18} />
                <div className="absolute -inset-1 bg-red-500/35 blur-sm rounded-full animate-ping"></div>
              </>
            ) : drStep > 0 && drStep < 4 ? (
              <>
                <ShieldCheck className="text-amber-500" size={18} />
                <div className="absolute -inset-1 bg-amber-500/20 blur-sm rounded-full animate-pulse"></div>
              </>
            ) : (
              <>
                <ShieldCheck className="text-emerald-400" size={18} />
                <div className="absolute -inset-1 bg-emerald-400/20 blur-sm rounded-full animate-pulse"></div>
              </>
            )}
          </div>
          <div className="flex flex-col">
            <span className="hud-stat-label italic">WAF System</span>
            <span className={`hud-stat-value uppercase tracking-widest font-mono text-[9px] ${
              ddosActive 
                ? 'text-red-400 font-bold animate-pulse' 
                : drStep > 0 && drStep < 4
                  ? 'text-amber-400 font-bold'
                  : 'text-emerald-400'
            }`}>
              {ddosActive 
                ? 'MITIGATING ATTACK' 
                : drStep > 0 && drStep < 4
                  ? `RECONCILING (STEP ${drStep}/4)`
                  : 'Status: Armed'
              }
            </span>
          </div>
        </div>

        <div className="w-px h-8 bg-white/5 shrink-0 hidden md:block"></div>

        {/* Global Latency */}
        <div className="flex items-center gap-3 shrink-0">
          <Globe className={`${ddosActive ? 'text-red-400 animate-spin-slow' : 'text-azure'}`} size={18} />
          <div className="flex flex-col">
            <span className="hud-stat-label italic">Edge Latency</span>
            <span className={`hud-stat-value ${ddosActive ? 'text-red-400 font-bold' : ''}`}>
              {latency} <span className="text-[10px] opacity-40">ms</span>
            </span>
          </div>
        </div>

        <div className="w-px h-8 bg-white/5 shrink-0 hidden md:block"></div>

        {/* Active Tunnels */}
        <div className="flex items-center gap-3 shrink-0">
          <Zap className={`${
            ddosActive 
              ? 'text-red-400 animate-pulse' 
              : drStep > 0 && drStep < 4
                ? 'text-amber-400 animate-pulse'
                : 'text-amber-400'
          }`} size={18} />
          <div className="flex flex-col">
            <span className="hud-stat-label italic">Proxy Routes</span>
            <span className={`hud-stat-value uppercase font-mono text-[9px] ${
              ddosActive 
                ? 'text-red-400 font-bold' 
                : drStep > 0 && drStep < 4
                  ? 'text-amber-400 font-bold'
                  : 'text-amber-400'
            }`}>
              {ddosActive 
                ? 'Ingress Shield Enabled' 
                : drStep > 0 && drStep < 4
                  ? 'Failover Active'
                  : '04 Tunnel Instances'
              }
            </span>
          </div>
        </div>

        <div className="w-px h-8 bg-white/5 shrink-0 hidden md:block"></div>

        {/* System Load */}
        <div className="flex items-center gap-3 shrink-0">
          <Activity className={`${ddosActive ? 'text-red-500 animate-pulse' : 'text-white/60'}`} size={18} />
          <div className="flex flex-col">
            <span className="hud-stat-label italic">Cluster Load</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${ddosActive ? 'bg-red-500' : drStep > 0 && drStep < 4 ? 'bg-amber-500' : 'bg-azure'}`}
                  animate={{ width: `${cpu * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <span className={`hud-stat-value ${ddosActive ? 'text-red-400 font-bold' : ''}`}>
                Avg {(cpu * 10).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Version & Identity */}
      <div className="hidden lg:flex items-center gap-4">
        <div className="text-right">
          <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Hardware Mesh V4.2</div>
          <div className="text-[9px] font-mono text-azure/40">ZULUSERVER // DIETPI-FLEET</div>
        </div>
        <div className="w-8 h-8 rounded-lg border border-white/5 flex items-center justify-center font-black text-[10px] text-white/20 italic">
          KN
        </div>
      </div>
    </motion.div>
  );
};

export default InfraHUD;
