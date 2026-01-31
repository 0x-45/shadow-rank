import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check for valid configuration
  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl.includes('your_') || supabaseAnonKey.includes('your_')) {
    // Return a mock client for build time / unconfigured state
    // This prevents build errors when env vars aren't set
    if (typeof window === 'undefined') {
      // During SSR/build, create a minimal mock
      return {
        auth: {
          getUser: async () => ({ data: { user: null }, error: null }),
          signInWithOAuth: async () => ({ data: null, error: new Error('Supabase not configured') }),
          signOut: async () => ({ error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        },
        from: () => ({
          select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
          insert: async () => ({ data: null, error: null }),
          update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
          upsert: async () => ({ data: null, error: null }),
        }),
      } as unknown as SupabaseClient;
    }
    
    throw new Error(
      'Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.'
    );
  }

  if (!client) {
    client = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  return client;
}
