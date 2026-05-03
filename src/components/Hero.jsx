import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from './Badge';
import { Github, Linkedin, Globe, ExternalLink, Terminal } from 'lucide-react';

const Hero = () => {
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [bootLog, setBootLog] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  
  const bootSequence = [
    "[INIT] SECURE_HANDSHAKE_COMPLETE...",
    "[LAYER] EDGE_INGRESS_VERIFIED (CLOUDFLARE_TUNNEL)",
    "[AUTH] KHURRAM_NAZIR_IDENTITY_CONFIRMED",
    "[SYSLOG] FLEET_RECONCILED: 100% OPERATIONAL",
    "--- SYSTEM_READY ---"
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Check if user has permanently dismissed splash
    const isPermanentlyHidden = localStorage.getItem('hideSplashPermanently');
    if (isPermanentlyHidden === 'true') {
      setIsReturningUser(true);
    }

    // Small terminal sequence for "Enter Dashboard" feel
    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < bootSequence.length) {
        setBootLog(bootSequence[logIndex]);
        logIndex++;
      } else {
        clearInterval(interval);
      }
    }, isMobile ? 600 : 800);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <header className="py-16 md:py-24 border-b border-white/[0.03]">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-[1300px] mx-auto px-6"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
          <div className="max-w-3xl">
            <motion.div variants={item} className="flex flex-wrap items-center gap-4 mb-6">
              <Badge color="success" className="animate-pulse-slow">
                <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]"></span>
                FLEET RECONCILED &copy; LIVE LAB
              </Badge>
              
              {isReturningUser && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`px-4 py-1.5 rounded-full bg-azure/10 border border-azure/20 text-azure-light text-[10px] font-mono font-bold tracking-[0.2em] uppercase ${isMobile ? 'opacity-90' : ''}`}
                >
                  Welcome Back, Khurram 🔐
                </motion.div>
              )}
            </motion.div>
            
            <motion.h1 variants={item} className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight mb-4">
              <span className="bg-gradient-to-r from-azure-light via-white to-amberGold bg-clip-text text-transparent">
                Khurram Nazir
              </span>
            </motion.h1>
            
            <motion.div variants={item} className="h-0.5 w-24 bg-gradient-to-r from-azure to-amberGold mb-6 opacity-50" />

            <motion.h2 variants={item} className={`text-xl md:text-2xl ${isMobile ? 'text-blue-200/90' : 'text-blue-200/60'} font-mono uppercase tracking-[0.2em] mb-8 leading-relaxed`}>
              IT Professional and Creative Technologist
            </motion.h2>

            <AnimatePresence mode="wait">
              {bootLog && (
                <motion.div 
                  key={bootLog}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-center gap-3 text-[10px] font-mono ${isMobile ? 'text-emerald-500/85' : 'text-emerald-500/60'} uppercase tracking-[0.3em] mb-8 bg-emerald-500/5 px-4 py-2 rounded-lg border border-emerald-500/10 w-fit`}
                >
                  <Terminal size={12} className="animate-pulse" />
                  {bootLog}
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.p variants={item} className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl">
              Showcasing a production-grade, declarative home datacenter built <strong className="text-slate-200">almost entirely on Linux</strong>. This living portfolio demonstrates full-stack expertise in virtualization, GitOps CI/CD, and zero-trust edge networking.
            </motion.p>
          </div>

          <motion.div variants={item} className="flex flex-wrap gap-4 pt-4 lg:pt-0">
            <a href="https://github.com/reprodev" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium group text-white">
              <Github size={18} className="text-slate-400 group-hover:text-white transition-colors" />
              GitHub 
              <ExternalLink size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="https://www.linkedin.com/in/khurram-nazir-50b6a13aa/" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium group text-white">
              <Linkedin size={18} className="text-[#0077B5] group-hover:text-[#00A0DC] transition-colors" />
              LinkedIn 
              <ExternalLink size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="https://reprodev.com" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium group text-white">
              <Globe size={18} className="text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              Website 
              <ExternalLink size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>
          </motion.div>
        </div>

        <motion.div variants={item} className="mt-12 flex flex-wrap gap-3">
          {["Linux Ecosystem", "Terraform Core", "Kubernetes (K3s)", "Ansible Automation", "Proxmox Bare-metal", "Zero Trust Edge"].map((skill) => (
            <span key={skill} className="px-4 py-2 bg-black/40 border border-azure/30 rounded-lg text-azure-light text-xs font-mono">
              {skill}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </header>
  );
};

export default Hero;
