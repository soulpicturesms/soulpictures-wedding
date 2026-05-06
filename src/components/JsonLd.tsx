export function LocalBusinessJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Photographer'],
    name: 'Soul Pictures',
    description:
      'Professional destination wedding photographer in Punta Cana, Dominican Republic. Over 2,000 weddings captured.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://soulpictures.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`,
    telephone: '+18091234567',
    email: 'soulpicturesms@gmail.com',
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
    priceRange: '$$$',
    servesCuisine: undefined,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '20:00',
    },
    sameAs: [
      'https://instagram.com/soulpicturesms',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '2000',
      bestRating: '5',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
