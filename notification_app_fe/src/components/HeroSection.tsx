import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const yBg = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div 
      ref={ref} 
      className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-secondary mb-12"
    >
      <motion.div 
        style={{ y: yBg }} 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
      >
        {/* Abstract pattern for warm background */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/20" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>
      
      <motion.div 
        style={{ y: yText, opacity }}
        className="relative z-10 text-center px-4 max-w-3xl"
      >
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 tracking-tight">
          Stay Connected. <br/> <span className="text-primary italic">Never Miss Out.</span>
        </h1>
        <p className="text-xl text-muted-foreground font-sans">
          Your warm, unified hub for campus placements, results, and events.
        </p>
      </motion.div>
    </div>
  );
}
