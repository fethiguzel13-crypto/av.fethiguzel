import type { Metadata } from "next";
import IlceAvukatSayfasi, { IlceVerisi } from "@/components/IlceAvukatSayfasi";

export const metadata: Metadata = {
    title: "Çaldıran Avukat | Av. Fethi Güzel — Van Çaldıran Hukuk",
    description:
        "Çaldıran avukat arıyorsanız: Av. Fethi Güzel — ceza, aile, miras, gayrimenkul, iş ve icra hukuku. Erciş ofisinden Çaldıran ve Van bölgesine dava vekilliği.",
    keywords:
        "Çaldıran avukat, Çaldıran avukatı, Van Çaldıran avukat, Fethi Güzel, boşanma avukatı Çaldıran, miras avukatı",
    alternates: { canonical: "https://avfethiguzel.com/caldiran-avukat" },
    openGraph: {
        title: "Çaldıran Avukat | Av. Fethi Güzel",
        description: "Çaldıran ve çevresinde hukuki danışmanlık ve dava vekilliği.",
        url: "https://avfethiguzel.com/caldiran-avukat",
        images: [{ url: "/images/av-fethi-guzel-og.jpg", width: 1200, height: 630, alt: "Av. Fethi Güzel — Çaldıran avukat" }],
    },
};

const veri: IlceVerisi = {
    ilce: "Çaldıran",
    il: "Van",
    slug: "caldiran-avukat",
    eyebrow: "Çaldıran · Van — Hizmet Bölgesi",
    giris: [
        "Çaldıran ilçesinde ikamet eden veya Çaldıran ve Van adliyelerinde işi bulunan müvekkillerimize, Erciş merkez ofisimizden Av. Fethi Güzel tarafından hukuki danışmanlık ve dava vekilliği sunulmaktadır.",
        "Aile hukuku, miras paylaşımı, gayrimenkul ve ceza dosyalarında; mesafeye rağmen düzenli bilgilendirme ve gerektiğinde yerinde takip ile süreç yönetilir.",
    ],
    neden:
        "Çaldıran avukat arayışında olanlar için ofisimiz Erciş'te konumlanmıştır; Çaldıran'a ve Van il merkezine erişim planlanarak duruşma ve icra işlemleri takip edilir. Ön değerlendirme e-posta veya video ile de yapılabilir.",
};

export default function CaldiranAvukatPage() {
    return <IlceAvukatSayfasi veri={veri} />;
}
