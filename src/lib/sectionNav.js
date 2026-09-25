import { triggerExpand } from './simBus';
import { parseHash, ROUTES } from './route';

/*
  sectionNav — one way to move to a section, shared by StageNav, SkimStrip, the
  bento CTAs and deep links (previously LayerHUD.scrollToSection).

  Delays are pinned in the invariants magic-number table (§9):
    SCROLL_DELAY        120ms — accordion-open delay before scrollIntoView; keep in
                        sync with CollapsibleSection's 200ms self-scroll.
    SIM_DISPATCH_DELAY  150ms — collapsed sections unmount their children, so a sim
                        fired in the same tick as triggerExpand has no listener
                        (invariants §1, deviations #23). Always defer.
*/
export const SCROLL_DELAY = 120;
export const SIM_DISPATCH_DELAY = 150;

// CollapsibleSection ids on the home page. Everything else (topology, stage-run)
// is a plain <section>: firing the accordion event for those would collapse and
// unmount whatever is open (deviations #27).
export const COLLAPSIBLE_IDS = new Set(['layer-code', 'layer-2', 'layer-1', 'layer-3', 'layer-4', 'layer-dr']);

export const scrollToId = (id, behavior = 'smooth') => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior, block: 'start' });
};

/*
  Go to a home-page section. From another page, hand off to the router: setting
  the hash to the section id is exactly a legacy deep link, which HomelabPage
  resolves after it mounts — one code path for both.
  Returns the timer id so callers holding a timers ref can clear it.
*/
export const goToSection = (id, { expand = false } = {}) => {
  if (parseHash().path !== ROUTES.home) {
    window.location.hash = id;
    return null;
  }
  if (expand && COLLAPSIBLE_IDS.has(id)) triggerExpand(id);
  return setTimeout(() => scrollToId(id), SCROLL_DELAY);
};
