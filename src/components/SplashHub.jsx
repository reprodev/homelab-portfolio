import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, BookOpen, Database, ArrowRight, ChevronRight } from 'lucide-react';

/* 
  Khurram Nazir - Multi-Stage Digital Ecosystem Hub
  Controlled Component for App.jsx integration.
  Fixes: 
  - Mobile clipping on Pixel 4a 5G (floor: 1.8rem)
  - Flicker-free mounting
  - Google Tag safety checks
*/

const SplashHub = ({ onDismiss }) => {
  const [stage, setStage] = useState('intro'); // 'intro' | 'selection'
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const portalCards = [
    {
      id: 'music',
      title: 'Music Portfolio',
      tagline: 'Sonic Landscapes',
      description: 'Original compositions and immersive digital soundscapes explore the intersection of rhythm and atmosphere.',
      url: 'https://allcloudsrun.com',
      image: '/splash/music.webp',
      color: 'from-azure-dark/90 to-blue-950/40',
      icon: <Music className="text-azure-light" size={28} />,
      tag: 'ALL CLOUDS RUN'
    },
    {
      id: 'kb',
      title: 'Knowledge Base',
      tagline: 'Technical Archive',
      description: 'A curated repository of infrastructure deep-dives, VPS optimization guides, and DevOps best practices.',
      url: 'https://reprodev.com',
      image: '/splash/kb.webp',
      color: 'from-emerald-950/90 to-slate-900/40',
      icon: <BookOpen className="text-emerald-400" size={28} />,
      tag: 'REPRODEV'
    },
    {
      id: 'homelab',
      title: 'Homelab Dashboard',
      tagline: 'Infrastructure Viz',
      description: 'Real-time architectural showcase of a production-grade home datacenter built on Linux and GitOps.',
      url: 'homelab',
      image: '/splash/homelab.webp',
      color: 'from-amberGold-dark/90 to-orange-950/40',
      icon: <Database className="text-amberGold" size={28} />,
      tag: 'PRODUCTION / LIVE'
    }
  ];

  const handleAction = (destination) => {
    // Sync persistence settings
    sessionStorage.setItem('hasSeenSplashHub', 'true');
    if (dontShowAgain) {
      localStorage.setItem('hideSplashPermanently', 'true');
    }

    // 📊 GA4 Tracking Safety Check
    if (window.gtag) {
      window.gtag('event', 'select_portal', {
        'portal_id': destination === 'homelab' ? 'homelab_dashboard' : destination,
        'event_category': 'navigation',
        'event_label': 'Splash Hub Selection'
      });
    }

    if (destination === 'homelab') {
      onDismiss();
    } else {
      // Small artificial delay for transition smoothness
      setTimeout(() => {
        window.location.href = destination;
      }, 300);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-[#050505] overflow-y-auto no-scrollbar scroll-smooth"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
    >
      {/* Background Texture & Ambient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-azure/20 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amberGold/10 rounded-full blur-[160px]" 
        />
      </div>

      <div className="relative min-h-full flex flex-col items-center justify-center py-24 px-6 z-10 font-outfit">
        <AnimatePresence mode="wait">
          {stage === 'intro' ? (
            /* STAGE 1: BRANDING INTRO */
            <motion.div 
              key="intro"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)', transition: { duration: 0.6 } }}
              className="max-w-7xl w-full text-center px-10"
            >
              <div className="mb-8 overflow-visible">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="text-[10px] font-mono font-bold text-azure-light tracking-[0.5em] uppercase mb-8 opacity-60 block">Digital Presence Portal</span>
                  
                  <h2 className="text-4xl md:text-5xl font-light tracking-[0.2em] text-white/40 mb-4 uppercase">Khurram Nazir</h2>
                  <motion.h1 
                    animate={{ 
                      textShadow: ["0 0 20px rgba(96,165,250,0)", "0 0 20px rgba(96,165,250,0.3)", "0 0 20px rgba(96,165,250,0)"]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-[clamp(1.8rem,8.5vw,9rem)] font-extrabold tracking-tighter text-white mb-4 leading-[0.85] w-full px-4 overflow-visible whitespace-nowrap"
                  >
                     khurramnazir.com
                  </motion.h1>
                  
                  <p className="text-azure-light/60 text-[clamp(0.6rem,1.2vw,0.75rem)] font-mono font-bold tracking-[0.4em] uppercase mt-4 mb-12 px-6">
                    Infrastructure Architect & Creative Technologist
                  </p>

                  <div className="h-1 w-24 bg-gradient-to-r from-transparent via-azure/40 to-transparent mx-auto rounded-full mb-12 shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <button
                  onClick={() => setStage('selection')}
                  className="group relative inline-flex items-center justify-center px-12 py-5 rounded-full bg-white text-black font-black text-sm uppercase tracking-[0.2em] transition-all hover:pr-14 hover:pl-10 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                >
                  <span>Enter Ecosystem</span>
                  <ChevronRight size={20} className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </motion.div>
            </motion.div>
          ) : (
            /* STAGE 2: PORTAL SELECTION */
            <motion.div 
              key="selection"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-6xl w-full"
            >
              <div className="text-center mb-16 px-4">
                 <h3 className="text-white text-xs font-mono tracking-[0.4em] uppercase mb-4 opacity-50">Operational Sectors</h3>
                 <div className="h-px w-12 bg-white/20 mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {portalCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -12, scale: 1.02 }}
                    className="relative group cursor-pointer"
                    onClick={() => handleAction(card.url)}
                  >
                    <div className="relative h-[480px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 group-hover:border-white/40 group-hover:shadow-azure/20">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110" style={{ backgroundImage: `url(${card.image})` }} />
                      <div className={`absolute inset-0 bg-gradient-to-t ${card.color} transition-all duration-500 group-hover:bg-opacity-80`} />
                      
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-sweep pointer-events-none" />

                      <div className="absolute inset-0 p-10 flex flex-col justify-end">
                         <div className="mb-6 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-azure-light group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
                           {card.icon}
                         </div>

                         <div className="space-y-1 mb-4">
                           <span className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase font-bold">{card.tag}</span>
                           <h3 className="text-3xl font-black text-white leading-none">{card.title}</h3>
                           <p className="text-azure-light/80 text-xs font-mono font-bold tracking-widest uppercase">{card.tagline}</p>
                         </div>

                         <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-[260px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {card.description}
                         </p>
                      </div>
                      
                      <div 
                        className="flex items-center gap-3 text-white font-bold text-sm tracking-wide group-hover:gap-4 transition-all uppercase"
                        role="button"
                        aria-label={`Launch ${card.title}`}
                      >
                        {card.id === 'homelab' ? 'Enter Dashboard' : 'Launch Site'} 
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Interaction Footer */}
              <div className="mt-20 flex flex-col items-center gap-8">
                <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md group hover:border-white/20 transition-all">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain(e.target.checked)}
                      />
                      <div className="w-5 h-5 border border-white/30 rounded bg-black/40 peer-checked:bg-azure peer-checked:border-azure transition-all" />
                      <div className="absolute inset-0 flex items-center justify-center text-white scale-0 peer-checked:scale-100 transition-transform">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                    </div>
                    <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] group-hover:text-white/70 transition-colors">Don't show this splash again</span>
                  </label>
                </div>
                
                <button 
                  onClick={() => handleAction('homelab')}
                  className="text-white/30 hover:text-white transition-colors text-[10px] font-mono uppercase tracking-[0.15em] flex items-center gap-4"
                >
                  <div className="h-px w-8 bg-white/20 group-hover:w-12 transition-all" />
                  Skip Introduction
                  <div className="h-px w-8 bg-white/20 group-hover:w-12 transition-all" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SplashHub;
