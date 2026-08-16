import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSimEvent, usePrefersReducedMotion, SIM_EVENTS } from '../lib/simBus';
import useIsMobile from '../hooks/useIsMobile';
import useInViewPause from '../hooks/useInViewPause';
import { playSound } from '../lib/audio';
import { fleetById } from '../data/fleet';

/*
  Topology3D — interactive WebGL centerpiece.

  Renders the homelab as a live 3D graph: Cloudflare edge -> dual tunnel nodes
  -> Proxmox host -> VM / container workloads, with data-flow packets running the
  edges. It subscribes to the global simulation bus (src/lib/simBus.js) so it
  recolors and re-routes in lockstep with the rest of the page:
    - ddos:      edges + edge/tunnel nodes go red, packets surge
    - dr:        restore flow reverses (workloads <- repo) in amber, core pulses
    - transcode: the workloads tier lights amberGold
    - terraform: managed nodes tint violet during plan/apply; each per-resource
                 broadcast flips its node to an emerald "applied" pulse
                 (contract + node mapping: docs/iac-layer-spec.md §h)

  Heavy by nature, so it is lazy-loaded (React.lazy in App) and only mounts when
  scrolled into view. On mobile / prefers-reduced-motion it renders a static 2D
  fallback instead of a WebGL canvas.
*/

// Brand palette (mirrors tailwind.config.js)
const C = {
  azure: '#60a5fa',
  azureLight: '#93c5fd',
  amber: '#fbbf24',
  amberDark: '#d97706',
  emerald: '#10b981',
  red: '#ef4444',
  violet: '#a855f7', // terraform sim accent (palette addition — DR 2026-07-11)
  white: '#e2e8f0',
  slate: '#64748b',
};

// terraform sim: resource k (apply order) → topology node id (spec §h)
const TF_RESOURCE_NODES = { 1: 'tunB', 2: 'vm1', 3: 'vm3' };
const TF_MANAGED = ['tunB', 'vm1', 'vm3'];

// Node layout. id, position [x,y,z], label, sublabel, tier
const NODES = {
  edge:   { pos: [0, 4, 0],      label: 'Cloudflare Edge', sub: 'Zero Trust Tunnel', tier: 'edge', color: C.azure },
  tunA:   { pos: [-2.6, 1.6, 0], label: 'pibuster4',       sub: 'Primary Tunnel',    tier: 'edge', color: C.azure },
  tunB:   { pos: [2.6, 1.6, 0],  label: 'ha01',            sub: 'Failover Tunnel',   tier: 'edge', color: C.azure },
  core:   { pos: [0, -0.6, 0],   label: 'Proxmox VE',      sub: 'Hypervisor Core',   tier: 'core', color: C.amber },
  vm1:    { pos: [-3.4, -3, 0],  label: 'ZuluServer',      sub: 'Plex • Host',       tier: 'work', color: C.emerald },
  vm2:    { pos: [-1.1, -3.4, 0],label: 'Docker Pool',     sub: 'Microservices',     tier: 'work', color: C.emerald },
  vm3:    { pos: [1.1, -3.4, 0], label: 'OMV NAS',         sub: 'Storage',           tier: 'work', color: C.emerald },
  vm4:    { pos: [3.4, -3, 0],   label: 'Veeam Repo',      sub: 'Knightbox • DR',    tier: 'dr',   color: C.emerald },
  // Deliberately edge-less: the out-of-band monitor sits outside the dependency
  // chain so it survives anything below it failing. The visual detachment is the
  // point — same honesty device as the unmanaged pibuster4 node in TerraformSim.
  // Kept inside the |x| <= 3.4 envelope every other node respects: at x=-5.2 the
  // node and its nowrap <Html> label clipped the container's left edge on narrow
  // desktop widths, and the idle rotation swung it furthest of all.
  mon:    { pos: [-3.4, 1.9, 0],  label: 'Monitor Node',   sub: 'Out-of-Band',       tier: 'edge', color: C.azure },
};

// Directed edges [from, to]
const EDGES = [
  ['edge', 'tunA'], ['edge', 'tunB'],
  ['tunA', 'core'], ['tunB', 'core'],
  ['core', 'vm1'], ['core', 'vm2'], ['core', 'vm3'], ['core', 'vm4'],
];

/*
  Inspector chip copy per node (click-to-inspect).

  Nodes that correspond to a fleet host derive their text from src/data/fleet.js
  rather than restating it — these strings had already drifted once (the OMV entry
  said "6TB passthrough" and silently omitted the 10TB volume). Layout stays local
  per the topology-anchoring rule; only the copy comes from the data module.
*/
const fromFleet = (id, fallback) => {
  const n = fleetById(id);
  return n ? `${n.details.os} · ${n.details.disk || n.details.ram}` : fallback;
};

const NODE_DETAILS = {
  edge: 'WAF + Zero Trust ingress via dual Argo tunnels',
  tunA: 'Raspberry Pi 4 · cloudflared primary tunnel',
  tunB: 'DietPi node · cloudflared failover tunnel',
  core: 'Bare-metal hypervisor · VM + LXC fleet',
  mon:  'Independent watchdog · uptime probes + alert relay, off the critical path',
  vm1:  fromFleet('zulu', 'Ubuntu VM · Docker + Plex host'),
  vm2:  'Self-hosted Docker microservices pool',
  vm3:  fromFleet('nas', 'OpenMediaVault · passthrough + external storage'),
  vm4:  fromFleet('knightbox', 'Veeam backup repository'),
};

const v = (p) => new THREE.Vector3(p[0], p[1], p[2]);

// A single packet travelling along an edge.
function Packet({ from, to, color, speed = 0.35, offset = 0, reverse = false, size = 0.09 }) {
  const ref = useRef();
  const a = useMemo(() => v(from), [from]);
  const b = useMemo(() => v(to), [to]);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    let t = (clock.getElapsedTime() * speed + offset) % 1;
    if (reverse) t = 1 - t;
    ref.current.position.lerpVectors(a, b, t);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

// A node sphere with a glow + floating HTML label. Hover to highlight,
// click to pin the inspector chip (V5.0 showstopper pass).
function Node({ id, data, color, pulsing, isActive, onHover, onUnhover, onSelect }) {
  const ref = useRef();
  const matRef = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const base = isActive ? 1.18 : 1;
    if (pulsing) {
      const s = base + Math.sin(clock.getElapsedTime() * 6) * 0.12;
      ref.current.scale.setScalar(s);
      if (matRef.current) matRef.current.emissiveIntensity = 0.8 + Math.sin(clock.getElapsedTime() * 6) * 0.5;
    } else {
      ref.current.scale.setScalar(base);
      if (matRef.current) matRef.current.emissiveIntensity = isActive ? 1.4 : 0.6;
    }
  });
  const radius = data.tier === 'core' ? 0.5 : data.tier === 'edge' && data.label.includes('Cloudflare') ? 0.45 : 0.34;
  return (
    <group
      position={data.pos}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        onHover(id);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = '';
        onUnhover();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {/* Selection halo */}
      {isActive && (
        <mesh scale={[1.5, 1.5, 1.5]}>
          <sphereGeometry args={[radius, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.16} wireframe />
        </mesh>
      )}
      <mesh ref={ref}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          ref={matRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.35}
          metalness={0.2}
          toneMapped={false}
        />
      </mesh>
      <Html center distanceFactor={11} position={[0, -radius - 0.45, 0]} zIndexRange={[10, 0]}>
        <div style={{ pointerEvents: 'none', textAlign: 'center', whiteSpace: 'nowrap', transform: 'translateY(-2px)' }}>
          <div style={{ color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: '-0.02em', fontStyle: 'italic', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>{data.label}</div>
          <div style={{ color: 'rgba(148,163,184,0.95)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>{data.sub}</div>
        </div>
      </Html>
    </group>
  );
}

function Scene({ mode, tfApplied, reducedMotion, hoveredNode, selectedNode, onHover, onUnhover, onSelect }) {
  const groupRef = useRef();

  // Gentle idle rotation (disabled on reduced motion).
  useFrame((_, delta) => {
    if (reducedMotion || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.08;
  });

  // terraform mode helpers: a managed node counts as "applied" once its
  // resource broadcast (1..tfApplied) has fired.
  const tfNodeApplied = (id) =>
    Object.entries(TF_RESOURCE_NODES).some(([k, nodeId]) => nodeId === id && Number(k) <= tfApplied);

  // Resolve per-edge color + packet behaviour from the active mode.
  const edgeColor = (from, to) => {
    if (mode === 'ddos' && (from === 'edge' || to === 'edge' || from === 'tunA' || from === 'tunB')) return C.red;
    if (mode === 'dr' && (from === 'core' || to === 'vm4' || from === 'vm4')) return C.amber;
    if (mode === 'transcode' && (to === 'vm1' || to === 'vm2')) return C.amber;
    if (mode === 'terraform' && TF_MANAGED.includes(to)) return tfNodeApplied(to) ? C.emerald : C.violet;
    return NODES[to].tier === 'work' || NODES[to].tier === 'dr' ? C.emerald : C.azure;
  };

  const nodeColor = (id) => {
    if (mode === 'ddos' && (id === 'edge' || id === 'tunA' || id === 'tunB')) return C.red;
    if (mode === 'dr' && (id === 'core' || id === 'vm4')) return C.amber;
    if (mode === 'transcode' && (id === 'vm1' || id === 'vm2')) return C.amber;
    if (mode === 'terraform' && (id === 'core' || TF_MANAGED.includes(id))) {
      return tfNodeApplied(id) ? C.emerald : C.violet;
    }
    return NODES[id].color;
  };

  const isPulsing = (id) => {
    if (mode === 'ddos') return id === 'edge';
    if (mode === 'dr') return id === 'core' || id === 'vm4';
    if (mode === 'transcode') return id === 'vm1';
    // terraform: the control plane hums + the most recently applied node pops
    if (mode === 'terraform') return id === 'core' || id === TF_RESOURCE_NODES[tfApplied];
    return id === 'core';
  };

  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[6, 8, 8]} intensity={1.1} color={C.azureLight} />
      <pointLight position={[-6, -6, 4]} intensity={0.5} color={C.amber} />

      <group ref={groupRef}>
        {/* Edges */}
        {EDGES.map(([from, to], i) => {
          const col = edgeColor(from, to);
          const ddos = mode === 'ddos' && col === C.red;
          const drRestore = mode === 'dr' && (to === 'vm4' || from === 'vm4' || from === 'core');
          return (
            <group key={`e-${i}`}>
              <Line
                points={[NODES[from].pos, NODES[to].pos]}
                color={col}
                lineWidth={ddos ? 2.2 : 1.2}
                transparent
                opacity={0.35}
              />
              {!reducedMotion && (
                <>
                  <Packet from={NODES[from].pos} to={NODES[to].pos} color={col} speed={ddos ? 1.1 : 0.32} offset={i * 0.13} reverse={drRestore} />
                  {ddos && <Packet from={NODES[from].pos} to={NODES[to].pos} color={C.amber} speed={1.4} offset={i * 0.27} size={0.07} />}
                </>
              )}
            </group>
          );
        })}

        {/* Nodes */}
        {Object.entries(NODES).map(([id, data]) => (
          <Node
            key={id}
            id={id}
            data={data}
            color={nodeColor(id)}
            pulsing={isPulsing(id)}
            isActive={hoveredNode === id || selectedNode === id}
            onHover={onHover}
            onUnhover={onUnhover}
            onSelect={onSelect}
          />
        ))}
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={7}
        maxDistance={16}
        autoRotate={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
      />
    </>
  );
}

// Static 2D fallback for mobile / reduced-motion: the same topology, no WebGL.
function TopologyFallback({ mode }) {
  const tierBox = 'rounded-xl border px-3 py-2 text-center backdrop-blur-md transition-colors duration-500';
  const accent =
    mode === 'ddos' ? 'border-red-500/40 text-red-300 bg-red-500/5'
    : mode === 'dr' ? 'border-amber-500/40 text-amber-300 bg-amber-500/5'
    : mode === 'terraform' ? 'border-violet-500/40 text-violet-300 bg-violet-500/5'
    : 'border-azure/30 text-azure-light bg-azure/5';
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 py-10 px-4">
      <div className={`${tierBox} ${accent} w-48`}>
        <div className="text-[13px] font-black italic text-white">Cloudflare Edge</div>
        <div className="text-[9px] uppercase tracking-widest opacity-70">Zero Trust Tunnel</div>
      </div>
      <div className="text-slate-700 text-xl">↓</div>
      <div className="flex gap-4">
        {['pibuster4', 'ha01'].map((n) => (
          <div key={n} className={`${tierBox} border-azure/20 text-azure-light bg-azure/5 w-28`}>
            <div className="text-[11px] font-black italic text-white">{n}</div>
            <div className="text-[8px] uppercase tracking-widest opacity-70">CF Tunnel</div>
          </div>
        ))}
      </div>
      <div className="text-slate-700 text-xl">↓</div>
      <div className={`${tierBox} ${mode === 'dr' ? 'border-amber-500/40 text-amber-300 bg-amber-500/5' : 'border-amber-500/30 text-amber-300 bg-amber-500/5'} w-44`}>
        <div className="text-[13px] font-black italic text-white">Proxmox VE</div>
        <div className="text-[9px] uppercase tracking-widest opacity-70">Hypervisor Core</div>
      </div>
      <div className="text-slate-700 text-xl">↓</div>
      <div className="grid grid-cols-2 gap-3">
        {['ZuluServer', 'Docker Pool', 'OMV NAS', 'Veeam Repo'].map((n) => (
          <div key={n} className={`${tierBox} border-emerald-500/20 text-emerald-300 bg-emerald-500/5 w-28`}>
            <div className="text-[11px] font-black italic text-white">{n}</div>
          </div>
        ))}
      </div>
      {/* Content parity with the 3D scene's detached monitor node — shown apart
          from the chain above rather than beneath an arrow, for the same reason. */}
      <div className="pt-2 border-t border-white/5 w-48 flex justify-center">
        <div className={`${tierBox} border-azure/20 text-azure-light bg-azure/5 w-40 mt-4`}>
          <div className="text-[11px] font-black italic text-white">Monitor Node</div>
          <div className="text-[8px] uppercase tracking-widest opacity-70">Out-of-Band</div>
        </div>
      </div>
    </div>
  );
}

export default function Topology3D() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile(1024); // live-updating, swaps 3D/flat on breakpoint cross
  // Pause the WebGL frameloop entirely once the scene scrolls out of view —
  // otherwise the rAF loop renders forever in the background.
  const [viewRef, inView] = useInViewPause('200px');
  const [mode, setMode] = useState('default'); // default | ddos | dr | transcode | terraform
  const [tfApplied, setTfApplied] = useState(0); // resources converged so far (0..3)
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null); // click-pinned inspector

  useSimEvent(SIM_EVENTS.ddos, ({ active }) => setMode((m) => (active ? 'ddos' : m === 'ddos' ? 'default' : m)));
  useSimEvent(SIM_EVENTS.dr, ({ step }) => setMode((m) => (step > 0 && step < 4 ? 'dr' : m === 'dr' ? 'default' : m)));
  useSimEvent(SIM_EVENTS.transcode, ({ active }) => setMode((m) => (active ? 'transcode' : m === 'transcode' ? 'default' : m)));
  useSimEvent(SIM_EVENTS.terraform, ({ phase, resource }) => {
    const active = phase === 'plan' || phase === 'apply';
    setMode((m) => (active ? 'terraform' : m === 'terraform' ? 'default' : m));
    if (phase === 'apply' && resource) setTfApplied(resource);
    else if (!active) setTfApplied(0);
  });

  const useFlat = isMobile || reducedMotion;

  const statusLabel =
    mode === 'ddos' ? 'EDGE UNDER ATTACK' :
    mode === 'dr' ? 'FAILOVER IN PROGRESS' :
    mode === 'transcode' ? 'GPU TRANSCODE ACTIVE' :
    mode === 'terraform' ? 'IaC APPLY IN PROGRESS' : 'ALL SYSTEMS NOMINAL';
  const statusColor =
    mode === 'ddos' ? 'text-red-400' : mode === 'dr' ? 'text-amber-400' : mode === 'transcode' ? 'text-amber-400' : mode === 'terraform' ? 'text-violet-400' : 'text-emerald-400';

  return (
    <div ref={viewRef} className="relative w-full h-[460px] md:h-[560px] rounded-[2rem] border border-white/10 bg-black/40 overflow-hidden shadow-2xl crt-screen">
      {/* Status badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md">
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusColor.replace('text-', 'bg-')}`} />
        <span className={`text-[9px] font-mono font-black uppercase tracking-[0.2em] ${statusColor}`}>{statusLabel}</span>
      </div>
      {!useFlat && (
        <div className="absolute bottom-4 right-4 z-20 text-[8px] font-mono uppercase tracking-[0.2em] text-white/30 pointer-events-none">
          Drag to orbit • Scroll to zoom • Click node to inspect
        </div>
      )}

      {/* Node inspector chip — pinned by click, previewed on hover */}
      {!useFlat && (hoveredNode || selectedNode) && (() => {
        const activeId = hoveredNode || selectedNode;
        const node = NODES[activeId];
        if (!node) return null;
        return (
          <div className="absolute bottom-4 left-4 z-20 max-w-[260px] px-4 py-3 rounded-2xl bg-slate-950/85 border border-white/10 backdrop-blur-md shadow-2xl pointer-events-none">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: node.color, boxShadow: `0 0 8px ${node.color}` }} />
              <span className="text-[12px] font-black italic text-white leading-none">{node.label}</span>
              {selectedNode === activeId && (
                <span className="text-[7px] font-mono uppercase tracking-[0.2em] text-azure-light/70 border border-azure/20 rounded px-1 py-0.5">Pinned</span>
              )}
            </div>
            <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-slate-400 mb-1.5">{node.sub}</div>
            <div className="text-[10px] text-slate-300 leading-relaxed">{NODE_DETAILS[activeId]}</div>
          </div>
        );
      })()}

      {useFlat ? (
        <TopologyFallback mode={mode} />
      ) : (
        <Canvas
          frameloop={inView ? 'always' : 'never'}
          camera={{ position: [0, 0.5, 11], fov: 50 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          onPointerMissed={() => setSelectedNode(null)}
        >
          <Suspense fallback={null}>
            <Scene
              mode={mode}
              tfApplied={tfApplied}
              reducedMotion={reducedMotion}
              hoveredNode={hoveredNode}
              selectedNode={selectedNode}
              onHover={setHoveredNode}
              onUnhover={() => setHoveredNode(null)}
              onSelect={(id) => {
                playSound('ping');
                setSelectedNode((prev) => (prev === id ? null : id));
              }}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
