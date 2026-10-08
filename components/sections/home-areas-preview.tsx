'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { ArrowRight, MapPin, Navigation, Phone, Clock, Search, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { businessInfo } from '@/lib/business-info';
import { DispatchHubMap } from '@/components/dispatch-hub-map';

export function HomeAreasPreview() {
  const [query, setQuery] = React.useState('');
  const paschimAreas = businessInfo.serviceDistricts['Paschim Medinipur'];
  const purbaAreas = businessInfo.serviceDistricts['Purba Medinipur'];
  const allAreas = [...paschimAreas, ...purbaAreas];

  const handleCheckArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.info('Please enter a town, village, or PIN code.');
      return;
    }
    const match = allAreas.find((area) =>
      area.toLowerCase().includes(query.trim().toLowerCase())
    );

    if (match) {
      toast.success(`Service Available in ${match}!`, {
        description: 'Our mobile plumbing units cover this location. Dispatch available.',
      });
    } else {
      toast.info(`Special Dispatch for "${query.trim()}"`, {
        description: 'We frequently travel to surrounding panchayats. Call us to confirm slot.',
        action: {
          label: 'Call Direct',
          onClick: () => {
            window.location.href = `tel:${businessInfo.phone}`;
          },
        },
      });
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-muted/20 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-2.5">
              <span>04. Regional Operations</span>
              <span aria-hidden="true">·</span>
              <span>South Bengal Network</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight text-foreground text-balance">
              Service Coverage &amp; Dispatch Hubs
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed text-balance">
              Operating directly from Keshrambha and Dantan, we provide structured,
              reliable plumbing dispatch throughout Paschim and Purba Medinipur.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button asChild variant="outline" size="sm" className="font-semibold text-xs h-9">
              <Link href="/service-areas">
                View All Hubs
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button asChild size="sm" className="font-semibold text-xs h-9">
              <Link href="/book">Book In Your Area</Link>
            </Button>
          </div>
        </div>

        {/* Interactive Quick Area Checker Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 p-4 sm:p-5 rounded-2xl bg-card border border-border/70 shadow-xs"
        >
          <form onSubmit={handleCheckArea} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Check your locality (e.g. Dantan, Kharagpur, Contai, Belda)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-11 text-xs sm:text-sm bg-muted/30 border-border/60"
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto h-11 px-5 text-xs font-semibold whitespace-nowrap">
              Verify Dispatch
            </Button>
          </form>
        </motion.div>

        {/* Visual Dispatch Topology Map */}
        <div className="mb-8">
          <DispatchHubMap />
        </div>

        {/* 2 Regional Hub Showcase Cards */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Paschim Medinipur Hub */}
          <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Navigation className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-foreground">
                      Paschim Medinipur District
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Base Operating Division (Dantan / Midnapore)
                    </p>
                  </div>
                </div>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Primary Hub
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Rapid turnaround for home repairs, commercial pipelines, and water tank
                installations along the NH-16 corridor, Dantan, Kharagpur, and Midnapore town.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {paschimAreas.map((town) => (
                  <span
                    key={town}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted/60 text-foreground border border-border/50"
                  >
                    <MapPin className="h-3 w-3 text-primary shrink-0" />
                    {town}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Response: Same-day available
              </span>
              <Button asChild size="sm" variant="ghost" className="text-xs font-semibold h-8 text-primary">
                <Link href="/book">Schedule Paschim Visit →</Link>
              </Button>
            </div>
          </div>

          {/* Purba Medinipur Hub */}
          <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-foreground">
                      Purba Medinipur District
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Coastal &amp; Commercial Corridor
                    </p>
                  </div>
                </div>
                <div className="text-xs font-semibold text-primary">
                  Scheduled Corridor
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Full bathroom renovations, overhead reservoir pipelines, and periodic
                maintenance across Contai, Tamluk, and Egra commercial and residential areas.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {purbaAreas.map((town) => (
                  <span
                    key={town}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted/60 text-foreground border border-border/50"
                  >
                    <MapPin className="h-3 w-3 text-accent shrink-0" />
                    {town}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-accent" />
                Response: 24–48 hr scheduled slots
              </span>
              <Button asChild size="sm" variant="ghost" className="text-xs font-semibold h-8 text-primary">
                <Link href="/book">Schedule Purba Visit →</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Coverage Assistance Banner */}
        <div className="mt-8 rounded-2xl border border-border/70 bg-card p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 hidden sm:flex">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Don&apos;t see your specific locality listed?
              </p>
              <p className="text-muted-foreground mt-0.5">
                We frequently travel to rural localities and adjacent Gram Panchayats. Give us a call directly.
              </p>
            </div>
          </div>

          <a
            href={`tel:${businessInfo.phone}`}
            className="font-bold text-primary hover:underline whitespace-nowrap"
          >
            Check Coverage: {businessInfo.phoneDisplay} →
          </a>
        </div>
      </div>
    </section>
  );
}
