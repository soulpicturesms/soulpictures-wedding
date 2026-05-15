import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'
import { cookies } from 'next/headers'
import sharp from 'sharp'
import { adminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const maxDuration = 60

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}

const VALID_SECTIONS = ['hero', 'gallery', 'portfolio', 'about', 'sessions', 'cta', 'testimonials', 'blog']

const WIDTH_MAP: Record<string, number> = {
  hero: 3840, gallery: 2400, portfolio: 2400, about: 2400,
  sessions: 2400, cta: 3840, testimonials: 1600, blog: 2400,
}

async function checkAuth() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  return session.isLoggedIn === true
}

export async function POST(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const section = formData.get('section') as string
  const files = formData.getAll('files') as File[]

  if (!VALID_SECTIONS.includes(section)) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
  }
  if (!files.length) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 })
  }

  const db = adminClient()
  const results = []

  // Get current max sort_order for this section
  const { data: existing } = await db
    .from('section_photos')
    .select('sort_order')
    .eq('section', section)
    .order('sort_order', { ascending: false })
    .limit(1)
  let sortOrder = ((existing?.[0]?.sort_order as number) ?? 0) + 1

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()
    const fileName = `${baseName}-${Date.now()}.webp`
    const storagePath = `${section}/${fileName}`

    const quality = section === 'blog' ? 95 : 92
    const webpBuffer = await sharp(buffer)
      .rotate()
      .resize(WIDTH_MAP[section] ?? 2400, null, { withoutEnlargement: true })
      .webp({ quality, effort: 6, smartSubsample: true })
      .toBuffer()

    // Upload to Supabase Storage (bucket: media)
    const { error: uploadError } = await db.storage
      .from('media')
      .upload(storagePath, webpBuffer, { contentType: 'image/webp', upsert: true })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: { publicUrl } } = db.storage.from('media').getPublicUrl(storagePath)

    // Save to section_photos table
    await db.from('section_photos').insert({
      section,
      url: publicUrl,
      filename: fileName,
      sort_order: sortOrder++,
    })

    results.push({ url: publicUrl, name: fileName, size: webpBuffer.length })
  }

  return NextResponse.json({ ok: true, uploaded: results.length, results })
}
