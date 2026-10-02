/**
 * Yazar kimliği — JSON-LD ve yazar satırları için tek kaynak (Aylık plan G09).
 *
 * Veriler `lib/profile.ts`'ten türetilir; burada yeni kimlik bilgisi tanımlanmaz. İçerik sayfaları yazarı
 * `yazarRef()` ile anar: kök yerleşimdeki tam düğüme `@id` ile bağlanır, aynı kişi ayrı varlık olarak görünmez.
 * `jobTitle` ve `areaServed` reklam yasağı kararını bekler (raporlar/kullaniciya-sorular.md 11–12).
 */
import { BOLGELER, PROFILE, SITE_URL, SOCIAL_SAME_AS } from './profile';

export const YAZAR_ID = `${SITE_URL}/#person`;
export const YAZAR_SAYFA = `${SITE_URL}/avukat-fethi-guzel`;

export const YAZAR = {
  ad: PROFILE.name,
  unvan: 'Avukat',
  sayfa: '/avukat-fethi-guzel',
  akademik: PROFILE.academic.headline,
  eser: { ad: PROFILE.book.title, yayinevi: PROFILE.book.publisher, url: PROFILE.book.url },
  diller: PROFILE.languages.map((l) => l.code),
} as const;

/** Makale, şerh, rehber, ders notu, karar ve kavram sayfalarındaki `author` alanı. */
export function yazarRef() {
  return { '@type': 'Person' as const, '@id': YAZAR_ID, name: PROFILE.name, url: YAZAR_SAYFA };
}

/** Kök yerleşimde her sayfaya basılan tam Person düğümü. */
export function yazarPersonDugumu() {
  return {
    '@context': 'https://schema.org',
    ...yazarRef(),
    alternateName: PROFILE.alternateNames.filter((ad) => ad !== PROFILE.name),
    jobTitle: PROFILE.jobTitle,
    description:
      'Van ve Erciş merkezli avukat; özel hukuk doktora çalışmaları; e-duruşma monografisi yazarı; iyi düzeyde İngilizce. Medeni, borçlar, ticaret, ceza ve usul hukuku.',
    image: `${SITE_URL}${PROFILE.photo}`,
    email: PROFILE.email,
    knowsLanguage: [...YAZAR.diller],
    address: {
      '@type': 'PostalAddress',
      streetAddress: PROFILE.office.street,
      addressLocality: PROFILE.office.locality,
      addressRegion: PROFILE.office.region,
      postalCode: PROFILE.office.postalCode,
      addressCountry: 'TR',
    },
    areaServed: BOLGELER.map((b) => ({ '@type': 'City', name: b.ilce })),
    knowsAbout: [
      'Özel hukuk',
      'Doktora çalışmaları',
      'e-duruşma',
      'Türk Borçlar Kanunu',
      'Türk Medeni Kanunu',
      'Türk Ticaret Kanunu',
      'Türk Ceza Kanunu',
      'İş hukuku',
      'Arabuluculuk',
      'İcra ve iflas',
      'Aile hukuku',
      'Miras hukuku',
    ],
    sameAs: [...SOCIAL_SAME_AS],
    worksFor: { '@id': `${SITE_URL}/#organization` },
  };
}
