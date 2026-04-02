import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Zap, Globe } from 'lucide-react';

const InfraHUD = () => {
  const [latency, setLatency] = useState(12);
  const [cpu, setCpu] = useState(0.4);

  // Simulated telemetry oscillation
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(10 + Math.floor(Math.random() * 8));
      setCpu(0.3 + Math.random() * 0.2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-[100] hud-glass px-6 h-14 flex items-center justify-between"
    >
      <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide no-scrollbar">
        {/* WAF Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <ShieldCheck className="text-emerald-400" size={18} />
            <div className="absolute -inset-1 bg-emerald-400/20 blur-sm rounded-full animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <span className="hud-stat-label italic">WAF System</span>
            <span className="hud-stat-value text-emerald-400 uppercase tracking-widest">Status: Armed</span>
          </div>
        </div>

        <div className="w-px h-8 bg-white/5 shrink-0 hidden md:block"></div>

        {/* Global Latency */}
        <div className="flex items-center gap-3 shrink-0">
          <Globe className="text-azure" size={18} />
          <div className="flex flex-col">
            <span className="hud-stat-label italic">Edge Latency</span>
            <span className="hud-stat-value">
              {latency} <span className="text-[10px] opacity-40">ms</span>
            </span>
          </div>
        </div>

        <div className="w-px h-8 bg-white/5 shrink-0 hidden md:block"></div>

        {/* Active Tunnels */}
        <div className="flex items-center gap-3 shrink-0">
          <Zap className="text-amber-400" size={18} />
          <div className="flex flex-col">
            <span className="hud-stat-label italic">Proxy Routes</span>
            <span className="hud-stat-value text-amber-400">04 Tunnel Instances</span>
          </div>
        </div>

        <div className="w-px h-8 bg-white/5 shrink-0 hidden md:block"></div>

        {/* System Load */}
        <div className="flex items-center gap-3 shrink-0">
          <Activity className="text-white/60" size={18} />
          <div className="flex flex-col">
            <span className="hud-stat-label italic">Cluster Load</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-azure"
                  animate={{ width: `${cpu * 100}%` }}
                  transition={{ duration: 2 }}
                />
              </div>
              <span className="hud-stat-value opacity-60">Avg {(cpu * 10).toFixed(1)}</span>
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
