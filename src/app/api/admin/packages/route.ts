import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'
import { cookies } from 'next/headers'
import { adminClient } from '@/lib/supabase/admin'

export interface Package {
  id: string
  name: string
  nameEs: string
  tagline: string
  taglineEs: string
  price: string
  features: string[]
  featuresEs: string[]
  visible: boolean
  highlighted: boolean
}

async function checkAuth() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  return session.isLoggedIn === true
}

function fromRow(row: Record<string, unknown>): Package {
  return {
    id: row.id as string,
    name: row.name as string,
    nameEs: (row.name_es as string) ?? '',
    tagline: (row.tagline as string) ?? '',
    taglineEs: (row.tagline_es as string) ?? '',
    price: (row.price as string) ?? '',
    features: (row.features as string[]) ?? [],
    featuresEs: (row.features_es as string[]) ?? [],
    visible: (row.visible as boolean) ?? true,
    highlighted: (row.highlighted as boolean) ?? false,
  }
}

function toRow(p: Partial<Package>) {
  return {
    ...(p.name        !== undefined && { name: p.name }),
    ...(p.nameEs      !== undefined && { name_es: p.nameEs }),
    ...(p.tagline     !== undefined && { tagline: p.tagline }),
    ...(p.taglineEs   !== undefined && { tagline_es: p.taglineEs }),
    ...(p.price       !== undefined && { price: p.price }),
    ...(p.features    !== undefined && { features: p.features }),
    ...(p.featuresEs  !== undefined && { features_es: p.featuresEs }),
    ...(p.visible     !== undefined && { visible: p.visible }),
    ...(p.highlighted !== undefined && { highlighted: p.highlighted }),
  }
}

export async function GET() {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await adminClient().from('packages').select('*').order('sort_order', { ascending: true })
  return NextResponse.json((data ?? []).map(fromRow))
}

export async function POST(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const p: Package = await request.json()
  const { data: existing } = await adminClient().from('packages').select('sort_order').order('sort_order', { ascending: false }).limit(1)
  const sortOrder = ((existing?.[0]?.sort_order as number) ?? 0) + 1
  const { error } = await adminClient().from('packages').insert({ id: `pkg-${Date.now()}`, sort_order: sortOrder, ...toRow(p) })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PUT(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const p: Package = await request.json()
  const { error } = await adminClient().from('packages').update(toRow(p)).eq('id', p.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  const { error } = await adminClient().from('packages').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
