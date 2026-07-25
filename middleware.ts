/**
 * No-op middleware kept for Next compatibility.
 * (Next 16 warns that "middleware" → "proxy"; empty matcher does nothing.)
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: [],
};
