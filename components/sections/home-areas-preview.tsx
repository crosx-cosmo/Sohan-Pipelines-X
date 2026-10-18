'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import {
  ArrowRight,
  MapPin,
  Navigation,
  Phone,
  Clock,
  Search,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { businessInfo } from '@/lib/business-info';
import { DispatchHubMap } from '@/components/dispatch-hub-map';
import { fetchLiveServiceAreas, getCachedServiceAreas, type DbServiceArea } from '@/lib/supabase-data';
import { cn } from '@/lib/utils';

export function HomeAreasPreview() {
  const [query, setQuery] = React.useState('');
  const [areas, setAreas] = React.useState<DbServiceArea[]>(() => getCachedServiceAreas() ?? []);
  const [loading, setLoading] = React.useState(() => !getCachedServiceAreas());
  const [error, setError] = React.useState<string | null>(null);

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

  // District grouping from database
  const districtGroups = React.useMemo(() => {
    const groups: Record<string, DbServiceArea[]> = {};
    for (const a of areas) {
      const d = a.district || 'Other Coverage';
      if (!groups[d]) groups[d] = [];
      groups[d].push(a);
    }
    return groups;
  }, [areas]);

  const handleCheckArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.info('Please enter a town, village, or PIN code.');
      return;
    }
    const q = query.trim().toLowerCase();
    const match = areas.find(
      (area) =>
        area.locality.toLowerCase().includes(q) ||
        area.district.toLowerCase().includes(q) ||
        (area.pincode && area.pincode.includes(q))
    );

    if (match) {
      toast.success(`Service Available in ${match.locality} (${match.district})!`, {
        description: `Verified service coverage. PIN: ${match.pincode || 'Active zone'}. Dispatch available today.`,
      });
    } else {
      toast.info(`Special Dispatch for "${query.trim()}"`, {
        description: 'We frequently travel to surrounding panchayats across South Bengal. Call us to confirm slot.',
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.065em] text-primary mb-2.5">
              <span>04. Regional Operations</span>
              <span aria-hidden="true">·</span>
              <span className="text-muted-foreground font-medium">Paschim &amp; Purba Medinipur Coverage</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight text-foreground text-balance">
              Service Coverage &amp; Dispatch Hubs
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed text-pretty font-normal tracking-[0.002em]">
              Operating from Keshrambha and Dantan, we provide verified emergency and scheduled plumbing dispatch across South Bengal.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button asChild variant="outline" size="sm" className="font-semibold text-xs h-9.5 rounded-xl border-border/80">
              <Link href="/service-areas">
                View All Hubs
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button asChild size="sm" className="font-semibold text-xs h-9.5 rounded-xl shadow-sm">
              <Link href="/book">Book In Your Area</Link>
            </Button>
          </div>
        </motion.div>

        {/* Interactive Quick Area Checker Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-crisp-xs render-crisp"
        >
          <form onSubmit={handleCheckArea} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Check your locality (e.g. Dantan, Kharagpur, Contai, Belda)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-11 text-xs sm:text-sm bg-muted/30 border-border/60 rounded-xl"
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto h-11 px-6 text-xs sm:text-sm font-semibold rounded-xl shrink-0">
              Check Coverage
            </Button>
          </form>
        </motion.div>

        {/* Interactive Topology Dispatch Hub Map */}
        <div className="mb-10">
          <DispatchHubMap />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 rounded-2xl border border-border/60 bg-card p-6 animate-pulse space-y-3">
                <div className="h-5 w-1/2 rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-8 w-full rounded bg-muted" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-3xl border border-border/80 bg-card p-10 sm:p-12 text-center space-y-4 mb-8 max-w-xl mx-auto shadow-crisp-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mx-auto">
              <MapPin className="h-6 w-6 text-primary/70" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground">
              No Service Available At This Time
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Please check back shortly or call our hotline to verify coverage in your locality.
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

        {/* Live Districts Grid */}
        {!loading && !error && areas.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(districtGroups).map(([district, districtAreas]) => (
              <motion.div
                key={district}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: 'transform' }}
                className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-crisp-sm flex flex-col justify-between transition-[border-color,box-shadow] duration-200 hover:border-primary/60 hover:shadow-crisp-lg"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-border/60">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-foreground">
                          {district}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {districtAreas.length} verified zone{districtAreas.length === 1 ? '' : 's'} registered
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      Live
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    Fast turnaround for pipe repairs, sanitary fixtures, and emergency waterline dispatches.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {districtAreas.map((area, idx) => (
                      <span
                        key={`${area.id || area.locality}-${idx}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted/60 text-foreground border border-border/50"
                      >
                        <MapPin className="h-3 w-3 text-primary shrink-0" />
                        <span>{area.locality}</span>
                        {area.pincode && (
                          <span className="text-[10px] text-muted-foreground font-mono">({area.pincode})</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    Rapid On-Site Units
                  </span>
                  <Button asChild size="sm" variant="ghost" className="text-xs font-semibold h-8 text-primary">
                    <Link href={`/book?area=${encodeURIComponent(districtAreas[0].locality)}`}>
                      Schedule Visit &rarr;
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && areas.length === 0 && (
          <div className="rounded-3xl border border-border/80 bg-card p-10 sm:p-12 text-center space-y-4 mb-8 max-w-xl mx-auto shadow-crisp-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mx-auto">
              <MapPin className="h-6 w-6 text-primary/70" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground">
              No Service Available At This Time
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Please check back shortly or call our hotline to verify coverage in your locality.
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

        {/* Coverage Assistance Banner */}
        <div className="mt-8 rounded-2xl border border-border/70 bg-card p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-xs">
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
            Check Coverage: {businessInfo.phoneDisplay} &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
