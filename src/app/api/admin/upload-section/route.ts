import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'
import { cookies } from 'next/headers'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const maxDuration = 60

const VALID_SECTIONS = ['hero', 'gallery', 'portfolio', 'about', 'sessions']

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

  const destDir = path.join(process.cwd(), 'public', 'images', section)
  fs.mkdirSync(destDir, { recursive: true })

  const results = []

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()
    const timestamp = Date.now()
    const fileName = `${baseName}-${timestamp}.webp`
    const destPath = path.join(destDir, fileName)

    const originalSize = buffer.length

    // Convert to WebP + auto-rotate EXIF
    const widthMap: Record<string, number> = {
      hero: 1920, gallery: 900, portfolio: 900, about: 900, sessions: 900
    }
    const quality = section === 'hero' ? 88 : 85

    await sharp(buffer)
      .rotate()
      .resize(widthMap[section], null, { withoutEnlargement: true })
      .webp({ quality, effort: 4 })
      .toFile(destPath)

    const newSize = fs.statSync(destPath).size
    const saving = Math.round((1 - newSize / originalSize) * 100)

    results.push({
      url: `/images/${section}/${fileName}`,
      name: fileName,
      originalSize,
      newSize,
      saving,
    })
  }

  return NextResponse.json({ ok: true, uploaded: results.length, results })
}
