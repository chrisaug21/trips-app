'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CheckSessionPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setLoading(false)
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session)
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Session Check</h1>
      
      {session ? (
        <div className="bg-green-100 p-4 rounded border border-green-200">
          <h2 className="text-lg font-semibold mb-2 text-green-800">✅ Authenticated</h2>
          <div className="text-green-700 space-y-1">
            <p><strong className="text-green-800">Email:</strong> <span className="text-blue-600">{session.user.email}</span></p>
            <p><strong className="text-green-800">User ID:</strong> <span className="text-gray-600 font-mono text-sm">{session.user.id}</span></p>
            <p><strong className="text-green-800">Expires:</strong> <span className="text-gray-600">{new Date(session.expires_at * 1000).toLocaleString()}</span></p>
          </div>
          <div className="mt-4">
            <a href="/admin" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2 transition-colors">Go to Admin</a>
            <button 
              onClick={async () => {
                await supabase.auth.signOut()
                setSession(null)
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-red-100 p-4 rounded border border-red-200">
          <h2 className="text-lg font-semibold mb-2 text-red-800">❌ Not Authenticated</h2>
          <p className="text-red-700">No active session found.</p>
          <div className="mt-4">
            <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">Go to Login</a>
          </div>
        </div>
      )}
    </div>
  )
}
