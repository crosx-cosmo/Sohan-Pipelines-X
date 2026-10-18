'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
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
  MessageCircle,
  Activity,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { businessInfo } from '@/lib/business-info';
import { HeroPlumbingGallery } from '@/components/hero-plumbing-gallery';
import {
  luxuryEasing,
  fadeUpVariants,
} from '@/lib/motion';

export function HeroSection() {

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
          {/* Left Column: Architectural Editorial Presentation (col-span-6) */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 space-y-6"
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
                <span>Verified Client Reviews</span>
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
              SOHAN PIPELINES delivers complete plumbing solutions across West Bengal, combining authorized plumbing parts sales with professional plumbing engineering. From residential bathroom installations to commercial pipeline projects, we guarantee genuine materials, upfront pricing, and lasting craftsmanship.
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
                asChild
                size="lg"
                variant="outline"
                className="font-semibold text-sm h-12 px-5 rounded-xl border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-500/60 whitespace-nowrap w-full sm:w-auto shadow-xs transition-colors"
              >
                <a
                  href={`https://wa.me/918670143003?text=${encodeURIComponent(
                    "Hi, I’d like to connect with the founder of SOHAN PIPELINES regarding a personal query. Could you please assist me? Thank you."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Contact on WhatsApp
                </a>
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

          {/* Right Column: Premium Responsive Editorial Plumbing Gallery (col-span-6) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: luxuryEasing }}
            className="lg:col-span-6"
          >
            <HeroPlumbingGallery />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
