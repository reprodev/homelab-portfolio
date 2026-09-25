import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';

/*
  TerminalPanel — mobile compact card for a terminal's scrolling output (V6).

  On a 390px column every layer used to linearise into a stack of monospace
  terminals, so they stopped being an accent and became the page (CLAUDE.md open
  item "mobile content density"; deviations #31 follow-up). Below 768px this
  swaps a terminal's OUTPUT for a one-line result card — status dot, title, the
  latest line — with a 44px tap-to-expand. Nothing is removed: the full output is
  one tap away.

  Wrap only the scrolling viewport, never the controls around it — the sim
  buttons must stay visible on a phone.

  The output stays MOUNTED while compact (hidden with CSS, not unmounted): the
  logs are parent state, but auto-scroll refs and any listener living inside the
  subtree keep working, and expanding shows the live tail rather than a rebuild.
  Desktop renders children untouched.
*/
const TONES = {
  idle: 'bg-slate-500',
  ok: 'bg-emerald-400',
  busy: 'bg-amberGold',
  alert: 'bg-red-400',
  info: 'bg-violet-400',
};

const TerminalPanel = ({ title, line, tone = 'idle', live = false, className = '', children }) => {
  const isMobile = useIsMobile(768);
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);

  // Revealed output should show its tail, as the terminal would have.
  useEffect(() => {
    if (!open || !bodyRef.current) return;
    bodyRef.current.querySelectorAll('.overflow-y-auto').forEach((el) => {
      el.scrollTop = el.scrollHeight;
    });
  }, [open]);

  if (!isMobile) return children;

  return (
    <div className={`relative z-20 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl bg-black/90 border border-white/10 text-left font-mono active:scale-[0.99] transition-transform"
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${TONES[tone] || TONES.idle} ${live ? 'animate-pulse' : ''}`} />
        <span className="flex-1 min-w-0">
          <span className="block text-tag font-black uppercase tracking-widest text-slate-400 truncate">{title}</span>
          <span className="block text-meta text-slate-300 truncate">{line || 'Waiting for output…'}</span>
        </span>
        <span className="flex items-center gap-1 text-tag font-black uppercase tracking-wider text-azure-light shrink-0">
          {open ? 'Hide' : 'Output'}
          <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>
      <div ref={bodyRef} className={open ? 'mt-2' : 'hidden'}>
        {children}
      </div>
    </div>
  );
};

export default TerminalPanel;
