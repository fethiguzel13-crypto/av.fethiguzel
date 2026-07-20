import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * No rewrite. Madde pages use /mevzuat/[kanunId]/[id] with client pack loader.
 * Kept file minimal so Next doesn't apply stale rewrite behavior from older deploys.
 */
export function middleware(_request: NextRequest) {
    return NextResponse.next()
}

export const config = {
    matcher: [],
}
