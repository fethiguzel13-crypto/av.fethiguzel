import type { Metadata } from 'next';
import IlceAvukatSayfasi, { type IlceVerisi } from '@/components/IlceAvukatSayfasi';

export const metadata: Metadata = {
    title: 'Ankara Avukat | Av. Fethi Güzel — Uzaktan & Dosya Takibi',
    description:
        'Ankara avukat arayışında bilgilendirme: Av. Fethi Güzel — özel hukuk doktora çalışmaları, yayımlanmış e-duruşma eseri, iyi düzeyde İngilizce. Erciş ofisinden e-posta, video ve gerektiğinde Ankara dosya takibi.',
    keywords:
        'Ankara avukat, Ankara avukatı, Avukat Fethi Güzel, Ankara hukuki danışmanlık, İngilizce bilen avukat Ankara, özel hukuk',
    alternates: { canonical: 'https://avfethiguzel.com/ankara-avukat' },
    openGraph: {
        title: 'Ankara Avukat | Av. Fethi Güzel',
        description:
            'Ankara’da görülen veya Ankara bağlantılı dosyalar için ön değerlendirme ve vekillik bilgilendirmesi — Av. Fethi Güzel.',
        url: 'https://avfethiguzel.com/ankara-avukat',
        images: [
            {
                url: '/images/av-fethi-guzel-og.jpg',
                width: 1200,
                height: 630,
                alt: 'Av. Fethi Güzel Ankara avukat bilgilendirme',
            },
        ],
    },
};

const veri: IlceVerisi = {
    ilce: 'Ankara',
    il: 'Ankara',
    slug: 'ankara-avukat',
    eyebrow: 'Ankara · Başkent — Uzaktan erişim ve dosya takibi',
    giris: [
        'Ankara’da ikamet eden veya Ankara mahkemeleri, icra daireleri ya da idari mercilerde süreci bulunan kişiler; Av. Fethi Güzel ile e-posta ve video görüşmesi yoluyla ön değerlendirme yapabilir. Merkez ofis Erciş / Van’dadır; vekillik ilişkisinin kurulması hâlinde dosya takibi ve gerektiğinde Ankara’ya seyahat planlanır.',
        'Özel hukuk alanında doktora çalışmaları yürüten, “e-duruşma” monografisinin yazarı ve iyi düzeyde İngilizce bilen bir avukat olarak; borçlar, ticaret, aile, miras, iş ve usul hukuku dosyalarında akademik titizlikle bilgilendirme ve temsil sunulur. Bu sayfa reklam niteliğinde vaat içermez; mesleki bilgilendirme amaçlıdır.',
    ],
    neden:
        'Başkentte görülen davalarda veya Ankara merkezli müvekkillerde ilk temas çoğu zaman dijitaldir: belgeler paylaşılır, hukuki çerçeve açıklanır, ücret ve süreç Avukatlık Asgari Ücret Tarifesi çerçevesinde netleştirilir. İngilizce yazışma veya yabancılarla ilgili belgelerde iletişim mümkündür. Somut uyuşmazlıkta mutlaka yazılı vekâlet ve açık anlaşma esastır.',
};

export default function AnkaraAvukatPage() {
    return <IlceAvukatSayfasi veri={veri} />;
}
