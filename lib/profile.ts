/**
 * Single source of truth for Av. Fethi Güzel — credentials, regions, publications.
 * Used across SEO pages, schema, About, Footer. Advertising-ban safe: factual only.
 */

/** Production canonical host (bare domain redirects → www) */
export const SITE_URL = 'https://www.avfethiguzel.com';

export const PROFILE = {
    name: 'Av. Fethi Güzel',
    shortName: 'Fethi Güzel',
    alternateNames: ['Avukat Fethi Güzel', 'Fethi Güzel', 'Av. Fethi Güzel'],
    jobTitle: 'Avukat & Arabulucu',
    email: 'fethiguzel@hotmail.com',
    /**
     * WhatsApp iş hattı — rakamları güncelleyin (ülke kodu + numara, + yok).
     * Boş bırakılırsa sitede e-posta CTA kullanılır.
     */
    whatsapp: '',
    /** Factual academic path — özel hukuk / private law doctoral work */
    academic: {
        headline: 'Özel hukuk alanında doktora çalışmaları',
        detail:
            'Özel hukuk (medeni hukuk, borçlar, ticaret ve usul hukuku ekseninde) alanında doktora çalışmalarını yürüten Av. Fethi Güzel; akademik araştırma ile dava pratiğini aynı standartta birleştirir.',
        fields: [
            'Medeni hukuk',
            'Borçlar hukuku',
            'Ticaret hukuku',
            'Medeni usul hukuku',
            'İcra ve iflas hukuku',
        ],
    },
    languages: [
        { code: 'tr', label: 'Türkçe', level: 'Ana dil' },
        { code: 'en', label: 'English', level: 'İyi düzeyde / Professional working proficiency' },
    ],
    office: {
        street: 'Van Yolu Mah. Karayusuf Bey Bulvarı Zenginler İş Hanı Kat 5 Daire 33',
        streetLines: [
            'Van Yolu Mah. Karayusuf Bey Bulvarı',
            'Zenginler İş Hanı Kat 5 Daire 33',
        ],
        /** Bina girişi — harita pini bu işletmelere kilitlenir */
        landmark: 'Girişte ETSA Et Lokantası ve Manolya Pastanesi',
        locality: 'Erciş',
        region: 'Van',
        postalCode: '65400',
        country: 'TR',
        latitude: 39.02259,
        longitude: 43.3742,
        mapQuery:
            'ETSA+Et+Lokantas%C4%B1+Zenginler+%C4%B0%C5%9F+Han%C4%B1+Van+Yolu+Erci%C5%9F',
        /** Arama tabanlı embed — sabit 39.02/43.35 pini binayı kaçırıyordu */
        mapEmbed:
            'https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1sETSA+Et+Lokantas%C4%B1+Zenginler+%C4%B0%C5%9F+Han%C4%B1+Erci%C5%9F!3m1!1str!5m1!1str',
    },
    photo: '/images/av-fethi-guzel-van-ercis-avukat.jpg',
    ogImage: '/images/av-fethi-guzel-og.jpg',
    social: {
        instagram: {
            handle: 'av.fethiguzel',
            url: 'https://www.instagram.com/av.fethiguzel/',
            label: 'Instagram',
        },
        twitter: {
            handle: 'avfethiguzel',
            url: 'https://x.com/avfethiguzel',
            label: 'X (Twitter)',
        },
    },
    book: {
        title:
            'Medeni Usul Hukukunda Ses ve Görüntünün Nakledilmesi Yoluyla Duruşma İcrası (e-duruşma)',
        shortTitle: 'e-duruşma',
        publisher: 'Seçkin Yayıncılık',
        url: 'https://www.seckin.com.tr/kitap/614840900',
        summary:
            'Medeni usul hukukunda e-duruşma kurumunu teorik ve pratik boyutlarıyla ele alan monografik eser. Seçkin Yayıncılık ve hukuk kitabevlerinde.',
    },
    stats: {
        kanun: '45+',
        madde: '7.800+',
        arac: '30',
        tecrube: '15+',
    },
    /** Bilgilendirme odaklı hizmet alanları — reklam vaadi yok */
    practiceAreas: [
        'Ceza hukuku',
        'Aile hukuku',
        'Miras hukuku',
        'Gayrimenkul hukuku',
        'İş hukuku',
        'Borçlar ve ticaret hukuku',
        'İcra ve iflas hukuku',
        'İdare ve vergi hukuku',
        'Arabuluculuk',
    ],
} as const;

/**
 * Bölgesel hukuki bilgilendirme dizinleri.
 * Etiketlerde "X avukat" kalıbı yok (reklam yasağı). Ana sayfada listelenmez.
 */
export type Bolge = {
    ad: string;
    ilce: string;
    il: string;
    slug: string;
    /** true = ofis bu yerleşimde */
    merkezOfis?: boolean;
    /** Uzaktan / seyahat ile dosya takibi bağlamı */
    uzaktan?: boolean;
};

export const BOLGELER: Bolge[] = [
    { ad: 'Erciş hukuki bilgilendirme', ilce: 'Erciş', il: 'Van', slug: 'ercis-avukat', merkezOfis: true },
    { ad: 'Van hukuki bilgilendirme', ilce: 'Van', il: 'Van', slug: 'van-avukat' },
    { ad: 'Çaldıran hukuki bilgilendirme', ilce: 'Çaldıran', il: 'Van', slug: 'caldiran-avukat' },
    { ad: 'Özalp hukuki bilgilendirme', ilce: 'Özalp', il: 'Van', slug: 'ozalp-avukat' },
    { ad: 'Muradiye hukuki bilgilendirme', ilce: 'Muradiye', il: 'Van', slug: 'muradiye-avukat' },
    { ad: 'Patnos hukuki bilgilendirme', ilce: 'Patnos', il: 'Ağrı', slug: 'patnos-avukat' },
    { ad: 'Ağrı hukuki bilgilendirme', ilce: 'Ağrı', il: 'Ağrı', slug: 'agri-avukat' },
    { ad: 'Tatvan hukuki bilgilendirme', ilce: 'Tatvan', il: 'Bitlis', slug: 'tatvan-avukat' },
    { ad: 'Bitlis hukuki bilgilendirme', ilce: 'Bitlis', il: 'Bitlis', slug: 'bitlis-avukat' },
    { ad: 'Adilcevaz hukuki bilgilendirme', ilce: 'Adilcevaz', il: 'Bitlis', slug: 'adilcevaz-avukat' },
    { ad: 'Ahlat hukuki bilgilendirme', ilce: 'Ahlat', il: 'Bitlis', slug: 'ahlat-avukat' },
    { ad: 'Ankara hukuki bilgilendirme', ilce: 'Ankara', il: 'Ankara', slug: 'ankara-avukat', uzaktan: true },
];

export function bolgeBySlug(slug: string): Bolge | undefined {
    return BOLGELER.find((b) => b.slug === slug);
}

/** Schema.org sameAs + footer — tüm sayfalarda tutarlı profil bağlantıları */
export const SOCIAL_SAME_AS = [
    SITE_URL,
    `${SITE_URL}/avukat-fethi-guzel`,
    `${SITE_URL}/akademik-profil`,
    `${SITE_URL}/eserlerim`,
    PROFILE.book.url,
    PROFILE.social.instagram.url,
    PROFILE.social.twitter.url,
    'https://play.google.com/store/apps/details?id=com.avfethiguzel.hukuk',
] as const;

export const CREDENTIAL_BULLETS = [
    `${PROFILE.academic.headline} — medeni, borçlar, ticaret ve usul hukuku ekseninde akademik araştırma.`,
    `Yayımlanmış eser: “${PROFILE.book.shortTitle}” monografisi (${PROFILE.book.publisher}).`,
    'İyi düzeyde İngilizce; yabancılar, uluslararası belgeler ve İngilizce yazışma gerektiren dosyalarda iletişim imkânı.',
    `${PROFILE.stats.madde} kanun maddesi ve akademik şerh içeren açık erişimli hukuk portalı kurucusu.`,
    `Merkez ofis: Erciş / Van; Doğu Anadolu ve ihtiyaç halinde diğer illerde dosya takibi.`,
] as const;
