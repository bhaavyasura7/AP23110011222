import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const yBg = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div ref={ref} className="hero-section">
      {/* Parallax background pattern */}
      <motion.div style={{ y: yBg }} className="hero-bg-pattern">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F59E0B" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

      {/* Parallax text */}
      <motion.div style={{ y: yText, opacity }} className="hero-content">
        <h1 className="hero-title">
          Stay Connected. <br />
          <span className="hero-title-accent">Never Miss Out.</span>
        </h1>
        <p className="hero-subtitle">
          Your warm, unified hub for campus placements, results, and events.
        </p>
      </motion.div>
    </div>
  );
}
