import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MaddeClient from './MaddeClient'

type Props = {
  params: Promise<{ kanunId: string; id: string }>
}

/** Pre-render static shells for every madde (body still client-loaded from CDN). */
export function generateStaticParams() {
  try {
    // Relative path — available at build; keeps pages static on Vercel CDN.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs') as typeof import('fs')
    const raw = fs.readFileSync('public/data/mevzuat-index.json', 'utf8')
    const data = JSON.parse(raw) as {
      items: { kanunId: string; id: string }[]
    }
    return data.items.map((i) => ({ kanunId: i.kanunId, id: i.id }))
  } catch {
    return [] as { kanunId: string; id: string }[]
  }
}

export const dynamicParams = true

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kanunId, id } = await params
  const maddeNo = id.replace(/^madde-/i, '')
  return {
    title: `${kanunId.toUpperCase()} Madde ${maddeNo} | Av. Fethi Güzel — Akademik Şerh`,
    description: `${kanunId.toUpperCase()} Madde ${maddeNo}: resmî metin ve akademik şerh. Av. Fethi Güzel dijital hukuk kütüphanesi.`,
    openGraph: {
      title: `${kanunId.toUpperCase()} Madde ${maddeNo} | Av. Fethi Güzel`,
      description: 'Resmî madde metni ve akademik analiz.',
      type: 'article',
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { kanunId, id } = await params

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <main className="pt-36 sm:pt-40 pb-20 px-5 sm:px-6 max-w-4xl mx-auto">
        <nav className="text-xs text-charcoal/50 mb-8">
          <Link href="/" className="hover:text-accent">
            Ana Sayfa
          </Link>
          {' / '}
          <Link href="/mevzuat" className="hover:text-accent">
            Mevzuat
          </Link>
          {' / '}
          <span className="text-charcoal/80">
            {kanunId}/{id}
          </span>
        </nav>
        <MaddeClient kanunId={kanunId} id={id} />
      </main>
      <Footer />
    </div>
  )
}
