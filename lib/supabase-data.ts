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
  RotateCw,
  Sparkles,
  Layers,
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

/**
 * Presentation helper to attach Lucide icons, inferred categories,
 * and scope bullets to database service records for high-fidelity UI rendering.
 */
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

// In-memory cache store for live Supabase queries to eliminate redundant network roundtrips during SPA navigation
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL for stable master data

let servicesCache: CacheEntry<DbService[]> | null = null;
let inflightServicesPromise: Promise<{ data: DbService[]; error: string | null }> | null = null;

let areasCache: CacheEntry<DbServiceArea[]> | null = null;
let inflightAreasPromise: Promise<{ data: DbServiceArea[]; error: string | null }> | null = null;

let reviewsCache: CacheEntry<DbReview[]> | null = null;
let inflightReviewsPromise: Promise<{ data: DbReview[]; error: string | null }> | null = null;

let sparePartsCache: CacheEntry<DbSparePart[]> | null = null;
let inflightSparePartsPromise: Promise<{ data: DbSparePart[]; error: string | null }> | null = null;

/**
 * Get synchronously cached services if available and fresh (enables zero-latency initial state)
 */
export function getCachedServices(): DbService[] | null {
  if (servicesCache && Date.now() - servicesCache.timestamp < CACHE_TTL_MS) {
    return servicesCache.data;
  }
  return null;
}

/**
 * Get synchronously cached service areas if available and fresh
 */
export function getCachedServiceAreas(): DbServiceArea[] | null {
  if (areasCache && Date.now() - areasCache.timestamp < CACHE_TTL_MS) {
    return areasCache.data;
  }
  return null;
}

/**
 * Get synchronously cached reviews if available and fresh
 */
export function getCachedReviews(): DbReview[] | null {
  if (reviewsCache && Date.now() - reviewsCache.timestamp < CACHE_TTL_MS) {
    return reviewsCache.data;
  }
  return null;
}

/**
 * Get synchronously cached spare parts if available and fresh
 */
export function getCachedSpareParts(): DbSparePart[] | null {
  if (sparePartsCache && Date.now() - sparePartsCache.timestamp < CACHE_TTL_MS) {
    return sparePartsCache.data;
  }
  return null;
}

export function invalidateServicesCache(): void {
  servicesCache = null;
}

export function invalidateAreasCache(): void {
  areasCache = null;
}

export function invalidateReviewsCache(): void {
  reviewsCache = null;
}

export function invalidateSparePartsCache(): void {
  sparePartsCache = null;
}

export function clearAllDataCache(): void {
  servicesCache = null;
  areasCache = null;
  reviewsCache = null;
  sparePartsCache = null;
}

/**
 * Fetch active services directly from the live Supabase "services" table with intelligent caching.
 */
export async function fetchLiveServices(options: { forceRefresh?: boolean } = {}): Promise<{ data: DbService[]; error: string | null }> {
  const { forceRefresh = false } = options;

  if (!forceRefresh && servicesCache && Date.now() - servicesCache.timestamp < CACHE_TTL_MS) {
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

      const freshData = data ?? [];
      servicesCache = {
        data: freshData,
        timestamp: Date.now(),
      };
      return { data: freshData, error: null };
    } catch (err) {
      return {
        data: servicesCache?.data ?? [],
        error: err instanceof Error ? err.message : 'Failed to connect to Supabase services table',
      };
    } finally {
      inflightServicesPromise = null;
    }
  })();

  return inflightServicesPromise;
}

/**
 * Fetch active service areas directly from the live Supabase "service_areas" table with intelligent caching.
 */
export async function fetchLiveServiceAreas(options: { forceRefresh?: boolean } = {}): Promise<{ data: DbServiceArea[]; error: string | null }> {
  const { forceRefresh = false } = options;

  if (!forceRefresh && areasCache && Date.now() - areasCache.timestamp < CACHE_TTL_MS) {
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

      const freshData = data ?? [];
      areasCache = {
        data: freshData,
        timestamp: Date.now(),
      };
      return { data: freshData, error: null };
    } catch (err) {
      return {
        data: areasCache?.data ?? [],
        error: err instanceof Error ? err.message : 'Failed to connect to Supabase service_areas table',
      };
    } finally {
      inflightAreasPromise = null;
    }
  })();

  return inflightAreasPromise;
}

/**
 * Schema representing customer review records in Supabase:
 * - id: uuid or string
 * - name: text (customer name)
 * - rating: number (1 to 5)
 * - comment / text: review content
 * - service: text (optional service name)
 * - location / city: text (optional locality)
 * - verified: boolean (verified job flag supported by real records)
 * - created_at: timestamptz
 */
export interface DbReview {
  id: string;
  name: string;
  rating: number;
  text?: string | null;
  comment?: string | null;
  service?: string | null;
  location?: string | null;
  verified?: boolean;
  created_at?: string;
}

/**
 * Fetch genuine reviews directly from the live Supabase data source with intelligent caching.
 * If no review table or genuine records exist in the database, returns an empty array cleanly.
 */
export async function fetchLiveReviews(options: { forceRefresh?: boolean } = {}): Promise<{ data: DbReview[]; error: string | null }> {
  const { forceRefresh = false } = options;

  if (!forceRefresh && reviewsCache && Date.now() - reviewsCache.timestamp < CACHE_TTL_MS) {
    return { data: reviewsCache.data, error: null };
  }

  if (inflightReviewsPromise) {
    return inflightReviewsPromise;
  }

  inflightReviewsPromise = (async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, name, rating, comment, text, service, location, verified, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: reviewsCache?.data ?? [], error: error.message };
      }

      const freshData = (data as DbReview[]) ?? [];
      reviewsCache = {
        data: freshData,
        timestamp: Date.now(),
      };
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
 * Schema representing spare parts and inventory records in Supabase:
 * - id: uuid or string
 * - name: text (item name)
 * - category: text (e.g. Pipes & Fittings, Valves, Sanitary, Pumps)
 * - sku: text (stock keeping unit code)
 * - stock: number (current inventory count)
 * - selling_price: number (verified retail/selling price)
 * - purchase_price: number (procurement cost)
 * - reorder_level: number (minimum threshold)
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
  created_at?: string;
  brand?: string | null;
  description?: string | null;
  image_url?: string | null;
  unit?: string | null;
}

/**
 * Fetch genuine spare parts directly from the live Supabase "spare_parts" table with intelligent caching.
 */
export async function fetchLiveSpareParts(options: { forceRefresh?: boolean } = {}): Promise<{ data: DbSparePart[]; error: string | null }> {
  const { forceRefresh = false } = options;

  if (!forceRefresh && sparePartsCache && Date.now() - sparePartsCache.timestamp < CACHE_TTL_MS) {
    return { data: sparePartsCache.data, error: null };
  }

  if (inflightSparePartsPromise) {
    return inflightSparePartsPromise;
  }

  inflightSparePartsPromise = (async () => {
    try {
      const { data, error } = await supabase
        .from('spare_parts')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        return { data: sparePartsCache?.data ?? [], error: error.message };
      }

      const freshData = (data as DbSparePart[]) ?? [];
      sparePartsCache = {
        data: freshData,
        timestamp: Date.now(),
      };
      return { data: freshData, error: null };
    } catch (err) {
      return {
        data: sparePartsCache?.data ?? [],
        error: err instanceof Error ? err.message : 'Failed to connect to Supabase spare_parts table',
      };
    } finally {
      inflightSparePartsPromise = null;
    }
  })();

  return inflightSparePartsPromise;
}


