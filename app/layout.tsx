import type { Metadata } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-playfair' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: {
    default: 'Av. Fethi Güzel | Özel Hukuk Uzmanı & Arabulucu – Erciş/Van',
    template: '%s | Av. Fethi Güzel',
  },
  description: 'Av. Fethi Güzel – Erciş/Van. Medeni Hukuk, Borçlar Hukuku ve Ticaret Hukuku alanlarında kanun maddeleri, Yargıtay kararları ve akademik analizler. Boşanma, miras, tazminat, şirketler hukuku, çek, bono, kira davaları ve arabuluculuk.',
  keywords: [
    'Fethi Güzel', 'Avukat Fethi Güzel', 'Van avukat', 'Erciş avukat',
    'medeni hukuk', 'borçlar hukuku', 'ticaret hukuku',
    'boşanma avukatı', 'miras avukatı', 'tazminat davası',
    'şirketler hukuku', 'çek', 'bono', 'poliçe',
    'tapu iptal tescil', 'velayet', 'vesayet', 'nafaka',
    'kira davaları', 'ortaklığın giderilmesi', 'izale-i şuyu',
    'sözleşmeler hukuku', 'arabuluculuk', 'haksız fiil', 'malpraktis',
    'ağır ceza avukatı', 'ceza hukuku',
  ],
  authors: [{ name: 'Av. Fethi Güzel', url: 'https://avfethiguzel.com' }],
  creator: 'Av. Fethi Güzel',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://avfethiguzel.com',
    siteName: 'Av. Fethi Güzel Hukuk Portalı',
    title: 'Av. Fethi Güzel | Özel Hukuk Uzmanı & Arabulucu',
    description: 'Medeni Hukuk, Borçlar Hukuku ve Ticaret Hukuku alanlarında kanun maddeleri, Yargıtay kararları ve akademik analizler.',
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
    canonical: 'https://avfethiguzel.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} scroll-smooth`}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        {/* Schema.org – Person (E-E-A-T) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Av. Fethi Güzel",
              "jobTitle": "Avukat & Arabulucu",
              "description": "Özel Hukuk alanında akademik uzmanlık. Medeni Hukuk, Borçlar Hukuku ve Ticaret Hukuku.",
              "url": "https://avfethiguzel.com",
              "sameAs": [],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Van Yolu Mah. Karayusuf Bey Bulvarı EYC İş Merkezi A Blok Kat 4 Daire 37",
                "addressLocality": "Erciş",
                "addressRegion": "Van",
                "postalCode": "65400",
                "addressCountry": "TR"
              },
              "worksFor": {
                "@type": "LegalService",
                "name": "Av. Fethi Güzel Hukuk Bürosu",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Erciş",
                  "addressRegion": "Van",
                  "addressCountry": "TR"
                }
              }
            })
          }}
        />
        {/* Schema.org – WebSite (for sitelinks search) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Av. Fethi Güzel Hukuk Portalı",
              "url": "https://avfethiguzel.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://avfethiguzel.com/arama?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className="bg-primary text-light font-sans antialiased selection:bg-accent selection:text-primary">
        {/* CSS Noise Overlay */}
        <svg className="noise-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
        </svg>
        
        {children}
      </body>
    </html>
  )
}
