import React from 'react';
import { motion } from 'framer-motion';
import Hero from './components/Hero.jsx';
import NetworkLayer from './components/NetworkLayer.jsx';
import HardwareLayer from './components/HardwareLayer.jsx';
import LogicalLayer from './components/LogicalLayer.jsx';
import WorkloadLayer from './components/WorkloadLayer.jsx';
import DRPipeline from './components/DRPipeline.jsx';
import KnowledgeLayer from './components/KnowledgeLayer.jsx';
import CollapsibleSection from './components/CollapsibleSection.jsx';

function App() {
  return (
    <div className="min-h-screen relative selection:bg-azure/30 selection:text-white">
      {/* Texture Overlay */}
      <div className="noise-overlay" />

      {/* Moving Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-azure/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] animate-float animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amberGold/5 rounded-full blur-[100px] animate-float animation-delay-4000" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10">
        <Hero />
        {/* Instructional Tip for Mobile/Standard Users */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-[1300px] mx-auto px-6 mt-12 mb-4"
        >
          <div className="flex items-center gap-4 py-4 px-5 bg-azure/5 border border-azure/20 rounded-2xl md:rounded-full">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-azure animate-pulse shadow-[0_0_8px_#3b82f6]" />
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 leading-relaxed md:leading-none">
              Interactive Dashboard: <span className="text-white italic">Explore the what, why and a bit of the how of my Homelab Infrastructure. <span className="hidden sm:inline">|</span> <span className="text-azure-light font-black underline-offset-4 decoration-azure/40">Scroll down and 'Show Details' for more information.</span></span>
            </p>
          </div>
        </motion.div>
        
        <main className="max-w-[1300px] mx-auto px-6 py-12 space-y-12">
          <CollapsibleSection layerId="Layer 1" title="Edge & Auth Ingress" defaultExpanded={true}>
            <NetworkLayer />
          </CollapsibleSection>

          <CollapsibleSection layerId="Layer 2" title="Hardware Infrastructure">
            <HardwareLayer />
          </CollapsibleSection>

          <CollapsibleSection layerId="Layer 3" title="Logical Orchestration">
            <LogicalLayer />
          </CollapsibleSection>

          <CollapsibleSection layerId="Layer 3.5" title="Disaster Recovery">
            <DRPipeline />
          </CollapsibleSection>

          <CollapsibleSection layerId="Layer 4" title="Distributed Workloads">
            <WorkloadLayer />
          </CollapsibleSection>

          <KnowledgeLayer />
        </main>

        <footer className="py-12 border-t border-white/5 text-center">
          <p className="text-white font-bold tracking-tight mb-2">
            Khurram Nazir &copy; 2026
          </p>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-medium">
            Built with <span className="text-azure-light">React</span> & <span className="text-emerald-400">Tailwind CSS</span> • Optimized for <span className="text-amberGold">Mobile-First</span> Infrastructure Viz
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
