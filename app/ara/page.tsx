import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MevzuatSearch from "@/components/MevzuatSearch";

export const metadata: Metadata = {
    title: "Mevzuat Ara",
    description:
        "7800+ kanun maddesi ve akademik şerh içinde anında arama. TBK, TMK, TTK, TCK, HMK, İİK ve onlarca kanun.",
    openGraph: {
        title: "Mevzuat Ara | Av. Fethi Güzel",
        description: "Türkiye'nin en kapsamlı dijital hukuk arşivinde madde ve şerh arayın.",
    },
};

export default function AraPage() {
    return (
        <div className="bg-cream min-h-screen font-sans">
            <Navbar />
            <main className="pt-36 sm:pt-40 pb-20 px-5 sm:px-6 max-w-4xl mx-auto">
                <header className="mb-10 sm:mb-14 text-center">
                    <p className="text-accent font-heading text-xs sm:text-sm tracking-widest uppercase mb-3">
                        Anında Arama
                    </p>
                    <h1 className="text-3xl sm:text-5xl text-charcoal font-bold mb-4">
                        Mevzuat <span className="font-drama italic text-accent">Ara</span>
                    </h1>
                    <p className="text-charcoal/55 max-w-xl mx-auto text-base sm:text-lg">
                        Madde numarası, kanun adı veya hukuki kavram yazın; resmî metin ve akademik
                        şerhe tek tıkla ulaşın.
                    </p>
                </header>
                <MevzuatSearch autoFocus />
            </main>
            <Footer />
        </div>
    );
}
