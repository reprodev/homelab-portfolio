import React from 'react';
import Card from './Card';
import { Terminal, HardDrive, ExternalLink, Cpu, Globe, Code, Zap, Archive, Github } from 'lucide-react';

const TutorialCard = ({ title, desc, icon: Icon, link, tags, time, type = "Guide" }) => (
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
        <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400/50">{type === "Project" ? "View Project" : "Read Guide"}</span>
        <span className="text-[10px] font-mono text-slate-600">{time}</span>
      </div>
    </div>
  </a>
);

const KnowledgeLayer = () => {
  const guides = [
    {
      title: "Docker Masterclass: Implementation Series",
      desc: "Complete lifecycle management covering Portainer, Nginx Proxy Manager, Pi-Hole, and Automated Watchtower updates.",
      icon: Terminal,
      link: "https://reprodev.com/tag/docker/",
      tags: ["Docker", "Linux", "Self-hosting"],
      time: "Tag Archive"
    },
    {
      title: "The Install Guides Archive",
      desc: "A centralized repository of detailed installation and configuration walk-throughs for homelab services.",
      icon: Archive,
      link: "https://reprodev.com/tag/install-guides/",
      tags: ["Guides", "Software", "Config"],
      time: "Tag Archive"
    },
    {
      title: "Proxmox vs ESXi Foundation",
      desc: "Architectural comparison and transition guide from legacy hypervisors to modern Proxmox Virtual Environment.",
      icon: HardDrive,
      link: "https://reprodev.com/the-proxmox-vs-esxi-debate/",
      tags: ["Virtualization", "Proxmox", "PVE"],
      time: "15 min read"
    },
    {
      title: "Raspberry Pi 4 Model B Baseline Setup",
      desc: "Physical hardening and OS provisioning for the primary ARM control head (pibuster4) in the physical cluster.",
      icon: Cpu,
      link: "https://reprodev.com/set-up-raspberry-pi/",
      tags: ["Hardware", "ARM", "Provisioning"],
      time: "20 min read"
    }
  ];

  const projects = [
    {
      title: "LGTV Firmware Downgrade",
      desc: "A massive community-driven utility for webOS firmware management. High-impact tool with over 1,040 forks.",
      icon: Zap,
      link: "https://github.com/reprodev/LGTV-Firmware-Downgrade",
      tags: ["webOS", "Utility", "1k+ Forks"],
      time: "139 Stars",
      type: "Project"
    },
    {
      title: "PowerCSR: OpenSSL GUI Tool",
      desc: "A custom PowerShell-based GUI to simplify and automate Certificate Signing Requests and Private Key generation.",
      icon: Terminal,
      link: "https://dev.to/reprodev/simplify-your-openssl-csr-requests-with-powercsr-gui-tool-148h",
      tags: ["PowerShell", "Security"],
      time: "dev.to / Starred",
      type: "Project"
    },
    {
      title: "Exchange-Toolbox (V1 & V2)",
      desc: "Robust menu-based PowerShell GUIs for enterprise-level administrative Exchange tasks and automation.",
      icon: Archive,
      link: "https://github.com/reprodev/Exchange-Toolbox",
      tags: ["PowerShell", "Enterprise"],
      time: "GitHub Repo",
      type: "Project"
    },
    {
      title: "Public GitHub Hub: reprodev",
      desc: "Explore 40+ repositories covering PowerShell automation, infrastructure-as-code, and custom developer tools.",
      icon: Github,
      link: "https://github.com/reprodev",
      tags: ["Open Source", "Portfolio"],
      time: "40+ Repos",
      type: "Project"
    }
  ];

  return (
    <section id="knowledge-base" className="mb-24 scroll-mt-24">
      {/* Guides Row */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4 border-b border-white/5 pb-6">
        <div className="flex flex-col">
          <h3 className="text-3xl font-extralight tracking-tight text-white m-0 italic">Layer 5: Knowledge Base & Library</h3>
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-emerald-400 mt-2">Implementation Guides from reprodev.com</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/20 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none text-nowrap">Technical Guides</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        {guides.map((guide, idx) => (
          <TutorialCard key={idx} {...guide} />
        ))}
      </div>

      {/* Projects Row */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4 border-b border-white/5 pb-6">
        <div className="flex flex-col">
          <h3 className="text-3xl font-extralight tracking-tight text-white m-0 italic">Developer Portfolio & Tools</h3>
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-azure mt-2">Custom Development & PowerShell Automation</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-azure/5 border border-azure/20 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-azure animate-pulse" />
          <span className="text-[10px] font-black text-azure uppercase tracking-widest leading-none text-nowrap">4 Developed Projects</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project, idx) => (
          <TutorialCard key={idx} {...project} />
        ))}
      </div>

      <div className="mt-16 flex items-center justify-center">
        <a 
          href="https://reprodev.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-10 py-4 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-500 text-sm font-bold text-slate-300 hover:text-emerald-400 flex items-center gap-4 group shadow-2xl"
        >
          Explore All Knowledge Bases at reprodev.com
          <ExternalLink size={18} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </a>
      </div>
    </section>
  );
};

export default KnowledgeLayer;
