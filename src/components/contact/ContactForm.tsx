'use client'

import { useState } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'

export default function ContactForm({ locale }: { locale: string }) {
  const isEs = locale === 'es'
  const [form, setForm] = useState({ name: '', email: '', phone: '', eventDate: '', eventLocation: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'contact' }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError(isEs ? 'Algo salió mal. Intenta de nuevo.' : 'Something went wrong. Please try again.')
    }
    setSending(false)
  }

  const inputCls = 'w-full border border-neutral-200 text-neutral-900 text-sm px-4 py-3.5 placeholder-neutral-400 focus:border-[#C9A96E]/60 focus:outline-none transition-colors bg-white'

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle size={48} className="text-[#C9A96E] mb-5" strokeWidth={1} />
        <h3 className="font-playfair text-2xl text-neutral-900 font-light mb-3">
          {isEs ? '¡Mensaje enviado!' : 'Message sent!'}
        </h3>
        <p className="text-neutral-500 leading-relaxed max-w-sm text-sm">
          {isEs
            ? 'Gracias por escribirnos. Estaremos en comunicación contigo dentro de las próximas horas.'
            : "Thank you for reaching out. We'll get back to you within the next few hours."}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-neutral-400 text-xs tracking-widest uppercase block mb-1.5">
          {isEs ? 'Nombre completo' : 'Full name'} *
        </label>
        <input value={form.name} onChange={set('name')} required placeholder={isEs ? 'Tu nombre' : 'Your name'} className={inputCls} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-neutral-400 text-xs tracking-widest uppercase block mb-1.5">Email *</label>
          <input type="email" value={form.email} onChange={set('email')} required placeholder="you@email.com" className={inputCls} />
        </div>
        <div>
          <label className="text-neutral-400 text-xs tracking-widest uppercase block mb-1.5">
            {isEs ? 'Teléfono / WhatsApp' : 'Phone / WhatsApp'}
          </label>
          <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 (809) 000-0000" className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-neutral-400 text-xs tracking-widest uppercase block mb-1.5">
            {isEs ? 'Fecha del evento' : 'Event date'}
          </label>
          <input type="date" value={form.eventDate} onChange={set('eventDate')} className={inputCls} />
        </div>
        <div>
          <label className="text-neutral-400 text-xs tracking-widest uppercase block mb-1.5">
            {isEs ? 'Lugar del evento' : 'Event location'}
          </label>
          <input value={form.eventLocation} onChange={set('eventLocation')} placeholder={isEs ? 'Hotel / Resort' : 'Hotel / Resort'} className={inputCls} />
        </div>
      </div>

      <div>
        <label className="text-neutral-400 text-xs tracking-widest uppercase block mb-1.5">
          {isEs ? 'Tu mensaje' : 'Your message'} *
        </label>
        <textarea
          value={form.message} onChange={set('message')} required rows={5}
          placeholder={isEs
            ? 'Cuéntanos sobre tu boda, lo que sueñas, el estilo que buscas...'
            : "Tell us about your wedding, your vision, the style you're looking for..."}
          className={`${inputCls} resize-none`}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit" disabled={sending}
        className="w-full bg-neutral-900 hover:bg-[#C9A96E] disabled:opacity-60 text-white text-sm font-medium tracking-[0.25em] uppercase py-4 transition-colors flex items-center justify-center gap-2"
      >
        {sending
          ? <><Loader2 size={16} className="animate-spin" /> {isEs ? 'Enviando...' : 'Sending...'}</>
          : isEs ? 'Enviar mensaje' : 'Send message'
        }
      </button>

      <p className="text-neutral-400 text-xs text-center">
        {isEs
          ? 'Respuesta en menos de 24 horas · Consulta sin compromiso'
          : 'Response within 24 hours · No commitment required'}
      </p>
    </form>
  )
}
