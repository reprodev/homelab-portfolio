import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Card = ({ title, children, className = "", glowColor = "rgba(59, 130, 246, 0.1)" }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        rotateX: 2, 
        rotateY: -2, 
        scale: 1.01,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      } : {}}
      viewport={{ once: true }}
      className={`relative group bg-slate-950/40 border ${isMobile ? 'border-white/[0.08]' : 'border-white/[0.03]'} p-6 rounded-3xl backdrop-blur-xl ${className}`}
      style={{
        boxShadow: `0 0 40px ${isMobile ? mobileGlow : glowColor}`,
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        backdropFilter: isMobile ? 'blur(20px)' : 'blur(24px)',
        WebkitBackdropFilter: isMobile ? 'blur(20px)' : 'blur(24px)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none rounded-3xl" />
      
      {title && (
        <h4 className={`text-sm font-mono uppercase tracking-[0.3em] ${isMobile ? 'text-white/60' : 'text-white/30'} mb-6 border-b border-white/5 pb-4`}>
          {title}
        </h4>
      )}
      
      <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
