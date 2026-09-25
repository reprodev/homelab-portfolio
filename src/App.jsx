import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import LayerHUD from './components/LayerHUD.jsx';
import GuidedTour from './components/GuidedTour.jsx';
import StageNav from './components/StageNav.jsx';
import CockpitHUD from './components/CockpitHUD.jsx';
import HomelabPage from './pages/HomelabPage.jsx';
import WritingPage from './pages/WritingPage.jsx';
import JourneyPage from './pages/JourneyPage.jsx';
import { LayoutGrid } from 'lucide-react';
import { useSimEvent, SIM_EVENTS, resetSims } from './lib/simBus.js';
import { lockScroll, unlockScroll } from './lib/scrollLock.js';
import { useRoute, hasDeepLink, ROUTES } from './lib/route.js';
import Reveal from './components/Reveal.jsx';
import useIsMobile from './hooks/useIsMobile.js';

const SplashHub = React.lazy(() => import('./components/SplashHub.jsx'));
/*
  App — the persistent SHELL (V6). Pages swap underneath it; everything here must
  survive a route change: the ambient orbs and their theme, the sim listeners and
  cockpit state (DR/DDoS/terraform recolour the whole site), LayerHUD's hum engine
  (unmounting it tears the hum down), the guided tour and the stage nav.
  Pages: src/pages/. Router: src/lib/route.js (hash-based, no dependency).
*/
function App() {
  const [showSplash, setShowSplash] = useState(null); // 'null' for the initial checking frame
  const [ambientTheme, setAmbientTheme] = useState('default');
  const [ddosActive, setDdosActive] = useState(false);
  const [drActive, setDrActive] = useState(false);
  const [drStep, setDrStep] = useState(0);
  const [tfActive, setTfActive] = useState(false);
  const [tfResource, setTfResource] = useState(0);
  const [vitals, setVitals] = useState({ watts: 92, temp: 42.7 });
  // 1024 matches the 3D/flat fallback gate: below it we are on a touch device
  // with a mobile compositor, so the decorative layers get cut down.
  const isMobile = useIsMobile(1024);

  const route = useRoute();

  /*
    Route change: start the new page at the top (a pending anchor scroll runs
    after this), drop any hover theme whose mouseleave will never fire, and when
    leaving the lab page reset every sim. The sims live on that page only; their
    DDoS and transcode toggles never stop on their own, so without this the shell
    would stay red or amber on a page that has no way to end it (deviations #16's
    cousin — DRPipeline also resets itself on unmount now).
  */
  useEffect(() => {
    if (!route.anchor) window.scrollTo(0, 0);
    setAmbientTheme('default');
    if (route.path !== ROUTES.home) resetSims();
  }, [route.path]); // eslint-disable-line react-hooks/exhaustive-deps

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Check if splash should be shown
    const isPermanentlyHidden = localStorage.getItem('hideSplashPermanently');

    /* A deep link (#/writing, or a legacy #layer-3 from a reprodev post) means the
       visitor asked for a specific place — don't put the splash in front of it.
       Session-only: `hideSplashPermanently` is NOT written, so the bare URL still
       shows the splash and showstoppers §5 (manual override) is untouched. */
    if (isPermanentlyHidden === 'true' || hasDeepLink()) {
      setShowSplash(false);
    } else {
      setShowSplash(true);
    }
  }, []);

  // Prevent background scrolling while splash is active (counter-based lock —
  // the workload drawer shares body.overflow), reset scroll to top on dismissal.
  useEffect(() => {
    if (showSplash) {
      lockScroll();
      return () => unlockScroll();
    }
    if (showSplash === false) window.scrollTo(0, 0);
    return undefined;
  }, [showSplash]);

  // Global simulation bus: drive the cockpit HUD + ambient orb theme from events
  // dispatched anywhere on the page (now wired via src/lib/simBus.js).
  useSimEvent(SIM_EVENTS.ddos, ({ active }) => {
    setDdosActive(active);
    setAmbientTheme(active ? 'ddos' : 'default');
  });
  useSimEvent(SIM_EVENTS.dr, ({ step }) => {
    const active = step > 0 && step < 4;
    setDrStep(step);
    setDrActive(active);
    setAmbientTheme(active ? 'dr' : 'default');
  });
  // Terraform sim (contract: docs/iac-layer-spec.md §b). 'plan'/'apply' are
  // active phases; 'apply' with a resource count feeds the cockpit (k/3) tile.
  useSimEvent(SIM_EVENTS.terraform, ({ phase, resource }) => {
    const active = phase === 'plan' || phase === 'apply';
    setTfActive(active);
    if (phase === 'apply' && resource) setTfResource(resource);
    else if (!active) setTfResource(0);
    setAmbientTheme(active ? 'terraform' : 'default');
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
            : tfActive
              ? { watts: Math.floor(126 + Math.random() * 4), temp: +(45.0 + Math.random() * 0.6).toFixed(1) }
              : { watts: Math.floor(91 + Math.random() * 4), temp: +(42.5 + Math.random() * 0.4).toFixed(1) }
      );
    };
    roll();
    const interval = setInterval(roll, 2000);
    return () => clearInterval(interval);
  }, [ddosActive, drActive, tfActive]);

  // Avoid FOUC (flash of unstyled content) or dashboard flicker
  if (showSplash === null) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-white/55 text-meta-lg md:text-sm font-mono uppercase tracking-[0.6em] animate-pulse">
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
      case 'terraform':
        return {
          orb1: 'bg-violet-600/35 shadow-[0_0_150px_rgba(124,58,237,0.35)]',
          orb2: 'bg-violet-500/30 shadow-[0_0_180px_rgba(139,92,246,0.3)]',
          orb3: 'bg-purple-700/25 shadow-[0_0_120px_rgba(126,34,206,0.2)]'
        };
      case 'layer-code':
        return {
          orb1: 'bg-violet-600/25 shadow-[0_0_150px_rgba(124,58,237,0.2)]',
          orb2: 'bg-violet-500/20 shadow-[0_0_180px_rgba(139,92,246,0.15)]',
          orb3: 'bg-purple-700/15 shadow-[0_0_120px_rgba(126,34,206,0.1)]'
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

  /*
    The ambient orbs are the heaviest thing on the page for a phone. Each theme
    string pairs a fill with a 120-180px `shadow-[...]` spread, and that shadow
    sits *underneath* an orb already carrying a 100-140px blur — on mobile it
    buys no visible glow while costing a second full-size composited layer per
    orb. Strip it there and keep getOrbColors() as the single palette source
    rather than forking ten theme cases into mobile/desktop variants.
  */
  const orbClass = (cls) => (isMobile ? cls.replace(/\s*shadow-\[[^\]]*\]/, '') : cls);

  return (
    <div className="min-h-screen relative selection:bg-azure/30 selection:text-white bg-[#050505] overflow-x-hidden">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <Suspense fallback={
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
              <div className="text-white/55 text-meta md:text-xs font-mono uppercase tracking-[0.6em] animate-pulse">
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

            {/* Moving Background Orbs.

                Mobile gets the same ambient colour wash at a fraction of the
                fill cost: smaller, `blur-2xl` instead of a 100-140px blur, no
                shadow spread and no `animate-float`. Three fixed 400-600px
                layers being re-blurred every frame, stacked under ~28
                backdrop-filter panels, was enough to push the tab past what a
                phone will hold — which presents as the browser silently
                reloading the page mid-scroll. SplashHub already gated its own
                orbs this way (blur-2xl on isMobile); this is the dashboard
                catching up. `transition-colors`, not `transition-all`, so a
                breakpoint cross doesn't animate blur and size too. */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              <div className={`absolute top-1/4 left-1/4 rounded-full transition-colors duration-1000 ${isMobile ? 'w-[280px] h-[280px] blur-2xl' : 'w-[500px] h-[500px] blur-[120px] animate-float'} ${orbClass(orbs.orb1)}`} />
              <div className={`absolute bottom-1/4 right-1/4 rounded-full transition-colors duration-1000 ${isMobile ? 'w-[320px] h-[320px] blur-2xl' : 'w-[600px] h-[600px] blur-[140px] animate-float animation-delay-2000'} ${orbClass(orbs.orb2)}`} />
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-1000 ${isMobile ? 'w-[240px] h-[240px] blur-2xl' : 'w-[400px] h-[400px] blur-[100px] animate-float animation-delay-4000'} ${orbClass(orbs.orb3)}`} />
            </div>

            {/* Acoustic cockpit (hum engine) — shell-level so it never unmounts */}
            <LayerHUD />

            {/* Stage rail (desktop) / bottom tab bar (phones) */}
            <StageNav route={route} />

            {/* Guided cinematic auto-tour controller */}
            <GuidedTour route={route} />
            
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

            {/* Main Content Container. lg:pl-16 reserves the rail's column so the
                nav can never sit on top of content (deviations #22); pb-24 on
                phones keeps the footer clear of the bottom bar. */}
            <div className="relative z-10 w-full lg:pl-16 pb-24 lg:pb-0">
              {route.path === ROUTES.writing ? (
                <WritingPage />
              ) : route.path === ROUTES.journey ? (
                <JourneyPage />
              ) : (
                <HomelabPage
                  anchor={route.anchor}
                  setAmbientTheme={setAmbientTheme}
                  cockpit={
                    <CockpitHUD
                      ddosActive={ddosActive}
                      drActive={drActive}
                      drStep={drStep}
                      tfActive={tfActive}
                      tfResource={tfResource}
                      vitals={vitals}
                    />
                  }
                />
              )}

              <footer className="py-16 md:py-24 border-t border-white/5 text-center px-6">
                <Reveal y={16}>
                  <p className="text-white font-bold tracking-tight mb-3 text-sm md:text-base">
                    Khurram Nazir &copy; 2026
                  </p>
                  <p className="text-slate-400 text-meta-lg md:text-xs uppercase tracking-widest font-medium">
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
