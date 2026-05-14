import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'
import { cookies } from 'next/headers'
import { adminClient } from '@/lib/supabase/admin'

export const SECTIONS = {
  hero:         { label: 'Hero',         path: 'hero',         max: 5  },
  gallery:      { label: 'Galería',      path: 'gallery',      max: 12 },
  portfolio:    { label: 'Portafolio',   path: 'portfolio',    max: 30 },
  about:        { label: 'Sobre mí',     path: 'about',        max: 4  },
  sessions:     { label: 'Sesiones',     path: 'sessions',     max: 8  },
  cta:          { label: 'CTA',          path: 'cta',          max: 3  },
  testimonials: { label: 'Testimonios',  path: 'testimonials', max: 10 },
}

async function checkAuth() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  return session.isLoggedIn === true
}

// GET /api/admin/photos?section=hero  (or section=all)
export async function GET(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const section = request.nextUrl.searchParams.get('section') || 'all'
  const result: Record<string, string[]> = {}

  const sectionsToList = section === 'all'
    ? Object.values(SECTIONS)
    : Object.values(SECTIONS).filter(s => s.path === section)

  for (const sec of sectionsToList) {
    const { data } = await adminClient()
      .from('section_photos')
      .select('url')
      .eq('section', sec.path)
      .order('sort_order', { ascending: true })
    result[sec.path] = (data ?? []).map((r: { url: string }) => r.url)
  }

  return NextResponse.json(result)
}

// DELETE /api/admin/photos  body: { url, section }
export async function DELETE(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { url, section } = await request.json()
  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 })

  const db = adminClient()

  // Delete from section_photos table
  await db.from('section_photos').delete().eq('url', url)

  // Delete from Supabase Storage
  // URL format: https://xxx.supabase.co/storage/v1/object/public/media/hero/filename.webp
  const storagePrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/`
  if (url.startsWith(storagePrefix)) {
    const storagePath = url.replace(storagePrefix, '')
    await db.storage.from('media').remove([storagePath])
  }

  return NextResponse.json({ ok: true })
}
