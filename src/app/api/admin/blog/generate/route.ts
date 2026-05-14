import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'
import { cookies } from 'next/headers'
import OpenAI from 'openai'

async function checkAuth() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  return session.isLoggedIn === true
}

export async function POST(request: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 })

  const { mode, title } = await request.json()
  const openai = new OpenAI({ apiKey })

  try {

  // ── Titles: plain text, one per line ──────────────────────────────────────
  if (mode === 'titles') {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 600,
      messages: [
        {
          role: 'system',
          content: 'You are an SEO expert for wedding photography. Reply with a numbered list only, no extra text.'
        },
        {
          role: 'user',
          content: `Give me 10 blog post titles for Soul Pictures MS, a destination wedding photographer in Punta Cana, Dominican Republic.

Target LOW-COMPETITION, HIGH-INTENT long-tail keywords that couples search before booking a photographer. Use specific venue names like: Hard Rock Punta Cana, Excellence Punta Cana, Secrets Royal Beach, Barceló Bávaro, Cap Cana, Dreams Royal Beach, Zoëtry, Sanctuary Cap Cana.

Mix these angles: specific venue + photographer queries, "how to choose" questions, what to expect posts, best time of year, real wedding stories, cost/value questions, unique Caribbean wedding details.

All titles must naturally include at least one of: "Punta Cana wedding photographer", "destination wedding Dominican Republic", "Caribbean wedding photography", or a specific venue name.

Format: one title per line, numbered 1-10. Nothing else.`
        }
      ],
    })

    const raw = completion.choices[0]?.message?.content?.trim() || ''
    console.log('[generate/titles] raw:', raw.slice(0, 400))

    const titles = raw
      .split('\n')
      .map(l => l.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(l => l.length > 10)
      .slice(0, 10)

    if (!titles.length) return NextResponse.json({ error: 'No titles returned', raw }, { status: 500 })
    return NextResponse.json({ titles })
  }

  // ── Post: 2 separate calls to avoid token cutoff ───────────────────────────
  if (mode === 'post' && title) {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60)

    // Call 1: metadata (short)
    const metaCall = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 400,
      messages: [
        { role: 'system', content: 'Reply ONLY with valid JSON, no markdown.' },
        {
          role: 'user',
          content: `For a blog post titled "${title}" about destination weddings in Punta Cana, return this JSON:
{"excerptEn":"2-sentence SEO meta description in English (max 160 chars)","excerptEs":"Same in Spanish","titleEs":"Spanish translation of the title","tags":["tag1","tag2","tag3","tag4","tag5"]}`
        }
      ],
    })

    const metaRaw = (metaCall.choices[0]?.message?.content || '').replace(/^```json?\s*/i, '').replace(/\s*```$/, '').trim()
    console.log('[generate/meta] raw:', metaRaw.slice(0, 300))
    let meta: { excerptEn: string; excerptEs: string; titleEs: string; tags: string[] }
    try {
      meta = JSON.parse(metaRaw)
    } catch {
      return NextResponse.json({ error: 'Meta parse failed', raw: metaRaw.slice(0, 300) }, { status: 500 })
    }

    // Call 2: English content only
    const contentEnCall = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 1800,
      messages: [
        { role: 'system', content: 'You are a wedding photography blogger. Write HTML content only. No JSON, no markdown, no explanations.' },
        {
          role: 'user',
          content: `Write a ~600 word HTML blog post in English for the title: "${title}"
This is for Soul Pictures MS, a luxury destination wedding photography studio in Punta Cana, Dominican Republic (Marcos Schroeder, 2000+ weddings, 15+ years experience).

SEO RULES — follow strictly:
- Use the exact phrase "Punta Cana wedding photographer" at least 2 times naturally in the text
- Include related phrases: "destination wedding photography", "Dominican Republic wedding", and 1-2 specific resort names if relevant
- Each <h2> and <h3> must contain a keyword or a natural question couples search
- Write for humans first, Google second — no keyword stuffing
- Include specific, helpful details (not vague generalities) — couples trust experts who know the details
- Mention Soul Pictures MS by name at least twice

HTML tags only: <h2> <h3> <p> <ul> <li>. No html/head/body tags.
End with a genuine CTA paragraph mentioning Soul Pictures MS and how to get in touch.`
        }
      ],
    })

    const contentEn = contentEnCall.choices[0]?.message?.content?.trim() || ''
    console.log('[generate/contentEn] length:', contentEn.length)

    // Call 3: Spanish content only
    const contentEsCall = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 1800,
      messages: [
        { role: 'system', content: 'Eres un blogger de fotografía de bodas. Escribe solo contenido HTML. Sin JSON, sin markdown, sin explicaciones.' },
        {
          role: 'user',
          content: `Escribe un post de blog en español de ~600 palabras para el título: "${meta.titleEs}"
Es para Soul Pictures MS, estudio de fotografía de bodas de lujo en Punta Cana, República Dominicana.
Usa solo: <h2> <h3> <p> <ul> <li>. Sin etiquetas html/head/body.
Termina con un párrafo invitando a las parejas a contactar Soul Pictures MS.`
        }
      ],
    })

    const contentEs = contentEsCall.choices[0]?.message?.content?.trim() || ''
    console.log('[generate/contentEs] length:', contentEs.length)

    return NextResponse.json({
      post: {
        titleEn: title,
        titleEs: meta.titleEs,
        slug,
        excerptEn: meta.excerptEn,
        excerptEs: meta.excerptEs,
        tags: meta.tags || [],
        contentEn,
        contentEs,
      }
    })
  }

  return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[blog/generate] FATAL:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
