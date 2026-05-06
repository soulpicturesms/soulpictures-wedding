import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  // Simple admin auth check
  const authHeader = request.headers.get('x-admin-secret')
  if (authHeader !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const files = formData.getAll('files') as File[]
  const weddingId = formData.get('weddingId') as string

  if (!files.length || !weddingId) {
    return NextResponse.json({ error: 'Missing files or weddingId' }, { status: 400 })
  }

  const results: { name: string; size: number; originalSize: number }[] = []

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const originalSize = buffer.length

    // Convert to WebP with Sharp
    const webpBuffer = await sharp(buffer)
      .rotate() // auto-rotate based on EXIF
      .webp({ quality: 85, effort: 4 })
      .toBuffer()

    // Create thumbnail (400px wide)
    const thumbnailBuffer = await sharp(buffer)
      .rotate()
      .resize(400, null, { withoutEnlargement: true })
      .webp({ quality: 75, effort: 4 })
      .toBuffer()

    const { width, height } = await sharp(webpBuffer).metadata()

    const fileName = file.name.replace(/\.[^/.]+$/, '') + '.webp'
    const thumbnailName = file.name.replace(/\.[^/.]+$/, '') + '_thumb.webp'

    // Upload to Supabase Storage
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error: mainError } = await supabase.storage
      .from('weddings')
      .upload(`${weddingId}/${fileName}`, webpBuffer, {
        contentType: 'image/webp',
        upsert: true,
      })

    if (mainError) {
      return NextResponse.json({ error: mainError.message }, { status: 500 })
    }

    const { error: thumbError } = await supabase.storage
      .from('weddings')
      .upload(`${weddingId}/thumbnails/${thumbnailName}`, thumbnailBuffer, {
        contentType: 'image/webp',
        upsert: true,
      })

    if (thumbError) {
      return NextResponse.json({ error: thumbError.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('weddings')
      .getPublicUrl(`${weddingId}/${fileName}`)

    const { data: { publicUrl: thumbnailUrl } } = supabase.storage
      .from('weddings')
      .getPublicUrl(`${weddingId}/thumbnails/${thumbnailName}`)

    // Save to photos table
    await supabase.from('photos').insert({
      wedding_id: weddingId,
      url: publicUrl,
      thumbnail_url: thumbnailUrl,
      alt_text: '',
      width: width || 0,
      height: height || 0,
    })

    results.push({ name: fileName, size: webpBuffer.length, originalSize })
  }

  const totalSaved = results.reduce((acc, r) => acc + (r.originalSize - r.size), 0)

  return NextResponse.json({
    success: true,
    uploaded: results.length,
    savedBytes: totalSaved,
    results,
  })
}
