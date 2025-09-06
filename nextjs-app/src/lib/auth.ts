import { createServerSupabaseClient } from './supabase-server'
import { redirect } from 'next/navigation'

export async function getServerSession() {
  const supabase = await createServerSupabaseClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error getting session:', error)
    return null
  }
  
  return session
}

export async function requireAuth() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }
  
  return session
}

export async function requireAdmin() {
  try {
    const session = await requireAuth()
    const adminEmail = process.env.ADMIN_EMAIL
    
    if (!adminEmail) {
      throw new Error('ADMIN_EMAIL environment variable not set')
    }
    
    if (session.user.email !== adminEmail) {
      redirect('/unauthorized')
    }
    
    return session
  } catch (error) {
    console.error('Auth error:', error)
    redirect('/login')
  }
}
