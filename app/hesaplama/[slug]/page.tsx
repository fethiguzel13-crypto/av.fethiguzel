import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HesaplamaToolBody } from '@/components/hesaplama/HesaplamaTools';
import ToolShareBar from '@/components/hesaplama/ToolShareBar';
import { getAracMeta, getAllAracIds, HESAPLAMA_ARACLAR } from '@/lib/hesaplama-meta';
import { bilgiLinksForArac } from '@/lib/hesaplama-bilgi';
import { getKavramForHesaplama } from '@/lib/kavramlar';
import ShareableAnswer from '@/components/ShareableAnswer';
import { SITE_URL } from '@/lib/profile';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
    return getAllAracIds().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const meta = getAracMeta(slug);
    if (!meta) return { title: 'Hesaplama' };
    const url = `${SITE_URL}/hesaplama/${meta.id}`;
    return {
        title: `${meta.baslik} | Hesaplama`,
        description: meta.aciklama,
        keywords: meta.keywords.join(', '),
        alternates: { canonical: url },
        openGraph: {
            title: meta.baslik,
            description: meta.aciklama,
            url,
            type: 'website',
        },
        twitter: {
            card: 'summary',
            title: meta.baslik,
            description: meta.aciklama,
            site: '@avfethiguzel',
            creator: '@avfethiguzel',
        },
    };
}

export default async function HesaplamaSlugPage({ params }: Props) {
    const { slug } = await params;
    const meta = getAracMeta(slug);
    if (!meta) notFound();

    const url = `${SITE_URL}/hesaplama/${meta.id}`;
    const ilgili = (meta.ilgili ?? [])
        .map((id) => getAracMeta(id))
        .filter((x): x is NonNullable<typeof x> => Boolean(x));
    const kavram = getKavramForHesaplama(meta.id);
    const bilgiLinks = bilgiLinksForArac(meta.id);

    const softwareLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: meta.baslik,
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'LegalCalculator',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
        url,
        description: meta.aciklama,
        author: { '@type': 'Person', name: 'Av. Fethi Güzel' },
        inLanguage: 'tr-TR',
    };

    const howToLd = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `${meta.baslik} nasıl kullanılır?`,
        description: meta.aciklama,
        step: meta.rehber.map((text, i) => ({
            '@type': 'HowToStep',
            position: i + 1,
            text,
        })),
    };

    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
            />

            <main id="main-content" className="pt-24 sm:pt-32 md:pt-36 pb-16 sm:pb-24 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <nav className="text-[11px] text-charcoal/40 mb-5 flex flex-wrap gap-1.5" aria-label="Sayfa konumu">
                        <Link href="/" className="hover:text-accent">
                            Ana sayfa
                        </Link>
                        <span>/</span>
                        <Link href="/hesaplama" className="hover:text-accent">
                            Hesaplama
                        </Link>
                        <span>/</span>
                        <span className="text-charcoal/60">{meta.baslik}</span>
                    </nav>

                    <p className="text-accent font-mono text-[10px] tracking-widest uppercase mb-2">
                        {meta.icon} {meta.tag}
                    </p>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal mb-3 leading-tight">
                        {meta.baslik}
                    </h1>
                    <p className="text-charcoal/55 text-sm sm:text-base leading-relaxed mb-4 max-w-2xl">
                        {meta.aciklama}
                    </p>

                    <ToolShareBar url={url} title={meta.baslik} />

                    <HesaplamaToolBody id={meta.id} title={meta.baslik} />

                    {kavram && (
                        <section className="mt-8 space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <h2 className="text-lg font-heading font-bold text-charcoal">
                                    Kavram & forum cevabı
                                </h2>
                                <Link
                                    href={`/kavram/${kavram.slug}`}
                                    className="text-sm font-bold text-accent hover:underline"
                                >
                                    {kavram.baslik} sayfası →
                                </Link>
                            </div>
                            <ShareableAnswer text={kavram.miniCevap} title="Kopyalanabilir mini cevap" compact />
                        </section>
                    )}

                    <section className="mt-10 sm:mt-12">
                        <h2 className="text-lg font-heading font-bold text-charcoal mb-3">
                            Kısa bilgilendirme
                        </h2>
                        <ul className="space-y-3">
                            {meta.rehber.map((p) => (
                                <li
                                    key={p.slice(0, 40)}
                                    className="text-sm text-charcoal/65 leading-relaxed pl-4 border-l-2 border-accent/30"
                                >
                                    {p}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-4 text-[11px] text-charcoal/40 leading-relaxed">
                            Bu sayfa bilgilendirme amaçlıdır; resmî tavsiye veya vekâlet yerine geçmez.
                            Somut uyuşmazlıklarda avukata danışınız. Sonuç vaadi yoktur.
                        </p>
                    </section>

                    {bilgiLinks.length > 0 && (
                        <section className="mt-8 rounded-2xl border border-accent/20 bg-accent/[0.04] p-5 sm:p-6">
                            <h2 className="text-lg font-heading font-bold text-charcoal mb-2">
                                Vatandaş rehberi — derin okuma
                            </h2>
                            <p className="text-sm text-charcoal/55 mb-4 leading-relaxed">
                                Hesap yalnızca rakam üretir. Süreç, şart ve riskler için ilgili bilgilendirme
                                sayfalarına bakın (bilgilendirme; somut dosyada avukata danışın).
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {bilgiLinks.map((b) => (
                                    <li key={b.href}>
                                        <Link
                                            href={b.href}
                                            className="flex items-center gap-2 p-3 rounded-xl bg-white border border-charcoal/[0.08] hover:border-accent/40 text-sm font-semibold text-charcoal transition-colors"
                                        >
                                            <span className="text-accent" aria-hidden>
                                                →
                                            </span>
                                            {b.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-3">
                                <Link
                                    href="/bilgi"
                                    className="text-xs font-bold text-accent hover:underline"
                                >
                                    Tüm vatandaş rehberleri (550+) →
                                </Link>
                            </p>
                        </section>
                    )}

                    {meta.mevzuat.length > 0 && (
                        <section className="mt-8">
                            <h2 className="text-lg font-heading font-bold text-charcoal mb-3">
                                İlgili mevzuat & sayfalar
                            </h2>
                            <ul className="flex flex-wrap gap-2">
                                {meta.mevzuat.map((m) => (
                                    <li key={m.href}>
                                        <Link
                                            href={m.href}
                                            className="inline-block text-sm px-3 py-1.5 rounded-full bg-white border border-charcoal/10 text-charcoal/70 hover:border-accent hover:text-accent transition-colors"
                                        >
                                            {m.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {ilgili.length > 0 && (
                        <section className="mt-8">
                            <h2 className="text-lg font-heading font-bold text-charcoal mb-3">
                                İlgili hesaplama araçları
                            </h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {ilgili.map((a) => (
                                    <li key={a.id}>
                                        <Link
                                            href={`/hesaplama/${a.id}`}
                                            className="flex gap-2 items-center p-3 rounded-xl bg-white border border-charcoal/[0.08] hover:border-accent/40 text-sm font-semibold text-charcoal"
                                        >
                                            <span aria-hidden>{a.icon}</span>
                                            {a.baslik}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    <div className="mt-10 flex flex-wrap gap-3">
                        <Link
                            href="/hesaplama"
                            className="text-sm font-bold text-accent hover:underline"
                        >
                            ← Tüm hesaplama araçları ({HESAPLAMA_ARACLAR.length})
                        </Link>
                        <Link href="/on-form" className="text-sm font-bold text-charcoal/50 hover:text-accent">
                            Ön değerlendirme formu
                        </Link>
                        <Link
                            href="/tarife-guncellemeleri"
                            className="text-sm font-bold text-charcoal/50 hover:text-accent"
                        >
                            Tarife güncellemeleri
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
