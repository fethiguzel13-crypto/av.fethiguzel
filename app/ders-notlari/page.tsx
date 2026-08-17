import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getActiveUniversities } from '@/lib/ders-notlari';
import { publishableDersNotlari } from '@/lib/publishable';

const SITE = 'https://www.avfethiguzel.com';

const LIVE_NOTES = publishableDersNotlari().size;

export const metadata: Metadata = {
  title: {
    absolute: 'Hukuk Fakültesi Ders Notları | Av. Fethi Güzel',
  },
  description:
    'Hukuk fakültesi ders notları arşivi yeniden yazılıyor. Kanun metinleri, hesaplama araçları ve güncel içtihat takibi kullanılabilir durumda.',
  alternates: { canonical: `${SITE}/ders-notlari` },
  // Yayınlanabilir tek bir not kalmadığı sürece bölüm indekse girmez:
  // 84 fakülte sayfası, açılamayan notlara giden giriş kapılarından ibaret.
  robots: LIVE_NOTES > 0 ? { index: true, follow: true } : { index: false, follow: true },
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
          Öğrenci arşivi
        </p>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4">
          Hukuk fakültesi ders notları
        </h1>

        {LIVE_NOTES === 0 ? (
          <aside className="mb-10 rounded-2xl border border-accent/30 bg-accent/[0.06] p-5 sm:p-6">
            <p className="text-[11px] font-mono tracking-[0.16em] uppercase text-accent font-bold m-0 mb-2">
              Arşiv yeniden yazılıyor
            </p>
            <p className="text-[15px] text-charcoal/80 leading-relaxed m-0">
              Yapılan iç denetimde bu bölümdeki notların otomatik kalıptan üretildiği ve aynı
              metnin bütün fakültelere çoğaltıldığı görüldü. Sınavına çalışan bir öğrenciye içi
              boş not vermektense hiç vermemeyi tercih ettik; notların tamamı yayından kaldırıldı.
            </p>
            <p className="text-sm text-charcoal/60 leading-relaxed mt-3 mb-0">
              Yeniden yazım, ders ders ve kaynağı doğrulanmış biçimde sürüyor. Bu arada
              aşağıdakiler kullanılabilir durumda:
            </p>
            <ul className="mt-3 mb-0 flex flex-wrap gap-2 list-none p-0">
              {[
                { href: '/mevzuat', label: 'Kanun maddeleri' },
                { href: '/hesaplama', label: 'Hesaplama araçları' },
                { href: '/icthat', label: 'Güncel içtihat' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex text-sm font-semibold px-3.5 py-2 rounded-full bg-white border border-charcoal/10 text-charcoal hover:border-accent hover:text-accent transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        ) : (
          <p className="text-charcoal/60 text-base leading-relaxed mb-8 max-w-2xl">
            Denetimden geçmiş {LIVE_NOTES} ders notu. Resmî müfredatın yerine geçmez; telifli
            slayt kopyalanmaz.
          </p>
        )}

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
