import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, ArrowLeft, ExternalLink, Shield, Cpu, Terminal, Users, Code, Globe, Music } from 'lucide-react';

/* 
  Khurram Nazir - Service Desk Sim Details (V1.5.0)
  Intermediate 'blurb' stage for the game project.
  SEO: Institutional Semantic Bridge + JSON-LD
*/

const ServiceDeskSimDetails = ({ onBack }) => {
  const [activeTab, setActiveTab] = React.useState('game');

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Service Desk Sim Ecosystem",
    "operatingSystem": "Windows, Web, Linux",
    "applicationCategory": "Professional Portfolio / Creative Technology",
    "description": "A multi-disciplinary ecosystem encompassing game development (Godot), web architecture (React), and sound design.",
    "publisher": {
      "@type": "Person",
      "name": "Khurram Nazir"
    },
    "version": "1.1.0 Gold",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const tabs = [
    { id: 'game', label: '01: The Simulation', icon: <Monitor size={16} /> },
    { id: 'web', label: '02: The Portal', icon: <Globe size={16} /> },
    { id: 'audio', label: '03: The OST', icon: <Music size={16} /> }
  ];

  const content = {
    game: {
      title: "Service Desk Sim",
      subtitle: "Technical Architect & Game Designer",
      role: "Lead Developer",
      stack: "Godot 4.6 (GDScript)",
      description: "A vertical ascension simulation requiring tactical ticket triage across 42 levels of the MegaCorp Tower. Satisfaction is mandatory.",
      specs: [
        { label: "Levels", value: "42", detail: "Progressive Difficulty" },
        { label: "Sectors", value: "13", detail: "Themed Environments" },
        { label: "Tickets", value: "10,284", detail: "Procedural Database" },
        { label: "Architecture", value: "Signal Bus", detail: "Global Signal Manager" }
      ],
      highlights: [
        { title: "Modular Content Engine", desc: "Engineered a 14-file JSON architecture supporting 10,284 unique, hand-crafted incident reports." },
        { title: "Global Signal Bus", desc: "Refactored monolithic logic into a modular Global Signal Manager for decoupled communication." },
        { title: "Dynamic Simulation", desc: "Implemented an adaptive difficulty system that scales throughput and ticket spawn rates in real-time." }
      ]
    },
    web: {
      title: "The Synergy Portal",
      subtitle: "Full-Stack Web Developer",
      role: "Lead Engineer",
      stack: "React, Vite, Tailwind v4",
      description: "The digital gateway and lore hub for the ecosystem. An 'in-universe' interactive experience bridging narrative and reality.",
      specs: [
        { label: "Stack", value: "Vite/React", detail: "High Performance" },
        { label: "Styling", value: "TW v4", detail: "Modern Utility" },
        { label: "Animation", value: "Framer", detail: "Terminal Micro-FX" },
        { label: "SEO", value: "JSON-LD", detail: "Institutional Strategy" }
      ],
      highlights: [
        { title: "Modern Frontend", desc: "Utilizing Vite and React for near-instant load times with a streamlined Tailwind CSS v4 design system." },
        { title: "Interactive Narrative", desc: "Leveraged Framer Motion to create terminal-inspired micro-animations reflecting the game's CRT aesthetic." },
        { title: "Institutional SEO", desc: "Advanced workflows including metadata synchronization with game lore and semantic HTML5 structures." }
      ]
    },
    audio: {
      title: "All Clouds Run",
      subtitle: "Composer & Sound Designer",
      role: "Alias: ACR",
      stack: "Logic Pro / Bandcamp",
      description: "A 15-track corporate-dystopian original soundtrack. Composed to reflect the evolving atmosphere of the tower's 13 sectors.",
      specs: [
        { label: "Tracks", value: "15", detail: "Industrial Ambient" },
        { label: "Mapping", value: "1-to-1", detail: "Sector Specific" },
        { label: "Distribution", value: "Bandcamp", detail: "Direct-to-Fan" },
        { label: "Production", value: "Logic Pro", detail: "High Fidelity" }
      ],
      highlights: [
        { title: "Contextual Design", desc: "1-to-1 mapping of sector-specific tracks, from basement drones to reality-bending industrial soundscapes." },
        { title: "Audio-Visual Branding", desc: "Dedicated landing page mirroring the institutional aesthetic with high-fidelity visualizers." },
        { title: "Media Production", desc: "Produced high-resolution visual assets and DAW recordings for social media cross-promotion." }
      ]
    }
  };

  const current = content[activeTab];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl w-full px-6 py-16 bg-black/80 backdrop-blur-3xl rounded-[3rem] border border-violet-500/20 shadow-[0_0_100px_rgba(139,92,246,0.15)] relative overflow-hidden"
    >
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      {/* Tab Switcher */}
      <div className="flex flex-wrap justify-center gap-2 mb-16 relative z-20">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-500 text-[10px] font-black uppercase tracking-widest ${
              activeTab === tab.id 
              ? 'bg-violet-600 border-violet-400 text-white shadow-[0_0_30px_rgba(139,92,246,0.3)]' 
              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      
      <article className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
              <div className="w-full lg:w-1/3">
                <div className="mx-auto lg:mx-0 max-w-sm rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.3)] border border-violet-500/30 bg-black p-4 group">
                  <img 
                    src="https://servicedesksim.com/ServiceDeskSimLogoV1.webp" 
                    alt="Logo" 
                    className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              
              <div className="w-full lg:w-2/3 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                  <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/30 rounded-md text-[10px] font-black uppercase tracking-widest text-violet-400">
                    {current.role}
                  </span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Stack: {current.stack}
                  </span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-tight uppercase">
                  {current.title}
                </h2>
                <p className="text-lg text-violet-400/80 font-black uppercase tracking-widest mb-6">
                  {current.subtitle}
                </p>
                <p className="text-xl text-white/60 leading-relaxed max-w-2xl font-medium italic">
                  "{current.description}"
                </p>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {current.specs.map((spec, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center group hover:border-violet-500/30 transition-all">
                  <div className="text-3xl font-black text-white mb-1 tracking-tighter">{spec.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-violet-400 mb-1">{spec.label}</div>
                  <div className="text-[10px] text-slate-500">{spec.detail}</div>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {current.highlights.map((hl, i) => (
                <div key={i} className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-violet-500/20 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Code size={40} className="text-violet-400" />
                  </div>
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2 uppercase text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                    {hl.title}
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {hl.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer CTAs */}
        <div className="flex flex-col items-center gap-12 pt-12 border-t border-white/5">
          <div className="text-center space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-400 opacity-50">Authorized External Portals</h5>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <button 
                onClick={onBack}
                className="flex items-center gap-3 px-10 py-5 rounded-full bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <ArrowLeft size={18} /> Cancel Onboarding
              </button>
              
              <a 
                href="https://servicedesksim.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-10 py-5 rounded-full bg-violet-600 text-white font-black uppercase tracking-widest text-sm hover:shadow-[0_0_50px_rgba(139,92,246,0.4)] transition-all hover:scale-105"
              >
                Access Portal <ExternalLink size={18} />
              </a>
            </div>
          </div>

          <div className="w-full max-w-[552px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
            <iframe 
              frameBorder="0" 
              src="https://itch.io/embed/4343790?linkback=true&amp;dark=true" 
              width="552" 
              height="167"
              title="SDS Embed"
            >
              <a href="https://reprodev.itch.io/servicedesksim">Service Desk Sim</a>
            </iframe>
          </div>
        </div>
      </article>
    </motion.div>
  );
};

export default ServiceDeskSimDetails;
