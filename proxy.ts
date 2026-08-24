import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseMaddeQuery } from '@/lib/parse-madde-query';

export function proxy(request: NextRequest) {
    if (request.nextUrl.pathname !== '/ara') return NextResponse.next();
    const exact = parseMaddeQuery(request.nextUrl.searchParams.get('q'));
    if (!exact) return NextResponse.next();
    return NextResponse.redirect(new URL(exact.href, request.url));
}

export const config = {
    matcher: '/ara',
};
