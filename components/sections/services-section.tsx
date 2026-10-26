'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  ArrowRight,
  Clock,
  ChevronDown,
  ShieldCheck,
  Wrench,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { HowOurServiceWorks } from '@/components/service-estimator';

type CategoryFilter = 'all' | 'residential' | 'commercial' | 'emergency' | 'installation' | 'maintenance';

const categories: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Services' },
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'installation', label: 'Installation' },
  { id: 'maintenance', label: 'Maintenance' },
];

export function ServicesSection() {
  const [servicesList, setServicesList] = React.useState<DbService[]>(() => getCachedServices() ?? []);
  const [loading, setLoading] = React.useState(() => !getCachedServices());
  const [error, setError] = React.useState<string | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<CategoryFilter>('all');
  const [expandedCardIds, setExpandedCardIds] = React.useState<string[]>([]);

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

  const filtered = React.useMemo(() => {
    if (activeCategory === 'all') return servicesList;
    return servicesList.filter((s) => getServiceCategory(s.slug || s.name) === activeCategory);
  }, [servicesList, activeCategory]);

  const toggleExpand = (id: string) => {
    setExpandedCardIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Category Filter Controls */}
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'relative px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer select-none',
                  isSelected
                    ? 'text-primary-foreground font-bold'
                    : 'text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/70'
                )}
              >
                {isSelected && (
                  <motion.span
                    layoutId="servicesPageFilterPill"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/25 -z-10"
                  />
                )}
                {cat.label}
              </motion.button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-72 rounded-2xl border border-border/60 bg-card/60 p-6 flex flex-col justify-between animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-4/5 rounded bg-muted" />
                </div>
                <div className="h-9 w-full rounded-xl bg-muted" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-3xl border border-border/80 bg-card p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4 shadow-crisp-md">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mx-auto">
              <Wrench className="h-7 w-7 text-primary/70" />
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground">
              No Service Available At This Time
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              Please check back shortly or call our hotline for direct inquiries and emergency plumbing assistance.
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

        {/* Empty State when Database table has 0 rows */}
        {!loading && !error && servicesList.length === 0 && (
          <div className="rounded-3xl border border-border/80 bg-card p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4 shadow-crisp-md">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mx-auto">
              <Wrench className="h-7 w-7 text-primary/70" />
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground">
              No Service Available At This Time
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              Please check back shortly or call our hotline for direct inquiries and emergency plumbing assistance.
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

        {/* Empty Filter State */}
        {!loading && !error && servicesList.length > 0 && filtered.length === 0 && (
          <div className="rounded-3xl border border-border/80 bg-card p-10 text-center max-w-md mx-auto space-y-3">
            <h3 className="font-display font-bold text-lg text-foreground">
              No Service Available At This Time
            </h3>
            <p className="text-xs text-muted-foreground">
              No services found for the selected category.
            </p>
            <Button onClick={() => setActiveCategory('all')} size="sm" variant="outline" className="rounded-xl">
              View All Services
            </Button>
          </div>
        )}

        {/* Services Cards Grid with Live Data */}
        {!loading && !error && servicesList.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((service) => {
                const Icon = getServiceIcon(service.slug || service.name);
                const category = getServiceCategory(service.slug || service.name);
                const features = getServiceFeatures(service.slug || service.name);
                const isExpanded = expandedCardIds.includes(service.id);

                return (
                  <motion.div
                    key={service.id}
                    layout="position"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full"
                  >
                    <Card
                      className={cn(
                        'h-full border transition-[border-color,box-shadow] duration-200 rounded-2xl flex flex-col justify-between bg-card/95 dark:bg-card/85 shadow-crisp-sm hover:shadow-crisp-lg',
                        isExpanded
                          ? 'border-primary/60 ring-1 ring-primary/20'
                          : 'border-border/80 hover:border-primary/50'
                      )}
                    >
                      <CardHeader className="p-6 pb-4">
                        <div className="flex items-start gap-4">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            <Icon className="h-6 w-6" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base font-display font-bold leading-tight group-hover:text-primary transition-colors">
                              {service.name}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 tabular-nums font-mono">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                              {service.duration || '1-3 hours'}
                              <span className="text-border">·</span>
                              <span className="capitalize text-muted-foreground font-sans font-medium">
                                {category}
                              </span>
                            </p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="px-6 py-2 flex-1 space-y-4">
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {service.description ||
                            'Professional plumbing engineering and maintenance services by certified technicians.'}
                        </p>

                        {/* Primary Scope Checklist */}
                        <div className="pt-2 border-t border-border/50">
                          <ul className="space-y-1.5">
                            {features.slice(0, 3).map((feature) => (
                              <li
                                key={feature}
                                className="flex items-center gap-2 text-xs text-muted-foreground"
                              >
                                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span className="line-clamp-1">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Expandable Specifications Toggle Button */}
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleExpand(service.id)}
                          className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-muted/30 hover:bg-muted/60 text-xs font-semibold text-foreground transition-colors cursor-pointer select-none"
                          aria-expanded={isExpanded}
                        >
                          <span className="flex items-center gap-1.5">
                            <Wrench className="h-3.5 w-3.5 text-primary" />
                            {isExpanded ? 'Hide Specifications' : 'View Full Scope & Specs'}
                          </span>
                          <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                          </motion.span>
                        </motion.button>

                        {/* Animated Expandable Specifications Panel */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              key={`expanded-spec-${service.id}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                              style={{ willChange: 'height, opacity' }}
                              className="overflow-hidden"
                            >
                              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-2.5">
                                {features.length > 3 && (
                                  <div>
                                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block mb-1">
                                      Additional Scope Included:
                                    </span>
                                    <ul className="space-y-1">
                                      {features.slice(3).map((f) => (
                                        <li
                                          key={f}
                                          className="flex items-center gap-1.5 text-muted-foreground"
                                        >
                                          <Sparkles className="h-3 w-3 text-primary shrink-0" />
                                          <span>{f}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                <div className="pt-2 border-t border-border/50 space-y-1.5 text-[11px] text-muted-foreground">
                                  <div className="flex items-center justify-between">
                                    <span>Specification Standard:</span>
                                    <span className="font-mono text-[10px] font-bold text-primary">
                                      ISI Class-S Verified
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Material Grade:</span>
                                    <span className="font-semibold text-foreground">
                                      Heavy-gauge CPVC / UPVC / Brass
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Testing Protocol:</span>
                                    <span className="font-semibold text-foreground">
                                      Hydrostatic Leak Inspection
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Warranty Protection:</span>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                      Guaranteed Workmanship
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>

                      <CardFooter className="p-6 pt-4 border-t border-border/60 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-muted-foreground font-medium block">
                            Starting Quote
                          </span>
                          <p className="text-base font-bold font-display text-foreground tabular-nums font-mono">
                            ₹{service.price}
                          </p>
                        </div>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            asChild
                            size="sm"
                            className="text-xs font-semibold h-9 px-4 rounded-xl group/btn shadow-xs"
                          >
                            <Link href={`/book?service=${service.id}`}>
                              Book Service
                              <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                            </Link>
                          </Button>
                        </motion.div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* How Our Plumbing Service Works (4-Step Engineering Protocol) */}
        <HowOurServiceWorks className="mt-14" />

        {/* Custom jobs prompt */}
        <div className="mt-14 text-center rounded-2xl border border-border/70 bg-muted/30 p-8 max-w-2xl mx-auto shadow-crisp-xs">
          <ShieldCheck className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-display font-bold text-base text-foreground">
            Don&apos;t see the exact plumbing configuration you need?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
            We handle custom commercial plant fitments, well-bore pipeline integrations, and complete bathroom overhauls across South Bengal.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="sm" variant="outline" className="text-xs font-semibold h-9.5 px-4 rounded-xl border-border/80">
              <a href={`tel:${businessInfo.phone}`}>
                Call {businessInfo.phoneDisplay}
              </a>
            </Button>
            <Button asChild size="sm" className="text-xs font-semibold h-9.5 px-4 rounded-xl shadow-xs">
              <Link href="/contact">
                Request Custom Quote
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
