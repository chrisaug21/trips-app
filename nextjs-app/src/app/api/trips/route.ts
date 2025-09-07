import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createTripSchema } from '@/lib/trips/validation'
import { generateTripSlug } from '@/lib/trips/slugs'

export const runtime = 'nodejs'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || session.user.email !== adminEmail) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await supabaseAdmin
    .from('trips')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ trips: data })
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || session.user.email !== adminEmail) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const json = await request.json().catch(() => ({}))
  const parse = createTripSchema.safeParse(json)
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid payload', issues: parse.error.flatten() }, { status: 400 })
  }

  const { title, description, interests, metadata } = parse.data
  const slug = generateTripSlug(title)

  const insertRes = await supabaseAdmin
    .from('trips')
    .insert({
      slug,
      title: title || 'Untitled Trip',
      description: description || null,
      status: 'draft',
      published: false,
      created_by: session.user.id,
      metadata: metadata || {},
    })
    .select('*')
    .single()

  if (insertRes.error) {
    return NextResponse.json({ error: insertRes.error.message }, { status: 500 })
  }

  if (interests && interests.length) {
    const rows = interests.map((interest) => ({ trip_id: insertRes.data.id, interest }))
    await supabaseAdmin.from('trip_interests').insert(rows)
  }

  return NextResponse.json({ trip: insertRes.data })
}


