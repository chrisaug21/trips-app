'use client'

import { useEffect, useState } from 'react'

export default function CookieDebugPage() {
  const [cookies, setCookies] = useState<string[]>([])

  useEffect(() => {
    // Get all cookies from the browser
    const allCookies = document.cookie.split(';').map(cookie => cookie.trim()).filter(cookie => cookie.length > 0)
    console.log('Raw document.cookie:', document.cookie)
    console.log('Parsed cookies:', allCookies)
    setCookies(allCookies)
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Cookie Debug (Client-Side)</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Browser Cookies</h2>
        <div className="space-y-2">
          <p className="text-gray-700"><strong>Total Cookies:</strong> {cookies.length}</p>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2 text-gray-900">All Cookies:</h3>
            {cookies.length > 0 ? (
              <ul className="space-y-1">
                {cookies.map((cookie, index) => (
                  <li key={index} className="text-sm font-mono text-gray-700">
                    {cookie}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No cookies found</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded">
        <h3 className="font-semibold mb-2 text-blue-900">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-blue-800">
          <li>Make sure you're logged in (check <a href="/check-session" className="underline">/check-session</a>)</li>
          <li>Look for cookies that start with "sb-" or contain "auth"</li>
          <li>Compare with what the server sees in <a href="/admin-debug" className="underline">/admin-debug</a></li>
        </ol>
      </div>
    </div>
  )
}
