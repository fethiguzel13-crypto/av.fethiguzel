import { jsonLdHtml } from "@/lib/json-ld";
import type { Metadata } from 'next';
import { paylasimMeta } from '@/lib/paylasim';
import Link from "@/components/SiteLink";
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Kirinti from '@/components/Kirinti';
import { getAllKanunDirs, getArticlesByKanun, SITE_ORIGIN } from '@/lib/api';
import { maddeYolu } from '@/lib/madde-yolu';
import { categories } from '@/lib/categories';

type Props = { params: Promise<{ kanunId: string }> };

const KANUN_NAMES: Record<string, string> = {
  tbk: 'Türk Borçlar Kanunu',
  tmk: 'Türk Medeni Kanunu',
  ttk: 'Türk Ticaret Kanunu',
  tck: 'Türk Ceza Kanunu',
  hmk: 'Hukuk Muhakemeleri Kanunu',
  iik: 'İcra ve İflas Kanunu',
  cmk: 'Ceza Muhakemesi Kanunu',
  'is-kanunu': 'İş Kanunu',
  vuk: 'Vergi Usul Kanunu',
  kvkk: 'Kişisel Verilerin Korunması Kanunu',
};

export async function generateStaticParams() {
  const dirs = await getAllKanunDirs();
  return dirs.map((kanunId) => ({ kanunId }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kanunId } = await params;
  const code = kanunId.toUpperCase();
  const name = KANUN_NAMES[kanunId] || code;
  const articles = await getArticlesByKanun(kanunId);
  if (!articles.length) return { title: 'Kanun bulunamadı' };
  const url = `${SITE_ORIGIN}/mevzuat/${kanunId}`;
  return {
    title: `${code} Madde Listesi — ${name}`,
    description: `${code} (${name}) tüm maddeler: ${articles.length} madde resmî metin + akademik şerh. ${code} 1, ${code} 13, ${code} madde araması — Av. Fethi Güzel Hukuk Portalı.`,
    alternates: { canonical: url },
    ...paylasimMeta({
      baslik: `${code} — Tüm maddeler ve şerhler`,
      aciklama: `${articles.length} madde · resmî metin + akademik şerh · Av. Fethi Güzel`,
      adres: url,
      tur: 'kanun',
      anahtar: kanunId,
    }),
    robots: { index: true, follow: true },
  };
}

export default async function KanunHubPage({ params }: Props) {
  const { kanunId } = await params;
  const code = kanunId.toUpperCase();
  const name = KANUN_NAMES[kanunId] || code;
  const articles = await getArticlesByKanun(kanunId);
  if (!articles.length) notFound();

  const relatedCats = categories.filter((c) => c.kanunId === kanunId);
  // Popular first-N for crawl (exact-match queries like TBK 13)
  const popular = articles.filter((a) => a.maddeNo <= 50).slice(0, 50);

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${code} — ${name} madde listesi`,
    description: `${name} maddeleri ve akademik şerhler — Av. Fethi Güzel`,
    url: `${SITE_ORIGIN}/mevzuat/${kanunId}`,
    isPartOf: { '@type': 'WebSite', name: 'Av. Fethi Güzel Hukuk Portalı', url: SITE_ORIGIN },
    about: { '@type': 'Legislation', name, legislationJurisdiction: 'TR' },
    numberOfItems: articles.length,
  };

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(itemListLd) }}
      />
      <main className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-5xl mx-auto">
        <Kirinti
          ogeler={[
            { ad: 'Mevzuat', yol: '/mevzuat' },
            { ad: code, yol: `/mevzuat/${kanunId}` },
          ]}
        />

        <p className="text-accent-ink font-mono text-[10px] tracking-widest uppercase mb-2">
          Kanun maddesi hub · {articles.length} madde
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mb-3 leading-tight">
          {code} — {name}
        </h1>
        <p className="text-ink-muted text-base max-w-2xl mb-6 leading-relaxed">
          {code} maddelerinin tamamı: resmî metin ve akademik şerh aynı sayfada.
          Arama örnekleri: <strong className="text-charcoal/80">{code} 13</strong>,{' '}
          <strong className="text-charcoal/80">{code} madde 1</strong>,{' '}
          <strong className="text-charcoal/80">{code} m. 125</strong> — Av. Fethi Güzel.
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href={`/ara?q=${encodeURIComponent(code)}`}
            className="text-sm px-4 py-2 rounded-full bg-accent-solid text-white font-bold hover:bg-accent-ink"
          >
            {code} maddelerinde ara
          </Link>
          <Link
            href="/bilgi"
            className="text-sm px-4 py-2 rounded-full bg-white border border-charcoal/10 font-semibold text-charcoal hover:border-accent"
          >
            Vatandaş rehberi
          </Link>
          <Link
            href="/mevzuat"
            className="text-sm px-4 py-2 rounded-full bg-white border border-charcoal/10 font-semibold text-charcoal hover:border-accent"
          >
            Tüm kanunlar
          </Link>
        </div>

        {relatedCats.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-ink-muted mb-3">
              Bölümler
            </h2>
            <ul className="flex flex-wrap gap-2">
              {relatedCats.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/kategori/${c.slug}`}
                    className="inline-block text-sm px-3 py-1.5 rounded-full bg-white border border-charcoal/10 hover:border-accent text-charcoal/75"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {popular.length > 0 && (
          <section className="mb-12 rounded-2xl border border-accent/20 bg-accent/[0.04] p-5 sm:p-6">
            <h2 className="text-lg font-heading font-bold text-charcoal mb-2">
              Sık aranan {code} maddeleri (1–50)
            </h2>
            <p className="text-sm text-ink-muted mb-4">
              Google’da «{code} 13», «{code} madde 1» gibi aramalar için doğrudan bağlantılar.
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {popular.map((a) => (
                <li key={a.id}>
                  <Link
                    href={maddeYolu(kanunId, a.id)}
                    className="block text-sm px-3 py-2 rounded-xl bg-white border border-charcoal/[0.08] hover:border-accent font-semibold text-charcoal"
                  >
                    {code} {a.maddeNo}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="text-lg font-heading font-bold text-charcoal mb-4">
            Tüm {code} maddeleri ({articles.length})
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {articles.map((a) => (
              <li key={a.id}>
                <Link
                  href={maddeYolu(kanunId, a.id)}
                  className="flex gap-3 items-baseline px-3 py-2.5 rounded-xl hover:bg-white border border-transparent hover:border-charcoal/[0.08] transition-colors"
                >
                  <span className="shrink-0 font-mono text-xs font-bold text-accent-ink w-16">
                    {code} {a.maddeNo}
                  </span>
                  <span className="text-sm text-charcoal/75 line-clamp-1">
                    {a.title || `Madde ${a.maddeNo}`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
