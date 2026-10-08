/**
 * Booking status values, kept in sync with the `bookings.status` column in
 * Supabase. Do not add/remove values here without also updating the
 * database (e.g. a check constraint or enum type), if one exists.
 */
export const BOOKING_STATUSES = [
  'pending',
  'confirmed',
  'assigned',
  'in_progress',
  'completed',
  'cancelled',
  'rescheduled',
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const bookingStatusLabels: Record<BookingStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  assigned: 'Technician Assigned',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rescheduled: 'Rescheduled',
};

export const bookingStatusDescriptions: Record<BookingStatus, string> = {
  pending: 'We have received your request and will confirm shortly.',
  confirmed: 'Your booking is confirmed.',
  assigned: 'A technician has been assigned to your job.',
  in_progress: 'Work is currently underway.',
  completed: 'This job has been completed.',
  cancelled: 'This booking was cancelled.',
  rescheduled: 'This booking has been rescheduled.',
};

/** Tailwind classes for status badges/timeline dots, keyed by status. */
export const bookingStatusStyles: Record<BookingStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  confirmed: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  assigned: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  in_progress: 'bg-primary/10 text-primary border-primary/20',
  completed: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  rescheduled: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
};

export function isBookingStatus(value: string): value is BookingStatus {
  return (BOOKING_STATUSES as readonly string[]).includes(value);
}

export function bookingStatusLabel(status: string): string {
  return isBookingStatus(status) ? bookingStatusLabels[status] : status;
}

export function bookingStatusStyle(status: string): string {
  return isBookingStatus(status)
    ? bookingStatusStyles[status]
    : 'bg-muted text-muted-foreground border-border';
}

/** Urgency levels captured during booking and stored on `bookings.urgency`. */
export const URGENCY_LEVELS = [
  {
    id: 'emergency',
    label: 'Emergency',
    description: 'Active leak, flooding, or no water — need help ASAP.',
  },
  {
    id: 'urgent',
    label: 'Urgent',
    description: 'Needs attention within the next 24 hours.',
  },
  {
    id: 'routine',
    label: 'Routine',
    description: 'Flexible timing, not time-critical.',
  },
] as const;

export type UrgencyLevel = (typeof URGENCY_LEVELS)[number]['id'];

export function urgencyLabel(id: string): string {
  return URGENCY_LEVELS.find((u) => u.id === id)?.label ?? id;
}
