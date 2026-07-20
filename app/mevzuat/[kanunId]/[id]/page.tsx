import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ kanunId: string; id: string }>
}

/**
 * Fallback if middleware is skipped: redirect to static viewer.
 * Prefer middleware rewrite (pretty URL kept).
 */
export default async function ArticlePage({ params }: Props) {
  const { kanunId, id } = await params
  redirect(`/mevzuat/goster?kanunId=${encodeURIComponent(kanunId)}&id=${encodeURIComponent(id)}`)
}
