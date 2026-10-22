'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  Star,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Search,
  ShieldCheck,
  Wrench,
  Calendar,
  Clock,
  MapPin,
  ThumbsUp,
  Sparkles,
  Loader2,
  ClipboardCheck,
  MessageSquarePlus,
  RotateCcw,
  Phone,
  SlidersHorizontal,
  Award,
  Check,
  FileCheck2,
  BadgeCheck,
  UserCheck,
  Hammer,
  Printer,
  X,
  PencilLine,
  Wand2,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CustomSelect } from '@/components/ui/custom-select';
import { cn } from '@/lib/utils';
import { businessInfo } from '@/lib/business-info';
import { bookingStatusLabel } from '@/lib/booking-status';
import {
  fetchLiveServiceAreas,
  getCachedServiceAreas,
  type DbServiceArea,
} from '@/lib/supabase-data';
import {
  fetchVerifiedReviews,
  searchBookingsForReview,
  submitVerifiedWorkReview,
  markReviewHelpful,
  hasVotedReviewHelpful,
  deleteVerifiedWorkReview,
  computeReviewAnalytics,
  WORK_HIGHLIGHT_OPTIONS,
  WORK_EXPERIENCE_TEMPLATES,
  type VerifiedWorkReview,
  type VerifiableBookingRecord,
  type WorkBasisMetrics,
} from '@/lib/reviews-service';

type ReviewFlowStep = 1 | 2 | 3;
type ReviewSortOption = 'newest' | 'highest' | 'lowest' | 'helpful';

const RATING_LABELS: Record<
  number,
  { title: string; badge: string; subtitle: string }
> = {
  1: {
    title: 'Immediate Resolution Needed',
    badge: '1.0 ★ Needs Attention',
    subtitle: 'Issue remained unresolved or service fell below our standards',
  },
  2: {
    title: 'Below Expected Standard',
    badge: '2.0 ★ Substandard',
    subtitle: 'Work completed with delays or required follow-up adjustments',
  },
  3: {
    title: 'Satisfactory Workmanship',
    badge: '3.0 ★ Standard Grade',
    subtitle: 'Job completed adequately with standard plumbing workmanship',
  },
  4: {
    title: 'High-Precision Plumbing',
    badge: '4.0 ★ Precision Grade',
    subtitle: 'Skilled technician, clean pipe fitting, and prompt arrival',
  },
  5: {
    title: 'Class-S Master Craftsmanship',
    badge: '5.0 ★ Master Class',
    subtitle:
      'Flawless execution, zero leaks, punctual arrival, and spotless worksite',
  },
};

const PILLAR_CONFIG: Array<{
  key: keyof Required<WorkBasisMetrics>;
  label: string;
  shortLabel: string;
  helper: string;
  icon: typeof Wrench;
}> = [
  {
    key: 'workmanship',
    label: 'Pipe Fitting & Workmanship',
    shortLabel: 'Workmanship',
    helper: 'Joint sealing, pressure stability & repair durability',
    icon: Wrench,
  },
  {
    key: 'punctuality',
    label: 'Dispatch & Punctuality',
    shortLabel: 'Punctuality',
    helper: 'On-time arrival within scheduled slot & response speed',
    icon: Clock,
  },
  {
    key: 'pricingTransparency',
    label: 'Upfront Pricing & Honesty',
    shortLabel: 'Pricing',
    helper: 'Clear written estimate & genuine spare parts rates',
    icon: ShieldCheck,
  },
  {
    key: 'siteCleanliness',
    label: 'Worksite Cleanliness & Care',
    shortLabel: 'Cleanliness',
    helper: 'Post-installation cleanup, safety & tile protection',
    icon: Sparkles,
  },
  {
    key: 'technicianCourtesy',
    label: 'Technician Courtesy & Conduct',
    shortLabel: 'Courtesy',
    helper: 'Polite communication, clear guidance & safety discipline',
    icon: UserCheck,
  },
  {
    key: 'materialQuality',
    label: 'Genuine Materials & Tools',
    shortLabel: 'Materials',
    helper: 'ISI-certified pipes, heavy-duty brass valves & precision tools',
    icon: Hammer,
  },
];

function getCategoryGradeLabel(score: number): string {
  if (score >= 4.8) return 'Master Class';
  if (score >= 4.2) return 'High Precision';
  if (score >= 3.5) return 'Standard';
  return 'Fair';
}

function formatReadableDate(iso: string): string {
  if (!iso) return 'Recent Work Order';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function InteractiveStarBar({
  value,
  onChange,
  size = 'md',
}: {
  value: number;
  onChange: (next: number) => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [hoverVal, setHoverVal] = React.useState<number | null>(null);
  const activeVal = hoverVal ?? value;

  const iconClass =
    size === 'lg'
      ? 'h-7 w-7'
      : size === 'md'
        ? 'h-5 w-5'
        : 'h-4 w-4';

  return (
    <div
      className="inline-flex items-center gap-1"
      onMouseLeave={() => setHoverVal(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= activeVal;
        return (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverVal(star)}
            onClick={() => onChange(star)}
            aria-label={`Rate ${star} out of 5 stars`}
            className="p-1 rounded-lg transition-transform duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer"
          >
            <Star
              className={cn(
                iconClass,
                'transition-colors duration-150',
                filled
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                  : 'fill-transparent text-muted-foreground/30 hover:text-amber-400/60'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

function LuxuryTierStarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  const [hoverVal, setHoverVal] = React.useState<number | null>(null);
  const activeVal = hoverVal ?? value;

  const tierShortLabels: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Great',
    5: 'Master',
  };

  return (
    <div
      className="grid grid-cols-5 gap-2"
      onMouseLeave={() => setHoverVal(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= activeVal;
        const isExact = star === value;
        return (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverVal(star)}
            onClick={() => onChange(star)}
            className={cn(
              'group flex flex-col items-center justify-center gap-1.5 rounded-xl border py-3 px-2 transition-all duration-150 cursor-pointer select-none',
              isExact
                ? 'border-amber-400 bg-amber-500/12 shadow-xs ring-1 ring-amber-400/40'
                : isFilled
                  ? 'border-amber-400/40 bg-amber-500/[0.05]'
                  : 'border-border/70 bg-muted/30 hover:border-amber-400/40'
            )}
          >
            <Star
              className={cn(
                'h-6 w-6 transition-transform duration-150 group-hover:scale-110',
                isFilled
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.45)]'
                  : 'fill-transparent text-muted-foreground/35'
              )}
            />
            <span
              className={cn(
                'text-[11px] font-mono font-bold tabular-nums',
                isFilled ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {star}.0 ★
            </span>
            <span className="text-[10px] font-medium text-muted-foreground truncate max-w-full">
              {tierShortLabels[star]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ReviewsWorkspaceContent() {
  const searchParams = useSearchParams();
  const deepLinkBookingId =
    searchParams.get('bookingId') || searchParams.get('id') || '';

  // Live verified reviews state
  const [reviews, setReviews] = React.useState<VerifiedWorkReview[]>([]);
  const [loadingReviews, setLoadingReviews] = React.useState(true);
  const [votedIds, setVotedIds] = React.useState<Record<string, boolean>>({});
  const [certificateReview, setCertificateReview] =
    React.useState<VerifiedWorkReview | null>(null);

  // 3-Step Flow State:
  // Step 1: Give Booking Details -> Step 2: Choose Your Booking -> Step 3: Give Review
  const [activeStep, setActiveStep] = React.useState<ReviewFlowStep>(1);
  const [bookingIdInput, setBookingIdInput] = React.useState(deepLinkBookingId);
  const [phoneInput, setPhoneInput] = React.useState('');
  const [searchingBookings, setSearchingBookings] = React.useState(false);
  const [matchedBookings, setMatchedBookings] = React.useState<
    VerifiableBookingRecord[]
  >([]);
  const [selectedBooking, setSelectedBooking] =
    React.useState<VerifiableBookingRecord | null>(null);

  // Step 3 Review Form State (6 Top-Class Categories)
  const [overallRating, setOverallRating] = React.useState<number>(5);
  const [metrics, setMetrics] = React.useState<Required<WorkBasisMetrics>>({
    workmanship: 5,
    punctuality: 5,
    pricingTransparency: 5,
    siteCleanliness: 5,
    technicianCourtesy: 5,
    materialQuality: 5,
  });
  const [customerName, setCustomerName] = React.useState('');
  const [customerRole, setCustomerRole] = React.useState('Homeowner');
  const [liveAreas, setLiveAreas] = React.useState<DbServiceArea[]>(
    () => getCachedServiceAreas() ?? []
  );
  const [locality, setLocality] = React.useState(
    () => getCachedServiceAreas()?.[0]?.locality || 'Keshrambha'
  );
  const [serviceName, setServiceName] = React.useState('');
  const [headline, setHeadline] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [selectedHighlights, setSelectedHighlights] = React.useState<string[]>([
    'Leak-Free Precision',
    'On-Time Arrival',
    'Genuine Spare Parts Used',
  ]);
  const [wouldRecommend, setWouldRecommend] = React.useState(true);
  const [submittingReview, setSubmittingReview] = React.useState(false);
  const [submittedReviewReceipt, setSubmittedReviewReceipt] =
    React.useState<VerifiedWorkReview | null>(null);

  // Feed Filter & Sort State
  const [filterRating, setFilterRating] = React.useState<number | 'all'>('all');
  const [filterService, setFilterService] = React.useState<string>('all');
  const [filterHighlight, setFilterHighlight] = React.useState<string>('all');
  const [feedSearchQuery, setFeedSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<ReviewSortOption>('newest');

  const populateFormFromBooking = React.useCallback(
    (
      booking: VerifiableBookingRecord,
      existingReviewList: VerifiedWorkReview[]
    ) => {
      const existing = existingReviewList.find(
        (r) =>
          r.bookingId.trim().toUpperCase() ===
          booking.bookingId.trim().toUpperCase()
      );

      if (existing) {
        setOverallRating(existing.rating);
        setMetrics({
          workmanship: existing.metrics.workmanship || existing.rating || 5,
          punctuality: existing.metrics.punctuality || existing.rating || 5,
          pricingTransparency:
            existing.metrics.pricingTransparency || existing.rating || 5,
          siteCleanliness:
            existing.metrics.siteCleanliness || existing.rating || 5,
          technicianCourtesy:
            existing.metrics.technicianCourtesy ||
            existing.metrics.workmanship ||
            existing.rating ||
            5,
          materialQuality:
            existing.metrics.materialQuality ||
            existing.metrics.workmanship ||
            existing.rating ||
            5,
        });
        setCustomerName(existing.customerName);
        setCustomerRole(existing.customerRole || 'Homeowner');
        setLocality(existing.locality || 'Midnapore');
        setServiceName(existing.serviceName || booking.serviceName);
        setHeadline(existing.headline);
        setComment(existing.comment);
        setSelectedHighlights(
          existing.highlights.length > 0
            ? existing.highlights
            : ['Leak-Free Precision']
        );
        setWouldRecommend(existing.wouldRecommend);
      } else {
        setOverallRating(5);
        setMetrics({
          workmanship: 5,
          punctuality: 5,
          pricingTransparency: 5,
          siteCleanliness: 5,
          technicianCourtesy: 5,
          materialQuality: 5,
        });
        setCustomerName(
          booking.customerName &&
            booking.customerName !== 'Verified Booking Holder' &&
            booking.customerName !== 'Registered Client' &&
            booking.customerName !== 'Verified Client'
            ? booking.customerName
            : ''
        );
        setCustomerRole('Homeowner');
        setLocality(
          booking.locality && booking.locality !== 'Midnapore & South Bengal'
            ? booking.locality
            : 'Midnapore'
        );
        setServiceName(booking.serviceName || 'Leak Detection & Pipe Repair');
        setHeadline('');
        setComment('');
        setSelectedHighlights([
          'Leak-Free Precision',
          'On-Time Arrival',
          'Genuine Spare Parts Used',
        ]);
        setWouldRecommend(true);
      }
    },
    []
  );

  // Initial load of verified reviews & deep-linked booking
  React.useEffect(() => {
    let active = true;

    Promise.all([
      fetchVerifiedReviews(),
      searchBookingsForReview({
        bookingQuery: deepLinkBookingId || undefined,
      }),
      fetchLiveServiceAreas(),
    ]).then(
      ([
        { reviews: liveReviews },
        { bookings: availableBookings },
        { data: dbAreas },
      ]) => {
        if (!active) return;

        if (dbAreas.length > 0) {
          setLiveAreas(dbAreas);
          setLocality((prev) =>
            prev === 'Midnapore' || !prev ? dbAreas[0].locality : prev
          );
        }

        setReviews(liveReviews);
        const votedMap: Record<string, boolean> = {};
        for (const r of liveReviews) {
          if (hasVotedReviewHelpful(r.id)) {
            votedMap[r.id] = true;
          }
        }
        setVotedIds(votedMap);
        setMatchedBookings(availableBookings);
        setLoadingReviews(false);

        if (deepLinkBookingId.trim()) {
          const cleanTarget = deepLinkBookingId.trim().toUpperCase();
          const exact = availableBookings.find(
            (b) => b.bookingId.toUpperCase() === cleanTarget
          );
          if (exact) {
            setSelectedBooking(exact);
            populateFormFromBooking(exact, liveReviews);
            setActiveStep(2);
          } else if (availableBookings.length > 0) {
            setActiveStep(2);
          }
        }
      }
    );

    return () => {
      active = false;
    };
  }, [deepLinkBookingId, populateFormFromBooking]);

  const localitySelectOptions = React.useMemo(() => {
    const opts = liveAreas.map((a) => ({
      key: a.id || a.locality,
      value: a.locality,
      label: `${a.locality}${a.pincode ? ` (PIN ${a.pincode})` : ''}`,
      description: `${a.district || 'West Medinipur'} · Verified Service Area`,
      badge: a.pincode ? `PIN ${a.pincode}` : 'Active',
    }));
    if (
      locality &&
      !opts.some((o) => o.value.toLowerCase() === locality.toLowerCase())
    ) {
      opts.unshift({
        key: `booking-loc-${locality}`,
        value: locality,
        label: locality,
        description: 'Recorded Booking Locality',
        badge: 'Booking Area',
      });
    }
    return opts;
  }, [liveAreas, locality]);

  const analytics = React.useMemo(
    () => computeReviewAnalytics(reviews),
    [reviews]
  );

  const reviewedBookingIdsSet = React.useMemo(() => {
    const set = new Set<string>();
    for (const r of reviews) {
      set.add(r.bookingId.trim().toUpperCase());
    }
    return set;
  }, [reviews]);

  // Step 1 Handler: Search Bookings by ID, Phone, or Load All Active/Completed Work Orders
  const handleFindBookingsStep1 = async (
    e?: React.FormEvent,
    loadAllVerified = false
  ) => {
    if (e) e.preventDefault();

    const cleanId = loadAllVerified ? '' : bookingIdInput.trim();
    const cleanPhone = loadAllVerified ? '' : phoneInput.trim();

    setSearchingBookings(true);
    setSubmittedReviewReceipt(null);

    try {
      const { bookings } = await searchBookingsForReview({
        bookingQuery: cleanId,
        phoneQuery: cleanPhone,
      });

      setMatchedBookings(bookings);

      if (bookings.length === 0) {
        toast.error(
          'No matching work order found. Check your Booking ID (e.g., SP-20261014-054E7D) or browse all recent bookings.'
        );
      } else {
        setActiveStep(2);
        if (bookings.length === 1 && cleanId) {
          setSelectedBooking(bookings[0]);
          populateFormFromBooking(bookings[0], reviews);
        }
        toast.success(
          `Found ${bookings.length} verified work ${bookings.length === 1 ? 'order' : 'orders'}`
        );
      }
    } finally {
      setSearchingBookings(false);
    }
  };

  // Step 2 Handler: Choose a Specific Booking to Review
  const handleSelectBookingStep2 = (booking: VerifiableBookingRecord) => {
    setSelectedBooking(booking);
    populateFormFromBooking(booking, reviews);
    setSubmittedReviewReceipt(null);
    setActiveStep(3);
  };

  // Jump directly from an existing Review Card to Step 3 to edit/update it
  const handleEditReviewFromCard = (review: VerifiedWorkReview) => {
    const matched = matchedBookings.find(
      (b) => b.bookingId.toUpperCase() === review.bookingId.toUpperCase()
    ) || {
      bookingId: review.bookingId,
      bookingUuid: review.bookingUuid || null,
      customerName: review.customerName,
      phoneMasked: 'Verified Client',
      serviceId: null,
      serviceName: review.serviceName,
      urgency: 'normal',
      status: review.bookingStatus || 'Completed',
      preferredDate: review.workDate,
      preferredTimeSlot: 'Completed Visit',
      locality: review.locality,
      notes: null,
      createdAt: review.createdAt,
      source: 'dispatch' as const,
    };

    setSelectedBooking(matched);
    populateFormFromBooking(matched, reviews);
    setSubmittedReviewReceipt(null);
    setActiveStep(3);

    const el = document.getElementById('write-review');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleHighlight = (tag: string) => {
    setSelectedHighlights((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const applyExperienceTemplate = (
    tpl: (typeof WORK_EXPERIENCE_TEMPLATES)[number]
  ) => {
    setHeadline(tpl.headline);
    setComment(tpl.snippet);
    setSelectedHighlights(tpl.highlights);
    toast.success(`Applied "${tpl.label}" review template`);
  };

  const handleSetAllMasterStars = () => {
    setOverallRating(5);
    setMetrics({
      workmanship: 5,
      punctuality: 5,
      pricingTransparency: 5,
      siteCleanliness: 5,
      technicianCourtesy: 5,
      materialQuality: 5,
    });
    toast.success('All 6 work categories set to 5.0 ★ Master Class');
  };

  const handleUpdateMetric = (
    key: keyof Required<WorkBasisMetrics>,
    val: number
  ) => {
    setMetrics((prev) => {
      const next = { ...prev, [key]: val };
      const avg = Math.round(
        (next.workmanship +
          next.punctuality +
          next.pricingTransparency +
          next.siteCleanliness +
          next.technicianCourtesy +
          next.materialQuality) /
          6
      );
      setOverallRating(Math.min(5, Math.max(1, avg)));
      return next;
    });
  };

  // Step 3 Handler: Submit Work-Basis Review
  const handleSubmitReviewStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) {
      toast.error('Please choose a verified booking first.');
      setActiveStep(2);
      return;
    }

    if (!customerName.trim() || customerName.trim().length < 2) {
      toast.error('Please enter your name as the booking holder.');
      return;
    }

    if (!comment.trim() || comment.trim().length < 10) {
      toast.error(
        'Please share at least a brief sentence describing the plumbing work performed.'
      );
      return;
    }

    const finalHeadline =
      headline.trim() ||
      `${RATING_LABELS[overallRating]?.title || 'Verified Work'} — ${serviceName || selectedBooking.serviceName}`;

    setSubmittingReview(true);
    try {
      const { review, error } = await submitVerifiedWorkReview({
        booking: selectedBooking,
        customerName: customerName.trim(),
        customerRole: customerRole.trim() || 'Homeowner',
        locality: locality.trim() || 'Midnapore',
        serviceName: serviceName.trim() || selectedBooking.serviceName,
        rating: overallRating,
        metrics,
        headline: finalHeadline,
        comment: comment.trim(),
        highlights: selectedHighlights,
        wouldRecommend,
      });

      if (error || !review) {
        toast.error(error || 'Unable to submit review. Please try again.');
        return;
      }

      const { reviews: refreshed } = await fetchVerifiedReviews();
      setReviews(refreshed);
      setSubmittedReviewReceipt(review);
      toast.success(`Work review published for Booking ${review.bookingId}!`);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleHelpfulClick = async (review: VerifiedWorkReview) => {
    const { helpfulCount, alreadyVoted } = await markReviewHelpful(review.id);
    if (alreadyVoted) {
      toast.info('You have already marked this work review as helpful.');
      return;
    }
    setVotedIds((prev) => ({ ...prev, [review.id]: true }));
    setReviews((prev) =>
      prev.map((item) =>
        item.id === review.id ? { ...item, helpfulCount } : item
      )
    );
    toast.success('Marked work review as helpful');
  };

  const handleDeleteReview = async (review: VerifiedWorkReview) => {
    await deleteVerifiedWorkReview(review.id);
    setReviews((prev) =>
      prev.filter(
        (item) =>
          item.id !== review.id &&
          item.bookingId.toUpperCase() !== review.bookingId.toUpperCase()
      )
    );
    if (certificateReview?.id === review.id) {
      setCertificateReview(null);
    }
    toast.success(`Removed review for Booking ${review.bookingId}`);
  };

  // Distinct service categories from actual verified reviews
  const availableServices = React.useMemo(() => {
    const set = new Set<string>();
    for (const r of reviews) {
      if (r.serviceName) set.add(r.serviceName);
    }
    return Array.from(set);
  }, [reviews]);

  // Filtered and sorted verified reviews
  const filteredReviews = React.useMemo(() => {
    const q = feedSearchQuery.trim().toLowerCase();

    const filtered = reviews.filter((r) => {
      if (filterRating !== 'all') {
        if (filterRating === 3) {
          if (r.rating > 3) return false;
        } else if (Math.round(r.rating) !== filterRating) {
          return false;
        }
      }

      if (filterService !== 'all' && r.serviceName !== filterService) {
        return false;
      }

      if (
        filterHighlight !== 'all' &&
        (!Array.isArray(r.highlights) || !r.highlights.includes(filterHighlight))
      ) {
        return false;
      }

      if (q) {
        const haystack = [
          r.bookingId,
          r.customerName,
          r.customerRole,
          r.locality,
          r.serviceName,
          r.headline,
          r.comment,
          ...(r.highlights || []),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      if (sortBy === 'helpful')
        return (b.helpfulCount || 0) - (a.helpfulCount || 0);
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }, [
    reviews,
    filterRating,
    filterService,
    filterHighlight,
    feedSearchQuery,
    sortBy,
  ]);

  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
        {/* =====================================================================
            1. EXECUTIVE STAR RATING PRESTIGE & 6-CATEGORY QUALITY MATRIX
           ===================================================================== */}
        <div className="rounded-3xl border border-border/80 bg-card/95 shadow-crisp-lg overflow-hidden">
          <div className="border-b border-border/60 bg-muted/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>100% Verified Work-Order Reviews</span>
              <span aria-hidden="true" className="text-border">
                ·
              </span>
              <span className="text-muted-foreground font-mono">
                AUTHENTIC CLIENT FEEDBACK
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-mono tabular-nums">
                Verified Work Orders Ready: {matchedBookings.length}
              </span>
              <span aria-hidden="true" className="text-border">
                ·
              </span>
              <a
                href="#write-review"
                className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                Rate Your Plumbing Work
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Column: Sculpted Star Crest & Overall Rating */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-5 lg:border-r lg:border-border/60 lg:pr-8">
              <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/[0.08] via-card to-card p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.08em] text-amber-600 dark:text-amber-400">
                    Overall Craftsmanship Score
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Class-S Rated
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight text-foreground tabular-nums font-mono">
                    {analytics.totalReviews > 0
                      ? analytics.averageRating.toFixed(1)
                      : '5.0'}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'h-4 w-4',
                            analytics.totalReviews === 0 ||
                              star <= Math.round(analytics.averageRating)
                              ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]'
                              : 'text-muted-foreground/30'
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground font-mono tabular-nums">
                      Out of 5.00 Master Standard
                    </p>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  Every review is linked directly to an official{' '}
                  <span className="font-mono font-semibold text-foreground">
                    SP-
                  </span>{' '}
                  plumbing work order completed across Midnapore, Dantan, and
                  South Bengal.
                </p>

                <div className="pt-3 flex items-center justify-between gap-3 text-xs border-t border-border/60">
                  <div>
                    <span className="text-muted-foreground block">
                      Client Recommendation
                    </span>
                    <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {analytics.totalReviews > 0
                        ? `${analytics.recommendationRate}% Recommend`
                        : '100% Satisfaction'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground block">
                      Verified Evaluations
                    </span>
                    <span className="font-mono font-bold text-sm text-foreground tabular-nums">
                      {analytics.totalReviews}{' '}
                      {analytics.totalReviews === 1 ? 'Review' : 'Reviews'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive 5-Star Distribution Bars */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Star Rating Breakdown
                  </span>
                  {filterRating !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setFilterRating('all')}
                      className="text-primary font-semibold hover:underline cursor-pointer"
                    >
                      Show All
                    </button>
                  )}
                </div>
                {([5, 4, 3, 2, 1] as const).map((star) => {
                  const count = analytics.starCounts[star] || 0;
                  const pct =
                    analytics.totalReviews > 0
                      ? Math.round((count / analytics.totalReviews) * 100)
                      : star === 5
                        ? 100
                        : 0;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setFilterRating((prev) =>
                          prev === star ? 'all' : star
                        )
                      }
                      className={cn(
                        'w-full flex items-center gap-3 text-xs py-1.5 px-2.5 rounded-xl transition-colors cursor-pointer',
                        filterRating === star
                          ? 'bg-amber-500/15 text-foreground font-semibold ring-1 ring-amber-400/40'
                          : 'hover:bg-muted/60 text-muted-foreground'
                      )}
                    >
                      <span className="w-12 text-left font-mono font-bold tabular-nums flex items-center gap-1 text-foreground">
                        {star}.0{' '}
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      </span>
                      <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-16 text-right font-mono tabular-nums text-[11px]">
                        {count} ({pct}%)
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right 8 Columns: Top-Class 6-Category Star Rating Matrix */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                    Top-Class 6-Category Star Audit
                  </p>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                    Work-Basis Performance Across 6 Plumbing Standards
                  </h3>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  Rated on Every Verified Work Order
                </span>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                {PILLAR_CONFIG.map((pillar) => {
                  const Icon = pillar.icon;
                  const rawVal = analytics.pillarAverages[pillar.key];
                  const val = analytics.totalReviews > 0 ? rawVal : 5.0;
                  const pct = Math.round((val / 5) * 100);
                  const grade = getCategoryGradeLabel(val);

                  return (
                    <div
                      key={pillar.key}
                      className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div>
                            <h4 className="font-display text-xs sm:text-sm font-bold text-foreground">
                              {pillar.label}
                            </h4>
                            <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                              {pillar.helper}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono text-sm font-extrabold text-foreground tabular-nums block">
                            {val.toFixed(1)} ★
                          </span>
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                            {grade}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={cn(
                                'h-3.5 w-3.5',
                                s <= Math.round(val)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-muted-foreground/25'
                              )}
                            />
                          ))}
                        </div>
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Most Praised Work Highlights Bar */}
              {analytics.topHighlights.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-muted-foreground font-medium mr-1">
                    Top Client Highlights:
                  </span>
                  {analytics.topHighlights.map((h) => {
                    const isSelected = filterHighlight === h.label;
                    return (
                      <button
                        key={h.label}
                        type="button"
                        onClick={() =>
                          setFilterHighlight((prev) =>
                            prev === h.label ? 'all' : h.label
                          )
                        }
                        className={cn(
                          'px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer',
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border/70 bg-background text-foreground hover:border-primary/40'
                        )}
                      >
                        ✓ {h.label}{' '}
                        <span className="font-mono text-[11px] opacity-75">
                          ({h.count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =====================================================================
            2. THE 3-STEP WORK-BASIS REVIEW & FEEDBACK ENGINE
               Step 1: Give Booking Details -> Step 2: Choose Your Booking -> Step 3: Give Review
           ===================================================================== */}
        <div
          id="write-review"
          className="scroll-mt-24 rounded-3xl border border-primary/25 bg-gradient-to-b from-primary/[0.04] via-card to-card shadow-crisp-lg overflow-hidden"
        >
          {/* Stepper Header */}
          <div className="border-b border-border/70 px-6 py-5 sm:px-8 bg-card/80">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                  Work-Basis Review &amp; Feedback Studio
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
                  Rate &amp; Review Your Plumbing Work Order
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Give Booking Details → Choose Your Booking → Give Your 6-Category
                  Star Review.
                </p>
              </div>

              {/* Interactive 3-Step Progress Bar */}
              <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-3">
                {[
                  {
                    step: 1 as ReviewFlowStep,
                    label: 'Give Booking Details',
                    icon: Search,
                  },
                  {
                    step: 2 as ReviewFlowStep,
                    label: 'Choose Your Booking',
                    icon: ClipboardCheck,
                  },
                  {
                    step: 3 as ReviewFlowStep,
                    label: 'Give Work Review',
                    icon: MessageSquarePlus,
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  const isCurrent = activeStep === item.step;
                  const isCompleted = activeStep > item.step;
                  const canJump =
                    item.step === 1 ||
                    (item.step === 2 && matchedBookings.length > 0) ||
                    (item.step === 3 && Boolean(selectedBooking));

                  return (
                    <React.Fragment key={item.step}>
                      <button
                        type="button"
                        disabled={!canJump}
                        onClick={() => {
                          if (canJump) {
                            setSubmittedReviewReceipt(null);
                            setActiveStep(item.step);
                          }
                        }}
                        className={cn(
                          'flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition-all cursor-pointer',
                          isCurrent
                            ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                            : isCompleted
                              ? 'border-emerald-500/40 bg-emerald-500/10 text-foreground hover:border-emerald-500/70'
                              : 'border-border/70 bg-muted/40 text-muted-foreground',
                          !canJump && 'opacity-60 cursor-not-allowed'
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-mono font-bold',
                            isCurrent
                              ? 'bg-primary-foreground/20 text-primary-foreground'
                              : isCompleted
                                ? 'bg-emerald-500 text-white'
                                : 'bg-background text-muted-foreground'
                          )}
                        >
                          {isCompleted ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            item.step
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-mono uppercase tracking-wider opacity-80">
                            Step 0{item.step}
                          </p>
                          <p className="text-xs font-semibold truncate">
                            {item.label}
                          </p>
                        </div>
                        <Icon className="h-3.5 w-3.5 shrink-0 hidden xl:block opacity-80" />
                      </button>
                      {idx < 2 && (
                        <ArrowRight className="hidden sm:block h-4 w-4 text-muted-foreground/50 shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step Body */}
          <div className="p-6 sm:p-8 lg:p-10">
            <AnimatePresence mode="wait">
              {/* ===============================================================
                  STEP 1: GIVE BOOKING DETAILS
                 =============================================================== */}
              {activeStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="grid gap-8 lg:grid-cols-12 items-start"
                >
                  <form
                    onSubmit={(e) => handleFindBookingsStep1(e, false)}
                    className="lg:col-span-7 space-y-5"
                  >
                    <div className="space-y-1.5">
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
                        Step 01 of 03 · Give Booking Details
                      </span>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                        Enter Your Booking Reference or Registered Phone Number
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Locate your plumbing work order by Booking ID (for example,{' '}
                        <span className="font-mono font-semibold text-foreground">
                          SP-20261014-054E7D
                        </span>
                        ) or mobile number to begin your evaluation.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="review-booking-id"
                          className="text-xs font-semibold"
                        >
                          Booking Reference ID
                        </Label>
                        <Input
                          id="review-booking-id"
                          placeholder="e.g. SP-20261014-054E7D"
                          value={bookingIdInput}
                          onChange={(e) => setBookingIdInput(e.target.value)}
                          className="h-11 rounded-xl font-mono text-sm uppercase"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="review-phone"
                          className="text-xs font-semibold"
                        >
                          Registered Phone Number{' '}
                          <span className="text-muted-foreground font-normal">
                            (Optional if ID entered)
                          </span>
                        </Label>
                        <Input
                          id="review-phone"
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          className="h-11 rounded-xl font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <Button
                        type="submit"
                        disabled={searchingBookings}
                        className="h-11 px-6 rounded-xl font-semibold text-xs sm:text-sm"
                      >
                        {searchingBookings ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Checking Work Orders...
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            Find My Booking &amp; Continue
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        disabled={searchingBookings}
                        onClick={() => handleFindBookingsStep1(undefined, true)}
                        className="h-11 px-4 rounded-xl text-xs font-semibold"
                      >
                        <ClipboardCheck className="mr-2 h-4 w-4 text-primary" />
                        Browse Verified Work Orders ({matchedBookings.length || 1})
                      </Button>
                    </div>
                  </form>

                  {/* Quick Pick Panel for Recent Work Orders */}
                  <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-muted/25 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck2 className="h-4 w-4 text-primary" />
                        <h4 className="font-display text-sm font-bold text-foreground">
                          Recent Verified Work Orders
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
                        {matchedBookings.length} Ready
                      </span>
                    </div>

                    {matchedBookings.length === 0 ? (
                      <div className="text-xs text-muted-foreground py-4 space-y-2">
                        <p>
                          Enter your Booking ID above or click{' '}
                          <strong className="text-foreground">
                            Browse Verified Work Orders
                          </strong>{' '}
                          to view recent service visits.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                        {matchedBookings.slice(0, 4).map((b) => {
                          const alreadyReviewed = reviewedBookingIdsSet.has(
                            b.bookingId.toUpperCase()
                          );
                          return (
                            <div
                              key={b.bookingId}
                              className="rounded-xl border border-border/80 bg-card p-3.5 flex items-center justify-between gap-3 hover:border-primary/50 transition-colors"
                            >
                              <div className="min-w-0 space-y-0.5">
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="font-mono font-bold text-primary">
                                    {b.bookingId}
                                  </span>
                                  <span
                                    aria-hidden="true"
                                    className="text-border"
                                  >
                                    ·
                                  </span>
                                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                    {bookingStatusLabel(b.status)}
                                  </span>
                                </div>
                                <p className="text-xs font-semibold text-foreground truncate">
                                  {b.serviceName}
                                </p>
                                <p className="text-[11px] text-muted-foreground font-mono">
                                  Visit: {formatReadableDate(b.preferredDate)} ·{' '}
                                  {b.preferredTimeSlot}
                                </p>
                              </div>

                              <Button
                                type="button"
                                size="sm"
                                variant={alreadyReviewed ? 'outline' : 'default'}
                                onClick={() => handleSelectBookingStep2(b)}
                                className="h-8 px-3 rounded-lg text-xs font-semibold shrink-0"
                              >
                                {alreadyReviewed ? 'Edit Review' : 'Select'}
                                <ArrowRight className="ml-1 h-3.5 w-3.5" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ===============================================================
                  STEP 2: CHOOSE YOUR BOOKING
                 =============================================================== */}
              {activeStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                    <div>
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
                        Step 02 of 03 · Choose Your Booking
                      </span>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mt-0.5">
                        Select the Plumbing Work Order You Want to Review
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Showing {matchedBookings.length} verified work{' '}
                        {matchedBookings.length === 1 ? 'order' : 'orders'} from
                        Sohan Pipelines service dispatch.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveStep(1)}
                      className="rounded-xl text-xs font-semibold self-start sm:self-auto"
                    >
                      <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                      Search Different Booking
                    </Button>
                  </div>

                  {matchedBookings.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border p-8 text-center space-y-3">
                      <p className="text-sm font-semibold text-foreground">
                        No Matching Bookings Found
                      </p>
                      <p className="text-xs text-muted-foreground max-w-md mx-auto">
                        We couldn&apos;t find a work order matching that search.
                        Try entering your full Booking ID or browse all verified
                        work orders.
                      </p>
                      <div className="flex justify-center gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveStep(1)}
                          className="rounded-xl text-xs"
                        >
                          Back to Lookup
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() =>
                            handleFindBookingsStep1(undefined, true)
                          }
                          className="rounded-xl text-xs"
                        >
                          Show All Verified Bookings
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {matchedBookings.map((booking) => {
                        const isSelected =
                          selectedBooking?.bookingId === booking.bookingId;
                        const isReviewed = reviewedBookingIdsSet.has(
                          booking.bookingId.toUpperCase()
                        );

                        return (
                          <div
                            key={booking.bookingId}
                            onClick={() => handleSelectBookingStep2(booking)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSelectBookingStep2(booking);
                              }
                            }}
                            className={cn(
                              'group cursor-pointer rounded-2xl border p-5 transition-all text-left flex flex-col justify-between gap-4',
                              isSelected
                                ? 'border-primary bg-primary/[0.05] shadow-crisp-md'
                                : 'border-border/80 bg-card hover:border-primary/60 hover:shadow-crisp-sm'
                            )}
                          >
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-sm text-primary">
                                    {booking.bookingId}
                                  </span>
                                  <span
                                    aria-hidden="true"
                                    className="text-border"
                                  >
                                    ·
                                  </span>
                                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                    {bookingStatusLabel(booking.status)}
                                  </span>
                                </div>

                                <span className="font-mono text-[11px] text-muted-foreground">
                                  {isReviewed
                                    ? '✓ Review Published (Click to Edit)'
                                    : 'Ready for Review'}
                                </span>
                              </div>

                              <div>
                                <h4 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors">
                                  {booking.serviceName}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Client: {booking.customerName} ·{' '}
                                  {booking.locality}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                                  <span className="truncate">
                                    {formatReadableDate(booking.preferredDate)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                                  <span className="truncate">
                                    {booking.preferredTimeSlot}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="pt-2 flex items-center justify-between border-t border-border/60">
                              <span className="text-[11px] font-mono text-muted-foreground">
                                {booking.source === 'dispatch'
                                  ? 'Official Dispatch Record'
                                  : 'Confirmed Service Booking'}
                              </span>

                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                                {isReviewed
                                  ? 'Update Work Review'
                                  : 'Choose Booking & Give Review'}
                                <ArrowRight className="h-3.5 w-3.5" />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ===============================================================
                  STEP 3: GIVE REVIEW & 6-CATEGORY STAR EVALUATION
                 =============================================================== */}
              {activeStep === 3 && selectedBooking && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                >
                  {submittedReviewReceipt ? (
                    <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/[0.04] p-6 sm:p-8 text-center max-w-2xl mx-auto space-y-5">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
                          Work Review Verified &amp; Published
                        </p>
                        <h3 className="font-display text-2xl font-bold text-foreground">
                          Thank You, {submittedReviewReceipt.customerName}!
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Your {submittedReviewReceipt.rating}.0-star evaluation
                          for work order{' '}
                          <span className="font-mono font-bold text-foreground">
                            {submittedReviewReceipt.bookingId}
                          </span>{' '}
                          ({submittedReviewReceipt.serviceName}) is now live in
                          our verified client review ledger below.
                        </p>
                      </div>

                      <div className="rounded-xl border border-border/70 bg-card p-4 text-left space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-primary">
                            Work Order: {submittedReviewReceipt.bookingId}
                          </span>
                          <span className="font-mono font-semibold text-amber-500">
                            ★ {submittedReviewReceipt.rating}.0 / 5.0 Master
                            Rating
                          </span>
                        </div>
                        <p className="font-semibold text-sm text-foreground">
                          {submittedReviewReceipt.headline}
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          &ldquo;{submittedReviewReceipt.comment}&rdquo;
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCertificateReview(submittedReviewReceipt)
                          }
                          className="rounded-xl text-xs font-semibold border-amber-500/40 text-amber-600 dark:text-amber-400"
                        >
                          <Award className="mr-1.5 h-3.5 w-3.5" />
                          View &amp; Print Work Certificate
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSubmittedReviewReceipt(null);
                            setActiveStep(1);
                          }}
                          className="rounded-xl text-xs font-semibold"
                        >
                          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                          Review Another Booking
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            const el = document.getElementById(
                              'verified-reviews-feed'
                            );
                            el?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="rounded-xl text-xs font-semibold"
                        >
                          View in Verified Reviews Feed
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmitReviewStep3}
                      className="space-y-8"
                    >
                      {/* Selected Booking Banner */}
                      <div className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-mono uppercase tracking-wider text-primary font-bold">
                              Selected Work Order: {selectedBooking.bookingId}
                            </span>
                            <span aria-hidden="true" className="text-border">
                              ·
                            </span>
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">
                              Status: {bookingStatusLabel(selectedBooking.status)}
                            </span>
                            <span aria-hidden="true" className="text-border">
                              ·
                            </span>
                            <span className="text-muted-foreground font-mono">
                              {formatReadableDate(selectedBooking.preferredDate)}
                            </span>
                          </div>
                          <p className="font-display font-bold text-base text-foreground">
                            {selectedBooking.serviceName}
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveStep(2)}
                          className="rounded-xl text-xs font-semibold shrink-0 self-start sm:self-center"
                        >
                          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                          Change Booking
                        </Button>
                      </div>

                      <div className="grid gap-8 lg:grid-cols-12">
                        {/* Left Column: Luxury Star Console + 6 Top-Class Categories */}
                        <div className="lg:col-span-5 space-y-6">
                          {/* Overall Luxury Star Selector */}
                          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/[0.06] via-card to-card p-5 space-y-4">
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <Label className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                  1. Overall Star Rating
                                </Label>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                  Select your overall work satisfaction tier
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={handleSetAllMasterStars}
                                className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                              >
                                Rate All 5.0 ★
                              </button>
                            </div>

                            <LuxuryTierStarSelector
                              value={overallRating}
                              onChange={setOverallRating}
                            />

                            <div className="rounded-xl bg-muted/50 px-3.5 py-3 border border-border/60 flex items-start justify-between gap-3">
                              <div>
                                <p className="text-xs font-bold text-foreground">
                                  {RATING_LABELS[overallRating]?.title}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                  {RATING_LABELS[overallRating]?.subtitle}
                                </p>
                              </div>
                              <span className="font-mono text-xs font-bold text-amber-500 shrink-0">
                                {RATING_LABELS[overallRating]?.badge}
                              </span>
                            </div>
                          </div>

                          {/* 6 Top-Class Work-Basis Categories */}
                          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-xs font-semibold uppercase tracking-wider text-primary">
                                  2. Top-Class Category Star Ratings
                                </Label>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                  Rate all 6 plumbing craftsmanship standards
                                </p>
                              </div>
                              <span className="text-[11px] font-mono text-muted-foreground">
                                6 Pillars
                              </span>
                            </div>

                            <div className="space-y-3">
                              {PILLAR_CONFIG.map((pillar) => {
                                const Icon = pillar.icon;
                                const val = metrics[pillar.key] || 5;
                                return (
                                  <div
                                    key={pillar.key}
                                    className="rounded-xl border border-border/60 bg-muted/20 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                                  >
                                    <div className="flex items-start gap-2.5 pr-2">
                                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                                        <Icon className="h-3.5 w-3.5" />
                                      </span>
                                      <div>
                                        <p className="text-xs font-semibold text-foreground">
                                          {pillar.label}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                          {pillar.helper}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pl-9 sm:pl-0">
                                      <InteractiveStarBar
                                        value={val}
                                        onChange={(nextVal) =>
                                          handleUpdateMetric(pillar.key, nextVal)
                                        }
                                        size="sm"
                                      />
                                      <span className="w-8 text-right font-mono text-xs font-bold text-amber-500 tabular-nums">
                                        {val}.0★
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Customer Details, 1-Click Templates, Highlights & Feedback */}
                        <div className="lg:col-span-7 space-y-6">
                          <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-1.5">
                                <Label
                                  htmlFor="rev-customer-name"
                                  className="text-xs font-semibold"
                                >
                                  Your Name (Booking Holder) *
                                </Label>
                                <Input
                                  id="rev-customer-name"
                                  required
                                  placeholder="e.g. Subhajit Jana"
                                  value={customerName}
                                  onChange={(e) =>
                                    setCustomerName(e.target.value)
                                  }
                                  className="h-10 rounded-xl text-sm"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <Label
                                  htmlFor="rev-customer-role"
                                  className="text-xs font-semibold"
                                >
                                  Property / Client Type
                                </Label>
                                <CustomSelect
                                  id="rev-customer-role"
                                  value={customerRole}
                                  onChange={(val) => setCustomerRole(val)}
                                  options={[
                                    {
                                      value: 'Homeowner',
                                      label: 'Homeowner',
                                      description: 'Residential house or villa',
                                    },
                                    {
                                      value: 'Commercial Business Owner',
                                      label: 'Commercial Business Owner',
                                      description: 'Shop, office, or commercial unit',
                                    },
                                    {
                                      value: 'Apartment / Facility Manager',
                                      label: 'Apartment / Facility Manager',
                                      description: 'Multi-unit residential complex',
                                    },
                                    {
                                      value: 'Industrial Site Engineer',
                                      label: 'Industrial Site Engineer',
                                      description: 'Factory or institutional facility',
                                    },
                                    {
                                      value: 'Residential Tenant',
                                      label: 'Residential Tenant',
                                      description: 'Rented residential property',
                                    },
                                  ]}
                                  buttonClassName="h-10 bg-background"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <Label
                                  htmlFor="rev-service-name"
                                  className="text-xs font-semibold"
                                >
                                  Plumbing Work Performed *
                                </Label>
                                <Input
                                  id="rev-service-name"
                                  required
                                  placeholder="e.g. Leak Detection & Pipe Repair"
                                  value={serviceName}
                                  onChange={(e) =>
                                    setServiceName(e.target.value)
                                  }
                                  className="h-10 rounded-xl text-sm"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <Label
                                  htmlFor="rev-locality"
                                  className="text-xs font-semibold"
                                >
                                  Service Area / Locality
                                </Label>
                                <CustomSelect
                                  id="rev-locality"
                                  value={locality}
                                  onChange={(val) => setLocality(val)}
                                  options={localitySelectOptions}
                                  placeholder="Select service area"
                                  icon={<MapPin className="h-4 w-4" />}
                                  buttonClassName="h-10 bg-background"
                                />
                              </div>
                            </div>

                            {/* 1-Click Guided Work Experience Starters */}
                            <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-3.5 space-y-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                  <Wand2 className="h-3.5 w-3.5 text-primary" />
                                  Quick Review Starters (1-Click Autofill &amp; Customize)
                                </span>
                                <span className="text-[10px] font-mono text-muted-foreground">
                                  Optional Helper
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {WORK_EXPERIENCE_TEMPLATES.map((tpl) => (
                                  <button
                                    key={tpl.id}
                                    type="button"
                                    onClick={() => applyExperienceTemplate(tpl)}
                                    className="px-2.5 py-1 rounded-lg border border-border/80 bg-card hover:border-primary/50 hover:text-primary text-[11px] font-medium transition-colors cursor-pointer"
                                  >
                                    + {tpl.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Work Quality Highlights (Interactive Toggle Buttons) */}
                            <div className="space-y-2">
                              <Label className="text-xs font-semibold">
                                What Stood Out About the Work? (Select Highlights)
                              </Label>
                              <div className="flex flex-wrap gap-2">
                                {WORK_HIGHLIGHT_OPTIONS.map((tag) => {
                                  const active =
                                    selectedHighlights.includes(tag);
                                  return (
                                    <button
                                      key={tag}
                                      type="button"
                                      onClick={() => toggleHighlight(tag)}
                                      className={cn(
                                        'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
                                        active
                                          ? 'border-primary bg-primary text-primary-foreground shadow-2xs'
                                          : 'border-border/80 bg-muted/40 text-muted-foreground hover:text-foreground hover:border-border'
                                      )}
                                    >
                                      {active ? '✓ ' : '+ '}
                                      {tag}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <Label
                                htmlFor="rev-headline"
                                className="text-xs font-semibold"
                              >
                                Review Headline{' '}
                                <span className="text-muted-foreground font-normal">
                                  (Optional)
                                </span>
                              </Label>
                              <Input
                                id="rev-headline"
                                placeholder="e.g. Fast concealed pipe repair with zero wall damage"
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                                className="h-10 rounded-xl text-sm"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <Label
                                htmlFor="rev-comment"
                                className="text-xs font-semibold"
                              >
                                Detailed Work Feedback &amp; Experience *
                              </Label>
                              <Textarea
                                id="rev-comment"
                                required
                                rows={4}
                                placeholder="Describe the plumbing work performed, how quickly the technician resolved the issue, and the quality of fittings used..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="rounded-xl text-sm resize-y"
                              />
                            </div>

                            {/* Recommend Toggle + Submit */}
                            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/60">
                              <button
                                type="button"
                                onClick={() =>
                                  setWouldRecommend((prev) => !prev)
                                }
                                className="inline-flex items-center gap-2.5 text-xs font-semibold text-foreground hover:text-primary transition-colors text-left cursor-pointer"
                              >
                                <span
                                  className={cn(
                                    'flex h-5 w-5 items-center justify-center rounded-md border transition-colors',
                                    wouldRecommend
                                      ? 'border-emerald-500 bg-emerald-500 text-white'
                                      : 'border-border bg-background'
                                  )}
                                >
                                  {wouldRecommend && (
                                    <Check className="h-3.5 w-3.5" />
                                  )}
                                </span>
                                <span>
                                  I recommend Sohan Pipelines based on this work
                                  order
                                </span>
                              </button>

                              <Button
                                type="submit"
                                disabled={submittingReview}
                                className="h-11 px-6 rounded-xl font-semibold text-xs sm:text-sm"
                              >
                                {submittingReview ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Publishing Verified Review...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Publish Work-Verified Review
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* =====================================================================
            3. VERIFIED WORK REVIEWS DIRECTORY & FILTER TOOLBAR
           ===================================================================== */}
        <div id="verified-reviews-feed" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                <Award className="h-4 w-4" />
                <span>Verified Work Review Ledger</span>
                <span aria-hidden="true" className="text-border">
                  ·
                </span>
                <span className="font-mono text-muted-foreground tabular-nums">
                  {filteredReviews.length} of {reviews.length} Shown
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
                Client Reviews Linked to Real Work Orders
              </h2>
            </div>

            {/* Interactive Filter & Sort Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative w-full sm:w-60">
                <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={feedSearchQuery}
                  onChange={(e) => setFeedSearchQuery(e.target.value)}
                  placeholder="Search by Booking ID, service, area..."
                  className="h-9 pl-8 rounded-xl text-xs"
                />
              </div>

              {availableServices.length > 0 && (
                <div className="w-full sm:w-56">
                  <CustomSelect
                    value={filterService}
                    onChange={(val) => setFilterService(val)}
                    aria-label="Filter by plumbing service"
                    size="sm"
                    buttonClassName="h-9 bg-background"
                    options={[
                      { value: 'all', label: 'All Plumbing Services' },
                      ...availableServices.map((srv) => ({
                        value: srv,
                        label: srv,
                      })),
                    ]}
                  />
                </div>
              )}

              <div className="inline-flex items-center rounded-xl border border-border/80 bg-card p-0.5">
                {(
                  [
                    { id: 'newest', label: 'Newest' },
                    { id: 'highest', label: 'Highest' },
                    { id: 'helpful', label: 'Most Helpful' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSortBy(tab.id)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                      sortBy === tab.id
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Star Filter Bar */}
          {reviews.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1 mr-1">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filter by Star Tier:
              </span>
              {(
                [
                  { val: 'all', label: `All (${reviews.length})` },
                  { val: 5, label: `5.0 ★ Master (${analytics.starCounts[5]})` },
                  {
                    val: 4,
                    label: `4.0 ★ Precision (${analytics.starCounts[4]})`,
                  },
                  {
                    val: 3,
                    label: `3.0 ★ & Below (${
                      analytics.starCounts[3] +
                      analytics.starCounts[2] +
                      analytics.starCounts[1]
                    })`,
                  },
                ] as const
              ).map((chip) => (
                <button
                  key={String(chip.val)}
                  type="button"
                  onClick={() => setFilterRating(chip.val)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-mono transition-colors border cursor-pointer',
                    filterRating === chip.val
                      ? 'border-primary bg-primary/10 text-primary font-bold'
                      : 'border-border/70 bg-card text-muted-foreground hover:text-foreground'
                  )}
                >
                  {chip.label}
                </button>
              ))}
              {filterHighlight !== 'all' && (
                <button
                  type="button"
                  onClick={() => setFilterHighlight('all')}
                  className="px-3 py-1 rounded-lg text-xs font-medium border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 cursor-pointer"
                >
                  Highlight: {filterHighlight} ×
                </button>
              )}
            </div>
          )}

          {/* Reviews Grid or Verified Empty State */}
          {loadingReviews ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2].map((skeleton) => (
                <div
                  key={skeleton}
                  className="h-64 rounded-2xl border border-border/60 bg-muted/20 animate-pulse p-6"
                />
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="rounded-3xl border border-border/80 bg-card/90 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-5 shadow-crisp-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                  100% Authentic Work-Order Reviews
                </p>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                  {reviews.length === 0
                    ? 'Be the First to Share Your Verified Work Experience'
                    : 'No Verified Reviews Match Your Current Filter'}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {reviews.length === 0
                    ? 'Every review displayed here comes directly from a verified Sohan Pipelines booking. Use Step 1 above to select your booking and publish your work evaluation.'
                    : 'Try clearing your search or star filter to view all verified work order reviews.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                {reviews.length === 0 ? (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setActiveStep(matchedBookings.length > 0 ? 2 : 1);
                        const el = document.getElementById('write-review');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="h-10 px-5 rounded-xl text-xs font-semibold"
                    >
                      <ClipboardCheck className="mr-1.5 h-4 w-4" />
                      Choose Booking &amp; Give Review
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-10 px-4 rounded-xl text-xs font-semibold"
                    >
                      <Link href="/book">
                        Book Plumbing Service
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilterRating('all');
                      setFilterService('all');
                      setFilterHighlight('all');
                      setFeedSearchQuery('');
                    }}
                    className="h-9 px-4 rounded-xl text-xs font-semibold"
                  >
                    Reset Filters
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredReviews.map((review, i) => {
                const hasVoted = Boolean(votedIds[review.id]);
                const courtesyVal =
                  review.metrics.technicianCourtesy ||
                  review.metrics.workmanship ||
                  review.rating;
                const materialVal =
                  review.metrics.materialQuality ||
                  review.metrics.workmanship ||
                  review.rating;

                return (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: Math.min(i * 0.04, 0.2),
                    }}
                    className="h-full"
                  >
                    <Card className="h-full border border-border/80 bg-card/95 rounded-2xl shadow-crisp-sm hover:shadow-crisp-lg hover:border-primary/50 transition-all flex flex-col justify-between">
                      <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-5">
                        <div className="space-y-4">
                          {/* Top Row: Stars + Verified Booking ID + Certificate Trigger */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={cn(
                                      'h-4 w-4',
                                      star <= Math.round(review.rating)
                                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.35)]'
                                        : 'text-muted-foreground/25'
                                    )}
                                  />
                                ))}
                              </div>
                              <span className="font-mono font-extrabold text-xs text-foreground tabular-nums">
                                {review.rating.toFixed(1)}
                              </span>
                              <span aria-hidden="true" className="text-border">
                                ·
                              </span>
                              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                                {RATING_LABELS[Math.round(review.rating)]
                                  ?.title || 'Verified Work'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs">
                              <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Verified Work Order
                              </span>
                              <span aria-hidden="true" className="text-border">
                                ·
                              </span>
                              <Link
                                href={`/find-booking?id=${encodeURIComponent(review.bookingId)}`}
                                className="font-mono text-[11px] font-bold text-primary hover:underline"
                              >
                                {review.bookingId}
                              </Link>
                            </div>
                          </div>

                          {/* Review Headline & Comment */}
                          <div className="space-y-2">
                            <h3 className="font-display font-bold text-base text-foreground">
                              {review.headline}
                            </h3>
                            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                              &ldquo;{review.comment}&rdquo;
                            </p>
                          </div>

                          {/* 6-Category Star Breakdown Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-xl bg-muted/35 p-3 border border-border/60 text-[11px]">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-muted-foreground">
                                Workmanship
                              </span>
                              <span className="font-mono font-bold text-foreground tabular-nums">
                                ★ {review.metrics.workmanship}.0
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-muted-foreground">
                                Punctuality
                              </span>
                              <span className="font-mono font-bold text-foreground tabular-nums">
                                ★ {review.metrics.punctuality}.0
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-muted-foreground">
                                Pricing
                              </span>
                              <span className="font-mono font-bold text-foreground tabular-nums">
                                ★ {review.metrics.pricingTransparency}.0
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-muted-foreground">
                                Cleanliness
                              </span>
                              <span className="font-mono font-bold text-foreground tabular-nums">
                                ★ {review.metrics.siteCleanliness}.0
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-muted-foreground">
                                Courtesy
                              </span>
                              <span className="font-mono font-bold text-foreground tabular-nums">
                                ★ {courtesyVal}.0
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-muted-foreground">
                                Materials
                              </span>
                              <span className="font-mono font-bold text-foreground tabular-nums">
                                ★ {materialVal}.0
                              </span>
                            </div>
                          </div>

                          {/* Highlights */}
                          {review.highlights &&
                            review.highlights.length > 0 && (
                              <p className="text-[11px] text-muted-foreground">
                                <span className="font-semibold text-foreground">
                                  Work Highlights:{' '}
                                </span>
                                {review.highlights.join(' · ')}
                              </p>
                            )}
                        </div>

                        {/* Footer: Customer Metadata & Actions */}
                        <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs font-mono">
                              {review.customerName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-semibold text-xs text-foreground">
                                  {review.customerName}
                                </p>
                                <span
                                  aria-hidden="true"
                                  className="text-border"
                                >
                                  ·
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  {review.customerRole}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                <Wrench className="h-3 w-3 text-primary" />
                                <span>{review.serviceName}</span>
                                <span aria-hidden="true">·</span>
                                <MapPin className="h-3 w-3 text-primary" />
                                <span>{review.locality}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setCertificateReview(review)}
                              className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer"
                            >
                              <Award className="h-3 w-3 text-amber-500" />
                              <span>Certificate</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleEditReviewFromCard(review)}
                              className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer"
                            >
                              <PencilLine className="h-3 w-3 text-primary" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteReview(review)}
                              title="Remove this review"
                              className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Remove</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleHelpfulClick(review)}
                              className={cn(
                                'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer',
                                hasVoted
                                  ? 'border-primary/40 bg-primary/10 text-primary'
                                  : 'border-border/80 bg-background text-muted-foreground hover:text-foreground'
                              )}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span className="font-mono tabular-nums">
                                Helpful ({review.helpfulCount || 0})
                              </span>
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Support & Booking Banner */}
        <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-display font-bold text-base sm:text-lg text-foreground">
              Need a Plumbing Inspection or Emergency Pipe Repair?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Book online to receive your official{' '}
              <span className="font-mono text-foreground font-semibold">
                SP-
              </span>{' '}
              work order reference and experience our verified service standard.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Button
              asChild
              size="sm"
              className="h-10 text-xs font-semibold px-5 rounded-xl"
            >
              <Link href="/book">
                Book Service Online
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-10 text-xs font-semibold px-4 rounded-xl"
            >
              <a href={`tel:${businessInfo.phone}`}>
                <Phone className="mr-1.5 h-3.5 w-3.5" />
                Call {businessInfo.phoneDisplay}
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          PRINTABLE WORKMANSHIP & QUALITY VERIFICATION CERTIFICATE MODAL
         ===================================================================== */}
      <AnimatePresence>
        {certificateReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCertificateReview(null)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-label="Verified Workmanship Certificate"
              className="relative z-10 w-full max-w-xl rounded-3xl border border-amber-500/40 bg-card p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-start justify-between gap-4 border-b border-border/70 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
                      Sohan Pipeline&apos;s &amp; Plumbing
                    </p>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                      Verified Workmanship &amp; Quality Record
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCertificateReview(null)}
                  className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-2xl border border-border/80 bg-muted/25 p-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block">
                    Work Order Reference
                  </span>
                  <span className="font-mono font-bold text-sm text-primary">
                    {certificateReview.bookingId}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">
                    Overall Star Rating
                  </span>
                  <span className="font-mono font-bold text-sm text-amber-500">
                    ★ {certificateReview.rating.toFixed(1)} / 5.0 (
                    {RATING_LABELS[Math.round(certificateReview.rating)]?.badge})
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">
                    Client &amp; Locality
                  </span>
                  <span className="font-semibold text-foreground">
                    {certificateReview.customerName} ·{' '}
                    {certificateReview.locality}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">
                    Plumbing Service Performed
                  </span>
                  <span className="font-semibold text-foreground">
                    {certificateReview.serviceName}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  6-Category Craftsmanship Star Audit
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  {PILLAR_CONFIG.map((p) => {
                    const score =
                      certificateReview.metrics[p.key] ||
                      certificateReview.metrics.workmanship ||
                      certificateReview.rating;
                    return (
                      <div
                        key={p.key}
                        className="rounded-xl border border-border/70 bg-background p-2.5 flex items-center justify-between"
                      >
                        <span className="text-muted-foreground">
                          {p.shortLabel}
                        </span>
                        <span className="font-mono font-bold text-amber-500">
                          ★ {score}.0
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-background p-4 space-y-1.5">
                <p className="text-xs font-bold text-foreground">
                  {certificateReview.headline}
                </p>
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  &ldquo;{certificateReview.comment}&rdquo;
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/70">
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verified against official Sohan Pipelines dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="rounded-xl text-xs font-semibold"
                  >
                    <Printer className="mr-1.5 h-3.5 w-3.5" />
                    Print Record
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setCertificateReview(null)}
                    className="rounded-xl text-xs font-semibold"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <React.Suspense
      fallback={
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="h-96 rounded-3xl border border-border/60 bg-muted/20 animate-pulse" />
          </div>
        </section>
      }
    >
      <ReviewsWorkspaceContent />
    </React.Suspense>
  );
}
