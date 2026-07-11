import type { Metadata } from "next";
import IlceAvukatSayfasi, { IlceVerisi } from "@/components/IlceAvukatSayfasi";

export const metadata: Metadata = {
  title: "Patnos Avukat | Av. Fethi Güzel Hukuk Bürosu",
  description: "Ağrı'ya bağlı Patnos ilçesinde avukat arayışındaysanız, ceza, aile, miras, gayrimenkul ve iş hukuku alanlarında Av. Fethi Güzel'den danışmanlık ve dava vekilliği hizmeti alabilirsiniz.",
  alternates: { canonical: "https://avfethiguzel.com/patnos-avukat" },
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
