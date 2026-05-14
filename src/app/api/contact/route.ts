import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { adminClient } from '@/lib/supabase/admin'

interface Inquiry {
  id: string
  type: 'contact' | 'quote'
  name: string
  email: string
  phone: string
  eventDate: string
  eventLocation: string
  message: string
  package?: string
  createdAt: string
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, phone, eventDate, eventLocation, message, package: pkg, type = 'contact' } = body

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Save to Supabase
  await adminClient().from('inquiries').insert({
    name,
    email: email || '',
    phone: phone || '',
    wedding_date: eventDate || '',
    venue: eventLocation || '',
    message,
    package: pkg || '',
  })

  // Send email via Resend
  const resendApiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_EMAIL || 'soulpicturesms@gmail.com'

  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey)

      const subject = type === 'quote'
        ? `Nueva Solicitud de Cotización — ${name}`
        : `Nuevo Mensaje de Contacto — ${name}`

      const html = `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <div style="border-bottom: 2px solid #C9A96E; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="font-size: 24px; font-weight: normal; color: #1a1a1a; margin: 0;">Soul Pictures MS</h1>
            <p style="color: #C9A96E; font-size: 12px; letter-spacing: 4px; text-transform: uppercase; margin: 4px 0 0;">${subject}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; font-size: 13px; width: 140px;">Nombre</td><td style="padding: 8px 0; font-size: 14px;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Email</td><td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #C9A96E;">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Teléfono</td><td style="padding: 8px 0; font-size: 14px;">${phone}</td></tr>` : ''}
            ${eventDate ? `<tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Fecha del evento</td><td style="padding: 8px 0; font-size: 14px;">${eventDate}</td></tr>` : ''}
            ${eventLocation ? `<tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Lugar del evento</td><td style="padding: 8px 0; font-size: 14px;">${eventLocation}</td></tr>` : ''}
            ${pkg ? `<tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Paquete</td><td style="padding: 8px 0; font-size: 14px;">${pkg}</td></tr>` : ''}
          </table>

          <div style="margin-top: 24px; padding: 20px; background: #f9f6f0; border-left: 3px solid #C9A96E;">
            <p style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px;">Mensaje</p>
            <p style="font-size: 15px; line-height: 1.7; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
          </div>

          <p style="margin-top: 30px; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
            Recibido el ${new Date().toLocaleString('es-DO', { timeZone: 'America/Santo_Domingo' })} · Soul Pictures MS
          </p>
        </div>
      `

      await resend.emails.send({
        from: 'Soul Pictures <onboarding@resend.dev>',
        to: toEmail,
        replyTo: email,
        subject,
        html,
      })
    } catch (err) {
      console.error('Email send failed:', err)
      // Don't fail the request if email fails
    }
  }

  return NextResponse.json({ ok: true })
}
