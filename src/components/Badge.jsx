import React from 'react';

const Badge = ({ children, color = "azure", variant = "filled", className = "" }) => {
  const baseClasses = "px-3.5 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2 border transition-all duration-300";
  
  const colors = {
    azure: {
      filled: "bg-azure/5 border-azure/20 text-azure shadow-[0_0_15px_rgba(96,165,250,0.1)]",
      outline: "bg-transparent border-azure/30 text-azure"
    },
    amber: {
      filled: "bg-amberGold/5 border-amberGold/20 text-amberGold shadow-[0_0_15px_rgba(251,191,36,0.1)]",
      outline: "bg-transparent border-amberGold/30 text-amberGold"
    },
    success: {
      filled: "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
      outline: "bg-transparent border-emerald-500/30 text-emerald-400"
    },
    danger: {
      filled: "bg-rose-500/5 border-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
      outline: "bg-transparent border-rose-500/30 text-rose-400"
    },
    muted: {
      filled: "bg-white/5 border-white/10 text-slate-400",
      outline: "bg-transparent border-white/10 text-slate-400"
    }
  };

  const selectedColor = colors[color] || colors.azure;
  const selectedVariant = selectedColor[variant] || selectedColor.filled;

  return (
    <span className={`${baseClasses} ${selectedVariant} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
