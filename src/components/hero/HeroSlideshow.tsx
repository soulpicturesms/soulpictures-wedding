'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  photos: string[]
  locale: string
  headline: string
  tagline: string
  location: string
  ctaLabel: string
  ctaContactLabel: string
}

export default function HeroSlideshow({
  photos, locale, headline, tagline, location, ctaLabel, ctaContactLabel
}: Props) {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (photos.length <= 1) return
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setPrev(current)
        setCurrent(c => (c + 1) % photos.length)
        setFading(false)
      }, 800)
    }, 5000)
    return () => clearInterval(interval)
  }, [photos.length, current])

  const goTo = (index: number) => {
    if (index === current) return
    setPrev(current)
    setCurrent(index)
  }

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background images */}
      {photos.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <Image
            src={src}
            alt={`Soul Pictures destination wedding photography ${i + 1}`}
            fill
            priority={i === 0}
            className="object-cover object-center"
            quality={95}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/65 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase mb-8">{tagline}</p>
        <h1 className="text-white font-playfair text-5xl md:text-7xl font-light leading-tight mb-12 drop-shadow-lg">
          {headline}
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/${locale}/portfolio`}
            className="bg-[#C9A96E] hover:bg-[#b8944f] text-black text-sm font-medium tracking-[0.2em] uppercase px-10 py-4 transition-colors duration-200 min-w-[200px]"
          >
            {ctaLabel}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="border border-white/60 hover:border-white hover:bg-white/10 text-white text-sm font-light tracking-[0.2em] uppercase px-10 py-4 transition-colors duration-200 min-w-[200px]"
          >
            {ctaContactLabel}
          </Link>
        </div>
      </div>

      {/* Dots navigation */}
      {photos.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current ? 'bg-[#C9A96E] w-6 h-2' : 'bg-white/40 hover:bg-white/70 w-2 h-2'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide counter */}
      {photos.length > 1 && (
        <div className="absolute top-24 right-8 z-20 text-white/30 text-xs tracking-widest">
          {String(current + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
        </div>
      )}
    </section>
  )
}
