import { getServerSession } from '@/lib/auth'

export default async function AuthTestPage() {
  const session = await getServerSession()
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      {session ? (
        <div className="space-y-4">
          <div className="text-green-600 font-semibold">
            ✅ Authenticated
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Session Details:</h3>
            <div className="text-sm space-y-1">
              <div><strong>Email:</strong> {session.user.email}</div>
              <div><strong>User ID:</strong> {session.user.id}</div>
              <div><strong>Last Sign In:</strong> {new Date(session.user.last_sign_in_at || '').toLocaleString()}</div>
              <div><strong>Created:</strong> {new Date(session.user.created_at).toLocaleString()}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-red-600 font-semibold">
          ❌ Not authenticated
        </div>
      )}
    </div>
  )
}

