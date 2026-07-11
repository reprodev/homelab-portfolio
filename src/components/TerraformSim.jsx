import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, RefreshCw, GitBranch } from 'lucide-react';
import { playSound } from '../lib/audio';
import { triggerTerraform, useSimEvent, SIM_EVENTS, usePrefersReducedMotion } from '../lib/simBus';
import useInViewPause from '../hooks/useInViewPause';

/*
  TerraformSim — the "terraform plan → apply" showstopper sim (Lifecycle 01 · Code).

  Contract, scripts and timings are pinned in docs/iac-layer-spec.md — THE SPEC IS
  THE SOURCE OF TRUTH. The arrays below are direct transcriptions of spec §d; edit
  the spec first, then mirror here.

  Bus behavior (homelab-terraform):
    - Buttons/tour only broadcast intent (`triggerTerraform`); the useSimEvent
      listener below is the single source of truth (invariants §1).
    - 'apply' WITH a `resource` field is our own progress echo → ignored here.
    - A user-triggered timeline runs to completion off-screen (DRPipeline
      precedent); useInViewPause only gates the ambient graph particle.
*/

// Spec §d — plan phase. cls drives the line classifier below.
const PLAN_SCRIPT = [
  { t: 0, text: '$ terraform plan -out=tfplan' },
  { t: 400, text: 'Acquiring state lock. This may take a few moments...' },
  { t: 900, text: 'proxmox_virtual_environment_vm.zuluserver: Refreshing state... [id=102]' },
  { t: 1150, text: 'proxmox_virtual_environment_vm.omv_nas: Refreshing state... [id=104]' },
  { t: 1400, text: 'proxmox_virtual_environment_container.ha["ha01"]: Refreshing state... [id=201]' },
  { t: 1650, text: 'proxmox_virtual_environment_container.ha["ha02"]: Refreshing state... [id=202]' },
  { t: 2100, text: ' ' },
  { t: 2100, text: 'Terraform will perform the following actions:' },
  { t: 2400, text: '  # proxmox_virtual_environment_container.ha["ha03"] will be created' },
  { t: 2520, text: '  + resource "proxmox_virtual_environment_container" "ha" {' },
  { t: 2640, text: '  +   node_name = "pve"' },
  { t: 2760, text: '  +   vm_id     = 203' },
  { t: 2880, text: '  +   hostname  = "ha03"            # Pi-hole DNS / Guacamole' },
  { t: 3000, text: '  +   cores     = 1' },
  { t: 3120, text: '  +   memory    = 2048' },
  { t: 3240, text: '  +   ipv4      = "10.20.0.53/24"' },
  { t: 3360, text: '  +   clone     { vm_id = 9001 }    # packer: ubuntu-2404-golden' },
  { t: 3480, text: '    }' },
  { t: 3800, text: '  # proxmox_virtual_environment_vm.zuluserver will be updated in-place' },
  { t: 3920, text: '  ~ resource "proxmox_virtual_environment_vm" "zuluserver" {' },
  { t: 4040, text: '        vm_id  = 102' },
  { t: 4160, text: '  ~     cores  = 2 -> 4             # Plex transcode headroom' },
  { t: 4280, text: '  ~     memory = 8192 -> 12288' },
  { t: 4400, text: '    }' },
  { t: 4700, text: '  # proxmox_virtual_environment_vm.omv_nas will be updated in-place' },
  { t: 4820, text: '  ~ resource "proxmox_virtual_environment_vm" "omv_nas" {' },
  { t: 4940, text: '        vm_id   = 104' },
  { t: 5060, text: '  ~     startup = "order=2" -> "order=1"   # storage boots first' },
  { t: 5180, text: '    }' },
  { t: 5600, text: 'Plan: 1 to add, 2 to change, 0 to destroy.', summary: true },
  { t: 5900, text: '── pibuster4 (bare-metal ARM head) stays outside Terraform on purpose:' },
  { t: 6020, text: '── codified core, hands-on edge. Honest IaC > total IaC.' },
];
const AUTO_APPLY_DELAY = 1200; // tour auto-chain gap after the last plan line

// Spec §d — apply phase. `resource: k` marks a completion (broadcast + tick).
const APPLY_SCRIPT = [
  { t: 0, text: '$ terraform apply tfplan' },
  { t: 500, text: 'proxmox_virtual_environment_container.ha["ha03"]: Creating...' },
  { t: 1700, text: 'proxmox_virtual_environment_container.ha["ha03"]: Still creating... [10s elapsed]' },
  { t: 2900, text: 'proxmox_virtual_environment_container.ha["ha03"]: Creation complete after 14s [id=203]', resource: 1 },
  { t: 3300, text: 'proxmox_virtual_environment_vm.zuluserver: Modifying... [id=102]' },
  { t: 5100, text: 'proxmox_virtual_environment_vm.zuluserver: Modifications complete after 6s [id=102]', resource: 2 },
  { t: 5500, text: 'proxmox_virtual_environment_vm.omv_nas: Modifying... [id=104]' },
  { t: 6900, text: 'proxmox_virtual_environment_vm.omv_nas: Modifications complete after 3s [id=104]', resource: 3 },
  { t: 7500, text: 'Apply complete! Resources: 1 added, 2 changed, 0 destroyed.', summary: true },
  { t: 7700, text: 'Outputs:  ha03_ipv4 = "10.20.0.53"', done: true },
];

// Spec §e — resource k ↔ graph leaf mapping matches the apply order.
const LEAF_NODES = [
  { k: 1, id: 'ha03', label: 'ha03', sub: 'LXC · + create', y: 35, badge: '+' },
  { k: 2, id: 'zulu', label: 'zuluserver', sub: 'VM · ~ update', y: 95, badge: '~' },
  { k: 3, id: 'omv', label: 'omv_nas', sub: 'VM · ~ update', y: 155, badge: '~' },
];
const PIBUSTER_Y = 215;

// Spec §d line classifier: prefix → color.
const classifyLine = (text) => {
  if (text.startsWith('$ ')) return 'text-amberGold font-black';
  if (text.startsWith('  + ')) return 'text-emerald-400';
  if (text.startsWith('  ~ ')) return 'text-amber-300';
  if (text.startsWith('  # ')) return 'text-slate-500';
  if (text.startsWith('── ')) return 'text-slate-500 italic';
  if (text.startsWith('Plan:') || text.startsWith('Apply complete!')) return 'text-white font-semibold';
  if (text.startsWith('Outputs:')) return 'text-emerald-300 font-bold';
  if (text.includes('complete after')) return 'text-emerald-300';
  if (text.includes('Creating') || text.includes('Modifying') || text.includes('Still creating')) return 'text-azure-light';
  if (text.includes('Refreshing') || text.startsWith('Acquiring')) return 'text-slate-400';
  return 'text-slate-300';
};

const TerraformSim = () => {
  const [simState, setSimState] = useState('idle'); // idle | planning | planned | applying | done
  const [logs, setLogs] = useState([]);
  const [applied, setApplied] = useState(0); // resources applied so far (0..3)
  const runningRef = useRef(false); // re-entrancy guard (listener closures)
  const phaseRef = useRef('idle'); // sync mirror of simState for timer callbacks
  const timersRef = useRef([]); // every pending timeout, cleared on reset/unmount
  const terminalEndRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;
  const [graphRef, inView] = useInViewPause();

  const setPhase = (next) => {
    phaseRef.current = next;
    setSimState(next);
  };

  const schedule = (fn, ms) => {
    timersRef.current.push(setTimeout(fn, ms));
  };

  const clearSimTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const resetAll = () => {
    clearSimTimers();
    runningRef.current = false;
    phaseRef.current = 'idle';
    setSimState('idle');
    setLogs([]);
    setApplied(0);
  };

  const appendLine = (entry) => setLogs((prev) => [...prev, entry.text]);

  const runApplyTimeline = () => {
    if (runningRef.current || phaseRef.current !== 'planned') return;
    runningRef.current = true;
    setPhase('applying');

    const emitApplyLine = (entry) => {
      appendLine(entry);
      if (entry.resource) {
        setApplied(entry.resource);
        triggerTerraform('apply', { resource: entry.resource });
        // Rising pitch per resource: 1300 / 1400 / 1500 Hz (spec §f)
        playSound('ping', { start: 1200 + entry.resource * 100, end: 520, dur: 0.18 });
      }
      if (entry.done) {
        runningRef.current = false;
        setPhase('done');
        triggerTerraform('done');
        playSound('success');
      }
    };

    if (reducedRef.current) {
      // Coarse dumps: command at 0, each resource block at its completion
      // offset, summary/outputs at their offsets. Broadcast timings unchanged.
      appendLine(APPLY_SCRIPT[0]);
      const blocks = [[1, 3], [4, 5], [6, 7]]; // index ranges ending at each resource line
      blocks.forEach(([from, to]) => {
        const completion = APPLY_SCRIPT[to];
        schedule(() => {
          for (let i = from; i < to; i += 1) appendLine(APPLY_SCRIPT[i]);
          emitApplyLine(completion);
        }, completion.t);
      });
      schedule(() => emitApplyLine(APPLY_SCRIPT[8]), APPLY_SCRIPT[8].t);
      schedule(() => emitApplyLine(APPLY_SCRIPT[9]), APPLY_SCRIPT[9].t);
      return;
    }

    APPLY_SCRIPT.forEach((entry) => schedule(() => emitApplyLine(entry), entry.t));
  };

  const runPlanTimeline = (auto = false) => {
    if (runningRef.current) return;
    runningRef.current = true;
    setPhase('planning');
    setLogs([]);
    setApplied(0);

    const summaryIndex = PLAN_SCRIPT.findIndex((l) => l.summary);
    const finishPlan = () => {
      runningRef.current = false;
      setPhase('planned');
      playSound('ping');
    };
    const maybeAutoChain = () => {
      if (auto) schedule(runApplyTimeline, AUTO_APPLY_DELAY);
    };

    if (reducedRef.current) {
      // One coarse dump, then summary + footnote after a single beat (spec §g).
      setLogs(PLAN_SCRIPT.slice(0, summaryIndex).map((l) => l.text));
      schedule(() => {
        PLAN_SCRIPT.slice(summaryIndex).forEach(appendLine);
        finishPlan();
        maybeAutoChain();
      }, 800);
      return;
    }

    PLAN_SCRIPT.forEach((entry, i) => {
      schedule(() => {
        appendLine(entry);
        if (entry.summary) finishPlan();
        if (i === PLAN_SCRIPT.length - 1) maybeAutoChain();
      }, entry.t);
    });
  };

  // 'plan'/'apply' without `resource` are control commands; 'apply' WITH
  // `resource` is our own progress echo; 'done' is our own broadcast.
  useSimEvent(SIM_EVENTS.terraform, ({ phase, resource, auto }) => {
    if (phase === 'plan') runPlanTimeline(!!auto);
    else if (phase === 'apply' && !resource) runApplyTimeline();
    else if (phase === 'idle') resetAll();
  });

  // Kill any in-flight timeline on unmount (accordion collapse unmounts children,
  // page swap). If we die mid-run, broadcast idle so the other listeners (App
  // orbs/cockpit, Topology3D mode) don't stay in terraform theming forever.
  useEffect(() => () => {
    clearSimTimers();
    if (phaseRef.current !== 'idle' && phaseRef.current !== 'done') triggerTerraform('idle');
  }, []);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [logs]);

  const planEnabled = simState === 'idle' || simState === 'done';
  const applyEnabled = simState === 'planned';

  const statusChip = {
    idle: { text: 'STATE SYNCED · NO PENDING CHANGES', cls: 'text-slate-400' },
    planning: { text: 'PLANNING · REFRESHING STATE...', cls: 'text-violet-400 animate-pulse' },
    planned: { text: 'PLAN READY · 1 ADD / 2 CHANGE · AWAITING APPLY', cls: 'text-amber-400' },
    applying: { text: `APPLYING · ${applied}/3 RESOURCES CONVERGED`, cls: 'text-violet-400 animate-pulse' },
    done: { text: 'APPLY COMPLETE · FLEET MATCHES DECLARED STATE', cls: 'text-emerald-400' },
  }[simState];

  // Graph visual state helpers (spec §e)
  const chainLit = simState !== 'idle';
  const leafState = (k) => {
    if (applied >= k) return 'applied';
    if (simState === 'applying' && applied === k - 1) return 'applying';
    if (simState === 'planned' || simState === 'applying' || simState === 'done') return 'planned';
    return 'pending';
  };
  const activeLeaf = simState === 'applying' ? LEAF_NODES.find((n) => n.k === applied + 1) : null;

  const leafChipCls = {
    pending: 'bg-slate-900/60 border-white/5 text-slate-500',
    planned: 'bg-violet-500/10 border-violet-500/40 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.2)]',
    applying: 'bg-amber-500/10 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    applied: 'bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.35)]',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* ── Terminal panel ─────────────────────────────────────────────── */}
      <div className="flex flex-col bg-[#020202] border border-white/10 rounded-2xl overflow-hidden shadow-2xl crt-screen">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02] relative z-20">
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-slate-400">
            <GitBranch size={11} className="text-violet-400" />
            <span className="hidden sm:inline">knightbox:~/homelab-infra</span>
            <span className="sm:hidden">homelab-infra</span>
            <span className="text-slate-600">·</span>
            <span className="text-violet-400/80 font-black">main</span>
          </div>
          <div className="flex gap-1.5 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
          </div>
        </div>

        <div className="flex-1 h-[240px] md:h-[320px] p-4 font-mono text-[10px] leading-relaxed overflow-y-auto no-scrollbar scroll-smooth space-y-0.5 crt-text relative z-20">
          {logs.length === 0 && (
            <div className="text-slate-500">
              <span className="text-emerald-400/80">knightbox</span>
              <span>:</span>
              <span className="text-azure-light">~/homelab-infra</span>
              <span className="text-slate-300">$ </span>
              <span className="inline-block w-1.5 h-3 bg-slate-400/70 align-middle animate-pulse" />
            </div>
          )}
          {logs.map((line, index) => (
            <div key={index} className={`${classifyLine(line)} whitespace-pre-wrap`}>
              {line}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Status strip */}
        <div className="px-4 py-2 border-t border-white/5 bg-black/60 relative z-20">
          <span className={`text-[9px] font-mono font-black uppercase tracking-wider ${statusChip.cls}`}>
            {statusChip.text}
          </span>
        </div>

        {/* Controls — broadcast intent only; the listener owns the timeline */}
        <div className="flex flex-col md:flex-row items-stretch gap-2 p-2 border-t border-white/5 bg-white/[0.01] relative z-20">
          <button
            onClick={() => {
              playSound('click');
              triggerTerraform('plan');
            }}
            disabled={!planEnabled}
            className={`flex-1 min-h-[44px] md:min-h-0 flex items-center justify-center gap-2 py-2 rounded-lg border text-[9px] font-mono font-black uppercase tracking-wider transition-all
              ${simState === 'planning'
                ? 'bg-violet-500/10 border-violet-500/30 text-violet-400 cursor-not-allowed'
                : planEnabled
                  ? 'bg-violet-500/10 border-violet-500/30 text-violet-300 hover:bg-violet-500/20 hover:border-violet-400/50 active:scale-95'
                  : 'border-white/5 text-slate-600 cursor-not-allowed'
              }`}
          >
            <Play size={11} fill="currentColor" />
            {simState === 'planning' ? 'Planning...' : 'terraform plan'}
          </button>
          <button
            onClick={() => {
              playSound('click');
              triggerTerraform('apply');
            }}
            disabled={!applyEnabled}
            className={`flex-1 min-h-[44px] md:min-h-0 flex items-center justify-center gap-2 py-2 rounded-lg border text-[9px] font-mono font-black uppercase tracking-wider transition-all
              ${simState === 'applying'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 cursor-not-allowed animate-pulse'
                : applyEnabled
                  ? 'bg-amberGold/15 border-amberGold/40 text-amberGold hover:bg-amberGold/25 hover:shadow-[0_0_18px_rgba(251,191,36,0.25)] active:scale-95'
                  : 'border-white/5 text-slate-600 cursor-not-allowed'
              }`}
          >
            <Zap size={11} fill="currentColor" />
            {simState === 'applying' ? 'Applying...' : 'terraform apply tfplan'}
          </button>
          <button
            onClick={() => {
              playSound('click');
              triggerTerraform('idle');
            }}
            disabled={simState === 'idle'}
            className={`md:px-3 min-h-[44px] md:min-h-0 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-[9px] font-mono font-black uppercase tracking-wider transition-all
              ${simState === 'idle'
                ? 'border-white/5 text-slate-600 cursor-not-allowed'
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20 active:scale-95'
              }`}
            title="Reset simulation"
          >
            <RefreshCw size={11} /> Reset
          </button>
        </div>
      </div>

      {/* ── Resource graph panel (spec §e) ─────────────────────────────── */}
      <div
        ref={graphRef}
        className="relative h-[260px] lg:h-auto bg-slate-950/60 border border-white/5 rounded-2xl overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
      >
        {/* Cyber grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />

        <div className="absolute top-3 left-4 z-20 text-[8px] font-mono font-black uppercase tracking-[0.25em] text-white/30">
          Resource Graph · Desired State
        </div>

        <svg className="absolute inset-0 w-full h-full p-4 overflow-visible" viewBox="0 0 400 240" preserveAspectRatio="none" fill="none">
          {/* Passthrough dashed base paths */}
          <path d="M 45,120 L 145,120 L 235,120" stroke="rgba(255,255,255,0.05)" strokeWidth={1.5} strokeDasharray="3 3" />
          {LEAF_NODES.map((n) => (
            <path key={n.id} d={`M 235,120 L 345,${n.y}`} stroke="rgba(255,255,255,0.05)" strokeWidth={1.5} strokeDasharray="3 3" />
          ))}
          {/* pibuster4 stays permanently dashed — unmanaged on purpose */}
          <path d={`M 235,120 L 345,${PIBUSTER_Y}`} stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="2 5" />

          {/* Active chain: repo → tfstate → pve */}
          {chainLit && (reducedMotion ? (
            <path d="M 45,120 L 145,120 L 235,120" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" className="drop-shadow-[0_0_8px_#8b5cf6]" />
          ) : (
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              d="M 45,120 L 145,120 L 235,120"
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_#8b5cf6]"
            />
          ))}

          {/* pve → managed leaves, lit from `planned` onward */}
          {LEAF_NODES.map((n) => {
            const state = leafState(n.k);
            if (state === 'pending') return null;
            const color = state === 'applied' ? '#10b981' : state === 'applying' ? '#f59e0b' : '#8b5cf6';
            const d = `M 235,120 L 345,${n.y}`;
            return reducedMotion ? (
              <path key={n.id} d={d} stroke={color} strokeWidth={2} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
            ) : (
              <motion.path
                key={n.id}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                d={d}
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 6px ${color})` }}
              />
            );
          })}

          {/* Violet particle riding the active edge — only while applying,
              in view, and motion is allowed */}
          {activeLeaf && inView && !reducedMotion && (
            <motion.circle
              r={3.5}
              fill="#8b5cf6"
              className="drop-shadow-[0_0_6px_#8b5cf6]"
              animate={{ cx: [235, 345], cy: [120, activeLeaf.y] }}
              transition={{ duration: 0.9, ease: 'linear', repeat: Infinity }}
            />
          )}
        </svg>

        {/* HTML node chips over the canvas */}
        {/* Chain: git repo → tfstate → pve */}
        {[
          { id: 'repo', label: 'git repo', sub: 'homelab-infra', x: '11.25%', y: '50%' },
          { id: 'tfstate', label: 'tfstate', sub: 'locked · v4', x: '36.25%', y: '50%' },
          { id: 'pve', label: 'pve', sub: 'Proxmox VE', x: '58.75%', y: '50%' },
        ].map((n) => (
          <div key={n.id} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-center z-10" style={{ left: n.x, top: n.y }}>
            <div className={`px-2.5 py-1.5 rounded-xl border font-mono text-[8px] font-black uppercase tracking-wider transition-all duration-500
              ${chainLit
                ? 'bg-violet-500/10 border-violet-500/40 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.2)]'
                : 'bg-slate-900/60 border-white/5 text-slate-500'
              }`}
            >
              {n.label}
            </div>
            <span className="text-[6px] text-slate-600 font-mono leading-none">{n.sub}</span>
          </div>
        ))}

        {/* Managed leaves */}
        {LEAF_NODES.map((n) => {
          const state = leafState(n.k);
          return (
            <div key={n.id} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-center z-10" style={{ left: '86.25%', top: `${(n.y / 240) * 100}%` }}>
              <div className={`relative px-2.5 py-1.5 rounded-xl border font-mono text-[8px] font-black uppercase tracking-wider transition-all duration-500 ${leafChipCls[state]}`}>
                {state === 'applying' && !reducedMotion && (
                  <motion.span
                    className="absolute inset-0 rounded-xl border border-amber-400/60"
                    animate={{ scale: [1, 1.35], opacity: [0.7, 0] }}
                    transition={{ duration: 1, ease: 'easeOut', repeat: Infinity }}
                  />
                )}
                {state === 'applied' ? '✓ ' : state !== 'pending' ? `${n.badge} ` : ''}{n.label}
              </div>
              <span className="text-[6px] text-slate-600 font-mono leading-none">{n.sub}</span>
            </div>
          );
        })}

        {/* pibuster4 honesty node — never lights */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-center z-10" style={{ left: '86.25%', top: `${(PIBUSTER_Y / 240) * 100}%` }}>
          <div className="px-2.5 py-1.5 rounded-xl border border-dashed border-white/15 bg-transparent font-mono text-[8px] font-bold uppercase tracking-wider text-slate-600">
            pibuster4
          </div>
          <span className="text-[6px] text-slate-600 font-mono leading-none">unmanaged · by choice</span>
        </div>
      </div>
    </div>
  );
};

export default TerraformSim;
