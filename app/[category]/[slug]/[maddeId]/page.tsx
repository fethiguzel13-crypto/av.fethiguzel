import { getLawCategoryBySlug, getLawSubCategoryBySlug } from '@/lib/laws'
import { notFound, permanentRedirect } from 'next/navigation'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return [] as { category: string; slug: string; maddeId: string }[]
}

export const dynamicParams = true
export const revalidate = 86400

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
      canonical: `https://www.avfethiguzel.com/mevzuat/${sub.kanunId}/${maddeId}`,
    },
  }
}

/** Pretty category URLs → canonical /mevzuat/{kanun}/{madde} */
export default async function MaddeDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string; maddeId: string }>
}) {
  const { category, slug, maddeId } = await params
  const parent = getLawCategoryBySlug(category)
  const sub = getLawSubCategoryBySlug(category, slug)
  if (!parent || !sub) notFound()
  permanentRedirect(`/mevzuat/${sub.kanunId}/${maddeId}`)
}
