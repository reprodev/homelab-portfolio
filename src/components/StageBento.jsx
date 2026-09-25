import React, { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import Reveal from './Reveal.jsx';
import { triggerDdos, triggerDr, triggerTranscode, triggerTerraform } from '../lib/simBus';
import { goToSection, SIM_DISPATCH_DELAY } from '../lib/sectionNav';
import { playSound } from '../lib/audio';

/*
  StageBento — the headline tiles a stage shows before it is opened (V6).

  The point of the redesign: a skimmer reads four facts per stage without opening
  anything, and the deep sims/terminals are one click further in. Content comes
  from src/data/stages.js; this component only lays it out.

  CTAs start a sim in a stage that is probably collapsed. Same rule as the tour:
  open the section, then dispatch after SIM_DISPATCH_DELAY — collapsed sections
  unmount their children, so an immediate dispatch reaches no listener and the
  button would silently do nothing (invariants §1, deviations #23). Timers live
  in a ref and die with the component (convention #5).
*/
const SIMS = {
  terraform: () => triggerTerraform('plan'),
  ddos: () => triggerDdos(true),
  transcode: () => triggerTranscode(true),
  dr: () => triggerDr(1),
};

const StageBento = ({ stage }) => {
  const timersRef = useRef([]);
  useEffect(() => () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const runCta = (cta) => {
    playSound('click');
    const scrollTimer = goToSection(cta.target, { expand: true });
    if (scrollTimer) timersRef.current.push(scrollTimer);
    timersRef.current.push(setTimeout(() => SIMS[cta.sim]?.(), SIM_DISPATCH_DELAY));
  };

  return (
    <div className="mt-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stage.tiles.map((tile, i) => (
          <Reveal key={tile.label} delay={i * 0.05} y={12} className="h-full">
            <div className="h-full p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-1">
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-none">
                {tile.stat}
              </span>
              <span className="text-tag font-mono font-black uppercase tracking-[0.18em] text-azure-light/90 mt-1.5">
                {tile.label}
              </span>
              {tile.sub && (
                <span className="text-meta text-slate-400 leading-snug">{tile.sub}</span>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      {stage.ctas.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {stage.ctas.map((cta) => (
            <button
              key={cta.label}
              type="button"
              onClick={() => runCta(cta)}
              className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-xl bg-azure/10 border border-azure/30 text-azure-light text-meta-lg font-mono font-black uppercase tracking-wider hover:bg-azure/20 hover:border-azure/50 hover:text-white transition-colors active:scale-95"
            >
              <Play size={12} fill="currentColor" />
              {cta.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StageBento;
