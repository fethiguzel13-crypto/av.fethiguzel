import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MaddeClient from '../[kanunId]/[id]/MaddeClient'
import GosterParams from './GosterParams'

export const dynamic = 'force-static'

export const metadata: Metadata = {
    title: 'Madde Şerhi | Av. Fethi Güzel',
    description: 'Resmî madde metni ve akademik şerh — Av. Fethi Güzel dijital hukuk kütüphanesi.',
}

export default function MaddeGosterPage() {
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
                    <span className="text-charcoal/80">Madde</span>
                </nav>
                <Suspense
                    fallback={<div className="h-64 animate-pulse rounded-2xl bg-charcoal/5" />}
                >
                    <GosterParams />
                </Suspense>
            </main>
            <Footer />
        </div>
    )
}
