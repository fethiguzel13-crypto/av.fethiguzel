import { GRAFIK } from '@/lib/grafik-palet.mjs';
import { sayi, tikler, yuzde } from '@/lib/grafik-olcek.mjs';
import GrafikIpucu from './GrafikIpucu';

export type YilDegeri = { yil: number; sayi: number };

/** Dar ekranda görünen yıl etiketleri: ilk, son ve uçlardan en az üç yıl uzaktaki beşe bölünen yıllar. */
function etiketGorunur(yil: number, ilk: number, son: number) {
  return yil === ilk || yil === son || (yil % 5 === 0 && yil - ilk >= 3 && son - yil >= 3);
}

/**
 * Yıllara göre sütun grafiği (Aylık plan G17): Tek seri, tek renk, sıfırdan başlayan tek eksen. Eksen tikleri yuvarlak
 * sayılardır (`tikler`), sütun tabanda kare, ucunda 4 px yuvarlatılmıştır ve en çok 24 px genişliktedir. Değer sütunun
 * üstüne yazılmaz; üzerine gelme ipucu ve `GrafikTablo` taşır. Dar ekranda gizlenen yıl etiketi yerini korur.
 */
export default function ZamanGrafik({ baslik, veri }: { baslik: string; veri: YilDegeri[] }) {
  const t = tikler(Math.max(0, ...veri.map((d) => d.sayi)));
  const ust = t[t.length - 1];
  const ilk = veri[0]?.yil ?? 0;
  const son = veri[veri.length - 1]?.yil ?? 0;
  const tepe = veri.reduce((a, d) => (d.sayi > a.sayi ? d : a), veri[0] ?? { yil: 0, sayi: 0 });
  const ozet = `${baslik}: ${ilk}–${son} arası ${veri.length} yıl, en yüksek ${tepe.yil} (${sayi(tepe.sayi)})`;
  return (
    <GrafikIpucu>
      <div role="img" aria-label={ozet}>
        <div className="flex gap-2">
          <div className="relative h-48 w-12 shrink-0 text-right text-xs tabular-nums text-ink-muted">
            {t.map((d) => (
              <span key={d} className="absolute right-0 translate-y-1/2" style={{ bottom: `${yuzde(d, ust)}%` }}>
                {sayi(d)}
              </span>
            ))}
          </div>
          <div className="relative h-48 flex-1">
            {t.map((d) => (
              <div
                key={d}
                className="absolute inset-x-0 h-px"
                style={{ bottom: `${yuzde(d, ust)}%`, backgroundColor: d === 0 ? GRAFIK.eksen : GRAFIK.izgara }}
              />
            ))}
            <div className="absolute inset-0 flex items-end">
              {veri.map((d) => (
                <div key={d.yil} data-ipucu-yuva="" className="group flex h-full flex-1 items-end justify-center">
                  <div
                    data-ipucu-ad={String(d.yil)}
                    data-ipucu-deger={sayi(d.sayi)}
                    className="w-[70%] max-w-6 rounded-t group-hover:opacity-80"
                    style={{ height: `${yuzde(d.sayi, ust)}%`, backgroundColor: GRAFIK.isaret }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-2 flex gap-2 text-xs tabular-nums text-ink-muted">
          <div className="w-12 shrink-0" />
          <div className="flex flex-1">
            {veri.map((d) => (
              <span
                key={d.yil}
                className={`flex-1 whitespace-nowrap text-center${etiketGorunur(d.yil, ilk, son) ? '' : ' invisible sm:visible'}`}
              >
                {d.yil}
              </span>
            ))}
          </div>
        </div>
      </div>
    </GrafikIpucu>
  );
}
