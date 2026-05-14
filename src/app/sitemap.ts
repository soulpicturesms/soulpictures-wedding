import { MetadataRoute } from 'next'
import { readData } from '@/lib/data'
import { BlogPost } from '@/app/api/admin/blog/route'
import { Wedding } from '@/lib/data'

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://soulpicturesms.com').replace(/\/$/, '')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['en', 'es']
  const urls: MetadataRoute.Sitemap = []
  const now = new Date()

  // ── Static pages ────────────────────────────────────────────────────────
  const staticPages = [
    { path: '',           priority: 1.0, changeFrequency: 'weekly'  as const },
    { path: '/portfolio', priority: 0.9, changeFrequency: 'weekly'  as const },
    { path: '/about',     priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/services',  priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/blog',      priority: 0.8, changeFrequency: 'daily'   as const },
    { path: '/contact',   priority: 0.9, changeFrequency: 'monthly' as const },
  ]

  for (const locale of locales) {
    for (const page of staticPages) {
      urls.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      })
    }
  }

  // ── Blog posts ───────────────────────────────────────────────────────────
  try {
    const posts = readData<BlogPost[]>('blog.json').filter(p => p.published)
    for (const post of posts) {
      for (const locale of locales) {
        urls.push({
          url: `${BASE_URL}/${locale}/blog/${post.slug}`,
          lastModified: new Date(post.publishedAt || post.createdAt),
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      }
    }
  } catch { /* no posts yet */ }

  // ── Portfolio weddings ───────────────────────────────────────────────────
  try {
    const weddings = readData<Wedding[]>('portfolio.json').filter(w => w.visible)
    for (const locale of locales) {
      urls.push({
        url: `${BASE_URL}/${locale}/portfolio`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      })
      // Individual couple pages if they exist
      for (const w of weddings) {
        if (w.id) {
          urls.push({
            url: `${BASE_URL}/${locale}/portfolio/${w.id}`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
          })
        }
      }
    }
  } catch { /* no weddings yet */ }

  // Deduplicate by URL
  const seen = new Set<string>()
  return urls.filter(u => {
    if (seen.has(u.url)) return false
    seen.add(u.url)
    return true
  })
}
