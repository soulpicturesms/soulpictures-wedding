import type { Metadata } from 'next'
import ContactForm from '@/components/contact/ContactForm'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'es'
      ? 'Contacto | Fotógrafo de Bodas Punta Cana — Soul Pictures'
      : 'Contact | Punta Cana Wedding Photographer — Soul Pictures',
    description: locale === 'es'
      ? 'Contáctanos para reservar tu sesión de bodas en Punta Cana. Disponible por WhatsApp, email e Instagram.'
      : 'Contact us to book your wedding session in Punta Cana. Available via WhatsApp, email and Instagram.',
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isEs = locale === 'es'

  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-36 pb-20 bg-neutral-900 text-center">
        <p className="text-[#C9A96E] text-xs tracking-[0.45em] uppercase mb-5">Soul Pictures MS</p>
        <h1 className="font-playfair text-5xl md:text-6xl text-white font-light mb-5">
          {isEs ? 'Planifica tu Boda en Punta Cana' : 'Plan Your Punta Cana Wedding'}
        </h1>
        <p className="text-white/45 text-lg max-w-lg mx-auto leading-relaxed">
          {isEs
            ? 'Estamos aquí para escucharte y hacer de tu boda un recuerdo eterno.'
            : 'We are here to listen and turn your wedding into an eternal memory.'}
        </p>
      </section>

      {/* ── Main content ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

            {/* Left: form (wider) */}
            <div className="lg:col-span-3">
              <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase mb-3">
                {isEs ? 'Escríbenos' : 'Get in touch'}
              </p>
              <h2 className="font-playfair text-3xl text-neutral-900 font-light mb-8">
                {isEs ? 'Cuéntanos sobre tu boda' : 'Tell us about your wedding'}
              </h2>
              <ContactForm locale={locale} />
            </div>

            {/* Right: contact info */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase mb-6">
                  {isEs ? 'Información de Contacto' : 'Contact Information'}
                </p>

                <div className="space-y-6">
                  {/* WhatsApp */}
                  <div>
                    <p className="text-neutral-400 text-xs tracking-widest uppercase mb-1">WhatsApp</p>
                    <a
                      href="https://wa.me/18094810241"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-900 hover:text-[#C9A96E] text-base transition-colors"
                    >
                      +1 (809) 481-0241
                    </a>
                  </div>

                  {/* Email */}
                  <div>
                    <p className="text-neutral-400 text-xs tracking-widest uppercase mb-1">Email</p>
                    <a
                      href="mailto:soulpicturesms@gmail.com"
                      className="text-neutral-900 hover:text-[#C9A96E] text-base transition-colors"
                    >
                      soulpicturesms@gmail.com
                    </a>
                  </div>

                  {/* Instagram */}
                  <div>
                    <p className="text-neutral-400 text-xs tracking-widest uppercase mb-1">Instagram</p>
                    <a
                      href="https://instagram.com/soulpicturesms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-900 hover:text-[#C9A96E] text-base transition-colors"
                    >
                      @soulpicturesms
                    </a>
                  </div>

                  {/* Location */}
                  <div>
                    <p className="text-neutral-400 text-xs tracking-widest uppercase mb-1">
                      {isEs ? 'Ubicación' : 'Location'}
                    </p>
                    <p className="text-neutral-900 text-base">Punta Cana, República Dominicana</p>
                  </div>
                </div>
              </div>

              {/* Gold divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent" />

              {/* WhatsApp CTA */}
              <div className="bg-neutral-900 p-6">
                <p className="text-white font-playfair text-lg font-light mb-2">
                  {isEs ? '¿Prefieres chatear?' : 'Prefer to chat?'}
                </p>
                <p className="text-white/40 text-sm mb-5 leading-relaxed">
                  {isEs
                    ? 'Escríbenos directamente por WhatsApp y te respondemos al instante.'
                    : 'Message us directly on WhatsApp and we\'ll reply instantly.'}
                </p>
                <a
                  href="https://wa.me/18094810241"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white text-sm font-medium tracking-[0.15em] uppercase px-5 py-3 transition-colors w-full justify-center"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>

              {/* Availability note */}
              <p className="text-neutral-400 text-xs leading-relaxed">
                {isEs
                  ? '📍 Basados en Punta Cana, disponibles para bodas destino en toda la República Dominicana y el Caribe.'
                  : '📍 Based in Punta Cana, available for destination weddings throughout the Dominican Republic and the Caribbean.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
