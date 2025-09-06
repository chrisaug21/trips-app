'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-browser'

export default function TestSessionFlowPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Check initial session
    checkSession()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session)
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log('Current session:', session)
      console.log('Session error:', error)
      setSession(session)
    } catch (error) {
      console.error('Error getting session:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: 'chris@chrisaug.com',
        options: {
          emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/callback`,
          shouldCreateUser: true
        }
      })

      if (error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage('Magic link sent! Check your email.')
      }
    } catch (error) {
      setMessage(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      setSession(null)
      setMessage('Logged out successfully')
    } catch (error) {
      setMessage(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Testing Session Flow</h1>
        <p className="text-gray-700">Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Session Flow Test</h1>
      
      {message && (
        <div className="mb-4 p-4 bg-blue-100 border border-blue-200 rounded text-blue-800">
          {message}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Current Session Status</h2>
        
        {session ? (
          <div className="bg-green-100 p-4 rounded border border-green-200">
            <h3 className="text-lg font-semibold mb-2 text-green-800">✅ Session Active</h3>
            <div className="text-green-700 space-y-1">
              <p><strong className="text-green-800">Email:</strong> <span className="text-blue-600">{session.user.email}</span></p>
              <p><strong className="text-green-800">User ID:</strong> <span className="text-gray-600 font-mono text-sm">{session.user.id}</span></p>
              <p><strong className="text-green-800">Expires:</strong> <span className="text-gray-600">{new Date(session.expires_at * 1000).toLocaleString()}</span></p>
            </div>
            <div className="mt-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-red-100 p-4 rounded border border-red-200">
            <h3 className="text-lg font-semibold mb-2 text-red-800">❌ No Session</h3>
            <p className="text-red-700">No active session found.</p>
            <div className="mt-4">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2 text-gray-900">Test Steps:</h3>
        <ol className="list-decimal list-inside space-y-1 text-gray-700">
          <li>Click "Send Magic Link" if not logged in</li>
          <li>Check your email and click the magic link</li>
          <li>You should be redirected to <code className="bg-gray-200 px-1 rounded">/admin</code></li>
          <li>Come back to this page and check if session is still active</li>
          <li>Check <a href="/cookie-debug" className="text-blue-600 underline">/cookie-debug</a> for Supabase cookies</li>
        </ol>
      </div>
    </div>
  )
}
