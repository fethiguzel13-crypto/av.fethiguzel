import type { Metadata } from 'next';
import IlceAvukatSayfasi, { type IlceVerisi } from '@/components/IlceAvukatSayfasi';

export const metadata: Metadata = {
    title: 'Tatvan Avukat | Av. Fethi Güzel — Bitlis Tatvan Hukuki Destek',
    description:
        'Tatvan avukat: Av. Fethi Güzel — Van Erciş merkez ofisten Tatvan ve Bitlis bölgesine danışmanlık ve dava vekilliği. Aile, miras, ceza, iş, gayrimenkul.',
    keywords:
        'Tatvan avukat, Tatvan avukatı, Bitlis Tatvan avukat, Avukat Fethi Güzel, Van Bitlis avukat',
    alternates: { canonical: 'https://avfethiguzel.com/tatvan-avukat' },
    openGraph: {
        title: 'Tatvan Avukat | Av. Fethi Güzel',
        description: 'Tatvan ve çevresinde hukuki danışmanlık ve dava vekilliği bilgilendirmesi.',
        url: 'https://avfethiguzel.com/tatvan-avukat',
        images: [{ url: '/images/av-fethi-guzel-og.jpg', width: 1200, height: 630, alt: 'Tatvan avukat Av. Fethi Güzel' }],
    },
};

const veri: IlceVerisi = {
    ilce: 'Tatvan',
    il: 'Bitlis',
    slug: 'tatvan-avukat',
    eyebrow: 'Tatvan · Bitlis — Hizmet bölgesi',
    giris: [
        'Tatvan ilçesinde yaşayan veya Tatvan ve Bitlis adliyelerinde dosyası bulunan müvekkiller; Erciş’teki ofisimiz üzerinden Av. Fethi Güzel ile iletişime geçebilir. Van–Bitlis hattı ulaşımı ve dijital ön görüşme ile süreç planlanır.',
        'Özel hukuk doktora çalışmaları ve yayımlanmış e-duruşma eseriyle akademik arka plan; ceza, aile, miras, gayrimenkul ve iş hukuku dosyalarında pratik takip ile birleştirilir.',
    ],
    neden:
        'Tatvan’da sık karşılaşılan aile, miras, kira ve gayrimenkul uyuşmazlıkları ile ceza ve icra dosyalarında; e-posta veya yüz yüze randevu ile ön değerlendirme yapılır. Bitlis, Ahlat ve Adilcevaz ile komşu ilçelerden gelen talepler de aynı büro çerçevesinde ele alınır.',
};

export default function TatvanAvukatPage() {
    return <IlceAvukatSayfasi veri={veri} />;
}
