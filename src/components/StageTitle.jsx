import React from 'react';

/*
  StageTitle — the shared heading block for a lifecycle stage (V6 visual refresh).

  A large outlined numeral, the lifecycle eyebrow, the title and a one-line
  "Proves" statement. Used by CollapsibleSection's header and by the Run stage's
  static group header, so every stage reads with the same rhythm.

  The numeral is decorative (the eyebrow already says "Lifecycle 02"), so it is
  aria-hidden and exempt from the contrast floor (design-system rule 3). Hidden
  below 640px, where it cost a third of the title's line length.
*/
const OUTLINE = { WebkitTextStroke: '1px rgba(147, 197, 253, 0.35)', color: 'transparent' };

const StageTitle = ({ num, eyebrow, title, proves, compact = false, muted = false }) => (
  <div className="flex items-start gap-4 md:gap-6 min-w-0">
    {num && !compact && (
      <span
        aria-hidden="true"
        style={OUTLINE}
        className="hidden sm:block select-none font-extrabold leading-none tracking-tighter text-5xl md:text-7xl shrink-0 -mt-1"
      >
        {num}
      </span>
    )}
    <div className="flex flex-col min-w-0">
      {eyebrow && (
        <span className={`font-mono font-black uppercase text-white/55 ${compact ? 'text-tag tracking-[0.3em] mb-1' : 'text-meta tracking-[0.4em] mb-1.5'}`}>
          {eyebrow}
        </span>
      )}
      <h3 className={`font-extralight tracking-tight m-0 italic ${compact ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl'} ${muted ? 'text-slate-300' : 'text-white'}`}>
        {title}
      </h3>
      {proves && !compact && (
        <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-2xl">
          <span className="font-mono text-tag font-black uppercase tracking-[0.2em] text-amberGold/90 mr-2">Proves</span>
          {proves}
        </p>
      )}
    </div>
  </div>
);

export default StageTitle;
