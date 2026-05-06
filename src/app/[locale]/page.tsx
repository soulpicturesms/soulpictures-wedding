import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Camera, Award, MapPin, Heart } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return {
    title: 'Soul Pictures | Destination Wedding Photographer Punta Cana',
    description: t('hero.subheadline'),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', es: '/es' },
    },
  }
}

function HeroSection() {
  const t = useTranslations('home.hero')
  const locale = 'en' // will be injected by next-intl context

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background - placeholder gradient until real photo uploaded */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="absolute inset-0 bg-[url('/images/hero-placeholder.jpg')] bg-cover bg-center opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase mb-4 font-lato">
          {t('tagline')}
        </p>
        <div className="flex items-center justify-center gap-2 text-white/60 text-xs tracking-widest uppercase mb-8">
          <MapPin size={12} />
          <span>{t('location')}</span>
        </div>
        <h1 className="text-white font-playfair text-5xl md:text-7xl font-light leading-tight mb-6">
          {t('headline')}
        </h1>
        <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed mb-12 max-w-2xl mx-auto">
          {t('subheadline')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/en/portfolio"
            className="bg-[#C9A96E] hover:bg-[#b8944f] text-black text-sm font-medium tracking-[0.2em] uppercase px-10 py-4 transition-colors duration-200 min-w-[200px]"
          >
            {t('cta')}
          </Link>
          <Link
            href="/en/contact"
            className="border border-white/40 hover:border-white text-white text-sm font-light tracking-[0.2em] uppercase px-10 py-4 transition-colors duration-200 min-w-[200px]"
          >
            {t('ctaContact')}
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/40 animate-pulse" />
      </div>
    </section>
  )
}

function StatsSection() {
  const t = useTranslations('home.stats')
  const stats = [
    { value: '2,000+', label: t('weddings'), icon: Camera },
    { value: '15+', label: t('years'), icon: Award },
    { value: '30+', label: t('venues'), icon: MapPin },
    { value: '40+', label: t('countries'), icon: Heart },
  ]

  return (
    <section className="bg-black py-16">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map(({ value, label, icon: Icon }) => (
          <div key={label} className="flex flex-col items-center text-center gap-3">
            <Icon size={20} className="text-[#C9A96E]" />
            <span className="text-white font-playfair text-4xl font-light">{value}</span>
            <span className="text-white/50 text-xs tracking-widest uppercase">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function FeaturedSection() {
  const t = useTranslations('home.featured')

  // Placeholder weddings — replaced by real data from Supabase
  const placeholders = [
    { title: 'Emma & Carlos', venue: 'Hard Rock Hotel', id: 1 },
    { title: 'Sofia & Miguel', venue: 'Excellence Punta Cana', id: 2 },
    { title: 'Isabella & James', venue: 'Bavaro Beach', id: 3 },
    { title: 'Valentina & André', venue: 'Secrets Royal Beach', id: 4 },
    { title: 'Camila & Luca', venue: 'Breathless Punta Cana', id: 5 },
    { title: 'Diana & Roberto', venue: 'Zoëtry Agua', id: 6 },
  ]

  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase mb-3">{t('subtitle')}</p>
          <h2 className="font-playfair text-4xl md:text-5xl text-neutral-900 font-light">{t('title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {placeholders.map((w) => (
            <div
              key={w.id}
              className="group relative aspect-[4/5] bg-neutral-200 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-playfair text-xl">{w.title}</p>
                <p className="text-white/70 text-sm tracking-wider">{w.venue}</p>
              </div>
              {/* Placeholder visual */}
              <div className="w-full h-full flex items-center justify-center">
                <Camera size={32} className="text-neutral-400" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/en/portfolio"
            className="inline-block border border-neutral-900 hover:bg-neutral-900 hover:text-white text-neutral-900 text-sm tracking-[0.2em] uppercase px-10 py-4 transition-colors duration-200"
          >
            {t('viewAll')}
          </Link>
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  const t = useTranslations('home.about')

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-[3/4] bg-neutral-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera size={48} className="text-neutral-300" />
          </div>
          {/* Gold accent line */}
          <div className="absolute -bottom-6 -right-6 w-2/3 h-2/3 border border-[#C9A96E]/30 -z-10" />
        </div>
        <div>
          <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase mb-4">Soul Pictures</p>
          <h2 className="font-playfair text-4xl md:text-5xl text-neutral-900 font-light leading-tight mb-6">
            {t('title')}
          </h2>
          <p className="text-neutral-600 leading-relaxed mb-8">{t('body')}</p>
          <Link
            href="/en/about"
            className="inline-block bg-neutral-900 hover:bg-[#C9A96E] text-white text-sm tracking-[0.2em] uppercase px-8 py-4 transition-colors duration-200"
          >
            {t('learnMore')}
          </Link>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const t = useTranslations('home.testimonials')

  const testimonials = [
    {
      couple: 'Sarah & Daniel',
      venue: 'Hard Rock Hotel & Casino Punta Cana',
      text: 'Marcos and his team were absolutely incredible. Every single photo captured the emotion of our day perfectly. We cannot recommend Soul Pictures enough!',
      rating: 5,
    },
    {
      couple: 'María & Alejandro',
      venue: 'Excellence Punta Cana',
      text: 'Usamos Soul Pictures para nuestra boda destino y quedamos sin palabras. Las fotos son mágicas, profesionales y llenas de amor. ¡Gracias infinitas!',
      rating: 5,
    },
    {
      couple: 'Emma & Thomas',
      venue: 'Secrets Royal Beach',
      text: 'From our first consultation to the final gallery delivery, everything was flawless. The photos tell our story better than we ever could ourselves.',
      rating: 5,
    },
  ]

  return (
    <section className="py-24 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase mb-3">{t('subtitle')}</p>
          <h2 className="font-playfair text-4xl md:text-5xl text-white font-light">{t('title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(({ couple, venue, text, rating }) => (
            <div key={couple} className="border border-white/10 p-8 hover:border-[#C9A96E]/40 transition-colors duration-300">
              <div className="flex gap-1 mb-6">
                {Array.from({ length: rating }).map((_, i) => (
                  <span key={i} className="text-[#C9A96E] text-sm">★</span>
                ))}
              </div>
              <p className="text-white/70 leading-relaxed mb-6 italic font-light">"{text}"</p>
              <div>
                <p className="text-white font-playfair text-lg">{couple}</p>
                <p className="text-[#C9A96E] text-xs tracking-wider mt-1">{venue}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  const t = useTranslations('home.cta')

  return (
    <section className="py-24 bg-[#C9A96E]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-playfair text-4xl md:text-5xl text-black font-light mb-4">{t('title')}</h2>
        <p className="text-black/70 text-lg mb-10">{t('subtitle')}</p>
        <Link
          href="/en/contact"
          className="inline-block bg-black hover:bg-neutral-800 text-white text-sm tracking-[0.2em] uppercase px-12 py-5 transition-colors duration-200"
        >
          {t('button')}
        </Link>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedSection />
      <AboutSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  )
}
