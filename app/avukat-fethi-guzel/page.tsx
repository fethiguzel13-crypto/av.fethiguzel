import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Scale, MapPin, BookOpen, Gavel, Mail } from 'lucide-react'

const siteUrl = 'https://avfethiguzel.com'
const photoPath = '/images/av-fethi-guzel-van-ercis-avukat.jpg'
const photoAbs = `${siteUrl}${photoPath}`

export const metadata: Metadata = {
    title: 'Avukat Fethi Güzel | Van · Erciş Avukat ve Arabulucu',
    description:
        'Av. Fethi Güzel — Van ve Erciş merkezli avukat ve arabulucu. Mevzuat şerhi, dava vekilliği, aile, ceza, miras, iş ve ticaret hukuku. Çaldıran, Özalp, Muradiye, Patnos hizmet bölgesi.',
    keywords: [
        'Fethi Güzel',
        'Avukat Fethi Güzel',
        'Van avukat',
        'Erciş avukat',
        'Çaldıran avukat',
        'Özalp avukat',
        'Muradiye avukat',
        'Patnos avukat',
        'Van barosu avukat',
        'arabulucu Erciş',
    ].join(', '),
    alternates: { canonical: `${siteUrl}/avukat-fethi-guzel` },
    openGraph: {
        title: 'Av. Fethi Güzel | Van ve Erciş Avukat',
        description: 'Portre ve profil — Av. Fethi Güzel Hukuk Portalı.',
        url: `${siteUrl}/avukat-fethi-guzel`,
        type: 'profile',
        locale: 'tr_TR',
        images: [
            {
                url: photoAbs,
                width: 640,
                height: 640,
                alt: 'Av. Fethi Güzel — Van Erciş avukat portresi',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Av. Fethi Güzel',
        images: [photoAbs],
    },
}

const BOLGELER = [
    { ad: 'Van Avukat', href: '/van-avukat' },
    { ad: 'Erciş Avukat', href: '/ercis-avukat' },
    { ad: 'Çaldıran Avukat', href: '/caldiran-avukat' },
    { ad: 'Özalp Avukat', href: '/ozalp-avukat' },
    { ad: 'Muradiye Avukat', href: '/muradiye-avukat' },
    { ad: 'Patnos Avukat', href: '/patnos-avukat' },
]

export default function AvukatFethiGuzelPage() {
    const personLd = {
        '@context': 'https://schema.org',
        '@type': 'Attorney',
        name: 'Av. Fethi Güzel',
        alternateName: ['Fethi Güzel', 'Avukat Fethi Güzel'],
        image: photoAbs,
        url: `${siteUrl}/avukat-fethi-guzel`,
        jobTitle: 'Avukat & Arabulucu',
        description:
            'Van ve Erciş merkezli avukat; medeni, ceza, aile, miras, iş ve ticaret hukuku. Dijital mevzuat ve akademik şerh arşivi.',
        email: 'av.fethiguzel@hotmail.com',
        telephone: undefined,
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Vanyolu Mah. Karayusuf Bey Bulvarı Zenginler İş Hanı Kat 4 No 26',
            addressLocality: 'Erciş',
            addressRegion: 'Van',
            postalCode: '65400',
            addressCountry: 'TR',
        },
        areaServed: ['Van', 'Erciş', 'Çaldıran', 'Özalp', 'Muradiye', 'Patnos', 'Ağrı'].map((n) => ({
            '@type': 'City',
            name: n,
        })),
        sameAs: [siteUrl],
    }

    const imageLd = {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        contentUrl: photoAbs,
        url: photoAbs,
        name: 'Av. Fethi Güzel — Van Erciş avukat portresi',
        description:
            'Avukat Fethi Güzel portresi. Van ve Erciş avukat, arabulucu. Hukuk portalı kurucusu.',
        creditText: 'Av. Fethi Güzel',
        creator: { '@type': 'Person', name: 'Av. Fethi Güzel' },
        copyrightNotice: 'Av. Fethi Güzel',
        acquireLicensePage: `${siteUrl}/avukat-fethi-guzel`,
        license: `${siteUrl}/gizlilik`,
    }

    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(imageLd) }}
            />

            <main className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                    {/* Portre — Google Görseller için net, anlamlı bağlam */}
                    <figure className="lg:col-span-5">
                        <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-charcoal/10 shadow-lift bg-charcoal/5">
                            <Image
                                src={photoPath}
                                alt="Av. Fethi Güzel — Van ve Erciş avukat, arabulucu portresi"
                                title="Avukat Fethi Güzel | Van Erciş Avukat"
                                width={640}
                                height={640}
                                priority
                                className="object-cover w-full h-full"
                                sizes="(max-width: 1024px) 100vw, 40vw"
                            />
                        </div>
                        <figcaption className="mt-4 text-center text-sm text-charcoal/55">
                            <strong className="text-charcoal">Av. Fethi Güzel</strong>
                            <span className="block mt-1 text-xs">
                                Van · Erciş avukat ve arabulucu — hukuk portalı kurucusu
                            </span>
                        </figcaption>
                    </figure>

                    <div className="lg:col-span-7">
                        <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">
                            Profil · Avukat Fethi Güzel
                        </p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-charcoal leading-tight mb-5">
                            Av. Fethi Güzel
                        </h1>
                        <p className="text-lg text-charcoal/70 leading-relaxed mb-6 max-w-2xl">
                            Van ve Erciş merkezli avukat ve arabulucu. Dava vekilliği ve danışmanlığın
                            yanında; Türkiye&apos;nin kapsamlı dijital mevzuat ve akademik şerh arşivini
                            kamuya açık tutan hukuk portalının kurucusudur.
                        </p>

                        <ul className="space-y-3 mb-8 text-charcoal/70 text-sm sm:text-base">
                            <li className="flex gap-3">
                                <Gavel className="text-accent shrink-0 mt-0.5" size={18} />
                                <span>
                                    Ceza, aile, miras, iş, borçlar, ticaret, icra ve idare hukuku alanlarında
                                    müvekkil temsili
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <BookOpen className="text-accent shrink-0 mt-0.5" size={18} />
                                <span>
                                    7800+ kanun maddesi ve akademik şerh; TBK, TMK, TTK, TCK, HMK, İİK ve 40+
                                    kanun
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <MapPin className="text-accent shrink-0 mt-0.5" size={18} />
                                <span>
                                    Hizmet bölgesi: Van, Erciş, Çaldıran, Özalp, Muradiye, Patnos ve çevre
                                    ilçeler
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <Scale className="text-accent shrink-0 mt-0.5" size={18} />
                                <span>Arabuluculuk ve uyuşmazlık çözümünde yapılandırılmış süreç</span>
                            </li>
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-3 mb-10">
                            <a
                                href="mailto:av.fethiguzel@hotmail.com"
                                className="inline-flex items-center justify-center gap-2 bg-accent text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-accent/90"
                            >
                                <Mail size={16} /> E-posta ile iletişim
                            </a>
                            <Link
                                href="/mevzuat"
                                className="inline-flex items-center justify-center gap-2 bg-charcoal/5 text-charcoal px-6 py-3.5 rounded-full font-bold text-sm hover:bg-charcoal/10"
                            >
                                Mevzuat ve şerhler
                            </Link>
                        </div>

                        <div className="bg-white border border-charcoal/8 rounded-2xl p-5 sm:p-6">
                            <h2 className="font-heading font-bold text-charcoal mb-3 text-lg">
                                Ofis
                            </h2>
                            <p className="text-charcoal/60 text-sm leading-relaxed">
                                Vanyolu Mah. Karayusuf Bey Bulvarı, Zenginler İş Hanı Kat 4 No 26,
                                Erciş / Van. Randevu ile yüz yüze; talep halinde e-posta veya video
                                görüşmesi.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Yerel arama — aynı marka, ayrı URL */}
                <section className="mt-16 sm:mt-20">
                    <h2 className="text-2xl font-heading font-bold text-charcoal mb-3">
                        Hizmet bölgeleri
                    </h2>
                    <p className="text-charcoal/55 text-sm mb-6 max-w-2xl">
                        Aşağıdaki sayfalar aynı hukuk bürosuna aittir; her biri ilgili ilçe araması
                        için özelleştirilmiştir.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {BOLGELER.map((b) => (
                            <Link
                                key={b.href}
                                href={b.href}
                                className="bg-white border border-charcoal/8 rounded-xl px-4 py-4 text-sm font-bold text-charcoal hover:border-accent/40 hover:text-accent transition-colors"
                            >
                                {b.ad}
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="mt-14 prose prose-charcoal max-w-3xl">
                    <h2 className="text-xl font-heading font-bold !mb-3">
                        Neden Av. Fethi Güzel?
                    </h2>
                    <p className="text-charcoal/65 text-sm sm:text-base leading-relaxed">
                        Hukuki metinlerin kamuya açık, düzenli ve akademik dilde sunulması ile
                        bireysel dava ve danışmanlık süreçlerinin aynı standartta yürütülmesi,
                        büronun temel yaklaşımıdır. Van ve Erciş başta olmak üzere Doğu Anadolu
                        bölgesinde müvekkiller; boşanma, miras, ceza, iş ve gayrimenkul
                        uyuşmazlıklarında net bilgilendirme ve düzenli takip talep etmektedir.
                    </p>
                </section>
            </main>
            <Footer />
        </div>
    )
}
