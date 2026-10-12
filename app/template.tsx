'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { gentleEasing } from '@/lib/motion';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.28,
        ease: gentleEasing,
      }}
      style={{ willChange: 'opacity, transform' }}
      className="flex-1 flex flex-col w-full gpu-accelerated"
    >
      {children}
    </motion.div>
  );
}
