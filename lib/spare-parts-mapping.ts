/**
 * Supabase Storage Asset Mapping for SOHAN PIPELINES Spare Parts & Hardware
 *
 * Uses verified image assets from the existing "Plumbing Assets" bucket in Supabase Storage:
 * https://jlfqodfdqkbunqfgffut.supabase.co/storage/v1/object/public/Plumbing%20Assets/
 */

export const SUPABASE_STORAGE_BUCKET_URL =
  'https://jlfqodfdqkbunqfgffut.supabase.co/storage/v1/object/public/Plumbing%20Assets';

export const SPARE_PARTS_STORAGE_ASSETS = {
  // Heavy pipeline, CPVC/UPVC pipes, solvent welding, couplings, elbows
  PIPES_AND_FITTINGS: `${SUPABASE_STORAGE_BUCKET_URL}/IMG-20260911-WA0003.jpg`,

  // Taps, bib cocks, angle valves, flow outlets, pillar taps
  TAPS_AND_VALVES: `${SUPABASE_STORAGE_BUCKET_URL}/IMG-20261014-WA0005.jpg`,

  // Sanitaryware, dual-flush cisterns, commode mechanisms, urinal fittings
  SANITARYWARE_AND_FLUSH: `${SUPABASE_STORAGE_BUCKET_URL}/IMG-20261014-WA0006.jpg`,

  // Geysers, water heaters, thermal connection pipes, safety pressure valves
  WATER_HEATERS_AND_HOT_WATER: `${SUPABASE_STORAGE_BUCKET_URL}/IMG-20261014-WA0007.jpg`,

  // Wash basins, faucets, bottle traps, waste couplings, sink strainers
  BASINS_AND_FAUCETS: `${SUPABASE_STORAGE_BUCKET_URL}/IMG-20261014-WA0008.jpg`,

  // Shower enclosures, shower heads, single-lever diverters, concealed bodies
  SHOWER_AND_MIXERS: `${SUPABASE_STORAGE_BUCKET_URL}/IMG-20261014-WA0004.jpg`,

  // Finishing trims, shower accessories, wall brackets
  FIXTURES_AND_FINISH: `${SUPABASE_STORAGE_BUCKET_URL}/IMG-20261014-WA0009.jpg`,
} as const;

/**
 * Resolves the appropriate product image from the Supabase Storage bucket
 * based on explicit image_url column if present, or deterministic category & name mapping.
 */
export function resolveProductImage(part: {
  name: string;
  category?: string | null;
  image_url?: string | null;
}): string {
  // 1. If the database record contains a valid image_url, prefer it
  if (part.image_url && typeof part.image_url === 'string' && part.image_url.startsWith('http')) {
    return part.image_url;
  }

  const nameLower = (part.name || '').toLowerCase();
  const categoryLower = (part.category || '').toLowerCase();
  const combined = `${nameLower} ${categoryLower}`;

  // 2. Geyser & Water Heater related components
  if (
    combined.includes('geyser') ||
    combined.includes('heater') ||
    combined.includes('hot water') ||
    combined.includes('relief valve') ||
    combined.includes('thermal')
  ) {
    return SPARE_PARTS_STORAGE_ASSETS.WATER_HEATERS_AND_HOT_WATER;
  }

  // 3. Sanitaryware, commodes, flush valves, cisterns
  if (
    combined.includes('sanitary') ||
    combined.includes('flush') ||
    combined.includes('commode') ||
    combined.includes('cistern') ||
    combined.includes('toilet') ||
    combined.includes('urinal')
  ) {
    return SPARE_PARTS_STORAGE_ASSETS.SANITARYWARE_AND_FLUSH;
  }

  // 4. Wash basins, vanity faucets, sink waste, bottle traps
  if (
    combined.includes('basin') ||
    combined.includes('sink') ||
    combined.includes('bottle trap') ||
    combined.includes('waste coupling')
  ) {
    return SPARE_PARTS_STORAGE_ASSETS.BASINS_AND_FAUCETS;
  }

  // 5. Shower heads, diverters, enclosures
  if (
    combined.includes('shower') ||
    combined.includes('diverter') ||
    combined.includes('enclosure')
  ) {
    return SPARE_PARTS_STORAGE_ASSETS.SHOWER_AND_MIXERS;
  }

  // 6. Taps, bib cocks, pillar taps, water outlets
  if (
    combined.includes('tap') ||
    combined.includes('cock') ||
    combined.includes('faucet') ||
    combined.includes('bib') ||
    combined.includes('outlet')
  ) {
    return SPARE_PARTS_STORAGE_ASSETS.TAPS_AND_VALVES;
  }

  // 7. Pipes, fittings, couplers, elbows, tees, solvent welds, valves
  if (
    combined.includes('pipe') ||
    combined.includes('fitting') ||
    combined.includes('cpvc') ||
    combined.includes('upvc') ||
    combined.includes('pvc') ||
    combined.includes('elbow') ||
    combined.includes('tee') ||
    combined.includes('union') ||
    combined.includes('coupling') ||
    combined.includes('socket') ||
    combined.includes('solvent') ||
    combined.includes('valve') ||
    combined.includes('tank')
  ) {
    return SPARE_PARTS_STORAGE_ASSETS.PIPES_AND_FITTINGS;
  }

  // Default authentic hardware asset from the bucket
  return SPARE_PARTS_STORAGE_ASSETS.PIPES_AND_FITTINGS;
}
