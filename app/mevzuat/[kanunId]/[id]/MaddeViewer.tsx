'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type PackArticle = {
    title: string;
    kanun: string;
    maddeNo: number;
    official: string;
    commentary: string;
};

type Pack = Record<string, PackArticle>;

function escapeHtml(s: string) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function cleanOfficial(md: string) {
    return String(md || '')
        .replace(/[ \t]{2,}/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function inlineFormat(s: string) {
    let t = escapeHtml(s);
    t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/(^|[^*\w])\*(?!\s)(.+?)(?!\s)\*(?!\*)/g, '$1<em>$2</em>');
    t = t.replace(/[«"]([^»"\n]{3,160})[»"]/g, '<span class="quote-inline">«$1»</span>');
    return t;
}

/** Full markdown → HTML for legal prose (#### → real headings, no raw hashes). */
function mdToHtml(md: string, opts: { official?: boolean; listOk?: boolean } = {}) {
    const text = String(md || '')
        .replace(/\r\n/g, '\n')
        .trim();
    if (!text) return '';

    const lines = text.split('\n');
    const out: string[] = [];
    let i = 0;
    let inUl = false;
    let inOl = false;
    let inBq = false;
    let para: string[] = [];

    const closeLists = () => {
        if (inUl) {
            out.push('</ul>');
            inUl = false;
        }
        if (inOl) {
            out.push('</ol>');
            inOl = false;
        }
    };
    const closeBq = () => {
        if (inBq) {
            out.push('</blockquote>');
            inBq = false;
        }
    };
    const flushPara = () => {
        if (!para.length) return;
        const body = para.join(' ').replace(/\s+/g, ' ').trim();
        para = [];
        if (!body) return;
        if (opts.official && /^Madde\s+\d+/i.test(body)) {
            out.push(`<p class="statute-lead">${inlineFormat(body)}</p>`);
            return;
        }
        if (
            opts.official &&
            /^\d+\.\s+\S/.test(body) &&
            body.length < 80 &&
            !/Madde\s+\d+/i.test(body)
        ) {
            out.push(`<p class="statute-margin">${inlineFormat(body)}</p>`);
            return;
        }
        out.push(`<p>${inlineFormat(body)}</p>`);
    };

    while (i < lines.length) {
        const t = lines[i].trim();
        i++;
        if (!t) {
            flushPara();
            closeLists();
            closeBq();
            continue;
        }
        if (/^(-{3,}|_{3,}|\*{3,})$/.test(t)) {
            flushPara();
            closeLists();
            closeBq();
            out.push('<hr />');
            continue;
        }
        const hm = t.match(/^(#{1,6})\s+(.+)$/);
        if (hm) {
            flushPara();
            closeLists();
            closeBq();
            const level = Math.min(hm[1].length, 6);
            const title = hm[2].replace(/\s*#+\s*$/, '').replace(/^#+\s*/, '').trim();
            const id = `h-${out.length}-${level}`;
            out.push(`<h${level} id="${id}">${inlineFormat(title)}</h${level}>`);
            continue;
        }
        if (/^>\s?/.test(t)) {
            flushPara();
            closeLists();
            if (!inBq) {
                out.push('<blockquote>');
                inBq = true;
            }
            out.push(`<p>${inlineFormat(t.replace(/^>\s?/, ''))}</p>`);
            continue;
        }
        closeBq();

        const ulm = t.match(/^[-*•]\s+(.+)$/);
        if (ulm) {
            flushPara();
            if (inOl) {
                out.push('</ol>');
                inOl = false;
            }
            if (!inUl) {
                out.push('<ul>');
                inUl = true;
            }
            out.push(`<li>${inlineFormat(ulm[1])}</li>`);
            continue;
        }

        const olm = t.match(/^\d+[.)]\s+(.+)$/);
        if (
            olm &&
            (opts.listOk || olm[1].length > 40 || /[.;:]/.test(olm[1])) &&
            !(opts.official && t.length < 60 && !opts.listOk)
        ) {
            flushPara();
            if (inUl) {
                out.push('</ul>');
                inUl = false;
            }
            if (!inOl) {
                out.push('<ol>');
                inOl = true;
            }
            out.push(`<li>${inlineFormat(olm[1])}</li>`);
            continue;
        }

        closeLists();
        para.push(t);
    }
    flushPara();
    closeLists();
    closeBq();
    return out.join('\n');
}

async function gunzipToText(buf: ArrayBuffer) {
    const ds = new DecompressionStream('gzip');
    const stream = new Response(buf).body!.pipeThrough(ds);
    return new Response(stream).text();
}

async function loadPack(kanunId: string): Promise<Pack> {
    const kid = encodeURIComponent(kanunId);
    // jsDelivr first: production static packs were empty stubs on Vercel CDN
    const urls = [
        `https://cdn.jsdelivr.net/gh/fethiguzel13-crypto/av.fethiguzel@main/content-packs/${kid}.json.gz`,
        `https://raw.githubusercontent.com/fethiguzel13-crypto/av.fethiguzel/main/content-packs/${kid}.json.gz`,
        `/packs/${kid}.json.gz`,
        `/api/content-pack/${kid}`,
        `/content-packs/${kid}.json.gz?v=6`,
    ];
    let lastErr: unknown;
    for (const url of urls) {
        try {
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const buf = await res.arrayBuffer();
            if (buf.byteLength < 64) throw new Error(`empty ${buf.byteLength}`);
            const bytes = new Uint8Array(buf);
            const isGzip = bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
            const jsonText = isGzip ? await gunzipToText(buf) : new TextDecoder().decode(buf);
            return JSON.parse(jsonText) as Pack;
        } catch (e) {
            lastErr = e;
        }
    }
    throw lastErr instanceof Error ? lastErr : new Error('Pack yüklenemedi');
}

function displayTitle(article: PackArticle, id: string) {
    let t = article?.title || id;
    const n = article?.maddeNo;
    if (n) {
        const m = t.match(/Madde\s*(\d+)/i);
        if (m && parseInt(m[1], 10) !== n) t = t.replace(/Madde\s*\d+/i, `Madde ${n}`);
        else if (!m) t = `${t} — Madde ${n}`;
    }
    return t;
}

function tocFromHtml(html: string) {
    const items: { id: string; text: string; level: number }[] = [];
    const re = /<h([45]) id="([^"]+)">([\s\S]*?)<\/h\1>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html))) {
        const text = m[3].replace(/<[^>]+>/g, '').trim();
        if (text) items.push({ id: m[2], text, level: parseInt(m[1], 10) });
    }
    return items;
}

export default function MaddeViewer({
    kanunId,
    id,
}: {
    kanunId: string;
    id: string;
}) {
    const [pack, setPack] = useState<Pack | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setError(null);
        setPack(null);
        loadPack(kanunId)
            .then((p) => {
                if (!cancelled) setPack(p);
            })
            .catch((e) => {
                if (!cancelled) setError(e?.message || String(e));
            });
        return () => {
            cancelled = true;
        };
    }, [kanunId, id]);

    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const max = el.scrollHeight - el.clientHeight;
            setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [pack, id]);

    const article = pack?.[id];
    const title = article ? displayTitle(article, id) : id;

    const officialHtml = useMemo(
        () => (article ? mdToHtml(cleanOfficial(article.official || ''), { official: true }) : ''),
        [article]
    );
    const commentaryHtml = useMemo(() => {
        if (!article?.commentary?.trim()) return '';
        let c = article.commentary.trim().replace(/^###\s*Akademik Yorum[^\n]*\n+/i, '');
        return mdToHtml(c, { listOk: true });
    }, [article]);

    const toc = useMemo(() => tocFromHtml(commentaryHtml), [commentaryHtml]);

    const adj = useMemo(() => {
        if (!pack) return { prev: null as string | null, next: null as string | null };
        const keys = Object.keys(pack).sort((a, b) => {
            const na = pack[a].maddeNo || 0;
            const nb = pack[b].maddeNo || 0;
            return na !== nb ? na - nb : a.localeCompare(b, 'tr');
        });
        const idx = keys.indexOf(id);
        return {
            prev: idx > 0 ? keys[idx - 1] : null,
            next: idx >= 0 && idx < keys.length - 1 ? keys[idx + 1] : null,
        };
    }, [pack, id]);

    useEffect(() => {
        if (article) document.title = `${displayTitle(article, id)} | Av. Fethi Güzel`;
    }, [article, id]);

    return (
        <div className="madde-shell min-h-screen bg-[#F4F1EA] text-[#1C1C1C]">
            <div
                className="fixed top-0 left-0 h-[3px] z-[100] bg-[#C45A38] transition-[width] duration-150"
                style={{ width: `${progress}%` }}
                aria-hidden
            />
            <Navbar />

            <main className="pt-28 sm:pt-32 pb-20 px-4 sm:px-5 max-w-[46rem] mx-auto">
                <nav className="text-[11px] sm:text-xs text-[#1C1C1C]/55 mb-6 tracking-wide" aria-label="Konum">
                    <Link href="/" className="hover:text-[#C45A38]">
                        Ana Sayfa
                    </Link>
                    {' · '}
                    <Link href="/mevzuat" className="hover:text-[#C45A38]">
                        Mevzuat
                    </Link>
                    {' · '}
                    <span className="text-[#1C1C1C]/70">
                        {kanunId} / {id}
                    </span>
                </nav>

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-white p-6 text-sm">
                        <p className="font-bold text-red-700 mb-2">İçerik yüklenemedi</p>
                        <pre className="text-xs whitespace-pre-wrap bg-black/5 p-3 rounded-xl">{error}</pre>
                        <Link href="/mevzuat" className="inline-block mt-4 text-[#C45A38] font-semibold">
                            ← Mevzuata dön
                        </Link>
                    </div>
                )}

                {!error && !article && (
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-black/10 rounded-xl w-2/3" />
                        <div className="h-40 bg-[#2E4036]/20 rounded-2xl" />
                        <div className="h-64 bg-white/80 rounded-2xl border border-black/5" />
                    </div>
                )}

                {article && (
                    <>
                        <header className="mb-7 sm:mb-9">
                            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#C45A38] mb-2">
                                {article.kanun || kanunId}
                            </p>
                            <h1 className="font-heading text-[1.65rem] sm:text-[2.1rem] font-bold leading-[1.2] tracking-tight text-[#1C1C1C]">
                                {title}
                            </h1>
                            {article.maddeNo ? (
                                <span className="inline-flex mt-3 px-3 py-1 rounded-full bg-[#C45A38]/12 text-[#C45A38] text-[11px] font-bold uppercase tracking-wider">
                                    Madde {article.maddeNo}
                                </span>
                            ) : null}
                        </header>

                        <section className="rounded-2xl sm:rounded-[1.35rem] bg-gradient-to-br from-[#2E4036] to-[#24352c] text-[#FFFEFA]/95 p-5 sm:p-8 shadow-lg mb-5 sm:mb-6">
                            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8a48a] mb-4">
                                <span className="w-4 h-0.5 bg-[#e8a48a] rounded-full" />
                                Resmî metin
                            </p>
                            <article
                                className="madde-prose madde-prose-official"
                                dangerouslySetInnerHTML={{ __html: officialHtml }}
                            />
                        </section>

                        {toc.length > 2 && (
                            <details className="mb-5 rounded-2xl border border-black/8 bg-[#FFFEFA] p-4 sm:p-5 group">
                                <summary className="cursor-pointer font-heading font-bold text-sm text-[#2E4036] list-none flex justify-between items-center">
                                    İçindekiler
                                    <span className="text-[#C45A38] text-xs font-semibold group-open:rotate-45 transition-transform">
                                        +
                                    </span>
                                </summary>
                                <ul className="mt-3 space-y-1.5 max-h-56 overflow-y-auto">
                                    {toc.map((item) => (
                                        <li key={item.id} className={item.level === 5 ? 'pl-3' : ''}>
                                            <a
                                                href={`#${item.id}`}
                                                className="text-[13px] text-[#1C1C1C]/70 hover:text-[#C45A38] leading-snug"
                                            >
                                                {item.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        )}

                        <section className="rounded-2xl sm:rounded-[1.35rem] bg-[#FFFEFA] border border-black/8 p-5 sm:p-8 shadow-sm mb-8">
                            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C45A38] mb-4">
                                <span className="w-4 h-0.5 bg-[#C45A38] rounded-full" />
                                Akademik yorum ve analiz
                            </p>
                            {commentaryHtml ? (
                                <article
                                    className="madde-prose madde-prose-commentary"
                                    dangerouslySetInnerHTML={{ __html: commentaryHtml }}
                                />
                            ) : (
                                <p className="text-sm text-[#1C1C1C]/50">Bu madde için şerh henüz eklenmemiş.</p>
                            )}
                        </section>

                        <div className="flex flex-wrap gap-2 justify-between">
                            {adj.prev && pack ? (
                                <Link
                                    href={`/mevzuat/${kanunId}/${adj.prev}`}
                                    className="text-sm font-semibold px-4 py-2.5 rounded-full bg-white border border-black/10 hover:border-[#C45A38]/40 hover:text-[#C45A38] transition-colors"
                                >
                                    ← {pack[adj.prev].title || adj.prev}
                                </Link>
                            ) : (
                                <span />
                            )}
                            {adj.next && pack ? (
                                <Link
                                    href={`/mevzuat/${kanunId}/${adj.next}`}
                                    className="text-sm font-semibold px-4 py-2.5 rounded-full bg-white border border-black/10 hover:border-[#C45A38]/40 hover:text-[#C45A38] transition-colors"
                                >
                                    {pack[adj.next].title || adj.next} →
                                </Link>
                            ) : null}
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
