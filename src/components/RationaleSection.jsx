import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ChevronDown, Lightbulb } from 'lucide-react';

const RationaleSection = ({ title = "Architectural Rationale", children, icon: Icon = Info, color = "azure" }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const accentBorder = color === 'emerald' ? 'border-emerald-500/30' : color === 'azure' ? 'border-azure/30' : 'border-amber-500/30';
  const accentText = color === 'emerald' ? 'text-emerald-400' : color === 'azure' ? 'text-azure' : 'text-amber-400';
  const accentBg = color === 'emerald' ? 'bg-emerald-500/5' : color === 'azure' ? 'bg-azure/5' : 'bg-amber-500/5';

  return (
    <div className={`mt-8 border ${accentBorder} ${accentBg} rounded-2xl overflow-hidden transition-all duration-300`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg bg-black/40 border ${accentBorder} ${accentText} group-hover:scale-110 transition-transform`}>
            <Icon size={14} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">{title}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-slate-500 transition-transform duration-500 ${isOpen ? 'rotate-180 text-white' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="p-6 pt-2 border-t border-white/5">
              <div className="prose prose-invert prose-sm max-w-none">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RationaleSection;
