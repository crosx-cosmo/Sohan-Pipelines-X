'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Calendar, ArrowRight } from 'lucide-react';
import { businessInfo } from '@/lib/business-info';

export function MobileQuickBar() {
  const pathname = usePathname();

  // If already on the booking page, don't obstruct the form
  if (pathname === '/book') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card/95 dark:bg-card/90 backdrop-blur-xl border-t border-border/80 px-3 py-2.5 shadow-crisp-lg safe-bottom render-crisp">
      <div className="flex items-center gap-2.5 max-w-md mx-auto">
        <a
          href={`tel:${businessInfo.phone}`}
          className="flex-1 flex items-center justify-center gap-2 h-11 px-3 rounded-xl bg-card border border-border/80 text-foreground font-semibold text-xs shadow-crisp-xs active:scale-[0.98] transition-[color,background-color,border-color,box-shadow,transform] duration-150 hover:bg-muted/60"
        >
          <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="truncate">Call Hotline</span>
        </a>

        <Link
          href="/book"
          className="flex-1 flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-md shadow-primary/20 active:scale-[0.98] transition-[color,background-color,border-color,box-shadow,transform] duration-150"
        >
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Book Service</span>
          <ArrowRight className="h-3 w-3 shrink-0 opacity-80" />
        </Link>
      </div>
    </div>
  );
}
