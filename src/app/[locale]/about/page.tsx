import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About | Punta Cana Wedding Photographer — Soul Pictures MS',
  description:
    'Meet Soul Pictures MS — Punta Cana\'s premier destination wedding photographer. Over 2,000 weddings and photoshoots captured across the Dominican Republic and the Caribbean.',
}

// ─── Inline SVG icons ────────────────────────────────────────────────────────

function IconCamera() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function IconHeart() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function IconUsers() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconRing() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="14" r="7" />
      <path d="M8.5 4h7l1.5 5H7z" />
      <line x1="12" y1="7" x2="12" y2="7.01" />
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: '2,000+', label: 'Weddings Captured' },
  { value: '15+',    label: 'Years of Experience' },
  { value: '30+',    label: 'Venues & Resorts' },
  { value: 'Punta Cana', label: 'Home Base' },
]

const specialties = [
  {
    Icon: IconCamera,
    title: 'Wedding Photography',
    description:
      'Every ceremony, every glance, every tear of joy — preserved with artistry and precision. We craft visual narratives that honor the full depth of your wedding day.',
  },
  {
    Icon: IconHeart,
    title: 'Punta Cana Photoshoots',
    description:
      'From sunrise beach photoshoots along the shores of Punta Cana to golden-hour portraits at your resort — intimate sessions that reveal the authentic connection between two people.',
  },
  {
    Icon: IconUsers,
    title: 'Family Portraits',
    description:
      'Timeless family photographs that capture the love, laughter, and bonds that define your family — images you will pass down for generations.',
  },
  {
    Icon: IconRing,
    title: 'Marriage Proposals',
    description:
      'The moment before forever deserves to be remembered perfectly. We discreetly document your proposal so every emotion lives on in stunning detail.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <>
      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-neutral-900 pt-36 pb-28 px-6 text-center">
        <p className="text-[#C9A96E] text-xs tracking-[0.5em] uppercase mb-6">
          Punta Cana, Dominican Republic
        </p>
        <h1 className="font-playfair text-5xl md:text-7xl text-white font-light leading-tight max-w-4xl mx-auto mb-8 text-center">
          <span className="block">More than a studio</span>
          <span className="block text-[#C9A96E]">we are storytellers</span>
        </h1>
        <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Capturing life&apos;s most extraordinary moments with intention,
          artistry, and an unwavering eye for beauty.
        </p>
        {/* gold rule */}
        <div className="mt-14 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-[#C9A96E]/40" />
          <div className="w-1 h-1 rounded-full bg-[#C9A96E]/60" />
          <div className="h-px w-16 bg-[#C9A96E]/40" />
        </div>
      </section>

      {/* ── 2. Philosophy — 2-col text + image ───────────────────────────── */}
      <section className="bg-white py-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* text column */}
          <div>
            <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase mb-5">
              Our Philosophy
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl text-neutral-900 font-light leading-snug mb-8">
              Authenticity above everything
            </h2>
            <p className="text-neutral-500 leading-relaxed mb-6 text-[0.9375rem]">
              At Soul Pictures MS, we are more than a photography and videography
              studio — we are storytellers, capturers of magical moments, and
              creators of eternal memories. Specializing in destination weddings,
              Punta Cana photoshoots, beach sessions, family portraits, and marriage
              proposals, we are passionate about immortalizing life&apos;s most special moments.
            </p>
            <p className="text-neutral-500 leading-relaxed text-[0.9375rem]">
              Our philosophy centers on authenticity and emotion. Each session is
              an opportunity to immerse ourselves in the singular world of every
              couple and family — to seek out the unique essence of their love and
              connection, and translate it into images that last a lifetime.
            </p>
            {/* subtle divider */}
            <div className="mt-10 h-px w-12 bg-[#C9A96E]" />
          </div>

          {/* image column */}
          <div className="relative">
            {/* gold frame accent — offset behind the photo */}
            <div
              className="absolute -bottom-5 -right-5 border border-[#C9A96E]/35"
              style={{ inset: 'auto -20px -20px auto', width: '67%', height: '67%' }}
              aria-hidden="true"
            />
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/about/session-01.webp"
                alt="Couple photography session — Soul Pictures MS, Punta Cana"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Stats bar ─────────────────────────────────────────────────── */}
      <section className="bg-black py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center text-center gap-3">
              <div className="h-px w-8 bg-[#C9A96E]/50 mb-1" aria-hidden="true" />
              <span className="font-playfair text-4xl md:text-5xl text-white font-light">
                {value}
              </span>
              <span className="text-white/45 text-xs tracking-[0.3em] uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Story — centered text, gold divider ───────────────────────── */}
      <section className="bg-neutral-50 py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase mb-5">
            Our Story
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl text-neutral-900 font-light leading-snug mb-10">
            A legacy built on excellence
          </h2>

          {/* gold ornamental divider */}
          <div className="flex items-center justify-center gap-3 mb-10" aria-hidden="true">
            <div className="h-px flex-1 bg-[#C9A96E]/30" />
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 0L10.59 6.41L17 5L11.77 9.77L14 16L9 12.5L4 16L6.23 9.77L1 5L7.41 6.41Z"
                fill="#C9A96E"
                opacity="0.6"
              />
            </svg>
            <div className="h-px flex-1 bg-[#C9A96E]/30" />
          </div>

          <p className="text-neutral-500 leading-relaxed mb-8 text-[0.9375rem]">
            With over fifteen years of experience in the industry, we are proud to
            have been trusted with more than 2,000 weddings, beach photoshoots, and
            couple sessions — each one a distinct story told against the stunning
            backdrop of Punta Cana and destinations around the world. Our commitment
            to excellence and meticulous attention to detail has remained unwavering from day one.
          </p>
          <p className="text-neutral-500 leading-relaxed text-[0.9375rem]">
            At Soul Pictures MS, we understand that every client is unique. From the
            first consultation through to the final delivery of your gallery, we offer
            a deeply personalized experience — one designed not merely to meet your
            expectations, but to surpass them in every way imaginable.
          </p>
        </div>
      </section>

      {/* ── 5. Specialties — 4 cards ─────────────────────────────────────── */}
      <section className="bg-white py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase mb-4">
              What We Do
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl text-neutral-900 font-light">
              Our Specialties
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {specialties.map(({ Icon, title, description }) => (
              <div
                key={title}
                className="group border border-neutral-100 hover:border-[#C9A96E]/50 p-8 flex flex-col gap-6 transition-colors duration-300"
              >
                <div className="text-[#C9A96E]">
                  <Icon />
                </div>
                <div className="h-px w-8 bg-neutral-200 group-hover:bg-[#C9A96E]/50 transition-colors duration-300" />
                <h3 className="font-playfair text-xl text-neutral-900 font-light leading-snug">
                  {title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed flex-1">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-neutral-900 py-32 px-6 text-center">
        <p className="text-[#C9A96E] text-xs tracking-[0.5em] uppercase mb-6">
          Let&apos;s Create Together
        </p>
        <h2 className="font-playfair text-4xl md:text-6xl text-white font-light leading-tight max-w-3xl mx-auto mb-10">
          Ready to begin your story?
        </h2>
        <p className="text-white/50 max-w-md mx-auto mb-12 leading-relaxed">
          Every great love story deserves to be told beautifully. We would be
          honored to be yours.
        </p>
        <Link
          href={`/${locale}/contact`}
          className="inline-block border border-[#C9A96E] text-[#C9A96E] hover:bg-[#C9A96E] hover:text-black text-sm tracking-[0.3em] uppercase px-12 py-5 transition-colors duration-300"
        >
          Get in Touch
        </Link>
      </section>
    </>
  )
}
