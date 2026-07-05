import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../lib/simBus';

/*
  Reveal — site-wide scroll-reveal wrapper (V5.0 showstopper pass).

  Wraps any block so it fades/rises into place the first time it scrolls into
  view. Use `delay` to stagger siblings (e.g. index * 0.08). Respects
  prefers-reduced-motion by rendering children statically.

    <Reveal><Card .../></Reveal>
    {items.map((item, i) => <Reveal key={item.id} delay={i * 0.08}>...</Reveal>)}
*/
const Reveal = ({ children, delay = 0, y = 28, className, once = true }) => {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
