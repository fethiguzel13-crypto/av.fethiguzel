import type { Metadata } from 'next';
import IlceAvukatSayfasi, { type IlceVerisi } from '@/components/IlceAvukatSayfasi';

export const metadata: Metadata = {
    title: 'Ahlat Avukat | Av. Fethi Güzel — Bitlis Ahlat Hukuki Destek',
    description:
        'Ahlat avukat: Av. Fethi Güzel — miras, aile, gayrimenkul, ceza ve iş hukuku. Erciş ofisten Ahlat ve Bitlis bölgesine danışmanlık.',
    keywords: 'Ahlat avukat, Ahlat avukatı, Bitlis Ahlat avukat, Fethi Güzel',
    alternates: { canonical: 'https://avfethiguzel.com/ahlat-avukat' },
    openGraph: {
        title: 'Ahlat Avukat | Av. Fethi Güzel',
        description: 'Ahlat ilçesinde hukuki danışmanlık bilgilendirmesi — Av. Fethi Güzel.',
        url: 'https://avfethiguzel.com/ahlat-avukat',
        images: [{ url: '/images/av-fethi-guzel-og.jpg', width: 1200, height: 630, alt: 'Ahlat avukat' }],
    },
};

const veri: IlceVerisi = {
    ilce: 'Ahlat',
    il: 'Bitlis',
    slug: 'ahlat-avukat',
    eyebrow: 'Ahlat · Bitlis — Hizmet bölgesi',
    giris: [
        'Ahlat ilçesinden hukuki destek arayanlar; Av. Fethi Güzel (Erciş / Van ofis) ile iletişime geçerek ön değerlendirme talep edebilir. Bitlis yargı çevresi dosyalarında planlı takip mümkündür.',
        'Özel hukuk alanında doktora çalışmaları, yayımlanmış e-duruşma monografisi ve iyi düzeyde İngilizce; bilgilendirme ve gerektiğinde yabancı uyruklu taraflarla iletişimde kullanılır.',
    ],
    neden:
        'Ahlat’ta miras, tapu, aile ve ceza dosyalarında e-posta ile ilk temas kurulur; belgeler incelenir, süreç ve ücret tarifeye uygun açıklanır. Komşu Adilcevaz, Tatvan ve Bitlis merkez talepleri de aynı büro kapsamındadır.',
};

export default function AhlatAvukatPage() {
    return <IlceAvukatSayfasi veri={veri} />;
}
