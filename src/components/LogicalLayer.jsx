import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import Badge from './Badge';
import RationaleSection from './RationaleSection';
import { BookOpen, Cpu, ChevronDown, Activity, Terminal as TerminalIcon, Shield, Server } from 'lucide-react';
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

const playSynthesizedSound = (type = 'click') => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'click') {
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.012, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'ping') {
      osc.frequency.setValueAtTime(1600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.008, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.25); // C6
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (e) {}
};

const LogicalLayer = () => {
  const [expandedNode, setExpandedNode] = useState(null);

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
                  onClick={() => {
                    setExpandedNode(expandedNode === node.id ? null : node.id);
                    playSynthesizedSound('click');
                  }}
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

const NodeRing = ({ icon, name, tag, sub, percent, color, isExpanded, onClick }) => {
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

const NodeDetailPanel = ({ node }) => {
  const [logs, setLogs] = useState([]);
  const [activeCommand, setActiveCommand] = useState(null); // null, 'ansible', 'gitops'
  const [activeTab, setActiveTab] = useState('terminal'); // 'terminal', 'gitops'
  const [gitopsStage, setGitopsStage] = useState(0); // 0: idle, 1: webhook, 2: parsing, 3: sync, 4: reconciled
  const terminalEndRef = useRef(null);

  // Default logs generator based on the node id
  const getDefaultLogs = (nodeId) => {
    switch (nodeId) {
      case 'pi4':
        return [
          "[SYSTEM] Initializing pibuster4 Bare-metal ARM Host...",
          "[SYSTEM] CPU: 4-Core ARM Cortex-A72 @ 1.5GHz... OK",
          "[SYSTEM] Addressable RAM: 4GB LPDDR4... OK",
          "[NET] Checking Cloudflared high-availability tunnels...",
          "[NET] Connection: active [pibuster4 -> lhr-edge-01, RTT=45ms]",
          "[GITOPS] Git repository pull verification... up-to-date",
          "[ANSIBLE] Host inventory sync completed successfully.",
          "pibuster4:~# _"
        ];
      case 'zulu':
        return [
          "[SYSTEM] Initializing ZuluServer Proxmox VM v2.4...",
          "[SYSTEM] Virtual Disk: mounting /dev/sda1 (local-lvm)... OK",
          "[SYSTEM] CPU: 2-vCPU hardware thread mapping... OK",
          "[DRIVERS] Intel QuickSync GPU passthrough... ACTIVE",
          "[SERVICES] Verifying Plex Media Server host binary:",
          "   ▸ plexmediaserver.service - running [ OK ]",
          "   ▸ HW transcode acceleration - enabled [ OK ]",
          "[MONITOR] Node stats pushed to Prometheus/Grafana daemon.",
          "zuluserver:~# _"
        ];
      case 'ha':
        return [
          "[SYSTEM] Initializing DietPi MicroVM Fleet Cluster...",
          "[NET] WireGuard virtual overlay network link... OK",
          "[HA] Distributing high-availability edge traffic:",
          "   ▸ Node ha01 (CF Ingress Tunnel Failover)... [ ACTIVE ]",
          "   ▸ Node ha02 (Vaultwarden DB Core).......... [ REPLICATED ]",
          "   ▸ Node ha03 (Pi-hole / Apache Guacamole)... [ ONLINE ]",
          "[HA] Fleet consensus cluster status: HEALTH_OK",
          "dietpi-cluster:~# _"
        ];
      case 'nas':
        return [
          "[SYSTEM] Initializing OpenMediaVault Storage Node...",
          "[STORAGE] Passthrough Disk check: 6TB WD Red (sdb)... ONLINE",
          "[STORAGE] Mount local storage pools: LVM RAID-5... OK",
          "[SERVICES] Samba/NFS daemon permissions verified... OK",
          "[MONITOR] smartctl diagnostic test running... HEALTH_OK",
          "[NET] Direct storage VLAN link speed: 10Gbps full-duplex",
          "omv-nas:~# _"
        ];
      default:
        return ["Connecting to remote shell...", "Connection established.", "_"];
    }
  };

  // Stream logs line-by-line when node is opened
  useEffect(() => {
    setLogs([]);
    setActiveCommand(null);
    setGitopsStage(0);
    setActiveTab('terminal');
    const initialLogs = getDefaultLogs(node.id);
    let index = 0;
    
    // Add lines progressively
    const interval = setInterval(() => {
      if (index < initialLogs.length - 1) {
        setLogs(prev => [...prev, initialLogs[index]]);
        index++;
      } else {
        setLogs(prev => [...prev, initialLogs[initialLogs.length - 1]]); // Append prompt line
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [node.id]);

  // Scroll to bottom of terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeTab]);

  const triggerAnsible = () => {
    if (activeCommand) return;
    setActiveCommand('ansible');
    setActiveTab('terminal');
    const promptName = node.id === 'pi4' ? 'pibuster4' : node.id === 'zulu' ? 'zuluserver' : node.id === 'ha' ? 'dietpi-cluster' : 'omv-nas';
    
    setLogs(prev => prev.slice(0, -1).concat([
      `$ ansible-playbook playbooks/harden.yml --limit ${node.name}`,
      " ",
      "PLAY [Reconcile desired state VM security profiles] ************************",
      " ",
      "TASK [Gathering Facts] ******************************************************",
      `ok: [${node.name}]`
    ]));

    let step = 0;
    const steps = [
      " ",
      "TASK [Security : Verify secure SSH key-only access] *************************",
      `ok: [${node.name}]`,
      " ",
      "TASK [Services : Validate container state and telemetry binds] **************",
      `changed: [${node.name}]`,
      " ",
      "PLAY RECAP ******************************************************************",
      `${node.name.padEnd(22)} : ok=18   changed=1    unreachable=0    failed=0`,
      " ",
      `${promptName}:~# _`
    ];

    const timer = setInterval(() => {
      if (step < steps.length) {
        setLogs(prev => [...prev, steps[step]]);
        step++;
      } else {
        setActiveCommand(null);
        clearInterval(timer);
      }
    }, 300);
  };

  const triggerGitOps = () => {
    if (activeCommand) return;
    setActiveCommand('gitops');
    setActiveTab('gitops');
    setGitopsStage(1);
    const promptName = node.id === 'pi4' ? 'pibuster4' : node.id === 'zulu' ? 'zuluserver' : node.id === 'ha' ? 'dietpi-cluster' : 'omv-nas';

    setLogs(prev => prev.slice(0, -1).concat([
      `$ git pull origin main`,
      "From github.com:reprodev/homelab-infra",
      " * branch            main       -> FETCH_HEAD",
      "Already up to date.",
      " ",
      `[GITOPS] Initializing configuration state audit...`
    ]));

    // Step-by-step visual sync stage propagation with mechanical audio triggers
    setTimeout(() => {
      setGitopsStage(2);
      playSynthesizedSound('ping');
    }, 1200);
    
    setTimeout(() => {
      setGitopsStage(3);
      playSynthesizedSound('ping');
    }, 2400);
    
    setTimeout(() => {
      setGitopsStage(4);
      playSynthesizedSound('success');
      setActiveCommand(null);
    }, 3800);

    let step = 0;
    const steps = [
      "[GITOPS] Checking local checksum parameters against main repo...",
      node.id === 'zulu'
        ? "proxmox_vm_qemu.zuluserver: Refreshing state... [id=102]\nNo infrastructure drifts detected. System remains at desired configuration."
        : "State verified. Active system matches Git configuration 100%.",
      "[GITOPS] Auto-reconciliation complete. Deployment is locked & secure.",
      " ",
      `${promptName}:~# _`
    ];

    const timer = setInterval(() => {
      if (step < steps.length) {
        setLogs(prev => [...prev, steps[step]]);
        step++;
      } else {
        clearInterval(timer);
      }
    }, 600);
  };

  const clearConsole = () => {
    if (activeCommand) return;
    const promptName = node.id === 'pi4' ? 'pibuster4' : node.id === 'zulu' ? 'zuluserver' : node.id === 'ha' ? 'dietpi-cluster' : 'omv-nas';
    setLogs([`${promptName}:~# _`]);
    setGitopsStage(0);
  };

  return (
    <div className="bg-slate-950/20 rounded-2xl p-6 border border-white/5 backdrop-blur-md relative overflow-hidden">
      {/* Visual background watermark */}
      <div className="absolute right-0 top-0 p-8 opacity-5">
        <Activity size={120} strokeWidth={0.5} className="text-white" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Specs and Services Panel - 5 Columns */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
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
              {node.details.disk && (
                <li className="flex justify-between text-[11px] border-b border-white/5 pb-2">
                  <span className="text-slate-500 font-medium italic tracking-tight">Storage Disk</span>
                  <span className="text-white font-mono">{node.details.disk}</span>
                </li>
              )}
              <li className="flex justify-between text-[11px]">
                <span className="text-white/40 font-black uppercase tracking-widest text-[9px]">Status</span>
                <span className={`${gitopsStage === 4 ? 'text-emerald-400' : gitopsStage > 0 ? 'text-amber-400 animate-pulse' : 'text-emerald-400/80'} font-mono flex items-center gap-2 transition-colors`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${gitopsStage === 4 ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : gitopsStage > 0 ? 'bg-amber-500 animate-ping' : 'bg-emerald-500/80'}`} />
                  {gitopsStage === 4 ? 'RECONCILED' : gitopsStage > 0 ? 'SYNCING...' : 'RECONCILED'}
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Critical Services</h5>
            <div className="flex flex-wrap gap-2">
              {node.details.services.map((service, i) => (
                <span key={i} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] text-slate-300 font-mono font-medium shadow-sm hover:border-emerald-500/50 transition-colors">
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Cyberpunk Interactive Terminal / Pipeline Cockpit - 7 Columns */}
        <div className="lg:col-span-7 flex flex-col h-[280px] bg-[#020202] border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl group/term focus-within:border-emerald-500/30 transition-all duration-300 crt-screen">
          
          {/* Title Bar with Tabs */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02] relative z-20">
            <div className="flex gap-2 font-mono text-[9px] uppercase tracking-wider">
              <button 
                onClick={() => {
                  setActiveTab('terminal');
                  playSynthesizedSound('click');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${activeTab === 'terminal' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black' : 'text-slate-400 hover:text-white'}`}
              >
                <TerminalIcon size={11} />
                <span>CLI Terminal</span>
              </button>
              <button 
                onClick={() => {
                  setActiveTab('gitops');
                  playSynthesizedSound('click');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${activeTab === 'gitops' ? 'bg-azure/10 border border-azure/30 text-azure font-black' : 'text-slate-400 hover:text-white'}`}
              >
                <Activity size={11} />
                <span>GitOps Pipeline</span>
              </button>
            </div>
            <div className="flex gap-1.5 items-center">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-tighter hidden sm:inline">
                {node.name}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
            </div>
          </div>

          {/* Tab Contents: GitOps Visual Pipeline */}
          {activeTab === 'gitops' ? (
            <div className="flex-1 p-4 flex flex-col justify-between font-mono text-[10px] text-slate-300 relative z-20 overflow-hidden select-none">
              
              {/* SVG Topology Container */}
              <div className="relative w-full h-[140px] border border-white/5 bg-slate-950/40 rounded-2xl overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] flex items-center justify-center">
                
                {/* Tech Cyber Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />
                
                {/* SVG Topology Canvas */}
                <svg className="absolute inset-0 w-full h-full p-4 overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none" fill="none">
                  {/* Passthrough Circuit Dashed Path */}
                  <path d="M 35,50 L 135,50 L 235,50 L 345,50" stroke="rgba(255, 255, 255, 0.05)" strokeWidth={1.5} strokeDasharray="3 3" />
                  
                  {/* Glowing Active Path Tracks */}
                  {gitopsStage >= 1 && (
                    <motion.path 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      d="M 35,50 L 135,50" 
                      stroke="url(#gradient-github-gitlab)" 
                      strokeWidth={2} 
                      strokeLinecap="round"
                      className="drop-shadow-[0_0_8px_#f97316]"
                    />
                  )}
                  {gitopsStage >= 2 && (
                    <motion.path 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      d="M 135,50 L 235,50" 
                      stroke="url(#gradient-gitlab-ecr)" 
                      strokeWidth={2} 
                      strokeLinecap="round"
                      className="drop-shadow-[0_0_8px_#a855f7]"
                    />
                  )}
                  {gitopsStage >= 3 && (
                    <motion.path 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      d="M 235,50 L 345,50" 
                      stroke="url(#gradient-ecr-target)" 
                      strokeWidth={2} 
                      strokeLinecap="round"
                      className="drop-shadow-[0_0_8px_#10b981]"
                    />
                  )}

                  {/* Flowing Webhook Wave Particle */}
                  {gitopsStage === 1 && (
                    <motion.circle
                      r={3.5}
                      fill="#f97316"
                      className="drop-shadow-[0_0_6px_#f97316]"
                      animate={{ cx: [35, 135] }}
                      transition={{ duration: 1.0, ease: "linear", repeat: Infinity }}
                    />
                  )}

                  {/* Flowing Build Image Particle */}
                  {gitopsStage === 2 && (
                    <motion.circle
                      r={3.5}
                      fill="#a855f7"
                      className="drop-shadow-[0_0_6px_#a855f7]"
                      animate={{ cx: [135, 235] }}
                      transition={{ duration: 1.0, ease: "linear", repeat: Infinity }}
                    />
                  )}

                  {/* Flowing Rollout Deploy Particle */}
                  {gitopsStage === 3 && (
                    <motion.circle
                      r={3.5}
                      fill="#10b981"
                      className="drop-shadow-[0_0_6px_#10b981]"
                      animate={{ cx: [235, 345] }}
                      transition={{ duration: 1.0, ease: "linear", repeat: Infinity }}
                    />
                  )}

                  <defs>
                    <linearGradient id="gradient-github-gitlab" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                    <linearGradient id="gradient-gitlab-ecr" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <linearGradient id="gradient-ecr-target" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* HTML Nodes positioned absolutely over the canvas */}
                
                {/* GitHub VCS Source Node */}
                <div className="absolute left-[8%] -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-center">
                  <div className={`p-2 rounded-2xl border transition-all duration-500 flex items-center justify-center relative
                    ${gitopsStage >= 1 
                      ? 'bg-azure/15 border-azure text-azure shadow-[0_0_15px_rgba(0,102,204,0.3)] scale-105' 
                      : 'bg-slate-900/60 border-white/5 text-slate-500'
                    }`}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                  </div>
                  <span className="text-[6.5px] sm:text-[7px] font-black uppercase tracking-wider text-slate-500">GitHub Repo</span>
                  <span className="text-[5.5px] sm:text-[6px] text-slate-600 font-mono leading-none">Webhook</span>
                </div>

                {/* GitLab CI/CD Build Node */}
                <div className="absolute left-[34%] -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-center">
                  <div className={`p-2 rounded-2xl border transition-all duration-500 flex items-center justify-center relative
                    ${gitopsStage >= 1 
                      ? 'bg-orange-500/15 border-orange-500 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)] scale-105' 
                      : 'bg-slate-900/60 border-white/5 text-slate-500'
                    }`}
                  >
                    {/* Spin gear when building/scanning */}
                    {gitopsStage === 1 && (
                      <span className="absolute inset-0 rounded-2xl border border-orange-400/50 animate-ping opacity-75" />
                    )}
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M23.953 13.072l-1.077-3.311-.005-.015-1.921-5.91a.916.916 0 0 0-1.742-.012l-1.91 5.875H6.702l-1.91-5.875a.915.915 0 0 0-1.741.012L1.13 9.746l-.005.015-1.077 3.311a1.267 1.267 0 0 0 .461 1.417l10.957 7.962a.915.915 0 0 0 1.076 0l10.957-7.962a1.267 1.267 0 0 0 .461-1.417z"/>
                    </svg>
                  </div>
                  <span className="text-[6.5px] sm:text-[7px] font-black uppercase tracking-wider text-slate-500">GitLab CI</span>
                  <span className="text-[5.5px] sm:text-[6px] text-slate-600 font-mono leading-none">Trivy Scan</span>
                </div>

                {/* AWS ECR Repository Node */}
                <div className="absolute left-[60%] -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-center">
                  <div className={`p-2 rounded-2xl border transition-all duration-500 flex items-center justify-center relative
                    ${gitopsStage >= 2 
                      ? 'bg-purple-500/15 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] scale-105' 
                      : 'bg-slate-900/60 border-white/5 text-slate-500'
                    }`}
                  >
                    {/* Pulsating glow when pushing image */}
                    {gitopsStage === 2 && (
                      <>
                        <span className="absolute inset-0 rounded-2xl border border-purple-400/50 animate-ping opacity-75" />
                        <span className="absolute -inset-2 rounded-2xl border border-purple-400/30 animate-pulse opacity-50" />
                      </>
                    )}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <ellipse cx="12" cy="5" rx="9" ry="3"/>
                      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                      <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
                    </svg>
                  </div>
                  <span className="text-[6.5px] sm:text-[7px] font-black uppercase tracking-wider text-slate-500">AWS ECR</span>
                  <span className="text-[5.5px] sm:text-[6px] text-slate-600 font-mono leading-none">Registry</span>
                </div>

                {/* ECS Fargate / K3s Target Node */}
                <div className="absolute left-[86%] -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-center">
                  <div className={`p-2 rounded-2xl border transition-all duration-500 flex items-center justify-center relative
                    ${gitopsStage === 4 
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105' 
                      : gitopsStage >= 1 
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 animate-pulse'
                        : 'bg-slate-900/60 border-white/5 text-slate-500'
                    }`}
                  >
                    {/* Syncing heartbeat glow */}
                    {gitopsStage === 3 && (
                      <span className="absolute inset-0 rounded-2xl border border-amber-500 animate-ping opacity-60" />
                    )}
                    <div className="scale-[0.7] origin-center flex items-center justify-center">
                      {node.id === 'zulu' ? (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-400">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      ) : node.icon ? node.icon : <Server size={14} />}
                    </div>
                  </div>
                  <span className="text-[6.5px] sm:text-[7px] font-black uppercase tracking-wider text-slate-500">
                    {node.id === 'zulu' ? 'ECS Fargate' : node.name}
                  </span>
                  <span className="text-[5.5px] sm:text-[6px] text-slate-600 font-mono leading-none">
                    {node.id === 'zulu' ? 'Serverless' : node.tag}
                  </span>
                </div>

              </div>

              {/* Sub-text and Status information container */}
              <div className={`p-3 bg-black/60 border rounded-xl text-center text-[9px] font-mono leading-relaxed mt-2 transition-all duration-500
                ${gitopsStage === 4 
                  ? 'border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.1)] text-slate-300' 
                  : gitopsStage > 0 
                    ? 'border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.05)] text-slate-300' 
                    : 'border-white/5 text-slate-400'
                }`}
              >
                {gitopsStage === 0 && (
                  <span className="text-yellow-400/90 font-black animate-pulse flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
                    GITOPS HYBRID PIPELINE READY • CLICK "GITOPS sync" ACTIONS BELOW
                  </span>
                )}
                {gitopsStage === 1 && (
                  <span className="text-azure font-black animate-pulse">
                    ▸ [GITHUB] Webhook event dispatched! Triggering GitLab CI/CD build runner...
                  </span>
                )}
                {gitopsStage === 2 && (
                  <span className="text-orange-400 font-black animate-pulse">
                    ▸ [GITLAB CI] Running Trivy vulnerability scans... Building multi-stage container... Pushing to AWS ECR...
                  </span>
                )}
                {gitopsStage === 3 && (
                  <span className="text-amber-400 font-black animate-pulse">
                    ▸ [AWS ECR] Image parsed successfully! Rolling out task rollout deployment to {node.id === 'zulu' ? 'AWS ECS Fargate' : node.name}...
                  </span>
                )}
                {gitopsStage === 4 && (
                  <div className="flex flex-col gap-1 items-center">
                    <span className="text-emerald-400 font-black flex items-center gap-1.5">
                      ✔ STATE RECONCILIATION SUCCESSFUL • DEPLOYMENT HEALTHY
                    </span>
                    <span className="text-[8px] text-slate-500">
                      Target: <strong className="text-slate-300 font-mono">{node.id === 'zulu' ? 'ECS Fargate Service' : node.name}</strong> • Local Drift: <strong className="text-emerald-400 font-mono">0.00%</strong>
                    </span>
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* Terminal Logs View */
            <div className="flex-1 p-4 font-mono text-[10px] leading-relaxed overflow-y-auto no-scrollbar scroll-smooth text-emerald-400/90 space-y-1 crt-text relative z-20">
              {logs.map((log, index) => {
                const isCommand = log.startsWith('$');
                const isPrompt = log.includes(':~# _');
                const isSuccess = log.includes('[ OK ]') || log.includes('HEALTH_OK') || log.includes('success') || log.includes('desired state');
                const isChange = log.includes('changed:');
                
                let textColor = 'text-emerald-400/90';
                if (isCommand) textColor = 'text-amberGold font-black';
                else if (isPrompt) textColor = 'text-emerald-400 font-bold';
                else if (isSuccess) textColor = 'text-emerald-300 font-black';
                else if (isChange) textColor = 'text-yellow-400';
                else if (log.includes('PLAY') || log.includes('TASK')) textColor = 'text-slate-300 font-bold';

                return (
                  <div key={index} className={`${textColor} whitespace-pre-wrap`}>
                    {log}
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>
          )}

          {/* Quick-Action Controls */}
          <div className="flex items-center gap-2 p-2 border-t border-white/5 bg-white/[0.01]">
            <button
              onClick={() => {
                triggerAnsible();
                playSynthesizedSound('click');
              }}
              disabled={activeCommand !== null}
              className={`flex-1 py-1.5 rounded-lg border text-[9px] font-mono font-black uppercase tracking-wider transition-all 
                ${activeCommand === 'ansible' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : activeCommand !== null 
                    ? 'border-white/5 text-slate-600 cursor-not-allowed'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 active:scale-95'
                }`}
            >
              {activeCommand === 'ansible' ? 'Running Playbook...' : ' Ansible Play'}
            </button>
            <button
              onClick={() => {
                triggerGitOps();
                playSynthesizedSound('click');
              }}
              disabled={activeCommand !== null}
              className={`flex-1 py-1.5 rounded-lg border text-[9px] font-mono font-black uppercase tracking-wider transition-all 
                ${activeCommand === 'gitops' 
                  ? 'bg-azure/10 border-azure/30 text-azure' 
                  : activeCommand !== null 
                    ? 'border-white/5 text-slate-600 cursor-not-allowed'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 active:scale-95'
                }`}
            >
              {activeCommand === 'gitops' ? 'Syncing...' : ' GitOps Plan'}
            </button>
            <button
              onClick={() => {
                clearConsole();
                playSynthesizedSound('click');
              }}
              disabled={activeCommand !== null}
              className={`px-3 py-1.5 rounded-lg border text-[9px] font-mono font-black uppercase tracking-wider transition-all 
                ${activeCommand !== null 
                  ? 'border-white/5 text-slate-600 cursor-not-allowed'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20 active:scale-95'
                }`}
              title="Clear Terminal screen"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogicalLayer;
