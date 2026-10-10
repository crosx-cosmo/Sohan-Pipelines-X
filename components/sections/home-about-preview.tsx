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

const workflowSteps = [
  {
    phase: 'Step 1',
    title: 'Acoustic & Visual Inspection',
    description:
      'Thorough onsite line inspection to isolate concealed leaks, evaluate pipe pressure, and determine precise pipe diameters.',
    deliverable: 'Written itemized estimate',
  },
  {
    phase: 'Step 2',
    title: 'Virgin Material Specification',
    description:
      'Selection of verified high-pressure CPVC, UPVC or PEX pipelines and heavy-gauge brass isolation ball valves.',
    deliverable: 'Zero counterfeit materials',
  },
  {
    phase: 'Step 3',
    title: 'Precision Jointing & Fitment',
    description:
      'Expert solvent-weld fusion, thread sealing with PTFE polymer, and slope alignment preventing airlocks or backflow.',
    deliverable: 'Master craftsmanship standard',
  },
  {
    phase: 'Step 4',
    title: 'Hydrostatic Pressure Handover',
    description:
      'Rigorous pressure testing before sealing concealed walls, clean work area wipe-down, and clear invoice sign-off.',
    deliverable: 'Workmanship warranty certificate',
  },
];

export function HomeAboutPreview() {
  const yearsExperience = new Date().getFullYear() - businessInfo.established;

  return (
    <section className="py-20 lg:py-28 bg-muted/20 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Narrative Column */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.065em] text-primary">
              <span>02. Master Trade Standards</span>
              <span aria-hidden="true">·</span>
              <span className="text-muted-foreground font-medium">Established {businessInfo.established}</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight text-foreground text-balance">
              {yearsExperience} Years of Plumbing Engineering in Medinipur
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty font-normal tracking-[0.002em]">
              <p>
                Founded in Keshrambha, Dantan, <strong className="text-foreground font-semibold">{businessInfo.name}</strong> was
                established on a foundational principle: plumbing is not merely fixing a leak—it
                is critical infrastructure that protects your property, hygiene, and daily comfort.
              </p>
              <p>
                Over the past decade, we have completed over 500 installations across residential
                residences, commercial complexes, schools, and health centres throughout Paschim and Purba Medinipur.
                We do not employ shortcuts, substandard adhesives, or temporary patches.
              </p>
            </div>

            {/* Quick Proof Metrics Row with interactive hover cards */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border/60">
              <div className="p-3.5 rounded-2xl bg-card border border-border/60 shadow-xs hover:border-primary/40 transition-colors">
                <p className="font-display text-2xl font-bold text-foreground tabular-nums font-mono">
                  {yearsExperience}+
                </p>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Years Active</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-card border border-border/60 shadow-xs hover:border-primary/40 transition-colors">
                <p className="font-display text-2xl font-bold text-foreground tabular-nums font-mono">
                  500+
                </p>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Projects Done</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-card border border-border/60 shadow-xs hover:border-primary/40 transition-colors">
                <p className="font-display text-2xl font-bold text-foreground tabular-nums font-mono">
                  {businessInfo.rating} ★
                </p>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{businessInfo.reviewCount} Reviews</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-card border border-border/60 shadow-xs hover:border-primary/40 transition-colors">
                <p className="font-display text-2xl font-bold text-foreground tabular-nums font-mono">
                  10
                </p>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Service Towns</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild className="font-semibold text-xs h-10 px-5 rounded-xl shadow-sm">
                  <Link href="/about">
                    Read Company Profile
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild variant="outline" className="font-semibold text-xs h-10 px-5 rounded-xl border-border/80">
                  <a href={`tel:${businessInfo.phone}`}>
                    <Phone className="mr-1.5 h-3.5 w-3.5 text-primary" />
                    Direct Line: {businessInfo.phoneDisplay}
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Disciplines Grid */}
          <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
            {disciplines.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.25, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: 'transform' }}
                  className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 flex flex-col justify-between shadow-crisp-sm transition-[border-color,box-shadow] duration-200 hover:border-primary/60 hover:shadow-crisp-md gpu-accelerated"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-muted-foreground tabular-nums font-mono">
                      0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-foreground leading-snug mb-2">
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

        {/* How We Work: 4-Step Engineering Protocol */}
        <div className="mt-16 pt-12 border-t border-border/60">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.065em] text-primary">
              Engineering Protocol
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-2">
              How We Work: Diagnosis to Pressure-Tested Handover
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-2xl mx-auto leading-relaxed text-pretty font-normal">
              Every plumbing project—from a single valve service to complete multi-story pipeline installation—follows our certified 4-step workflow.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowSteps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.25, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: 'transform' }}
                className="relative rounded-2xl border border-border/80 bg-card p-5 shadow-crisp-sm flex flex-col justify-between transition-[border-color,box-shadow] duration-200 hover:border-primary/60 hover:shadow-crisp-md gpu-accelerated"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground font-semibold">
                      {step.phase}
                    </span>
                  </div>
                  <h4 className="font-display font-semibold text-sm text-foreground mb-1.5 leading-snug">
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-primary font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 shrink-0" />
                  <span>{step.deliverable}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
