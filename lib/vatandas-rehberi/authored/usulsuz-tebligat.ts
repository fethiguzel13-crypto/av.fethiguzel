import type { VatandasArticle } from '../types';

/**
 * Kaynak doğrulaması — content-packs/tebligat.json.gz resmî metninden:
 *   Teb.K. m.16  aynı konutta oturan kişilere veya hizmetçiye tebligat
 *   Teb.K. m.21  tebliğ imkânsızlığı ve tebellüğden imtina · muhtara teslim
 *                · ihbarnamenin kapıya yapıştırılması · yapıştırma tarihi
 *                tebliğ tarihi sayılır · komşu, yönetici veya kapıcıya bildirim
 *   Teb.K. m.32  usulsüz tebliğ · muttali olma · muhatabın beyan ettiği tarih
 *
 * Doğrulama: node scripts/madde.mjs tebligat 16 · 21 · 32
 */
export const usulsuzTebligat: VatandasArticle = {
  slug: 'usulsuz-tebligat-ve-itiraz',
  title: 'Usulsüz Tebligat: Süre Ne Zaman Başlar, Nasıl İtiraz Edilir?',
  description:
    'Tebligat usulüne aykırı yapılmışsa süre ne zaman işler, kapıya yapıştırma ne anlama gelir, komşuya bırakılan tebligat geçerli mi? Tebligat Kanunu m.16, 21 ve 32 çerçevesinde.',
  h1: 'Usulsüz tebligat ve süreye etkisi',
  keywords: [
    'usulsüz tebligat',
    'tebligat itirazı',
    'kapıya yapıştırma tebligat',
    'muhtara tebligat',
    'tebliğ tarihi',
    'tebligat geçerli mi',
  ],
  category: 'Usul',
  role: 'pillar',
  related: ['odeme-emrine-itiraz', 'zamanasimi-sureleri'],
  links: [
    { label: 'Teb. K. m.16 — Aynı konutta oturanlara tebligat', href: '/mevzuat/tebligat/madde-16' },
    { label: 'Teb. K. m.21 — Tebliğ imkânsızlığı', href: '/mevzuat/tebligat/madde-21' },
    { label: 'Teb. K. m.32 — Usulsüz tebliğin hükmü', href: '/mevzuat/tebligat/madde-32' },
    { label: 'Süre hesaplama aracı', href: '/hesaplama/sure' },
  ],
  lead:
    'Tebliğ usulüne aykırı yapılmış olsa bile muhatabı tebliğe muttali olmuşsa geçerli sayılır ve muhatabın beyan ettiği tarih tebliğ tarihi kabul edilir. Bu kural, usulsüzlüğü ileri sürecek kişiye ispat yükü yükler.',
  keyInsight:
    'Usulsüz tebligat iddiasında asıl mesele tebligatın hatalı olması değil, öğrenme tarihini ispat edebilmektir.',
  sections: [
    {
      heading: 'Neden bu kadar önemli?',
      paragraphs: [
        'Hukukta hemen her hak bir süreye bağlıdır ve süreler kural olarak tebliğ tarihinden işler. Ödeme emrine itiraz için yedi gün, işe iade için bir ay, temyiz ve istinaf için ayrı süreler hep bu tarihe bakar.',
        'Tebligatın hatalı yapılması, sürenin daha geç başlamasına imkân verir. Bu nedenle süresini kaçırdığını düşünen kişinin ilk bakması gereken yer tebligat parçasıdır.',
        'Buna karşılık kanun, her usulsüzlüğü sonuçsuz bırakmaz. Tebligat Kanunu m.32 dengeyi kurar: Tebliğ usulüne aykırı yapılmış olsa bile, muhatabı tebliğe muttali olmuş ise muteber sayılır.',
      ],
    },
    {
      heading: 'Adreste bulunulmazsa ne yapılır?',
      paragraphs: [
        'Kanun kademeli bir yol izler. Önce m.16 devreye girer: Kendisine tebliğ yapılacak şahıs adresinde bulunmazsa tebliğ, kendisiyle aynı konutta oturan kişilere veya hizmetçilerinden birine yapılır.',
        'Bu kişilerden de hiçbiri bulunmazsa ya da tebellüğden kaçınılırsa m.21 uygulanır. Tebliğ memuru evrakı, o yerin muhtar veya ihtiyar heyeti azasından birine yahut zabıta amir veya memurlarına imza karşılığında teslim eder.',
        'Teslim tek başına yetmez; ikinci bir işlem daha zorunludur. Tesellüm edenin adresini içeren ihbarname, gösterilen adresteki binanın kapısına yapıştırılır.',
        'Üçüncü bir adım daha vardır ve uygulamada en çok atlanan budur. Adreste bulunmama hâlinde, keyfiyetin muhataba haber verilmesi mümkün oldukça en yakın komşulardan birine, varsa yönetici veya kapıcıya da bildirilir.',
        'Sürenin başlangıcı açıktır: İhbarnamenin kapıya yapıştırıldığı tarih, tebliğ tarihi sayılır. Muhatabın evrakı fiilen ne zaman aldığı bu kural bakımından önem taşımaz.',
      ],
      bullets: [
        'Muhatap yoksa: aynı konutta oturanlara veya hizmetçiye',
        'Onlar da yoksa veya almaktan kaçınılırsa: muhtar, ihtiyar heyeti üyesi ya da zabıtaya teslim',
        'İhbarname binanın kapısına yapıştırılır',
        'Mümkünse komşuya, yöneticiye veya kapıcıya haber verilir',
        'Tebliğ tarihi: ihbarnamenin yapıştırıldığı tarih',
      ],
    },
    {
      heading: 'Usulsüzlük hangi hâllerde doğar?',
      paragraphs: [
        'Kanunun saydığı adımlardan birinin atlanması usulsüzlük doğurur. Kapıya ihbarname yapıştırılmadan yalnız muhtara teslim yapılması ya da tebliğ evrakında adreste bulunulmama sebebinin gösterilmemesi tipik örneklerdir.',
        'Muhatabın adresinde bulunmadığının araştırılmadan varsayılması da usulsüzlük sebebidir. Tebliğ memurunun bu tespiti nasıl yaptığı, tebligat parçasında görünmelidir.',
        'Aynı konutta oturmayan bir kişiye yapılan tebligat da geçerli değildir. Komşuya bırakılan evrak, m.16 anlamında tebligat sayılmaz; komşuya yalnız haber verilir.',
        'Tebligatın muhatapla çatışan menfaati bulunan kişiye yapılması da kabul edilmez. Bu, özellikle boşanma ve miras uyuşmazlıklarında karşımıza çıkar.',
      ],
    },
    {
      heading: 'Usulsüzlük tespit edilirse ne olur?',
      paragraphs: [
        'Sonuç, tebligatın yok sayılması değildir. m.32 uyarınca muhatap tebliğe muttali olmuşsa tebligat muteber sayılır; yani öğrenilmişse geçerli hâle gelir.',
        'Değişen şey tarihtir: Muhatabın beyan ettiği tarih, tebliğ tarihi addolunur. Süre bu yeni tarihten işlemeye başlar ve kaçırılmış görünen hak yeniden canlanabilir.',
        'Bu düzenlemenin pratik anlamı şudur: Usulsüz tebligat iddiası, tebligatın iptalini değil, sürenin daha geç başladığının tespitini sağlar.',
        'İddia icra takiplerinde icra mahkemesine şikâyet, davalarda ise ilgili mahkemeye başvuru yoluyla ileri sürülür. Süreler kısadır; öğrenildiği andan itibaren gecikmeden hareket edilmelidir.',
      ],
    },
    {
      heading: 'Öğrenme tarihini ispat etmek',
      paragraphs: [
        'Dosyanın kaderini belirleyen nokta burasıdır. Muhatabın beyan ettiği tarih esas alınmakla birlikte, bu beyanın inandırıcı olması beklenir; yalnızca görmedim demek çoğu zaman yeterli görülmez.',
        'İşe yarayan deliller somuttur: UYAP veya e-Devlet üzerinden dosyaya ilk erişim kaydı, bankadan gelen haciz bildirimi, avukatla yapılan ilk yazışma, vekâletname tarihi.',
        'Yurt dışında bulunma, hastanede yatma ya da adreste oturmama gibi durumlar da belgelenebilir. Pasaport giriş çıkış kaydı, hastane raporu ve ikametgâh değişikliği bu bakımdan güçlü delillerdir.',
        'Adres kayıt sistemindeki adres önemlidir. Tebligatın adres kayıt sistemindeki adrese yapılmış olması hâlinde usulsüzlük iddiası daha dar bir alanda tartışılır; bu nedenle adres değişikliğinin zamanında bildirilmesi kendi başına bir korumadır.',
      ],
    },
    {
      heading: 'Sık yapılan hatalar',
      paragraphs: [
        'Birinci hata, tebligat parçasını incelemeden süreyi kaçırdığını kabul etmektir. Parçadaki eksiklik, kaybedilmiş görünen hakkı geri getirebilir.',
        'İkincisi, öğrenme tarihini belgelemeden beyan etmektir. Beyanın dayanağı yoksa tebligatın kendi tarihi geçerli sayılır.',
        'Üçüncüsü, adres değişikliğini bildirmemektir. Adres kayıt sistemindeki eski adrese yapılan tebligat, muhatabı zor durumda bırakır.',
      ],
    },
  ],
  steps: [
    'Tebligat parçasının bir örneğini dosyadan alın.',
    'Adreste bulunulmama sebebinin yazılıp yazılmadığını kontrol edin.',
    'Kapıya ihbarname yapıştırıldığına dair kaydın bulunup bulunmadığına bakın.',
    'Evrakın kime teslim edildiğini inceleyin: muhtar, ihtiyar heyeti üyesi ya da zabıta mı.',
    'Komşuya, yöneticiye veya kapıcıya haber verilip verilmediğini kontrol edin.',
    'Usulsüzlük varsa öğrenme tarihinizi belgeleyin: dosya erişim kaydı, banka bildirimi, vekâletname tarihi.',
    'İcra dosyasında icra mahkemesine şikâyet, davada ilgili mahkemeye başvurun — gecikmeden.',
  ],
  checklist: [
    'Tebligat parçası ve zarfı',
    'İcra dosyası veya dava dosyası bilgileri',
    'UYAP ya da e-Devlet erişim kaydı',
    'Adres kayıt sistemi belgesi',
    'Yurt dışı giriş çıkış kaydı veya sağlık raporu — varsa',
    'Vekâletname ve ilk yazışmalar',
  ],
  faq: [
    {
      q: 'Tebligatı hiç almadım, süre işler mi?',
      a: 'Tebligat m.21 usulüne uygun yapılmışsa ihbarnamenin kapıya yapıştırıldığı tarih tebliğ tarihi sayılır ve süre işler. Usulsüzlük varsa süre, öğrendiğinizi ispat ettiğiniz tarihten başlar.',
    },
    {
      q: 'Komşuma bırakılan tebligat geçerli mi?',
      a: 'Hayır. Tebligat aynı konutta oturan kişilere veya hizmetçiye yapılabilir; komşuya yalnız haber verilir, evrak teslim edilmez.',
    },
    {
      q: 'Usulsüz tebligat tebligatı geçersiz kılar mı?',
      a: 'Kendiliğinden geçersiz kılmaz. Muhatap tebliğe muttali olmuşsa tebligat muteber sayılır; değişen şey tebliğ tarihidir.',
    },
    {
      q: 'Öğrendiğim tarihi nasıl ispatlarım?',
      a: 'Dosyaya ilk erişim kaydı, banka haciz bildirimi, vekâletname tarihi, yurt dışı giriş çıkış kaydı veya sağlık raporu gibi somut belgelerle. Yalnızca beyan çoğu zaman yeterli görülmez.',
    },
    {
      q: 'Kapıya yapıştırma tek başına yeterli mi?',
      a: 'Yeterli değildir. Evrakın muhtar, ihtiyar heyeti üyesi veya zabıtaya imza karşılığı teslimi, ihbarnamenin kapıya yapıştırılması ve mümkünse komşu, yönetici ya da kapıcıya haber verilmesi birlikte aranır.',
    },
    {
      q: 'Adresim değişti, ne yapmalıyım?',
      a: 'Adres değişikliğini adres kayıt sistemine zamanında bildirin. Eski adrese yapılan tebligatta usulsüzlük iddiası çok daha dar bir alanda tartışılır.',
    },
  ],
  updated: '2026-08-16',
  sitemapPriority: 0.93,
};
