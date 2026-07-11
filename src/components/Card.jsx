import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useIsMobile from '../hooks/useIsMobile';

const Card = ({ title, children, className = "", glowColor = "rgba(59, 130, 246, 0.1)" }) => {
  const isMobile = useIsMobile(1024);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Cleanly replace only the last numeric group (alpha) to ensure mobile glow efficiency
  const mobileGlow = glowColor.includes('rgba') 
    ? glowColor.replace(/[\d.]+\)$/g, '0.05)') 
    : glowColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isMobile ? { 
        rotateX: 1.5, 
        rotateY: -1.5, 
        scale: 1.005,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      } : {}}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCoords({ x: 0, y: 0 });
      }}
      viewport={{ once: true }}
      className={`relative group bg-slate-950/40 border ${isMobile ? 'border-white/[0.08]' : 'border-white/[0.03]'} p-6 rounded-3xl backdrop-blur-xl ${className} overflow-hidden`}
      style={{
        boxShadow: `0 0 40px ${isMobile ? mobileGlow : glowColor}`,
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        backdropFilter: isMobile ? 'blur(20px)' : 'blur(24px)',
        WebkitBackdropFilter: isMobile ? 'blur(20px)' : 'blur(24px)'
      }}
    >
      {/* Texture Overlay inside the card */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none rounded-3xl z-0" />
      
      {/* Vercel-style Spotlight Cursor Hover Borders (Disabled on mobile to save performance) */}
      {!isMobile && isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500 rounded-3xl"
          style={{
            background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(255,255,255,0.06), transparent 75%)`,
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        />
      )}
      
      {title && (
        <h4 className={`text-xs font-mono uppercase tracking-[0.3em] ${isMobile ? 'text-white/60' : 'text-white/30'} mb-6 border-b border-white/5 pb-4 relative z-10`}>
          {title}
        </h4>
      )}
      
      <div className="relative z-10" style={{ transform: 'translateZ(10px)' }}>
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
