export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Trip: {slug}</h1>
      <p className="text-gray-600">This is a placeholder for the trip details page.</p>
    </div>
  )
}
