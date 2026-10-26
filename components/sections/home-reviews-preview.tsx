'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Star,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Search,
  ClipboardCheck,
  MessageSquarePlus,
  Wrench,
  BadgeCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  fetchVerifiedReviews,
  computeReviewAnalytics,
  type VerifiedWorkReview,
} from '@/lib/reviews-service';

export function HomeReviewsPreview() {
  const router = useRouter();
  const [reviews, setReviews] = React.useState<VerifiedWorkReview[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [quickBookingId, setQuickBookingId] = React.useState('');

  React.useEffect(() => {
    let active = true;
    fetchVerifiedReviews().then(({ reviews: live }) => {
      if (!active) return;
      setReviews(live);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const analytics = React.useMemo(
    () => computeReviewAnalytics(reviews),
    [reviews]
  );

  const handleQuickReviewJump = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = quickBookingId.trim().toUpperCase();
    if (clean) {
      router.push(`/reviews?bookingId=${encodeURIComponent(clean)}#write-review`);
    } else {
      router.push('/reviews#write-review');
    }
  };

  const starCategories = [
    {
      label: 'Pipe Workmanship',
      val: analytics.totalReviews > 0 ? analytics.pillarAverages.workmanship : 5.0,
    },
    {
      label: 'On-Time Dispatch',
      val: analytics.totalReviews > 0 ? analytics.pillarAverages.punctuality : 5.0,
    },
    {
      label: 'Honest Pricing',
      val:
        analytics.totalReviews > 0
          ? analytics.pillarAverages.pricingTransparency
          : 5.0,
    },
    {
      label: 'Site Cleanliness',
      val:
        analytics.totalReviews > 0
          ? analytics.pillarAverages.siteCleanliness
          : 5.0,
    },
    {
      label: 'Technician Courtesy',
      val:
        analytics.totalReviews > 0
          ? analytics.pillarAverages.technicianCourtesy
          : 5.0,
    },
    {
      label: 'Genuine Materials',
      val:
        analytics.totalReviews > 0
          ? analytics.pillarAverages.materialQuality
          : 5.0,
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-card/40 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-[0.065em] text-primary mb-2.5">
              <span>04. Work-Verified Feedback</span>
              <span aria-hidden="true">·</span>
              <span className="text-muted-foreground font-medium">
                6-Category Customer Ratings
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground text-balance">
              Verified Client Reviews &amp; Craftsmanship Ratings
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty font-normal">
              Every customer review is linked to a completed service booking
              across West Medinipur, Dantan, and South Bengal—evaluating pipe
              workmanship, punctuality, transparent pricing, and site
              cleanliness.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-3 w-full md:w-auto shrink-0">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-card border border-amber-500/30 shadow-2xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 shrink-0">
                <Star className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-1 font-bold text-sm sm:text-base text-foreground tabular-nums font-mono">
                  {analytics.totalReviews > 0
                    ? analytics.averageRating.toFixed(1)
                    : '5.0'}
                  <span className="text-xs text-muted-foreground font-normal font-sans">
                    / 5.0 ★
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground tabular-nums">
                  {analytics.totalReviews > 0
                    ? `${analytics.totalReviews} Verified Work ${analytics.totalReviews === 1 ? 'Review' : 'Reviews'}`
                    : 'Verified Work Standard'}
                </p>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="font-semibold text-xs h-10 px-4 rounded-xl border-border/80 shrink-0"
            >
              <Link href="/reviews">
                View All Reviews
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 shrink-0" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* 6 Top-Class Star Categories Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-stretch">
          {starCategories.map((cat) => (
            <div
              key={cat.label}
              className="h-full rounded-2xl border border-border/80 bg-card p-3.5 flex flex-col justify-between gap-1.5 shadow-2xs min-w-0"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono text-sm font-extrabold text-foreground tabular-nums">
                  {cat.val.toFixed(1)}
                </span>
                <div className="flex gap-0.5 shrink-0">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="h-3 w-3 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs font-semibold text-foreground truncate">
                {cat.label}
              </p>
              <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                Verified Score
              </p>
            </div>
          ))}
        </div>

        {/* Quick Booking-Verified Review Launcher Bar */}
        <div className="rounded-2xl border border-primary/25 bg-card p-5 sm:p-6 shadow-crisp-xs">
          <div className="grid gap-5 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 space-y-1.5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-primary font-semibold">
                <span className="inline-flex items-center gap-1">
                  <Search className="h-3.5 w-3.5 shrink-0" /> 1. Enter Booking ID
                </span>
                <span aria-hidden="true" className="text-border">
                  →
                </span>
                <span className="inline-flex items-center gap-1">
                  <ClipboardCheck className="h-3.5 w-3.5 shrink-0" /> 2. Confirm Job
                </span>
                <span aria-hidden="true" className="text-border">
                  →
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageSquarePlus className="h-3.5 w-3.5 shrink-0" /> 3. Submit Rating
                </span>
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
                Had Plumbing Work Completed Recently? Rate Your Experience
              </h3>
              <p className="text-xs text-muted-foreground">
                Enter your Booking ID or registered phone number on our Reviews
                page to submit a verified customer rating.
              </p>
            </div>

            <form
              onSubmit={handleQuickReviewJump}
              className="lg:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
            >
              <Input
                value={quickBookingId}
                onChange={(e) => setQuickBookingId(e.target.value)}
                placeholder="Enter Booking ID (e.g. SP-2026...)"
                className="h-10.5 rounded-xl font-mono text-xs uppercase flex-1"
              />
              <Button
                type="submit"
                className="h-10.5 px-5 rounded-xl font-semibold text-xs shrink-0 justify-center"
              >
                Verify &amp; Rate
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 shrink-0" />
              </Button>
            </form>
          </div>
        </div>

        {/* Verified Reviews Grid (if reviews exist) */}
        {!loading && reviews.length > 0 && (
          <div className="grid gap-5 md:grid-cols-3 items-stretch">
            {reviews.slice(0, 3).map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.28,
                  delay: i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full flex flex-col"
              >
                <Card className="h-full p-0 gap-0 border border-border/80 bg-card rounded-2xl shadow-crisp-xs hover:shadow-crisp-md hover:border-primary/50 flex flex-col justify-between group">
                  <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <div className="flex gap-0.5">
                            {Array.from({
                              length: Math.round(review.rating),
                            }).map((_, idx) => (
                              <Star
                                key={idx}
                                className="h-4 w-4 fill-amber-400 text-amber-400"
                              />
                            ))}
                          </div>
                          <span className="font-mono font-bold text-xs text-foreground">
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium font-mono">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{review.bookingId}</span>
                        </div>
                      </div>

                      <h4 className="font-display font-bold text-sm text-foreground">
                        {review.headline}
                      </h4>

                      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground italic">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/60">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                          {review.customerName}
                        </p>
                        <span className="text-[11px] font-medium text-primary flex items-center gap-1 shrink-0">
                          <Wrench className="h-3 w-3 shrink-0" />
                          <span className="truncate max-w-[130px]">{review.serviceName}</span>
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                        <span className="truncate">
                          {review.customerRole} · {review.locality}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom Trust Strip */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>
              Every review is verified against our official service booking
              records in Midnapore &amp; Dantan
            </span>
          </div>

          <Link
            href="/reviews#write-review"
            className="inline-flex items-center font-semibold text-primary hover:underline self-start sm:self-center shrink-0"
          >
            Submit Work-Basis Review
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
