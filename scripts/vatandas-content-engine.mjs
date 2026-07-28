/**
 * Derin içerik motoru — şablon spam’i kırar, konuya özgü hukuki bilgi üretir.
 * generate-vatandas-rehberi.mjs tarafından import edilir.
 */

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick(arr, seed, salt = 0) {
  if (!arr || !arr.length) return '';
  return arr[(seed + salt * 17) % arr.length];
}

function pickN(arr, seed, n) {
  if (!arr?.length) return [];
  const out = [];
  const used = new Set();
  for (let i = 0; i < n * 3 && out.length < n; i++) {
    const idx = (seed + i * 31) % arr.length;
    if (used.has(idx)) continue;
    used.add(idx);
    out.push(arr[idx]);
  }
  return out;
}

/** Kategori bilgi bankası — süre, merci, kanun, risk, belge, adım */
export const CAT_BANK = {
  Aile: {
    kanunlar: ['TMK (4721)', '6284 sayılı Kanun', 'HMK (6100)'],
    merciler: ['aile mahkemesi', 'nüfus müdürlüğü', 'Aile ve Sosyal Hizmetler', 'savcılık (şiddet)'],
    sureler: [
      'Anlaşmalı boşanmada duruşma takvimi mahkemeye göre değişir; protokol eksiksiz olmalıdır.',
      'Velayet ve nafaka kararları çocuk yararına her zaman yeniden görülebilir; artırım-indirme davası açılabilir.',
      '6284 koruma talepleri acil niteliktedir; gecikme mağdur güvenliğini riske atar.',
    ],
    belgeler: ['nüfus kayıt örneği', 'gelir belgesi', 'protokol', 'tıbbi/psikolojik rapor', 'tanık listesi'],
    riskler: [
      'Sözlü nafaka/velayet anlaşmasının yazılı ve mahkeme onaylı olmaması',
      'Çocukla kişisel ilişki ihlalinde icra ve disiplin yaptırımları',
      'Mal rejimi tasfiyesinde delil ve değerleme gecikmesi',
    ],
    adimlar: [
      'Aile durumunu ve belgeleri (nüfus, gelir, çocuk) derleyin.',
      'Anlaşmalı mı çekişmeli mi olduğuna karar verin; protokol taslağı hazırlayın.',
      'Görevli aile mahkemesinde dava veya 6284 başvurusu yapın.',
      'Tebliğ ve ara kararları (tedbir nafakası, kişisel ilişki) takip edin.',
      'Kesinleşen kararı icra veya nüfus işlemleri için kullanın.',
    ],
  },
  İş: {
    kanunlar: ['4857 sayılı İş Kanunu', '6356 sayılı Sendikalar Kanunu', '7036 sayılı İş Mahkemeleri Kanunu', 'SSGSSK'],
    merciler: ['arabuluculuk bürosu', 'iş mahkemesi', 'SGK', 'İŞKUR', 'Çalışma ve Sosyal Güvenlik'],
    sureler: [
      'İşe iade ve birçok işçilik alacağında arabuluculuk dava şartıdır; süreler tebliğ/fesih tarihine bağlıdır.',
      'İşçilik alacaklarında zamanaşımı kural olarak 5 yıldır (somut kaleme göre kontrol edilmeli).',
      'İş kazası bildirimi işveren için kısa yasal süreye tabidir; gecikme idari ve hukuki sonuç doğurur.',
    ],
    belgeler: ['iş sözleşmesi', 'bordro', 'SGK hizmet dökümü', 'fesih bildirimi', 'puantaj/mesai kayıtları', 'arabuluculuk son tutanağı'],
    riskler: [
      'Arabuluculuğa gitmeden dava açmak (dava şartı eksikliği)',
      'İbranameyi okumadan imzalamak',
      'Fesih tebliğ tarihini ispatlayamamak',
    ],
    adimlar: [
      'Fesih/ayrılış belgelerini ve bordroları toplayın; SGK dökümü alın.',
      'Kıdem, ihbar, fazla mesai, yıllık izin kalemlerini listeleyin.',
      'Zorunluysa arabuluculuğa başvurun; tutanağı saklayın.',
      'Anlaşmazlıkta iş mahkemesinde dava açın; delil listesini ekleyin.',
      'İlam sonrası icra veya ödeme planını takip edin.',
    ],
  },
  İcra: {
    kanunlar: ['2004 sayılı İİK', 'HMK', 'Tebligat Kanunu'],
    merciler: ['icra dairesi', 'icra mahkemesi', 'asliye hukuk (itirazın iptali)', 'UYAP'],
    sureler: [
      'Ödeme emrine itiraz süresi tebliğden itibaren kural olarak 7 gündür.',
      'İcra şikâyetleri için de kısa (çoğu halde 7 gün) süreler vardır.',
      'Haciz, satış ve sıra cetveli aşamalarında süre kaçırma hak kaybına yol açabilir.',
    ],
    belgeler: ['ödeme emri', 'takip talebi', 'senet/çek/ilam', 'tebligat mazbatası', 'dekont', 'haciz tutanağı'],
    riskler: [
      '7 günlük itiraz süresini kaçırmak',
      'Usulsüz tebligatı fark edip öğrenme tarihini sabitlememek',
      'İcra taahhüdünü ihlal etmek (tazyik riski)',
    ],
    adimlar: [
      'Ödeme emri/tebligatı ve dosya numarasını kaydedin; UYAP/e-Devletten bakın.',
      'Borç ve faiz hesabını kontrol edin; itiraz gerekçesini belirleyin.',
      'Süresi içinde icra dairesine itiraz veya şikâyet yapın.',
      'Haciz varsa istihkak, menfi tespit veya ödeme seçeneklerini değerlendirin.',
      'Dosya kapanışı ve haciz fekkini yazılı teyit edin.',
    ],
  },
  Kira: {
    kanunlar: ['TBK kira hükümleri', 'HMK', 'İİK (kira alacağı/tahliye)'],
    merciler: ['arabuluculuk', 'sulh hukuk / asliye hukuk', 'icra dairesi'],
    sureler: [
      'Konut kiralarında dönemsel yasal artış sınırları Resmî Gazete/TBK uygulamasına göre değişebilir.',
      'Tahliye sebepleri (ihtiyaç, taahhüt, iki haklı ihtar, temerrüt) ayrı usullere tabidir.',
      'Kira tespitinde 5 yıllık dönem ve arabuluculuk şartı uygulamada sık sorulur.',
    ],
    belgeler: ['kira sözleşmesi', 'ödeme dekontları', 'ihtarname', 'tahliye taahhüdü', 'teslim tutanağı'],
    riskler: [
      'Elden ödeme ispatı olmaması',
      'Geçersiz tahliye taahhüdü (tarih/imza sorunları)',
      'Depozitoda kesinti belgesizliği',
    ],
    adimlar: [
      'Sözleşme, ödemeler ve yazışmaları dosyalayın.',
      'Artış oranı veya tahliye sebebini yasal dayanakla netleştirin.',
      'Gerekirse noter ihtarı çekin; tebliğ alın.',
      'Kapsamdaysa arabuluculuğa gidin.',
      'Dava veya icra yolunu seçin; süreleri takip edin.',
    ],
  },
  Tüketici: {
    kanunlar: ['6502 sayılı TKHK', 'mesafeli sözleşmeler mevzuatı', 'TBK ayıp hükümleri'],
    merciler: ['tüketici hakem heyeti', 'tüketici mahkemesi', 'banka/şirket müşteri hizmetleri', 'e-Devlet'],
    sureler: [
      'Mesafeli satışta cayma hakkı kural olarak 14 gündür; istisnalar yönetmelikte sayılır.',
      'Hakem heyeti parasal sınırları her yıl güncellenir.',
      'Ayıp ihbarında TBK/TKHK süre ayrımına dikkat edilmelidir.',
    ],
    belgeler: ['fatura/sipariş', 'garanti', 'kargo fişi', 'yazışma', 'cayma bildirimi'],
    riskler: ['Cayma süresini kaçırmak', 'Parasal sınırı yanlış mercie başvurmak', 'Ayıbı geç bildirmek'],
    adimlar: [
      'Sözleşme/fatura ve ayıp kanıtlarını toplayın.',
      'Satıcıya yazılı başvuru yapın; süre verin.',
      'Sonuç alamazsanız hakem heyeti veya mahkemeyi seçin.',
      'e-Devlet başvuru numarasını saklayın.',
      'Karar aleyhineyse itiraz/dava süresini hesaplayın.',
    ],
  },
  Miras: {
    kanunlar: ['TMK miras hükümleri', 'Veraset ve İntikal Vergisi Kanunu'],
    merciler: ['sulh hukuk (veraset)', 'noter', 'asliye hukuk', 'tapu', 'vergi dairesi'],
    sureler: [
      'Mirasın reddi için yasal süre vardır; kaçırılırsa kabul edilmiş sayılma riski doğar.',
      'Tenkis ve muris muvazaası davalarında zamanaşımı/hak düşürücü süreler somut olaya göre değişir.',
      'Veraset ilamı e-Devlet/noter/mahkeme yollarından biriyle alınabilir.',
    ],
    belgeler: ['ölüm belgesi', 'nüfus kayıt', 'veraset ilamı', 'tapu', 'vasiyet'],
    riskler: ['Red süresini kaçırmak', 'Saklı payı yok sayan vasiyet/tasarruf', 'Hisseli tapuda önalım ve izale ihtilafı'],
    adimlar: [
      'Ölüm ve mirasçı listesini nüfustan doğrulayın.',
      'Veraset ilamı alın (e-Devlet/noter/mahkeme).',
      'Borç-alacak ve taşınmazları envanterleyin; red gerekip gerekmediğine bakın.',
      'Paylaşım veya izale-i şuyu yolunu seçin.',
      'Vergi ve tapu devir işlemlerini tamamlayın.',
    ],
  },
  Eşya: {
    kanunlar: ['TMK eşya', 'Kat Mülkiyeti Kanunu', 'Tapu Kanunu'],
    merciler: ['tapu müdürlüğü', 'kadastro', 'asliye hukuk', 'icra'],
    sureler: [
      'Önalım hakkının kullanılması için yasal bildirim ve dava süreleri kritiktir.',
      'Tapu iptal-tescil ve muris muvazaasında ispat yükü ve zamanaşımı somut olaya bağlıdır.',
      'İpotek fekki ve haciz şerhi kaldırma ödeme/ evrak sonrası yapılır.',
    ],
    belgeler: ['tapu kaydı', 'sözleşme', 'vekâlet', 'DASK', 'ödeme makbuzu', 'imar/iskan'],
    riskler: ['Vekâletle satışta sahtecilik', 'Hisseli tapu riskleri', 'Şekil şartına uyulmayan satış vaadi'],
    adimlar: [
      'TAKBİS/e-Devletten tapu ve şerhleri kontrol edin.',
      'Sözleşme ve harç/ödeme belgelerini hazırlayın.',
      'Tapu randevusu alın; DASK ve kimlikleri tamamlayın.',
      'Devir sonrası belediye/emlak vergisi bildirimini unutmayın.',
      'Uyuşmazlıkta ihtiyati tedbir veya dava yolunu değerlendirin.',
    ],
  },
  Ceza: {
    kanunlar: ['TCK (5237)', 'CMK (5271)', 'PVSK'],
    merciler: ['kolluk', 'Cumhuriyet savcılığı', 'sulh ceza hâkimliği', 'ceza mahkemesi'],
    sureler: [
      'Şikâyete bağlı suçlarda şikâyet süresi kural olarak 6 aydır (somut suç tipine bakın).',
      'Gözaltı süreleri CMK’ya tabidir; müdafi hakkı vazgeçilemez temel güvencedir.',
      'Uzlaştırma kapsamındaki dosyalarda süreç farklı işler.',
    ],
    belgeler: ['şikâyet dilekçesi', 'delil dökümü', 'tıbbi rapor', 'ekran görüntüsü', 'tanık listesi'],
    riskler: ['Şikâyet süresini kaçırmak', 'Delili bozmak/silmek', 'İfadede müdafiden feragat'],
    adimlar: [
      'Olay ve delilleri tarih sırasıyla kaydedin.',
      'Şikâyet/suç duyurusunu savcılık veya e-şikâyet ile yapın.',
      'İfade/gözaltında müdafi ve susma hakkını kullanın.',
      'Soruşturma sonucunu (kovuşturmaya yer yok / iddianame) takip edin.',
      'Mağdur-şüpheli sıfatına göre uzlaştırma veya dava sürecini yönetin.',
    ],
  },
  Usul: {
    kanunlar: ['HMK (6100)', 'İYUK (2577)', 'Tebligat Kanunu', 'Arabuluculuk Kanunu'],
    merciler: ['görevli-yetkili mahkeme', 'arabuluculuk bürosu', 'BAM', 'Yargıtay'],
    sureler: [
      'Dava açma, cevap, istinaf ve temyiz süreleri tebliğ tarihlerine göre işlemeye başlar.',
      'Arabuluculuk dava şartı olan uyuşmazlıklarda tutanak olmadan dava risklidir.',
      'e-Tebligatta açılmasa da kanuni sürelerle tebliğ sayılma kuralları vardır.',
    ],
    belgeler: ['dilekçe', 'vekâlet', 'harç makbuzu', 'delil listesi', 'tebligat', 'arabuluculuk tutanağı'],
    riskler: ['Yanlış görev/yetki', 'Harç-avans eksikliği', 'Süre kaçırma'],
    adimlar: [
      'Uyuşmazlık türünü (hukuk/idare/ceza/icra) teşhis edin.',
      'Görevli-yetkili mahkeme ve dava şartlarını kontrol edin.',
      'Dilekçe ve delilleri hazırlayın; harcı yatırın.',
      'Tebligatları UYAP/e-tebligattan takip edin.',
      'Karar sonrası istinaf/temyiz süresini hesaplayın.',
    ],
  },
  İdare: {
    kanunlar: ['İYUK (2577)', 'İdare hukuku genel ilkeleri', '4982 Bilgi Edinme'],
    merciler: ['idare', 'üst makam', 'idare/vergi mahkemesi', 'Danıştay', 'CİMER'],
    sureler: [
      'İptal ve tam yargı davalarında süreler tebliğ/öğrenme tarihine göre çok kısa olabilir.',
      'Yürütmenin durdurulması ayrı şartlara tabidir; talep gerekçelendirilmelidir.',
      'İdari başvuru yollarının tüketilmesi bazı davalarda ön koşuldur.',
    ],
    belgeler: ['idari işlem', 'tebliğ', 'başvuru cevabı', 'zarar belgeleri', 'CİMER kaydı'],
    riskler: ['Dava süresini kaçırmak', 'Yanlış merci', 'İşlemi öğrenme tarihini ispatlayamamak'],
    adimlar: [
      'İdari işlemi ve tebliğ/öğrenme tarihini sabitleyin.',
      'İdari itiraz veya üst başvuru gerekip gerekmediğine bakın.',
      'İptal ve/veya tam yargı taleplerini netleştirin.',
      'İdare mahkemesinde dava açın; YD talep edin (şartlar varsa).',
      'Karar ve kanun yollarını takip edin.',
    ],
  },
  Trafik: {
    kanunlar: ['KTK (2918)', 'TCK (trafik güvenliği)', 'zorunlu mali sorumluluk sigortası mevzuatı'],
    merciler: ['emniyet/jandarma', 'GİB/e-Devlet ceza', 'sigorta', 'hukuk/ceza mahkemesi'],
    sureler: [
      'Trafik idari para cezalarına itiraz süreleri tebliğe bağlıdır.',
      'Hasar ihbarında poliçe ve şirket prosedür süreleri vardır.',
      'Ceza puanı ve ehliyete el koyma iade şartları ayrı yönetilir.',
    ],
    belgeler: ['ceza tebliği', 'kaza tutanağı', 'poliçe', 'eksper', 'ruhsat/ehliyet'],
    riskler: ['İtiraz süresini kaçırmak', 'Kusur tutanağına itiraz etmemek', 'Poliçe istisnalarını okumamak'],
    adimlar: [
      'Ceza veya kaza belgelerini e-Devlet/sigortadan doğrulayın.',
      'İtiraz mercini ve süreyi tespit edin.',
      'Hasarda ihbar + eksper sürecini başlatın.',
      'Red halinde tahkim/dava seçeneklerini değerlendirin.',
      'Ehliyet/puan durumunu takip edin.',
    ],
  },
  Vergi: {
    kanunlar: ['VUK', 'GVK', 'KDVK', 'AATUHK'],
    merciler: ['vergi dairesi', 'GİB', 'vergi mahkemesi', 'uzlaşma komisyonu'],
    sureler: [
      'Tarhiyat, ceza ve ödeme vadeleri tebliğle işlemeye başlar.',
      'Yapılandırma dönemleri kanunla açılır; başvuru penceresi sınırlıdır.',
      'Vergi mahkemesi dava süreleri kısa ve sıkıdır.',
    ],
    belgeler: ['tahakkuk', 'beyanname', 'ödeme', 'inceleme tutanağı', 'yapılandırma başvurusu'],
    riskler: ['Vade kaçırma', 'e-Haciz sürprizi', 'Uzlaşma/dava seçimini geç yapmak'],
    adimlar: [
      'e-Devlet/GİB borcunu ve tebliğleri kontrol edin.',
      'Ceza/indirim ve yapılandırma seçeneklerini karşılaştırın.',
      'Yazılı başvuru veya ödeme planı oluşturun.',
      'İhtilafta uzlaşma veya vergi davası yolunu seçin.',
      'Ödeme dekontlarını ve kapanış yazısını saklayın.',
    ],
  },
  'Sosyal Güvenlik': {
    kanunlar: ['SSGSSK (5510)', 'işsizlik sigortası mevzuatı'],
    merciler: ['SGK', 'İŞKUR', 'e-Devlet', 'iş mahkemesi'],
    sureler: [
      'Emeklilik ve borçlanmada prim günü/yaş şartları sigortalılık türüne göre değişir.',
      'İşsizlik ödeneğinde başvuru süresi ve prim günü şartları aranır.',
      'Rapor parası ve maluliyet süreçleri sağlık kurulu + SGK incelemesine bağlıdır.',
    ],
    belgeler: ['hizmet dökümü', 'prim bordrosu', 'sağlık raporu', 'başvuru formu'],
    riskler: ['Eksik prim', 'Yanlış borçlanma türü', 'Başvuru süresi kaçırma'],
    adimlar: [
      'e-Devletten hizmet ve prim dökümünü alın.',
      'Hak türünü (emeklilik, işsizlik, malul, borçlanma) netleştirin.',
      'Gerekli belgeleri tamamlayıp başvurun.',
      'Sonucu takip edin; rette itiraz/dava yollarını değerlendirin.',
      'Ödeme ve emekli aylığı hesaplarını kontrol edin.',
    ],
  },
  Mevzuat: {
    kanunlar: ['ilgili kanun metni', 'yönetmelik/tebliğ', 'içtihat'],
    merciler: ['mevzuat bankası', 'Resmî Gazete', 'Yargıtay/Danıştay karar arama'],
    sureler: [
      'Madde metni yürürlük ve değişiklik tarihleriyle birlikte okunmalıdır.',
      'Fıkra, bent ve atıf maddeleri atlanmamalıdır.',
      'Şerh ve içtihat, maddeyi somut olaya uygulamada yol gösterir; bağlayıcılık karara göredir.',
    ],
    belgeler: ['madde metni', 'gerekçe (varsa)', 'ilgili yönetmelik', 'örnek karar'],
    riskler: ['Eski metinle yorum', 'Madde numarasını karıştırmak', 'İstisna fıkraları atlamak'],
    adimlar: [
      'Kanun kodu ve madde numarasını doğrulayın.',
      'Resmî metni okuyun; fıkraları ayırın.',
      'Atıf yapılan maddelere geçin.',
      'Akademik şerh ve içtihat özetine bakın.',
      'Somut olaya uygulamadan önce avukat/akademik değerlendirme alın.',
    ],
  },
  Nüfus: {
    kanunlar: ['Nüfus Hizmetleri Kanunu', 'Türk Vatandaşlığı Kanunu (ilgiliyse)'],
    merciler: ['nüfus müdürlüğü', 'e-Devlet', 'mahkeme (isim/soyadı)'],
    sureler: ['Adres beyanı ve kimlik yenilemede randevu/süre kuralları kurum duyurusuna bağlıdır.'],
    belgeler: ['kimlik', 'fotoğraf', 'randevu', 'mahkeme kararı (gerekirse)'],
    riskler: ['Yanlış adres beyanı', 'Kayıp kimlikte gecikme'],
    adimlar: [
      'e-Devletten ilgili işlemi seçin veya randevu alın.',
      'Belgeleri hazırlayın.',
      'Başvuruyu tamamlayın; başvuru numarasını saklayın.',
      'Sonucu takip edin.',
      'İlgili kurumlara (banka, okul) bildirim gerekip gerekmediğine bakın.',
    ],
  },
  Yabancılar: {
    kanunlar: ['YUKK (6458)', 'çalışma izni mevzuatı'],
    merciler: ['Göç İdaresi', 'çalışma izni mercileri', 'idare mahkemesi'],
    sureler: [
      'İkamet ve çalışma izni uzatma başvuruları süre bitiminden önce yapılmalıdır.',
      'Sınır dışı ve idari gözetimde itiraz süreleri çok kısadır.',
    ],
    belgeler: ['pasaport', 'ikamet', 'adres', 'sağlık sigortası', 'randevu'],
    riskler: ['Süre aşımı', 'Eksik evrak ret', 'İtiraz süresini kaçırma'],
    adimlar: [
      'İzin türü ve bitiş tarihini kontrol edin.',
      'Gerekli belgeleri toplayın; randevu alın.',
      'Başvuruyu yapın; harç/ödeme dekontunu saklayın.',
      'Ret halinde idari itiraz/dava süresini hesaplayın.',
      'Pasaport ve adres kayıtlarını güncel tutun.',
    ],
  },
  Sigorta: {
    kanunlar: ['TTK sigorta hükümleri', 'özel sigorta genel şartları', 'trafik sigortası mevzuatı'],
    merciler: ['sigorta şirketi', 'eksper', 'Sigorta Tahkim', 'mahkeme'],
    sureler: ['Hasar ihbarında poliçe ve genel şart süreleri esastır; gecikme red gerekçesi olabilir.'],
    belgeler: ['poliçe', 'ihbar', 'eksper', 'fotoğraf', 'red yazısı'],
    riskler: ['Geç ihbar', 'İstisna maddelerini okumamak', 'Eksik evrak'],
    adimlar: [
      'Poliçeyi ve teminatları okuyun.',
      'Hasarı derhal ihbar edin; tutanak alın.',
      'Eksper ve evrak listesini tamamlayın.',
      'Red/eksik ödemede yazılı itiraz yapın.',
      'Tahkim veya dava yolunu değerlendirin.',
    ],
  },
  Sağlık: {
    kanunlar: ['TBK haksız fiil/sözleşme', 'hasta hakları mevzuatı'],
    merciler: ['sağlık kurumu', 'mahkeme', 'savcılık (gerekirse)', 'SGK'],
    sureler: ['Malpraktiste zamanaşımı ve ispat (bilirkişi) kritiktir.'],
    belgeler: ['tıbbi dosya', 'onam', 'rapor', 'fatura'],
    riskler: ['Dosyaya geç erişim', 'Onam formunu okumamak'],
    adimlar: [
      'Tıbbi kayıt talebinde bulunun.',
      'Olay kronolojisini yazın.',
      'Bağımsız tıbbi görüş alın.',
      'Hukuki mercie (dava/şikâyet) karar verin.',
      'Bilirkişi ve delil sürecini takip edin.',
    ],
  },
  'Engelli Hakları': {
    kanunlar: ['5378 sayılı Kanun', 'ÖTV/emlak muafiyetleri', 'sosyal yardım mevzuatı'],
    merciler: ['sağlık kurulu', 'belediye', 'SGK', 'vergi dairesi'],
    sureler: ['Rapor süresi ve oran güncellemeleri hak kullanımını etkiler.'],
    belgeler: ['engelli raporu', 'kimlik', 'gelir belgesi'],
    riskler: ['Raporun süresinin dolması', 'Yanlış muafiyet kanalı'],
    adimlar: [
      'Sağlık kurulu raporu alın/güncelleyin.',
      'Hak türünü (araç, aylık, vergi) seçin.',
      'İlgili kuruma başvurun.',
      'Sonucu takip edin.',
      'İtiraz gerekirse idari/yargı yoluna gidin.',
    ],
  },
  Ticaret: {
    kanunlar: ['TTK (6102)', 'çek kanunu', 'ticaret sicili mevzuatı'],
    merciler: ['ticaret sicili', 'noter', 'ticaret/asliye ticaret mahkemesi', 'arabuluculuk'],
    sureler: [
      'Ticari davalarda arabuluculuk dava şartı olabilir.',
      'Fatura itirazında TTK süreleri vardır.',
      'Çek ibraz süreleri kaçırılmamalıdır.',
    ],
    belgeler: ['ana sözleşme', 'fatura', 'çek/senet', 'defter', 'sicil gazetesi'],
    riskler: ['Şirket borcunda kefalet', 'Faturasız ticaret ispatı', 'Unvan/marka ihlali'],
    adimlar: [
      'İşlem türünü (kuruluş, alacak, çek, marka) netleştirin.',
      'Sicil ve sözleşme belgelerini toplayın.',
      'Arabuluculuk gerekip gerekmediğine bakın.',
      'Dava veya icra yolunu seçin.',
      'Ticaret sicili tescil/ilanı güncel tutun.',
    ],
  },
  Borçlar: {
    kanunlar: ['TBK (6098)', 'HMK', 'İİK'],
    merciler: ['arabuluculuk', 'hukuk mahkemesi', 'icra'],
    sureler: [
      'Genel zamanaşımı TBK’da kural olarak 10 yıl; bazı alacaklarda 5 yıl ve özel süreler vardır.',
      'Temerrüt, ihtar ve şekil şartları somut sözleşmeye göre değişir.',
    ],
    belgeler: ['sözleşme', 'ihtar', 'dekont', 'senet', 'yazışma'],
    riskler: ['Şekil eksikliği', 'Zamanaşımı', 'İspat yükü'],
    adimlar: [
      'Alacak/borç sebebini ve belgeleri toplayın.',
      'İhtar veya temerrüt durumunu değerlendirin.',
      'Arabuluculuk/dava/icra seçeneklerini karşılaştırın.',
      'Faiz ve masraf hesabını yapın.',
      'Takibi sonuçlandırın; ibranameyi dikkatle imzalayın.',
    ],
  },
  İmar: {
    kanunlar: ['İmar Kanunu', 'belediye mevzuatı', '6306 (kentsel dönüşüm)'],
    merciler: ['belediye', 'yapı denetim', 'idare mahkemesi'],
    sureler: [
      'Yapı tatil tutanağı, para cezası ve yıkımda itiraz/dava süreleri kısa olabilir.',
      'Riskli yapı tespitine itiraz süreleri kaçırılmamalıdır.',
    ],
    belgeler: ['ruhsat', 'imar durumu', 'tutanak', 'para cezası tebliği', 'YKB'],
    riskler: ['Mühür sökme', 'İskansız kullanım', 'Süre kaçırma'],
    adimlar: [
      'Tutanak/ceza tebliğini alın; öğrenme tarihini sabitleyin.',
      'Ruhsat ve imar durumunu kontrol edin.',
      'İdari itiraz veya uzlaşma yollarını değerlendirin.',
      'İdare mahkemesinde iptal/YD düşünün.',
      'İskan/ruhsat süreçlerini tamamlayın.',
    ],
  },
  Eğitim: {
    kanunlar: ['ilgili yükseköğretim/MEB mevzuatı', 'TKHK (özel okul/kurs)'],
    merciler: ['okul/üniversite idaresi', 'YÖK', 'tüketici mercileri', 'idare mahkemesi'],
    sureler: ['Disiplin ve kayıt silme itiraz süreleri yönetmeliğe bağlıdır.'],
    belgeler: ['sözleşme', 'ödeme', 'disiplin kararı', 'öğrenci belgesi'],
    riskler: ['İtiraz süresini kaçırmak', 'Sözleşme cezalarını okumamak'],
    adimlar: [
      'Karar veya sözleşme maddesini okuyun.',
      'İdari itirazı süresinde yapın.',
      'Tüketici veya idari yargı yolunu seçin.',
      'Belgeleri saklayın.',
      'Sonucu kayıt/ödeme sisteminde teyit edin.',
    ],
  },
  'Kişisel Veri': {
    kanunlar: ['6698 sayılı KVKK', 'TCK kişisel veri suçları'],
    merciler: ['veri sorumlusu', 'KVKK Kurulu', 'mahkeme/savcılık'],
    sureler: [
      'Veri sorumlusuna başvuruda cevap için kanuni süre vardır; cevapsızlıkta Kurula şikâyet yolu açılabilir.',
    ],
    belgeler: ['aydınlatma metni', 'başvuru', 'cevap', 'ihlal bildirimi'],
    riskler: ['Süreyi kaçırmak', 'İspatı saklamamak'],
    adimlar: [
      'Veri sorumlusunu tespit edin.',
      'KVKK m.11 haklarınızı yazılı kullanın.',
      'Cevabı bekleyin; yetersizse Kurula şikâyet edin.',
      'Suç unsuru varsa savcılığa başvurun.',
      'Sonuç ve silme/yok etme teyidini alın.',
    ],
  },
};

/** Yüksek niyetli konular için özel maddi bilgi (seed) */
export const TOPIC_FACTS = {
  'tbk-madde-125': {
    ozet:
      'TBK m.125, borçlar hukukunda zamanaşımına ilişkin temel hükümdür. Kanunda aksi öngörülmedikçe her alacak on yıllık zamanaşımına tabidir. Beş yıllık özel süreler (ör. kira, faiz, dönemsel edimler) ayrı maddelerde düzenlenir; somut alacak tipine göre doğru süreyi seçmek gerekir.',
    onemli: [
      'Genel süre: 10 yıl (TBK m.125/1 — kanunda aksi yoksa).',
      'Bazı alacaklarda 5 yıllık zamanaşımı (TBK m.147 ve özel hükümler) uygulanabilir.',
      'Zamanaşımı, alacağın muaccel olmasından itibaren işlemeye başlar (somut olay + m.128 vd.).',
      'Dava, icra takibi, ikrar gibi haller zamanaşımını kesebilir (TBK m.154 vd.).',
      'Zamanaşımı def’i ileri sürülmedikçe hâkim kendiliğinden dikkate almaz.',
    ],
    link: '/mevzuat/tbk/madde-125',
  },
  'tbk-madde-49': {
    ozet:
      'TBK m.49 haksız fiil sorumluluğunun temelini kurar: Kusurlu ve hukuka aykırı bir fiille başkasına zarar veren, bu zararı gidermekle yükümlüdür. Maddi ve manevi tazminat taleplerinin dayanağı sıklıkla bu maddedir.',
    onemli: [
      'Unsurlar: fiil, hukuka aykırılık, kusur, zarar, illiyet bağı.',
      'İspat yükü kural olarak zarar görendedir; karineler saklıdır.',
      'Zamanaşımı haksız fiilde özel sürelere tabidir (TBK m.72).',
    ],
    link: '/mevzuat/tbk/madde-49',
  },
  'tbk-madde-112': {
    ozet:
      'TBK m.112 borçlunun temerrüdünü düzenler. Muaccel bir borcun ifa edilmemesi ve (gerekliyse) ihtar sonrası temerrüt hükümleri devreye girer; tazminat ve ifadan vazgeçme seçenekleri doğabilir.',
    onemli: [
      'Temerrüt için kural olarak muacceliyet + ifa etmeme (+ ihtar veya ihtarsız haller).',
      'Temerrüt faizi ve aşkın zarar gündeme gelebilir.',
      'Sözleşmeden dönme ve seçimlik haklar sonraki maddelerle bağlantılıdır.',
    ],
    link: '/mevzuat/tbk/madde-112',
  },
  'tmk-madde-166': {
    ozet:
      'TMK m.166 evlilik birliğinin temelinden sarsılması sebebine dayalı boşanmayı düzenler. Anlaşmalı boşanma da aynı madde çerçevesinde özel şartlarla mümkündür; çekişmeli boşanmada ispat ve kusur tartışması öne çıkar.',
    onemli: [
      'Evlilik birliğinin ortak hayatı sürdürmeyi çekilmez kılacak şekilde sarsılması aranır.',
      'Anlaşmalı boşanmada 1 yıl evlilik, mahkeme önünde irade ve protokol şartları aranır.',
      'Nafaka, velayet ve mal rejimi ayrı değerlendirilir.',
    ],
    link: '/mevzuat/tmk/madde-166',
  },
  'tck-madde-125': {
    ozet:
      'TCK m.125 hakaret suçunu düzenler. Bir kimsenin onur, şeref ve saygınlığını rencide edebilecek somut bir fiil veya olgu isnadı ya da sövme fiilleri kapsamda olabilir; şikâyete bağlıdır ve uzlaştırma gündeme gelebilir.',
    onemli: [
      'Şikâyet süresi ve ispat (ekran görüntüsü, tanık, kayıt) önemlidir.',
      'Kamu görevlisine veya toplu iletişim yoluyla işlenme nitelikli haller ayrı değerlendirilir.',
      'İfade özgürlüğü / eleştiri sınırı somut olaya göre çizilir.',
    ],
    link: '/mevzuat/tck/madde-125',
  },
  'tck-madde-86': {
    ozet:
      'TCK m.86 kasten yaralama suçunu düzenler. Basit tıbbi müdahale ile giderilebilecek yaralama ile daha ağır neticeler farklı fıkra ve cezaları tetikler; şikâyet ve uzlaştırma kuralları neticeye göre değişir.',
    onemli: [
      'Adli rapor ve tedavi belgeleri delil niteliğindedir.',
      'Silah, canavarca his, bilinçsizlik vb. nitelikli haller ayrı maddelerle bağlantılıdır.',
      'Mağdur-şüpheli uzlaştırması mümkün hallerde süreç değişir.',
    ],
    link: '/mevzuat/tck/madde-86',
  },
  'tck-madde-106': {
    ozet:
      'TCK m.106 tehdit suçunu düzenler. Bir kimsenin kendisinin veya yakınının hayatına, vücut veya cinsel dokunulmazlığına yönelik saldırı gerçekleştireceğinden bahisle tehdit cezalandırılır; malvarlığına yönelik tehdit ayrı fıkralarda yer alır.',
    onemli: [
      'Tehdidin ciddiyetle algılanabilir olması aranır.',
      'Şikâyet ve delil (mesaj, ses, tanık) kritiktir.',
      '6284 koruma tedbirleri ile birlikte değerlendirilebilir.',
    ],
    link: '/mevzuat/tck/madde-106',
  },
  'hmk-madde-119': {
    ozet:
      'HMK m.119 dava dilekçesinin zorunlu unsurlarını sayar. Taraflar, konu, vacip sonuç, vakıalar, deliller ve hukuki sebepler eksik bırakılırsa usulî sonuçlar doğabilir; uygulamada eksikliklerin tamamlanması istenebilir.',
    onemli: [
      'Dava konusu ve talep sonucu açık yazılmalıdır.',
      'Deliller dayanak vakıalarla ilişkilendirilmelidir.',
      'Görev-yetki ve harç bilgisi dilekçeyle birlikte düşünülür.',
    ],
    link: '/mevzuat/hmk/madde-119',
  },
  'hmk-madde-389': {
    ozet:
      'HMK m.389 ihtiyati tedbirin şartlarını düzenler. Hakların elde edilmesinin önemli ölçüde zorlaşacağı veya imkânsızlaşacağı yahut gecikme nedeniyle bir sakıncanın doğacağı hallerde tedbir istenebilir; teminat kuralı ve itiraz yolları vardır.',
    onemli: [
      'Tedbir talebi somut gerekçe ve delille desteklenmelidir.',
      'Teminat ve tedbirin kaldırılması/itirazı ayrı usuldür.',
      'Tedbir kararı esasa dair nihai hüküm değildir.',
    ],
    link: '/mevzuat/hmk/madde-389',
  },
  'iik-madde-62': {
    ozet:
      'İİK m.62 ödeme emrine itirazı düzenler. Borçlu, tebliğden itibaren yasal süre içinde (kural 7 gün) itiraz ederek takibi durdurabilir; itirazın iptali veya kaldırılması yolları alacaklıya açıktır.',
    onemli: [
      'Süre tebliğ tarihinden işler; e-tebligat kurallarına dikkat.',
      'İtiraz takibi durdurur; alacaklı dava veya kaldırma yoluna gidebilir.',
      'Haksız itirazda inkâr tazminatı riski doğabilir.',
    ],
    link: '/mevzuat/iik/madde-62',
  },
  'is-kanunu-madde-17': {
    ozet:
      '4857 sayılı İş Kanunu m.17 belirsiz süreli iş sözleşmelerinde bildirim (ihbar) sürelerini düzenler. Sürelere uyulmadan fesihte ihbar tazminatı gündeme gelebilir; kıdemden ayrı bir kalemdir.',
    onemli: [
      'Kıdeme göre kademeli bildirim süreleri uygulanır.',
      'Bildirimli fesihte iş arama izni vardır.',
      'Haklı fesih hallerinde ihbar tazminatı farklı değerlendirilir.',
    ],
    link: '/mevzuat/is-kanunu/madde-17',
  },
  'is-kanunu-madde-25': {
    ozet:
      'İş Kanunu m.25 işverenin haklı nedenle derhal fesih hallerini sayar. Sağlık, ahlak ve iyi niyet, zorlayıcı sebepler gibi bentler vardır; ispat yükü ve kıdem hakkı somut bende göre değişir.',
    onemli: [
      'Haklı fesihte ihbar tazminatı kural olarak doğmaz; kıdem ise sebebe göre değişir.',
      'Savunma hakkı ve olayın ispatı yargılamada belirleyicidir.',
      'İş güvencesi kapsamında işe iade ayrı rejimdir.',
    ],
    link: '/mevzuat/is-kanunu/madde-25',
  },
  'kidem-tazminati-hesaplama': {
    ozet:
      'Kıdem tazminatı, giydirilmiş brüt ücret × çalışılan yıl esasına göre kabaca hesaplanır; her tam yıl için 30 günlük ücret ve artan süreler oranlanır. Yıllık tavan, damga vergisi ve hak kazanma şartları döneme göre uygulanır. Portal hesaplama aracı bilgilendirme amaçlıdır.',
    onemli: [
      'Hak kazanma: kanunda sayılan fesih/ayrılış halleri (her istifa otomatik hak doğurmaz).',
      'Giydirilmiş ücret: çıplak ücret + düzenli ek ödemeler (somut bordroya göre).',
      'Tavan: Hazine/ÇSGB dönemsel tavanı aşan kısım sınırlanır.',
      'Arabuluculuk çoğu işçilik alacağında dava şartıdır.',
    ],
    link: '/hesaplama/kidem',
  },
  'kidem-tazminati-nasil-alinir': {
    ozet:
      'Kıdem tazminatı almak için önce hak kazanma şartı, sonra hesap, sonra arabuluculuk/dava veya icra yolu gelir. İbraname imzalamadan önce kalem kalem kontrol edilmelidir.',
    onemli: [
      'SGK hizmet + bordro + fesih belgesi delil setinin omurgasıdır.',
      'Zamanaşımına dikkat (işçilik alacakları).',
      'Tavan ve vergi/damga uygulamaları döneme bağlıdır.',
    ],
    link: '/rehber/kidem-tazminati',
  },
  'kira-artis-orani-nasil-hesaplanir': {
    ozet:
      'Konut kiralarında artış, sözleşme ve yasal sınırlar çerçevesinde hesaplanır. Dönemsel olarak TBK uygulaması ve yasal tavanlar (ör. TÜFE oranına bağlı sınırlar) değişebilir; işyeri kiralarında serbesti ve tespit davası daha ön plandadır.',
    onemli: [
      'Sözleşmedeki artış maddesi + yasal sınır birlikte okunur.',
      'TÜFE on iki aylık ortalamalar uygulamada sık referanstır (dönem mevzuatına bakın).',
      'Uyuşmazlıkta arabuluculuk ve kira tespit davası gündeme gelir.',
    ],
    link: '/hesaplama/kira',
  },
  'odeme-emrine-itiraz': {
    ozet:
      'Ödeme emrine itiraz, ilamsız icra takibinde borcu ve fer’ilerini durduran temel savunmadır. Süre kural olarak tebliğden itibaren 7 gündür; e-tebligat ve usulsüz tebligat halleri ayrı değerlendirilir.',
    onemli: [
      'İtiraz icra dairesine yapılır; takip durur.',
      'Alacaklı itirazın iptali davası veya (belgeye dayalıysa) kaldırılması yoluna gidebilir.',
      'Haksız itirazda %20 inkâr tazminatı riski tartışılır.',
    ],
    link: '/kategori/iik',
  },
  'kanun-maddesi-nasil-okunur': {
    ozet:
      'Kanun maddesi okurken önce kapsam (kimlere uygulanır), sonra şartlar, sonra hukuki sonuç ve istisnalar okunur. Fıkra ve bentler atlanmamalı; atıf maddeleri ve yürürlük tarihi kontrol edilmelidir. Akademik şerh, maddenin yargıdaki anlamını özetler.',
    onemli: [
      '1) Resmî metin 2) Tanımlar 3) Şartlar 4) Sonuç 5) İstisna 6) İçtihat/şerh.',
      'Madde numarası değişmiş olabilir; güncel metin kullanın.',
      'Portalda madde + şerh aynı sayfadadır: /mevzuat ve /ara.',
    ],
    link: '/mevzuat',
  },
  'mevzuat-nasil-aranir': {
    ozet:
      'Kanun maddesi ararken anahtar kelime (ör. satım, temerrüt) veya kanun kodu + madde no (ör. TBK 125) kullanılabilir. Tam metin arama, madde başlığında geçmeyen kavramları da bulur. Sonuçları kanuna göre süzmek isabeti artırır.',
    onemli: [
      'Portal arama: https://www.avfethiguzel.com/ara',
      'Doğrudan madde: /mevzuat/{kanunId}/madde-{n}',
      'Şerh ve içtihat ile birlikte okuyun.',
    ],
    link: '/ara',
  },
  'bosanma-davasi-nasil-acilir': {
    ozet:
      'Boşanma, anlaşmalı veya çekişmeli olarak aile mahkemesinde açılır. Anlaşmalıda protokol (nafaka, velayet, mal, ziynet) ve mahkeme önünde irade şarttır. Çekişmelide delil, kusur ve tedbir nafakası süreci uzatabilir.',
    onemli: [
      'Görevli mahkeme: aile mahkemesi (bulunmayan yerde asliye hukuk).',
      'Yetki: eşlerden birinin yerleşim yeri veya son 6 ay birlikte oturulan yer.',
      'Velayet, nafaka ve mal rejimi boşanmayla birlikte veya ayrı görülebilir.',
    ],
    link: '/kategori/aile-hukuku',
  },
  'icra-takibi-nedir': {
    ozet:
      'İcra takibi, alacağın cebri icra yoluyla tahsiline yönelik İİK prosedürüdür. İlamsız (ödeme emri) ve ilamlı (mahkeme kararı) takip ayrımı temeldir; haciz, satış ve iflas aşamaları izleyebilir.',
    onemli: [
      'İlamsız takipte itiraz hakkı vardır.',
      'Haciz maaş, banka, taşınır, tapu üzerinde uygulanabilir.',
      'Borçlu ve alacaklı hakları dengeye tabidir; usulsüzlük şikâyeti mümkündür.',
    ],
    link: '/kategori/iik',
  },
  'arabuluculuk-nasil-yapilir': {
    ozet:
      'Arabuluculuk, tarafların uyuşmazlığı müzakere ile çözdüğü, bazı davalarda dava şartı olan bir yoldur. Başvuru bakanlık listesindeki arabulucuya veya büro üzerinden yapılır; anlaşma belgesi ilam niteliği taşıyabilir.',
    onemli: [
      'İş, ticari ve bazı tüketici/kira uyuşmazlıklarında zorunluluk aranabilir.',
      'Anlaşamama tutanağı dava açmak için gerekli olabilir.',
      'Gizlilik ve irade serbestisi esastır.',
    ],
    link: '/rehber/arabuluculuk',
  },
  'emlak-vergisi-nedir': {
    ozet:
      'Emlak vergisi, taşınmaz malikinin belediyeye ödediği yıllık vergidir. Konut, işyeri ve arsa oranları ile muafiyetler (engelli, şehit yakını vb.) döneme ve belediyeye göre değişir.',
    onemli: [
      'Mükellef kural olarak maliktir.',
      'Çoğu yerde iki taksitte tahsil edilir.',
      'Devirde borç sorgusu ve bildirim ihmal edilmemelidir.',
    ],
    link: '/kategori/vuk',
  },
};

function s(heading, paragraphs, bullets) {
  return { heading, paragraphs, bullets };
}
function faq(q, a) {
  return { q, a };
}
function bodyPack(lead, sections, steps, faqList) {
  return { lead, sections, steps: steps || [], faq: faqList || [] };
}

/**
 * Konuya özgü derin gövde üretir.
 * @param {object} t - parse edilmiş topic
 */
export function buildDeepBody(t) {
  const seed = hash(t.slug);
  const k0 = t.keywords[0] || t.h1;
  const k1 = t.keywords[1] || k0;
  const k2 = t.keywords[2] || k1;
  const cat = t.category;
  const bank = CAT_BANK[cat] || CAT_BANK.Usul;
  const fact = TOPIC_FACTS[t.slug];
  const topicClean = t.h1.replace(/\?$/, '');

  const kanunStr = bank.kanunlar.join(', ');
  const merciStr = bank.merciler.join(', ');
  const sure = pick(bank.sureler, seed, 1);
  const risk = pick(bank.riskler, seed, 2);
  const belgeler = pickN(bank.belgeler, seed, Math.min(4, bank.belgeler.length)).join(', ');

  // --- LEAD (şablon spam yok; konuya özgü) ---
  let lead;
  if (fact?.ozet) {
    lead = `${fact.ozet} Bu sayfa «${k0}» ve «${k1}» aramalarına yönelik genel bilgilendirmedir; bağlayıcı hukuki tavsiye yerine geçmez. Güncel madde metni ve akademik şerh için portal mevzuat bankası kullanılmalıdır.`;
  } else {
    const leadOpeners = [
      `${topicClean}; ${cat.toLocaleLowerCase('tr-TR')} alanında en çok sorulan pratik sorulardan biridir.`,
      `«${k0}» araması genellikle hem tanım hem de başvuru yolunu birlikte ister.`,
      `${topicClean} konusunda doğru merci ve süre, sonucun kendisi kadar önemlidir.`,
    ];
    lead = `${pick(leadOpeners, seed, 0)} İlgili çerçeve sıklıkla ${kanunStr} hükümleriyle çizilir; başvuru mercileri arasında ${pick(bank.merciler, seed, 3)} öne çıkar. Aşağıda «${k0}» ve «${k1}» odaklı tanım, şartlar, adımlar, belgeler ve riskler sadeleştirilmiş biçimde anlatılır. Metin genel bilgilendirmedir; somut dosyada tebliğ tarihi, güncel mevzuat ve avukat değerlendirmesi esas alınmalıdır.`;
  }

  // --- SECTIONS ---
  const sections = [];

  // 1. Tanım
  if (fact?.ozet) {
    sections.push(
      s(`${topicClean}: hukuki çerçeve`, [
        fact.ozet,
        `Arama motorunda «${k0}» yazan kullanıcı çoğu zaman madde metninin özeti ile «ne yapmalıyım?» yol haritasını bir arada arar. Bu nedenle hem kavram hem de usul adımları birlikte verilmiştir.`,
      ], fact.onemli?.slice(0, 4))
    );
  } else {
    sections.push(
      s(`«${k0}» ne demektir?`, [
        `${t.h1} sorusu, ${cat.toLocaleLowerCase('tr-TR')} alanında hak, borç ve usul kurallarının kesişiminde durur. Tek cümlelik tanım yetmez; kimlerin muhatap olduğu, hangi şartların arandığı ve hangi mercinin yetkili olduğu birlikte okunmalıdır.`,
        `Uygulamada «${k1}» ifadesi sıklıkla e-Devlet, icra, mahkeme veya idari başvuru adımlarıyla birlikte aranır. Yanlış mercie gitmek veya belge eksik bırakmak, süreyi fiilen tüketebilir.`,
      ], [k0, k1, k2].filter(Boolean))
    );
  }

  // 2. Yasal dayanak
  sections.push(
    s('Yasal dayanak ve ilgili mevzuat', [
      `Bu konuda sık atıf yapılan metinler: ${kanunStr}. Madde numarası ve fıkra, somut olaya göre değişir; yürürlük ve değişiklik tarihi kontrol edilmeden yorum yapılmamalıdır.`,
      fact?.link
        ? `İlgili madde veya araca doğrudan erişim: portal içi link (${fact.link}). Kanun maddesi aramak için /ara, arşiv için /mevzuat kullanılabilir.`
        : `Kanun maddesi metni ve akademik şerh için sitede «${k0}» araması yapılabilir: /ara. Kategori sayfaları ve hesaplama araçları ilgili bağlantılarda yer alır.`,
      sure,
    ])
  );

  // 3. Kimler / şartlar
  sections.push(
    s('Kimler muhataptır? Şartlar nelerdir?', [
      `Tipik merciler ve muhataplar: ${merciStr}. Şartlar; süre, şekil, belgeler, bazen arabuluculuk veya idari ön başvuru gibi dava/işlem şartlarını içerir.`,
      `«${k2}» ile ilgili tebliğ, öğrenme veya fesih tarihi yazılı olarak sabitlenmelidir. Usulsüz tebligat iddiası varsa öğrenme tarihi ayrıca ispatlanmalıdır.`,
      `Eksik ehliyet, vekâlet veya temsil belgesi başvuruyu usulden riske atar. Kurumların e-Devlet/UYAP kanalları ile fiziki başvuru ayrımına dikkat edin.`,
    ])
  );

  // 4. Süreç
  const adimlar = fact?.onemli
    ? [
        'Konuya özgü olguları ve belgeleri derleyin.',
        'Yasal dayanak ve süreyi (tebliğ/öğrenme) tespit edin.',
        'Doğru mercie yazılı başvurun veya dava/arabuluculuk başlatın.',
        'Sonucu takip edin; ret veya aleyhe kararda kanun yolunu değerlendirin.',
        'Ödeme, tescil veya icra kapanışını belgelendirin.',
      ]
    : bank.adimlar;

  sections.push(
    s('Süreç nasıl işler?', [
      `Tipik akış şöyle özetlenebilir: ${adimlar.map((a, i) => `(${i + 1}) ${a}`).join(' ')}`,
      `Elektronik kanallar (e-Devlet, UYAP, GİB, belediye, banka) hız kazandırır; ancak bazı işlemler noter, randevu veya ıslak imza ister. «${k0}» dosyasında barkodlu belge ile asıl evrak ayrımını kurum bazında doğrulayın.`,
    ])
  );

  // 5. Belgeler
  sections.push(
    s('Belgeler ve ispat', [
      `Sık kullanılan belgeler: ${belgeler}. Ayrıca kimlik, tebligat mazbataları, ödeme dekontları, mesaj/e-posta çıktıları ve tanık listesi tamamlayıcı olabilir.`,
      `Dijital delillerde tarih, bütünlük ve kaynak (orijinal dosya, ekran görüntüsü zinciri) korunmalıdır. Resmî kayıtlara (tapu, SGK, icra, nüfus) mümkün olduğunca asıl veya onaylı suret üzerinden erişin.`,
    ], pickN(bank.belgeler, seed + 3, 3))
  );

  // 6. Riskler
  sections.push(
    s('Sık hatalar ve riskler', [
      `En sık görülen risk: ${risk}. Bunun yanında süreleri kabaca hesaplamak, sözlü anlaşmaya güvenmek ve ödeme/indirim metnini okumadan işlem yapmak hak kaybına yol açar.`,
      pick(bank.riskler, seed, 5) || risk,
      `İnternetteki «garanti sonuç» vaatleri bağlayıcı değildir. Bu rehber bilgilendirme amaçlıdır; sonuç vaadi içermez.`,
    ])
  );

  // 7. Portal / madde arama
  sections.push(
    s('Kanun maddesi, şerh ve hesaplama', [
      `«${k0}» ile ilişkili kanun maddelerini bulmak için portal kanun maddesi aramasını kullanın. Madde numarasını biliyorsanız /mevzuat/{kanun}/madde-{n} yoluna gidin; bilmiyorsanız /ara üzerinden tam metin arayın.`,
      `Hesaplama araçları (kıdem, miras, faiz, kira, nafaka vb.) kabaca fikir verir; bordro, tarife ve yargı uygulaması somut tutarı değiştirir. İçtihat için /icthat sayfasına bakılabilir.`,
    ])
  );

  // FAQ — konuya özgü
  const faqList = [];
  if (fact?.onemli?.length) {
    faqList.push(faq(`«${k0}» için en kritik nokta nedir?`, fact.onemli[0]));
    if (fact.onemli[1]) faqList.push(faq('Nelere özellikle dikkat edilmeli?', fact.onemli.slice(1, 3).join(' ')));
  } else {
    faqList.push(
      faq(
        `«${k0}» başvurusunda ilk adım ne olmalı?`,
        `Önce tebliğ/öğrenme veya olay tarihini sabitleyin; sonra ${pick(bank.merciler, seed, 0)} başta olmak üzere doğru mercie ve belge listesine karar verin.`
      )
    );
    faqList.push(
      faq(
        `«${k1}» için hangi mevzuata bakılır?`,
        `Sıklıkla ${kanunStr} devreye girer. Somut madde numarası dosyaya göre değişir; güncel metin ve şerh için portal mevzuat araması kullanılmalıdır.`
      )
    );
  }
  faqList.push(
    faq(
      'Avukat tutmak zorunlu mudur?',
      cat === 'Ceza'
        ? 'Gözaltı ve bazı soruşturma aşamalarında müdafi hakkı kritiktir; zorunlu müdafi halleri CMK’da düzenlenir. Diğer başvurularda avukat zorunlu olmayabilir ancak süre-usul riski yüksektir.'
        : 'Çoğu idari ve hukuk başvurusunda avukat zorunlu değildir. Ancak süre, delil ve strateji hataları hak kaybına yol açabileceğinden karmaşık dosyalarda hukuki destek önerilir.'
    )
  );
  faqList.push(
    faq(
      'Süre ne zaman işlemeye başlar?',
      'Kural olarak tebliğ, öğrenme, fesih veya olay tarihinden itibaren. e-Tebligat ve usulsüz tebligat hallerinde öğrenme/tebliğ sayılma anı ayrıca incelenmelidir. Kesin süre bu sayfada vaat edilmez.'
    )
  );
  faqList.push(
    faq(
      'Bu rehber bağlayıcı mıdır?',
      'Hayır. Genel bilgilendirmedir. Yürürlükteki mevzuat, idari düzenleyici işlemler, içtihat ve somut olayın özellikleri esastır.'
    )
  );

  const steps = (bank.adimlar || adimlar).map((step, i) => {
    if (i === 0) return `«${k0}»: ${step}`;
    return step;
  });

  return bodyPack(lead, sections, steps, faqList);
}
