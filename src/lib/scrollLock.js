/*
  scrollLock — counter-based lock for document.body.style.overflow.

  Multiple overlays (splash gate, workload drawer) can want the page scroll
  locked at the same time. Assigning body.style.overflow directly means
  "whoever unmounts last wins": one overlay closing could unlock scroll under
  another that is still open. Every owner must go through lockScroll/
  unlockScroll; never touch body.style.overflow directly.
*/
let locks = 0;

export const lockScroll = () => {
  if (typeof document === 'undefined') return;
  locks += 1;
  if (locks === 1) document.body.style.overflow = 'hidden';
};

export const unlockScroll = () => {
  if (typeof document === 'undefined') return;
  locks = Math.max(0, locks - 1);
  if (locks === 0) document.body.style.overflow = '';
};
