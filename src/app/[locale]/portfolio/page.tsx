import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Camera } from 'lucide-react'
import Link from 'next/link'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title:
      locale === 'es'
        ? 'Portafolio | Fotógrafo de Bodas Punta Cana - Soul Pictures'
        : 'Portfolio | Punta Cana Wedding Photographer - Soul Pictures',
    description:
      locale === 'es'
        ? 'Más de 2,000 bodas capturadas en Punta Cana. Explora nuestra colección de bodas destino en los mejores resorts de República Dominicana.'
        : 'Over 2,000 weddings captured in Punta Cana. Browse our collection of destination weddings at the finest resorts in the Dominican Republic.',
    alternates: {
      canonical: `/${locale}/portfolio`,
      languages: { en: '/en/portfolio', es: '/es/portafolio' },
    },
  }
}

const PLACEHOLDER_WEDDINGS = [
  { id: '1', slug: 'emma-carlos-hard-rock', bride: 'Emma', groom: 'Carlos', venue: 'Hard Rock Hotel & Casino', category: 'resort', year: 2024 },
  { id: '2', slug: 'sofia-miguel-excellence', bride: 'Sofía', groom: 'Miguel', venue: 'Excellence Punta Cana', category: 'resort', year: 2024 },
  { id: '3', slug: 'isabella-james-bavaro', bride: 'Isabella', groom: 'James', venue: 'Bávaro Beach', category: 'beach', year: 2024 },
  { id: '4', slug: 'valentina-andre-secrets', bride: 'Valentina', groom: 'André', venue: 'Secrets Royal Beach', category: 'resort', year: 2023 },
  { id: '5', slug: 'camila-luca-breathless', bride: 'Camila', groom: 'Luca', venue: 'Breathless Punta Cana', category: 'beach', year: 2023 },
  { id: '6', slug: 'diana-roberto-zoetry', bride: 'Diana', groom: 'Roberto', venue: 'Zoëtry Agua', category: 'garden', year: 2023 },
  { id: '7', slug: 'ana-pedro-barcelo', bride: 'Ana', groom: 'Pedro', venue: 'Barceló Bávaro Palace', category: 'resort', year: 2023 },
  { id: '8', slug: 'maria-juan-dreams', bride: 'María', groom: 'Juan', venue: 'Dreams Punta Cana', category: 'beach', year: 2022 },
  { id: '9', slug: 'laura-antonio-church', bride: 'Laura', groom: 'Antonio', venue: 'Basílica Catedral', category: 'church', year: 2022 },
]

export default function PortfolioPage() {
  const t = useTranslations('portfolio')

  const categories = [
    { key: 'all', label: t('filterAll') },
    { key: 'beach', label: t('filterBeach') },
    { key: 'resort', label: t('filterResort') },
    { key: 'church', label: t('filterChurch') },
  ]

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
          {categories.map(({ key, label }) => (
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

      {/* Grid */}
      <section className="bg-neutral-950 py-2">
        <div className="max-w-7xl mx-auto px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {PLACEHOLDER_WEDDINGS.map((w) => (
              <Link
                key={w.id}
                href={`/en/portfolio/${w.slug}`}
                className="group relative aspect-[4/5] bg-neutral-800 overflow-hidden block"
              >
                {/* Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera size={40} className="text-neutral-600" />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="font-playfair text-white text-2xl">{w.bride} & {w.groom}</p>
                  <p className="text-[#C9A96E] text-xs tracking-wider mt-1">{w.venue}</p>
                  <p className="text-white/50 text-xs mt-1">{w.year}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
