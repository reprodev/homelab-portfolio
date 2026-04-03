import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, BookOpen, HardDrive, ArrowRight, ChevronRight } from 'lucide-react';

const SplashHub = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [stage, setStage] = useState('intro'); // 'intro' or 'selection'

  useEffect(() => {
    // Check if splash has been hidden permanently
    const isPermanentlyHidden = localStorage.getItem('hideSplashPermanently');
    if (isPermanentlyHidden === 'true') {
      setIsVisible(false);
      return;
    }

    // Check if splash has been shown in this session
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplashHub');
    if (!hasSeenSplash) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = (destination) => {
    // 📊 GA4 Tracking: Track which portal was selected
    if (window.gtag) {
      window.gtag('event', 'select_portal', {
        'portal_id': destination === 'homelab' ? 'homelab_dashboard' : destination,
        'event_category': 'navigation',
        'event_label': 'Splash Hub Selection'
      });
    }

    // Set session storage
    sessionStorage.setItem('hasSeenSplashHub', 'true');
    
    // Set permanent storage if checked
    if (dontShowAgain) {
      localStorage.setItem('hideSplashPermanently', 'true');
    }

    if (destination === 'homelab') {
      setIsVisible(false);
    } else {
      setTimeout(() => {
        window.location.href = destination;
      }, 300);
    }
  };

  const cards = [
    {
      id: 'music',
      title: 'Music Portfolio',
      tagline: 'Sonic Landscapes',
      description: 'Original compositions and immersive digital soundscapes explore the intersection of rhythm and atmosphere.',
      url: 'https://allcloudsrun.com',
      image: '/splash/music.webp',
      color: 'from-azure-dark/90 to-blue-900/40',
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
      icon: <HardDrive className="text-amberGold" size={28} />,
      tag: 'KHURRAM NAZIR'
    }
  ];

  if (!isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="splash-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
        className="fixed inset-0 z-[100] bg-[#050505] overflow-y-auto no-scrollbar scroll-smooth antialiased"
      >
        {/* Universal Ambient Backgrounds */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-azure/20 rounded-full blur-[140px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.08, 0.05]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amberGold/10 rounded-full blur-[160px]" 
          />
        </div>

        {/* Dynamic Stages */}
        <div className="relative min-h-full flex flex-col items-center justify-center py-24 px-6 z-10 font-outfit">
          <AnimatePresence mode="wait">
            {stage === 'intro' ? (
              /* STAGE 1: PERSONAL INTRO */
              <motion.div 
                key="stage-intro"
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
                    className="flex flex-col items-center"
                  >
                    <span className="text-[10px] font-mono font-bold text-azure-light tracking-[0.5em] uppercase mb-8 opacity-60">Digital Presence Portal</span>
                    
                    <h2 className="text-4xl md:text-5xl font-light tracking-[0.2em] text-white/40 mb-4 uppercase">Khurram Nazir</h2>

                    <motion.h1 
                      animate={{ 
                        textShadow: ["0 0 20px rgba(96,165,250,0)", "0 0 20px rgba(96,165,250,0.3)", "0 0 20px rgba(96,165,250,0)"]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="text-[clamp(3rem,8.5vw,9rem)] font-extrabold tracking-tighter text-white mb-4 leading-[0.85] w-full px-4 overflow-visible whitespace-nowrap"
                    >
                      khurram<span className="text-azure-light/90">nazir</span><span className="text-amberGold">.com</span>
                    </motion.h1>
                    
                    <p className="text-azure-light/60 text-[clamp(0.6rem,1.2vw,0.75rem)] font-mono font-bold tracking-[0.4em] uppercase mt-4 mb-12 px-6">
                      Infrastructure Architect & Creative Technologist
                    </p>

                    <div className="h-1 w-24 bg-gradient-to-r from-transparent via-azure/40 to-transparent rounded-full mb-12 shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-12"
                >
                  <p className="text-slate-400 text-lg md:text-xl font-medium tracking-wide max-w-2xl mx-auto leading-relaxed">
                    A multi-faceted architectural archive of <span className="text-azure-light">infrastructure</span>, <span className="text-emerald-400">knowledge</span>, and <span className="text-purple-400">sound</span>.
                  </p>

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
              /* STAGE 2: ECOSYSTEM SELECTION */
              <motion.div 
                key="stage-selection"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-6xl w-full"
              >
                <div className="text-center mb-20">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
                  >
                    <span className="text-[10px] font-mono text-azure-light tracking-[0.4em] uppercase font-bold">Initiating Environment Selection</span>
                  </motion.div>
                  <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
                    Choose Your <span className="gradient-text">Destination</span>
                  </h1>
                  <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                    Select a dedicated portal to explore specialized portfolios.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {cards.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ y: 60, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ y: -12, scale: 1.02 }}
                      className="relative group cursor-pointer"
                      onClick={() => handleDismiss(card.url)}
                    >
                      <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 group-hover:border-white/40 group-hover:shadow-azure/20">
                        {/* Background Image */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110"
                          style={{ backgroundImage: `url(${card.image})` }}
                        />
                        
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${card.color} transition-all duration-500 group-hover:bg-opacity-80`} />
                        
                        {/* Content */}
                        <div className="absolute inset-0 p-10 flex flex-col justify-end">
                          <div className="mb-6 transform transition-all duration-500 group-hover:-translate-y-2">
                             <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 mb-8 shadow-xl group-hover:bg-white/20 transition-colors">
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

                        {/* High-tech sweep line */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
                          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent top-0 animate-sweep" />
                        </div>
                      </div>

                      {/* Bottom Glow Effect */}
                      <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-2/3 h-8 bg-${card.id === 'music' ? 'azure' : card.id === 'kb' ? 'emerald-500' : 'amberGold'}/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    </motion.div>
                  ))}
                </div>

                {/* Footer Controls */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-24 flex flex-col items-center gap-8"
                >
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain(e.target.checked)}
                      />
                      <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all duration-300 ${dontShowAgain ? 'border-azure bg-azure/20 shadow-[0_0_15px_rgba(96,165,250,0.4)]' : 'border-white/20 bg-white/5 group-hover:border-white/40'}`}>
                        {dontShowAgain && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2.5 h-2.5 bg-azure rounded-sm"
                          />
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] group-hover:text-slate-300 transition-colors font-bold">Don't show this again</span>
                  </label>

                  <button
                    onClick={() => handleDismiss('homelab')}
                    className="group inline-flex items-center gap-4 text-slate-500 hover:text-white transition-all text-[11px] font-mono uppercase tracking-[0.4em] font-bold py-3 px-6 rounded-xl hover:bg-white/5"
                  >
                    <span className="w-12 h-[1px] bg-slate-800 group-hover:w-16 group-hover:bg-azure transition-all" />
                    Skip to Homelab
                    <span className="w-12 h-[1px] bg-slate-800 group-hover:w-16 group-hover:bg-azure transition-all" />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashHub;
