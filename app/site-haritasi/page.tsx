import type { Metadata } from 'next';
import Link from "@/components/SiteLink";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Kirinti from '@/components/Kirinti';
import { BOLGELER, SITE_URL, PROFILE } from '@/lib/profile';
import { categories } from '@/lib/categories';
import { HESAPLAMA_ARACLAR } from '@/lib/hesaplama-meta';
import { KAVRAMLAR } from '@/lib/kavramlar';
import { PUBLISHED_ARTICLES } from '@/lib/vatandas-rehberi/published';
import { getActiveUniversities } from '@/lib/ders-notlari/universiteler';
import { hubDizinde } from '@/lib/ders-notlari/dizin.mjs';
import kanonik from '@/lib/ders-notlari/dizin-kanonik.json';

/** Yalnız dizine açık fakülte sayfaları (G11: temsilci not barındıran); diğerleri noindex. */
const DIZINDEKI_FAKULTELER = getActiveUniversities().filter((u) => hubDizinde(u.slug, kanonik));

export const metadata: Metadata = {
    title: 'Site Haritası',
    description:
        'Av. Fethi Güzel Hukuk Portalı HTML site haritası: mevzuat, hesaplama, içtihat, hizmet bölgeleri, akademik profil.',
    alternates: { canonical: `${SITE_URL}/site-haritasi` },
    robots: { index: true, follow: true },
};

const CORE = [
    { href: '/', ad: 'Ana sayfa' },
    { href: '/ara', ad: 'Mevzuat ara' },
    { href: '/mevzuat', ad: 'Mevzuat arşivi' },
    { href: '/yargi-kararlari', ad: 'Yargıtay arşivi (üyelik)' },
    { href: '/uyelik', ad: 'Arşiv üyeliği' },
    { href: '/uyelik/sozlesme', ad: 'Mesafeli satış sözleşmesi' },
    { href: '/icthat', ad: 'Günlük içtihat' },
    { href: '/icthat/haftalik', ad: 'Haftalık içtihat özeti' },
    { href: '/hesaplama', ad: 'Hesaplama araçları' },
    { href: '/tarife-guncellemeleri', ad: 'Tarife güncellemeleri' },
    { href: '/on-form', ad: 'Ön değerlendirme formu' },
    { href: '/kavram', ad: 'Hukuki kavramlar' },
    { href: '/bilgi', ad: 'Vatandaş bilgi rehberi' },
    { href: '/ders-notlari', ad: 'Hukuk fakültesi ders notları' },
    { href: '/bolge-yazi', ad: 'Bölgesel hukuki makaleler' },
    { href: '/makaleler', ad: 'Makaleler' },
    { href: '/eserlerim', ad: 'Eserler / kitap' },
    { href: '/e-durusma', ad: 'e-Duruşma hub' },
    { href: '/bookmarklet', ad: 'Mevzuat yer imi aracı' },
    { href: '/avukat-fethi-guzel', ad: 'Avukat profili' },
    { href: '/akademik-profil', ad: 'Akademik profil' },
    { href: '/english-speaking-lawyer', ad: 'English-speaking lawyer' },
    { href: '/ar', ad: 'Arabic landing' },
    { href: '/bolge-yazi', ad: 'Bölge yazıları (fotoğraflı denemeler)' },
    { href: '/hizmetler', ad: 'Hizmet alanları' },
    { href: '/gizlilik', ad: 'Gizlilik / KVKK' },
    { href: '/yasal-uyari', ad: 'Yasal uyarı' },
];

export default function SiteHaritasiPage() {
    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-5xl mx-auto">
                <Kirinti
                    ogeler={[
                        { ad: 'Site haritası', yol: '/site-haritasi' },
                    ]}
                />
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-3">Site haritası</h1>
                <p className="text-charcoal/55 text-sm mb-10 max-w-2xl">
                    {PROFILE.name} Hukuk Portalı — kullanıcı dostu HTML harita. Makine okunur XML:{' '}
                    <a href="/sitemap.xml" className="text-accent font-semibold hover:underline">
                        /sitemap.xml
                    </a>
                </p>

                <section className="mb-12">
                    <h2 className="text-lg font-heading font-bold text-charcoal mb-4">Ana sayfalar</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {CORE.map((l) => (
                            <li key={l.href}>
                                <Link href={l.href} className="text-sm text-charcoal/70 hover:text-accent">
                                    {l.ad}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-lg font-heading font-bold text-charcoal mb-4">
                        Hesaplama araçları ({HESAPLAMA_ARACLAR.length})
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[22rem] overflow-y-auto pr-2">
                        {HESAPLAMA_ARACLAR.map((a) => (
                            <li key={a.id}>
                                <Link href={`/hesaplama/${a.id}`} className="text-sm text-charcoal/70 hover:text-accent">
                                    {a.icon} {a.baslik}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-lg font-heading font-bold text-charcoal mb-4">
                        Hukuki kavramlar ({KAVRAMLAR.length})
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[18rem] overflow-y-auto pr-2">
                        {KAVRAMLAR.map((k) => (
                            <li key={k.slug}>
                                <Link href={`/kavram/${k.slug}`} className="text-sm text-charcoal/70 hover:text-accent">
                                    {k.baslik}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-lg font-heading font-bold text-charcoal mb-4">
                        Vatandaş bilgi rehberi ({PUBLISHED_ARTICLES.length})
                    </h2>
                    <p className="text-xs text-charcoal/45 mb-3">
                        Ana sayfada öne çıkarılmaz; Google ve bu harita üzerinden erişilir.
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[36rem] overflow-y-auto pr-2">
                        {PUBLISHED_ARTICLES.map((a) => (
                            <li key={a.slug}>
                                <Link href={`/bilgi/${a.slug}`} className="text-sm text-charcoal/70 hover:text-accent">
                                    {a.h1}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-lg font-heading font-bold text-charcoal mb-4">
                        Bölgesel hukuki bilgilendirme
                    </h2>
                    <p className="text-xs text-charcoal/45 mb-3">
                        Reklam niteliğinde değildir; ana sayfada listelenmez.
                    </p>
                    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {BOLGELER.map((b) => (
                            <li key={b.slug}>
                                <Link href={`/${b.slug}`} className="text-sm text-charcoal/70 hover:text-accent">
                                    {b.ilce} — bilgilendirme
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-lg font-heading font-bold text-charcoal mb-4">
                        Ders notları hub
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <li>
                            <Link href="/ders-notlari" className="text-sm text-charcoal/70 hover:text-accent">
                                Tüm hukuk fakülteleri
                            </Link>
                        </li>
                        {DIZINDEKI_FAKULTELER.map((u) => (
                            <li key={u.slug}>
                                <Link href={`/ders-notlari/${u.slug}`} className="text-sm text-charcoal/70 hover:text-accent">
                                    {u.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-lg font-heading font-bold text-charcoal mb-4">
                        Mevzuat kategorileri ({categories.length})
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[28rem] overflow-y-auto pr-2">
                        {categories.map((c) => (
                            <li key={c.slug}>
                                <Link href={`/kategori/${c.slug}`} className="text-sm text-charcoal/70 hover:text-accent">
                                    {c.name}
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
