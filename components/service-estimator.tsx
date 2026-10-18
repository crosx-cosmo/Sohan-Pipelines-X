'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  CalendarCheck,
  Search,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageCircle,
  ShieldCheck,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { businessInfo } from '@/lib/business-info';
import { cn } from '@/lib/utils';
import { luxuryEasing } from '@/lib/motion';

export interface ServiceStep {
  number: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: typeof CalendarCheck;
  tags: string[];
  features: string[];
}

export const serviceSteps: ServiceStep[] = [
  {
    number: '01',
    title: 'Book Your Service',
    shortDesc: 'Instant online scheduling or direct phone dispatch across Midnapore & Dantan.',
    fullDesc:
      'Choose your required plumbing service through our streamlined online booking system or call our direct emergency hotline. Select your preferred date, convenient time window, and urgency level with instant confirmation.',
    icon: CalendarCheck,
    tags: ['Online Booking', '24/7 Hotline', 'Instant Confirmation'],
    features: [
      'Simple step-by-step booking wizard',
      'Real-time emergency slot selection',
      'Instant booking reference ID generated',
      'Direct technician assignment notification',
    ],
  },
  {
    number: '02',
    title: 'Inspection & Estimate',
    shortDesc: 'Onsite diagnostic check with a 100% transparent written price quote.',
    fullDesc:
      'Our licensed master plumber arrives promptly at your location equipped with acoustic leak pinpointing and pipeline diagnostic tools. We thoroughly inspect your lines, explain the root cause, and provide a transparent, upfront written estimate before any work begins.',
    icon: Search,
    tags: ['On-Site Diagnosis', 'Upfront Quote', 'Zero Hidden Fees'],
    features: [
      'Acoustic and visual leak diagnosis',
      'Clear explanation of necessary repairs',
      'Itemized upfront labor & material quote',
      'Zero work started without your prior sign-off',
    ],
  },
  {
    number: '03',
    title: 'Professional Service',
    shortDesc: 'Precision execution using certified virgin polymer pipes and heavy fittings.',
    fullDesc:
      'Our seasoned plumbers execute the job following strict plumbing codes. We work exclusively with certified Astral, Supreme, and Finolex heavy-gauge CPVC/UPVC pipes and brass fixtures. Dust catchment and clean protective floor runners protect your premises.',
    icon: Wrench,
    tags: ['Certified Materials', 'Clean Protocol', 'Master Workmanship'],
    features: [
      'Heavy-gauge solvent welding & brass fittings',
      'Motorized drain cleaning & hydro-jetting',
      'Floor protection runners and tidy work area',
      'Multi-year plumbing mastery on every joint',
    ],
  },
  {
    number: '04',
    title: 'Quality Check & Handover',
    shortDesc: 'Hydrostatic pressure inspection and customer sign-off before payment.',
    fullDesc:
      'We never leave a job unchecked. Every installation undergoes hydrostatic pressure and leak verification in your presence. Once you inspect and approve the completed work, receive your service voucher and pay conveniently via Cash or UPI.',
    icon: CheckCircle2,
    tags: ['Pressure Testing', 'Customer Approval', 'Cash & UPI Accepted'],
    features: [
      'Rigorous hydrostatic pressure leak test',
      'Full customer visual walkthrough & sign-off',
      'Transparent payment via UPI or Cash',
      'Post-service workmanship satisfaction guarantee',
    ],
  },
];

interface ServiceEstimatorProps {
  className?: string;
  title?: string;
  subtitle?: string;
}

export function ServiceEstimator({
  className = '',
  title = 'How Our Plumbing Service Works',
  subtitle = 'A clear, transparent 4-step engineering process from initial booking to certified quality sign-off.',
}: ServiceEstimatorProps) {
  const [activeStepIndex, setActiveStepIndex] = React.useState(0);
  const activeStep = serviceSteps[activeStepIndex];

  return (
    <section
      id="how-it-works"
      className={cn(
        'rounded-3xl border border-border/80 bg-card p-6 sm:p-8 md:p-10 shadow-crisp-lg gpu-accelerated relative overflow-hidden',
        className
      )}
    >
      {/* Secondary anchor for backwards compatibility */}
      <span id="pricing-estimator" className="absolute -top-24 left-0 pointer-events-none" />

      {/* Blueprint Ambient Lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-sky-500/5 blur-2xl" />
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-border/70">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.065em] text-primary mb-2.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Master Engineering Protocol</span>
            <span aria-hidden="true" className="text-border">·</span>
            <span className="text-muted-foreground font-medium">Transparent &amp; Guaranteed</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
            {title}
          </h2>

          <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>100% Upfront Price Approval</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary px-3.5 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
            <Clock className="h-3.5 w-3.5" />
            <span>Fast Dispatch on Duty</span>
          </span>
        </div>
      </div>

      {/* 4-Step Interactive Cards Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
        {serviceSteps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStepIndex === idx;

          return (
            <motion.div
              key={step.number}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2, ease: luxuryEasing }}
              onClick={() => setActiveStepIndex(idx)}
              className={cn(
                'group relative rounded-2xl p-5 sm:p-6 border transition-all duration-200 cursor-pointer flex flex-col justify-between text-left select-none',
                isActive
                  ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/25 shadow-md'
                  : 'border-border/70 bg-card hover:border-primary/50 hover:bg-muted/30 shadow-xs'
              )}
            >
              <div>
                {/* Step Header: Number & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted/80 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <span
                    className={cn(
                      'font-mono text-xs font-bold px-2 py-0.5 rounded-md border',
                      isActive
                        ? 'bg-primary/15 text-primary border-primary/30'
                        : 'bg-muted/60 text-muted-foreground border-border/60'
                    )}
                  >
                    STEP {step.number}
                  </span>
                </div>

                {/* Step Title & Short Description */}
                <h3 className="font-display font-bold text-base sm:text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                  {step.shortDesc}
                </p>
              </div>

              {/* Step Key Tag Pill */}
              <div className="pt-3 border-t border-border/50 flex flex-wrap gap-1.5">
                {step.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Active Step Detailed Showcase Panel */}
      <div className="mt-8 rounded-2xl border border-border/80 bg-muted/20 p-5 sm:p-7 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.number}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: luxuryEasing }}
            className="grid lg:grid-cols-12 gap-6 items-center"
          >
            {/* Left detail description */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
                <span className="font-mono px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                  STEP {activeStep.number} DETAIL
                </span>
                <span className="text-foreground font-bold">{activeStep.title}</span>
              </div>

              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                {activeStep.fullDesc}
              </p>

              {/* Checklist points */}
              <div className="grid sm:grid-cols-2 gap-2.5 pt-2">
                {activeStep.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-foreground/80 font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right quick conversion actions */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-border/60 lg:pl-6">
              <Button asChild size="lg" className="rounded-xl font-semibold shadow-sm w-full">
                <Link href="/book">
                  Book This Service
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-xl font-semibold border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/15 w-full"
              >
                <a
                  href={`https://wa.me/918670143003?text=${encodeURIComponent(
                    `Hello Sohan Pipeline's & Plumbing, I would like to book a plumbing service following Step ${activeStep.number} (${activeStep.title}). Please guide me.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Ask on WhatsApp
                </a>
              </Button>

              <div className="text-center pt-1">
                <a
                  href={`tel:${businessInfo.phone}`}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                >
                  <Phone className="h-3 w-3 text-primary" />
                  <span>Direct Hotline: {businessInfo.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Service Standard Guarantees */}
      <div className="mt-8 pt-6 border-t border-border/70 grid sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>No unapproved charges — written quote first</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Wrench className="h-4 w-4 text-primary shrink-0" />
          <span>Heavy virgin polymer &amp; branded fittings only</span>
        </div>
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Pay via Cash or UPI only after you inspect</span>
        </div>
      </div>
    </section>
  );
}

// Named alias
export { ServiceEstimator as HowOurServiceWorks };
