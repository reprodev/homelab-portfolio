import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, Code, Layout, Smartphone, CheckCircle, Zap } from 'lucide-react';

/* 
  Khurram Nazir - Digital Case Study / Blog View (V1.5.0)
  High-fidelity walkthrough of the site's architectural and AI-driven evolution.
*/

const CaseStudyPost = ({ onBack }) => {
  const sections = [
    {
      id: 'concept',
      title: '01. The Architectural Goal',
      content: 'The objective was to transform a set of fragmented digital sites into a unified Multi-Stage Digital Gateway. By consolidating branding and navigation into a single entry point, the portal serves as a premium showcase for both technical infrastructure (Homelab) and professional portfolio (Knowledge Base, Music).',
      image: '/docscreens/howtomake/01_initial_splash_screen.png',
      caption: 'Initial Concept: Establishing the core two-stage splash logic and cinematic branding.',
      icon: <Layout className="text-azure-light" size={20} />
    },
    {
      id: 'evolution',
      title: '02. Sprint Evolution: Splash Hub',
      content: 'Using AI-driven prompts, we generated a React-based Hub with persistent stage logic. This ensures returning users can bypass the intro branding while maintaining high-fidelity transitions for first-time visitors.',
      image: '/docscreens/howtomake/02_splash_evolution.png',
      caption: 'Stage 2 Transition: Refining the selection tiles and ecosystem navigation.',
      icon: <Zap className="text-amberGold" size={20} />
    },
    {
      id: 'dashboard',
      title: '03. Dashboard & Active Intel',
      content: 'Real-time architectural showcase of a production-grade homelab dashboard. We implemented 3D Tilt Perspective and haptic server nodes that react tactilely to cursor and touch events.',
      image: '/docscreens/howtomake/03_dashboard_unveiled.png',
      caption: 'Infrastructure Viz: Deploying the live homelab dashboard with high-atmosphere orbs.',
      icon: <Code className="text-emerald-400" size={20} />
    },
    {
      id: 'branding',
      title: '04. Branding & Legibility Sync',
      content: 'Consistent branding is key. We unified the identity "Khurram Nazir | IT Professional and Creative Technologist" across all entries, upscaling fonts (12-14px) and boosting contrast for maximum accessibility.',
      image: '/docscreens/howtomake/04_branding_sync.png',
      caption: 'Identity Sync: Final verification of the horizontal signature gradient.',
      icon: <CheckCircle className="text-azure-light" size={20} />
    },
    {
      id: 'optimization',
      title: '05. Mobile Performance & Capture',
      content: 'The "Gemini Capture Protocol" addressed Android system-level transparency issues. By demoting the noise overlay to z-50 and capping blurs at 20px, we achieved a capture-safe, high-performance UI on the Pixel 4a 5G.',
      image: '/docscreens/howtomake/05_legibility_audit.png',
      caption: 'Mobile Verification: Ensuring the HUD is legible and performant on 6-inch screens.',
      icon: <Smartphone className="text-pink-500" size={20} />
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl w-full mx-auto pb-32"
    >
      {/* Article Header */}
      <div className="mb-20 pt-10 px-6 border-b border-white/10 pb-16">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 text-sm font-mono uppercase tracking-widest group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Origin
        </button>

        <div className="flex items-center gap-4 mb-6">
          <span className="px-3 py-1 bg-azure/20 text-azure-light text-[10px] font-mono font-bold tracking-[0.2em] rounded-full uppercase border border-azure/30">Case Study V1.5.0</span>
          <div className="flex items-center gap-2 text-white/30 text-xs font-mono">
            <Calendar size={14} /> April 2026
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight mb-8">
          Architecting a <span className="bg-gradient-to-r from-azure-light via-white to-amberGold bg-clip-text text-transparent">Unified Identity</span> with AI.
        </h1>

        <p className="text-xl text-white/60 leading-relaxed max-w-2xl font-medium">
          A technical retrospective on how I engineered a cinematic digital ecosystem through a high-fidelity partnership between personal vision and agentic AI co-piloting.
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 space-y-32">
        {sections.map((section, index) => (
          <motion.section 
            key={section.id}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="group"
          >
            <div className="flex items-start gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                {section.icon}
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight pt-1">{section.title}</h2>
            </div>

            <div className="space-y-12">
              <p className="text-lg text-white/70 leading-relaxed leading-[1.8] font-medium max-w-3xl">
                {section.content}
              </p>

              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-black">
                <img 
                  src={section.image} 
                  alt={section.caption}
                  className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity duration-1000"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <p className="text-xs font-mono text-white/60 tracking-wider flex items-center gap-3 italic">
                    <span className="w-4 h-px bg-white/20" /> {section.caption}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        ))}

        {/* Closing Scenarios Section */}
        <motion.section 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="p-12 rounded-[3rem] bg-white text-slate-950 shadow-2xl"
        >
          <h2 className="text-4xl font-black tracking-tighter mb-8 leading-tight">Make This Your Own: <br/>Customization & Scenarios</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-black uppercase tracking-widest text-azure-dark">Customization Strategy</h3>
              <p className="text-slate-700 font-medium leading-relaxed">
                The portal is designed as a **Declarative Identity Framework**. By swapping color tokens in Tailwind or adjusting orb densities in the Splash Hub, you can pivot the aesthetic from "High-Atmosphere Infrastructure" to "Editorial Minimalism" in minutes.
              </p>
              <ul className="space-y-4 text-sm font-bold text-slate-500 uppercase tracking-wide">
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-azure" /> Swap Gradient Signatures</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-azure" /> Tune Cinematic Transition Durations</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-azure" /> Modify Tap Deltas & Haptics</li>
              </ul>
            </div>

            <div className="space-y-8">
              <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-950 mb-2">Scenario Alpha: SecOps HUD</h4>
                <p className="text-xs font-medium text-slate-600">Focus on terminal aesthetics, JetBrains Mono, and a flicker 'Grid' texture for high-stakes security showcasing.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-950 mb-2">Scenario Beta: Digital Artist</h4>
                <p className="text-xs font-medium text-slate-600">Max focus on full-screen media with large reveal deltas (1.1x) and clean Slate-on-White contrast.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-slate-200 flex flex-col items-center">
            <p className="text-slate-400 text-xs font-mono uppercase tracking-[0.2em] mb-8">End of Retrospective</p>
            <button 
              onClick={onBack}
              className="flex items-center gap-3 px-10 py-5 bg-black text-white font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-xl"
            >
              Return to Ecosystem Hub
            </button>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default CaseStudyPost;
