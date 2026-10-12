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

  const { error: createError } = await supabase
    .from('customers')
    .insert({
      id: customerId,
      full_name: name,
      phone: normalizedPhone,
    });

  if (createError) {
    throw new Error(`Could not create customer: ${createError.message}`);
  }

  return customerId;
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

/** Creates a booking using the existing Supabase schema and DB-generated booking ID. */
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

  if (bookingError || !booking) {
    throw new Error(`Could not create booking: ${bookingError?.message ?? 'unknown error'}`);
  }

  const { error: locationError } = await supabase.from('booking_locations').insert({
    booking_id: booking.id,
    formatted_address: input.address,
    city: input.area,
  });

  if (locationError) {
    throw new Error(`Booking was created but saving the address failed: ${locationError.message}`);
  }

  return {
    id: booking.id as string,
    bookingId: booking.booking_id as string,
    status: booking.status as string,
    createdAt: booking.created_at as string,
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

  if (!data && lastError && phoneVariants.length === 1) {
    throw new Error(`Could not look up booking: ${lastError.message}`);
  }

  if (!data) return null;

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
