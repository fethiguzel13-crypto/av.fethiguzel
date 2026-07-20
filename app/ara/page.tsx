import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MevzuatSearch from "@/components/MevzuatSearch";

export const metadata: Metadata = {
    title: "Mevzuat Ara — 7800+ Madde ve Akademik Şerh",
    description:
        "TBK, TMK, TTK, TCK, HMK, İİK ve 40+ kanunda anında arama. Madde metni ve akademik şerhe tek tıkla ulaşın.",
    alternates: { canonical: "https://avfethiguzel.com/ara" },
    openGraph: {
        title: "Mevzuat Ara | Av. Fethi Güzel",
        description: "Türkiye'nin kapsamlı dijital hukuk arşivinde madde ve şerh arayın.",
        url: "https://avfethiguzel.com/ara",
    },
};

type Props = { searchParams: Promise<{ q?: string }> };

export default async function AraPage({ searchParams }: Props) {
    const sp = await searchParams;
    const initialQuery = typeof sp.q === "string" ? sp.q : "";

    return (
        <div className="bg-cream min-h-screen font-sans">
            <Navbar />
            <main className="pt-36 sm:pt-40 pb-20 px-5 sm:px-6 max-w-4xl mx-auto">
                <header className="mb-10 sm:mb-14 text-center">
                    <p className="section-label mb-3">Anında Arama</p>
                    <h1 className="text-3xl sm:text-5xl text-charcoal font-bold mb-4 text-balance">
                        Mevzuat <span className="font-drama italic text-accent">Ara</span>
                    </h1>
                    <p className="text-charcoal/55 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
                        Madde numarası, kanun adı veya hukuki kavram yazın; resmî metin ve akademik
                        şerhe tek tıkla ulaşın.
                    </p>
                </header>
                <MevzuatSearch autoFocus initialQuery={initialQuery} />
            </main>
            <Footer />
        </div>
    );
}
