import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Database, Cpu, Repeat, LayoutGrid, Menu, X, Volume2, VolumeX, Sliders, Network, ArrowUp, Map, BookOpen } from 'lucide-react';
import { triggerExpand } from '../lib/simBus.js';
import { playSound, getAudioContext, setUiSoundsEnabled } from '../lib/audio';
import useIsMobile from '../hooks/useIsMobile';

const LayerHUD = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile(1024);
  
  // Audio state
  const [volume, setVolume] = useState(30); // Default comfortable 30% volume
  const [humActive, setHumActive] = useState(false); // Off by default to respect user gesture
  const [clickActive, setClickActive] = useState(true);
  const [showAudioSettings, setShowAudioSettings] = useState(false);

  // Scrollspy & Scroll To Top
  const [activeSection, setActiveSection] = useState('topology');
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  const sections = [
    { id: 'topology', icon: <Network size={18} />, label: '3D Topology' },
    { id: 'layer-1', icon: <Shield size={18} />, label: 'Edge & Ingress' },
    { id: 'layer-2', icon: <Database size={18} />, label: 'Hardware' },
    { id: 'layer-3', icon: <Cpu size={18} />, label: 'Logical' },
    { id: 'layer-dr', icon: <Repeat size={18} />, label: 'Disaster Recovery' },
    { id: 'layer-4', icon: <LayoutGrid size={18} />, label: 'Workloads' },
    { id: 'layer-journey', icon: <Map size={18} />, label: 'Roadmap' },
    { id: 'knowledge-base', icon: <BookOpen size={18} />, label: 'Knowledge' },
  ];

  // Scroll-to-top visibility — passive listener, no layout reads
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 350);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scrollspy via IntersectionObserver — replaces the per-scroll-event
  // offsetTop/offsetHeight walk (which forced synchronous layout on every
  // scroll tick). The active section is whichever intersects a band near
  // the top quarter of the viewport.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-15% 0px -65% 0px' }
    );
    // CollapsibleSections mount their wrappers immediately, so observing on
    // mount is safe even while collapsed.
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToSection = (id) => {
    triggerExpand(id);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
    if (isMobile) setIsOpen(false);
  };

  const toggleHum = () => {
    initAudio();
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    setHumActive(!humActive);
    playSynthesizedSound('click');
  };

  const hudVariants = {
    hidden: { x: 100, opacity: 0 },
    show: { x: 0, opacity: 1 },
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={hudVariants}
      transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[60] select-none"
    >
      <div className="flex flex-col-reverse lg:flex-col gap-3 p-2.5 lg:p-3 rounded-2xl bg-slate-950/85 border border-azure/20 backdrop-blur-xl shadow-[0_0_30px_rgba(0,102,204,0.15)] relative">
        
        {/* Toggle Audio Controls Button */}
        <button
          onClick={() => {
            playSynthesizedSound('click');
            setShowAudioSettings(!showAudioSettings);
          }}
          aria-label="Toggle Audio Control Panel"
          className={`flex items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-azure/25 hover:border-azure/40 text-slate-300 hover:text-white transition-all duration-300 active:scale-95 z-30 ${showAudioSettings ? 'bg-azure/20 border-azure/50 text-white' : ''}`}
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
              className="absolute bottom-full right-0 lg:bottom-auto lg:top-0 lg:right-full mb-3 lg:mb-0 lg:mr-3 p-4 rounded-xl bg-slate-950/90 border border-azure/30 backdrop-blur-2xl shadow-[0_0_30px_rgba(96,165,250,0.2)] w-60 z-50 text-slate-300 text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-azure-light uppercase">ACOUSTIC CORE</span>
                <Sliders size={12} className="text-azure-light" />
              </div>

              <div className="flex flex-col gap-4">
                {/* Server Room Ambient Hum Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-white">Chassis Fan Hum</span>
                    <span className="text-[9px] font-mono text-slate-500">Low-Freq LFO Synthesizer</span>
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
                    <span className="text-[11px] font-bold text-white">Tactile Click Synth</span>
                    <span className="text-[9px] font-mono text-slate-500">Sine Wave Tick Synthesizer</span>
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
                  <div className="flex items-center justify-between text-[10px] font-mono">
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

        <button
          onClick={() => {
            playSynthesizedSound('click');
            if (isMobile) setIsOpen(!isOpen);
          }}
          aria-label={isOpen ? "Close Navigation HUD" : "Open Navigation HUD"}
          className={`flex items-center justify-center p-3 rounded-xl bg-azure/25 border border-azure/40 text-white lg:hidden transition-all active:scale-90 z-30`}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="hidden lg:block text-[8px] font-mono font-bold text-azure-light/70 uppercase tracking-[0.25em] text-center mb-1 drop-shadow-[0_0_6px_rgba(96,165,250,0.3)]">
          NAV_HUD
        </div>
        
        {/* Scroll To Top Button (Triggered dynamically on scroll) */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ scale: 0, opacity: 0, height: 0 }}
              animate={{ scale: 1, opacity: 1, height: 'auto' }}
              exit={{ scale: 0, opacity: 0, height: 0 }}
              onClick={() => {
                playSynthesizedSound('click');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title="Scroll to Top"
              className="flex items-center justify-center p-3.5 lg:p-3 rounded-xl bg-azure/10 border border-azure/30 text-azure-light hover:bg-azure/20 hover:border-azure/50 hover:text-white transition-all active:scale-90 mb-1.5 relative z-30 shadow-[0_0_12px_rgba(96,165,250,0.2)]"
            >
              <ArrowUp size={18} className="animate-bounce" />
            </motion.button>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {(isOpen || !isMobile) && (
            <motion.div 
              initial={isMobile ? { height: 0, opacity: 0, marginBottom: 0 } : {}}
              animate={isMobile ? { height: 'auto', opacity: 1, marginBottom: 12 } : {}}
              exit={isMobile ? { height: 0, opacity: 0, marginBottom: 0 } : {}}
              className="flex flex-col gap-3 overflow-hidden"
            >
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      playSynthesizedSound('click');
                      scrollToSection(section.id);
                    }}
                    aria-label={`Scroll to ${section.label}`}
                    className={`group relative flex items-center justify-center p-3.5 lg:p-3 rounded-xl transition-all active:scale-90 border z-30 ${
                      isActive 
                        ? 'bg-azure/25 border-azure text-azure-light shadow-[0_0_15px_rgba(96,165,250,0.3)] scale-[1.08]' 
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-azure/25 hover:border-azure/40 hover:text-white hover:shadow-[0_0_15px_rgba(96,165,250,0.3)]'
                    }`}
                  >
                    {section.icon}
                    
                    {/* Active pulse tag */}
                    {isActive && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-azure rounded-full animate-ping" />
                    )}
                    
                    {/* Label (Desktop Tooltip / Mobile Inline) */}
                    <div className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-black/90 border border-white/10 text-white text-[10px] font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden lg:block shadow-2xl">
                      {section.label}
                    </div>
                    
                    {isMobile && (
                      <span className="absolute right-full mr-4 text-[9px] font-mono font-bold text-azure-light uppercase tracking-widest pointer-events-none whitespace-nowrap drop-shadow-[0_0_6px_rgba(96,165,250,0.3)]">
                        {section.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LayerHUD;
