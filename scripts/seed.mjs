// Script de migración: copia los JSON locales a Supabase
// Ejecutar con: node scripts/seed.mjs

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', 'public', 'data')

// Lee las variables del .env.local
import { config } from 'dotenv'
config({ path: join(__dirname, '..', '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function read(file) {
  try { return JSON.parse(readFileSync(join(DATA_DIR, file), 'utf-8')) }
  catch { return [] }
}

async function seedWeddings() {
  const weddings = read('portfolio.json')
  if (!weddings.length) { console.log('No weddings found'); return }
  const rows = weddings.map(w => ({
    id: w.id,
    couple_name: w.coupleName,
    year: w.year ?? '',
    venue: w.venue ?? '',
    visible: w.visible ?? true,
    cover: w.cover ?? '',
    photos: w.photos ?? [],
  }))
  const { error } = await supabase.from('weddings').upsert(rows, { onConflict: 'id' })
  if (error) console.error('weddings error:', error.message)
  else console.log(`✓ ${rows.length} weddings migrated`)
}

async function seedTestimonials() {
  const list = read('testimonials.json')
  if (!list.length) { console.log('No testimonials found'); return }
  const rows = list.map(t => ({
    id: t.id,
    couple: t.couple,
    venue: t.venue ?? '',
    text: t.text,
    rating: t.rating ?? 5,
    photo_url: t.photoUrl ?? '',
    visible: t.visible ?? true,
  }))
  const { error } = await supabase.from('testimonials').upsert(rows, { onConflict: 'id' })
  if (error) console.error('testimonials error:', error.message)
  else console.log(`✓ ${rows.length} testimonials migrated`)
}

async function seedPackages() {
  const list = read('packages.json')
  if (!list.length) { console.log('No packages found'); return }
  const rows = list.map((p, i) => ({
    id: p.id,
    name: p.name,
    name_es: p.nameEs ?? '',
    tagline: p.tagline ?? '',
    tagline_es: p.taglineEs ?? '',
    price: p.price ?? '',
    features: p.features ?? [],
    features_es: p.featuresEs ?? [],
    visible: p.visible ?? true,
    highlighted: p.highlighted ?? false,
    sort_order: i,
  }))
  const { error } = await supabase.from('packages').upsert(rows, { onConflict: 'id' })
  if (error) console.error('packages error:', error.message)
  else console.log(`✓ ${rows.length} packages migrated`)
}

async function seedBlog() {
  const list = read('blog.json')
  if (!list.length) { console.log('No blog posts found'); return }
  const rows = list.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    title_es: p.titleEs ?? '',
    excerpt: p.excerpt ?? '',
    excerpt_es: p.excerptEs ?? '',
    content: p.content ?? '',
    content_es: p.contentEs ?? '',
    cover_image: p.coverImage ?? '',
    tags: p.tags ?? [],
    published: p.published ?? false,
    created_at: p.createdAt ?? new Date().toISOString(),
    published_at: p.publishedAt ?? p.createdAt ?? new Date().toISOString(),
  }))
  const { error } = await supabase.from('blog_posts').upsert(rows, { onConflict: 'id' })
  if (error) console.error('blog error:', error.message)
  else console.log(`✓ ${rows.length} blog posts migrated`)
}

async function main() {
  console.log('Starting migration to Supabase...\n')
  await seedWeddings()
  await seedTestimonials()
  await seedPackages()
  await seedBlog()
  console.log('\nMigration complete!')
}

main().catch(console.error)
