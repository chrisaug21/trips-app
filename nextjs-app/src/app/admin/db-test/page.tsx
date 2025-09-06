import { supabaseAdmin } from '@/lib/supabase'

export default async function DbTestPage() {
  try {
    // Simple select to get all trips
    const { data, error } = await supabaseAdmin
      .from('trips')
      .select('*')

    if (error) {
      throw error
    }

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
        <div className="text-green-600 font-semibold mb-2">
          DB connected ✅
        </div>
        <div className="text-sm mb-2">
          Trips count: {data?.length || 0}
        </div>
        {data && data.length > 0 && (
          <div className="text-sm">
            First trip ID: {data[0].id}
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Database connection error:', error)
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
        <div className="text-red-600 font-semibold mb-2">
          ❌ Database connection failed
        </div>
        <div className="text-sm text-gray-600">
          Error: {error instanceof Error ? error.message : String(error)}
        </div>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Troubleshooting:</h3>
          <ul className="text-sm space-y-1">
            <li>• Check that SUPABASE_SERVICE_ROLE_KEY is set in your environment</li>
            <li>• Verify your Supabase URL is correct</li>
            <li>• Ensure your database is running and accessible</li>
            <li>• Check that the trips table exists in your database</li>
          </ul>
        </div>
      </div>
    )
  }
}
