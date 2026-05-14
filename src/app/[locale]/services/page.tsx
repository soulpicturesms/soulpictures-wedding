import type { Metadata } from 'next'
import Link from 'next/link'
import { adminClient } from '@/lib/supabase/admin'
import QuoteForm from '@/components/services/QuoteForm'

export interface Package {
  id: string
  name: string
  nameEs: string
  tagline: string
  taglineEs: string
  price: string
  features: string[]
  featuresEs: string[]
  visible: boolean
  highlighted: boolean
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'es'
      ? 'Servicios & Paquetes | Fotógrafo de Bodas Punta Cana — Soul Pictures'
      : 'Services & Packages | Punta Cana Wedding Photographer — Soul Pictures',
    description: locale === 'es'
      ? 'Paquetes de fotografía de bodas en Punta Cana. Cobertura completa, álbumes premium y video cinematográfico. Solicita tu cotización personalizada.'
      : 'Wedding photography packages in Punta Cana. Full coverage, premium albums and cinematic video. Request your personalized quote.',
  }
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { data: pkgRows } = await adminClient().from('packages').select('*').eq('visible', true).order('sort_order', { ascending: true })
  const packages: Package[] = (pkgRows ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string, name: r.name as string, nameEs: r.name_es as string,
    tagline: r.tagline as string, taglineEs: r.tagline_es as string, price: r.price as string,
    features: r.features as string[], featuresEs: r.features_es as string[],
    visible: r.visible as boolean, highlighted: r.highlighted as boolean,
  }))
  const isEs = locale === 'es'

  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-36 pb-20 bg-neutral-900 text-center">
        <p className="text-[#C9A96E] text-xs tracking-[0.45em] uppercase mb-5">Soul Pictures MS</p>
        <h1 className="font-playfair text-5xl md:text-6xl text-white font-light mb-5">
          {isEs ? 'Paquetes de Fotografía de Bodas' : 'Wedding Photography Packages'}
        </h1>
        <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
          {isEs
            ? 'Cada boda es única. Nuestros paquetes se adaptan a tu visión y sueños.'
            : 'Every wedding is unique. Our packages adapt to your vision and dreams.'}
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="h-px w-16 bg-[#C9A96E]/30" />
          <div className="w-1 h-1 rounded-full bg-[#C9A96E]/50" />
          <div className="h-px w-16 bg-[#C9A96E]/30" />
        </div>
      </section>

      {/* ── Packages ── */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase mb-4">
              {isEs ? 'Nuestros Paquetes' : 'Our Packages'}
            </p>
            <h2 className="font-playfair text-4xl text-white font-light">
              {isEs ? 'Elige tu experiencia' : 'Choose your experience'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-0 border border-white/10">
            {packages.map((pkg, i) => {
              const name = isEs ? pkg.nameEs : pkg.name
              const tagline = isEs ? pkg.taglineEs : pkg.tagline
              const features = isEs ? pkg.featuresEs : pkg.features

              return (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col p-8 border-white/10 transition-colors duration-300 ${
                    pkg.highlighted ? 'bg-[#C9A96E]/8' : 'hover:bg-white/[0.02]'
                  } border-b xl:border-b-0 border-r xl:last:border-r-0 ${
                    i % 2 === 0 ? 'sm:border-r' : 'sm:border-r-0 xl:border-r'
                  }`}
                >
                  {pkg.highlighted && (
                    <div className="absolute top-0 left-0 right-0 h-px bg-[#C9A96E]" />
                  )}
                  {pkg.highlighted && (
                    <span className="absolute top-0 right-5 -translate-y-1/2 bg-[#C9A96E] text-black text-[10px] font-medium tracking-[0.2em] uppercase px-3 py-1">
                      {isEs ? 'Más Popular' : 'Most Popular'}
                    </span>
                  )}

                  <p className="text-[#C9A96E] text-[10px] tracking-[0.35em] uppercase mb-3">
                    {isEs ? 'Paquete' : 'Package'}
                  </p>
                  <h3 className="font-playfair text-2xl text-white font-light mb-1 tracking-wider">{name}</h3>
                  <p className="text-[#C9A96E]/70 text-xs tracking-[0.3em] uppercase mb-6">{tagline}</p>

                  <ul className="flex-1 space-y-2.5 mb-8">
                    {features.map((f, fi) => {
                      const isOption = f.includes('·')
                      return (
                        <li key={fi} className={`flex items-start gap-2.5 text-sm ${isOption ? 'text-[#C9A96E]/80 italic text-xs mt-1' : 'text-white/70'}`}>
                          {!isOption && <span className="text-[#C9A96E] mt-0.5 shrink-0 text-xs">✦</span>}
                          {f}
                        </li>
                      )
                    })}
                  </ul>

                  {pkg.price && (
                    <p className="text-white font-playfair text-2xl mb-5">{pkg.price}</p>
                  )}

                  <a
                    href="#quote"
                    className={`text-center text-xs tracking-[0.25em] uppercase px-5 py-3.5 transition-colors duration-200 ${
                      pkg.highlighted
                        ? 'bg-[#C9A96E] hover:bg-[#b8944f] text-black font-medium'
                        : 'border border-white/20 hover:border-[#C9A96E]/60 text-white/70 hover:text-white'
                    }`}
                  >
                    {isEs ? 'Solicitar cotización' : 'Request a quote'}
                  </a>
                </div>
              )
            })}
          </div>

          {/* Customization note */}
          <div className="mt-10 border border-white/8 p-8 bg-white/[0.02]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-[#C9A96E] text-xs tracking-[0.35em] uppercase mb-2">
                  {isEs ? 'Foto · Video · Ambos' : 'Photo · Video · Both'}
                </p>
                <p className="text-white/50 text-sm leading-relaxed">
                  {isEs
                    ? 'Todos los paquetes están disponibles como fotografía, video, o la combinación de ambos.'
                    : 'Every package is available as photography only, video only, or both combined.'}
                </p>
              </div>
              <div>
                <p className="text-[#C9A96E] text-xs tracking-[0.35em] uppercase mb-2">
                  {isEs ? '100% Personalizable' : '100% Customizable'}
                </p>
                <p className="text-white/50 text-sm leading-relaxed">
                  {isEs
                    ? 'Agrega, quita o cambia cualquier elemento. También puedes crear tu propio paquete desde cero.'
                    : 'Add, remove or change any element. You can also build your own package entirely from scratch.'}
                </p>
              </div>
              <div>
                <p className="text-[#C9A96E] text-xs tracking-[0.35em] uppercase mb-2">
                  {isEs ? 'Agenda una llamada' : 'Book a Call'}
                </p>
                <p className="text-white/50 text-sm leading-relaxed">
                  {isEs
                    ? 'Lo ideal siempre es una llamada para asesorarte personalmente y ayudarte a escoger el paquete perfecto para tu boda.'
                    : "The best way is always a call — we'll personally guide you and help you choose exactly the right package for your wedding."}
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-white/20 text-xs mt-5 tracking-wider">
            {isEs
              ? 'Los precios varían según fecha, duración y requerimientos especiales. Consulta sin compromiso.'
              : 'Prices vary by date, duration and special requirements. No commitment required.'}
          </p>
        </div>
      </section>

      {/* ── Quote form ── */}
      <section id="quote" className="py-24 bg-neutral-900">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left: info */}
            <div>
              <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase mb-5">
                {isEs ? 'Fotógrafo de Bodas Punta Cana' : 'Punta Cana Wedding Photographer'}
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl text-white font-light leading-tight mb-6">
                {isEs ? 'Recibe tu cotización' : 'Receive a Quote'}
              </h2>
              <p className="text-white/50 leading-relaxed mb-8">
                {isEs
                  ? '¿Interesado en nuestros servicios? Déjanos ayudarte con una cotización personalizada. Comparte los detalles de tu evento y nos pondremos en contacto dentro de las próximas horas.'
                  : 'Interested in our services? Let us help you with a personalized quote. Share your event details and we\'ll get back to you within a few hours.'}
              </p>

              <div className="space-y-4 border-t border-white/10 pt-8">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 border border-[#C9A96E]/30 flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
                  </div>
                  <div>
                    <p className="text-white/30 text-xs tracking-widest uppercase mb-0.5">WhatsApp</p>
                    <a href="https://wa.me/18094810241" className="text-white hover:text-[#C9A96E] transition-colors text-sm">
                      +1 (809) 481-0241
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 border border-[#C9A96E]/30 flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div>
                    <p className="text-white/30 text-xs tracking-widest uppercase mb-0.5">Email</p>
                    <a href="mailto:soulpicturesms@gmail.com" className="text-white hover:text-[#C9A96E] transition-colors text-sm">
                      soulpicturesms@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: form */}
            <QuoteForm locale={locale} packages={packages.map(p => isEs ? p.nameEs : p.name)} />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-black text-center border-t border-white/5">
        <p className="text-white/40 text-sm mb-4">
          {isEs ? '¿Listo para comenzar tu historia?' : 'Ready to begin your story?'}
        </p>
        <Link
          href={`/${locale}/portfolio`}
          className="text-[#C9A96E] hover:text-white text-xs tracking-[0.35em] uppercase transition-colors border-b border-[#C9A96E]/40 hover:border-white/40 pb-0.5"
        >
          {isEs ? 'Ver nuestro portafolio' : 'View our portfolio'}
        </Link>
      </section>
    </>
  )
}
