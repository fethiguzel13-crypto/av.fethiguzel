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
  eser: {
    ad: PROFILE.book.title,
    kisaAd: PROFILE.book.shortTitle,
    yayinevi: PROFILE.book.publisher,
    url: PROFILE.book.url,
    ozet: PROFILE.book.summary,
  },
  diller: PROFILE.languages.map((l) => l.code),
} as const;

/** Yayımlanmış kitaplar (yayın sırasıyla). */
export const ESERLER = PROFILE.books;
export type Eser = (typeof ESERLER)[number];

/** Kitap sayfası ve profil sayfaları için Book düğümü; künye alanları yalnız biliniyorsa yazılır. */
export function kitapLd(k: Eser) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book' as const,
    name: k.title,
    ...('subtitle' in k ? { alternativeHeadline: k.subtitle } : {}),
    author: yazarRef(),
    publisher: { '@type': 'Organization' as const, name: k.publisher },
    url: k.url,
    inLanguage: 'tr',
    ...('isbn' in k
      ? { isbn: k.isbn, numberOfPages: k.numberOfPages, datePublished: k.datePublished, bookEdition: '1', bookFormat: 'https://schema.org/Paperback' }
      : {}),
  };
}

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
      'Erciş / Van merkezli avukat ve arabulucu; özel hukuk doktora çalışmaları; e-duruşma ve arsa payı karşılığı inşaat sözleşmesi monografilerinin yazarı; iyi düzeyde İngilizce.',
    image: {
      '@type': 'ImageObject',
      url: `${SITE_URL}${PROFILE.photo}`,
      contentUrl: `${SITE_URL}${PROFILE.photo}`,
      caption: `${PROFILE.name} — avukat, Erciş / Van`,
    },
    email: PROFILE.email,
    telephone: PROFILE.phone.e164,
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

/* ── Yazar kutusu: içerik sayfalarının altındaki yazar satırı, son güncelleme ve kaynaklar ──────────────── */

export type Kaynak = { ad: string; url?: string };

const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

/** `2026-09-30` ya da tam ISO zaman → `{ iso: '2026-09-30', metin: '30 Eylül 2026' }`; okunamazsa null. */
export function tarihVerisi(deger?: string | null): { iso: string; metin: string } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(deger ?? '').trim());
  if (!m) return null;
  const [yil, ay, gun] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(Date.UTC(yil, ay - 1, gun));
  if (d.getUTCMonth() !== ay - 1 || d.getUTCDate() !== gun) return null;
  return { iso: m[0], metin: `${gun} ${AYLAR[ay - 1]} ${yil}` };
}

export type YazarKutusuGirdi = { guncelleme?: string | null; kaynaklar?: readonly Kaynak[] };

/** React bileşeni ve madde sayfasının HTML'i aynı veriyi çizer. Reklam dili yok: ad, akademik kimlik, eser. */
export function yazarKutusuVerisi({ guncelleme, kaynaklar }: YazarKutusuGirdi = {}) {
  return {
    ad: YAZAR.ad,
    sayfa: YAZAR.sayfa,
    kimlik: `${YAZAR.akademik} · ${ESERLER.map((k) => `“${k.shortTitle}”`).join(' ve ')} monografileri`,
    guncelleme: tarihVerisi(guncelleme),
    // Bağlantı yalnız http(s) ya da site içi yol; `javascript:`, `//başka-alan` gibi adresler düz metne iner.
    kaynaklar: (kaynaklar ?? [])
      .filter((k) => k.ad?.trim())
      .map((k) => (k.url && /^(https?:\/\/|\/(?!\/))/i.test(k.url) ? k : { ad: k.ad })),
  };
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Rota işleyicisinde düz HTML üreten madde sayfaları için (stil sayfanın kendi CSS'inde). */
export function yazarKutusuHtml(girdi: YazarKutusuGirdi = {}) {
  const v = yazarKutusuVerisi(girdi);
  const kaynak = (k: Kaynak) => {
    if (!k.url) return `<li>${esc(k.ad)}</li>`;
    const url = k.url.startsWith('/') ? `${SITE_URL}${k.url}` : k.url;
    const dis = k.url.startsWith('/') ? '' : ' target="_blank" rel="noopener noreferrer"';
    return `<li><a href="${esc(url)}"${dis}>${esc(k.ad)}</a></li>`;
  };
  return [
    '<aside class="yazar" aria-label="Yazar ve kaynak bilgisi">',
    '<p class="yazar-baslik">Yazar</p>',
    `<p><strong><a href="${YAZAR_SAYFA}">${esc(v.ad)}</a></strong> · ${esc(v.kimlik)}</p>`,
    v.guncelleme ? `<p class="muted">Son güncelleme: <time datetime="${v.guncelleme.iso}">${v.guncelleme.metin}</time></p>` : '',
    v.kaynaklar.length ? `<p class="yazar-baslik">Kaynaklar</p><ul>${v.kaynaklar.map(kaynak).join('')}</ul>` : '',
    '</aside>',
  ].join('');
}
