export const runtime = 'nodejs'

import { getServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/admin'

  // Create a debug response
  const debugInfo = {
    code: code ? 'Present' : 'Missing',
    next,
    origin,
    userAgent: request.headers.get('user-agent'),
    referer: request.headers.get('referer'),
    cookies: request.cookies.getAll().map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' }))
  }

  if (code) {
    const supabase = getServerSupabase()
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    debugInfo.session = data.session ? {
      user: data.user?.email,
      expiresAt: data.session.expires_at
    } : null
    
    debugInfo.error = error?.message || null

    if (!error && data.session) {
      // Success - redirect to admin
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return debug info as HTML
  const html = `
    <html>
      <head><title>Auth Callback Debug</title></head>
      <body>
        <h1>Auth Callback Debug</h1>
        <pre>${JSON.stringify(debugInfo, null, 2)}</pre>
        <p><a href="/admin">Try Admin</a></p>
        <p><a href="/login">Back to Login</a></p>
      </body>
    </html>
  `
  
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' }
  })
}

