import React from 'react';
import Card from './Card';
import Badge from './Badge';
import { BookOpen, Terminal, HardDrive, Shield, ExternalLink, Cpu, Globe } from 'lucide-react';

const TutorialCard = ({ title, desc, icon: Icon, link, tags, time }) => (
  <a 
    href={link} 
    target="_blank" 
    rel="noopener noreferrer"
    className="group block"
  >
    <div className="h-full p-6 bg-black/40 border border-white/5 rounded-[2.5rem] hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
        <ExternalLink size={16} className="text-emerald-400" />
      </div>
      
      <div className="mb-6">
        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-400 border border-white/5 shadow-inner group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all duration-500">
          <Icon size={28} strokeWidth={1.5} />
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded-md text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-400/70 group-hover:border-emerald-500/20 transition-colors">
              {tag}
            </span>
          ))}
        </div>
        
        <h4 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-emerald-400 transition-colors leading-tight">{title}</h4>
        <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">{desc}</p>
      </div>

      <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400/50">Read Guide</span>
        <span className="text-[10px] font-mono text-slate-600">{time} Reading</span>
      </div>
    </div>
  </a>
);

const KnowledgeLayer = () => {
  const tutorials = [
    {
      title: "Docker Series: Parts 1-6 Masterclass",
      desc: "Complete implementation guide covering Portainer, Nginx Proxy Manager, Pi-Hole, and Watchtower lifecycle.",
      icon: Terminal,
      link: "https://reprodev.com/tag/install-guides/",
      tags: ["Docker", "Linux", "DevOps"],
      time: "45 min"
    },
    {
      title: "Secure Remote Access via Tailscale",
      desc: "Zero-trust network configuration for seamless, air-gapped access to your homelab fleet without port-forwarding.",
      icon: Globe,
      link: "https://reprodev.com/remotely-and-securely-access-your-homelab/",
      tags: ["Security", "VPN", "Network"],
      time: "12 min"
    },
    {
      title: "The Proxmox vs ESXi Foundation Debate",
      desc: "Architectural comparison and transition guide from legacy hypervisors to modern Proxmox Virtual Environment.",
      icon: HardDrive,
      link: "https://reprodev.com/the-proxmox-vs-esxi-debate/",
      tags: ["Virtualization", "Proxmox", "PVE"],
      time: "15 min"
    },
    {
      title: "Raspberry Pi 4 Model B Baseline Setup",
      desc: "Physical hardening and OS provisioning for the primary ARM control node (PiBuster4) in the physical cluster.",
      icon: Cpu,
      link: "https://reprodev.com/setting-up-a-raspberry-pi-4-model-b/",
      tags: ["Hardware", "ARM", "Provisioning"],
      time: "20 min"
    }
  ];

  return (
    <section id="knowledge-base" className="mb-24 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4 border-b border-white/5 pb-6">
        <div className="flex flex-col">
          <h3 className="text-3xl font-extralight tracking-tight text-white m-0 italic">Layer 5: Knowledge Base & Library</h3>
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-emerald-400 mt-2">Implementation Guides from reprodev.com</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/20 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">4 Active Guides</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tutorials.map((tutorial, idx) => (
          <TutorialCard key={idx} {...tutorial} />
        ))}
      </div>

      <div className="mt-12 flex items-center justify-center">
        <a 
          href="https://reprodev.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-500 text-sm font-medium text-slate-300 hover:text-emerald-400 flex items-center gap-3 group"
        >
          View Full Library at ReproDev
          <ExternalLink size={16} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </a>
      </div>
    </section>
  );
};

export default KnowledgeLayer;
