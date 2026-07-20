"use client";

import React, { useEffect, useState } from "react";
import { List } from "lucide-react";

type TocItem = { id: string; text: string; level: number };

export default function ArticleToc() {
    const [items, setItems] = useState<TocItem[]>([]);

    useEffect(() => {
        const root = document.querySelector(".commentary-prose");
        if (!root) return;
        const headings = root.querySelectorAll("h3, h4");
        const list: TocItem[] = [];
        headings.forEach((el, i) => {
            const text = (el.textContent || "").trim();
            if (!text || text.length > 120) return;
            const id = el.id || `bolum-${i}`;
            if (!el.id) el.id = id;
            list.push({
                id,
                text,
                level: el.tagName === "H3" ? 3 : 4,
            });
        });
        setItems(list.slice(0, 24));
    }, []);

    if (items.length < 3) return null;

    return (
        <nav
            aria-label="İçindekiler"
            className="mb-10 p-5 sm:p-6 rounded-2xl bg-white/70 border border-charcoal/5"
        >
            <div className="flex items-center gap-2 text-accent font-bold text-[10px] tracking-widest uppercase mb-4">
                <List size={14} />
                Şerh içindekiler
            </div>
            <ul className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {items.map((it) => (
                    <li key={it.id} className={it.level === 4 ? "pl-3" : ""}>
                        <a
                            href={`#${it.id}`}
                            className="block text-xs sm:text-sm text-charcoal/65 hover:text-accent transition-colors leading-snug"
                        >
                            {it.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
