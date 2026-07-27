import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ShareableAnswer from '@/components/ShareableAnswer';
import { getKavram, getAllKavramSlugs, KAVRAMLAR } from '@/lib/kavramlar';
import { SITE_URL } from '@/lib/profile';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
    return getAllKavramSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const k = getKavram(slug);
    if (!k) return { title: 'Kavram' };
    return {
        title: `${k.baslik} | Hukuki Kavram`,
        description: k.ozet,
        keywords: k.keywords.join(', '),
        alternates: { canonical: `${SITE_URL}/kavram/${k.slug}` },
        openGraph: {
            title: k.baslik,
            description: k.ozet,
            url: `${SITE_URL}/kavram/${k.slug}`,
        },
    };
}

export default async function KavramSlugPage({ params }: Props) {
    const { slug } = await params;
    const k = getKavram(slug);
    if (!k) notFound();

    const ilgili = (k.ilgili ?? [])
        .map((s) => getKavram(s))
        .filter((x): x is NonNullable<typeof x> => Boolean(x));

    const articleLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: k.baslik,
        description: k.ozet,
        author: { '@type': 'Person', name: 'Av. Fethi Güzel' },
        url: `${SITE_URL}/kavram/${k.slug}`,
        inLanguage: 'tr-TR',
    };

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: `${k.baslik} nedir?`,
                acceptedAnswer: { '@type': 'Answer', text: k.ozet },
            },
        ],
    };

    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
            />
            <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-3xl mx-auto">
                <nav className="text-[11px] text-charcoal/40 mb-5 flex flex-wrap gap-1.5" aria-label="Konum">
                    <Link href="/" className="hover:text-accent">
                        Ana sayfa
                    </Link>
                    <span>/</span>
                    <Link href="/kavram" className="hover:text-accent">
                        Kavramlar
                    </Link>
                    <span>/</span>
                    <span className="text-charcoal/60">{k.baslik}</span>
                </nav>

                <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-2">
                    Kavram
                </p>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4 leading-tight">
                    {k.baslik}
                </h1>
                <p className="text-charcoal/60 text-base leading-relaxed mb-8">{k.ozet}</p>

                <div className="mb-10">
                    <ShareableAnswer text={k.miniCevap} title="Forum / grup için mini cevap" />
                </div>

                <section className="space-y-4 mb-10">
                    {k.paragraflar.map((p) => (
                        <p key={p.slice(0, 48)} className="text-sm sm:text-base text-charcoal/70 leading-relaxed">
                            {p}
                        </p>
                    ))}
                </section>

                {k.mevzuat.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-lg font-heading font-bold text-charcoal mb-3">Mevzuat</h2>
                        <ul className="flex flex-wrap gap-2">
                            {k.mevzuat.map((m) => (
                                <li key={m.href}>
                                    <Link
                                        href={m.href}
                                        className="inline-block text-sm px-3 py-1.5 rounded-full bg-white border border-charcoal/10 hover:border-accent hover:text-accent"
                                    >
                                        {m.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {k.hesaplama && k.hesaplama.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-lg font-heading font-bold text-charcoal mb-3">
                            Hesaplama araçları
                        </h2>
                        <ul className="flex flex-wrap gap-2">
                            {k.hesaplama.map((m) => (
                                <li key={m.href}>
                                    <Link
                                        href={m.href}
                                        className="inline-block text-sm px-3 py-1.5 rounded-full bg-accent/10 text-accent font-semibold hover:bg-accent hover:text-white"
                                    >
                                        {m.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {k.rehber && k.rehber.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-lg font-heading font-bold text-charcoal mb-3">Rehber</h2>
                        <ul className="space-y-1">
                            {k.rehber.map((m) => (
                                <li key={m.href}>
                                    <Link href={m.href} className="text-sm text-accent font-semibold hover:underline">
                                        {m.label} →
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {ilgili.length > 0 && (
                    <section className="mb-10">
                        <h2 className="text-lg font-heading font-bold text-charcoal mb-3">
                            İlgili kavramlar
                        </h2>
                        <ul className="flex flex-wrap gap-2">
                            {ilgili.map((i) => (
                                <li key={i.slug}>
                                    <Link
                                        href={`/kavram/${i.slug}`}
                                        className="text-sm px-3 py-1.5 rounded-full bg-charcoal/5 text-charcoal/70 hover:text-accent"
                                    >
                                        {i.baslik}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <p className="text-[11px] text-charcoal/40 leading-relaxed mb-6">
                    Bu sayfa bilgilendirme amaçlıdır; resmî tavsiye veya vekâlet yerine geçmez. Somut
                    uyuşmazlıklarda avukata danışınız. Sonuç vaadi yoktur.
                </p>

                <div className="flex flex-wrap gap-4 text-sm font-bold">
                    <Link href="/kavram" className="text-accent hover:underline">
                        ← Tüm kavramlar ({KAVRAMLAR.length})
                    </Link>
                    <Link href="/ara" className="text-charcoal/50 hover:text-accent">
                        Mevzuatta ara
                    </Link>
                    <Link href="/on-form" className="text-charcoal/50 hover:text-accent">
                        Ön form
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
