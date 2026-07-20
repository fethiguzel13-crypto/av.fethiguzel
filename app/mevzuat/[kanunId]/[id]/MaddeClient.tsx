'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type PackArticle = {
    title: string
    kanun: string
    maddeNo: number
    official: string
    commentary: string
}

async function gunzipToText(buf: ArrayBuffer): Promise<string> {
    // Browser DecompressionStream for gzip
    if (typeof DecompressionStream !== 'undefined') {
        const ds = new DecompressionStream('gzip')
        const stream = new Response(buf).body!.pipeThrough(ds)
        return await new Response(stream).text()
    }
    // Fallback: assume already JSON (should not happen for .gz)
    return new TextDecoder().decode(buf)
}

function simpleMarkdown(md: string): string {
    // Lightweight markdown → HTML for client (no marked dependency in browser bundle size concerns)
    let html = md
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
    html = html.replace(/^(?!<h[1-3]>)(.+)$/gm, (line) => {
        const t = line.trim()
        if (!t) return ''
        if (t.startsWith('<')) return t
        return `<p>${t}</p>`
    })
    return html
}

export default function MaddeClient({
    kanunId,
    id,
}: {
    kanunId: string
    id: string
}) {
    const [state, setState] = useState<
        | { status: 'loading' }
        | { status: 'error'; message: string }
        | { status: 'ok'; article: PackArticle; officialHtml: string; commentaryHtml: string }
    >({ status: 'loading' })

    useEffect(() => {
        let cancelled = false
            ; (async () => {
                try {
                    const res = await fetch(`/content-packs/${encodeURIComponent(kanunId)}.json.gz`, {
                        cache: 'force-cache',
                    })
                    if (!res.ok) throw new Error(`Pack HTTP ${res.status}`)
                    const buf = await res.arrayBuffer()
                    const bytes = new Uint8Array(buf)
                    const isGzip = bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b
                    const jsonText = isGzip ? await gunzipToText(buf) : new TextDecoder().decode(buf)
                    const pack = JSON.parse(jsonText) as Record<string, PackArticle>
                    const article = pack[id]
                    if (!article) throw new Error('Madde pack içinde bulunamadı')
                    if (cancelled) return
                    setState({
                        status: 'ok',
                        article,
                        officialHtml: simpleMarkdown(article.official),
                        commentaryHtml: article.commentary ? simpleMarkdown(article.commentary) : '',
                    })
                } catch (e) {
                    if (!cancelled) {
                        setState({
                            status: 'error',
                            message: e instanceof Error ? e.message : String(e),
                        })
                    }
                }
            })()
        return () => {
            cancelled = true
        }
    }, [kanunId, id])

    if (state.status === 'loading') {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-10 bg-charcoal/10 rounded-xl w-2/3" />
                <div className="h-64 bg-primary/20 rounded-[2rem]" />
                <div className="h-96 bg-charcoal/5 rounded-[2rem]" />
            </div>
        )
    }

    if (state.status === 'error') {
        return (
            <div className="p-8 rounded-2xl border border-red-200 bg-white">
                <h1 className="text-xl font-bold text-charcoal mb-2">İçerik yüklenemedi</h1>
                <p className="text-sm text-charcoal/60 mb-4">
                    {kanunId}/{id}
                </p>
                <pre className="text-xs bg-charcoal/5 p-4 rounded-xl whitespace-pre-wrap">{state.message}</pre>
                <Link href="/mevzuat" className="inline-block mt-6 text-accent font-bold text-sm">
                    ← Mevzuata dön
                </Link>
            </div>
        )
    }

    const { article, officialHtml, commentaryHtml } = state

    return (
        <div>
            <p className="text-accent font-mono text-[10px] tracking-[0.25em] uppercase mb-2">
                {article.kanun}
            </p>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-10">
                {article.title}
            </h1>

            <section className="bg-primary text-cream rounded-[2rem] p-8 md:p-12 mb-10 shadow-xl">
                <h2 className="text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-6">
                    RESMİ METİN
                </h2>
                <article
                    className="prose prose-invert prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: officialHtml }}
                />
            </section>

            {commentaryHtml ? (
                <section className="bg-white border border-charcoal/10 rounded-[2rem] p-8 md:p-12 shadow-sm">
                    <h2 className="text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-6">
                        AKADEMİK YORUM VE ANALİZ
                    </h2>
                    <article
                        className="prose prose-lg max-w-none prose-charcoal"
                        dangerouslySetInnerHTML={{ __html: commentaryHtml }}
                    />
                </section>
            ) : null}
        </div>
    )
}
