import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'

const PUBLIC_DIR = path.join(process.cwd(), 'public', 'images')

export const SECTIONS = {
  hero:      { label: 'Hero',       path: 'hero',      max: 3 },
  gallery:   { label: 'Galería',    path: 'gallery',   max: 9 },
  portfolio: { label: 'Portafolio', path: 'portfolio', max: 20 },
  about:     { label: 'Sobre mí',   path: 'about',     max: 4 },
  sessions:  { label: 'Sesiones',   path: 'sessions',  max: 8 },
}

async function checkAuth() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  return session.isLoggedIn === true
}

// GET /api/admin/photos?section=hero
export async function GET(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const section = request.nextUrl.searchParams.get('section') || 'all'
  const result: Record<string, string[]> = {}

  const sectionsToList = section === 'all'
    ? Object.values(SECTIONS)
    : Object.values(SECTIONS).filter(s => s.path === section)

  for (const sec of sectionsToList) {
    const dir = path.join(PUBLIC_DIR, sec.path)
    if (!fs.existsSync(dir)) { result[sec.path] = []; continue }
    result[sec.path] = fs.readdirSync(dir)
      .filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f))
      .sort()
      .map(f => `/images/${sec.path}/${f}`)
  }

  return NextResponse.json(result)
}

// DELETE /api/admin/photos  body: { url: '/images/hero/hero-01.webp' }
export async function DELETE(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { url } = await request.json()
  if (!url || !url.startsWith('/images/')) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  const filePath = path.join(process.cwd(), 'public', url)
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  fs.unlinkSync(filePath)
  return NextResponse.json({ ok: true })
}
