import type { Metadata } from "next";
import IlceAvukatSayfasi, { IlceVerisi } from "@/components/IlceAvukatSayfasi";

export const metadata: Metadata = {
    title: "Özalp Avukat | Av. Fethi Güzel — Van Özalp Hukuk Bürosu",
    description:
        "Özalp avukat arıyorsanız: Av. Fethi Güzel — ceza, aile, miras, tapu, iş ve icra hukuku. Erciş ofisinden Özalp ve Van bölgesine profesyonel hukuki destek.",
    keywords:
        "Özalp avukat, Özalp avukatı, Van Özalp avukat, Fethi Güzel, boşanma avukatı Özalp, gayrimenkul avukatı",
    alternates: { canonical: "https://avfethiguzel.com/ozalp-avukat" },
    openGraph: {
        title: "Özalp Avukat | Av. Fethi Güzel",
        description: "Özalp ve çevresinde hukuki danışmanlık ve dava vekilliği.",
        url: "https://avfethiguzel.com/ozalp-avukat",
        images: [{ url: "/images/av-fethi-guzel-og.jpg", width: 1200, height: 630, alt: "Av. Fethi Güzel — Özalp avukat" }],
    },
};

const veri: IlceVerisi = {
    ilce: "Özalp",
    il: "Van",
    slug: "ozalp-avukat",
    eyebrow: "Özalp · Van — Hizmet Bölgesi",
    giris: [
        "Özalp ilçesinden ve çevresinden gelen müvekkillerimize Av. Fethi Güzel, Erciş'teki ofisinden ceza, aile, miras, gayrimenkul ve icra hukuku başta olmak üzere kapsamlı hukuki destek vermektedir.",
        "Özalp avukat arayışında olanlar; şeffaf ücretlendirme, dosya takibinde düzenli bilgilendirme ve gerektiğinde Van adliyesinde temsil ile süreçlerini yürütebilir.",
    ],
    neden:
        "Özalp'ta yaşayan veya Özalp ile bağlantılı hukuki uyuşmazlığı bulunan kişiler, mesafeyi aşmak zorunda kalmadan önce e-posta veya video görüşmesiyle ön değerlendirme alabilir; randevu ile Erciş ofisinde yüz yüze görüşme planlanabilir.",
};

export default function OzalpAvukatPage() {
    return <IlceAvukatSayfasi veri={veri} />;
}
