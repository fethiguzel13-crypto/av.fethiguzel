import Link from 'next/link'
import type { Metadata } from 'next'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ kanunId: string; id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kanunId, id } = await params
  return { title: `${kanunId} ${id} | Av. Fethi Güzel` }
}

/**
 * Minimal article page — load pack via fetch only, no heavy client components.
 * Goal: restore production madde routes on Vercel.
 */
export default async function ArticlePage({ params }: Props) {
  const { kanunId, id } = await params

  const bases = [
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '')}`
      : null,
    'https://avfethiguzel.com',
  ].filter(Boolean) as string[]

  let error = ''
  let title = id
  let kanun = kanunId
  let official = ''
  let commentary = ''

  try {
    const { gunzipSync } = await import('zlib')
    const { marked } = await import('marked')

    let pack: Record<
      string,
      { title: string; kanun: string; maddeNo: number; official: string; commentary: string }
    > | null = null

    for (const base of bases) {
      const url = `${base}/content-packs/${encodeURIComponent(kanunId)}.json.gz`
      try {
        const res = await fetch(url, { cache: 'force-cache', next: { revalidate: 86400 } })
        if (!res.ok) {
          error += `HTTP ${res.status} @ ${base}; `
          continue
        }
        const buf = Buffer.from(await res.arrayBuffer())
        const json =
          buf[0] === 0x1f && buf[1] === 0x8b
            ? gunzipSync(buf).toString('utf8')
            : buf.toString('utf8')
        pack = JSON.parse(json)
        error = ''
        break
      } catch (e) {
        error += `${base}: ${e instanceof Error ? e.message : String(e)}; `
      }
    }

    if (!pack || !pack[id]) {
      return (
        <main className="min-h-screen bg-cream p-10 pt-32 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-charcoal mb-4">İçerik yüklenemedi</h1>
          <p className="text-sm text-charcoal/70 mb-2">
            {kanunId}/{id}
          </p>
          <pre className="text-xs bg-white border p-4 rounded-xl whitespace-pre-wrap">
            {error || 'Madde pack içinde yok'}
          </pre>
          <Link href="/mevzuat" className="inline-block mt-6 text-accent font-bold">
            ← Mevzuat
          </Link>
        </main>
      )
    }

    const a = pack[id]
    title = a.title
    kanun = a.kanun
    official = await marked(a.official)
    commentary = a.commentary ? await marked(a.commentary) : ''
  } catch (e) {
    return (
      <main className="min-h-screen bg-cream p-10 pt-32 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-charcoal mb-4">Beklenmeyen hata</h1>
        <pre className="text-xs bg-white border p-4 rounded-xl whitespace-pre-wrap">
          {e instanceof Error ? e.message : String(e)}
        </pre>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-cream pt-28 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <nav className="text-xs text-charcoal/50 mb-6">
          <Link href="/" className="hover:text-accent">
            Ana Sayfa
          </Link>
          {' / '}
          <Link href="/mevzuat" className="hover:text-accent">
            Mevzuat
          </Link>
          {' / '}
          <span className="text-charcoal">{title}</span>
        </nav>

        <p className="text-accent font-mono text-[10px] tracking-[0.25em] uppercase mb-2">{kanun}</p>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-10">{title}</h1>

        <section className="bg-primary text-cream rounded-[2rem] p-8 md:p-12 mb-10">
          <h2 className="text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-6">
            RESMİ METİN
          </h2>
          <article
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: official }}
          />
        </section>

        {commentary ? (
          <section className="bg-white border border-charcoal/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-6">
              AKADEMİK YORUM VE ANALİZ
            </h2>
            <article
              className="prose prose-lg max-w-none prose-charcoal"
              dangerouslySetInnerHTML={{ __html: commentary }}
            />
          </section>
        ) : null}
      </div>
    </main>
  )
}
