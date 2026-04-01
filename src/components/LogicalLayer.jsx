import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import Badge from './Badge';
import { BookOpen } from 'lucide-react';
import useTypewriter from '../hooks/useTypewriter';

const LogicalLayer = () => {
  const [expandedNode, setExpandedNode] = React.useState(null);

  const gitopsText = `Checking for changes...
Pulling latest Ansible playbooks...
Reconciling ZuluServer configs...
Applying k3s manifest updates...
[SUCCESS] Cluster state verified.`;

  const { displayedText } = useTypewriter(gitopsText, 30, 1000);

  const fleetData = [
    { 
      id: 'pi4',
      icon: "🍓", 
      name: "pibuster4", 
      tag: "Physical bare-metal", 
      sub: "Control Head / Ingress", 
      percent: 45, 
      color: "bg-emerald-500",
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
      icon: "🖥️", 
      name: "ZuluServer", 
      tag: "Ubuntu VM", 
      sub: "Data Core / Observability", 
      percent: 85, 
      color: "bg-amber-500",
      details: {
        os: "Ubuntu 24.04 LTS (HWE)",
        cpu: "Proxmox VM (2-vCPU)",
        ram: "8GB Allocated",
        disk: "180GB (local-lvm)",
        net: "vBridge (Internal)",
        services: ["Plex / Tautulli", "Prometheus / Grafana", "Nginx Proxy Mgr", "Terraform Repo"],
        guideUrl: "https://reprodev.com/tag/install-guides/"
      }
    },
    { 
      id: 'ha',
      icon: "📦", 
      name: "DietPi HA Fleet", 
      tag: "3x Micro VMs", 
      sub: "Distributed Microservices", 
      percent: 30, 
      color: "bg-blue-500",
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
      icon: "💾", 
      name: "OpenMediaVault NAS VM", 
      tag: "Debian VM", 
      sub: "Physical Disk Passthrough", 
      percent: 70, 
      color: "bg-purple-500",
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
    <section className="mb-24">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-2 border-b border-white/5 pb-4">
        <h3 className="text-3xl font-extralight tracking-tight text-white m-0">Layer 3: Logical Infrastructure & Orchestration</h3>
        <span className="text-sm font-mono text-slate-400">
          Core Skills: <strong className="text-emerald-400 font-normal">GitOps Automation, Kubernetes Declarative State, Virtual Machine Orchestration</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compute Fleet */}
        <Card 
          title="Compute Fleet (Proxmox + ARM)" 
          className="lg:col-span-2" 
          glowColor="rgba(251, 191, 36, 0.1)"
        >
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

        {/* K3s Sandbox */}
        <Card title="☸️ K3s Sandbox" glowColor="rgba(45, 212, 191, 0.15)">
           <ul className="space-y-4 mb-8">
            <li className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-sm text-slate-300 font-medium">Control Plane</span>
              <Badge color="success">2 Cores / 2GB</Badge>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-sm text-slate-300 font-medium">Worker Node</span>
              <Badge color="azure">2 Cores / 2GB</Badge>
            </li>
            <li className="flex justify-between items-center pt-2">
              <span className="text-sm text-slate-300 font-medium">OS Template</span>
              <Badge color="muted">Ubuntu 24.04 LTS</Badge>
            </li>
          </ul>
          <div className="flex flex-wrap gap-2 mt-auto">
            <span className="px-3 py-1 border border-rose-500/30 text-rose-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">Terraform Managed</span>
            <span className="px-3 py-1 bg-white/5 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">prevent_destroy = false</span>
          </div>
        </Card>

        {/* Hardware IaC Configuration Card */}
        <Card title="🛠️ Hardware IaC Configuration" className="lg:col-span-2" glowColor="rgba(99, 102, 241, 0.1)">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">Direct physical disk attachment to OpenMediaVault NAS VM using stable hardware identifiers, bypassing host-level <code className="text-slate-200 bg-white/5 px-1 rounded">/etc/fstab</code> for enterprise persistence.</p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-xl shadow-inner">🛡️</div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-azure">Persistence Logic</span>
                    <span className="text-xs text-slate-300 font-medium italic">Stable Device-ID Mapping</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-azure/5 border border-azure/20 rounded-xl">
                    <span className="block text-[9px] font-black uppercase text-azure-light mb-1">Controller</span>
                    <code className="text-[10px] text-slate-300 font-mono">virtio-scsi-pci</code>
                  </div>
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                    <span className="block text-[9px] font-black uppercase text-emerald-400 mb-1">Optimization</span>
                    <code className="text-[10px] text-slate-300 font-mono">IOThread = 1</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <Terminal header="Proxmox Host CLI">
                <span className="text-blue-400/70"># Set SCSI controller & pass physical 6TB drive</span><br />
                <span className="text-slate-100">qm set</span> &lt;OMV_VMID&gt; <span className="text-emerald-400">-scsihw</span> virtio-scsi-pci<br />
                <span className="text-slate-100">qm set</span> &lt;OMV_VMID&gt; <span className="text-emerald-400">-scsi0</span> /dev/disk/by-id/&lt;DISK_BY_ID&gt;,iothread=1<br />
                <br />
                <span className="text-blue-400/70"># Verify fstab eviction (removed from host)</span><br />
                <span className="text-slate-100">cat</span> /etc/fstab | <span className="text-slate-100">grep</span> sdc
              </Terminal>
            </div>
          </div>
        </Card>

        {/* GitOps Lifecycle & Reconciliation Card */}
        <Card title="🔄 GitOps Lifecycle & Reconciliation" className="lg:col-span-1" glowColor="rgba(45, 212, 191, 0.1)">
          <div className="flex flex-col gap-6 py-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold border-b border-white/5 pb-2">Declarative Configuration Loop</p>
            
            <div className="flex flex-col gap-8 relative">
              {/* Vertical Connector Line (Mobile) */}
              <div className="absolute left-[20px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-azure/20 via-emerald-500/20 to-purple-500/20 md:hidden" />
              
              <PipelineStep 
                icon="📁" 
                title="[SOURCE]" 
                desc="Terraform & Ansible Codebase" 
                color="text-azure" 
                dotColor="bg-azure"
              />
              <PipelineStep 
                icon="⚙️" 
                title="[LOGIC]" 
                desc="GitLab-CI Reconciler" 
                color="text-amberGold" 
                dotColor="bg-amberGold"
              />
              <PipelineStep 
                icon="🚀" 
                title="[TARGET]" 
                desc="Proxmox & K3s Fleet" 
                color="text-emerald-400" 
                dotColor="bg-emerald-400"
              />
              <PipelineStep 
                icon="📊" 
                title="[AUDIT]" 
                desc="Prometheus Drift Check" 
                color="text-purple-400" 
                dotColor="bg-purple-400"
                isLast
              />
            </div>

            <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-xl text-center">
              <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-tighter">● State Reconciled (100% Synced)</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

const PipelineStep = ({ icon, title, desc, color, dotColor, isLast }) => (
  <div className="flex items-center gap-4 group relative z-10">
    <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-lg shadow-inner z-20 transition-all group-hover:scale-110 group-hover:border-white/20`}>
      {icon}
    </div>
    
    <div className="flex-1 flex flex-col">
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{title}</span>
        <div className={`w-1 h-1 rounded-full ${dotColor} animate-pulse`} />
      </div>
      <span className="text-[11px] text-slate-300 font-medium leading-tight">{desc}</span>
    </div>

    {!isLast && (
      <div className="absolute left-[19px] top-10 bottom-[-16px] w-0.5 bg-white/5 hidden md:block" />
    )}
  </div>
);

const NodeRing = ({ icon, name, tag, sub, percent, color, isExpanded, onClick, details }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 p-4 border rounded-2xl transition-all text-left w-full relative overflow-hidden group ${
      isExpanded 
        ? 'bg-white/10 border-azure shadow-lg shadow-azure/10' 
        : 'bg-black/40 border-white/5 hover:border-white/10'
    }`}
  >
    <div className="text-xl bg-white/5 w-12 h-12 flex items-center justify-center rounded-xl shadow-inner group-hover:scale-110 transition-transform">{icon}</div>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <h4 className="text-sm font-semibold text-slate-100">{name}</h4>
        <span className={`text-[9px] px-1.5 py-0.5 border rounded font-mono uppercase truncate ${isExpanded ? 'border-azure text-azure-light' : 'border-white/20 text-slate-400'}`}>
          {tag}
        </span>
      </div>
      <div className="text-[10px] text-slate-500 mb-2 font-medium">{sub}</div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full rounded-full shadow-[0_0_8px_currentColor] ${color}`} style={{ width: `${percent}%` }}></div>
        </div>
        {details.guideUrl && (
          <a 
            href={details.guideUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-1 text-slate-600 hover:text-emerald-400 transition-colors"
            onClick={(e) => e.stopPropagation()}
            title="View Guide"
          >
            <BookOpen size={10} />
          </a>
        )}
      </div>
    </div>
    <div className="text-slate-600 transition-all flex items-center justify-center w-6" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', opacity: isExpanded ? 1 : 0.4 }}>
      ▼
    </div>
  </button>
);

const NodeDetailPanel = ({ node }) => (
  <div className="bg-slate-950/40 rounded-2xl p-6 border border-white/5 backdrop-blur-md">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-azure-light">Technical Vitals</h5>
        <ul className="space-y-2">
          <li className="flex justify-between text-[11px] border-b border-white/5 pb-2">
            <span className="text-slate-500 font-medium uppercase">Operating System</span>
            <span className="text-white font-mono">{node.details.os}</span>
          </li>
          <li className="flex justify-between text-[11px] border-b border-white/5 pb-2">
            <span className="text-slate-500 font-medium uppercase">CPU / Architecture</span>
            <span className="text-white font-mono">{node.details.cpu}</span>
          </li>
          <li className="flex justify-between text-[11px] border-b border-white/5 pb-2">
            <span className="text-slate-500 font-medium uppercase">RAM Allocation</span>
            <span className="text-white font-mono">{node.details.ram}</span>
          </li>
          {node.details.disk && (
            <li className="flex justify-between text-[11px] border-b border-white/5 pb-2">
              <span className="text-slate-500 font-medium uppercase">Block Storage</span>
              <span className="text-white font-mono">{node.details.disk}</span>
            </li>
          )}
          <li className="flex justify-between text-[11px] pt-1">
            <span className="text-slate-500 font-medium uppercase">Network State</span>
            <span className="text-emerald-400 font-mono tracking-tighter">{node.details.net}</span>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Critical Services Registry</h5>
        <div className="flex flex-wrap gap-2">
          {node.details.services.map((service, i) => (
            <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-300 font-mono font-medium shadow-sm hover:border-emerald-500/50 transition-colors">
              {service}
            </span>
          ))}
        </div>
        <div className="mt-4 p-3 bg-azure/5 border border-azure/20 rounded-xl flex items-start gap-2">
          <span className="text-azure-light mt-0.5 leading-none">ℹ</span>
          <p className="text-[10px] text-azure-light leading-relaxed italic">
            Monitoring active. Prometheus healthy. Logs aggregated via Dozzle (Systemd).
          </p>
        </div>
      </div>
    </div>
  </div>
);

const Terminal = ({ header, children, className = "" }) => (
  <div className={`bg-slate-950 border border-white/10 rounded-xl overflow-hidden font-mono text-[11px] shadow-2xl ${className}`}>
    <div className="bg-slate-900 px-4 py-2 flex items-center gap-2 border-b border-white/5">
      <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
      <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
      <span className="ml-2 text-slate-500 font-bold uppercase tracking-widest text-[9px]">{header}</span>
    </div>
    <div className="p-6 text-slate-300 leading-relaxed overflow-x-auto">
      {children}
    </div>
  </div>
);

export default LogicalLayer;
