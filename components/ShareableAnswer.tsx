'use client';

import { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

type Props = {
    text: string;
    title?: string;
    /** compact = daha küçük padding */
    compact?: boolean;
};

/**
 * Forum / sosyal için kopyalanabilir mini cevap.
 * Reklam yasağına uygun kısa metin + link; otomatik paylaşım yapmaz.
 */
export default function ShareableAnswer({ text, title = 'Kısa bilgilendirme (kopyala)', compact }: Props) {
    const [ok, setOk] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setOk(true);
            window.setTimeout(() => setOk(false), 2000);
        } catch {
            /* ignore */
        }
    };

    const share = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, text });
                return;
            } catch {
                /* fall through */
            }
        }
        await copy();
    };

    return (
        <div
            className={`rounded-2xl border border-charcoal/10 bg-white ${compact ? 'p-4' : 'p-5 sm:p-6'
                }`}
        >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h3 className="text-sm font-heading font-bold text-charcoal">{title}</h3>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={share}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-charcoal/5 text-charcoal/60 hover:bg-accent hover:text-white transition-colors"
                    >
                        <Share2 size={13} /> Paylaş
                    </button>
                    <button
                        type="button"
                        onClick={copy}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors"
                    >
                        {ok ? (
                            <>
                                <Check size={13} /> Kopyalandı
                            </>
                        ) : (
                            <>
                                <Copy size={13} /> Kopyala
                            </>
                        )}
                    </button>
                </div>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm text-charcoal/70 leading-relaxed bg-cream/80 rounded-xl p-4 border border-charcoal/5 max-h-64 overflow-y-auto">
                {text}
            </pre>
            <p className="mt-2 text-[10px] text-charcoal/40 leading-relaxed">
                Forum / LinkedIn / gruplar için hazır metin. Spam yapmayın; somut dosyada avukata yönlendirin.
                Sonuç vaadi eklemeyin.
            </p>
        </div>
    );
}
