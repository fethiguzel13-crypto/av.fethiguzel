import type { Metadata } from 'next';
import IlceAvukatSayfasi, { type IlceVerisi } from '@/components/IlceAvukatSayfasi';

export const metadata: Metadata = {
    title: 'Bitlis Avukat | Av. Fethi Güzel — Bitlis Hukuki Danışmanlık',
    description:
        'Bitlis avukat arayanlar için bilgilendirme: Av. Fethi Güzel — aile, miras, ceza, iş ve gayrimenkul hukuku. Erciş ofis, Bitlis ve ilçelerinde dosya takibi.',
    keywords: 'Bitlis avukat, Bitlis avukatı, Avukat Fethi Güzel, Bitlis boşanma avukatı, Van Bitlis',
    alternates: { canonical: 'https://avfethiguzel.com/bitlis-avukat' },
    openGraph: {
        title: 'Bitlis Avukat | Av. Fethi Güzel',
        description: 'Bitlis il merkezi ve ilçelerinde hukuki destek bilgilendirmesi.',
        url: 'https://avfethiguzel.com/bitlis-avukat',
        images: [{ url: '/images/av-fethi-guzel-og.jpg', width: 1200, height: 630, alt: 'Bitlis avukat Av. Fethi Güzel' }],
    },
};

const veri: IlceVerisi = {
    ilce: 'Bitlis',
    il: 'Bitlis',
    slug: 'bitlis-avukat',
    eyebrow: 'Bitlis İl Merkezi — Hizmet bölgesi',
    giris: [
        'Bitlis il merkezinde veya Bitlis adliyesinde süreci bulunan kişiler; Av. Fethi Güzel Hukuk Bürosu (Erciş / Van) ile ön değerlendirme ve gerektiğinde dosya takibi için iletişime geçebilir.',
        'Akademik şerh disiplini, yayımlanmış usul hukuku eseri ve özel hukuk doktora çalışmaları; Bitlis bölgesi müvekkillerine sunulan danışmanlığın dayanağını oluşturur.',
    ],
    neden:
        'Bitlis, Tatvan, Ahlat ve Adilcevaz hattında aile, miras, ceza ve icra dosyaları için e-posta ile ilk temas kurulabilir; randevu sonrası süreç ve ücret tarifeye uygun şekilde netleştirilir. Reklam yasağına uygun, bilgilendirme odaklı iletişim esastır.',
};

export default function BitlisAvukatPage() {
    return <IlceAvukatSayfasi veri={veri} />;
}
