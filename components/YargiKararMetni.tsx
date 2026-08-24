'use client';

import { paragraphs } from '@/lib/uyelik/karar-format';

export default function YargiKararMetni({ text, excerpt }: { text: string; excerpt?: string }) {
  const parts = paragraphs(text);
  if (!parts.length) {
    return (
      <section className="mt-8 rounded-2xl bg-white border border-charcoal/10 p-6 sm:p-8">
        {excerpt ? (
          <>
            <p className="text-[11px] uppercase tracking-widest text-charcoal/40 mb-3">Özet</p>
            <p className="text-[15px] leading-relaxed text-charcoal/80">{excerpt}</p>
          </>
        ) : (
          <p className="text-charcoal/55 text-sm">Bu künyenin tam metni henüz arşivde yok.</p>
        )}
        <p className="mt-4 text-[12px] text-charcoal/40">
          Kararlar yalnızca sitede okunur; indirme ve yazdırma kapalıdır.
        </p>
      </section>
    );
  }

  return (
    <section className="yargi-print-block mt-8">
      <div className="yargi-no-print yargi-karar-metni rounded-2xl bg-white border border-charcoal/10 p-6 sm:p-10">
        <p className="text-[11px] uppercase tracking-widest text-charcoal/40 mb-5">Karar metni</p>
        <div className="space-y-4 text-[15px] leading-[1.85] text-charcoal/85">
          {parts.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="mt-8 text-[12px] leading-relaxed text-charcoal/40">
          Üyelik erişimi — yalnızca sitede okuma. Dosya indirme yoktur. Bilgilendirme
          amaçlıdır; bağlayıcı olan kararın aslıdır.
        </p>
      </div>
    </section>
  );
}
