import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, X, Compass } from 'lucide-react';
import { TOUR_STEPS, TOUR_START_EVENT } from '../lib/tourScript';
import { resetSims, triggerExpand, usePrefersReducedMotion } from '../lib/simBus';
import { SIM_DISPATCH_DELAY, COLLAPSIBLE_IDS } from '../lib/sectionNav';
import { navigate, ROUTES } from '../lib/route';
import useIsMobile from '../hooks/useIsMobile';

/*
  GuidedTour — a self-running cinematic demo reel.

  Plays TOUR_STEPS in order: scrolls to each section, opens it (mobile), fires the
  matching simulation via the global bus, and shows a narration bar with a progress
  rail + Pause / Skip / Exit. Fully cancelable; restores all sims to idle on exit.
  Honors prefers-reduced-motion (instant scroll, no decorative flourish).

  Entry points: a persistent "Play Tour" pill (bottom-left) and any element that
  dispatches the `homelab-tour-start` window event (e.g. the Hero CTA).
*/

/*
  SIM_DISPATCH_DELAY (src/lib/sectionNav.js, 150ms) is the gap between opening a
  section and dispatching its sim. Collapsed CollapsibleSections unmount their
  children, so a sim fired in the same tick as `triggerExpand` has no listener to
  receive it. The bento CTAs share the constant.
*/
const GuidedTour = ({ route }) => {
  const isMobile = useIsMobile(1024);
  const onHome = !route || route.path === ROUTES.home;
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  /*
    V6: the floating pill waits until the hero is scrolled past. At the top of the
    lab page the Hero's own "Play Guided Tour" button is on screen, and the pill
    sat on top of the skim strip (desktop) and the profile links (phones).
    The other pages have no hero, so it shows there straight away.
  */
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 560);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const showPill = !active && (!onHome || pastHero);

  const timerRef = useRef(null);
  const remainingRef = useRef(0);
  const stepStartRef = useRef(0);
  // Separate from timerRef: this one defers a step's sim until the section it
  // targets has actually mounted (see the enter effect below).
  const enterTimerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const clearEnterTimer = () => {
    if (enterTimerRef.current) {
      clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }
  };

  const finish = useCallback(() => {
    clearTimer();
    clearEnterTimer(); // a pending sim must not fire into a tour that just ended
    // run the current step's cleanup if we bailed mid-sim
    const step = TOUR_STEPS[stepIndex];
    if (step && step.onExit) step.onExit();
    resetSims();
    setActive(false);
    setPaused(false);
    setStepIndex(0);
  }, [stepIndex]);

  const advance = useCallback(() => {
    clearTimer();
    const step = TOUR_STEPS[stepIndex];
    if (step && step.onExit) step.onExit();
    if (stepIndex >= TOUR_STEPS.length - 1) {
      // last step done
      resetSims();
      setActive(false);
      setPaused(false);
      setStepIndex(0);
    } else {
      setStepIndex((i) => i + 1);
    }
  }, [stepIndex]);

  const start = useCallback(() => {
    // The tour drives the lab page's sims, so it can only run there (V6 routes).
    if (!onHome) navigate(ROUTES.home);
    setStepIndex(0);
    setPaused(false);
    setActive(true);
  }, [onHome]);

  // External start trigger (Hero CTA, etc.)
  useEffect(() => {
    const onStart = () => start();
    window.addEventListener(TOUR_START_EVENT, onStart);
    return () => window.removeEventListener(TOUR_START_EVENT, onStart);
  }, [start]);

  // Esc exits the tour
  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') finish(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, finish]);

  /*
    ENTER a step: scroll, open, then fire its sim.
    (Defined before the timer effect so its cleanup order keeps remaining full.)

    The sim dispatch MUST be deferred. `triggerExpand` only queues
    `setIsExpanded(true)` inside CollapsibleSection, and that component renders its
    children only while expanded — so a sim fired on the next synchronous line goes
    out before the target section mounts, and no listener is subscribed to receive
    it. The event lands nowhere and the tour narrates a simulation that never runs.
    This was measured: `homelab-terraform {phase:'plan'}` fired while TerraformSim
    produced no output at all. LayerHUD.scrollToSection already delays for the same
    reason. Tracked in a ref so exiting mid-step can't fire a sim into a dead tour.
  */
  /*
    V6: scroll + expand are also deferred, by one macrotask. When the tour starts
    from another page it navigates home, and this effect runs in the same commit
    that mounts the lab page — before the sections below it have subscribed to the
    expand bus (sibling effects run in tree order) and before the shell's
    route-change scroll-to-top. A 0ms timer lands after all of that.
  */
  useEffect(() => {
    if (!active || !onHome) return undefined;
    const step = TOUR_STEPS[stepIndex];
    if (!step) return undefined;
    remainingRef.current = step.durationMs;
    const scrollTimer = setTimeout(() => {
      if (!step.sectionId) return;
      const el = document.getElementById(step.sectionId);
      if (el) el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      // Only real accordions: firing it for a plain <section> collapses the rest.
      if (COLLAPSIBLE_IDS.has(step.sectionId)) triggerExpand(step.sectionId);
    }, 0);

    clearEnterTimer();
    if (step.onEnter) {
      enterTimerRef.current = setTimeout(() => {
        enterTimerRef.current = null;
        step.onEnter();
      }, SIM_DISPATCH_DELAY);
    }
    return () => {
      clearTimeout(scrollTimer);
      clearEnterTimer();
    };
  }, [active, stepIndex, reducedMotion, onHome]);

  // Dwell timer: schedule advancement; on pause/unmount bank the remaining time.
  useEffect(() => {
    if (!active || paused || !onHome) return undefined;
    const step = TOUR_STEPS[stepIndex];
    if (!step) return undefined;
    stepStartRef.current = Date.now();
    timerRef.current = setTimeout(() => advance(), remainingRef.current);
    return () => {
      clearTimer();
      const elapsed = Date.now() - stepStartRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    };
  }, [active, paused, stepIndex, advance, onHome]);

  const step = TOUR_STEPS[stepIndex];

  return (
    <>
      {/* Persistent entry pill */}
      <AnimatePresence>
        {showPill && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={start}
            aria-label="Play guided tour of the infrastructure"
            /* V6: bottom-right on desktop (the rail owns the left edge); above the
               bottom tab bar on phones. */
            style={isMobile ? { bottom: 'calc(5rem + env(safe-area-inset-bottom))' } : undefined}
            className="fixed right-4 bottom-6 lg:right-6 z-[65] group flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-2xl bg-azure/15 border border-azure/30 backdrop-blur-xl text-azure-light hover:bg-azure/25 hover:border-azure/50 hover:text-white transition-all active:scale-95 shadow-[0_0_30px_rgba(96,165,250,0.15)]"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-azure/20 group-hover:bg-azure/30 transition-colors">
              <Play size={14} fill="currentColor" />
            </span>
            <span className="text-meta-lg font-black uppercase tracking-[0.18em]">Play Tour</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Active narration bar */}
      <AnimatePresence>
        {active && step && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
            style={isMobile ? { bottom: 'calc(5rem + env(safe-area-inset-bottom))' } : undefined}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] w-[calc(100%-2rem)] max-w-2xl"
          >
            <div className="relative overflow-hidden rounded-2xl bg-slate-950/90 border border-azure/25 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)]">
              {/* per-step progress rail */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5">
                <motion.div
                  key={stepIndex}
                  className="h-full bg-gradient-to-r from-azure via-azure-light to-amberGold"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: step.durationMs / 1000, ease: 'linear' }}
                  style={{ animationPlayState: paused ? 'paused' : 'running' }}
                />
              </div>

              <div className="flex items-center gap-4 p-4 pl-5">
                <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-azure/15 border border-azure/25 text-azure-light shrink-0">
                  <Compass size={18} className={reducedMotion ? '' : 'animate-pulse'} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-label font-mono font-black uppercase tracking-[0.25em] text-azure-light/70">
                      Step {stepIndex + 1} / {TOUR_STEPS.length}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white italic tracking-tight leading-tight truncate">{step.title}</h4>
                  <p className="text-meta-lg text-slate-400 leading-snug line-clamp-2">{step.caption}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setPaused((p) => !p)}
                    aria-label={paused ? 'Resume tour' : 'Pause tour'}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all active:scale-90"
                  >
                    {paused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
                  </button>
                  <button
                    onClick={advance}
                    aria-label="Skip to next step"
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all active:scale-90"
                  >
                    <SkipForward size={14} fill="currentColor" />
                  </button>
                  <button
                    onClick={finish}
                    aria-label="Exit tour"
                    className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all active:scale-90"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GuidedTour;
