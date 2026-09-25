import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Reveal from './Reveal.jsx';
import { navigate, ROUTES } from '../lib/route';
import { playSound } from '../lib/audio';

// Compact header for the V6 secondary pages (Blog & Builds, Learning Path).
const PageHeader = ({ eyebrow, title, intro }) => (
  <header className="max-w-[1300px] mx-auto px-6 pt-24 md:pt-28 pb-8 border-b border-white/[0.04]">
    <Reveal y={14}>
      <button
        type="button"
        onClick={() => { playSound('click'); navigate(ROUTES.home); }}
        className="inline-flex items-center gap-2 min-h-[44px] -ml-1 px-1 mb-6 text-meta-lg font-mono font-black uppercase tracking-[0.2em] text-azure-light/90 hover:text-white transition-colors"
      >
        <ArrowLeft size={14} /> Back to the lab
      </button>
      <span className="block text-meta font-mono font-black uppercase tracking-[0.4em] text-white/55 mb-2">{eyebrow}</span>
      {/* Plain white on purpose: the azure → white → amber gradient is the name's
          signature (invariants §8) and stays reserved for Hero and SplashHub. */}
      <h1 className="text-4xl md:text-6xl font-extralight italic tracking-tight leading-tight m-0 text-white">
        {title}
      </h1>
      {intro && <p className="mt-4 text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">{intro}</p>}
    </Reveal>
  </header>
);

export default PageHeader;
