import { supabase } from '@/lib/supabase';
import { getSparePartImageUrl } from '@/lib/spare-parts-mapping';
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

const REGIONAL_PINCODE_DIRECTORY: Record<
  string,
  { pincode: string; district: string; block: string; subdivision: string }
> = {
  belda: {
    pincode: '721424',
    district: 'West Medinipur',
    block: 'Narayangarh',
    subdivision: 'Kharagpur',
  },
  keshrambha: {
    pincode: '721451',
    district: 'West Medinipur',
    block: 'Dantan-I',
    subdivision: 'Kharagpur',
  },
  bahardaltitia: {
    pincode: '721451',
    district: 'West Medinipur',
    block: 'Dantan-I',
    subdivision: 'Kharagpur',
  },
  dantan: {
    pincode: '721426',
    district: 'West Medinipur',
    block: 'Dantan-I',
    subdivision: 'Kharagpur',
  },
  narayangarh: {
    pincode: '721437',
    district: 'West Medinipur',
    block: 'Narayangarh',
    subdivision: 'Kharagpur',
  },
  kharagpur: {
    pincode: '721301',
    district: 'West Medinipur',
    block: 'Kharagpur',
    subdivision: 'Kharagpur',
  },
  midnapore: {
    pincode: '721101',
    district: 'West Medinipur',
    block: 'Midnapore Sadar',
    subdivision: 'Medinipur Sadar',
  },
  medinipur: {
    pincode: '721101',
    district: 'West Medinipur',
    block: 'Midnapore Sadar',
    subdivision: 'Medinipur Sadar',
  },
  debra: {
    pincode: '721126',
    district: 'West Medinipur',
    block: 'Debra',
    subdivision: 'Kharagpur',
  },
  pingla: {
    pincode: '721140',
    district: 'West Medinipur',
    block: 'Pingla',
    subdivision: 'Kharagpur',
  },
  sabang: {
    pincode: '721144',
    district: 'West Medinipur',
    block: 'Sabang',
    subdivision: 'Kharagpur',
  },
  keshiary: {
    pincode: '721133',
    district: 'West Medinipur',
    block: 'Keshiary',
    subdivision: 'Kharagpur',
  },
  mohanpur: {
    pincode: '721436',
    district: 'West Medinipur',
    block: 'Mohanpur',
    subdivision: 'Kharagpur',
  },
  makrampur: {
    pincode: '721437',
    district: 'West Medinipur',
    block: 'Narayangarh',
    subdivision: 'Kharagpur',
  },
  bakhrabad: {
    pincode: '721424',
    district: 'West Medinipur',
    block: 'Narayangarh',
    subdivision: 'Kharagpur',
  },
  khakurda: {
    pincode: '721445',
    district: 'West Medinipur',
    block: 'Narayangarh',
    subdivision: 'Kharagpur',
  },
  angus: {
    pincode: '721426',
    district: 'West Medinipur',
    block: 'Dantan-I',
    subdivision: 'Kharagpur',
  },
  menkapur: {
    pincode: '721435',
    district: 'West Medinipur',
    block: 'Dantan-II',
    subdivision: 'Kharagpur',
  },
  khandrui: {
    pincode: '721451',
    district: 'West Medinipur',
    block: 'Dantan-II',
    subdivision: 'Kharagpur',
  },
  turka: {
    pincode: '721445',
    district: 'West Medinipur',
    block: 'Dantan-II',
    subdivision: 'Kharagpur',
  },
  ghatal: {
    pincode: '721212',
    district: 'West Medinipur',
    block: 'Ghatal',
    subdivision: 'Ghatal',
  },
  chandrakona: {
    pincode: '721201',
    district: 'West Medinipur',
    block: 'Chandrakona',
    subdivision: 'Ghatal',
  },
  daspur: {
    pincode: '721211',
    district: 'West Medinipur',
    block: 'Daspur',
    subdivision: 'Ghatal',
  },
  keshpur: {
    pincode: '721150',
    district: 'West Medinipur',
    block: 'Keshpur',
    subdivision: 'Medinipur Sadar',
  },
  salboni: {
    pincode: '721147',
    district: 'West Medinipur',
    block: 'Salboni',
    subdivision: 'Medinipur Sadar',
  },
  garhbeta: {
    pincode: '721127',
    district: 'West Medinipur',
    block: 'Garhbeta',
    subdivision: 'Medinipur Sadar',
  },
  contai: {
    pincode: '721401',
    district: 'Purba Medinipur',
    block: 'Contai',
    subdivision: 'Contai',
  },
  kanthi: {
    pincode: '721401',
    district: 'Purba Medinipur',
    block: 'Contai',
    subdivision: 'Contai',
  },
  egra: {
    pincode: '721429',
    district: 'Purba Medinipur',
    block: 'Egra',
    subdivision: 'Egra',
  },
  patashpur: {
    pincode: '721439',
    district: 'Purba Medinipur',
    block: 'Patashpur',
    subdivision: 'Egra',
  },
  potashpur: {
    pincode: '721439',
    district: 'Purba Medinipur',
    block: 'Patashpur',
    subdivision: 'Egra',
  },
  bhagwanpur: {
    pincode: '721601',
    district: 'Purba Medinipur',
    block: 'Bhagwanpur',
    subdivision: 'Egra',
  },
  digha: {
    pincode: '721428',
    district: 'Purba Medinipur',
    block: 'Ramnagar',
    subdivision: 'Contai',
  },
  ramnagar: {
    pincode: '721441',
    district: 'Purba Medinipur',
    block: 'Ramnagar',
    subdivision: 'Contai',
  },
  tamluk: {
    pincode: '721636',
    district: 'Purba Medinipur',
    block: 'Tamluk',
    subdivision: 'Tamluk',
  },
  panskura: {
    pincode: '721139',
    district: 'Purba Medinipur',
    block: 'Panskura',
    subdivision: 'Tamluk',
  },
  kolaghat: {
    pincode: '721134',
    district: 'Purba Medinipur',
    block: 'Kolaghat',
    subdivision: 'Tamluk',
  },
  haldia: {
    pincode: '721602',
    district: 'Purba Medinipur',
    block: 'Haldia',
    subdivision: 'Haldia',
  },
  jhargram: {
    pincode: '721507',
    district: 'Jhargram',
    block: 'Jhargram',
    subdivision: 'Jhargram',
  },
  gopiballavpur: {
    pincode: '721506',
    district: 'Jhargram',
    block: 'Gopiballavpur',
    subdivision: 'Jhargram',
  },
  nayagram: {
    pincode: '721125',
    district: 'Jhargram',
    block: 'Nayagram',
    subdivision: 'Jhargram',
  },
  jaleswar: {
    pincode: '756032',
    district: 'Balasore',
    block: 'Jaleswar',
    subdivision: 'Balasore',
  },
};

function enrichDbServiceArea(row: DbServiceArea): DbServiceArea {
  const cleanLocality = (row.locality || '').trim();
  const key = cleanLocality.toLowerCase();
  const matched =
    REGIONAL_PINCODE_DIRECTORY[key] ||
    Object.entries(REGIONAL_PINCODE_DIRECTORY).find(
      ([k]) => key.includes(k) || k.includes(key)
    )?.[1];

  const resolvedPincode =
    row.pincode && String(row.pincode).trim()
      ? String(row.pincode).trim()
      : matched?.pincode || '721451';

  const resolvedDistrict =
    row.district && String(row.district).trim()
      ? String(row.district).trim()
      : matched?.district || 'West Medinipur';

  const resolvedBlock =
    row.block && String(row.block).trim()
      ? String(row.block).trim()
      : matched?.block || null;

  const resolvedSubdivision =
    row.subdivision && String(row.subdivision).trim()
      ? String(row.subdivision).trim()
      : matched?.subdivision || null;

  return {
    ...row,
    locality: cleanLocality,
    pincode: resolvedPincode,
    district: resolvedDistrict,
    block: resolvedBlock,
    subdivision: resolvedSubdivision,
  };
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

      const freshData = ((data as DbServiceArea[]) ?? []).map(enrichDbServiceArea);
      if (freshData.length > 0) {
        areasCache = {
          data: freshData,
          timestamp: Date.now(),
        };
      } else {
        areasCache = null;
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
 * - supplier_id: uuid (foreign key -> public.suppliers.id)
 * - image_path: text (storage path in the "spare-part-images" Supabase Storage bucket, e.g. "parts/<filename>")
 * - created_at: timestamptz
 */
export interface DbSparePartSupplier {
  id: string;
  name: string;
}

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
  image_path?: string | null;
  created_at?: string;
  suppliers?: DbSparePartSupplier | DbSparePartSupplier[] | null;
  brand?: string | null;
  description?: string | null;
  image_url?: string | null;
  unit?: string | null;
}

export function clearSparePartsCache(): void {
  sparePartsCache = null;
}

/**
 * Fetch spare parts directly from the live Supabase `public.spare_parts` table
 * along with its existing `suppliers` foreign-key relationship and `image_path` column.
 * Never invents product data and immediately reflects Admin Panel additions, edits,
 * image replacements, and removals.
 */
export async function fetchLiveSpareParts(
  options: { forceRefresh?: boolean } = {}
): Promise<{
  data: DbSparePart[];
  error: string | null;
  rlsBlocked?: boolean;
  isLiveDb?: boolean;
}> {
  const { forceRefresh = false } = options;

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
        .select(
          'id, name, category, sku, stock, selling_price, purchase_price, reorder_level, supplier_id, image_path, created_at, suppliers(id, name)'
        )
        .order('created_at', { ascending: false });

      if (error) {
        return {
          data: sparePartsCache?.data ?? [],
          error: error.message,
          rlsBlocked: false,
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
        image_url: getSparePartImageUrl(row),
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

      // Clear any stale cache if the last product was removed in the Admin Panel
      sparePartsCache = null;

      // Check if 0 rows were returned while the caller is anonymous (`anon`)
      const { data: sessionData } = await supabase.auth.getSession();
      const isAnon = !sessionData?.session;

      return {
        data: [],
        error: null,
        rlsBlocked: isAnon,
        isLiveDb: true,
      };
    } catch (err) {
      return {
        data: sparePartsCache?.data ?? [],
        error:
          err instanceof Error
            ? err.message
            : 'Failed to connect to Supabase spare_parts table',
        rlsBlocked: false,
        isLiveDb: false,
      };
    } finally {
      inflightSparePartsPromise = null;
    }
  })();

  return inflightSparePartsPromise;
}

