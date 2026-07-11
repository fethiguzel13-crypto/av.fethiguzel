import type { Metadata } from "next";
import IlceAvukatSayfasi, { IlceVerisi } from "@/components/IlceAvukatSayfasi";

export const metadata: Metadata = {
  title: "Erciş Avukat | Av. Fethi Güzel Hukuk Bürosu",
  description: "Erciş'te avukat arıyorsanız, ceza, aile, miras, gayrimenkul, iş ve icra hukuku alanlarında Av. Fethi Güzel Hukuk Bürosu'ndan danışmanlık ve dava vekilliği hizmeti alabilirsiniz.",
  alternates: { canonical: "https://avfethiguzel.com/ercis-avukat" },
};

const veri: IlceVerisi = {
  ilce: "Erciş",
  il: "Van",
  slug: "ercis-avukat",
  eyebrow: "Erciş · Van — Merkez Ofis",
  giris: [
    "Av. Fethi Güzel Hukuk Bürosu'nun merkez ofisi Erciş'te, Van Yolu Mahallesi'nde yer almaktadır. Erciş ve çevresinde yaşayan müvekkillerimize yüz yüze görüşme imkânıyla, randevu alarak veya doğrudan ofisimize gelerek danışmanlık alabilirsiniz.",
    "Ceza davalarından aile hukukuna, miras paylaşımından gayrimenkul uyuşmazlıklarına kadar geniş bir yelpazede, akademik bilgi birikimini pratik dava tecrübesiyle birleştiren bir yaklaşımla hizmet verilmektedir.",
  ],
  neden: "Erciş'te ikamet eden veya Erciş'teki mahkeme ve icra dairelerinde işi bulunan müvekkillerimiz için ofisimize kolayca ulaşabilir, dosyanızla ilgili yüz yüze ve ayrıntılı bir görüşme yapabilirsiniz. Şeffaf ücretlendirme, düzenli bilgilendirme ve akademik titizlikle hazırlanan dilekçe ve savunmalar, süreç boyunca önceliğimizdir.",
};

export default function ErcisAvukatPage() {
  return <IlceAvukatSayfasi veri={veri} />;
}
