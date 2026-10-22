'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CloudRain,
  SunDim,
  CloudLightning,
  Pause,
  Play,
  Phone,
  Wrench,
  Calendar,
  Search,
  Package,
} from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import {
  MonsoonPipelineErrorScene,
  type WeatherMood,
} from '@/components/monsoon-pipeline-error-scene';
import { businessInfo } from '@/lib/business-info';
import { cn } from '@/lib/utils';

const RECOVERY_DESTINATIONS = [
  { label: 'Plumbing Services', href: '/services', icon: Wrench },
  { label: 'Book a Plumber', href: '/book', icon: Calendar },
  { label: 'Track Booking', href: '/find-booking', icon: Search },
  { label: 'Spare Parts Counter', href: '/spare-parts', icon: Package },
];

const WEATHER_MOODS: Array<{
  id: WeatherMood;
  label: string;
  subtitle: string;
  icon: typeof CloudRain;
}> = [
  {
    id: 'monsoon-night',
    label: 'Monsoon Night',
    subtitle: 'Heavy downpour · Worksite floodlights & wet street reflections',
    icon: CloudRain,
  },
  {
    id: 'dusk-drizzle',
    label: 'Evening Drizzle',
    subtitle: 'Warm twilight mist · Pedestrians crossing with umbrellas',
    icon: SunDim,
  },
  {
    id: 'storm-daylight',
    label: 'Storm Overcast',
    subtitle: 'High-contrast monsoon sky · Active main pipeline repair crew',
    icon: CloudLightning,
  },
];

export default function NotFound() {
  const [mood, setMood] = React.useState<WeatherMood>('monsoon-night');
  const [isPaused, setIsPaused] = React.useState(false);

  const activeMoodObj =
    WEATHER_MOODS.find((m) => m.id === mood) || WEATHER_MOODS[0];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="not-found-headline"
      className="relative min-h-[calc(100vh-4rem)] w-full bg-[#040814] text-slate-100 overflow-hidden flex flex-col justify-between select-none"
    >
      {/* Smooth Crossfade Atmospheric Monsoon Pipeline & Umbrella Pedestrians Canvas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mood}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <MonsoonPipelineErrorScene
            mood={mood}
            isPaused={isPaused}
            errorCode="404"
          />
        </motion.div>
      </AnimatePresence>

      {/* Subtle Readability Gradient Overlays (Preserving Full View of the Street & Pipeline Scene) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#040814]/90 via-[#040814]/45 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#040814]/95 via-[#040814]/60 to-transparent"
      />

      {/* Top Bar: Brand Identity & Smooth Atmosphere Switcher */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-xl"
        >
          <BrandLogo className="h-9 w-9 sm:h-10 sm:w-10" />
          <div className="flex flex-col">
            <span className="font-display text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
              Sohan Pipeline&apos;s &amp; Plumbing
            </span>
            <span className="text-[11px] text-slate-300/80 hidden sm:inline">
              24/7 Monsoon &amp; Emergency Pipeline Engineering
            </span>
          </div>
        </Link>

        {/* Smooth Atmosphere Transition Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/75 backdrop-blur-md border border-slate-800/80">
          {WEATHER_MOODS.map((item) => {
            const Icon = item.icon;
            const active = mood === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMood(item.id)}
                className={cn(
                  'relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                  active
                    ? 'text-slate-950'
                    : 'text-slate-300 hover:text-white'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="errorMoodPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-lg bg-sky-400 -z-10 shadow-sm"
                  />
                )}
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? 'Resume animation' : 'Pause animation'}
            className="ml-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            {isPaused ? (
              <Play className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Pause className="h-3.5 w-3.5 text-amber-400" />
            )}
          </button>
        </div>
      </div>

      {/* Main Editorial 404 Callout (Positioned in Upper-Right / Center to Keep the Left Pipeline Crew & Roadway Crosswalk Unobstructed) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto py-8 flex flex-col lg:items-end">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl rounded-3xl border border-white/12 bg-slate-950/65 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-amber-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              ERROR 404 · ROUTE DIVERSION
            </span>
            <span className="text-[11px] font-mono text-sky-300/90">
              {activeMoodObj.label}
            </span>
          </div>

          <div className="space-y-2.5">
            <h1
              id="not-found-headline"
              className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-[1.15]"
            >
              Road Closed Ahead — Our Crew Is Repairing the Main Pipeline.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Even in heavy monsoon rain, our master technicians are out on the street sealing the main water line while commuters cross under their umbrellas. The page address you entered is currently unavailable—let us guide you back to dry ground.
            </p>
          </div>

          {/* Primary Recovery Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              asChild
              size="lg"
              className="h-11 px-6 rounded-xl text-xs sm:text-sm font-semibold bg-sky-400 hover:bg-sky-300 text-slate-950 shadow-lg shadow-sky-500/20"
            >
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home Page
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold border-slate-700 bg-slate-900/80 text-white hover:bg-slate-800 hover:text-white"
            >
              <Link href="/book">
                Book a Service Visit
                <ArrowRight className="ml-2 h-4 w-4 text-sky-400" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 px-4 rounded-xl text-xs sm:text-sm font-semibold border-slate-700/80 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              <a href={`tel:${businessInfo.phone}`}>
                <Phone className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
                {businessInfo.phoneDisplay}
              </a>
            </Button>
          </div>

          {/* Quick Navigation Grid */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {RECOVERY_DESTINATIONS.map((dest) => {
              const Icon = dest.icon;
              return (
                <Link
                  key={dest.href}
                  href={dest.href}
                  className="group flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/8 transition-all text-xs font-medium text-slate-200 hover:text-sky-300"
                >
                  <Icon className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">{dest.label}</span>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Bottom Live Scene Caption Bar */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <p className="font-mono text-[11px] text-slate-300/90">
          Scene: {activeMoodObj.subtitle}
        </p>
        <p className="text-[11px] text-slate-400">
          Move cursor across the street scene to shift camera perspective
        </p>
      </div>
    </motion.section>
  );
}
