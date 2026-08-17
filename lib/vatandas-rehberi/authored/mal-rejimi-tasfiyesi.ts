import type { VatandasArticle } from '../types';

/**
 * Kaynak doğrulaması — hepsi content-packs/tmk.json.gz resmî metninden:
 *   TMK m.202  edinilmiş mallara katılma rejiminin asıl olması
 *   TMK m.219  edinilmiş malların tanımı ve beş bendi
 *   TMK m.220  kanun gereğince kişisel mallar
 *   TMK m.225  rejimin sona erme anı · boşanmada DAVA TARİHİ
 *   TMK m.227  değer artış payı
 *   TMK m.231  artık değerin tanımı · değer eksilmesi göz önüne alınmaz
 *   TMK m.236  artık değerin yarısı · zina veya hayata kast hâlinde azaltma
 *
 * Doğrulama: node scripts/madde.mjs tmk 202 · 219-236
 */
export const malRejimiTasfiyesi: VatandasArticle = {
  slug: 'mal-rejimi-tasfiyesi',
  title: 'Mal Rejimi Tasfiyesi: Edinilmiş Mallara Katılma ve Artık Değer',
  description:
    'Boşanmada mallar nasıl paylaşılır, hangi mallar edinilmiş sayılır, artık değer nedir, katkı payı nasıl istenir? TMK m.202, 219-236 çerçevesinde.',
  h1: 'Boşanmada mallar nasıl paylaşılır?',
  keywords: [
    'mal rejimi',
    'edinilmiş mallara katılma',
    'mal paylaşımı boşanma',
    'artık değer',
    'katkı payı alacağı',
    'değer artış payı',
  ],
  category: 'Aile',
  role: 'pillar',
  related: ['nafaka-turleri-ve-sartlari'],
  links: [
    { label: 'TMK m.202 — Yasal mal rejimi', href: '/mevzuat/tmk/madde-202' },
    { label: 'TMK m.219 — Edinilmiş mallar', href: '/mevzuat/tmk/madde-219' },
    { label: 'TMK m.220 — Kişisel mallar', href: '/mevzuat/tmk/madde-220' },
    { label: 'TMK m.225 — Rejimin sona ermesi', href: '/mevzuat/tmk/madde-225' },
    { label: 'TMK m.227 — Değer artış payı', href: '/mevzuat/tmk/madde-227' },
    { label: 'TMK m.236 — Artık değere katılma', href: '/mevzuat/tmk/madde-236' },
    { label: 'Mal rejimi hesaplama aracı', href: '/hesaplama/mal-rejimi' },
  ],
  lead:
    'Eşler arasında edinilmiş mallara katılma rejiminin uygulanması asıldır. Tasfiyede her eş, diğerine ait artık değerin yarısı üzerinde alacak hakkına sahip olur; kişisel mallar ise paylaşıma girmez.',
  keyInsight:
    'Paylaşılan şey mallar değil, artık değer üzerindeki alacaktır: Eş, diğerinin adına kayıtlı taşınmazın yarısına değil, hesaplanan artık değerin yarısı tutarında bir alacağa hak kazanır.',
  sections: [
    {
      heading: 'Hangi rejim uygulanır?',
      paragraphs: [
        'Aksi kararlaştırılmadıkça seçim yapılmış sayılmaz. TMK m.202 uyarınca eşler arasında edinilmiş mallara katılma rejiminin uygulanması asıldır; eşler mal rejimi sözleşmesiyle kanunda belirlenen diğer rejimlerden birini kabul edebilirler.',
        'Bu rejim 1 Ocak 2002de yürürlüğe girmiştir. Daha önce evlenmiş ve sözleşme yapmamış eşler bakımından o tarihten önceki dönem ile sonraki dönem farklı değerlendirilir; eski dönem için mal ayrılığı esasları geçerlidir.',
        'Mal rejimi sözleşmesi noterde düzenleme veya onaylama biçiminde yapılır. Evlenme başvurusu sırasında da hangi rejimin seçildiği yazılı olarak bildirilebilir.',
      ],
    },
    {
      heading: 'Edinilmiş mal nedir?',
      paragraphs: [
        'Tanım kazanç eksenlidir. TMK m.219 uyarınca edinilmiş mal, her eşin bu mal rejiminin devamı süresince karşılığını vererek elde ettiği malvarlığı değerleridir.',
        'Madde beş grubu özellikle sayar: Çalışmanın karşılığı olan edinimler; sosyal güvenlik veya sosyal yardım kurum ve kuruluşlarının ya da personele yardım amacıyla kurulan sandık ve benzerlerinin yaptığı ödemeler; çalışma gücünün kaybı nedeniyle ödenen tazminatlar; kişisel malların gelirleri ve edinilmiş malların yerine geçen değerler.',
        'Dördüncü bent çoğu zaman şaşırtır. Kişisel malın kendisi paylaşıma girmez ama gelirleri edinilmiş maldır; evlilikten önce alınmış bir dairenin kira geliri bu nedenle tasfiyeye dâhil olur.',
        'Beşinci bent ise ikame ilkesini kurar. Edinilmiş bir malın satılıp yerine başka bir mal alınması niteliği değiştirmez; yeni mal da edinilmiş mal sayılır.',
      ],
      bullets: [
        'Çalışmanın karşılığı olan edinimler',
        'Sosyal güvenlik ve sosyal yardım ödemeleri',
        'Çalışma gücü kaybı tazminatları',
        'Kişisel malların gelirleri',
        'Edinilmiş malların yerine geçen değerler',
      ],
    },
    {
      heading: 'Kişisel mallar paylaşıma girmez',
      paragraphs: [
        'TMK m.220 kanun gereğince kişisel sayılan malları sıralar. Eşlerden birinin yalnız kişisel kullanımına yarayan eşya ile mal rejiminin başlangıcında eşlerden birine ait bulunan veya bir eşin sonradan miras yoluyla ya da karşılıksız kazanma yoluyla elde ettiği malvarlığı değerleri bu kapsamdadır.',
        'Miras yoluyla gelen mal bu nedenle tasfiye dışında kalır. Aynı biçimde bağış yoluyla edinilen mallar da kişisel maldır.',
        'Manevî tazminat alacakları ile kişisel malların yerine geçen değerler de kişisel mal sayılır. Buradaki ikame ilkesi edinilmiş mallardakinin aynasıdır.',
        'Bir malın hangi gruba girdiği ispat meselesidir. Tereddüt hâlinde malın edinilmiş mal sayılacağı yönündeki karine, kişisel mal iddiasında bulunan eşe ispat yükü yükler.',
      ],
    },
    {
      heading: 'Rejim ne zaman sona erer?',
      paragraphs: [
        'Tarih tasfiyenin kapsamını doğrudan belirlediğinden bu soru kritik önemdedir. TMK m.225 uyarınca mal rejimi, eşlerden birinin ölümü veya başka bir mal rejiminin kabulüyle sona erer.',
        'Boşanmada ise kritik bir kural vardır: Mahkemece evliliğin iptal veya boşanma sebebiyle sona erdirilmesine veya mal ayrılığına geçilmesine karar verilmesi hâllerinde, mal rejimi dava tarihinden geçerli olmak üzere sona erer.',
        'Yani ölçüt kararın kesinleşme tarihi değil, davanın açıldığı tarihtir. Dava açıldıktan sonra edinilen mallar tasfiyeye girmez; bu ayrıntı uzun süren boşanma davalarında belirleyici olur.',
      ],
    },
    {
      heading: 'Artık değer ve yarısı üzerindeki alacak',
      paragraphs: [
        'Hesap iki aşamalıdır. Önce her eş için artık değer bulunur: TMK m.231 uyarınca artık değer, eklenmeden ve denkleştirmeden elde edilen miktarlar da dâhil olmak üzere her eşin edinilmiş mallarının toplam değerinden bu mallara ilişkin borçlar çıkarıldıktan sonra kalan miktardır.',
        'Maddenin son cümlesi işçi lehine bir kural gibi görünmese de önemlidir: Değer eksilmesi göz önüne alınmaz. Artık değer negatif olamaz; borcu malından fazla olan eş için artık değer sıfır kabul edilir.',
        'İkinci aşamada katılma alacağı doğar. TMK m.236 uyarınca her eş veya mirasçıları, diğer eşe ait artık değerin yarısı üzerinde hak sahibi olur ve alacaklar takas edilir.',
        'Kanun bir istisna tanır: Zina veya hayata kast nedeniyle boşanma hâlinde hâkim, kusurlu eşin artık değerdeki pay oranının hakkaniyete uygun olarak azaltılmasına veya kaldırılmasına karar verebilir. Bu, kusurun mal paylaşımına yansıdığı dar bir hâldir; genel olarak kusur katılma alacağını etkilemez.',
      ],
    },
    {
      heading: 'Değer artış payı: katkının karşılığı',
      paragraphs: [
        'Bir eş diğerinin malına katkıda bulunmuşsa ayrı bir alacak doğar. TMK m.227 uyarınca eşlerden biri diğerine ait bir malın edinilmesine, iyileştirilmesine veya korunmasına hiç ya da uygun bir karşılık almaksızın katkıda bulunmuşsa, tasfiye sırasında bu malda ortaya çıkan değer artışı için katkısı oranında alacak hakkına sahip olur.',
        'Hesabın zamanı da belirlenmiştir: Bu alacak, o malın tasfiye sırasındaki değerine göre hesaplanır. Böylece katkıda bulunan eş, aradaki değer artışından payını alır.',
        'Değer kaybı hâlinde yön değişir; katkının başlangıçtaki değeri esas alınır. Mal daha önce elden çıkarılmışsa hâkim, diğer eşe ödenecek alacağı hakkaniyete uygun olarak belirler.',
        'Taraflar bu konuda anlaşabilir. Eşler yazılı bir anlaşmayla değer artışından pay almaktan vazgeçebilecekleri gibi pay oranını da değiştirebilirler.',
      ],
    },
  ],
  steps: [
    'Mal rejiminin başlangıç tarihini belirleyin: evlenme tarihi ya da sözleşmeyle kabul edilen tarih.',
    'Sona erme tarihini tespit edin — boşanmada bu, dava tarihidir.',
    'Her iki eşin malvarlığını edinilmiş ve kişisel olarak ayırın.',
    'Kişisel malların gelirlerini unutmayın; onlar edinilmiş maldır.',
    'Her eş için artık değeri hesaplayın: edinilmiş mallar eksi bunlara ilişkin borçlar.',
    'Diğer eşin artık değerinin yarısı üzerindeki katılma alacağınızı bulun; alacaklar takas edilir.',
    'Diğerinin malına katkınız varsa değer artış payını ayrıca talep edin.',
  ],
  checklist: [
    'Evlenme tarihi ve varsa mal rejimi sözleşmesi',
    'Boşanma dava dilekçesi ve dava tarihi',
    'Tapu kayıtları ve edinme tarihleri',
    'Banka hesap dökümleri ve kredi sözleşmeleri',
    'Araç ve diğer taşınır kayıtları',
    'Miras veya bağış yoluyla edinmeyi gösteren belgeler',
    'Katkıyı ispatlayan ödeme belgeleri',
  ],
  faq: [
    {
      q: 'Boşanınca mallar yarı yarıya mı bölünür?',
      a: 'Mallar değil, artık değer paylaşılır. Her eş, diğerine ait artık değerin yarısı üzerinde alacak hakkına sahip olur; alacaklar takas edilir.',
    },
    {
      q: 'Evlilikten önce aldığım ev paylaşıma girer mi?',
      a: 'Hayır, kişisel maldır. Ancak o evin kira geliri edinilmiş mal sayılır ve tasfiyeye dâhil olur.',
    },
    {
      q: 'Miras yoluyla gelen mal paylaşılır mı?',
      a: 'Hayır. Miras veya karşılıksız kazanma yoluyla edinilen malvarlığı değerleri kişisel maldır.',
    },
    {
      q: 'Mal rejimi ne zaman sona erer?',
      a: 'Ölüm veya başka bir rejimin kabulüyle sona erer. Boşanmada ise mal rejimi dava tarihinden geçerli olmak üzere sona erer.',
    },
    {
      q: 'Dava açıldıktan sonra aldığım mal paylaşılır mı?',
      a: 'Hayır. Mal rejimi dava tarihinde sona erdiğinden, sonrasında edinilen mallar tasfiyeye girmez.',
    },
    {
      q: 'Eşimin evine katkıda bulundum, ne isteyebilirim?',
      a: 'TMK m.227 uyarınca değer artış payı. Katkınız oranında, malın tasfiye sırasındaki değerine göre hesaplanan bir alacak hakkınız doğar.',
    },
    {
      q: 'Kusurlu olan eş mal paylaşımından mahrum kalır mı?',
      a: 'Kural olarak hayır. Yalnız zina veya hayata kast nedeniyle boşanmada hâkim, kusurlu eşin artık değerdeki payını hakkaniyete uygun olarak azaltabilir veya kaldırabilir.',
    },
    {
      q: 'Eşimin borcu malından fazla, yine de pay alabilir miyim?',
      a: 'Artık değer negatif olmaz; değer eksilmesi göz önüne alınmaz. Borcu malını aşan eşin artık değeri sıfır kabul edilir.',
    },
  ],
  updated: '2026-08-16',
  sitemapPriority: 0.94,
};
