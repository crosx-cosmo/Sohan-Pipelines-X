'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { MapPin, Navigation, Phone, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { businessInfo } from '@/lib/business-info';
import { DispatchHubMap } from '@/components/dispatch-hub-map';

export function ServiceAreasSection() {
  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Interactive Dispatch Topology Map */}
        <DispatchHubMap />

        {/* District Breakdowns */}
        <div className="space-y-12">
          {Object.entries(businessInfo.serviceDistricts).map(([district, areas], di) => (
            <div key={district} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/60 gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Navigation className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      {district}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {di === 0 ? 'Primary Operating Division' : 'Scheduled Commercial Corridor'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>{di === 0 ? 'Same-Day Dispatch Available' : '24–48 Hr Booking Window'}</span>
                  </span>
                </div>
              </div>

              {/* Area Cards Grid */}
              <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                {areas.map((area, idx) => (
                  <motion.div
                    key={area}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.25, delay: idx * 0.03, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.985 }}
                    style={{ willChange: 'transform' }}
                    className="group rounded-xl border border-border/80 bg-card p-4 transition-[border-color,box-shadow] duration-200 shadow-crisp-xs hover:shadow-crisp-md hover:border-primary/60 flex flex-col justify-between gpu-accelerated cursor-pointer select-none"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary shrink-0 transition-transform group-hover:scale-110" />
                        <span className="text-sm font-semibold text-foreground">{area}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        Active
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Pipe repair, leak inspection, bathroom fittings, and emergency calls.
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-muted-foreground">Standard rates apply</span>
                      <Link
                        href="/book"
                        className="text-primary font-semibold text-xs flex items-center gap-1 group-hover:underline"
                      >
                        Book <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Central Operations Depot Callout */}
        <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span>Base Operations &amp; Workshop</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
              Located at {businessInfo.address}, {businessInfo.area}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Equipped with heavy solvent weld inventory, motorized drain cleanout machines, acoustic leak detectors, and copper pipe benders.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Button asChild size="lg" className="w-full sm:w-auto font-semibold text-xs sm:text-sm h-11 px-6 shadow-md">
              <Link href="/book">
                Book Visit in Your Area
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto font-semibold text-xs sm:text-sm h-11 px-6">
              <a href={`tel:${businessInfo.phone}`}>
                <Phone className="mr-2 h-4 w-4 text-primary" />
                Call Hotline
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
