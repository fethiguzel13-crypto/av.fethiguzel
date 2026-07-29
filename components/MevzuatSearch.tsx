"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, BookOpen, Loader2, X, Calculator, FileText, ChevronDown } from "lucide-react";

type IndexItem = {
    kanunId: string;
    id: string;
    title: string;
    kanun: string;
    maddeNo: number;
    status: string;
    href: string;
    snippet: string;
    /** Tam arama metni (resmî + şerh özeti) — yoksa snippet kullanılır */
    body?: string;
};

type IndexPayload = {
    count: number;
    items: IndexItem[];
    version?: number;
};

type SiteItem = {
    type: string;
    title: string;
    href: string;
    keywords?: string;
};

type SitePayload = {
    count: number;
    items: SiteItem[];
};

/** Türkçe arama normalizasyonu */
export function normalize(s: string) {
    return s
        .toLocaleLowerCase("tr-TR")
        .replace(/ı/g, "i")
        .replace(/İ/g, "i")
        .replace(/ş/g, "s")
        .replace(/Ş/g, "s")
        .replace(/ğ/g, "g")
        .replace(/Ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/Ü/g, "u")
        .replace(/ö/g, "o")
        .replace(/Ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/Ç/g, "c")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

/**
 * Kelime varyantları: satım ↔ satış, taşınır satışı vb.
 * Her token için ek kök/biçim üretir; OR eşleşmesi yapılır.
 */
function expandToken(token: string): string[] {
    const t = normalize(token);
    if (t.length < 2) return t ? [t] : [];
    const out = new Set<string>([t]);

    // satim / satis ailesi
    if (t.startsWith("satim") || t === "satim") {
        ["satis", "satisi", "satisin", "satima", "satimi", "satimin", "satimlar", "satislar"].forEach((v) =>
            out.add(v)
        );
    }
    if (t.startsWith("satis") || t === "satis") {
        ["satim", "satimi", "satimin", "satima", "satisi", "satisin", "satislar"].forEach((v) => out.add(v));
    }

    // Genel Türkçe ek sadeleştirme (kaba)
    const suffixes = [
        "larindan",
        "lerinden",
        "larina",
        "lerine",
        "larinin",
        "lerinin",
        "lardan",
        "lerden",
        "larda",
        "lerde",
        "lari",
        "leri",
        "lar",
        "ler",
        "inden",
        "indan",
        "inden",
        "sina",
        "sine",
        "sini",
        "sinin",
        "ndan",
        "nden",
        "inda",
        "inde",
        "ina",
        "ine",
        "ini",
        "inin",
        "dan",
        "den",
        "tan",
        "ten",
        "nin",
        "nin",
        "nun",
        "nun",
        "in",
        "in",
        "un",
        "un",
        "im",
        "im",
        "um",
        "um",
        "i",
        "i",
        "u",
        "u",
        "a",
        "e",
    ];
    for (const suf of suffixes) {
        if (t.length > suf.length + 3 && t.endsWith(suf)) {
            out.add(t.slice(0, -suf.length));
        }
    }

    // 4+ harfli kök: önek araması için (tasinir → taşınır satışı)
    if (t.length >= 4) {
        out.add(t.slice(0, Math.max(4, t.length - 1)));
    }

    return Array.from(out).filter((x) => x.length >= 2);
}

function highlightSnippet(text: string, tokens: string[], maxLen = 220): string {
    const raw = text || "";
    const nraw = normalize(raw);
    let best = 0;
    for (const t of tokens) {
        const i = nraw.indexOf(t);
        if (i >= 0) {
            best = Math.max(0, Math.min(i, raw.length) - 40);
            // map approx: use ratio if lengths similar
            const ratio = raw.length / Math.max(nraw.length, 1);
            best = Math.max(0, Math.floor(i * ratio) - 40);
            break;
        }
    }
    let slice = raw.slice(best, best + maxLen).trim();
    if (best > 0) slice = "…" + slice;
    if (best + maxLen < raw.length) slice = slice + "…";
    return slice;
}

type SearchProps = {
    compact?: boolean;
    autoFocus?: boolean;
    initialQuery?: string;
};

const PAGE_SIZE = 40;

function MevzuatSearchInner({
    compact = false,
    autoFocus = false,
    initialQuery = "",
}: SearchProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const urlQuery = searchParams?.get("q") ?? "";
    const [q, setQ] = useState(initialQuery || urlQuery);
    const [kanunFilter, setKanunFilter] = useState("all");
    const [index, setIndex] = useState<IndexItem[] | null>(null);
    const [siteItems, setSiteItems] = useState<SiteItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visible, setVisible] = useState(PAGE_SIZE);

    useEffect(() => {
        const next = initialQuery || urlQuery;
        if (next) setQ(next);
    }, [initialQuery, urlQuery]);

    // URL ile senkron (?q=) — paylaşılabilir arama
    useEffect(() => {
        if (compact) return;
        const t = window.setTimeout(() => {
            const trimmed = q.trim();
            const current = new URLSearchParams(window.location.search).get("q") || "";
            if (trimmed === current) return;
            const path = trimmed ? `/ara?q=${encodeURIComponent(trimmed)}` : "/ara";
            router.replace(path, { scroll: false });
        }, 350);
        return () => window.clearTimeout(t);
    }, [q, compact, router]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [mevRes, siteRes] = await Promise.all([
                    fetch("/data/mevzuat-index.json", { cache: "force-cache" }),
                    fetch("/data/site-search-index.json", { cache: "force-cache" }).catch(() => null),
                ]);
                if (!mevRes.ok) throw new Error("İndeks yüklenemedi");
                const data = (await mevRes.json()) as IndexPayload;
                let site: SiteItem[] = [];
                if (siteRes && siteRes.ok) {
                    const sd = (await siteRes.json()) as SitePayload;
                    site = sd.items || [];
                }
                if (!cancelled) {
                    setIndex(data.items || []);
                    setSiteItems(site);
                    setLoading(false);
                }
            } catch (e) {
                if (!cancelled) {
                    setError(e instanceof Error ? e.message : "Hata");
                    setLoading(false);
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        setVisible(PAGE_SIZE);
    }, [q, kanunFilter]);

    const kanunList = useMemo(() => {
        if (!index) return [];
        const map = new Map<string, string>();
        for (const it of index) {
            if (!map.has(it.kanunId)) map.set(it.kanunId, it.kanun);
        }
        return Array.from(map.entries())
            .map(([kanunId, kanun]) => ({ kanunId, kanun }))
            .sort((a, b) => a.kanun.localeCompare(b.kanun, "tr"));
    }, [index]);

    const tokenGroups = useMemo(() => {
        const nq = normalize(q.trim());
        const rawTokens = nq.split(/\s+/).filter(Boolean);
        return rawTokens.map((t) => expandToken(t));
    }, [q]);

    // «TBK 13» → tam madde (madde-130 gürültüsünü bastır)
    const exactMaddeHint = useMemo(() => {
        const raw = q.trim();
        const m = raw.match(
            /^([a-zA-ZçğıöşüÇĞİÖŞÜ]{2,12})\s*(?:madde|m\.?|md\.?)?\s*[-.]?\s*(\d{1,4})\s*$/i
        );
        if (!m) return null;
        const code = normalize(m[1]).replace(/[^a-z0-9-]/g, "");
        const n = parseInt(m[2], 10);
        if (!Number.isFinite(n)) return null;
        const map: Record<string, string> = {
            tbk: "tbk",
            tmk: "tmk",
            ttk: "ttk",
            tck: "tck",
            hmk: "hmk",
            iik: "iik",
            cmk: "cmk",
            is: "is-kanunu",
            iskanunu: "is-kanunu",
            "is-kanunu": "is-kanunu",
            vuk: "vuk",
            kvkk: "kvkk",
        };
        const kanunId = map[code];
        if (!kanunId) return null;
        return { kanunId, n };
    }, [q]);

    type ScoredMev = { item: IndexItem; score: number; matchSnippet: string };
    type ScoredSite = { item: SiteItem; score: number };

    const { mevResults, siteResults, totalMev } = useMemo(() => {
        if (!index || !q.trim() || !tokenGroups.length) {
            return { mevResults: [] as ScoredMev[], siteResults: [] as ScoredSite[], totalMev: 0 };
        }

        const scored: ScoredMev[] = [];
        for (const item of index) {
            if (kanunFilter !== "all" && item.kanunId !== kanunFilter) continue;
            const titleN = normalize(item.title);
            const kanunN = normalize(`${item.kanun} ${item.kanunId}`);
            const bodyN = normalize(`${item.body || ""} ${item.snippet || ""}`);
            const hay = `${titleN} ${kanunN} madde ${item.maddeNo} ${bodyN}`;

            let score = 0;
            let ok = true;
            const matchedTokens: string[] = [];

            for (const group of tokenGroups) {
                // Grup içi OR: en az bir varyant
                let groupHit = false;
                let best = 0;
                let used = group[0];
                for (const t of group) {
                    // Saf sayı token'ı: "13" → 130/113 içinde geçmesin; tam madde no veya " madde 13 "
                    const isNum = /^\d+$/.test(t);
                    if (isNum) {
                        const exactNo = String(item.maddeNo) === t;
                        const wordHit =
                            hay.includes(` madde ${t} `) ||
                            hay.endsWith(` madde ${t}`) ||
                            titleN.includes(`madde ${t}`) ||
                            new RegExp(`(?:^|\\s)${t}(?:\\s|$)`).test(` ${titleN} `);
                        if (!exactNo && !wordHit) continue;
                        groupHit = true;
                        let s = exactNo ? 40 : 8;
                        if (titleN.includes(`madde ${t}`)) s += 12;
                        if (s > best) {
                            best = s;
                            used = t;
                        }
                        continue;
                    }
                    if (!hay.includes(t)) continue;
                    groupHit = true;
                    let s = 1;
                    if (titleN.includes(t)) s += 12;
                    if (kanunN.includes(t)) s += 4;
                    if (String(item.maddeNo) === t) s += 20;
                    if (bodyN.includes(` ${t} `) || bodyN.startsWith(t) || bodyN.includes(` ${t}`)) s += 3;
                    if (s > best) {
                        best = s;
                        used = t;
                    }
                }
                if (!groupHit) {
                    ok = false;
                    break;
                }
                score += best;
                matchedTokens.push(used);
            }
            if (!ok) continue;

            // Tam «TBK 13» isabeti — en üste
            if (
                exactMaddeHint &&
                item.kanunId === exactMaddeHint.kanunId &&
                item.maddeNo === exactMaddeHint.n
            ) {
                score += 500;
            }

            const displaySrc = item.body || item.snippet || item.title;
            scored.push({
                item,
                score,
                matchSnippet: highlightSnippet(displaySrc, matchedTokens),
            });
        }
        scored.sort((a, b) => b.score - a.score || a.item.maddeNo - b.item.maddeNo);

        // Site sayfaları + hesaplama
        const siteScored: ScoredSite[] = [];
        for (const item of siteItems) {
            if (kanunFilter !== "all") continue; // kanun filtresi varken sadece mevzuat
            const hay = normalize(`${item.title} ${item.keywords || ""} ${item.type} ${item.href}`);
            let score = 0;
            let ok = true;
            for (const group of tokenGroups) {
                let hit = false;
                for (const t of group) {
                    if (hay.includes(t)) {
                        hit = true;
                        score += normalize(item.title).includes(t) ? 10 : 2;
                        break;
                    }
                }
                if (!hit) {
                    ok = false;
                    break;
                }
            }
            if (ok) siteScored.push({ item, score });
        }
        siteScored.sort((a, b) => b.score - a.score);

        return {
            mevResults: scored,
            siteResults: siteScored,
            totalMev: scored.length,
        };
    }, [index, q, kanunFilter, tokenGroups, siteItems, exactMaddeHint]);

    const shownMev = useMemo(
        () => (compact ? mevResults.slice(0, 12) : mevResults.slice(0, visible)),
        [mevResults, visible, compact]
    );

    const onClear = useCallback(() => {
        setQ("");
    }, []);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = q.trim();
        if (!trimmed) return;
        // «TBK 13» → doğrudan madde sayfası
        if (exactMaddeHint) {
            router.push(`/mevzuat/${exactMaddeHint.kanunId}/madde-${exactMaddeHint.n}`);
            return;
        }
        if (compact) {
            router.push(`/ara?q=${encodeURIComponent(trimmed)}`);
        }
    };

    return (
        <div className={compact ? "w-full" : "w-full max-w-3xl mx-auto"}>
            <form onSubmit={onSubmit} className="relative">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/35 pointer-events-none"
                        />
                        <input
                            type="search"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            autoFocus={autoFocus}
                            placeholder="Örn. satım, taşınır satışı, TBK 207, kıdem, nafaka…"
                            className="w-full pl-11 pr-10 py-4 rounded-2xl border border-charcoal/10 bg-white shadow-sm text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/30 text-sm sm:text-base"
                            aria-label="Site ve mevzuat ara"
                            autoComplete="off"
                        />
                        {q && (
                            <button
                                type="button"
                                onClick={onClear}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-charcoal/40 hover:text-charcoal hover:bg-charcoal/5"
                                aria-label="Temizle"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    {!compact && (
                        <select
                            value={kanunFilter}
                            onChange={(e) => setKanunFilter(e.target.value)}
                            className="sm:w-56 py-4 px-4 rounded-2xl border border-charcoal/10 bg-white text-sm text-charcoal/80 focus:outline-none focus:ring-2 focus:ring-accent/40"
                            aria-label="Kanun filtresi"
                        >
                            <option value="all">Tüm kanunlar + site</option>
                            {kanunList.map((k) => (
                                <option key={k.kanunId} value={k.kanunId}>
                                    {k.kanun}
                                </option>
                            ))}
                        </select>
                    )}
                    <button
                        type="submit"
                        className="sm:w-auto px-6 py-3.5 rounded-2xl bg-accent text-white font-bold text-sm hover:bg-accent/90"
                    >
                        Ara
                    </button>
                </div>

                {loading && (
                    <p className="mt-4 flex items-center justify-center gap-2 text-charcoal/40 text-sm">
                        <Loader2 size={16} className="animate-spin" /> Arama indeksi yükleniyor…
                    </p>
                )}
                {error && (
                    <p className="mt-4 text-center text-sm text-red-600/80">
                        {error}. Sayfayı yenileyin veya /mevzuat üzerinden gezin.
                    </p>
                )}
                {!loading && index && (
                    <p className="mt-3 text-center text-[11px] font-mono uppercase tracking-widest text-charcoal/35">
                        {index.length.toLocaleString("tr-TR")} madde · tam metin araması ·{" "}
                        {siteItems.length} site kaydı
                    </p>
                )}
            </form>

            {q.trim() && !loading && exactMaddeHint && (
                <div className="mt-6">
                    <Link
                        href={`/mevzuat/${exactMaddeHint.kanunId}/madde-${exactMaddeHint.n}`}
                        className="flex items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-accent/10 border border-accent/30 hover:bg-accent/15 transition-colors"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <BookOpen className="text-accent shrink-0" size={20} />
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold">
                                    Tam madde eşleşmesi
                                </p>
                                <p className="text-sm sm:text-base font-heading font-bold text-charcoal">
                                    {exactMaddeHint.kanunId.toUpperCase()} madde {exactMaddeHint.n}
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-accent shrink-0">Aç →</span>
                    </Link>
                </div>
            )}

            {q.trim() && !loading && (
                <div className="mt-6 space-y-8">
                    {/* Site / hesaplama sonuçları */}
                    {!compact && siteResults.length > 0 && kanunFilter === "all" && (
                        <section>
                            <p className="text-xs font-bold tracking-widest uppercase text-charcoal/40 mb-3">
                                Site & araçlar ({siteResults.length})
                            </p>
                            <ul className="space-y-2">
                                {siteResults.slice(0, 12).map(({ item }) => (
                                    <li key={item.href + item.title}>
                                        <Link
                                            href={item.href}
                                            className="block p-4 rounded-2xl bg-white border border-charcoal/5 hover:border-accent/30 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-charcoal/5 text-charcoal/50 flex items-center justify-center shrink-0">
                                                    {item.type === "hesaplama" ? (
                                                        <Calculator size={18} />
                                                    ) : (
                                                        <FileText size={18} />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">
                                                        {item.type === "hesaplama" ? "Hesaplama" : "Sayfa"}
                                                    </span>
                                                    <h3 className="text-base font-heading font-bold text-charcoal group-hover:text-accent">
                                                        {item.title}
                                                    </h3>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Mevzuat */}
                    <section>
                        {totalMev === 0 && siteResults.length === 0 ? (
                            <div className="text-center py-10 text-charcoal/45 text-sm">
                                Sonuç bulunamadı. Farklı yazım deneyin (örn. <em>satım</em> / <em>satış</em>) veya
                                kanun filtresini kaldırın.
                            </div>
                        ) : totalMev === 0 ? (
                            <p className="text-xs text-charcoal/40">Mevzuatta eşleşme yok; yukarıdaki site sonuçlarına bakın.</p>
                        ) : (
                            <>
                                <p className="text-xs font-bold tracking-widest uppercase text-charcoal/40 mb-3">
                                    Mevzuat — {totalMev.toLocaleString("tr-TR")} madde
                                    {shownMev.length < totalMev
                                        ? ` (gösterilen ${shownMev.length})`
                                        : ""}
                                </p>
                                <ul className="space-y-2">
                                    {shownMev.map(({ item: r, matchSnippet }) => (
                                        <li key={`${r.kanunId}-${r.id}`}>
                                            <Link
                                                href={r.href}
                                                className="block p-4 sm:p-5 rounded-2xl bg-white border border-charcoal/5 hover:border-accent/30 hover:shadow-lg transition-all group"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                        <BookOpen size={18} />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">
                                                                {r.kanunId}
                                                            </span>
                                                            <span className="text-[10px] text-charcoal/30">·</span>
                                                            <span className="text-[10px] font-mono text-charcoal/40">
                                                                m. {r.maddeNo || "—"}
                                                            </span>
                                                            <span className="text-[10px] text-charcoal/40 truncate max-w-[12rem]">
                                                                {r.kanun}
                                                            </span>
                                                            {r.status === "completed" && (
                                                                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700/70 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                                    Şerh hazır
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className="text-base sm:text-lg font-heading font-bold text-charcoal group-hover:text-accent transition-colors">
                                                            {r.title}
                                                        </h3>
                                                        <p className="text-xs text-charcoal/55 mt-1.5 leading-relaxed line-clamp-3">
                                                            {matchSnippet || r.snippet}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                {!compact && shownMev.length < totalMev && (
                                    <button
                                        type="button"
                                        onClick={() => setVisible((v) => v + PAGE_SIZE)}
                                        className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-charcoal/10 bg-white text-sm font-bold text-charcoal hover:border-accent hover:text-accent transition-colors"
                                    >
                                        <ChevronDown size={16} />
                                        Daha fazla göster ({totalMev - shownMev.length} kaldı)
                                    </button>
                                )}
                                {compact && totalMev > 12 && (
                                    <Link
                                        href={`/ara?q=${encodeURIComponent(q.trim())}`}
                                        className="mt-3 block text-center text-sm font-bold text-accent hover:underline"
                                    >
                                        Tüm {totalMev} sonucu gör →
                                    </Link>
                                )}
                            </>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}

export default function MevzuatSearch(props: SearchProps) {
    return (
        <Suspense
            fallback={
                <div
                    className={
                        props.compact
                            ? "h-12 rounded-full bg-charcoal/5 animate-pulse"
                            : "h-40 rounded-2xl bg-charcoal/5 animate-pulse"
                    }
                />
            }
        >
            <MevzuatSearchInner {...props} />
        </Suspense>
    );
}
