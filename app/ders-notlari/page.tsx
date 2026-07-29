import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { DERS_NOTLARI_INDEX, getActiveUniversities } from '@/lib/ders-notlari';

const SITE = 'https://www.avfethiguzel.com';

export const metadata: Metadata = {
  title: {
    absolute: 'Hukuk Fakültesi Ders Notları (Ücretsiz) | Av. Fethi Güzel',
  },
  description:
    'Türkiye hukuk fakülteleri için ücretsiz ders notları: medeni, borçlar, ceza, usul, icra… Üniversite bazlı, örnekli, şematik. PDF indirilebilir. Ana sayfada değil — öğrenci arşivi.',
  keywords: [
    'hukuk ders notları',
    'hukuk fakültesi ders notu',
    'ücretsiz hukuk notu pdf',
    'yıldırım beyazıt hukuk ders notları',
    'ankara hukuk notları',
  ],
  alternates: { canonical: `${SITE}/ders-notlari` },
  robots: { index: true, follow: true },
};

export default function DersNotlariHubPage() {
  const unis = getActiveUniversities().sort((a, b) =>
    a.city.localeCompare(b.city, 'tr') || a.shortName.localeCompare(b.shortName, 'tr')
  );
  const byCity = new Map<string, typeof unis>();
  for (const u of unis) {
    if (!byCity.has(u.city)) byCity.set(u.city, []);
    byCity.get(u.city)!.push(u);
  }

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <main className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-4xl mx-auto">
        <p className="text-accent font-mono text-[10px] tracking-widest uppercase mb-2">
          Öğrenci arşivi · ana sayfada listelenmez
        </p>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4">
          Hukuk fakültesi ders notları (ücretsiz)
        </h1>
        <p className="text-charcoal/60 text-base leading-relaxed mb-4 max-w-2xl">
          Türkiye’deki hukuk fakülteleri için üniversite bazlı, şematik ve örnekli ders notları.
          Amaç: öğrenci kardeşlerimize ücretsiz akademik destek. Resmi müfredatın ve hocanın yerine
          geçmez; telifli slayt yayınlanmaz.
        </p>
        <p className="text-sm text-charcoal/50 mb-8">
          {DERS_NOTLARI_INDEX.universityCount} fakülte hub · {DERS_NOTLARI_INDEX.noteCount} derin not
          paketi (dalga {DERS_NOTLARI_INDEX.wave}) · PDF yazdırılabilir
        </p>

        <aside className="mb-10 rounded-2xl border border-charcoal/10 bg-white p-5 text-sm text-charcoal/65">
          <strong className="text-charcoal">Arama ipucu:</strong> Google’da «yıldırım beyazıt hukuk
          ders notları», «marmara borçlar ders notu» gibi sorgular bu dizin sayfalarını hedefler.
        </aside>

        {[...byCity.entries()].map(([city, list]) => (
          <section key={city} className="mb-10">
            <h2 className="text-lg font-heading font-bold text-charcoal mb-3 border-b border-charcoal/10 pb-2">
              {city}
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {list.map((u) => (
                <li key={u.slug}>
                  <Link
                    href={`/ders-notlari/${u.slug}`}
                    className="block rounded-xl border border-charcoal/10 bg-white/70 hover:border-accent/40 px-3 py-2.5 text-sm font-semibold text-charcoal"
                  >
                    {u.shortName}
                    <span className="block text-[11px] font-normal text-charcoal/45 mt-0.5">
                      {u.name.replace(/ Hukuk Fakültesi$/, '')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="text-xs text-charcoal/40 mt-12">
          Detaylı sistem analizi: repo içi{' '}
          <code className="text-[10px]">docs/ders-notlari/ANALIZ-TURKIYE-HUKUK-FAKULTETLERI.md</code>
        </p>
      </main>
      <Footer />
    </div>
  );
}
