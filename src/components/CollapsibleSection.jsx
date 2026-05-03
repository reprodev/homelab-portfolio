import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const CollapsibleSection = ({ children, id, layerId, title, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggle = () => {
    if (isMobile) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div id={id} className={`transition-all duration-700 pt-12 -mt-12 ${isMobile && !isExpanded ? 'bg-white/[0.02] rounded-3xl p-4' : ''}`}>
      {/* Persistant Header */}
      <div 
        onClick={toggle}
        className={`flex items-center justify-between group cursor-pointer select-none py-2 ${isMobile ? 'opacity-100' : 'opacity-100 mb-8 pointer-events-none'}`}
      >
        <div className="flex flex-col">
          {layerId && (
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-1">
              {layerId}
            </span>
          )}
          <h3 className={`text-2xl md:text-3xl font-extralight tracking-tight text-white m-0 transition-all ${isMobile && !isExpanded ? 'text-lg italic text-slate-300' : 'italic'}`}>
            {title}
          </h3>
        </div>
        
        {isMobile && (
          <div className={`p-2 rounded-full bg-white/5 border border-white/10 transition-transform duration-500 ${isExpanded ? 'rotate-180 bg-white/10 border-white/20 shadow-glow' : ''}`}>
            <ChevronDown size={18} className="text-white/60" />
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {(!isMobile || isExpanded) && (
          <motion.div
            initial={isMobile ? { height: 0, opacity: 0, marginTop: 0 } : false}
            animate={{ height: "auto", opacity: 1, marginTop: isMobile ? 24 : 0 }}
            exit={isMobile ? { height: 0, opacity: 0, marginTop: 0 } : false}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleSection;
