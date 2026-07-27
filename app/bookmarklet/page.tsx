'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CODE =
    "javascript:(function(){var t=window.getSelection&&String(window.getSelection());if(!t||t.length<2){t=prompt('Mevzuatta aranacak metin:')||'';}if(!t)return;window.open('https://avfethiguzel.com/ara?q='+encodeURIComponent(t.trim()),'_blank','noopener');})();";

export default function BookmarkletPage() {
    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-xl mx-auto">
                <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">
                    Araç
                </p>
                <h1 className="text-3xl font-heading font-bold text-charcoal mb-3">
                    Mevzuat ara — yer imi aracı
                </h1>
                <p className="text-sm text-charcoal/60 leading-relaxed mb-6">
                    Seçili metni veya girdiğiniz ifadeyi avfethiguzel.com mevzuat aramasında açar.
                    Chrome eklentisi yerine tarayıcı yer imi (bookmarklet) kullanılır; kurulum 10
                    saniye sürer.
                </p>

                <ol className="list-decimal pl-5 space-y-2 text-sm text-charcoal/70 mb-8">
                    <li>Aşağıdaki bağlantıyı yer imleri çubuğuna sürükleyin.</li>
                    <li>Herhangi bir sayfada metin seçin (veya seçmeden tıklayın).</li>
                    <li>Yer imine tıklayın — arama sekmesi açılır.</li>
                </ol>

                <a
                    href={CODE}
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex items-center justify-center w-full sm:w-auto bg-charcoal text-cream px-6 py-3.5 rounded-full font-bold text-sm cursor-grab active:cursor-grabbing"
                    title="Yer imleri çubuğuna sürükleyin"
                >
                    ⚖ Mevzuatta Ara (sürükle)
                </a>
                <p className="mt-3 text-[11px] text-charcoal/40">
                    Tıklamak çalışmaz; yer imine <strong>sürüklemeniz</strong> gerekir.
                </p>

                <div className="mt-8 p-4 rounded-xl bg-white border border-charcoal/8">
                    <p className="text-xs font-bold text-charcoal/50 mb-2">Manuel ekleme</p>
                    <code className="text-[10px] break-all text-charcoal/60 block leading-relaxed">
                        {CODE}
                    </code>
                </div>

                <p className="mt-8 text-sm">
                    <Link href="/ara" className="text-accent font-semibold hover:underline">
                        Doğrudan mevzuat arama →
                    </Link>
                </p>
            </main>
            <Footer />
        </div>
    );
}
