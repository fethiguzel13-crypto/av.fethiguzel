import type { VatandasArticle } from '../types';

/**
 * Kaynak doğrulaması — hepsi content-packs/tmk.json.gz resmî metninden:
 *   TMK m.495  birinci zümre: altsoy · çocuklar eşit · halefiyet
 *   TMK m.496  ikinci zümre: ana ve baba · bir taraf boşsa diğer tarafa
 *   TMK m.497  üçüncü zümre: büyük ana ve büyük baba · sağ kalan eş varsa özel kural
 *   TMK m.498  evlilik dışı hısımlar
 *   TMK m.499  sağ kalan eşin payı: 1/4 · 1/2 · 3/4 · tamamı
 *   TMK m.505  tasarruf edilebilir kısım
 *   TMK m.506  saklı pay oranları
 *
 * Doğrulama: node scripts/madde.mjs tmk 495-506
 */
export const mirasPaylasimi: VatandasArticle = {
  slug: 'miras-paylasimi-nasil-yapilir',
  title: 'Miras Paylaşımı: Zümre Sistemi, Eşin Payı ve Saklı Pay',
  description:
    'Miras kime, hangi oranda kalır? Zümre sistemi nasıl işler, sağ kalan eşin payı nedir, saklı pay ne kadardır? TMK m.495-506 çerçevesinde örneklerle.',
  h1: 'Miras paylaşımı nasıl yapılır?',
  keywords: [
    'miras paylaşımı',
    'yasal mirasçılık',
    'zümre sistemi',
    'eşin miras payı',
    'saklı pay',
    'miras oranları',
  ],
  category: 'Miras',
  role: 'pillar',
  related: ['mirasin-reddi', 'veraset-ilami-nasil-alinir'],
  links: [
    { label: 'TMK m.495 — Birinci zümre: altsoy', href: '/mevzuat/tmk/madde-495' },
    { label: 'TMK m.496 — İkinci zümre: ana ve baba', href: '/mevzuat/tmk/madde-496' },
    { label: 'TMK m.499 — Sağ kalan eşin payı', href: '/mevzuat/tmk/madde-499' },
    { label: 'TMK m.505 — Tasarruf edilebilir kısım', href: '/mevzuat/tmk/madde-505' },
    { label: 'TMK m.506 — Saklı pay oranları', href: '/mevzuat/tmk/madde-506' },
    { label: 'Miras paylaşımı hesaplama aracı', href: '/hesaplama/miras' },
    { label: 'Saklı pay hesaplama aracı', href: '/hesaplama/sakli-pay' },
  ],
  lead:
    'Yasal mirasçılık zümre esasına dayanır: Önce altsoy, yoksa ana ve baba, o da yoksa büyük ana ve büyük baba mirasçı olur. Sağ kalan eş her zümreyle birlikte mirasçı olur ve payı birlikte bulunduğu zümreye göre değişir.',
  keyInsight:
    'Bir üst zümrede mirasçı varsa alt zümreye sıra gelmez: Çocuğu olan bir kişinin mirasından ana babası pay alamaz.',
  sections: [
    {
      heading: 'Zümre sistemi: sıra kimde?',
      paragraphs: [
        'Türk Medeni Kanunu mirasçıları üç zümreye ayırır ve aralarında katı bir sıra kurar. Birinci derece mirasçılar mirasbırakanın altsoyudur; çocuklar eşit olarak mirasçı olur.',
        'Ölen bir çocuğun payı yok olmaz. Mirasbırakandan önce ölmüş olan çocukların yerini, her derecede halefiyet yoluyla kendi altsoyları alır; yani torunlar, babalarının payını aralarında paylaşır.',
        'Altsoy yoksa sıra ikinci zümreye geçer. Altsoyu bulunmayan mirasbırakanın mirasçıları ana ve babasıdır ve bunlar eşit olarak mirasçı olur. Ana ya da baba önce ölmüşse yerlerini kendi altsoyları, yani mirasbırakanın kardeşleri alır.',
        'Bu zümrede bir denge kuralı vardır: Bir tarafta hiç mirasçı bulunmadığı takdirde bütün miras diğer taraftaki mirasçılara kalır. Anne tarafı tamamen boşsa pay baba tarafına geçer.',
        'Altsoyu, ana ve babası ve onların altsoyu bulunmayan mirasbırakanın mirasçıları büyük ana ve büyük babalarıdır. Üçüncü zümre son yasal zümredir; ondan sonrası Devlete kalır.',
      ],
      bullets: [
        '1. zümre: çocuklar ve onların altsoyu',
        '2. zümre: ana ve baba, onların altsoyu (kardeşler, yeğenler)',
        '3. zümre: büyük ana ve büyük baba ile onların altsoyu',
        'Üst zümrede mirasçı varsa alt zümreye sıra gelmez',
      ],
    },
    {
      heading: 'Sağ kalan eşin payı',
      paragraphs: [
        'Eş hiçbir zümrenin içinde yer almaz; her zümreyle birlikte mirasçı olur ve payı hangi zümreyle birlikte bulunduğuna göre değişir. TMK m.499 oranları tek tek sayar.',
        'Eş, mirasbırakanın altsoyu ile birlikte mirasçı olursa mirasın dörtte birini alır. Ana ve baba zümresiyle birlikte mirasçı olursa payı mirasın yarısıdır.',
        'Üçüncü zümreyle birlikte oran daha da yükselir: Büyük ana ve büyük babalar ve onların çocuklarıyla birlikte mirasçı olursa mirasın dörtte üçü eşe kalır. Bunlar da yoksa mirasın tamamı eşe kalır.',
        'Bu kademelenme mantıklıdır: Mirasbırakana yakınlık azaldıkça eşin payı büyür. Uygulamada en sık görülen tablo, eş ile çocukların birlikte mirasçı olmasıdır; orada eş dörtte bir, kalan dörtte üç çocuklar arasında eşit paylaşılır.',
      ],
      bullets: [
        'Altsoy ile birlikte: 1/4',
        'Ana ve baba zümresi ile birlikte: 1/2',
        'Büyük ana ve büyük baba zümresi ile birlikte: 3/4',
        'Hiçbiri yoksa: tamamı',
      ],
    },
    {
      heading: 'Örneklerle paylaşım',
      paragraphs: [
        'Eş ve iki çocuk varsa eş dörtte bir alır; kalan dörtte üç iki çocuk arasında eşit bölünür ve her biri sekizde üç pay alır.',
        'Eş ile birlikte anne ve baba mirasçıysa eşin payı yarıdır. Kalan yarı anne ve baba arasında eşit paylaşılır; her biri dörtte bir alır.',
        'Çocuklardan biri mirasbırakandan önce ölmüş ve iki torun bırakmışsa, o çocuğun payı kendiliğinden diğer çocuğa geçmez. Halefiyet gereği pay iki torun arasında eşit bölünür.',
        'Eşi olmayan ve çocuğu bulunmayan bir kişinin mirasında sıra anne ve babaya geçer; onlar da hayatta değilse kardeşler, kardeş yoksa yeğenler mirasçı olur.',
      ],
    },
    {
      heading: 'Saklı pay: vasiyetle dokunulamayan kısım',
      paragraphs: [
        'Mirasbırakan malvarlığının tamamı üzerinde serbestçe tasarruf edemez. TMK m.505 uyarınca mirasçı olarak altsoyu, ana ve babası veya eşi bulunan mirasbırakan, mirasının saklı paylar dışında kalan kısmında ölüme bağlı tasarrufta bulunabilir; bu mirasçılardan hiçbiri yoksa mirasının tamamında tasarruf edebilir.',
        'Saklı pay oranları m.506da belirlenmiştir ve yasal miras payı üzerinden hesaplanır. Altsoy için yasal miras payının yarısı, ana ve babadan her biri için yasal miras payının dörtte biri saklı paydır.',
        'Sağ kalan eş için ölçüt ikiye ayrılır: Altsoy veya ana ve baba zümresiyle birlikte mirasçı olması hâlinde yasal miras payının tamamı, diğer hâllerde yasal miras payının dörtte üçü saklı paydır.',
        'Kardeşlerin saklı payı 2007 yılında kaldırılmıştır; m.506nın üçüncü bendi 5650 sayılı Kanunla mülga hâle gelmiştir. Bugün kardeşlerin saklı payı bulunmaz.',
        'Saklı pay ihlal edilmişse tasarruf kendiliğinden geçersiz olmaz; saklı payı zedelenen mirasçının tenkis davası açması gerekir.',
      ],
      bullets: [
        'Altsoy: yasal miras payının 1/2si',
        'Ana ve babadan her biri: yasal miras payının 1/4ü',
        'Eş, altsoy veya ana baba zümresiyle birlikteyse: yasal payının tamamı',
        'Eş, diğer hâllerde: yasal payının 3/4ü',
        'Kardeşler: saklı pay yok (2007de kaldırıldı)',
      ],
    },
    {
      heading: 'Evlilik dışı doğan çocuklar',
      paragraphs: [
        'Soybağı kurulmuşsa mirasçılıkta bir fark kalmaz. TMK m.498 uyarınca evlilik dışında doğmuş ve soybağı tanıma veya hâkim hükmüyle kurulmuş olanlar, baba yönünden evlilik içi hısımlar gibi mirasçı olur.',
        'Belirleyici olan soybağının kurulmuş olmasıdır. Tanıma yapılmamış ve babalık hükmü de alınmamışsa baba yönünden mirasçılık doğmaz; bu durumda babalık davası gündeme gelir.',
      ],
    },
  ],
  steps: [
    'Mirasbırakanın hayattaki yakınlarını çıkarın: altsoy, ana baba, kardeşler, büyük ana büyük baba.',
    'Hangi zümrenin mirasçı olduğunu belirleyin — üst zümrede mirasçı varsa alt zümreye sıra gelmez.',
    'Sağ kalan eş varsa TMK m.499 uyarınca payını hesaplayın.',
    'Kalan kısmı ilgili zümre içinde eşit olarak paylaştırın; önce ölmüş mirasçıların payını altsoylarına dağıtın.',
    'Vasiyetname varsa saklı payların zedelenip zedelenmediğini kontrol edin.',
    'Resmî işlem için sulh hukuk mahkemesinden veya noterden mirasçılık belgesi alın.',
  ],
  checklist: [
    'Ölüm belgesi',
    'Vukuatlı nüfus kayıt örneği — tüm mirasçıları gösterir',
    'Varsa vasiyetname veya miras sözleşmesi',
    'Tapu ve banka kayıtları — terekenin tespiti için',
    'Mirasçılık belgesi',
  ],
  faq: [
    {
      q: 'Eşin miras payı ne kadar?',
      a: 'Birlikte bulunduğu zümreye göre değişir: altsoyla birlikte dörtte bir, ana ve baba zümresiyle birlikte yarı, büyük ana ve büyük baba zümresiyle birlikte dörtte üç; bunlar da yoksa mirasın tamamı.',
    },
    {
      q: 'Çocuklar eşit mi pay alır?',
      a: 'Evet. TMK m.495 uyarınca çocuklar eşit olarak mirasçıdır. Önce ölmüş bir çocuğun payı ise kendi altsoyuna geçer.',
    },
    {
      q: 'Anne babam sağ, çocuğum da var. Anne babam pay alır mı?',
      a: 'Hayır. Altsoy birinci zümredir; altsoy varken ikinci zümreye sıra gelmez.',
    },
    {
      q: 'Saklı pay ne demek?',
      a: 'Mirasbırakanın vasiyetle dokunamayacağı asgari paydır. Altsoy için yasal miras payının yarısı, ana ve babadan her biri için dörtte biri; eş için altsoy veya ana baba zümresiyle birlikteyse payının tamamı, diğer hâllerde dörtte üçü.',
    },
    {
      q: 'Kardeşlerin saklı payı var mı?',
      a: 'Yoktur. Kardeşlerin saklı payını düzenleyen bent 2007 yılında 5650 sayılı Kanunla yürürlükten kaldırılmıştır.',
    },
    {
      q: 'Vasiyetname saklı payı ihlal ederse ne olur?',
      a: 'Tasarruf kendiliğinden geçersiz olmaz. Saklı payı zedelenen mirasçının tenkis davası açması gerekir.',
    },
    {
      q: 'Evlilik dışı doğan çocuk mirasçı olur mu?',
      a: 'Soybağı tanıma veya hâkim hükmüyle kurulmuşsa baba yönünden evlilik içi hısımlar gibi mirasçı olur.',
    },
    {
      q: 'Hiç mirasçı yoksa miras kime kalır?',
      a: 'Üç zümrede de mirasçı bulunmaz ve sağ kalan eş de yoksa miras Devlete kalır.',
    },
  ],
  updated: '2026-08-16',
  sitemapPriority: 0.95,
};
