import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AdminPage() {
  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Trips Management</CardTitle>
            <CardDescription className="text-gray-700">Manage your trips and itineraries</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">View Trips</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Database Test</CardTitle>
            <CardDescription className="text-gray-700">Test database connection and queries</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/db-test">
              <Button variant="outline">Test Database</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Auth Test</CardTitle>
            <CardDescription className="text-gray-700">Verify authentication is working</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/auth-test">
              <Button variant="outline">Test Auth</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
