import type { VatandasArticle } from '../types';

/**
 * Kaynak doğrulaması — content-packs/imar.json.gz resmî metninden:
 *   3194 m.32  ruhsatsız veya ruhsata aykırı yapıda tespit · mühürleme
 *              · tapu beyanlar hanesine kayıt ve yedi günlük bildirim
 *                (7221 s.K.) · yapı tatil zaptının asılmasıyla tebliğ
 *              · muhtara ve İl Müdürlüğüne nüsha · bir ay içinde ruhsata
 *                uygun hâle getirme veya ruhsat alma
 *
 * Doğrulama: node scripts/madde.mjs imar 32
 *
 * NOT: İdari para cezaları (3194 m.42) bu metne HENÜZ alınmadı; madde
 * okunup doğrulanınca eklenecek. Ceza tutarları her yıl yeniden değerleme
 * oranıyla arttığından metinde SAYI VERİLMEZ.
 */
export const kacakYapi: VatandasArticle = {
  slug: 'kacak-yapi-ve-muhurleme',
  title: 'Kaçak Yapı: Mühürleme, Bir Aylık Süre ve Tapuya Şerh',
  description:
    'Yapı mühürlendi ne yapmalıyım, tebligat ne zaman yapılmış sayılır, bir aylık süre ne zaman başlar, tapuya şerh nasıl kalkar? İmar Kanunu m.32 çerçevesinde.',
  h1: 'Yapı mühürlendi, ne yapmalısınız?',
  keywords: [
    'kaçak yapı',
    'yapı mühürleme',
    'yapı tatil zaptı',
    'ruhsata aykırı yapı',
    'imar para cezası',
    'tapu beyanlar hanesi',
  ],
  category: 'İmar',
  role: 'pillar',
  related: ['kamulastirma-sureci'],
  links: [
    { label: '3194 s.K. m.32 — Ruhsatsız veya ruhsata aykırı yapı', href: '/mevzuat/imar/madde-32' },
    { label: '3194 s.K. m.42 — İdari müeyyideler', href: '/mevzuat/imar/madde-42' },
  ],
  lead:
    'Ruhsatsız veya ruhsata aykırı yapı tespit edildiğinde yapı mühürlenerek inşaat derhal durdurulur. Yapı sahibinin, tebliğ tarihinden itibaren en çok bir ay içinde yapıyı ruhsata uygun hâle getirmesi ya da ruhsat alması gerekir.',
  keyInsight:
    'Tebligat elinize verilmez: Durdurma, yapı tatil zaptının yapı yerine asılmasıyla yapı sahibine tebliğ edilmiş sayılır ve bir aylık süre o andan işler.',
  sections: [
    {
      heading: 'Tespit ve mühürleme',
      paragraphs: [
        'Süreç idarenin bilgi sahibi olmasıyla başlar. İmar Kanunu m.32 uyarınca ruhsat alınmadan yapıya başlandığı veya ruhsat ve eklerine ya da ruhsat alınmadan yapılabilecek yapılarda projelerine ve ilgili mevzuatına aykırı yapı yapıldığı ilgili idarece tespit edilirse, belediye veya valiliklerce o andaki inşaat durumu tespit edilir.',
        'Sonuç serttir ve derhaldir: Yapı mühürlenerek inşaat derhal durdurulur.',
        'Tespit yalnız idarenin denetimiyle olmaz. Fennî mesulün tespiti ve ihbarı ya da herhangi bir şekilde bu duruma muttali olunması da aynı sonucu doğurur; komşu ihbarı bu yolla süreci başlatabilir.',
      ],
    },
    {
      heading: 'Tapuya şerh: 2020 ile gelen ağırlaştırma',
      paragraphs: [
        '7221 sayılı Kanunla eklenen cümleler, aykırılığın taşınmazın kaydına işlenmesini zorunlu kıldı. Yapının imar mevzuatına aykırı olduğuna dair bilgi, tapu kayıtlarının beyanlar hanesine kaydedilmek üzere ilgili idaresince tapu dairesine en geç yedi gün içinde yazılı olarak bildirilir.',
        'Bu kaydın kaldırılması da bir işleme bağlanmıştır: Aykırılığın giderildiğine dair ilgili idaresince tapu dairesine bildirim yapılmadan beyanlar hanesindeki kayıt kaldırılamaz.',
        'Şerhin pratik etkisi büyüktür. Taşınmazın satışında ve kredi işlemlerinde bu kayıt görünür; alıcı ve banka açısından caydırıcıdır. Aykırılık giderilmeden taşınmazın değeri fiilen düşer.',
      ],
    },
    {
      heading: 'Tebligat nasıl yapılmış sayılır?',
      paragraphs: [
        'Burada alışılmadık bir tebliğ usulü vardır ve süre kaçırmanın en sık sebebi budur. Durdurma, yapı tatil zaptının yapı yerine asılmasıyla yapı sahibine tebliğ edilmiş sayılır.',
        'Yani zabıt elinize verilmez, posta ile gönderilmez; yapıya asılması yeterlidir. Şantiyede bulunmayan ya da başka şehirde yaşayan yapı sahibi, süre işlerken durumdan habersiz olabilir.',
        '2020 değişikliği bilgilendirmeyi genişletti: Bu tebligatın bir nüshası muhtara bırakılır, bir nüshası da Çevre ve Şehircilik İl Müdürlüğüne gönderilir.',
        'Muhtara bırakılan nüsha, yapı sahibinin haberdar olma ihtimalini artırır. Yine de sorumluluk yapı sahibindedir; inşaatın düzenli takibi bu yüzden gereklidir.',
      ],
    },
    {
      heading: 'Bir aylık süre',
      paragraphs: [
        'Tebliğden sonra yapı sahibine bir düzeltme penceresi tanınır. Bu tarihten itibaren en çok bir ay içinde yapı sahibi, yapısını ruhsata uygun hâle getirerek veya ruhsat alarak belediyeden ya da valilikten mührün kaldırılmasını ister.',
        'İki yol vardır ve ikisi de sonuca götürür. Ya aykırılık fiilen giderilir, yani yapı projesine uygun hâle getirilir; ya da yapının mevcut hâli için ruhsat alınır.',
        'Süre içinde hareket edilmezse süreç yıkım aşamasına ilerler ve idari para cezası gündeme gelir. Bu nedenle bir aylık pencere, teknik hazırlığın yapılması gereken en kritik dönemdir.',
        'Mührün kaldırılması kendiliğinden olmaz; yapı sahibinin talebi ve idarenin aykırılığın giderildiğini tespit etmesi gerekir.',
      ],
    },
    {
      heading: 'Ne yapılmalı?',
      paragraphs: [
        'İlk adım yapı tatil zaptını edinmek ve tam olarak hangi aykırılığın tespit edildiğini okumaktır. Zabıtta yazan aykırılık ile fiilî durum arasında fark varsa, bu itirazın dayanağı olur.',
        'İkincisi teknik değerlendirmedir. Aykırılığın giderilebilir olup olmadığını, giderilemiyorsa mevcut hâli için ruhsat alınıp alınamayacağını bir teknik uzmanla belirlemek gerekir.',
        'Üçüncüsü idareyle yazılı iletişimdir. Süre içinde yapılan başvurunun tarihini belgelemek, sonradan çıkacak süre tartışmasını keser.',
        'İdari işleme karşı iptal davası yolu da açıktır. Tespitin hatalı olduğu ya da usule aykırı işlem yapıldığı düşünülüyorsa, idari yargıda dava süresi içinde hareket edilmelidir.',
      ],
    },
    {
      heading: 'Yapı satın alırken',
      paragraphs: [
        'Alıcı açısından en güvenli kontrol tapu kaydıdır. Beyanlar hanesinde imar mevzuatına aykırılık kaydı varsa, o kayıt kaldırılmadan taşınmazın durumu düzelmez.',
        'Yapı ruhsatı ve yapı kullanma izin belgesi ayrıca sorgulanmalıdır. Ruhsatı olan ama kullanma izni bulunmayan yapılar, ruhsata aykırılık bakımından risk taşır.',
        'Belediyeden alınacak imar durumu ve arşiv incelemesi, satın almadan önceki en ucuz sigortadır.',
      ],
    },
  ],
  steps: [
    'Yapı tatil zaptının bir örneğini alın ve tespit edilen aykırılığı okuyun.',
    'Zaptın yapıya asıldığı tarihi belirleyin — bir aylık süre o tarihten işler.',
    'Tapu kaydının beyanlar hanesini kontrol edin; aykırılık kaydı işlenmiş olabilir.',
    'Teknik uzmanla aykırılığın giderilebilirliğini değerlendirin.',
    'Bir ay içinde ya aykırılığı giderin ya da mevcut hâli için ruhsat alın.',
    'Mührün kaldırılması için belediyeye veya valiliğe yazılı başvuruda bulunun.',
    'Aykırılık giderildikten sonra tapu şerhinin kaldırılması için idarenin bildirimde bulunmasını isteyin.',
    'Tespit veya işlem hatalıysa süresi içinde idari yargıda iptal davası açın.',
  ],
  checklist: [
    'Yapı tatil zaptı',
    'Yapı ruhsatı ve ekleri',
    'Onaylı mimari proje',
    'Tapu kayıt örneği — beyanlar hanesi dâhil',
    'İmar durum belgesi',
    'İdareye yapılan başvuru ve tarihi',
  ],
  faq: [
    {
      q: 'Yapı mühürlendi, ne kadar sürem var?',
      a: 'En çok bir ay. Bu süre içinde yapıyı ruhsata uygun hâle getirerek veya ruhsat alarak mührün kaldırılmasını istemeniz gerekir.',
    },
    {
      q: 'Süre ne zaman başlar?',
      a: 'Yapı tatil zaptının yapı yerine asıldığı tarihte. Durdurma, zaptın yapı yerine asılmasıyla yapı sahibine tebliğ edilmiş sayılır.',
    },
    {
      q: 'Bana tebligat gelmedi, süre işler mi?',
      a: 'İşler. Kanun elden ya da posta yoluyla tebliği aramaz; zaptın yapıya asılması tebliğ yerine geçer. Bir nüsha muhtara bırakılır ve bir nüsha Çevre ve Şehircilik İl Müdürlüğüne gönderilir.',
    },
    {
      q: 'Tapuma şerh konur mu?',
      a: 'Evet. Yapının imar mevzuatına aykırı olduğuna dair bilgi, en geç yedi gün içinde tapu dairesine bildirilerek beyanlar hanesine kaydedilir.',
    },
    {
      q: 'Şerh nasıl kalkar?',
      a: 'Aykırılığın giderildiğine dair ilgili idarece tapu dairesine bildirim yapılmadan beyanlar hanesindeki kayıt kaldırılamaz.',
    },
    {
      q: 'Komşum ihbar etti, işlem yapılır mı?',
      a: 'Yapılır. İdarenin tespiti, fennî mesulün ihbarı ya da herhangi bir şekilde duruma muttali olunması işlemi başlatmaya yeter.',
    },
    {
      q: 'Ev alıyorum, nasıl kontrol ederim?',
      a: 'Tapu kaydının beyanlar hanesini, yapı ruhsatını ve yapı kullanma izin belgesini kontrol edin; belediyeden imar durumu ve arşiv incelemesi isteyin.',
    },
  ],
  updated: '2026-08-16',
  sitemapPriority: 0.91,
};
