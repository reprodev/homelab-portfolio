import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import LayerHUD from './components/LayerHUD.jsx';
import { LayoutGrid } from 'lucide-react';

function App() {
  const [showSplash, setShowSplash] = useState(null); // 'null' for the initial checking frame

  useEffect(() => {
    // Check if splash should be shown
    const isPermanentlyHidden = localStorage.getItem('hideSplashPermanently');
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplashHub');

    if (isPermanentlyHidden === 'true' || hasSeenSplash === 'true') {
      setShowSplash(false);
    } else {
      setShowSplash(true);
    }
  }, []);

  // Avoid FOUC (flash of unstyled content) or dashboard flicker
  if (showSplash === null) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-white/20 text-[11px] md:text-sm font-mono uppercase tracking-[0.6em] animate-pulse">
        Infrastructure Initializing...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative selection:bg-azure/30 selection:text-white bg-[#0a0a0a] overflow-x-hidden">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashHub key="splash-hub" onDismiss={() => setShowSplash(false)} />
        ) : (
          <motion.div 
            key="dashboard-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col min-h-screen"
          >
            {/* Texture Overlay */}
            <div className="noise-overlay" />

            {/* Moving Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-azure/10 rounded-full blur-[120px] animate-float" />
              <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] animate-float animation-delay-2000" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amberGold/5 rounded-full blur-[100px] animate-float animation-delay-4000" />
            </div>

            {/* Nav HUD & Portal Switcher */}
            <LayerHUD />
            
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.5 }}
              onClick={() => setShowSplash(true)}
              className="fixed top-6 right-6 z-[70] p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl group hover:bg-white/10 transition-all hover:scale-105 active:scale-95 shadow-2xl"
              title="Return to Digital Ecosystem Portal"
            >
              <LayoutGrid size={24} className="text-azure-light group-hover:rotate-90 transition-transform duration-500" />
            </motion.button>

            {/* Main Content Container */}
            <div className="relative z-10 w-full">
              <Hero />
              <InstructionalTip />
              
              <main className="max-w-[1300px] mx-auto px-6 py-12 space-y-12">
                <CollapsibleSection id="layer-1" layerId="Layer 1" title="Edge & Auth Ingress" defaultExpanded={true}>
                  <NetworkLayer />
                </CollapsibleSection>

                <CollapsibleSection id="layer-2" layerId="Layer 2" title="Hardware Infrastructure">
                  <HardwareLayer />
                </CollapsibleSection>

                <CollapsibleSection id="layer-3" layerId="Layer 3" title="Logical Orchestration">
                  <LogicalLayer />
                </CollapsibleSection>

                <CollapsibleSection id="layer-dr" layerId="Layer 3.5" title="Disaster Recovery">
                  <DRPipeline />
                </CollapsibleSection>

                <CollapsibleSection id="layer-4" layerId="Layer 4" title="Distributed Workloads">
                  <WorkloadLayer />
                </CollapsibleSection>

                <KnowledgeLayer />
              </main>

              <footer className="py-24 border-t border-white/5 text-center px-6">
                <p className="text-white font-bold tracking-tight mb-3 text-sm md:text-base">
                  Khurram Nazir &copy; 2026
                </p>
                <p className="text-slate-400 text-[11px] md:text-xs uppercase tracking-widest font-medium">
                  Built with <span className="text-azure-light">React</span> & <span className="text-emerald-400">Tailwind CSS</span> • Infrastructure Visualizer
                </p>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
