import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://jlfqodfdqkbunqfgffut.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_YFmgzG2dgPYxm-zCpQRUig_MSYh6T5O';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
  console.warn(
    '[supabase] NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are not set in env; using project defaults.'
  );
}

/**
 * Single shared Supabase client for the whole app.
 * Persist session is enabled in the browser so that if the administrator signs in
 * to sync RLS-protected tables (such as `spare_parts`), the authenticated JWT
 * is automatically sent with subsequent queries.
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
    detectSessionInUrl: false,
  },
});
