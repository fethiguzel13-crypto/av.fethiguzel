import type { Metadata } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-playfair' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: 'Av. Fethi Güzel | Özel Hukuk Uzmanı & Arabulucu',
  description: 'Av. Fethi Güzel - Erciş/Van. Özel Hukuk alanında uzmanlık, arabuluculuk hizmetleri ve İçtihat Bilgi Bankası.',
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
