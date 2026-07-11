import type { Metadata } from "next";
import IlceAvukatSayfasi, { IlceVerisi } from "@/components/IlceAvukatSayfasi";

export const metadata: Metadata = {
  title: "Van Avukat | Av. Fethi Güzel Hukuk Bürosu",
  description: "Van il merkezinde avukat mı arıyorsunuz? Ceza, aile, miras, gayrimenkul, iş ve ticaret hukuku alanlarında Av. Fethi Güzel'den danışmanlık ve dava vekilliği hizmeti alın.",
  alternates: { canonical: "https://avfethiguzel.com/van-avukat" },
};

const veri: IlceVerisi = {
  ilce: "Van",
  il: "Van",
  slug: "van-avukat",
  eyebrow: "Van İl Merkezi — Hizmet Bölgesi",
  giris: [
    "Van il merkezinde ikamet eden veya Van'daki mahkemelerde, icra dairelerinde ya da idari makamlarda süreci bulunan müvekkillerimize, Erciş'teki ofisimizden kesintisiz hukuki destek sağlanmaktadır.",
    "İl merkezinin yoğun iş hacmi göz önünde bulundurularak; ticaret hukuku, şirket danışmanlığı, gayrimenkul uyuşmazlıkları ve idari işlemlerde dava takibi başta olmak üzere geniş kapsamlı bir hizmet sunulmaktadır.",
  ],
  neden: "Van'da yürütülen dava ve icra dosyalarında, gerektiğinde ilgili adliye ve kurumlara giderek işlemler bizzat takip edilir; müvekkillerimiz dosyanın her aşamasında düzenli olarak bilgilendirilir. Uzak mesafeden ön değerlendirme için telefon veya video görüşmesi de mümkündür; ilk temas sonrası süreç netleştirilir.",
};

export default function VanAvukatPage() {
  return <IlceAvukatSayfasi veri={veri} />;
}
