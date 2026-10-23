import { supabase } from '@/lib/supabase';

/**
 * Exact existing public Supabase Storage bucket name and folder used by the Admin Panel
 * for storing spare part product images.
 */
export const SPARE_PARTS_BUCKET_NAME = 'spare-part-images';
export const SPARE_PARTS_FOLDER_PREFIX = 'parts/';

export interface SparePartImageSource {
  image_path?: string | null;
  image_url?: string | null;
}

/**
 * Normalizes a storage path saved in `public.spare_parts.image_path` by the Admin Panel.
 * Handles:
 * - Full Supabase Storage URLs (extracts the object path inside `spare-part-images`)
 * - Leading slashes (e.g. `/parts/file.jpg` -> `parts/file.jpg`)
 * - Accidental bucket prefix (e.g. `spare-part-images/parts/file.jpg` -> `parts/file.jpg`)
 * - Pre-encoded URI segments (e.g. `parts/my%20image.png` -> `parts/my image.png`)
 * - Bare filenames without folder prefix (e.g. `file.jpg` -> `parts/file.jpg`)
 * - Spaces in folder and file names
 */
export function normalizeSparePartStoragePath(rawPath: string): string | null {
  const trimmed = rawPath.trim();
  if (!trimmed) return null;

  let cleanPath = trimmed;

  // If a full Supabase Storage URL was passed, extract the bucket-relative object path
  const storageUrlMatch = cleanPath.match(
    /\/storage\/v1\/object\/public\/(?:spare-part-images|Spare(?:\s|%20)Parts)\/(.+)$/i
  );
  if (storageUrlMatch?.[1]) {
    cleanPath = storageUrlMatch[1];
  } else if (/^https?:\/\//i.test(cleanPath)) {
    // External non-Supabase URL is handled directly by getSparePartImageUrl
    return null;
  }

  cleanPath = cleanPath.replace(/^\/+/, '');
  try {
    cleanPath = decodeURIComponent(cleanPath);
  } catch {
    // Keep original if it contains a literal % not part of an escape sequence
  }

  // Strip full Supabase storage prefix if stored accidentally as a relative string
  cleanPath = cleanPath.replace(
    /^storage\/v1\/object\/public\/(?:spare-part-images|Spare Parts)\//i,
    ''
  );
  // Strip leading bucket name prefix if stored as "spare-part-images/parts/<filename>"
  cleanPath = cleanPath.replace(/^(?:spare-part-images|Spare Parts)\//i, '');
  cleanPath = cleanPath.replace(/^\/+/, '');

  if (!cleanPath) return null;

  // Ensure bare filenames resolve inside the existing "parts/" folder
  if (!cleanPath.includes('/')) {
    cleanPath = `${SPARE_PARTS_FOLDER_PREFIX}${cleanPath}`;
  }

  return cleanPath;
}

/**
 * Generates the public URL for a spare part's image from the existing "spare-part-images"
 * Supabase Storage bucket ("parts/" folder) using the shared Supabase client.
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

  // First try resolving as a Supabase Storage path in "spare-part-images"
  const normalizedPath = normalizeSparePartStoragePath(trimmed);
  if (normalizedPath) {
    const { data } = supabase.storage
      .from(SPARE_PARTS_BUCKET_NAME)
      .getPublicUrl(normalizedPath);

    return data?.publicUrl || null;
  }

  // If the record stores a full external HTTP(S) URL
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      return new URL(trimmed).toString();
    } catch {
      return encodeURI(trimmed);
    }
  }

  return null;
}

/**
 * Uploads a product image file to the existing "spare-part-images" Supabase Storage bucket
 * inside the "parts/" folder and returns the relative `image_path` (e.g. `parts/<filename>`)
 * to store in `public.spare_parts.image_path`.
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
    const targetStoragePath = `${SPARE_PARTS_FOLDER_PREFIX}${uniqueFileName}`;

    const { data, error } = await supabase.storage
      .from(SPARE_PARTS_BUCKET_NAME)
      .upload(targetStoragePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || undefined,
      });

    if (error || !data?.path) {
      return {
        imagePath: null,
        publicUrl: null,
        error:
          error?.message ||
          `Failed to upload image to "${SPARE_PARTS_BUCKET_NAME}" bucket`,
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
          : `Unexpected error uploading to "${SPARE_PARTS_BUCKET_NAME}" bucket`,
    };
  }
}
