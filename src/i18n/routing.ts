import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/portfolio': { en: '/portfolio', es: '/portafolio' },
    '/portfolio/[slug]': { en: '/portfolio/[slug]', es: '/portafolio/[slug]' },
    '/about': { en: '/about', es: '/nosotros' },
    '/services': { en: '/services', es: '/servicios' },
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
    '/contact': { en: '/contact', es: '/contacto' },
  },
})
