import Link from 'next/link';

/**
 * FAQ is a top conversion + SEO lever on award-winning law firm sites (Clio, Lawyerist).
 * Also powers FAQPage structured data for rich results and AI answer engines.
 */
export const HOME_FAQS = [
    {
        q: 'Bu site yalnızca avukatlar için mi?',
        a: 'Hayır. Portal hem hukukçulara hem vatandaşa açıktır: kanun maddeleri, akademik şerhler, günlük içtihat özetleri ve kıdem, faiz, miras gibi hesaplama araçları herkesin kullanımına sunulmuştur. Somut uyuşmazlıklarda mutlaka avukata danışılmalıdır.',
    },
    {
        q: 'Hangi kanunlar ve ne kadar içerik var?',
        a: 'TBK, TMK, TTK, TCK, HMK, İİK, VUK, İş Kanunu ve 40’tan fazla ek kanun dâhil 45+ mevzuat kaynağı; 7.800’ü aşkın madde metni ve akademik şerh aynı platformdadır. Kütüphane sürekli genişlemektedir.',
    },
    {
        q: 'Hesaplama araçları bağlayıcı mıdır?',
        a: 'Hayır. Kıdem, faiz, miras payı, vekâlet ücreti ve benzeri araçlar bilgilendirme amaçlıdır; güncel mevzuata dayanır ancak somut dosyada mahkeme kararı, sözleşme ve delil durumuna göre sonuç değişebilir. Kesin değerlendirme için danışmanlık alınmalıdır.',
    },
    {
        q: 'Av. Fethi Güzel hangi bölgelerde hizmet veriyor?',
        a: 'Ofis Erciş / Van’dadır. Van, Erciş, Çaldıran, Özalp, Muradiye, Patnos, Ağrı; Bitlis hattında Tatvan, Bitlis, Adilcevaz, Ahlat; uzaktan ön değerlendirme ile Ankara bağlantılı dosyalar için bilgilendirme sayfaları vardır. Ayrıntı: hizmet-bolgeleri sayfası.',
    },
    {
        q: 'Akademik unvan, kitap ve dil bilgisi nedir?',
        a: 'Özel hukuk alanında doktora çalışmaları yürütülmektedir. “e-duruşma” monografisi Seçkin Yayıncılık’tan yayımlanmıştır. İyi düzeyde İngilizce konuşma ve yazma imkânı vardır. Ayrıntı: akademik-profil ve eserlerim sayfaları.',
    },
    {
        q: 'İçtihat ve Resmî Gazete güncellemeleri ne sıklıkla geliyor?',
        a: 'Günlük içtihat bölümü Yargıtay, Anayasa Mahkemesi ve Resmî Gazete kaynaklarından taranan gelişmeleri derler. Ana sayfa ve /icthat sayfasından en güncel özetlere ulaşabilirsiniz.',
    },
    {
        q: 'Danışmanlık veya randevu nasıl alınır?',
        a: 'Sayfanın altındaki iletişim bölümünden ofis adresine ve e-posta adresine ulaşabilirsiniz. Talebinizi e-posta ile iletebilir; yüz yüze görüşme için Erciş ofisini ziyaret edebilirsiniz. Reklam yasağına uygun, bilgilendirme odaklı iletişim tercih edilir.',
    },
    {
        q: 'İçerik ücretsiz mi? Kayıt zorunlu mu?',
        a: 'Mevzuat arama, madde okuma, şerhler, içtihat özetleri ve hesaplama araçları ücretsiz ve kayıtsız kullanılabilir. Amaç, kaliteli hukuki bilgiye açık erişim sağlamaktır.',
    },
    {
        q: 'Mobil uygulama var mı?',
        a: 'Evet. Av. Fethi Güzel Hukuk Portalı Android uygulaması Play Store üzerinden sunulmaktadır; web sitesindeki mevzuat ve araçlara mobil cihazdan erişim sağlar.',
    },
] as const;

export default function FaqSection() {
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: HOME_FAQS.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.a,
            },
        })),
    };

    return (
        <section
            id="sss"
            aria-labelledby="faq-heading"
            className="py-16 sm:py-24 md:py-28 px-5 sm:px-6 bg-white/40 border-y border-charcoal/5"
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10 sm:mb-14">
                    <p className="section-label mb-3">Sık sorulanlar</p>
                    <h2
                        id="faq-heading"
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal tracking-tight"
                    >
                        Merak edilenler,{' '}
                        <span className="font-drama italic text-accent font-medium">net cevaplar.</span>
                    </h2>
                    <p className="mt-4 text-charcoal/55 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                        Dünyanın en iyi hukuk siteleri ziyaretçiyi belirsizlikte bırakmaz.
                        Aşağıda en sık gelen soruların kısa yanıtları var.
                    </p>
                </div>

                <div className="space-y-3">
                    {HOME_FAQS.map((item) => (
                        <details
                            key={item.q}
                            className="group surface-card px-5 sm:px-6 py-1 open:shadow-lift transition-shadow"
                        >
                            <summary className="cursor-pointer list-none flex items-start justify-between gap-4 py-4 sm:py-5 font-heading font-bold text-charcoal text-[15px] sm:text-base leading-snug marker:content-none [&::-webkit-details-marker]:hidden">
                                <span>{item.q}</span>
                                <span
                                    aria-hidden
                                    className="shrink-0 mt-0.5 w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center text-lg leading-none group-open:rotate-45 transition-transform"
                                >
                                    +
                                </span>
                            </summary>
                            <p className="pb-5 text-charcoal/65 text-sm sm:text-[15px] leading-relaxed border-t border-charcoal/5 pt-4">
                                {item.a}
                            </p>
                        </details>
                    ))}
                </div>

                <p className="mt-10 text-center text-sm text-charcoal/50">
                    Başka bir sorunuz mu var?{' '}
                    <Link href="/#iletisim" className="text-accent font-bold hover:underline">
                        İletişime geçin
                    </Link>
                    {' · '}
                    <Link href="/ara" className="text-accent font-bold hover:underline">
                        Mevzuat arayın
                    </Link>
                </p>
            </div>
        </section>
    );
}
