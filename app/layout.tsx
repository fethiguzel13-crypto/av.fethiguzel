import { jsonLdHtml } from "@/lib/json-ld";
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Outfit, Cormorant_Garamond, IBM_Plex_Mono } from 'next/font/google'
import SkipLink from '@/components/SkipLink'
import AppNativeChrome from '@/components/AppNativeChrome'
import GalaxyChrome from '@/components/GalaxyChrome'
import { PROFILE } from '@/lib/profile'
import './globals.css'
import { siteSayilari, tr, yaklasik } from '@/lib/site-stats';
import { yazarPersonDugumu } from '@/lib/yazar'
import { paylasimMeta } from '@/lib/paylasim'

/* Külliyat sayıları tek kaynaktan; SEO metni gövdeyle aynı rakamı söylesin. */
const N = siteSayilari();

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
})
const outfit = Outfit({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-heading',
  display: 'swap',
})
/* Süs ailesi ilk ekranda gerekmez; önden yüklenmez, kullanıldığı anda gelir (G13). Eş aralıklı aile önden yüklenir:
   ilk ekrandaki etiket satırları yedek yazı tipiyle farklı kırılıyor, geç gelince sayfa kayıyordu (ders notu CLS 0,137). */
const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-drama',
  display: 'swap',
  preload: false,
})
const ibmPlex = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

const siteUrl = 'https://www.avfethiguzel.com'

export const viewport: Viewport = {
  // Site yalnız açık temadadır (G15, soru 21); koyu sistem temasında da çubuk sayfayla aynı krem kalır.
  themeColor: '#F2F0E9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Av. Fethi Güzel | Mevzuat, Akademik Şerh & Hukuki Hesaplama',
    template: '%s | Av. Fethi Güzel',
  },
  description:
    `Kanun maddesi arama: ${yaklasik(N.madde, 100)} madde + akademik şerh, ${yaklasik(N.rehber, 10)} vatandaş rehberi, günlük içtihat, 33 hesaplama aracı. TBK, TMK, TTK, TCK, HMK, İİK. Ücretsiz hukuk kütüphanesi.`,
  keywords: [
    'Fethi Güzel',
    'Avukat Fethi Güzel',
    'kanun maddesi',
    'kanun maddesi arama',
    'mevzuat arama',
    'avukat Fethi Güzel',
    'akademik şerh',
    'mevzuat bankası',
    'TBK şerh',
    'TMK şerh',
    'TTK şerh',
    'TCK madde',
    'HMK madde',
    'İİK madde',
    'kıdem tazminatı hesaplama',
    'faiz hesaplama',
    'miras payı hesaplama',
    'Yargıtay kararları',
    'günlük içtihat',
    'arabuluculuk',
    'vatandaş rehberi',
    'ücretsiz mevzuat',
    'hukuk portalı',
    'Van Erciş',
    'Av. Fethi Güzel Erciş',
  ],
  authors: [{ name: 'Av. Fethi Güzel', url: siteUrl }],
  creator: 'Av. Fethi Güzel',
  publisher: 'Av. Fethi Güzel Hukuk Portalı',
  category: 'law',
  applicationName: 'Av. Fethi Güzel Hukuk Portalı',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Kendi openGraph'ını vermeyen sayfalar bunu miras alır; verenler `paylasimMeta` ile tam alan üretir (G20).
  ...paylasimMeta({
    baslik: 'Av. Fethi Güzel | Mevzuat, Akademik Şerh & Hukuki Hesaplama',
    aciklama: `${yaklasik(N.madde, 100)} madde metni, günlük içtihat ve hukuki hesaplama araçları. Açık erişimli dijital hukuk arşivi.`,
    adres: siteUrl,
    tur: 'site',
  }),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // `alternates` burada TANIMLANMAZ: metadata yüzeysel birleştiği için kendi alternates'i olmayan her alt
  // sayfaya miras kalıyor ve o sayfalar ana sayfayı canonical gösteriyordu (G06b). Her sayfa kendisininkini verir.
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/manifest.webmanifest',
  other: {
    'ai-content-declaration': 'human-curated legal library with academic commentaries',
  },
  verification: {
    // Google Search Console doğrulama kodunu buraya ekleyin:
    // google: 'DOGRULAMA_KODU',
  },
}

/* Person düğümü tek kaynaktan (G09); içerik sayfaları buna `@id` ile bağlanır. */
const personSchema = yazarPersonDugumu()

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  name: 'Av. Fethi Güzel Hukuk Portalı',
  alternateName: ['Fethi Güzel', 'avfethiguzel', 'Av. Fethi Güzel Mevzuat'],
  url: siteUrl,
  inLanguage: 'tr-TR',
  description:
    `Açık erişimli dijital hukuk kütüphanesi: ${yaklasik(N.madde, 100)} kanun maddesi, akademik şerhler, günlük içtihat ve hukuki hesaplama araçları.`,
  publisher: { '@id': `${siteUrl}/#person` },
  about: { '@id': `${siteUrl}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/ara?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  '@id': `${siteUrl}/#organization`,
  name: 'Av. Fethi Güzel Hukuk Bürosu',
  url: siteUrl,
  logo: `${siteUrl}/icon-512.png`,
  image: `${siteUrl}/images/av-fethi-guzel-van-ercis-avukat.jpg`,
  description:
    'Van ili Erciş ilçesinde avukatlık bürosu. Mevzuat bankası, akademik şerhler, günlük içtihat ve hukuki hesaplama araçları sunan dijital hukuk portalı.',
  email: 'fethiguzel@hotmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: PROFILE.office.street,
    addressLocality: PROFILE.office.locality,
    addressRegion: PROFILE.office.region,
    postalCode: PROFILE.office.postalCode,
    addressCountry: 'TR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: PROFILE.office.latitude,
    longitude: PROFILE.office.longitude,
  },
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Van' },
    { '@type': 'City', name: 'Erciş' },
    { '@type': 'City', name: 'Çaldıran' },
    { '@type': 'City', name: 'Özalp' },
    { '@type': 'City', name: 'Muradiye' },
    { '@type': 'City', name: 'Patnos' },
    { '@type': 'City', name: 'Ağrı' },
  ],
  knowsAbout: [
    'Medeni hukuk',
    'Borçlar hukuku',
    'Ceza hukuku',
    'İş hukuku',
    'Ticaret hukuku',
    'Arabuluculuk',
  ],
  hasMap: `https://www.google.com/maps/search/?api=1&query=${PROFILE.office.mapQuery}`,
  founder: { '@id': `${siteUrl}/#person` },
  sameAs: [
    siteUrl,
    `${siteUrl}/avukat-fethi-guzel`,
    `${siteUrl}/ercis-avukat`,
    `${siteUrl}/akademik-profil`,
    `${siteUrl}/eserlerim`,
    'https://www.seckin.com.tr/kitap/614840900',
    'https://www.instagram.com/av.fethiguzel/',
    'https://x.com/avfethiguzel',
    'https://play.google.com/store/apps/details?id=com.avfethiguzel.hukuk',
  ],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Dijital hukuk hizmetleri',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Mevzuat ve akademik şerh bankası',
          url: `${siteUrl}/mevzuat`,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Hukuki hesaplama araçları',
          url: `${siteUrl}/hesaplama`,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Günlük içtihat taraması',
          url: `${siteUrl}/icthat`,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Avukatlık ve arabuluculuk',
          url: `${siteUrl}/avukat-fethi-guzel`,
        },
      },
    ],
  },
}

/** SoftwareApplication helps AI engines and app stores discover calculators as a product */
const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Av. Fethi Güzel Hukuk Portalı',
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'LegalReference',
  operatingSystem: 'Web, Android',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'TRY',
  },
  url: siteUrl,
  description:
    'Ücretsiz mevzuat arama, akademik şerh, içtihat ve hukuki hesaplama araçları (kıdem, faiz, miras, nafaka vb.).',
  author: { '@id': `${siteUrl}/#person` },
  inLanguage: 'tr-TR',
  featureList: [
    '7800+ kanun maddesi',
    'Akademik şerhler',
    'Günlük içtihat',
    '30 hukuki hesaplama aracı',
    'Mevzuat arama',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="tr"
      className={`${plusJakarta.variable} ${outfit.variable} ${cormorant.variable} ${ibmPlex.variable} scroll-smooth`}
    >
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {/* Yazı tipleri next/font ile kendi alan adımızdan gelir; dış stil dosyası işlemeyi engelliyordu (G13). */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM context" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(softwareSchema) }}
        />
      </head>
      <body className="bg-cream text-charcoal font-sans antialiased selection:bg-accent-solid selection:text-white min-h-screen app-body-pad">
        <SkipLink />
        <GalaxyChrome />
        {children}
        <AppNativeChrome />
      </body>
    </html>
  )
}
