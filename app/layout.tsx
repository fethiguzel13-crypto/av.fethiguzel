import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Outfit, Cormorant_Garamond, IBM_Plex_Mono } from 'next/font/google'
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
    '7800+ kanun maddesi ve akademik şerh, günlük içtihat, 30 hukuki hesaplama aracı. TBK, TMK, TTK, TCK, HMK, İİK. Van · Erciş avukat ve arabulucu.',
  keywords: [
    'Fethi Güzel',
    'Avukat Fethi Güzel',
    'Van avukat',
    'Erciş avukat',
    'Ağrı avukat',
    'Patnos avukat',
    'Muradiye avukat',
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
    'Yargıtay kararları',
    'günlük içtihat',
    'arabuluculuk',
    'boşanma avukatı Van',
    'miras avukatı',
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
      '7800+ madde şerhi, günlük içtihat ve hukuki hesaplama araçları. Türkiye\'nin kapsamlı dijital hukuk arşivi.',
    images: [
      {
        url: '/fethi-guzel.jpg',
        width: 1200,
        height: 630,
        alt: 'Av. Fethi Güzel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Av. Fethi Güzel | Mevzuat & Akademik Şerh',
    description: '7800+ kanun maddesi, akademik şerhler, günlük içtihat, hesaplama araçları.',
    images: ['/fethi-guzel.jpg'],
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
    icon: [{ url: '/fethi-guzel.jpg', type: 'image/jpeg' }],
    apple: [{ url: '/fethi-guzel.jpg' }],
  },
  manifest: '/manifest.webmanifest',
  verification: {
    // Google Search Console doğrulama kodunu buraya ekleyin:
    // google: 'DOGRULAMA_KODU',
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Av. Fethi Güzel',
  jobTitle: 'Avukat & Arabulucu',
  description:
    'Van ve Erciş merkezli avukat; medeni, borçlar, ticaret, ceza ve usul hukuku. Dijital mevzuat ve akademik şerh arşivi.',
  url: siteUrl,
  image: `${siteUrl}/fethi-guzel.jpg`,
  email: 'av.fethiguzel@hotmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Vanyolu Mah. Karayusuf Bey Bulvarı Zenginler İş Hanı Kat 4 No 26',
    addressLocality: 'Erciş',
    addressRegion: 'Van',
    postalCode: '65400',
    addressCountry: 'TR',
  },
  areaServed: ['Van', 'Erciş', 'Ağrı', 'Patnos', 'Muradiye'].map((name) => ({
    '@type': 'City',
    name,
  })),
  knowsAbout: [
    'Türk Borçlar Kanunu',
    'Türk Medeni Kanunu',
    'Türk Ticaret Kanunu',
    'İş hukuku',
    'Arabuluculuk',
    'İcra ve iflas',
  ],
  worksFor: {
    '@type': 'LegalService',
    name: 'Av. Fethi Güzel Hukuk Bürosu',
    url: siteUrl,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Erciş',
      addressRegion: 'Van',
      addressCountry: 'TR',
    },
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Av. Fethi Güzel Hukuk Portalı',
  alternateName: ['Fethi Güzel', 'avfethiguzel'],
  url: siteUrl,
  inLanguage: 'tr-TR',
  publisher: {
    '@type': 'Person',
    name: 'Av. Fethi Güzel',
  },
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
  name: 'Av. Fethi Güzel Hukuk Bürosu',
  url: siteUrl,
  logo: `${siteUrl}/fethi-guzel.jpg`,
  image: `${siteUrl}/fethi-guzel.jpg`,
  description:
    'Mevzuat bankası, akademik şerhler, günlük içtihat ve hukuki hesaplama araçları sunan dijital hukuk portalı ve avukatlık bürosu.',
  telephone: undefined,
  email: 'av.fethiguzel@hotmail.com',
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
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Van',
  },
  sameAs: [] as string[],
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
      </head>
      <body className="bg-cream text-charcoal font-sans antialiased selection:bg-accent selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
