export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const base = process.env.NEXT_PUBLIC_SITE_URL || ''
  const url = `${base}/api/public/trips/${slug}`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Trip not found</h1>
        <p className="text-gray-600">This trip may be private or unpublished.</p>
      </div>
    )
  }
  const { trip } = await res.json()
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{trip.title}</h1>
      <p className="text-gray-600 mb-4">{trip.description}</p>
      <div className="text-sm opacity-70">Slug: {trip.slug}</div>
    </div>
  )
}
