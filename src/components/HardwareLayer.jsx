import React from 'react';
import Card from './Card';
import Badge from './Badge';
import { BookOpen } from 'lucide-react';

const HardwareLayer = () => {
  return (
    <section className="mb-24">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-2 border-b border-white/5 pb-4">
        <h3 className="text-3xl font-extralight tracking-tight text-white m-0">Layer 2: Physical Hardware & Compute Root</h3>
        <span className="text-sm font-mono text-slate-400">
          Core Skills: <strong className="text-emerald-400 font-normal">Bare-metal Provisioning, Proxmox VE, Direct Disk Passthrough, LVM Storage</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proxmox Hypervisor Box */}
        <Card 
          title={
            <div className="flex items-center gap-3">
              <span>Proxmox Virtual Environment (Bare-metal)</span>
              <a 
                href="https://reprodev.com/the-proxmox-vs-esxi-debate/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400 hover:bg-purple-500/20 transition-all group/doc"
                title="View Proxmox Guide"
              >
                <BookOpen size={14} className="group-hover/doc:scale-110 transition-transform" />
              </a>
            </div>
          }
          className="lg:col-span-2" 
          glowColor="rgba(168, 85, 247, 0.15)"
        >
          <div className="flex flex-col md:flex-row gap-8">
            {/* Specs */}
            <div className="flex-1">
              <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Host Hardware Limits</h4>
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-sm text-slate-300 font-medium">Logical CPU Threads</span>
                  <Badge color="muted">6 Threads</Badge>
                </li>
                <li className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-sm text-slate-300 font-medium">Memory Limit (RAM)</span>
                  <Badge color="muted">64 GB</Badge>
                </li>
                <li className="flex justify-between items-center pt-2">
                  <span className="text-sm text-slate-300 font-medium">Network Interface</span>
                  <Badge color="azure">Internal vBridge</Badge>
                </li>
              </ul>
            </div>
            
            {/* Hosted VMs */}
            <div className="flex-[2]">
              <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Hosted Virtual Machines</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: "ZuluServer", sub: "180GB Disk • Ubuntu" },
                  { name: "OMV NAS", sub: "80GB Disk + Passthrough" },
                  { name: "ha01 (CF)", sub: "8GB Disk • DietPi" },
                  { name: "ha02 (Vault)", sub: "8GB Disk • DietPi" },
                  { name: "ha03 (Guac)", sub: "8GB Disk • DietPi" },
                  { name: "Templates", sub: "Cloud-Init Testing" }
                ].map((vm) => (
                  <div key={vm.name} className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                    <h5 className="text-sm font-semibold text-slate-100 mb-1">{vm.name}</h5>
                    <p className="text-[10px] text-slate-500">{vm.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Proxmox Storage */}
        <Card title="PVE Storage Allocations" glowColor="rgba(59, 130, 246, 0.1)">
          <ul className="space-y-4">
            <li className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-sm text-slate-300">nvme0n1 (LVM)</span>
              <Badge color="azure">~1 TB</Badge>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-sm text-slate-300">sda & sdc (Dirs)</span>
              <Badge color="success">2x 1 TB</Badge>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-sm text-slate-300">sdb (OMV Passthrough)</span>
              <Badge color="amber">6 TB</Badge>
            </li>
            <li className="flex justify-between items-center pt-2">
              <span className="text-sm text-slate-300">nvme1n1 (Optane)</span>
              <Badge color="muted">14 GB</Badge>
            </li>
          </ul>
        </Card>

        {/* Bare-Metal Control Node (Pi 4) */}
        <Card 
          title={
            <div className="flex items-center gap-3">
              <span>pibuster4 (Bare-metal)</span>
              <a 
                href="https://reprodev.com/setting-up-a-raspberry-pi-4-model-b/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 hover:bg-amber-500/20 transition-all group/doc"
                title="View Pi Setup Guide"
              >
                <BookOpen size={14} className="group-hover/doc:scale-110 transition-transform" />
              </a>
            </div>
          }
          className="lg:col-span-2" 
          glowColor="rgba(251, 191, 36, 0.15)"
        >
           <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Hardware Limits</h4>
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-sm text-slate-300 font-medium">Logic Board</span>
                  <Badge color="muted">Pi 4B (4-Core)</Badge>
                </li>
                <li className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-sm text-slate-300 font-medium">Memory Limit</span>
                  <Badge color="muted">4 GB LPDDR4</Badge>
                </li>
                <li className="flex justify-between items-center pt-2">
                  <span className="text-sm text-slate-300 font-medium">Network Interface</span>
                  <Badge color="amber">Eth0 (Gigabit)</Badge>
                </li>
              </ul>
            </div>
            
            <div className="flex-[2]">
              <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Supervised Services</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: "Raspberry Pi OS", sub: "Debian Bare-Metal" },
                  { name: "Cloudflared HA", sub: "Zero Trust Tunnel" },
                  { name: "Ansible Config", sub: "GitOps Controller" }
                ].map((s) => (
                  <div key={s.name} className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                    <h5 className="text-sm font-semibold text-slate-100 mb-1">{s.name}</h5>
                    <p className="text-[10px] text-slate-500">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Pi Storage */}
        <Card title="Pi 4 Storage" glowColor="rgba(96, 165, 250, 0.1)">
           <ul className="space-y-4">
            <li className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-sm text-slate-300">sda (USB 3.0 SSD)</span>
              <Badge color="azure">489 GB</Badge>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-sm text-slate-300">sda1 (/boot)</span>
              <Badge color="success">512 MB</Badge>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-sm text-slate-300">sda2 (Root /)</span>
              <Badge color="amber">488.5 GB</Badge>
            </li>
            <li className="flex justify-between items-center pt-2">
              <span className="text-sm text-slate-300">zram0 (SWAP)</span>
              <Badge color="muted">2 GB</Badge>
            </li>
          </ul>
        </Card>

        {/* Bare-Metal Backup Node (Knightbox) */}
        <Card title="Knightbox (Bare-metal)" className="lg:col-span-2" glowColor="rgba(16, 185, 129, 0.15)">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Hardware Limits</h4>
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-sm text-slate-300 font-medium">Logic Board</span>
                  <Badge color="muted">i7-12700K (12C/20T)</Badge>
                </li>
                <li className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-sm text-slate-300 font-medium">Memory Limit</span>
                  <Badge color="muted">64 GB</Badge>
                </li>
                <li className="flex justify-between items-center pt-2">
                  <span className="text-sm text-slate-300 font-medium">Network Interface</span>
                  <Badge color="success">2.5G Network Port</Badge>
                </li>
              </ul>
            </div>
            
            <div className="flex-[2]">
              <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Supervised Services</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: "Windows Host", sub: "Bare-Metal Architecture" },
                  { name: "Veeam Repository", sub: "Offsite Archival Syncing" },
                  { name: "Plex Identity Data", sub: "LZ4 Compressed Volumes" }
                ].map((s) => (
                  <div key={s.name} className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                    <h5 className="text-sm font-semibold text-slate-100 mb-1">{s.name}</h5>
                    <p className="text-[10px] text-slate-500">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Knightbox Volumes */}
        <Card title="Knightbox Volumes" glowColor="rgba(168, 85, 247, 0.1)">
           <ul className="space-y-4">
            <li className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-sm text-slate-300">C: (Windows OS)</span>
              <Badge color="azure">930 GB NVMe</Badge>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-sm text-slate-300">D: (DATA)</span>
              <Badge color="success">2.8 TB HDD</Badge>
            </li>
            <li className="flex justify-between items-center pt-2">
              <span className="text-sm text-slate-300 font-medium">Total Pool</span>
              <Badge color="muted">~3.7 TB</Badge>
            </li>
          </ul>
        </Card>

        {/* OMV NAS (Logical/Storage Node) */}
        <Card title="OpenMediaVault NAS VM (Network Storage)" className="lg:col-span-2" glowColor="rgba(16, 185, 129, 0.15)">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Virtual Hardware Limits</h4>
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-sm text-slate-300 font-medium">Instance Type</span>
                  <Badge color="muted">Proxmox VM</Badge>
                </li>
                <li className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-sm text-slate-300 font-medium">OS / Base</span>
                  <Badge color="muted">OMV (Debian)</Badge>
                </li>
                <li className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-sm text-slate-300 font-medium">OS Disk</span>
                  <Badge color="muted">80 GB (LVM)</Badge>
                </li>
                <li className="flex justify-between items-center pt-2">
                  <span className="text-sm text-slate-300 font-medium">Network Status</span>
                  <Badge color="azure">Active / Reconciled</Badge>
                </li>
              </ul>
            </div>
            
            <div className="flex-[2]">
              <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Storage Persistence Architecture</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: "Samba / SMB", sub: "CIFS Network Shares" },
                  { name: "NFS Exports", sub: "Linux Client Support" },
                  { name: "Physical Passthrough", sub: "IOThread=1 Verified" },
                  { name: "LVM Storage", sub: "Logical OS Managed" }
                ].map((s) => (
                  <div key={s.name} className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-white/10 transition-colors group">
                    <h5 className="text-sm font-semibold text-slate-100 mb-1 group-hover:text-emerald-400 transition-colors">{s.name}</h5>
                    <p className="text-[10px] text-slate-500">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* OMV Volumes */}
        <Card title="NAS Storage Volumes" glowColor="rgba(251, 191, 36, 0.1)">
           <ul className="space-y-4">
            <li className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-sm text-slate-300">sdb (Physical Pass)</span>
              <Badge color="amber">6 TB HDD</Badge>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-sm text-slate-300">File System</span>
              <Badge color="success">native:ext4</Badge>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-sm text-slate-300">Disk Quotas</span>
              <Badge color="muted">Not Enforced</Badge>
            </li>
            <li className="flex justify-between items-center pt-2">
              <span className="text-sm text-slate-300 font-medium">Mount State</span>
              <Badge color="azure">Active / RW</Badge>
            </li>
          </ul>
        </Card>
      </div>
    </section>
  );
};

export default HardwareLayer;
