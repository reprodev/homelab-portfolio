import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../lib/simBus';
import useIsMobile from '../hooks/useIsMobile';
import useInViewPause from '../hooks/useInViewPause';
import { HardDrive, Server, Cpu, Database } from 'lucide-react';

/*
  HypervisorTopology3D — Interactive WebGL centerpiece for the Hardware Layer.
  Allows toggling between 2D cards and a stunning 3D storage + hypervisor mesh.
  Supports raycasting / hover events that highlight disk pass-through channels in neon green.
*/

// Brand palette matching existing aesthetic
const C = {
  azure: '#60a5fa',
  azureLight: '#93c5fd',
  amber: '#fbbf24',
  amberDark: '#d97706',
  emerald: '#10b981',
  red: '#ef4444',
  white: '#e2e8f0',
  slate: '#64748b',
  neonGreen: '#39ff14',
  neonCyan: '#00ffff'
};

const NODES = {
  core: { pos: [0, 0.4, 0], label: 'Proxmox VE', sub: 'Hypervisor Core', type: 'core', color: C.amber },
  // Compute VMs
  vm1: { pos: [-3.2, 1.8, 0.8], label: 'ZuluServer', sub: 'Plex • Ubuntu', type: 'vm', color: C.emerald, storage: ['st1', 'st2'] },
  vm2: { pos: [-2.8, -1.0, 0.8], label: 'OMV NAS', sub: 'Storage VM', type: 'vm', color: C.azure, storage: ['st3'] },
  vm3: { pos: [2.5, 1.8, 0.8], label: 'ha01 (CF)', sub: 'Primary Tunnel', type: 'vm', color: C.emerald, storage: ['st2'] },
  vm4: { pos: [3.3, 0.3, 0.8], label: 'ha02 (Vault)', sub: 'Vault Cluster', type: 'vm', color: C.emerald, storage: ['st2'] },
  vm5: { pos: [2.5, -1.2, 0.8], label: 'ha03 (Guac)', sub: 'Remote Access', type: 'vm', color: C.emerald, storage: ['st2'] },
  vm6: { pos: [0, 2.8, 0.5], label: 'Templates', sub: 'Cloud-Init VM', type: 'vm', color: C.amber, storage: ['st1'] },
  // Storage arrays
  st1: { pos: [-2.6, -3.2, -0.6], label: 'nvme0n1 LVM', sub: '1 TB NVMe Cache', type: 'storage', color: C.azure },
  st2: { pos: [0, -3.5, -0.6], label: 'sda & sdc', sub: '2 TB SATA Array', type: 'storage', color: C.emerald },
  st3: { pos: [2.6, -3.2, -0.6], label: 'sdb WD Red', sub: '6 TB WD Red HDD', type: 'storage', color: C.amber }
};

const CORE_LINKS = [
  ['core', 'vm1'], ['core', 'vm2'], ['core', 'vm3'],
  ['core', 'vm4'], ['core', 'vm5'], ['core', 'vm6']
];

const STORAGE_LINKS = [
  { from: 'vm1', to: 'st1', label: 'LVM Cache Pass' },
  { from: 'vm1', to: 'st2', label: 'Transcode Data' },
  { from: 'vm2', to: 'st3', label: 'Physical SATA Pass' },
  { from: 'vm3', to: 'st2', label: 'SATA Storage' },
  { from: 'vm4', to: 'st2', label: 'SATA Storage' },
  { from: 'vm5', to: 'st2', label: 'SATA Storage' },
  { from: 'vm6', to: 'st1', label: 'LVM Temp Storage' }
];

const v = (p) => new THREE.Vector3(p[0], p[1], p[2]);

// A high-speed packet tracing storage pathways
function StoragePacket({ from, to, color, speed = 1.2, offset = 0, size = 0.08 }) {
  const ref = useRef();
  const a = useMemo(() => v(from), [from]);
  const b = useMemo(() => v(to), [to]);
  
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.getElapsedTime() * speed + offset) % 1;
    ref.current.position.lerpVectors(a, b, t);
  });
  
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 10, 10]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

// A node in the hypervisor topology
function HypervisorNode({ id, data, isHovered, onHover, onUnhover, reducedMotion }) {
  const ref = useRef();
  const matRef = useRef();
  
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const baseScale = isHovered ? 1.25 : 1.0;
    // Respect prefers-reduced-motion: hold a steady scale, keep hover emphasis
    const pulse = reducedMotion ? 0 : isHovered ? Math.sin(clock.getElapsedTime() * 12) * 0.08 : Math.sin(clock.getElapsedTime() * 3) * 0.03;
    ref.current.scale.setScalar(baseScale + pulse);
    
    if (matRef.current) {
      matRef.current.emissiveIntensity = isHovered ? 1.5 : 0.65;
    }
  });

  const radius = data.type === 'core' ? 0.5 : data.type === 'storage' ? 0.38 : 0.32;
  const sphereColor = isHovered ? C.neonGreen : data.color;

  return (
    <group 
      position={data.pos}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(id);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onUnhover();
      }}
    >
      <mesh ref={ref} castShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          ref={matRef}
          color={sphereColor}
          emissive={sphereColor}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.4}
          toneMapped={false}
        />
      </mesh>
      
      {/* Node Halo */}
      {isHovered && (
        <mesh scale={[1.4, 1.4, 1.4]}>
          <sphereGeometry args={[radius, 16, 16]} />
          <meshBasicMaterial color={C.neonGreen} transparent opacity={0.15} wireframe />
        </mesh>
      )}

      <Html center distanceFactor={10} position={[0, -radius - 0.4, 0]} zIndexRange={[10, 0]}>
        <div className="pointer-events-none text-center select-none">
          <div className={`text-[12px] font-black italic text-white transition-all duration-300 ${isHovered ? 'scale-105 text-[#39ff14] drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]' : 'drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]'}`}>
            {data.label}
          </div>
          <div className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider leading-none mt-0.5 opacity-90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            {data.sub}
          </div>
        </div>
      </Html>
    </group>
  );
}

function HypervisorScene({ hoveredNode, onHover, onUnhover, reducedMotion }) {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (reducedMotion || !groupRef.current) return;
    // Gentle floating rotate
    groupRef.current.rotation.y += delta * 0.06;
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 10, 5]} intensity={1.2} color={C.azureLight} />
      <pointLight position={[-5, -10, -5]} intensity={0.7} color={C.amber} />
      
      <group ref={groupRef}>
        {/* Core-VM Links */}
        {CORE_LINKS.map(([from, to], i) => {
          const isRelatedHover = hoveredNode === from || hoveredNode === to;
          const col = isRelatedHover ? C.neonCyan : C.slate;
          return (
            <Line
              key={`core-l-${i}`}
              points={[NODES[from].pos, NODES[to].pos]}
              color={col}
              lineWidth={isRelatedHover ? 1.8 : 0.8}
              transparent
              opacity={isRelatedHover ? 0.7 : 0.2}
            />
          );
        })}

        {/* Disk Pass-through Channels (Storage Links) */}
        {STORAGE_LINKS.map((link, i) => {
          // Glow green if either VM or Storage Node is hovered
          const isActive = hoveredNode === link.from || hoveredNode === link.to;
          const col = isActive ? C.neonGreen : C.slate;
          const opacity = isActive ? 0.95 : 0.15;
          const width = isActive ? 2.5 : 1.0;

          return (
            <group key={`store-l-${i}`}>
              <Line
                points={[NODES[link.from].pos, NODES[link.to].pos]}
                color={col}
                lineWidth={width}
                transparent
                opacity={opacity}
              />
              
              {/* Highlight label on hover */}
              {isActive && (
                <Html 
                  position={[
                    (NODES[link.from].pos[0] + NODES[link.to].pos[0]) / 2,
                    (NODES[link.from].pos[1] + NODES[link.to].pos[1]) / 2 + 0.25,
                    (NODES[link.from].pos[2] + NODES[link.to].pos[2]) / 2
                  ]}
                  center
                  distanceFactor={10}
                >
                  <div className="px-2 py-0.5 bg-slate-950/95 border border-emerald-500/35 rounded-md font-mono text-[7px] font-black uppercase text-emerald-400 tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.35)] whitespace-nowrap animate-pulse select-none pointer-events-none">
                    {link.label}
                  </div>
                </Html>
              )}

              {/* Data Flow Packets on hovered paths */}
              {isActive && !reducedMotion && (
                <>
                  <StoragePacket from={NODES[link.from].pos} to={NODES[link.to].pos} color={C.neonGreen} offset={0} />
                  <StoragePacket from={NODES[link.to].pos} to={NODES[link.from].pos} color={C.neonGreen} offset={0.5} />
                </>
              )}
            </group>
          );
        })}

        {/* Render Nodes */}
        {Object.entries(NODES).map(([id, data]) => {
          const isNodeHovered = hoveredNode === id || 
            (NODES[hoveredNode]?.storage?.includes(id)) || 
            (NODES[id]?.storage?.includes(hoveredNode));

          return (
            <HypervisorNode
              key={id}
              id={id}
              data={data}
              isHovered={isNodeHovered}
              onHover={onHover}
              onUnhover={onUnhover}
              reducedMotion={reducedMotion}
            />
          );
        })}
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={6}
        maxDistance={12}
        autoRotate={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.5}
      />
    </>
  );
}

// Mobile/Fallback static grid of connections
function HypervisorFallback({ hoveredNode, setHoveredNode }) {
  const getCardStyle = (id, data) => {
    const isActive = hoveredNode === id || 
      (NODES[hoveredNode]?.storage?.includes(id)) || 
      (NODES[id]?.storage?.includes(hoveredNode));

    if (isActive) {
      return 'border-[#39ff14] text-[#39ff14] bg-[#39ff14]/5 shadow-[0_0_15px_rgba(57,255,20,0.15)] scale-[1.03]';
    }
    return 'border-white/5 text-slate-400 bg-slate-950/40 hover:border-white/10 hover:bg-slate-900/30';
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-6 select-none font-mono">
      {/* Hypervisor Node */}
      <div 
        onMouseEnter={() => setHoveredNode('core')}
        onMouseLeave={() => setHoveredNode(null)}
        className={`px-5 py-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all duration-300 ${getCardStyle('core', NODES.core)}`}
      >
        <Server size={14} />
        <div className="text-[12px] font-black uppercase tracking-wider">Proxmox VE (Hypervisor)</div>
      </div>

      <div className="w-[1px] h-4 bg-slate-800" />

      {/* VM Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-[500px]">
        {Object.entries(NODES).filter(([_, n]) => n.type === 'vm').map(([id, n]) => (
          <div
            key={id}
            onMouseEnter={() => setHoveredNode(id)}
            onMouseLeave={() => setHoveredNode(null)}
            className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${getCardStyle(id, n)}`}
          >
            <Cpu size={12} className="mb-1" />
            <div className="text-[10px] font-black text-white">{n.label}</div>
            <div className="text-[7px] text-slate-500 uppercase tracking-widest">{n.sub}</div>
          </div>
        ))}
      </div>

      <div className="w-[1px] h-4 bg-slate-800" />

      {/* Storage Disk Grid */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[550px]">
        {Object.entries(NODES).filter(([_, n]) => n.type === 'storage').map(([id, n]) => (
          <div
            key={id}
            onMouseEnter={() => setHoveredNode(id)}
            onMouseLeave={() => setHoveredNode(null)}
            className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${getCardStyle(id, n)}`}
          >
            <Database size={12} className="mb-1" />
            <div className="text-[10px] font-black text-white">{n.label}</div>
            <div className="text-[7px] text-slate-500 uppercase tracking-widest">{n.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HypervisorTopology3D() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile(1024); // live-updating, swaps 3D/flat on breakpoint cross
  // Pause the WebGL frameloop when the mesh scrolls out of view (perf guard)
  const [viewRef, inView] = useInViewPause('200px');
  const [hoveredNode, setHoveredNode] = useState(null);

  const useFlat = isMobile || reducedMotion;

  return (
    <div ref={viewRef} className="relative w-full h-[400px] md:h-[460px] rounded-2xl border border-white/5 bg-slate-950/40 overflow-hidden shadow-xl flex items-center justify-center select-none blueprint-dots">
      {/* Top Banner HUD instructions */}
      <div className="absolute top-3 left-4 z-20 flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[8px] font-mono font-black uppercase tracking-[0.2em] text-emerald-400">
          {hoveredNode ? `CONNECTED TO: ${NODES[hoveredNode]?.label}` : 'HYPERVISOR INTERACTIVE MESH'}
        </span>
      </div>

      {!useFlat && (
        <div className="absolute bottom-3 right-4 z-20 text-[7px] font-mono uppercase tracking-[0.2em] text-white/30 pointer-events-none select-none">
          Hover node to inspect disk pass-through • Drag to orbit
        </div>
      )}

      {useFlat ? (
        <HypervisorFallback hoveredNode={hoveredNode} setHoveredNode={setHoveredNode} />
      ) : (
        <Canvas 
          frameloop={inView ? 'always' : 'never'}
          camera={{ position: [0, 0.2, 8.5], fov: 45 }} 
          dpr={[1, 1.5]} 
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <HypervisorScene 
              hoveredNode={hoveredNode} 
              onHover={setHoveredNode} 
              onUnhover={() => setHoveredNode(null)} 
              reducedMotion={reducedMotion} 
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
