import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MaddeClient from './MaddeClient'

type Props = {
  params: Promise<{ kanunId: string; id: string }>
}

export const dynamicParams = true

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kanunId, id } = await params
  const maddeNo = id.replace(/^madde-/i, '')
  return {
    title: `${kanunId.toUpperCase()} Madde ${maddeNo} | Av. Fethi Güzel — Akademik Şerh`,
    description: `${kanunId.toUpperCase()} Madde ${maddeNo}: resmî metin ve akademik şerh. Av. Fethi Güzel dijital hukuk kütüphanesi.`,
    alternates: {
      canonical: `https://avfethiguzel.com/mevzuat/${kanunId}/${id}`,
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
        {/* Server passes route params; body loads from CDN pack in the browser */}
        <MaddeClient kanunId={kanunId} id={id} />
      </main>
      <Footer />
    </div>
  )
}
