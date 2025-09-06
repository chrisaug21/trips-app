export default async function AuthCodeErrorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const error = typeof sp.error === 'string' ? sp.error : undefined

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Auth error</h1>
      <p className="mt-2">
        {error ? `Something went wrong: ${error}` : 'Unknown auth error.'}
      </p>
    </div>
  )
}