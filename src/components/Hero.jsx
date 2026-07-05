import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from './Badge';
import { Github, Linkedin, Globe, ExternalLink, Terminal, Play } from 'lucide-react';
import { TOUR_START_EVENT } from '../lib/tourScript';
import { playSound } from '../lib/audio';
import useIsMobile from '../hooks/useIsMobile';

const BOOT_SEQUENCE = [
  "[INIT] SECURE_HANDSHAKE_COMPLETE...",
  "[LAYER] EDGE_INGRESS_VERIFIED (CLOUDFLARE_TUNNEL)",
  "[AUTH] KHURRAM_NAZIR_IDENTITY_CONFIRMED",
  "[SYSLOG] FLEET_RECONCILED: 100% OPERATIONAL",
  "--- SYSTEM_READY ---"
];

const Hero = () => {
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [bootLog, setBootLog] = useState("");
  const isMobile = useIsMobile(768);

  useEffect(() => {
    // Check if user has permanently dismissed splash
    const isPermanentlyHidden = localStorage.getItem('hideSplashPermanently');
    if (isPermanentlyHidden === 'true') {
      setIsReturningUser(true);
    }

    // Small terminal sequence for "Enter Dashboard" feel.
    // Runs once on mount (cadence fixed at start) so a mid-play isMobile flip
    // never restarts the sequence.
    const cadence = window.innerWidth < 768 ? 600 : 800;
    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < BOOT_SEQUENCE.length) {
        setBootLog(BOOT_SEQUENCE[logIndex]);
        logIndex++;
      } else {
        clearInterval(interval);
      }
    }, cadence);

    return () => clearInterval(interval);
  }, []);

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
              <span className="bg-gradient-to-r from-azure-light via-white to-amberGold bg-clip-text text-transparent gradient-shimmer">
                Khurram Nazir
              </span>
            </motion.h1>
            
            <motion.div variants={item} className="h-0.5 w-24 bg-gradient-to-r from-azure to-amberGold mb-6 opacity-50" />

            <motion.h2 variants={item} className={`text-xl md:text-2xl ${isMobile ? 'text-blue-200/95' : 'text-blue-200/90'} font-mono uppercase tracking-[0.2em] mb-8 leading-relaxed drop-shadow-[0_0_8px_rgba(96,165,250,0.2)]`}>
              IT Professional and Creative Technologist
            </motion.h2>
 
            <AnimatePresence mode="wait">
              {bootLog && (
                <motion.div 
                  key={bootLog}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-center gap-3 text-[10px] font-mono ${isMobile ? 'text-emerald-400' : 'text-emerald-400/90'} uppercase tracking-[0.3em] mb-8 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20 w-fit drop-shadow-[0_0_8px_rgba(52,211,153,0.2)]`}
                >
                  <Terminal size={12} className="animate-pulse" />
                  {bootLog}
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.p variants={item} className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
              Showcasing a production-grade, declarative home datacenter built <strong className="text-white font-extrabold drop-shadow-[0_0_6px_rgba(255,255,255,0.15)]">almost entirely on Linux</strong>. This living portfolio demonstrates full-stack expertise in virtualization, GitOps CI/CD, and zero-trust edge networking.
            </motion.p>

            <motion.div variants={item} className="mt-8">
              <button
                onClick={() => {
                  playSound('click');
                  window.dispatchEvent(new CustomEvent(TOUR_START_EVENT));
                }}
                aria-label="Play a guided cinematic tour of the infrastructure"
                className="group relative inline-flex items-center gap-3 pl-4 pr-6 py-3.5 rounded-2xl bg-gradient-to-r from-azure-dark/40 to-azure/20 border border-azure/40 text-white font-bold tracking-tight hover:border-azure/70 hover:shadow-[0_0_30px_rgba(96,165,250,0.3)] transition-all active:scale-95"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-azure/30 text-azure-light group-hover:bg-azure/50 group-hover:text-white transition-colors">
                  <Play size={16} fill="currentColor" className="ml-0.5" />
                </span>
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-[9px] font-mono font-black uppercase tracking-[0.25em] text-azure-light/80">Auto Demo</span>
                  <span className="text-sm">Play Guided Tour</span>
                </span>
              </button>
            </motion.div>
          </div>
 
          <motion.div variants={item} className="flex flex-wrap gap-4 pt-4 lg:pt-0">
            <a 
              href="https://github.com/reprodev" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="Visit Khurram Nazir's GitHub Profile"
              onClick={() => playSound('click')}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium group text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            >
              <Github size={18} className="text-slate-400 group-hover:text-white transition-colors" />
              GitHub 
              <ExternalLink size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>
            <a 
              href="https://www.linkedin.com/in/khurram-nazir-50b6a13aa/" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="Visit Khurram Nazir's LinkedIn Profile"
              onClick={() => playSound('click')}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium group text-white hover:shadow-[0_0_15px_rgba(0,119,181,0.1)]"
            >
              <Linkedin size={18} className="text-[#0077B5] group-hover:text-[#00A0DC] transition-colors" />
              LinkedIn 
              <ExternalLink size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>
            <a 
              href="https://reprodev.com" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="Visit Khurram Nazir's Developer Website"
              onClick={() => playSound('click')}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-azure/30 transition-all text-sm font-medium group text-white hover:shadow-[0_0_15px_rgba(96,165,250,0.15)]"
            >
              <Globe size={18} className="text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              Website 
              <ExternalLink size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>
          </motion.div>
        </div>
 
        <motion.div variants={item} className="mt-12 flex flex-wrap gap-3">
          {["Linux Ecosystem", "Terraform Core", "Kubernetes (K3s)", "Ansible Automation", "Proxmox Bare-metal", "Zero Trust Edge"].map((skill) => (
            <span 
              key={skill} 
              onMouseEnter={() => playSound('click')}
              className="px-4 py-2 bg-black/50 border border-azure/30 hover:border-azure/60 hover:bg-azure/10 rounded-lg text-azure-light text-xs font-mono transition-all hover:scale-105 duration-300 cursor-default hover:shadow-[0_0_15px_rgba(96,165,250,0.25)]"
            >
              {skill}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </header>
  );
};

export default Hero;
