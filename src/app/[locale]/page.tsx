import { useTranslations, useLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Camera, Award, MapPin, Globe } from 'lucide-react'
import HeroSlideshow from '@/components/hero/HeroSlideshow'
import GalleryCarousel from '@/components/gallery/GalleryCarousel'
import TestimonialsSection from '@/components/testimonials/TestimonialsSection'
import { getSectionPhotos, getTestimonials, Testimonial } from '@/lib/data'

const DEFAULT_HERO_PHOTOS = [
  '/images/hero/hero-01.webp',
  '/images/hero/hero-02.webp',
]

const DEFAULT_GALLERY_PHOTOS: string[] = []

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return {
    title: 'Soul Pictures | Destination Wedding Photographer Punta Cana',
    description: 'Destination wedding photographer in Punta Cana, Dominican Republic. Over 2,000 weddings captured at Hard Rock, Excellence, Bavaro and top Punta Cana resorts. Photography, video, or both.',
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', es: '/es' },
    },
  }
}

function StatsSection() {
  const t = useTranslations('home.stats')
  const stats = [
    { value: '2,000+', label: t('weddings'),     icon: Camera },
    { value: '15+',    label: t('years'),         icon: Award },
    { value: '30+',    label: t('venues'),        icon: MapPin },
    { value: '',       label: t('destination'),   icon: Globe },
  ]
  return (
    <section className="bg-black py-16">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map(({ value, label, icon: Icon }) => (
          <div key={label} className="flex flex-col items-center text-center gap-3">
            <Icon size={20} className="text-[#C9A96E]" />
            {value
              ? <span className="text-white font-playfair text-4xl font-light">{value}</span>
              : <div className="h-px w-8 bg-[#C9A96E]/50 my-3" />
            }
            <span className="text-white/50 text-xs tracking-widest uppercase">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function AboutSection() {
  const t = useTranslations('home.about')
  const locale = useLocale()

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src="/images/about/session-01.webp"
            alt="Couple photography session under palm trees Punta Cana beach"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border border-[#C9A96E]/40 -z-10" />
        </div>
        <div>
          <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase mb-4">Soul Pictures</p>
          <h2 className="font-playfair text-4xl md:text-5xl text-neutral-900 font-light leading-tight mb-6">
            {t('title')}
          </h2>
          <p className="text-neutral-600 leading-relaxed mb-8">{t('body')}</p>
          <Link
            href={`/${locale}/about`}
            className="inline-block bg-neutral-900 hover:bg-[#C9A96E] text-white text-sm tracking-[0.2em] uppercase px-8 py-4 transition-colors duration-200"
          >
            {t('learnMore')}
          </Link>
        </div>
      </div>
    </section>
  )
}

function CtaSection({ ctaPhoto, locale }: { ctaPhoto: string; locale: string }) {
  const t = useTranslations('home.cta')

  return (
    <section className="relative py-32 overflow-hidden">
      <Image
        src={ctaPhoto}
        alt="Couple on Punta Cana beach - book your destination wedding photographer"
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-playfair text-4xl md:text-5xl text-white font-light mb-4">{t('title')}</h2>
        <p className="text-white/70 text-lg mb-10">{t('subtitle')}</p>
        <Link
          href={`/${locale}/contact`}
          className="inline-block bg-[#C9A96E] hover:bg-[#b8944f] text-black text-sm font-medium tracking-[0.2em] uppercase px-12 py-5 transition-colors duration-200"
        >
          {t('button')}
        </Link>
      </div>
    </section>
  )
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [heroT, galleryT, testimonialT] = await Promise.all([
    getTranslations({ locale, namespace: 'home.hero' }),
    getTranslations({ locale, namespace: 'home.featured' }),
    getTranslations({ locale, namespace: 'home.testimonials' }),
  ])

  const [heroPhotos, galleryPhotos, ctaPhotos, testimonials] = await Promise.all([
    getSectionPhotos('hero'),
    getSectionPhotos('gallery'),
    getSectionPhotos('cta'),
    getTestimonials(),
  ])

  return (
    <>
      <HeroSlideshow
        photos={heroPhotos.length > 0 ? heroPhotos : DEFAULT_HERO_PHOTOS}
        locale={locale}
        headline={heroT('headline')}
        tagline={heroT('tagline')}
        location={heroT('location')}
        ctaLabel={heroT('cta')}
        ctaContactLabel={heroT('ctaContact')}
      />
      <StatsSection />
      <GalleryCarousel
        photos={galleryPhotos.length > 0 ? galleryPhotos : DEFAULT_GALLERY_PHOTOS}
        locale={locale}
        title={galleryT('title')}
        subtitle={galleryT('subtitle')}
        viewAllLabel={galleryT('viewAll')}
      />
      <AboutSection />
      <TestimonialsSection
        testimonials={testimonials}
        title={testimonialT('title')}
        subtitle={testimonialT('subtitle')}
      />
      <CtaSection
        ctaPhoto={ctaPhotos[0] ?? '/images/hero/hero-02.webp'}
        locale={locale}
      />
    </>
  )
}
