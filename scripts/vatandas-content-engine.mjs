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
      'Emlak vergisi, Türkiye’de taşınmaz (konut, işyeri, arsa) malikinin ilgili belediyeye ödemekle yükümlü olduğu yıllık bir vergidir. Matrah vergi değeri üzerinden hesaplanır; büyükşehir ve diğer belediyelerde oranlar ile muafiyet/indirim şartları (engellilik, şehit yakını, küçük konut vb.) döneme göre değişebilir.',
    onemli: [
      'Mükellef kural olarak malik / paydaştır; kiracı asıl mükellef değildir.',
      'Çoğu belediyede iki taksitte tahsil; e-Devlet ve banka kanalları yaygındır.',
      'Yıl içinde devirde bildirim ve borç sorgusu ihmal edilmemelidir.',
      'Gecikmede gecikme zammı ve işlem engelleri gündeme gelebilir.',
      'Sitedeki araçlar kabaca fikir verir; kesin tutar belediye kaydına bağlıdır.',
    ],
    link: '/kategori/vuk',
  },
  'veraset-ilami-nasil-alinir': {
    ozet:
      'Veraset ilamı (mirasçılık belgesi), ölen kişinin yasal mirasçılarını ve miras paylarını gösteren resmî belgedir. e-Devlet, noter veya sulh hukuk mahkemesi yollarından alınabilir; taşınmaz devri, banka ve araç işlemlerinde sıklıkla istenir.',
    onemli: [
      'e-Devlet uygunluk şartları yoksa noter veya mahkeme yoluna gidilir.',
      'Nüfus kayıtları ve ölüm belgesi temel evraktır.',
      'Belge sonrası veraset ve intikal vergisi ile tapu devri ayrı adımlardır.',
      'Mirasın reddi süresi kaçırılmamalıdır.',
    ],
    link: '/hesaplama/miras',
  },
  'ise-iade-davasi': {
    ozet:
      'İşe iade, iş güvencesi kapsamındaki işçinin geçersiz feshine karşı başvurduğu yoldur. İşyeri işçi sayısı, kıdem, süre ve arabuluculuk şartları aranır; boşta geçen süre ve işe başlatmama tazminatı mahkeme sonucuna bağlıdır.',
    onemli: [
      'Arabuluculuk dava şartıdır.',
      'Süreler fesih tebliğine bağlıdır; kaçırılmamalıdır.',
      'Geçerli fesih – haklı fesih ayrımı esastır.',
      'İşe başlatmama tazminatı 4–8 aylık ücret aralığında takdir edilebilir.',
    ],
    link: '/hesaplama/ise-iade',
  },
  'trafik-cezasina-itiraz': {
    ozet:
      'Trafik idari para cezasına itiraz, tebliğden itibaren yasal süre içinde yetkili mercie (çoğu halde sulh ceza hâkimliği veya ilgili usul) yapılır. EDS/HGS ve e-Devlet sorguları cezanın dayanağını görmek için kullanılır; peşin ödeme indirimi ile itiraz stratejisi birlikte değerlendirilmelidir.',
    onemli: [
      'Tebliğ tarihini sabitleyin; e-tebligat kurallarına bakın.',
      'İtiraz gerekçesi (usul, levha, ölçüm, araç devri) somut olmalıdır.',
      'Ödeme indirimi ile itiraz hakkı ilişkisini güncel mevzuattan kontrol edin.',
    ],
    link: '/kategori/ktk',
  },
  'nafaka-davasi-nedir': {
    ozet:
      'Nafaka; tedbir, yoksulluk ve iştirak türleriyle aile mahkemesinde talep edilir. Miktar, tarafların ekonomik-sosyal durumu, çocuğun ihtiyaçları ve hakkaniyete göre hâkim tarafından takdir edilir; sabit yüzde garantisi yoktur.',
    onemli: [
      'İştirak nafakası çocuk içindir; yoksulluk nafakası eş içindir.',
      'Ödenmezse icra ve tazyik hapsi gündeme gelebilir.',
      'Artırım/indirme değişen şartlarla açılabilir.',
    ],
    link: '/hesaplama/nafaka',
  },
  'tuketici-hakem-heyeti': {
    ozet:
      'Tüketici hakem heyeti, belirli parasal sınır altındaki tüketici uyuşmazlıklarında başvuru merciidir. Başvuru e-Devlet üzerinden yapılabilir; kararlara karşı tüketici mahkemesinde itiraz yolu vardır. Parasal sınırlar her yıl güncellenir.',
    onemli: [
      'Parasal sınırı kontrol etmeden başvuru yapmayın.',
      'Ayıp, cayma, abonelik ve banka uyuşmazlıkları sık konudur.',
      'Delil (fatura, sipariş, yazışma) eksiksiz eklenmelidir.',
    ],
    link: '/kategori/tkhk',
  },
  'kvkk-basvuru-hakki': {
    ozet:
      'KVKK m.11, ilgili kişinin veri sorumlusuna başvuru haklarını düzenler: öğrenme, silme, düzeltme, itiraz vb. Cevap gelmez veya yetersizse Kişisel Verileri Koruma Kurulu’na şikâyet yolu açılabilir.',
    onemli: [
      'Önce veri sorumlusuna yazılı başvuru zorunludur.',
      'Kanuni cevap süresi vardır; süreyi not edin.',
      'Aydınlatma ve açık rıza metinleri ispat için saklanmalıdır.',
    ],
    link: '/kategori/kvkk',
  },
  'miras-payi-nasil-hesaplanir': {
    ozet:
      'Yasal miras payı, TMK’nın zümre sistemine göre hesaplanır. Sağ kalan eşin payı, alt soy veya ana-baba ile birlikte mirasçılığa göre değişir. Saklı pay, tenkis ve vasiyet ayrı katmanlardır.',
    onemli: [
      'Önce veraset ilamı ile mirasçı listesi netleşir.',
      'Eş + çocuklarda eşin payı 1/4’tür (tipik senaryo; somut olaya bakın).',
      'Portal miras hesap aracı bilgilendirme amaçlıdır.',
    ],
    link: '/hesaplama/miras',
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

/** Kelime sayısı — pillar/spoke derinleştirme eşiği */
export function bodyWordCount(b) {
  if (!b) return 0;
  const parts = [b.lead || ''];
  for (const sec of b.sections || []) {
    parts.push(sec.heading || '');
    parts.push(...(sec.paragraphs || []));
    parts.push(...(sec.bullets || []));
  }
  parts.push(...(b.steps || []));
  for (const f of b.faq || []) {
    parts.push(f.q || '', f.a || '');
  }
  return parts.join(' ').split(/\s+/).filter(Boolean).length;
}

/**
 * Konuya özgü derin gövde — pillar hedefi ~750–1100 kelime.
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
  const sure2 = pick(bank.sureler, seed, 4);
  const risk = pick(bank.riskler, seed, 2);
  const risk2 = pick(bank.riskler, seed, 6);
  const belgeler = pickN(bank.belgeler, seed, Math.min(5, bank.belgeler.length)).join(', ');
  const merciPick = pick(bank.merciler, seed, 3);
  const adimlar = bank.adimlar || [];

  // --- LEAD ---
  let lead;
  if (fact?.ozet) {
    lead = `${fact.ozet} Bu ana rehber «${k0}», «${k1}» ve «${k2}» aramalarına yönelik uçtan uca bilgilendirmedir: tanım, yasal çerçeve, muhataplar, belgeler, adım adım süreç, süre riskleri ve sık hatalar bir arada anlatılır. Metin bağlayıcı hukuki tavsiye yerine geçmez; tebliğ tarihi, güncel mevzuat ve somut dosya avukat değerlendirmesine tabidir. Madde metni ve şerh için portal mevzuat bankası (/mevzuat, /ara) kullanılmalıdır.`;
  } else {
    const leadOpeners = [
      `${topicClean}; ${cat.toLocaleLowerCase('tr-TR')} alanında hem tanım hem de «ne yapmalıyım?» sorusunu birlikte taşıyan ana başvuru konularından biridir.`,
      `«${k0}» araması çoğu kullanıcıda tek cümlelik açıklama ile yetinmez; merci, süre, belge ve olası risk de istenir.`,
      `${topicClean} dosyasında doğru merci ve doğru süre, sonucun kendisi kadar belirleyicidir; yanlış kapı veya gecikme hak kaybına yol açabilir.`,
    ];
    lead = `${pick(leadOpeners, seed, 0)} İlgili çerçeve sıklıkla ${kanunStr} hükümleriyle çizilir; başvuru mercileri arasında ${merciPick}, ${pick(bank.merciler, seed, 1)} ve ${pick(bank.merciler, seed, 2)} öne çıkar. Aşağıda «${k0}» odaklı tanım, şartlar, belgeler, süreç, süreler, riskler, sık sorular ve portal içi madde/hesaplama bağlantıları sade ama ayrıntılı biçimde verilmiştir. Bu metin genel bilgilendirmedir; somut olayda tebliğ/öğrenme tarihi, yürürlükteki mevzuat ve gerekiyorsa avukat görüşü esastır.`;
  }

  const sections = [];

  // 1. Tanım / çerçeve
  if (fact?.ozet) {
    sections.push(
      s(`${topicClean}: hukuki çerçeve ve arama niyeti`, [
        fact.ozet,
        `Arama motorunda «${k0}» yazan kişi genelde hem kavramın ne anlama geldiğini hem de hangi adımın atılması gerektiğini bir arada ister. Bu nedenle ana rehberde tanım ile usul yan yanadır; dar teknik sorular (tek oran, tek tablo, tek belge) spoke sayfalara bırakılır.`,
        `«${k1}» ve «${k2}» ifadeleri pratikte e-Devlet, UYAP, icra, mahkeme veya idari başvuru adımlarıyla birlikte aranır. Tek cümlelik tanım, tebliğ tarihini sabitlemeden veya belge listesini bilmeden işlem başlatmaya yetmez.`,
      ], fact.onemli?.slice(0, 5) || [k0, k1, k2])
    );
  } else {
    sections.push(
      s(`«${k0}» ne demektir? Kavram ve kapsam`, [
        `${t.h1} sorusu, ${cat.toLocaleLowerCase('tr-TR')} alanında hak, borç, şekil ve usul kurallarının kesişiminde durur. Kimlerin muhatap olduğu, hangi şartların arandığı, hangi mercinin yetkili olduğu ve sürenin ne zaman işlemeye başladığı birlikte okunmalıdır.`,
        `Uygulamada «${k1}» sıklıkla elektronik kanallar (e-Devlet, UYAP, kurum portalları) ile fiziki başvuru (noter, randevu, ıslak imza) ayrımını da gündeme getirir. Yanlış mercie gitmek veya belge eksik bırakmak, fiilen süreyi tüketebilir.`,
        `Bu ana rehber genel süreç iskeletini verir. Alt niyetler (hesap, tek şart, itirazın tek dayanağı vb.) ilgili spoke sayfalarda daraltılmış anahtar kelimelerle işlenir; böylece arama yamyamlığı azaltılır.`,
      ], [k0, k1, k2].filter(Boolean))
    );
  }

  // 2. Yasal dayanak
  sections.push(
    s('Yasal dayanak ve ilgili mevzuat', [
      `Bu konuda sık atıf yapılan metinler: ${kanunStr}. Madde numarası, fıkra ve bent somut olaya göre değişir; Resmî Gazete’deki yürürlük ve değişiklik tarihi kontrol edilmeden «kesin hüküm» gibi konuşulmamalıdır.`,
      fact?.link
        ? `Portal içi ilgili araç veya kategori: ${fact.link}. Kanun maddesi aramak için /ara, arşiv ve şerh için /mevzuat kullanılabilir. Madde numarasını biliyorsanız /mevzuat/{kanunId}/madde-{n} yoluna gidin.`
        : `Kanun maddesi metni ve akademik şerh için sitede «${k0}» araması yapılabilir: /ara. Kategori sayfaları, hesaplama araçları ve içtihat (/icthat) ilgili bağlantılarda yer alır.`,
      `${sure} ${sure2 && sure2 !== sure ? sure2 : 'Süre ve hak düşürücü süre ayrımı somut işleme göre ayrıca denetlenmelidir.'}`,
      `Yönetmelik, tebliğ, kurum genelgesi ve dönemsel tarifeler (harç, tavan, parasal sınır) kanun metninden bağımsız olarak sonucu değiştirebilir. İnternetteki «garanti formül» vaatleri bağlayıcı değildir.`,
    ])
  );

  // 3. Muhataplar / şartlar
  sections.push(
    s('Kimler muhataptır? Şartlar nelerdir?', [
      `Tipik merciler ve muhataplar: ${merciStr}. Şartlar; süre, şekil, belgeler, bazen arabuluculuk, idari ön başvuru veya dava şartı gibi usul engellerini içerir. Ehliyet, vekâlet ve temsil belgesi eksikliği başvuruyu usulden düşürebilir.`,
      `«${k2}» ile ilgili tebliğ, öğrenme, fesih veya işlem tarihi yazılı olarak sabitlenmelidir. e-Tebligatta «açılmasa da tebliğ sayılma» kuralları, usulsüz tebligatta ise öğrenme tarihi ayrı ispat konusu olabilir.`,
      `Kurumların e-Devlet/UYAP kanalları ile fiziki başvuru (noter, randevu, ıslak imza, asıl evrak) ayrımına dikkat edin. Barkodlu çıktı bazı işlemlerde yeterli, bazılarında yetersiz kalır; merci bazında doğrulayın.`,
      `Üçüncü kişi hakları (eş, çocuk, alacaklı, paydaş, kefil, kiracı) dosyayı genişletebilir. Tek taraflı işlem sandığınız adım, tebligat ve dinlenilme hakkını tetikleyebilir.`,
    ])
  );

  // 4. Süreç
  const processSteps = fact?.onemli
    ? [
        'Konuya özgü olguları, tarihleri ve belgeleri derleyin; tebliğ/öğrenme anını sabitleyin.',
        'Yasal dayanak, görevli merci ve süreyi güncel metinden kontrol edin.',
        'Dava şartı varsa (arabuluculuk, idari başvuru) önce onu tamamlayın; tutanağı saklayın.',
        'Doğru mercie yazılı başvuru, dava veya takip başlatın; delil listesini ekleyin.',
        'Sonucu UYAP/e-Devlet/kurum takibiyle izleyin; ret veya aleyhe kararda kanun yolunu değerlendirin.',
        'Ödeme, tescil, icra kapanışı veya kararın uygulanmasını belgelendirin.',
      ]
    : adimlar;

  sections.push(
    s('Süreç nasıl işler? Adım adım', [
      `Tipik akış: ${processSteps.map((a, i) => `(${i + 1}) ${a}`).join(' ')}`,
      `Elektronik kanallar hız kazandırır; ancak süre hesabı hâlâ tebliğ/öğrenme tarihine bağlıdır. «${k0}» dosyasında ekran görüntüsü ile resmî kayıt (UYAP, e-Devlet, kurum yazısı) birlikte saklanmalıdır.`,
      `Paralel yollar (idari itiraz + yargı, arabuluculuk + dava hazırlığı, ödeme + itiraz) stratejik seçimdir. Bir yolu seçmek diğerini her zaman kapatmaz; bazen süreleri de etkilemez. Somut mevzuat kontrolü şarttır.`,
      `Harç, avans, arabuluculuk ücreti, icra masrafı ve vekâlet ücreti dosya türüne göre değişir. «Bedava kesin sonuç» vaadi gerçekçi değildir; masraf listesini peşinen kabaca çıkarmak planlamayı kolaylaştırır.`,
    ], processSteps.slice(0, 5))
  );

  // 5. Belgeler
  sections.push(
    s('Belgeler, ispat ve delil seti', [
      `Sık kullanılan belgeler: ${belgeler}. Ayrıca kimlik, tebligat mazbataları, ödeme dekontları, mesaj/e-posta zinciri, ses/görüntü kaydı (hukuka uygunluk şartıyla) ve tanık listesi tamamlayıcı olabilir.`,
      `Dijital delillerde tarih damgası, bütünlük ve kaynak (orijinal dosya, metadata, ekran görüntüsü zinciri) korunmalıdır. Sonradan «düzenlenmiş» gibi görünen çıktılar ispat gücünü zayıflatır.`,
      `Resmî kayıtlara (tapu, SGK, icra, nüfus, vergi, belediye) mümkün olduğunca asıl, onaylı suret veya kurum barkodlu belge ile erişin. Sözlü beyan, yazılı kayıt yoksa çoğu mercide yetersiz kalır.`,
      fact?.onemli?.length
        ? `Konuya özgü kritik noktalar: ${fact.onemli.join(' · ')}`
        : `Delil listesini dilekçeye eklemek, sonradan «bulamadım» demekten iyidir; ancak mahkeme/merci talep etmeden gereksiz kişisel veri paylaşmayın (KVKK dengesi).`,
    ], pickN(bank.belgeler, seed + 3, 4))
  );

  // 6. Süreler
  sections.push(
    s('Süreler, tebliğ ve hak düşürücü risk', [
      `${sure}`,
      sure2 && sure2 !== sure
        ? sure2
        : 'Hak düşürücü süre ile zamanaşımı karıştırılmamalıdır; birincisi hakkın varlığını, ikincisi dava edilebilirliğini etkiler. Somut işlem tipine göre hangisinin geçerli olduğu denetlenmelidir.',
      `e-Tebligat (UETS) ve klasik tebligatta süre başlangıcı farklı kurallara bağlanabilir. «Okumadım» iddiası tek başına her zaman süreyi durdurmaz. Usulsüz tebligat iddiasında öğrenme tarihi yazılı kanıtla sabitlenmelidir.`,
      `Süre son günü resmi tatil veya hafta sonuna rastlarsa uzama kuralları HMK/İYUK/ilgili usul kanununa göre işletilir; yine de son güne bırakmak risklidir. Takvim ve saat dilimi (kurum kapanışı) peşinen not edilmelidir.`,
    ])
  );

  // 7. Riskler
  sections.push(
    s('Sık hatalar, riskler ve yanlış bilinenler', [
      `En sık görülen risk: ${risk}. İkinci tipik hata: ${risk2 || risk}. Bunların yanında süreleri kabaca hesaplamak, sözlü anlaşmaya güvenmek ve ödeme/indirim/feragat metnini okumadan imzalamak hak kaybına yol açar.`,
      `«Herkes böyle yapıyor» veya forum yorumları bağlayıcı kaynak değildir. Dönemsel oran, tavan, parasal sınır ve arabuluculuk kapsamı her yıl değişebilir.`,
      `İbraname, sulh, feragat ve peşin ödeme indirimi metinleri çoğu zaman geri dönüşü zor sonuç doğurur. İmza öncesi kalem kalem tutar, kapsam ve «tüm haklarımdan feragat» cümleleri okunmalıdır.`,
      `Bu rehber sonuç vaadi içermez. Amaç, «${k0}» konusunda bilinçli adım atmanızı sağlamaktır; dosya sonucu mercie, delile ve yargı takdirine bağlıdır.`,
    ], [risk, risk2, 'Süre kaçırma', 'Yanlış merci', 'Eksik belge'].filter(Boolean).slice(0, 5))
  );

  // 8. Portal / yan sayfalar
  sections.push(
    s('Kanun maddesi, şerh, hesaplama ve ilgili rehberler', [
      `«${k0}» ile ilişkili kanun maddelerini bulmak için portal kanun maddesi aramasını kullanın: /ara. Madde numarasını biliyorsanız /mevzuat/{kanun}/madde-{n}; bilmiyorsanız tam metin arama yapın. Okuma yöntemi için /bilgi/kanun-maddesi-nasil-okunur.`,
      `Hesaplama araçları (kıdem, miras, faiz, kira, nafaka, işe iade vb.) kabaca fikir verir; bordro, tarife, TİS ve yargı uygulaması somut tutarı değiştirir. İçtihat taraması için /icthat kullanılabilir.`,
      `Bu sayfa pillar (ana rehber) rolündedir. Dar niyetli alt sayfalar (spoke) tek bir soruya odaklanır ve buraya geri link verir; böylece «${k0}» aramasında içerik dağılmaz, ana süreç tek çatıda toplanır.`,
      `İlgili kategori ve araç bağlantıları sayfa altındaki linklerde ve «İlgili rehberler» bölümünde listelenir. Güncel tarih damgası: rehber güncelleme alanı — mevzuat değişince metin yenilenir.`,
    ])
  );

  // FAQ
  const faqList = [];
  if (fact?.onemli?.length) {
    faqList.push(faq(`«${k0}» için en kritik nokta nedir?`, fact.onemli[0]));
    if (fact.onemli[1]) {
      faqList.push(
        faq(
          'Nelere özellikle dikkat edilmeli?',
          fact.onemli.slice(1, 4).join(' ')
        )
      );
    }
  } else {
    faqList.push(
      faq(
        `«${k0}» başvurusunda ilk adım ne olmalı?`,
        `Önce tebliğ, öğrenme, fesih veya olay tarihini yazılı sabitleyin; sonra ${merciPick} başta olmak üzere doğru mercie, belge listesine ve varsa dava şartına (arabuluculuk/idari başvuru) karar verin.`
      )
    );
    faqList.push(
      faq(
        `«${k1}» için hangi mevzuata bakılır?`,
        `Sıklıkla ${kanunStr} devreye girer. Somut madde numarası dosyaya göre değişir; güncel metin ve şerh için /ara ve /mevzuat kullanılmalıdır.`
      )
    );
  }
  faqList.push(
    faq(
      'Hangi mercie başvurmalıyım?',
      `Tipik merciler: ${merciStr}. Görev-yetki ve dava şartı somut olaya göre değişir; yanlış merci süre kaybettirebilir.`
    )
  );
  faqList.push(
    faq(
      'Avukat tutmak zorunlu mudur?',
      cat === 'Ceza'
        ? 'Gözaltı ve bazı soruşturma aşamalarında müdafi hakkı kritiktir; zorunlu müdafi halleri CMK’da düzenlenir. Diğer başvurularda avukat zorunlu olmayabilir ancak süre-usul-delil riski yüksektir.'
        : 'Çoğu idari ve hukuk başvurusunda avukat zorunlu değildir. Ancak süre, delil, feragat ve strateji hataları hak kaybına yol açabileceğinden karmaşık veya yüksek riskli dosyalarda hukuki destek önerilir.'
    )
  );
  faqList.push(
    faq(
      'Süre ne zaman işlemeye başlar?',
      'Kural olarak tebliğ, öğrenme, fesih veya olay tarihinden itibaren. e-Tebligat ve usulsüz tebligat hallerinde öğrenme/tebliğ sayılma anı ayrıca incelenir. Bu sayfa somut dosyanız için kesin gün sayısı vaat etmez.'
    )
  );
  faqList.push(
    faq(
      'e-Devlet veya UYAP yeterli midir?',
      'Birçok sorgulama ve başvuru elektronik yapılabilir; bazı işlemler noter, randevu, ıslak imza veya asıl evrak ister. Merci bazında kanalı doğrulayın; ekran görüntüsünü resmî kayıtla destekleyin.'
    )
  );
  faqList.push(
    faq(
      'Bu rehber bağlayıcı mıdır? Sonuç garanti midir?',
      'Hayır. Genel bilgilendirmedir; sonuç vaadi içermez. Yürürlükteki mevzuat, idari düzenleyici işlemler, içtihat ve somut olayın özellikleri esastır. Av. Fethi Güzel Hukuk Portalı bilgilendirme amaçlıdır.'
    )
  );

  const steps = (processSteps.length ? processSteps : adimlar).map((step, i) => {
    if (i === 0) return `«${k0}»: ${step}`;
    return step;
  });

  return bodyPack(lead, sections, steps, faqList);
}

/**
 * Spoke: dar niyet, pillar’a yönlendirir — hedef ~420–600 kelime.
 * @param {object} t
 * @param {{ pillar: string, angle: string, clusterLabel?: string }} meta
 */
export function buildSpokeBody(t, meta) {
  const seed = hash(t.slug);
  const k0 = t.keywords[0] || t.h1;
  const k1 = t.keywords[1] || k0;
  const k2 = t.keywords[2] || k1;
  const pillarHref = `/bilgi/${meta.pillar}`;
  const cat = t.category;
  const bank = CAT_BANK[cat] || CAT_BANK.Usul;
  const fact = TOPIC_FACTS[t.slug];
  const angle = meta.angle || k0;
  const kanunShort = bank.kanunlar.slice(0, 2).join(' ve ');
  const belgeler = pickN(bank.belgeler, seed, 4).join(', ');
  const risk = pick(bank.riskler, seed, 2);
  const sure = pick(bank.sureler, seed, 1);

  const lead = fact?.ozet
    ? `${fact.ozet} Bu sayfa yalnızca «${angle}» niyetine odaklanır; tüm süreci yeniden anlatmaz. Hak kazanma, merciler, belgeler ve adım adım yol haritası için ana rehberi okuyun: ${pillarHref}. Metin genel bilgilendirmedir; bağlayıcı tavsiye ve sonuç vaadi içermez.`
    : `«${k0}» araması çoğu zaman genel konunun dar bir dilimidir: ${angle}. Bu spoke sayfa yalnızca o dilimi açar; ${cat.toLocaleLowerCase('tr-TR')} sürecinin tamamı ana rehberdedir (${pillarHref}). Mevzuat çerçevesi sıklıkla ${kanunShort} çevresindedir. Tebliğ tarihi, güncel oran/sınır ve somut delil dosyaya göre değişir.`;

  const sections = [
    s(`Bu sayfanın odağı: ${angle}`, [
      fact?.ozet ||
        `«${k0}» ifadesi uygulamada genelde «${angle}» sorusuna indirgenir. Burada tanım, tipik şartlar ve dikkat edilecek tek bir dilim işlenir; dava iskeleti, tüm belge listesi ve alternatif yollar ana rehberde toplanmıştır.`,
      `«${k1}» ve «${k2}» anahtarları bilerek dar tutulmuştur. Aynı genel anahtarları hem pillar hem spoke’ta doldurmak arama motorunda yamyamlığa yol açar; bu yüzden ana süreç ${pillarHref} adresine bırakılır.`,
      fact?.onemli?.length
        ? `Bu dilimde öne çıkan noktalar: ${fact.onemli.slice(0, 4).join(' · ')}`
        : `Dar soruda bile tebliğ/öğrenme tarihi ve yazılı delil seti ihmal edilmemelidir; aksi halde «doğru cevap» bile geç kalmış olur.`,
    ], fact?.onemli?.slice(0, 4) || [k0, angle, k1].filter(Boolean)),
    s('Ne zaman bu sayfa, ne zaman ana rehber?', [
      `Hızlı ve dar soru (oran, tablo, tek şart, tek belge, tek süre, tek formül) için bu sayfa yeterince odaklıdır. «Nasıl alırım / nasıl açarım / hangi mahkeme / tüm adımlar neler?» sorusu için ana rehber zorunludur: ${pillarHref}.`,
      `Ana rehberi okumadan feragat, ibraname, peşin ödeme indirimi veya dava açmak risklidir. Spoke, pilları ikame etmez; tamamlar.`,
      meta.clusterLabel
        ? `Bu sayfa «${meta.clusterLabel}» kümesinin yan niyetidir; kümenin merkezi yine ana rehberdir.`
        : `Aynı kategorideki diğer dar sayfalar ana rehberin ilgili rehberler bölümünden dolaşılabilir.`,
    ]),
    s(`${angle}: pratik usul notu`, [
      `Merciler (tipik): ${bank.merciler.slice(0, 4).join(', ')}. ${sure}`,
      `Sık risk: ${risk}. Delil setinde sıklıkla ${belgeler} öne çıkar. Eksik belge veya yanlış merci, «${k0}» dosyasında süreyi fiilen tüketebilir.`,
      `Elektronik kanal (e-Devlet, UYAP, kurum portali) uygunsa barkodlu çıktıyı saklayın; fiziki başvuru gerekiyorsa randevu ve asıl evrak listesini peşinen çıkarın.`,
      `Hesap, tavan, parasal sınır veya tarife içeren sorularda dönemsel güncellemeyi (Resmî Gazete, kurum duyurusu) kontrol edin. Portal hesaplama araçları kabaca fikir verir; bağlayıcı değildir.`,
    ], pickN(bank.belgeler, seed + 2, 3)),
    s('Sık hata ve yanlış bilinenler', [
      `«Sadece ${angle} önemli, gerisi sonra» yaklaşımı süre ve dava şartı olan işlerde pahalıya mal olur. Önce ana rehberdeki süreç iskeletine bakın: ${pillarHref}.`,
      `Forum ve sosyal medya yorumları somut dosyanızın tebliğ tarihini, mercisini ve delilini bilmez. ${risk}`,
      `Ödeme, feragat veya sulh metnini okumadan imzalamak spoke’un «dar» görünmesine aldanmamalıdır; imza çoğu zaman geniş feragat doğurur.`,
    ]),
    s('İç linkler ve madde arama', [
      `Ana rehber (pillar): ${pillarHref}`,
      fact?.link
        ? `İlgili araç veya mevzuat: ${fact.link}`
        : `Kanun maddesi arama: /ara · Mevzuat arşivi: /mevzuat · İçtihat: /icthat`,
      `«${k0}» ile ilişkili madde numarasını biliyorsanız doğrudan /mevzuat yolunu kullanın; bilmiyorsanız /ara ile tam metin arayın. Okuma yöntemi: /bilgi/kanun-maddesi-nasil-okunur.`,
    ]),
  ];

  const steps = [
    `Sorunuzun gerçekten «${angle}» ile sınırlı olduğunu doğrulayın; değilse ana rehbere geçin (${pillarHref}).`,
    `Tebliğ/öğrenme veya işlem tarihini yazılı sabitleyin.`,
    `Gerekli belgeleri toplayın (${pickN(bank.belgeler, seed, 3).join(', ')}).`,
    `Dar işlem adımını atın; dava şartı varsa (arabuluculuk vb.) atlamayın.`,
    `Sonucu takip edin; aleyhe gelişmede ana rehberdeki kanun yolu notlarına bakın.`,
  ];

  const faqList = [
    faq(
      'Neden ayrı sayfa var?',
      `Arama niyetini ayırmak için: bu sayfa «${angle}»; genel süreç ve belgeler ${pillarHref} adresindedir. Böylece yamyamlık azalır.`
    ),
    faq(
      'Ana rehberi okumadan bu sayfa yeterli midir?',
      'Dar teknik sorularda kısmen. Süre, feragat, dava veya icra riski varsa ana rehber + güncel mevzuat + gerekirse avukat şarttır.'
    ),
    faq(
      `«${k0}» için hangi mevzuat?`,
      `Sıklıkla ${kanunShort}. Somut madde dosyaya göre değişir; /ara ve /mevzuat ile doğrulayın.`
    ),
    faq(
      'Süre ne zaman başlar?',
      'Tebliğ, öğrenme veya işlem tarihinden. e-Tebligat kuralları farklı işleyebilir. Bu sayfa kesin gün sayısı vaat etmez.'
    ),
    faq(
      'Bu metin bağlayıcı mıdır?',
      'Hayır. Genel bilgilendirmedir; sonuç vaadi yoktur. Av. Fethi Güzel Hukuk Portalı bilgilendirme amaçlıdır.'
    ),
  ];

  return bodyPack(lead, sections, steps, faqList);
}

/**
 * Bridge: madde özeti — canonical mevzuat sayfasına.
 */
export function buildBridgeBody(t, bridge) {
  const fact = TOPIC_FACTS[t.slug];
  const canon = bridge.canonicalPath;
  const k0 = t.keywords?.[0] || t.h1;
  const lead = fact?.ozet
    ? `${fact.ozet} Tam resmî madde metni ve akademik şerh şu adrestedir: ${canon}. Bu sayfa yalnızca vatandaş dilinde kısa özet sunar; Google’a kral URL olarak madde sayfası gösterilir (canonical). Bağlayıcı tavsiye değildir.`
    : `${t.h1} — kısa vatandaş özeti («${k0}»). Resmî metin, fıkra ve akademik şerh: ${canon}. Özet ile madde çelişirse madde metni esastır.`;

  const sections = [
    s('Özet (vatandaş dili)', [
      fact?.ozet ||
        `${t.h1} konusunda ayrıntılı hüküm, fıkra ve bent yapısı mevzuat sayfasındadır. Bu bridge yalnızca arama niyetini karşılamak ve okuyucuyu doğru URL’ye yönlendirmek içindir.`,
      'Fıkra, bent ve atıf maddeleri atlanmamalıdır. Yürürlük ve değişiklik tarihi Resmî Gazete / mevzuat.gov.tr ile kontrol edilmelidir.',
      fact?.onemli?.length
        ? `Kısa notlar: ${fact.onemli.slice(0, 4).join(' · ')}`
        : 'Madde okurken sistematik yer (bölüm/ayrım), tanımlar ve atıf zinciri birlikte görülmelidir.',
    ], fact?.onemli?.slice(0, 4)),
    s('Tam metin ve şerh nerede?', [
      `Kanun maddesinin bağlayıcı metni ve akademik şerh: ${canon}`,
      'Arama: /ara · Mevzuat arşivi: /mevzuat · Okuma rehberi: /bilgi/kanun-maddesi-nasil-okunur',
      'Süreç odaklı vatandaş rehberleri /bilgi dizinindedir; madde sayfası hüküm ve şerh içindir.',
    ]),
    s('Pratik uyarı', [
      'Özet ile resmî metin çelişirse resmî metin esastır. Somut uyuşmazlıkta avukat, güncel içtihat ve tebliğ tarihleri değerlendirilmelidir.',
      'Bu bridge sayfa ranking sinyali olarak madde URL’sine (canonical) yönlendirir; içerik kopyası üretmez.',
    ]),
  ];

  const steps = [
    'Kısa özeti okuyun.',
    `Tam maddeye gidin: ${canon}`,
    'Fıkra, bent ve atıfları kontrol edin.',
    'Süreç için ilgili /bilgi rehberine geçin.',
    'Gerekirse /ara ile bağlantılı maddeleri tarayın.',
  ];

  const faqList = [
    faq(
      'Neden iki URL var?',
      'Biri vatandaş özeti, diğeri resmî metin+şerh. Arama motoruna madde sayfası kral URL olarak gösterilir (canonical).'
    ),
    faq('Hangisini okumalıyım?', `Karar, atıf ve şerh için ${canon}; hızlı özet için bu sayfa.`),
    faq('Şerh bağlayıcı mıdır?', 'Hayır; akademik bilgilendirmedir. Karar mercie aittir.'),
    faq('Bu metin yeterli midir?', 'Hayır. Özet amaçlıdır; uygulama için madde metni + süreç rehberi + gerekirse avukat gerekir.'),
  ];

  return bodyPack(lead, sections, steps, faqList);
}
