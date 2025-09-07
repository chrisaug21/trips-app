import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export const runtime = 'nodejs'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const { data, error } = await supabaseAdmin
    .from('trips')
    .update({ status: 'published', published: true })
    .eq('id', id)
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  try {
    revalidatePath('/')
    revalidatePath(`/trips/${data.slug}`)
  } catch {}
  return NextResponse.redirect(new URL(`/admin/trips/${id}`, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8888'))
}


