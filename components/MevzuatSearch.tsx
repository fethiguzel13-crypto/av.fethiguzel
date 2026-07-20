"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, BookOpen, Loader2, X } from "lucide-react";

type IndexItem = {
    kanunId: string;
    id: string;
    title: string;
    kanun: string;
    maddeNo: number;
    status: string;
    href: string;
    snippet: string;
};

type IndexPayload = {
    count: number;
    items: IndexItem[];
};

function normalize(s: string) {
    return s
        .toLocaleLowerCase("tr-TR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ı/g, "i")
        .replace(/İ/g, "i");
}

type SearchProps = {
    compact?: boolean;
    autoFocus?: boolean;
    initialQuery?: string;
};

function MevzuatSearchInner({
    compact = false,
    autoFocus = false,
    initialQuery = "",
}: SearchProps) {
    const searchParams = useSearchParams();
    const urlQuery = searchParams?.get("q") ?? "";
    const [q, setQ] = useState(initialQuery || urlQuery);
    const [kanunFilter, setKanunFilter] = useState("all");
    const [index, setIndex] = useState<IndexItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const next = initialQuery || urlQuery;
        if (next) setQ(next);
    }, [initialQuery, urlQuery]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch("/data/mevzuat-index.json", { cache: "force-cache" });
                if (!res.ok) throw new Error("İndeks yüklenemedi");
                const data = (await res.json()) as IndexPayload;
                if (!cancelled) {
                    setIndex(data.items || []);
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

    const results = useMemo(() => {
        if (!index || !q.trim()) return [];
        const nq = normalize(q.trim());
        const tokens = nq.split(/\s+/).filter(Boolean);
        if (!tokens.length) return [];

        const scored: { item: IndexItem; score: number }[] = [];
        for (const item of index) {
            if (kanunFilter !== "all" && item.kanunId !== kanunFilter) continue;
            const hay = normalize(`${item.title} ${item.kanun} ${item.kanunId} madde ${item.maddeNo} ${item.snippet}`);
            let score = 0;
            let ok = true;
            for (const t of tokens) {
                if (!hay.includes(t)) {
                    ok = false;
                    break;
                }
                score += hay.startsWith(t) ? 5 : 1;
                if (normalize(item.title).includes(t)) score += 8;
                if (String(item.maddeNo) === t) score += 12;
            }
            if (ok) scored.push({ item, score });
        }
        scored.sort((a, b) => b.score - a.score || a.item.maddeNo - b.item.maddeNo);
        return scored.slice(0, compact ? 12 : 40).map((s) => s.item);
    }, [index, q, kanunFilter, compact]);

    const onClear = useCallback(() => {
        setQ("");
    }, []);

    return (
        <div className={compact ? "w-full" : "w-full max-w-3xl mx-auto"}>
            <div className="relative">
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
                            placeholder="Madde, kanun veya kavram ara… (örn. TBK 49, boşanma, haksız fiil)"
                            className="w-full pl-11 pr-10 py-4 rounded-2xl border border-charcoal/10 bg-white shadow-sm text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/30 text-sm sm:text-base"
                            aria-label="Mevzuat ara"
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
                    <select
                        value={kanunFilter}
                        onChange={(e) => setKanunFilter(e.target.value)}
                        className="sm:w-56 py-4 px-4 rounded-2xl border border-charcoal/10 bg-white text-sm text-charcoal/80 focus:outline-none focus:ring-2 focus:ring-accent/40"
                        aria-label="Kanun filtresi"
                    >
                        <option value="all">Tüm kanunlar</option>
                        {kanunList.map((k) => (
                            <option key={k.kanunId} value={k.kanunId}>
                                {k.kanun}
                            </option>
                        ))}
                    </select>
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
                        {index.length.toLocaleString("tr-TR")} madde indekslendi
                    </p>
                )}
            </div>

            {q.trim() && !loading && (
                <div className="mt-6 space-y-2">
                    {results.length === 0 ? (
                        <div className="text-center py-10 text-charcoal/45 text-sm">
                            Sonuç bulunamadı. Farklı anahtar kelime veya kanun filtresi deneyin.
                        </div>
                    ) : (
                        <>
                            <p className="text-xs font-bold tracking-widest uppercase text-charcoal/40 mb-3">
                                {results.length} sonuç
                            </p>
                            <ul className="space-y-2">
                                {results.map((r) => (
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
                                                        {r.status === "completed" && (
                                                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700/70 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                                Şerh hazır
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-base sm:text-lg font-heading font-bold text-charcoal group-hover:text-accent transition-colors truncate">
                                                        {r.title}
                                                    </h3>
                                                    <p className="text-xs text-charcoal/50 mt-1 line-clamp-2">{r.snippet}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
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
