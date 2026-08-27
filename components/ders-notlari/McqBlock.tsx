'use client';

import { useMemo, useState } from 'react';
import type { NoteMcq } from '@/lib/ders-notlari/types';

export function McqBlock({
    items,
    storageKey,
}: {
    items: NoteMcq[];
    storageKey: string;
}) {
    const [picked, setPicked] = useState<Record<number, number>>({});
    const [done, setDone] = useState(false);

    const score = useMemo(() => {
        return items.reduce((n, it, i) => n + (picked[i] === it.answer ? 1 : 0), 0);
    }, [items, picked]);

    if (!items.length) return null;

    return (
        <div className="my-6 rounded-2xl border border-charcoal/10 bg-white p-4 sm:p-5 shadow-sm print:break-inside-avoid">
            <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-accent font-bold mb-3">
                Konu sonu test
            </p>
            <ol className="m-0 p-0 list-none space-y-4">
                {items.map((it, i) => (
                    <li key={it.q}>
                        <p className="text-sm font-semibold text-charcoal mb-2">{i + 1}. {it.q}</p>
                        <div className="grid gap-1.5">
                            {it.choices.map((c, ci) => {
                                const selected = picked[i] === ci;
                                const reveal = done;
                                const correct = ci === it.answer;
                                const cls = reveal
                                    ? correct
                                        ? 'border-emerald-400 bg-emerald-50'
                                        : selected
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-charcoal/10'
                                    : selected
                                        ? 'border-accent bg-accent/5'
                                        : 'border-charcoal/10 hover:border-accent/40';
                                return (
                                    <button
                                        key={c}
                                        type="button"
                                        disabled={done}
                                        onClick={() => setPicked((p) => ({ ...p, [i]: ci }))}
                                        className={`text-left text-sm px-3 py-2 rounded-xl border ${cls}`}
                                    >
                                        {c}
                                    </button>
                                );
                            })}
                        </div>
                        {done && (
                            <p className="text-xs text-charcoal/60 mt-2 m-0">{it.reason}</p>
                        )}
                    </li>
                ))}
            </ol>
            <button
                type="button"
                className="mt-4 text-sm font-bold px-4 py-2 rounded-full bg-accent text-white"
                onClick={() => {
                    setDone(true);
                    try {
                        localStorage.setItem(storageKey, JSON.stringify({ score, n: items.length, at: Date.now() }));
                    } catch {
                        /* gizli mod */
                    }
                }}
            >
                {done ? `Sonuç: ${score} / ${items.length}` : 'Kontrol et'}
            </button>
        </div>
    );
}
