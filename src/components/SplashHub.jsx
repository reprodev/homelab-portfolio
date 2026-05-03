import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, BookOpen, Database, ArrowRight, ChevronRight, ChevronDown, HelpCircle, Monitor } from 'lucide-react';
import OriginStory from './OriginStory.jsx';
import CaseStudyPost from './CaseStudyPost.jsx';
import ServiceDeskSimDetails from './ServiceDeskSimDetails.jsx';

/* 
  Khurram Nazir - Multi-Stage Digital Ecosystem Hub (V1.5.0 Gold Master)
  Controlled Component for App.jsx integration.
  
  Styling: 
  - Signature Gradient: Azure-Light (khurram) | White (nazir) | AmberGold (.com)
  - Layout: Optimized for Pixel 4a 5G (393px)
  - UX: Natural Scroll Guidance & Cinematic Digital Case Study
*/

const SplashHub = ({ onDismiss }) => {
  const [stage, setStage] = useState('intro'); // 'intro', 'selection', 'origin', 'casestudy'
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScroll = (e) => {
    if (e.target.scrollTop > 50 && !hasScrolled) {
      setHasScrolled(true);
    }
  };

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
    },
    {
      id: 'servicedesk',
      title: 'Service Desk Sim',
      tagline: 'Operational Training',
      description: 'A dystopian corporate simulation exploring the high-stakes world of enterprise IT support and ticket resolution.',
      url: 'https://servicedesksim.com',
      image: '/splash/servicedesk.webp',
      color: 'from-violet-900/90 to-purple-950/40',
      icon: <Monitor className="text-violet-400" size={28} />,
      tag: 'GAME DEV / SIM'
    },
    {
      id: 'origin',
      title: 'The Origin Story',
      tagline: 'Architectural Design',
      description: 'A technical deep-dive into how this digital gateway was engineered through human-AI partnership.',
      url: 'origin',
      image: '/splash/origin.webp',
      color: 'from-slate-700/90 to-black/40',
      icon: <HelpCircle className="text-white" size={28} />,
      tag: 'DOCUMENTATION / AI'
    }
  ];

  const [hoveredId, setHoveredId] = useState(null);

  const handleAction = (destination) => {
    // Stage-based navigation (V1.5.0)
    if (destination === 'origin') {
      setStage('origin');
      return;
    }

    if (destination === 'https://servicedesksim.com') {
      setStage('servicedesk');
      return;
    }

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
        'event_label': 'Splash Hub Selection',
        'is_retrospective': destination === 'origin'
      });
    }

    if (destination === 'homelab') {
      onDismiss();
    } else {
      setTimeout(() => {
        window.location.href = destination;
      }, 300);
    }
  };

  return (
    <motion.div 
      className={`fixed inset-0 z-[100] bg-[#050505] overflow-y-auto no-scrollbar scroll-smooth ${stage === 'casestudy' ? 'bg-[#0a0a0a]' : ''}`}
      onScroll={handleScroll}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: isMobile ? 0.6 : 0.8, ease: [0.16, 1, 0.3, 1] } }}
    >
      {/* Background Texture & Ambient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1], 
            opacity: [0.1, 0.15, 0.1],
            x: hoveredId === 'music' ? -20 : hoveredId === 'homelab' ? 20 : 0 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-azure/20 rounded-full ${isMobile ? 'blur-2xl' : 'blur-[140px]'}`} 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.05, 0.08, 0.05],
            x: hoveredId === 'kb' ? -20 : hoveredId === 'origin' ? 20 : 0
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amberGold/10 rounded-full ${isMobile ? 'blur-2xl' : 'blur-[160px]'}`} 
        />
        
        {/* Grain Overlay (V1.5.0 Refinement) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="relative min-h-full flex flex-col items-center justify-center py-24 px-6 z-10 font-outfit">
        <AnimatePresence mode="wait">
          {stage === 'intro' ? (
            /* STAGE 1: BRANDING INTRO */
            <motion.div 
              key="intro"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: isMobile ? 'blur(10px)' : 'blur(20px)', transition: { duration: isMobile ? 0.4 : 0.6 } }}
              className="max-w-7xl w-full text-center px-10"
            >
              <div className="mb-8 overflow-visible">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: isMobile ? 0.6 : 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className={`text-[12px] md:text-sm font-mono font-bold text-azure-light tracking-[0.5em] uppercase mb-8 ${isMobile ? 'opacity-90' : 'opacity-60'} block`}>
                    Digital Presence Portal
                  </span>
                  
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: isMobile ? 0.6 : 0.8 }}
                    className="text-[clamp(2.5rem,10vw,8rem)] font-black tracking-tighter leading-none mb-2"
                  >
                    <span className="bg-gradient-to-r from-azure-light via-white to-amberGold bg-clip-text text-transparent px-4">
                      Khurram Nazir
                    </span>
                  </motion.h1>
                  
                  <p className={`${isMobile ? 'text-azure-light/90' : 'text-azure-light/40'} text-[clamp(0.85rem,1.5vw,1rem)] font-mono font-bold tracking-[0.4em] uppercase mt-6 mb-12 px-6 leading-relaxed`}>
                    IT Professional and Creative Technologist
                  </p>
                  
                  <div className="flex flex-col items-center gap-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setStage('selection')}
                      className="group relative px-10 py-5 bg-white text-slate-950 font-black uppercase tracking-widest rounded-full overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        Enter the Ecosystem <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : stage === 'selection' ? (
            /* STAGE 2: PORTAL SELECTION */
            <motion.div 
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
              className="max-w-7xl w-full"
            >
              <div className="text-center mb-16 px-4">
                 <motion.h3 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className={`text-white font-mono tracking-[0.4em] uppercase mb-4 ${isMobile ? 'text-sm opacity-80' : 'text-xs opacity-50'}`}
                 >
                   Operational Sectors
                 </motion.h3>
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: 48 }}
                   className="h-px bg-white/20 mx-auto" 
                 />
              </div>

              <div className={`flex flex-col lg:flex-row gap-6 lg:gap-4 h-auto lg:h-[600px] transition-all duration-700 ease-[0.16, 1, 0.3, 1]`}>
                {portalCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.4 + index * 0.15, 
                      ease: [0.16, 1, 0.3, 1],
                      layout: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                    }}
                    onMouseEnter={() => !isMobile && setHoveredId(card.id)}
                    onMouseLeave={() => !isMobile && setHoveredId(null)}
                    className={`relative group cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl transition-all duration-500 
                      ${isMobile ? 'h-[480px] w-full' : 'h-full'}
                      ${!isMobile && hoveredId === card.id ? 'flex-[2.5] border-white/40 shadow-[0_0_50px_rgba(255,255,255,0.1)]' : !isMobile && hoveredId !== null ? 'flex-1 opacity-60 grayscale-[0.5]' : !isMobile ? 'flex-[1.5]' : ''}
                    `}
                    onClick={() => handleAction(card.url)}
                  >
                    {/* Background Image with Zoom and Overlay */}
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-110" style={{ backgroundImage: `url(${card.image})` }} />
                    <div className={`absolute inset-0 bg-gradient-to-t ${card.color} transition-all duration-500 ${hoveredId === card.id ? 'opacity-90' : 'opacity-85'}`} />
                    
                    {/* Glass Reflection Shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Content Container */}
                    <div className={`absolute inset-0 p-8 lg:p-10 flex flex-col justify-end transition-all duration-500 ${!isMobile && hoveredId === card.id ? 'bg-black/20' : ''}`}>
                       <motion.div 
                        layout
                        className="mb-6 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-azure-light group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500"
                       >
                         {card.icon}
                       </motion.div>

                       <div className="space-y-1 mb-4">
                         <span className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase font-bold">{card.tag}</span>
                         <h3 className={`font-black text-white leading-none transition-all duration-500 ${!isMobile && hoveredId === card.id ? 'text-4xl' : 'text-2xl'}`}>
                           {card.title}
                         </h3>
                         <p className="text-azure-light/80 text-xs font-mono font-bold tracking-widest uppercase">{card.tagline}</p>
                       </div>

                       <motion.p 
                        layout
                        className={`text-white/60 text-sm leading-relaxed mb-8 max-w-[320px] transition-all duration-500 
                          ${isMobile ? 'opacity-100' : (hoveredId === card.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none')}
                        `}
                       >
                        {card.description}
                       </motion.p>

                       <div 
                        className="flex items-center gap-3 text-white font-bold text-sm tracking-wide group-hover:gap-4 transition-all uppercase"
                        role="button"
                        aria-label={`Launch ${card.title}`}
                      >
                        <span className="relative">
                          {card.id === 'homelab' ? 'Enter Dashboard' : card.id === 'origin' ? 'Explore Design' : 'Launch Site'}
                          <div className="absolute -bottom-1 left-0 w-0 h-px bg-white/40 group-hover:w-full transition-all duration-500" />
                        </span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Edge Highlight (Premium touch) */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
                  className="text-white/30 hover:text-white transition-colors text-[10px] font-mono uppercase tracking-[0.15em] flex items-center gap-4 group mb-20"
                >
                  <div className="h-px w-8 bg-white/20 group-hover:w-12 transition-all" />
                  Skip Introduction
                  <div className="h-px w-8 bg-white/20 group-hover:w-12 transition-all" />
                </button>
              </div>
            </motion.div>
          ) : stage === 'origin' ? (
            /* STAGE 3: ORIGIN RETROSPECTIVE */
            <OriginStory key="origin-story" onBack={() => setStage('selection')} onOpenCaseStudy={() => setStage('casestudy')} />
          ) : stage === 'servicedesk' ? (
            /* STAGE 5: SERVICE DESK BLURB (V1.5.0) */
            <ServiceDeskSimDetails key="service-desk-details" onBack={() => setStage('selection')} />
          ) : (
             /* STAGE 4: DIGITAL CASE STUDY / BLOG (V1.5.0) */
            <CaseStudyPost key="case-study" onBack={() => setStage('origin')} />
          )}
        </AnimatePresence>

        {/* Natural Scroll Guidance (V1.3.8) */}
        <AnimatePresence>
          {stage === 'selection' && isMobile && !hasScrolled && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-50 px-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/5"
            >
              <span className="text-white/40 text-[9px] font-mono uppercase tracking-[0.3em] font-bold">Scroll to Explore</span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown size={14} className="text-azure-light" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SplashHub;
