import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import Hero from './components/Hero.jsx';
import NetworkLayer from './components/NetworkLayer.jsx';
import HardwareLayer from './components/HardwareLayer.jsx';
import LogicalLayer from './components/LogicalLayer.jsx';
import WorkloadLayer from './components/WorkloadLayer.jsx';
import DRPipeline from './components/DRPipeline.jsx';
import KnowledgeLayer from './components/KnowledgeLayer.jsx';
import JourneyLayer from './components/JourneyLayer.jsx';
import CollapsibleSection from './components/CollapsibleSection.jsx';
import InstructionalTip from './components/InstructionalTip.jsx';
import LayerHUD from './components/LayerHUD.jsx';
import GuidedTour from './components/GuidedTour.jsx';
import { LayoutGrid, Network } from 'lucide-react';
import { useSimEvent, SIM_EVENTS } from './lib/simBus.js';
import Reveal from './components/Reveal.jsx';

const SplashHub = React.lazy(() => import('./components/SplashHub.jsx'));
const Topology3D = React.lazy(() => import('./components/Topology3D.jsx'));

// Cockpit stat that springs toward each new telemetry value instead of
// snapping — the count-up sells the "live instrument" feel.
const AnimatedStat = ({ value, decimals = 0 }) => {
  const spring = useSpring(value, { stiffness: 90, damping: 22 });
  const display = useTransform(spring, (v) => v.toFixed(decimals));
  useEffect(() => { spring.set(value); }, [value, spring]);
  return <motion.span>{display}</motion.span>;
};

// Mounts its children only once they scroll near the viewport, so the heavy
// WebGL topology chunk never costs first paint.
const LazyInView = ({ children, className, rootMargin = '300px' }) => {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const node = ref.current;
    if (!node || visible) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [visible, rootMargin]);
  return <div ref={ref} className={className}>{visible ? children : null}</div>;
};

function App() {
  const [showSplash, setShowSplash] = useState(null); // 'null' for the initial checking frame
  const [ambientTheme, setAmbientTheme] = useState('default');
  const [ddosActive, setDdosActive] = useState(false);
  const [drActive, setDrActive] = useState(false);
  const [vitals, setVitals] = useState({ watts: 92, temp: 42.7 });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Check if splash should be shown
    const isPermanentlyHidden = localStorage.getItem('hideSplashPermanently');

    if (isPermanentlyHidden === 'true') {
      setShowSplash(false);
    } else {
      setShowSplash(true);
    }
  }, []);

  // Prevent background scrolling while splash is active, and reset scroll to top on dismissal
  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = 'hidden';
    } else if (showSplash === false) {
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSplash]);

  // Global simulation bus: drive the cockpit HUD + ambient orb theme from events
  // dispatched anywhere on the page (now wired via src/lib/simBus.js).
  useSimEvent(SIM_EVENTS.ddos, ({ active }) => {
    setDdosActive(active);
    setAmbientTheme(active ? 'ddos' : 'default');
  });
  useSimEvent(SIM_EVENTS.dr, ({ step }) => {
    const active = step > 0 && step < 4;
    setDrActive(active);
    setAmbientTheme(active ? 'dr' : 'default');
  });

  // Cockpit telemetry jitter — a real interval (paused when the tab is hidden)
  // so the "live" watts/temp readings genuinely tick instead of only re-rolling
  // on unrelated re-renders.
  useEffect(() => {
    const roll = () => {
      if (document.hidden) return;
      setVitals(
        ddosActive
          ? { watts: Math.floor(184 + Math.random() * 8), temp: +(58.2 + Math.random() * 1.5).toFixed(1) }
          : drActive
            ? { watts: Math.floor(118 + Math.random() * 5), temp: +(48.1 + Math.random() * 0.8).toFixed(1) }
            : { watts: Math.floor(91 + Math.random() * 4), temp: +(42.5 + Math.random() * 0.4).toFixed(1) }
      );
    };
    roll();
    const interval = setInterval(roll, 2000);
    return () => clearInterval(interval);
  }, [ddosActive, drActive]);

  // Avoid FOUC (flash of unstyled content) or dashboard flicker
  if (showSplash === null) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-white/20 text-[11px] md:text-sm font-mono uppercase tracking-[0.6em] animate-pulse">
        Infrastructure Initializing...
      </div>
    </div>
  );

  const getOrbColors = () => {
    switch (ambientTheme) {
      case 'ddos':
        return {
          orb1: 'bg-red-600/35 shadow-[0_0_150px_rgba(220,38,38,0.35)]',
          orb2: 'bg-red-500/30 shadow-[0_0_180px_rgba(239,68,68,0.3)]',
          orb3: 'bg-rose-700/25 shadow-[0_0_120px_rgba(190,24,74,0.2)]'
        };
      case 'dr':
        return {
          orb1: 'bg-amber-600/35 shadow-[0_0_150px_rgba(217,119,6,0.35)]',
          orb2: 'bg-yellow-500/30 shadow-[0_0_180px_rgba(234,179,8,0.3)]',
          orb3: 'bg-orange-600/25 shadow-[0_0_120px_rgba(234,88,12,0.2)]'
        };
      case 'layer-1':
        return {
          orb1: 'bg-azure/30 shadow-[0_0_150px_rgba(0,102,204,0.25)]',
          orb2: 'bg-blue-600/20 shadow-[0_0_180px_rgba(37,99,235,0.2)]',
          orb3: 'bg-[#00f0ff]/15 shadow-[0_0_120px_rgba(0,240,255,0.1)]'
        };
      case 'layer-2':
        return {
          orb1: 'bg-[#E57000]/30 shadow-[0_0_150px_rgba(229,112,0,0.25)]',
          orb2: 'bg-amber-600/20 shadow-[0_0_180px_rgba(217,119,6,0.2)]',
          orb3: 'bg-slate-700/20 shadow-[0_0_120px_rgba(71,85,105,0.1)]'
        };
      case 'layer-3':
        return {
          orb1: 'bg-emerald-500/30 shadow-[0_0_150px_rgba(16,185,129,0.25)]',
          orb2: 'bg-green-600/20 shadow-[0_0_180px_rgba(22,163,74,0.2)]',
          orb3: 'bg-teal-500/15 shadow-[0_0_120px_rgba(20,184,166,0.1)]'
        };
      case 'layer-dr':
        return {
          orb1: 'bg-amber-500/30 shadow-[0_0_150px_rgba(245,158,11,0.25)]',
          orb2: 'bg-yellow-600/20 shadow-[0_0_180px_rgba(202,138,4,0.2)]',
          orb3: 'bg-orange-500/15 shadow-[0_0_120px_rgba(249,115,22,0.1)]'
        };
      case 'layer-4':
        return {
          orb1: 'bg-[#EBA000]/30 shadow-[0_0_150px_rgba(235,160,0,0.25)]',
          orb2: 'bg-purple-600/20 shadow-[0_0_180px_rgba(147,51,234,0.2)]',
          orb3: 'bg-[#2496ED]/20 shadow-[0_0_120px_rgba(36,150,237,0.1)]'
        };
      default:
        return {
          orb1: 'bg-azure/20 shadow-[0_0_150px_rgba(0,102,204,0.18)]',
          orb2: 'bg-emerald-500/12 shadow-[0_0_180px_rgba(16,185,129,0.12)]',
          orb3: 'bg-amberGold/12 shadow-[0_0_150px_rgba(251,191,36,0.12)]'
        };
    }
  };



  const orbs = getOrbColors();

  return (
    <div className="min-h-screen relative selection:bg-azure/30 selection:text-white bg-[#050505] overflow-x-hidden">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <Suspense fallback={
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
              <div className="text-white/20 text-[10px] md:text-xs font-mono uppercase tracking-[0.6em] animate-pulse">
                Establishing Quantum Connection...
              </div>
            </div>
          }>
            <SplashHub key="splash-hub" onDismiss={() => setShowSplash(false)} />
          </Suspense>
        ) : (
          <motion.div 
            key="dashboard-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col min-h-screen blueprint-dots"
          >
            {/* High-Precision Scroll Progress Indicator */}
            <motion.div 
              className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-azure via-white to-amberGold origin-[0%] z-50 pointer-events-none shadow-[0_0_8px_rgba(0,102,204,0.5)]"
              style={{ scaleX }}
            />

            {/* Texture Overlay */}
            <div className="noise-overlay" />

            {/* Moving Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] animate-float transition-all duration-1000 ${orbs.orb1}`} />
              <div className={`absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[140px] animate-float animation-delay-2000 transition-all duration-1000 ${orbs.orb2}`} />
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] animate-float animation-delay-4000 transition-all duration-1000 ${orbs.orb3}`} />
            </div>

            {/* Nav HUD & Portal Switcher */}
            <LayerHUD />

            {/* Guided cinematic auto-tour controller */}
            <GuidedTour />
            
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.5 }}
              onClick={() => {
                localStorage.removeItem('hideSplashPermanently');
                setShowSplash(true);
              }}
              className="fixed top-6 right-6 z-[70] p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl group hover:bg-white/10 transition-all hover:scale-105 active:scale-95 shadow-2xl"
              title="Return to Digital Ecosystem Portal"
              aria-label="Return to Digital Ecosystem Portal"
            >
              <LayoutGrid size={24} className="text-azure-light group-hover:rotate-90 transition-transform duration-500" />
            </motion.button>

            {/* Main Content Container */}
            <div className="relative z-10 w-full">
              <Hero />
              
              {/* Global Infrastructure Status Cockpit HUD */}
              <div className="max-w-[1300px] mx-auto px-6 mt-6 relative z-30">
                <div className="p-4 bg-slate-950/75 backdrop-blur-xl border border-white/10 rounded-3xl grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-[10px] shadow-2xl relative overflow-hidden blueprint-dots">
                  {/* Sonar sweep style border indicator */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-azure/50 to-transparent" />
                  
                  {/* Node Status Indicator */}
                  <div className="flex flex-col gap-1.5 items-start text-left pl-3 border-l border-white/10 md:border-l-0">
                    <span className="text-slate-400 font-extrabold uppercase text-[8px] tracking-wider leading-none">Cluster Node Status</span>
                    <span className={`text-[11px] font-black italic flex items-center gap-1.5 ${drActive ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] animate-pulse' : 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'}`}>
                      <span className={`w-2 h-2 rounded-full ${drActive ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                      {drActive ? 'RECONCILING (1/6 OUTAGE)' : '6/6 HOSTS ONLINE'}
                    </span>
                  </div>
 
                  {/* Ingress Shield */}
                  <div className="flex flex-col gap-1.5 items-start text-left pl-3 border-l border-white/10">
                    <span className="text-slate-400 font-extrabold uppercase text-[8px] tracking-wider leading-none">Edge Security Ingress</span>
                    <span className={`text-[11px] font-black italic flex items-center gap-1.5 ${ddosActive ? 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse' : 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'}`}>
                      <span className={`w-2 h-2 rounded-full ${ddosActive ? 'bg-red-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                      {ddosActive ? 'MITIGATING ATTACK' : 'SHIELD SECURE'}
                    </span>
                  </div>
 
                  {/* Power Draw Indicator */}
                  <div className="flex flex-col gap-1.5 items-start text-left pl-3 border-l border-white/10">
                    <span className="text-slate-400 font-extrabold uppercase text-[8px] tracking-wider leading-none">Fleet Power Draw</span>
                    <span className="text-white text-[11px] font-black italic flex items-baseline gap-1">
                      <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                        <AnimatedStat value={vitals.watts} />
                      </span>
                      <span className="text-[8px] text-slate-400 font-normal uppercase">Watts</span>
                    </span>
                  </div>
 
                  {/* Heat core temp */}
                  <div className="flex flex-col gap-1.5 items-start text-left pl-3 border-l border-white/10">
                    <span className="text-slate-400 font-extrabold uppercase text-[8px] tracking-wider leading-none">CPU Thermal Core</span>
                    <span className="text-white text-[11px] font-black italic flex items-baseline gap-1">
                      <span className={ddosActive ? 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]' : drActive ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]' : 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]'}>
                        <AnimatedStat value={vitals.temp} decimals={1} />
                      </span>
                      <span className="text-[8px] text-slate-400 font-normal uppercase">°C</span>
                    </span>
                  </div>
                </div>
              </div>

              <InstructionalTip />
              
              <main className="max-w-[1300px] mx-auto px-6 py-12 space-y-12">
                {/* Live 3D Infrastructure Topology — the WebGL centerpiece */}
                <section id="topology" className="scroll-mt-24">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-2 border-b border-white/5 pb-4">
                    <h3 className="text-2xl md:text-3xl font-extralight tracking-tight text-white m-0 italic flex items-center gap-3">
                      <Network size={22} className="text-azure-light" /> Live Infrastructure Topology
                    </h3>
                    <span className="text-sm font-mono text-slate-400">
                      Interactive 3D map · <strong className="text-azure-light font-normal uppercase tracking-tighter">reacts to every simulation</strong>
                    </span>
                  </div>
                  <LazyInView>
                    <Suspense fallback={
                      <div className="w-full h-[460px] md:h-[560px] rounded-[2rem] border border-white/10 bg-black/40 flex items-center justify-center">
                        <div className="text-white/20 text-[10px] md:text-xs font-mono uppercase tracking-[0.6em] animate-pulse">
                          Rendering Topology...
                        </div>
                      </div>
                    }>
                      <Topology3D />
                    </Suspense>
                  </LazyInView>
                </section>

                <CollapsibleSection id="layer-1" layerId="Layer 1" title="Edge & Auth Ingress" defaultExpanded={true}>
                  <div onMouseEnter={() => setAmbientTheme('layer-1')} onMouseLeave={() => setAmbientTheme('default')}>
                    <NetworkLayer />
                  </div>
                </CollapsibleSection>

                <CollapsibleSection id="layer-2" layerId="Layer 2" title="Hardware Infrastructure">
                  <div onMouseEnter={() => setAmbientTheme('layer-2')} onMouseLeave={() => setAmbientTheme('default')}>
                    <HardwareLayer />
                  </div>
                </CollapsibleSection>

                <CollapsibleSection id="layer-3" layerId="Layer 3" title="Logical Orchestration">
                  <div onMouseEnter={() => setAmbientTheme('layer-3')} onMouseLeave={() => setAmbientTheme('default')}>
                    <LogicalLayer />
                  </div>
                </CollapsibleSection>

                <CollapsibleSection id="layer-dr" layerId="Layer 3.5" title="Disaster Recovery">
                  <div onMouseEnter={() => setAmbientTheme('layer-dr')} onMouseLeave={() => setAmbientTheme('default')}>
                    <DRPipeline />
                  </div>
                </CollapsibleSection>

                <CollapsibleSection id="layer-4" layerId="Layer 4" title="Distributed Workloads">
                  <div onMouseEnter={() => setAmbientTheme('layer-4')} onMouseLeave={() => setAmbientTheme('default')}>
                    <WorkloadLayer />
                  </div>
                </CollapsibleSection>

                <CollapsibleSection id="layer-journey" layerId="Roadmap" title="Enterprise Modernization Journey">
                  <div>
                    <JourneyLayer />
                  </div>
                </CollapsibleSection>

                <KnowledgeLayer />
              </main>

              <footer className="py-24 border-t border-white/5 text-center px-6">
                <Reveal y={16}>
                  <p className="text-white font-bold tracking-tight mb-3 text-sm md:text-base">
                    Khurram Nazir &copy; 2026
                  </p>
                  <p className="text-slate-400 text-[11px] md:text-xs uppercase tracking-widest font-medium">
                    Built with <span className="text-azure-light">React</span> & <span className="text-emerald-400">Tailwind CSS</span> • Infrastructure Visualizer
                  </p>
                </Reveal>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
