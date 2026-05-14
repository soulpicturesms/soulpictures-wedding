import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { getWeddings, Wedding } from '@/lib/data'
import PortfolioGrid from '@/components/portfolio/PortfolioGrid'

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

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'portfolio' })
  const weddings = await getWeddings()

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 bg-neutral-900 text-center">
        <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase mb-4">Soul Pictures</p>
        <h1 className="font-playfair text-5xl md:text-6xl text-white font-light mb-4">{t('title')}</h1>
        <p className="text-white/50 text-lg max-w-xl mx-auto">{t('subtitle')}</p>
      </section>

      <PortfolioGrid
        weddings={weddings}
        locale={locale}
        filterAllLabel={t('filterAll')}
        bookLabel={t('viewGallery')}
      />
    </>
  )
}
