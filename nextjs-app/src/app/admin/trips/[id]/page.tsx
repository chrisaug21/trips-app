import { requireAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

async function fetchTrip(id: string) {
  const { data, error } = await supabaseAdmin
    .from('trips')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error || !data) throw new Error('Failed to load trip')
  return { trip: data } as { trip: any }
}

export default async function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const { trip } = await fetchTrip(id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Trip</h1>
        <div className="flex gap-2">
          {trip.status === 'draft' && (
            <form action={`/admin/trips/${trip.id}/publish`} method="post">
              <button className="btn btn-primary">Publish</button>
            </form>
          )}
        </div>
      </div>
      <div className="grid gap-4">
        <div className="form-control">
          <label className="label"><span className="label-text">Title</span></label>
          <input defaultValue={trip.title} className="input input-bordered" name="title" form="edit-form" />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Description</span></label>
          <textarea defaultValue={trip.description || ''} className="textarea textarea-bordered" name="description" form="edit-form" />
        </div>
        <form id="edit-form" action={`/admin/trips/${trip.id}/update`} method="post">
          <button className="btn btn-primary">Save</button>
        </form>
      </div>
    </div>
  )
}


