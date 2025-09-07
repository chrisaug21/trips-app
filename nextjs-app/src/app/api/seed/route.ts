import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  const sampleTrips = [
    {
      slug: `sample-paris-${Math.random().toString(36).slice(2,7)}`,
      title: 'Paris Long Weekend',
      description: 'Art, cafes, and riverside walks',
      status: 'published',
      published: true,
      created_by: '00000000-0000-0000-0000-000000000000',
      metadata: { geographies: { countries: ['France'], cities: ['Paris'] }, durationDays: 3 }
    },
    {
      slug: `sample-tokyo-${Math.random().toString(36).slice(2,7)}`,
      title: 'Tokyo Highlights',
      description: 'Food markets, temples, and tech',
      status: 'draft',
      published: false,
      created_by: '00000000-0000-0000-0000-000000000000',
      metadata: { geographies: { countries: ['Japan'], cities: ['Tokyo'] }, durationDays: 5 }
    }
  ]

  const { data, error } = await supabaseAdmin.from('trips').insert(sampleTrips).select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ inserted: data?.length || 0 })
}


