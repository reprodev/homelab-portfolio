import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import Badge from './Badge';
import RationaleSection from './RationaleSection';
import { BookOpen, Cpu, ChevronDown, Activity, Terminal as TerminalIcon } from 'lucide-react';
import { UbuntuLogo, DietPiLogo, OMVLogo, RaspberryPiLogo } from './BrandLogos';
import useTypewriter from '../hooks/useTypewriter';

const TerraformLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M1.44 0v7.575l6.561 3.79V3.787L1.44 0zm7.222 4.168l6.562 3.787v7.575l-6.562-3.79V4.168zM1.44 8.425l6.561 3.79v7.575l-6.561-3.79V8.425zm7.222 4.168l6.562 3.787v7.575l-6.562-3.79v-7.572zm7.222-8.425v7.575l6.561 3.79V3.787L15.884 0z"/>
  </svg>
);

const AnsibleLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.2c5.413 0 9.8 4.387 9.8 9.8 0 5.413-4.387 9.8-9.8 9.8-5.413 0-9.8-4.387-9.8-9.8 0-5.413 4.387-9.8 9.8-9.8zm-.01 2.923l-5.61 13.846h2.24l1.12-2.923h4.48l1.12 2.923h2.24L12.01 5.123h-.02zm.02 2.654l1.64 4.308h-3.28l1.64-4.308z"/>
  </svg>
);

const KubernetesLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.44 0a1.51 1.51 0 0 0-1.06.44L3.12 8.16a1.53 1.53 0 0 0-.44 1.06v10.56a1.53 1.53 0 0 0 .44 1.06l8.26 8.26a1.53 1.53 0 0 0 2.12 0l8.26-8.26a1.53 1.53 0 0 0 .44-1.06V9.22a1.53 1.53 0 0 0-.44-1.06L13.5.44A1.51 1.51 0 0 0 12.44 0Zm0 2.12 7.74 7.74v10.3l-7.74 7.74-7.74-7.74V9.86l7.74-7.74Zm0 3.54a1.06 1.06 0 0 0-.75.31l-4.43 4.43a1.06 1.06 0 0 0-.31.75v6.19a1.06 1.06 0 0 0 .31.75l4.43 4.43a1.06 1.06 0 0 0 1.5 0l4.43-4.43a1.06 1.06 0 0 0 .31-.75v-6.19a1.06 1.06 0 0 0-.31-.75l-4.43-4.43a1.06 1.06 0 0 0-.75-.31Zm0 2.12 3.37 3.37v4.75L12.44 19.3l-3.37-3.37v-4.75l3.37-3.37Z"/>
  </svg>
);

const LogicalLayer = () => {
  const [expandedNode, setExpandedNode] = React.useState(null);

  const fleetData = [
    { 
      id: 'pi4',
      icon: <RaspberryPiLogo className="w-5 h-5 text-rose-500" />, 
      name: "pibuster4", 
      tag: "Bare-metal", 
      sub: "Control Head / Ingress", 
      percent: 45, 
      color: "emerald",
      details: {
        os: "Debian 12 (PiOS)",
        cpu: "4-Core ARM Cortex-A72",
        ram: "4GB LPDDR4",
        disk: "500GB USB 3.0 SSD",
        net: "Eth0 (Physical)",
        services: ["Cloudflared HA", "Ansible GitOps", "Uptime Kuma", "Dozzle Main"],
        guideUrl: "https://reprodev.com/set-up-raspberry-pi/"
      }
    },
    { 
      id: 'zulu',
      icon: <UbuntuLogo className="w-5 h-5 text-orange-400" />, 
      name: "ZuluServer", 
      tag: "Ubuntu VM", 
      sub: "Data Core / Observability", 
      percent: 85, 
      color: "amber",
      details: {
        os: "Ubuntu 24.04 LTS (HWE)",
        cpu: "Proxmox VM (2-vCPU)",
        ram: "8GB Allocated",
        disk: "180GB (local-lvm)",
        net: "vBridge (Internal)",
        services: ["Plex Media Server", "Prometheus / Grafana", "Nginx Proxy Mgr", "Terraform Repo"],
        guideUrl: "https://reprodev.com/tag/install-guides/"
      }
    },
    { 
      id: 'ha',
      icon: <DietPiLogo className="w-5 h-5 text-[#91C300]" />, 
      name: "DietPi HA Fleet", 
      tag: "Micro VMs", 
      sub: "Distributed Services", 
      percent: 30, 
      color: "azure",
      details: {
        os: "DietPi (Optimized Debian)",
        cpu: "1-vCPU per Instance",
        ram: "2GB / 8GB Disk each",
        net: "HA Overlay (Mesh)",
        services: ["CF Tunnel (ha01)", "Vaultwarden (ha02)", "Guac / Pi-hole (ha03)"]
      }
    },
    { 
      id: 'nas',
      icon: <OMVLogo className="w-5 h-5 text-[#4D80B3]" />, 
      name: "OMV NAS VM", 
      tag: "Debian VM", 
      sub: "Disk Passthrough", 
      percent: 70, 
      color: "emerald",
      details: {
        os: "OpenMediaVault (Debian)",
        cpu: "IOThread-Optimized",
        ram: "8GB Allocated",
        disk: "6TB (Physical Passthrough)",
        net: "Storage VLAN (Fixed)",
        services: ["SMB / CIFS Shares", "NFS Exports", "Disk Quotas", "Smartmontools"]
      }
    }
  ];

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Compute Fleet (Proxmox + ARM)" className="lg:col-span-2" glowColor="rgba(251, 191, 36, 0.1)">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fleetData.map(node => (
                <NodeRing 
                  key={node.id}
                  {...node} 
                  isExpanded={expandedNode === node.id}
                  onClick={() => setExpandedNode(expandedNode === node.id ? null : node.id)}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {expandedNode && (
                <motion.div
                  key={expandedNode}
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden border-t border-white/5 pt-4"
                >
                  <NodeDetailPanel node={fleetData.find(n => n.id === expandedNode)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        <Card title={
          <div className="flex items-center gap-3">
            <KubernetesLogo className="w-5 h-5 text-[#326CE5]" />
            <span>K3s Cluster Sandbox</span>
          </div>
        } glowColor="rgba(50, 108, 229, 0.15)">
           <ul className="space-y-4 mb-12">
            <li className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-sm text-slate-300 italic tracking-tight font-medium">Control Plane</span>
              <Badge color="success">2 Cores / 2GB</Badge>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-sm text-slate-300 italic tracking-tight font-medium">Worker Node</span>
              <Badge color="azure">2 Cores / 2GB</Badge>
            </li>
            <li className="flex justify-between items-center pt-2">
              <span className="text-sm text-slate-300 italic tracking-tight font-medium">OS Template</span>
              <Badge color="muted">Ubuntu 24.04 LTS</Badge>
            </li>
          </ul>
          <div className="flex flex-wrap gap-2 mt-auto">
            <Badge color="azure">Terraform Managed</Badge>
            <Badge color="muted">prevent_destroy = false</Badge>
            <Badge color="success">CI/CD Triggered</Badge>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card title={
          <div className="flex items-center gap-3">
            <TerraformLogo className="w-5 h-5 text-[#7B42BC]" />
            <span>Infrastructure as Code</span>
          </div>
        } glowColor="rgba(123, 66, 188, 0.1)">
          <div className="flex flex-col gap-4">
            <p className="text-xs text-slate-400 italic leading-relaxed">
              Utilizing <strong>HashiCorp Terraform</strong> to provision immutable virtual machines and network bridges across the local hypervisor fleet.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge color="muted">PVE-Provider</Badge>
              <Badge color="muted">Cloud-Init</Badge>
              <Badge color="muted">HCL-Modules</Badge>
            </div>
          </div>
        </Card>

        <Card title={
          <div className="flex items-center gap-3">
            <AnsibleLogo className="w-5 h-5 text-[#EE0000]" />
            <span>Configuration Management</span>
          </div>
        } glowColor="rgba(238, 0, 0, 0.1)">
          <div className="flex flex-col gap-4">
            <p className="text-xs text-slate-400 italic leading-relaxed">
              <strong>RedHat Ansible</strong> handles the desired-state configuration of OS packages, user identities, and security hardening after initial provisioning.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge color="muted">Playbooks</Badge>
              <Badge color="muted">Inventory HA</Badge>
              <Badge color="muted">Vault Vars</Badge>
            </div>
          </div>
        </Card>
      </div>

      <RationaleSection title="Rationale: Declarative State & GitOps" color="emerald" icon={TerminalIcon}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Infrastructure as Code (IaC)
            </h6>
            <p className="text-slate-400 text-xs font-medium leading-relaxed italic border-l-2 border-white/5 pl-4 ml-1">
              Treating infrastructure as "cattle, not pets" is central to this design. All nodes, whether virtual or physical, are provisioned via <strong>Terraform</strong> and configured via <strong>Ansible</strong>. This ensures that the entire environment is reproducible and version-controlled.
            </p>
          </div>
          <div>
            <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-azure" /> Strategic Decision
            </h6>
            <ul className="text-slate-400 text-xs space-y-3 list-none p-0">
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 font-bold">◃</span>
                <span><strong>Desired State:</strong> Systemd timers execute automated reconciliation to sync cluster state with Git repositories.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 font-bold">◃</span>
                <span><strong>Automation Layer:</strong> Ansible handles the imperative host setup while Docker Compose manages the declarative workload stack.</span>
              </li>
            </ul>
          </div>
        </div>
      </RationaleSection>
    </section>
  );
};

const NodeRing = ({ icon, name, tag, sub, percent, color, isExpanded, onClick, details }) => {
  const accentColor = color === 'emerald' ? 'text-emerald-400' : color === 'azure' ? 'text-azure' : 'text-amber-400';
  const glowBg = color === 'emerald' ? 'bg-emerald-500' : color === 'azure' ? 'bg-azure' : 'bg-amber-500';

  return (
    <motion.button 
      whileHover={{ scale: 1.02, x: 5, backgroundColor: "rgba(255,255,255,0.08)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative flex items-center gap-4 p-5 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl transition-all duration-500 text-left w-full overflow-hidden ${
        isExpanded 
          ? 'bg-slate-800/60 border-white/20 shadow-xl' 
          : 'hover:border-white/10'
      }`}
    >
      <div className={`absolute top-0 left-0 bottom-0 w-1 ${glowBg} ${isExpanded ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'} transition-opacity`} />
      
      <div className={`p-2 bg-black/40 rounded-lg border border-white/5 group-hover:border-white/20 transition-all ${isExpanded ? 'scale-110 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : ''}`}>
        {icon}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-black text-white italic uppercase tracking-tight">{name}</h4>
          <motion.span 
            animate={isExpanded ? { scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" } : { scale: 1 }}
            className={`text-[8px] font-black px-1.5 py-0.5 border rounded uppercase tracking-tighter ${isExpanded ? 'border-white/20 text-white' : 'border-white/5 text-slate-500'}`}
          >
            {tag}
          </motion.span>
        </div>
        <div className="text-[10px] text-slate-500 font-medium mb-2 truncate">{sub}</div>
        
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              className={`h-full rounded-full ${glowBg} shadow-[0_0_8px_currentColor]`}
            />
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0, color: isExpanded ? "#fff" : "#475569" }}
          >
            <ChevronDown size={14} />
          </motion.div>
        </div>
      </div>
    </motion.button>
  );
};

const NodeDetailPanel = ({ node }) => (
  <div className="bg-slate-950/20 rounded-2xl p-6 border border-white/5 backdrop-blur-md relative overflow-hidden">
    <div className="absolute right-0 top-0 p-8 opacity-5">
      <Activity size={120} strokeWidth={0.5} className="text-white" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
      <div className="space-y-4">
        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Telemetry / Vitals</h5>
        <ul className="space-y-2">
          <li className="flex justify-between text-[11px] border-b border-white/5 pb-2">
            <span className="text-slate-500 font-medium italic tracking-tight">OS Distribution</span>
            <span className="text-white font-mono">{node.details.os}</span>
          </li>
          <li className="flex justify-between text-[11px] border-b border-white/5 pb-2">
            <span className="text-slate-500 font-medium italic tracking-tight">Logic Threads</span>
            <span className="text-white font-mono">{node.details.cpu}</span>
          </li>
          <li className="flex justify-between text-[11px] border-b border-white/5 pb-2">
            <span className="text-slate-500 font-medium italic tracking-tight">Addressable RAM</span>
            <span className="text-white font-mono">{node.details.ram}</span>
          </li>
          <li className="flex justify-between text-[11px]">
            <span className="text-white/40 font-black uppercase tracking-widest text-[9px]">Status</span>
            <span className="text-emerald-400 font-mono flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
              RECONCILED
            </span>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Critical Services</h5>
        <div className="flex flex-wrap gap-2">
          {node.details.services.map((service, i) => (
            <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-300 font-mono font-medium shadow-sm hover:border-emerald-500/50 transition-colors">
              {service}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default LogicalLayer;
