'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import {
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  Search,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { businessInfo } from '@/lib/business-info';
import {
  fetchLiveServiceAreas,
  getCachedServiceAreas,
  type DbServiceArea,
} from '@/lib/supabase-data';

export function HomeAreasPreview() {
  const [query, setQuery] = React.useState('');
  const [areas, setAreas] = React.useState<DbServiceArea[]>(
    () => getCachedServiceAreas() ?? []
  );
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
      toast.success(
        `Service Available in ${match.locality} (${match.district})!`,
        {
          description: `Verified service coverage. PIN: ${
            match.pincode || 'Active zone'
          }. Same-day dispatch slots available.`,
        }
      );
    } else {
      toast.info(`Special Dispatch for "${query.trim()}"`, {
        description:
          'We frequently travel to surrounding panchayats across South Bengal. Call us to confirm your slot.',
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
    <section className="py-16 lg:py-20 bg-muted/20 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.065em] text-primary mb-2.5">
              <span>05. Regional Coverage</span>
              <span aria-hidden="true">·</span>
              <span className="text-muted-foreground font-medium">
                Paschim &amp; Purba Medinipur
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight text-foreground text-balance">
              Service Areas &amp; Regional Dispatch Hubs
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed text-pretty font-normal">
              Operating from {businessInfo.addressShort} (PIN{' '}
              {businessInfo.pincode}), our mobile plumbing units serve key towns
              and blocks across Paschim Medinipur and Purba Medinipur.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="font-semibold text-xs h-10 px-4 rounded-xl border-border/80"
            >
              <Link href="/service-areas">
                View All Service Areas
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="font-semibold text-xs h-10 px-4 rounded-xl shadow-xs"
            >
              <Link href="/book">Book In Your Area</Link>
            </Button>
          </div>
        </motion.div>

        {/* Interactive Quick Area Checker Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-crisp-xs"
        >
          <form
            onSubmit={handleCheckArea}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Check your locality or PIN code (e.g. Dantan, Kharagpur, Contai, 721451)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-11 text-xs sm:text-sm bg-muted/30 border-border/60 rounded-xl"
              />
            </div>
            <Button
              type="submit"
              className="w-full sm:w-auto h-11 px-6 text-xs sm:text-sm font-semibold rounded-xl shrink-0"
            >
              Check Coverage
            </Button>
          </form>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-48 rounded-2xl border border-border/60 bg-card p-6 animate-pulse space-y-3"
              >
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
              Unable to Load Coverage Directory
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Please refresh or call our direct line to confirm technician
              availability in your locality.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="sm" className="rounded-xl font-semibold">
                <a href={`tel:${businessInfo.phone}`}>
                  Call {businessInfo.phoneDisplay}
                </a>
              </Button>
              <Button
                onClick={() => loadAreas(true)}
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

        {/* Concise District Summary Grid */}
        {!loading && !error && areas.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(districtGroups).map(([district, districtAreas]) => {
              const previewLocalities = districtAreas.slice(0, 6);
              const remainingCount = Math.max(
                0,
                districtAreas.length - previewLocalities.length
              );

              return (
                <motion.div
                  key={district}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-crisp-xs flex flex-col justify-between transition-all duration-200 hover:border-primary/50 hover:shadow-crisp-md"
                >
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-base text-foreground">
                            {district}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {districtAreas.length} verified{' '}
                            {districtAreas.length === 1
                              ? 'locality'
                              : 'localities'}{' '}
                            served
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        Active Zone
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      Key service hubs for pipeline installation, leak
                      diagnostics, sanitary fittings, and spare parts supply:
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {previewLocalities.map((area, idx) => (
                        <Link
                          key={`${area.id || area.locality}-${idx}`}
                          href={`/book?area=${encodeURIComponent(
                            area.locality
                          )}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted/60 text-foreground border border-border/50 hover:border-primary/40 hover:text-primary transition-colors"
                        >
                          <MapPin className="h-3 w-3 text-primary shrink-0" />
                          <span>{area.locality}</span>
                          {area.pincode && (
                            <span className="text-[10px] text-muted-foreground font-mono">
                              ({area.pincode})
                            </span>
                          )}
                        </Link>
                      ))}
                      {remainingCount > 0 && (
                        <Link
                          href="/service-areas"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors"
                        >
                          <span>+{remainingCount} more</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      Same-Day &amp; Scheduled Visits
                    </span>
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="text-xs font-semibold h-8 text-primary"
                    >
                      <Link href="/service-areas">
                        Explore District Coverage &rarr;
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Coverage Assistance & View All Service Areas Banner */}
        <div className="mt-8 rounded-2xl border border-border/70 bg-card p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-crisp-xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Looking for our complete interactive coverage map or PIN code
                directory?
              </p>
              <p className="text-muted-foreground mt-0.5">
                View all {areas.length || 'active'} service localities or call{' '}
                {businessInfo.phoneDisplay} for adjacent Gram Panchayat
                dispatches.
              </p>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="font-semibold text-xs h-9.5 px-4 rounded-xl border-primary/30 text-primary hover:bg-primary/5 shrink-0"
          >
            <Link href="/service-areas">
              View All Service Areas
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

