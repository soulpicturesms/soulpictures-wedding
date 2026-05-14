import { createClient } from '@supabase/supabase-js'

// ── Public read client (anon key, RLS filters visible/published) ──────────────
function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface Wedding {
  id: string
  coupleName: string
  year: string
  venue: string
  visible: boolean
  cover: string
  photos: string[]
}

export interface Testimonial {
  id: string
  couple: string
  venue: string
  text: string
  rating: number
  photoUrl: string
  visible: boolean
}

// ── Row mappers (snake_case DB → camelCase app) ───────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toWedding(row: any): Wedding {
  return {
    id: row.id,
    coupleName: row.couple_name,
    year: row.year ?? '',
    venue: row.venue ?? '',
    visible: row.visible ?? true,
    cover: row.cover ?? '',
    photos: row.photos ?? [],
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toTestimonial(row: any): Testimonial {
  return {
    id: row.id,
    couple: row.couple,
    venue: row.venue ?? '',
    text: row.text,
    rating: row.rating ?? 5,
    photoUrl: row.photo_url ?? '',
    visible: row.visible ?? true,
  }
}

// ── Weddings ──────────────────────────────────────────────────────────────────

export async function getWeddings(): Promise<Wedding[]> {
  const { data } = await publicClient()
    .from('weddings')
    .select('*')
    .eq('visible', true)
    .order('created_at', { ascending: false })
  return (data ?? []).map(toWedding)
}

export async function getAllWeddings(): Promise<Wedding[]> {
  const { adminClient } = await import('./supabase/admin')
  const { data } = await adminClient()
    .from('weddings')
    .select('*')
    .order('created_at', { ascending: false })
  return (data ?? []).map(toWedding)
}

// ── Testimonials ──────────────────────────────────────────────────────────────

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data } = await publicClient()
    .from('testimonials')
    .select('*')
    .eq('visible', true)
  return (data ?? []).map(toTestimonial)
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const { adminClient } = await import('./supabase/admin')
  const { data } = await adminClient()
    .from('testimonials')
    .select('*')
  return (data ?? []).map(toTestimonial)
}

// ── Section photos ────────────────────────────────────────────────────────────

export async function getSectionPhotos(section: string): Promise<string[]> {
  const { data } = await publicClient()
    .from('section_photos')
    .select('url')
    .eq('section', section)
    .order('sort_order', { ascending: true })
  return (data ?? []).map((r: { url: string }) => r.url)
}

// ── Packages (read from public JSON via API for now — served dynamically) ─────
// packages are loaded by the services page and admin via their own API routes

// ── Legacy sync helpers (only for build-time use, not Vercel) ─────────────────
// Kept as no-ops so TypeScript doesn't break any remaining imports during migration
export function readData<T>(_file: string): T {
  return [] as unknown as T
}
export function writeData<T>(_file: string, _data: T): void {
  // no-op on Vercel — all writes go through Supabase API routes
}
