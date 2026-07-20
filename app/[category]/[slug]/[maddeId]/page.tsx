import { getLawCategoryBySlug, getLawSubCategoryBySlug } from '@/lib/laws'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import MaddeClient from '@/app/mevzuat/[kanunId]/[id]/MaddeClient'

export function generateStaticParams() {
  return [] as { category: string; slug: string; maddeId: string }[]
}

export const dynamicParams = true

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string; maddeId: string }>
}): Promise<Metadata> {
  const { category, slug, maddeId } = await params
  const parent = getLawCategoryBySlug(category)
  const sub = getLawSubCategoryBySlug(category, slug)
  if (!parent || !sub) return { title: 'Sayfa Bulunamadı' }
  const maddeNo = maddeId.replace('madde-', '')
  return {
    title: `${parent.kanunAdi} ${sub.name} Madde ${maddeNo} | Av. Fethi Güzel`,
    description: `${parent.kanunAdi} Madde ${maddeNo} resmi metni ve akademik yorum.`,
    alternates: {
      canonical: `https://avfethiguzel.com/${category}/${slug}/${maddeId}`,
    },
  }
}

export default async function MaddeDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string; maddeId: string }>
}) {
  const { category, slug, maddeId } = await params
  const parent = getLawCategoryBySlug(category)
  const sub = getLawSubCategoryBySlug(category, slug)
  if (!parent || !sub) notFound()

  return (
    <main className="min-h-screen bg-cream pt-32 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-charcoal/50 mb-8">
          <Link href="/" className="hover:text-accent">
            Ana Sayfa
          </Link>
          <span>/</span>
          <Link href={`/${category}`} className="hover:text-accent">
            {parent.name}
          </Link>
          <span>/</span>
          <Link href={`/${category}/${slug}`} className="hover:text-accent">
            {sub.name}
          </Link>
          <span>/</span>
          <span className="text-accent">{maddeId}</span>
        </nav>
        <MaddeClient kanunId={sub.kanunId} id={maddeId} />
      </div>
    </main>
  )
}
