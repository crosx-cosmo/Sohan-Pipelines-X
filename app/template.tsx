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
      initial={shouldReduceMotion ? false : { opacity: 0.92 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.18,
        ease: gentleEasing,
      }}
      style={{ willChange: 'opacity' }}
      className="flex-1 flex flex-col w-full gpu-accelerated"
    >
      {children}
    </motion.div>
  );
}
