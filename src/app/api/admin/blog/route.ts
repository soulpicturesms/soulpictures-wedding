import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'
import { cookies } from 'next/headers'
import { adminClient } from '@/lib/supabase/admin'

export const maxDuration = 60

export const dynamic = 'force-dynamic'

export interface BlogPost {
  id: string
  slug: string
  title: string
  titleEs: string
  excerpt: string
  excerptEs: string
  content: string
  contentEs: string
  coverImage: string
  tags: string[]
  published: boolean
  createdAt: string
  publishedAt: string
}

async function checkAuth() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  return session.isLoggedIn === true
}

function fromRow(row: Record<string, unknown>): BlogPost {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    titleEs: (row.title_es as string) ?? '',
    excerpt: (row.excerpt as string) ?? '',
    excerptEs: (row.excerpt_es as string) ?? '',
    content: (row.content as string) ?? '',
    contentEs: (row.content_es as string) ?? '',
    coverImage: (row.cover_image as string) ?? '',
    tags: (row.tags as string[]) ?? [],
    published: (row.published as boolean) ?? false,
    createdAt: (row.created_at as string) ?? new Date().toISOString(),
    publishedAt: (row.published_at as string) ?? (row.created_at as string) ?? new Date().toISOString(),
  }
}

function toRow(p: Partial<BlogPost>) {
  return {
    ...(p.slug       !== undefined && { slug: p.slug }),
    ...(p.title      !== undefined && { title: p.title }),
    ...(p.titleEs    !== undefined && { title_es: p.titleEs }),
    ...(p.excerpt    !== undefined && { excerpt: p.excerpt }),
    ...(p.excerptEs  !== undefined && { excerpt_es: p.excerptEs }),
    ...(p.content    !== undefined && { content: p.content }),
    ...(p.contentEs  !== undefined && { content_es: p.contentEs }),
    ...(p.coverImage !== undefined && { cover_image: p.coverImage }),
    ...(p.tags       !== undefined && { tags: p.tags }),
    ...(p.published  !== undefined && { published: p.published }),
    ...(p.publishedAt !== undefined && { published_at: p.publishedAt }),
  }
}

export async function GET() {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await adminClient().from('blog_posts').select('*').order('created_at', { ascending: false })
  return NextResponse.json((data ?? []).map(fromRow))
}

export async function POST(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const post: BlogPost = await request.json()
  const { error } = await adminClient().from('blog_posts').insert({
    id: post.id || `post-${Date.now()}`,
    created_at: post.createdAt || new Date().toISOString(),
    ...toRow(post),
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PUT(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const post: BlogPost = await request.json()
  const { error } = await adminClient().from('blog_posts').update(toRow(post)).eq('id', post.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  const { error } = await adminClient().from('blog_posts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
