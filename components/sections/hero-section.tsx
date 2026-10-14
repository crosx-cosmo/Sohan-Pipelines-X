'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Activity,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { businessInfo } from '@/lib/business-info';
import { HeroPipelineVisual } from '@/components/hero-pipeline-visual';
import {
  luxuryEasing,
  fadeUpVariants,
} from '@/lib/motion';

const featuredHeroServices = [
  {
    id: 'pipe-fitting-repair',
    name: 'Pipe Fitting & Leak Repair',
    price: 499,
    time: '1–3 hrs',
    icon: Wrench,
    desc: 'CPVC, UPVC & copper joint repair, concealed leak pinpointing & pressure welds.',
  },
  {
    id: 'drainage-cleaning',
    name: 'Drainage & Sewer Jetting',
    price: 399,
    time: '1–2 hrs',
    icon: Droplets,
    desc: 'Motorized mechanical augers & hydro-jetting for traps, grease lines & mainlines.',
  },
  {
    id: 'bathroom-fitting',
    name: 'Sanitary & Bathroom Fitting',
    price: 799,
    time: '2–5 hrs',
    icon: Bath,
    desc: 'Wall-hung commodes, thermostatic diverters, shower mixers & complete renovations.',
  },
  {
    id: 'water-tank-installation',
    name: 'Water Tank & Booster Setup',
    price: 999,
    time: '3–6 hrs',
    icon: Gauge,
    desc: 'Multi-layer overhead storage tanks, automatic booster pumps & bypass manifolds.',
  },
];

export function HeroSection() {
  const [activeTab, setActiveTab] = React.useState(0);
  const [consoleView, setConsoleView] = React.useState<'estimator' | 'pipeline' | 'gallery'>('estimator');
  const [copied, setCopied] = React.useState(false);

  const handleSelectService = (index: number) => {
    setActiveTab(index);
    const service = featuredHeroServices[index];
    toast.info(`Selected: ${service.name}`, {
      description: `Starting at ₹${service.price} · Typical dispatch in ${service.time}`,
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
      {/* Precision Blueprint Grid & Subtle Atmospheric Radial Lighting */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-blueprint opacity-[0.06] dark:opacity-[0.12]" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[580px] w-[1040px] rounded-full bg-gradient-to-tr from-primary/14 via-sky-500/8 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-1/3 right-4 h-72 w-72 rounded-full bg-primary/6 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Architectural Editorial Presentation (col-span-7) */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6"
          >
            {/* Clean Editorial Eyebrow with Verified Review Link */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-primary">
              <span className="uppercase tracking-[0.065em]">South Bengal Engineering Division</span>
              <span className="text-border" aria-hidden="true">·</span>
              <span className="text-muted-foreground font-normal">Established {businessInfo.established}</span>
              <span className="text-border" aria-hidden="true">·</span>
              <Link
                href="/reviews"
                className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-primary transition-colors duration-150"
              >
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="tabular-nums font-mono font-bold">{businessInfo.rating}</span>
                <span className="text-muted-foreground font-normal">({businessInfo.reviewCount} Verified Reviews)</span>
              </Link>
            </div>

            {/* Display Headline with High-Contrast Editorial Authority */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight sm:tracking-[-0.028em] text-foreground leading-[1.12] text-balance">
              Precision Pipeline Engineering &amp;{' '}
              <span className="text-primary relative inline-block">
                Master Plumbing Solutions.
              </span>
            </h1>

            {/* Narrative Prose */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl text-pretty font-normal tracking-[0.002em]">
              Serving residential homes, apartments, and commercial facilities across Dantan,
              Kharagpur, and Midnapore. Specialized in concealed leak diagnosis, CPVC/UPVC
              pipeline networks, sanitary bathroom fittings, and pressurized water storage.
            </p>

            {/* High-Intent Conversion Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="font-semibold text-sm h-12 px-6.5 rounded-xl shadow-md shadow-primary/25 group whitespace-nowrap w-full sm:w-auto"
              >
                <Link href="/book">
                  Book a Service Online
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>

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
                <span className="text-muted-foreground font-medium">Upfront Pricing Approval</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span className="text-muted-foreground font-medium">Fast Emergency Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <span className="text-muted-foreground font-medium">12-Month Joint Warranty</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Dispatch Console (col-span-5) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: luxuryEasing }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-crisp-lg gpu-accelerated">
              {/* Console Header Bar */}
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
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>On Duty Today</span>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="mt-4 flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/60">
                <button
                  type="button"
                  onClick={() => setConsoleView('estimator')}
                  className={`relative flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer select-none text-center ${
                    consoleView === 'estimator'
                      ? 'text-foreground font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {consoleView === 'estimator' && (
                    <motion.span
                      layoutId="consoleViewActivePill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-card shadow-xs border border-border/80 -z-10"
                    />
                  )}
                  Estimator
                </button>
                <button
                  type="button"
                  onClick={() => setConsoleView('pipeline')}
                  className={`relative flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer select-none text-center ${
                    consoleView === 'pipeline'
                      ? 'text-foreground font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {consoleView === 'pipeline' && (
                    <motion.span
                      layoutId="consoleViewActivePill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-card shadow-xs border border-border/80 -z-10"
                    />
                  )}
                  Topology
                </button>
                <button
                  type="button"
                  onClick={() => setConsoleView('gallery')}
                  className={`relative flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer select-none text-center ${
                    consoleView === 'gallery'
                      ? 'text-foreground font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {consoleView === 'gallery' && (
                    <motion.span
                      layoutId="consoleViewActivePill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-card shadow-xs border border-border/80 -z-10"
                    />
                  )}
                  Standards
                </button>
              </div>

              <AnimatePresence mode="wait">
                {consoleView === 'pipeline' && (
                  <motion.div
                    key="pipeline"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: luxuryEasing }}
                    className="py-4"
                  >
                    <HeroPipelineVisual />
                  </motion.div>
                )}

                {consoleView === 'gallery' && (
                  <motion.div
                    key="gallery"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: luxuryEasing }}
                    className="py-4 space-y-3"
                  >
                    <div className="relative h-44 rounded-2xl overflow-hidden border border-border/70 group">
                      <Image
                        src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80"
                        alt="High-grade industrial pipeline engineering"
                        fill
                        referrerPolicy="no-referrer"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-end p-4">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-sky-400">
                          Astral &amp; Supreme Certified
                        </span>
                        <h4 className="text-white text-sm font-bold leading-tight">
                          Commercial Pressure Fusion &amp; Manifold Assembly
                        </h4>
                        <p className="text-slate-300 text-[11px] mt-0.5">
                          Concealed wall runs hydro-tested before plaster sealing.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                        <span className="font-semibold text-foreground block">Zero Joint Leakage</span>
                        <span className="text-[11px] text-muted-foreground block mt-0.5">
                          High-temp solvent weld standard
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                        <span className="font-semibold text-foreground block">Heavy-Gauge Brass</span>
                        <span className="text-[11px] text-muted-foreground block mt-0.5">
                          Forged ISI isolation valves
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {consoleView === 'estimator' && (
                  /* Estimator View */
                  <motion.div
                    key="estimator"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: luxuryEasing }}
                    className="py-4 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                      <span>Select service for instant breakdown:</span>
                      <span className="text-[11px] font-mono">100% Upfront Quote</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {featuredHeroServices.map((item, idx) => {
                        const Icon = item.icon;
                        const isSelected = activeTab === idx;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectService(idx)}
                            className={`text-left p-3 rounded-xl border transition-colors duration-150 text-xs flex flex-col justify-between cursor-pointer select-none ${
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
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected Service Detail Panel */}
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: luxuryEasing }}
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
                            Base Inspection &amp; Diagnosis
                          </span>
                          <span className="text-sm font-bold text-foreground tabular-nums font-mono">
                            From ₹{featuredHeroServices[activeTab].price}
                          </span>
                        </div>
                        <Button asChild size="sm" className="h-8.5 text-xs font-semibold px-3.5 rounded-lg shadow-xs">
                          <Link href={`/book?service=${featuredHeroServices[activeTab].id}`}>
                            Book This →
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Quick Hub Coverage Indicator */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Coverage: Dantan, Kharagpur, Midnapore Town</span>
                </span>
                <Link
                  href="/service-areas"
                  className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span>10 Hubs</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
