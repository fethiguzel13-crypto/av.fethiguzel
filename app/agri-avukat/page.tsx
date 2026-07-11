import type { Metadata } from "next";
import IlceAvukatSayfasi, { IlceVerisi } from "@/components/IlceAvukatSayfasi";

export const metadata: Metadata = {
  title: "Ağrı Avukat | Av. Fethi Güzel Hukuk Bürosu",
  description: "Ağrı'da avukat mı arıyorsunuz? Ceza, aile, miras, gayrimenkul, iş ve icra hukuku alanlarında Av. Fethi Güzel'den danışmanlık ve dava vekilliği hizmeti alın; uzaktan görüşme imkânı mevcuttur.",
  alternates: { canonical: "https://avfethiguzel.com/agri-avukat" },
};

const veri: IlceVerisi = {
  ilce: "Ağrı",
  il: "Ağrı",
  slug: "agri-avukat",
  eyebrow: "Ağrı İli — Komşu Bölge Hizmeti",
  giris: [
    "Van iline komşu Ağrı ilinde ikamet eden veya bu ilde hukuki bir süreci bulunan müvekkillerimize, Erciş'teki ofisimizden hukuki danışmanlık ve dava vekilliği hizmeti sunulmaktadır.",
    "Mesafe göz önünde bulundurularak, ilk değerlendirme ve dosya takibinin büyük bölümü e-posta ve video görüşmesi üzerinden yürütülebilir; duruşma ve resmi işlemler için gerektiğinde ilgili adliyeye gidilerek temsil sağlanır.",
  ],
  neden: "Ağrı'dan bizimle iletişime geçen müvekkillerimize önce e-posta veya video görüşmesiyle ön bilgilendirme yapılır, dosyanın niteliğine göre süreç ve olası masraflar netleştirilir. Uzaktan iletişimde de aynı özen ve şeffaflıkla, her aşamada düzenli bilgilendirme sağlanır.",
};

export default function AgriAvukatPage() {
  return <IlceAvukatSayfasi veri={veri} />;
}
