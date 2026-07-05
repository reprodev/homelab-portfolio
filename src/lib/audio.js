/*
  audio.js — the single Web Audio surface for the whole site.

  Why: previously 8 near-identical `playSynthesizedSound`/`playClick` helpers
  each constructed a brand-new AudioContext per call. Browsers cap concurrent
  contexts (~6), after which every sound silently dies. This module owns ONE
  lazily-created shared context that every component reuses.

  Hard rules honored (docs/showstoppers.md §2):
  - All gain/frequency changes ride exponential/linear ramps — never hard cuts.
  - Everything is wrapped in try/catch and resume()s suspended contexts to
    survive autoplay policies.

  UI sound types:
    click   — tactile mechanical tick (buttons, toggles)
    hover   — ultra-short high tick (card hovers)
    enter   — filtered riser sweep (portal door / stage transitions)
    ping    — sonar ping (pipeline stage advance)
    success — C5→C6 chord sweep (operation complete)
*/

let sharedCtx = null;

export const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  try {
    if (!sharedCtx || sharedCtx.state === 'closed') {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      sharedCtx = new Ctor();
    }
    if (sharedCtx.state === 'suspended') sharedCtx.resume().catch(() => {});
    return sharedCtx;
  } catch (e) {
    return null;
  }
};

// Global UI-sounds switch — LayerHUD's settings cockpit drives this, and it
// now mutes tactile sounds site-wide (not just the HUD's own buttons).
let uiSoundsEnabled = true;
export const setUiSoundsEnabled = (v) => { uiSoundsEnabled = !!v; };
export const areUiSoundsEnabled = () => uiSoundsEnabled;

const SOUND_PRESETS = {
  click:   { start: 1200, end: 400,  gain: 0.012, dur: 0.04 },
  hover:   { start: 1600, end: 1000, gain: 0.003, dur: 0.015 },
  ping:    { start: 1600, end: 800,  gain: 0.008, dur: 0.15 },
  success: { start: 523.25, end: 1046.5, gain: 0.015, dur: 0.25 }, // C5 -> C6
};

export const playSound = (type = 'click', overrides = {}) => {
  if (!uiSoundsEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'enter') {
      // Filtered riser: low sine swept up through an opening lowpass
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1300, ctx.currentTime + 0.35);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
      return;
    }

    const p = { ...(SOUND_PRESETS[type] || SOUND_PRESETS.click), ...overrides };
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(p.start, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(p.end, ctx.currentTime + p.dur);
    gain.gain.setValueAtTime(p.gain, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + p.dur);
    osc.start();
    osc.stop(ctx.currentTime + p.dur);
  } catch (e) { /* audio is always best-effort */ }
};
