'use client'

import { useState } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'

interface Props {
  locale: string
  packages: string[]
}

export default function QuoteForm({ locale, packages }: Props) {
  const isEs = locale === 'es'
  const [form, setForm] = useState({
    name: '', email: '', phone: '', eventDate: '', eventLocation: '', package: '', message: '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'quote' }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError(isEs ? 'Algo salió mal. Intenta de nuevo.' : 'Something went wrong. Please try again.')
    }
    setSending(false)
  }

  const inputCls = 'w-full bg-neutral-800 border border-white/10 text-white text-sm px-4 py-3 placeholder-white/25 focus:border-[#C9A96E]/60 focus:outline-none transition-colors'

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle size={48} className="text-[#C9A96E] mb-6" strokeWidth={1} />
        <h3 className="font-playfair text-2xl text-white font-light mb-3">
          {isEs ? '¡Mensaje enviado!' : 'Message sent!'}
        </h3>
        <p className="text-white/50 leading-relaxed max-w-sm">
          {isEs
            ? 'Gracias por contactarnos. Estaremos en comunicación contigo dentro de las próximas horas.'
            : 'Thank you for reaching out. We\'ll be in touch with you within the next few hours.'}
        </p>
        <button
          onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', eventDate: '', eventLocation: '', package: '', message: '' }) }}
          className="mt-8 text-[#C9A96E] text-xs tracking-[0.3em] uppercase border-b border-[#C9A96E]/40 hover:border-[#C9A96E] transition-colors pb-0.5"
        >
          {isEs ? 'Enviar otra consulta' : 'Send another inquiry'}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-white/40 text-xs tracking-widest uppercase block mb-1.5">
          {isEs ? 'Nombre completo' : 'Full name'} *
        </label>
        <input
          value={form.name} onChange={set('name')} required
          placeholder={isEs ? 'Tu nombre' : 'Your name'}
          className={inputCls}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-white/40 text-xs tracking-widest uppercase block mb-1.5">Email *</label>
          <input
            type="email" value={form.email} onChange={set('email')} required
            placeholder="you@email.com"
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-white/40 text-xs tracking-widest uppercase block mb-1.5">
            {isEs ? 'Teléfono / WhatsApp' : 'Phone / WhatsApp'}
          </label>
          <input
            type="tel" value={form.phone} onChange={set('phone')}
            placeholder="+1 (809) 000-0000"
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-white/40 text-xs tracking-widest uppercase block mb-1.5">
            {isEs ? 'Fecha del evento' : 'Event date'}
          </label>
          <input
            type="date" value={form.eventDate} onChange={set('eventDate')}
            className={`${inputCls} [color-scheme:dark]`}
          />
        </div>
        <div>
          <label className="text-white/40 text-xs tracking-widest uppercase block mb-1.5">
            {isEs ? 'Lugar del evento' : 'Event location'}
          </label>
          <input
            value={form.eventLocation} onChange={set('eventLocation')}
            placeholder={isEs ? 'Hotel / Resort' : 'Hotel / Resort'}
            className={inputCls}
          />
        </div>
      </div>

      {packages.length > 0 && (
        <div>
          <label className="text-white/40 text-xs tracking-widest uppercase block mb-1.5">
            {isEs ? 'Paquete de interés' : 'Package of interest'}
          </label>
          <select value={form.package} onChange={set('package')} className={`${inputCls} cursor-pointer`}>
            <option value="">{isEs ? 'Seleccionar paquete...' : 'Select a package...'}</option>
            {packages.map(p => <option key={p} value={p}>{p}</option>)}
            <option value="custom">{isEs ? 'Paquete personalizado' : 'Custom package'}</option>
          </select>
        </div>
      )}

      <div>
        <label className="text-white/40 text-xs tracking-widest uppercase block mb-1.5">
          {isEs ? 'Cuéntanos sobre tu boda' : 'Tell us about your wedding'}
        </label>
        <textarea
          value={form.message} onChange={set('message')} rows={5} required
          placeholder={isEs
            ? 'Comparte los detalles de tu boda, lo que sueñas, el estilo que buscas...'
            : 'Share your wedding details, your vision, the style you\'re looking for...'}
          className={`${inputCls} resize-none`}
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit" disabled={sending}
        className="w-full bg-[#C9A96E] hover:bg-[#b8944f] disabled:opacity-60 text-black text-sm font-medium tracking-[0.25em] uppercase py-4 transition-colors flex items-center justify-center gap-2"
      >
        {sending
          ? <><Loader2 size={16} className="animate-spin" /> {isEs ? 'Enviando...' : 'Sending...'}</>
          : isEs ? 'Enviar consulta' : 'Send inquiry'
        }
      </button>

      <p className="text-white/20 text-xs text-center">
        {isEs
          ? 'Respuesta en menos de 24 horas · Consulta sin compromiso'
          : 'Response within 24 hours · No commitment required'}
      </p>
    </form>
  )
}
