import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { config } from '../config'

const { url, anonKey } = config.supabase

/** Shared Supabase client, or null when no credentials are configured. */
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { persistSession: false },
        realtime: { params: { eventsPerSecond: 5 } },
      })
    : null
