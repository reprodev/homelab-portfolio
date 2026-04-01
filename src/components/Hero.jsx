import React from 'react';
import { motion } from 'framer-motion';
import Badge from './Badge';

const Hero = () => {
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
            <motion.div variants={item} className="mb-6">
              <Badge color="success" className="animate-pulse-slow">
                <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]"></span>
                FLEET RECONCILED &copy; LIVE LAB
              </Badge>
            </motion.div>
            
            <motion.h1 variants={item} className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-4">
              Khurram <span className="gradient-text">Nazir</span>
            </motion.h1>
            
            <motion.h2 variants={item} className="text-xl md:text-2xl text-blue-300/80 font-medium mb-6">
              DevOps & Infrastructure Analyst &bull; Homelabber
            </motion.h2>
            
            <motion.p variants={item} className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl">
              Showcasing a production-grade, declarative home datacenter built <strong className="text-slate-200">almost entirely on Linux</strong>. This living portfolio demonstrates full-stack expertise in virtualization, GitOps CI/CD, and zero-trust edge networking.
            </motion.p>
          </div>

          <motion.div variants={item} className="flex flex-wrap gap-4 pt-4 lg:pt-0">
            <a href="https://github.com/reprodev" target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium">
              GitHub <span className="opacity-40 ml-1">&#8599;</span>
            </a>
            <a href="https://www.linkedin.com/in/khurram-nazir-50b6a13aa/" target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium">
              LinkedIn <span className="opacity-40 ml-1">&#8599;</span>
            </a>
            <a href="https://reprodev.com" target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium">
              Website <span className="opacity-40 ml-1">&#8599;</span>
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
