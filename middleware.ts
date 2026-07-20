import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Intentionally no-op. Madde URLs are handled by next.config rewrites → static viewer.
export function middleware(_request: NextRequest) {
    return NextResponse.next()
}

export const config = {
    matcher: [],
}
