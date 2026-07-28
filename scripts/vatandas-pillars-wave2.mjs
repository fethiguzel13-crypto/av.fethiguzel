/**
 * 2. dalga pillar derin gövdeler (20 konu).
 * Yargıtay dosya no uydurulmaz.
 */
import { PILLAR_BODIES as WAVE1 } from './vatandas-pillars-deep.mjs';

function s(heading, paragraphs, bullets) {
  return { heading, paragraphs, bullets };
}
function faq(q, a) {
  return { q, a };
}
function pack(lead, sections, steps, faqList) {
  return { lead, sections, steps, faq: faqList };
}

const WAVE2 = {
  'trafik-cezasina-itiraz': pack(
    'Trafik idari para cezasına itiraz, tebliğden itibaren yasal süre içinde yetkili mercie yapılır. EDS/HGS ve e-Devlet sorgusu dayanağı görmek içindir; peşin ödeme indirimi ile itiraz stratejisi birlikte değerlendirilmelidir. Bu sayfa itirazın ana rehberidir; puan, peşin indirim ve ehliyet iadesi yan sayfalardadır.',
    [
      s('Süre ve merci', [
        'Süre tebliğ tarihine bağlıdır. e-Tebligat ve usulsüz tebligat hallerinde öğrenme/tebliğ anı ayrıca incelenir: /bilgi/tebligat-usulsuzlugu',
        'Çoğu trafik IPC’sinde itiraz sulh ceza hâkimliği veya ilgili usule tabidir; güncel mercie tebliğ metninden bakın.',
      ], ['Tebliğ tarihi', 'Yasal itiraz süresi', 'Gerekçeli dilekçe']),
      s('Gerekçe örnekleri', [
        'Usulsüz tebliğ, levha/ölçüm hatası, araç devri sonrası eski plaka, kimlik/tespit hatası sık ileri sürülen gerekçelerdir. Delilsiz “haksızım” iddiası zayıftır.',
        'EDS sorgu: /bilgi/eds-ceza-sorgulama · peşin indirim: /bilgi/trafik-cezasi-pesin-odeme · puan: /bilgi/trafik-ceza-puani',
      ]),
      s('Ödeme ve itiraz ilişkisi', [
        'Peşin ödeme indirimi ile itiraz hakkı ilişkisini güncel mevzuattan kontrol edin; “ödedim, itiraz bitti” varsayımı her zaman doğru olmayabilir.',
      ]),
      s('Ehliyet ve ceza', [
        'Puan birikimi ve el koyma ayrı rejimdir: /bilgi/ehliyet-geri-alma · alkollü kullanım: /bilgi/alkollu-arac-kullanma-cezasi',
      ]),
    ],
    [
      'Ceza tebliğini ve plaka/fotoğrafları kaydedin.',
      'Süreyi tebliğden hesaplayın.',
      'Gerekçe ve delilleri yazın.',
      'Yetkili mercie itiraz edin; başvuru numarasını saklayın.',
      'Sonucu e-Devlet/posta ile takip edin.',
    ],
    [
      faq('İtiraz ücretsiz midir?', 'Harç/masraf mercie göre değişebilir; tebliğ ve tarife kontrol edilmelidir.'),
      faq('Ödeme itirazı engeller mi?', 'Dönemsel kurallara göre değişir; peşin indirim sayfasına bakın.'),
      faq('KTK maddesi nerede?', 'Portal: /ara veya /kategori/ktk'),
    ]
  ),

  'tuketici-hakem-heyeti': pack(
    'Tüketici hakem heyeti, belirli parasal sınır altındaki tüketici uyuşmazlıklarında başvurulan mercidir. e-Devlet başvurusu yaygındır; kararlara karşı tüketici mahkemesinde itiraz yolu vardır. Ayıp, cayma ve abonelik alt niyetleri ayrı sayfalardadır.',
    [
      s('Ne zaman hakem heyeti?', [
        'Parasal sınır her yıl güncellenir: /bilgi/tuketici-hakem-parasal-sinir. Sınır üstünde veya itiraz sonrası tüketici mahkemesi gündeme gelir: /bilgi/tuketici-mahkemesi',
      ]),
      s('Başvuru', [
        'e-Devlet adımları: /bilgi/e-devlet-tuketici. Fatura, sipariş, garanti, yazışma eklenmelidir. Satıcıya önce yazılı başvuru ispatı güçlendirir.',
      ]),
      s('Sık konular', [
        'Ayıp: /bilgi/ayip-mal-iade · Cayma: /bilgi/mesafeli-satis-cayma · Abonelik: /bilgi/abonelik-iptali-tuketici · Kredi cayma: /bilgi/tuketici-kredisi-cayma',
      ]),
      s('Karar sonrası', [
        'Aleyhe kararda süre içinde itiraz/dava yolları açıktır. Anlaşma ve icra ayrı değerlendirilir.',
      ]),
    ],
    [
      'Parasal sınırı kontrol edin.',
      'Belgeleri toplayın; satıcıya yazın.',
      'e-Devlet/hakem heyetine başvurun.',
      'Kararı takip edin.',
      'Gerekirse mahkeme yoluna gidin.',
    ],
    [
      faq('Avukat zorunlu mu?', 'Hayır; karmaşık dosyada önerilir.'),
      faq('Ne kadar sürer?', 'Yoğunluğa göre değişir; kesin süre vaadi yoktur.'),
      faq('Arabuluculuk var mı?', 'Bazı davalarda olabilir: /bilgi/tuketici-arabuluculuk'),
    ]
  ),

  'hukuk-davasi-nasil-acilir': pack(
    'Hukuk davası, görevli-yetkili mahkemede dilekçe, harç ve (gerekirse) arabuluculuk dava şartı ile açılır. Bu sayfa genel iskelettir; görev, yetki, harç ve dilekçe yan sayfalardadır.',
    [
      s('Dava şartları ve arabuluculuk', [
        'Hukuki yarar, ehliyet, harç ve bazı uyuşmazlıklarda arabuluculuk aranır: /bilgi/dava-acilmasi-sartlari · /bilgi/arabuluculuk-nasil-yapilir',
      ]),
      s('Görev ve yetki', [
        'Görev: /bilgi/gorevli-mahkeme-nedir · Yetki: /bilgi/yetkili-mahkeme-nedir. Yanlış görev/yetki süre kaybettirebilir.',
      ]),
      s('Dilekçe ve harç', [
        'HMK m.119 unsurları: /bilgi/dilekce-nasil-yazilir · harç: /bilgi/dava-harci-nedir · madde özeti: /bilgi/hmk-madde-119 → canonical mevzuat',
      ]),
      s('Sonrası', [
        'Tebligat, cevap, delil, istinaf: /bilgi/tebligat-usulsuzlugu · /bilgi/istinaf-nedir',
      ]),
    ],
    [
      'Uyuşmazlık türünü teşhis edin.',
      'Arabuluculuk gerekip gerekmediğine bakın.',
      'Görev-yetkiyi belirleyin.',
      'Dilekçe + harç ile dava açın.',
      'Tebligat ve süreleri takip edin.',
    ],
    [
      faq('Her dava avukatlı mıdır?', 'Hayır; istisnalar ve riskler vardır.'),
      faq('Harç iade olur mu?', 'Sonuca ve usule göre değişir.'),
      faq('İdari dava mı hukuk davası mı?', 'İdare işlemi için /bilgi/idari-dava-nasil-acilir'),
    ]
  ),

  'idari-dava-nasil-acilir': pack(
    'İdari dava, idari işlemin iptali ve/veya idarenin eyleminden doğan zararın tazmini (tam yargı) için İYUK çerçevesinde açılır. Süreler kısa ve sıkıdır. İptal, tam yargı ve YD yan sayfalardadır.',
    [
      s('İptal ve tam yargı', [
        'İptal: /bilgi/iptal-davasi-nedir · Tam yargı: /bilgi/tam-yargi-davasi · İşlem: /bilgi/idari-islem-nedir',
      ]),
      s('Süre ve başvuru yolu', [
        'Tebliğ/öğrenme tarihi esastır. Bazı hallerde idari başvuru yollarının tüketilmesi aranır: /bilgi/idari-basvuru-yolu',
      ]),
      s('Yürütmenin durdurulması', [
        'YD ayrı şartlara tabidir: /bilgi/yurutmenin-durdurulmasi. Mahkemeden atama/ruhsat “tesisi” istenmez; kural olarak iptal + YD + varsa tazminat talebi.',
      ]),
      s('Örnek uyuşmazlıklar', [
        'Belediye cezası: /bilgi/belediye-cezasi-itiraz · Kamulaştırma: /bilgi/kamulastirma-nedir · Trafik cezası (çoğu idari): /bilgi/trafik-cezasina-itiraz',
      ]),
    ],
    [
      'İdari işlemi ve tebliğ tarihini sabitleyin.',
      'İdari itiraz gerekip gerekmediğine bakın.',
      'İptal ve/veya tam yargı talebini netleştirin.',
      'İdare mahkemesinde dava açın; YD değerlendirin.',
      'Kanun yollarını takip edin.',
    ],
    [
      faq('Süre ne kadar?', 'İşlem ve tebliğe göre değişir; çoğu kısa ve hak düşürücüdür.'),
      faq('CİMER dava yerine geçer mi?', 'Hayır; CİMER idari başvurudur. /bilgi/cimer-sikayet'),
      faq('Mahkeme atama yapar mı?', 'İYUK m.2/2 çerçevesinde mahkemeden idari işlem tesisini istemek kural olarak mümkün değildir.'),
    ]
  ),

  'tebligat-usulsuzlugu': pack(
    'Tebligat usulsüzlüğü, tebliğin kanuna aykırı yapıldığı iddiasıdır. Öğrenme tarihi ispatlanırsa süreler buna göre işlemeye başlayabilir. e-Tebligat kuralları ayrıdır; bu sayfa usulsüzlük ana rehberidir.',
    [
      s('Ne zaman usulsüz?', [
        'Yanlış adrese tebliğ, usulsüz komşu/kapıcı tebliği, imza ve tutanak eksiklikleri sık örneklerdir. Her somut tutanak ayrıca okunmalıdır.',
      ]),
      s('Öğrenme tarihi', [
        'Usulsüzlük iddiasında sürelerin başlangıcı öğrenme tarihi olabilir: /bilgi/usulsuz-tebligat-ogrenme',
      ]),
      s('e-Tebligat', [
        'UETS’te açılmasa da tebliğ sayılma kuralları vardır: /bilgi/elektronik-tebligat · /bilgi/e-tebligat-acmamak',
      ]),
      s('İcra ve dava etkisi', [
        'Ödeme emri tebliği: /bilgi/odeme-emri-tebligi · İtiraz: /bilgi/odeme-emrine-itiraz · İdari dava süreleri: /bilgi/idari-dava-nasil-acilir',
      ]),
    ],
    [
      'Tebliğ mazbatasını inceleyin.',
      'Öğrenme anını belgelendirin.',
      'Usulsüzlük iddiasını ilgili mercie/sürece taşıyın.',
      'Asıl süreleri (itiraz/dava) kaçırmayın.',
      'e-Tebligat kutunuzu düzenli kontrol edin.',
    ],
    [
      faq('Usulsüz tebliğ her zaman iptal midir?', 'Hayır; öğrenme ve somut usul incelenir.'),
      faq('e-Tebligatı açmazsam süre işlemez mi?', 'Kural olarak işlemeye devam edebilir.'),
      faq('Kanun metni?', '/bilgi/tebligat-kanunu-nedir veya /kategori/tebligat'),
    ]
  ),

  'is-sozlesmesi-feshi': pack(
    'İş sözleşmesinin feshi; bildirimli, haklı veya geçerli nedenli olabilir. Sonuçlar kıdem, ihbar, işe iade ve işsizlik ödeneğini doğrudan etkiler. Bu sayfa fesih haritasıdır; alt türler yan sayfalardadır.',
    [
      s('Fesih türleri', [
        'Bildirimli fesih (ihbar süreleri), işveren/işçi haklı fesih, iş güvencesinde geçerli fesih. Karışıklık hak kaybına yol açar.',
        'İşçi haklı: /bilgi/hakli-fesih-isci · İşveren haklı: /bilgi/isveren-hakli-fesih · Geçerli: /bilgi/gecerli-fesih-nedir · İstifa: /bilgi/istifa-nasil-edilir',
      ]),
      s('Sonuçlar', [
        'Kıdem: /bilgi/kidem-tazminati-nasil-alinir · İhbar: /bilgi/ihbar-tazminati-nedir · İşe iade: /bilgi/ise-iade-davasi · İşsizlik: /bilgi/issizlik-maasi-sartlari',
      ]),
      s('Usul', [
        'Yazılı bildirim ve tebliğ ispatı kritiktir: /bilgi/fesih-bildirimi-ornegi. Arabuluculuk çoğu alacakta dava şartıdır.',
      ]),
      s('Özel durumlar', [
        'Mobbing: /bilgi/mobbing-nedir · Toplu çıkış: /bilgi/toplu-isten-cikarma · Belirli/belirsiz süre: ilgili spoke’lar',
      ]),
    ],
    [
      'Fesih türünü doğru adlandırın.',
      'Bildirim ve belgeleri saklayın.',
      'Kıdem/ihbar/işe iade şartlarını kontrol edin.',
      'Arabuluculuğa başvurun.',
      'Dava veya anlaşma ile sonuçlandırın.',
    ],
    [
      faq('Sözlü fesih geçerli midir?', 'İspat zorlaşır; yazılılık ve tebliğ önerilir.'),
      faq('Haklı fesihte süre var mı?', 'Olayın öğrenilmesinden itibaren kısa süreler tartışılır; gecikmeyin.'),
      faq('İşe iade her feshte mi?', 'Hayır; iş güvencesi şarttır.'),
    ]
  ),

  'is-kazasi-tazminati': pack(
    'İş kazası tazminatı; SGK edimleri ile işverene/üçüncü kişiye karşı maddi-manevi tazminat taleplerini kapsar. Bildirim süreleri ve maluliyet oranı ayrı niyet sayfalarındadır.',
    [
      s('Bildirim ve SGK', [
        'İşveren bildirimi kısa süreye tabidir: /bilgi/is-kazasi-bildirimi · /bilgi/is-kazasi-bildirim-suresi. Geçici iş göremezlik ve maluliyet SGK sürecine bağlıdır.',
      ]),
      s('Tazminat kalemleri', [
        'Maddi zarar (tedavi, bakıma muhtaçlık, destekten yoksun kalma), manevi: /bilgi/is-kazasi-manevvi · Maluliyet: /bilgi/is-kazasi-maluliyet · Hak listesi: /bilgi/is-kazasi-sonrasi-haklar',
      ]),
      s('Sorumluluk ve rücu', [
        'İşveren kusuru ve İSG yükümlülüğü: /bilgi/is-veren-sorumlulugu-kazasi · /bilgi/is-guvenligi-uzmani · SGK rücu: /bilgi/sgk-rucu-davasi',
      ]),
      s('Meslek hastalığı', [
        'Ayrı tespit rejimi: /bilgi/meslek-hastaligi-nedir',
      ]),
    ],
    [
      'Kazayı belgelendirin; bildirim süresini kontrol edin.',
      'Tıbbi rapor ve masrafları toplayın.',
      'SGK sürecini takip edin.',
      'Tazminat ve rücu seçeneklerini değerlendirin.',
      'Arabuluculuk/dava yoluna gidin.',
    ],
    [
      faq('SGK ödediyse işverenden istenemez mi?', 'Kalem ve kusura göre rücu/tazminat ayrı değerlendirilir.'),
      faq('Bilirkişi şart mı?', 'Tazminat ve maluliyette çoğu dosyada belirleyicidir.'),
      faq('Zamanaşımı?', 'Somut dayanağa göre değişir; gecikmeyin.'),
    ]
  ),

  'tapu-devri-nasil-yapilir': pack(
    'Tapu devri; randevu, kimlik, harç, DASK ve (gerekirse) vekâlet ile tapu müdürlüğünde tamamlanır. Bu sayfa devir ana rehberidir; harç, kayıt sorgu ve vekâlet yan sayfalardadır.',
    [
      s('Ön hazırlık', [
        'Tapu kaydı/şerh: /bilgi/tapu-kaydi-nasil-alinir · e-Devlet: /bilgi/e-devlet-tapu · DASK: /bilgi/dask-nedir · İpotek: /bilgi/ipotek-nedir',
      ]),
      s('Satış günü', [
        'Adım adım: /bilgi/tapuda-satis-islemleri · Harç: /bilgi/tapu-harci-hesaplama',
      ]),
      s('Vekâlet ve risk', [
        'Vekâleten satış: /bilgi/tapu-vekaleten-satis · Hisseli risk: /bilgi/hisseli-tapu-riskleri · Satış vaadi: /bilgi/gayrimenkul-satis-vaadi',
      ]),
      s('Sonrası', [
        'Belediye/emlak vergisi bildirimi: /bilgi/emlak-vergisi-nedir. Devir sonrası borç ve aidat sorgusu ihmal edilmemelidir.',
      ]),
    ],
    [
      'Tapu ve şerhleri kontrol edin.',
      'DASK ve kimlikleri tamamlayın.',
      'Harç ve ödeme planını yapın.',
      'Randevu alıp devri tamamlayın.',
      'Belediye/vergi bildirimini yapın.',
    ],
    [
      faq('Elden satış olur mu?', 'Taşınmazda tapu devri esas şekil yoludur; vaat ayrıdır.'),
      faq('Harç kim öder?', 'Uygulamada sıklıkla paylaşılır; sözleşme ve tarife esastır.'),
      faq('Vekâlet riskli midir?', 'Yetki dar yazılmalı; sahtecilik riski yüksektir.'),
    ]
  ),

  'emlak-vergisi-nedir': pack(
    'Emlak vergisi, taşınmaz malikinin belediyeye ödediği yıllık vergidir. Konut/işyeri/arsa oranları ve muafiyetler döneme göre değişir. Yapılandırma ve e-Devlet sorgu yan sayfalardadır.',
    [
      s('Mükellef ve matrah', [
        'Kural olarak malik/paydaş mükellefdir. Matrah vergi değeri; oran belediye türüne göre farklılaşabilir.',
      ]),
      s('Ödeme', [
        'Çoğu yerde iki taksit. e-Devlet/banka kanalları yaygındır. Gecikmede gecikme zammı uygulanabilir.',
      ]),
      s('İlgili', [
        'Vergi borcu sorgu: /bilgi/e-devlet-vergi-borcu · Yapılandırma: /bilgi/vergi-borcu-yapislandirma · Tapu devri: /bilgi/tapu-devri-nasil-yapilir',
      ]),
    ],
    [
      'Ada-parsel ve belediyeyi tespit edin.',
      'Borç/beyanı sorgulayın.',
      'Muafiyet belgelerini tamamlayın.',
      'Ödemeyi resmî kanaldan yapın.',
      'Devir öncesi borç sıfırlayın.',
    ],
    [
      faq('Kiracı öder mi?', 'Asıl mükellef maliktir; sözleşmeyle yansıtma ayrıdır.'),
      faq('Ödemezsem?', 'Gecikme zammı ve takibat riski.'),
      faq('MTV emlak mı?', 'Hayır: /bilgi/mtv-nedir'),
    ]
  ),

  'emeklilik-sartlari': pack(
    'Emeklilik (yaşlılık aylığı) şartları; sigortalılık türü, prim günü ve yaşa göre değişir. EYT, maluliyet, borçlanma ve maaş hesabı yan sayfalardadır. Bu sayfa genel haritadır.',
    [
      s('Temel şartlar', [
        '4/a, 4/b, 4/c ve intibak kuralları farklıdır. Hizmet dökümü: /bilgi/sgk-hizmet-dokumu · e-Devlet: /bilgi/e-devlet-sgk-hizmet',
      ]),
      s('Özel rejimler', [
        'EYT: /bilgi/emeklilikte-yasa-takilanlar · Malul: /bilgi/malulen-emeklilik · İkramiye: /bilgi/emekli-ikramiyesi · İntibak: /bilgi/intibak-emeklilik',
      ]),
      s('Borçlanma', [
        'Askerlik: /bilgi/askeri-hizmet-borclanma · Doğum: /bilgi/dogum-borclanmasi · Yurt dışı: /bilgi/yurt-disi-borclanma',
      ]),
      s('Maaş', [
        'Kabaca hesap: /bilgi/emekli-maasi-hesaplama — bağlayıcı değildir.',
      ]),
    ],
    [
      'Hizmet dökümünü alın.',
      'Sigortalılık türünüzü netleştirin.',
      'Yaş/prim tablosunu kontrol edin.',
      'Borçlanma ihtiyacını değerlendirin.',
      'SGK’ya başvurun; sonucu takip edin.',
    ],
    [
      faq('Tek tablo herkese uyar mı?', 'Hayır; giriş tarihi ve statü belirleyicidir.'),
      faq('e-Devlet kesin midir?', 'Bilgi verir; resmî karar SGK sürecine aittir.'),
      faq('Bağ-Kur borcu?', '/bilgi/bagkur-prim-borcu'),
    ]
  ),

  'koruma-karari-6284': pack(
    '6284 sayılı Kanun kapsamında koruma ve uzaklaştırma tedbirleri, şiddet mağdurunun güvenliği için hızlı başvuru yollarıdır. Bu sayfa ana rehberdir; ihlal ve delil yan sayfalardadır.',
    [
      s('Kim, nereye başvurur?', [
        'Mağdur veya ilgili merciler; kolluk, savcılık, aile mahkemesi. Aciliyet esastır.',
      ]),
      s('Tedbir türleri', [
        'Uzaklaştırma, konuta yaklaşmama, silah teslimi, geçici nafaka/barınma gibi tedbirler somut olaya göre verilebilir.',
      ]),
      s('İhlal ve delil', [
        'İhlal: /bilgi/uzaklastirma-karari-ihlal · Delil: /bilgi/siddette-tanik-koruma · Suç duyurusu: /bilgi/savcilik-suc-duyurusu',
      ]),
      s('Boşanma ilişkisi', [
        '6284 boşanmanın alternatifi değildir; paralel yürüyebilir: /bilgi/bosanma-davasi-nasil-acilir',
      ]),
    ],
    [
      'Güvenli ortamı sağlayın; 155/112 gerekirse arayın.',
      'Olay ve delilleri kaydedin.',
      'Koruma talebinde bulunun.',
      'Kararı tebliğ/icra edin.',
      'İhlalde derhal bildirin.',
    ],
    [
      faq('Ücretli midir?', 'Koruma talepleri mağdur için kolaylaştırılmıştır; somut mercie bakın.'),
      faq('Erkek mağdur başvurabilir mi?', 'Kanun mağduriyeti esas alır; cinsiyet tek başına engel değildir.'),
      faq('Karar ne kadar sürer?', 'Hâkim süreyi belirler; uzatma istenebilir.'),
    ]
  ),

  'savcilik-suc-duyurusu': pack(
    'Suç duyurusu, bir suçun işlendiği iddiasıyla Cumhuriyet savcılığına yapılan başvurudur. e-Şikâyet ve yazılı dilekçe yolları vardır. Soruşturma, gözaltı ve şikâyet süresi yan sayfalardadır.',
    [
      s('Nasıl yapılır?', [
        'Yazılı dilekçe, savcılık veya e-şikâyet. Delil listesi eklenmelidir. Geri alma: /bilgi/suc-duyurusu-geri-alma',
      ]),
      s('Süre', [
        'Şikâyete bağlı suçlarda süre kritiktir: /bilgi/sikayet-suresi-ceza',
      ]),
      s('Sonrası', [
        'Soruşturma: /bilgi/ceza-sorusturmasi-sureci · Gözaltı: /bilgi/gozalti-haklari · Uzlaştırma: /bilgi/uzlastirma-nedir',
      ]),
      s('Sık suç tipleri', [
        'Hakaret, tehdit, dolandırıcılık spoke sayfaları. Sosyal medya hakaret: /bilgi/sosyal-medya-hakaret-sikayet',
      ]),
    ],
    [
      'Olay kronolojisini yazın.',
      'Delilleri saklayın.',
      'Dilekçe/e-şikâyet verin.',
      'Başvuru numarasını alın.',
      'Soruşturma sonucunu takip edin.',
    ],
    [
      faq('Avukat zorunlu mu?', 'Hayır; soruşturmada müdafi hakkı ayrıdır.'),
      faq('Anonim şikâyet?', 'İşleme alınma garantisi yoktur; ispat güçleşir.'),
      faq('Hukuk davası ile birlikte?', 'Ayrı yollar; bazen bekletici mesele olur.'),
    ]
  ),

  'kvkk-basvuru-hakki': pack(
    'KVKK m.11, ilgili kişinin veri sorumlusuna başvuru haklarını düzenler. Cevapsızlık veya yetersiz cevapta Kurula şikâyet yolu açılabilir. Aydınlatma, açık rıza ve ihlal yan sayfalardadır.',
    [
      s('Haklar', [
        'Öğrenme, silme, düzeltme, itiraz, aktarımı bilme gibi haklar. Önce veri sorumlusuna başvuru esastır.',
      ]),
      s('Süreç', [
        'Yazılı/kayıtlı başvuru → cevap süresi → Kurul şikâyeti. Aydınlatma: /bilgi/kvkk-aydinlatma-metni · Rıza: /bilgi/kvkk-acik-riza',
      ]),
      s('İhlal ve unutulma', [
        'İhlal: /bilgi/veri-ihlali-bildirimi · Unutulma: /bilgi/unutulma-hakki · Kanun: /bilgi/kvkk-kanunu-nedir',
      ]),
    ],
    [
      'Veri sorumlusunu tespit edin.',
      'Hak talebinizi yazılı iletin.',
      'Cevabı bekleyin; süreyi not edin.',
      'Yetersizse Kurula şikâyet edin.',
      'Suç unsurunda savcılığa başvurun.',
    ],
    [
      faq('e-posta yeterli midir?', 'İspat için kayıtlı yöntem tercih edilir.'),
      faq('Şirket yanıt vermezse?', 'Kurul şikâyeti gündeme gelir.'),
      faq('TCK ile ilişki?', 'Kişisel veri suçları ayrı olabilir.'),
    ]
  ),

  'ihtiyati-tedbir-nedir': pack(
    'İhtiyati tedbir, hakların korunması için yargılama öncesi/sırasında verilen geçici korumadır. HMK m.389 çerçevesinde şartlar ve teminat aranır. Teminat ve itiraz yan sayfalardadır.',
    [
      s('Şartlar', [
        'Hakkın elde edilmesinin zorlaşması veya gecikmede sakınca. Somut delil gerekir. Madde özeti: /bilgi/hmk-madde-389',
      ]),
      s('Teminat ve itiraz', [
        'Teminat: /bilgi/ihtiyati-tedbir-teminati · İtiraz: /bilgi/ihtiyati-tedbir-itiraz · Delil tespiti: /bilgi/delil-tespiti',
      ]),
      s('İhtiyati haciz farkı', [
        'İhtiyati haciz icra/alacak korumasına yakındır: /bilgi/ihtiyati-haciz-nedir',
      ]),
    ],
    [
      'Korunacak hakkı netleştirin.',
      'Delil ve gerekçeyi yazın.',
      'Teminat hazırlayın.',
      'Mahkemeden tedbir isteyin.',
      'Tebliğ ve itiraz sürelerini izleyin.',
    ],
    [
      faq('Tedbir kesin hüküm mü?', 'Hayır; geçicidir.'),
      faq('Teminatsız olur mu?', 'İstisnalar sınırlıdır.'),
      faq('Red olursa?', 'Gerekçeyi okuyup yeniden veya istinaf yollarını değerlendirin.'),
    ]
  ),

  'kamulastirma-nedir': pack(
    'Kamulaştırma, kamu yararı için özel mülkiyete idarece el konulması ve bedel ödenmesidir. Bedel artırım ve acele kamulaştırma yan sayfalardadır.',
    [
      s('Süreç', [
        'Kamu yararı, tebliğ, anlaşma veya mahkeme ile bedel. Mal sahibinin itiraz ve dava hakları vardır.',
      ]),
      s('Bedel', [
        'Artırım davası: /bilgi/kamulastirma-bedel-davasi · Acele usul: /bilgi/acele-kamulastirma',
      ]),
      s('İlgili', [
        'El atma: /bilgi/el-atmanin-onlenmesi · Ecrimisil: /bilgi/ecrimisil-nedir · İdari dava: /bilgi/idari-dava-nasil-acilir',
      ]),
    ],
    [
      'Tebliğ ve kamu yararı belgesini inceleyin.',
      'Bedel teklifini değerlendirin.',
      'Anlaşmazlıkta bedel davası açın.',
      'YD/iptal gerekip gerekmediğine bakın.',
      'Tapu ve ödeme adımlarını takip edin.',
    ],
    [
      faq('Reddedebilir miyim?', 'Kamu yararı kararına karşı yargı yolu vardır; sonuç olaya bağlıdır.'),
      faq('Bedel azsa?', 'Bedel artırım davası gündeme gelir.'),
      faq('Acele kamulaştırma nedir?', '/bilgi/acele-kamulastirma'),
    ]
  ),

  'velayet-davasi': pack(
    'Velayet, çocuğun üstün yararı ölçütüyle aile mahkemesinde düzenlenir. Değişiklik, kişisel ilişki ve teslim icrası yan sayfalardadır.',
    [
      s('Ölçüt', [
        'Üstün yarar; yaş, bakım, şiddet, kardeş ilişkisi ve uzman raporları dikkate alınır. Otomatik “anneye/babaya” kuralı yoktur.',
      ]),
      s('Yan sayfalar', [
        'Değişiklik: /bilgi/velayet-degisikligi · Kişisel ilişki: /bilgi/kisisel-iliski-duzenlemesi · Teslim: /bilgi/cocuk-teslimi-icra',
      ]),
      s('Nafaka ve boşanma', [
        'İştirak nafakası: /bilgi/istirak-nafakasi-nedir · Boşanma: /bilgi/bosanma-davasi-nasil-acilir · 6284: /bilgi/koruma-karari-6284',
      ]),
    ],
    [
      'Çocukla ilgili belgeleri toplayın.',
      'Üstün yarar argümanını somutlaştırın.',
      'Dava veya protokol yolunu seçin.',
      'Kişisel ilişki düzenlemesini netleştirin.',
      'İhlalde icra yolunu değerlendirin.',
    ],
    [
      faq('Çocuk kime verilir?', 'Üstün yarara göre hâkim takdir eder.'),
      faq('Velayet değişir mi?', 'Evet; şartlar değişirse: /bilgi/velayet-degisikligi'),
      faq('Görüşme engellenirse?', 'İcra ve yaptırımlar gündeme gelebilir.'),
    ]
  ),

  'issizlik-maasi-sartlari': pack(
    'İşsizlik ödeneği; prim günü, işten ayrılış hali ve başvuru şartlarına bağlıdır. Hesap ve sigorta tanımı yan sayfalardadır.',
    [
      s('Şartlar', [
        'Belirli prim günü, işsiz kalma hali ve süresinde başvuru aranır. Haklı fesih/istifa ayrımı kritiktir: /bilgi/is-sozlesmesi-feshi',
      ]),
      s('Başvuru', [
        'e-Devlet/İŞKUR. Hizmet dökümü: /bilgi/sgk-hizmet-dokumu',
      ]),
      s('Tutar ve süre', [
        'Kabaca: /bilgi/issizlik-maasi-hesaplama · Sigorta: /bilgi/issizlik-sigortasi-nedir',
      ]),
    ],
    [
      'İşten ayrılış kodunu öğrenin.',
      'Prim gününüzü kontrol edin.',
      'Süresi içinde başvurun.',
      'İş arama yükümlülüğünü yerine getirin.',
      'Ödemeleri takip edin.',
    ],
    [
      faq('İstifa ile alınır mı?', 'Kural olarak hayır; istisnalar sınırlıdır.'),
      faq('Kıdem ile birlikte?', 'Ayrı kurumlardır; şartlar farklıdır.'),
      faq('Ne kadar süre ödenir?', 'Prim gününe göre kademeli süreler vardır.'),
    ]
  ),

  'fazla-mesai-ucreti': pack(
    'Fazla çalışma ücreti, kanuni çalışma sürelerini aşan çalışmanın zamlı ücretidir. İspat (puantaj, yazışma, tanık) ve zamanaşımı kritiktir. UBGT ve hafta tatili yan sayfalardadır.',
    [
      s('Hesap ve ispat', [
        'Zamlı ücret oranları kanunda öngörülür. Bordroda görünmeyen mesai delille kanıtlanabilir. Arabuluculuk dava şartı olabilir.',
      ]),
      s('İlgili kalemler', [
        'UBGT: /bilgi/ubgt-ucreti · Hafta tatili: /bilgi/hafta-tatili-ucreti · Yıllık izin: /bilgi/yillik-izin-hakki · Kıdem: /bilgi/kidem-tazminati-nasil-alinir',
      ]),
    ],
    [
      'Mesai kayıtlarını toplayın.',
      'Kabaca tutarı hesaplayın.',
      'Arabuluculuğa başvurun.',
      'Dava veya anlaşma ile sonuçlandırın.',
      'Zamanaşımını izleyin.',
    ],
    [
      faq('Yazılı mesai emri şart mı?', 'İspatı kolaylaştırır; yokluğu tek başına ret nedeni olmayabilir.'),
      faq('Maktu ücret mesaiyi kapar mı?', 'Somut sözleşmeye göre tartışılır.'),
      faq('Zamanaşımı?', 'İşçilik alacaklarında kural olarak 5 yıl — somut kaleme bakın.'),
    ]
  ),

  'iskan-belgesi-nedir': pack(
    'İskan (yapı kullanma izni), yapının imar ve fen bakımından kullanıma uygunluğunu gösteren belgedir. İskansız kullanım riskleri ve ruhsat yan sayfalardadır.',
    [
      s('Ne işe yarar?', [
        'Abonelik, kredi, satış ve oturma güvenliği açısından aranır. Belgeler: /bilgi/iskan-basvurusu-belgeler',
      ]),
      s('Riskler', [
        'İskansız oturma: /bilgi/iskan-olmadan-oturma · Kaçak yapı: /bilgi/kacak-yapi-cezasi · Ruhsat: /bilgi/yapı-ruhsati-nedir',
      ]),
      s('Süreç', [
        'Ruhsat → yapı denetim → iskan başvurusu → belediye onayı. Denetim: /bilgi/yapı-denetim-nedir',
      ]),
    ],
    [
      'Ruhsat ve proje durumunu kontrol edin.',
      'Eksik evrak listesini tamamlayın.',
      'Belediyeye iskan başvurusu yapın.',
      'Tespit/eksiklikleri giderin.',
      'Belgeyi alın; tapu/abonelik işlemlerini güncelleyin.',
    ],
    [
      faq('İskansız daire satılır mı?', 'Satış mümkün olsa da risk ve finansman sorunları doğabilir.'),
      faq('İmar barışı iskan mıdır?', 'Hayır; farklı rejimdir: /bilgi/imar-barişi-nedir'),
      faq('Ne kadar sürer?', 'Belediye ve eksikliklere göre değişir.'),
    ]
  ),

  'istinaf-nedir': pack(
    'İstinaf, ilk derece mahkemesi kararlarına karşı bölge adliye mahkemesine başvuru yoludur. Süre, dilekçe ve temyiz farkı yan sayfalardadır.',
    [
      s('Süre ve usul', [
        'Tebliğden itibaren yasal süre işlemeye başlar. Dilekçe: /bilgi/istinaf-dilekcesi. Harç ve tebliğ kurallarına uyulmalıdır.',
      ]),
      s('Temyiz ilişkisi', [
        'Temyiz: /bilgi/temyiz-nedir · Sınır: /bilgi/temyiz-siniri · Kesinleşme: /bilgi/kesinlesme-senedi',
      ]),
      s('İdari istinaf', [
        'İdari yargıda da istinaf rejimi vardır; süreler İYUK’a göredir: /bilgi/idari-dava-nasil-acilir',
      ]),
    ],
    [
      'Karar tebliğini alın.',
      'Süreyi hesaplayın.',
      'Gerekçeli istinaf dilekçesi yazın.',
      'Harç/tebligatı tamamlayın.',
      'BAM sonucunu ve temyiz imkânını izleyin.',
    ],
    [
      faq('İstinaf her kararda var mı?', 'Parasal sınır ve karar türüne göre değişir.'),
      faq('Yeni delil sunulur mu?', 'Sınırlı hallerde; kural ilk derecede sunulmasıdır.'),
      faq('Temyiz ile farkı?', 'İstinaf BAM; temyiz Yargıtay — şartlar farklıdır.'),
    ]
  ),
};

/** Wave1 + wave2 birleşik */
export function getPillarBody(slug) {
  return WAVE2[slug] || WAVE1[slug] || null;
}

export { WAVE1 as PILLAR_BODIES_WAVE1, WAVE2 as PILLAR_BODIES_WAVE2 };
