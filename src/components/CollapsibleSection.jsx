import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useSimEvent, SIM_EVENTS } from '../lib/simBus';
import { playSound } from '../lib/audio';
import StageTitle from './StageTitle.jsx';

/*
  V6: a stage is now header → always-visible `summary` (the StageBento) → body.
  The body keeps the old contract exactly: it only exists while expanded
  (collapsed children unmount — sims rely on that for teardown), and the
  `homelab-expand` bus opens one section and closes the rest.

  `compact` is for the three Run sub-sections, which sit under one shared stage
  header and bento, so they get a smaller header with no numeral or Proves line.
*/
const CollapsibleSection = ({
  children, id, layerId, title, num, proves, summary, compact = false, defaultExpanded = false,
}) => {
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
      className={`scroll-mt-6 transition-colors duration-500 rounded-[2rem] border ${
        compact ? 'p-4 lg:p-6' : 'p-5 lg:p-8'
      } ${
        isExpanded
          ? 'bg-white/[0.015] border-white/10'
          : 'bg-white/[0.01] hover:bg-white/[0.02] border-white/5 hover:border-azure/20'
      }`}
    >
      {/* Persistent Header.
          Kept as a div rather than a <button> because it contains an <h3>, which
          is invalid button content. Given the explicit button semantics instead —
          before V5.4 these seven section headers were mouse-only. */}
      <div
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); // Space would otherwise scroll the page
            toggle();
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        /* Only reference the region while it exists — AnimatePresence unmounts it
           when collapsed, so an unconditional aria-controls is a dangling IDREF. */
        aria-controls={isExpanded ? `${id}-content` : undefined}
        className="flex items-start justify-between gap-4 group cursor-pointer select-none rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
      >
        <StageTitle
          num={num}
          eyebrow={layerId}
          title={title}
          proves={proves}
          compact={compact}
          muted={!isExpanded}
        />

        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden md:inline-block text-tag font-mono font-black text-azure-light/80 tracking-[0.2em] uppercase group-hover:text-white transition-colors">
            {isExpanded ? 'Close' : 'Explore'}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className={`flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 group-hover:border-azure/40 transition-colors duration-300 ${isExpanded ? 'bg-white/10 border-white/20' : ''}`}
          >
            <ChevronDown size={18} className="text-white/60 group-hover:text-white transition-colors" />
          </motion.div>
        </div>
      </div>

      {summary}

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={`${id}-content`}
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
