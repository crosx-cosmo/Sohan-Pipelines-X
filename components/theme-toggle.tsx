'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

const emptySubscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isDark = mounted && resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
      className={cn(
        'group relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-300 ease-in-out',
        'border border-border/70 dark:border-border/50',
        'backdrop-blur-md shadow-inner shadow-black/5 dark:shadow-black/20',
        // Track appearance
        isDark
          ? 'bg-slate-900/90 text-slate-100 hover:border-primary/40'
          : 'bg-slate-200/90 text-slate-800 hover:border-primary/50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
    >
      {/* Background track ambient icons */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 text-[10px]">
        {/* Sun on left */}
        <Sun
          className={cn(
            'h-3 w-3 transition-opacity duration-200',
            isDark ? 'opacity-30 text-muted-foreground' : 'opacity-0'
          )}
        />
        {/* Moon on right */}
        <Moon
          className={cn(
            'h-3 w-3 transition-opacity duration-200',
            isDark ? 'opacity-0' : 'opacity-30 text-muted-foreground'
          )}
        />
      </span>

      {/* Sliding Thumb */}
      <motion.div
        className={cn(
          'relative z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-md transition-colors',
          'border border-white/20 dark:border-white/10',
          isDark
            ? 'bg-slate-950 text-sky-300 shadow-slate-950/60'
            : 'bg-white text-amber-500 shadow-slate-400/40'
        )}
        animate={{
          x: isDark ? 24 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 450,
          damping: 28,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, scale: 0.3, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.3, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex items-center justify-center"
            >
              <Moon className="h-3.5 w-3.5 fill-sky-300/30 text-sky-300 stroke-[2.2]" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, scale: 0.3, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.3, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex items-center justify-center"
            >
              <Sun className="h-3.5 w-3.5 fill-amber-500/30 text-amber-500 stroke-[2.2]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}
