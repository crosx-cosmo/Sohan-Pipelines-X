'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { services, categoryLabels, type Category } from '@/lib/services';
import { cn } from '@/lib/utils';

const categories: Category[] = ['all', 'residential', 'commercial', 'emergency', 'installation', 'maintenance'];

export function ServicesSection() {
  const [activeCategory, setActiveCategory] = React.useState<Category>('all');

  const filtered = React.useMemo(() => {
    if (activeCategory === 'all') return services;
    return services.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Category Filter Controls */}
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer',
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {categoryLabels[cat]}
              </button>
            );
          })}
        </div>

        {/* Services Cards Grid with Motion */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="h-full border-border/70 bg-card rounded-2xl transition-all duration-200 hover:shadow-xl hover:border-primary/40 flex flex-col justify-between">
                  <CardHeader className="p-6 pb-4">
                    <div className="flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <service.icon className="h-6 w-6" />
                      </span>
                      <div className="flex-1">
                        <CardTitle className="text-base font-display font-bold leading-tight group-hover:text-primary transition-colors">
                          {service.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 tabular-nums font-mono">
                          <Clock className="h-3 w-3" />
                          {service.duration}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="px-6 py-2 flex-1 space-y-4">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>

                    <div className="pt-2 border-t border-border/50">
                      <ul className="space-y-1.5">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="line-clamp-1">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-4 border-t border-border/60 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-muted-foreground block">Starting Quote</span>
                      <p className="text-base font-bold font-display text-foreground tabular-nums font-mono">
                        ₹{service.startingPrice}
                      </p>
                    </div>

                    <Button
                      asChild
                      size="sm"
                      className="text-xs font-semibold h-9 px-4 group/btn"
                    >
                      <Link href="/book">
                        Book Service
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Custom jobs prompt */}
        <div className="mt-14 text-center rounded-2xl border border-border/70 bg-muted/30 p-8 max-w-2xl mx-auto">
          <h3 className="font-display font-bold text-base text-foreground mb-1">
            Need specialized industrial piping or whole-building layout?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-5 leading-relaxed text-balance">
            We handle multi-floor apartment lines, pump stations, agricultural piping, and factory drainage throughout Medinipur.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="outline" size="sm" className="font-semibold text-xs h-9">
              <Link href="/contact">Contact Our Engineers</Link>
            </Button>
            <Button asChild size="sm" className="font-semibold text-xs h-9">
              <Link href="/book">Schedule An Inspection</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
