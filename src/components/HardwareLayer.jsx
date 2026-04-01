import React from 'react';
import Card from './Card';
import Badge from './Badge';
import ComputeCard from './ComputeCard';
import RationaleSection from './RationaleSection';
import { BookOpen, HardDrive } from 'lucide-react';
import { ProxmoxLogo, UbuntuLogo, DietPiLogo, OMVLogo } from './BrandLogos';

const HardwareLayer = () => {
  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  <span className="text-sm text-slate-300 font-medium tracking-tight italic">Logical CPU Threads</span>
                  <Badge color="muted">6 Threads</Badge>
                </li>
                <li className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-sm text-slate-300 font-medium tracking-tight italic">Memory Pool (RAM)</span>
                  <Badge color="muted">64 GB DDR4</Badge>
                </li>
                <li className="flex justify-between items-center pt-2">
                  <span className="text-sm text-slate-300 font-medium tracking-tight italic">Storage Controller</span>
                  <Badge color="azure">VirtIO SCSI</Badge>
                </li>
              </ul>
            </div>
            
            <div className="flex-[2]">
              <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2 italic">Active Virtual Nodes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: "ZuluServer", sub: "Plex Media (Host) • Ubuntu", managed: "Terraform", color: "emerald", icon: <UbuntuLogo className="w-4 h-4 text-orange-400" /> },
                  { name: "OMV NAS", sub: "80GB Disk + Passthrough", managed: "Ansible", color: "azure", icon: <OMVLogo className="w-4 h-4 text-[#4D80B3]" /> },
                  { name: "ha01 (CF)", sub: "8GB Disk • DietPi", color: "emerald", icon: <DietPiLogo className="w-4 h-4 text-[#91C300]" /> },
                  { name: "ha02 (Vault)", sub: "8GB Disk • DietPi", color: "emerald", icon: <DietPiLogo className="w-4 h-4 text-[#91C300]" /> },
                  { name: "ha03 (Guac)", sub: "8GB Disk • DietPi", color: "emerald", icon: <DietPiLogo className="w-4 h-4 text-[#91C300]" /> },
                  { name: "Templates", sub: "Cloud-Init Testing", color: "amber" }
                ].map((vm) => (
                  <ComputeCard 
                    key={vm.name} 
                    name={vm.name} 
                    sub={vm.sub} 
                    managedBy={vm.managed} 
                    glowColor={vm.color}
                    icon={vm.icon}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Proxmox Storage */}
        <Card title="Storage Array Logic" glowColor="rgba(59, 130, 246, 0.1)">
          <ul className="space-y-4">
            <li className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-sm text-slate-300 italic tracking-tight">nvme0n1 (LVM Cache)</span>
              <Badge color="azure">1 TB NVMe</Badge>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-sm text-slate-300 italic tracking-tight">sda & sdc (High Cap)</span>
              <Badge color="success">2 TB SATA</Badge>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-sm text-slate-300 italic tracking-tight">sdb (Physical Pass)</span>
              <Badge color="amber">6 TB WD Red</Badge>
            </li>
            <li className="flex justify-between items-center pt-2">
              <span className="text-sm text-slate-500 italic tracking-tight opacity-50">Spare Channel (Optane)</span>
              <Badge color="muted">14 GB</Badge>
            </li>
          </ul>
        </Card>
      </div>

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
                <span><strong>Provisioning:</strong> Bare-metal nodes are flashed via CI/CD pipelines (Terraform/Ansible).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold">◃</span>
                <span><strong>Storage Logic:</strong> LVM-based virtual disks provide high-IOPS performance for heavy database workloads.</span>
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
