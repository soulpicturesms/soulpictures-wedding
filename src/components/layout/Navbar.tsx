'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, ChevronDown } from 'lucide-react'

const FLAGS: Record<string, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
}

const LANG_LABELS: Record<string, string> = {
  en: 'EN',
  es: 'ES',
}

function LangSwitcher({ locale, switchPath }: { locale: string; switchPath: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const otherLocale = locale === 'en' ? 'es' : 'en'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs tracking-widest uppercase transition-colors"
      >
        <span>{FLAGS[locale]}</span>
        <span>{LANG_LABELS[locale]}</span>
        <ChevronDown size={10} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-black/95 border border-white/10 min-w-[100px] shadow-xl">
          {(['en', 'es'] as const).map(lang => (
            <Link
              key={lang}
              href={lang === locale ? '#' : switchPath}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-xs tracking-widest uppercase transition-colors
                ${lang === locale
                  ? 'text-[#C9A96E] cursor-default'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className="text-base">{FLAGS[lang]}</span>
              <span>{LANG_LABELS[lang]}</span>
              {lang === locale && <span className="ml-auto text-[#C9A96E]/60">✓</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/portfolio`, label: t('portfolio') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/contact`, label: t('contact') },
  ]

  const otherLocale = locale === 'en' ? 'es' : 'en'
  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex flex-col leading-none">
          <span className="text-white text-xl font-light tracking-[0.3em] uppercase">Soul</span>
          <span className="text-[#C9A96E] text-xl font-semibold tracking-[0.3em] uppercase">Pictures</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-white/80 hover:text-[#C9A96E] text-sm tracking-widest uppercase transition-colors duration-200"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-4">
          <LangSwitcher locale={locale} switchPath={switchPath} />
          <Link
            href={`/${locale}/contact`}
            className="bg-[#C9A96E] hover:bg-[#b8944f] text-black text-sm font-medium tracking-widest uppercase px-6 py-2.5 transition-colors duration-200"
          >
            {t('bookNow')}
          </Link>
          <Link
            href="/admin"
            className="text-white/40 hover:text-white/70 text-xs tracking-widest uppercase transition-colors"
          >
            Log In
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-black/98 border-t border-white/10">
          <ul className="flex flex-col px-6 py-6 gap-6">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="text-white/80 hover:text-[#C9A96E] text-sm tracking-widest uppercase transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="border-t border-white/10 pt-4 flex items-center gap-4">
              {/* Mobile lang switcher */}
              <Link
                href={switchPath}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs tracking-widest uppercase"
              >
                <span>{FLAGS[otherLocale]}</span>
                <span>{LANG_LABELS[otherLocale]}</span>
              </Link>
              <Link
                href={`/${locale}/contact`}
                onClick={() => setMenuOpen(false)}
                className="bg-[#C9A96E] hover:bg-[#b8944f] text-black text-sm font-medium tracking-widest uppercase px-6 py-2.5"
              >
                {t('bookNow')}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
