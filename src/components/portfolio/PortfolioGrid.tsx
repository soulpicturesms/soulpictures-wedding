'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Wedding {
  id: string
  coupleName: string
  year: string
  venue: string
  visible: boolean
  cover: string
  photos: string[]
}

interface Props {
  weddings: Wedding[]
  locale: string
  filterAllLabel: string
  bookLabel: string
}

export default function PortfolioGrid({ weddings, locale, filterAllLabel, bookLabel }: Props) {
  const visible = weddings.filter(w => w.visible)
  const [active, setActive] = useState('all')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const wPhotos = (w: Wedding) =>
    [w.cover, ...w.photos].filter((p, i, arr) => p && arr.indexOf(p) === i)

  const orderedAll = useMemo(() => visible.flatMap(wPhotos), [weddings]) // eslint-disable-line react-hooks/exhaustive-deps
  const [shuffledAll, setShuffledAll] = useState(orderedAll)

  useEffect(() => {
    const arr = [...orderedAll]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    setShuffledAll(arr)
  }, [orderedAll.join()]) // eslint-disable-line react-hooks/exhaustive-deps

  const filteredPhotos = active === 'all'
    ? shuffledAll
    : wPhotos(visible.find(w => w.id === active) ?? visible[0] ?? { cover: '', photos: [] } as unknown as Wedding)

  const activeWedding = visible.find(w => w.id === active)

  // Lightbox
  const closeLightbox = useCallback(() => setLightbox(null), [])
  const prevPhoto = useCallback(() => setLightbox(i => i !== null ? (i - 1 + filteredPhotos.length) % filteredPhotos.length : null), [filteredPhotos.length])
  const nextPhoto = useCallback(() => setLightbox(i => i !== null ? (i + 1) % filteredPhotos.length : null), [filteredPhotos.length])

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

  return (
    <>
      {/* Filter tabs */}
      <section className="bg-neutral-900 border-b border-white/10 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 flex gap-6 overflow-x-auto">
          <button
            onClick={() => setActive('all')}
            className={`py-4 text-xs tracking-[0.3em] uppercase whitespace-nowrap border-b-2 transition-colors ${
              active === 'all'
                ? 'border-[#C9A96E] text-[#C9A96E]'
                : 'border-transparent text-white/40 hover:text-white/70'
            }`}
          >
            {filterAllLabel}
          </button>
          {visible.map(w => (
            <button
              key={w.id}
              onClick={() => setActive(w.id)}
              className={`py-4 text-xs tracking-[0.2em] uppercase whitespace-nowrap border-b-2 transition-colors font-playfair ${
                active === w.id
                  ? 'border-[#C9A96E] text-[#C9A96E]'
                  : 'border-transparent text-white/40 hover:text-white/70'
              }`}
            >
              {w.coupleName}
            </button>
          ))}
        </div>
      </section>

      {/* Wedding info bar */}
      {activeWedding && (
        <section className="bg-neutral-950 border-b border-white/5 py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-4 text-xs">
            <span className="text-white font-playfair text-base">{activeWedding.coupleName}</span>
            <span className="text-white/30">·</span>
            <span className="text-[#C9A96E] tracking-widest uppercase">{activeWedding.venue}</span>
            <span className="text-white/30">·</span>
            <span className="text-white/40">{activeWedding.year}</span>
          </div>
        </section>
      )}

      {/* Photo grid */}
      <section className="bg-neutral-950 py-2">
        <div className="max-w-7xl mx-auto px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredPhotos.filter(Boolean).map((src, i) => (
              <button
                key={`${src}-${i}`}
                onClick={() => setLightbox(i)}
                className="group relative aspect-[4/5] overflow-hidden bg-neutral-800 cursor-pointer focus:outline-none"
                aria-label="Open photo"
              >
                <Image
                  src={src}
                  alt="Soul Pictures wedding photography Punta Cana"
                  fill
                  className="object-cover transition-[filter] duration-700 brightness-[0.92] group-hover:brightness-100"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={90}
                />
                {/* Gold border */}
                <div className="absolute inset-0 border border-transparent group-hover:border-[#C9A96E]/40 transition-colors duration-700 pointer-events-none" />
                {/* Expand icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="w-10 h-10 border border-white/60 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5">
                      <path d="M1 1h4M1 1v4M13 1h-4M13 1v4M1 13h4M1 13v-4M13 13h-4M13 13v-4"/>
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-900 py-20 text-center">
        <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase mb-4">Soul Pictures</p>
        <h2 className="font-playfair text-3xl md:text-4xl text-white font-light mb-6">
          Ready to Create Your Story?
        </h2>
        <Link
          href={`/${locale}/contact`}
          className="inline-block bg-[#C9A96E] hover:bg-[#b8944f] text-black text-sm font-medium tracking-[0.2em] uppercase px-10 py-4 transition-colors"
        >
          {bookLabel}
        </Link>
      </section>

      {/* Lightbox */}
      {lightbox !== null && filteredPhotos[lightbox] && (
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
            {String(lightbox + 1).padStart(2, '0')} / {String(filteredPhotos.length).padStart(2, '0')}
          </div>

          {/* Prev */}
          {filteredPhotos.length > 1 && (
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
              src={filteredPhotos[lightbox]}
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
          {filteredPhotos.length > 1 && (
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
