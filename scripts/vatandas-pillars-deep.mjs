/**
 * Pillar sayfalar için derin, niyet odaklı gövde.
 * Yargıtay dosya numarası uydurulmaz; genel ilke + kanun çerçevesi.
 */

function s(heading, paragraphs, bullets) {
  return { heading, paragraphs, bullets };
}
function faq(q, a) {
  return { q, a };
}
function pack(lead, sections, steps, faqList) {
  return { lead, sections, steps, faq: faqList };
}

/** @type {Record<string, ReturnType<typeof pack>>} */
export const PILLAR_BODIES = {
  'kidem-tazminati-nasil-alinir': pack(
    'Kıdem tazminatı, 4857 sayılı İş Kanunu çerçevesinde kanunda sayılan koşullarda ve belirli fesih/ayrılış hallerinde gündeme gelen bir işçilik alacağıdır. Her istifa veya her işten çıkarma otomatik hak doğurmaz. Bu rehber hak kazanma, belgeler, arabuluculuk ve dava yolunu ana hatlarıyla anlatır; kabaca tutar hesabı ve tavan için ayrı sayfalar ile hesaplama aracı kullanılır.',
    [
      s('Hak kazanma: kim, hangi halde?', [
        'Kıdem tazminatı için kural olarak en az bir yıllık kıdem ve kanunda öngörülen sona erme hallerinden birinin gerçekleşmesi aranır. İşveren tarafından yapılan ve haklı nedenle derhal fesih sayılmayan feshiler, işçinin haklı feshi, muvazzaf askerlik, emeklilik, kadın işçinin evlilik sonrası yasal süre içinde ayrılması gibi haller uygulamada sık tartışılır.',
        'Belirsiz süreli iş sözleşmesi asıl modeldir; belirli süreli sözleşmede de somut sona erme biçimine göre değerlendirme gerekir. Toplu iş sözleşmesi ve işyeri uygulaması ek hak tanıyabilir; tavan ve vergi/damga kuralları dönemseldir.',
      ], [
        '1 yıl kıdem eşiği (kural)',
        'Fesih türü belirleyicidir',
        'İstifa ≠ otomatik kıdem',
        'Tavan dönemseldir',
      ]),
      s('Belgeler ve ispat', [
        'SGK hizmet dökümü, bordrolar, iş sözleşmesi, fesih bildirimi, ihtar ve yazışmalar temel delil setidir. Giydirilmiş ücrete girecek düzenli ek ödemeler bordrodan okunur; düzensiz primler somut olaya göre tartışılır.',
        'İbraname imzalamadan önce kalem kalem tutar ve feragat metni okunmalıdır. İbra, TBK ve iş hukuku ölçütlerine göre geçerlilik denetimine tabidir; baskı ve gerçek ödeme olmaksızın imza risklidir.',
      ]),
      s('Arabuluculuk ve dava', [
        'Birçok işçilik alacağında arabuluculuk dava şartıdır. Başvuru, arabulucu tutanağı (anlaşma veya anlaşamama) ve süreler atlanmamalıdır. Anlaşma belgesi ilam niteliği taşıyabilir; icra yolu açılabilir.',
        'Anlaşmazlıkta iş mahkemesinde dava açılır. Belirsiz alacak / kısmi dava tercihleri, faiz başlangıcı ve zamanaşımı (işçilik alacaklarında kural olarak 5 yıl — somut kaleme bakın) stratejik önemdedir.',
      ]),
      s('Hesap, tavan ve yan sayfalar', [
        'Kabaca formül: giydirilmiş brüt ücret × çalışılan yıl (+ artan süre oranı). Dönemsel kıdem tavanı hesabı sınırlar. Detaylı formül ve örnek senaryo için «kıdem tazminatı hesaplama» sayfasına; yalnızca tavan için «kıdem tavanı» sayfasına bakın.',
        'Portal hesaplama aracı bilgilendirme amaçlıdır: https://www.avfethiguzel.com/hesaplama/kidem — bordro, TİS ve yargı uygulaması somut tutarı değiştirir. Uzun rehber: /rehber/kidem-tazminati',
      ]),
      s('Sık riskler', [
        'Arabuluculuğu atlamak, tebliğ tarihini ispatlayamamak, ibranameyi okumadan imzalamak ve zamanaşımını kaçırmak en sık hak kaybı sebepleridir. Fesih gerekçesinin “haklı fesih” diye yazılması, yargılamada ayrıca denetlenir.',
      ]),
    ],
    [
      'Fesih/ayrılış belgesi, bordro ve SGK dökümünü toplayın.',
      'Hak kazanma halini (fesih türü) netleştirin; şüphede avukata danışın.',
      'Kabaca tutarı hesaplayın; tavanı kontrol edin.',
      'Arabuluculuğa başvurun; tutanağı saklayın.',
      'Anlaşmazlıkta iş mahkemesinde dava / icra yolunu değerlendirin.',
    ],
    [
      faq('İstifa edince kıdem alınır mı?', 'Kural olarak hayır; kanunda sayılan haklı fesih veya özel haller yoksa istifa kıdem doğurmayabilir. Somut gerekçe ve ispat şarttır.'),
      faq('Kıdem ile ihbar aynı şey midir?', 'Hayır. İhbar bildirim sürelerine; kıdem yasal şartlara bağlı ayrı kalemlerdir. İhbar için /bilgi/ihbar-tazminati-nedir'),
      faq('Arabuluculuk zorunlu mu?', 'Birçok işçilik alacağında evet; tutanak olmadan dava usulden risklidir.'),
      faq('Ne kadar süre içinde istenmeli?', 'İşçilik alacaklarında zamanaşımı kural olarak 5 yıldır; başlangıç ve kesilme somut olaya göre değişir. Geç kalmayın.'),
      faq('Hesaplama aracı bağlayıcı mı?', 'Hayır. Kabaca fikir verir; kesin tutar dosyaya göredir.'),
    ]
  ),

  'ise-iade-davasi': pack(
    'İşe iade, iş güvencesi kapsamındaki işçinin geçersiz feshine karşı başvurduğu yasal yoldur. İşyeri işçi sayısı, kıdem, süre, geçerli neden ve arabuluculuk şartları bir arada aranır. Bu sayfa dava iskeletini anlatır; boşta geçen süre ve işe başlatmama tazminatı yan sayfalarda derinleşir.',
    [
      s('Kapsam ve şartlar', [
        'İş güvencesi: kanundaki işçi sayısı eşiği, belirsiz süreli sözleşme ve asgari kıdem gibi koşullar aranır. Kamu personeli ve bazı özel statüler ayrı rejimlere tabi olabilir.',
        'Fesih geçerli nedene dayanmalı ve usule uygun bildirilmelidir. Geçerli fesih ile haklı fesih (m.25) karıştırılmamalıdır; sonuçları farklıdır.',
      ], ['İşçi sayısı eşiği', 'Kıdem şartı', 'Geçerli neden', 'Usulüne uygun bildirim']),
      s('Süre ve arabuluculuk', [
        'Fesih tebliğinden itibaren kısa yasal süreler işlemeye başlar. Arabuluculuk dava şartıdır; anlaşamama tutanağı olmadan dava açılamayabilir.',
        'Tebliğ tarihi ispatı kritiktir. e-Tebligat ve usulsüz tebligat hallerinde öğrenme/tebliğ anı ayrıca incelenir.',
      ]),
      s('Sonuçlar: iade, boşta geçen süre, başlatmama', [
        'Mahkeme feshin geçersizliğine karar verirse işveren işçiyi işe başlatmakla yükümlü olabilir. Başlatmama halinde kanundaki aralıkta (uygulamada 4–8 aylık ücret) tazminat takdir edilebilir.',
        'Boşta geçen süre ücreti ayrı bir kalemdir; detay için ilgili spoke sayfaya bakın. Kıdem/ihbar talepleri somut sonuca göre birleşebilir veya ayrışır.',
      ]),
      s('İç linkler', [
        'Tazminat miktarı: /bilgi/ise-iade-tazminati · Boşta geçen süre: /bilgi/bos-ta-gecen-sure · Arabuluculuk: /bilgi/isse-iade-arabuluculuk · Hesap aracı: /hesaplama/ise-iade',
      ]),
    ],
    [
      'Fesih bildirimini ve tebliğ tarihini sabitleyin.',
      'İş güvencesi şartlarını kontrol edin.',
      'Süresi içinde arabuluculuğa başvurun.',
      'Anlaşmazlıkta işe iade davası açın.',
      'Karar sonrası işe başlatma veya tazminatı takip edin.',
    ],
    [
      faq('Her işçi işe iade açabilir mi?', 'Hayır. İş güvencesi kapsamı ve süre şarttır.'),
      faq('Arabuluculuk atlanırsa ne olur?', 'Dava şartı eksikliği nedeniyle usulden ret riski yüksektir.'),
      faq('İşe başlatılmazsam ne olur?', 'Kanundaki çerçevede işe başlatmama tazminatı gündeme gelebilir; miktar mahkemeye kalır.'),
    ]
  ),

  'nafaka-davasi-nedir': pack(
    'Nafaka; tedbir, yoksulluk ve iştirak türleriyle aile mahkemesinde talep edilen, miktarı hâkimin takdirine bağlı bir alacaktır. Sabit yüzde veya garanti tutar yoktur. Bu sayfa türleri ve süreci anlatır; her tür ve artırım/icra için ayrı niyet sayfaları vardır.',
    [
      s('Nafaka türleri', [
        'Tedbir nafakası: boşanma davası sürerken geçici geçim. Yoksulluk nafakası: boşanma sonrası yoksulluğa düşecek eş lehine (kusur ve koşullar tartışılır). İştirak nafakası: çocuğun bakım ve eğitim giderlerine katılma.',
        'Türleri karıştırmak yanlış mercie veya yanlış talebe yol açar. Tedbir için /bilgi/tedbir-nafakasi-nedir · yoksulluk için /bilgi/yoksulluk-nafakasi-sartlari · iştirak için /bilgi/istirak-nafakasi-nedir',
      ], ['Tedbir', 'Yoksulluk', 'İştirak', 'Takdirî miktar']),
      s('Nasıl istenir?', [
        'Boşanma davasıyla birlikte veya ayrı dava/talep ile istenebilir. Gelir-gider, çocuk ihtiyaçları, barınma ve sağlık belgeleri delil setinin omurgasıdır.',
        'Miktar artırım veya indirim davaları değişen şartlara bağlanır: /bilgi/nafaka-artirim-davasi · /bilgi/nafaka-indirim-davasi · çocuk odaklı: /bilgi/cocuk-nafaka-artirim',
      ]),
      s('Ödenmezse', [
        'Nafaka ilamı icra edilebilir; tazyik hapsi özel rejimlere tabidir. Ayrıntı: /bilgi/nafaka-odenmezse · icra önceliği: /bilgi/nafaka-alacaklisi-oncelik',
      ]),
      s('Hesaplama', [
        'Portal nafaka aracı senaryo amaçlıdır: /hesaplama/nafaka — bağlayıcı değildir. Hâkim somut dosyada takdir kullanır.',
      ]),
    ],
    [
      'Nafaka türünü (tedbir/yoksulluk/iştirak) seçin.',
      'Gelir-gider ve çocuk belgelerini derleyin.',
      'Boşanma veya ayrı dava ile talep edin.',
      'Kararı icra edilebilir hale getirin.',
      'Değişen şartlarda artırım/indirme değerlendirin.',
    ],
    [
      faq('Nafaka ne kadardır?', 'Kanunda sabit tarife yoktur; hâkim takdir eder.'),
      faq('Çocuk nafakası ile yoksulluk aynı mıdır?', 'Hayır. İştirak çocuk; yoksulluk eş içindir.'),
      faq('Ödenmezse hapis olur mu?', 'Tazyik hapsi koşulları özeldir; icra dosyası üzerinden işler. /bilgi/nafaka-odenmezse'),
    ]
  ),

  'kira-artis-orani-nasil-hesaplanir': pack(
    'Konut ve işyeri kira artışında sözleşme maddesi ile yasal sınırlar birlikte okunur. Konutta dönemsel yasal tavanlar (TÜFE bağlantılı uygulamalar dâhil) değişebilir; işyerinde serbesti ve kira tespit davası daha sık öne çıkar. Bu sayfa artış hesabının ana rehberidir; tahliye, depozito ve tespit ayrı niyet sayfalarındadır.',
    [
      s('Konut kira artışı', [
        'Sözleşmede yazılı oran, yasal üst sınırın üzerindeyse yasal sınırın uygulanması gündeme gelebilir. Dönemsel düzenlemeler Resmî Gazete ve TBK uygulamasına göre değişir; güncel tavan için yasal metin kontrol edilmelidir.',
        'Kabaca hesap ve senaryo: /hesaplama/kira · yasal tavan odaklı: /bilgi/konut-kirasi-artis-siniri',
      ], ['Sözleşme + yasal sınır', 'TÜFE referansı (dönemsel)', 'Yazılı bildirim']),
      s('İşyeri kira artışı', [
        'Ticari kirada tarafların anlaşması ve rayiç daha belirleyicidir. Anlaşmazlıkta kira tespit davası ve arabuluculuk devreye girebilir: /bilgi/isyeri-kirasi-artis · /bilgi/kira-tespit-davasi',
      ]),
      s('Uyuşmazlık yolu', [
        'Artış anlaşmazlığında önce yazılı yazışma, sonra (kapsamdaysa) arabuluculuk, ardından tespit veya alacak davası düşünülür. Tahliye bu sayfanın konusu değildir: /bilgi/kiraci-nasil-tahliye-edilir',
      ]),
      s('Sık hatalar', [
        'Eski yasal tavanı kullanmak, elden ödemeyi belgelendirmemek ve “her yıl %X kesin” sanmak sık görülen hatalardır.',
      ]),
    ],
    [
      'Sözleşme artış maddesini okuyun.',
      'Güncel yasal sınırı doğrulayın.',
      'TÜFE/hesap aracından kabaca bakın.',
      'Yazılı bildirim yapın; dekontları saklayın.',
      'Anlaşmazlıkta arabuluculuk/tespit yolunu değerlendirin.',
    ],
    [
      faq('Her yıl zam serbest midir?', 'Konutta yasal sınır dönemsel olarak devreye girebilir; işyerinde rejim farklıdır.'),
      faq('Tespit ile artış aynı şey midir?', 'Hayır. Artış yıllık; tespit çoğu kez uzun dönem/rayiç içindir.'),
      faq('Hesap aracı kesin midir?', 'Hayır; bilgilendirme amaçlıdır.'),
    ]
  ),

  'kiraci-nasil-tahliye-edilir': pack(
    'Konut ve işyeri kiracısının tahliyesi, TBK’da sayılan sebeplere ve usule bağlıdır. “İstediğim zaman çıkarırım” yaklaşımı hukuka aykırıdır. Bu sayfa tahliye yollarının ana haritasıdır; taahhütname, ihtiyaç, sebep listesi ve işyeri için ayrı sayfalar vardır.',
    [
      s('Başlıca tahliye sebepleri', [
        'Tahliye taahhüdü, gereksinim (ihtiyaç), yeniden inşa/imar, iki haklı ihtar, kira bedelinde temerrüt ve bazı süre sonu halleri uygulamada sık kullanılır. Her sebebin ispat ve süre koşulları farklıdır.',
        'Liste özeti: /bilgi/konut-kirasi-tahliye-sebepleri · taahhüt: /bilgi/tahliye-taahhutnamesi · ihtiyaç: /bilgi/ihtiyac-nedeniyle-tahliye · işyeri: /bilgi/isyeri-kirasi-tahliye',
      ]),
      s('Usul: ihtar, arabuluculuk, dava, icra', [
        'Temerrütte ihtar ve süre; taahhütte icra yolu; ihtiyaçta dava ve ispat tipik akıştır. Birçok kira uyuşmazlığında arabuluculuk dava şartı olabilir: /bilgi/kira-uyusmazligi-arabuluculuk',
        'Tahliye kararı veya taahhüt icra ile fiilen sonuçlanır. Çocuk ve aile konutu gibi özel durumlar ek inceleme ister.',
      ]),
      s('Kiraya veren için riskler', [
        'Haksız tahliye, yeniden kiralama yasağı ihlali ve usulsüz tebligat tazminat ve ceza riski doğurabilir: /bilgi/yeniden-kiralama-yasagi',
      ]),
      s('Kiracı tarafı', [
        'Geçerli sebebin yokluğu, usulsüz bildirim ve depozito uyuşmazlıkları savunma konusu olabilir. Depozito: /bilgi/kira-teminati-iadesi · artış: /bilgi/kira-artis-orani-nasil-hesaplanir',
      ]),
    ],
    [
      'Tahliye sebebini yasal dayanakla seçin.',
      'Sözleşme, ödemeler ve yazışmaları dosyalayın.',
      'Gerekiyorsa noter ihtarı / taahhüt icrası planlayın.',
      'Arabuluculuk kapsamını kontrol edin.',
      'Dava veya icra ile sonucu takip edin.',
    ],
    [
      faq('Taahhütname her zaman geçerli midir?', 'Tarih, imza ve düzenleme anı tartışılır; geçersizlik iddiası sık görülür.'),
      faq('İhtiyaç tahliyesinde ispat?', 'Gerçek, samimi ve zorunlu ihtiyaç ispatı aranır; göstermelik ihtiyaç risklidir.'),
      faq('Kira artışı ile tahliye aynı dava mıdır?', 'Hayır. Artış ve tahliye ayrı niyet ve çoğu kez ayrı usuldür.'),
    ]
  ),

  'icra-takibi-nedir': pack(
    'İcra takibi, alacağın 2004 sayılı İİK hükümleri uyarınca cebri icra yoluyla tahsilidir. İlamsız (ödeme emri) ve ilamlı (mahkeme/ilam) takip ayrımı temeldir. Bu sayfa genel haritadır; itiraz, haciz, inkâr tazminatı, senet ve iflas yan sayfalardadır.',
    [
      s('İlamsız ve ilamlı takip', [
        'İlamsız takipte alacaklı icra dairesinde takip başlatır; borçluya ödeme emri tebliğ edilir. Borçlu yasal sürede itiraz ederse takip (kural olarak) durur: /bilgi/odeme-emrine-itiraz',
        'İlamlı takipte elinde ilam veya ilam niteliğinde belge olan alacaklı daha farklı bir yoldan ilerler: /bilgi/ilamli-icra-nedir',
      ], ['Ödeme emri', '7 gün itiraz (kural)', 'Haciz', 'Satış']),
      s('Haciz ve sonrası', [
        'Takip kesinleşince maaş, banka, taşınır, tapu haczi gündeme gelebilir. Kaldırma, istihkak ve menfi tespit ayrı niyetlerdir: /bilgi/haciz-islemleri-nasil-yapilir · /bilgi/haciz-nasil-kaldirilir',
        'Cebri satış ve sıra cetveli: /bilgi/icra-satis-ihalesi · /bilgi/sira-cetveli',
      ]),
      s('Borçlu ve alacaklı seçenekleri', [
        'Borçlu: itiraz, şikâyet, menfi tespit, ödeme planı, taahhüt. Alacaklı: itirazın iptali/kaldırılması, haciz, satış. İnkâr tazminatı: /bilgi/icra-inkar-tazminati',
      ]),
      s('Sorgulama', [
        'UYAP ve e-Devlet: /bilgi/icra-dosyasi-sorgulama · /bilgi/e-devlet-icra',
      ]),
    ],
    [
      'Alacak dayanağını (sözleşme, senet, ilam) tespit edin.',
      'İlamlı mı ilamsız mı yoluna karar verin.',
      'Takip başlatın / ödeme emrini kontrol edin.',
      'İtiraz veya haciz aşamasını yönetin.',
      'Satış veya ödeme ile dosyayı sonuçlandırın.',
    ],
    [
      faq('Ödeme emrine itiraz ne kadar sürede?', 'Kural olarak tebliğden itibaren 7 gün; e-tebligat ve usulsüzlük halleri ayrıdır.'),
      faq('İtiraz takibi durdurur mu?', 'İlamsız takipte kural olarak evet; alacaklı iptal/kaldırma yoluna gidebilir.'),
      faq('Haciz kaçınılmaz mıdır?', 'Kesinleşmiş ve ödenmemiş takipte alacaklı haciz isteyebilir; istisna ve sıra kuralları vardır.'),
    ]
  ),

  'arabuluculuk-nasil-yapilir': pack(
    'Arabuluculuk, tarafların uyuşmazlığı üçüncü kişi arabulucu eşliğinde müzakere ettiği, bazı davalarda dava şartı olan bir çözümdür. Bu sayfa genel süreçtir; iş, ticari, tüketici, kira ve anlaşma belgesi icrası ayrı sayfalardadır.',
    [
      s('Ne zaman zorunlu?', [
        'İşçilik alacakları, işe iade, birçok ticari dava ve bazı tüketici/kira uyuşmazlıklarında arabuluculuk dava şartı olabilir. Kapsam dönemsel mevzuata göre değişir.',
        'İş: /bilgi/is-arabuluculuk-zorunlu · Ticari: /bilgi/ticari-arabuluculuk · Tüketici: /bilgi/tuketici-arabuluculuk · Kira: /bilgi/kira-uyusmazligi-arabuluculuk',
      ]),
      s('Süreç', [
        'Başvuru, arabulucu atama/seçimi, oturumlar, anlaşma veya anlaşamama tutanağı tipik akıştır. Gizlilik ve irade serbestisi esastır. Arabulucu bulma: /bilgi/arabulucu-nasil-secilir',
        'Anlaşma belgesi ilam niteliği taşıyabilir: /bilgi/arabuluculuk-anlasma-belgesi · icra: /bilgi/arabuluculuk-anlasma-icra · ücret: /bilgi/arabuluculuk-ucreti',
      ]),
      s('Son tutanak ve dava', [
        'Anlaşamama tutanağı çoğu dava şartı uyuşmazlıkta dava açmak için gereklidir: /bilgi/arabuluculuk-son-tutanak. Süreyi kaçırmadan mahkemeye başvurun.',
      ]),
    ],
    [
      'Uyuşmazlığın arabuluculuk kapsamına girip girmediğini kontrol edin.',
      'Başvuru yapın; arabulucu atansın/seçilsin.',
      'Belgelerle oturuma katılın.',
      'Anlaşma veya son tutanağı alın.',
      'Anlaşmazlıkta süresinde dava açın.',
    ],
    [
      faq('Arabuluculuk ücretsiz midir?', 'Tarife ve uyuşmazlık türüne göre değişir; bazı hallerde taraflar paylaşır.'),
      faq('Anlaşma bozulur mu?', 'İlam niteliğindeki belge icra edilebilir; iptal şartları dardır.'),
      faq('Gitmezsem ne olur?', 'Dava şartı olan uyuşmazlıkta dava usulden risk altındadır.'),
    ]
  ),

  'bosanma-davasi-nasil-acilir': pack(
    'Boşanma, aile mahkemesinde anlaşmalı veya çekişmeli açılır. Anlaşmalıda protokol ve mahkeme önünde irade; çekişmelide delil ve süre öne çıkar. Nafaka, velayet ve mal rejimi bu sayfada haritalanır; her biri ayrı derin sayfalara bağlanır.',
    [
      s('Anlaşmalı boşanma', [
        'Kanundaki evlilik süresi, tarafların mahkeme önünde boşanma iradesi ve düzenledikleri protokol (nafaka, velayet, mal, ziynet, kişisel ilişki) aranır. Ayrıntı: /bilgi/anlasmali-bosanma-sartlari · protokol: /bilgi/bosanma-protokolu-ornegi',
      ]),
      s('Çekişmeli boşanma', [
        'Evlilik birliğinin temelinden sarsılması veya özel sebepler (zina, terk, hayata kast vb.) ileri sürülebilir. İspat ve kusur nafaka/tazminatı etkiler: /bilgi/cekismeli-bosanma-sureci · özel sebepler yan sayfalarda.',
      ]),
      s('Fer’i sonuçlar', [
        'Velayet: /bilgi/velayet-davasi · Nafaka: /bilgi/nafaka-davasi-nedir · Mal rejimi: /bilgi/mal-rejimi-tasfiyesi · Ziynet: /bilgi/ziynet-esyalari-davasi · 6284: /bilgi/koruma-karari-6284',
      ]),
      s('Masraf ve yetki', [
        'Harç, vekâlet ve masraf: /bilgi/bosanma-maaliyeti. Yetki: eşlerden birinin yerleşim yeri veya son altı ay birlikte oturulan yer (somut olaya göre).',
      ]),
    ],
    [
      'Anlaşmalı mı çekişmeli mi olduğuna karar verin.',
      'Belgeleri (nüfus, gelir, çocuk) toplayın.',
      'Protokol veya dava dilekçesini hazırlayın.',
      'Aile mahkemesinde dava açın.',
      'Tedbir nafakası/velayet ara kararlarını takip edin.',
    ],
    [
      faq('Anlaşmalı ne kadar sürer?', 'Mahkeme takvimine bağlıdır; eksiksiz protokol süreci kısaltır ama garanti süre yoktur.'),
      faq('Çocuk velayeti kime verilir?', 'Üstün yarar ölçütü esastır; otomatik “anneye/babaya” kuralı yoktur.'),
      faq('Mal paylaşımı boşanmayla biter mi?', 'Mal rejimi tasfiyesi ayrı talep ve hesap gerektirebilir.'),
    ]
  ),

  'veraset-ilami-nasil-alinir': pack(
    'Veraset ilamı (mirasçılık belgesi), ölenin yasal mirasçılarını ve paylarını gösteren belgedir. e-Devlet, noter veya sulh hukuk yolları vardır. Bu sayfa alma yollarının ana rehberidir; pay hesabı, saklı pay ve red ayrı sayfalardadır.',
    [
      s('Hangi yolla alınır?', [
        'e-Devlet: uygunluk ve sistem uygunsa hızlıdır — /bilgi/e-devlet-veraset. Uygun değilse noter veya mahkeme. Mirasçılık belgesi tanımı: /bilgi/mirascilik-belgesi-nedir',
      ]),
      s('Belgeler', [
        'Ölüm belgesi, nüfus kayıtları, kimlikler temeldir. Yurtdışı ölüm, evlatlık, reddi miras gibi haller ek belge ister.',
      ]),
      s('Belgeden sonra', [
        'Pay hesabı: /bilgi/miras-payi-nasil-hesaplanir · Red: /bilgi/mirasin-reddi · Vergi: /bilgi/veraset-ve-intikal-vergisi · Tapu devri: /bilgi/tapu-devri-nasil-yapilir · Hesap: /hesaplama/miras',
      ]),
      s('Riskler', [
        'Red süresini kaçırmak, saklı payı yok saymak ve muris muvazaası iddiasını geç fark etmek sık sorunlardır.',
      ]),
    ],
    [
      'Ölüm ve mirasçı listesini nüfustan doğrulayın.',
      'e-Devlet uygunluğunu deneyin; olmazsa noter/mahkeme.',
      'Belgeyi alın; banka/tapu için suretleri çoğaltın.',
      'Borç-alacak envanteri yapın; red gerekip gerekmediğine bakın.',
      'Vergi ve tapu işlemlerine geçin.',
    ],
    [
      faq('e-Devlet herkese açık mı?', 'Sistem ve yasal uygunluk şarttır; her dosyada çıkmayabilir.'),
      faq('Veraset ilamı tapu devri midir?', 'Hayır; devir için ayrıca tapu işlemi gerekir.'),
      faq('Miras reddi ne kadar sürede?', 'Kanuni süre vardır; kaçırılırsa kabul sayılma riski doğar. /bilgi/mirasin-reddi'),
    ]
  ),

  'odeme-emrine-itiraz': pack(
    'Ödeme emrine itiraz, ilamsız icra takibinde borçlunun yasal sürede başvurduğu temel savunmadır. Süre kural olarak tebliğden itibaren 7 gündür. Bu sayfa itiraz niyetinin kralıdır; tebliğ anı, inkâr tazminatı ve iptal davası yan sayfalardadır. Genel icra haritası: /bilgi/icra-takibi-nedir',
    [
      s('Süre ve tebliğ', [
        'Süre tebliğ ile işlemeye başlar. e-Tebligatta açılmasa da tebliğ sayılma kuralları vardır. Usulsüz tebligatta öğrenme tarihi: /bilgi/tebligat-usulsuzlugu · tebliğ özeti: /bilgi/odeme-emri-tebligi',
      ]),
      s('Nasıl ve nereye?', [
        'İtiraz icra dairesine yapılır; takip kural olarak durur. Gerekçe (borç yok, zamanaşımı, imza inkârı vb.) somut olmalıdır. Sonra alacaklı itirazın iptali veya kaldırılması yoluna gidebilir: /bilgi/itirazin-iptali-davasi · /bilgi/itirazin-kaldirilmasi',
      ]),
      s('İnkâr tazminatı riski', [
        'Haksız itirazda inkâr tazminatı gündeme gelebilir: /bilgi/icra-inkar-tazminati · oran: /bilgi/icra-inkar-tazminati-orani',
      ]),
    ],
    [
      'Ödeme emri ve tebliğ tarihini kaydedin.',
      '7 günlük süreyi hesaplayın.',
      'Gerekçeli itirazı icra dairesine yapın.',
      'Takip durumunu UYAP’tan izleyin.',
      'Alacaklının iptal davasına hazırlıklı olun.',
    ],
    [
      faq('İtiraz etmezsem ne olur?', 'Takip kesinleşebilir; haciz yolu açılır.'),
      faq('Kısmi itiraz olur mu?', 'Belirli kalemlere itiraz mümkün olabilir; usulüne dikkat edin.'),
      faq('İtiraz sonrası icra biter mi?', 'Durur; alacaklı yargı yoluna gidebilir.'),
    ]
  ),
};

/** @deprecated wave2 getPillarBody kullanın — geriye dönük */
export function getPillarBody(slug) {
  return PILLAR_BODIES[slug] || null;
}
