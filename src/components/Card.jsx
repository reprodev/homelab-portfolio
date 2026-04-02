import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = "", glowColor = "rgba(96, 165, 250, 0.2)", title }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative rounded-[20px] p-[1px] transition-all group ${className}`}
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0))`
      }}
    >
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-[20px] p-6 h-full transition-colors group-hover:bg-slate-800/60 relative overflow-hidden">
        {/* Holographic Scanline */}
        <div className="hologram-scan" />
        
        {/* Corner Brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/10 rounded-tl-lg group-hover:border-azure/40 transition-colors" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/10 rounded-tr-lg group-hover:border-azure/40 transition-colors" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/10 rounded-bl-lg group-hover:border-azure/40 transition-colors" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/10 rounded-br-lg group-hover:border-azure/40 transition-colors" />

        {title && (
          <div className="text-xl font-semibold mb-6 flex items-center gap-3 border-b border-white/5 pb-4 text-white">
            {title}
          </div>
        )}
        {children}
      </div>
      {/* Glow Effect */}
      <div 
        className="absolute -inset-2 rounded-[30px] opacity-0 group-hover:opacity-100 transition-opacity blur-2xl z-[-1]"
        style={{ backgroundColor: glowColor }}
      />
    </motion.div>
  );
};

export default Card;
