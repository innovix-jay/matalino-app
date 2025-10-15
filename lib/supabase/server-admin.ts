import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Create Supabase client with service role key
 * USE ONLY IN SERVER-SIDE CODE (API routes, webhooks, server actions)
 * This bypasses Row Level Security - use with caution
 */
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
