'use client';

import { useRef, useState, type PointerEvent, type ReactNode } from 'react';

type Ipucu = { ad: string; deger: string; x: number; y: number };

/**
 * Grafiklerin üzerine gelme katmanı (Aylık plan G17, dataviz `interaction.md`): İşaretin üstünde değer ve kategori yazılır.
 * İşaret `data-ipucu-ad` ve `data-ipucu-deger` taşır; isabet alanı işaretten büyüktür (`data-ipucu-yuva`, sütunun bütün
 * yüksekliği ya da çubuğun bütün satırı). İpucu yalnız kolaylıktır: Her değer tablo görünümünde de yazılıdır.
 */
export default function GrafikIpucu({ children }: { children: ReactNode }) {
  const kutu = useRef<HTMLDivElement>(null);
  const [ipucu, setIpucu] = useState<Ipucu | null>(null);

  function izle(e: PointerEvent<HTMLDivElement>) {
    const hedef = e.target as Element;
    const isaret =
      hedef.closest<HTMLElement>('[data-ipucu-ad]') ??
      hedef.closest('[data-ipucu-yuva]')?.querySelector<HTMLElement>('[data-ipucu-ad]');
    if (!isaret || !kutu.current) return setIpucu(null);
    const a = kutu.current.getBoundingClientRect();
    const b = isaret.getBoundingClientRect();
    const x = Math.min(Math.max(b.left - a.left + b.width / 2, 56), a.width - 56);
    setIpucu({ ad: isaret.dataset.ipucuAd ?? '', deger: isaret.dataset.ipucuDeger ?? '', x, y: b.top - a.top });
  }

  return (
    <div ref={kutu} className="relative" onPointerMove={izle} onPointerLeave={() => setIpucu(null)}>
      {children}
      {ipucu && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-charcoal/15 bg-surface px-2.5 py-1.5 text-xs shadow-sm"
          style={{ left: ipucu.x, top: ipucu.y - 6 }}
        >
          <strong className="block text-sm font-semibold tabular-nums text-charcoal">{ipucu.deger}</strong>
          <span className="text-ink-muted">{ipucu.ad}</span>
        </div>
      )}
    </div>
  );
}
