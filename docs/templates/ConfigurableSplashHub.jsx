import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight, LucideIcon } from 'lucide-react';

/**
 * @typedef {Object} PortalCard
 * @property {string} id - Unique identifier (e.g., 'music').
 * @property {string} title - Primary card title.
 * @property {string} tagline - Monospaced uppercase tagline.
 * @property {string} description - Detailed hover text.
 * @property {string} url - Destination URL or 'homelab' to dismiss.
 * @property {string} image - Path to WebP hero image.
 * @property {string} color - Tailwind gradient string (e.g., 'from-azure-dark/90 to-blue-900/40').
 * @property {React.ReactNode} icon - Lucide icon component.
 * @property {string} tag - Small status/brand tag (e.g., 'ALL CLOUDS RUN').
 */

/**
 * ConfigurableSplashHub
 * A premium, two-stage gateway for digital ecosystems.
 * 
 * @param {Object} props
 * @param {string} props.brandName - Primary personal name (Stage 1).
 * @param {string} props.domainName - Primary domain/site name (Stage 1).
 * @param {string} props.professionalTitle - Sub-header title (Stage 1).
 * @param {PortalCard[]} props.cards - Array of 3 portal selection cards.
 * @param {string} props.primaryAccentColor - Tailwind color for highlights (e.g., 'azure').
 * @param {string} props.secondaryAccentColor - Tailwind color for glow (e.g., 'amberGold').
 */
const ConfigurableSplashHub = ({
  brandName = "Khurram Nazir",
  domainName = "khurramnazir.com",
  professionalTitle = "Infrastructure Architect & Creative Technologist",
  cards = [],
  primaryAccentColor = "azure",
  secondaryAccentColor = "amberGold"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [stage, setStage] = useState('intro');

  useEffect(() => {
    // Persistence Check
    if (localStorage.getItem('hideSplashPermanently') === 'true') return;
    if (!sessionStorage.getItem('hasSeenSplashHub')) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = (destination) => {
    sessionStorage.setItem('hasSeenSplashHub', 'true');
    if (dontShowAgain) localStorage.setItem('hideSplashPermanently', 'true');

    if (destination === 'homelab' || destination === 'dismiss') {
      setIsVisible(false);
    } else {
      setTimeout(() => {
        window.location.href = destination;
      }, 300);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="splash-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
        className="fixed inset-0 z-[100] bg-[#050505] overflow-y-auto no-scrollbar scroll-smooth antialiased font-outfit"
      >
        {/* Universal Ambient Backgrounds */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-${primaryAccentColor}/20 rounded-full blur-[140px]`} 
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-${secondaryAccentColor}/10 rounded-full blur-[160px]`} 
          />
        </div>

        {/* Dynamic Stages */}
        <div className="relative min-h-full flex flex-col items-center justify-center py-24 px-6 z-10">
          <AnimatePresence mode="wait">
            {stage === 'intro' ? (
              /* STAGE 1: BRANDING GATEWAY */
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
                    <span className={`text-[10px] font-mono font-bold text-${primaryAccentColor}-light tracking-[0.5em] uppercase mb-8 opacity-60`}>Digital Presence Portal</span>
                    
                    <h2 className="text-4xl md:text-5xl font-light tracking-[0.2em] text-white/40 mb-4 uppercase">{brandName}</h2>

                    <motion.h1 
                      animate={{ 
                        textShadow: ["0 0 20px rgba(96,165,250,0)", "0 0 20px rgba(96,165,250,0.3)", "0 0 20px rgba(96,165,250,0)"]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="text-[clamp(3rem,8.5vw,9rem)] font-extrabold tracking-tighter text-white mb-4 leading-[0.85] w-full px-4 overflow-visible whitespace-nowrap"
                    >
                      {domainName}
                    </motion.h1>
                    
                    <p className={`text-${primaryAccentColor}-light/60 text-[clamp(0.6rem,1.2vw,0.75rem)] font-mono font-bold tracking-[0.4em] uppercase mt-4 mb-12 px-6`}>
                      {professionalTitle}
                    </p>

                    <div className={`h-1 w-24 bg-gradient-to-r from-transparent via-${primaryAccentColor}/40 to-transparent rounded-full mb-12 shadow-[0_0_15px_rgba(96,165,250,0.5)]`} />
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
              /* STAGE 2: SELECTION HUB */
              <motion.div 
                key="stage-selection"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-6xl w-full"
              >
                {/* Header ... */}
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
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110" style={{ backgroundImage: `url(${card.image})` }} />
                        <div className={`absolute inset-0 bg-gradient-to-t ${card.color} transition-all duration-500 group-hover:bg-opacity-80`} />
                        <div className="absolute inset-0 p-10 flex flex-col justify-end">
                           {/* Icon & Title ... */}
                           <div className="flex items-center gap-3 text-white font-bold text-sm tracking-wide group-hover:gap-4 transition-all uppercase">
                            Launch Portal <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer Controls ... */}
                <div className="mt-24 flex flex-col items-center gap-8">
                   {/* Checkbox & Skip Logic ... */}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfigurableSplashHub;
