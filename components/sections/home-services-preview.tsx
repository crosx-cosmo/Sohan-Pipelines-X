'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Check,
  Clock,
  Sparkles,
  ShieldCheck,
  Gauge,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { services, type Category, categoryLabels } from '@/lib/services';

const filterCategories: Category[] = [
  'all',
  'residential',
  'installation',
  'emergency',
  'maintenance',
];

export function HomeServicesPreview() {
  const [selectedCategory, setSelectedCategory] = React.useState<Category>('all');

  const filteredServices = React.useMemo(() => {
    if (selectedCategory === 'all') {
      return services.slice(0, 6);
    }
    return services.filter((s) => s.category === selectedCategory).slice(0, 6);
  }, [selectedCategory]);

  return (
    <section className="py-20 lg:py-28 bg-card/40 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.065em] text-primary mb-2.5">
              <span>01. Core Capabilities</span>
              <span aria-hidden="true">·</span>
              <span className="text-muted-foreground font-medium">Residential &amp; Commercial</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight text-foreground text-balance">
              Engineered Plumbing Solutions For Every Structure
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed text-pretty font-normal tracking-[0.002em]">
              We specialize in durable pipe fitting, sanitary fixtures, and emergency
              waterline repairs with transparent estimates and master trade standards.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button asChild variant="outline" size="sm" className="font-semibold text-xs h-9.5 rounded-xl border-border/80">
              <Link href="/services">
                View All 12 Services
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button asChild size="sm" className="font-semibold text-xs h-9.5 rounded-xl shadow-sm">
              <Link href="/book">Schedule Visit</Link>
            </Button>
          </div>
        </motion.div>

        {/* Category Filter Tabs with Motion Layout Pill */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {filterCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <motion.button
                key={cat}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer select-none ${
                  isSelected
                    ? 'text-primary-foreground font-bold'
                    : 'text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/70'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="serviceFilterPill"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/25 -z-10"
                  />
                )}
                {categoryLabels[cat]}
              </motion.button>
            );
          })}
        </div>

        {/* 6-Card High-Density Grid with Motion */}
        <motion.div layout="position" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  layout="position"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.24, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4 }}
                  style={{ willChange: 'transform' }}
                  className="gpu-accelerated"
                >
                  <Card className="h-full border border-border/80 bg-card/95 dark:bg-card/85 backdrop-blur-sm rounded-2xl transition-[border-color,box-shadow] duration-200 shadow-crisp-sm hover:shadow-crisp-lg hover:border-primary/60 flex flex-col justify-between group">
                    <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        {/* Icon & Title Row */}
                        <div className="flex items-start gap-3.5 mb-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-display font-bold text-base text-foreground leading-tight group-hover:text-primary transition-colors">
                              {service.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span className="capitalize">{service.category}</span>
                              <span aria-hidden="true">·</span>
                              <span className="flex items-center gap-1 tabular-nums font-mono">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                {service.duration}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {service.description}
                        </p>
                      </div>

                      {/* Feature Bullets */}
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-[11px] font-semibold text-foreground uppercase tracking-[0.06em] mb-2">
                          Scope of Work:
                        </p>
                        <ul className="space-y-1.5">
                          {service.features.slice(0, 3).map((f) => (
                            <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground font-normal tracking-normal">
                              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span className="line-clamp-1">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pricing & Booking CTA Button */}
                      <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[11px] text-muted-foreground font-medium block tracking-normal">Starting Quote</span>
                          <span className="text-base font-bold text-foreground tabular-nums font-mono">
                            ₹{service.startingPrice}
                          </span>
                        </div>

                        <Button asChild size="sm" className="text-xs font-semibold h-8.5 rounded-lg group/btn shadow-xs">
                          <Link href="/book">
                            Book Service
                            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Quality Guarantee Strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 rounded-3xl border border-border/70 bg-muted/30 p-6 sm:p-8 backdrop-blur-sm"
        >
          <div className="grid md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-border/60">
            <div className="flex items-start gap-3.5 md:pr-4 pt-4 md:pt-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-foreground">
                  Astral &amp; Supreme Certified Fittings
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  We install heavy-gauge CPVC, UPVC &amp; SWR fittings built to prevent
                  calcification, corrosion, and leaks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 md:px-6 pt-4 md:pt-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-foreground">
                  Hydrostatic Pressure Calibration
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Every pipeline installation is hydro-tested to guarantee zero pressure
                  loss and leak-free joint welds.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 md:pl-6 pt-4 md:pt-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-foreground">
                  Transparent Written Estimates
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Inspection and material costs are explained upfront. You only pay
                  when the job is tested to your satisfaction.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
