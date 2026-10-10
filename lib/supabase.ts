import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://jlfqodfdqkbunqfgffut.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
  // This only warns at build/runtime start — it does not throw, so builds
  // without the env vars configured still succeed. Any real call to
  // `supabase` will fail until NEXT_PUBLIC_SUPABASE_URL and
  // NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set (see SUPABASE_SETUP.md).
  console.warn(
    '[supabase] NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are not set. ' +
      'Booking and lookup features will not work until these are configured.'
  );
}

/**
 * Single shared Supabase client for the whole app. This project uses ONLY
 * this Supabase project as its database — see SUPABASE_SETUP.md for the
 * assumed schema and required environment variables. Only the publishable
 * (anon) key is ever used here; it is safe to expose on the client because
 * all access is expected to be governed by the project's existing RLS
 * policies.
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});
