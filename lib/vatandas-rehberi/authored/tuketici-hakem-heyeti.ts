import type { VatandasArticle } from '../types';

/**
 * Kaynak doğrulaması — hepsi content-packs/tkhk.json.gz resmî metninden:
 *   TKHK m.11  ayıplı malda seçimlik haklar · müteselsil sorumluluk
 *   TKHK m.68  hakem heyetine başvuru zorunluluğu · parasal sınır ve
 *              her yıl yeniden değerleme oranında artış · yetkili heyet
 *              · heyetin bulunmadığı yerde kaymakamlık
 *
 * Doğrulama: node scripts/madde.mjs tkhk 11 · 68
 *
 * NOT: Parasal sınır her takvim yılı başında yeniden değerleme oranıyla
 * artar. Metinde GÜNCEL TUTAR VERİLMEZ; mekanizma anlatılır. 7392 sayılı
 * Kanunla 2022'de belirlenen otuz bin liralık taban yalnız düzenlemenin
 * kaynağı olarak anılır.
 */
export const tuketiciHakemHeyeti: VatandasArticle = {
  slug: 'tuketici-hakem-heyeti-basvurusu',
  title: 'Tüketici Hakem Heyeti: Başvuru Sınırı, Yetki ve Ayıplı Mal Hakları',
  description:
    'Tüketici hakem heyetine hangi tutara kadar başvurulur, nereye başvurulur, ayıplı malda hangi haklar kullanılır? TKHK m.11 ve m.68 çerçevesinde.',
  h1: 'Tüketici hakem heyetine nasıl başvurulur?',
  keywords: [
    'tüketici hakem heyeti',
    'tüketici şikayeti',
    'ayıplı mal',
    'tüketici hakem heyeti parasal sınır',
    'ücretsiz onarım',
    'bedel iadesi',
  ],
  category: 'Tüketici',
  role: 'pillar',
  related: ['zamanasimi-sureleri'],
  links: [
    { label: 'TKHK m.11 — Tüketicinin seçimlik hakları', href: '/mevzuat/tkhk/madde-11' },
    { label: 'TKHK m.68 — Hakem heyetine başvuru', href: '/mevzuat/tkhk/madde-68' },
  ],
  lead:
    'Değeri kanunda belirlenen parasal sınırın altında kalan tüketici uyuşmazlıklarında tüketici hakem heyetine başvuru zorunludur; bu sınırın üzerindeki uyuşmazlıklar için hakem heyetine başvuru yapılamaz ve doğrudan tüketici mahkemesine gidilir.',
  keyInsight:
    'Parasal sınır her takvim yılı başında yeniden değerleme oranında artar; başvurudan önce o yıl için ilan edilen güncel tutara bakmak gerekir.',
  sections: [
    {
      heading: 'Hangi uyuşmazlıklar hakem heyetine gider?',
      paragraphs: [
        'Sınır hem alt hem üst işlev görür. TKHK m.68 uyarınca, tarafların İcra ve İflas Kanunundaki hakları saklı kalmak kaydıyla, değeri kanunda belirlenen tutarın altında bulunan uyuşmazlıklarda tüketici hakem heyetlerine başvuru zorunludur; bu değerlerin üzerindeki uyuşmazlıklar için ise hakem heyetlerine başvuru yapılamaz.',
        'Yani hakem heyeti bir tercih değil, küçük uyuşmazlıklarda zorunlu bir duraktır. Sınırın üzerinde kalan uyuşmazlıklarda ise doğrudan tüketici mahkemesine başvurulur; hakem heyetine gitmek zaman kaybı olur.',
        'Parasal sınır sabit değildir. Madde, sınırların her takvim yılı başından itibaren geçerli olmak üzere Vergi Usul Kanununun mükerrer 298. maddesi uyarınca tespit ve ilan edilen yeniden değerleme oranında artırılarak uygulanacağını söyler; artışların hesabında bin Türk lirasının küsuru dikkate alınmaz.',
        'Bu nedenle burada bir rakam vermek yerine, başvurudan önce ilgili yıl için ilan edilen tutarın kontrol edilmesi gerektiğini söylemek daha doğrudur. Mevcut düzenlemenin kaynağı 7392 sayılı Kanunla yapılan değişikliktir.',
      ],
    },
    {
      heading: 'Nereye başvurulur?',
      paragraphs: [
        'Tüketiciye seçim hakkı tanınmıştır. Başvurular, tüketicinin yerleşim yerinin bulunduğu veya tüketici işleminin yapıldığı yerdeki tüketici hakem heyetine yapılabilir.',
        'Bu iki seçenek tüketici lehinedir; başka şehirden alışveriş yapan kişi kendi ilçesindeki heyete başvurabilir. Satıcının adresine gitme zorunluluğu yoktur.',
        'Heyetin bulunmadığı yerlerde de kapı kapanmaz. 7392 sayılı Kanunla eklenen cümle uyarınca başvurular o ilçe kaymakamlığına yapılabilir; kaymakamlıklar bu başvuruları gereği yapılmak üzere Bakanlıkça belirlenen yetkili tüketici hakem heyetine iletir.',
        'Heyetin takdir yetkisi yoktur: Tüketici hakem heyetleri kendilerine yapılan başvuruları gereğini yapmak üzere kabul etmek zorundadır.',
      ],
    },
    {
      heading: 'Ayıplı malda dört seçimlik hak',
      paragraphs: [
        'Uyuşmazlıkların büyük kısmı ayıplı mal ve hizmetten doğar. TKHK m.11 tüketiciye dört seçenek tanır ve seçim hakkını tüketiciye bırakır.',
        'Tüketici; satılanı geri vermeye hazır olduğunu bildirerek sözleşmeden dönebilir, satılanı alıkoyup ayıp oranında satış bedelinden indirim isteyebilir, aşırı bir masraf gerektirmediği takdirde bütün masrafları satıcıya ait olmak üzere ücretsiz onarım isteyebilir ya da imkân varsa ayıpsız misliyle değiştirilmesini talep edebilir.',
        'Satıcının pazarlık hakkı yoktur: Satıcı, tüketicinin tercih ettiği bu talebi yerine getirmekle yükümlüdür. Uygulamada sık görülen "önce onaralım" yaklaşımı, tüketici değişim veya iade istediyse hukuken bağlayıcı değildir.',
        'Muhatap yalnız satıcı da değildir. Ücretsiz onarım veya ayıpsız misliyle değiştirme hakları üretici veya ithalatçıya karşı da kullanılabilir ve bu haklar bakımından satıcı, üretici ve ithalatçı müteselsilen sorumludur. Üretici veya ithalatçı, ayıbın malı piyasaya sürmesinden sonra doğduğunu ispat ederse sorumluluktan kurtulur.',
      ],
      bullets: [
        'Sözleşmeden dönme — bedel iadesi',
        'Ayıp oranında bedelden indirim',
        'Ücretsiz onarım',
        'Ayıpsız misliyle değiştirme',
      ],
    },
    {
      heading: 'Başvuru süreci nasıl işler?',
      paragraphs: [
        'Başvuru yazılı olarak ya da elektronik ortamda yapılır. Tüketici Bilgi Sistemi üzerinden e-Devlet ile giriş yapılarak başvuru oluşturmak, evrakın kaybolma riskini ortadan kaldırır ve süreci takip etmeyi kolaylaştırır.',
        'Başvuruda uyuşmazlığın konusu, talep edilen çözüm ve dayanak belgeler yer almalıdır. Fatura, garanti belgesi, servis formu ve yazışmalar dosyanın omurgasını oluşturur.',
        'Hakem heyeti kararları taraflar için bağlayıcıdır. Karara karşı tüketici mahkemesine itiraz yolu açıktır; itiraz süresi kararın tebliğinden itibaren işler ve kaçırılması kararı kesinleştirir.',
      ],
    },
    {
      heading: 'Sık yapılan hatalar',
      paragraphs: [
        'Birinci hata, parasal sınırı yanlış hesaplamaktır. Sınır her yıl değiştiğinden, geçen yılın rakamıyla yapılan değerlendirme başvurunun reddine ya da yanlış mercie gidilmesine yol açar.',
        'İkincisi, seçimlik hakkı belirtmeden başvurmaktır. Hangi hakkı kullandığınızı açıkça yazmazsanız satıcı en kolay çözümü, çoğu zaman onarımı önerir.',
        'Üçüncüsü belgesiz başvurudur. Fatura ve garanti belgesi olmadan yapılan başvurularda ispat yükü ağırlaşır; ödeme kaydı veya kredi kartı ekstresi dahi işe yarar.',
      ],
    },
  ],
  steps: [
    'Uyuşmazlığın parasal değerini belirleyin ve o yıl için ilan edilen hakem heyeti sınırıyla karşılaştırın.',
    'Sınırın altındaysa hakem heyetine, üzerindeyse tüketici mahkemesine başvurun.',
    'Yerleşim yerinizdeki veya işlemin yapıldığı yerdeki heyeti seçin; heyet yoksa kaymakamlığa başvurun.',
    'Ayıplı malda hangi seçimlik hakkı kullandığınızı açıkça yazın.',
    'Fatura, garanti belgesi, servis formu ve yazışmaları ekleyin.',
    'Başvuruyu Tüketici Bilgi Sistemi üzerinden yapıp takip numarasını saklayın.',
    'Karar aleyhinize çıkarsa süresi içinde tüketici mahkemesine itiraz edin.',
  ],
  checklist: [
    'Fatura veya satış belgesi',
    'Garanti belgesi',
    'Servis giriş ve çıkış formları',
    'Satıcıyla yazışmalar ve mesajlar',
    'Ödeme kaydı veya kart ekstresi',
    'Ayıbı gösteren fotoğraf veya rapor',
  ],
  faq: [
    {
      q: 'Tüketici hakem heyetine hangi tutara kadar başvurulur?',
      a: 'Kanunda belirlenen parasal sınırın altındaki uyuşmazlıklarda başvuru zorunludur; üzerindekiler için başvuru yapılamaz. Sınır her takvim yılı başında yeniden değerleme oranında artırılarak ilan edilir, bu yüzden başvurudan önce güncel tutara bakılmalıdır.',
    },
    {
      q: 'Nereye başvurabilirim?',
      a: 'Yerleşim yerinizin bulunduğu veya tüketici işleminin yapıldığı yerdeki hakem heyetine. Heyetin bulunmadığı yerlerde ilçe kaymakamlığına başvurulur; kaymakamlık yetkili heyete iletir.',
    },
    {
      q: 'Hakem heyeti başvurumu reddedebilir mi?',
      a: 'Başvuruyu kabul etmek zorundadır. TKHK m.68, hakem heyetlerinin kendilerine yapılan başvuruları gereğini yapmak üzere kabul etmekle yükümlü olduğunu söyler.',
    },
    {
      q: 'Ayıplı üründe hangi hakları kullanabilirim?',
      a: 'Dört seçenekten birini: sözleşmeden dönme, bedelden indirim, ücretsiz onarım veya ayıpsız misliyle değiştirme. Seçim size aittir ve satıcı tercih ettiğiniz talebi yerine getirmekle yükümlüdür.',
    },
    {
      q: 'Satıcı yerine üreticiye başvurabilir miyim?',
      a: 'Ücretsiz onarım ve ayıpsız misliyle değiştirme hakları üretici veya ithalatçıya karşı da kullanılabilir; bu haklarda satıcı, üretici ve ithalatçı müteselsilen sorumludur.',
    },
    {
      q: 'Hakem heyeti kararı bağlayıcı mı?',
      a: 'Evet, taraflar için bağlayıcıdır. Karara karşı tüketici mahkemesine itiraz edilebilir; süresi içinde itiraz edilmezse karar kesinleşir.',
    },
    {
      q: 'Sınırın üzerindeki uyuşmazlıkta önce hakem heyetine gitmem gerekir mi?',
      a: 'Hayır. Sınırın üzerindeki uyuşmazlıklar için hakem heyetine başvuru yapılamaz; doğrudan tüketici mahkemesine gidilir.',
    },
  ],
  updated: '2026-08-16',
  sitemapPriority: 0.93,
};
