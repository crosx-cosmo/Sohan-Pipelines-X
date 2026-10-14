-- ==============================================================================
-- SOHAN PIPELINES — SUPABASE SERVICES & SERVICE AREAS MIGRATION & SEED SCRIPT
-- ==============================================================================
-- Execute this script in your Supabase SQL Editor:
-- Dashboard -> Project (jlfqodfdqkbunqfgffut) -> SQL Editor -> New Query -> Run
--
-- This script preserves all existing schema, table names, columns, and foreign keys.
-- It populates:
--   1. public.services (with exact verified UUIDs matching booking foreign keys)
--   2. public.service_areas (with South Bengal districts, localities, and pincodes)
--   3. Row Level Security (RLS) public SELECT policies so anon callers can read both.
-- ==============================================================================

-- 1. Ensure public.services schema matches exact expected columns
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price numeric NOT NULL DEFAULT 499,
  duration text DEFAULT '1-3 hours',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure RLS is active and permits public anonymous reads on services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'services' AND policyname = 'Allow public read-only access on services'
  ) THEN
    CREATE POLICY "Allow public read-only access on services"
      ON public.services
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

GRANT SELECT ON public.services TO anon, authenticated;

-- Seed certified Sohan Pipelines services with deterministic foreign-key UUIDs
INSERT INTO public.services (id, name, slug, description, price, duration, active)
VALUES
  (
    '4543c978-3337-4dfa-a992-64a95da2d0cb',
    'Pipe Fitting & Repair',
    'pipe-fitting-repair',
    'Expert installation, repair, and replacement of all pipe types — PVC, CPVC, copper, galvanized, and PEX — for reliable water flow throughout your property.',
    499,
    '1-3 hours',
    true
  ),
  (
    'f80afe90-a99f-428f-9def-b0816eb382f3',
    'Drainage Cleaning',
    'drainage-cleaning',
    'Complete drain cleaning and unclogging services for kitchens, bathrooms, and main sewer lines using high-pressure jetting and professional motorized augers.',
    399,
    '1-2 hours',
    true
  ),
  (
    '896994d8-a12f-4123-8ccc-427ac2f11c1e',
    'Leak Detection & Repair',
    'leak-detection-repair',
    'Advanced electronic acoustic stethoscopes and pressure testing to locate concealed leaks inside walls, under floors, or underground without destructive demolition.',
    699,
    '2-4 hours',
    true
  ),
  (
    'eab07b09-e42a-40fd-88d0-4d376d2d1d84',
    'Water Tank Installation',
    'water-tank-installation',
    'Overhead and underground water tank installation, float valve automation, booster pump connection, and cleanout bypass manifold setups.',
    999,
    '3-6 hours',
    true
  ),
  (
    '2291583a-844a-4632-9c3f-c5791d2c6710',
    'Bathroom Sanitary Fitting',
    'bathroom-fitting',
    'Complete bathroom fitting services including wall-hung commodes, concealed thermostatic diverters, shower mixers, health faucets, and retiling waterproofing.',
    799,
    '2-5 hours',
    true
  ),
  (
    '3102498b-912b-4d43-8a4b-d68a2e3d7821',
    'Kitchen Plumbing & RO Setup',
    'kitchen-plumbing',
    'Sink installation, drain pipe connections, RO water purifier hookup, dishwasher water lines, and anti-leak shutoff angle valve replacements.',
    449,
    '1-2 hours',
    true
  ),
  (
    '4a135a9c-023c-4e54-9b5c-e79b3f4e8932',
    'Geyser & Water Heater Installation',
    'geyser-installation',
    'Safe and certified installation of instant and storage water heaters, geysers, heat pumps, and hot-water compliant CPVC pressure lines.',
    599,
    '1-2 hours',
    true
  ),
  (
    '5b246bad-134d-4f65-ac6d-f80c4a5f9a43',
    'Commercial Pipeline Contracting',
    'commercial-plumbing',
    'Heavy-duty industrial and commercial plumbing for multi-story residential complexes, hotels, hospitals, and educational institutions across South Bengal.',
    1499,
    '4-8 hours',
    true
  ),
  (
    '6c357cbe-245e-4076-bd7e-091d5b6a0b54',
    '24/7 Rapid Emergency Response',
    'emergency-plumbing',
    'Round-the-clock priority dispatch for high-pressure pipe bursts, sudden main sewage overflows, flooded pump rooms, and hazardous waterline breaks.',
    799,
    'Immediate (15-30 mins)',
    true
  ),
  (
    '7d468dcf-356f-4187-ce8f-1a2e6c7b1c65',
    'Sewage Line Jetting & Cleanout',
    'sewage-line-cleaning',
    'High-pressure rotary hydro jetting for grease blockages, external sewer manholes, gully traps, and septic tank transfer lines.',
    899,
    '2-4 hours',
    true
  ),
  (
    '8e579edf-467a-4298-df9a-2b3f7d8c2d76',
    'Automatic Booster Pump Setup',
    'booster-pump-installation',
    'Pressure booster pump sizing, dual manifold integration, anti-vibration couplings, and dry-run protection automation for uniform shower pressure.',
    849,
    '2-4 hours',
    true
  ),
  (
    '9f68afee-578b-43a9-e0ab-3c4a8e9d3e87',
    'Tap, Valve & Fixture Overhaul',
    'fixture-repair',
    'Precision repair and replacement of dripping taps, quarter-turn brass ceramic spindle cartridges, flush tanks, float valves, and isolation angle valves.',
    349,
    '30-60 mins',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  duration = EXCLUDED.duration,
  active = EXCLUDED.active;

-- ==============================================================================
-- 2. Ensure public.service_areas schema matches exact expected columns
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  district text NOT NULL,
  subdivision text,
  block text,
  locality text NOT NULL,
  pincode text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure RLS is active and permits public anonymous reads on service_areas
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'service_areas' AND policyname = 'Allow public read-only access on service_areas'
  ) THEN
    CREATE POLICY "Allow public read-only access on service_areas"
      ON public.service_areas
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

GRANT SELECT ON public.service_areas TO anon, authenticated;

-- Seed operational service areas across Paschim Medinipur & Purba Medinipur
INSERT INTO public.service_areas (id, district, subdivision, block, locality, pincode, active)
VALUES
  (
    '78be954a-5385-4c69-864b-603c4c517d79',
    'Paschim Medinipur',
    'Kharagpur',
    'Dantan-I',
    'Dantan',
    '721426',
    true
  ),
  (
    'a1b2c3d4-0001-4000-8000-000000000001',
    'Paschim Medinipur',
    'Kharagpur',
    'Dantan-I',
    'Keshrambha',
    '721426',
    true
  ),
  (
    'a1b2c3d4-0002-4000-8000-000000000002',
    'Paschim Medinipur',
    'Kharagpur',
    'Kharagpur Town',
    'Kharagpur',
    '721301',
    true
  ),
  (
    'a1b2c3d4-0003-4000-8000-000000000003',
    'Paschim Medinipur',
    'Medinipur Sadar',
    'Midnapore Municipality',
    'Midnapore Town',
    '721101',
    true
  ),
  (
    'a1b2c3d4-0004-4000-8000-000000000004',
    'Paschim Medinipur',
    'Kharagpur',
    'Narayangarh',
    'Belda',
    '721424',
    true
  ),
  (
    'a1b2c3d4-0005-4000-8000-000000000005',
    'Paschim Medinipur',
    'Ghatal',
    'Ghatal Municipality',
    'Ghatal',
    '721212',
    true
  ),
  (
    'a1b2c3d4-0006-4000-8000-000000000006',
    'Paschim Medinipur',
    'Ghatal',
    'Chandrakona-I',
    'Chandrakona',
    '721201',
    true
  ),
  (
    'a1b2c3d4-0007-4000-8000-000000000007',
    'Jhargram',
    'Jhargram Sadar',
    'Jhargram Municipality',
    'Jhargram Town',
    '721507',
    true
  ),
  (
    'a1b2c3d4-0008-4000-8000-000000000008',
    'Purba Medinipur',
    'Contai',
    'Contai Municipality',
    'Contai (Kanthi)',
    '721401',
    true
  ),
  (
    'a1b2c3d4-0009-4000-8000-000000000009',
    'Purba Medinipur',
    'Tamluk',
    'Tamluk Municipality',
    'Tamluk Town',
    '721636',
    true
  ),
  (
    'a1b2c3d4-0010-4000-8000-000000000010',
    'Purba Medinipur',
    'Egra',
    'Egra Municipality',
    'Egra',
    '721429',
    true
  ),
  (
    'a1b2c3d4-0011-4000-8000-000000000011',
    'Paschim Medinipur',
    'Dantan',
    'Mohanpur Block',
    'Mohanpur',
    '721436',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  district = EXCLUDED.district,
  subdivision = EXCLUDED.subdivision,
  block = EXCLUDED.block,
  locality = EXCLUDED.locality,
  pincode = EXCLUDED.pincode,
  active = EXCLUDED.active;
