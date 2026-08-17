import type { VatandasArticle } from '../types';

/**
 * Kaynak doğrulaması — hepsi content-packs/tmk.json.gz resmî metninden:
 *   TMK m.605  ret hakkı · ödemeden aciz hâlinde hükmen ret
 *   TMK m.606  üç aylık süre ve başlangıcı
 *   TMK m.607  terekenin yazımı hâlinde sürenin başlangıcı
 *   TMK m.608  ret hakkının mirasçıya geçmesi
 *   TMK m.609  sulh mahkemesine sözlü veya yazılı beyan, kayıtsız şartsız
 *
 * Doğrulama: node scripts/madde.mjs tmk 605-612
 */
export const mirasinReddi: VatandasArticle = {
  slug: 'mirasin-reddi',
  title: 'Mirasın Reddi: Üç Aylık Süre, Merci ve Sonuçları',
  description:
    'Mirası reddetmek için üç aylık süre ne zaman başlar, hangi mahkemeye başvurulur, hükmen ret nedir? TMK m.605-618 çerçevesinde adım adım.',
  h1: 'Mirasın reddi nasıl yapılır?',
  keywords: [
    'mirasın reddi',
    'miras reddi süresi',
    'mirasın reddi dilekçesi',
    'hükmen ret',
    'borçlu miras reddi',
  ],
  category: 'Miras',
  role: 'pillar',
  related: ['veraset-ilami-nasil-alinir'],
  links: [
    { label: 'TMK m.605 — Ret hakkı', href: '/mevzuat/tmk/madde-605' },
    { label: 'TMK m.606 — Üç aylık süre', href: '/mevzuat/tmk/madde-606' },
    { label: 'TMK m.609 — Reddin şekli', href: '/mevzuat/tmk/madde-609' },
    { label: 'TMK m.608 — Ret hakkının geçmesi', href: '/mevzuat/tmk/madde-608' },
  ],
  lead:
    'Miras üç ay içinde reddedilebilir. Süre, yasal mirasçılar bakımından mirasbırakanın ölümünü öğrendikleri tarihte işlemeye başlar; ret beyanı ise sulh hukuk mahkemesine sözlü ya da yazılı olarak, kayıtsız ve şartsız biçimde yapılır.',
  keyInsight:
    'Üç ay geçtikten sonra miras kayıtsız şartsız kabul edilmiş sayılır ve mirasbırakanın borçlarından kişisel malvarlığıyla sorumlu hâle gelinir.',
  sections: [
    {
      heading: 'Miras neden reddedilir?',
      paragraphs: [
        'Ölümle birlikte tereke, mirasçılara kendiliğinden ve bir bütün olarak geçer. Bu geçiş yalnız taşınmazları ve banka hesaplarını değil, mirasbırakanın borçlarını da kapsadığından, borcu alacağından fazla olan bir terekede mirasçı olmak kişinin kendi malvarlığını tehlikeye atar.',
        'Kanun bu sonucu kaçınılmaz kılmaz. Türk Medeni Kanunu m.605 uyarınca yasal ve atanmış mirasçılar mirası reddedebilirler; ret, mirasçılık sıfatını geçmişe etkili biçimde ortadan kaldırır ve kişi terekeye hiç dâhil olmamış gibi sayılır.',
        'Uygulamada en sık karşılaşılan tablo, ölenin geride ödenmemiş kredi, senet veya icra dosyası bırakmasıdır. Mirasçılar çoğu zaman durumu ilk icra takibinin tebliğiyle öğrenir; ne var ki o aşamada üç aylık süre çoktan işlemeye başlamış olabilir.',
      ],
    },
    {
      heading: 'Üç aylık süre ne zaman başlar?',
      paragraphs: [
        'TMK m.606 süreyi üç ay olarak belirler ve başlangıcı mirasçının türüne göre ayırır. Yasal mirasçılar için süre, mirasbırakanın ölümünü öğrendikleri tarihten işlemeye başlar; mirasçı olduklarını daha sonra öğrendiklerini ispat edebilirlerse başlangıç o tarihe kayar.',
        'Vasiyetname ile atanmış mirasçılar bakımından ölçüt farklıdır: Süre, mirasbırakanın tasarrufunun kendilerine resmen bildirildiği tarihte başlar. Koruma önlemi olarak terekenin yazımına karar verilmişse m.607 devreye girer ve süre, yazım işleminin sona erdiğinin sulh hâkimince bildirilmesiyle işlemeye başlar.',
        'Ret hakkını kullanmadan ölen bir mirasçının bu hakkı kendi mirasçılarına geçer. m.608 bu ihtimalde süreyi, onların kendi mirasbırakanına mirasın geçtiğini öğrendikleri tarihe bağlar; üstelik bu süre, kendi mirasbırakanlarından geçen mirasın reddi için tanınan süre dolmadıkça sona ermez.',
        'Önceki mirasçıların reddi sonucu miras daha önce mirasçı olmayanlara geçmişse, onlar için üç ay ancak reddi öğrendikleri tarihte işlemeye başlar. Kanun bu kademeli başlangıçlarla, kendisine haber verilmeyen mirasçının süreyi kaçırmasını önlemeyi amaçlar.',
      ],
      bullets: [
        'Yasal mirasçı: ölümü öğrendiği tarih',
        'Atanmış mirasçı: tasarrufun resmen bildirildiği tarih',
        'Terekenin yazımı yapılmışsa: yazımın bittiğinin hâkimce bildirildiği tarih',
        'Reddeden mirasçının yerine geçen kişi: reddi öğrendiği tarih',
      ],
    },
    {
      heading: 'Hükmen ret: başvuru gerekmeyen hâl',
      paragraphs: [
        'TMK m.605 ikinci cümlesi, ayrı bir ret beyanına gerek bırakmayan bir durum öngörür. Ölüm tarihinde mirasbırakanın ödemeden aczi açıkça belli veya resmen tespit edilmiş ise miras reddedilmiş sayılır.',
        'Bu sonuç kendiliğinden doğmakla birlikte, alacaklılar takibe giriştiğinde tartışma çıkar. Mirasçının pratikte yapması gereken, terekenin borca batık olduğunun tespiti için dava açmak ya da açılan takipte bu durumu savunma olarak ileri sürmektir.',
        'Aczin açıkça belli sayılması için mirasbırakan hakkında aciz vesikası bulunması, iflasına karar verilmiş olması veya benzer resmî bir tespit aranır. Yalnızca borcun çokluğu iddiası tek başına yeterli görülmez.',
      ],
    },
    {
      heading: 'Ret beyanı nasıl ve nereye yapılır?',
      paragraphs: [
        'TMK m.609 usulü açıkça düzenler: Mirasın reddi, mirasçılar tarafından sulh mahkemesine sözlü veya yazılı beyanla yapılır. Yetkili mahkeme mirasın açıldığı yer, yani mirasbırakanın son yerleşim yeri sulh hukuk mahkemesidir.',
        'Beyanın kayıtsız ve şartsız olması şarttır. Borçlar şu tutarı geçerse reddediyorum biçiminde koşula bağlanan ya da terekenin bir kısmıyla sınırlandırılan bir ret geçerli değildir.',
        'Sulh hâkimi beyanı bir tutanakla tespit eder. Süresi içinde yapılmış ret beyanı, mirasın açıldığı yerin sulh mahkemesince özel kütüğüne yazılır; reddeden mirasçı isterse kendisine reddi gösteren bir belge verilir. Bu belge, sonradan gelen icra takiplerinde en pratik savunma aracıdır.',
      ],
    },
    {
      heading: 'Sık yapılan hatalar',
      paragraphs: [
        'En pahalı hata süreyi kaçırmaktır. Üç ay dolduğunda miras kayıtsız şartsız kabul edilmiş sayılır ve artık mirasbırakanın borçlarından kişisel malvarlığıyla sorumluluk doğar.',
        'İkinci sık hata, terekeye sahiplenmiş görünmektir. Mirasçı sıfatıyla tereke mallarını kullanmak, satmak ya da gizlemek ret hakkını düşürür; bu yüzden reddetmeyi düşünen kişi süre dolmadan tereke mallarına el sürmemelidir.',
        'Üçüncüsü, reddin herkesi kapsadığını sanmaktır. Ret kişiseldir ve yalnız reddeden mirasçı için sonuç doğurur; onun payı diğer mirasçılara veya sonraki zümreye geçer. Bu nedenle borçlu bir terekede aile bireylerinin ayrı ayrı başvurması gerekir.',
      ],
    },
  ],
  steps: [
    'Ölüm tarihini ve öğrenme tarihinizi belgeleyin; üç aylık sürenin başlangıcı buna bağlıdır.',
    'Terekenin borca batık olup olmadığını araştırın: e-Devlet üzerinden icra dosyası sorgusu, banka ve tapu kayıtları ilk bakış için yeterlidir.',
    'Kararınızı verdiyseniz mirasbırakanın son yerleşim yeri sulh hukuk mahkemesine başvurun.',
    'Ret beyanınızı kayıtsız ve şartsız biçimde, sözlü ya da yazılı olarak sunun; hâkim tutanakla tespit eder.',
    'Reddi gösteren belgeyi mahkemeden isteyin ve saklayın.',
    'Aleyhinize takip başlatılmışsa bu belgeyi icra dosyasına sunarak itiraz edin.',
  ],
  checklist: [
    'Ölüm belgesi veya nüfus kayıt örneği',
    'Mirasçılık belgesi — varsa',
    'Kimlik ve gerekiyorsa vekâletname',
    'Terekenin borç durumuna ilişkin belgeler',
    'Üç aylık sürenin başlangıcını gösteren belge',
  ],
  faq: [
    {
      q: 'Mirası reddetme süresi kaç gündür?',
      a: 'Üç aydır. TMK m.606 bu süreyi yasal mirasçılar için mirasbırakanın ölümünü öğrendikleri, atanmış mirasçılar için tasarrufun kendilerine resmen bildirildiği tarihten başlatır.',
    },
    {
      q: 'Üç ayı kaçırdım, yapabileceğim bir şey var mı?',
      a: 'Süre geçtiğinde miras kural olarak kabul edilmiş sayılır. Ancak mirasbırakanın ölüm tarihinde ödemeden aczi açıkça belli veya resmen tespit edilmişse TMK m.605 uyarınca miras zaten reddedilmiş sayılır; bu durumda terekenin borca batık olduğunun tespiti yoluna gidilir.',
    },
    {
      q: 'Nereye başvuracağım?',
      a: 'Mirasın açıldığı yer, yani mirasbırakanın son yerleşim yeri sulh hukuk mahkemesine. Başvuru sözlü de yapılabilir; hâkim beyanı tutanağa geçirir.',
    },
    {
      q: 'Reddedersem çocuklarım sorumlu olur mu?',
      a: 'Ret, sizin payınızı sizden sonra gelen mirasçılara geçirir. Bu nedenle borçlu bir terekede altsoyun da ayrıca ret beyanında bulunması gerekir; aksi hâlde borç onlara intikal eder.',
    },
    {
      q: 'Mirasın bir kısmını reddedebilir miyim?',
      a: 'Hayır. TMK m.609 reddin kayıtsız ve şartsız olmasını arar; kısmî ya da koşullu ret geçerli değildir.',
    },
    {
      q: 'Reddettikten sonra cenaze masrafı gibi giderlerden sorumlu olur muyum?',
      a: 'Ret, mirasçılık sıfatını ortadan kaldırır. Buna karşılık kişinin kendi adına üstlendiği borçlar ile aile hukukundan doğan yükümlülükler ayrı değerlendirilir; somut durumda avukata danışmak yerinde olur.',
    },
  ],
  updated: '2026-08-15',
  sitemapPriority: 0.95,
};
