import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'
import { cookies } from 'next/headers'
import { adminClient } from '@/lib/supabase/admin'
import type { Wedding } from '@/lib/data'

async function checkAuth() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  return session.isLoggedIn === true
}

function toRow(w: Partial<Wedding>) {
  return {
    ...(w.coupleName !== undefined && { couple_name: w.coupleName }),
    ...(w.year       !== undefined && { year: w.year }),
    ...(w.venue      !== undefined && { venue: w.venue }),
    ...(w.visible    !== undefined && { visible: w.visible }),
    ...(w.cover      !== undefined && { cover: w.cover }),
    ...(w.photos     !== undefined && { photos: w.photos }),
  }
}

function fromRow(row: Record<string, unknown>): Wedding {
  return {
    id: row.id as string,
    coupleName: row.couple_name as string,
    year: (row.year as string) ?? '',
    venue: (row.venue as string) ?? '',
    visible: (row.visible as boolean) ?? true,
    cover: (row.cover as string) ?? '',
    photos: (row.photos as string[]) ?? [],
  }
}

export async function GET() {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await adminClient().from('weddings').select('*').order('created_at', { ascending: false })
  return NextResponse.json((data ?? []).map(fromRow))
}

export async function POST(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const w: Wedding = await request.json()
  const { error } = await adminClient().from('weddings').insert({
    id: `wedding-${Date.now()}`,
    ...toRow(w),
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, field, value } = await request.json()
  const colMap: Record<string, string> = {
    coupleName: 'couple_name', year: 'year', venue: 'venue',
    visible: 'visible', cover: 'cover', photos: 'photos',
  }
  const col = colMap[field] ?? field
  const { error } = await adminClient().from('weddings').update({ [col]: value }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PUT(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const w: Wedding = await request.json()
  const { error } = await adminClient().from('weddings').update(toRow(w)).eq('id', w.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  const { error } = await adminClient().from('weddings').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
