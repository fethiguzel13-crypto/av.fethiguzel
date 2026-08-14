import type { VatandasArticle, VatandasFaq } from './types';
import { getGuide } from './guides/load';

function guideFor(article: VatandasArticle) {
  return getGuide(article);
}

/** Kategoriye özgü, şablon olmayan adımlar — jenerik «olguları derleyin» yerine. */
const CAT_STEPS: Record<string, string[]> = {
  Aile: [
    'Nüfus, gelir ve çocuk belgelerini bir araya getirin.',
    'Anlaşmalı mı çekişmeli mi olduğuna karar verin; protokol taslağını yazın.',
    'Görevli aile mahkemesinde dava veya 6284 başvurusu yapın.',
    'Tebliğ ve tedbir/nafaka ara kararlarını takip edin.',
    'Kesinleşen kararı icra veya nüfus işlemleri için kullanın.',
  ],
  İş: [
    'Fesih belgesi, bordro ve SGK hizmet dökümünü alın.',
    'Kıdem, ihbar, fazla mesai ve izin kalemlerini listeleyin.',
    'Dava şartıysa arabuluculuğa gidin; tutanağı saklayın.',
    'Anlaşmazlıkta iş mahkemesinde dava açın.',
    'İlam sonrası ödeme veya icrayı belgelendirin.',
  ],
  İcra: [
    'Ödeme emri, tebligat ve dosya numarasını kaydedin.',
    'e-Devlet / UYAP’tan dosyayı açın; borç ve faizi kontrol edin.',
    'Süresi içinde icra dairesine itiraz veya şikâyet yazın.',
    'Haciz varsa istihkak, ödeme veya menfi tespit seçeneklerini değerlendirin.',
    'Kapanış ve haciz fekkini yazılı teyit edin.',
  ],
  Kira: [
    'Sözleşme, dekont ve yazışmaları dosyalayın.',
    'Artış oranı veya tahliye sebebini netleştirin.',
    'Gerekirse noter ihtarı çekin; tebliğ alın.',
    'Kapsamdaysa arabuluculuğa gidin.',
    'Dava veya icra yolunu seçin; süreleri yazın.',
  ],
  Tüketici: [
    'Fatura, sipariş ve ayıp kanıtlarını toplayın.',
    'Satıcıya yazılı başvurun; süre verin.',
    'Sonuç alamazsanız hakem heyeti veya tüketici mahkemesini seçin.',
    'e-Devlet başvuru numarasını saklayın.',
    'Aleyhe kararda itiraz süresini hesaplayın.',
  ],
  Miras: [
    'Ölüm ve mirasçı listesini nüfustan doğrulayın.',
    'Veraset ilamı alın (e-Devlet, noter veya mahkeme).',
    'Borç ve malları listeleyin; red gerekip gerekmediğine bakın.',
    'Paylaşım veya izale-i şuyu yolunu seçin.',
    'Vergi ve tapu devrini tamamlayın.',
  ],
  Eşya: [
    'TAKBİS / e-Devlet’ten tapu ve şerhleri kontrol edin.',
    'Sözleşme, DASK ve kimlikleri hazırlayın.',
    'Tapu randevusu alın; harcı yatırın.',
    'Devir sonrası belediye ve emlak vergisi bildirimini yapın.',
    'Uyuşmazlıkta tedbir veya dava yolunu değerlendirin.',
  ],
  Ceza: [
    'Olayı ve delilleri tarih sırasıyla yazın.',
    'Suç duyurusunu savcılık veya e-şikâyet ile yapın.',
    'İfade veya gözaltında müdafi hakkını kullanın.',
    'Soruşturma sonucunu takip edin.',
    'Uzlaştırma veya duruşma sürecini sıfatınıza göre yürütün.',
  ],
  Usul: [
    'Uyuşmazlığın türünü (hukuk, idare, icra, ceza) teşhis edin.',
    'Görevli mahkeme ve dava şartını kontrol edin.',
    'Dilekçe, delil ve harcı hazırlayın.',
    'Tebligatları UYAP / e-tebligattan izleyin.',
    'Karar sonrası istinaf veya temyiz süresini hesaplayın.',
  ],
  İdare: [
    'İdari işlemi ve öğrenme/tebliğ tarihini yazın.',
    'Üst başvuru gerekip gerekmediğine bakın.',
    'İptal ve/veya tam yargı talebini netleştirin.',
    'İdare mahkemesinde dava açın; şart varsa YD isteyin.',
    'Karar ve kanun yollarını takip edin.',
  ],
  Trafik: [
    'Cezayı veya kaza tutanağını e-Devlet / sigortadan doğrulayın.',
    'İtiraz mercini ve süreyi tespit edin.',
    'Hasarda ihbar ve eksper sürecini başlatın.',
    'Red halinde tahkim veya dava seçeneklerine bakın.',
    'Ceza puanı ve ehliyet durumunu izleyin.',
  ],
  Vergi: [
    'GİB / e-Devlet’ten borç ve tebliğleri kontrol edin.',
    'Ödeme, indirim ve yapılandırma seçeneklerini karşılaştırın.',
    'Yazılı başvuru veya ödeme planı oluşturun.',
    'İhtilafta uzlaşma veya vergi davası yolunu seçin.',
    'Dekont ve kapanış yazısını saklayın.',
  ],
  'Sosyal Güvenlik': [
    'e-Devlet’ten hizmet ve prim dökümünü alın.',
    'Hak türünü (emeklilik, işsizlik, maluliyet, borçlanma) netleştirin.',
    'Belgeleri tamamlayıp başvurun.',
    'Ret halinde itiraz veya dava süresini yazın.',
    'Ödeme veya aylık hesabını kontrol edin.',
  ],
  Nüfus: [
    'e-Devlet’ten işlemi seçin veya randevu alın.',
    'Kimlik ve istenen ek belgeleri hazırlayın.',
    'Başvuruyu tamamlayın; numarayı saklayın.',
    'Sonucu takip edin.',
  ],
  'Engelli Hakları': [
    'Sağlık kurulu raporunu alın veya güncelleyin.',
    'Hak türünü (araç, vergi, aylık) seçin.',
    'İlgili kuruma başvurun.',
    'Ret halinde idari veya yargı yoluna bakın.',
  ],
};

const CAT_DOCS: Record<string, string[]> = {
  Aile: ['nüfus kayıt örneği', 'gelir belgesi', 'protokol', 'çocuk belgesi'],
  İş: ['iş sözleşmesi', 'bordro', 'SGK hizmet dökümü', 'fesih bildirimi', 'arabuluculuk tutanağı'],
  İcra: ['ödeme emri', 'tebligat mazbatası', 'takip talebi', 'dekont'],
  Kira: ['kira sözleşmesi', 'ödeme dekontları', 'ihtarname', 'tahliye taahhüdü'],
  Tüketici: ['fatura / sipariş', 'garanti', 'yazışma', 'kargo fişi'],
  Miras: ['ölüm belgesi', 'nüfus kayıt', 'veraset ilamı', 'tapu'],
  Eşya: ['tapu kaydı', 'kimlik', 'DASK', 'ödeme makbuzu'],
  Ceza: ['şikâyet dilekçesi', 'delil listesi', 'tıbbi rapor'],
  Usul: ['dilekçe', 'delil listesi', 'harç makbuzu', 'tebligat'],
  İdare: ['idari işlem yazısı', 'tebliğ', 'başvuru cevabı'],
  Trafik: ['ceza tebliği', 'kaza tutanağı', 'poliçe', 'ehliyet / ruhsat'],
  Vergi: ['tahakkuk', 'beyanname', 'ödeme dekontu'],
  'Sosyal Güvenlik': ['hizmet dökümü', 'prim bordrosu', 'sağlık raporu'],
  Nüfus: ['kimlik', 'randevu belgesi'],
  'Engelli Hakları': ['engelli sağlık kurulu raporu', 'kimlik'],
};

function foldTr(s: string): string {
  return s.replace(/İ/g, 'i').replace(/I/g, 'i').toLowerCase();
}

/** Sayfada asla görünmeyecek atölye / SEO iç konuşması. */
export function isWorkshopSpeak(s: string): boolean {
  if (!s) return false;
  const t = foldTr(s);
  return /slug|niyet ipucu|niyet ipuç|yamyam|pillar|spoke|hub[–-]spoke|canonical|anahtarlar[ıi] bilerek|arama motoru|arama niyeti|\bseo\b|kümenin merkezi|yan niyet|dar tutulmu[şs]|url tek niyet|spoke sayfa|kapsamını sınırlar|bilerek dar|aynı genel anahtar|hem pillar hem|diye arayan|dar niyet|dilime özel|geri link verir|ranking sinyali|kral url/.test(
    t
  );
}

const SKIP_HEADING =
  /arama niyeti|yasal dayanak|kanun maddesi,\s*şerh|pratik karşılaştırma|örnek zaman çizelgesi|iç linkler|ne zaman bu sayfa|karşılaştırmalı not|somut kontrol listesi|canonical|tam metin ve şerh|maddeyi nasıl okumalısınız|pratik uyarı|bu sayfanın odağı|slug|mini senaryo/;

const KEEP_HEADING =
  /kimler muhatap|şartlar nelerdir|süreç nasıl|belgeler|süreler|sık hata|tanım ve sınır|pratik usul|özet \(vatandaş|sık hata ve yanlış/i;

const SKIP_FAQ =
  /bağlayıcı m[ıi]|gerçek dosya mıdır|tablo ve checklist|tek cümlelik formül|neden ayrı sayfa|avukat tutmak zorunlu|ana rehberi okumadan|bu rehber bağlayıcı|bu metin bağlayıcı|sonuç garanti|e-Devlet veya UYAP yeterli/i;

const GENERIC_STEP =
  /konuya özgü olgular[ıi]|sorunuzun gerçekten|yasal dayanak, görevli merci|dar işlem adımını yazılı|doğru mercie yazılı başvuru, dava veya takip/i;

export type ReadableSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

const SKIP_PARAGRAPH =
  /seo yamyam|yamyamlık|arama motorlarında|kısa özet budur|hub[–-]spoke|canonical|aşağıdaki sıra şematiktir|forum ≠|bu rehber bağlayıcı değildir|genel bilgilendirme amaçlıdır ve somut|anahtar kelimelerle doldurmak|tipik merciler ve muhataplar|ile ilgili tebliğ, öğrenme, fesih|hak düşürücü süre ile zamanaşımı|slug ve niyet|anahtarları bilerek dar|forum ve sosyal medya|açılmasa da tebliğ sayılma|şartlar; süre, şekil, belgeler|sadece .+ önemli, gerisi sonra|niyet ipuçları|kapsamını sınırlar|aynı genel anahtar|pillar hem spoke|Tam süreç: \//i;

const SLUG_NOTES: Record<string, ReadableSection[]> = {
  'kidem-tazminati-nasil-alinir': [
    {
      heading: 'Şartlar',
      paragraphs: [
        'İş Kanunu’na tabi en az bir yıllık çalışma ve kıdeme hak kazandıran bir ayrılış gerekir. İşveren feshi, emeklilik, askerlik ve evlilik nedeniyle (kadın işçi, bir yıl içinde) fesih kıdem doğurabilir; istifa kural olarak doğurmaz.',
      ],
    },
    {
      heading: 'Süre',
      paragraphs: [
        'İşçilik alacaklarında zamanaşımı kural olarak beş yıldır. İşe iade ayrı ve daha kısadır. Birçok işçilik alacağında arabuluculuk dava şartıdır.',
      ],
    },
  ],
  'bosanma-davasi-nasil-acilir': [
    {
      heading: 'İki yol',
      paragraphs: [
        'Anlaşmalı boşanmada protokol ve duruşmada irade şarttır. Çekişmelide kusur, delil, tedbir nafakası ve velayet yargılamayı uzatır. Mal rejimi tasfiyesi çoğu kez ayrı dosyadır.',
      ],
    },
  ],
  'nafaka-davasi-nedir': [
    {
      heading: 'Türler',
      paragraphs: [
        'Tedbir nafakası yargılama sürerken, yoksulluk nafakası eş için, iştirak nafakası çocuk içindir. Miktar tarafların geliri ve çocuğun ihtiyacına göre değişir; tek tarife yoktur.',
      ],
    },
  ],
  'icra-takibi-nedir': [
    {
      heading: 'İki tür takip',
      paragraphs: [
        'İlamlı takip mahkeme kararına dayanır. İlamsız takip senet, fatura veya sözleşmeye dayanır; borçluya ödeme emri gider. İtiraz ilamsız takibi durdurur.',
      ],
    },
  ],
  'odeme-emrine-itiraz': [
    {
      heading: 'Süre',
      paragraphs: [
        'Süre kural olarak tebliğden itibaren yedi gündür. e-Tebligatta süre, tebligatın sisteme düşmesiyle işlemeye başlayabilir. Usulsüz tebligatta öğrenme tarihi ayrıca ispat edilir.',
      ],
    },
  ],
  'kira-artis-orani-nasil-hesaplanir': [
    {
      heading: 'Tavan',
      paragraphs: [
        'Konut kiralarında yasal tavan, sözleşmedeki orandan düşüksen tavan uygulanır. Dönemsel sınırlar kanunla değişebilir; artış öncesi güncel metne bakın.',
      ],
    },
  ],
  'kiraci-nasil-tahliye-edilir': [
    {
      heading: 'Sebepler ayrıdır',
      paragraphs: [
        'Tahliye taahhüdü, ihtiyaç, iki haklı ihtar ve kira temerrüdü ayrı usullere tabidir. Sebebi karıştırmak davayı düşürür. Fiilî çıkarma karar olmadan yapılmaz.',
      ],
    },
  ],
  'veraset-ilami-nasil-alinir': [
    {
      heading: 'Üç yol',
      paragraphs: [
        'e-Devlet belgesi çıkarsa çoğu işlem için yeter. Çıkmazsa noter veya sulh hukuk kullanılır. Mirasın reddi için ayrı ve kısa bir süre vardır.',
      ],
    },
  ],
  'trafik-cezasina-itiraz': [
    {
      heading: 'Süre',
      paragraphs: [
        'İdari para cezasına itiraz kural olarak tebliğden itibaren on beş gündür. Erken ödeme indirimi ayrı bir takvimdir; itiraz ederken indirimi kaçırmamak gerekir.',
      ],
    },
  ],
  'tuketici-hakem-heyeti': [
    {
      heading: 'Parasal sınır',
      paragraphs: [
        'Hakem heyeti her yıl güncellenen tutara kadar bakır. Üstünde tüketici mahkemesi yoluna gidilir. Önce satıcıya yazılı başvuru ispatı işe yarar.',
      ],
    },
  ],
  'arabuluculuk-nasil-yapilir': [
    {
      heading: 'Dava şartı',
      paragraphs: [
        'İş, ticaret, tüketici ve birçok kira uyuşmazlığında arabuluculuk dava şartıdır. Tutanağı olmayan dava usulden reddedilebilir. Anlaşma belgesi ilam gibi icraya konabilir.',
      ],
    },
  ],
  'tapu-devri-nasil-yapilir': [
    {
      heading: 'Resmî şekil',
      paragraphs: [
        'Taşınmaz satışı tapuda resmî senetle olur. Noterde satış vaadi başka bir işlemdir; tek başına mülkiyeti geçirmez. Şerh ve haciz kontrolü randevudan önce yapılmalıdır.',
      ],
    },
  ],
  'emlak-vergisi-nedir': [
    {
      heading: 'Kim öder?',
      paragraphs: [
        'Yükümlü, yılın başında tapuda malik görünen kişidir. Konut, işyeri ve arsa oranları ayrıdır. Büyükşehir ve diğer belediyelerde oran farkı olabilir. Muafiyet şartı belgeye bağlıdır.',
      ],
    },
    {
      heading: 'Ne zaman?',
      paragraphs: [
        'Yıllık vergi kural olarak iki taksittir (ilki genelde mayıs, ikincisi kasım). Geç ödeme gecikme zammı doğurur. Satışta borç tapu işlemini durdurabilir.',
      ],
    },
  ],
  'hukuk-davasi-nasil-acilir': [
    {
      heading: 'Önce görev ve şart',
      paragraphs: [
        'Yanlış mahkeme zaman kaybettirir. Arabuluculuk dava şartıysa tutanak olmadan açılan dava reddolunur. Harç ve tebligat avansı eksikse süre işlemeyebilir.',
      ],
    },
  ],
  'koruma-karari-6284': [
    {
      heading: 'Acil hâl',
      paragraphs: [
        'Tehlike varsa önce kolluk veya 183 hattı. 6284 tedbiri aile mahkemesi veya mülki amirden istenir; boşanma davası beklemez. İhlal ayrıca suç oluşturabilir.',
      ],
    },
  ],
  'issizlik-maasi-sartlari': [
    {
      heading: 'Şartlar',
      paragraphs: [
        'İşsizlik ödeneği her fesihten doğmaz. Prim günü, son 120 gün ve fesih türü birlikte aranır. Başvuru süresi kaçarsa hak düşer.',
      ],
    },
  ],
};

/** Öne çıkan rehberlerde şablon adım/belge yerine somut iskelet. */
const SLUG_GUIDES: Record<string, { steps: string[]; docs?: string[] }> = {
  'kidem-tazminati-nasil-alinir': {
    steps: [
      'Fesih bildirimi, bordro ve SGK hizmet dökümünü alın.',
      'En az 1 yıl ve kıdeme hak kazandıran ayrılış sebebini kontrol edin.',
      'Giydirilmiş ücret ve tavanı hesaplayın; ibranameyi kalem kalem okuyun.',
      'Ödenmezse arabuluculuğa gidin (işçilik alacağında dava şartı).',
      'Anlaşma olmazsa iş mahkemesinde talep edin.',
    ],
    docs: ['fesih bildirimi', 'bordro', 'SGK hizmet dökümü', 'iş sözleşmesi', 'arabuluculuk tutanağı'],
  },
  'bosanma-davasi-nasil-acilir': {
    steps: [
      'Anlaşmalı mı çekişmeli mi olduğuna karar verin.',
      'Anlaşmalıda nafaka, velayet, mal ve ziynet protokolünü yazın.',
      'Nüfus kayıt ve evlilik belgesiyle aile mahkemesinde dava açın.',
      'Duruşmada iradeyi bizzat açıklayın (anlaşmalı boşanma).',
      'Kesinleşen kararı nüfus ve icra işlemleri için kullanın.',
    ],
    docs: ['nüfus kayıt örneği', 'evlilik cüzdanı / kayıt', 'protokol', 'gelir belgesi'],
  },
  'nafaka-davasi-nedir': {
    steps: [
      'Nafaka türünü ayırın: tedbir, yoksulluk veya iştirak.',
      'Gelir, gider ve çocuk ihtiyaç belgelerini toplayın.',
      'Boşanma davası varsa talebi orada ileri sürün; yoksa ayrı dava açın.',
      'Kararı izleyin; ödenmezse icraya koyun.',
      'Durum değişirse artırım veya indirme davası açın.',
    ],
    docs: ['gelir belgesi', 'nüfus kayıt', 'gider fişleri', 'mahkeme kararı (varsa)'],
  },
  'icra-takibi-nedir': {
    steps: [
      'Alacağın dayanağını (ilam, senet, fatura) tespit edin.',
      'Yetkili icra dairesinde takip talebi verin.',
      'Ödeme emrinin tebliğini izleyin.',
      'İtiraz gelirse itirazın iptali veya kaldırılmasını değerlendirin.',
      'İtiraz yoksa haciz ve satış aşamasına geçin.',
    ],
    docs: ['alacak belgesi', 'takip talebi', 'ödeme emri', 'tebligat mazbatası'],
  },
  'odeme-emrine-itiraz': {
    steps: [
      'Tebliğ tarihini yazın. Süre kural olarak 7 gündür.',
      'e-Devlet / UYAP’tan dosya numarasını ve borç kalemini kontrol edin.',
      'Süresi içinde icra dairesine itiraz edin (borca, imzaya veya fer’ilere).',
      'İtiraz takibi durdurur; alacaklı itirazın iptali veya kaldırılmasını isteyebilir.',
      'Usulsüz tebligat varsa öğrenme tarihini ayrıca sabitleyin.',
    ],
    docs: ['ödeme emri', 'tebligat mazbatası', 'senet / sözleşme', 'dekont'],
  },
  'kira-artis-orani-nasil-hesaplanir': {
    steps: [
      'Sözleşmedeki artış maddesini okuyun.',
      'Konut ise o dönemdeki yasal tavanı (TBK / geçici sınır) kontrol edin.',
      'TÜFE on iki aylık ortalamayı resmi kaynaktan alın.',
      'Yasal tavan ile sözleşme oranından düşük olanı uygulayın.',
      'Yazılı bildirim yapın; anlaşmazlıkta arabuluculuk / tespit davasına bakın.',
    ],
    docs: ['kira sözleşmesi', 'önceki dönem kira dekontu', 'TÜFE verisi', 'artış bildirimi'],
  },
  'kiraci-nasil-tahliye-edilir': {
    steps: [
      'Sebebi netleştirin: tahliye taahhüdü, ihtiyaç, iki haklı ihtar veya temerrüt.',
      'Gerekli ihtarı noterden çekin; tebliği saklayın.',
      'Kapsamdaysa arabuluculuğa gidin.',
      'Sulh hukukta tahliye davası veya icra tahliyesi yolunu seçin.',
      'Karar kesinleşmeden fiilî çıkarma yapmayın.',
    ],
    docs: ['kira sözleşmesi', 'ihtarname ve tebliğ', 'tahliye taahhüdü', 'ödeme dökümü'],
  },
  'veraset-ilami-nasil-alinir': {
    steps: [
      'Murisin ölümünü ve mirasçı listesini nüfustan doğrulayın.',
      'Önce e-Devlet mirasçılık belgesini deneyin.',
      'Çıkmazsa noter veya sulh hukuk mahkemesine gidin.',
      'Belgeyi tapu, banka ve vergi işlemlerinde kullanın.',
      'Mirasın reddi süresini ayrıca kontrol edin.',
    ],
    docs: ['ölüm belgesi', 'nüfus kayıt örneği', 'kimlik', 'veraset ilamı çıktısı'],
  },
  'trafik-cezasina-itiraz': {
    steps: [
      'Cezayı e-Devlet’ten doğrulayın; tebliğ tarihini yazın.',
      'İtiraz süresini (tebliğden itibaren, kural olarak 15 gün) hesaplayın.',
      'Görüntü, plaka veya usul hatasını belgeleyin.',
      'Sulh ceza hâkimliğine itiraz dilekçesi verin.',
      'Ödeme indirimini kaçırmamak için süreyi ayrıca not edin.',
    ],
    docs: ['ceza tebliği', 'e-Devlet çıktısı', 'görüntü / tutanak', 'kimlik'],
  },
  'tuketici-hakem-heyeti': {
    steps: [
      'Parasal sınırın hakem heyetine uyduğunu kontrol edin (yıllık güncellenir).',
      'Satıcıya yazılı başvurun; cevabı bekleyin.',
      'e-Devlet’ten tüketici hakem heyeti başvurusu yapın.',
      'Fatura, yazışma ve ayıp kanıtlarını ekleyin.',
      'Karara itiraz süresi varsa tüketici mahkemesini değerlendirin.',
    ],
    docs: ['fatura / sipariş', 'yazışma', 'ayıp fotoğrafı', 'başvuru numarası'],
  },
  'arabuluculuk-nasil-yapilir': {
    steps: [
      'Uyuşmazlığın dava şartı olup olmadığını kontrol edin (iş, ticaret, tüketici, kira vb.).',
      'Arabuluculuk bürosuna başvurun; karşı taraf tebliğ edilir.',
      'Toplantıya katılın veya mazereti belgelendirin.',
      'Anlaşırsanız belgeyi imzalayın; ilam gibi icraya konabilir.',
      'Anlaşamazsanız son tutanakla mahkemeye gidin.',
    ],
    docs: ['başvuru formu', 'tebligat', 'son tutanak / anlaşma belgesi'],
  },
  'tapu-devri-nasil-yapilir': {
    steps: [
      'TAKBİS’ten tapu, şerh ve hacizleri kontrol edin.',
      'DASK, kimlik ve varsa vekâleti hazırlayın.',
      'Tapu müdürlüğünden randevu alın.',
      'Harç ve döner sermayeyi yatırın; resmi senet imzalayın.',
      'Devir sonrası belediyeye emlak vergisi bildirimi yapın.',
    ],
    docs: ['kimlik', 'tapu kaydı', 'DASK', 'vergi numarası', 'vekâlet (varsa)'],
  },
  'emlak-vergisi-nedir': {
    steps: [
      'Taşınmazın belediyesini ve tapu bilgilerini doğrulayın.',
      'Vergi değeri ile konut / işyeri / arsa oranını kontrol edin.',
      'Muafiyet veya indirim (engelli, şehit yakını, küçük konut) şartına bakın.',
      'Birinci ve ikinci taksiti e-Devlet veya belediyeden ödeyin.',
      'Dekontu saklayın; satışta borç tapuyu kilitler.',
    ],
    docs: ['tapu', 'kimlik', 'belediye / e-Devlet tahakkuku', 'muafiyet belgesi (varsa)'],
  },
  'hukuk-davasi-nasil-acilir': {
    steps: [
      'Uyuşmazlık türünü ve görevli mahkemeyi tespit edin.',
      'Dava şartı varsa (arabuluculuk) önce onu bitirin.',
      'Dilekçe, delil listesi ve harcı hazırlayın.',
      'Yetkili mahkemede davayı açın; tebligatı izleyin.',
      'Cevap, ön inceleme ve tahkikat takvimini kaçırmayın.',
    ],
    docs: ['dilekçe', 'delil listesi', 'harç makbuzu', 'arabuluculuk tutanağı (gerekiyorsa)'],
  },
  'koruma-karari-6284': {
    steps: [
      'Güvenlik acilse 155 / 183 veya en yakın karakola gidin.',
      'Aile mahkemesinden veya mülki amirden 6284 tedbiri isteyin.',
      'Olay, tanık ve tıbbi rapor varsa ekleyin.',
      'Kararı tebliğ ettirin; ihlalde hemen bildirin.',
      'Boşanma / nafaka / ceza süreçlerini ayrıca yürütün.',
    ],
    docs: ['kimlik', 'olay anlatımı', 'tıbbi rapor (varsa)', 'karakol / savcılık tutanağı'],
  },
  'issizlik-maasi-sartlari': {
    steps: [
      'Fesih sebebini kontrol edin (haklı fesih / işveren feshi).',
      'Son 120 günde prim ve toplam prim gününü e-Devlet’ten bakın.',
      'İŞKUR / e-Devlet’ten işsizlik ödeneği başvurusunu süresinde yapın.',
      'İş arama yükümlülüğünü yerine getirin.',
      'Ret yazısında itiraz süresini not edin.',
    ],
    docs: ['SGK hizmet dökümü', 'fesih belgesi', 'İŞKUR başvuru çıktısı', 'kimlik'],
  },
};

export const FEATURED_SLUGS = [
  'kidem-tazminati-nasil-alinir',
  'bosanma-davasi-nasil-acilir',
  'nafaka-davasi-nedir',
  'icra-takibi-nedir',
  'odeme-emrine-itiraz',
  'kira-artis-orani-nasil-hesaplanir',
  'kiraci-nasil-tahliye-edilir',
  'veraset-ilami-nasil-alinir',
  'trafik-cezasina-itiraz',
  'tuketici-hakem-heyeti',
  'arabuluculuk-nasil-yapilir',
  'tapu-devri-nasil-yapilir',
  'emlak-vergisi-nedir',
  'hukuk-davasi-nasil-acilir',
  'koruma-karari-6284',
  'issizlik-maasi-sartlari',
] as const;

export const CATEGORY_BLURB: Record<string, string> = {
  Aile: 'Boşanma, nafaka, velayet, 6284 koruma.',
  İş: 'Kıdem, ihbar, işe iade, fazla mesai.',
  İcra: 'Ödeme emri, itiraz, haciz.',
  Kira: 'Artış, tahliye, depozito.',
  Tüketici: 'Hakem heyeti, ayıplı mal, cayma.',
  Miras: 'Veraset ilamı, pay, saklı pay, ret.',
  Eşya: 'Tapu, aidat, izale-i şuyu.',
  Usul: 'Dava, arabuluculuk, istinaf, temyiz.',
  İdare: 'İptal davası, kamulaştırma.',
  Trafik: 'Ceza itirazı, ehliyet, kaza.',
  Vergi: 'Emlak vergisi, yapılandırma.',
  'Sosyal Güvenlik': 'Emeklilik, işsizlik, SGK dökümü.',
  Ceza: 'Suç duyurusu, şikâyet.',
  Nüfus: 'Nüfus kayıt, kimlik işlemleri.',
  'Engelli Hakları': 'Rapor, ÖTV, araç.',
};

export type ReadableView = {
  answer: string;
  steps: string[];
  documents: string[];
  sections: ReadableSection[];
  faq: VatandasFaq[];
  showChecklist: boolean;
  checklist: string[];
  showTable: boolean;
};

function sentences(text: string, max = 3): string {
  const cleaned = text
    .replace(/\s+/g, ' ')
    .replace(/Kısa özet budur\.?/gi, '')
    .replace(/Aşağıda adımlar, belgeler ve riskler sırayla anlatılır\.?/gi, '')
    .replace(/Bu sayfa yalnızca[^.]+\./gi, '')
    .replace(/Tam süreç:\s*\/bilgi\/[^\s.]+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  const parts = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(
      (s) =>
        s.length > 12 &&
        !SKIP_PARAGRAPH.test(s) &&
        !SKIP_PARAGRAPH.test(foldTr(s)) &&
        !isWorkshopSpeak(s) &&
        !/…\s*$/.test(s)
    );
  return parts.slice(0, max).join(' ').trim();
}

function cleanText(s: string): string {
  return s
    .replace(/\/bilgi\/[a-z0-9-]+/gi, '')
    .replace(/\(\s*\/bilgi\/[^)]+\)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,;:])/g, '$1')
    .trim();
}

function isGenericStep(s: string): boolean {
  return GENERIC_STEP.test(s);
}

function cleanFaqQ(q: string): string {
  return q
    .replace(/^«[^»]+»\s*için\s*/i, '')
    .replace(/^«[^»]+»\s*/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function pickDocuments(article: VatandasArticle): string[] {
  const curated = guideFor(article)?.docs || SLUG_GUIDES[article.slug]?.docs;
  if (curated?.length) return curated;
  const fromCat = CAT_DOCS[article.category] || [];
  const fromSec = (article.sections || [])
    .filter((s) => /belge/i.test(s.heading))
    .flatMap((s) => s.bullets || [])
    .map((b) => b.replace(/^\d+\.\s*/, '').trim())
    .filter((b) => b.length > 2 && b.length < 60 && !/derleyin|toplayın|saklayın/i.test(b));
  const merged = [...fromSec, ...fromCat];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of merged) {
    const key = item.toLocaleLowerCase('tr-TR');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
    if (out.length >= 6) break;
  }
  return out;
}

function pickSteps(article: VatandasArticle): string[] {
  const curated = guideFor(article)?.steps || SLUG_GUIDES[article.slug]?.steps;
  if (curated?.length) return curated;
  const raw = (article.steps || []).map(cleanText).filter(Boolean);
  const usable = raw.filter((s) => !isGenericStep(s) && s.length < 180);
  if (usable.length >= 4) return usable.slice(0, 6);

  const surec = (article.sections || []).find((s) => /süreç nasıl/i.test(s.heading));
  const fromSec = (surec?.bullets || [])
    .map((b) => cleanText(b.replace(/^\d+\.\s*/, '')))
    .filter((s) => s && !isGenericStep(s) && s.length < 160);
  if (fromSec.length >= 4) return fromSec.slice(0, 6);

  const cat = CAT_STEPS[article.category];
  if (cat?.length) return cat;
  return usable.length ? usable.slice(0, 6) : (cat || raw.slice(0, 5));
}

function usefulParagraphs(paragraphs: string[], max = 2): string[] {
  const out: string[] = [];
  for (const p of paragraphs) {
    if (isWorkshopSpeak(p)) continue;
    const t = sentences(p, 2);
    if (!t || t.length < 40) continue;
    if (SKIP_PARAGRAPH.test(t) || isWorkshopSpeak(t)) continue;
    if (out.some((x) => x.slice(0, 80) === t.slice(0, 80))) continue;
    out.push(t);
    if (out.length >= max) break;
  }
  return out;
}

function cleanNotes(notes: ReadableSection[] | undefined): ReadableSection[] {
  if (!notes?.length) return [];
  return notes
    .filter((s) => !isWorkshopSpeak(s.heading) && !SKIP_HEADING.test(foldTr(s.heading)))
    .map((s) => ({
      ...s,
      paragraphs: (s.paragraphs || []).filter((p) => !isWorkshopSpeak(p) && !SKIP_PARAGRAPH.test(p)),
    }))
    .filter((s) => s.paragraphs.length);
}

function pickSections(article: VatandasArticle, answer: string): ReadableSection[] {
  const fromFile = cleanNotes(guideFor(article)?.notes);
  if (fromFile.length) return fromFile;
  const curated = cleanNotes(SLUG_NOTES[article.slug]);
  if (curated.length) return curated;
  const out: ReadableSection[] = [];
  for (const sec of article.sections || []) {
    if (SKIP_HEADING.test(foldTr(sec.heading)) || isWorkshopSpeak(sec.heading)) continue;
    if (!KEEP_HEADING.test(sec.heading) && out.length >= 3) continue;

    const paragraphs = usefulParagraphs(sec.paragraphs || [], 2).filter(
      (p) => p.slice(0, 60) !== answer.slice(0, 60)
    );
    const bullets = (sec.bullets || [])
      .map((b) => cleanText(b.replace(/^\d+\.\s*/, '')))
      .filter((b) => b.length > 8 && b.length < 180 && !isGenericStep(b) && !SKIP_PARAGRAPH.test(b))
      .slice(0, 6);

    if (!paragraphs.length && !bullets.length) continue;

    const heading = sec.heading
      .replace(/: hukuki çerçeve.*$/i, '')
      .replace(/^[^:]+:\s*(tanım ve sınır|pratik usul.*)$/i, (_, rest) => {
        if (/tanım/i.test(rest)) return 'Ne anlama gelir?';
        return 'Nasıl yapılır?';
      })
      .replace(/^Bu sayfanın odağı:\s*/i, '')
      .replace(/^Kimler muhataptır\? Şartlar nelerdir\?$/i, 'Kimleri ilgilendirir?')
      .replace(/^Süreç nasıl işler\?$/i, 'Süreç')
      .replace(/^Belgeler, ispat ve delil seti$/i, 'Hangi belgeler gerekir?')
      .replace(/^Süreler, tebliğ ve hak düşürücü risk$/i, 'Süreler')
      .replace(/^Sık hatalar, riskler ve yanlış bilinenler$/i, 'Sık yapılan hatalar')
      .replace(/^Sık hata ve yanlış bilinenler$/i, 'Sık yapılan hatalar')
      .replace(/^Özet \(vatandaş dili\)$/i, 'Kısaca');

    out.push({ heading, paragraphs, bullets: bullets.length ? bullets : undefined });
    const cap = article.role === 'spoke' ? 2 : 3;
    if (out.length >= cap) break;
  }
  return out;
}

function pickFaq(article: VatandasArticle): VatandasFaq[] {
  const out: VatandasFaq[] = [];
  for (const f of article.faq || []) {
    if (SKIP_FAQ.test(f.q) || SKIP_FAQ.test(f.a) || isWorkshopSpeak(f.q) || isWorkshopSpeak(f.a))
      continue;
    const q = cleanFaqQ(f.q);
    const a = sentences(f.a, 2);
    if (!q || !a || a.length < 40 || q.length < 22) continue;
    if (/^(en kritik|hangi mevzuat)/i.test(q)) continue;
    if (/bu sayfa yeterli midir|e-Devlet veya UYAP yeterli/i.test(q)) continue;
    out.push({ q, a });
    if (out.length >= 4) break;
  }
  return out;
}

function checklistUsable(article: VatandasArticle): string[] {
  const items = (article.checklist || []).map(cleanText).filter(Boolean);
  const templated = items.filter((i) =>
    /için tebliğ\/öğrenme|doğru mercie karar verdim|dava şartı \(arabuluculuk|yazılı başvuruyu yaptım|sonuç ve kanun yolu/i.test(
      i
    )
  );
  if (templated.length >= 2) return [];
  return items.filter((i) => i.length < 140).slice(0, 8);
}

export function toReadableView(article: VatandasArticle): ReadableView {
  const firstUseful =
    (article.sections || [])
      .flatMap((s) => s.paragraphs || [])
      .find((p) => p.length > 80 && !isWorkshopSpeak(p) && !SKIP_PARAGRAPH.test(p)) || '';
  const fromLead = isWorkshopSpeak(article.lead || '') ? '' : sentences(article.lead || '', 3);
  const fromFirst = sentences(firstUseful, 3);
  const answer =
    fromFirst.length > fromLead.length + 20 ? fromFirst : fromLead || fromFirst;
  const steps = pickSteps(article);
  const documents = pickDocuments(article);
  const sections = pickSections(article, answer).filter((s) => {
    if (/^Süreç$/i.test(s.heading) && steps.length) return false;
    if (/belge/i.test(s.heading) && documents.length) return false;
    return true;
  });
  const checklist = checklistUsable(article);
  const tableIsTemplate = /hızlı kontrol tablosu/i.test(article.table?.caption || '');

  const safeAnswer = isWorkshopSpeak(answer) ? '' : answer;
  const safeSteps = steps.filter((s) => !isWorkshopSpeak(s));
  const safeFaq = pickFaq(article).filter((f) => !isWorkshopSpeak(f.q) && !isWorkshopSpeak(f.a));
  const safeSections = cleanNotes(sections);

  return {
    answer: safeAnswer,
    steps: safeSteps,
    documents,
    sections: safeSections,
    faq: safeFaq,
    showChecklist: checklist.length >= 4 && !checklist.some(isWorkshopSpeak),
    checklist: checklist.filter((c) => !isWorkshopSpeak(c)),
    showTable: Boolean(article.table && !tableIsTemplate),
  };
}

export function firstSentence(text: string): string {
  return sentences(text, 1);
}
