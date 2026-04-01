import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, Info } from 'lucide-react';

const InstructionalTip = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
      className="max-w-[900px] mx-auto px-6 mt-12 mb-8"
    >
      <div className="relative group">
        {/* Glow Background Layer */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-azure/20 to-emerald-400/10 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        
        {/* Main Glass Container */}
        <div className="relative flex flex-col md:flex-row items-center gap-4 py-4 md:py-3 px-6 bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Accent Glow Strip */}
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-azure to-emerald-400" />
          
          {/* Label Section */}
          <div className="flex items-center gap-3 pr-4 border-r border-white/5 md:h-8">
            <div className="w-8 h-8 rounded-lg bg-azure/10 border border-azure/20 flex items-center justify-center">
              <Info size={14} className="text-azure-light animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90 font-mono whitespace-nowrap">
              Operational Guide
            </span>
          </div>

          {/* Message Section */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-[11px] md:text-xs font-medium text-slate-400 tracking-wide leading-relaxed">
              <span className="text-white italic">Explore the what, why and a bit of the how of my Homelab Infrastructure.</span>
              <span className="mx-3 hidden md:inline text-white/10">|</span>
              <br className="md:hidden" />
              <span className="text-azure-light font-black uppercase tracking-widest text-[9px] md:text-[10px] inline-flex items-center gap-1.5 mt-1 md:mt-0">
                <MousePointer2 size={10} className="text-emerald-400 group-hover:translate-y-1 transition-transform" />
                Scroll & 'Show Details' for deep telemetry
              </span>
            </p>
          </div>

          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:animate-shimmer" />
        </div>
      </div>
    </motion.div>
  );
};

export default InstructionalTip;
