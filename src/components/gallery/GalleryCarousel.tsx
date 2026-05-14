'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  photos: string[]
  locale: string
  title: string
  subtitle: string
  viewAllLabel: string
}

const VISIBLE = 6
const INTERVAL_MS = 3000
const FADE_MS = 600

export default function GalleryCarousel({ photos, locale, title, subtitle, viewAllLabel }: Props) {
  const [offset, setOffset] = useState(0)
  const [fading, setFading] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    if (photos.length <= VISIBLE) return
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setOffset(o => (o + 1) % photos.length)
        setFading(false)
      }, FADE_MS)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [photos.length])

  const photo = (i: number) => photos[(offset + i) % photos.length]
  const lightboxPhoto = (i: number) => photos[(i + photos.length) % photos.length]

  const closeLightbox = useCallback(() => setLightbox(null), [])
  const prevPhoto = useCallback(() => setLightbox(i => i !== null ? (i - 1 + photos.length) % photos.length : null), [photos.length])
  const nextPhoto = useCallback(() => setLightbox(i => i !== null ? (i + 1) % photos.length : null), [photos.length])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevPhoto()
      if (e.key === 'ArrowRight') nextPhoto()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, closeLightbox, prevPhoto, nextPhoto])

  const counterCurrent = String(offset + 1).padStart(2, '0')
  const counterTotal   = String(photos.length).padStart(2, '0')
  const progressPct    = photos.length > 0 ? ((offset + 1) / photos.length) * 100 : 0

  return (
    <>
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Elegant header */}
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-5 mb-5">
              <div className="h-px w-10 bg-[#C9A96E]/50" />
              <p className="text-[#C9A96E] text-xs tracking-[0.45em] uppercase">{subtitle}</p>
              <div className="h-px w-10 bg-[#C9A96E]/50" />
            </div>
            <h2 className="font-playfair text-4xl md:text-5xl text-neutral-900 font-light">{title}</h2>
          </div>

          {/* 3×2 grid */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 transition-opacity ease-in-out ${fading ? 'opacity-0' : 'opacity-100'}`}
            style={{ transitionDuration: `${FADE_MS}ms` }}
          >
            {Array.from({ length: VISIBLE }).map((_, i) => {
              const photoIndex = (offset + i) % photos.length
              return (
                <button
                  key={i}
                  onClick={() => photos.length > 0 && setLightbox(photoIndex)}
                  className="relative aspect-[4/5] overflow-hidden bg-neutral-200 group cursor-pointer focus:outline-none"
                  aria-label="Open photo"
                >
                  {photos.length > 0 && (
                    <Image
                      src={photo(i)}
                      alt="Soul Pictures wedding photography Punta Cana"
                      fill
                      className="object-cover transition-[filter] duration-700 brightness-[0.92] group-hover:brightness-100"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={90}
                    />
                  )}
                  {/* Gold border overlay */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-[#C9A96E]/40 transition-colors duration-700 pointer-events-none" />
                  {/* Subtle expand hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="w-10 h-10 border border-white/60 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5">
                        <path d="M1 1h4M1 1v4M13 1h-4M13 1v4M1 13h4M1 13v-4M13 13h-4M13 13v-4"/>
                      </svg>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Bottom bar */}
          <div className="flex items-center gap-6 mt-6">
            <span className="text-neutral-400 text-xs tracking-[0.25em] font-light shrink-0">
              {counterCurrent}
              <span className="text-neutral-300 mx-1.5">/</span>
              {counterTotal}
            </span>

            <div className="flex-1 h-px bg-neutral-200 relative overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-[#C9A96E] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <Link
              href={`/${locale}/portfolio`}
              className="text-neutral-500 hover:text-neutral-900 text-xs tracking-[0.3em] uppercase transition-colors duration-200 shrink-0 group flex items-center gap-2"
            >
              {viewAllLabel}
              <span className="inline-block w-4 h-px bg-current transition-all duration-300 group-hover:w-6" />
            </Link>
          </div>

        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
            aria-label="Close"
          >
            <X size={28} strokeWidth={1} />
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-6 text-white/30 text-xs tracking-widest z-10">
            {String(lightbox + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
          </div>

          {/* Prev */}
          {photos.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prevPhoto() }}
              className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors z-10"
              aria-label="Previous"
            >
              <ChevronLeft size={40} strokeWidth={1} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full mx-16 md:mx-24"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={lightboxPhoto(lightbox)}
              alt="Soul Pictures wedding photography"
              width={1600}
              height={1067}
              className="object-contain w-full h-full max-h-[85vh]"
              style={{ objectFit: 'contain' }}
              quality={95}
              priority
            />
          </div>

          {/* Next */}
          {photos.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); nextPhoto() }}
              className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors z-10"
              aria-label="Next"
            >
              <ChevronRight size={40} strokeWidth={1} />
            </button>
          )}

          {/* Gold accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent" />
        </div>
      )}
    </>
  )
}
