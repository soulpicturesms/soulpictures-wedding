import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://soulpictures.com'),
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
    'boda en punta cana fotografo',
    'wedding photographer hard rock punta cana',
    'excellence punta cana wedding photographer',
    'bavaro beach wedding photographer',
    'fotógrafo de bodas punta cana',
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

  return (
    <html lang={locale} className={`${playfair.variable} ${lato.variable}`}>
      <body className="bg-white font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
