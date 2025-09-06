'use client'

import { useEffect, useState } from 'react'

export default function DebugEnvPage() {
  const [envVars, setEnvVars] = useState<any>({})

  useEffect(() => {
    setEnvVars({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
      adminEmail: process.env.ADMIN_EMAIL,
    })
  }, [])

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Debug</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Client-side Environment Variables</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {envVars.supabaseUrl || 'Not set'}</p>
            <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {envVars.supabaseAnonKey || 'Not set'}</p>
            <p><strong>ADMIN_EMAIL:</strong> {envVars.adminEmail || 'Not set (server-only)'}</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Current URL Info</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'Loading...'}</p>
            <p><strong>Port:</strong> {typeof window !== 'undefined' ? window.location.port : 'Loading...'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

