import React, { Suspense, useEffect, useRef } from 'react';
import { Network } from 'lucide-react';
import Hero from '../components/Hero.jsx';
import SkimStrip from '../components/SkimStrip.jsx';
import CollapsibleSection from '../components/CollapsibleSection.jsx';
import StageTitle from '../components/StageTitle.jsx';
import StageBento from '../components/StageBento.jsx';
import AutomationLayer from '../components/AutomationLayer.jsx';
import HardwareLayer from '../components/HardwareLayer.jsx';
import NetworkLayer from '../components/NetworkLayer.jsx';
import LogicalLayer from '../components/LogicalLayer.jsx';
import WorkloadLayer from '../components/WorkloadLayer.jsx';
import DRPipeline from '../components/DRPipeline.jsx';
import { STAGES } from '../data/stages';
import { triggerExpand } from '../lib/simBus';
import { COLLAPSIBLE_IDS, SCROLL_DELAY, scrollToId } from '../lib/sectionNav';

const Topology3D = React.lazy(() => import('../components/Topology3D.jsx'));

const stage = (id) => STAGES.find((s) => s.id === id);

// Mounts its children only once they scroll near the viewport, so the heavy
// WebGL topology chunk never costs first paint.
const LazyInView = ({ children, className, rootMargin = '300px' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = React.useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [visible, rootMargin]);
  return <div ref={ref} className={className}>{visible ? children : null}</div>;
};

/*
  HomelabPage — V6 route "/". Everything that owns or reacts to a simulation lives
  on this one page, because the bus has no replay: a DR drill here must still be
  able to recolour Topology3D, the cockpit and the orbs (the last two live in the
  App shell). Only sim-free content moved to its own route.

  Stage order is the lifecycle (Decision Record 2026-07-11, amended V6): Code →
  Provision → Run → Protect. Section ids are legacy addresses — never rename them.
  Every stage starts closed and shows its bento; `defaultExpanded` on layer-code
  was dropped in V6 (its CTA runs the sim in one click instead).
*/
const HomelabPage = ({ anchor, cockpit, setAmbientTheme }) => {
  const anchorTimerRef = useRef(null);

  /*
    Legacy deep links (#layer-3 from reprodev posts) and stage clicks from other
    pages both arrive as an `anchor`. No code read these before V6 — the splash
    covered them and every section started collapsed. Children have subscribed to
    the expand bus by the time this effect runs (child effects run first).
  */
  useEffect(() => {
    if (!anchor) return undefined;
    if (COLLAPSIBLE_IDS.has(anchor)) triggerExpand(anchor);
    anchorTimerRef.current = setTimeout(() => scrollToId(anchor), SCROLL_DELAY);
    return () => clearTimeout(anchorTimerRef.current);
  }, [anchor]);

  // Hover theming for a layer body: the orbs take that layer's colour.
  const themed = (theme, node) => (
    <div onMouseEnter={() => setAmbientTheme(theme)} onMouseLeave={() => setAmbientTheme('default')}>
      {node}
    </div>
  );

  const code = stage('layer-code');
  const provision = stage('layer-2');
  const run = stage('stage-run');
  const protect = stage('layer-dr');

  return (
    <>
      <Hero />
      <SkimStrip />
      {cockpit}

      <main className="max-w-[1300px] mx-auto px-6 py-10 md:py-14 space-y-8 md:space-y-10">
        {/* Live 3D Infrastructure Topology — the WebGL centerpiece */}
        <section id="topology" className="scroll-mt-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-2 border-b border-white/5 pb-4">
            <h2 className="text-2xl md:text-3xl font-extralight tracking-tight text-white m-0 italic flex items-center gap-3">
              <Network size={22} className="text-azure-light" /> Live Infrastructure Topology
            </h2>
            <span className="text-sm font-mono text-slate-400">
              Interactive 3D map · <strong className="text-azure-light font-normal uppercase tracking-tighter">reacts to every simulation</strong>
            </span>
          </div>
          <LazyInView>
            <Suspense fallback={
              <div className="w-full h-[460px] md:h-[560px] rounded-[2rem] border border-white/10 bg-black/40 flex items-center justify-center">
                <div className="text-white/55 text-meta md:text-xs font-mono uppercase tracking-[0.6em] animate-pulse">
                  Rendering Topology...
                </div>
              </div>
            }>
              <Topology3D />
            </Suspense>
          </LazyInView>
        </section>

        <CollapsibleSection
          id="layer-code" num={code.num} layerId="Lifecycle 01 · Code" title={code.fullTitle}
          proves={code.proves} summary={<StageBento stage={code} />}
        >
          {themed('layer-code', <AutomationLayer />)}
        </CollapsibleSection>

        <CollapsibleSection
          id="layer-2" num={provision.num} layerId="Lifecycle 02 · Provision" title={provision.fullTitle}
          proves={provision.proves} summary={<StageBento stage={provision} />}
        >
          {themed('layer-2', <HardwareLayer />)}
        </CollapsibleSection>

        {/* Run is three sections under one stage header + bento. The wrapper is a
            plain <section> (not collapsible) — it is the nav/scrollspy target. */}
        <section id="stage-run" className="scroll-mt-6 rounded-[2rem] border border-white/5 bg-white/[0.01] p-5 lg:p-8">
          <StageTitle num={run.num} eyebrow="Lifecycle 03 · Run" title={run.fullTitle} proves={run.proves} />
          <StageBento stage={run} />
          <div className="mt-6 space-y-3">
            <CollapsibleSection compact id="layer-1" layerId="Run — Edge" title="Edge & Auth Ingress">
              {themed('layer-1', <NetworkLayer />)}
            </CollapsibleSection>
            <CollapsibleSection compact id="layer-3" layerId="Run — Fleet" title="Compute Fleet & Orchestration">
              {themed('layer-3', <LogicalLayer />)}
            </CollapsibleSection>
            <CollapsibleSection compact id="layer-4" layerId="Run — Workloads" title="Distributed Workloads">
              {themed('layer-4', <WorkloadLayer />)}
            </CollapsibleSection>
          </div>
        </section>

        <CollapsibleSection
          id="layer-dr" num={protect.num} layerId="Lifecycle 04 · Protect" title={protect.fullTitle}
          proves={protect.proves} summary={<StageBento stage={protect} />}
        >
          {themed('layer-dr', <DRPipeline />)}
        </CollapsibleSection>
      </main>
    </>
  );
};

export default HomelabPage;
