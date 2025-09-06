import { createServerSupabaseClient } from './supabase-server'
import { cookies } from 'next/headers'

export async function getServerSessionDebug() {
  try {
    console.log('Creating server supabase client...')
    
    // Debug: Show all cookies
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    console.log('All cookies:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value })))
    
    const supabase = await createServerSupabaseClient()
    console.log('Server supabase client created')
    
    console.log('Getting session...')
    const { data: { session }, error } = await supabase.auth.getSession()
    console.log('Session result:', { session: session ? 'Found' : 'None', error: error?.message })
    
    if (error) {
      console.error('Error getting session:', error)
      return { session: null, error: error.message, cookies: allCookies.map(c => c.name) }
    }
    
    return { session, error: null, cookies: allCookies.map(c => c.name) }
  } catch (error) {
    console.error('Exception in getServerSessionDebug:', error)
    return { session: null, error: error instanceof Error ? error.message : String(error), cookies: [] }
  }
}
