/**
 * Single source of truth for Av. Fethi Güzel — credentials, regions, publications.
 * Used across SEO pages, schema, About, Footer. Advertising-ban safe: factual only.
 */

export const SITE_URL = 'https://avfethiguzel.com';

export const PROFILE = {
    name: 'Av. Fethi Güzel',
    shortName: 'Fethi Güzel',
    alternateNames: ['Avukat Fethi Güzel', 'Fethi Güzel', 'Av. Fethi Güzel'],
    jobTitle: 'Avukat & Arabulucu',
    email: 'av.fethiguzel@hotmail.com',
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
        street: 'Vanyolu Mah. Karayusuf Bey Bulvarı Zenginler İş Hanı Kat 4 No 26',
        locality: 'Erciş',
        region: 'Van',
        postalCode: '65400',
        country: 'TR',
        mapQuery:
            'Vanyolu+Mah.+Karayusuf+Bey+Bulvar%C4%B1+Zenginler+I%C5%9F+Han%C4%B1+Erci%C5%9F+Van',
    },
    photo: '/images/av-fethi-guzel-van-ercis-avukat.jpg',
    ogImage: '/images/av-fethi-guzel-og.jpg',
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

/** Hizmet / erişim bölgeleri — yerel SEO slug'ları */
export type Bolge = {
    ad: string;
    ilce: string;
    il: string;
    slug: string;
    /** true = ofis bu yerleşimde */
    merkezOfis?: boolean;
    /** Uzaktan / seyahat ile dosya takibi vurgusu */
    uzaktan?: boolean;
};

export const BOLGELER: Bolge[] = [
    { ad: 'Erciş Avukat', ilce: 'Erciş', il: 'Van', slug: 'ercis-avukat', merkezOfis: true },
    { ad: 'Van Avukat', ilce: 'Van', il: 'Van', slug: 'van-avukat' },
    { ad: 'Çaldıran Avukat', ilce: 'Çaldıran', il: 'Van', slug: 'caldiran-avukat' },
    { ad: 'Özalp Avukat', ilce: 'Özalp', il: 'Van', slug: 'ozalp-avukat' },
    { ad: 'Muradiye Avukat', ilce: 'Muradiye', il: 'Van', slug: 'muradiye-avukat' },
    { ad: 'Patnos Avukat', ilce: 'Patnos', il: 'Ağrı', slug: 'patnos-avukat' },
    { ad: 'Ağrı Avukat', ilce: 'Ağrı', il: 'Ağrı', slug: 'agri-avukat' },
    { ad: 'Tatvan Avukat', ilce: 'Tatvan', il: 'Bitlis', slug: 'tatvan-avukat' },
    { ad: 'Bitlis Avukat', ilce: 'Bitlis', il: 'Bitlis', slug: 'bitlis-avukat' },
    { ad: 'Adilcevaz Avukat', ilce: 'Adilcevaz', il: 'Bitlis', slug: 'adilcevaz-avukat' },
    { ad: 'Ahlat Avukat', ilce: 'Ahlat', il: 'Bitlis', slug: 'ahlat-avukat' },
    { ad: 'Ankara Avukat', ilce: 'Ankara', il: 'Ankara', slug: 'ankara-avukat', uzaktan: true },
];

export function bolgeBySlug(slug: string): Bolge | undefined {
    return BOLGELER.find((b) => b.slug === slug);
}

export const CREDENTIAL_BULLETS = [
    `${PROFILE.academic.headline} — medeni, borçlar, ticaret ve usul hukuku ekseninde akademik araştırma.`,
    `Yayımlanmış eser: “${PROFILE.book.shortTitle}” monografisi (${PROFILE.book.publisher}).`,
    'İyi düzeyde İngilizce; yabancılar, uluslararası belgeler ve İngilizce yazışma gerektiren dosyalarda iletişim imkânı.',
    `${PROFILE.stats.madde} kanun maddesi ve akademik şerh içeren açık erişimli hukuk portalı kurucusu.`,
    `Merkez ofis: Erciş / Van; Doğu Anadolu ve ihtiyaç halinde diğer illerde dosya takibi.`,
] as const;
