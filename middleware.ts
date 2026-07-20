import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Serve madde detail through a single static viewer page so Vercel does not
 * need serverless SSR or 7800 SSG outputs for /mevzuat/:kanun/:id.
 * Browser URL stays pretty (/mevzuat/tmk/madde-1); content loads client-side.
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const m = pathname.match(/^\/mevzuat\/([^/]+)\/([^/]+)\/?$/)
    if (!m) return NextResponse.next()

    const kanunId = m[1]
    const id = m[2]
    // Skip reserved segments
    if (kanunId === 'goster') return NextResponse.next()

    const url = request.nextUrl.clone()
    url.pathname = '/mevzuat/goster'
    url.searchParams.set('kanunId', kanunId)
    url.searchParams.set('id', id)
    return NextResponse.rewrite(url)
}

export const config = {
    // Explicit path pattern (Next matcher)
    matcher: ['/mevzuat/:kanunId/:id*'],
}
