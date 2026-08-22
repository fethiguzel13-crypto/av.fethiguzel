import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: 'Yasal Uyarı',
    description:
        'Av. Fethi Güzel Hukuk Portalı yasal uyarı, bilgilendirme amacı ve sorumluluk sınırları.',
    alternates: { canonical: 'https://avfethiguzel.com/yasal-uyari' },
    robots: { index: true, follow: true },
};

export default function YasalUyariPage() {
    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <main id="main-content" className="pt-36 pb-20 px-5 sm:px-6 max-w-3xl mx-auto text-charcoal">
                <p className="text-accent text-xs font-bold tracking-widest uppercase mb-3">Yasal</p>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-8">Yasal Uyarı</h1>

                <div className="space-y-5 text-[15px] leading-relaxed text-charcoal/80">
                    <p>
                        <strong>https://avfethiguzel.com</strong> ve bağlı mobil uygulama (birlikte
                        &quot;Portal&quot;), Av. Fethi Güzel tarafından sunulan bilgilendirme amaçlı bir
                        dijital hukuk kütüphanesidir.
                    </p>

                    <h2 className="text-xl font-heading font-bold text-charcoal pt-2">1. Bilgilendirme amacı</h2>
                    <p>
                        Kanun maddeleri, akademik şerhler, içtihat özetleri, makaleler ve hesaplama
                        araçları genel hukuki bilgilendirme içindir. Bu içerikler somut bir dosyaya
                        ilişkin hukuki tavsiye, mütalaa veya avukat–müvekkil ilişkisi oluşturmaz.
                    </p>

                    <h2 className="text-xl font-heading font-bold text-charcoal pt-2">2. Sorumluluk</h2>
                    <p>
                        Mevzuat ve içtihat metinleri resmi kaynaklardan derlenmeye çalışılsa da
                        güncellik, eksiksizlik veya hatasızlık garanti edilmez. Resmî Gazete,
                        mevzuat.gov.tr ve ilgili yargı mercilerinin yayınları esas alınmalıdır.
                        Hesaplama sonuçları yaklaşık ve bilgilendirme niteliğindedir.
                    </p>

                    <h2 className="text-xl font-heading font-bold text-charcoal pt-2">3. Reklam yasağı</h2>
                    <p>
                        Portal, Avukatlık Kanunu ve Türkiye Barolar Birliği reklam yasağı kurallarına
                        uygun şekilde bilgilendirme odaklıdır. Abartılı vaat, garanti veya karşılaştırmalı
                        reklam dili kullanılmaz.
                    </p>

                    <h2 className="text-xl font-heading font-bold text-charcoal pt-2">4. Fikri haklar</h2>
                    <p>
                        Orijinal şerh metinleri, arayüz tasarımı ve derleme içeriklerinin hakları saklıdır.
                        Kanun metinleri kamuya açık mevzuattır; alıntılarda kaynak gösterilmesi önerilir.
                    </p>

                    <h2 className="text-xl font-heading font-bold text-charcoal pt-2">5. Yargıtay arşivi üyeliği</h2>
                    <p>
                        Karar arşivi aylık dijital üyelik ile açılır. Bedel avukatlık ücreti
                        değildir. Karar metinleri sitede okunur; indirme sunulmaz. Künye ve
                        metin resmi kaynaktan derlenir; bağlayıcı olan kararın aslıdır.
                    </p>

                    <h2 className="text-xl font-heading font-bold text-charcoal pt-2">6. İletişim</h2>
                    <p>
                        Sorularınız için:{' '}
                        <a
                            href="mailto:fethiguzel@hotmail.com"
                            className="text-accent font-semibold hover:underline"
                        >
                            fethiguzel@hotmail.com
                        </a>
                        . Ayrıca{' '}
                        <Link href="/gizlilik" className="text-accent font-semibold hover:underline">
                            Gizlilik Politikası
                        </Link>{' '}
                        sayfasını inceleyebilirsiniz.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
