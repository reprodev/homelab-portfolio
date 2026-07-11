import { useEffect, useRef, useState } from 'react';

/*
  simBus — the global simulation event bus.

  The app already *listens* for these window CustomEvents in several places
  (App.jsx cockpit HUD, WorkloadLayer sparklines, LayerHUD). Historically nothing
  ever dispatched them, so the local simulations (DDoS button, DR drill, Plex
  transcode) stayed siloed. These helpers are the single dispatch surface — used
  both by the interactive controls themselves and by the GuidedTour controller —
  so triggering any simulation lights up the entire page as one organism.

  Event contracts (kept identical to the existing listeners):
    homelab-ddos      -> { active: boolean }
    homelab-dr        -> { step: number }   // 0 idle, 1 outage, 2 recovering, 3 verifying, 4 restored
    homelab-transcode -> { active: boolean }
    homelab-terraform -> { phase: 'idle'|'plan'|'apply'|'done', resource?: number, auto?: boolean }
      // 'plan'/'apply' without `resource` are control commands; 'apply' WITH
      // `resource` (1..3) is TerraformSim's own progress broadcast; 'done'
      // persists until reset. Full contract: docs/iac-layer-spec.md §b.
*/

export const SIM_EVENTS = {
  ddos: 'homelab-ddos',
  dr: 'homelab-dr',
  transcode: 'homelab-transcode',
  terraform: 'homelab-terraform',
  expand: 'homelab-expand', // request a CollapsibleSection (by id) to open (tour, mobile)
};

const dispatch = (name, detail) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
};

export const triggerDdos = (active) => dispatch(SIM_EVENTS.ddos, { active: !!active });
export const triggerDr = (step) => dispatch(SIM_EVENTS.dr, { step });
export const triggerTranscode = (active) => dispatch(SIM_EVENTS.transcode, { active: !!active });
export const triggerTerraform = (phase, extra = {}) => dispatch(SIM_EVENTS.terraform, { phase, ...extra });
export const triggerExpand = (id) => dispatch(SIM_EVENTS.expand, { id });

/* Reset every simulation back to idle (used on tour exit / cleanup). */
export const resetSims = () => {
  triggerDdos(false);
  triggerDr(0);
  triggerTranscode(false);
  triggerTerraform('idle');
};

/*
  useSimEvent — subscribe to a window CustomEvent and receive its `detail`.
  Dedupes the addEventListener/removeEventListener boilerplate scattered across
  components. `handler` receives the event's detail object.

  The handler is kept in a ref (latest-ref pattern): the listener is attached
  once per event name but always invokes the current render's handler, so
  handlers may safely read component state without going stale. (Refs like
  DRPipeline's `runningRef` are still the right tool for re-entrancy guards.)
*/
export const useSimEvent = (name, handler) => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const listener = (e) => handlerRef.current(e.detail);
    window.addEventListener(name, listener);
    return () => window.removeEventListener(name, listener);
  }, [name]);
};

/*
  usePrefersReducedMotion — true when the OS requests reduced motion.
  Consumed to gate the CRT flicker, particle constellation, float orbs,
  3D auto-rotate and the guided tour's cinematic scrolling.
*/
export const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    onChange();
    // Safari < 14 uses addListener
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  return reduced;
};
