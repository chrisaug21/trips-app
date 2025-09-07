import { requireAdmin } from '@/lib/auth'
import NewTripForm from './stepper'

export default async function NewTripPage() {
  await requireAdmin()
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Create a New Trip</h1>
      <NewTripForm />
    </div>
  )
}


