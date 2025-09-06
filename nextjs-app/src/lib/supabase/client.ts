// Browser/client only — put inside 'use client' components
import { createClient } from '@supabase/supabase-js'

export function getBrowserSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
