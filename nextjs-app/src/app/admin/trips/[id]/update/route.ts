import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const form = await request.formData()
  const title = String(form.get('title') || '')
  const description = String(form.get('description') || '')
  const { error } = await supabaseAdmin
    .from('trips')
    .update({ title: title || undefined, description: description || null })
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.redirect(new URL(`/admin/trips/${id}`, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8888'))
}


