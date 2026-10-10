'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Users, Clock, ThumbsUp, Wrench, Shield, Heart, Star, ChevronDown, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { businessInfo } from '@/lib/business-info';

const stats = [
  { icon: Users, value: '500+', label: 'Happy Customers' },
  { icon: Wrench, value: '12+', label: 'Service Types' },
  { icon: Star, value: `${businessInfo.rating}`, label: 'Customer Rating' },
  { icon: Award, value: `${new Date().getFullYear() - businessInfo.established}+`, label: 'Years Experience' },
];

const values = [
  {
    icon: Shield,
    title: 'Honest Pricing',
    description: 'Transparent rates with no hidden charges. You approve the price before we start.',
  },
  {
    icon: Award,
    title: 'Skilled Workmanship',
    description: 'Years of hands-on experience with all types of plumbing systems and materials.',
  },
  {
    icon: Clock,
    title: 'On-Time Service',
    description: 'We respect your time. Fast response and punctual arrivals for every booking.',
  },
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Your satisfaction is our priority. We clean up after every job, big or small.',
  },
];

const credentials = [
  {
    title: '12-Month Joint & Seal Warranty',
    detail: 'All newly installed CPVC/UPVC pipeline joints and brass fittings are covered under our direct workmanship warranty against leakage.',
  },
  {
    title: 'ISI & Brand-Standard Piping',
    detail: 'We only deploy genuine materials from verified manufacturers: Supreme, Ashirvad, Astral, and Finolex with factory-calibrated solvent welds.',
  },
  {
    title: 'Motorized Drain Cleanout Technology',
    detail: 'Heavy-duty steel drain augers and hydraulic jetting tools capable of clearing root intrusions and grease build-up up to 50 feet.',
  },
  {
    title: 'Acoustic Ultrasonic Leak Pinpointing',
    detail: 'Non-destructive pipeline acoustic listening equipment to find hidden in-wall and underground leaks without breaking unnecessary tiles.',
  },
];

export function AboutSection() {
  const [credentialsOpen, setCredentialsOpen] = React.useState(false);

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.065em] text-primary mb-4">
              <span>Our Track Record</span>
              <span aria-hidden="true">·</span>
              <span className="text-muted-foreground font-medium">Medinipur Master Plumbers</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">
              {new Date().getFullYear() - businessInfo.established} Years of Trusted Plumbing in Midnapore
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty font-normal tracking-[0.002em]">
              {businessInfo.name} has been serving the people of Midnapore, Dantan, and
              surrounding areas with reliable plumbing services. From small household
              repairs to large commercial installations, we bring the same level of
              dedication and quality to every project.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed text-pretty font-normal tracking-[0.002em]">
              Our team understands the local plumbing challenges — from hard water
              issues to monsoon drainage problems — and we have the experience to solve
              them efficiently. We are proud of our {businessInfo.rating} rating from{' '}
              {businessInfo.reviewCount}+ satisfied customers.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-11 px-5 text-xs sm:text-sm font-semibold">
                <Link href="/book">Book a Service</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 px-5 text-xs sm:text-sm font-semibold">
                <a href={`tel:${businessInfo.phone}`}>Call {businessInfo.phoneDisplay}</a>
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-2xl border border-border/60 bg-card p-5 transition-[border-color,box-shadow] duration-200 hover:shadow-md hover:border-primary/50 gpu-accelerated"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                    <value.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display font-semibold text-sm mb-1">{value.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.28, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
                style={{ willChange: 'transform' }}
                className="relative rounded-3xl border border-border/60 bg-card p-6 sm:p-8 text-center overflow-hidden shadow-crisp-xs hover:border-primary/50 hover:shadow-crisp-md transition-[border-color,box-shadow] duration-200 gpu-accelerated"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity" />
                <span className="relative flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary mb-4">
                  <stat.icon className="h-7 w-7" />
                </span>
                <p className="relative font-display text-3xl sm:text-4xl font-bold tracking-tight tabular-nums font-mono">
                  {stat.value}
                </p>
                <p className="relative text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Expandable Technical Standards & Verification Panel */}
        <div className="rounded-2xl border border-border/80 bg-card/95 dark:bg-card/85 overflow-hidden shadow-crisp-xs gpu-accelerated">
          <motion.button
            type="button"
            whileTap={{ scale: 0.992 }}
            onClick={() => setCredentialsOpen(!credentialsOpen)}
            className="flex w-full items-center justify-between p-6 sm:p-7 text-left select-none cursor-pointer group hover:bg-muted/30 transition-colors"
            aria-expanded={credentialsOpen}
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.065em] text-primary block">
                  Quality Assurance &amp; Code of Practice
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">
                  View Verified Technical Standards, Tools &amp; Warranty Policy
                </h3>
              </div>
            </div>

            <motion.div
              animate={{ rotate: credentialsOpen ? 180 : 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-foreground transition-colors ml-4"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </motion.button>

          <AnimatePresence initial={false}>
            {credentialsOpen && (
              <motion.div
                key="credentials-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: 'height, opacity' }}
                className="overflow-hidden"
              >
                <div className="p-6 sm:p-7 pt-2 border-t border-border/50 grid sm:grid-cols-2 gap-4">
                  {credentials.map((cred) => (
                    <div
                      key={cred.title}
                      className="p-4 rounded-xl border border-border/60 bg-muted/30 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <h4 className="font-display font-semibold text-sm text-foreground">
                          {cred.title}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                        {cred.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
