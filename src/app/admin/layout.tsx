import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import '../globals.css'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })
const lato = Lato({ subsets: ['latin'], weight: ['300', '400', '700'], variable: '--font-lato', display: 'swap' })

export const metadata: Metadata = {
  title: 'Admin | Soul Pictures',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${lato.variable}`}>
      <body className="bg-neutral-950 antialiased">
        {children}
      </body>
    </html>
  )
}
