import type { Metadata } from 'next';
import Link from '@/components/SiteLink';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Kirinti from '@/components/Kirinti';
import CubukGrafik from '@/components/grafik/CubukGrafik';
import ZamanGrafik from '@/components/grafik/ZamanGrafik';
import GrafikTablo from '@/components/grafik/GrafikTablo';
import { sayi } from '@/lib/grafik-olcek.mjs';
import { tarihVerisi } from '@/lib/yazar';
import dagilim from '@/public/data/yargi-dagilim.json';

export const dynamic = 'force-static';

const ADRES = 'https://www.avfethiguzel.com/yargi-kararlari/istatistik';

export const metadata: Metadata = {
  title: 'Yargıtay Karar Arşivi İstatistikleri',
  description: `Arşivdeki ${sayi(dagilim.yayinda)} yayımlanmış Yargıtay kararının yıllara ve birimlere göre dağılımı, grafik ve tablo olarak.`,
  alternates: { canonical: ADRES },
  openGraph: {
    title: 'Yargıtay Karar Arşivi İstatistikleri',
    description: 'Yayımlanan kararların yıllara ve birimlere göre dağılımı.',
    url: ADRES,
  },
};

/** Sayfanın sayı kutuları: arşiv, yayında ve süzgeçte ayrılan. */
const KUTULAR = [
  { ad: 'Arşivdeki karar', deger: dagilim.arsiv },
  { ad: 'Sitede yayımlanan', deger: dagilim.yayinda },
  { ad: 'Yayın süzgecinde ayrılan', deger: dagilim.suzulen },
];

const KART = 'mt-6 rounded-2xl border border-charcoal/10 bg-surface p-5 sm:p-7';

export default function YargiIstatistikPage() {
  const tarih = tarihVerisi(dagilim.kaynakTarihi);
  const digerAciklama = dagilim.digerDetay.map((d) => `${d.ad} (${sayi(d.sayi)})`).join(', ');
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-cream px-5 pb-20 pt-36 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <Kirinti
            ogeler={[
              { ad: 'Yargıtay karar arşivi', yol: '/yargi-kararlari' },
              { ad: 'İstatistikler', yol: '/yargi-kararlari/istatistik' },
            ]}
          />
          <h1 className="font-heading text-3xl font-bold tracking-tight text-charcoal sm:text-5xl">
            Karar arşivi istatistikleri
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
            Arşivde {sayi(dagilim.arsiv)} Yargıtay kararı bulunmakta olup bunlardan {sayi(dagilim.yayinda)} karar sitede
            yayımlanmaktadır. Aşağıdaki dağılımlar yayımlanan kararlar üzerinden sayılmıştır
            {tarih ? (
              <>
                {' '}ve <time dateTime={tarih.iso}>{tarih.metin}</time> tarihli üretimi yansıtır
              </>
            ) : null}
            .
          </p>

          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            {KUTULAR.map((k) => (
              <div key={k.ad} className="rounded-2xl border border-charcoal/10 bg-surface px-5 py-4">
                <dt className="text-sm text-ink-muted">{k.ad}</dt>
                <dd className="mt-1 font-heading text-3xl font-semibold text-charcoal">{sayi(k.deger)}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
            Başka bir kararın benzeri olan ya da emsal niteliği zayıf görülen kararlar arşivde tutulur, sitede yayımlanmaz.
          </p>

          <section className={KART} aria-labelledby="yillara-gore">
            <h2 id="yillara-gore" className="font-heading text-xl font-semibold text-charcoal sm:text-2xl">
              Yıllara göre yayımlanan karar sayısı
            </h2>
            <p className="mb-6 mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
              Grafik arşivin kapsamını yansıtır, Yargıtay&apos;ın yıllık karar sayısını göstermez. Karar tarihi
              okunamayan {sayi(dagilim.tarihsiz)} karar grafikte yer almaz.
            </p>
            <ZamanGrafik baslik="Yıllara göre yayımlanan karar sayısı" veri={dagilim.yillar} />
            <GrafikTablo
              baslik="Yıllara göre yayımlanan karar sayısı"
              sutunlar={['Yıl', 'Karar sayısı']}
              satirlar={dagilim.yillar.map((d) => [d.yil, d.sayi])}
            />
          </section>

          <section className={KART} aria-labelledby="birimlere-gore">
            <h2 id="birimlere-gore" className="font-heading text-xl font-semibold text-charcoal sm:text-2xl">
              Birimlere göre yayımlanan karar sayısı
            </h2>
            <p className="mb-6 mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
              Daireler konu ağırlığına göre gruplanmıştır. &ldquo;Diğer&rdquo; başlığı şu birimleri kapsar: {digerAciklama}.
            </p>
            <CubukGrafik baslik="Birimlere göre yayımlanan karar sayısı" veri={dagilim.birimler} />
            <GrafikTablo
              baslik="Birimlere göre yayımlanan karar sayısı"
              sutunlar={['Birim', 'Karar sayısı']}
              satirlar={dagilim.birimler.map((d) => [d.ad, d.sayi])}
            />
          </section>

          <p className="mt-8 text-sm text-ink-muted">
            Kararların kendisi{' '}
            <Link href="/yargi-kararlari" className="text-accent-ink underline underline-offset-2">
              Yargıtay karar arşivinde
            </Link>{' '}
            okunur.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
