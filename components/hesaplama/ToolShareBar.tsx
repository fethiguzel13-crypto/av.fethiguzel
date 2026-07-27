'use client';

import { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

export default function ToolShareBar({ url, title }: { url: string; title: string }) {
    const [ok, setOk] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setOk(true);
            window.setTimeout(() => setOk(false), 2000);
        } catch {
            /* ignore */
        }
    };

    const share = async () => {
        const text = `${title} — Av. Fethi Güzel Hukuk Portalı (bilgi amaçlı)\n${url}`;
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
                return;
            } catch {
                /* fall through */
            }
        }
        await copy();
    };

    return (
        <div className="flex flex-wrap gap-2 mb-5">
            <button
                type="button"
                onClick={share}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-2 rounded-full bg-charcoal/5 text-charcoal/60 hover:bg-accent hover:text-white transition-colors"
            >
                <Share2 size={13} /> Paylaş
            </button>
            <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-2 rounded-full bg-charcoal/5 text-charcoal/60 hover:bg-accent hover:text-white transition-colors"
            >
                {ok ? (
                    <>
                        <Check size={13} /> Kopyalandı
                    </>
                ) : (
                    <>
                        <Copy size={13} /> Linki kopyala
                    </>
                )}
            </button>
        </div>
    );
}
