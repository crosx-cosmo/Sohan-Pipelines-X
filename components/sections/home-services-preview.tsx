'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Check,
  Clock,
  Sparkles,
  ShieldCheck,
  Gauge,
  RefreshCw,
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
import { luxuryEasing } from '@/lib/motion';

export function HomeServicesPreview() {
  const [servicesList, setServicesList] = React.useState<DbService[]>(
    () => getCachedServices() ?? []
  );
  const [loading, setLoading] = React.useState(() => !getCachedServices());
  const [error, setError] = React.useState<string | null>(null);

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

  const previewServices = React.useMemo(
    () => servicesList.slice(0, 6),
    [servicesList]
  );

  return (
    <section className="py-16 lg:py-20 bg-card/40 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: luxuryEasing }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-[0.065em] text-primary mb-2.5">
              <span>01. Core Capabilities</span>
              <span aria-hidden="true">·</span>
              <span className="text-muted-foreground font-medium">
                Certified Plumbing Engineering
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground text-balance">
              Engineered Plumbing Services For Homes &amp; Commercial Buildings
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty font-normal">
              Curated highlights from our full service catalogue—from concealed
              CPVC/UPVC pipeline fitting and acoustic leak detection to sanitary
              fixture installation and overhead tank manifolds.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="font-semibold text-xs h-10 px-4 rounded-xl border-border/80 w-full sm:w-auto justify-center"
            >
              <Link href="/services">
                View All Services
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 shrink-0" />
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="font-semibold text-xs h-10 px-4 rounded-xl shadow-xs w-full sm:w-auto justify-center"
            >
              <Link href="/book">Book a Service</Link>
            </Button>
          </div>
        </motion.div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
              Unable to Load Services Right Now
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Please refresh or call our direct line to schedule your plumbing
              service.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="sm" className="rounded-xl font-semibold">
                <a href={`tel:${businessInfo.phone}`}>
                  Call {businessInfo.phoneDisplay}
                </a>
              </Button>
              <Button
                onClick={() => loadServices(true)}
                size="sm"
                variant="outline"
                className="rounded-xl"
              >
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
              Service Catalogue Updating
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Please check back shortly or call our desk for direct booking
              assistance.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="sm" className="rounded-xl font-semibold">
                <a href={`tel:${businessInfo.phone}`}>
                  Call {businessInfo.phoneDisplay}
                </a>
              </Button>
              <Button
                onClick={() => loadServices(true)}
                size="sm"
                variant="outline"
                className="rounded-xl"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>
          </div>
        )}

        {/* 6-Card Curated Preview Grid */}
        {!loading && !error && previewServices.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {previewServices.map((service, index) => {
              const Icon = getServiceIcon(service.slug || service.name);
              const category = getServiceCategory(service.slug || service.name);
              const features = getServiceFeatures(service.slug || service.name);

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.28,
                    delay: index * 0.04,
                    ease: luxuryEasing,
                  }}
                  className="h-full flex flex-col"
                >
                  <Card className="h-full p-0 gap-0 border border-border/80 bg-card rounded-2xl transition-all duration-200 shadow-crisp-xs hover:shadow-crisp-md hover:border-primary/50 flex flex-col justify-between group">
                    <CardContent className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        {/* Icon & Title Row */}
                        <div className="flex items-start gap-3.5 mb-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-display font-bold text-base text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                              {service.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground mt-1">
                              <span className="capitalize">{category}</span>
                              <span aria-hidden="true">·</span>
                              <span className="flex items-center gap-1 tabular-nums font-mono">
                                <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
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
                      <div className="pt-3 border-t border-border/50">
                        <p className="text-[11px] font-semibold text-foreground uppercase tracking-[0.06em] mb-2">
                          Included Standards:
                        </p>
                        <ul className="space-y-1.5">
                          {features.slice(0, 3).map((f) => (
                            <li
                              key={f}
                              className="flex items-center gap-2 text-xs text-muted-foreground"
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
                          <span className="text-[11px] text-muted-foreground font-medium block">
                            Starting Quote
                          </span>
                          <span className="text-base font-bold text-foreground tabular-nums font-mono">
                            ₹{service.price}
                          </span>
                        </div>

                        <Button
                          asChild
                          size="sm"
                          className="text-xs font-semibold h-9 px-3.5 rounded-xl group/btn shadow-2xs shrink-0"
                        >
                          <Link href={`/book?service=${service.id}`}>
                            Book Service
                            <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Quality Assurance & View All Services Bar */}
        <div className="mt-8 rounded-2xl border border-border/70 bg-card p-5 sm:px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-crisp-xs">
          <div className="grid sm:grid-cols-3 gap-4 flex-1 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  ISI Certified Fittings
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Astral, Supreme &amp; Finolex grade
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Gauge className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Hydrostatic Pressure Tested
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Verified leak-free before handover
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Upfront Written Quotes
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Pay only after job inspection
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-border/60 shrink-0">
            <span className="text-xs text-muted-foreground lg:hidden">
              {servicesList.length > 0
                ? `Live ${servicesList.length}-service catalogue`
                : 'Live service catalogue'}
            </span>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="font-semibold text-xs h-9.5 px-4 rounded-xl border-primary/30 text-primary hover:bg-primary/5"
            >
              <Link href="/services">
                View All Services
                {servicesList.length > 0 ? ` (${servicesList.length})` : ''}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

