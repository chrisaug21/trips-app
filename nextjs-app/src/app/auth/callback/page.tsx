import { Suspense } from 'react'
import CallbackClient from './CallbackClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackClient />
    </Suspense>
  )
}


