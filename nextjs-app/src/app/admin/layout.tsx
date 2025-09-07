import { getServerSession } from '@/lib/auth'
import { LogoutButton } from '@/components/logout-button'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated and is admin
  const session = await getServerSession()
  const adminEmail = process.env.ADMIN_EMAIL
  
  if (!session) {
    redirect('/login')
  }
  
  if (!adminEmail) {
    throw new Error('ADMIN_EMAIL environment variable not set')
  }
  
  if (session.user.email !== adminEmail) {
    redirect('/unauthorized')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center">
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
