import { useState, useEffect } from 'react';

/*
  useIsMobile — single source of truth for the viewport-width gate.
  Replaces the hand-rolled resize listeners previously duplicated across
  Hero, SplashHub, LayerHUD, NetworkLayer, and the one-shot (never-updating)
  reads in Topology3D/HypervisorTopology3D.

  Breakpoints in use across the site: 768 (content layout), 1024 (splash
  cards / 3D canvas fallback). Pass explicitly to keep intent visible.
*/
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
