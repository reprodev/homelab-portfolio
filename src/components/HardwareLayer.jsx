import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import Badge from './Badge';
import ComputeCard from './ComputeCard';
import RationaleSection from './RationaleSection';
import { BookOpen, HardDrive, Network } from 'lucide-react';
import { ProxmoxLogo, UbuntuLogo, DietPiLogo, OMVLogo } from './BrandLogos';
import { HOST_VITALS, VIRTUAL_NODES } from '../data/fleet';
import { STORAGE } from '../data/storage';

const HypervisorTopology3D = lazy(() => import('./HypervisorTopology3D'));

// Node facts come from src/data/fleet.js; icons are resolved here so the data
// module stays JSX-free.
const NODE_ICONS = {
  ubuntu: <UbuntuLogo className="w-4 h-4 text-orange-400" />,
  dietpi: <DietPiLogo className="w-4 h-4 text-[#91C300]" />,
  omv: <OMVLogo className="w-4 h-4 text-[#4D80B3]" />,
};

const HardwareLayer = () => {
  const [scanningIndex, setScanningIndex] = React.useState(-1);
  const [scanStatusMessage, setScanStatusMessage] = React.useState('');
  const [view3D, setView3D] = useState(false);

  // Invariant §3.1: timers started by a user action are tracked and cleared on
  // unmount. The sonar scan previously leaked both its interval and its trailing
  // timeout if the section unmounted mid-scan.
  const scanTimersRef = useRef([]);
  const clearScanTimers = () => {
    scanTimersRef.current.forEach(clearInterval); // also clears timeouts
    scanTimersRef.current = [];
  };
  useEffect(() => clearScanTimers, []);

  const startSonarScan = () => {
    if (scanningIndex !== -1) return;

    let index = 0;
    setScanningIndex(0);
    setScanStatusMessage(`Pinging ${VIRTUAL_NODES[0].name}...`);

    const interval = setInterval(() => {
      index += 1;
      if (index < VIRTUAL_NODES.length) {
        setScanningIndex(index);
        setScanStatusMessage(`Pinging ${VIRTUAL_NODES[index].name}...`);
      } else {
        clearInterval(interval);
        setScanningIndex(-1);
        setScanStatusMessage("All nodes online (100% telemetry synced)");
        scanTimersRef.current.push(setTimeout(() => {
          setScanStatusMessage('');
        }, 3000));
      }
    }, 600);
    scanTimersRef.current.push(interval);
  };

  return (
    <section className="mb-8 select-none">
      {/* Control HUD Header with 3D Grid Toggle */}
      <div className="flex justify-between items-center mb-6 px-1">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E57000]/60 animate-ping" />
          Hardware Cluster // Proxmox VE Workspace
        </span>
        <button
          onClick={() => setView3D(!view3D)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-[9px] font-black uppercase transition-all duration-300 border relative z-30 ${
            view3D 
              ? 'bg-[#E57000]/15 text-[#E57000] border-[#E57000]/40 shadow-[0_0_15px_rgba(229,112,0,0.2)] hover:bg-[#E57000]/25' 
              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white shadow-md'
          }`}
        >
          <Network size={12} className={view3D ? "animate-pulse text-[#E57000]" : "text-slate-400"} />
          {view3D ? "🔌 View 2D Flat Cards" : "🕸️ Render 3D Grid"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view3D ? (
          <motion.div
            key="3d-topology"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full relative z-20"
          >
            <Suspense fallback={
              <div className="w-full h-[400px] md:h-[460px] rounded-2xl border border-white/10 bg-slate-950/40 flex items-center justify-center">
                <div className="text-white/20 text-[10px] md:text-xs font-mono uppercase tracking-[0.6em] animate-pulse">
                  Initializing 3D Hypervisor Canvas...
                </div>
              </div>
            }>
              <HypervisorTopology3D />
            </Suspense>
          </motion.div>
        ) : (
          <motion.div
            key="2d-cards"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Proxmox Hypervisor Box */}
            <Card 
              title={
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E57000]/10 border border-[#E57000]/20 rounded-xl">
                      <ProxmoxLogo className="h-5 w-5 text-[#E57000]" />
                      <span className="text-sm font-black tracking-tighter text-white">PROXMOX <span className="text-[#E57000]">VE</span></span>
                    </div>
                    <span className="hidden sm:inline text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mt-0.5 opacity-50">Local Hypervisor</span>
                  </div>
                  <a 
                    href="https://reprodev.com/is-the-reign-of-esxi-as-the-hypervisor-of-choice-for-learning-at-home-virtually-over/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400 hover:bg-purple-500/20 transition-all group/doc"
                  >
                    <BookOpen size={14} />
                  </a>
                </div>
              }
              className="lg:col-span-2" 
              glowColor="rgba(229, 112, 0, 0.1)"
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2 italic">Host Vitals</h4>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center border-b border-white/5 pb-4">
                      <span className="text-sm text-slate-300 font-medium tracking-tight italic">Processor</span>
                      <Badge color="muted">{HOST_VITALS.cpu}</Badge>
                    </li>
                    <li className="flex justify-between items-center border-b border-white/5 pb-4">
                      <span className="text-sm text-slate-300 font-medium tracking-tight italic">Memory Pool (RAM)</span>
                      <Badge color="muted">{HOST_VITALS.ram}</Badge>
                    </li>
                    <li className="flex justify-between items-center border-b border-white/5 pb-4">
                      <span className="text-sm text-slate-300 font-medium tracking-tight italic">Storage Controller</span>
                      <Badge color="azure">{HOST_VITALS.controller}</Badge>
                    </li>
                    <li className="flex justify-between items-center border-b border-white/5 pb-4">
                      <span className="text-sm text-slate-300 font-medium tracking-tight italic">Hypervisor</span>
                      <Badge color="amber">{HOST_VITALS.platform}</Badge>
                    </li>
                    <li className="flex justify-between items-center pt-2">
                      <span className="text-sm text-slate-300 font-medium tracking-tight italic">Running Guests</span>
                      <Badge color="success">{HOST_VITALS.guests}</Badge>
                    </li>
                  </ul>
                </div>
                
                <div className="flex-[2] text-left">
                  <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                    <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest italic m-0">Active Virtual Nodes</h4>
                    <div className="flex items-center gap-3">
                      {scanStatusMessage && (
                        <span className="text-[9px] font-mono text-emerald-400 animate-pulse uppercase tracking-wider">{scanStatusMessage}</span>
                      )}
                      <button 
                        onClick={startSonarScan}
                        disabled={scanningIndex !== -1}
                        className={`px-2.5 py-1 rounded-md font-mono text-[8px] font-black uppercase transition-all duration-300 relative z-20 ${
                          scanningIndex !== -1 
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]'
                        }`}
                      >
                        {scanningIndex !== -1 ? '🛰️ Pinging...' : '🛰️ Ping Telemetry'}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {VIRTUAL_NODES.map((vm, idx) => (
                      <ComputeCard
                        key={vm.name}
                        name={vm.name}
                        sub={vm.sub}
                        managedBy={vm.managed}
                        glowColor={vm.color}
                        icon={NODE_ICONS[vm.iconKey]}
                        isScanning={scanningIndex === idx}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Proxmox Storage */}
            <Card title="Storage Array Logic" glowColor="rgba(59, 130, 246, 0.1)">
              <ul className="space-y-4">
                {STORAGE.map((disk, idx) => (
                  <li
                    key={disk.id}
                    className={`flex justify-between items-center ${
                      idx === STORAGE.length - 1 ? 'pt-2' : 'border-b border-white/5 pb-4'
                    }`}
                  >
                    <span
                      className={`text-sm italic tracking-tight flex items-center gap-2 ${
                        disk.idle ? 'text-slate-500 opacity-50' : 'text-slate-300'
                      }`}
                    >
                      {disk.label}
                      {/* External volumes reach the NAS over USB rather than the
                          hypervisor's storage controller — marked so the list
                          doesn't imply they're all attached the same way. */}
                      {disk.external && (
                        <span className="px-1.5 py-0.5 rounded border border-azure/30 text-azure-light font-mono text-[8px] font-black uppercase tracking-wider not-italic">
                          USB3
                        </span>
                      )}
                    </span>
                    <Badge color={disk.badge}>{disk.capacity}</Badge>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <RationaleSection title="Rationale: Decoupled Compute & Resilience" color="amber" icon={HardDrive}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Decoupled Responsibility
            </h6>
            <p className="text-slate-400 text-xs font-medium leading-relaxed italic border-l-2 border-white/5 pl-4 ml-1">
              By separating the high-performance VM engine (Proxmox on x86) from the core control node (Raspberry Pi 4), this architecture ensures that critical security/ingress functions remain active even if the primary hypervisor undergoes maintenance or hardware upgrades.
            </p>
          </div>
          <div>
            <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Operational Flow
            </h6>
            <ul className="text-slate-400 text-xs space-y-3 list-none p-0">
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold">◃</span>
                <span><strong>Provisioning:</strong> VMs are cloned from Packer golden images and provisioned by Terraform; Ansible converges config — see Lifecycle 01 · Code.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold">◃</span>
                <span><strong>Storage Logic:</strong> Guest disks live on an NVMe-backed LVM datastore for high-IOPS workloads, while bulk media sits on passthrough and external volumes the hypervisor never has to arbitrate.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold">◃</span>
                <span><strong>Passthrough:</strong> Physical SATA IDs are passed directly to VMs to bypass virtual filesystem overhead.</span>
              </li>
            </ul>
          </div>
        </div>
      </RationaleSection>
    </section>
  );
};

export default HardwareLayer;
