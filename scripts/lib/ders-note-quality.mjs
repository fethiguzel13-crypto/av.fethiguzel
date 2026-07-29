/**
 * Premium ders notu içerik motoru — anlaşılır metin + zengin diyagram verisi.
 */

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Ders bazlı akademik omurga — tanım, tuzak, örnek */
const COURSE_BANK = {
  'borclar-genel': {
    codeHint: 'TBK m.1–206',
    oneLiner:
      'Borç ilişkisi: kim kime neyi, hangi şartla borçludur? Kaynak → kuruluş → ifa → sona erme.',
    pillars: [
      'Borç ilişkisinin kaynakları (sözleşme, haksız fiil, sebepsiz zenginleşme)',
      'Sözleşmenin kurulması (icap–kabul)',
      'İrade sakatlıkları (hata, hile, korkutma)',
      'Temsil',
      'İfa, temerrüt, seçimlik haklar',
      'Sona erme ve zamanaşımı',
    ],
    definitions: [
      {
        baslik: 'Borç ilişkisi',
        govde:
          'Alacaklı ile borçlu arasında, alacaklının edim talep edebildiği hukuki bağdır. Tek bir “borç” değil; hak ve borçlar demetidir.',
      },
      {
        baslik: 'İcap',
        govde:
          'Sözleşme kurmaya yönelik, yeterince belirli ve bağlanma iradesi taşıyan tekliftir. Şaka / ön görüşme icap değildir.',
      },
      {
        baslik: 'Temerrüt',
        govde:
          'Muaccel borcun, borçluya yüklenebilir sebeple zamanında ifa edilmemesidir. İhtar kural; istisnalar unutulmamalıdır.',
      },
    ],
    traps: [
      'Sessizliği “kabul” sanmak — kural olarak sessizlik kabul değildir.',
      'Ayıp ile temerrüdü aynı torbaya koymak — rejim ve seçimlik haklar farklıdır.',
      'Zamanaşımını “hak düşürücü süre” ile karıştırmak.',
    ],
    examples: [
      {
        title: 'İcap – kabul zamanlaması',
        facts:
          'A, B’ye e-posta ile belirli fiyattan satım teklifi gönderir; B üç gün sonra “kabul” yazar. A teklifi geri aldığını iddia eder.',
        analysis:
          'Önce teklifin icap olup olmadığı (belirlilik + bağlanma iradesi), sonra geri almanın B’ye ulaşma anı, en sonda kabulün süreli/süresiz icaba etkisi yazılır. TBK’nın icap–kabul hükümleri omurgadır.',
        takeaway: 'Süre + kanal + “geri alma ulaştı mı?” üçlüsü cevabı taşır.',
      },
      {
        title: 'Aşırı yararlanma (gabin)',
        facts:
          'Acil nakit ihtiyacı olan satıcı, rayicin çok altında taşınır satar; sonra sözleşmenin butlanını ileri sürer.',
        analysis:
          'TBK m.28: subjektif unsur (zaruret / tecrübesizlik / düşüncesizlik) + objektif bariz oransızlık birlikte aranır. Tek başına “ucuz satış” yetmez. Süre ve seçimlik haklar kapatılmalıdır.',
        takeaway: 'Subjektif + objektif; ikisi birden.',
      },
      {
        title: 'Temerrüt ve seçimlik haklar',
        facts: 'Satıcı ayıplı malı devreder; alıcı ihtar sonrası ifadan dönmek ister.',
        analysis:
          'Önce ayıp mı temerrüt mü ayrılır. Ayıpta özel hükümler, temerrütte seçimlik haklar devreye girer. İhtar, süre ve zamanaşımı kutuları ayrı çizilir.',
        takeaway: 'Rejim seçmeden sonuç yazmak puan kaybettirir.',
      },
    ],
    mindmap: {
      center: 'Borç ilişkisi',
      branches: [
        { label: 'Kaynak', items: ['Sözleşme', 'Haksız fiil', 'Sebepsiz zenginleşme'] },
        { label: 'Kuruluş', items: ['İcap', 'Kabul', 'Şekil'] },
        { label: 'İfa', items: ['Zaman', 'Yer', 'Edim'] },
        { label: 'Bozulma', items: ['Temerrüt', 'İmkânsızlık', 'Ayıp'] },
      ],
    },
  },
  'medeni-baslangic': {
    codeHint: 'TMK m.1–7',
    oneLiner: 'Hukuku uygula, dürüst ol, iyiniyeti koru, ispatı bil — medeni hukukun kapısı burasıdır.',
    pillars: [
      'Hukukun uygulanması ve yorum (TMK m.1)',
      'Dürüstlük kuralı ve hakkın kötüye kullanılması (m.2)',
      'İyiniyet (m.3)',
      'İspat yükü (m.6)',
      'Hak ehliyeti / fiil ehliyeti',
      'Yerleşim yeri ve hısımlık girişi',
    ],
    definitions: [
      {
        baslik: 'Dürüstlük kuralı',
        govde:
          'Haklar kullanılırken ve borçlar ifa edilirken dürüstlük kuralına uyulur (TMK m.2/1). Hakkın açıkça kötüye kullanılması koruma görmez (m.2/2).',
      },
      {
        baslik: 'İyiniyet',
        govde:
          'Durumun gerektirdiği özeni gösteren kişinin bilmemesi / bilmesi gerekmemesidir. Ağır ihmal iyiniyeti düşürebilir.',
      },
      {
        baslik: 'Fiil ehliyeti',
        govde:
          'Kişinin bizzat haklarını kullanıp borç altına girebilme iktidarıdır. Ayırt etme gücü + erginlik + kısıtlı olmama basamakları önemlidir.',
      },
    ],
    traps: [
      'Şekil geçerliğini “her zaman hukuki koruma” sanmak (m.2).',
      'İyiniyeti “hiç bilmemek” sanmak — bilmesi gerekirdi mi?',
      'Küçüğün yaptığı her işlemi otomatik geçersiz saymak — işlem türü ve onay.',
    ],
    examples: [
      {
        title: 'Dürüstlük kuralı',
        facts: 'Alacaklı, borçlunun zayıf anını bilerek şeklen geçerli fakat hakkın amacına aykırı bir yola başvurur.',
        analysis: 'TMK m.2: şekil geçerliği tek başına yetmez; hakkın kötüye kullanılması koruma görmez. Olayda amaç–araç oransızlığı yazılır.',
        takeaway: 'Şekil ≠ her zaman koruma.',
      },
      {
        title: 'İyiniyet ve sicile güven',
        facts: 'Üçüncü kişi tapuya güvenerek devralır; sonradan sicil yanlışlığı çıkar.',
        analysis: 'İyiniyet + sicile güven birlikte okunur. Ağır ihmal / bilmesi gereken durum iyiniyeti kırar.',
        takeaway: '“Bilmeme + bilmesi gerekmeme”.',
      },
      {
        title: 'Fiil ehliyeti',
        facts: '15 yaşındaki ayırt etme gücüne sahip küçük, tek başına önemli bir taşınmaz satım vaadi imzalar.',
        analysis: 'Ehliyet basamağı + işlem türü + yasal temsilci onayı matrisi kurulur. Sonuç işlem türüne göre değişir.',
        takeaway: 'Ehliyet matrisi çizilmeden cevap yazılmaz.',
      },
    ],
    mindmap: {
      center: 'TMK başlangıç',
      branches: [
        { label: 'Uygulama', items: ['Kanun', 'Örf', 'Hakim hukuku'] },
        { label: 'Dürüstlük', items: ['m.2/1', 'm.2/2 kötüye kullanma'] },
        { label: 'İyiniyet', items: ['m.3', 'Karine'] },
        { label: 'İspat', items: ['m.6', 'İddia eden ispatlar'] },
      ],
    },
  },
  'ceza-genel': {
    codeHint: 'TCK Genel Hükümler',
    oneLiner: 'Suç = tipiklik + hukuka aykırılık + kusur. Sınavda her kutuyu ayrı yaz.',
    pillars: [
      'Suçun kanuni unsurları (tipiklik)',
      'Kast – taksir – olası kast',
      'Teşebbüs ve gönüllü vazgeçme',
      'İştirak (faillik, azmettirme, yardım)',
      'İçtima',
      'Yaptırım ve güvenlik tedbirleri girişi',
    ],
    definitions: [
      {
        baslik: 'Tipiklik',
        govde: 'Fiilin kanundaki suç tanımına birebir uymasıdır. “Kanunsuz suç ve ceza olmaz” ilkesinin somutudur.',
      },
      {
        baslik: 'Kast',
        govde: 'Suçun kanuni tanımındaki unsurların bilerek ve isteyerek gerçekleştirilmesidir. Olası kast ayrı rejimdir.',
      },
      {
        baslik: 'Teşebbüs',
        govde: 'İcraya elverişli şekilde başlanıp, elinde olmayan nedenle tamamlanamayan fiildir. Hazırlık ≠ teşebbüs.',
      },
    ],
    traps: [
      'Hazırlık hareketini teşebbüs yazmak.',
      'Olası kast ile bilinçli taksiri aynı cümlede eritmek.',
      'Her iştirakçiyi “asli fail” sanmak.',
    ],
    examples: [
      {
        title: 'Kastın görünümü',
        facts: 'Sanık “şaka yaptım” der; sonuç ağır yaralamadır.',
        analysis: 'İç dünya değil, dış delil ve bağlam yazılır. Olası kast / bilinçli taksir ayrımı kurulur.',
        takeaway: 'Delil görünümü > iç iddia.',
      },
      {
        title: 'Teşebbüs',
        facts: 'Fail icraya başlar fakat elinde olmayan nedenle tamamlayamaz.',
        analysis: 'Elverişlilik + icra başlangıcı + tamamlanmama. Gönüllü vazgeçme ayrı kutudur.',
        takeaway: 'Hazırlık / icra çizgisini olayda işaretle.',
      },
      {
        title: 'İştirak',
        facts: 'A planlar, B silah verir, C fiili işler.',
        analysis: 'Her fail için rol cümlesi: faillik / azmettirme / yardım. Bağlılık kuralı unutulmaz.',
        takeaway: 'Rol rol yaz; tek torba yapma.',
      },
    ],
    mindmap: {
      center: 'Suç teorisi',
      branches: [
        { label: 'Tipiklik', items: ['Fiil', 'Netice', 'Nedensellik'] },
        { label: 'Hukuka aykırılık', items: ['Meşru savunma', 'Zorunluluk'] },
        { label: 'Kusur', items: ['Kast', 'Taksir'] },
        { label: 'Genişleme', items: ['Teşebbüs', 'İştirak', 'İçtima'] },
      ],
    },
  },
  'esya-hukuku': {
    codeHint: 'TMK Eşya Hukuku',
    oneLiner: 'Kim, hangi eşya üzerinde, hangi ayni hakkı, nasıl kazanmış?',
    pillars: [
      'Zilyetlik',
      'Tapu sicili ve sicile güven',
      'Mülkiyet (paylı / el birliği)',
      'Sınırlı ayni haklar (irtifak, rehin, taşınmaz yükü)',
      'Kazanma yolları',
      'Koruma davaları',
    ],
    definitions: [
      {
        baslik: 'Zilyetlik',
        govde: 'Eşya üzerinde fiilî hâkimiyettir. Mülkiyetten farklıdır; ispat ve koruma işlevi vardır.',
      },
      {
        baslik: 'Sicile güven',
        govde: 'Tapu sicilindeki kayda iyiniyetle güvenen üçüncü kişinin korunmasıdır. İstisnalar unutulmamalıdır.',
      },
      {
        baslik: 'El birliği mülkiyet',
        govde: 'Paylar ayrılmadan ortakların birlikte malik olmasıdır. Kural: birlikte tasarruf.',
      },
    ],
    traps: [
      'Zilyetliği mülkiyet sanmak.',
      'Fiilî kullanımı otomatik kazandırıcı zamanaşımı sanmak.',
      'Paylı ile el birliğini karıştırmak.',
    ],
    examples: [
      {
        title: 'Sicile güven',
        facts: 'Üçüncü kişi sicile bakarak satın alır; asıl malik sicilin yanlış olduğunu ileri sürer.',
        analysis: 'İyiniyet + sicile güven şartları + istisnalar yazılır. Ağır ihmal tartışılır.',
        takeaway: 'Sicil fotoğrafı + iyiniyet delili.',
      },
      {
        title: 'El birliği kilitlenmesi',
        facts: 'Mirasçılardan biri tarlayı eker ve satmak ister; diğerleri karşı çıkar.',
        analysis: 'El birliğinde birlikte tasarruf. İzale / paylaşım yolları. Ecrimisil yan talep olabilir.',
        takeaway: 'Fiilî ekim ≠ tek başına satım yetkisi.',
      },
      {
        title: 'Zilyetlik koruması',
        facts: 'Zilyet, gasbedilen eşyayı geri ister.',
        analysis: 'Zilyetlik davaları ile istihkak ayrılır. Süre ve ispat farklıdır.',
        takeaway: 'Hangi dava? Zilyetlik mi mülkiyet mi?',
      },
    ],
    mindmap: {
      center: 'Eşya hukuku',
      branches: [
        { label: 'Zilyetlik', items: ['Kazanma', 'Koruma', 'İspat'] },
        { label: 'Mülkiyet', items: ['Paylı', 'El birliği', 'Sınırlamalar'] },
        { label: 'Sicil', items: ['Tescil', 'Güven', 'Şerh'] },
        { label: 'Sınırlı ayni hak', items: ['İrtifak', 'Rehin', 'Taşınmaz yükü'] },
      ],
    },
  },
  'medeni-usul': {
    codeHint: 'HMK',
    oneLiner: 'Doğru mercie, doğru sürede, doğru delille — usul kazanmadan maddi hak zor yürür.',
    pillars: [
      'Görev – yetki',
      'Dava şartları ve ilk itirazlar',
      'Dava türleri',
      'İspat ve deliller',
      'Hüküm ve kanun yolları',
      'Geçici hukuki korumalar',
    ],
    definitions: [
      {
        baslik: 'Dava şartı',
        govde: 'Mahkemenin esasa girebilmesi için varlığı/yokluğu aranan şartlardır. Eksikliği re’sen gözetilir.',
      },
      {
        baslik: 'İspat yükü',
        govde: 'Kural: iddia eden ispat eder. Kanuni karineler ve ispat kolaylıkları istisna üretir.',
      },
      {
        baslik: 'Kesin hüküm',
        govde: 'Aynı taraflar, aynı konu, aynı sebep üçlüsünde yeniden dava engelidir.',
      },
    ],
    traps: [
      'Görev ile yetkiyi karıştırmak.',
      'İlk itirazı süre kaçırınca hâlâ ileri sürmek.',
      'Delili “sonradan bulurum” sanmak — usulî preklüzyon.',
    ],
    examples: [
      {
        title: 'Görev–yetki',
        facts: 'Davacı yanlış mahkemede açar; davalı görev itirazı yapar.',
        analysis: 'Görev kamu düzeni; yetki kural olarak ilk itiraz. Sonuç ve süre farklı yazılır.',
        takeaway: 'Görev ≠ yetki.',
      },
      {
        title: 'İspat',
        facts: 'Taraflardan biri tanıkla ispat etmek ister; karşı taraf senet olduğunu söyler.',
        analysis: 'Senetle ispat zorunluluğu ve istisnaları. Delil sözleşmesi varsa ayrıca bakılır.',
        takeaway: 'Önce delil yolu, sonra tanık.',
      },
      {
        title: 'İhtiyati tedbir',
        facts: 'Hak kaybı tehlikesi var; esas dava henüz bitmedi.',
        analysis: 'Geçici hukuki koruma şartları, teminat, itiraz. Esastan bağımsız ama bağlantılıdır.',
        takeaway: 'Tedbir = geçici; esas değil.',
      },
    ],
    mindmap: {
      center: 'Medeni usul',
      branches: [
        { label: 'Kapı', items: ['Görev', 'Yetki', 'Dava şartı'] },
        { label: 'Dava', items: ['Tür', 'Islah', 'Feragat'] },
        { label: 'İspat', items: ['Delil', 'Yük', 'Keşif'] },
        { label: 'Son', items: ['Hüküm', 'İstinaf', 'Temyiz'] },
      ],
    },
  },
  'icra-iflas': {
    codeHint: 'İİK',
    oneLiner: 'Takip yolu seç → tebliğ → süre → haciz/satış. Usul hatası dosyayı bitirir.',
    pillars: [
      'İlamlı / ilamsız takip ayrımı',
      'Ödeme emri ve itiraz',
      'Haciz ve haczedilemezlik',
      'Satış',
      'İstihkak',
      'İflas ve konkordato girişi',
    ],
    definitions: [
      {
        baslik: 'İlamsız icra',
        govde: 'Mahkeme ilamı olmadan, alacaklının takip talebiyle başlayan icra yoludur. Ödeme emri ve itiraz merkezi önemdedir.',
      },
      {
        baslik: 'İtiraz',
        govde: 'Borçlunun ödeme emrine karşı süresinde başvurduğu savunma yoludur. Süre kaçınca sonuç ağırlaşır.',
      },
      {
        baslik: 'Haczedilemezlik',
        govde: 'Kanunun haczi yasakladığı mal ve haklardır. Kısmi haciz imkânları unutulmamalıdır.',
      },
    ],
    traps: [
      'İtiraz süresini “genel 2 hafta” sanmak — kural 7 gündür (ilamsız).',
      'İlamlı ile ilamsızı aynı rejimde yazmak.',
      'Haczedilemezliği hiç tartışmamak.',
    ],
    examples: [
      {
        title: 'Ödeme emrine itiraz',
        facts: 'Borçlu ödeme emrini tebellüğ eder; 10. günde itiraz eder.',
        analysis: 'Tebliğ tarihi + yasal süre. Geç itirazın sonucu. Tebligat usulsüzlüğü iddiası varsa ayrı kutu.',
        takeaway: 'Takvim + tebliğ belgesi.',
      },
      {
        title: 'Maaş haczi',
        facts: 'Alacaklı maaşın tamamına haciz ister.',
        analysis: 'Haczedilemezlik ve oranlar. Nafaka istisnaları. Dosya türüne göre yazılır.',
        takeaway: 'Tamamı değil; kanunî oran.',
      },
      {
        title: 'İstihkak',
        facts: 'Üçüncü kişi, haczedilen malın kendisine ait olduğunu söyler.',
        analysis: 'İstihkak iddiası ve davası. Zilyetlik karineleri. Süreler.',
        takeaway: 'Mal kimde? Karine kimden yana?',
      },
    ],
    mindmap: {
      center: 'İcra',
      branches: [
        { label: 'Yol', items: ['İlamlı', 'İlamsız', 'Kambiyo'] },
        { label: 'Savunma', items: ['İtiraz', 'Şikâyet', 'İstihkak'] },
        { label: 'Cebri', items: ['Haciz', 'Satış', 'Paraya çevirme'] },
        { label: 'Ağır yol', items: ['İflas', 'Konkordato'] },
      ],
    },
  },
  'aile-hukuku': {
    codeHint: 'TMK Aile',
    oneLiner: 'Evlilik – boşanma – velayet – nafaka – mal rejimi: her biri ayrı dosya mantığıdır.',
    pillars: [
      'Evliliğin kurulması ve genel hükümler',
      'Boşanma sebepleri',
      'Velayet ve kişisel ilişki',
      'Nafaka türleri',
      'Mal rejimi ve tasfiye',
      'Soybağı girişi',
    ],
    definitions: [
      {
        baslik: 'Velayet',
        govde: 'Çocuğun bakım, eğitim ve temsiline ilişkin ana-baba yetki ve ödevidir. Çocuk yararı ölçüttür.',
      },
      {
        baslik: 'Yoksulluk nafakası',
        govde: 'Boşanma yüzünden yoksulluğa düşecek tarafın, kusuru daha ağır olmamak kaydıyla talep edebileceği nafakadır.',
      },
      {
        baslik: 'Edinilmiş mallara katılma',
        govde: 'Yasal mal rejimidir. Edinilmiş mallar ile kişisel mallar ayrımı tasfiyenin omurgasıdır.',
      },
    ],
    traps: [
      'Tüm nafakaları aynı sepete koymak (tedbir / iştirak / yoksulluk).',
      'Velayeti “ödül-ceza” gibi yazmak — çocuk yararı.',
      'Mal rejimini boşanma sebebine karıştırmak.',
    ],
    examples: [
      {
        title: 'Anlaşmalı boşanma protokolü',
        facts: 'Taraflar “mal paylaşımı yapılsın” diye tek cümle yazar.',
        analysis: 'Protokol belirsizse sonraki dava kapısı açılır. Net liste, değer, teslim tarihi yazılmalıdır.',
        takeaway: 'Belirsiz protokol = yarınki dava.',
      },
      {
        title: 'Velayet',
        facts: 'Her iki taraf da velayet ister; çocuk 8 yaşındadır.',
        analysis: 'Çocuk yararı, fiilî bakım, kardeşler birliği, sosyal inceleme. Kusur tek başına belirleyici değildir.',
        takeaway: 'Çocuk merkezli yaz.',
      },
      {
        title: 'Mal rejimi tasfiyesi',
        facts: 'Evlilikte alınan daire kimin üzerine kayıtlıysa onundur denir.',
        analysis: 'Kayıt ≠ tasfiye sonucu. Edinilmiş / kişisel mal ayrımı + artık değer hesabı.',
        takeaway: 'Tapu adına bakıp bitirme.',
      },
    ],
    mindmap: {
      center: 'Aile hukuku',
      branches: [
        { label: 'Evlilik', items: ['Kuruluş', 'Genel hükümler'] },
        { label: 'Boşanma', items: ['Sebepler', 'Usul'] },
        { label: 'Çocuk', items: ['Velayet', 'Kişisel ilişki'] },
        { label: 'Mal', items: ['Rejim', 'Tasfiye', 'Nafaka'] },
      ],
    },
  },
  'miras-hukuku': {
    codeHint: 'TMK Miras',
    oneLiner: 'Kim mirasçı, ne kadar pay, saklı pay var mı, vasiyet geçerli mi?',
    pillars: [
      'Yasal mirasçılık ve zümreler',
      'Saklı pay',
      'Ölüme bağlı tasarruflar',
      'Mirasın geçmesi ve ret',
      'Paylaşma',
      'Tenkis / istihkak girişi',
    ],
    definitions: [
      {
        baslik: 'Zümre sistemi',
        govde: 'Yasal mirasçılar zümreler hâlinde belirlenir. Önceki zümre varken sonrakiler mirasçı olmaz (kural).',
      },
      {
        baslik: 'Saklı pay',
        govde: 'Belirli mirasçıların iradeyle ortadan kaldırılamayan minimum payıdır. Tenkis ile korunur.',
      },
      {
        baslik: 'Mirasın reddi',
        govde: 'Mirasçının mirası kabul etmeme beyanıdır. Süre ve şekil şartları vardır; sonuçları ağırdır.',
      },
    ],
    traps: [
      'Eşin payını zümreyle yanlış birleştirmek.',
      'Saklı payı “yasal pay” sanmak.',
      'Ret süresini kaçırıp hâlâ ret iddia etmek.',
    ],
    examples: [
      {
        title: 'Yasal mirasçılar',
        facts: 'Miras bırakanın eşi ve iki çocuğu vardır; vasiyet yoktur.',
        analysis: 'Zümre + eşin payı birlikte yazılır. Saklı pay ayrıca hesaplanır.',
        takeaway: 'Önce yasal tablo, sonra saklı pay.',
      },
      {
        title: 'Tenkis',
        facts: 'Miras bırakan tüm malını üçüncü kişiye bağışlar; çocuklar itiraz eder.',
        analysis: 'Saklı pay ihlali + tenkis. Sıra ve süre. Kazandırmanın türü önemli.',
        takeaway: 'Saklı pay ihlal edildiyse tenkis kutusu aç.',
      },
      {
        title: 'Ret',
        facts: 'Miras borçludur; mirasçı reddetmek ister.',
        analysis: 'Ret süresi, yetkili merci, sonuç. Gerçek ret / hükmi ret ayrımı.',
        takeaway: 'Borçlu mirasta takvim tut.',
      },
    ],
    mindmap: {
      center: 'Miras',
      branches: [
        { label: 'Kim?', items: ['Zümre', 'Eş', 'Devlet'] },
        { label: 'Ne kadar?', items: ['Yasal pay', 'Saklı pay'] },
        { label: 'İrade', items: ['Vasiyet', 'Miras sözleşmesi'] },
        { label: 'Sonra', items: ['Ret', 'Paylaşma', 'Tenkis'] },
      ],
    },
  },
  default: {
    codeHint: 'ilgili kanun ve doktrin',
    oneLiner: 'Tanım → dayanak → unsur → olaya uygula → sonuç → istisna.',
    pillars: [
      'Kavramsal çerçeve',
      'Kanuni dayanak',
      'Unsurlar / şartlar',
      'Hukuki sonuçlar',
      'İspat ve usul bağlantısı',
      'Sınavda sık düşülen hatalar',
    ],
    definitions: [
      {
        baslik: 'Tanım cümlesi',
        govde: 'Her kurum için tek cümlelik, unsurları ima eden tanım yazın. Ezber slogan değil; işleyen tanımdır.',
      },
      {
        baslik: 'Subsumption',
        govde: 'Olaydaki olguları kanuni unsurlara tek tek yedirme işlemidir. Sınavın kalbidir.',
      },
      {
        baslik: 'İstisna kutusu',
        govde: 'Genel kuralı yazdıktan sonra kanundaki istisna/istisnanın istisnası kapatılmazsa puan kaçar.',
      },
    ],
    traps: [
      'Uzun giriş, kısa hukuk.',
      'Unsur atlama.',
      'Usul/süre kutusunu unutma.',
    ],
    examples: [
      {
        title: 'Tipik olay sorusu',
        facts: 'Kısa bir olay verilir; “hukuki durumu değerlendiriniz” denir.',
        analysis: 'İstenen sonuç → uygulanacak kurum → unsur listesi → olgu eşlemesi → sonuç cümlesi.',
        takeaway: 'İskelet önce, süs sonra.',
      },
      {
        title: 'Tanım sorusu',
        facts: '“X nedir? Şartları nelerdir?”',
        analysis: 'Tanım + unsurlar numaralı + bir cümle örnek. Dağınık paragraf yazmayın.',
        takeaway: 'Numaralandır.',
      },
      {
        title: 'Karşılaştırma sorusu',
        facts: '“A ile B’yi karşılaştırınız.”',
        analysis: 'Tablo zihni: benzerlik / fark / hukuki sonuç. Her fark için bir cümle sonuç.',
        takeaway: 'Fark yaz, sonuç bağla.',
      },
    ],
    mindmap: {
      center: 'Ders omurgası',
      branches: [
        { label: 'Kavram', items: ['Tanım', 'Amaç'] },
        { label: 'Dayanak', items: ['Madde', 'İlke'] },
        { label: 'Unsur', items: ['1', '2', '3'] },
        { label: 'Sonuç', items: ['Hüküm', 'İstisna'] },
      ],
    },
  },
};

// Alan bazlı ek tuzaklar
const AREA_EXTRA = {
  ozel: 'Özel hukukta irade, şekil ve ispat üçlüsünü her soruda kontrol edin.',
  kamu: 'Kamu hukukunda yetki – şekil – sebep – konu – amaç (idari işlem) veya suç teorisi kutularını karıştırmayın.',
  usul: 'Usulde süre kaçarsa çoğu zaman hak kaybı riski doğar; takvim cümlesi şarttır.',
  ticaret: 'Ticari iş karinesi, faiz ve ispat kolaylıkları TBK genelinden sapma üretebilir.',
  genel: 'Kavramı somut kurumla bağlayın; felsefi girişte boğulmayın.',
  secmeli: 'Çekirdek ders omurgasını unutmayın; seçmeli ek mevzuatı ayrıca etiketleyin.',
};

export function buildPremiumNote(uni, course, coreCourses) {
  const bank = COURSE_BANK[course.code] || COURSE_BANK.default;
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma (dönem/yıl)'
        : 'dönemlik (güz/bahar)';

  const langNote =
    uni.lang === 'fr'
      ? 'Programda Fransızca/mehaz okuma beklentisi olabilir; cevabı Türkçe dogmatik iskeletle kurun, karşılaştırmayı kısa tutun.'
      : uni.lang === 'tr-en30' || uni.lang === 'en'
        ? 'Kısmen İngilizce kaynak çıkabilir; terimi Türkçe kurup gerekirse “yani …” ile açıklayın (parantez içi İngilizce yığmayın).'
        : 'Türkçe madde temelli, sade ve numaralı anlatım beklenir.';

  const areaTip = AREA_EXTRA[course.area] || AREA_EXTRA.genel;

  const h1 = `${uni.shortName} ${course.title} Ders Notu`;
  const title = `${uni.shortName} ${course.title} Ders Notları — Şematik & Örnekli | ${uni.city}`;
  const description = `${uni.name} için ${course.title}: net tanımlar, şekilli şemalar, sınav iskeleti, işlenmiş örnek olay. ${calLabel}. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencisi için yazılmış ${course.title} notudur. Amaç ezber yığını değil; sınav kâğıdında işe yarayan net iskelet, görsel şema ve işlenmiş örnektir. Omurga: ${bank.codeHint}. ${langNote}`;

  const promise = bank.oneLiner;

  const sixtySecond = [
    `Bu dersin tek cümlesi: ${bank.oneLiner}`,
    `Kanuni pusula: ${bank.codeHint}`,
    `Cevap sırası: tanım → dayanak → unsur → olaya uygula → sonuç → istisna`,
    `Bugün ezberleme: 3 tanım kartı + 1 örnek olay yazımı`,
    areaTip,
  ];

  const sections = [
    {
      heading: '1. Bu notu nasıl okumalısın? (3 adım)',
      paragraphs: [
        `Kağıdı baştan sona “roman gibi” okumayın. Önce 60 saniyelik omurgayı, sonra tanım kartlarını, en sonda bir örnek olayı kendi cümlelerinizle yazın. ${uni.shortName} klasik sınavında okunabilir başlık (I, II, III) puan kazandırır.`,
        `${course.title} ${course.year}. sınıf ${course.area === 'ozel' ? 'özel hukuk' : course.area === 'kamu' ? 'kamu hukuku' : course.area === 'usul' ? 'usul' : course.area === 'ticaret' ? 'ticaret hukuku' : 'genel'} bloğundadır. ${uni.type === 'vakif' ? 'Vakıf fakültelerinde ödev/sunum bileşeni görülebilir; yine de finalde klasik ağırlık sıktır.' : 'Devlet fakültelerinde uzun yazılı cevap kültürü yaygındır.'}`,
      ],
      bullets: [
        'Adım A — 60 sn omurgayı sesli oku',
        'Adım B — 3 tanım kartını kapalı deftere yaz',
        'Adım C — 1 örneği 12 dakikada çöz (süre tut)',
      ],
      hapBilgi:
        'İyi not = az ama net. Her kurumu “tanım + 3 unsur + 1 tuzak + 1 örnek” ile bitirin.',
    },
    {
      heading: '2. Kavram haritası — önce resmi gör',
      paragraphs: [
        `Aşağıdaki harita ${course.title} dersinin zihinsel dolabıdır. Sınavda kaybolmamak için her soruda haritadan “hangi rafa gittim?” diye sorun.`,
        `Omurga başlıkları (${bank.codeHint}): ${bank.pillars.join('; ')}.`,
      ],
      bullets: bank.pillars.map((p, i) => `${i + 1}) ${p}`),
      hapBilgi: bank.oneLiner,
    },
    {
      heading: '3. Tanım kartları (ezber değil, işler tanım)',
      paragraphs: [
        'Tanım, unsurları fısıldamalıdır. “Güzel cümle” değil, sınavda alt başlık üreten cümle yazın.',
      ],
      kartlar: bank.definitions,
      uyari: (bank.traps && bank.traps[0]) || 'Tanımı yazıp unsurları unutmak en sık puan kaybıdır.',
    },
    {
      heading: '4. Unsurlar ve “olaya yedirme” (subsumption)',
      paragraphs: [
        'Klasik olay sorusunda hoca şunu ister: kanuni unsurları sıralamanızı ve olay cümlelerini bu unsurlara tek tek bağlamanızı. Uzun hikâye anlatmayın; eşleme yapın.',
        `Örnek iskelet: (1) İstenen hukuki sonuç nedir? (2) Hangi kurum? (3) Unsur listesi. (4) Olaydan delil/olgular. (5) Sonuç cümlesi. (6) İstisna / süre / ispat.`,
      ],
      bullets: [
        'Her unsur için olaydan en az bir cümle bulun',
        'Eksik olgu varsa “dosyada yok / araştırılmalı” deyin; uydurmayın',
        'Süre varsa takvimi açık yazın',
        areaTip,
      ],
      hapBilgi: 'Subsumption = olgu → unsur eşlemesi. Bu cümleyi kâğıda fiilen yazın.',
    },
    {
      heading: '5. Sınav tuzağı defteri',
      paragraphs: [
        `${uni.shortName} kâğıdında en çok puan, tuzakları önceden bilmekten gelir. Aşağıdakiler ${course.title} için tipik kayıp noktalarıdır.`,
      ],
      bullets: bank.traps || COURSE_BANK.default.traps,
      uyari: 'Genel kuralı yazıp istisnayı unutmak = yarı puan. Cevabın sonuna “ancak …” kutusu koyun.',
    },
    {
      heading: `6. ${uni.shortName} sınav tekniği`,
      paragraphs: [
        `Takvim: ${calLabel}. Tipik ağırlık birçok programda ara sınav ~%30–40, final ~%50–60 bandındadır; kesin oran OBS/yönetmeliktedir.`,
        `60 dakikada 3 soru varsayın: soru başı ~18 dk + 6 dk kontrol. İlk 3 dakikada başlık iskeleti (I-II-III) çizilir, sonra doldurulur.`,
        `Format: ${uni.type === 'vakif' ? 'klasik + ara sınav; ödev/sunum çıkabilir' : 'ağırlıklı klasik yazılı'}. ${langNote}`,
      ],
      bullets: [
        'Başlıkları görünür yaz (I / II / III)',
        'Her başlıkta en az bir madde / ilke adı geçsin',
        'Son paragraf: net sonuç + istisna kontrolü',
        'Yanlış defteri: her denemede 5 hata kaydı',
      ],
      hapBilgi: 'Okunabilir kâğıt = yüksek not. Hocanın gözü yorulursa puanınız da yorulur.',
    },
    {
      heading: '7. Haftalık mini plan (gerçekçi)',
      paragraphs: [
        `${uni.calendar === 'donemlik' ? '14 haftalık dönem' : 'Yıllık/yoğun program'} için tempo: 2 hafta kavram, 4 hafta unsur, 1 hafta ara sınav tekrarı, 4 hafta örnek olay, 2 hafta genel tekrar + deneme.`,
      ],
      bullets: [
        'Pzt: madde + tanım kartı (40 dk)',
        'Çrş: 1 örnek olayı elle yaz (25 dk)',
        'Cum: arkadaşa 5 soruluk mini quiz',
        'Paz: yanlış defteri + şema çiz',
      ],
    },
  ];

  const examples = (bank.examples || COURSE_BANK.default.examples).map((e, i) => ({
    ...e,
    title: `Örnek ${i + 1} — ${e.title}`,
  }));

  const mm = bank.mindmap || COURSE_BANK.default.mindmap;
  const diagrams = [
    {
      kind: 'mindmap',
      title: `${course.title} — zihin haritası`,
      center: mm.center,
      branches: mm.branches,
    },
    {
      kind: 'process',
      title: 'Klasik sınav cevap iskeleti (her soruda kullan)',
      steps: [
        'İstenen sonucu yaz',
        'Kurumu seç',
        'Tanım (1 cümle)',
        'Unsurları numarala',
        'Olayı unsurlara yedir',
        'Sonuç + istisna/süre',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar / kontrol tablosu',
      headers: ['Konu', 'Doğru yaklaşım', 'Tuzak'],
      rows: (bank.pillars || []).slice(0, 4).map((p, i) => [
        p.split('(')[0].trim().slice(0, 42),
        'Tanım + unsur + olgu eşlemesi',
        (bank.traps && bank.traps[i]) || 'İstisnayı unutmak',
      ]),
    },
    {
      kind: 'ladder',
      title: 'Öğrenme merdiveni',
      levels: [
        'Tanım kartı ezberi (pasif)',
        'Şema çizme (aktif)',
        'Örnek olay yazma',
        'Süre tutarak deneme',
        'Yanlış defteri ile ustalaşma',
      ],
    },
    {
      kind: 'fork',
      title: 'Soru tipi ayrımı',
      leftTitle: 'Tanım / unsur sorusu',
      rightTitle: 'Olay sorusu',
      left: 'Kısa tanım + numaralı unsurlar + 1 mini örnek cümle',
      right: 'İstenen sonuç → kurum → subsumption → net hüküm',
    },
    {
      kind: 'cycle',
      title: 'Haftalık çalışma döngüsü',
      steps: ['Oku', 'Şema çiz', 'Örnek yaz', 'Quiz', 'Yanlış defteri'],
    },
  ];

  const faq = [
    {
      q: `${course.title} için en verimli çalışma yöntemi nedir?`,
      a: 'Her gün az: 1 tanım kartı + 1 kısa şema + haftada 2 örnek olay. Uzun ama seyrek maratonlar kalıcı olmuyor.',
    },
    {
      q: 'Madde numarası ezberlemek şart mı?',
      a: 'Madde + unsur iskeleti birlikte puan getirir. Salt numara, olaya uygulamadan düşük kalır; salt hikâye de öyle.',
    },
    {
      q: 'Bu not hocanın yerini tutar mı?',
      a: 'Hayır. Ücretsiz destektir. Duyuru, slayt ve ölçme düzeni bağlayıcıdır; telifli slayt kopyalanmaz.',
    },
    {
      q: `${uni.shortName}’de dönemlik mi yıllık mı?`,
      a: `Genel çerçeve ${calLabel}. Kesin ders kodu/AKTS için dönem ilanı ve OBS esastır.`,
    },
    {
      q: 'PDF alabilir miyim?',
      a: 'Evet — “PDF / Yazdır” ile kişisel arşiv. Ticari çoğaltma/satış yasaktır.',
    },
    {
      q: 'Başka kaynak?',
      a: 'Güncel kanun metni + bir sistematik kitap + kısa içtihat okuması. “Kaçak not” pazarlarından uzak durun.',
    },
  ];

  const checklist = [
    '3 tanım kartını kapalı deftere yazdım',
    'Zihin haritasını bir sayfada çizdim',
    'En az 2 örnek olayı süre tutarak yazdım',
    'Tuzak defterine 5 madde ekledim',
    'Bir deneme klasikte başlık iskeleti kullandım',
    'İstisna / süre kutusunu her cevapta kontrol ettim',
    'OBS’den vize-final ağırlığını doğruladım',
    'PDF’i kişisel arşive kaydettim',
  ];

  return {
    uniSlug: uni.slug,
    courseCode: course.code,
    slug: `${uni.slug}__${course.code}`,
    title,
    description,
    h1,
    keywords: [
      `${uni.shortName} ${course.title} ders notu`,
      `${uni.shortName} hukuk ders notları`,
      `${course.title} şematik not`,
      ...uni.aliases.slice(0, 2).map((a) => `${a} ${course.title}`),
      ...course.keywords,
      'ücretsiz hukuk ders notu',
      'hukuk fakültesi pdf not',
      'örnek olaylı ders notu',
    ],
    lead,
    promise,
    sixtySecond,
    examBox: {
      calendar: uni.calendar,
      typicalWeights: 'Ara sınav ~%30–40 · Final ~%50–60 (yönetmeliğe göre değişir)',
      format:
        uni.type === 'vakif'
          ? 'Klasik + ara sınav; ödev/sunum olabilir'
          : 'Ağırlıklı klasik yazılı',
      tips: [
        'I-II-III başlık kullan',
        'Unsurları numarala',
        'Olayı unsura yedir',
        'İstisna/süre kutusunu kapat',
        'Son cümlede net sonuç yaz',
      ],
    },
    learningOutcomes: [
      `${course.title} temel kurumlarını tek cümlede tanımlar`,
      'Kanuni unsurları ayırır ve listeler',
      'Kısa olayı unsurlara subsume eder',
      'Sınav kâğıdında okunabilir iskelet kurar',
      'Tipik tuzakları (istisna/süre/ehliyet) kontrol eder',
    ],
    sections,
    examples,
    diagrams,
    faq,
    checklist,
    relatedCourses: coreCourses
      .filter((c) => c.code !== course.code && c.year === course.year)
      .slice(0, 4)
      .map((c) => c.code),
    relatedBilgi: [],
    updated: '2026-07-29',
    wordTarget: 4500,
    qualityTier: 'premium',
  };
}

export { hash, COURSE_BANK };
