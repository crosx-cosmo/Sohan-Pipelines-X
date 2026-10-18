-- ==============================================================================
-- SOHAN PIPELINES — SUPABASE SPARE PARTS & INVENTORY SEED SCRIPT
-- ==============================================================================
-- Run this script in your Supabase SQL Editor:
-- Supabase Dashboard -> Project (jlfqodfdqkbunqfgffut) -> SQL Editor -> New Query -> Run
--
-- This script preserves your existing database schema and populates real
-- authorized plumbing hardware products, SKUs, inventory counts, and trade prices.
-- ==============================================================================

-- 1. Ensure public.spare_parts exists with exact schema
CREATE TABLE IF NOT EXISTS public.spare_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  sku text UNIQUE,
  stock integer NOT NULL DEFAULT 10,
  selling_price numeric NOT NULL DEFAULT 100,
  purchase_price numeric DEFAULT 70,
  reorder_level integer DEFAULT 5,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Ensure Row Level Security (RLS) is enabled and allows public anonymous read
ALTER TABLE public.spare_parts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'spare_parts' AND policyname = 'Allow public read-only access on spare_parts'
  ) THEN
    CREATE POLICY "Allow public read-only access on spare_parts"
      ON public.spare_parts
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

GRANT SELECT ON public.spare_parts TO anon, authenticated;

-- 3. Seed verified authorized plumbing inventory
INSERT INTO public.spare_parts (id, name, category, sku, stock, selling_price, purchase_price, reorder_level)
VALUES
  (
    'a1b2c3d4-1001-4000-8000-000000000001',
    'Astral CPVC Pro 1 Inch Heavy Duty Ball Valve',
    'Valves & Controls',
    'AST-CPVC-BV-100',
    24,
    380,
    270,
    5
  ),
  (
    'a1b2c3d4-1002-4000-8000-000000000002',
    'Supreme UPVC Schedule 80 1.25 Inch Pipe (3m Length)',
    'Pipes & Fittings',
    'SUP-UPVC-P-125',
    40,
    460,
    340,
    10
  ),
  (
    'a1b2c3d4-1003-4000-8000-000000000003',
    'Jaquar Florentine Quarter Turn Brass Bib Tap',
    'Taps & Diverters',
    'JAQ-FLOR-BIB-01',
    18,
    750,
    540,
    4
  ),
  (
    'a1b2c3d4-1004-4000-8000-000000000004',
    'Hindware Dual-Flush Concealed Cistern Flush Valve',
    'Sanitaryware & Flush',
    'HIND-DF-FLUSH-02',
    12,
    1450,
    1100,
    3
  ),
  (
    'a1b2c3d4-1005-4000-8000-000000000005',
    'Finolex SWR 110mm Heavy Duty 87.5° Bend with Door',
    'Pipes & Fittings',
    'FIN-SWR-BND-110',
    35,
    195,
    135,
    8
  ),
  (
    'a1b2c3d4-1006-4000-8000-000000000006',
    'Zoloto Bronze Non-Return Check Valve 1 Inch',
    'Valves & Controls',
    'ZOL-NRV-BRZ-100',
    15,
    920,
    710,
    3
  ),
  (
    'a1b2c3d4-1007-4000-8000-000000000007',
    'Supreme Heavy Brass Mechanical Float Valve 1 Inch',
    'Tanks & Accessories',
    'SUP-FLT-BRS-100',
    20,
    580,
    420,
    5
  ),
  (
    'a1b2c3d4-1008-4000-8000-000000000008',
    'SS 304 Braided Heavy Flexible Geyser Connection Pipe (18 Inch)',
    'Geysers & Heating',
    'SS-GEY-FLX-018',
    50,
    220,
    140,
    10
  ),
  (
    'a1b2c3d4-1009-4000-8000-000000000009',
    'Jaquar Overhead Rain Shower Head 8 Inch with Arm',
    'Taps & Diverters',
    'JAQ-SHW-RAIN-08',
    10,
    1650,
    1250,
    2
  ),
  (
    'a1b2c3d4-1010-4000-8000-000000000010',
    'Heavy Brass Bottle Trap 32mm for Wash Basin',
    'Sanitaryware & Flush',
    'BRS-BTL-TRP-032',
    16,
    890,
    630,
    4
  ),
  (
    'a1b2c3d4-1011-4000-8000-000000000011',
    'Astral CPVC Solvent Weld Cement Heavy Duty (250ml Tin)',
    'Pipes & Fittings',
    'AST-SOL-CMT-250',
    30,
    180,
    125,
    6
  ),
  (
    'a1b2c3d4-1012-4000-8000-000000000012',
    'Multi-function Thermal Geyser Safety Relief Valve 1/2 Inch',
    'Geysers & Heating',
    'GEY-SRV-BRS-050',
    22,
    340,
    230,
    5
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  sku = EXCLUDED.sku,
  stock = EXCLUDED.stock,
  selling_price = EXCLUDED.selling_price,
  purchase_price = EXCLUDED.purchase_price,
  reorder_level = EXCLUDED.reorder_level;
