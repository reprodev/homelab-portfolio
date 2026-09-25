import React from 'react';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal.jsx';
import { STAGES } from '../data/stages';
import { goToSection } from '../lib/sectionNav';
import { playSound } from '../lib/audio';

/*
  SkimStrip — the 60-second read (V6). One verified headline per lifecycle stage,
  directly under the hero, each jumping to that stage's bento. Built for the
  visitor who will never scroll past the first section: they still leave with the
  four facts that matter. Headlines come from src/data/stages.js.
  Phones get a horizontal scroll-snap row instead of a 4-up grid.
*/
const SkimStrip = () => (
  <section aria-label="The lab at a glance" className="max-w-[1300px] mx-auto px-6 mt-8">
    <div className="flex items-center gap-3 mb-3">
      <span className="text-tag font-mono font-black uppercase tracking-[0.3em] text-white/55">At a glance</span>
      <span className="h-px flex-1 bg-white/5" />
    </div>
    <div className="flex md:grid md:grid-cols-4 gap-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 pb-1">
      {STAGES.map((stage, i) => (
        <Reveal key={stage.id} delay={i * 0.06} y={14} className="snap-start shrink-0 w-[78%] sm:w-[45%] md:w-auto">
          <button
            type="button"
            onClick={() => { playSound('click'); goToSection(stage.id); }}
            className="group h-full w-full text-left p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-azure/30 hover:bg-white/[0.05] transition-colors flex flex-col gap-2"
          >
            <span className="flex items-center justify-between">
              <span className="font-mono text-tag font-black uppercase tracking-[0.25em] text-azure-light/90">
                {stage.num} · {stage.title}
              </span>
              <ArrowRight size={14} className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </span>
            <span className="text-sm md:text-base text-white font-semibold leading-snug">{stage.headline}</span>
          </button>
        </Reveal>
      ))}
    </div>
  </section>
);

export default SkimStrip;
