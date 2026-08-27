'use client';

import { useState } from 'react';
import type { NoteFlashcard } from '@/lib/ders-notlari/types';

export function FlashcardBlock({ cards }: { cards: NoteFlashcard[] }) {
    const [i, setI] = useState(0);
    const [back, setBack] = useState(false);
    if (!cards.length) return null;
    const c = cards[i];
    return (
        <div className="my-6 print:break-inside-avoid">
            <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-accent font-bold mb-2">
                Bilgi kartı {i + 1} / {cards.length}
            </p>
            <button
                type="button"
                onClick={() => setBack((v) => !v)}
                className="w-full text-left rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm min-h-[7rem]"
            >
                <p className="text-[10px] font-mono uppercase tracking-wider text-charcoal/40 mb-2">
                    {back ? 'Arka yüz' : 'Ön yüz'} · çevirmek için tıkla
                </p>
                <p className="text-sm sm:text-base text-charcoal leading-relaxed m-0">
                    {back ? c.back : c.front}
                </p>
            </button>
            <div className="flex gap-2 mt-2 print:hidden">
                <button
                    type="button"
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border border-charcoal/15"
                    onClick={() => {
                        setI((x) => (x - 1 + cards.length) % cards.length);
                        setBack(false);
                    }}
                >
                    Önceki
                </button>
                <button
                    type="button"
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border border-charcoal/15"
                    onClick={() => {
                        setI((x) => (x + 1) % cards.length);
                        setBack(false);
                    }}
                >
                    Sonraki
                </button>
            </div>
        </div>
    );
}
