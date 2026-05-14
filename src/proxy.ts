import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware({
  ...routing,
  localeDetection: false, // Always default to English, ignore browser language
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)'],
}
