'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Copy,
  ShieldCheck,
  MessageCircle,
  Navigation,
  Calendar,
  Award,
  Package,
  Search,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomSelect } from '@/components/ui/custom-select';
import { businessInfo } from '@/lib/business-info';
import {
  fetchLiveServiceAreas,
  getCachedServiceAreas,
  type DbServiceArea,
} from '@/lib/supabase-data';

export function ContactSection() {
  const [areas, setAreas] = React.useState<DbServiceArea[]>(
    () => getCachedServiceAreas() ?? []
  );
  const [loading, setLoading] = React.useState(() => !getCachedServiceAreas());
  const [error, setError] = React.useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>('All');
  const [selectedLocality, setSelectedLocality] = React.useState<string>(
    () => getCachedServiceAreas()?.[0]?.locality ?? ''
  );

  const loadAreas = React.useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await fetchLiveServiceAreas({ forceRefresh });
    if (err) {
      setError(err);
      setAreas([]);
    } else {
      setAreas(data);
      if (data.length > 0) {
        setSelectedLocality((prev) =>
          prev && data.some((a) => a.locality === prev)
            ? prev
            : data[0].locality
        );
      } else {
        setSelectedLocality('');
      }
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
        if (data.length > 0) {
          setSelectedLocality((prev) =>
            prev && data.some((a) => a.locality === prev)
              ? prev
              : data[0].locality
          );
        } else {
          setSelectedLocality('');
        }
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const districts = React.useMemo(() => {
    const unique = Array.from(
      new Set(areas.map((a) => a.district || 'West Medinipur'))
    );
    return unique;
  }, [areas]);

  const filteredAreas = React.useMemo(() => {
    if (selectedDistrict === 'All') return areas;
    return areas.filter(
      (a) => (a.district || 'West Medinipur') === selectedDistrict
    );
  }, [areas, selectedDistrict]);

  const activeArea = React.useMemo(() => {
    if (filteredAreas.length === 0) return null;
    return (
      filteredAreas.find((a) => a.locality === selectedLocality) ||
      filteredAreas[0]
    );
  }, [filteredAreas, selectedLocality]);

  const areaSelectOptions = React.useMemo(
    () =>
      filteredAreas.map((area) => ({
        key: area.id || area.locality,
        value: area.locality,
        label: `${area.locality} — Pin Code : - ${area.pincode || '721451'}`,
        description: `Dist : - ${area.district || 'West Medinipur'}${
          area.block ? ` · Block : - ${area.block}` : ''
        }`,
        badge: `PIN ${area.pincode || '721451'}`,
      })),
    [filteredAreas]
  );

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} Copied to Clipboard`, {
        description: text,
      });
    } catch {
      toast.info(`${label}: ${text}`);
    }
  };

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Communication Channels (col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.065em] text-primary">
              <span>Direct Communication</span>
              <span aria-hidden="true">·</span>
              <span className="text-muted-foreground font-medium">
                Available Mon–Sat
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance">
              Need a Plumber? We Are On Call.
            </h2>

            <p className="text-muted-foreground text-base leading-relaxed text-pretty font-normal tracking-[0.002em]">
              Whether you are dealing with a burst pipe emergency or planning
              scheduled bathroom fittings, connect directly with our master
              plumbing desk in West Medinipur.
            </p>

            <div className="space-y-3.5 pt-2">
              {/* Phone card */}
              <div className="group flex items-center justify-between rounded-2xl border border-border/70 bg-card p-4 sm:p-5 transition-[border-color,box-shadow,background-color] duration-200 hover:border-primary/40 hover:shadow-md">
                <a
                  href={`tel:${businessInfo.phone}`}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">
                      Emergency &amp; Booking Hotline
                    </p>
                    <p className="font-display font-bold text-base sm:text-lg tabular-nums font-mono text-foreground truncate">
                      {businessInfo.phoneDisplay}
                    </p>
                  </div>
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(businessInfo.phone, 'Phone Number')}
                  className="h-9 w-9 text-muted-foreground hover:text-foreground shrink-0"
                  aria-label="Copy phone"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {/* WhatsApp Direct Card */}
              <div className="group flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4 sm:p-5 transition-[border-color,box-shadow,background-color] duration-200 hover:border-emerald-500/50 hover:shadow-md">
                <a
                  href={`https://wa.me/918670143003?text=${encodeURIComponent(
                    'Hi Sohan Pipelines, I need plumbing assistance at my property. Please let me know your earliest available slot.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 transition-transform group-hover:scale-105">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                      Direct WhatsApp Desk
                    </p>
                    <p className="font-display font-bold text-sm sm:text-base text-foreground truncate">
                      Share Site Photos or Location Pin
                    </p>
                  </div>
                </a>
                <ArrowRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              </div>

              {/* Email card */}
              <div className="group flex items-center justify-between rounded-2xl border border-border/70 bg-card p-4 sm:p-5 transition-[border-color,box-shadow,background-color] duration-200 hover:border-primary/40 hover:shadow-md">
                <a
                  href={`mailto:${businessInfo.email}`}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform group-hover:scale-105">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">
                      Official Email Desk
                    </p>
                    <p className="font-display font-bold text-sm sm:text-base text-foreground truncate">
                      {businessInfo.email}
                    </p>
                  </div>
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    handleCopy(businessInfo.email, 'Email Address')
                  }
                  className="h-9 w-9 text-muted-foreground hover:text-foreground shrink-0"
                  aria-label="Copy email"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {/* Office / Contact Address Card */}
              <div className="group flex items-start justify-between gap-4 rounded-2xl border border-border/70 bg-card p-4 sm:p-5 transition-[border-color,box-shadow] duration-200 hover:border-primary/40 hover:shadow-md">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground mt-0.5">
                    <MapPin className="h-5 w-5 text-primary" />
                  </span>
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">
                      Head Workshop &amp; Spare Parts Counter
                    </p>
                    <p className="font-display font-bold text-sm sm:text-base text-foreground leading-snug">
                      {businessInfo.address}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    handleCopy(businessInfo.address, 'Contact Address')
                  }
                  className="h-9 w-9 text-muted-foreground hover:text-foreground shrink-0"
                  aria-label="Copy address"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Operating Hours Block */}
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-5 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>Operating Hours &amp; Payment Policy</span>
              </div>
              <p className="text-muted-foreground">
                Monday–Saturday:{' '}
                <strong className="text-foreground">{businessInfo.hours}</strong>
              </p>
              <p className="text-muted-foreground">
                Sunday: Emergency phone dispatches only
              </p>
              <p className="text-muted-foreground pt-1 border-t border-border/50">
                Payment Modes:{' '}
                <strong className="text-foreground">
                  Cash, UPI (Google Pay, PhonePe, Paytm) &amp; Bank Transfer
                </strong>{' '}
                upon work inspection.
              </p>
            </div>
          </div>

          {/* Right Column: Regional Service Coordination Desk (100% Wired to Live Service Areas + Pin Codes) */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl shadow-primary/5 space-y-6"
            >
              {/* Header & Live District Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.07em] text-primary">
                    <Navigation className="h-3.5 w-3.5" />
                    <span>Regional Service Coordination Desk</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-1">
                    Verified Service Area &amp; Pin Code Dispatch Directory
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Select an active service area below to view its postal PIN
                    code, coverage details, and connect with our area crew.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  {districts.length > 1 && (
                    <div className="inline-flex items-center rounded-xl border border-border/80 bg-muted/40 p-1">
                      <button
                        type="button"
                        onClick={() => setSelectedDistrict('All')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          selectedDistrict === 'All'
                            ? 'bg-primary text-primary-foreground shadow-2xs'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        All ({areas.length})
                      </button>
                      {districts.map((dist) => (
                        <button
                          key={dist}
                          type="button"
                          onClick={() => setSelectedDistrict(dist)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            selectedDistrict === dist
                              ? 'bg-primary text-primary-foreground shadow-2xs'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {dist}
                        </button>
                      ))}
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => loadAreas(true)}
                    disabled={loading}
                    className="h-9 rounded-xl text-xs font-semibold"
                  >
                    <RefreshCw
                      className={`mr-1.5 h-3.5 w-3.5 ${
                        loading ? 'animate-spin' : ''
                      }`}
                    />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Loading Skeleton */}
              {loading && (
                <div className="space-y-4">
                  <div className="h-11 rounded-xl bg-muted/60 animate-pulse" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="h-16 rounded-xl border border-border/60 bg-muted/40 animate-pulse"
                      />
                    ))}
                  </div>
                  <div className="h-48 rounded-2xl border border-border/60 bg-muted/30 animate-pulse" />
                </div>
              )}

              {/* Empty / Error State */}
              {!loading && (error || areas.length === 0) && (
                <div className="rounded-2xl border border-border/80 bg-muted/20 p-8 text-center space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h4 className="font-display font-bold text-base sm:text-lg text-foreground">
                    No Active Service Areas Listed Yet
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                    Call our direct dispatch line or message our WhatsApp desk to
                    verify coverage for your locality and PIN code.
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center gap-2.5">
                    <Button asChild size="sm" className="rounded-xl font-semibold">
                      <a href={`tel:${businessInfo.phone}`}>
                        Call {businessInfo.phoneDisplay}
                      </a>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => loadAreas(true)}
                      className="rounded-xl font-semibold"
                    >
                      <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                      Retry
                    </Button>
                  </div>
                </div>
              )}

              {/* Live Service Areas Selector + Active Area Card */}
              {!loading && !error && areas.length > 0 && activeArea && (
                <>
                  {/* Theme Dropdown for Quick Area + Pin Code Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">
                        Select Registered Service Area &amp; Pin Code
                      </span>
                      <span className="font-mono text-muted-foreground tabular-nums">
                        {filteredAreas.length} Active{' '}
                        {filteredAreas.length === 1 ? 'Area' : 'Areas'}
                      </span>
                    </div>
                    <CustomSelect
                      id="contact-regional-service-area"
                      value={activeArea.locality}
                      onChange={(val) => setSelectedLocality(val)}
                      options={areaSelectOptions}
                      placeholder="Select a service area"
                      icon={<MapPin className="h-4 w-4" />}
                    />
                  </div>

                  {/* Service Area Cards Grid with Real Pin Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {filteredAreas.map((area) => {
                      const isSelected = area.locality === activeArea.locality;
                      return (
                        <button
                          key={area.id || area.locality}
                          type="button"
                          onClick={() => setSelectedLocality(area.locality)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                              : 'border-border/70 bg-muted/20 text-foreground hover:border-primary/40 hover:bg-muted/40'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs sm:text-sm font-semibold truncate">
                              {area.locality}
                            </span>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          </div>
                          <div className="mt-1 flex items-center justify-between gap-2 text-[11px] font-mono text-muted-foreground tabular-nums">
                            <span>Pin Code : - {area.pincode || '721451'}</span>
                            <span className="truncate">
                              {area.district || 'West Medinipur'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Service Area Detailed Dispatch Card */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeArea.id || activeArea.locality}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-2xl border border-primary/25 bg-primary/[0.03] p-5 sm:p-6 space-y-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-semibold text-primary">
                              Dist : - {activeArea.district || 'West Medinipur'}
                            </span>
                            <span aria-hidden="true" className="text-border">
                              ·
                            </span>
                            <span className="font-mono font-bold text-foreground tabular-nums">
                              Pin Code : - {activeArea.pincode || '721451'}
                            </span>
                          </div>
                          <h4 className="font-display text-lg sm:text-xl font-bold text-foreground mt-1.5">
                            {activeArea.locality} Plumbing &amp; Pipeline
                            Dispatch Unit
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {activeArea.block
                              ? `Block : - ${activeArea.block}`
                              : 'Verified Local Service Coverage'}
                            {activeArea.subdivision
                              ? ` · Subdivision : - ${activeArea.subdivision}`
                              : ' · State : - West Bengal'}
                          </p>
                        </div>

                        <div className="rounded-xl bg-card border border-border/80 px-3.5 py-2 text-right">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                            Postal Coverage Zone
                          </span>
                          <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                            PIN {activeArea.pincode || '721451'} · Active
                          </span>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
                          <span className="text-[11px] font-semibold text-muted-foreground block">
                            Available Plumbing Work in {activeArea.locality}
                          </span>
                          <p className="font-medium text-foreground leading-snug">
                            Pipe Fitting, Leak Detection, Sanitary Installation,
                            Water Tank Setup &amp; Emergency Repairs
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
                          <span className="text-[11px] font-semibold text-muted-foreground block">
                            Base Workshop &amp; Dispatch Origin
                          </span>
                          <p className="font-medium text-foreground leading-snug">
                            {businessInfo.addressShort}, Pin Code : -{' '}
                            {businessInfo.pincode}
                          </p>
                        </div>
                      </div>

                      {/* Direct Action Bar for Selected Database Service Area */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                        <Button
                          asChild
                          className="flex-1 h-11 rounded-xl text-xs font-semibold shadow-xs"
                        >
                          <Link
                            href={`/book?area=${encodeURIComponent(
                              activeArea.locality
                            )}`}
                          >
                            <Calendar className="mr-1.5 h-4 w-4" />
                            Book Visit in {activeArea.locality} (PIN{' '}
                            {activeArea.pincode || '721451'})
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </Link>
                        </Button>

                        <Button
                          asChild
                          variant="outline"
                          className="h-11 rounded-xl text-xs font-semibold border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15"
                        >
                          <a
                            href={`https://wa.me/918670143003?text=${encodeURIComponent(
                              `Hi Sohan Pipelines, I am inquiring from ${
                                activeArea.locality
                              } (Pin Code: ${
                                activeArea.pincode || '721451'
                              }, Dist: ${
                                activeArea.district || 'West Medinipur'
                              }) regarding a plumbing service visit.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="mr-1.5 h-4 w-4" />
                            WhatsApp {activeArea.locality} Desk
                          </a>
                        </Button>

                        <Button
                          asChild
                          variant="outline"
                          className="h-11 rounded-xl text-xs font-semibold"
                        >
                          <a href={`tel:${businessInfo.phone}`}>
                            <Phone className="mr-1.5 h-3.5 w-3.5 text-primary" />
                            Call Direct
                          </a>
                        </Button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </>
              )}

              {/* Quick Self-Service Navigation Row */}
              <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t border-border/60">
                <Link
                  href="/find-booking"
                  className="group p-3.5 rounded-2xl border border-border/70 bg-muted/20 hover:border-primary/40 hover:bg-muted/40 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <Search className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        Track Booking
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Check live status
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Link
                  href="/spare-parts"
                  className="group p-3.5 rounded-2xl border border-border/70 bg-muted/20 hover:border-primary/40 hover:bg-muted/40 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        Spare Parts
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Genuine hardware
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Link
                  href="/reviews"
                  className="group p-3.5 rounded-2xl border border-border/70 bg-muted/20 hover:border-primary/40 hover:bg-muted/40 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="h-4 w-4 text-amber-500 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        Work Reviews
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Rate completed work
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="pt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  Zero advance booking fee. Written estimate provided on-site
                  before work begins.
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
