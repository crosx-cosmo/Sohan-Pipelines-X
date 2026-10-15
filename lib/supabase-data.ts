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

/**
 * Fetch active services directly from the live Supabase "services" table.
 */
export async function fetchLiveServices(): Promise<{ data: DbService[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('id, name, slug, description, price, duration, active, created_at')
      .eq('active', true)
      .order('price', { ascending: true });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: data ?? [], error: null };
  } catch (err) {
    return {
      data: [],
      error: err instanceof Error ? err.message : 'Failed to connect to Supabase services table',
    };
  }
}

/**
 * Fetch active service areas directly from the live Supabase "service_areas" table.
 */
export async function fetchLiveServiceAreas(): Promise<{ data: DbServiceArea[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('service_areas')
      .select('id, district, subdivision, block, locality, pincode, active, created_at')
      .eq('active', true)
      .order('district', { ascending: true })
      .order('locality', { ascending: true });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: data ?? [], error: null };
  } catch (err) {
    return {
      data: [],
      error: err instanceof Error ? err.message : 'Failed to connect to Supabase service_areas table',
    };
  }
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
 * Fetch genuine reviews directly from the live Supabase data source.
 * If no review table or genuine records exist in the database, returns an empty array cleanly.
 */
export async function fetchLiveReviews(): Promise<{ data: DbReview[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('id, name, rating, comment, text, service, location, verified, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data as DbReview[]) ?? [], error: null };
  } catch (err) {
    return {
      data: [],
      error: err instanceof Error ? err.message : 'Failed to connect to Supabase reviews table',
    };
  }
}

