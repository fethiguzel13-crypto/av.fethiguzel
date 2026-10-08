import { KATEGORIK } from '@/lib/grafik-palet.mjs';
import { oranMetni, yuzde } from '@/lib/grafik-olcek.mjs';
import GrafikIpucu from './GrafikIpucu';

export type Kesim = { ad: string; deger: number; metin: string };

/**
 * Yığılmış tek çubuk (Aylık plan G17 adım 5): Bir toplamın bileşenlere dağılımı. Kesimler `KATEGORIK` sırasıyla boyanır,
 * renk döndürülmez; palet yetmezse bileşen hata verir. Kesimler arasında 2 px zemin aralığı vardır, çubuk tabanda kare,
 * ucunda 4 px yuvarlatılmıştır. Lejant her zaman yazılır ve her kesimin tutarını ve payını metin rengiyle taşır; üçüncü
 * renk zeminde 3:1'in altında kaldığından (`raporlar/g17-grafikler.md`) değer lejanttan da okunur.
 */
export default function YiginCubuk({ baslik, toplamMetin, kesimler }: { baslik: string; toplamMetin: string; kesimler: Kesim[] }) {
  if (kesimler.length > KATEGORIK.length) {
    throw new Error(`YiginCubuk: en çok ${KATEGORIK.length} kesim çizilir, ${kesimler.length} verildi`);
  }
  const toplam = kesimler.reduce((a, k) => a + Math.max(0, k.deger), 0);
  const ozet = `${baslik}, toplam ${toplamMetin}: ${kesimler.map((k) => `${k.ad} ${k.metin} (${oranMetni(k.deger, toplam)})`).join(', ')}`;
  return (
    <GrafikIpucu>
      <div role="img" aria-label={ozet}>
        <div className="flex h-6 gap-[2px] overflow-hidden rounded-r">
          {kesimler.map((k, i) =>
            k.deger > 0 ? (
              <div
                key={k.ad}
                data-ipucu-ad={k.ad}
                data-ipucu-deger={k.metin}
                className="min-w-[2px] hover:opacity-80"
                style={{ width: `${yuzde(k.deger, toplam)}%`, backgroundColor: KATEGORIK[i] }}
              />
            ) : null,
          )}
        </div>
        <ul className="mt-3 grid gap-1.5 text-sm text-charcoal sm:grid-cols-3">
          {kesimler.map((k, i) => (
            <li key={k.ad} className="flex items-start gap-2">
              <span aria-hidden="true" className="mt-1 h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: KATEGORIK[i] }} />
              <span>
                {k.ad}
                <span className="block tabular-nums text-ink-muted">
                  {k.metin} · {oranMetni(k.deger, toplam)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </GrafikIpucu>
  );
}
