import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AuthCodeErrorPageProps {
  searchParams: { error?: string }
}

export default function AuthCodeErrorPage({ searchParams }: AuthCodeErrorPageProps) {
  const errorMessage = searchParams.error

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-red-600">
              Authentication Error
            </CardTitle>
            <CardDescription className="text-center">
              There was an error with your authentication link.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              The authentication link may have expired or been used already.
            </p>
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <p className="text-sm text-red-700">
                  <strong>Error details:</strong> {errorMessage}
                </p>
              </div>
            )}
            <p className="text-gray-600 mb-6">
              Please try logging in again.
            </p>
            <Link href="/login">
              <Button>
                Try Again
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
