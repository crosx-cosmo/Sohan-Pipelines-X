import { supabase } from '@/lib/supabase';

/**
 * Exact existing public Supabase Storage bucket name used by the Admin Panel
 * for storing spare part product images.
 */
export const SPARE_PARTS_BUCKET_NAME = 'Spare Parts';

export interface SparePartImageSource {
  image_path?: string | null;
  image_url?: string | null;
}

/**
 * Normalizes a storage path saved in `public.spare_parts.image_path` by the Admin Panel.
 * Handles:
 * - Leading slashes (e.g. `/valves/ball valve.jpg` -> `valves/ball valve.jpg`)
 * - Accidental bucket prefix (e.g. `Spare Parts/valves/ball valve.jpg` -> `valves/ball valve.jpg`)
 * - Pre-encoded URI segments (e.g. `Spare%20Parts/my%20image.png` -> `my image.png`)
 * - Spaces in folder and file names
 */
export function normalizeSparePartStoragePath(rawPath: string): string | null {
  const trimmed = rawPath.trim();
  if (!trimmed) return null;

  let cleanPath = trimmed.replace(/^\/+/, '');
  try {
    cleanPath = decodeURIComponent(cleanPath);
  } catch {
    // Keep original if it contains a literal % not part of an escape sequence
  }

  // Strip full Supabase storage prefix if stored accidentally as a relative string
  cleanPath = cleanPath.replace(
    /^storage\/v1\/object\/public\/Spare Parts\//i,
    ''
  );
  // Strip leading bucket name prefix if the Admin Panel stored "Spare Parts/<filename>"
  cleanPath = cleanPath.replace(/^Spare Parts\//i, '');
  cleanPath = cleanPath.replace(/^\/+/, '');

  return cleanPath || null;
}

/**
 * Generates the public URL for a spare part's image from the existing "Spare Parts"
 * Supabase Storage bucket using the shared Supabase client.
 *
 * Returns `null` if the product does not have an `image_path` (or `image_url`),
 * allowing the UI to render a polished fallback placeholder instead of a broken image
 * or hardcoded unrelated photo.
 */
export function getSparePartImageUrl(
  input?: SparePartImageSource | string | null
): string | null {
  if (!input) return null;

  const rawPath =
    typeof input === 'string'
      ? input
      : input.image_path || input.image_url || null;

  if (!rawPath || typeof rawPath !== 'string') return null;

  const trimmed = rawPath.trim();
  if (!trimmed) return null;

  // If the database record already stores a full HTTP(S) URL
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      return new URL(trimmed).toString();
    } catch {
      return encodeURI(trimmed);
    }
  }

  const normalizedPath = normalizeSparePartStoragePath(trimmed);
  if (!normalizedPath) return null;

  const { data } = supabase.storage
    .from(SPARE_PARTS_BUCKET_NAME)
    .getPublicUrl(normalizedPath);

  return data?.publicUrl || null;
}

/**
 * Uploads a product image file to the existing "Spare Parts" Supabase Storage bucket
 * and returns the relative `image_path` to store in `public.spare_parts.image_path`.
 */
export async function uploadSparePartImageToBucket(
  file: File,
  skuOrName?: string
): Promise<{
  imagePath: string | null;
  publicUrl: string | null;
  error: string | null;
}> {
  try {
    const ext =
      file.name.includes('.')
        ? file.name.split('.').pop()?.toLowerCase() || 'jpg'
        : 'jpg';
    const baseSlug = (skuOrName || file.name.replace(/\.[^/.]+$/, '') || 'part')
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48);

    const uniqueFileName = `${baseSlug || 'part'}-${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from(SPARE_PARTS_BUCKET_NAME)
      .upload(uniqueFileName, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || undefined,
      });

    if (error || !data?.path) {
      return {
        imagePath: null,
        publicUrl: null,
        error: error?.message || 'Failed to upload image to "Spare Parts" bucket',
      };
    }

    const publicUrl = getSparePartImageUrl(data.path);
    return {
      imagePath: data.path,
      publicUrl,
      error: null,
    };
  } catch (err) {
    return {
      imagePath: null,
      publicUrl: null,
      error:
        err instanceof Error
          ? err.message
          : 'Unexpected error uploading to "Spare Parts" bucket',
    };
  }
}
