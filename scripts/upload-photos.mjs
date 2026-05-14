// Sube todas las fotos locales a Supabase Storage y actualiza las tablas
// node scripts/upload-photos.mjs

import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
config({ path: join(ROOT, '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BUCKET = 'media'
const IMAGE_EXTS = /\.(webp|jpg|jpeg|png)$/i

function getFiles(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter(f => IMAGE_EXTS.test(f))
    .sort()
    .map(f => ({ name: f, path: join(dir, f) }))
}

async function uploadFile(localPath, storagePath) {
  const buffer = readFileSync(localPath)
  const contentType = localPath.endsWith('.webp') ? 'image/webp'
    : localPath.endsWith('.png') ? 'image/png' : 'image/jpeg'

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType, upsert: true })

  if (error) throw new Error(`Upload failed: ${storagePath} — ${error.message}`)
  return supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl
}

// ── Section photos (hero, gallery, cta, about) ─────────────────────────────
async function uploadSection(section) {
  const files = getFiles(join(ROOT, 'public', 'images', section))
  if (!files.length) { console.log(`  ${section}: no files`); return [] }

  const urls = []
  for (const [i, file] of files.entries()) {
    const storagePath = `${section}/${file.name}`
    const url = await uploadFile(file.path, storagePath)
    urls.push({ url, name: file.name, order: i })
    process.stdout.write(`\r  ${section}: ${i + 1}/${files.length}`)
  }
  console.log()

  // Upsert into section_photos table
  await supabase.from('section_photos').delete().eq('section', section)
  const rows = urls.map((u, i) => ({
    section, url: u.url, filename: u.name, sort_order: i
  }))
  const { error } = await supabase.from('section_photos').insert(rows)
  if (error) console.error(`  section_photos insert error: ${error.message}`)

  return urls.map(u => u.url)
}

// ── Portfolio photos — upload and update weddings table ─────────────────────
async function uploadPortfolio() {
  const files = getFiles(join(ROOT, 'public', 'images', 'portfolio'))
  if (!files.length) { console.log('  portfolio: no files'); return }

  // Build a map: filename → public URL
  const urlMap = {}
  for (const [i, file] of files.entries()) {
    const storagePath = `portfolio/${file.name}`
    urlMap[`/images/portfolio/${file.name}`] = await uploadFile(file.path, storagePath)
    process.stdout.write(`\r  portfolio: ${i + 1}/${files.length}`)
  }
  console.log()

  // Update weddings table — replace local paths with Supabase URLs
  const { data: weddings } = await supabase.from('weddings').select('*')
  for (const w of weddings ?? []) {
    const newCover = urlMap[w.cover] || w.cover
    const newPhotos = (w.photos ?? []).map(p => urlMap[p] || p)
    await supabase.from('weddings').update({ cover: newCover, photos: newPhotos }).eq('id', w.id)
  }
  console.log(`  ✓ weddings table updated with Supabase URLs`)
}

// ── Testimonial photos ───────────────────────────────────────────────────────
async function uploadTestimonials() {
  const files = getFiles(join(ROOT, 'public', 'images', 'testimonials'))
  if (!files.length) { console.log('  testimonials: no files'); return }

  const urlMap = {}
  for (const [i, file] of files.entries()) {
    const storagePath = `testimonials/${file.name}`
    urlMap[`/images/testimonials/${file.name}`] = await uploadFile(file.path, storagePath)
    process.stdout.write(`\r  testimonials: ${i + 1}/${files.length}`)
  }
  console.log()

  const { data: testimonials } = await supabase.from('testimonials').select('*')
  for (const t of testimonials ?? []) {
    if (t.photo_url && urlMap[t.photo_url]) {
      await supabase.from('testimonials').update({ photo_url: urlMap[t.photo_url] }).eq('id', t.id)
    }
  }
  console.log(`  ✓ testimonials table updated`)
}

// ── Blog cover images ────────────────────────────────────────────────────────
async function uploadBlog() {
  const files = getFiles(join(ROOT, 'public', 'images', 'blog'))
  if (!files.length) { console.log('  blog: no files'); return }

  const urlMap = {}
  for (const [i, file] of files.entries()) {
    const storagePath = `blog/${file.name}`
    urlMap[`/images/blog/${file.name}`] = await uploadFile(file.path, storagePath)
    process.stdout.write(`\r  blog: ${i + 1}/${files.length}`)
  }
  console.log()

  const { data: posts } = await supabase.from('blog_posts').select('*')
  for (const p of posts ?? []) {
    if (p.cover_image && urlMap[p.cover_image]) {
      await supabase.from('blog_posts').update({ cover_image: urlMap[p.cover_image] }).eq('id', p.id)
    }
  }
  console.log(`  ✓ blog_posts table updated`)
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Uploading photos to Supabase Storage...\n')

  for (const section of ['hero', 'gallery', 'cta', 'about']) {
    process.stdout.write(`Uploading ${section}...\n`)
    await uploadSection(section)
  }

  console.log('Uploading portfolio...')
  await uploadPortfolio()

  console.log('Uploading testimonials...')
  await uploadTestimonials()

  console.log('Uploading blog...')
  await uploadBlog()

  console.log('\n✅ All photos uploaded and tables updated!')
}

main().catch(err => { console.error('\n❌', err.message); process.exit(1) })
