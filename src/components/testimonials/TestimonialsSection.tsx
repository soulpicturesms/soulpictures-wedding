'use client'

import Image from 'next/image'
import { Testimonial } from '@/lib/data'

interface Props {
  testimonials: Testimonial[]
  title: string
  subtitle: string
}

export default function TestimonialsSection({ testimonials, title, subtitle }: Props) {
  const visible = testimonials.filter(t => t.visible)

  return (
    <section className="py-24 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase mb-3">{subtitle}</p>
          <h2 className="font-playfair text-4xl md:text-5xl text-white font-light">{title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visible.map((t) => (
            <div key={t.id} className="flex flex-col border border-white/10 hover:border-[#C9A96E]/30 transition-colors duration-300 overflow-hidden">
              {/* Photo */}
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-800">
                {t.photoUrl ? (
                  <Image
                    src={t.photoUrl}
                    alt={`${t.couple} wedding photography Soul Pictures`}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-600"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                )}
                {/* Gold overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
              </div>

              {/* Review */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-[#C9A96E] text-base">★</span>
                  ))}
                </div>
                <p className="text-white/70 leading-relaxed italic font-light flex-1 mb-5">
                  "{t.text}"
                </p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-white font-playfair text-lg">{t.couple}</p>
                  <p className="text-[#C9A96E] text-xs tracking-wider mt-1">{t.venue}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
