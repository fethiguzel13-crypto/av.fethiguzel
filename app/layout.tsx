import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Outfit, Cormorant_Garamond, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], style: ['normal', 'italic'], weight: ['300', '400', '500', '600', '700'], variable: '--font-drama' })
const ibmPlex = IBM_Plex_Mono({ subsets: ['latin'], weight: ['100', '200', '300', '400', '500', '600', '700'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: {
    default: 'Av. Fethi Güzel | Özel Hukuk Uzmanı & Arabulucu',
    template: '%s | Av. Fethi Güzel',
  },
  description: 'Van ve Erciş\'te hukuki danışmanlık ve dava vekilliği. Ceza, medeni, gayrimenkul, idare, iş, borçlar ve ticaret hukuku alanlarında profesyonel temsil.',
  keywords: [
    'Fethi Güzel', 'Avukat Fethi Güzel', 'Van avukat', 'Erciş avukat',
    'ceza hukuku', 'ağır ceza', 'asliye ceza',
    'medeni hukuk', 'aile hukuku', 'boşanma avukatı', 'miras avukatı',
    'gayrimenkul hukuku', 'tapu iptal', 'izale-i şüyu',
    'idare hukuku', 'vergi hukuku',
    'iş hukuku', 'kıdem tazminatı',
    'borçlar hukuku', 'sigorta avukatı', 'araç değer kaybı', 'malpraktis',
    'ticaret hukuku', 'şirket danışmanlığı', 'icra iflas', 'arabuluculuk'
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
    <html lang="tr" className={`${plusJakarta.variable} ${outfit.variable} ${cormorant.variable} ${ibmPlex.variable} scroll-smooth`}>
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
      <body className="bg-cream text-charcoal font-sans antialiased selection:bg-accent selection:text-white">
        {children}
      </body>
    </html>
  )
}
