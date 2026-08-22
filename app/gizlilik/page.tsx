import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
    title: 'Gizlilik Politikası',
    description:
        'Av. Fethi Güzel Hukuk Portalı ve mobil uygulaması gizlilik politikası.',
    alternates: { canonical: 'https://avfethiguzel.com/gizlilik' },
}

export default function GizlilikPage() {
    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <main className="pt-36 pb-20 px-5 sm:px-6 max-w-3xl mx-auto text-charcoal">
                <p className="text-accent text-xs font-bold tracking-widest uppercase mb-3">
                    Yasal
                </p>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-8">
                    Gizlilik Politikası
                </h1>
                <div className="prose prose-charcoal max-w-none space-y-4 text-[15px] leading-relaxed text-charcoal/80">
                    <p>
                        Bu gizlilik politikası, <strong>https://avfethiguzel.com</strong>{' '}
                        web sitesi ve &quot;Av. Fethi Güzel&quot; mobil uygulaması (bundan
                        böyle &quot;Hizmet&quot;) için geçerlidir.
                    </p>
                    <h2 className="text-xl font-heading font-bold text-charcoal pt-4">
                        1. Toplanan veriler
                    </h2>
                    <p>
                        Hizmet bilgilendirme amaçlıdır. Form doldurmadığınız sürece kimlik
                        bilgisi istemeyiz. İletişim formları veya e-posta ile bize
                        ilettiğiniz ad, telefon ve mesaj içeriği yalnızca talebinize yanıt
                        vermek için kullanılır.
                    </p>
                    <h2 className="text-xl font-heading font-bold text-charcoal pt-4">
                        2. Mobil uygulama
                    </h2>
                    <p>
                        Android uygulaması, Hizmet’i güvenli bir WebView / Trusted Web
                        katmanı ile açar. Mevzuat ve şerh metinleri cihazınıza kalıcı olarak
                        kopyalanmaz; içerik sunucudan yüklenir. Uygulama, cihaz rehberi veya
                        konumunuza erişmez.
                    </p>
                    <h2 className="text-xl font-heading font-bold text-charcoal pt-4">
                        3. Çerezler ve teknik veriler
                    </h2>
                    <p>
                        Site performansı ve güvenlik için teknik günlükler (IP, tarayıcı
                        türü, erişim zamanı) kısa süreli işlenebilir. Üçüncü taraf analiz
                        araçları kullanılıyorsa, bunlar ilgili sağlayıcıların politikalarına
                        tabidir.
                    </p>
                    <h2 className="text-xl font-heading font-bold text-charcoal pt-4">
                        4. Verilerin paylaşımı
                    </h2>
                    <p>
                        Kişisel verileriniz, yasal zorunluluklar dışında üçüncü kişilere
                        satılmaz veya pazarlama listelerine verilmez. Barındırma ve e-posta
                        altyapısı hizmet sağlayıcıları, teknik işlemci sıfatıyla sınırlı
                        erişime sahip olabilir.
                    </p>
                    <h2 className="text-xl font-heading font-bold text-charcoal pt-4">
                        5. Haklarınız
                    </h2>
                    <p>
                        KVKK kapsamındaki haklarınız için sitede yer alan iletişim
                        kanallarından bize ulaşabilirsiniz. Talebinize makul sürede yanıt
                        verilir.
                    </p>
                    <h2 className="text-xl font-heading font-bold text-charcoal pt-4">
                        6. Arşiv üyeliği
                    </h2>
                    <p>
                        Yargıtay arşivi üyeliği için e-posta, ad soyad ve şifre (hash&apos;lenmiş)
                        kaydedilir. Ödeme referansı ve üyelik bitiş tarihi üyeliği yürütmek
                        için işlenir. Kart ödemesi iyzico üzerinden geçer; kart numarası bu
                        sitede saklanmaz. Üyelik, dijital içerik erişimidir; avukat–müvekkil
                        ilişkisi doğurmaz.
                    </p>
                    <h2 className="text-xl font-heading font-bold text-charcoal pt-4">
                        7. Sorumluluk reddi
                    </h2>
                    <p>
                        Hizmetteki içerikler genel bilgilendirme niteliğindedir; hukuki
                        danışmanlık veya vekâlet yerine geçmez. Somut uyuşmazlıklarda yetkili
                        bir avukata başvurunuz.
                    </p>
                    <h2 className="text-xl font-heading font-bold text-charcoal pt-4">
                        8. Güncellemeler
                    </h2>
                    <p>
                        Bu metin güncellenebilir. Güncel sürüm her zaman bu sayfada yayımlanır.
                    </p>
                    <p className="text-sm text-charcoal/50 pt-6">
                        Son güncelleme: {new Date().toISOString().slice(0, 10)}
                    </p>
                </div>
                <Link
                    href="/"
                    className="inline-block mt-10 text-accent font-bold text-sm tracking-wide"
                >
                    ← Ana sayfa
                </Link>
            </main>
            <Footer />
        </div>
    )
}
