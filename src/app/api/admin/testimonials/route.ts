import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'
import { cookies } from 'next/headers'
import { adminClient } from '@/lib/supabase/admin'
import type { Testimonial } from '@/lib/data'

async function checkAuth() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  return session.isLoggedIn === true
}

function fromRow(row: Record<string, unknown>): Testimonial {
  return {
    id: row.id as string,
    couple: row.couple as string,
    venue: (row.venue as string) ?? '',
    text: row.text as string,
    rating: (row.rating as number) ?? 5,
    photoUrl: (row.photo_url as string) ?? '',
    visible: (row.visible as boolean) ?? true,
  }
}

export async function GET() {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await adminClient().from('testimonials').select('*')
  return NextResponse.json((data ?? []).map(fromRow))
}

export async function POST(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const t: Testimonial = await request.json()
  const { error } = await adminClient().from('testimonials').insert({
    id: `t${Date.now()}`,
    couple: t.couple,
    venue: t.venue ?? '',
    text: t.text,
    rating: t.rating ?? 5,
    photo_url: t.photoUrl ?? '',
    visible: t.visible ?? true,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PUT(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const t: Testimonial = await request.json()
  const { error } = await adminClient().from('testimonials').update({
    couple: t.couple,
    venue: t.venue ?? '',
    text: t.text,
    rating: t.rating ?? 5,
    photo_url: t.photoUrl ?? '',
    visible: t.visible ?? true,
  }).eq('id', t.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  const { error } = await adminClient().from('testimonials').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
