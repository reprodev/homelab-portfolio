import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Map, Home, MoreHorizontal, ArrowUp } from 'lucide-react';
import { STAGES, stageForSection } from '../data/stages';
import { ROUTES, navigate } from '../lib/route';
import { goToSection } from '../lib/sectionNav';
import { playSound } from '../lib/audio';
import useIsMobile from '../hooks/useIsMobile';

/*
  StageNav — V6 navigation: a left rail on desktop, a bottom tab bar on phones.
  Replaces LayerHUD's floating nav (which also overlapped content at 1280–1500px,
  deviations #22 — the content column now reserves the rail's width instead).

  Stages scroll to their summary rather than force-opening the section: the bento
  is the landing point, and Run is three sections that cannot all open at once
  under the accordion rule. From another page a stage click becomes a legacy
  deep link (goToSection), so there is one code path for both.

  Z-band 30–40 (invariants §6) — below the noise overlay, so no escalation.
  The scrollspy observes on every route change: the old one observed once on
  mount and would never have seen a page swapped in later.
*/
const PAGES = [
  { path: ROUTES.writing, label: 'Blog & Builds', Icon: BookOpen },
  { path: ROUTES.journey, label: 'Learning Path', Icon: Map },
];

const useActiveStage = (enabled) => {
  const [active, setActive] = useState(null);
  useEffect(() => {
    if (!enabled) { setActive(null); return undefined; }
    /* The last stage can never reach the observer's band: once V6 shortened the
       page, Protect sits at the bottom with too little below it to scroll up
       that far, so the rail showed "Run" while you were reading Protect. At the
       foot of the page the last stage wins — checked in BOTH callbacks, because
       the observer fires after the scroll event and would otherwise overwrite it
       with whatever tail of Run is still in the band. Two cheap property reads. */
    const lastStage = STAGES[STAGES.length - 1].id;
    const atBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

    const obs = new IntersectionObserver(
      (entries) => {
        if (atBottom()) { setActive(lastStage); return; }
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(stageForSection(entry.target.id)?.id ?? null);
            break;
          }
        }
      },
      { rootMargin: '-15% 0px -65% 0px' }
    );
    ['topology', ...STAGES.flatMap((s) => s.sections)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    const onScroll = () => { if (atBottom()) setActive(lastStage); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [enabled]);
  return active;
};

const StageNav = ({ route }) => {
  const isMobile = useIsMobile(1024);
  const onHome = route.path === ROUTES.home;
  const active = useActiveStage(onHome);
  const [moreOpen, setMoreOpen] = useState(false);
  const activeIndex = STAGES.findIndex((s) => s.id === active);

  useEffect(() => { setMoreOpen(false); }, [route.path, isMobile]);

  const goStage = (stage) => {
    playSound('click');
    setMoreOpen(false);
    goToSection(stage.id);
  };
  const goPage = (path) => {
    playSound('click');
    setMoreOpen(false);
    navigate(path);
  };
  const goTop = () => {
    playSound('click');
    setMoreOpen(false);
    if (onHome) window.scrollTo({ top: 0, behavior: 'smooth' });
    else navigate(ROUTES.home);
  };

  if (isMobile) {
    const pageActive = PAGES.some((p) => p.path === route.path);
    return (
      <>
        <AnimatePresence>
          {moreOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="fixed inset-x-3 z-40 rounded-2xl bg-slate-950/95 border border-white/10 backdrop-blur-xl p-2 shadow-2xl"
              style={{ bottom: 'calc(4.75rem + env(safe-area-inset-bottom))' }}
            >
              <button type="button" onClick={goTop} className="w-full min-h-[48px] flex items-center gap-3 px-3 rounded-xl text-left text-sm text-slate-200 hover:bg-white/5">
                {onHome ? <ArrowUp size={16} className="text-azure-light" /> : <Home size={16} className="text-azure-light" />}
                {onHome ? 'Back to top' : 'The lab'}
              </button>
              {PAGES.map(({ path, label, Icon }) => (
                <button
                  key={path}
                  type="button"
                  onClick={() => goPage(path)}
                  className={`w-full min-h-[48px] flex items-center gap-3 px-3 rounded-xl text-left text-sm hover:bg-white/5 ${route.path === path ? 'text-white bg-white/5' : 'text-slate-200'}`}
                >
                  <Icon size={16} className="text-amberGold" />
                  {label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <nav
          aria-label="Lifecycle stages"
          className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/90 border-t border-white/10 backdrop-blur-xl"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="grid grid-cols-5">
            {STAGES.map((stage) => {
              const isActive = active === stage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => goStage(stage)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`min-h-[60px] flex flex-col items-center justify-center gap-0.5 transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`}
                >
                  <span className={`font-mono text-tag font-black ${isActive ? 'text-azure-light' : 'text-slate-400'}`}>{stage.num}</span>
                  <span className="text-label font-bold uppercase tracking-wider">{stage.short}</span>
                  <span className={`h-0.5 w-6 rounded-full mt-0.5 transition-colors ${isActive ? 'bg-azure' : 'bg-transparent'}`} />
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => { playSound('click'); setMoreOpen((o) => !o); }}
              aria-expanded={moreOpen}
              className={`min-h-[60px] flex flex-col items-center justify-center gap-0.5 ${moreOpen || pageActive ? 'text-white' : 'text-slate-400'}`}
            >
              <MoreHorizontal size={16} className={pageActive ? 'text-amberGold' : ''} />
              <span className="text-label font-bold uppercase tracking-wider">More</span>
              <span className={`h-0.5 w-6 rounded-full mt-0.5 ${pageActive ? 'bg-amberGold' : 'bg-transparent'}`} />
            </button>
          </div>
        </nav>
      </>
    );
  }

  // Desktop rail
  const railItem = (key, { label, isActive, onClick, children, accent = 'azure' }) => (
    <button
      key={key}
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={isActive ? 'true' : undefined}
      className={`group relative flex items-center justify-center w-12 h-12 rounded-xl border transition-all active:scale-95 ${
        isActive
          ? accent === 'amber'
            ? 'bg-amberGold/15 border-amberGold/50 text-amberGold'
            : 'bg-azure/20 border-azure/60 text-white'
          : 'bg-slate-950/85 border-white/10 text-slate-400 hover:text-white hover:border-azure/40'
      }`}
    >
      {children}
      <span className="pointer-events-none absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-black/90 border border-white/10 text-white text-meta font-mono uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
        {label}
      </span>
    </button>
  );

  return (
    <nav
      aria-label="Lifecycle stages"
      className="fixed left-3 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 p-1.5 rounded-2xl bg-slate-950/60 border border-white/5 backdrop-blur-xl"
    >
      {railItem('home', { label: onHome ? 'Top of the lab' : 'The lab', isActive: onHome && active === null, onClick: goTop, children: <Home size={16} /> })}

      <div className="relative flex flex-col gap-2 py-1">
        {/* progress spine behind the stage buttons */}
        <span aria-hidden="true" className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px bg-white/10" />
        <span
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 top-2 w-px bg-gradient-to-b from-azure to-amberGold transition-all duration-500"
          style={{ height: activeIndex < 0 ? 0 : `calc(${((activeIndex + 1) / STAGES.length) * 100}% - 1rem)` }}
        />
        {STAGES.map((stage) =>
          railItem(stage.id, {
            label: `${stage.num} · ${stage.title}`,
            isActive: active === stage.id,
            onClick: () => goStage(stage),
            children: <span className="relative font-mono text-meta-lg font-black">{stage.num}</span>,
          })
        )}
      </div>

      <span aria-hidden="true" className="w-6 h-px bg-white/10 my-1" />

      {PAGES.map(({ path, label, Icon }) =>
        railItem(path, {
          label,
          isActive: route.path === path,
          onClick: () => goPage(path),
          accent: 'amber',
          children: <Icon size={16} />,
        })
      )}
    </nav>
  );
};

export default StageNav;
