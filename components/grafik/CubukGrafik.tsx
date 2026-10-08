import { GRAFIK } from '@/lib/grafik-palet.mjs';
import { sayi, yuzde } from '@/lib/grafik-olcek.mjs';
import GrafikIpucu from './GrafikIpucu';

export type Kategori = { ad: string; sayi: number };

/**
 * Yatay çubuk grafiği (Aylık plan G17): Adlandırılmış kategorilerin karşılaştırması, tek seri, tek renk.
 * Kategori adı çubuğun üstünde, değer çubuğun ucunda metin rengiyle yazılır; seri rengi yalnız çubukta kullanılır.
 * Çubuk 16 px kalınlıkta, tabanda kare, ucunda 4 px yuvarlatılmıştır (dataviz `marks-and-anatomy.md`).
 * Ekran okuyucu özeti `aria-label`'dadır; satır satır okuma için grafiğin altına `GrafikTablo` konur.
 */
export default function CubukGrafik({ baslik, veri }: { baslik: string; veri: Kategori[] }) {
  const ust = Math.max(0, ...veri.map((k) => k.sayi));
  const ozet = `${baslik}: ${veri.map((k) => `${k.ad} ${sayi(k.sayi)}`).join(', ')}`;
  return (
    <GrafikIpucu>
      <div role="img" aria-label={ozet} className="space-y-3">
        {veri.map((k) => {
          const oran = yuzde(k.sayi, ust);
          return (
            <div key={k.ad} data-ipucu-yuva="" className="group">
              <div className="mb-1 text-sm text-charcoal">{k.ad}</div>
              <div className="relative mr-16 h-4">
                <div
                  data-ipucu-ad={k.ad}
                  data-ipucu-deger={sayi(k.sayi)}
                  className="absolute inset-y-0 left-0 rounded-r group-hover:opacity-80"
                  style={{ width: `${oran}%`, backgroundColor: GRAFIK.isaret }}
                />
                <span
                  className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pl-1.5 text-sm tabular-nums text-charcoal"
                  style={{ left: `${oran}%` }}
                >
                  {sayi(k.sayi)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </GrafikIpucu>
  );
}
