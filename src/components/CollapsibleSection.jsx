import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useSimEvent, SIM_EVENTS } from '../lib/simBus';
import { playSound } from '../lib/audio';

const CollapsibleSection = ({ children, id, layerId, title, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Accordion Focus Mode: open the target layer and close all others
  useSimEvent(SIM_EVENTS.expand, ({ id: targetId }) => {
    if (targetId === id) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  });

  const toggle = () => {
    const nextState = !isExpanded;
    playSound('click');
    setIsExpanded(nextState);
    if (nextState) {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    }
  };

  return (
    <div
      id={id}
      className={`transition-all duration-500 pt-12 -mt-12 ${
        !isExpanded
          ? 'bg-white/[0.01] hover:bg-white/[0.02] rounded-[2rem] p-6 lg:p-8 border border-white/5 my-6 hover:border-azure/20'
          : 'bg-transparent my-0'
      }`}
    >
      {/* Persistent Header */}
      <div
        onClick={toggle}
        className="flex items-center justify-between group cursor-pointer select-none py-2 hover:opacity-90 transition-all"
      >
        <div className="flex flex-col">
          {layerId && (
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-1.5">
              {layerId}
            </span>
          )}
          <h3 className={`text-xl md:text-2xl font-extralight tracking-tight text-white m-0 transition-all ${!isExpanded ? 'italic text-slate-300' : 'italic font-normal'}`}>
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-4">
          {/* Action indicator for premium interactive feel */}
          <span className="hidden md:inline-block text-[9px] font-mono text-azure-light/60 opacity-0 group-hover:opacity-100 transition-all duration-300 tracking-[0.2em] uppercase">
            {isExpanded ? '[ click to collapse layer ]' : '[ click to expand layer ]'}
          </span>

          {/* Springy chevron capsule (V5.0 showstopper pass) */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className={`p-2.5 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-105 transition-colors duration-300 ${isExpanded ? 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(0,102,204,0.3)]' : ''}`}
          >
            <ChevronDown size={18} className="text-white/60 group-hover:text-white transition-colors" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 32 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {/* Border-glow sweep across the top edge as the layer opens */}
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '100%', opacity: [0, 1, 0] }}
              transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}
              className="h-px mb-4 bg-gradient-to-r from-transparent via-azure/70 to-transparent pointer-events-none"
            />
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleSection;
