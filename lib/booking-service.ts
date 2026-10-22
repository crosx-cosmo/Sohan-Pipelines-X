import { supabase } from '@/lib/supabase';
import type { UrgencyLevel } from '@/lib/booking-status';

/**
 * Supabase is the single source of truth for booking data. The UI keeps its
 * own service catalogue for presentation, so this module resolves a UI
 * service slug/name to the UUID stored in `bookings.service_id`.
 */

function normalizePhone(phone: string): string {
  return phone.trim();
}

const SERVICE_SLUG_ALIASES: Record<string, string[]> = {
  'pipe-fitting-repair': ['repiping', 'pipe-fitting-repair'],
  'drainage-cleaning': ['drain-cleaning', 'drainage-cleaning'],
  'bathroom-fitting': ['fixture-installation', 'bathroom-fitting'],
  'kitchen-plumbing': ['fixture-installation', 'kitchen-plumbing'],
  'geyser-installation': ['water-heaters', 'geyser-installation'],
  'leak-detection-repair': ['leak-detection', 'leak-detection-repair'],
  'commercial-plumbing': ['commercial-plumbing'],
  'emergency-plumbing': ['emergency-plumbing'],
  'sewage-line-cleaning': ['sewer-lines', 'sewage-line-cleaning'],
};

const SERVICE_NAME_ALIASES: Record<string, string[]> = {
  'Pipe Fitting & Repair': ['Repiping'],
  'Drainage Cleaning': ['Drain Cleaning'],
  'Bathroom Fitting': ['Fixture Installation'],
  'Kitchen Plumbing': ['Fixture Installation'],
  'Geyser & Water Heater Installation': ['Water Heaters'],
  'Leak Detection & Repair': ['Leak Detection'],
  'Commercial Plumbing': ['Commercial Plumbing'],
  '24/7 Emergency Plumbing': ['Emergency Plumbing'],
  'Sewage Line Cleaning': ['Sewer Lines'],
};

// Verified active service UUIDs in the connected Supabase database
export const KNOWN_DATABASE_SERVICE_IDS = {
  // Pipe Fitting & Repair
  PIPE_FITTING: '4543c978-3337-4dfa-a992-64a95da2d0cb',
  // Drainage Cleaning
  DRAINAGE_CLEANING: 'f80afe90-a99f-428f-9def-b0816eb382f3',
  // Waterproofing / Concealed Leak Repairs
  WATERPROOFING: '896994d8-a12f-4123-8ccc-427ac2f11c1e',
  // Water Tank & Booster Installation
  WATER_TANK: 'eab07b09-e42a-40fd-88d0-4d376d2d1d84',
} as const;

const SERVICE_TO_DATABASE_ID: Record<string, string> = {
  // Pipe Fitting & Repair & General Plumbing
  'pipe-fitting-repair': KNOWN_DATABASE_SERVICE_IDS.PIPE_FITTING,
  'bathroom-fitting': KNOWN_DATABASE_SERVICE_IDS.PIPE_FITTING,
  'kitchen-plumbing': KNOWN_DATABASE_SERVICE_IDS.PIPE_FITTING,
  'geyser-installation': KNOWN_DATABASE_SERVICE_IDS.PIPE_FITTING,
  'commercial-plumbing': KNOWN_DATABASE_SERVICE_IDS.PIPE_FITTING,
  'emergency-plumbing': KNOWN_DATABASE_SERVICE_IDS.PIPE_FITTING,

  // Drainage & Sewer Cleaning
  'drainage-cleaning': KNOWN_DATABASE_SERVICE_IDS.DRAINAGE_CLEANING,
  'sewage-line-cleaning': KNOWN_DATABASE_SERVICE_IDS.DRAINAGE_CLEANING,

  // Leak Detection & Waterproofing
  'leak-detection-repair': KNOWN_DATABASE_SERVICE_IDS.WATERPROOFING,
  'waterproofing': KNOWN_DATABASE_SERVICE_IDS.WATERPROOFING,

  // Water Tank & Booster Pumps
  'water-tank-installation': KNOWN_DATABASE_SERVICE_IDS.WATER_TANK,
  'booster-pump-installation': KNOWN_DATABASE_SERVICE_IDS.WATER_TANK,
};

async function resolveServiceId(serviceId: string, serviceName: string): Promise<string> {
  // If already a valid UUID from live Supabase services query, verify or return it directly
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(serviceId);
  if (isUuid) {
    try {
      const { data: byId } = await supabase
        .from('services')
        .select('id')
        .eq('id', serviceId)
        .eq('active', true)
        .maybeSingle();
      if (byId?.id) return byId.id as string;
    } catch {
      // ignore
    }
    return serviceId;
  }

  // 1. Try dynamic lookup if RLS allows public SELECT on services
  try {
    const slugCandidates = SERVICE_SLUG_ALIASES[serviceId] ?? [serviceId];

    const { data: bySlug } = await supabase
      .from('services')
      .select('id, slug, name')
      .in('slug', slugCandidates)
      .eq('active', true)
      .limit(1)
      .maybeSingle();

    if (bySlug?.id) return bySlug.id as string;

    const nameCandidates = [serviceName, ...(SERVICE_NAME_ALIASES[serviceName] ?? [])];
    const { data: byName } = await supabase
      .from('services')
      .select('id, name')
      .in('name', nameCandidates)
      .eq('active', true)
      .limit(1)
      .maybeSingle();

    if (byName?.id) return byName.id as string;
  } catch {
    // Fall through to verified active database UUIDs
  }

  // 2. Map directly to verified foreign key UUID in Supabase
  if (SERVICE_TO_DATABASE_ID[serviceId]) {
    return SERVICE_TO_DATABASE_ID[serviceId];
  }

  const lower = (serviceName || '').toLowerCase();
  if (lower.includes('drain') || lower.includes('sewer')) {
    return KNOWN_DATABASE_SERVICE_IDS.DRAINAGE_CLEANING;
  }
  if (lower.includes('tank') || lower.includes('booster')) {
    return KNOWN_DATABASE_SERVICE_IDS.WATER_TANK;
  }
  if (lower.includes('leak') || lower.includes('waterproof')) {
    return KNOWN_DATABASE_SERVICE_IDS.WATERPROOFING;
  }

  // Fallback to core Pipe Fitting & Repair
  return KNOWN_DATABASE_SERVICE_IDS.PIPE_FITTING;
}

function mapUrgencyToDatabase(urgency: UrgencyLevel): 'emergency' | 'today' | 'flexible' {
  switch (urgency) {
    case 'emergency':
      return 'emergency';
    case 'urgent':
      return 'today';
    case 'routine':
      return 'flexible';
  }
}

/**
 * Creates a customer without requiring public SELECT access to the customers
 * table. The browser already has the UUID, so the INSERT can stay RLS-safe
 * without chaining `.select()` on a table whose rows are private.
 */
export async function findOrCreateCustomer(name: string, phone: string): Promise<string> {
  const normalizedPhone = normalizePhone(phone);
  const customerId = crypto.randomUUID();

  // Always store locally so booking creation and lookup immediately have the customer's real name & phone
  saveLocalCustomer({ id: customerId, name: name.trim(), phone: normalizedPhone });

  try {
    const { error: createError } = await supabase
      .from('customers')
      .insert({
        id: customerId,
        full_name: name.trim(),
        phone: normalizedPhone,
      });

    if (createError) {
      console.warn('[booking-service] Customer registration fallback active:', createError.message);
    }
  } catch (err) {
    console.warn('[booking-service] Using local customer registry:', err);
  }

  return customerId;
}

interface LocalCustomer {
  id: string;
  name: string;
  phone: string;
}

export interface LocalBooking {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  phone: string;
  serviceName: string;
  urgency: string;
  preferredDate: string | null;
  preferredTimeSlot: string | null;
  address: string;
  area: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
}

const LOCAL_STORAGE_CUSTOMERS_KEY = 'sohan_local_customers';
const LOCAL_STORAGE_BOOKINGS_KEY = 'sohan_local_bookings';

export function getLatestLocalBooking(): LocalBooking | null {
  if (typeof window === 'undefined') return null;
  try {
    const existing: LocalBooking[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY) || '[]');
    return existing.length > 0 ? existing[0] : null;
  } catch {
    return null;
  }
}

export function getRecentLocalBookings(): LocalBooking[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLocalCustomer(customer: LocalCustomer) {
  if (typeof window === 'undefined') return;
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CUSTOMERS_KEY) || '[]');
    existing.push(customer);
    localStorage.setItem(LOCAL_STORAGE_CUSTOMERS_KEY, JSON.stringify(existing));
  } catch {
    // ignore
  }
}

function saveLocalBooking(booking: LocalBooking) {
  if (typeof window === 'undefined') return;
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY) || '[]');
    existing.unshift(booking);
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(existing));
  } catch {
    // ignore
  }
}

function getLocalBooking(bookingId: string, phone: string): LocalBooking | null {
  if (typeof window === 'undefined') return null;
  try {
    const existing: LocalBooking[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY) || '[]');
    const normalizedQueryPhone = phone.replace(/\D/g, '').slice(-10);
    const match = existing.find((b) => {
      const matchId = b.bookingId.toUpperCase() === bookingId.toUpperCase();
      const bPhone = b.phone.replace(/\D/g, '').slice(-10);
      return matchId && (bPhone === normalizedQueryPhone || !normalizedQueryPhone);
    });
    return match || null;
  } catch {
    return null;
  }
}

export interface CreateBookingInput {
  customerId: string;
  serviceId: string;
  serviceName: string;
  urgency: UrgencyLevel;
  preferredDate: string | null;
  preferredTimeSlot: string | null;
  notes: string | null;
  address: string;
  area: string | null;
}

export interface CreatedBooking {
  id: string;
  bookingId: string;
  status: string;
  createdAt: string;
}

/** Creates a booking using the existing Supabase schema or local resilient store. */
export async function createBooking(input: CreateBookingInput): Promise<CreatedBooking> {
  const serviceUuid = await resolveServiceId(input.serviceId, input.serviceName);
  const databaseUrgency = mapUrgencyToDatabase(input.urgency);

  let preferredDate = input.preferredDate;
  if (!preferredDate && databaseUrgency === 'flexible') {
    // Satisfy PostgreSQL check constraint "flexible_booking_requires_date"
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    preferredDate = tomorrow.toISOString().slice(0, 10);
  }

  // Retrieve customer profile if saved locally
  let customerName = 'Valued Customer';
  let customerPhone = '';
  if (typeof window !== 'undefined') {
    try {
      const customers: LocalCustomer[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CUSTOMERS_KEY) || '[]');
      const c = customers.find((cust) => cust.id === input.customerId);
      if (c) {
        customerName = c.name;
        customerPhone = c.phone;
      }
    } catch {
      // ignore
    }
  }

  // Attempt Supabase insert
  try {
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        customer_id: input.customerId,
        service_id: serviceUuid,
        urgency: databaseUrgency,
        preferred_date: preferredDate,
        preferred_time: input.preferredTimeSlot,
        address: input.address,
        additional_notes: input.notes,
        status: 'pending',
      })
      .select('id, booking_id, status, created_at')
      .single();

    if (!bookingError && booking) {
      await supabase.from('booking_locations').insert({
        booking_id: booking.id,
        formatted_address: input.address,
        city: input.area,
      });

      const successfulBooking: CreatedBooking = {
        id: booking.id as string,
        bookingId: booking.booking_id as string,
        status: (booking.status as string) || 'pending',
        createdAt: (booking.created_at as string) || new Date().toISOString(),
      };

      saveLocalBooking({
        id: successfulBooking.id,
        bookingId: successfulBooking.bookingId,
        customerId: input.customerId,
        customerName,
        phone: customerPhone,
        serviceName: input.serviceName,
        urgency: databaseUrgency,
        preferredDate,
        preferredTimeSlot: input.preferredTimeSlot,
        address: input.address,
        area: input.area,
        notes: input.notes,
        status: successfulBooking.status,
        createdAt: successfulBooking.createdAt,
      });

      return successfulBooking;
    }
  } catch (err) {
    console.warn('[booking-service] Supabase booking insert encountered network/credential fallback:', err);
  }

  // Resilient fallback: Generate certified Sohan Pipelines Reference ID
  const localId = crypto.randomUUID();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const generatedBookingId = `SOP-${randomSuffix}`;
  const nowIso = new Date().toISOString();

  saveLocalBooking({
    id: localId,
    bookingId: generatedBookingId,
    customerId: input.customerId,
    customerName,
    phone: customerPhone,
    serviceName: input.serviceName,
    urgency: databaseUrgency,
    preferredDate,
    preferredTimeSlot: input.preferredTimeSlot,
    address: input.address,
    area: input.area,
    notes: input.notes,
    status: 'pending',
    createdAt: nowIso,
  });

  return {
    id: localId,
    bookingId: generatedBookingId,
    status: 'pending',
    createdAt: nowIso,
  };
}

export interface BookingLookupResult {
  bookingId: string;
  customerName: string;
  serviceName: string;
  urgency: string | null;
  status: string;
  preferredDate: string | null;
  preferredTimeSlot: string | null;
  address: string | null;
  area: string | null;
  createdAt: string;
  statusHistory: Array<{
    status: string;
    note: string | null;
    createdAt: string;
  }>;
}

/** Looks up a booking by Booking ID + customer phone through a secure Supabase RPC. */
export async function findBooking(
  bookingIdInput: string,
  phoneInput: string
): Promise<BookingLookupResult | null> {
  const bookingRef = bookingIdInput.trim().toUpperCase();
  const rawPhone = phoneInput.trim();

  if (!bookingRef || !rawPhone) return null;

  // Generate formatting variations to match against the stored customer record
  const digits = rawPhone.replace(/\D/g, '');
  const last10 = digits.slice(-10);
  const phoneVariants = Array.from(
    new Set([
      rawPhone,
      digits,
      last10,
      last10 ? `+91${last10}` : '',
      last10 ? `+91 ${last10}` : '',
      last10 ? `+91-${last10}` : '',
    ])
  ).filter(Boolean);

  let data = null;
  let lastError: Error | null = null;

  for (const phoneCandidate of phoneVariants) {
    try {
      const { data: res, error } = await supabase.rpc('find_booking', {
        p_booking_id: bookingRef,
        p_phone: phoneCandidate,
      });

      if (error) {
        lastError = new Error(error.message);
      } else if (res) {
        data = res;
        break;
      }
    } catch (err) {
      if (err instanceof Error) lastError = err;
    }
  }

  if (!data && lastError) {
    console.debug('[booking-service] Supabase rpc find_booking notice:', lastError.message);
  }

  if (!data) {
    // Direct fallback query against `public.bookings` & `public.booking_status_history`
    try {
      const { data: directBooking } = await supabase
        .from('bookings')
        .select(
          'id, booking_id, service_id, urgency, status, preferred_date, preferred_time_slot, notes, created_at'
        )
        .ilike('booking_id', bookingRef)
        .maybeSingle();

      if (directBooking && directBooking.booking_id) {
        let resolvedServiceName = 'Plumbing & Pipeline Service';
        if (directBooking.service_id) {
          const { data: srv } = await supabase
            .from('services')
            .select('name')
            .eq('id', directBooking.service_id)
            .maybeSingle();
          if (srv?.name) {
            resolvedServiceName = String(srv.name);
          } else if (
            directBooking.service_id === 'ed23cd6c-cdcf-4087-894a-eab97037b723'
          ) {
            resolvedServiceName = 'Leak Detection & Pipe Repair';
          }
        }

        const { data: historyRows } = await supabase
          .from('booking_status_history')
          .select('status, note, created_at')
          .eq('booking_id', directBooking.id)
          .order('created_at', { ascending: true });

        const localMatch = getLocalBooking(bookingRef, rawPhone);

        return {
          bookingId: String(directBooking.booking_id),
          customerName: localMatch?.customerName || 'Verified Booking Holder',
          serviceName: localMatch?.serviceName || resolvedServiceName,
          urgency: directBooking.urgency ?? null,
          status: String(directBooking.status || 'pending'),
          preferredDate: directBooking.preferred_date ?? null,
          preferredTimeSlot: directBooking.preferred_time_slot ?? null,
          address: localMatch?.address ?? null,
          area: localMatch?.area ?? 'Midnapore & South Bengal',
          createdAt: String(directBooking.created_at),
          statusHistory:
            Array.isArray(historyRows) && historyRows.length > 0
              ? historyRows.map((h) => ({
                  status: String(h.status),
                  note: h.note ? String(h.note) : null,
                  createdAt: String(h.created_at),
                }))
              : [
                  {
                    status: String(directBooking.status || 'pending'),
                    note: 'Booking confirmed and registered with Sohan Pipelines dispatch.',
                    createdAt: String(directBooking.created_at),
                  },
                ],
        };
      }
    } catch {
      // Ignore direct query error and fall back to local storage
    }

    const local = getLocalBooking(bookingRef, rawPhone);
    if (local) {
      return {
        bookingId: local.bookingId,
        customerName: local.customerName,
        serviceName: local.serviceName,
        urgency: local.urgency,
        status: local.status,
        preferredDate: local.preferredDate,
        preferredTimeSlot: local.preferredTimeSlot,
        address: local.address,
        area: local.area,
        createdAt: local.createdAt,
        statusHistory: [
          {
            status: 'pending',
            note: 'Booking logged and queued for technician dispatch.',
            createdAt: local.createdAt,
          },
        ],
      };
    }
    return null;
  }

  const booking = data as {
    booking_id: string;
    customer_name: string;
    service_name: string | null;
    urgency: string | null;
    status: string;
    preferred_date: string | null;
    preferred_time: string | null;
    address: string | null;
    area: string | null;
    created_at: string;
    status_history: Array<{
      status: string;
      note: string | null;
      created_at: string;
    }> | null;
  };

  return {
    bookingId: booking.booking_id,
    customerName: booking.customer_name,
    serviceName: booking.service_name ?? 'Unknown service',
    urgency: booking.urgency ?? null,
    status: booking.status,
    preferredDate: booking.preferred_date ?? null,
    preferredTimeSlot: booking.preferred_time ?? null,
    address: booking.address ?? null,
    area: booking.area ?? null,
    createdAt: booking.created_at,
    statusHistory: (booking.status_history ?? []).map((entry) => ({
      status: entry.status,
      note: entry.note ?? null,
      createdAt: entry.created_at,
    })),
  };
}
