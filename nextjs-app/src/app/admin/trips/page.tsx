import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

async function fetchTrips() {
  const { data, error } = await supabaseAdmin
    .from('trips')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error('Failed to load trips')
  return { trips: data || [] } as { trips: any[] }
}

export default async function TripsAdminPage() {
  await requireAdmin()
  const { trips } = await fetchTrips()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trips</h1>
        <Link href="/admin/trips/new" className="btn btn-primary">New Trip</Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {trips.map((t) => (
              <tr key={t.id}>
                <td className="font-medium">{t.title}</td>
                <td>
                  <span className={`badge ${t.status === 'published' ? 'badge-success' : t.status === 'draft' ? 'badge-ghost' : 'badge-neutral'}`}>{t.status}</span>
                </td>
                <td>{new Date(t.updated_at).toLocaleString()}</td>
                <td className="flex gap-2 justify-end">
                  <Link href={`/admin/trips/${t.id}`} className="btn btn-sm">Edit</Link>
                  {t.status === 'draft' && (
                    <form action={`/admin/trips/${t.id}/publish`} method="post">
                      <button className="btn btn-sm btn-primary" type="submit">Publish</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


