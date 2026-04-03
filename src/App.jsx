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
import InstructionalTip from './components/InstructionalTip.jsx';
import SplashHub from './components/SplashHub.jsx';

function App() {
  return (
    <div className="min-h-screen relative selection:bg-azure/30 selection:text-white">
      <SplashHub />
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
        <InstructionalTip />
        
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
