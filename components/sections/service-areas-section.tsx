'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
  RefreshCw,
  AlertTriangle,
  Loader2,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { businessInfo } from '@/lib/business-info';
import { DispatchHubMap } from '@/components/dispatch-hub-map';
import { fetchLiveServiceAreas, getCachedServiceAreas, type DbServiceArea } from '@/lib/supabase-data';
import { cn } from '@/lib/utils';

export function ServiceAreasSection() {
  const [areas, setAreas] = React.useState<DbServiceArea[]>(() => getCachedServiceAreas() ?? []);
  const [loading, setLoading] = React.useState(() => !getCachedServiceAreas());
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const loadAreas = React.useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    const { data, error: err } = await fetchLiveServiceAreas();
    if (err) {
      setError(err);
      setAreas([]);
    } else {
      setAreas(data);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    let active = true;
    fetchLiveServiceAreas().then(({ data, error: err }) => {
      if (!active) return;
      if (err) {
        setError(err);
        setAreas([]);
      } else {
        setAreas(data);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  // Filter areas in real time by search query
  const filteredAreas = React.useMemo(() => {
    if (!searchQuery.trim()) return areas;
    const q = searchQuery.toLowerCase().trim();
    return areas.filter(
      (a) =>
        a.locality.toLowerCase().includes(q) ||
        a.district.toLowerCase().includes(q) ||
        (a.pincode && a.pincode.includes(q)) ||
        (a.block && a.block.toLowerCase().includes(q))
    );
  }, [areas, searchQuery]);

  // Group filtered areas by district
  const districtGroups = React.useMemo(() => {
    const groups: Record<string, DbServiceArea[]> = {};
    for (const a of filteredAreas) {
      const d = a.district || 'Unassigned Division';
      if (!groups[d]) groups[d] = [];
      groups[d].push(a);
    }
    return groups;
  }, [filteredAreas]);

  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Interactive Dispatch Topology Map */}
        <DispatchHubMap />

        {/* Live Search Filter Control */}
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-crisp-xs">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search service areas by town, locality, district, or PIN code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 text-xs sm:text-sm bg-muted/30 border-border/60 rounded-xl"
            />
          </div>
          {searchQuery && (
            <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
              <span>
                Found <strong className="text-foreground">{filteredAreas.length}</strong> matching coverage area{filteredAreas.length === 1 ? '' : 's'}
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-primary hover:underline font-medium"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-32 rounded-xl border border-border/60 bg-card/60 p-4 animate-pulse space-y-2.5"
              >
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-3xl border border-border/80 bg-card p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4 shadow-crisp-md">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mx-auto">
              <MapPin className="h-7 w-7 text-primary/70" />
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground">
              No Service Available At This Time
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              Please check back shortly or call our hotline directly to confirm coverage in your area.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="sm" className="rounded-xl font-semibold">
                <a href={`tel:${businessInfo.phone}`}>
                  Call {businessInfo.phoneDisplay}
                </a>
              </Button>
              <Button onClick={() => loadAreas(true)} size="sm" variant="outline" className="rounded-xl">
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && areas.length === 0 && (
          <div className="rounded-3xl border border-border/80 bg-card p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4 shadow-crisp-md">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mx-auto">
              <MapPin className="h-7 w-7 text-primary/70" />
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground">
              No Service Available At This Time
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              Please check back shortly or call our hotline directly to confirm coverage in your area.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="sm" className="rounded-xl font-semibold">
                <a href={`tel:${businessInfo.phone}`}>
                  Call {businessInfo.phoneDisplay}
                </a>
              </Button>
              <Button onClick={() => loadAreas(true)} size="sm" variant="outline" className="rounded-xl">
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>
          </div>
        )}

        {/* Empty Filter State */}
        {!loading && !error && areas.length > 0 && filteredAreas.length === 0 && (
          <div className="rounded-3xl border border-border/80 bg-card p-10 text-center max-w-md mx-auto space-y-3">
            <h3 className="font-display font-bold text-lg text-foreground">
              No Service Available At This Time
            </h3>
            <p className="text-xs text-muted-foreground">
              No service areas matching &quot;{searchQuery}&quot;. Try another locality or clear the filter.
            </p>
            <Button onClick={() => setSearchQuery('')} size="sm" variant="outline" className="rounded-xl">
              Clear Filter
            </Button>
          </div>
        )}

        {/* Live District Breakdowns from Supabase */}
        {!loading && !error && areas.length > 0 && (
          <div className="space-y-12">
            {Object.entries(districtGroups).map(([district, districtAreas], di) => (
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
                        {districtAreas.length} verified service coverage zone{districtAreas.length === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>Same-Day Rapid Dispatch on Duty</span>
                    </span>
                  </div>
                </div>

                {/* Area Cards Grid with Live Records */}
                <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                  {districtAreas.map((area, idx) => (
                    <motion.div
                      key={`${area.id || area.locality}-${idx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.02 }}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.985 }}
                      style={{ willChange: 'transform' }}
                      className="group rounded-xl border border-border/80 bg-card p-4 transition-[border-color,box-shadow] duration-200 shadow-crisp-xs hover:shadow-crisp-md hover:border-primary/60 flex flex-col justify-between cursor-pointer select-none"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary shrink-0 transition-transform group-hover:scale-110" />
                            <span className="text-sm font-semibold text-foreground">
                              {area.locality}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold">
                            Live
                          </span>
                        </div>

                        <div className="mt-2 space-y-1 text-xs text-muted-foreground leading-relaxed">
                          {area.pincode && (
                            <p className="text-[11px] font-mono text-muted-foreground">
                              PIN: <strong className="text-foreground">{area.pincode}</strong>
                            </p>
                          )}
                          {area.block && (
                            <p className="text-[11px]">
                              Block: {area.block}
                            </p>
                          )}
                          <p className="text-[11px]">
                            Pipe fitting, leak diagnosis &amp; emergency dispatch.
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-xs">
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          Verified Dispatch Zone
                        </span>
                        <Link
                          href={`/book?area=${encodeURIComponent(area.locality)}`}
                          className="text-primary font-semibold text-xs flex items-center gap-1 group-hover:underline"
                        >
                          Book Here <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Central Operations Depot Callout */}
        <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span>Base Operations &amp; Workshop</span>
            </div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
              {businessInfo.address}
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
