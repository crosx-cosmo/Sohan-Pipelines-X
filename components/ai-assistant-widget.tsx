'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, MessageSquareText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Lazy-load the heavy interactive chat panel only when opened by the user
const AiAssistantPanel = dynamic(() => import('@/components/ai-assistant-panel'), {
  ssr: false,
  loading: () => (
    <div className="fixed bottom-20 right-3 left-3 sm:left-auto sm:right-5 md:bottom-20 md:right-6 sm:w-[400px] md:w-[420px] h-[340px] z-50 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center gap-3 p-6">
      <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center animate-pulse">
        <Sparkles className="h-5 w-5" />
      </div>
      <p className="text-xs font-medium text-muted-foreground">
        Opening SOHAN PIPELINES AI Assistant...
      </p>
    </div>
  ),
});

export function AiAssistantWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasInteracted, setHasInteracted] = React.useState(false);

  const handleToggle = () => {
    setHasInteracted(true);
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {hasInteracted && isOpen && (
          <AiAssistantPanel onClose={handleClose} onMinimize={handleClose} />
        )}
      </AnimatePresence>

      {/* Fixed Floating AI Assistant Trigger Button — Positioned above MobileQuickBar on mobile */}
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 print:hidden">
        <motion.button
          type="button"
          onClick={handleToggle}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          aria-expanded={isOpen}
          aria-label={
            isOpen
              ? 'Close SOHAN PIPELINES AI Customer Assistant'
              : 'Open SOHAN PIPELINES AI Customer Assistant'
          }
          className={cn(
            'group relative flex items-center gap-2.5 rounded-full border px-3.5 py-2.5 md:px-4 md:py-3 shadow-lg transition-all duration-200 render-crisp',
            isOpen
              ? 'border-border/80 bg-card text-foreground shadow-md'
              : 'border-primary/25 bg-primary text-primary-foreground shadow-primary/25 hover:shadow-xl hover:shadow-primary/30'
          )}
        >
          {/* Subtle online status indicator */}
          {!isOpen && (
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
          )}

          {isOpen ? (
            <>
              <X className="h-4 w-4 shrink-0" />
              <span className="text-xs font-semibold tracking-tight">Close Assistant</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 shrink-0" />
              <span className="text-xs font-semibold tracking-tight">AI Assistant</span>
              <MessageSquareText className="hidden sm:inline-block h-3.5 w-3.5 opacity-80 shrink-0" />
            </>
          )}
        </motion.button>
      </div>
    </>
  );
}
