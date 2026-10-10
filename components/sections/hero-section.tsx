'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  ArrowRight,
  Phone,
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Wrench,
  Droplets,
  Bath,
  Gauge,
  Sparkles,
  MapPin,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { businessInfo } from '@/lib/business-info';
import { HeroPipelineVisual } from '@/components/hero-pipeline-visual';

const featuredHeroServices = [
  {
    id: 'pipe-fitting-repair',
    name: 'Pipe Fitting & Leak Repair',
    price: 499,
    time: '1–3 hrs',
    icon: Wrench,
    desc: 'CPVC, UPVC, Galvanized line diagnosis, pressure welds & concealed leak repairs.',
  },
  {
    id: 'drainage-cleaning',
    name: 'Drainage & Sewer Jetting',
    price: 399,
    time: '1–2 hrs',
    icon: Droplets,
    desc: 'High-pressure obstruction clearing for bathroom traps, kitchen sinks & mainline lines.',
  },
  {
    id: 'bathroom-fitting',
    name: 'Sanitary & Bathroom Fitting',
    price: 799,
    time: '2–5 hrs',
    icon: Bath,
    desc: 'Wall-hung commodes, thermostatic diverters, geysers, basin mixers & complete renovations.',
  },
  {
    id: 'water-tank-installation',
    name: 'Water Tank & Booster Setup',
    price: 999,
    time: '3–6 hrs',
    icon: Gauge,
    desc: 'Heavy-gauge overhead tanks, booster pump manifolds, float valves & bypass plumbing.',
  },
];

export function HeroSection() {
  const [activeTab, setActiveTab] = React.useState(0);
  const [consoleView, setConsoleView] = React.useState<'estimator' | 'pipeline'>('estimator');
  const [copied, setCopied] = React.useState(false);

  const handleSelectService = (index: number) => {
    setActiveTab(index);
    const service = featuredHeroServices[index];
    toast.info(`Configured: ${service.name}`, {
      description: `Starting at ₹${service.price} · Typical dispatch within ${service.time}`,
    });
  };

  const handleCopyHotline = async () => {
    try {
      await navigator.clipboard.writeText(businessInfo.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Emergency Hotline Copied', {
        description: `${businessInfo.phoneDisplay} copied to your clipboard.`,
      });
    } catch {
      toast.info(`Emergency Hotline: ${businessInfo.phoneDisplay}`);
    }
  };

  return (
    <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-border/60">
      {/* Blueprint grid & subtle ambient lighting */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-blueprint opacity-[0.08] dark:opacity-[0.14]" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[560px] w-[980px] rounded-full bg-gradient-to-tr from-primary/12 via-sky-500/8 to-transparent blur-3xl opacity-75" />
        <div className="absolute top-1/2 right-12 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Architectural Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Clean unboxed editorial kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-primary">
              <span className="uppercase tracking-[0.065em]">South Bengal Engineering Division</span>
              <span className="text-border" aria-hidden="true">·</span>
              <span className="text-muted-foreground font-normal tracking-normal">Established {businessInfo.established}</span>
              <span className="text-border" aria-hidden="true">·</span>
              <Link
                href="/reviews"
                className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-primary transition-colors"
              >
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="tabular-nums font-mono">{businessInfo.rating}</span>
                <span className="text-muted-foreground font-normal">({businessInfo.reviewCount} Reviews)</span>
              </Link>
            </div>

            {/* Display Headline with balanced text wrap and calibrated tracking */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight sm:tracking-[-0.028em] text-foreground leading-[1.12] text-balance">
              Precision Pipe Fitting &amp;{' '}
              <span className="text-primary relative inline-block">
                Total Plumbing Solutions.
              </span>
            </h1>

            {/* Narrative Prose with optimal readability tracking */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl text-pretty font-normal tracking-[0.002em]">
              From residential leak diagnosis to industrial pipeline architecture,
              bathroom fixture installations, and pressurized water storage. Delivered by
              master technicians with upfront quotes, guaranteed materials, and prompt dispatch.
            </p>

            {/* High-Intent Conversion Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                <Button
                  asChild
                  size="lg"
                  className="font-semibold text-sm h-12 px-6.5 rounded-xl shadow-lg shadow-primary/20 group whitespace-nowrap w-full sm:w-auto"
                >
                  <Link href="/book">
                    Book a Service Online
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="font-semibold text-sm h-12 px-6 rounded-xl border-border/80 hover:bg-muted/60 whitespace-nowrap w-full sm:w-auto"
                >
                  <a href={`tel:${businessInfo.phone}`}>
                    <Phone className="mr-2 h-4 w-4 text-primary" />
                    Call {businessInfo.phoneDisplay}
                  </a>
                </Button>
              </motion.div>

              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={handleCopyHotline}
                className="text-xs font-semibold h-12 text-muted-foreground hover:text-foreground whitespace-nowrap px-3.5 rounded-xl"
              >
                {copied ? (
                  <>
                    <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                    Copy Number
                  </>
                )}
              </Button>
            </div>

            {/* Verified Trust Pillars */}
            <div className="pt-4 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-muted-foreground font-medium">Licensed &amp; Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-muted-foreground font-medium">Clear Upfront Pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span className="text-muted-foreground font-medium">Prompt Emergency Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <span className="text-muted-foreground font-medium">Workmanship Warranty</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Dispatch Console with luxury glass surface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl border border-border/80 bg-card/95 dark:bg-card/85 backdrop-blur-2xl p-5 sm:p-6 shadow-crisp-lg render-crisp">
              {/* Console Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border/70">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground leading-tight">
                      Express Service Dispatch
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Dantan, Kharagpur &amp; Midnapore Hubs
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Available Today</span>
                </div>
              </div>

              {/* View Switcher Tabs with Animated Layout Pill */}
              <div className="mt-4 flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60">
                <button
                  type="button"
                  onClick={() => setConsoleView('estimator')}
                  className={`relative flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer select-none ${
                    consoleView === 'estimator'
                      ? 'text-foreground font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {consoleView === 'estimator' && (
                    <motion.span
                      layoutId="consoleViewActivePill"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-lg bg-card shadow-xs border border-border/80 -z-10"
                    />
                  )}
                  Quick Estimator
                </button>
                <button
                  type="button"
                  onClick={() => setConsoleView('pipeline')}
                  className={`relative flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer select-none ${
                    consoleView === 'pipeline'
                      ? 'text-foreground font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {consoleView === 'pipeline' && (
                    <motion.span
                      layoutId="consoleViewActivePill"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-lg bg-card shadow-xs border border-border/80 -z-10"
                    />
                  )}
                  Hydraulic Topology
                </button>
              </div>

              <AnimatePresence mode="wait">
                {consoleView === 'pipeline' ? (
                  <motion.div
                    key="pipeline"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="py-4"
                  >
                    <HeroPipelineVisual />
                  </motion.div>
                ) : (
                  /* Service Selectors */
                  <motion.div
                    key="estimator"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="py-4 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                      <span>Select service to estimate:</span>
                      <span className="text-[11px]">Instant breakdown</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {featuredHeroServices.map((item, idx) => {
                        const Icon = item.icon;
                        const isSelected = activeTab === idx;
                        return (
                          <motion.button
                            key={item.id}
                            type="button"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleSelectService(idx)}
                            className={`text-left p-3 rounded-xl border transition-colors duration-150 text-xs flex flex-col justify-between cursor-pointer ${
                              isSelected
                                ? 'border-primary bg-primary/10 ring-1 ring-primary/40 shadow-xs'
                                : 'border-border/60 bg-muted/30 hover:border-border hover:bg-muted/60'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2 w-full">
                              <Icon className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                              <span className="text-[11px] font-bold text-foreground tabular-nums font-mono">
                                ₹{item.price}
                              </span>
                            </div>
                            <span className="font-semibold text-foreground line-clamp-1 leading-snug">
                              {item.name}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Selected Service Detail Panel */}
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-sm">
                          {featuredHeroServices[activeTab].name}
                        </span>
                        <span className="text-muted-foreground font-medium flex items-center gap-1 tabular-nums font-mono">
                          <Clock className="h-3 w-3" />
                          {featuredHeroServices[activeTab].time}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {featuredHeroServices[activeTab].desc}
                      </p>
                      <div className="pt-2 flex items-center justify-between border-t border-border/50">
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.06em] font-semibold text-muted-foreground block">
                            Base Inspection &amp; Labor
                          </span>
                          <span className="text-sm font-bold text-foreground tabular-nums font-mono">
                            From ₹{featuredHeroServices[activeTab].price}
                          </span>
                        </div>
                        <Button asChild size="sm" className="h-8.5 text-xs font-semibold px-3.5 rounded-lg shadow-sm">
                          <Link href="/book">
                            Book This Service
                            <ChevronRight className="ml-1 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Console Footer */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Mon–Sat: {businessInfo.hours}</span>
                </span>
                <Link
                  href="/service-areas"
                  className="flex items-center gap-1.5 text-foreground font-medium hover:text-primary transition-colors"
                >
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>10 Service Hubs →</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
