'use client';

import * as React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * YouTube / Google-inspired intelligent route navigation progress bar.
 * Provides instant visual feedback on client-side SPA transitions without blocking interactions.
 */
export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [visible, setVisible] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const activeNavigationRef = React.useRef(false);

  // Clear timers helper
  const clearTimers = React.useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
  }, []);

  const completeProgress = React.useCallback(() => {
    clearTimers();
    activeNavigationRef.current = false;
    setProgress(100);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      timerRef.current = setTimeout(() => {
        setProgress(0);
      }, 200);
    }, 180);
  }, [clearTimers]);

  const startProgress = React.useCallback(() => {
    clearTimers();
    activeNavigationRef.current = true;
    setVisible(true);
    setProgress(15);

    timerRef.current = setTimeout(() => {
      setProgress(45);
      timerRef.current = setTimeout(() => {
        setProgress(75);
        timerRef.current = setTimeout(() => {
          setProgress(88);
        }, 300);
      }, 250);
    }, 120);

    // Safety timeout in case navigation is cancelled or errors
    safetyTimeoutRef.current = setTimeout(() => {
      completeProgress();
    }, 6000);
  }, [clearTimers, completeProgress]);

  // When pathname or searchParams change, the new route has successfully mounted!
  React.useEffect(() => {
    if (activeNavigationRef.current) {
      completeProgress();
    }
  }, [pathname, searchParams, completeProgress]);

  // Intercept internal link clicks and popstate events
  React.useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Ignore modified clicks (cmd, ctrl, shift, alt) or non-primary mouse buttons
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Ignore external, target=_blank, protocol links, and hash-only links
      if (
        target.getAttribute('target') === '_blank' ||
        target.getAttribute('download') ||
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#')
      ) {
        return;
      }

      // Check if it's the exact same path and query
      const url = new URL(target.href, window.location.href);
      const isSamePath =
        url.pathname === window.location.pathname &&
        url.search === window.location.search;

      if (isSamePath && url.hash) {
        // In-page anchor jump; do not trigger route progress
        return;
      }

      if (url.origin === window.location.origin && !isSamePath) {
        startProgress();
      }
    };

    const handlePopState = () => {
      startProgress();
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      window.removeEventListener('popstate', handlePopState);
      clearTimers();
    };
  }, [startProgress, clearTimers]);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px] pointer-events-none overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-sky-400 to-amber-400 transition-all duration-200 ease-out shadow-[0_0_8px_rgba(56,189,248,0.7),0_0_4px_rgba(2,132,199,0.5)]"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          transitionProperty: 'width, opacity',
          transitionDuration: progress === 100 ? '150ms' : '220ms',
        }}
      />
    </div>
  );
}
