import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, X, Compass } from 'lucide-react';
import { TOUR_STEPS, TOUR_START_EVENT } from '../lib/tourScript';
import { resetSims, triggerExpand, usePrefersReducedMotion } from '../lib/simBus';

/*
  GuidedTour — a self-running cinematic demo reel.

  Plays TOUR_STEPS in order: scrolls to each section, opens it (mobile), fires the
  matching simulation via the global bus, and shows a narration bar with a progress
  rail + Pause / Skip / Exit. Fully cancelable; restores all sims to idle on exit.
  Honors prefers-reduced-motion (instant scroll, no decorative flourish).

  Entry points: a persistent "Play Tour" pill (bottom-left) and any element that
  dispatches the `homelab-tour-start` window event (e.g. the Hero CTA).
*/
const GuidedTour = () => {
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const timerRef = useRef(null);
  const remainingRef = useRef(0);
  const stepStartRef = useRef(0);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const finish = useCallback(() => {
    clearTimer();
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
    setStepIndex(0);
    setPaused(false);
    setActive(true);
  }, []);

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

  // ENTER a step: scroll, open, fire its sim, reset the dwell timer.
  // (Defined before the timer effect so its cleanup order keeps remaining full.)
  useEffect(() => {
    if (!active) return;
    const step = TOUR_STEPS[stepIndex];
    if (!step) return;
    remainingRef.current = step.durationMs;
    const el = document.getElementById(step.sectionId);
    if (el) el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    triggerExpand(step.sectionId);
    if (step.onEnter) step.onEnter();
  }, [active, stepIndex, reducedMotion]);

  // Dwell timer: schedule advancement; on pause/unmount bank the remaining time.
  useEffect(() => {
    if (!active || paused) return undefined;
    const step = TOUR_STEPS[stepIndex];
    if (!step) return undefined;
    stepStartRef.current = Date.now();
    timerRef.current = setTimeout(() => advance(), remainingRef.current);
    return () => {
      clearTimer();
      const elapsed = Date.now() - stepStartRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    };
  }, [active, paused, stepIndex, advance]);

  const step = TOUR_STEPS[stepIndex];

  return (
    <>
      {/* Persistent entry pill */}
      <AnimatePresence>
        {!active && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={start}
            aria-label="Play guided tour of the infrastructure"
            className="fixed bottom-6 left-6 z-[65] group flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-2xl bg-azure/15 border border-azure/30 backdrop-blur-xl text-azure-light hover:bg-azure/25 hover:border-azure/50 hover:text-white transition-all active:scale-95 shadow-[0_0_30px_rgba(96,165,250,0.15)]"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-azure/20 group-hover:bg-azure/30 transition-colors">
              <Play size={14} fill="currentColor" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-[0.18em]">Play Tour</span>
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
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] w-[calc(100%-3rem)] max-w-2xl"
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
                    <span className="text-[8px] font-mono font-black uppercase tracking-[0.25em] text-azure-light/70">
                      Step {stepIndex + 1} / {TOUR_STEPS.length}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white italic tracking-tight leading-tight truncate">{step.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{step.caption}</p>
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
