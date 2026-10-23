'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Phone,
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Search,
  ClipboardCheck,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomSelect } from '@/components/ui/custom-select';
import { businessInfo } from '@/lib/business-info';
import {
  fetchLiveServiceAreas,
  getCachedServiceAreas,
  type DbServiceArea,
} from '@/lib/supabase-data';
import { HeroPlumbingGallery } from '@/components/hero-plumbing-gallery';
import { BrandPartnersMarquee } from '@/components/brand-partners-marquee';
import { luxuryEasing, fadeUpVariants } from '@/lib/motion';

export function HeroSection() {
  const router = useRouter();
  const [areas, setAreas] = React.useState<DbServiceArea[]>(
    () => getCachedServiceAreas() ?? []
  );
  const [loadingAreas, setLoadingAreas] = React.useState(
    () => !getCachedServiceAreas()
  );
  const [quickTown, setQuickTown] = React.useState<string>(
    () => getCachedServiceAreas()?.[0]?.locality ?? ''
  );
  const [quickBookingRef, setQuickBookingRef] = React.useState('');
  const [activeQuickTab, setActiveQuickTab] = React.useState<'book' | 'track'>(
    'book'
  );

  React.useEffect(() => {
    let active = true;
    fetchLiveServiceAreas().then(({ data }) => {
      if (!active) return;
      setAreas(data);
      if (data.length > 0) {
        setQuickTown((prev) =>
          prev && data.some((a) => a.locality === prev)
            ? prev
            : data[0].locality
        );
      } else {
        setQuickTown('');
      }
      setLoadingAreas(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const areaOptions = React.useMemo(
    () =>
      areas.map((area) => ({
        key: area.id || area.locality,
        value: area.locality,
        label: `${area.locality}${
          area.pincode ? ` (PIN ${area.pincode})` : ''
        } — Same-Day Technician Slot`,
        description: `${area.district || 'West Medinipur'}${
          area.block ? ` · ${area.block} Block` : ''
        } · Verified Dispatch Coverage`,
        badge: area.pincode ? `PIN ${area.pincode}` : 'Active',
      })),
    [areas]
  );

  const handleQuickAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeQuickTab === 'book') {
      if (quickTown) {
        router.push(`/book?area=${encodeURIComponent(quickTown)}`);
      } else {
        router.push('/book');
      }
    } else {
      const clean = quickBookingRef.trim().toUpperCase();
      if (clean) {
        router.push(`/find-booking?id=${encodeURIComponent(clean)}`);
      } else {
        router.push('/find-booking');
      }
    }
  };

  return (
    <section className="relative overflow-x-clip pt-24 pb-14 lg:pt-28 lg:pb-16 border-b border-border/60">
      {/* Precision Blueprint Grid & Subtle Atmospheric Radial Lighting */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid-blueprint opacity-[0.06] dark:opacity-[0.12]" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[580px] w-[1040px] rounded-full bg-gradient-to-tr from-primary/14 via-sky-500/8 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-1/3 right-4 h-72 w-72 rounded-full bg-primary/6 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Architectural Editorial Presentation (col-span-6) */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 space-y-6"
          >
            {/* Clean Editorial Eyebrow with Verified Review Link */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-primary">
              <span className="uppercase tracking-[0.065em]">
                South Bengal Engineering Division
              </span>
              <span className="text-border" aria-hidden="true">
                ·
              </span>
              <span className="text-muted-foreground font-normal">
                Established {businessInfo.established}
              </span>
              <span className="text-border" aria-hidden="true">
                ·
              </span>
              <Link
                href="/reviews"
                className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-primary transition-colors duration-150"
              >
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>Work-Verified Reviews</span>
              </Link>
            </div>

            {/* Display Headline with High-Contrast Editorial Authority */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-[3.4rem] font-bold tracking-tight sm:tracking-[-0.028em] text-foreground leading-[1.1] text-balance">
              Precision Pipeline Engineering &amp;{' '}
              <span className="text-primary relative inline-block">
                Master Plumbing Solutions.
              </span>
            </h1>

            {/* Narrative Prose */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl text-pretty font-normal tracking-[0.002em]">
              SOHAN PIPELINES delivers end-to-end plumbing engineering across
              West Medinipur and surrounding regions—combining genuine Astral
              &amp; Supreme spare parts counter sales with hydrostatic
              pressure-tested installations, concealed leak detection, and
              dependable local dispatch.
            </p>

            {/* Primary Conversion Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Button
                asChild
                size="lg"
                className="font-semibold text-sm h-12 px-6.5 rounded-xl shadow-md shadow-primary/25 group whitespace-nowrap w-full sm:w-auto"
              >
                <Link href="/book">
                  Book a Service Online
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="font-semibold text-sm h-12 px-6 rounded-xl border-border/80 hover:bg-muted/60 whitespace-nowrap w-full sm:w-auto"
              >
                <a href={`tel:${businessInfo.phone}`}>
                  <Phone className="mr-2 h-4 w-4 text-primary" />
                  Call {businessInfo.phoneDisplay}
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="font-semibold text-sm h-12 px-5 rounded-xl border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-500/60 whitespace-nowrap w-full sm:w-auto shadow-xs transition-colors"
              >
                <a
                  href={`https://wa.me/918670143003?text=${encodeURIComponent(
                    'Hi, I’d like to connect with the founder of SOHAN PIPELINES regarding a plumbing service inquiry. Could you please assist me? Thank you.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  WhatsApp Desk
                </a>
              </Button>
            </div>

            {/* Interactive Quick Dispatch & Booking Console */}
            <div className="relative z-30 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-sm p-4 shadow-crisp-sm space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveQuickTab('book')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      activeQuickTab === 'book'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Instant Area Dispatch
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveQuickTab('track')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      activeQuickTab === 'track'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Track / Review Work Order
                  </button>
                </div>
                {!loadingAreas && areas.length > 0 && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {areas.length} Service{' '}
                      {areas.length === 1 ? 'Area' : 'Areas'} Active
                    </span>
                  </span>
                )}
              </div>

              <form
                onSubmit={handleQuickAction}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
              >
                {activeQuickTab === 'book' ? (
                  <>
                    <div className="flex-1 min-w-0">
                      <CustomSelect
                        id="hero-instant-area-dispatch"
                        value={quickTown}
                        onChange={(val) => setQuickTown(val)}
                        options={areaOptions}
                        disabled={loadingAreas || areaOptions.length === 0}
                        placeholder={
                          loadingAreas
                            ? 'Loading verified service areas...'
                            : 'No active service areas currently listed'
                        }
                        aria-label="Select your service area for instant dispatch"
                        size="md"
                        icon={<MapPin className="h-4 w-4" />}
                        buttonClassName="h-10 bg-background/95"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      className="h-10 px-4 rounded-xl text-xs font-semibold shrink-0 whitespace-nowrap"
                    >
                      {quickTown
                        ? `Schedule in ${quickTown}`
                        : 'Schedule Service'}
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="relative flex-1">
                      <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        value={quickBookingRef}
                        onChange={(e) => setQuickBookingRef(e.target.value)}
                        placeholder="Enter Booking ID (e.g. SP-2026...)"
                        className="h-10 pl-8.5 rounded-xl font-mono text-xs uppercase"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      className="h-10 px-4 rounded-xl text-xs font-semibold shrink-0 whitespace-nowrap"
                    >
                      <ClipboardCheck className="mr-1.5 h-3.5 w-3.5" />
                      Track Status
                    </Button>
                  </>
                )}
              </form>
            </div>

            {/* Verified Trust Pillars */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl border border-border/60 bg-card/60 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>ISI Certified</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Astral, Supreme &amp; Finolex fittings
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/60 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-primary font-bold">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>Same-Day Slots</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Scheduled &amp; emergency visits
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/60 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>₹0 Advance</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Pay after pressure inspection
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/60 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                  <Award className="h-4 w-4 shrink-0" />
                  <span>12-Mo Warranty</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Guaranteed leak-free joints
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Premium Responsive Editorial Plumbing Gallery (col-span-6) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: luxuryEasing }}
            className="lg:col-span-6"
          >
            <HeroPlumbingGallery />
          </motion.div>
        </div>

        {/* Official Brand Sponsored & Hardware Partners Moving Left-to-Right Marquee */}
        <BrandPartnersMarquee />
      </div>
    </section>
  );
}
