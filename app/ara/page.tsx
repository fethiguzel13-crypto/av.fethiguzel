import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MevzuatSearch from "@/components/MevzuatSearch";

export const metadata: Metadata = {
    title: "Site ve Mevzuat Ara — 7800+ Madde, Şerh, Hesaplama",
    description:
        "Tüm kanun maddelerinde tam metin arama: satım, satış, kıdem, nafaka… TBK, TMK, TTK, TCK ve 40+ kanun + hesaplama araçları.",
    alternates: { canonical: "https://avfethiguzel.com/ara" },
    openGraph: {
        title: "Site ve Mevzuat Ara | Av. Fethi Güzel",
        description: "Madde metninde kelime kelime arama; ilgili tüm kanunlar listelenir.",
        url: "https://avfethiguzel.com/ara",
    },
};

// Static shell — ?q= handled client-side via useSearchParams.
export default function AraPage() {
    return (
        <div className="bg-cream min-h-screen font-sans">
            <Navbar />
            <main className="pt-36 sm:pt-40 pb-20 px-5 sm:px-6 max-w-4xl mx-auto">
                <header className="mb-10 sm:mb-14 text-center">
                    <p className="section-label mb-3">Tam metin arama</p>
                    <h1 className="text-3xl sm:text-5xl text-charcoal font-bold mb-4 text-balance">
                        Site &amp; Mevzuat <span className="font-drama italic text-accent">Ara</span>
                    </h1>
                    <p className="text-charcoal/55 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
                        Örn. <strong className="text-charcoal/70 font-semibold">satım</strong> yazın —
                        TBK taşınır/taşınmaz satışı, ilgili tüm maddeler ve hesaplama sayfaları listelenir.
                        Arama resmî madde metninin tamamında yapılır.
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
