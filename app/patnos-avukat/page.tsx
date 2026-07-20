import type { Metadata } from "next";
import IlceAvukatSayfasi, { IlceVerisi } from "@/components/IlceAvukatSayfasi";

export const metadata: Metadata = {
  title: "Patnos Avukat | Av. Fethi Güzel — Ağrı Patnos",
  description:
    "Patnos avukat: Av. Fethi Güzel — ceza, aile, miras, gayrimenkul ve iş hukuku. Ağrı Patnos için danışmanlık ve dava vekilliği.",
  keywords: "Patnos avukat, Patnos avukatı, Ağrı Patnos avukat, Fethi Güzel",
  alternates: { canonical: "https://avfethiguzel.com/patnos-avukat" },
  openGraph: {
    title: "Patnos Avukat | Av. Fethi Güzel",
    url: "https://avfethiguzel.com/patnos-avukat",
    images: [{ url: "/images/av-fethi-guzel-og.jpg", width: 1200, height: 630, alt: "Av. Fethi Güzel Patnos avukat" }],
  },
};

const veri: IlceVerisi = {
  ilce: "Patnos",
  il: "Ağrı",
  slug: "patnos-avukat",
  eyebrow: "Patnos · Ağrı'ya Bağlı İlçe",
  giris: [
    "Ağrı iline bağlı Patnos ilçesinden gelen müvekkillerimize, Erciş'teki merkez ofisimizden hukuki danışmanlık ve dava vekilliği hizmeti sunulmaktadır. Bölgeye olan yakınlığımız, dosya takibinde hızlı iletişim kurulmasını kolaylaştırmaktadır.",
    "Aile hukuku, miras paylaşımı, gayrimenkul ve arazi uyuşmazlıkları, iş hukuku ve icra takipleri gibi ilçede sıkça karşılaşılan konularda, akademik bilgi birikimi ve dava tecrübesiyle destek verilmektedir.",
  ],
  neden: "Patnos'tan ofisimize ulaşmakta güçlük yaşayan müvekkillerimiz için e-posta veya video görüşmesiyle ön değerlendirme yapılabilir. Süreç boyunca evrak paylaşımı dijital ortamda kolaylaştırılır ve dosyanızın her aşamasında açık, düzenli bilgilendirme sağlanır.",
};

export default function PatnosAvukatPage() {
  return <IlceAvukatSayfasi veri={veri} />;
}
