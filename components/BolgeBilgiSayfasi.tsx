import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, Scale, ArrowRight, MapPin, Info } from 'lucide-react';
import { SITE_URL, PROFILE } from '@/lib/profile';
import type { BolgeBilgi } from '@/lib/bolge-bilgi';
import { BOLGE_BILGILERI } from '@/lib/bolge-bilgi';
import { BOLGE_MAKALELER } from '@/lib/bolge-makaleler';

export default function BolgeBilgiSayfasi({ veri }: { veri: BolgeBilgi }) {
  const pageUrl = `${SITE_URL}/${veri.slug}`;
  const other = BOLGE_BILGILERI.filter((b) => b.slug !== veri.slug).slice(0, 8);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: veri.h1,
    description: veri.description,
    inLanguage: 'tr-TR',
    author: {
      '@type': 'Person',
      name: PROFILE.name,
      url: `${SITE_URL}/avukat-fethi-guzel`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Av. Fethi Güzel Hukuk Portalı',
      url: SITE_URL,
    },
    mainEntityOfPage: pageUrl,
    about: {
      '@type': 'Place',
      name: `${veri.yerlesim}, ${veri.il}`,
    },
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: veri.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Vatandaş rehberi', item: `${SITE_URL}/bilgi` },
      { '@type': 'ListItem', position: 3, name: veri.h1, item: pageUrl },
    ],
  };

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-3xl lg:max-w-4xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-charcoal/40">
          <Link href="/" className="hover:text-accent">
            Ana sayfa
          </Link>
          <span className="mx-2">/</span>
          <Link href="/bilgi" className="hover:text-accent">
            Bilgi
          </Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal/60">{veri.yerlesim}</span>
        </nav>

        <header className="mb-10">
          <p className="text-accent font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase mb-3">
            {veri.eyebrow}
          </p>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal leading-tight mb-4">
            {veri.h1}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-charcoal/45 mb-6">
            <span className="inline-flex items-center gap-1 rounded-full bg-charcoal/5 px-3 py-1">
              <MapPin size={12} className="text-accent" />
              {veri.yerlesim} · {veri.il}
            </span>
            {veri.merkezOfis && (
              <span className="rounded-full bg-accent/10 text-accent px-3 py-1 font-medium">
                Ofis bu yerleşimde
              </span>
            )}
            {veri.uzaktan && (
              <span className="rounded-full bg-charcoal/5 px-3 py-1">Uzaktan dosya takibi bağlamı</span>
            )}
            <span className="rounded-full bg-charcoal/5 px-3 py-1">Genel bilgilendirme</span>
          </div>
          {veri.lead.map((p, i) => (
            <p key={i} className="text-charcoal/65 text-base sm:text-lg leading-relaxed mb-3">
              {p}
            </p>
          ))}
          <div className="mt-5 flex items-start gap-2 rounded-2xl border border-accent/20 bg-accent/5 p-4 text-sm text-charcoal/70">
            <Info size={16} className="text-accent shrink-0 mt-0.5" />
            <p>
              Bu sayfa <strong className="text-charcoal">reklam veya iş edinme metni değildir</strong>.
              “En iyi / garantili sonuç” iddiası taşımaz. Somut dosyada avukata danışılmalıdır.
            </p>
          </div>
        </header>

        <div className="space-y-10 mb-14">
          {veri.sections.map((s) => (
            <section key={s.heading} className="bg-white border border-charcoal/6 rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-heading font-bold text-charcoal mb-3">{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i} className="text-charcoal/65 text-sm sm:text-base leading-relaxed mb-3 last:mb-0">
                  {p}
                </p>
              ))}
              {s.bullets && s.bullets.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-charcoal/65">
                      <span className="text-accent mt-1.5 shrink-0">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {(veri.relatedBilgi.length > 0 || veri.links.length > 0) && (
          <section className="mb-14">
            <h2 className="text-lg font-heading font-bold text-charcoal mb-4">İlgili rehberler ve mevzuat</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {veri.relatedBilgi.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group flex items-center justify-between gap-3 bg-white border border-charcoal/8 rounded-xl px-4 py-3.5 hover:border-accent/40 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-charcoal">
                    <BookOpen size={15} className="text-accent shrink-0" />
                    {l.label}
                  </span>
                  <ArrowRight size={14} className="text-charcoal/30 group-hover:text-accent" />
                </Link>
              ))}
              {veri.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group flex items-center justify-between gap-3 bg-charcoal/[0.03] border border-charcoal/6 rounded-xl px-4 py-3.5 hover:border-accent/30 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-charcoal/80">
                    <Scale size={15} className="text-accent shrink-0" />
                    {l.label}
                  </span>
                  <ArrowRight size={14} className="text-charcoal/25 group-hover:text-accent" />
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-14">
          <h2 className="text-lg font-heading font-bold text-charcoal mb-4">Sık sorulanlar</h2>
          <div className="space-y-3">
            {veri.faq.map((f) => (
              <details
                key={f.q}
                className="group bg-white border border-charcoal/6 rounded-xl open:shadow-sm"
              >
                <summary className="cursor-pointer list-none p-4 sm:p-5 font-semibold text-sm text-charcoal flex justify-between gap-3">
                  {f.q}
                  <span className="text-charcoal/30 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-charcoal/60 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-charcoal/8 bg-white p-6">
          <h2 className="text-base font-heading font-bold text-charcoal mb-2">Kaynak ve iletişim</h2>
          <p className="text-sm text-charcoal/60 leading-relaxed mb-4">
            İçerik, açık mevzuat ve genel uygulama bilgisine dayanır. Yazar:{' '}
            <Link href="/avukat-fethi-guzel" className="text-accent font-semibold hover:underline">
              {PROFILE.name}
            </Link>
            . Akademik arka plan için{' '}
            <Link href="/akademik-profil" className="text-accent font-semibold hover:underline">
              akademik profil
            </Link>
            ; tüm vatandaş rehberleri için{' '}
            <Link href="/bilgi" className="text-accent font-semibold hover:underline">
              /bilgi
            </Link>
            .
          </p>
          <p className="text-xs text-charcoal/45">
            Ofis adresi profil sayfasındadır. Bu sayfa konum bazlı reklam değildir.
          </p>
        </section>

        {(() => {
          const makaleler = BOLGE_MAKALELER.filter(
            (m) => m.yerlesim === veri.yerlesim || m.il === veri.il
          ).slice(0, 6);
          if (!makaleler.length) return null;
          return (
            <section className="mb-12">
              <h2 className="text-lg font-heading font-bold text-charcoal mb-3">
                {veri.yerlesim} ve çevresi — bölge yazıları
              </h2>
              <p className="text-sm text-charcoal/50 mb-4">
                Mekânın ruhu, tarih ve bellek — fotoğraflı denemeler (reklam değil).
              </p>
              <ul className="space-y-2">
                {makaleler.map((m) => (
                  <li key={m.slug}>
                    <Link
                      href={`/bolge-yazi/${m.slug}`}
                      className="text-sm font-semibold text-accent hover:underline"
                    >
                      {m.h1}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/bolge-yazi"
                className="inline-block mt-4 text-xs font-bold text-charcoal/50 hover:text-accent"
              >
                Tüm bölge yazıları →
              </Link>
            </section>
          );
        })()}

        {other.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-charcoal/50 uppercase tracking-wider mb-3">
              Diğer bölgesel bilgilendirmeler
            </h2>
            <div className="flex flex-wrap gap-2">
              {other.map((b) => (
                <Link
                  key={b.slug}
                  href={`/${b.slug}`}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-charcoal/5 text-charcoal/70 hover:bg-accent/10 hover:text-accent transition-colors"
                >
                  {b.yerlesim}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
