import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function DebugPage() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
        <div className="space-y-4">
          <div>
            <strong>Session:</strong> {session ? 'Found' : 'None'}
          </div>
          <div>
            <strong>Error:</strong> {error ? error.message : 'None'}
          </div>
          <div>
            <strong>Admin Email:</strong> {process.env.ADMIN_EMAIL}
          </div>
          {session && (
            <div>
              <strong>User Email:</strong> {session.user.email}
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Debug Page - Error</h1>
        <div className="text-red-600">
          <strong>Error:</strong> {error instanceof Error ? error.message : String(error)}
        </div>
      </div>
    )
  }
}

