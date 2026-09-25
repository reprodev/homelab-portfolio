import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VolumeX, Sliders } from 'lucide-react';
import { playSound, getAudioContext, setUiSoundsEnabled } from '../lib/audio';
import useIsMobile from '../hooks/useIsMobile';

const LayerHUD = () => {
  const isMobile = useIsMobile(1024);
  
  // Audio state
  const [volume, setVolume] = useState(30); // Default comfortable 30% volume
  const [humActive, setHumActive] = useState(false); // Off by default to respect user gesture
  const [clickActive, setClickActive] = useState(true);
  const [showAudioSettings, setShowAudioSettings] = useState(false);

  // Audio Context Web API references
  const audioCtxRef = useRef(null);
  const humGainNodeRef = useRef(null);
  const clickGainNodeRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const noiseSourceRef = useRef(null);

  const initAudio = () => {
    if (audioCtxRef.current) return;
    try {
      // Hum engine rides the site-wide shared AudioContext (src/lib/audio.js)
      const ctx = getAudioContext();
      if (!ctx) return;
      audioCtxRef.current = ctx;

      // Click Sound Gain Node (tactile clicks)
      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.15, ctx.currentTime);
      clickGain.connect(ctx.destination);
      clickGainNodeRef.current = clickGain;

      // Ambient Hum Gain Node
      const humGain = ctx.createGain();
      humGain.gain.setValueAtTime(0, ctx.currentTime);
      humGain.connect(ctx.destination);
      humGainNodeRef.current = humGain;

      // 1. Deep Power Transformer Hum (50Hz Sine)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(50, ctx.currentTime);
      const osc1Gain = ctx.createGain();
      osc1Gain.gain.setValueAtTime(0.5, ctx.currentTime);
      osc1.connect(osc1Gain);
      osc1Gain.connect(humGain);
      osc1.start();

      // 2. High-Frequency Server Fan Hum (95Hz Sine)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(95, ctx.currentTime);
      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.35, ctx.currentTime);
      osc2.connect(osc2Gain);
      osc2Gain.connect(humGain);
      osc2.start();

      oscillatorsRef.current = [osc1, osc2];

      // 3. White Noise Generator (Server chassis airflow sound)
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Noise Lowpass Filter to simulate acoustic enclosure damping
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime); // Damped sub-vent noise
      filter.Q.setValueAtTime(1.2, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.15, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(humGain);
      whiteNoise.start();

      noiseSourceRef.current = whiteNoise;
    } catch (e) {
      console.warn("Failed to initialize Web Audio Engine: ", e);
    }
  };

  // Tactile clicks now come from the shared engine (src/lib/audio.js);
  // LayerHUD's tick keeps its signature sharp 1500->250 sweep via overrides.
  const playSynthesizedSound = (type = 'click') => {
    if (!clickActive) return;
    playSound(type, type === 'click' ? { start: 1500, end: 250 } : undefined);
  };

  // The settings-cockpit toggle now mutes tactile UI sounds site-wide,
  // not just LayerHUD's own buttons.
  useEffect(() => {
    setUiSoundsEnabled(clickActive);
  }, [clickActive]);

  /*
    Tear the hum engine down on unmount.

    Without this, the oscillators and the white-noise source keep running on the
    SHARED AudioContext after LayerHUD goes away: enabling the hum and then using
    the portal-return button (App remounts the splash) left it audible with no
    control to stop it, and coming back built a *second* 50Hz + 95Hz + noise stack
    that the volume slider no longer reached. Every round trip added another layer
    — exactly the node accumulation the single-context rule exists to prevent.

    Ramp to silence first (invariant §2: never hard-stop, it clicks), then stop on
    the audio clock. Scheduled stops are honoured after this component is gone, so
    fading out does not depend on React still being here.
    NEVER close() the context — it is shared site-wide.
  */
  useEffect(() => () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const FADE = 0.15; // invariant §2 minimum
    try {
      const hum = humGainNodeRef.current;
      if (hum) {
        hum.gain.cancelScheduledValues(ctx.currentTime);
        hum.gain.setValueAtTime(hum.gain.value, ctx.currentTime);
        hum.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE);
      }
      oscillatorsRef.current.forEach((osc) => {
        try { osc.stop(ctx.currentTime + FADE + 0.05); } catch { /* already stopped */ }
      });
      if (noiseSourceRef.current) {
        try { noiseSourceRef.current.stop(ctx.currentTime + FADE + 0.05); } catch { /* already stopped */ }
      }
      // Release the two nodes that outlive the sources, once the fade has run.
      setTimeout(() => {
        try { humGainNodeRef.current?.disconnect(); } catch { /* noop */ }
        try { clickGainNodeRef.current?.disconnect(); } catch { /* noop */ }
      }, (FADE + 0.1) * 1000);
    } catch (e) {
      console.warn('Hum engine teardown failed: ', e);
    }
    oscillatorsRef.current = [];
    noiseSourceRef.current = null;
    humGainNodeRef.current = null;
    clickGainNodeRef.current = null;
    // Cleared last so a remount rebuilds a fresh stack rather than reusing dead nodes.
    audioCtxRef.current = null;
  }, []);

  // Sync ambient parameters with state updates to prevent pops
  useEffect(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    if (humGainNodeRef.current) {
      const activeGain = humActive ? (volume / 100) * 0.12 : 0;
      humGainNodeRef.current.gain.setValueAtTime(humGainNodeRef.current.gain.value, ctx.currentTime);
      humGainNodeRef.current.gain.linearRampToValueAtTime(activeGain, ctx.currentTime + 0.15);
    }
  }, [volume, humActive]);

  const toggleHum = () => {
    initAudio();
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    setHumActive(!humActive);
    playSynthesizedSound('click');
  };

  /*
    V6: LayerHUD is now ONLY the acoustic cockpit. Its section nav, scrollspy and
    scroll-to-top moved to StageNav (rail on desktop, bottom bar on phones). It
    still lives in the persistent shell in App.jsx — the hum engine above must
    never unmount on a route change, or it tears the hum down (see teardown).
    One instance, repositioned by breakpoint rather than rendered in two places,
    so crossing 1024px never remounts it either.
  */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed z-[60] select-none ${isMobile ? 'top-6 right-[5.5rem]' : 'bottom-6 left-3'}`}
    >
      <div className="relative">
        {/* Toggle Audio Controls Button */}
        <button
          onClick={() => {
            playSynthesizedSound('click');
            setShowAudioSettings(!showAudioSettings);
          }}
          aria-label="Toggle Audio Control Panel"
          className={`flex items-center justify-center w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-slate-950/85 border border-white/10 backdrop-blur-xl hover:bg-azure/25 hover:border-azure/40 text-slate-300 hover:text-white transition-all duration-300 active:scale-95 z-30 ${showAudioSettings ? 'bg-azure/20 border-azure/50 text-white' : ''}`}
        >
          {humActive && volume > 0 ? (
            <div className="flex items-center gap-0.5 justify-center h-[18px] w-[18px]">
              <span className="w-0.5 h-3 bg-azure animate-[pulse_0.6s_infinite_alternate]" />
              <span className="w-0.5 h-4 bg-azure animate-[pulse_0.4s_infinite_alternate]" style={{ animationDelay: '0.15s' }} />
              <span className="w-0.5 h-2.5 bg-azure animate-[pulse_0.5s_infinite_alternate]" style={{ animationDelay: '0.3s' }} />
            </div>
          ) : (
            <VolumeX size={18} className="text-slate-400" />
          )}
        </button>

        {/* Expandable Audio Settings Panel */}
        <AnimatePresence>
          {showAudioSettings && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute top-full right-0 mt-3 lg:top-auto lg:right-auto lg:bottom-0 lg:left-full lg:mt-0 lg:ml-3 p-4 rounded-xl bg-slate-950/90 border border-azure/30 backdrop-blur-2xl shadow-[0_0_30px_rgba(96,165,250,0.2)] w-60 z-50 text-slate-300 text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <span className="text-meta font-mono font-bold tracking-[0.2em] text-azure-light uppercase">ACOUSTIC CORE</span>
                <Sliders size={12} className="text-azure-light" />
              </div>

              <div className="flex flex-col gap-4">
                {/* Server Room Ambient Hum Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-meta-lg font-bold text-white">Chassis Fan Hum</span>
                    <span className="text-tag font-mono text-slate-400">Low-Freq LFO Synthesizer</span>
                  </div>
                  <button
                    onClick={toggleHum}
                    className={`relative w-9 h-5 rounded-full p-0.5 transition-colors duration-300 ${humActive ? 'bg-azure/80' : 'bg-slate-800'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${humActive ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Click Feedbacks Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-meta-lg font-bold text-white">Tactile Click Synth</span>
                    <span className="text-tag font-mono text-slate-400">Sine Wave Tick Synthesizer</span>
                  </div>
                  <button
                    onClick={() => {
                      setClickActive(!clickActive);
                      playSynthesizedSound('click');
                    }}
                    className={`relative w-9 h-5 rounded-full p-0.5 transition-colors duration-300 ${clickActive ? 'bg-azure/80' : 'bg-slate-800'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${clickActive ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Master Volume Controller */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-meta font-mono">
                    <span>VOLUME</span>
                    <span className="text-azure-light">{volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => {
                      initAudio();
                      setVolume(parseInt(e.target.value));
                    }}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-azure"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};

export default LayerHUD;
