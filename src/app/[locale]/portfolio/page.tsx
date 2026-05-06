import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'es'
      ? 'Portafolio | Fotógrafo de Bodas Punta Cana - Soul Pictures'
      : 'Portfolio | Punta Cana Wedding Photographer - Soul Pictures',
    description: locale === 'es'
      ? 'Más de 2,000 bodas capturadas en Punta Cana. Explora nuestra colección de bodas destino en los mejores resorts de República Dominicana.'
      : 'Over 2,000 weddings captured in Punta Cana. Browse our collection of destination weddings at the finest resorts in the Dominican Republic.',
    alternates: {
      canonical: `/${locale}/portfolio`,
      languages: { en: '/en/portfolio', es: '/es/portafolio' },
    },
  }
}

const PORTFOLIO = [
  { src: '/images/gallery/wedding-03.webp', alt: 'Bride portrait Punta Cana palms',      label: 'Beach Wedding',    year: '2024' },
  { src: '/images/gallery/wedding-04.webp', alt: 'Bride silhouette destination wedding',   label: 'Resort Ceremony',  year: '2024' },
  { src: '/images/gallery/wedding-06.webp', alt: 'Beach ceremony arch Punta Cana',        label: 'Beach Ceremony',   year: '2024' },
  { src: '/images/portfolio/boda-7.webp',   alt: 'Ring exchange beach wedding',            label: 'Beach Wedding',    year: '2024' },
  { src: '/images/gallery/wedding-05.webp', alt: 'Waterfront wedding ceremony',            label: 'Waterfront',       year: '2023' },
  { src: '/images/portfolio/boda-8.webp',   alt: 'Wedding ceremony vows',                 label: 'Resort Wedding',   year: '2023' },
  { src: '/images/portfolio/boda-3.webp',   alt: 'Bride portrait tropical setting',        label: 'Tropical Garden',  year: '2023' },
  { src: '/images/portfolio/boda-2.webp',   alt: 'Groom boutonniere palms resort',         label: 'Resort Ceremony',  year: '2023' },
  { src: '/images/about/session-01.webp',   alt: 'Couple under leaning palms beach',       label: 'Beach Session',    year: '2023' },
]

export default function PortfolioPage() {
  const t = useTranslations('portfolio')

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 bg-neutral-900 text-center">
        <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase mb-4">Soul Pictures</p>
        <h1 className="font-playfair text-5xl md:text-6xl text-white font-light mb-4">{t('title')}</h1>
        <p className="text-white/50 text-lg max-w-xl mx-auto">{t('subtitle')}</p>
      </section>

      {/* Filter tabs */}
      <section className="bg-neutral-900 border-b border-white/10 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 flex gap-8 overflow-x-auto">
          {[
            { key: 'all', label: t('filterAll') },
            { key: 'beach', label: t('filterBeach') },
            { key: 'resort', label: t('filterResort') },
            { key: 'church', label: t('filterChurch') },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`py-4 text-xs tracking-[0.3em] uppercase whitespace-nowrap border-b-2 transition-colors ${
                key === 'all'
                  ? 'border-[#C9A96E] text-[#C9A96E]'
                  : 'border-transparent text-white/40 hover:text-white/70'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry grid */}
      <section className="bg-neutral-950 py-2">
        <div className="max-w-7xl mx-auto px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {PORTFOLIO.map((item) => (
              <div key={item.src} className="group relative aspect-[4/5] overflow-hidden bg-neutral-800">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-[#C9A96E] text-xs tracking-widest uppercase">{item.label}</p>
                  <p className="text-white/60 text-xs mt-1">{item.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-900 py-20 text-center">
        <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase mb-4">Soul Pictures</p>
        <h2 className="font-playfair text-3xl md:text-4xl text-white font-light mb-6">
          Ready to Create Your Story?
        </h2>
        <Link
          href="/en/contact"
          className="inline-block bg-[#C9A96E] hover:bg-[#b8944f] text-black text-sm font-medium tracking-[0.2em] uppercase px-10 py-4 transition-colors"
        >
          Book a Consultation
        </Link>
      </section>
    </>
  )
}
