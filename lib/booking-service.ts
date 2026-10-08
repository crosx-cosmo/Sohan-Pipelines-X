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

async function resolveServiceId(serviceId: string, serviceName: string): Promise<string> {
  const slugCandidates = SERVICE_SLUG_ALIASES[serviceId] ?? [serviceId];

  const { data: bySlug, error: slugError } = await supabase
    .from('services')
    .select('id, slug, name')
    .in('slug', slugCandidates)
    .eq('active', true)
    .limit(1)
    .maybeSingle();

  if (slugError) {
    throw new Error(`Could not resolve service: ${slugError.message}`);
  }

  if (bySlug?.id) return bySlug.id as string;

  const nameCandidates = [serviceName, ...(SERVICE_NAME_ALIASES[serviceName] ?? [])];
  const { data: byName, error: nameError } = await supabase
    .from('services')
    .select('id, name')
    .in('name', nameCandidates)
    .eq('active', true)
    .limit(1)
    .maybeSingle();

  if (nameError) {
    throw new Error(`Could not resolve service: ${nameError.message}`);
  }

  if (byName?.id) return byName.id as string;

  throw new Error(
    `The selected service (${serviceName}) is not currently available for online booking. Please choose another service or call us.`
  );
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

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      customer_id: input.customerId,
      service_id: serviceUuid,
      urgency: databaseUrgency,
      preferred_date: input.preferredDate,
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
  const phone = normalizePhone(phoneInput);

  if (!bookingRef || !phone) return null;

  const { data, error } = await supabase.rpc('find_booking', {
    p_booking_id: bookingRef,
    p_phone: phone,
  });

  if (error) {
    throw new Error(`Could not look up booking: ${error.message}`);
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
