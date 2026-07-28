import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MevzuatSearch from "@/components/MevzuatSearch";

export const metadata: Metadata = {
    title: "Kanun Maddesi Arama — 7800+ Madde, Şerh, Hesaplama",
    description:
        "Kanun maddesi arama motoru: TBK, TMK, TTK, TCK, HMK, İİK maddelerinde tam metin arama. Satım, kıdem, nafaka… 40+ kanun + şerh + hesaplama.",
    keywords: [
        "kanun maddesi arama",
        "kanun maddesi",
        "mevzuat arama",
        "TBK madde ara",
        "TCK madde ara",
        "madde metni",
        "akademik şerh arama",
    ],
    alternates: { canonical: "https://www.avfethiguzel.com/ara" },
    openGraph: {
        title: "Kanun Maddesi Arama | Av. Fethi Güzel",
        description: "Kanun maddesi arama: madde metninde kelime kelime tarama; ilgili tüm kanunlar ve şerhler listelenir.",
        url: "https://www.avfethiguzel.com/ara",
    },
};

// Static shell — ?q= handled client-side via useSearchParams.
export default function AraPage() {
    return (
        <div className="bg-cream min-h-screen font-sans">
            <Navbar />
            <main className="pt-36 sm:pt-40 pb-20 px-5 sm:px-6 max-w-4xl mx-auto">
                <header className="mb-10 sm:mb-14 text-center">
                    <p className="section-label mb-3">Kanun maddesi arama motoru</p>
                    <h1 className="text-3xl sm:text-5xl text-charcoal font-bold mb-4 text-balance">
                        Kanun Maddesi <span className="font-drama italic text-accent">Ara</span>
                    </h1>
                    <p className="text-charcoal/55 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
                        Kanun maddesi aramak için kelime veya madde no yazın. Örn.{' '}
                        <strong className="text-charcoal/70 font-semibold">satım</strong>,{' '}
                        <strong className="text-charcoal/70 font-semibold">TBK 125</strong>,{' '}
                        <strong className="text-charcoal/70 font-semibold">kıdem</strong> —
                        ilgili madde metinleri, şerhler ve hesaplama araçları listelenir.
                    </p>
                </header>
                <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-charcoal/5" />}>
                    <MevzuatSearch autoFocus />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
