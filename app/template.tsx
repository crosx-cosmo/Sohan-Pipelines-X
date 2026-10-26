'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { gentleEasing } from '@/lib/motion';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname]);

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
      className="flex-1 flex flex-col w-full min-w-0 max-w-full overflow-x-hidden gpu-accelerated"
    >
      {children}
    </motion.div>
  );
}
