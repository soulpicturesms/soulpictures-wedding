import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { adminClient } from '@/lib/supabase/admin'
import { BlogPost } from '@/app/api/admin/blog/route'

async function getPost(slug: string): Promise<BlogPost | null> {
  const { data } = await adminClient().from('blog_posts').select('*').eq('slug', slug).eq('published', true).single()
  if (!data) return null
  const r = data as Record<string, unknown>
  return {
    id: r.id as string, slug: r.slug as string,
    title: r.title as string, titleEs: r.title_es as string,
    excerpt: r.excerpt as string, excerptEs: r.excerpt_es as string,
    content: r.content as string, contentEs: r.content_es as string,
    coverImage: r.cover_image as string, tags: r.tags as string[],
    published: r.published as boolean,
    createdAt: r.created_at as string, publishedAt: r.published_at as string,
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  const isEs = locale === 'es'
  return {
    title: `${isEs ? post.titleEs : post.title} — Soul Pictures`,
    description: isEs ? post.excerptEs : post.excerpt,
    openGraph: {
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const isEs = locale === 'es'
  const title = isEs ? post.titleEs : post.title
  const content = isEs ? post.contentEs : post.content
  const excerpt = isEs ? post.excerptEs : post.excerpt
  const date = new Date(post.publishedAt).toLocaleDateString(isEs ? 'es-DO' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-0 bg-neutral-900">
        <div className="max-w-3xl mx-auto px-6 text-center pb-12">
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {post.tags.map(tag => (
                <span key={tag} className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase">{tag}</span>
              ))}
            </div>
          )}
          <h1 className="font-playfair text-4xl md:text-5xl text-white font-light leading-tight mb-6">
            {title}
          </h1>
          <p className="text-white/45 leading-relaxed mb-6">{excerpt}</p>
          <p className="text-white/25 text-xs tracking-widest">{date}</p>
        </div>

        {post.coverImage && (
          <div className="relative w-full h-[480px] overflow-hidden">
            <Image
              src={post.coverImage}
              alt={title}
              fill
              className="object-cover object-center brightness-90"
              sizes="100vw"
              quality={92}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent" />
          </div>
        )}
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <article
            className="prose prose-neutral max-w-none prose-headings:font-playfair prose-headings:font-light prose-h2:text-3xl prose-h3:text-xl prose-p:leading-relaxed prose-p:text-neutral-600 prose-li:text-neutral-600 prose-a:text-[#C9A96E] prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Gold divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent my-16" />

          {/* CTA */}
          <div className="text-center">
            <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase mb-4">Soul Pictures MS</p>
            <h2 className="font-playfair text-3xl text-neutral-900 font-light mb-4">
              {isEs ? '¿Listo para comenzar tu historia?' : 'Ready to begin your story?'}
            </h2>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto leading-relaxed">
              {isEs
                ? 'Contáctanos y hagamos de tu boda un recuerdo eterno.'
                : "Let's talk about your wedding and create something unforgettable together."}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-block bg-neutral-900 hover:bg-[#C9A96E] text-white text-sm tracking-[0.2em] uppercase px-10 py-4 transition-colors duration-200"
            >
              {isEs ? 'Contáctanos' : 'Get in touch'}
            </Link>
          </div>

          {/* Back to blog */}
          <div className="mt-16 pt-8 border-t border-neutral-100">
            <Link
              href={`/${locale}/blog`}
              className="flex items-center gap-2 text-neutral-400 hover:text-neutral-900 transition-colors text-xs tracking-[0.3em] uppercase group"
            >
              <span className="inline-block w-4 h-px bg-current transition-all duration-300 group-hover:w-6" />
              {isEs ? 'Volver al blog' : 'Back to blog'}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
