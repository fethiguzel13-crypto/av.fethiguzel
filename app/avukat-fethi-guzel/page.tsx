import { jsonLdHtml } from "@/lib/json-ld";
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from "@/components/SiteLink";
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Kirinti from '@/components/Kirinti';
import { Scale, MapPin, BookOpen, Gavel, Mail, GraduationCap, Globe2, ExternalLink } from 'lucide-react'
import { PROFILE, BOLGELER, SITE_URL, SOCIAL_SAME_AS } from '@/lib/profile'
import { YAZAR, yazarRef } from '@/lib/yazar';
import { siteSayilari, tr, yaklasik } from '@/lib/site-stats';

const photoPath = PROFILE.photo
const photoAbs = `${SITE_URL}${photoPath}`

export const metadata: Metadata = {
    title: 'Avukat Fethi Güzel | Erciş / Van · Özel Hukuk · e-Duruşma',
    description:
        'Av. Fethi Güzel — Van ili Erciş ilçesinde avukat ve arabulucu. Özel hukuk doktora çalışmaları, yayımlanmış e-duruşma kitabı, iyi düzeyde İngilizce. Mevzuat şerhi, dava vekilliği, arabuluculuk.',
    keywords: [
        'Fethi Güzel',
        'Avukat Fethi Güzel',
        'Van Erciş',
        'özel hukuk doktora',
        'e-duruşma kitabı',
        'arabulucu',
        'hukuk portalı',
    ].join(', '),
    alternates: { canonical: `${SITE_URL}/avukat-fethi-guzel` },
    openGraph: {
        title: 'Av. Fethi Güzel | Akademik Profil · e-Duruşma',
        description:
            'Özel hukuk doktora çalışmaları · e-duruşma monografisi · İngilizce · dijital hukuk portalı.',
        url: `${SITE_URL}/avukat-fethi-guzel`,
        type: 'profile',
        locale: 'tr_TR',
        images: [
            {
                url: photoAbs,
                width: 640,
                height: 640,
                alt: 'Av. Fethi Güzel portresi',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: YAZAR.ad,
        images: [photoAbs],
        site: '@avfethiguzel',
        creator: '@avfethiguzel',
    },
}

export default function AvukatFethiGuzelPage() {
    const personLd = {
        '@context': 'https://schema.org',
        '@type': 'Attorney',
        name: YAZAR.ad,
        alternateName: [...PROFILE.alternateNames],
        image: photoAbs,
        url: `${SITE_URL}/avukat-fethi-guzel`,
        jobTitle: PROFILE.jobTitle,
        description:
            'Van ve Erciş merkezli avukat; özel hukuk doktora çalışmaları; e-duruşma monografisi yazarı; iyi düzeyde İngilizce.',
        email: PROFILE.email,
        knowsLanguage: ['tr', 'en'],
        address: {
            '@type': 'PostalAddress',
            streetAddress: PROFILE.office.street,
            addressLocality: PROFILE.office.locality,
            addressRegion: PROFILE.office.region,
            postalCode: PROFILE.office.postalCode,
            addressCountry: 'TR',
        },
        areaServed: BOLGELER.map((b) => ({
            '@type': 'City',
            name: b.ilce,
        })),
        knowsAbout: [
            ...PROFILE.academic.fields,
            'Arabuluculuk',
            'e-duruşma',
            ...PROFILE.practiceAreas,
        ],
        sameAs: [...SOCIAL_SAME_AS],
    }

    const bookLd = {
        '@context': 'https://schema.org',
        '@type': 'Book',
        name: YAZAR.eser.ad,
        author: yazarRef(),
        publisher: { '@type': 'Organization', name: YAZAR.eser.yayinevi },
        url: YAZAR.eser.url,
        inLanguage: 'tr',
    }

    const imageLd = {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        contentUrl: photoAbs,
        url: photoAbs,
        name: 'Av. Fethi Güzel portresi',
        description:
            'Avukat Fethi Güzel portresi. Özel hukuk doktora çalışmaları, e-duruşma yazarı.',
        creditText: YAZAR.ad,
        creator: yazarRef(),
    }

    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(personLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(bookLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(imageLd) }} />

            <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-6xl mx-auto">
                <Kirinti
                    ogeler={[
                        { ad: YAZAR.ad, yol: YAZAR.sayfa },
                    ]}
                />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                    <figure className="lg:col-span-5">
                        <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-charcoal/10 shadow-lift bg-charcoal/5">
                            <Image
                                src={photoPath}
                                alt="Av. Fethi Güzel — avukat, arabulucu, e-duruşma yazarı"
                                title="Avukat Fethi Güzel | Özel hukuk · Van Erciş"
                                width={640}
                                height={640}
                                priority
                                className="object-cover w-full h-full"
                                sizes="(max-width: 1024px) 100vw, 40vw"
                            />
                        </div>
                        <figcaption className="mt-4 text-center text-sm text-ink-muted">
                            <strong className="text-charcoal">{YAZAR.ad}</strong>
                            <span className="block mt-1 text-xs">
                                Avukat & arabulucu · özel hukuk doktora çalışmaları · e-duruşma yazarı
                            </span>
                        </figcaption>
                    </figure>

                    <div className="lg:col-span-7">
                        <p className="text-accent-ink font-mono text-[10px] tracking-[0.22em] uppercase mb-3">
                            Yazar ve avukat
                        </p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-charcoal leading-tight mb-5">
                            Av. Fethi Güzel
                        </h1>
                        <p className="text-lg text-charcoal/70 leading-relaxed mb-6 max-w-2xl">
                            Van ve Erciş merkezli avukat ve arabulucu. Özel hukuk alanında doktora çalışmaları
                            yürütmekte; medeni usul hukukunda yayımlanmış e-duruşma monografisinin yazarıdır.
                            İyi düzeyde İngilizce konuşur ve yazar. Dijital mevzuat ve akademik şerh arşivinin
                            kurucusudur.
                        </p>

                        <ul className="space-y-3 mb-8 text-charcoal/70 text-sm sm:text-base">
                            <li className="flex gap-3">
                                <GraduationCap className="text-accent shrink-0 mt-0.5" size={18} />
                                <span>
                                    <strong className="text-charcoal">Doktora çalışmaları:</strong> özel hukuk
                                    (medeni, borçlar, ticaret, usul)
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <BookOpen className="text-accent shrink-0 mt-0.5" size={18} />
                                <span>
                                    <strong className="text-charcoal">Kitap:</strong> {YAZAR.eser.kisaAd} —{' '}
                                    {YAZAR.eser.yayinevi}
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <Globe2 className="text-accent shrink-0 mt-0.5" size={18} />
                                <span>
                                    <strong className="text-charcoal">Dil:</strong> Türkçe (ana dil), İngilizce (iyi düzey)
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <Gavel className="text-accent shrink-0 mt-0.5" size={18} />
                                <span>
                                    Ceza, aile, miras, iş, borçlar, ticaret, icra ve idare hukuku alanlarında müvekkil
                                    temsili
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <Scale className="text-accent shrink-0 mt-0.5" size={18} />
                                <span>
                                    {tr(siteSayilari().kanun)} kanunun resmî metni, {yaklasik(siteSayilari().serh, 100)} maddede akademik şerh; açık erişimli hukuk portalı
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <MapPin className="text-accent shrink-0 mt-0.5" size={18} />
                                <span>
                                    Çalışma odağı Van–Erciş ve çevre; uzaktan Ankara. Mekân denemeleri:{' '}
                                    <Link href="/bolge-yazi" className="text-accent-ink font-semibold hover:underline">
                                        bölge yazıları
                                    </Link>
                                    .
                                </span>
                            </li>
                        </ul>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-10">
                            <a
                                href={`mailto:${PROFILE.email}`}
                                className="inline-flex items-center justify-center gap-2 bg-accent-solid text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-accent-ink"
                            >
                                <Mail size={16} /> E-posta ile iletişim
                            </a>
                            <a
                                href={PROFILE.social.instagram.url}
                                target="_blank"
                                rel="noopener noreferrer me"
                                className="inline-flex items-center justify-center gap-2 bg-charcoal/5 text-charcoal px-6 py-3.5 rounded-full font-bold text-sm hover:bg-charcoal/10"
                            >
                                Instagram
                            </a>
                            <a
                                href={PROFILE.social.twitter.url}
                                target="_blank"
                                rel="noopener noreferrer me"
                                className="inline-flex items-center justify-center gap-2 bg-charcoal/5 text-charcoal px-6 py-3.5 rounded-full font-bold text-sm hover:bg-charcoal/10"
                            >
                                X / Twitter
                            </a>
                            <Link
                                href="/akademik-profil"
                                className="inline-flex items-center justify-center gap-2 bg-charcoal text-cream px-6 py-3.5 rounded-full font-bold text-sm hover:bg-charcoal/90"
                            >
                                Akademik profil
                            </Link>
                            <Link
                                href="/eserlerim"
                                className="inline-flex items-center justify-center gap-2 bg-charcoal/5 text-charcoal px-6 py-3.5 rounded-full font-bold text-sm hover:bg-charcoal/10"
                            >
                                Kitap & eserler
                            </Link>
                            <Link
                                href="/english-speaking-lawyer"
                                className="inline-flex items-center justify-center gap-2 border border-charcoal/15 text-charcoal px-6 py-3.5 rounded-full font-bold text-sm hover:border-accent"
                            >
                                English
                            </Link>
                        </div>

                        <div className="bg-white border border-charcoal/[0.08] rounded-2xl p-5 sm:p-6 mb-6">
                            <h2 className="font-heading font-bold text-charcoal mb-3 text-lg">Ofis</h2>
                            <p className="text-ink-muted text-sm leading-relaxed">
                                {PROFILE.office.street}, {PROFILE.office.locality} / {PROFILE.office.region}.
                                {PROFILE.office.landmark}. Randevu ile yüz yüze; talep halinde e-posta veya video görüşmesi.
                            </p>
                        </div>

                        <div className="bg-white border border-charcoal/[0.08] rounded-2xl p-5 sm:p-6">
                            <h2 className="font-heading font-bold text-charcoal mb-3 text-lg">Yayımlanmış eser</h2>
                            <p className="text-charcoal/70 text-sm leading-relaxed mb-3">{YAZAR.eser.ad}</p>
                            <a
                                href={YAZAR.eser.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-accent-ink text-sm font-bold hover:underline"
                            >
                                {YAZAR.eser.yayinevi} <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                </div>

                {/*
                    Sitedeki çalışmalar (G16): Burada ana sayfanın kutucuk sırası duruyor ve hemen üstteki
                    listeyi yineliyordu. Yazarın sitedeki asıl külliyatına giden yol yoktu; bölüm o yolu verir.
                */}
                <section className="mt-12" aria-labelledby="calismalar-baslik">
                    <h2 id="calismalar-baslik" className="text-2xl font-heading font-bold text-charcoal mb-5">
                        Sitedeki çalışmalar
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        {[
                            {
                                href: '/mevzuat',
                                baslik: 'Kanun şerhleri',
                                metin: `${yaklasik(siteSayilari().serh, 100)} maddede akademik şerh, ${tr(siteSayilari().kanun)} kanunun resmî metniyle`,
                            },
                            { href: '/makaleler', baslik: 'Makaleler', metin: 'Akademik makaleler, tebliğler ve hukuki değerlendirmeler' },
                            { href: '/eserlerim', baslik: 'Kitap', metin: `${YAZAR.eser.kisaAd} — ${YAZAR.eser.yayinevi}` },
                        ].map((c) => (
                            <li key={c.href}>
                                <Link href={c.href} className="block h-full surface-card-hover p-5">
                                    <span className="block font-heading font-bold text-charcoal">{c.baslik}</span>
                                    <span className="block text-ink-muted text-sm mt-1 leading-snug">{c.metin}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mt-14 sm:mt-16">
                    <h2 className="text-2xl font-heading font-bold text-charcoal mb-3">
                        Bölgesel hukuki bilgilendirme
                    </h2>
                    <p className="text-ink-muted text-sm mb-6 max-w-2xl">
                        Yerleşim adıyla ilişkilendirilmiş genel hukuki rehberler — reklam veya
                        &quot;X avukat&quot; metni değildir; ana sayfada listelenmez, arama ve sitemap
                        üzerinden keşfedilir.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {BOLGELER.map((b) => (
                            <Link
                                key={b.slug}
                                href={`/${b.slug}`}
                                className="bg-white border border-charcoal/[0.08] rounded-xl px-4 py-4 text-sm font-semibold text-charcoal hover:border-accent/40 hover:text-accent transition-colors"
                            >
                                {b.ilce}
                                <span className="block text-[11px] font-normal text-ink-muted mt-1">
                                    bilgilendirme
                                </span>
                            </Link>
                        ))}
                    </div>
                    <p className="mt-4 text-xs text-ink-muted">
                        Tüm vatandaş rehberleri:{' '}
                        <Link href="/bilgi" className="text-accent-ink font-semibold hover:underline">
                            /bilgi
                        </Link>
                    </p>
                </section>

                <section className="mt-14 max-w-3xl">
                    <h2 className="text-xl font-heading font-bold text-charcoal mb-3">
                        Bilgilendirme yaklaşımı
                    </h2>
                    {/* Uyum beyanı ve sayfanın üstündeki listeyi yineleyen madde listesi kaldırıldı (G16). */}
                    <p className="text-charcoal/65 text-sm sm:text-base leading-relaxed">
                        Hukuki metinlerin kamuya açık, düzenli ve akademik dilde sunulması ile bireysel dava ve
                        danışmanlık süreçlerinin aynı standartta yürütülmesi büronun temel yaklaşımıdır.
                    </p>
                </section>
            </main>
            <Footer />
        </div>
    )
}
