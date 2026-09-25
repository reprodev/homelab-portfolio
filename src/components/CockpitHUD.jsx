import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/*
  CockpitHUD — the four live status tiles under the hero. Moved out of App.jsx in
  V6 when the page split into routes; the STATE still lives in App's shell (its
  sim listeners must outlive any page), this is presentation only.
*/

// Cockpit labels for the canonical simBus DR step vocabulary (0 idle → 4 restored).
const DR_STEP_LABELS = [
  '6/6 HOSTS ONLINE',
  'OUTAGE DETECTED (STEP 1/4)',
  'RECONCILING (STEP 2/4)',
  'VERIFYING (STEP 3/4)',
  '6/6 HOSTS RESTORED',
];

// Cockpit stat that springs toward each new telemetry value instead of
// snapping — the count-up sells the "live instrument" feel.
const AnimatedStat = ({ value, decimals = 0 }) => {
  const spring = useSpring(value, { stiffness: 90, damping: 22 });
  const display = useTransform(spring, (v) => v.toFixed(decimals));
  useEffect(() => { spring.set(value); }, [value, spring]);
  return <motion.span>{display}</motion.span>;
};

const CockpitHUD = ({ ddosActive, drActive, drStep, tfActive, tfResource, vitals }) => (
  <div className="max-w-[1300px] mx-auto px-6 mt-6 relative z-30">
    <div className="p-4 bg-slate-950/75 backdrop-blur-xl border border-white/10 rounded-3xl grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-meta shadow-2xl relative overflow-hidden blueprint-dots">
      {/* Sonar sweep style border indicator */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-azure/50 to-transparent" />

      {/* Node Status Indicator — DR owns this tile during a drill;
          terraform provisioning shows only while drStep === 0 */}
      <div className="flex flex-col gap-1.5 items-start text-left pl-3 border-l border-white/10 md:border-l-0">
        <span className="text-slate-400 font-extrabold uppercase text-label tracking-wider leading-none">Cluster Node Status</span>
        <span className={`text-meta-lg font-black italic flex items-center gap-1.5 ${drActive ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] animate-pulse' : tfActive && drStep === 0 ? 'text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)] animate-pulse' : 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'}`}>
          <span className={`w-2 h-2 rounded-full ${drActive ? 'bg-amber-400 animate-ping' : tfActive && drStep === 0 ? 'bg-violet-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
          {tfActive && drStep === 0 ? `PROVISIONING (${tfResource}/3)` : DR_STEP_LABELS[drStep] || DR_STEP_LABELS[0]}
        </span>
      </div>

      {/* Ingress Shield */}
      <div className="flex flex-col gap-1.5 items-start text-left pl-3 border-l border-white/10">
        <span className="text-slate-400 font-extrabold uppercase text-label tracking-wider leading-none">Edge Security Ingress</span>
        <span className={`text-meta-lg font-black italic flex items-center gap-1.5 ${ddosActive ? 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse' : 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'}`}>
          <span className={`w-2 h-2 rounded-full ${ddosActive ? 'bg-red-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
          {ddosActive ? 'MITIGATING ATTACK' : 'SHIELD SECURE'}
        </span>
      </div>

      {/* Power Draw Indicator */}
      <div className="flex flex-col gap-1.5 items-start text-left pl-3 border-l border-white/10">
        <span className="text-slate-400 font-extrabold uppercase text-label tracking-wider leading-none">Fleet Power Draw</span>
        <span className="text-white text-meta-lg font-black italic flex items-baseline gap-1">
          <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
            <AnimatedStat value={vitals.watts} />
          </span>
          <span className="text-label text-slate-400 font-normal uppercase">Watts</span>
        </span>
      </div>

      {/* Heat core temp */}
      <div className="flex flex-col gap-1.5 items-start text-left pl-3 border-l border-white/10">
        <span className="text-slate-400 font-extrabold uppercase text-label tracking-wider leading-none">CPU Thermal Core</span>
        <span className="text-white text-meta-lg font-black italic flex items-baseline gap-1">
          <span className={ddosActive ? 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]' : drActive ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]' : 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]'}>
            <AnimatedStat value={vitals.temp} decimals={1} />
          </span>
          <span className="text-label text-slate-400 font-normal uppercase">°C</span>
        </span>
      </div>
    </div>
  </div>
);

export default CockpitHUD;
