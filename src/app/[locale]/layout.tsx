import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import { Playfair_Display, Lato } from 'next/font/google'
import '../globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://soulpicturesms.com'),
  title: {
    default: 'Soul Pictures | Destination Wedding Photographer Punta Cana',
    template: '%s | Soul Pictures',
  },
  description:
    'Award-winning destination wedding photographer in Punta Cana, Dominican Republic. Over 2,000 weddings captured. Serving Hard Rock, Excellence, Bavaro, and all Punta Cana resorts.',
  keywords: [
    'punta cana wedding photographer',
    'destination wedding photographer punta cana',
    'dominican republic wedding photography',
    'punta cana photoshoot',
    'punta cana beach photoshoot',
    'punta cana wedding photos',
    'dominican photographer',
    'boda en punta cana fotografo',
    'wedding photographer hard rock punta cana',
    'excellence punta cana wedding photographer',
    'bavaro beach wedding photographer',
    'fotógrafo de bodas punta cana',
    'fotógrafo punta cana',
    'destination wedding photography packages',
    'wedding photography dominican republic',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'es_ES',
    siteName: 'Soul Pictures',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'es')) {
    notFound()
  }

  const messages = await getMessages()

  const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://soulpicturesms.com').replace(/\/$/, '')

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${BASE_URL}/#business`,
        name: 'Soul Pictures MS',
        description: 'Luxury destination wedding photographer in Punta Cana, Dominican Republic. Over 2,000 weddings captured.',
        url: BASE_URL,
        telephone: '+18094810241',
        email: 'soulpicturesms@gmail.com',
        image: `${BASE_URL}/images/hero/109-1778210786571.webp`,
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Punta Cana',
          addressRegion: 'La Altagracia',
          addressCountry: 'DO',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 18.5601,
          longitude: -68.3725,
        },
        sameAs: [
          'https://www.instagram.com/soulpicturesms',
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Wedding Photography Packages',
          itemListElement: [
            { '@type': 'Offer', name: 'Basic Package — 2 Hours', description: 'Photography & videography, ceremony coverage, 120+ edited images' },
            { '@type': 'Offer', name: 'Classic Package — 4 Hours', description: 'Getting ready + ceremony + couple shoot, 250+ edited images' },
            { '@type': 'Offer', name: 'Essential Package — 7 Hours', description: 'Full day coverage with drone, 400+ edited images, cinematic highlight video' },
            { '@type': 'Offer', name: 'VIP Package — 9 Hours', description: 'Full day + second day option, drone, 550+ images, documentary + cinematic video' },
          ],
        },
      },
      {
        '@type': 'Person',
        '@id': `${BASE_URL}/#founder`,
        name: 'Marcos Schroeder',
        jobTitle: 'Destination Wedding Photographer',
        worksFor: { '@id': `${BASE_URL}/#business` },
        url: `${BASE_URL}/${locale}/about`,
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: 'Soul Pictures MS',
        inLanguage: ['en', 'es'],
        publisher: { '@id': `${BASE_URL}/#business` },
      },
    ],
  }

  return (
    <html lang={locale} className={`${playfair.variable} ${lato.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body className="bg-white font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
