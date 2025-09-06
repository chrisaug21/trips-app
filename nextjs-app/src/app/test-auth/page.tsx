'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function TestAuthPage() {
  const [email, setEmail] = useState('chris@chrisaug.com')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [session, setSession] = useState<any>(null)

  const handleLogin = async () => {
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/callback`,
          shouldCreateUser: true
        },
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

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setSession(session)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auth Test Page</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Current URL Info</h2>
          <p><strong>Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'Loading...'}</p>
          <p><strong>Callback URL:</strong> {typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'Loading...'}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Send Magic Link</h2>
          <div className="flex gap-2 mb-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3 py-2 border rounded"
              placeholder="Enter email"
            />
            <Button onClick={handleLogin} disabled={loading}>
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </div>
          {message && (
            <p className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Session Status</h2>
          <div className="flex gap-2 mb-2">
            <Button onClick={checkSession} variant="outline">
              Check Session
            </Button>
            {session && (
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            )}
          </div>
          {session ? (
            <div className="bg-green-100 p-3 rounded">
              <p><strong>Authenticated:</strong> Yes</p>
              <p><strong>Email:</strong> {session.user.email}</p>
              <p><strong>User ID:</strong> {session.user.id}</p>
            </div>
          ) : (
            <div className="bg-gray-100 p-3 rounded">
              <p><strong>Authenticated:</strong> No</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
