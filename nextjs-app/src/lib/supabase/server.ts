// Node runtime only — server-side helpers
export const runtime = 'nodejs'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function getServerSupabase() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key: string) => cookieStore.get(key)?.value,
      },
    }
  )
  return supabase
}
