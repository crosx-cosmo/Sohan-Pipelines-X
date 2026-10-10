'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, Clock, ChevronDown, ShieldCheck, Wrench, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { services, categoryLabels, type Category } from '@/lib/services';
import { businessInfo } from '@/lib/business-info';
import { cn } from '@/lib/utils';

const categories: Category[] = ['all', 'residential', 'commercial', 'emergency', 'installation', 'maintenance'];

export function ServicesSection() {
  const [activeCategory, setActiveCategory] = React.useState<Category>('all');
  const [expandedCardIds, setExpandedCardIds] = React.useState<string[]>([]);

  const filtered = React.useMemo(() => {
    if (activeCategory === 'all') return services;
    return services.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  const toggleExpand = (id: string) => {
    setExpandedCardIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Category Filter Controls with Animated Pill */}
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <motion.button
                key={cat}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveCategory(cat)}
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
                {categoryLabels[cat]}
              </motion.button>
            );
          })}
        </div>

        {/* Services Cards Grid with Motion */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((service) => {
              const isExpanded = expandedCardIds.includes(service.id);
              return (
                <motion.div
                  key={service.id}
                  layout="position"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full gpu-accelerated"
                >
                  <Card className={cn(
                    'h-full border transition-[border-color,box-shadow] duration-200 rounded-2xl flex flex-col justify-between bg-card/95 dark:bg-card/85 shadow-crisp-sm hover:shadow-crisp-lg',
                    isExpanded ? 'border-primary/60 ring-1 ring-primary/20' : 'border-border/80 hover:border-primary/50'
                  )}>
                    <CardHeader className="p-6 pb-4">
                      <div className="flex items-start gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <service.icon className="h-6 w-6" />
                        </span>
                        <div className="flex-1">
                          <CardTitle className="text-base font-display font-bold leading-tight group-hover:text-primary transition-colors">
                            {service.name}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 tabular-nums font-mono">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            {service.duration}
                            <span className="text-border">·</span>
                            <span className="capitalize text-muted-foreground font-sans font-medium">{service.category}</span>
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="px-6 py-2 flex-1 space-y-4">
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>

                      {/* Primary Scope Checklist */}
                      <div className="pt-2 border-t border-border/50">
                        <ul className="space-y-1.5">
                          {service.features.slice(0, 3).map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
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
                              {service.features.length > 3 && (
                                <div>
                                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block mb-1">
                                    Additional Scope Included:
                                  </span>
                                  <ul className="space-y-1">
                                    {service.features.slice(3).map((f) => (
                                      <li key={f} className="flex items-center gap-1.5 text-muted-foreground">
                                        <Sparkles className="h-3 w-3 text-primary shrink-0" />
                                        <span>{f}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div className="pt-2 border-t border-border/50 space-y-1.5 text-[11px] text-muted-foreground">
                                <div className="flex items-center justify-between">
                                  <span>Material Grade:</span>
                                  <span className="font-semibold text-foreground">Heavy-gauge CPVC / UPVC / Brass</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Testing Protocol:</span>
                                  <span className="font-semibold text-foreground">Hydrostatic Leak Inspection</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Warranty Protection:</span>
                                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Guaranteed Workmanship</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>

                    <CardFooter className="p-6 pt-4 border-t border-border/60 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-muted-foreground font-medium block">Starting Quote</span>
                        <p className="text-base font-bold font-display text-foreground tabular-nums font-mono">
                          ₹{service.startingPrice}
                        </p>
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          asChild
                          size="sm"
                          className="text-xs font-semibold h-9 px-4 rounded-xl group/btn shadow-xs"
                        >
                          <Link href="/book">
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
