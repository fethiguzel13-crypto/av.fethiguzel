import type { Metadata } from 'next';
import IlceAvukatSayfasi, { type IlceVerisi } from '@/components/IlceAvukatSayfasi';

export const metadata: Metadata = {
    title: 'Adilcevaz Avukat | Av. Fethi Güzel — Bitlis Adilcevaz',
    description:
        'Adilcevaz avukat: Av. Fethi Güzel — aile, miras, gayrimenkul, ceza ve iş hukuku. Erciş merkez ofisten Adilcevaz ve Bitlis çevresine hukuki destek.',
    keywords: 'Adilcevaz avukat, Adilcevaz avukatı, Bitlis Adilcevaz, Fethi Güzel avukat',
    alternates: { canonical: 'https://avfethiguzel.com/adilcevaz-avukat' },
    openGraph: {
        title: 'Adilcevaz Avukat | Av. Fethi Güzel',
        description: 'Adilcevaz ilçesinde hukuki danışmanlık ve dava vekilliği bilgilendirmesi.',
        url: 'https://avfethiguzel.com/adilcevaz-avukat',
        images: [{ url: '/images/av-fethi-guzel-og.jpg', width: 1200, height: 630, alt: 'Adilcevaz avukat' }],
    },
};

const veri: IlceVerisi = {
    ilce: 'Adilcevaz',
    il: 'Bitlis',
    slug: 'adilcevaz-avukat',
    eyebrow: 'Adilcevaz · Bitlis — Hizmet bölgesi',
    giris: [
        'Adilcevaz’da ikamet eden veya Adilcevaz / Bitlis yargı çevresinde dosyası olan müvekkiller; Av. Fethi Güzel ile e-posta veya randevu yoluyla iletişime geçebilir. Ofis Erciş’tedir; bölge dosyaları planlı takip edilir.',
        'Miras, aile, tarım ve gayrimenkul uyuşmazlıkları ile ceza ve icra işlerinde; akademik birikim (özel hukuk doktora çalışmaları, e-duruşma kitabı) ve saha tecrübesi birlikte sunulur.',
    ],
    neden:
        'Adilcevaz ile Ahlat, Tatvan ve Bitlis merkez arasındaki mesafe gözetilerek; ilk görüşme dijital veya yüz yüze planlanabilir. Şeffaf bilgilendirme ve yazılı vekâlet süreçleri standarttır.',
};

export default function AdilcevazAvukatPage() {
    return <IlceAvukatSayfasi veri={veri} />;
}
