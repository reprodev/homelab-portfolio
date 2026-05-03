import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ArrowLeft, Terminal, Zap, Cpu, Share2 } from 'lucide-react';

/* 
  Khurram Nazir - The Origin Story Component (V1.5.0)
  A 'behind-the-scenes' component detailing the site's creation.
*/

const OriginStory = ({ onBack, onOpenCaseStudy }) => {
  const aiArchetypes = [
    { 
      name: 'AntiGravity', 
      role: 'Lead Architect', 
      desc: 'High-level orchestration, Gold Master polish, and agentic UX strategy.',
      icon: <Terminal className="text-azure-light" size={24} />,
      color: 'border-azure/30 bg-azure/5'
    },
    { 
      name: 'Claude', 
      role: 'Logic & State', 
      desc: 'Complex React state machines, technical documentation, and code reconciliation.',
      icon: <Cpu className="text-emerald-400" size={24} />,
      color: 'border-emerald-500/30 bg-emerald-500/5'
    },
    { 
      name: 'Codex', 
      role: 'Utility Core', 
      desc: 'Initial scaffolding, Tailwind utility mapping, and CSS logic optimization.',
      icon: <Zap className="text-amberGold" size={24} />,
      color: 'border-amberGold/30 bg-amberGold/5'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-5xl w-full px-6 py-16 bg-black/60 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
    >
      {/* Decorative Neural Grid Background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-azure/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-amberGold/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="mb-8 mx-auto w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-azure-light shadow-2xl backdrop-blur-xl">
            <HelpCircle size={40} />
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-tight">
            The <span className="bg-gradient-to-r from-azure-light via-white to-amberGold bg-clip-text text-transparent px-2">Origin</span> Story
          </h2>
          
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-azure-light to-transparent mx-auto mb-10" />

          <p className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-3xl font-medium mx-auto italic">
            "A high-fidelity synthesis of human vision and the Intelligence Layer."
          </p>
        </div>

        {/* Narrative Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8 text-white/70 text-lg leading-relaxed font-medium">
            <p>
              This digital ecosystem wasn't just "coded"; it was <span className="text-white">choreographed</span>. Born from a desire to unify three fragmented digital identities—Music, Knowledge Base, and Homelab—into a single high-fidelity gateway, we leveraged a multi-agentic workflow to push the boundaries of what a professional portal can be.
            </p>
            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4">
              <h4 className="text-sm font-mono uppercase tracking-[0.3em] text-azure-light font-bold">The Engineering Protocol</h4>
              <p className="text-sm">
                By using <span className="text-white">Google AntiGravity</span> as the primary pilot, we established a "Gold Master" standard. We transitioned from static designs to dynamic React components, using <span className="text-white">Claude</span> for heavy logic lifting and <span className="text-white">Codex</span> for rapid scaffolding.
              </p>
            </div>
            <p>
              Every transition, haptic interaction, and mobile-performance tweak was precision-tuned through real-time feedback loops between the architect and the AI agents.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-[0.5em] text-white/40 mb-6 px-4">Collaborative Intelligence Layer</h3>
            {aiArchetypes.map((ai) => (
              <motion.div 
                key={ai.name}
                whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.08)' }}
                className={`p-6 rounded-2xl border ${ai.color} transition-all group cursor-default`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-black/40 shadow-xl group-hover:scale-110 transition-transform">
                    {ai.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black text-white">{ai.name}</span>
                      <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase border border-white/10 px-2 py-0.5 rounded-full">{ai.role}</span>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed font-medium">
                      {ai.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Learning Section (Prompt Insight) */}
        <div className="w-full max-w-4xl p-10 rounded-[2.5rem] bg-slate-950 border border-white/5 shadow-2xl mb-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 p-4 font-mono text-[10px] text-white/20 uppercase tracking-widest">Prompt Logic Trace v1.5</div>
          <div className="flex flex-col gap-6 mt-6">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <div className="space-y-2">
                <p className="text-sm font-mono text-white/40">USER@ANTI-GRAVITY: ~/</p>
                <p className="text-base font-bold text-azure-light">
                  "Initialize a multi-stage digital gateway using Vite and Framer Motion. 
                  Unify the three operational sectors (Music, KB, Homelab) into a single high-fidelity entry point. 
                  Prioritize cinematic branding in Stage 1 and optimize for the Pixel 4a 5G capture protocol."
                </p>
              </div>
            </div>
            <div className="h-px bg-white/5 w-full" />
            <div className="flex items-start gap-4 opacity-60">
              <div className="w-2 h-2 rounded-full bg-azure mt-2" />
              <div className="space-y-2">
                <p className="text-xs font-mono text-white/40">SYSTEM_LOG:</p>
                <p className="text-sm text-white/80">
                  Scaffolding selection tiles... Syncing gradient tokens... 
                  Implementing stage persistence... Injecting haptic feedback nodes...
                  Running headless browser verification for 'Capture-Safe' UI compliance...
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-3 px-10 py-5 rounded-full bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-x-1"
          >
            <ArrowLeft size={18} /> Return to Portal
          </button>
          
          <button 
            onClick={onOpenCaseStudy}
            className="flex items-center gap-3 px-10 py-5 rounded-full bg-white text-slate-950 font-black uppercase tracking-widest text-sm hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all hover:scale-105"
          >
            Explore the Documentation <Share2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};


export default OriginStory;
