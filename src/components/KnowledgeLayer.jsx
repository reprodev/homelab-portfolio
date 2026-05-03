import React, { useRef } from 'react';
import { Terminal, HardDrive, ExternalLink, Cpu, Code, Zap, Archive, Github, ChevronLeft, ChevronRight, Monitor } from 'lucide-react';
import Card from './Card';

const TutorialCard = ({ title, desc, icon: Icon, link, tags, time, type = "Guide", glowColor, image }) => (
  <div className="snap-center shrink-0 w-[85vw] md:w-auto h-full p-1">
    <Card 
      glowColor={glowColor}
      className="h-full border border-white/5"
    >
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex flex-col h-full group/link"
      >
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover/link:opacity-100 transition-opacity translate-x-2 group-hover/link:translate-x-0 z-20">
          <ExternalLink size={16} className="text-white/50" />
        </div>
        
        <div className="mb-6 relative">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white border border-white/5 shadow-inner transition-all duration-500 group-hover/link:scale-110 group-hover/link:bg-white/5 relative z-10">
            <Icon size={28} strokeWidth={1.5} />
          </div>
          {tags.includes("Featured") && (
             <div className="absolute top-0 left-0 w-20 h-20 bg-azure/10 rounded-full blur-xl -translate-x-4 -translate-y-4" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded-md text-[9px] font-black uppercase tracking-widest text-slate-400">
                {tag}
              </span>
            ))}
          </div>
          
          <h4 className="text-lg font-bold text-white mb-3 tracking-tight leading-tight">{title}</h4>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">{desc}</p>
          
          {image && (
            <div className="mt-4 rounded-xl overflow-hidden border border-white/10 group-hover/link:border-azure/30 transition-all shadow-2xl bg-black relative aspect-video flex items-center justify-center p-2">
              <img 
                src={image} 
                alt={`${title} Preview`} 
                className="w-full h-full object-contain opacity-80 group-hover/link:opacity-100 transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/5">
          <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">{type === "Project" ? "View Project" : "Read Guide"}</span>
          <span className="text-[10px] font-mono text-slate-600">{time}</span>
        </div>
      </a>
    </Card>
  </div>
);

const CarouselHeader = ({ title, subtitle, badgeText, badgeColor, onScroll, showArrows }) => (
  <div className="px-4 md:px-0 mb-8">
    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-white/5 pb-6">
      <div className="flex-1">
        <h3 className="text-3xl font-extralight tracking-tight text-white m-0 italic">{title}</h3>
        <span className={`text-[10px] uppercase font-black tracking-[0.3em] mt-2 block h-4 ${badgeColor === 'emerald' ? 'text-emerald-400' : 'text-azure'}`}>{subtitle}</span>
      </div>
      
      <div className="flex items-center gap-6 self-end md:self-auto">
        {showArrows && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onScroll('left')}
              className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all active:scale-90"
              aria-label="Scroll Left"
            >
              <ChevronLeft size={16} className="text-slate-400" />
            </button>
            <button 
              onClick={() => onScroll('right')}
              className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all active:scale-90"
              aria-label="Scroll Right"
            >
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>
        )}
        
        <div className={`flex items-center gap-2 px-3 py-1 bg-white/5 border rounded-full w-fit ${badgeColor === 'emerald' ? 'border-emerald-500/20' : 'border-azure/20'}`}>
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${badgeColor === 'emerald' ? 'bg-emerald-400' : 'bg-azure'}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${badgeColor === 'emerald' ? 'text-emerald-400' : 'text-azure'}`}>{badgeText}</span>
        </div>
      </div>
    </div>
  </div>
);

const KnowledgeLayer = () => {
  const guidesRef = useRef(null);
  const projectsRef = useRef(null);

  const guides = [
    {
      title: "Docker Masterclass: Implementation Series",
      desc: "Complete lifecycle management covering Portainer, Nginx Proxy Manager, Pi-Hole, and Automated Watchtower updates.",
      icon: Terminal,
      link: "https://reprodev.com/tag/docker/",
      tags: ["Docker", "Linux", "Self-hosting"],
      time: "Tag Archive",
      glowColor: "rgba(16, 185, 129, 0.2)"
    },
    {
      title: "The Install Guides Archive",
      desc: "A centralized repository of detailed installation and configuration walk-throughs for homelab services.",
      icon: Archive,
      link: "https://reprodev.com/tag/install-guides/",
      tags: ["Guides", "Software", "Config"],
      time: "Tag Archive",
      glowColor: "rgba(16, 185, 129, 0.2)"
    },
    {
      title: "The Proxmox vs ESXi Hypervisor Debate",
      desc: "Critical analysis of VMware's legacy vs Proxmox VE's growing dominance in the modern homelab environment.",
      icon: HardDrive,
      link: "https://reprodev.com/is-the-reign-of-esxi-as-the-hypervisor-of-choice-for-learning-at-home-virtually-over/",
      tags: ["Virtualization", "Proxmox", "PVE"],
      time: "20 min read",
      glowColor: "rgba(168, 85, 247, 0.2)"
    },
    {
      title: "Raspberry Pi 4 Model B Baseline Setup",
      desc: "Physical hardening and OS provisioning for the primary ARM control head (pibuster4) in the physical cluster.",
      icon: Cpu,
      link: "https://reprodev.com/set-up-raspberry-pi/",
      tags: ["Hardware", "ARM", "Provisioning"],
      time: "20 min read",
      glowColor: "rgba(251, 191, 36, 0.2)"
    }
  ];

  const projects = [
    {
      title: "Service Desk Sim",
      desc: "A dystopian corporate simulation of enterprise IT support chaos, exploring operational psychology and procedural logic.",
      icon: Monitor,
      link: "https://servicedesksim.com",
      tags: ["Godot", "Simulation", "Featured"],
      time: "v1.1 Gold",
      type: "Project",
      glowColor: "rgba(139, 92, 246, 0.3)",
      image: "https://servicedesksim.com/ServiceDeskSimLogoV1.webp"
    },
    {
      title: "LGTV Firmware Utility",
      desc: "Massively successful open-source utility for LG TV webOS firmware management. High community impact.",
      icon: Zap,
      link: "https://github.com/reprodev/LGTV-Firmware-Downgrade",
      tags: ["webOS", "Utility", "1,040+ Forks"],
      time: "139+ Stars",
      type: "Project",
      glowColor: "rgba(96, 165, 250, 0.2)",
      image: "https://opengraph.githubassets.com/2f21bd7725001ff4c03111e652c625ba0798387b79034a75e32d68d42d5d616f/reprodev/LGTV-Firmware-Downgrade"
    },
    {
      title: "PowerCSR: GUI Tool",
      desc: "A custom PowerShell-based GUI to simplify and automate Certificate Signing Requests and Private Key generation.",
      icon: Terminal,
      link: "https://dev.to/reprodev/simplify-your-openssl-csr-requests-with-powercsr-gui-tool-148h",
      tags: ["PowerShell", "Security"],
      time: "dev.to / Starred",
      type: "Project",
      glowColor: "rgba(96, 165, 250, 0.2)",
      image: "https://media2.dev.to/dynamic/image/width=1000,height=500,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fv4m15j90v57p4j8p6m2g.png"
    },
    {
      title: "Exchange-Toolbox V2",
      desc: "Advanced menu-driven PowerShell GUI for enterprise-level Exchange administration and automation tasks.",
      icon: Archive,
      link: "https://github.com/reprodev/Exchange-ToolboxV2",
      tags: ["PowerShell", "Enterprise"],
      time: "GitHub Repo",
      type: "Project",
      glowColor: "rgba(16, 185, 129, 0.2)",
      image: "https://opengraph.githubassets.com/791c5e933405f6e80668f9a94f0685e8271705e4659f518804595e840656a81b/reprodev/Exchange-ToolboxV2"
    },
    {
      title: "GIPHY Linker Utility",
      desc: "Developer automation tool for embedding GIPHY links into articles, specifically optimized for Dev.to / Hashnode.",
      icon: Code,
      link: "https://github.com/reprodev/GIPHY-Linker",
      tags: ["PowerShell", "Automation"],
      time: "reprodev.com",
      type: "Project",
      glowColor: "rgba(168, 85, 247, 0.2)",
      image: "https://opengraph.githubassets.com/791c5e933405f6e80668f9a94f0685e8271705e4659f518804595e840656a81b/reprodev/GIPHY-Linker"
    },
    {
      title: "GitHub Hub: reprodev",
      desc: "Explore 40+ repositories covering PowerShell automation, infrastructure-as-code, and custom developer tools.",
      icon: Github,
      link: "https://github.com/reprodev",
      tags: ["Open Source", "Portfolio"],
      time: "40+ Repos",
      type: "Project",
      glowColor: "rgba(251, 191, 36, 0.2)",
      image: "https://avatars.githubusercontent.com/u/8764255?v=4"
    }
  ];

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="knowledge-base" className="mb-24 scroll-mt-24">
      {/* Guides Row */}
      <CarouselHeader 
        title="Layer 5: Knowledge Base & Library" 
        subtitle="Implementation Guides from reprodev.com" 
        badgeText="Technical Guides" 
        badgeColor="emerald"
        showArrows={true}
        onScroll={(dir) => scrollContainer(guidesRef, dir)}
      />

      <div 
        ref={guidesRef}
        className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20 overflow-x-auto md:overflow-x-visible px-4 md:px-0 snap-x snap-mandatory scrollbar-hide pb-8 md:pb-0"
      >
        {guides.map((guide, idx) => (
          <TutorialCard key={`guide-${idx}`} {...guide} />
        ))}
        <div className="md:hidden shrink-0 w-8" />
      </div>

      {/* Projects Row */}
      <CarouselHeader 
        title="Developer Portfolio & Tools" 
        subtitle="Custom Development & PowerShell Automation" 
        badgeText="Top 5 Projects" 
        badgeColor="azure"
        showArrows={true}
        onScroll={(dir) => scrollContainer(projectsRef, dir)}
      />

      <div 
        ref={projectsRef}
        className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto md:overflow-x-visible px-4 md:px-0 snap-x snap-mandatory scrollbar-hide pb-8 md:pb-0"
      >
        {projects.map((project, idx) => (
          <TutorialCard key={`project-${idx}`} {...project} />
        ))}
        <div className="md:hidden shrink-0 w-8" />
      </div>

      <div className="mt-16 flex items-center justify-center px-4">
        <a 
          href="https://reprodev.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-10 py-4 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-500 text-sm font-bold text-slate-300 hover:text-emerald-400 flex flex-col md:flex-row items-center gap-4 group shadow-2xl text-center w-full md:w-auto"
        >
          <span>Explore All Knowledge Bases at reprodev.com</span>
          <ExternalLink size={18} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </a>
      </div>
    </section>
  );
};

export default KnowledgeLayer;
