'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Pause,
  Play,
  Camera,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import {
  Cinematic404Scene,
  type CameraPreset,
} from '@/components/cinematic-404-scene';
import { cn } from '@/lib/utils';

const PRODUCT_RECOVERY_LINKS = [
  { label: 'Pipes', href: '/spare-parts?category=pipes' },
  { label: 'Fittings', href: '/spare-parts?category=pipes&q=Fitting' },
  { label: 'Valves', href: '/spare-parts?category=valves' },
  { label: 'Spare Parts', href: '/spare-parts' },
  { label: 'Plumbing Solutions', href: '/services' },
];

export default function NotFound() {
  const [cameraPreset, setCameraPreset] = React.useState<CameraPreset>('cinema');
  const [isPaused, setIsPaused] = React.useState(false);
  const [replayTrigger, setReplayTrigger] = React.useState(0);
  const [controlsCollapsed, setControlsCollapsed] = React.useState(false);

  return (
    <section
      aria-labelledby="not-found-headline"
      className="relative min-h-[calc(100vh-4rem)] w-full bg-[#050913] text-slate-100 overflow-hidden flex flex-col justify-between select-none"
    >
      {/* Real-Time 3D WebGL Rainy Industrial City & Monumental 404 Pipeline Scene */}
      <Cinematic404Scene
        cameraPreset={cameraPreset}
        isPaused={isPaused}
        replayTrigger={replayTrigger}
      />

      {/* Subtle Vignette Readability Gradients (Preserves 3D Scene Visibility) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,transparent_22%,rgba(5,9,19,0.52)_68%,rgba(5,9,19,0.9)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#050913] via-[#050913]/80 to-transparent"
      />

      {/* Top Scene Navigation Bar: Sohan Pipelines Logo Left, Restrained Back to Home Right */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 flex items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Sohan Pipelines Home"
          className="inline-flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-lg"
        >
          <BrandLogo className="h-9 w-9 sm:h-10 sm:w-10" />
          <div className="flex flex-col">
            <span className="font-display text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
              SOHAN PIPELINES
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Industrial &amp; Residential Plumbing Infrastructure
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-200 hover:text-white bg-[#090d16]/80 hover:bg-[#0f172a] border border-slate-800/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-sky-400" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Unobstructed Upper-Center 3D Viewport Showcase Zone for the 404 Monument */}
      <div
        aria-hidden="true"
        className="relative z-10 flex-1 min-h-[240px] sm:min-h-[300px] lg:min-h-[340px] pointer-events-none"
      />

      {/* Foreground Content & Recovery Actions (Immediately Interactive) */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3 sm:space-y-4 max-w-2xl"
        >
          {/* Eyebrow */}
          <p className="text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-[0.22em] text-sky-400">
            PAGE NOT FOUND
          </p>

          {/* Headline */}
          <h1
            id="not-found-headline"
            className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.12] [text-wrap:balance]"
          >
            Looks like this route has gone off the pipeline.
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base md:text-lg text-slate-300 font-normal leading-relaxed">
            Let&apos;s get you back on track.
          </p>
        </motion.div>

        {/* Primary & Secondary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto"
        >
          <Button
            asChild
            size="lg"
            className="h-11 sm:h-12 px-7 text-xs sm:text-sm font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/20 border-0 focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            <Link href="/">
              <span>Back to Home</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 sm:h-12 px-7 text-xs sm:text-sm font-semibold bg-[#0b1220]/85 hover:bg-[#162136] text-slate-100 border-slate-700/90 hover:border-sky-400/60 focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <Link href="/spare-parts">
              <span>Explore Products</span>
            </Link>
          </Button>
        </motion.div>

        {/* Subtle Product-Navigation Recovery Strip */}
        <motion.nav
          aria-label="Product categories and solutions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 sm:mt-8 pt-4 border-t border-slate-800/80 w-full max-w-2xl flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 gap-y-2 text-xs sm:text-sm"
        >
          {PRODUCT_RECOVERY_LINKS.map((item, idx) => (
            <React.Fragment key={item.label}>
              {idx > 0 && (
                <span aria-hidden="true" className="text-slate-600 select-none">
                  ·
                </span>
              )}
              <Link
                href={item.href}
                className="text-slate-300 hover:text-sky-300 font-medium transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded px-1 py-0.5"
              >
                {item.label}
              </Link>
            </React.Fragment>
          ))}
        </motion.nav>

        {/* Sleek Collapsible Bottom Scene & Camera Control Dock */}
        <div className="mt-6 flex flex-col items-center">
          <button
            type="button"
            onClick={() => setControlsCollapsed((prev) => !prev)}
            aria-expanded={!controlsCollapsed}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-t-lg text-[11px] font-medium text-slate-400 hover:text-slate-200 bg-[#090d16]/85 border border-b-0 border-slate-800/80 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            {controlsCollapsed ? (
              <>
                <ChevronUp className="h-3 w-3 text-sky-400" />
                <span>Show Scene Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 text-sky-400" />
                <span>Hide Controls</span>
              </>
            )}
          </button>

          {!controlsCollapsed && (
            <div className="flex flex-wrap items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-[#090d16]/90 border border-slate-800/90 text-xs">
              <div className="flex items-center gap-1 pr-2 border-r border-slate-800">
                <Camera className="h-3.5 w-3.5 text-sky-400 mr-1 hidden sm:inline" />
                {(
                  [
                    { id: 'cinema', label: 'Cinema View' },
                    { id: 'monument', label: '404 Close-Up' },
                    { id: 'street', label: 'Street Angle' },
                  ] as const
                ).map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setCameraPreset(preset.id)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400',
                      cameraPreset === preset.id
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsPaused(false);
                    setReplayTrigger((c) => c + 1);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <RotateCcw className="h-3 w-3 text-sky-400" />
                  <span>Replay Alignment</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPaused((p) => !p)}
                  aria-pressed={isPaused}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  {isPaused ? (
                    <>
                      <Play className="h-3 w-3 text-emerald-400" />
                      <span>Resume Motion</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-3 w-3 text-amber-400" />
                      <span>Pause Scene</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
