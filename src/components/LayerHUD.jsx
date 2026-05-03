import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Database, Cpu, Repeat, LayoutGrid, Menu, X } from 'lucide-react';

const LayerHUD = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sections = [
    { id: 'layer-1', icon: <Shield size={18} />, label: 'Edge & Ingress' },
    { id: 'layer-2', icon: <Database size={18} />, label: 'Hardware' },
    { id: 'layer-3', icon: <Cpu size={18} />, label: 'Logical' },
    { id: 'layer-dr', icon: <Repeat size={18} />, label: 'Disaster Recovery' },
    { id: 'layer-4', icon: <LayoutGrid size={18} />, label: 'Workloads' },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (isMobile) setIsOpen(false);
  };

  const hudVariants = {
    hidden: { x: 100, opacity: 0 },
    show: { x: 0, opacity: 1 },
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={hudVariants}
      transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[60]"
    >
      <div className="flex flex-col-reverse lg:flex-col gap-3 p-2.5 lg:p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
        <button
          onClick={() => isMobile ? setIsOpen(!isOpen) : null}
          className={`flex items-center justify-center p-3 rounded-xl bg-azure/20 border border-azure/30 text-white lg:hidden transition-all active:scale-90`}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="hidden lg:block text-[8px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] text-center mb-1">
          NAV_HUD
        </div>
        
        <AnimatePresence>
          {(isOpen || !isMobile) && (
            <motion.div 
              initial={isMobile ? { height: 0, opacity: 0, marginBottom: 0 } : {}}
              animate={isMobile ? { height: 'auto', opacity: 1, marginBottom: 12 } : {}}
              exit={isMobile ? { height: 0, opacity: 0, marginBottom: 0 } : {}}
              className="flex flex-col gap-3 overflow-hidden"
            >
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="group relative flex items-center justify-center p-3.5 lg:p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-azure/20 hover:border-azure/30 transition-all active:scale-90 text-slate-400 hover:text-white"
                >
                  {section.icon}
                  
                  {/* Label (Desktop Tooltip / Mobile Inline) */}
                  <div className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-black/80 border border-white/10 text-white text-[10px] font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden lg:block">
                    {section.label}
                  </div>
                  
                  {isMobile && (
                    <span className="absolute right-full mr-4 text-[9px] font-mono font-bold text-azure-light/60 uppercase tracking-widest pointer-events-none whitespace-nowrap">
                      {section.label}
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LayerHUD;
