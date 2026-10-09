import { GRAFIK } from '@/lib/grafik-palet.mjs';
import { RENKLER } from '@/lib/tasarim-jetonlari.mjs';

type Dayanak = { kanun: string; madde: string; ifade: string };
type Adim = { etiket: string; aciklama?: string; dayanak: Dayanak };
export type Sema = { id: string; tur: 'akis' | 'dal'; baslik: string; ozet: string; dersler: string[]; adimlar: Adim[] };

/** Kanun kimliğinden kısaltma; madde bağlantısının görünen adı. */
const KISALTMA: Record<string, string> = {
  hmk: 'HMK',
  iik: 'İİK',
  cmk: 'CMK',
  tmk: 'TMK',
  tbk: 'TBK',
  tck: 'TCK',
  ttk: 'TTK',
  tkhk: 'TKHK',
  arabuluculuk: 'HUAK',
  'is-kanunu': 'İş K.',
  'is-kanunu-1475': '1475 s. K.',
  kamulastirma: 'KK',
  belediye: 'Belediye K.',
  imar: 'İmar K.',
};
export const maddeAdi = (d: Dayanak) => `${KISALTMA[d.kanun] ?? d.kanun.toUpperCase()} m.${d.madde.replace(/^(\d+)([A-Z])$/, '$1/$2')}`;

/** Etiketi sözcük sınırında en çok `en` karakterlik satırlara böler; tek sözcük sınırı aşarsa kendi satırında kalır. */
export function satirlara(metin: string, en: number): string[] {
  const satirlar: string[] = [];
  let satir = '';
  for (const sozcuk of metin.split(/\s+/)) {
    if (satir && satir.length + 1 + sozcuk.length > en) {
      satirlar.push(satir);
      satir = sozcuk;
    } else {
      satir = satir ? `${satir} ${sozcuk}` : sozcuk;
    }
  }
  if (satir) satirlar.push(satir);
  return satirlar;
}

const GENISLIK = 320;
const CX = 18;
const R = 11;
const METIN_X = 42;
const SATIR = 18;
const ARALIK = 22;
const SATIR_EN = 30;

/** Her adımın satırları ve daire merkezi; satır sayısı arttıkça adım aşağı kayar. */
function yerlesim(adimlar: Adim[]) {
  const satirlar: { adim: Adim; parca: string[]; cy: number }[] = [];
  let y = 2;
  for (const adim of adimlar) {
    const parca = satirlara(adim.etiket, SATIR_EN);
    satirlar.push({ adim, parca, cy: y + R });
    y += Math.max(2 * R, parca.length * SATIR) + ARALIK;
  }
  return { satirlar, yukseklik: y - ARALIK + 2 };
}

/**
 * Ders notu şeması (Aylık plan G18): `lib/ders-notlari/semalar.mjs` verisinden sunucuda çizilen SVG. `akis` numaralı ve oklu
 * sıralı adımdır, `dal` ortak bir gövdeden ayrılan eş düzey kalemdir. Şema dikey akar ve `viewBox` 320 birim genişliktedir;
 * 360 px ekranda ders notu figürünün içinde kalan 278 px'te (ölçüm) 14 birimlik yazı 12,2 px olur, geniş ekranda çizim 366 px'te
 * durur ve yazı gövde boyunu (16 px) geçmez (G17: `viewBox` dar ekranda yazıyı küçültür). Renk anlam taşımaz, sırayı numara ve metin verir. Adımların açıklaması ve
 * kanun maddesi bağlantısı alttaki metin karşılığındadır; SVG `role="img"` ile başlığa ve özete bağlanır.
 */
export default function AkisSemasi({ sema }: { sema: Sema }) {
  const baslikId = `sema-${sema.id}-baslik`;
  const ozetId = `sema-${sema.id}-ozet`;
  const okId = `sema-${sema.id}-ok`;
  const akis = sema.tur === 'akis';

  const { satirlar, yukseklik } = yerlesim(sema.adimlar);
  const ilk = satirlar[0].cy;
  const son = satirlar[satirlar.length - 1].cy;

  return (
    <figure className="my-8 rounded-2xl border border-charcoal/10 bg-white p-5 sm:p-6">
      <figcaption className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-ink">
        Şema · {sema.baslik}
      </figcaption>
      <svg
        role="img"
        aria-labelledby={`${baslikId} ${ozetId}`}
        viewBox={`0 0 ${GENISLIK} ${yukseklik}`}
        width="100%"
        style={{ maxWidth: 366 }}
        className="block h-auto font-sans"
      >
        <title id={baslikId}>{sema.baslik}</title>
        <desc id={ozetId}>{sema.ozet}</desc>
        {akis ? (
          <defs>
            <marker id={okId} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill={GRAFIK.isaret} />
            </marker>
          </defs>
        ) : (
          <line x1={4} y1={ilk} x2={4} y2={son} stroke={GRAFIK.eksen} strokeWidth={2} />
        )}
        {satirlar.map(({ adim, parca, cy }, i) => (
          <g key={adim.etiket}>
            {akis ? (
              <>
                {i < satirlar.length - 1 && (
                  <line
                    x1={CX}
                    y1={cy + R + 3}
                    x2={CX}
                    y2={satirlar[i + 1].cy - R - 6}
                    stroke={GRAFIK.isaret}
                    strokeWidth={2}
                    markerEnd={`url(#${okId})`}
                  />
                )}
                <circle cx={CX} cy={cy} r={R} fill={RENKLER.accent.solid} />
                <text x={CX} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#FFFFFF">
                  {i + 1}
                </text>
              </>
            ) : (
              <>
                <line data-dal="" x1={4} y1={cy} x2={CX - 5} y2={cy} stroke={GRAFIK.eksen} strokeWidth={2} />
                <circle cx={CX} cy={cy} r={5} fill={GRAFIK.isaret} />
              </>
            )}
            <text x={METIN_X} y={cy + 5} fontSize="14" fontWeight="600" fill={GRAFIK.metin}>
              {parca.map((p, j) => (
                <tspan key={p} x={METIN_X} dy={j === 0 ? 0 : SATIR}>
                  {p}
                </tspan>
              ))}
            </text>
          </g>
        ))}
      </svg>
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-semibold text-charcoal">Adımlar, açıklamalar ve kanun maddeleri</summary>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-ink-muted">
          {sema.adimlar.map((a) => (
            <li key={a.etiket}>
              <strong className="font-semibold text-charcoal">{a.etiket}</strong>
              {a.aciklama ? <>: {a.aciklama}</> : null}{' '}
              <a
                href={`/mevzuat/${a.dayanak.kanun}/madde-${a.dayanak.madde}`}
                className="text-accent-ink underline underline-offset-2"
              >
                {maddeAdi(a.dayanak)}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </figure>
  );
}
