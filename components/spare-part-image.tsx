'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Package,
  Wrench,
  Gauge,
  Droplets,
  Flame,
  Bath,
} from 'lucide-react';
import { getSparePartImageUrl } from '@/lib/spare-parts-mapping';
import { cn } from '@/lib/utils';

interface SparePartImageProps {
  name: string;
  category?: string | null;
  imagePath?: string | null;
  imageUrl?: string | null;
  sizes?: string;
  className?: string;
  isOutOfStock?: boolean;
  compact?: boolean;
}

function renderHardwarePlaceholderIcon(
  name: string,
  category: string | null | undefined,
  iconClassName: string
) {
  const combined = `${name || ''} ${category || ''}`.toLowerCase();
  if (
    combined.includes('valve') ||
    combined.includes('cock') ||
    combined.includes('nrv') ||
    combined.includes('regulator')
  ) {
    return <Gauge className={iconClassName} />;
  }
  if (
    combined.includes('tap') ||
    combined.includes('faucet') ||
    combined.includes('shower') ||
    combined.includes('diverter')
  ) {
    return <Droplets className={iconClassName} />;
  }
  if (
    combined.includes('geyser') ||
    combined.includes('heater') ||
    combined.includes('thermal')
  ) {
    return <Flame className={iconClassName} />;
  }
  if (
    combined.includes('sanitary') ||
    combined.includes('flush') ||
    combined.includes('cistern') ||
    combined.includes('basin')
  ) {
    return <Bath className={iconClassName} />;
  }
  if (
    combined.includes('pipe') ||
    combined.includes('fitting') ||
    combined.includes('elbow') ||
    combined.includes('tee') ||
    combined.includes('cpvc') ||
    combined.includes('upvc')
  ) {
    return <Wrench className={iconClassName} />;
  }
  return <Package className={iconClassName} />;
}

export function SparePartImage({
  name,
  category,
  imagePath,
  imageUrl,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  className,
  isOutOfStock = false,
  compact = false,
}: SparePartImageProps) {
  const resolvedUrl = React.useMemo(
    () =>
      getSparePartImageUrl({
        image_path: imagePath,
        image_url: imageUrl,
      }),
    [imagePath, imageUrl]
  );

  const [failedUrl, setFailedUrl] = React.useState<string | null>(null);
  const showImage = Boolean(resolvedUrl && failedUrl !== resolvedUrl);

  if (showImage && resolvedUrl) {
    return (
      <Image
        src={resolvedUrl}
        alt={name}
        fill
        sizes={sizes}
        referrerPolicy="no-referrer"
        onError={() => setFailedUrl(resolvedUrl)}
        className={cn(
          'object-cover transition-transform duration-500',
          isOutOfStock && 'grayscale-[40%]',
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-300 select-none overflow-hidden',
        isOutOfStock && 'opacity-75'
      )}
    >
      {/* Subtle Blueprint Grid Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl"
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-3">
        <div
          className={cn(
            'flex items-center justify-center rounded-2xl border border-sky-400/25 bg-sky-500/10 text-sky-300 shadow-inner',
            compact ? 'h-9 w-9 rounded-xl' : 'h-14 w-14 mb-2.5'
          )}
        >
          {renderHardwarePlaceholderIcon(
            name,
            category,
            compact ? 'h-4 w-4' : 'h-6 w-6'
          )}
        </div>
        {!compact && (
          <>
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-sky-300/90 font-semibold">
              {category || 'Genuine Hardware'}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 max-w-[180px]">
              Sohan Pipelines Counter
            </span>
          </>
        )}
      </div>
    </div>
  );
}
