import { useEffect, useState } from 'react';

/*
  route.js — the smallest router that fits (V6). No dependency: three routes do
  not justify react-router, and a new dependency is an escalation trigger.

  Hash routing, because the site is served from GitHub Pages with `base: './'`:
  a path route would 404 on refresh with no 404.html to catch it.

  Two kinds of hash share the URL, and both must keep working:
    #/writing, #/journey  — routes (always start with "/")
    #layer-3, #topology   — LEGACY section anchors. They are a frozen public
                            contract (Decision Record 2026-07-11 §3, deviations #14):
                            reprodev posts link to them. They resolve to the home
                            page plus an `anchor` the page scrolls to after mount.
  Two legacy anchors now live on their own pages and are redirected there.
*/

export const ROUTES = {
  home: '/',
  writing: '/writing',
  journey: '/journey',
};

const KNOWN_PATHS = new Set(Object.values(ROUTES));

// Section ids that moved off the home page in V6.
const LEGACY_REDIRECTS = {
  'knowledge-base': ROUTES.writing,
  'layer-journey': ROUTES.journey,
};

export const parseHash = (hash = typeof window !== 'undefined' ? window.location.hash : '') => {
  const h = (hash || '').replace(/^#/, '');
  if (h.startsWith('/')) {
    const path = h.split('?')[0].replace(/\/+$/, '') || '/';
    return { path: KNOWN_PATHS.has(path) ? path : ROUTES.home, anchor: null };
  }
  if (LEGACY_REDIRECTS[h]) return { path: LEGACY_REDIRECTS[h], anchor: null, redirect: true };
  return { path: ROUTES.home, anchor: h || null };
};

/* True when the visitor arrived with any hash at all — a route or a section
   anchor. Deep links skip the splash for the session (see App.jsx). */
export const hasDeepLink = () =>
  typeof window !== 'undefined' && !!window.location.hash && !['#', '#/'].includes(window.location.hash);

export const navigate = (path) => {
  window.location.hash = path;
};

export const useRoute = () => {
  const [route, setRoute] = useState(() => parseHash());

  useEffect(() => {
    const sync = () => {
      const next = parseHash();
      // Rewrite a redirected legacy anchor in place so Back doesn't bounce.
      if (next.redirect) window.history.replaceState(null, '', `#${next.path}`);
      setRoute(next);
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  return route;
};
