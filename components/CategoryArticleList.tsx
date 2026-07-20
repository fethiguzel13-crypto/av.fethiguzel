"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

type Article = {
    id: string;
    kanunId: string;
    title: string;
    kanun: string;
    maddeNo?: number;
};

export default function CategoryArticleList({ articles }: { articles: Article[] }) {
    const [q, setQ] = useState("");

    const filtered = useMemo(() => {
        const nq = q.trim().toLocaleLowerCase("tr-TR");
        if (!nq) return articles;
        return articles.filter((a) => {
            const hay = `${a.title} ${a.kanun} ${a.maddeNo ?? ""} ${a.id}`.toLocaleLowerCase("tr-TR");
            return hay.includes(nq);
        });
    }, [articles, q]);

    return (
        <div>
            <div className="relative max-w-md mb-10">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/35" />
                <input
                    type="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Bu kategoride madde ara…"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-charcoal/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
            </div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-charcoal/35 mb-6">
                {filtered.length} / {articles.length} madde
            </p>
            {filtered.length === 0 ? (
                <p className="text-charcoal/45 text-center py-16">Bu aramaya uyan madde yok.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(({ id, kanunId, title, kanun }) => (
                        <Link href={`/mevzuat/${kanunId}/${id}`} key={`${kanunId}-${id}`} className="group">
                            <div className="h-full p-10 bg-white border border-charcoal/5 rounded-[2.5rem] hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest mb-4 block">
                                        {kanun}
                                    </span>
                                    <h4 className="text-xl font-heading font-bold text-charcoal mb-4 group-hover:text-accent transition-colors">
                                        {title}
                                    </h4>
                                </div>
                                <div className="pt-8 border-t border-charcoal/5 mt-8 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-charcoal/40 tracking-widest uppercase">
                                        AKADEMİK İNCELEME
                                    </span>
                                    <ArrowLeft
                                        size={16}
                                        className="rotate-180 text-accent opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
