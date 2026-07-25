import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Outfit, Cormorant_Garamond, IBM_Plex_Mono } from 'next/font/google'
import SkipLink from '@/components/SkipLink'
import './globals.css'

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
const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-drama',
  display: 'swap',
})
const ibmPlex = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

const siteUrl = 'https://avfethiguzel.com'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F2F0E9' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1A1A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Av. Fethi Güzel | Mevzuat, Akademik Şerh & Hukuki Hesaplama',
    template: '%s | Av. Fethi Güzel',
  },
  description:
    '7.800+ kanun maddesi ve akademik şerh, günlük içtihat, 30 hukuki hesaplama aracı. TBK, TMK, TTK, TCK, HMK, İİK. Ücretsiz dijital hukuk kütüphanesi · Van · Erciş avukat ve arabulucu.',
  keywords: [
    'Fethi Güzel',
    'Avukat Fethi Güzel',
    'Van avukat',
    'Erciş avukat',
    'Çaldıran avukat',
    'Özalp avukat',
    'Ağrı avukat',
    'Patnos avukat',
    'Muradiye avukat',
    'avukat Fethi Güzel',
    'kanun maddesi',
    'akademik şerh',
    'mevzuat bankası',
    'TBK şerh',
    'TMK şerh',
    'TTK şerh',
    'TCK',
    'HMK',
    'İİK',
    'kıdem tazminatı hesaplama',
    'faiz hesaplama',
    'miras payı hesaplama',
    'Yargıtay kararları',
    'günlük içtihat',
    'arabuluculuk',
    'boşanma avukatı Van',
    'miras avukatı',
    'ücretsiz mevzuat',
    'hukuk portalı',
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
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: siteUrl,
    siteName: 'Av. Fethi Güzel Hukuk Portalı',
    title: 'Av. Fethi Güzel | Mevzuat, Akademik Şerh & Hukuki Hesaplama',
    description:
      '7.800+ madde şerhi, günlük içtihat ve hukuki hesaplama araçları. Açık erişimli dijital hukuk arşivi · Van · Erciş.',
    images: [
      {
        url: '/images/av-fethi-guzel-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Av. Fethi Güzel — Van Erciş avukat ve hukuk portalı',
      },
      {
        url: '/images/av-fethi-guzel-van-ercis-avukat.jpg',
        width: 640,
        height: 640,
        alt: 'Avukat Fethi Güzel portresi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Av. Fethi Güzel | Mevzuat & Akademik Şerh',
    description:
      '7.800+ kanun maddesi, akademik şerhler, günlük içtihat, hesaplama araçları. Ücretsiz dijital hukuk kütüphanesi.',
    images: ['/images/av-fethi-guzel-og.jpg'],
  },
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
  alternates: {
    canonical: siteUrl,
    languages: {
      'tr-TR': siteUrl,
    },
  },
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

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${siteUrl}/#person`,
  name: 'Av. Fethi Güzel',
  alternateName: ['Fethi Güzel', 'Avukat Fethi Güzel'],
  jobTitle: 'Avukat & Arabulucu',
  description:
    'Van ve Erciş merkezli avukat; özel hukuk doktora çalışmaları; e-duruşma monografisi yazarı; iyi düzeyde İngilizce. Medeni, borçlar, ticaret, ceza ve usul hukuku.',
  url: `${siteUrl}/avukat-fethi-guzel`,
  image: `${siteUrl}/images/av-fethi-guzel-van-ercis-avukat.jpg`,
  email: 'av.fethiguzel@hotmail.com',
  knowsLanguage: ['tr', 'en'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Vanyolu Mah. Karayusuf Bey Bulvarı Zenginler İş Hanı Kat 4 No 26',
    addressLocality: 'Erciş',
    addressRegion: 'Van',
    postalCode: '65400',
    addressCountry: 'TR',
  },
  areaServed: [
    'Van',
    'Erciş',
    'Çaldıran',
    'Özalp',
    'Muradiye',
    'Patnos',
    'Ağrı',
    'Tatvan',
    'Bitlis',
    'Adilcevaz',
    'Ahlat',
    'Ankara',
  ].map((name) => ({
    '@type': 'City',
    name,
  })),
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
  sameAs: [
    siteUrl,
    `${siteUrl}/akademik-profil`,
    `${siteUrl}/eserlerim`,
    'https://www.seckin.com.tr/kitap/614840900',
    'https://play.google.com/store/apps/details?id=com.avfethiguzel.hukuk',
  ],
  worksFor: { '@id': `${siteUrl}/#organization` },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  name: 'Av. Fethi Güzel Hukuk Portalı',
  alternateName: ['Fethi Güzel', 'avfethiguzel', 'Av. Fethi Güzel Mevzuat'],
  url: siteUrl,
  inLanguage: 'tr-TR',
  description:
    'Açık erişimli dijital hukuk kütüphanesi: 7.800+ kanun maddesi, akademik şerhler, günlük içtihat ve hukuki hesaplama araçları.',
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
    'Mevzuat bankası, akademik şerhler, günlük içtihat ve hukuki hesaplama araçları sunan dijital hukuk portalı ve avukatlık bürosu.',
  email: 'av.fethiguzel@hotmail.com',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Vanyolu Mah. Karayusuf Bey Bulvarı Zenginler İş Hanı Kat 4 No 26',
    addressLocality: 'Erciş',
    addressRegion: 'Van',
    postalCode: '65400',
    addressCountry: 'TR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 39.028,
    longitude: 43.36,
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
  founder: { '@id': `${siteUrl}/#person` },
  sameAs: [
    siteUrl,
    `${siteUrl}/avukat-fethi-guzel`,
    `${siteUrl}/akademik-profil`,
    `${siteUrl}/eserlerim`,
    'https://www.seckin.com.tr/kitap/614840900',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap"
          rel="stylesheet"
        />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM context" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      </head>
      <body className="bg-cream text-charcoal font-sans antialiased selection:bg-accent selection:text-white min-h-screen">
        <SkipLink />
        {children}
      </body>
    </html>
  )
}
