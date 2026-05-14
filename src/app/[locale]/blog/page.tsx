import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { adminClient } from '@/lib/supabase/admin'
import { BlogPost } from '@/app/api/admin/blog/route'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isEs = locale === 'es'
  return {
    title: isEs
      ? 'Blog | Consejos de Fotografía de Bodas en Punta Cana — Soul Pictures'
      : 'Blog | Wedding Photography Tips & Inspiration Punta Cana — Soul Pictures',
    description: isEs
      ? 'Consejos, inspiración y guías para parejas que planean su boda destino en Punta Cana y el Caribe.'
      : 'Tips, inspiration and guides for couples planning their destination wedding in Punta Cana and the Caribbean.',
  }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isEs = locale === 'es'
  const { data: rows } = await adminClient().from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false })
  const posts: BlogPost[] = (rows ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string, slug: r.slug as string,
    title: r.title as string, titleEs: r.title_es as string,
    excerpt: r.excerpt as string, excerptEs: r.excerpt_es as string,
    content: r.content as string, contentEs: r.content_es as string,
    coverImage: r.cover_image as string, tags: r.tags as string[],
    published: r.published as boolean,
    createdAt: r.created_at as string, publishedAt: r.published_at as string,
  }))

  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-20 bg-neutral-900 text-center">
        <p className="text-[#C9A96E] text-xs tracking-[0.45em] uppercase mb-5">Soul Pictures MS</p>
        <h1 className="font-playfair text-5xl md:text-6xl text-white font-light mb-5">
          {isEs ? 'Blog & Inspiración' : 'Blog & Inspiration'}
        </h1>
        <p className="text-white/45 text-lg max-w-lg mx-auto leading-relaxed">
          {isEs
            ? 'Consejos, guías y momentos que celebran el amor en el Caribe.'
            : 'Tips, guides and moments celebrating love in the Caribbean.'}
        </p>
      </section>

      {/* Posts grid */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-400 text-sm tracking-widest uppercase">
                {isEs ? 'Próximamente...' : 'Coming soon...'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => {
                const title = isEs ? post.titleEs : post.title
                const excerpt = isEs ? post.excerptEs : post.excerpt
                return (
                  <Link
                    key={post.id}
                    href={`/${locale}/blog/${post.slug}`}
                    className="group flex flex-col"
                  >
                    {/* Cover */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 mb-5">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={title}
                          fill
                          className="object-cover transition-[filter] duration-700 brightness-[0.95] group-hover:brightness-100"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          quality={90}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-100 flex items-center justify-center">
                          <span className="text-neutral-400 text-xs tracking-widest uppercase">Soul Pictures</span>
                        </div>
                      )}
                      <div className="absolute inset-0 border border-transparent group-hover:border-[#C9A96E]/30 transition-colors duration-700 pointer-events-none" />
                    </div>

                    {/* Tags */}
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="font-playfair text-xl text-neutral-900 font-light leading-snug mb-3 group-hover:text-[#C9A96E] transition-colors duration-300">
                      {title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-neutral-500 text-sm leading-relaxed line-clamp-3 flex-1">
                      {excerpt}
                    </p>

                    {/* Read more */}
                    <div className="flex items-center gap-2 mt-4 text-neutral-400 group-hover:text-neutral-900 transition-colors duration-300">
                      <span className="text-xs tracking-[0.25em] uppercase">
                        {isEs ? 'Leer más' : 'Read more'}
                      </span>
                      <span className="inline-block w-4 h-px bg-current transition-all duration-300 group-hover:w-6" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
