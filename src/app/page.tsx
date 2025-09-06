import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to Trips App</h1>
          <p className="text-xl text-gray-600 mb-8">Your personal trip planning companion</p>
          
          <div className="space-x-4">
            <Link 
              href="/trips/example" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Example Trip
            </Link>
            <Link 
              href="/admin" 
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
