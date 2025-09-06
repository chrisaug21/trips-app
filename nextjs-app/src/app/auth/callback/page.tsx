'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('Completing sign-in...')

  useEffect(() => {
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/admin'

    async function run() {
      if (!code) {
        router.replace(`/auth/auth-code-error`)
        return
      }
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (error || !data.session) {
          setMessage(`Authentication Error: ${error?.message ?? 'Unknown error'}`)
          router.replace(`/auth/auth-code-error?error=${encodeURIComponent(error?.message ?? 'Unknown error')}`)
          return
        }
        // Bridge the client session to the server by setting cookies via a route handler
        try {
          await fetch('/auth/set-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
            }),
          })
        } catch {}
        router.replace(next)
      } catch (e: any) {
        setMessage(`Authentication Error: ${e?.message ?? e}`)
        router.replace(`/auth/auth-code-error?error=${encodeURIComponent(e?.message ?? 'Unknown error')}`)
      }
    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  )
}


