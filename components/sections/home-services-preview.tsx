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
  Wrench,
  Layers,
  Award,
  Compass,
  Droplets,
  Phone,
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

type FilterCategory =
  | 'all'
  | 'residential'
  | 'installation'
  | 'emergency'
  | 'maintenance'
  | 'commercial';

const filterCategories: { id: FilterCategory; label: string }[] = [
  { id: 'all', label: 'All Services' },
  { id: 'residential', label: 'Residential' },
  { id: 'installation', label: 'Installation' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'commercial', label: 'Commercial' },
];

const ENGINEERING_BLUEPRINTS = [
  {
    id: 'concealed-piping',
    code: 'STD-01',
    title: 'Concealed Hot & Cold Pipeline Architecture',
    subtitle: 'Zero-Leak Solvent Weld & Thermal Expansion Protection',
    icon: Layers,
    summary:
      'Engineered in-wall CPVC and heavy-gauge UPVC distribution manifolds designed for multi-story residences and commercial washrooms with balanced water pressure across every outlet.',
    standards: [
      'ISI-certified Astral, Supreme & Ashirvad SDR-11 heavy-gauge piping',
      'Precision spirit-level alignment & concealed wall chasing with minimal tile impact',
      'Full-bore brass isolation ball valves for independent floor & zone control',
      'Thermal insulation sleeving on hot-water geyser and solar return lines',
    ],
    benchmark: '100% Hydro-Tested Before Wall Plastering',
    warranty: '12-Month Joint & Seal Workmanship Warranty',
    ctaHref: '/book',
  },
  {
    id: 'pressure-calibration',
    code: 'STD-02',
    title: 'Hydrostatic Pressure & Acoustic Leak Diagnostics',
    subtitle: 'Non-Destructive Moisture Tracing & Line Stabilization',
    icon: Gauge,
    summary:
      'Pinpoint detection of hidden dampness, underground line drops, and faulty diverter seals using acoustic listening instruments and calibrated pressure gauges—avoiding unnecessary floor breakage.',
    standards: [
      'Multi-zone pressure isolation testing to identify exact leaking branch lines',
      'High-grade PTFE polymer thread sealing & heavy brass union replacements',
      'Water hammer arrestor & pressure-reducing valve (PRV) calibration',
      'Complete dampness source verification before structural touch-up',
    ],
    benchmark: 'Zero Pressure Drop Verification',
    warranty: 'Guaranteed Leak-Free Handover Sign-Off',
    ctaHref: '/book',
  },
  {
    id: 'sanitary-drainage',
    code: 'STD-03',
    title: 'Precision Sanitaryware & High-Flow Drainage',
    subtitle: 'Laser-Leveled Fixtures & Anti-Siphon Gradient Engineering',
    icon: Compass,
    summary:
      'Complete installation of wall-hung commodes, concealed cisterns, thermostatic rain-shower diverters, and SWR drainage lines calculated at exact hydraulic gradients to prevent odour or backflow.',
    standards: [
      'Exact laser-height & plumb-line mounting for concealed diverters and basins',
      'Anti-cockroach & anti-odour stainless steel floor traps with deep water seals',
      'Motorized steel auger & high-flow jetting for blocked underground chambers',
      'Scratch-free chrome fixture installation with protective masking',
    ],
    benchmark: 'Anti-Odour & Rapid Discharge Certified',
    warranty: '12-Month Fixture & Fitment Protection',
    ctaHref: '/book',
  },
  {
    id: 'tank-manifold',
    code: 'STD-04',
    title: 'Overhead Storage Tank & Booster Pump Manifolds',
    subtitle: 'Hygienic Multi-Layer Storage & Automated Pump Control',
    icon: Droplets,
    summary:
      'Heavy-duty rooftop water tank interconnections, air-vent risers, non-return brass check valves, and automated pressure booster pump piping for uninterrupted 24/7 water supply.',
    standards: [
      'Vibration-isolated pump suction & delivery manifolds with union couplings',
      'Heavy-duty brass foot valves, float switches & overflow bypass routing',
      'Sediment flush-out drain valve integration for effortless tank cleaning',
      'UV-stabilized exterior pipeline routing with heavy GI/UPVC pipe clamps',
    ],
    benchmark: 'Balanced Multi-Floor Flow Pressure',
    warranty: '12-Month Manifold & Valve Warranty',
    ctaHref: '/book',
  },
] as const;

export function HomeServicesPreview() {
  const [servicesList, setServicesList] = React.useState<DbService[]>(
    () => getCachedServices() ?? []
  );
  const [loading, setLoading] = React.useState(() => !getCachedServices());
  const [error, setError] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    React.useState<FilterCategory>('all');
  const [activeBlueprintId, setActiveBlueprintId] =
    React.useState<string>('concealed-piping');

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

  const activeBlueprint =
    ENGINEERING_BLUEPRINTS.find((b) => b.id === activeBlueprintId) ||
    ENGINEERING_BLUEPRINTS[0];

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
              <span className="text-muted-foreground font-medium">
                12 Certified Plumbing Disciplines
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight text-foreground text-balance">
              Engineered Plumbing Solutions For Every Structure
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed text-pretty font-normal tracking-[0.002em]">
              Comprehensive pipe fitting, concealed leak detection, and
              precision sanitary installations backed by transparent pricing
              approval and master workmanship.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="font-semibold text-xs h-9.5 rounded-xl border-border/80"
            >
              <Link href="/services">
                View All Services
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="font-semibold text-xs h-9.5 rounded-xl shadow-sm"
            >
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
              Please check back shortly or call our hotline for direct
              inquiries.
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
              No Service Available At This Time
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Please check back shortly or call our hotline for direct
              inquiries.
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

        {/* 6-Card High-Density Grid with Motion */}
        {!loading && !error && filteredServices.length > 0 && (
          <motion.div
            layout="position"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, index) => {
                const Icon = getServiceIcon(service.slug || service.name);
                const category = getServiceCategory(
                  service.slug || service.name
                );
                const features = getServiceFeatures(
                  service.slug || service.name
                );

                return (
                  <motion.div
                    key={service.id}
                    layout="position"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.24,
                      delay: index * 0.03,
                      ease: [0.16, 1, 0.3, 1],
                    }}
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

                          <Button
                            asChild
                            size="sm"
                            className="text-xs font-semibold h-8.5 rounded-lg group/btn shadow-xs"
                          >
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

        {/* Enterprise Master Engineering Blueprint & On-Site Execution Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 lg:p-10 shadow-crisp-md"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-border/60">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.07em] text-primary">
                <Award className="h-4 w-4" />
                <span>Master Engineering &amp; Handover Standards</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-1.5 tracking-tight">
                Built to National Plumbing Code &amp; ISI Material Specifications
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                Select any of our four core engineering disciplines below to inspect our on-site material specifications, hydrostatic testing benchmarks, and warranty deliverables.
              </p>
            </div>

            {/* 4-Tab Discipline Switcher */}
            <div className="flex flex-wrap gap-2 shrink-0">
              {ENGINEERING_BLUEPRINTS.map((item) => {
                const Icon = item.icon;
                const active = item.id === activeBlueprintId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveBlueprintId(item.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      active
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                        : 'border-border/80 bg-muted/35 text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-mono text-[10px] opacity-80">
                      {item.code}
                    </span>
                    <span className="hidden sm:inline">
                      {item.title.split(' ')[0]} {item.title.split(' ')[1]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Blueprint Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBlueprint.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="pt-6 grid gap-8 lg:grid-cols-12 items-center"
            >
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="font-mono font-bold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                    {activeBlueprint.code}
                  </span>
                  <span className="font-semibold text-muted-foreground">
                    {activeBlueprint.subtitle}
                  </span>
                </div>

                <h4 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                  {activeBlueprint.title}
                </h4>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {activeBlueprint.summary}
                </p>

                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  {activeBlueprint.standards.map((std) => (
                    <div
                      key={std}
                      className="flex items-start gap-2.5 p-3 rounded-xl border border-border/60 bg-muted/20 text-xs text-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{std}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Verification & Guarantee Panel */}
              <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-muted/30 p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold block">
                      Quality Sign-Off Protocol
                    </span>
                    <h5 className="font-display font-bold text-sm sm:text-base text-foreground mt-0.5">
                      Mandatory Pre-Handover Audit
                    </h5>
                  </div>
                  <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Testing Benchmark</span>
                    <span className="font-semibold text-foreground text-right">
                      {activeBlueprint.benchmark}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Authorized Brands</span>
                    <span className="font-semibold text-foreground text-right">
                      Astral · Supreme · Finolex
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Service Warranty</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-right">
                      {activeBlueprint.warranty}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <Button
                    asChild
                    className="flex-1 h-10 rounded-xl text-xs font-semibold"
                  >
                    <Link href={activeBlueprint.ctaHref}>
                      Schedule Master Plumber
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-10 rounded-xl text-xs font-semibold"
                  >
                    <a href={`tel:${businessInfo.phone}`}>
                      <Phone className="mr-1.5 h-3.5 w-3.5 text-primary" />
                      Call Desk
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Quality Guarantee Strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 rounded-3xl border border-border/70 bg-muted/30 p-6 sm:p-8 backdrop-blur-sm"
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
                  We install heavy-gauge CPVC, UPVC &amp; SWR fittings built to
                  prevent calcification, corrosion, and leaks.
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
                  Every pipeline installation is hydro-tested to guarantee zero
                  pressure loss and leak-free joint welds.
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
                  Inspection and material costs are explained upfront. You only
                  pay when the job is tested to your satisfaction.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
