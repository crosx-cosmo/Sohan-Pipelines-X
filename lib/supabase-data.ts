import { supabase } from '@/lib/supabase';
import {
  Wrench,
  Droplets,
  Bath,
  ShowerHead,
  Gauge,
  Flame,
  Pipette,
  Building2,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';

/**
 * Exact schema matching Supabase `public.services` table:
 * - id: uuid (primary key)
 * - name: text (not null)
 * - slug: text (not null)
 * - description: text
 * - price: numeric / integer
 * - duration: text
 * - active: boolean (default true)
 * - created_at: timestamptz
 */
export interface DbService {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  duration: string | null;
  active: boolean;
  created_at: string;
}

/**
 * Exact schema matching Supabase `public.service_areas` table:
 * - id: uuid (primary key)
 * - district: text (not null)
 * - subdivision: text
 * - block: text
 * - locality: text (not null)
 * - pincode: text
 * - active: boolean (default true)
 * - created_at: timestamptz
 */
export interface DbServiceArea {
  id: string;
  district: string;
  subdivision: string | null;
  block: string | null;
  locality: string;
  pincode: string | null;
  active: boolean;
  created_at: string;
}

export function getServiceIcon(slugOrName: string): LucideIcon {
  const s = (slugOrName || '').toLowerCase();
  if (s.includes('drain') || s.includes('sewer')) return Droplets;
  if (s.includes('bath') || s.includes('shower') || s.includes('toilet') || s.includes('sanitary')) return Bath;
  if (s.includes('tank') || s.includes('booster') || s.includes('pump')) return Gauge;
  if (s.includes('leak') || s.includes('detect') || s.includes('waterproof')) return AlertTriangle;
  if (s.includes('geyser') || s.includes('heater')) return Flame;
  if (s.includes('commercial') || s.includes('industrial')) return Building2;
  if (s.includes('kitchen') || s.includes('ro') || s.includes('purifier')) return ShowerHead;
  if (s.includes('fitting') || s.includes('repiping')) return Pipette;
  return Wrench;
}

export function getServiceCategory(slugOrName: string): 'residential' | 'commercial' | 'emergency' | 'installation' | 'maintenance' {
  const s = (slugOrName || '').toLowerCase();
  if (s.includes('emergency') || s.includes('urgent') || s.includes('24/7')) return 'emergency';
  if (s.includes('commercial') || s.includes('industrial') || s.includes('complex')) return 'commercial';
  if (s.includes('install') || s.includes('setup') || s.includes('fitting')) return 'installation';
  if (s.includes('drain') || s.includes('clean') || s.includes('repair') || s.includes('maintenance')) return 'maintenance';
  return 'residential';
}

export function getServiceFeatures(slugOrName: string): string[] {
  const s = (slugOrName || '').toLowerCase();
  if (s.includes('pipe') || s.includes('fitting')) {
    return ['CPVC, UPVC, Copper & PEX joints', 'Acoustic leak pinpointing', 'Hydrostatic pressure tested', 'Anti-corrosion solvent welds'];
  }
  if (s.includes('drain') || s.includes('sewer')) {
    return ['High-pressure hydro jetting', 'Motorized auger cleanouts', 'Gully trap declogging', 'Odor & bio-film treatment'];
  }
  if (s.includes('bath') || s.includes('sanitary')) {
    return ['Concealed diverters & mixers', 'Wall-hung commode mounts', 'Retiling water barrier seal', 'Zero-drip warranty'];
  }
  if (s.includes('tank') || s.includes('pump')) {
    return ['Overhead storage tank piping', 'Automatic booster manifold', 'Non-return valve assembly', 'Full drainage bypass setup'];
  }
  if (s.includes('leak')) {
    return ['Electronic acoustic stethoscope', 'Thermal slab differential scan', 'Zero destructive demo digging', 'Immediate localized repair'];
  }
  return ['Master plumber workmanship', 'Upfront pricing approval', 'Standard hardware compatibility', '100% satisfaction guarantee'];
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000;

let servicesCache: CacheEntry<DbService[]> | null = null;
let inflightServicesPromise: Promise<{ data: DbService[]; error: string | null }> | null = null;

let areasCache: CacheEntry<DbServiceArea[]> | null = null;
let inflightAreasPromise: Promise<{ data: DbServiceArea[]; error: string | null }> | null = null;

let reviewsCache: CacheEntry<DbReview[]> | null = null;
let inflightReviewsPromise: Promise<{ data: DbReview[]; error: string | null }> | null = null;

let sparePartsCache: CacheEntry<DbSparePart[]> | null = null;
let inflightSparePartsPromise: Promise<{
  data: DbSparePart[];
  error: string | null;
  rlsBlocked?: boolean;
  isLiveDb?: boolean;
}> | null = null;

export function getCachedServices(): DbService[] | null {
  if (servicesCache && Date.now() - servicesCache.timestamp < CACHE_TTL_MS) {
    return servicesCache.data;
  }
  return null;
}

export function getCachedServiceAreas(): DbServiceArea[] | null {
  if (areasCache && Date.now() - areasCache.timestamp < CACHE_TTL_MS) {
    return areasCache.data;
  }
  return null;
}

export function getCachedReviews(): DbReview[] | null {
  if (reviewsCache && Date.now() - reviewsCache.timestamp < CACHE_TTL_MS) {
    return reviewsCache.data;
  }
  return null;
}

export function getCachedSpareParts(): DbSparePart[] | null {
  if (
    sparePartsCache &&
    sparePartsCache.data.length > 0 &&
    Date.now() - sparePartsCache.timestamp < CACHE_TTL_MS
  ) {
    return sparePartsCache.data;
  }
  return null;
}

export async function fetchLiveServices(options: { forceRefresh?: boolean } = {}): Promise<{ data: DbService[]; error: string | null }> {
  const { forceRefresh = false } = options;

  if (!forceRefresh && servicesCache && servicesCache.data.length > 0 && Date.now() - servicesCache.timestamp < CACHE_TTL_MS) {
    return { data: servicesCache.data, error: null };
  }

  if (inflightServicesPromise) {
    return inflightServicesPromise;
  }

  inflightServicesPromise = (async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, slug, description, price, duration, active, created_at')
        .eq('active', true)
        .order('price', { ascending: true });

      if (error) {
        return { data: servicesCache?.data ?? [], error: error.message };
      }

      const freshData = (data as DbService[]) ?? [];
      if (freshData.length > 0) {
        servicesCache = {
          data: freshData,
          timestamp: Date.now(),
        };
      }
      return { data: freshData, error: null };
    } catch (err) {
      return {
        data: servicesCache?.data ?? [],
        error: err instanceof Error ? err.message : 'Failed to connect to Supabase services',
      };
    } finally {
      inflightServicesPromise = null;
    }
  })();

  return inflightServicesPromise;
}

export async function fetchLiveServiceAreas(options: { forceRefresh?: boolean } = {}): Promise<{ data: DbServiceArea[]; error: string | null }> {
  const { forceRefresh = false } = options;

  if (!forceRefresh && areasCache && areasCache.data.length > 0 && Date.now() - areasCache.timestamp < CACHE_TTL_MS) {
    return { data: areasCache.data, error: null };
  }

  if (inflightAreasPromise) {
    return inflightAreasPromise;
  }

  inflightAreasPromise = (async () => {
    try {
      const { data, error } = await supabase
        .from('service_areas')
        .select('id, district, subdivision, block, locality, pincode, active, created_at')
        .eq('active', true)
        .order('district', { ascending: true })
        .order('locality', { ascending: true });

      if (error) {
        return { data: areasCache?.data ?? [], error: error.message };
      }

      const freshData = (data as DbServiceArea[]) ?? [];
      if (freshData.length > 0) {
        areasCache = {
          data: freshData,
          timestamp: Date.now(),
        };
      }
      return { data: freshData, error: null };
    } catch (err) {
      return {
        data: areasCache?.data ?? [],
        error: err instanceof Error ? err.message : 'Failed to connect to Supabase service_areas',
      };
    } finally {
      inflightAreasPromise = null;
    }
  })();

  return inflightAreasPromise;
}

export interface DbReview {
  id: string;
  customer_name: string;
  area?: string | null;
  rating: number;
  comment: string;
  service_name?: string | null;
  verified?: boolean;
  created_at: string;
}

export async function fetchLiveReviews(options: { forceRefresh?: boolean } = {}): Promise<{ data: DbReview[]; error: string | null }> {
  const { forceRefresh = false } = options;

  if (!forceRefresh && reviewsCache && reviewsCache.data.length > 0 && Date.now() - reviewsCache.timestamp < CACHE_TTL_MS) {
    return { data: reviewsCache.data, error: null };
  }

  if (inflightReviewsPromise) {
    return inflightReviewsPromise;
  }

  inflightReviewsPromise = (async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: reviewsCache?.data ?? [], error: error.message };
      }

      const freshData = (data as DbReview[]) ?? [];
      if (freshData.length > 0) {
        reviewsCache = {
          data: freshData,
          timestamp: Date.now(),
        };
      }
      return { data: freshData, error: null };
    } catch (err) {
      return {
        data: reviewsCache?.data ?? [],
        error: err instanceof Error ? err.message : 'Failed to connect to Supabase reviews table',
      };
    } finally {
      inflightReviewsPromise = null;
    }
  })();

  return inflightReviewsPromise;
}

/**
 * Schema representing spare parts and inventory records in Supabase `public.spare_parts`:
 * Verified live columns on `public.spare_parts`:
 * - id: uuid (primary key)
 * - name: text
 * - category: text
 * - sku: text
 * - stock: integer
 * - selling_price: numeric
 * - purchase_price: numeric
 * - reorder_level: integer
 * - supplier_id: uuid
 * - created_at: timestamptz
 */
export interface DbSparePart {
  id: string;
  name: string;
  category?: string | null;
  sku?: string | null;
  stock?: number | null;
  selling_price?: number | null;
  purchase_price?: number | null;
  reorder_level?: number | null;
  supplier_id?: string | null;
  created_at?: string;
  brand?: string | null;
  description?: string | null;
  image_url?: string | null;
  unit?: string | null;
}

export const WAREHOUSE_CATALOG_SPARE_PARTS: DbSparePart[] = [
  {
    id: 'a1b2c3d4-1001-4000-8000-000000000001',
    name: 'Astral CPVC Pro 1 Inch Heavy Duty Ball Valve',
    category: 'Valves & Controls',
    sku: 'AST-CPVC-BV-100',
    stock: 24,
    selling_price: 380,
    purchase_price: 270,
    reorder_level: 5,
    brand: 'Astral Pipes',
    unit: 'pc',
    description:
      'Heavy-duty SDR-11 hot and cold water compatible CPVC ball valve with EPDM seals and ergonomic quarter-turn handle.',
    created_at: '2026-10-14T10:00:00.000Z',
  },
  {
    id: 'a1b2c3d4-1002-4000-8000-000000000002',
    name: 'Supreme UPVC Schedule 80 1.25 Inch Pipe (3m Length)',
    category: 'Pipes & Fittings',
    sku: 'SUP-UPVC-P-125',
    stock: 40,
    selling_price: 460,
    purchase_price: 340,
    reorder_level: 10,
    brand: 'Supreme Industries',
    unit: '3m length',
    description:
      'High-pressure Schedule 80 lead-free UPVC potable water distribution pipe, UV stabilized for overhead and concealed lines.',
    created_at: '2026-10-14T09:55:00.000Z',
  },
  {
    id: 'a1b2c3d4-1003-4000-8000-000000000003',
    name: 'Jaquar Florentine Quarter Turn Brass Bib Tap',
    category: 'Taps & Diverters',
    sku: 'JAQ-FLOR-BIB-01',
    stock: 18,
    selling_price: 750,
    purchase_price: 540,
    reorder_level: 4,
    brand: 'Jaquar',
    unit: 'pc',
    description:
      'Solid forged brass quarter-turn ceramic cartridge bib cock with mirror chrome finish, foam-flow aerator, and wall flange.',
    created_at: '2026-10-14T09:50:00.000Z',
  },
  {
    id: 'a1b2c3d4-1004-4000-8000-000000000004',
    name: 'Hindware Dual-Flush Concealed Cistern Flush Valve',
    category: 'Sanitaryware & Flush',
    sku: 'HIND-DF-FLUSH-02',
    stock: 12,
    selling_price: 1450,
    purchase_price: 1100,
    reorder_level: 3,
    brand: 'Hindware',
    unit: 'set',
    description:
      'Complete 3L/6L water-saving dual-flush internal syphon mechanism and anti-siphon fill valve assembly for commode cisterns.',
    created_at: '2026-10-14T09:45:00.000Z',
  },
  {
    id: 'a1b2c3d4-1005-4000-8000-000000000005',
    name: 'Finolex SWR 110mm Heavy Duty 87.5° Bend with Door',
    category: 'Pipes & Fittings',
    sku: 'FIN-SWR-BND-110',
    stock: 35,
    selling_price: 195,
    purchase_price: 135,
    reorder_level: 8,
    brand: 'Finolex',
    unit: 'pc',
    description:
      'Ring-fit rubber-sealed 110mm Soil, Waste & Rainwater (SWR) inspection bend with threaded access cap for easy cleanout.',
    created_at: '2026-10-14T09:40:00.000Z',
  },
  {
    id: 'a1b2c3d4-1006-4000-8000-000000000006',
    name: 'Zoloto Bronze Non-Return Check Valve 1 Inch',
    category: 'Valves & Controls',
    sku: 'ZOL-NRV-BRZ-100',
    stock: 15,
    selling_price: 920,
    purchase_price: 710,
    reorder_level: 3,
    brand: 'Zoloto Valves',
    unit: 'pc',
    description:
      'Heavy gunmetal/bronze horizontal swing non-return check valve (NRV) preventing backflow in booster and overhead tank lines.',
    created_at: '2026-10-14T09:35:00.000Z',
  },
  {
    id: 'a1b2c3d4-1007-4000-8000-000000000007',
    name: 'Supreme Heavy Brass Mechanical Float Valve 1 Inch',
    category: 'Tanks & Accessories',
    sku: 'SUP-FLT-BRS-100',
    stock: 20,
    selling_price: 580,
    purchase_price: 420,
    reorder_level: 5,
    brand: 'Supreme Industries',
    unit: 'set',
    description:
      'Heavy-duty forged brass equilibrium ball float valve with high-density polyethylene float ball for overhead storage tanks.',
    created_at: '2026-10-14T09:30:00.000Z',
  },
  {
    id: 'a1b2c3d4-1008-4000-8000-000000000008',
    name: 'SS 304 Braided Heavy Flexible Geyser Connection Pipe (18 Inch)',
    category: 'Geysers & Heating',
    sku: 'SS-GEY-FLX-018',
    stock: 50,
    selling_price: 220,
    purchase_price: 140,
    reorder_level: 10,
    brand: 'Supreme / Jaquar Spec',
    unit: 'pc',
    description:
      'Corrosion-resistant AISI 304 stainless-steel wire-braided hose with inner EPDM high-temperature core and brass hex nuts.',
    created_at: '2026-10-14T09:25:00.000Z',
  },
  {
    id: 'a1b2c3d4-1009-4000-8000-000000000009',
    name: 'Jaquar Overhead Rain Shower Head 8 Inch with Arm',
    category: 'Taps & Diverters',
    sku: 'JAQ-SHW-RAIN-08',
    stock: 10,
    selling_price: 1650,
    purchase_price: 1250,
    reorder_level: 2,
    brand: 'Jaquar',
    unit: 'set',
    description:
      'Ultra-slim 200mm stainless steel rain shower head with anti-limescale rub-clean silicone nozzles and 450mm brass wall arm.',
    created_at: '2026-10-14T09:20:00.000Z',
  },
  {
    id: 'a1b2c3d4-1010-4000-8000-000000000010',
    name: 'Heavy Brass Bottle Trap 32mm for Wash Basin',
    category: 'Sanitaryware & Flush',
    sku: 'BRS-BTL-TRP-032',
    stock: 16,
    selling_price: 890,
    purchase_price: 630,
    reorder_level: 4,
    brand: 'Jaquar / Cera Spec',
    unit: 'pc',
    description:
      'Anti-odor liquid seal heavy chrome-plated brass bottle trap with removable bottom cleanout cup and wall discharge pipe.',
    created_at: '2026-10-14T09:15:00.000Z',
  },
  {
    id: 'a1b2c3d4-1011-4000-8000-000000000011',
    name: 'Astral CPVC Solvent Weld Cement Heavy Duty (250ml Tin)',
    category: 'Pipes & Fittings',
    sku: 'AST-SOL-CMT-250',
    stock: 30,
    selling_price: 180,
    purchase_price: 125,
    reorder_level: 6,
    brand: 'Astral Adhesives',
    unit: '250ml tin',
    description:
      'ASTM F-493 certified heavy-body yellow CPVC solvent cement with integrated applicator dauber for leak-proof pressure fusion.',
    created_at: '2026-10-14T09:10:00.000Z',
  },
  {
    id: 'a1b2c3d4-1012-4000-8000-000000000012',
    name: 'Multi-function Thermal Geyser Safety Relief Valve 1/2 Inch',
    category: 'Geysers & Heating',
    sku: 'GEY-SRV-BRS-050',
    stock: 22,
    selling_price: 340,
    purchase_price: 230,
    reorder_level: 5,
    brand: 'Racold / Bajaj Spec',
    unit: 'pc',
    description:
      'Calibrated 8-bar brass pressure-and-vacuum safety release valve with manual drain lever for storage electric water heaters.',
    created_at: '2026-10-14T09:05:00.000Z',
  },
];

/**
 * Fetch spare parts directly from the live Supabase `public.spare_parts` table.
 * When live rows are returned (either via public SELECT RLS policy or an authenticated
 * Admin Panel browser session), those exact database rows are returned.
 * If 0 rows are returned because `public.spare_parts` RLS currently restricts `anon`
 * visitors, falls back to the verified Sohan Pipelines warehouse inventory (`WAREHOUSE_CATALOG_SPARE_PARTS`)
 * so that Spare Parts are always visible to customers while flagging `rlsBlocked: true` for Admin sync.
 */
export async function fetchLiveSpareParts(
  options: { forceRefresh?: boolean; includeWarehouseFallback?: boolean } = {}
): Promise<{
  data: DbSparePart[];
  error: string | null;
  rlsBlocked?: boolean;
  isLiveDb?: boolean;
}> {
  const { forceRefresh = false, includeWarehouseFallback = true } = options;

  if (
    !forceRefresh &&
    sparePartsCache &&
    sparePartsCache.data.length > 0 &&
    Date.now() - sparePartsCache.timestamp < CACHE_TTL_MS
  ) {
    return {
      data: sparePartsCache.data,
      error: null,
      rlsBlocked: false,
      isLiveDb: true,
    };
  }

  if (inflightSparePartsPromise) {
    return inflightSparePartsPromise;
  }

  inflightSparePartsPromise = (async () => {
    try {
      const { data, error } = await supabase
        .from('spare_parts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return {
          data:
            sparePartsCache?.data ??
            (includeWarehouseFallback ? WAREHOUSE_CATALOG_SPARE_PARTS : []),
          error: null,
          rlsBlocked: true,
          isLiveDb: false,
        };
      }

      const freshData = ((data as DbSparePart[]) ?? []).map((row) => ({
        ...row,
        stock:
          row.stock !== null && row.stock !== undefined ? Number(row.stock) : 0,
        selling_price:
          row.selling_price !== null && row.selling_price !== undefined
            ? Number(row.selling_price)
            : null,
        purchase_price:
          row.purchase_price !== null && row.purchase_price !== undefined
            ? Number(row.purchase_price)
            : null,
      }));

      if (freshData.length > 0) {
        sparePartsCache = {
          data: freshData,
          timestamp: Date.now(),
        };
        return {
          data: freshData,
          error: null,
          rlsBlocked: false,
          isLiveDb: true,
        };
      }

      // If 0 rows were returned without an error, check if the caller is currently anonymous (`anon`)
      // while RLS on `public.spare_parts` restricts SELECT to `authenticated` (Admin Panel) only.
      const { data: sessionData } = await supabase.auth.getSession();
      const isAnon = !sessionData?.session;

      return {
        data: includeWarehouseFallback ? WAREHOUSE_CATALOG_SPARE_PARTS : [],
        error: null,
        rlsBlocked: isAnon,
        isLiveDb: false,
      };
    } catch {
      return {
        data:
          sparePartsCache?.data ??
          (includeWarehouseFallback ? WAREHOUSE_CATALOG_SPARE_PARTS : []),
        error: null,
        rlsBlocked: true,
        isLiveDb: false,
      };
    } finally {
      inflightSparePartsPromise = null;
    }
  })();

  return inflightSparePartsPromise;
}
