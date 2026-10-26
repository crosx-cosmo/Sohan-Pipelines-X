'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Compass,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { businessInfo } from '@/lib/business-info';

const disciplines = [
  {
    icon: Compass,
    title: 'Engineered Slope & Hydraulic Flow',
    description:
      'We calculate exact gradient angles on drainage lines to guarantee swift waste discharge without residue buildup or trap siphoning.',
  },
  {
    icon: ShieldCheck,
    title: 'Certified Virgin Polymer Sourcing',
    description:
      'Zero compromised or low-grade regrind plastics. We work exclusively with certified Astral, Supreme, and Finolex fittings.',
  },
  {
    icon: Zap,
    title: 'Emergency Rapid Response Unit',
    description:
      'Burst pipes, overflow backups, and motor failure calls receive prioritized same-day dispatch from our Dantan & Midnapore hubs.',
  },
  {
    icon: Sparkles,
    title: 'Spotless Handover Protocol',
    description:
      'We lay protective runners, core-drill with dust catchment, and leave every bathroom and kitchen clean upon job sign-off.',
  },
];

export function HomeAboutPreview() {
  const yearsExperience = new Date().getFullYear() - businessInfo.established;

  return (
    <section className="py-16 lg:py-20 bg-muted/20 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Left Narrative Column */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 min-w-0 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-[0.065em] text-primary">
                <span>03. Workmanship &amp; Standards</span>
                <span aria-hidden="true">·</span>
                <span className="text-muted-foreground font-medium">
                  Established {businessInfo.established}
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground text-balance">
                {yearsExperience} Years of Trusted Plumbing Engineering in Medinipur
              </h2>

              <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty font-normal">
                <p>
                  Founded in Bahardaltitia, Keshrambha, Dantan (PIN 721451),{' '}
                  <strong className="text-foreground font-semibold">
                    {businessInfo.name}
                  </strong>{' '}
                  was established on a clear principle: plumbing is critical
                  infrastructure that protects your property, water hygiene, and
                  daily comfort.
                </p>
                <p>
                  Over the past decade, we have completed 500+ residential and
                  commercial installations across West Medinipur and South Bengal
                  using certified fittings, precision jointing, and hydrostatic
                  testing.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Quick Proof Metrics Row */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 border-t border-border/60 items-stretch">
                <div className="h-full p-3.5 rounded-2xl bg-card border border-border/60 shadow-2xs flex flex-col justify-between">
                  <p className="font-display text-2xl font-bold text-foreground tabular-nums font-mono">
                    {yearsExperience}+
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                    Years Active
                  </p>
                </div>

                <div className="h-full p-3.5 rounded-2xl bg-card border border-border/60 shadow-2xs flex flex-col justify-between">
                  <p className="font-display text-2xl font-bold text-foreground tabular-nums font-mono">
                    500+
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                    Projects Done
                  </p>
                </div>

                <div className="h-full p-3.5 rounded-2xl bg-card border border-border/60 shadow-2xs flex flex-col justify-between">
                  <p className="font-display text-2xl font-bold text-foreground tabular-nums font-mono">
                    12-Mo
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                    Joint Warranty
                  </p>
                </div>

                <div className="h-full p-3.5 rounded-2xl bg-card border border-border/60 shadow-2xs flex flex-col justify-between">
                  <p className="font-display text-2xl font-bold text-foreground tabular-nums font-mono">
                    20+
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                    Partner Brands
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-1 grid grid-cols-1 sm:flex items-center gap-3 w-full sm:w-auto">
                <Button
                  asChild
                  className="font-semibold text-xs h-10.5 px-5 rounded-xl shadow-xs w-full sm:w-auto justify-center"
                >
                  <Link href="/about">
                    Learn More About Us
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 shrink-0" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="font-semibold text-xs h-10.5 px-5 rounded-xl border-border/80 w-full sm:w-auto justify-center"
                >
                  <a href={`tel:${businessInfo.phone}`}>
                    <Phone className="mr-1.5 h-3.5 w-3.5 text-primary shrink-0" />
                    Direct Line: {businessInfo.phoneDisplay}
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Right Disciplines Grid */}
          <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4 items-stretch">
            {disciplines.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.25,
                    delay: idx * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="h-full rounded-2xl border border-border/80 bg-card p-5 sm:p-6 flex flex-col justify-between shadow-crisp-xs transition-all duration-200 hover:border-primary/50 hover:shadow-crisp-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-muted-foreground tabular-nums font-mono">
                        0{idx + 1}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-foreground leading-snug mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>Guaranteed on every project</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

