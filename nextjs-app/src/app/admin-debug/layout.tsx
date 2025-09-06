import { getServerSessionDebug } from '@/lib/auth-debug'
import { LogoutButton } from '@/components/logout-button'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminDebugLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Debug version - show session info instead of redirecting
  const { session, error, cookies } = await getServerSessionDebug()
  const adminEmail = process.env.ADMIN_EMAIL
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Debug Dashboard
              </h1>
            </div>
            <div className="flex items-center">
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Server-Side Session Debug</h2>
          <div className="space-y-2 text-gray-800">
            <p><strong className="text-gray-900">Session:</strong> <span className={session ? 'text-green-600' : 'text-red-600'}>{session ? 'Found' : 'None'}</span></p>
            <p><strong className="text-gray-900">Error:</strong> <span className={error ? 'text-red-600' : 'text-green-600'}>{error || 'None'}</span></p>
            <p><strong className="text-gray-900">Admin Email:</strong> <span className="text-blue-600">{adminEmail}</span></p>
            <p><strong className="text-gray-900">Cookies Found:</strong> <span className="text-purple-600">{cookies?.length || 0}</span> <span className="text-gray-600">({cookies?.join(', ') || 'None'})</span></p>
            {session && (
              <>
                <p><strong className="text-gray-900">User Email:</strong> <span className="text-blue-600">{session.user.email}</span></p>
                <p><strong className="text-gray-900">User ID:</strong> <span className="text-gray-600 font-mono text-sm">{session.user.id}</span></p>
                <p><strong className="text-gray-900">Email Match:</strong> <span className={session.user.email === adminEmail ? 'text-green-600' : 'text-red-600'}>{session.user.email === adminEmail ? 'Yes' : 'No'}</span></p>
              </>
            )}
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}
