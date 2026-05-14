import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Mail, Phone } from 'lucide-react'

export default function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const locale = useLocale()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex flex-col leading-none mb-4">
              <span className="text-white text-xl font-light tracking-[0.3em] uppercase">Soul</span>
              <span className="text-[#C9A96E] text-xl font-semibold tracking-[0.3em] uppercase">Pictures</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">{t('tagline')}</p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com/soulpicturesms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-[#C9A96E] transition-colors"
                aria-label="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a
                href="mailto:soulpicturesms@gmail.com"
                className="text-white/40 hover:text-[#C9A96E] transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
              <a
                href="https://wa.me/18094810241"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-[#C9A96E] transition-colors"
                aria-label="WhatsApp"
              >
                <Phone size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white text-xs tracking-[0.3em] uppercase mb-6">Navigation</h3>
            <ul className="flex flex-col gap-3">
              {[
                { href: `/${locale}`, label: tNav('home') },
                { href: `/${locale}/portfolio`, label: tNav('portfolio') },
                { href: `/${locale}/about`, label: tNav('about') },
                { href: `/${locale}/services`, label: tNav('services') },
                { href: `/${locale}/blog`, label: tNav('blog') },
                { href: `/${locale}/contact`, label: tNav('contact') },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/50 hover:text-[#C9A96E] text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-xs tracking-[0.3em] uppercase mb-6">Contact</h3>
            <ul className="flex flex-col gap-3 text-sm text-white/50">
              <li>Punta Cana, República Dominicana</li>
              <li>
                <a href="mailto:soulpicturesms@gmail.com" className="hover:text-[#C9A96E] transition-colors">
                  soulpicturesms@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/18094810241" className="hover:text-[#C9A96E] transition-colors">
                  WhatsApp: +1 (809) 481-0241
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {year} Soul Pictures. {t('rights')}
          </p>
          <div className="flex items-center gap-6">
            <Link href={`/${locale}/privacy`} className="text-white/30 hover:text-white/60 text-xs transition-colors">
              {t('privacy')}
            </Link>
            <Link href={`/${locale}/terms`} className="text-white/30 hover:text-white/60 text-xs transition-colors">
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
