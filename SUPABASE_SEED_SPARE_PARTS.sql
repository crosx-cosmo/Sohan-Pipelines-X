-- ==============================================================================
-- SOHAN PIPELINES — SUPABASE SPARE PARTS & "Spare Parts" BUCKET RLS SCRIPT
-- ==============================================================================
-- Run this script in your Supabase SQL Editor:
-- Supabase Dashboard -> Project (jlfqodfdqkbunqfgffut) -> SQL Editor -> New Query -> Run
--
-- This script preserves your existing `public.spare_parts` schema (including `image_path`)
-- and enables public read access on both `public.spare_parts` and the existing
-- `"Spare Parts"` Storage bucket so products and images uploaded via the Admin Panel
-- render automatically on the public storefront.
-- ==============================================================================

-- 1. Ensure `image_path` column exists on `public.spare_parts`
ALTER TABLE public.spare_parts
  ADD COLUMN IF NOT EXISTS image_path text;

-- 2. Enable Row Level Security (RLS) and allow public read on `public.spare_parts`
ALTER TABLE public.spare_parts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read-only access on spare_parts" ON public.spare_parts;

CREATE POLICY "Allow public read-only access on spare_parts"
  ON public.spare_parts
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public.spare_parts TO anon, authenticated;

-- 3. Allow public read access on the existing "Spare Parts" Storage bucket
DROP POLICY IF EXISTS "Allow public read access on Spare Parts bucket" ON storage.objects;

CREATE POLICY "Allow public read access on Spare Parts bucket"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'Spare Parts');
