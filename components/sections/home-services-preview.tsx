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
  RefreshCw,
  AlertTriangle,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  fetchLiveServices,
  getCachedServices,
  getServiceIcon,
  getServiceCategory,
  getServiceFeatures,
  type DbService,
} from '@/lib/supabase-data';
import { businessInfo } from '@/lib/business-info';
import { cn } from '@/lib/utils';

type FilterCategory = 'all' | 'residential' | 'installation' | 'emergency' | 'maintenance' | 'commercial';

const filterCategories: { id: FilterCategory; label: string }[] = [
  { id: 'all', label: 'All Services' },
  { id: 'residential', label: 'Residential' },
  { id: 'installation', label: 'Installation' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'commercial', label: 'Commercial' },
];

export function HomeServicesPreview() {
  const [servicesList, setServicesList] = React.useState<DbService[]>(() => getCachedServices() ?? []);
  const [loading, setLoading] = React.useState(() => !getCachedServices());
  const [error, setError] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<FilterCategory>('all');

  const loadServices = React.useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    const { data, error: err } = await fetchLiveServices();
    if (err) {
      setError(err);
      setServicesList([]);
    } else {
      setServicesList(data);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    let active = true;
    fetchLiveServices().then(({ data, error: err }) => {
      if (!active) return;
      if (err) {
        setError(err);
        setServicesList([]);
      } else {
        setServicesList(data);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const filteredServices = React.useMemo(() => {
    if (selectedCategory === 'all') {
      return servicesList.slice(0, 6);
    }
    return servicesList
      .filter((s) => getServiceCategory(s.slug || s.name) === selectedCategory)
      .slice(0, 6);
  }, [servicesList, selectedCategory]);

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
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight text-foreground text-balance">
              Engineered Plumbing Solutions For Every Structure
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed text-pretty font-normal tracking-[0.002em]">
              Comprehensive pipe fitting, concealed leak detection, and precision sanitary installations backed by transparent pricing approval and master workmanship.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button asChild variant="outline" size="sm" className="font-semibold text-xs h-9.5 rounded-xl border-border/80">
              <Link href="/services">
                View All Services
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
            const isSelected = selectedCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCategory(cat.id)}
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
                {cat.label}
              </motion.button>
            );
          })}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl border border-border/60 bg-card p-6 animate-pulse space-y-3"
              >
                <div className="h-10 w-10 rounded-xl bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-4 w-1/3 rounded bg-muted mt-6" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-3xl border border-border/80 bg-card p-10 sm:p-12 text-center space-y-4 mb-8 max-w-xl mx-auto shadow-crisp-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mx-auto">
              <Wrench className="h-6 w-6 text-primary/70" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground">
              No Service Available At This Time
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Please check back shortly or call our hotline for direct inquiries.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="sm" className="rounded-xl font-semibold">
                <a href={`tel:${businessInfo.phone}`}>
                  Call {businessInfo.phoneDisplay}
                </a>
              </Button>
              <Button onClick={() => loadServices(true)} size="sm" variant="outline" className="rounded-xl">
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && servicesList.length === 0 && (
          <div className="rounded-3xl border border-border/80 bg-card p-10 sm:p-12 text-center space-y-4 mb-8 max-w-xl mx-auto shadow-crisp-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mx-auto">
              <Wrench className="h-6 w-6 text-primary/70" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground">
              No Service Available At This Time
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Please check back shortly or call our hotline for direct inquiries.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="sm" className="rounded-xl font-semibold">
                <a href={`tel:${businessInfo.phone}`}>
                  Call {businessInfo.phoneDisplay}
                </a>
              </Button>
              <Button onClick={() => loadServices(true)} size="sm" variant="outline" className="rounded-xl">
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>
          </div>
        )}

        {/* 6-Card High-Density Grid with Motion */}
        {!loading && !error && filteredServices.length > 0 && (
          <motion.div layout="position" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, index) => {
                const Icon = getServiceIcon(service.slug || service.name);
                const category = getServiceCategory(service.slug || service.name);
                const features = getServiceFeatures(service.slug || service.name);

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
                                <span className="capitalize">{category}</span>
                                <span aria-hidden="true">·</span>
                                <span className="flex items-center gap-1 tabular-nums font-mono">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  {service.duration || '1-3 hours'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {service.description ||
                              'Professional plumbing installation, diagnostics, and repairs.'}
                          </p>
                        </div>

                        {/* Feature Bullets */}
                        <div className="pt-2 border-t border-border/50">
                          <p className="text-[11px] font-semibold text-foreground uppercase tracking-[0.06em] mb-2">
                            Scope of Work:
                          </p>
                          <ul className="space-y-1.5">
                            {features.slice(0, 3).map((f) => (
                              <li
                                key={f}
                                className="flex items-center gap-2 text-xs text-muted-foreground font-normal tracking-normal"
                              >
                                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span className="line-clamp-1">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Pricing & Booking CTA Button */}
                        <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[11px] text-muted-foreground font-medium block tracking-normal">
                              Starting Quote
                            </span>
                            <span className="text-base font-bold text-foreground tabular-nums font-mono">
                              ₹{service.price}
                            </span>
                          </div>

                          <Button asChild size="sm" className="text-xs font-semibold h-8.5 rounded-lg group/btn shadow-xs">
                            <Link href={`/book?service=${service.id}`}>
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
        )}

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
