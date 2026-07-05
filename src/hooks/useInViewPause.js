import { useState, useEffect, useRef } from 'react';

/*
  useInViewPause — returns [ref, inView]. Attach the ref to a container and
  gate interval-driven simulations (sparklines, log streams, WebGL frameloops)
  on `inView`, so they stop burning CPU once their section scrolls away
  instead of running off-screen for the life of the page.
*/
const useInViewPause = (rootMargin = '200px') => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true); // no observer support -> never pause
      return undefined;
    }
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [rootMargin]);

  return [ref, inView];
};

export default useInViewPause;
