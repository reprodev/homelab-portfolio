import React, { useRef, useState } from 'react';
import {
  Terminal, HardDrive, ExternalLink, Cpu, Code, Zap, Archive, Github,
  ChevronLeft, ChevronRight, Monitor, Network, Database, Music,
  Cloud, Layers, MessageSquare, Server,
} from 'lucide-react';
import Card from './Card';
import Reveal from './Reveal.jsx';
import {
  KNOWLEDGE, PROJECTS, FACETS, matchesFacet, facetCount, isRecent,
} from '../data/knowledge';

// Content lives in src/data/knowledge.js (JSX-free); icons resolve here.
const ICONS = {
  cloud: Cloud, layers: Layers, message: MessageSquare, archive: Archive,
  server: Server, database: Database, harddrive: HardDrive, network: Network,
  cpu: Cpu, terminal: Terminal, code: Code, zap: Zap, github: Github,
  monitor: Monitor, music: Music,
};

// `tags` defaults to [] so a new entry authored without one cannot crash the card
// (it is dereferenced via .includes and .map below, and via .some in matchesFacet).
const TutorialCard = ({ title, desc, iconKey, link, tags = [], time, type = "Guide", glowColor, image, parts, isNew }) => {
  const Icon = ICONS[iconKey] || Terminal;
  return (
  <div className="snap-center shrink-0 w-[85vw] md:w-auto h-full p-1">
    <Card 
      glowColor={glowColor}
      className="h-full border border-white/5"
    >
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex flex-col h-full group/link"
      >
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover/link:opacity-100 transition-opacity translate-x-2 group-hover/link:translate-x-0 z-20">
          <ExternalLink size={16} className="text-white/50" />
        </div>
        
        <div className="mb-6 relative flex items-start justify-between">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white border border-white/5 shadow-inner transition-all duration-500 group-hover/link:scale-110 group-hover/link:bg-white/5 relative z-10">
            <Icon size={28} strokeWidth={1.5} />
          </div>
          {/* Part count gives series cards their own visual weight — one card
              here stands for up to nine posts. */}
          {parts > 1 && (
            <span className="relative z-10 px-2 py-1 rounded-lg border border-azure/30 bg-azure/5 text-azure-light font-mono text-[9px] font-black uppercase tracking-wider">
              {parts} parts
            </span>
          )}
          {tags.includes("Featured") && (
             <div className="absolute top-0 left-0 w-20 h-20 bg-azure/10 rounded-full blur-xl -translate-x-4 -translate-y-4" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-4">
            {/* "New" is derived from the post date, not authored — see
                isRecent() in src/data/knowledge.js. */}
            {isNew && (
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-md text-[9px] font-black uppercase tracking-widest text-emerald-400">
                New
              </span>
            )}
            {tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded-md text-[9px] font-black uppercase tracking-widest text-slate-400">
                {tag}
              </span>
            ))}
          </div>

          <h4 className="text-lg font-bold text-white mb-3 tracking-tight leading-tight">{title}</h4>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">{desc}</p>

          {image && (
            <div className="mt-4 rounded-xl overflow-hidden border border-white/10 group-hover/link:border-azure/30 transition-all shadow-2xl bg-black relative aspect-video flex items-center justify-center p-2">
              <img
                src={image}
                alt={`${title} Preview`}
                loading="lazy"
                /* Every image here is a third-party CDN URL; hide the element
                   rather than render a broken-image glyph if one goes away. */
                onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                className="w-full h-full object-contain opacity-80 group-hover/link:opacity-100 transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/5">
          <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">
            {type === "Project" ? "View Project" : parts > 1 ? "Read Series" : "Read Guide"}
          </span>
          <span className="text-[10px] font-mono text-slate-600">{time}</span>
        </div>
      </a>
    </Card>
  </div>
  );
};

const CarouselHeader = ({ title, subtitle, badgeText, badgeColor, onScroll, showArrows }) => (
  <div className="px-4 md:px-0 mb-8">
    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-white/5 pb-6">
      <div className="flex-1">
        <h3 className="text-3xl font-extralight tracking-tight text-white m-0 italic">{title}</h3>
        <span className={`text-[10px] uppercase font-black tracking-[0.3em] mt-2 block h-4 ${badgeColor === 'emerald' ? 'text-emerald-400' : 'text-azure'}`}>{subtitle}</span>
      </div>
      
      <div className="flex items-center gap-6 self-end md:self-auto">
        {/* Arrows only where they can do anything: the row is a horizontally
            scrollable flex container on mobile, but a CSS grid from `md` up —
            scrollBy had nothing to act on there, so they were dead controls on
            the primary viewport (fixed V5.4). */}
        {showArrows && (
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onScroll('left')}
              className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all active:scale-90"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} className="text-slate-400" />
            </button>
            <button
              onClick={() => onScroll('right')}
              className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all active:scale-90"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>
        )}
        
        <div className={`flex items-center gap-2 px-3 py-1 bg-white/5 border rounded-full w-fit ${badgeColor === 'emerald' ? 'border-emerald-500/20' : 'border-azure/20'}`}>
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${badgeColor === 'emerald' ? 'bg-emerald-400' : 'bg-azure'}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${badgeColor === 'emerald' ? 'text-emerald-400' : 'text-azure'}`}>{badgeText}</span>
        </div>
      </div>
    </div>
  </div>
);

const KnowledgeLayer = () => {
  const guidesRef = useRef(null);
  const projectsRef = useRef(null);
  const [facetId, setFacetId] = useState('all');

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const activeFacet = FACETS.find((f) => f.id === facetId) || FACETS[0];
  const visible = KNOWLEDGE.filter((item) => matchesFacet(item, activeFacet));

  return (
    <section id="knowledge-base" className="mb-24 scroll-mt-24">
      {/* Knowledge Row — series + individual guides, filterable */}
      <CarouselHeader
        title="Lifecycle 05: Knowledge Base & Library"
        subtitle="Series, guides and field notes from reprodev.com"
        badgeText={`${KNOWLEDGE.length} Collections`}
        badgeColor="emerald"
        showArrows={true}
        onScroll={(dir) => scrollContainer(guidesRef, dir)}
      />

      {/* Facet filter — replaces the arrows as the desktop control. */}
      <div className="px-4 md:px-0 mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter knowledge base by topic">
        {FACETS.map((facet) => {
          const count = facet.tags ? facetCount(facet) : KNOWLEDGE.length;
          if (count === 0) return null; // never render a filter that yields nothing
          const active = facet.id === activeFacet.id;
          return (
            <button
              key={facet.id}
              onClick={() => setFacetId(facet.id)}
              aria-pressed={active}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl border font-mono text-[10px] font-black uppercase tracking-wider transition-colors ${
                active
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {facet.label}
              <span className="ml-1.5 opacity-50">{count}</span>
            </button>
          );
        })}
      </div>

      <div
        ref={guidesRef}
        /* 5 columns only at 2xl: at 1440 that left ~250px cards, too narrow for
           the series descriptions. 10 items divide cleanly into 5 at 2xl. */
        className="flex md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4 mb-20 overflow-x-auto md:overflow-x-visible px-4 md:px-0 snap-x snap-mandatory scrollbar-hide pb-8 md:pb-0"
      >
        {visible.map((item, idx) => (
          /* Keyed by id, not index, so filtering swaps cards rather than mutating
             the ones already mounted. Reveal (not a bare motion.div) keeps the
             viewport gating every other row uses — with up to 10 cards the lower
             rows would otherwise finish animating while still off-screen, and the
             Projects row directly below still uses Reveal. */
          <Reveal key={item.id} delay={idx * 0.04} className="snap-center shrink-0 md:shrink h-full">
            <TutorialCard {...item} isNew={isRecent(item)} />
          </Reveal>
        ))}
        <div className="md:hidden shrink-0 w-8" />
      </div>

      {/* Projects Row */}
      <CarouselHeader
        title="Developer Portfolio & Tools"
        subtitle="Custom Development & PowerShell Automation"
        badgeText={`${PROJECTS.length} Projects`}
        badgeColor="azure"
        showArrows={true}
        onScroll={(dir) => scrollContainer(projectsRef, dir)}
      />

      <div
        ref={projectsRef}
        className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-x-auto md:overflow-x-visible px-4 md:px-0 snap-x snap-mandatory scrollbar-hide pb-8 md:pb-0"
      >
        {PROJECTS.map((project, idx) => (
          <Reveal key={project.id} delay={idx * 0.08} className="snap-center shrink-0 md:shrink h-full">
            <TutorialCard {...project} type="Project" isNew={isRecent(project)} />
          </Reveal>
        ))}
        <div className="md:hidden shrink-0 w-8" />
      </div>

      <div className="mt-16 flex items-center justify-center px-4">
        <a 
          href="https://reprodev.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-10 py-4 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-500 text-sm font-bold text-slate-300 hover:text-emerald-400 flex flex-col md:flex-row items-center gap-4 group shadow-2xl text-center w-full md:w-auto"
        >
          <span>Explore All Knowledge Bases at reprodev.com</span>
          <ExternalLink size={18} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </a>
      </div>
    </section>
  );
};

export default KnowledgeLayer;
