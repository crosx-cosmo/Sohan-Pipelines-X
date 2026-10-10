'use client';

import * as React from 'react';
import Image from 'next/image';
import { SITE_LOGO_URL } from '@/lib/site-logo';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadgeOnly?: boolean;
}

const sizeMap = {
  sm: { px: 32, box: 'h-8 w-8', text: 'text-xs' },
  md: { px: 40, box: 'h-10 w-10', text: 'text-sm sm:text-base' },
  lg: { px: 48, box: 'h-12 w-12', text: 'text-base sm:text-lg' },
  xl: { px: 64, box: 'h-16 w-16', text: 'text-lg sm:text-xl' },
};

/**
 * High-DPI Upscaled Brand Logo with vector-sharp fallback and subpixel rendering
 */
export function BrandLogo({ className, size = 'md' }: BrandLogoProps) {
  const { px, box } = sizeMap[size];
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden ring-1 ring-border/80 shadow-crisp-xs bg-card flex items-center justify-center shrink-0 render-crisp',
        box,
        className
      )}
    >
      {!imageError ? (
        <Image
          src={SITE_LOGO_URL}
          alt="Sohan Pipeline's & Plumbing"
          width={px * 2} // 2x density for retina upscaling
          height={px * 2}
          quality={100}
          unoptimized
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          priority
        />
      ) : (
        /* Vector Emblem Fallback (Infinite resolution SVG) */
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full p-1 text-primary"
        >
          <rect width="32" height="32" rx="7" fill="currentColor" fillOpacity="0.12" />
          <path
            d="M21 9H13C10.8 9 9 10.8 9 13C9 15.2 10.8 17 13 17H19C21.2 17 23 18.8 23 21C23 23.2 21.2 25 19 25H11"
            stroke="currentColor"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="11" cy="25" r="1.6" fill="#0284c7" />
          <circle cx="21" cy="9" r="1.6" fill="#0284c7" />
        </svg>
      )}
    </div>
  );
}
