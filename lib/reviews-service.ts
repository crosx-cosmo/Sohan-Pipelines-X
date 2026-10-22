import { supabase } from '@/lib/supabase';
import {
  getRecentLocalBookings,
  KNOWN_DATABASE_SERVICE_IDS,
  type LocalBooking,
} from '@/lib/booking-service';

export interface WorkBasisMetrics {
  workmanship: number; // 1 - 5: Pipe Fitting & Leak-Proof Craftsmanship
  punctuality: number; // 1 - 5: Rapid Dispatch & Punctuality
  pricingTransparency: number; // 1 - 5: Upfront Pricing & Billing Honesty
  siteCleanliness: number; // 1 - 5: Worksite Cleanliness & Property Care
  technicianCourtesy?: number; // 1 - 5: Technician Courtesy & Safety Conduct
  materialQuality?: number; // 1 - 5: Genuine Fittings & Tool Precision
}

export interface VerifiedWorkReview {
  id: string;
  bookingId: string;
  bookingUuid?: string | null;
  customerName: string;
  customerRole: string;
  locality: string;
  serviceName: string;
  bookingStatus: string;
  workDate: string;
  rating: number; // 1 - 5 overall
  metrics: WorkBasisMetrics;
  headline: string;
  comment: string;
  highlights: string[];
  wouldRecommend: boolean;
  helpfulCount: number;
  verifiedWorkOrder: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface VerifiableBookingRecord {
  bookingId: string;
  bookingUuid?: string | null;
  customerName: string;
  phoneMasked?: string;
  serviceId?: string | null;
  serviceName: string;
  urgency: string;
  status: string;
  preferredDate: string;
  preferredTimeSlot: string;
  locality: string;
  notes?: string | null;
  createdAt: string;
  source: 'dispatch' | 'local';
}

export interface ReviewAnalyticsSummary {
  totalReviews: number;
  averageRating: number;
  recommendationRate: number;
  starCounts: Record<1 | 2 | 3 | 4 | 5, number>;
  pillarAverages: Required<WorkBasisMetrics>;
  topHighlights: Array<{ label: string; count: number }>;
}

export const WORK_HIGHLIGHT_OPTIONS = [
  'Leak-Free Precision',
  'On-Time Arrival',
  'Transparent Pricing',
  'Clean Worksite Post-Job',
  'Genuine Spare Parts Used',
  'Fast Emergency Response',
  'Polite & Licensed Technician',
  'Durable Pipe Fitting',
] as const;

export const WORK_EXPERIENCE_TEMPLATES: Array<{
  id: string;
  label: string;
  headline: string;
  snippet: string;
  highlights: string[];
}> = [
  {
    id: 'leak-repair',
    label: 'Concealed Leak & Pipe Repair',
    headline: 'Pinpoint leak detection and zero-drip concealed pipe repair',
    snippet:
      'The technician arrived on schedule, identified the concealed pipeline leak without unnecessary wall breakage, and pressure-tested all new joints thoroughly.',
    highlights: ['Leak-Free Precision', 'On-Time Arrival', 'Clean Worksite Post-Job'],
  },
  {
    id: 'tank-pump',
    label: 'Water Tank & Motor Line',
    headline: 'Heavy-duty overhead tank & pressure pump manifold installation',
    snippet:
      'Installed our overhead storage tank connections, non-return brass valves, and motor line with neat alignment and steady water pressure across all floors.',
    highlights: ['Durable Pipe Fitting', 'Genuine Spare Parts Used', 'Transparent Pricing'],
  },
  {
    id: 'bathroom-sanitary',
    label: 'Bathroom & Sanitary Fitting',
    headline: 'Precision concealed diverter and sanitaryware installation',
    snippet:
      'All bathroom mixers, concealed diverters, and drainage traps were fitted with exact level alignment. The worksite was left spotless after testing.',
    highlights: ['Leak-Free Precision', 'Polite & Licensed Technician', 'Clean Worksite Post-Job'],
  },
  {
    id: 'emergency-response',
    label: 'Rapid Emergency Fix',
    headline: 'Fast emergency dispatch that stopped an active main line burst',
    snippet:
      'Responded rapidly to our urgent call, isolated the burst line immediately, and replaced the damaged fitting with genuine heavy-duty hardware at fair rates.',
    highlights: ['Fast Emergency Response', 'Genuine Spare Parts Used', 'Transparent Pricing'],
  },
];

const LOCAL_STORAGE_REVIEWS_KEY = 'sohan_verified_work_reviews_v2';
const LEGACY_STORAGE_KEYS = [
  'sohan_verified_work_reviews_v1',
  'sohan_pipelines_verified_reviews_v1',
];
const LOCAL_STORAGE_HELPFUL_VOTES_KEY = 'sohan_review_helpful_votes_v2';

function isLegacyDummyReviewRecord(r?: Partial<VerifiedWorkReview> | null): boolean {
  if (!r) return true;
  if (
    r.bookingId?.trim().toUpperCase() === 'SP-20261014-054E7D' &&
    (r.customerName?.trim().toLowerCase() === 'subhajit jana' ||
      (r.headline || '')
        .trim()
        .toLowerCase()
        .includes('heavy-duty overhead tank & pressure pump manifold installation'))
  ) {
    return true;
  }
  return false;
}

// Reverse lookup map from known service UUIDs -> readable service title
const UUID_TO_SERVICE_NAME: Record<string, string> = {
  'ed23cd6c-cdcf-4087-894a-eab97037b723': 'Leak Detection & Pipe Repair',
  [KNOWN_DATABASE_SERVICE_IDS.PIPE_FITTING]: 'Pipe Fitting & Repair',
  [KNOWN_DATABASE_SERVICE_IDS.WATER_TANK]: 'Water Tank & Motor Installation',
  [KNOWN_DATABASE_SERVICE_IDS.DRAINAGE_CLEANING]: 'Drainage & Sewer Cleaning',
  [KNOWN_DATABASE_SERVICE_IDS.WATERPROOFING]: 'Leak Detection & Waterproofing',
};

export function normalizeServiceDisplayName(rawName?: string | null): string {
  const clean = (rawName || '').trim();
  if (!clean) return 'Plumbing & Pipeline Service';
  const lower = clean.toLowerCase();
  if (lower === 'watar tank' || lower === 'water tank') {
    return 'Water Tank & Pipeline Installation';
  }
  if (lower === 'pipe fitting') {
    return 'Pipe Fitting & Joint Repair';
  }
  return clean;
}

let cachedServiceMap: Record<string, string> | null = null;

async function getServiceIdToNameMap(): Promise<Record<string, string>> {
  if (cachedServiceMap) return cachedServiceMap;
  const map: Record<string, string> = { ...UUID_TO_SERVICE_NAME };
  try {
    const { data } = await supabase.from('services').select('id, name');
    if (Array.isArray(data)) {
      for (const row of data) {
        if (row?.id && row?.name) {
          map[String(row.id)] = normalizeServiceDisplayName(String(row.name));
        }
      }
    }
  } catch {
    // Use fallback map if offline
  }
  cachedServiceMap = map;
  return map;
}

function maskPhoneNumber(rawPhone?: string | null): string {
  if (!rawPhone) return 'Verified Client';
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.length < 4) return 'Verified Client';
  const last4 = digits.slice(-4);
  return `+91 ••••• •${last4}`;
}

function mapLocalBookingToVerifiable(b: LocalBooking): VerifiableBookingRecord {
  return {
    bookingId: b.bookingId,
    bookingUuid: b.id || null,
    customerName:
      b.customerName && b.customerName !== 'Valued Customer'
        ? b.customerName
        : 'Registered Client',
    phoneMasked: maskPhoneNumber(b.phone),
    serviceId: null,
    serviceName: normalizeServiceDisplayName(b.serviceName),
    urgency: b.urgency || 'normal',
    status: b.status || 'Confirmed',
    preferredDate:
      b.preferredDate ||
      new Date(b.createdAt || Date.now()).toISOString().slice(0, 10),
    preferredTimeSlot: b.preferredTimeSlot || '10:00 AM - 01:00 PM',
    locality:
      b.area ||
      (b.address
        ? b.address.split(',').slice(-1)[0]?.trim() || 'Midnapore'
        : 'Midnapore'),
    notes: b.notes || null,
    createdAt: b.createdAt,
    source: 'local',
  };
}

function normalizeReviewRecord(r: VerifiedWorkReview): VerifiedWorkReview {
  const baseRating = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
  const m = r.metrics || {
    workmanship: baseRating,
    punctuality: baseRating,
    pricingTransparency: baseRating,
    siteCleanliness: baseRating,
  };
  return {
    ...r,
    bookingId: (r.bookingId || '').trim().toUpperCase(),
    serviceName: normalizeServiceDisplayName(r.serviceName),
    customerName:
      r.customerName && r.customerName !== 'Valued Customer'
        ? r.customerName
        : 'Verified Client',
    rating: baseRating,
    metrics: {
      workmanship: Number(m.workmanship) || baseRating,
      punctuality: Number(m.punctuality) || baseRating,
      pricingTransparency: Number(m.pricingTransparency) || baseRating,
      siteCleanliness: Number(m.siteCleanliness) || baseRating,
      technicianCourtesy: Number(m.technicianCourtesy ?? m.workmanship) || baseRating,
      materialQuality: Number(m.materialQuality ?? m.workmanship) || baseRating,
    },
  };
}

function readClientReviewsCache(): VerifiedWorkReview[] {
  if (typeof window === 'undefined') return [];
  try {
    for (const oldKey of LEGACY_STORAGE_KEYS) {
      window.localStorage.removeItem(oldKey);
    }
    const raw = window.localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed
          .filter((item) => !isLegacyDummyReviewRecord(item))
          .map(normalizeReviewRecord)
      : [];
  } catch {
    return [];
  }
}

function writeClientReviewsCache(reviews: VerifiedWorkReview[]): void {
  if (typeof window === 'undefined') return;
  try {
    for (const oldKey of LEGACY_STORAGE_KEYS) {
      window.localStorage.removeItem(oldKey);
    }
    window.localStorage.setItem(
      LOCAL_STORAGE_REVIEWS_KEY,
      JSON.stringify(
        reviews
          .filter((item) => !isLegacyDummyReviewRecord(item))
          .map(normalizeReviewRecord)
      )
    );
  } catch {
    // Ignore storage quota errors
  }
}

function mergeReviewsById(
  ...lists: VerifiedWorkReview[][]
): VerifiedWorkReview[] {
  const byKey = new Map<string, VerifiedWorkReview>();

  for (const list of lists) {
    for (const rawItem of list) {
      if (!rawItem || !rawItem.bookingId) continue;
      const item = normalizeReviewRecord(rawItem);
      const normalizedBookingId = item.bookingId.trim().toUpperCase();
      const existing = byKey.get(normalizedBookingId);
      if (!existing) {
        byKey.set(normalizedBookingId, {
          ...item,
          bookingId: normalizedBookingId,
        });
      } else {
        const existingTime = new Date(
          existing.updatedAt || existing.createdAt
        ).getTime();
        const candidateTime = new Date(
          item.updatedAt || item.createdAt
        ).getTime();
        if (candidateTime >= existingTime) {
          byKey.set(normalizedBookingId, {
            ...item,
            bookingId: normalizedBookingId,
            helpfulCount: Math.max(
              existing.helpfulCount || 0,
              item.helpfulCount || 0
            ),
          });
        }
      }
    }
  }

  return Array.from(byKey.values()).sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Searches real work bookings so customers can follow:
 * Step 1: Give Booking Details -> Step 2: Choose Your Booking -> Step 3: Give Review
 */
export async function searchBookingsForReview(params: {
  bookingQuery?: string;
  phoneQuery?: string;
}): Promise<{
  bookings: VerifiableBookingRecord[];
  error: string | null;
}> {
  const rawBookingQuery = (params.bookingQuery || '').trim().toUpperCase();
  const rawPhoneDigits = (params.phoneQuery || '').replace(/\D/g, '');
  const normalizedPhone10 =
    rawPhoneDigits.length > 10 ? rawPhoneDigits.slice(-10) : rawPhoneDigits;

  const resultsMap = new Map<string, VerifiableBookingRecord>();
  const serviceMap = await getServiceIdToNameMap();

  // 1. If both Booking ID and 10-digit Phone are provided, try the `find_booking` RPC first
  if (rawBookingQuery && normalizedPhone10.length === 10) {
    try {
      const { data: rpcData } = await supabase.rpc('find_booking', {
        p_booking_id: rawBookingQuery,
        p_phone: normalizedPhone10,
      });

      const row = Array.isArray(rpcData) ? rpcData[0] : rpcData;
      if (row && (row.booking_id || row.bookingId)) {
        const bId = String(row.booking_id ?? row.bookingId).toUpperCase();
        resultsMap.set(bId, {
          bookingId: bId,
          bookingUuid: row.id ? String(row.id) : null,
          customerName: String(
            row.customer_name ?? row.customerName ?? 'Registered Client'
          ),
          phoneMasked: maskPhoneNumber(normalizedPhone10),
          serviceId: row.service_id ? String(row.service_id) : null,
          serviceName: normalizeServiceDisplayName(
            String(
              row.service_name ??
                row.serviceName ??
                (row.service_id ? serviceMap[String(row.service_id)] : null) ??
                'Plumbing Service & Repair'
            )
          ),
          urgency: String(row.urgency ?? 'normal'),
          status: String(row.status ?? 'Confirmed'),
          preferredDate: String(
            row.preferred_date ?? row.preferredDate ?? new Date().toISOString()
          ),
          preferredTimeSlot: String(
            row.preferred_time_slot ??
              row.preferredTimeSlot ??
              '10:00 AM - 01:00 PM'
          ),
          locality: 'Midnapore',
          notes: row.notes ? String(row.notes) : null,
          createdAt: String(
            row.created_at ?? row.createdAt ?? new Date().toISOString()
          ),
          source: 'dispatch',
        });
      }
    } catch {
      // Continue to direct table query
    }
  }

  // 2. Query active/completed work orders from `public.bookings`
  try {
    let query = supabase
      .from('bookings')
      .select(
        'id, booking_id, customer_id, service_id, urgency, status, preferred_date, preferred_time_slot, notes, created_at'
      )
      .order('created_at', { ascending: false })
      .limit(25);

    if (rawBookingQuery) {
      query = query.ilike('booking_id', `%${rawBookingQuery}%`);
    }

    const { data: dbBookings } = await query;

    if (Array.isArray(dbBookings) && dbBookings.length > 0) {
      // Optionally enrich with booking_locations if readable
      const locationByBookingUuid: Record<string, string> = {};
      try {
        const bookingUuids = dbBookings
          .map((b) => (b?.id ? String(b.id) : ''))
          .filter(Boolean);
        if (bookingUuids.length > 0) {
          const { data: locRows } = await supabase
            .from('booking_locations')
            .select('booking_id, city, formatted_address')
            .in('booking_id', bookingUuids);
          if (Array.isArray(locRows)) {
            for (const loc of locRows) {
              if (loc?.booking_id) {
                const areaText =
                  loc.city ||
                  (loc.formatted_address
                    ? String(loc.formatted_address)
                        .split(',')
                        .slice(-1)[0]
                        ?.trim()
                    : '');
                if (areaText) {
                  locationByBookingUuid[String(loc.booking_id)] = String(areaText);
                }
              }
            }
          }
        }
      } catch {
        // Ignore location enrichment errors
      }

      for (const row of dbBookings) {
        if (!row?.booking_id) continue;
        const bId = String(row.booking_id).toUpperCase();
        if (resultsMap.has(bId)) continue;

        const resolvedServiceName = normalizeServiceDisplayName(
          (row.service_id && serviceMap[String(row.service_id)]) ||
            'Plumbing & Pipeline Service'
        );

        const rowUuid = row.id ? String(row.id) : '';

        resultsMap.set(bId, {
          bookingId: bId,
          bookingUuid: rowUuid || null,
          customerName: 'Registered Client',
          phoneMasked: normalizedPhone10
            ? maskPhoneNumber(normalizedPhone10)
            : 'Verified Work Order',
          serviceId: row.service_id ? String(row.service_id) : null,
          serviceName: resolvedServiceName,
          urgency: String(row.urgency || 'normal'),
          status: String(row.status || 'Confirmed'),
          preferredDate: String(
            row.preferred_date || row.created_at || new Date().toISOString()
          ),
          preferredTimeSlot: String(
            row.preferred_time_slot || '10:00 AM - 01:00 PM'
          ),
          locality:
            (rowUuid && locationByBookingUuid[rowUuid]) ||
            'Midnapore & South Bengal',
          notes: row.notes ? String(row.notes) : null,
          createdAt: String(row.created_at || new Date().toISOString()),
          source: 'dispatch',
        });
      }
    }
  } catch {
    // Ignore direct table errors and check local bookings
  }

  // 3. Check local bookings stored in browser
  try {
    const localBookings = getRecentLocalBookings();
    for (const lb of localBookings) {
      const bId = lb.bookingId.toUpperCase();
      const lbPhoneDigits = (lb.phone || '').replace(/\D/g, '');
      const lbPhone10 =
        lbPhoneDigits.length > 10 ? lbPhoneDigits.slice(-10) : lbPhoneDigits;

      const matchesBookingId =
        !rawBookingQuery ||
        bId.includes(rawBookingQuery) ||
        lb.customerName.toUpperCase().includes(rawBookingQuery) ||
        lb.serviceName.toUpperCase().includes(rawBookingQuery);

      const matchesPhone =
        !normalizedPhone10 ||
        lbPhone10.includes(normalizedPhone10) ||
        lbPhoneDigits.includes(rawPhoneDigits);

      if (matchesBookingId && matchesPhone) {
        const mapped = mapLocalBookingToVerifiable(lb);
        const existing = resultsMap.get(bId);
        if (existing) {
          resultsMap.set(bId, {
            ...existing,
            customerName:
              lb.customerName &&
              lb.customerName !== 'Verified Booking Holder' &&
              lb.customerName !== 'Registered Client' &&
              lb.customerName !== 'Valued Customer'
                ? lb.customerName
                : existing.customerName,
            phoneMasked: lb.phone
              ? maskPhoneNumber(lb.phone)
              : existing.phoneMasked,
            serviceName: normalizeServiceDisplayName(
              lb.serviceName || existing.serviceName
            ),
            locality: mapped.locality || existing.locality,
          });
        } else {
          resultsMap.set(bId, mapped);
        }
      }
    }
  } catch {
    // Ignore local storage errors
  }

  // 4. Also enrich booking customerName / locality from already-submitted verified reviews
  try {
    const cachedReviews = readClientReviewsCache();
    for (const rev of cachedReviews) {
      const bId = rev.bookingId.toUpperCase();
      const existing = resultsMap.get(bId);
      if (existing) {
        resultsMap.set(bId, {
          ...existing,
          customerName:
            rev.customerName &&
            rev.customerName !== 'Registered Client' &&
            rev.customerName !== 'Valued Customer'
              ? rev.customerName
              : existing.customerName,
          locality:
            rev.locality && rev.locality !== 'Midnapore & South Bengal'
              ? rev.locality
              : existing.locality,
          serviceName: normalizeServiceDisplayName(
            rev.serviceName || existing.serviceName
          ),
        });
      }
    }
  } catch {
    // Ignore enrichment error
  }

  const finalBookings = Array.from(resultsMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    bookings: finalBookings,
    error: null,
  };
}

/**
 * Fetches all verified work-basis reviews.
 */
export async function fetchVerifiedReviews(): Promise<{
  reviews: VerifiedWorkReview[];
  error: string | null;
}> {
  const clientCached = readClientReviewsCache();
  let apiReviews: VerifiedWorkReview[] = [];
  let supabaseReviews: VerifiedWorkReview[] = [];

  // 1. Fetch from server API route
  try {
    const res = await fetch('/api/reviews', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (res.ok) {
      const payload = await res.json();
      if (Array.isArray(payload?.reviews)) {
        apiReviews = payload.reviews.map(normalizeReviewRecord);
      }
    }
  } catch {
    // Fallback to client cache if offline
  }

  // 2. Check optional `public.reviews` table if configured
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (!error && Array.isArray(data)) {
      supabaseReviews = data.map((row: Record<string, unknown>) => {
        const baseRating = Number(row.rating) || 5;
        const rawMetrics = (row.metrics as Record<string, unknown>) || {};
        return normalizeReviewRecord({
          id: String(row.id || `rev-${row.booking_id}`),
          bookingId: String(row.booking_id || '').toUpperCase(),
          bookingUuid: row.booking_uuid ? String(row.booking_uuid) : null,
          customerName: String(row.customer_name || 'Registered Client'),
          customerRole: String(row.customer_role || 'Homeowner'),
          locality: String(row.locality || 'Midnapore'),
          serviceName: normalizeServiceDisplayName(
            String(row.service_name || 'Plumbing Service')
          ),
          bookingStatus: String(row.booking_status || 'Completed'),
          workDate: String(
            row.work_date || row.created_at || new Date().toISOString()
          ),
          rating: baseRating,
          metrics: {
            workmanship: Number(
              rawMetrics.workmanship ?? row.workmanship ?? baseRating
            ),
            punctuality: Number(
              rawMetrics.punctuality ?? row.punctuality ?? baseRating
            ),
            pricingTransparency: Number(
              rawMetrics.pricingTransparency ??
                row.pricing_transparency ??
                baseRating
            ),
            siteCleanliness: Number(
              rawMetrics.siteCleanliness ?? row.site_cleanliness ?? baseRating
            ),
            technicianCourtesy: Number(
              rawMetrics.technicianCourtesy ??
                row.technician_courtesy ??
                baseRating
            ),
            materialQuality: Number(
              rawMetrics.materialQuality ?? row.material_quality ?? baseRating
            ),
          },
          headline: String(row.headline || 'Verified Plumbing Work'),
          comment: String(row.comment || ''),
          highlights: Array.isArray(row.highlights)
            ? row.highlights.map(String)
            : [],
          wouldRecommend:
            typeof row.would_recommend === 'boolean'
              ? row.would_recommend
              : true,
          helpfulCount: Number(row.helpful_count) || 0,
          verifiedWorkOrder: true,
          createdAt: String(row.created_at || new Date().toISOString()),
          updatedAt: row.updated_at ? String(row.updated_at) : undefined,
        });
      });
    }
  } catch {
    // Table is optional
  }

  const merged = mergeReviewsById(apiReviews, supabaseReviews, clientCached);
  writeClientReviewsCache(merged);

  return {
    reviews: merged,
    error: null,
  };
}

export interface SubmitWorkReviewInput {
  booking: VerifiableBookingRecord;
  customerName: string;
  customerRole: string;
  locality: string;
  serviceName: string;
  rating: number;
  metrics: WorkBasisMetrics;
  headline: string;
  comment: string;
  highlights: string[];
  wouldRecommend: boolean;
}

/**
 * Submits or updates a verified work-basis review tied to a real booking.
 */
export async function submitVerifiedWorkReview(
  input: SubmitWorkReviewInput
): Promise<{
  review: VerifiedWorkReview | null;
  error: string | null;
}> {
  const normalizedBookingId = input.booking.bookingId.trim().toUpperCase();
  if (!normalizedBookingId) {
    return {
      review: null,
      error: 'A valid Booking ID is required to submit a verified work review.',
    };
  }

  const nowIso = new Date().toISOString();
  const clampStar = (val?: number) =>
    Math.min(5, Math.max(1, Math.round(Number(val) || 5)));

  const reviewRecord: VerifiedWorkReview = {
    id: `rev-${normalizedBookingId.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    bookingId: normalizedBookingId,
    bookingUuid: input.booking.bookingUuid || null,
    customerName: input.customerName.trim(),
    customerRole: input.customerRole.trim() || 'Homeowner',
    locality: input.locality.trim() || 'Midnapore',
    serviceName: normalizeServiceDisplayName(
      input.serviceName.trim() ||
        input.booking.serviceName ||
        'Plumbing & Pipeline Service'
    ),
    bookingStatus: input.booking.status || 'Completed',
    workDate: input.booking.preferredDate || nowIso,
    rating: clampStar(input.rating),
    metrics: {
      workmanship: clampStar(input.metrics.workmanship),
      punctuality: clampStar(input.metrics.punctuality),
      pricingTransparency: clampStar(input.metrics.pricingTransparency),
      siteCleanliness: clampStar(input.metrics.siteCleanliness),
      technicianCourtesy: clampStar(
        input.metrics.technicianCourtesy ?? input.metrics.workmanship
      ),
      materialQuality: clampStar(
        input.metrics.materialQuality ?? input.metrics.workmanship
      ),
    },
    headline: input.headline.trim(),
    comment: input.comment.trim(),
    highlights: input.highlights,
    wouldRecommend: input.wouldRecommend,
    helpfulCount: 0,
    verifiedWorkOrder: true,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  // 1. Save to server API store (`/api/reviews`)
  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review: reviewRecord }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.review) {
        reviewRecord.id = data.review.id || reviewRecord.id;
        reviewRecord.createdAt =
          data.review.createdAt || reviewRecord.createdAt;
        reviewRecord.helpfulCount =
          typeof data.review.helpfulCount === 'number'
            ? data.review.helpfulCount
            : reviewRecord.helpfulCount;
      }
    }
  } catch {
    // Continue and persist in local storage as fallback
  }

  // 2. Best-effort mirror to `public.reviews` if table exists
  try {
    await supabase.from('reviews').upsert(
      {
        booking_id: reviewRecord.bookingId,
        booking_uuid: reviewRecord.bookingUuid,
        customer_name: reviewRecord.customerName,
        customer_role: reviewRecord.customerRole,
        locality: reviewRecord.locality,
        service_name: reviewRecord.serviceName,
        booking_status: reviewRecord.bookingStatus,
        work_date: reviewRecord.workDate,
        rating: reviewRecord.rating,
        metrics: reviewRecord.metrics,
        headline: reviewRecord.headline,
        comment: reviewRecord.comment,
        highlights: reviewRecord.highlights,
        would_recommend: reviewRecord.wouldRecommend,
        helpful_count: reviewRecord.helpfulCount,
        updated_at: nowIso,
      },
      { onConflict: 'booking_id' }
    );
  } catch {
    // Ignore if optional table is not yet created
  }

  // 3. Update client cache immediately
  const existing = readClientReviewsCache();
  const merged = mergeReviewsById([reviewRecord], existing);
  writeClientReviewsCache(merged);

  return {
    review: reviewRecord,
    error: null,
  };
}

/**
 * Increments the helpful count on a verified review (once per browser session per review).
 */
export async function markReviewHelpful(reviewId: string): Promise<{
  helpfulCount: number;
  alreadyVoted: boolean;
}> {
  let votedMap: Record<string, boolean> = {};
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_HELPFUL_VOTES_KEY);
      if (raw) votedMap = JSON.parse(raw);
    } catch {
      votedMap = {};
    }
  }

  const cached = readClientReviewsCache();
  const target = cached.find(
    (r) => r.id === reviewId || r.bookingId === reviewId
  );

  if (votedMap[reviewId]) {
    return {
      helpfulCount: target?.helpfulCount ?? 1,
      alreadyVoted: true,
    };
  }

  const nextCount = (target?.helpfulCount ?? 0) + 1;
  votedMap[reviewId] = true;

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(
        LOCAL_STORAGE_HELPFUL_VOTES_KEY,
        JSON.stringify(votedMap)
      );
    } catch {
      // Ignore storage error
    }
  }

  if (target) {
    target.helpfulCount = nextCount;
    writeClientReviewsCache(cached);
  }

  try {
    await fetch('/api/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: reviewId }),
    });
  } catch {
    // Ignore network error
  }

  return {
    helpfulCount: nextCount,
    alreadyVoted: false,
  };
}

export function hasVotedReviewHelpful(reviewId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_HELPFUL_VOTES_KEY);
    if (!raw) return false;
    const map = JSON.parse(raw);
    return Boolean(map?.[reviewId]);
  } catch {
    return false;
  }
}

/**
 * Deletes a review by ID or Booking ID from server storage and local cache.
 */
export async function deleteVerifiedWorkReview(
  reviewIdOrBookingId: string
): Promise<{ success: boolean }> {
  const target = reviewIdOrBookingId.trim();
  if (!target) return { success: false };

  const cached = readClientReviewsCache().filter(
    (r) =>
      r.id !== target &&
      r.bookingId.toUpperCase() !== target.toUpperCase()
  );
  writeClientReviewsCache(cached);

  try {
    await fetch(`/api/reviews?id=${encodeURIComponent(target)}`, {
      method: 'DELETE',
    });
  } catch {
    // Ignore network error
  }

  return { success: true };
}

/**
 * Computes real-time quality analytics exclusively from verified work reviews.
 */
export function computeReviewAnalytics(
  reviews: VerifiedWorkReview[]
): ReviewAnalyticsSummary {
  const starCounts: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  if (!reviews.length) {
    return {
      totalReviews: 0,
      averageRating: 0,
      recommendationRate: 0,
      starCounts,
      pillarAverages: {
        workmanship: 0,
        punctuality: 0,
        pricingTransparency: 0,
        siteCleanliness: 0,
        technicianCourtesy: 0,
        materialQuality: 0,
      },
      topHighlights: [],
    };
  }

  let ratingSum = 0;
  let recommendCount = 0;
  let workmanshipSum = 0;
  let punctualitySum = 0;
  let pricingSum = 0;
  let cleanlinessSum = 0;
  let courtesySum = 0;
  let materialSum = 0;
  const highlightMap = new Map<string, number>();

  for (const r of reviews) {
    const clamped = Math.min(5, Math.max(1, Math.round(r.rating || 5))) as
      | 1
      | 2
      | 3
      | 4
      | 5;
    starCounts[clamped] += 1;
    ratingSum += r.rating || 5;
    if (r.wouldRecommend !== false) recommendCount += 1;

    const w = r.metrics?.workmanship || r.rating || 5;
    const p = r.metrics?.punctuality || r.rating || 5;
    const pr = r.metrics?.pricingTransparency || r.rating || 5;
    const sc = r.metrics?.siteCleanliness || r.rating || 5;
    const tc = r.metrics?.technicianCourtesy || w || r.rating || 5;
    const mq = r.metrics?.materialQuality || w || r.rating || 5;

    workmanshipSum += w;
    punctualitySum += p;
    pricingSum += pr;
    cleanlinessSum += sc;
    courtesySum += tc;
    materialSum += mq;

    if (Array.isArray(r.highlights)) {
      for (const h of r.highlights) {
        if (!h) continue;
        highlightMap.set(h, (highlightMap.get(h) || 0) + 1);
      }
    }
  }

  const total = reviews.length;
  const topHighlights = Array.from(highlightMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    totalReviews: total,
    averageRating: Number((ratingSum / total).toFixed(2)),
    recommendationRate: Math.round((recommendCount / total) * 100),
    starCounts,
    pillarAverages: {
      workmanship: Number((workmanshipSum / total).toFixed(1)),
      punctuality: Number((punctualitySum / total).toFixed(1)),
      pricingTransparency: Number((pricingSum / total).toFixed(1)),
      siteCleanliness: Number((cleanlinessSum / total).toFixed(1)),
      technicianCourtesy: Number((courtesySum / total).toFixed(1)),
      materialQuality: Number((materialSum / total).toFixed(1)),
    },
    topHighlights,
  };
}
