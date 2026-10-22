-- =============================================================================
-- SOHAN PIPELINES — VERIFIED WORK-BASIS REVIEWS & FEEDBACK SCHEMA
-- Run this SQL in your Supabase SQL Editor if you wish to mirror reviews
-- directly in `public.reviews` alongside the built-in server persistence.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id text UNIQUE NOT NULL,
  booking_uuid uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_role text NOT NULL DEFAULT 'Homeowner',
  locality text NOT NULL DEFAULT 'Midnapore',
  service_name text NOT NULL,
  booking_status text NOT NULL DEFAULT 'Completed',
  work_date text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  metrics jsonb NOT NULL DEFAULT '{"workmanship":5,"punctuality":5,"pricingTransparency":5,"siteCleanliness":5}'::jsonb,
  headline text NOT NULL,
  comment text NOT NULL,
  highlights text[] NOT NULL DEFAULT '{}',
  would_recommend boolean NOT NULL DEFAULT true,
  helpful_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read of verified reviews" ON public.reviews;
CREATE POLICY "Allow public read of verified reviews"
  ON public.reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow public submission of verified booking reviews" ON public.reviews;
CREATE POLICY "Allow public submission of verified booking reviews"
  ON public.reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE upper(b.booking_id) = upper(booking_id)
    )
  );

DROP POLICY IF EXISTS "Allow public update of verified booking reviews" ON public.reviews;
CREATE POLICY "Allow public update of verified booking reviews"
  ON public.reviews
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
