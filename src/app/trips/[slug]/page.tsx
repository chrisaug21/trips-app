export default function TripPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Trip: {params.slug}</h1>
      <p className="text-gray-600">This is a placeholder for the trip details page.</p>
    </div>
  )
}
