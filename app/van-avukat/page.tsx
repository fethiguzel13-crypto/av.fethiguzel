import type { Metadata } from "next";
import IlceAvukatSayfasi, { IlceVerisi } from "@/components/IlceAvukatSayfasi";

export const metadata: Metadata = {
  title: "Van Avukat | Av. Fethi Güzel — Van Avukatlık Bürosu",
  description:
    "Van avukat arıyorsanız: Av. Fethi Güzel — ceza, aile, miras, gayrimenkul, iş ve ticaret hukuku. Van il merkezi dava vekilliği ve danışmanlık.",
  keywords: "Van avukat, Van avukatı, Avukat Fethi Güzel, Van boşanma avukatı, Van miras avukatı, Erciş avukat",
  alternates: { canonical: "https://avfethiguzel.com/van-avukat" },
  openGraph: {
    title: "Van Avukat | Av. Fethi Güzel",
    description: "Van'da hukuki danışmanlık ve dava vekilliği — Av. Fethi Güzel.",
    url: "https://avfethiguzel.com/van-avukat",
    images: [{ url: "/images/av-fethi-guzel-og.jpg", width: 1200, height: 630, alt: "Av. Fethi Güzel Van avukat" }],
  },
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
  neden: "Van'da yürütülen dava ve icra dosyalarında, gerektiğinde ilgili adliye ve kurumlara giderek işlemler bizzat takip edilir; müvekkillerimiz dosyanın her aşamasında düzenli olarak bilgilendirilir. Uzak mesafeden ön değerlendirme için e-posta veya video görüşmesi de mümkündür; ilk temas sonrası süreç netleştirilir.",
};

export default function VanAvukatPage() {
  return <IlceAvukatSayfasi veri={veri} />;
}
