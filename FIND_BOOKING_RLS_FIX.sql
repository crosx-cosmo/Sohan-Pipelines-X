-- Secure Find My Booking lookup.
-- This does NOT expose customers/bookings to public SELECT.
-- It only returns a booking when BOTH Booking ID and phone match.

DROP FUNCTION IF EXISTS public.find_booking(text, text);

CREATE OR REPLACE FUNCTION public.find_booking(
  p_booking_id text,
  p_phone text
)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'booking_id', b.booking_id,
    'customer_name', c.full_name,
    'service_name', s.name,
    'urgency', b.urgency,
    'status', b.status,
    'preferred_date', b.preferred_date,
    'preferred_time', b.preferred_time,
    'address', COALESCE(bl.formatted_address, b.address),
    'area', bl.city,
    'created_at', b.created_at,
    'status_history', COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'status', h.status,
            'note', h.note,
            'created_at', h.created_at
          )
          ORDER BY h.created_at ASC
        )
        FROM public.booking_status_history h
        WHERE h.booking_id = b.id
      ),
      '[]'::jsonb
    )
  )
  FROM public.bookings b
  INNER JOIN public.customers c ON c.id = b.customer_id
  INNER JOIN public.services s ON s.id = b.service_id
  LEFT JOIN public.booking_locations bl ON bl.booking_id = b.id
  WHERE b.booking_id = UPPER(TRIM(p_booking_id))
    AND c.phone = TRIM(p_phone)
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.find_booking(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.find_booking(text, text) TO anon, authenticated;
