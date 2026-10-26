'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Camera,
} from 'lucide-react';
import { luxuryEasing } from '@/lib/motion';

export interface GalleryImageItem {
  id: string;
  originalUrl: string;
  src: string;
  title: string;
  category: string;
  desktopSpan: string;
  aspectClass: string;
}

export const plumbingGalleryItems: GalleryImageItem[] = [
  {
    id: 'wa-0004',
    originalUrl: 'https://jlfqodfdqkbunqfaffut.supabase.co/storage/v1/object/public/Plumbing%20Assets/IMG-20261014-WA0004.jpg',
    src: 'https://jlfqodfdqkbunqfgffut.supabase.co/storage/v1/object/public/Plumbing%20Assets/IMG-20261014-WA0004.jpg',
    title: 'Modern Shower Enclosure & Bathroom Fittings',
    category: 'Shower Enclosure',
    desktopSpan: 'col-span-1 sm:col-span-7',
    aspectClass: 'h-36 sm:h-48',
  },
  {
    id: 'wa-0005',
    originalUrl: 'https://jlfqodfdqkbunqfaffut.supabase.co/storage/v1/object/public/Plumbing%20Assets/IMG-20261014-WA0005.jpg',
    src: 'https://jlfqodfdqkbunqfgffut.supabase.co/storage/v1/object/public/Plumbing%20Assets/IMG-20261014-WA0005.jpg',
    title: 'Reliable Water Outlet & Tap Fittings',
    category: 'Water Outlets',
    desktopSpan: 'col-span-1 sm:col-span-5',
    aspectClass: 'h-36 sm:h-48',
  },
  {
    id: 'wa-0006',
    originalUrl: 'https://jlfqodfdqkbunqfaffut.supabase.co/storage/v1/object/public/Plumbing%20Assets/IMG-20261014-WA0006.jpg',
    src: 'https://jlfqodfdqkbunqfgffut.supabase.co/storage/v1/object/public/Plumbing%20Assets/IMG-20261014-WA0006.jpg',
    title: 'Bathroom Sanitaryware & Flush System',
    category: 'Sanitaryware',
    desktopSpan: 'col-span-1 sm:col-span-5',
    aspectClass: 'h-36 sm:h-48',
  },
  {
    id: 'wa-0007',
    originalUrl: 'https://jlfqodfdqkbunqfaffut.supabase.co/storage/v1/object/public/Plumbing%20Assets/IMG-20261014-WA0007.jpg',
    src: 'https://jlfqodfdqkbunqfgffut.supabase.co/storage/v1/object/public/Plumbing%20Assets/IMG-20261014-WA0007.jpg',
    title: 'Water Heater & Hot-Water Connections',
    category: 'Hot-Water Lines',
    desktopSpan: 'col-span-1 sm:col-span-7',
    aspectClass: 'h-36 sm:h-48',
  },
  {
    id: 'wa-0008',
    originalUrl: 'https://jlfqodfdqkbunqfaffut.supabase.co/storage/v1/object/public/Plumbing%20Assets/IMG-20261014-WA0008.jpg',
    src: 'https://jlfqodfdqkbunqfgffut.supabase.co/storage/v1/object/public/Plumbing%20Assets/IMG-20261014-WA0008.jpg',
    title: 'Designer Wash Basin & Faucet Fittings',
    category: 'Designer Basin',
    desktopSpan: 'col-span-1 sm:col-span-6',
    aspectClass: 'h-36 sm:h-44',
  },
  {
    id: 'wa-0009',
    originalUrl: 'https://jlfqodfdqkbunqfaffut.supabase.co/storage/v1/object/public/Plumbing%20Assets/IMG-20261014-WA0009.jpg',
    src: 'https://jlfqodfdqkbunqfgffut.supabase.co/storage/v1/object/public/Plumbing%20Assets/IMG-20261014-WA0009.jpg',
    title: 'Shower Fixtures & Bathroom Finishing',
    category: 'Fixtures & Finish',
    desktopSpan: 'col-span-1 sm:col-span-6',
    aspectClass: 'h-36 sm:h-44',
  },
];

export function HeroPlumbingGallery() {
  const [activeModalIndex, setActiveModalIndex] = React.useState<number | null>(null);

  // Close modal on escape or arrow navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModalIndex(null);
      if (e.key === 'ArrowRight' && activeModalIndex !== null) {
        setActiveModalIndex((prev) => (prev !== null && prev < plumbingGalleryItems.length - 1 ? prev + 1 : 0));
      }
      if (e.key === 'ArrowLeft' && activeModalIndex !== null) {
        setActiveModalIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : plumbingGalleryItems.length - 1));
      }
    };
    if (activeModalIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [activeModalIndex]);

  return (
    <div className="relative h-full flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-3.5 sm:p-5 lg:p-6 shadow-crisp-lg gpu-accelerated">
      {/* Editorial Gallery Header */}
      <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-border/70">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Camera className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-foreground leading-tight flex flex-wrap items-center gap-1.5">
              <span className="truncate">Verified On-Site Installations</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                LIVE WORKS
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
              Real architectural plumbing completed across South Bengal
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-muted-foreground shrink-0">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>ISI Certified</span>
        </div>
      </div>

      {/* Responsive 2x3 Mobile / Asymmetric 12-Col Bento Grid */}
      <div className="my-3.5 grid grid-cols-2 sm:grid-cols-12 gap-2.5 sm:gap-3">
        {plumbingGalleryItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: 0.05 * index,
              ease: luxuryEasing,
            }}
            whileHover={{ y: -2 }}
            onClick={() => setActiveModalIndex(index)}
            className={`group relative rounded-2xl overflow-hidden border border-border/70 bg-muted/40 cursor-pointer select-none transition-shadow duration-300 hover:shadow-md hover:border-primary/50 ${item.desktopSpan} ${item.aspectClass}`}
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
              referrerPolicy="no-referrer"
              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />

            {/* Gradient Overlay for Typography Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent flex flex-col justify-between p-2.5 sm:p-3.5 z-10 transition-opacity duration-200">
              {/* Category Tag & Zoom Trigger */}
              <div className="flex items-center justify-between gap-1 w-full">
                <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-xs text-sky-300 border border-white/10 truncate">
                  {item.category}
                </span>
                <span className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-slate-950/50 backdrop-blur-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center shrink-0">
                  <Maximize2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </span>
              </div>

              {/* Caption */}
              <div>
                <p className="text-white text-[11px] sm:text-[13px] font-semibold leading-snug line-clamp-2 drop-shadow-xs group-hover:text-sky-200 transition-colors">
                  {item.title}
                </p>
                <p className="hidden sm:block text-[10px] text-slate-300/80 mt-0.5 truncate">
                  Paschim &amp; Purba Medinipur Worksite
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Gallery Footer Action Strip */}
      <div className="pt-3 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
          <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="truncate">Tap any photo for high-resolution view</span>
        </div>

        <Link
          href="/services#how-it-works"
          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline text-xs shrink-0"
        >
          <span>How Our Service Works</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Full-Screen High-Resolution Lightbox Modal */}
      <AnimatePresence>
        {activeModalIndex !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalIndex(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: luxuryEasing }}
              className="relative z-10 w-full max-w-3xl rounded-3xl overflow-hidden bg-card border border-border shadow-2xl flex flex-col"
            >
              {/* Top Modal Controls */}
              <div className="p-4 sm:p-5 border-b border-border/70 flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {plumbingGalleryItems[activeModalIndex].category}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {activeModalIndex + 1} of {plumbingGalleryItems.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveModalIndex((prev) =>
                        prev !== null && prev > 0 ? prev - 1 : plumbingGalleryItems.length - 1
                      )
                    }
                    className="h-8 w-8 rounded-lg border border-border/80 bg-card text-foreground hover:bg-muted flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveModalIndex((prev) =>
                        prev !== null && prev < plumbingGalleryItems.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="h-8 w-8 rounded-lg border border-border/80 bg-card text-foreground hover:bg-muted flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModalIndex(null)}
                    className="h-8 w-8 rounded-lg border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors cursor-pointer ml-1"
                    aria-label="Close image modal"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Main Expanded Image */}
              <div className="relative h-80 sm:h-96 md:h-[460px] w-full bg-slate-950">
                <Image
                  src={plumbingGalleryItems[activeModalIndex].src}
                  alt={plumbingGalleryItems[activeModalIndex].title}
                  fill
                  sizes="100vw"
                  referrerPolicy="no-referrer"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Bottom Details */}
              <div className="p-4 sm:p-5 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card">
                <div>
                  <h4 className="font-display font-bold text-sm sm:text-base text-foreground">
                    {plumbingGalleryItems[activeModalIndex].title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Executed according to national plumbing code with zero-leak hydraulic guarantees.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/book"
                    onClick={() => setActiveModalIndex(null)}
                    className="inline-flex items-center justify-center text-xs font-semibold h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
                  >
                    Book Installation
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
