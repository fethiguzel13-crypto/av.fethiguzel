import type { Metadata } from "next";
import IlceAvukatSayfasi, { IlceVerisi } from "@/components/IlceAvukatSayfasi";

export const metadata: Metadata = {
  title: "Muradiye Avukat | Av. Fethi Güzel Hukuk Bürosu",
  description: "Van'a bağlı Muradiye ilçesinde avukat arayışındaysanız, Erciş'teki ofisimizden ceza, aile, miras, gayrimenkul ve iş hukuku alanlarında danışmanlık ve dava vekilliği hizmeti alabilirsiniz.",
  alternates: { canonical: "https://avfethiguzel.com/muradiye-avukat" },
};

const veri: IlceVerisi = {
  ilce: "Muradiye",
  il: "Van",
  slug: "muradiye-avukat",
  eyebrow: "Muradiye · Van'a Bağlı İlçe",
  giris: [
    "Van iline bağlı bir ilçe olan Muradiye'den gelen müvekkillerimize, Erciş'teki merkez ofisimizden hukuki danışmanlık ve dava vekilliği hizmeti sunulmaktadır. Muradiye'nin Erciş'e yakın konumu, ofisimize ulaşımı ve yüz yüze görüşmeyi kolaylaştırmaktadır.",
    "Aile hukukundan miras paylaşımına, tarımsal arazi ve gayrimenkul uyuşmazlıklarından icra takiplerine kadar, ilçede sıkça karşılaşılan hukuki meselelerde tecrübeli ve akademik bir yaklaşımla destek verilmektedir.",
  ],
  neden: "Muradiye'den ofisimize gelmekte güçlük yaşayan müvekkillerimiz için e-posta veya video görüşmesiyle ön değerlendirme yapılabilir; gerekli evraklar dijital ortamda kolayca paylaşılabilir. Dava sürecinin her aşamasında açık ve düzenli bilgilendirme esastır.",
};

export default function MuradiyeAvukatPage() {
  return <IlceAvukatSayfasi veri={veri} />;
}
