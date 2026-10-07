import Link from '@/components/SiteLink';
import { TUR_ADI } from '@/lib/ic-baglanti/dizin.mjs';

type Oge = { tur: string; ad: string; yol: string };

/**
 * Aynı maddelere değinen içerik (Aylık plan G12 adım 8): rehber, kavram ve hesaplama sayfalarında, içeriğin kendi
 * bağlantı listesindeki madde göndermelerinden kurulan dizinle. Liste boşsa hiçbir şey çizmez.
 */
export default function IlgiliIcerik({
  ogeler,
  baslik = 'Aynı maddelere değinen içerik',
  className = 'mb-10',
}: {
  ogeler: Oge[];
  baslik?: string;
  className?: string;
}) {
  if (!ogeler.length) return null;
  return (
    <section className={className} aria-labelledby="ilgili-icerik">
      <h2 id="ilgili-icerik" className="text-lg font-heading font-bold text-charcoal mb-3">
        {baslik}
      </h2>
      <ul className="space-y-1.5">
        {ogeler.map((o) => (
          <li key={o.yol} className="text-sm">
            <span className="mr-2 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              {TUR_ADI[o.tur as keyof typeof TUR_ADI] ?? o.tur}
            </span>
            <Link href={o.yol} className="text-accent-ink font-semibold hover:underline">
              {o.ad}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
