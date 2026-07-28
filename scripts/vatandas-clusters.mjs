/**
 * Yamyamlık temizliği haritası.
 *
 * - pillar: ana arama niyeti, tam derin içerik, yüksek sitemap
 * - spoke: tek açı / dar niyet, pillar’a güçlü iç link, düşük sitemap
 * - bridge: /bilgi kanun maddesi özeti → canonical /mevzuat/...
 *
 * Spoke title/keywords generator’da force edilir (çakışan genel anahtarlar temizlenir).
 */

/** @typedef {{ pillar: string, label: string, spokes: Record<string, { angle: string, title?: string, h1?: string, description?: string, keywords?: string[] }> }} Cluster */

/** @type {Record<string, Cluster>} */
export const CLUSTERS = {
  kidem: {
    pillar: 'kidem-tazminati-nasil-alinir',
    label: 'Kıdem tazminatı',
    spokes: {
      'kidem-tazminati-hesaplama': {
        angle: 'Kabaca hesap formülü, giydirilmiş ücret ve tavanın hesaba etkisi',
        title: 'Kıdem Tazminatı Hesaplama Formülü (Kabaca)',
        h1: 'Kıdem tazminatı nasıl hesaplanır? (formül)',
        description:
          'Kıdem tazminatı hesaplama: giydirilmiş ücret × yıl, tavan ve damga. Kabaca formül; araç linki. Hak kazanma ana rehberde.',
        keywords: ['kıdem tazminatı hesaplama', 'kıdem hesabı formülü', 'giydirilmiş ücret kıdem'],
      },
      'kidem-tavan': {
        angle: 'Dönemsel kıdem tavanı ve hesabı sınırlama etkisi',
        title: 'Kıdem Tazminatı Tavanı Nedir? (Dönemsel Sınır)',
        h1: 'Kıdem tazminatı tavanı nedir?',
        description: 'Kıdem tavanı ne işe yarar, hesabı nasıl sınırlar? Güncel tutar için resmî kaynak; genel rehber ayrı.',
        keywords: ['kıdem tazminatı tavanı', 'kıdem tavan tutarı', 'kıdem tavanı 2026'],
      },
      'kidem-tazminati-sgk-iliskisi': {
        angle: 'SGK bildirimi, vergi/damga ve prim ilişkisi',
        title: 'Kıdem Tazminatı SGK ve Vergi İlişkisi',
        h1: 'Kıdem tazminatı SGK’ya nasıl yansır?',
        description: 'Kıdemde SGK, damga ve vergi notları. Hak kazanma ve dava süreci ana kıdem rehberinde.',
        keywords: ['kıdem tazminatı SGK', 'kıdem damga vergisi', 'kıdem bordro'],
      },
      'kidem-tazminati-haczi': {
        angle: 'Kıdem alacağının haczedilip haczedilemeyeceği',
        title: 'Kıdem Tazminatı Haczedilir mi?',
        h1: 'Kıdem tazminatına haciz konur mu?',
        description: 'Kıdem tazminatında haciz tartışması ve istisnalar. İcra genel rehberi ve ana kıdem sayfasına bağlantı.',
        keywords: ['kıdem tazminatı haczi', 'kıdem haczedilir mi'],
      },
      'ihbar-tazminati-nedir': {
        angle: 'İhbar (bildirim) tazminatı — kıdemden ayrı kalem',
        title: 'İhbar Tazminatı Nedir? Bildirim Süreleri',
        h1: 'İhbar tazminatı nedir? Kıdemden farkı',
        description: 'İhbar tazminatı, bildirim süreleri ve kıdemden ayrımı. Kıdem hak kazanma ana rehberde.',
        keywords: ['ihbar tazminatı', 'ihbar süresi', 'bildirim tazminatı'],
      },
      'ihbar-suresi-tablosu': {
        angle: 'Kıdeme göre bildirim süresi tablosu',
        title: 'İhbar Süreleri Tablosu (İş Kanunu)',
        h1: 'İhbar süreleri kaç hafta/ay?',
        description: 'İş Kanunu bildirim (ihbar) süreleri tablosu. İhbar tazminatı ve kıdem ana sayfalarına link.',
        keywords: ['ihbar süreleri tablosu', 'bildirim süreleri iş kanunu'],
      },
      'isten-cikarilma-tazminatlari': {
        angle: 'Fesihte hangi kalemler birlikte gündeme gelir (genel harita)',
        title: 'İşten Çıkarılınca Hangi Tazminatlar Alınır?',
        h1: 'İşten çıkarılma tazminatları haritası',
        description: 'Kıdem, ihbar, işe iade, kötü niyet — kalem haritası. Her kalemin detayı kendi rehberinde.',
        keywords: ['işten çıkarılma tazminatları', 'fesih tazminatları listesi'],
      },
      'iscilik-alacaklari-davasi': {
        angle: 'Dava yolu ve arabuluculuk odaklı işçilik alacağı',
        title: 'İşçilik Alacakları Davası Nasıl Açılır?',
        h1: 'İşçilik alacakları davası nedir?',
        description: 'Kıdem, fazla mesai, izin alacaklarında arabuluculuk ve dava. Kıdem şartları ana rehberde.',
        keywords: ['işçilik alacakları davası', 'işçi alacak davası'],
      },
      'iscilik-alacaklari-zamansimi': {
        angle: 'Zamanaşımı süreleri',
        title: 'İşçilik Alacaklarında Zamanaşımı',
        h1: 'İşçilik alacaklarında zamanaşımı ne kadar?',
        description: 'Kıdem ve diğer işçilik alacaklarında zamanaşımı notları. Esas hak ana kıdem rehberinde.',
        keywords: ['işçilik alacakları zamanaşımı', 'kıdem zamanaşımı'],
      },
      'iscilik-alacagi-oncelik': {
        angle: 'İcra/iflasta imtiyaz sırası',
        title: 'İşçilik Alacağının İcrada Önceliği',
        h1: 'İşçilik alacağı icrada öncelikli midir?',
        description: 'İşçilik alacağının sıra cetvelinde yeri. Kıdem tahsili ve icra genel rehberlerine link.',
        keywords: ['işçilik alacağı öncelik', 'işçi alacağı imtiyaz'],
      },
    },
  },

  ise_iade: {
    pillar: 'ise-iade-davasi',
    label: 'İşe iade',
    spokes: {
      'ise-iade-tazminati': {
        angle: 'İşe başlatmama tazminatı miktar aralığı',
        title: 'İşe Başlatmama Tazminatı (4–8 Ay)',
        h1: 'İşe başlatmama tazminatı ne kadardır?',
        description: 'İşe iade sonucu işe başlatmama tazminatı. Dava şartları ana işe iade rehberinde.',
        keywords: ['işe başlatmama tazminatı', 'işe iade tazminatı 4-8 ay'],
      },
      'bos-ta-gecen-sure': {
        angle: 'Boşta geçen süre ücreti',
        title: 'Boşta Geçen Süre Ücreti Nedir?',
        h1: 'İşe iadede boşta geçen süre ücreti',
        description: 'İşe iade davasında boşta geçen süre. Ana işe iade rehberine bağlantı.',
        keywords: ['boşta geçen süre ücreti', 'işe iade 4 ay ücret'],
      },
      'isse-iade-arabuluculuk': {
        angle: 'Dava şartı arabuluculuk adımı',
        title: 'İşe İade Öncesi Arabuluculuk',
        h1: 'İşe iadede arabuluculuk zorunlu mu?',
        description: 'İşe iade dava şartı arabuluculuk. Esas şartlar ana işe iade sayfasında.',
        keywords: ['işe iade arabuluculuk', 'işe iade dava şartı'],
      },
    },
  },

  nafaka: {
    pillar: 'nafaka-davasi-nedir',
    label: 'Nafaka',
    spokes: {
      'tedbir-nafakasi-nedir': {
        angle: 'Dava süresince tedbir nafakası',
        title: 'Tedbir Nafakası Nedir? Boşanma Sırasında',
        h1: 'Tedbir nafakası nedir?',
        description: 'Tedbir nafakası şartları. Türler ve genel süreç ana nafaka rehberinde.',
        keywords: ['tedbir nafakası', 'boşanma tedbir nafakası'],
      },
      'yoksulluk-nafakasi-sartlari': {
        angle: 'Yoksulluk nafakası şartları',
        title: 'Yoksulluk Nafakası Şartları',
        h1: 'Yoksulluk nafakası şartları nelerdir?',
        description: 'Yoksulluk nafakası kusur ve yoksulluk ölçütleri. Ana nafaka rehberine link.',
        keywords: ['yoksulluk nafakası şartları', 'yoksulluk nafakası'],
      },
      'istirak-nafakasi-nedir': {
        angle: 'Çocuk iştirak nafakası tanımı',
        title: 'İştirak Nafakası Nedir? Çocuk Nafakası',
        h1: 'İştirak nafakası nedir?',
        description: 'İştirak nafakası (çocuk). Artırım ve icra ayrı sayfalarda; genel türler ana rehberde.',
        keywords: ['iştirak nafakası', 'çocuk nafakası nedir'],
      },
      'islex-nafaka-nedir': {
        angle: 'İştirak nafakası kabaca hesap yaklaşımı',
        title: 'İştirak Nafakası Nasıl Hesaplanır?',
        h1: 'İştirak nafakası kabaca nasıl hesaplanır?',
        description: 'Çocuk nafakası hesabında ihtiyaç-gelir dengesi. Türler ana nafaka; artırım ayrı sayfada.',
        keywords: ['iştirak nafakası hesaplama', 'çocuk nafakası hesabı'],
      },
      'cocuk-nafaka-artirim': {
        angle: 'Çocuk nafakası artırım davası (pratik)',
        title: 'Çocuk Nafakası Artırım Davası',
        h1: 'Çocuk nafakası nasıl artırılır?',
        description: 'İştirak nafakası artırım şartları ve delil. Genel nafaka türleri ana rehberde.',
        keywords: ['çocuk nafakası artırım', 'iştirak nafakası artırma'],
      },
      'nafaka-artirim-davasi': {
        angle: 'Genel nafaka artırım usulü (yoksulluk/iştirak ortak)',
        title: 'Nafaka Artırım Davası Usulü',
        h1: 'Nafaka artırım davası nasıl açılır?',
        description: 'Nafaka artırımında değişen şartlar ve usul. Çocuk odaklı artırım ayrı; türler ana rehberde.',
        keywords: ['nafaka artırım davası', 'nafaka nasıl artırılır usul'],
      },
      'nafaka-indirim-davasi': {
        angle: 'İndirim veya kaldırma',
        title: 'Nafaka İndirim ve Kaldırma Davası',
        h1: 'Nafaka nasıl indirilir veya kaldırılır?',
        description: 'Gelir değişimi, evlilik vb. ile nafaka indirim/kaldırma. Ana nafaka rehberine link.',
        keywords: ['nafaka indirim davası', 'nafaka kaldırma'],
      },
      'nafaka-odenmezse': {
        angle: 'İcra ve tazyik',
        title: 'Nafaka Ödenmezse İcra ve Tazyik Hapsi',
        h1: 'Nafaka ödenmezse ne yapılır?',
        description: 'Nafaka icrası ve tazyik. Nafaka türleri ana rehberde; icra genel sayfası ayrı.',
        keywords: ['nafaka ödenmezse', 'nafaka icra', 'nafaka tazyik hapsi'],
      },
      'nafaka-alacaklisi-oncelik': {
        angle: 'İcra sırası imtiyazı',
        title: 'Nafaka Alacağının İcrada Önceliği',
        h1: 'Nafaka alacağı icrada öncelikli midir?',
        description: 'Nafakanın sıra cetvelindeki yeri. Ödeme ve tazyik ayrı; türler ana rehberde.',
        keywords: ['nafaka öncelik icra', 'nafaka imtiyazlı alacak'],
      },
      'ucret-haczi-nafaka': {
        angle: 'Maaş haczi ile nafaka çakışması',
        title: 'Maaş Haczinde Nafaka Önceliği',
        h1: 'Nafaka ile maaş haczi çakışırsa ne olur?',
        description: 'Ücret haczi ve nafaka kesintisi. Maaş haczi oranı ve nafaka icra sayfalarına link.',
        keywords: ['nafaka maaş haczi', 'ücret haczi nafaka'],
      },
    },
  },

  kira: {
    pillar: 'kira-artis-orani-nasil-hesaplanir',
    label: 'Kira artışı / kira hukuku hub',
    spokes: {
      'konut-kirasi-artis-siniri': {
        angle: 'Konut yasal artış tavanı (dönemsel)',
        title: 'Konut Kira Artış Yasal Sınırı',
        h1: 'Konut kira zammı yasal sınırı nedir?',
        description: 'Konut kira artış tavanı ve TÜFE ilişkisi. Genel hesap ana kira artışı rehberinde.',
        keywords: ['konut kira artış sınırı', 'yasal kira zammı tavanı'],
      },
      'isyeri-kirasi-artis': {
        angle: 'İşyeri kira artışı serbestisi / tespit',
        title: 'İşyeri Kira Artışı Nasıl Belirlenir?',
        h1: 'İşyeri kira zammı nasıl olur?',
        description: 'Ticari kira artışı ve tespit. Konut hesabı ana rehberde; tahliye ayrı.',
        keywords: ['işyeri kira artışı', 'ticari kira zammı'],
      },
      'kira-tespit-davasi': {
        angle: '5 yıl / rayiç tespit davası',
        title: 'Kira Tespit Davası Nedir?',
        h1: 'Kira tespit davası ne zaman açılır?',
        description: 'Kira bedeli tespit davası ve arabuluculuk. Artış oranı ana rehberde.',
        keywords: ['kira tespit davası', 'kira bedeli tespit'],
      },
      'kira-tespit-5-yil': {
        angle: '5 yıllık dönem özel notu',
        title: '5 Yıl Sonra Kira Tespiti',
        h1: '5 yıl dolunca kira nasıl yeniden belirlenir?',
        description: 'TBK çerçevesinde 5 yıl sonrası tespit. Genel tespit ve artış ana sayfalarda.',
        keywords: ['5 yıl kira tespit', 'kira tespit 5 yıl'],
      },
      'kiraci-nasil-tahliye-edilir': {
        angle: 'Tahliye yolları (hub-spoke kendi pillar adayı ama kira kümesinde spoke)',
        title: 'Kiracı Nasıl Tahliye Edilir? Yasal Sebepler',
        h1: 'Kiracı nasıl tahliye edilir?',
        description: 'Tahliye taahhüdü, ihtiyaç, temerrüt, iki haklı ihtar. Kira artışı ayrı rehberde.',
        keywords: ['kiracı nasıl tahliye edilir', 'tahliye davası', 'kira tahliye sebepleri'],
      },
      'tahliye-taahhutnamesi': {
        angle: 'Taahhütname geçerliliği',
        title: 'Tahliye Taahhütnamesi Geçerlilik Şartları',
        h1: 'Tahliye taahhütnamesi geçerli midir?',
        description: 'Tarih, imza, icra. Genel tahliye yolları tahliye rehberinde.',
        keywords: ['tahliye taahhütnamesi', 'tahliye taahhüdü geçerlilik'],
      },
      'ihtiyac-nedeniyle-tahliye': {
        angle: 'İhtiyaç tahliyesi',
        title: 'İhtiyaç Nedeniyle Tahliye Şartları',
        h1: 'İhtiyaç nedeniyle tahliye nedir?',
        description: 'Konut/işyeri ihtiyaç tahliyesi. Diğer tahliye sebepleri ana tahliye sayfasında.',
        keywords: ['ihtiyaç nedeniyle tahliye', 'kendisi oturacak tahliye'],
      },
      'konut-kirasi-tahliye-sebepleri': {
        angle: 'Konut tahliye sebep listesi',
        title: 'Konut Kirasında Tahliye Sebepleri Listesi',
        h1: 'Konut kiracısı hangi hallerde tahliye edilir?',
        description: 'Konut tahliye sebepleri özet listesi. Usul detayı tahliye rehberinde.',
        keywords: ['konut tahliye sebepleri', 'kira tahliye nedenleri listesi'],
      },
      'isyeri-kirasi-tahliye': {
        angle: 'İşyeri tahliyesi',
        title: 'İşyeri Kirasında Tahliye',
        h1: 'İşyeri kiracısı nasıl tahliye edilir?',
        description: 'Ticari kira tahliye notları. Konut tahliyesi ve artış ayrı sayfalarda.',
        keywords: ['işyeri kira tahliye', 'ticari kira tahliye'],
      },
      'yeniden-kiralama-yasagi': {
        angle: 'İhtiyaç sonrası yeniden kiralama yasağı',
        title: 'Tahliye Sonrası Yeniden Kiralama Yasağı',
        h1: 'İhtiyaç tahliyesi sonrası başkasına kiraya verilir mi?',
        description: 'Yeniden kiralama yasağı. İhtiyaç tahliyesi ve genel tahliye sayfalarına link.',
        keywords: ['yeniden kiralama yasağı', 'ihtiyaç tahliyesi kiralama yasağı'],
      },
      'kira-teminati-iadesi': {
        angle: 'Depozito iadesi',
        title: 'Kira Depozitosu Nasıl Geri Alınır?',
        h1: 'Kira teminatı (depozito) iadesi',
        description: 'Depozito kesinti ve iade. Güvence 3 ay ve faiz notları ayrı; artış ana rehberde.',
        keywords: ['kira depozitosu iadesi', 'teminat iadesi kira'],
      },
      'guvence-bedeli-3-ay': {
        angle: 'TBK 3 aylık güvence sınırı',
        title: 'Kira Güvencesi En Fazla 3 Ay',
        h1: 'Depozito en fazla kaç aylık kiradır?',
        description: 'Konut kira güvencesi üst sınırı. İade süreci depozito sayfasında.',
        keywords: ['kira güvencesi 3 ay', 'depozito en fazla 3 kira'],
      },
      'depozito-faizi': {
        angle: 'Depozitoya faiz',
        title: 'Kira Depozitosuna Faiz İşler mi?',
        h1: 'Depozitoya faiz gerekir mi?',
        description: 'Teminat faizi tartışması. İade usulü depozito rehberinde.',
        keywords: ['kira depozito faizi', 'teminat faiz'],
      },
      'kira-sozlesmesi-nasil-yapilir': {
        angle: 'Sözleşme kurulumu',
        title: 'Kira Sözleşmesi Nasıl Yapılır?',
        h1: 'Kira sözleşmesi nasıl düzenlenir?',
        description: 'Yazılı kira, e-Devlet bildirim. Artış ve tahliye ayrı rehberlerde.',
        keywords: ['kira sözleşmesi nasıl yapılır', 'konut kira sözleşmesi'],
      },
      'kira-kontrat-e-devlet': {
        angle: 'e-Devlet kira bildirimi',
        title: 'e-Devlet Kira Kontratı Girişi',
        h1: 'Kira sözleşmesi e-Devlete nasıl girilir?',
        description: 'Kira bildirim adımları. Sözleşme kurma ve stopaj ayrı notlarda.',
        keywords: ['e-devlet kira kontratı', 'kira sözleşmesi bildirim'],
      },
      'kiraci-haklari-nelerdir': {
        angle: 'Kiracı hakları özeti',
        title: 'Kiracı Hakları Nelerdir?',
        h1: 'Kiracının yasal hakları nelerdir?',
        description: 'Konut kiracısı hakları özeti. Artış, depozito, tahliye detayları kendi sayfalarında.',
        keywords: ['kiracı hakları', 'kiracı yasal haklar'],
      },
      'kiraya-veren-haklari': {
        angle: 'Ev sahibi hakları',
        title: 'Kiraya Veren (Ev Sahibi) Hakları',
        h1: 'Ev sahibinin hakları nelerdir?',
        description: 'Kira alacağı ve tahliye hakları özeti. Usul sayfaları ayrı.',
        keywords: ['kiraya veren hakları', 'ev sahibi hakları'],
      },
      'kira-odeme-ihtari': {
        angle: 'Temerrüt ihtarı',
        title: 'Kira Ödememe İhtarı ve Temerrüt',
        h1: 'Kira ödenmezse ihtar nasıl çekilir?',
        description: 'İki haklı ihtar ve temerrüt. Tahliye ve icra sayfalarına link.',
        keywords: ['kira ihtarı', 'iki haklı ihtar', 'kira temerrüt'],
      },
      'kira-alacagi-icra': {
        angle: 'Kira alacağı icra takibi',
        title: 'Kira Alacağı İçin İcra Takibi',
        h1: 'Ödenmeyen kira için icra nasıl başlar?',
        description: 'Kira alacağında ilamsız takip. Genel icra ve tahliye rehberlerine link.',
        keywords: ['kira alacağı icra', 'kira icra takibi'],
      },
      'kira-uyusmazligi-arabuluculuk': {
        angle: 'Kira arabuluculuk dava şartı',
        title: 'Kira Uyuşmazlığında Arabuluculuk',
        h1: 'Kira davasında arabuluculuk zorunlu mu?',
        description: 'Kira arabuluculuğu. Artış/tespit/tahliye esasları ilgili sayfalarda.',
        keywords: ['kira arabuluculuk', 'kira uyuşmazlığı arabuluculuk'],
      },
      'kira-bedeli-odeme-sekli': {
        angle: 'Ödeme ispatı',
        title: 'Kira Bedeli Nasıl Ödenmeli? İspat',
        h1: 'Kira ödemesi nasıl belgelenir?',
        description: 'Banka/dekont ispatı. Temerrüt ve artış ayrı sayfalarda.',
        keywords: ['kira ödeme ispatı', 'kira banka havalesi'],
      },
      'alt-kira-ve-devir': {
        angle: 'Alt kira / devir',
        title: 'Alt Kira ve Kira Devir Hakkı',
        h1: 'Alt kira serbest midir?',
        description: 'Alt kira ve devir izni. Sözleşme kurma rehberine link.',
        keywords: ['alt kira', 'kira devri'],
      },
      'kiralananin-ayibi': {
        angle: 'Ayıplı kiralanan',
        title: 'Kiralananın Ayıplı Olması',
        h1: 'Kiralık ev ayıplıysa ne yapılır?',
        description: 'Ayıp, onarım, indirim. Kiracı hakları özet sayfasına link.',
        keywords: ['kiralananın ayıbı', 'kiralık ev ayıp'],
      },
      'kira-sozlesmesi-bitisi': {
        angle: 'Süre sonu yenileme',
        title: 'Kira Sözleşmesi Bitince Ne Olur?',
        h1: 'Kira süresi dolunca ne yapılır?',
        description: 'Yenileme ve süre sonu. Tahliye sebepleri ayrı listede.',
        keywords: ['kira sözleşmesi bitişi', 'kira yenileme'],
      },
      'kiracinin-olumu': {
        angle: 'Kiracı ölümü',
        title: 'Kiracının Ölümü ve Kira Sözleşmesi',
        h1: 'Kiracı ölürse kira ne olur?',
        description: 'Miras ve kira ilişkisi. Veraset ve tahliye sayfalarına link.',
        keywords: ['kiracı ölümü', 'kiracı vefat kira'],
      },
      'kiraya-verenin-degismesi': {
        angle: 'Satışta yeni malik',
        title: 'Ev Satılırsa Kiracı Ne Olur?',
        h1: 'Kiraya verenin değişmesi (satış)',
        description: 'Yeni malik ve kira. Tahliye ve tapu sayfalarına link.',
        keywords: ['ev satılırsa kiracı', 'yeni malik kira'],
      },
    },
  },

  /** Tahliye kendi pillar’ı — kira cluster spoke’u da var; generator spoke önceliği: tahliye cluster */
  tahliye: {
    pillar: 'kiraci-nasil-tahliye-edilir',
    label: 'Tahliye',
    spokes: {
      'tahliye-taahhutnamesi': {
        angle: 'Taahhütname',
        title: 'Tahliye Taahhütnamesi Geçerlilik Şartları',
        h1: 'Tahliye taahhütnamesi geçerli midir?',
        description: 'Tarih, imza, icra. Tüm tahliye yolları ana tahliye rehberinde.',
        keywords: ['tahliye taahhütnamesi', 'tahliye taahhüdü geçerlilik'],
      },
      'ihtiyac-nedeniyle-tahliye': {
        angle: 'İhtiyaç',
        title: 'İhtiyaç Nedeniyle Tahliye Şartları',
        h1: 'İhtiyaç nedeniyle tahliye nedir?',
        description: 'İhtiyaç tahliyesi. Ana tahliye rehberi ve yeniden kiralama yasağı linkleri.',
        keywords: ['ihtiyaç nedeniyle tahliye', 'kendisi oturacak tahliye'],
      },
      'konut-kirasi-tahliye-sebepleri': {
        angle: 'Sebep listesi',
        title: 'Konut Kirasında Tahliye Sebepleri Listesi',
        h1: 'Konut tahliye sebepleri nelerdir?',
        description: 'Liste özeti. Usul ana tahliye rehberinde.',
        keywords: ['konut tahliye sebepleri', 'kira tahliye nedenleri'],
      },
      'isyeri-kirasi-tahliye': {
        angle: 'İşyeri',
        title: 'İşyeri Kirasında Tahliye',
        h1: 'İşyeri kiracısı nasıl tahliye edilir?',
        description: 'İşyeri tahliye notları. Ana tahliye rehberine link.',
        keywords: ['işyeri kira tahliye', 'ticari kira tahliye'],
      },
      'yeniden-kiralama-yasagi': {
        angle: 'Yeniden kiralama yasağı',
        title: 'Tahliye Sonrası Yeniden Kiralama Yasağı',
        h1: 'İhtiyaç tahliyesi sonrası kiralama yasağı',
        description: 'Yaptırım notu. İhtiyaç ve ana tahliye sayfalarına link.',
        keywords: ['yeniden kiralama yasağı'],
      },
    },
  },

  icra: {
    pillar: 'icra-takibi-nedir',
    label: 'İcra takibi',
    spokes: {
      'odeme-emrine-itiraz': {
        angle: '7 gün itiraz',
        title: 'Ödeme Emrine İtiraz (7 Gün)',
        h1: 'Ödeme emrine itiraz nasıl yapılır?',
        description: 'İlamsız takipte 7 günlük itiraz. Genel icra süreci ana rehberde.',
        keywords: ['ödeme emrine itiraz', '7 gün itiraz icra'],
      },
      'odeme-emri-tebligi': {
        angle: 'Tebliğ anı',
        title: 'Ödeme Emri Tebliği Ne Demektir?',
        h1: 'Ödeme emri tebliğ edilince ne yapılır?',
        description: 'Tebliğ ve süre başlangıcı. İtiraz usulü ayrı sayfada.',
        keywords: ['ödeme emri tebliği', 'ödeme emri ne demek'],
      },
      'ilamli-icra-nedir': {
        angle: 'İlamlı takip',
        title: 'İlamlı İcra Nedir? İlamsızdan Farkı',
        h1: 'İlamlı icra nedir?',
        description: 'Mahkeme ilamı ile takip. Genel icra ve itiraz farkları ana/yan sayfalarda.',
        keywords: ['ilamlı icra', 'ilamsız icra farkı'],
      },
      'haciz-islemleri-nasil-yapilir': {
        angle: 'Haciz süreci',
        title: 'Haciz İşlemleri Nasıl Yapılır?',
        h1: 'Haciz nasıl yapılır?',
        description: 'Menkul, maaş, tapu haczi özeti. Ana icra ve haciz kaldırma sayfalarına link.',
        keywords: ['haciz nasıl yapılır', 'icra haciz süreci'],
      },
      'haciz-nasil-kaldirilir': {
        angle: 'Haczin kalkması',
        title: 'Haciz Nasıl Kaldırılır?',
        h1: 'Haciz nasıl kaldırılır?',
        description: 'Ödeme, menfi tespit, istihkak. Haciz koyma ana icra/haciz sayfalarında.',
        keywords: ['haciz nasıl kaldırılır', 'haciz kaldırma'],
      },
      'maas-haczi-orani': {
        angle: 'Maaş kesinti oranı',
        title: 'Maaş Haczi Oranı Ne Kadar?',
        h1: 'Maaştan ne kadar haciz konabilir?',
        description: 'Maaş haczi sınırları. Genel haciz ve nafaka önceliği ayrı.',
        keywords: ['maaş haczi oranı', 'maaştan haciz ne kadar'],
      },
      'banka-hesabi-haczi': {
        angle: 'Hesap blokesi',
        title: 'Banka Hesabına Haciz',
        h1: 'Banka hesabına haciz gelirse ne yapılır?',
        description: 'Hesap haczi ve itiraz. Genel haciz rehberine link.',
        keywords: ['banka hesabı haczi', 'hesaba bloke icra'],
      },
      'arac-haczi-nedir': {
        angle: 'Araç haczi',
        title: 'Araç Haczi Nedir?',
        h1: 'Araç haczi nasıl işler?',
        description: 'Taşıt haczi. Genel haciz ve kaldırma sayfalarına link.',
        keywords: ['araç haczi', 'araba haczi'],
      },
      'tapu-haczi-nedir': {
        angle: 'Tapu şerhi haciz',
        title: 'Tapuya Haciz Şerhi',
        h1: 'Tapuya haciz nasıl konulur?',
        description: 'Gayrimenkul haczi. Satış ihalesi ayrı sayfada.',
        keywords: ['tapu haczi', 'gayrimenkul haczi'],
      },
      'icra-dosyasi-sorgulama': {
        angle: 'UYAP sorgu',
        title: 'İcra Dosyası Sorgulama (UYAP)',
        h1: 'İcra dosyası nasıl sorgulanır?',
        description: 'UYAP/e-Devlet sorgu. e-Devlet borç sayfası ve ana icra rehberi linkleri.',
        keywords: ['icra dosyası sorgulama', 'UYAP icra'],
      },
      'e-devlet-icra': {
        angle: 'e-Devlet borç dökümü',
        title: 'e-Devlet İcra Borcu Sorgulama',
        h1: 'e-Devletten icra borcu nasıl bakılır?',
        description: 'Borç dökümü pratik. Dosya sorgu ve ana icra ayrı.',
        keywords: ['e-devlet icra borcu', 'icra borcu sorgulama e-devlet'],
      },
      'icra-borcu-yapislandirma': {
        angle: 'Taksit / ödeme planı',
        title: 'İcra Borcu Taksitlendirme',
        h1: 'İcra borcu nasıl taksitlendirilir?',
        description: 'Ödeme planı ve feragat. Ana icra ve taahhüt sayfalarına link.',
        keywords: ['icra borcu taksit', 'icra ödeme planı'],
      },
      'icra-taahudu': {
        angle: 'Ödeme taahhüdü',
        title: 'İcra Taahhüdü ve İhlali',
        h1: 'İcra taahhüdü nedir?',
        description: 'Taahhüt ve ihlal. Tazyik ve dosya kapatma linkleri.',
        keywords: ['icra taahhüdü', 'ödeme taahhüdü icra'],
      },
      'tazyik-hapsi': {
        angle: 'Tazyik',
        title: 'Tazyik Hapsi Nedir? (İcra)',
        h1: 'Tazyik hapsi ne demektir?',
        description: 'Nafaka/taahhüt tazyiki. Nafaka ödenmezse ve taahhüt sayfalarına link.',
        keywords: ['tazyik hapsi', 'nafaka tazyik hapsi'],
      },
      'icra-inkar-tazminati': {
        angle: 'İnkâr tazminatı genel',
        title: 'İcra İnkâr Tazminatı Nedir?',
        h1: 'İcra inkâr tazminatı nedir?',
        description: 'Haksız itiraz tazminatı. Oran ve şartlar yan sayfalarda; itiraz ana spoke.',
        keywords: ['icra inkâr tazminatı', 'inkar tazminatı nedir'],
      },
      'icra-inkar-tazminati-orani': {
        angle: 'Oran',
        title: 'İcra İnkâr Tazminatı Oranı',
        h1: 'İnkâr tazminatı oranı nedir?',
        description: 'Yüzde tartışması. Genel inkâr ve itirazın iptali sayfalarına link.',
        keywords: ['inkar tazminatı oranı', 'icra inkar yüzde'],
      },
      'icra-inkar-tazminati-sartlari': {
        angle: 'Şartlar',
        title: 'İcra İnkâr Tazminatı Şartları',
        h1: 'İnkâr tazminatı ne zaman hükmedilir?',
        description: 'Haksız itiraz şartları. Oran ve genel inkâr sayfalarına link.',
        keywords: ['inkar tazminatı şartları', 'haksız itiraz tazminat'],
      },
      'itirazin-iptali-davasi': {
        angle: 'İtirazın iptali',
        title: 'İtirazın İptali Davası',
        h1: 'İtirazın iptali davası nasıl açılır?',
        description: 'Alacaklının yolu. Ödeme emrine itiraz spoke’una ve ana icraya link.',
        keywords: ['itirazın iptali davası', 'itirazın iptali süresi'],
      },
      'itirazin-kaldirilmasi': {
        angle: 'İtirazın kaldırılması',
        title: 'İtirazın Kaldırılması (İcra)',
        h1: 'İtirazın kaldırılması nasıl istenir?',
        description: 'Kesin/geçici kaldırma. Senet ve itiraz sayfalarına link.',
        keywords: ['itirazın kaldırılması', 'kesin itirazın kaldırılması'],
      },
      'senet-icra-takibi': {
        angle: 'Senet/bono icrası',
        title: 'Senetle İcra Takibi',
        h1: 'Senetle icra takibi nasıl yapılır?',
        description: 'Kambiyo yolu. Genel kambiyo ve ana icra sayfalarına link.',
        keywords: ['senet icra takibi', 'bono icra'],
      },
      'kambiyo-senetlerine-ozgu-takip': {
        angle: 'Kambiyo özel takip',
        title: 'Kambiyo Senetlerine Özgü İcra',
        h1: 'Kambiyo senetlerinde icra nasıl başlar?',
        description: 'Çek/bono/poliçe. Senet icra ve çek sayfalarına link.',
        keywords: ['kambiyo senetleri icra', 'kambiyo takibi'],
      },
      'ihtiyati-haciz-nedir': {
        angle: 'İhtiyati haciz',
        title: 'İhtiyati Haciz Nedir?',
        h1: 'İhtiyati haciz nasıl istenir?',
        description: 'Teminatlı ihtiyati haciz. İtiraz spoke ve ana icra linkleri.',
        keywords: ['ihtiyati haciz', 'ihtiyati haciz nasıl konulur'],
      },
      'ihtiyati-haciz-itiraz': {
        angle: 'İhtiyati hacze itiraz',
        title: 'İhtiyati Hacze İtiraz',
        h1: 'İhtiyati hacze nasıl itiraz edilir?',
        description: 'İtiraz usulü. İhtiyati haciz nedir sayfasına link.',
        keywords: ['ihtiyati hacze itiraz', 'ihtiyati haciz kaldırma'],
      },
      'menfi-tespit-davasi': {
        angle: 'Menfi tespit',
        title: 'Menfi Tespit Davası',
        h1: 'Menfi tespit davası ne zaman açılır?',
        description: 'Borçlu olunmadığının tespiti. İstirdat ve ana icra linkleri.',
        keywords: ['menfi tespit davası', 'borçlu olmadığının tespiti'],
      },
      'istirdat-davasi': {
        angle: 'İstirdat',
        title: 'İstirdat Davası Nedir?',
        h1: 'İstirdat davası nedir?',
        description: 'İcra sonrası geri alma. Menfi tespit linki.',
        keywords: ['istirdat davası', 'fazla ödeme istirdat'],
      },
      'icra-satis-ihalesi': {
        angle: 'Cebri satış',
        title: 'İcra Satış İhalesi',
        h1: 'İcra ihalesine nasıl girilir?',
        description: 'Cebri satış. İhalenin feshi ve sıra cetveli ayrı.',
        keywords: ['icra satış ihalesi', 'icra ihalesi'],
      },
      'ihale-feshi-davasi': {
        angle: 'İhalenin feshi',
        title: 'İhalenin Feshi Davası',
        h1: 'İcra ihalesi nasıl bozulur?',
        description: 'Fesih sebepleri. Satış ihalesi sayfasına link.',
        keywords: ['ihalenin feshi', 'icra ihalesi iptal'],
      },
      'sira-cetveli': {
        angle: 'Sıra cetveli',
        title: 'Sıra Cetveli Nedir? İcra',
        h1: 'Sıra cetveline nasıl itiraz edilir?',
        description: 'Alacaklı sıralaması. Satış bedeli paylaşımı linki.',
        keywords: ['sıra cetveli', 'sıra cetveline itiraz'],
      },
      'icra-mahkemesi-nedir': {
        angle: 'İcra mahkemesi görev',
        title: 'İcra Mahkemesi Nedir?',
        h1: 'İcra mahkemesi neye bakar?',
        description: 'Şikâyet ve itiraz mercileri. İcra şikâyeti spoke’u.',
        keywords: ['icra mahkemesi', 'icra mahkemesi görev'],
      },
      'icra-sikayeti': {
        angle: 'Şikâyet',
        title: 'İcra Şikâyeti Süre ve Usul',
        h1: 'İcra müdürlüğü işlemine nasıl şikâyet edilir?',
        description: '7 gün şikâyet. İcra mahkemesi sayfasına link.',
        keywords: ['icra şikayeti', 'icra müdürlüğü şikayet'],
      },
      'icra-dosyasi-kapatma': {
        angle: 'Dosya kapanışı',
        title: 'İcra Dosyası Nasıl Kapatılır?',
        h1: 'İcra dosyası kapanınca ne olur?',
        description: 'Ödeme ve feragat. Haciz kaldırma linki.',
        keywords: ['icra dosyası kapatma', 'icra dosyası kapandı'],
      },
      'icra-vekalet-ucreti': {
        angle: 'Vekâlet ücreti',
        title: 'İcra Vekâlet Ücreti',
        h1: 'İcra dosyasında vekâlet ücreti',
        description: 'Tarife notu. Ana icra rehberine link.',
        keywords: ['icra vekalet ücreti', 'icra avukat ücreti'],
      },
      'banka-icra-takibi': {
        angle: 'Banka alacaklı',
        title: 'Banka İcra Takibi Gelirse',
        h1: 'Bankadan icra gelince ne yapılmalı?',
        description: 'İtiraz ve yapılandırma. Ana icra ve kredi sayfalarına link.',
        keywords: ['banka icra takibi', 'banka haciz'],
      },
      'e-haciz-nedir': {
        angle: 'Vergi e-haciz',
        title: 'e-Haciz Nedir? (Vergi)',
        h1: 'e-Haciz nedir? Nasıl kalkar?',
        description: 'Vergi e-haciz. Vergi borcu ve banka haczi linkleri.',
        keywords: ['e-haciz nedir', 'vergi e-haciz'],
      },
      'iflas-nedir': {
        angle: 'İflas',
        title: 'İflas Nedir? Konkordato Farkı',
        h1: 'İflas nedir?',
        description: 'İflas ve konkordato ayrımı. Ana icra ve konkordato sayfaları.',
        keywords: ['iflas nedir', 'iflas davası'],
      },
      'konkordato-nedir': {
        angle: 'Konkordato',
        title: 'Konkordato Nedir?',
        h1: 'Konkordato nedir? Kimler başvurur?',
        description: 'Mühlet ve şartlar. İflas farkı sayfasına link.',
        keywords: ['konkordato nedir', 'konkordato mühleti'],
      },
      'iflasin-ertelenmesi': {
        angle: 'Tarihçe / güncel',
        title: 'İflasın Ertelenmesi ve Konkordato',
        h1: 'İflas erteleme hâlâ var mı?',
        description: 'Güncel durum notu. Konkordato ana spoke.',
        keywords: ['iflasın ertelenmesi', 'konkordato iflas farkı'],
      },
      'haciz-ihbarnamesi': {
        angle: '3. kişiye ihbar',
        title: 'Haciz İhbarnamesi Nedir?',
        h1: 'Haciz ihbarnamesi gelirse ne yapılır?',
        description: '99 ihbarname. Banka haczi linki.',
        keywords: ['haciz ihbarnamesi', '99 haciz ihbarnamesi'],
      },
      'istihkak-iddiasi': {
        angle: 'İstihkak',
        title: 'İstihkak İddiası Nedir?',
        h1: 'Haczedilen mal bana aitse ne yaparım?',
        description: '3. kişi mal iddiası. İstihkak davası süresi linki.',
        keywords: ['istihkak iddiası', 'istihkak davası'],
      },
      'istihkak-davasi-sure': {
        angle: 'İstihkak süresi',
        title: 'İstihkak Davası Süresi',
        h1: 'İstihkak davası ne kadar sürede açılır?',
        description: 'Süre notu. İstihkak iddiası sayfasına link.',
        keywords: ['istihkak davası süresi'],
      },
      'borclu-olmadiginin-tespiti': {
        angle: 'Menfi tespit eşanlam',
        title: 'Borçlu Olmadığının Tespiti',
        h1: 'Borçlu olmadığımı nasıl ispatlarım?',
        description: 'Menfi tespit ile ilişki. Menfi tespit ana spoke.',
        keywords: ['borçlu olmadığının tespiti'],
      },
      'satis-bedeli-paylasim': {
        angle: 'Satış parası',
        title: 'İcra Satış Bedelinin Paylaşımı',
        h1: 'İcra satış parası nasıl paylaşılır?',
        description: 'Sıra cetveli ödeme. Sıra cetveli sayfasına link.',
        keywords: ['icra satış bedeli paylaşım'],
      },
      'teminat-hesabi-icra': {
        angle: 'İcra teminatı',
        title: 'İcra Teminat Hesabı',
        h1: 'İcra dosyasında teminat nasıl yatırılır?',
        description: 'İstihkak/satış teminatı. İstihkak sayfasına link.',
        keywords: ['icra teminat', 'istihkak teminat'],
      },
      'aciz-vesikasi': {
        angle: 'Aciz',
        title: 'Aciz Vesikası Nedir?',
        h1: 'Aciz vesikası ne demektir?',
        description: 'İcra aciz belgesi. Ana icra rehberine link.',
        keywords: ['aciz vesikası', 'aciz belgesi icra'],
      },
      'rehinli-alacak': {
        angle: 'Rehinli alacak sırası',
        title: 'Rehinli Alacak İcrada',
        h1: 'Rehinli alacaklı icrada ne yapar?',
        description: 'İpotek/rehin sırası. Sıra cetveli linki.',
        keywords: ['rehinli alacak', 'ipotekli alacak icra'],
      },
      'disciplin-hapsi': {
        angle: 'Disiplin hapsi',
        title: 'Disiplin Hapsi (İcra)',
        h1: 'Disiplin hapsi ne zaman verilir?',
        description: 'Çocuk teslimi vb. Tazyik farkı notu.',
        keywords: ['disiplin hapsi', 'icra disiplin hapsi'],
      },
      'arabuluculuk-anlasma-icra': {
        angle: 'Anlaşma belgesi icra',
        title: 'Arabuluculuk Anlaşması İcra',
        h1: 'Arabuluculuk anlaşması nasıl icra edilir?',
        description: 'İlam niteliği. Arabuluculuk ana ve anlaşma belgesi sayfaları.',
        keywords: ['arabuluculuk anlaşması icra'],
      },
      'mtk-aidat-icra': {
        angle: 'Aidat icrası',
        title: 'Aidat Ödenmezse İcra',
        h1: 'Site aidatı ödenmezse ne yapılır?',
        description: 'Kat mülkiyeti aidat icrası. Aidat ve ana icra linkleri.',
        keywords: ['aidat ödenmezse', 'apartman aidatı icra'],
      },
      'kira-alacagi-icra': {
        angle: 'Kira icrası',
        title: 'Kira Alacağı İçin İcra',
        h1: 'Ödenmeyen kira için icra',
        description: 'Kira alacağı takibi. Ana icra ve kira ihtarı linkleri.',
        keywords: ['kira alacağı icra', 'kira icra takibi'],
      },
      'cocuk-teslimi-icra': {
        angle: 'Çocuk teslimi icrası',
        title: 'Çocuk Teslimi İcrası',
        h1: 'Çocuk teslimi icrası nasıl yapılır?',
        description: 'Kişisel ilişki icrası. Velayet ve disiplin hapsi linkleri.',
        keywords: ['çocuk teslimi icra', 'kişisel ilişki icrası'],
      },
    },
  },

  arabuluculuk: {
    pillar: 'arabuluculuk-nasil-yapilir',
    label: 'Arabuluculuk',
    spokes: {
      'arabuluculuk-anlasma-belgesi': {
        angle: 'Anlaşma belgesi',
        title: 'Arabuluculuk Anlaşma Belgesi',
        h1: 'Arabuluculuk anlaşma belgesi nedir?',
        description: 'İlam niteliği. Süreç ana arabuluculuk rehberinde; icra ayrı.',
        keywords: ['arabuluculuk anlaşma belgesi', 'anlaşma belgesi ilam'],
      },
      'arabuluculuk-anlasma-icra': {
        angle: 'İcra',
        title: 'Arabuluculuk Anlaşmasının İcrası',
        h1: 'Anlaşma belgesi nasıl icra edilir?',
        description: 'İcra yolu. Anlaşma belgesi ve ana arabuluculuk linkleri.',
        keywords: ['arabuluculuk anlaşması icra'],
      },
      'arabuluculuk-ucreti': {
        angle: 'Ücret',
        title: 'Arabuluculuk Ücretini Kim Öder?',
        h1: 'Arabuluculuk ücreti kim öder?',
        description: 'Tarife ve paylaşım. Süreç ana rehberde.',
        keywords: ['arabuluculuk ücreti', 'arabuluculuk tarife'],
      },
      'arabuluculuk-son-tutanak': {
        angle: 'Son tutanak',
        title: 'Arabuluculuk Son Tutanak',
        h1: 'Arabuluculuk son tutanağı ne demektir?',
        description: 'Anlaşamama tutanağı. Dava şartı ana rehberde.',
        keywords: ['arabuluculuk son tutanak', 'anlaşamama tutanağı'],
      },
      'is-arabuluculuk-zorunlu': {
        angle: 'İş davaları',
        title: 'İş Davalarında Zorunlu Arabuluculuk',
        h1: 'Hangi iş davalarında arabuluculuk zorunlu?',
        description: 'İş uyuşmazlığı kapsamı. Ana arabuluculuk ve işe iade linkleri.',
        keywords: ['iş arabuluculuk zorunlu', 'iş davası arabuluculuk'],
      },
      'ticari-arabuluculuk': {
        angle: 'Ticari dava',
        title: 'Ticari Davalarda Arabuluculuk',
        h1: 'Ticari davalarda arabuluculuk zorunlu mu?',
        description: 'Ticari dava şartı. Ana arabuluculuk rehberine link.',
        keywords: ['ticari arabuluculuk', 'ticari dava arabuluculuk'],
      },
      'tuketici-arabuluculuk': {
        angle: 'Tüketici',
        title: 'Tüketici Uyuşmazlıklarında Arabuluculuk',
        h1: 'Tüketici davasında arabuluculuk var mı?',
        description: 'Tüketici arabuluculuk. Hakem heyeti ayrı.',
        keywords: ['tüketici arabuluculuk'],
      },
      'kira-uyusmazligi-arabuluculuk': {
        angle: 'Kira',
        title: 'Kira Uyuşmazlığında Arabuluculuk',
        h1: 'Kira davasında arabuluculuk zorunlu mu?',
        description: 'Kira arabuluculuk. Ana arabuluculuk ve kira artışı linkleri.',
        keywords: ['kira arabuluculuk'],
      },
      'isse-iade-arabuluculuk': {
        angle: 'İşe iade',
        title: 'İşe İade Öncesi Arabuluculuk',
        h1: 'İşe iadede arabuluculuk',
        description: 'İşe iade dava şartı. İşe iade ana ve arabuluculuk linkleri.',
        keywords: ['işe iade arabuluculuk'],
      },
      'arabulucu-nasil-secilir': {
        angle: 'Arabulucu seçimi',
        title: 'Arabulucu Nasıl Seçilir / Atanır?',
        h1: 'Arabulucu nasıl bulunur?',
        description: 'Liste ve atama. Süreç ana rehberde.',
        keywords: ['arabulucu nasıl seçilir', 'arabulucu atama'],
      },
    },
  },

  bosanma: {
    pillar: 'bosanma-davasi-nasil-acilir',
    label: 'Boşanma',
    spokes: {
      'anlasmali-bosanma-sartlari': {
        angle: 'Anlaşmalı şartlar',
        title: 'Anlaşmalı Boşanma Şartları',
        h1: 'Anlaşmalı boşanma şartları nelerdir?',
        description: '1 yıl, irade, protokol. Genel boşanma süreci ana rehberde.',
        keywords: ['anlaşmalı boşanma şartları', 'anlaşmalı boşanma protokolü'],
      },
      'cekismeli-bosanma-sureci': {
        angle: 'Çekişmeli süreç',
        title: 'Çekişmeli Boşanma Davası Süreci',
        h1: 'Çekişmeli boşanma nasıl işler?',
        description: 'Delil ve kusur. Ana boşanma ve özel sebepler ayrı.',
        keywords: ['çekişmeli boşanma', 'çekişmeli boşanma süreci'],
      },
      'bosanma-protokolu-ornegi': {
        angle: 'Protokol içeriği',
        title: 'Boşanma Protokolünde Neler Yazılır?',
        h1: 'Boşanma protokolü nedir?',
        description: 'Nafaka, velayet, mal. Anlaşmalı şartlar sayfasına link.',
        keywords: ['boşanma protokolü', 'anlaşmalı protokol içeriği'],
      },
      'bosanma-maaliyeti': {
        angle: 'Masraf',
        title: 'Boşanma Davası Ne Kadar Tutar?',
        h1: 'Boşanma davası maliyeti',
        description: 'Harç ve vekâlet. Süreç ana boşanma rehberinde.',
        keywords: ['boşanma davası ne kadar tutar', 'boşanma masrafı'],
      },
      'bosanma-sonrasi-soyadi': {
        angle: 'Soyadı',
        title: 'Boşanma Sonrası Soyadı',
        h1: 'Boşanınca soyadı ne olur?',
        description: 'Eski soyad. Ana boşanma rehberine link.',
        keywords: ['boşanma soyadı', 'eski soyada dönüş'],
      },
      'hayata-kast-bosanma': {
        angle: 'Özel sebep',
        title: 'Hayata Kast / Kötü Muamele ile Boşanma',
        h1: 'Hayata kast boşanma sebebi midir?',
        description: 'Özel boşanma sebebi. Çekişmeli süreç linki.',
        keywords: ['hayata kast boşanma', 'kötü muamele boşanma'],
      },
      'terk-sebebiyle-bosanma': {
        angle: 'Terk',
        title: 'Terk Sebebiyle Boşanma',
        h1: 'Terk nedeniyle boşanma nasıl açılır?',
        description: 'Terk ihtarı. Ana boşanma rehberine link.',
        keywords: ['terk sebebiyle boşanma', 'terk ihtarı'],
      },
      'zina-sebebiyle-bosanma': {
        angle: 'Zina',
        title: 'Zina Sebebiyle Boşanma',
        h1: 'Zina nedeniyle boşanma',
        description: 'İspat notu. Çekişmeli süreç linki.',
        keywords: ['zina boşanma', 'zina davası ispat'],
      },
    },
  },

  miras: {
    pillar: 'veraset-ilami-nasil-alinir',
    label: 'Veraset / miras belgesi',
    spokes: {
      'e-devlet-veraset': {
        angle: 'e-Devlet adımları',
        title: 'e-Devlet Veraset İlamı Alma',
        h1: 'e-Devlet ile veraset ilamı',
        description: 'Pratik e-Devlet adımları. Noter/mahkeme yolları ana rehberde.',
        keywords: ['e-devlet veraset ilamı', 'mirasçılık belgesi e-devlet'],
      },
      'e-devlet-miras': {
        angle: 'e-Devlet miras menüsü',
        title: 'e-Devlet Miras İşlemleri',
        h1: 'e-Devlette miras işlemleri nelerdir?',
        description: 'Menü özeti. Veraset alma ana rehberde.',
        keywords: ['e-devlet miras', 'e-devlet veraset işlemleri'],
      },
      'mirascilik-belgesi-nedir': {
        angle: 'Belge tanımı',
        title: 'Mirasçılık Belgesi Nedir?',
        h1: 'Mirasçılık belgesi ne işe yarar?',
        description: 'Veraset ilamı ile ilişki. Alma yolları ana rehberde.',
        keywords: ['mirasçılık belgesi nedir'],
      },
      'miras-payi-nasil-hesaplanir': {
        angle: 'Pay hesabı',
        title: 'Miras Payı Nasıl Hesaplanır?',
        h1: 'Yasal miras payı nasıl hesaplanır?',
        description: 'Zümre ve eş payı. Veraset belgesi ana; saklı pay ayrı.',
        keywords: ['miras payı nasıl hesaplanır', 'yasal mirasçılık pay'],
      },
      'yasal-mirascilar': {
        angle: 'Kimler mirasçı',
        title: 'Yasal Mirasçılar Kimlerdir?',
        h1: 'Yasal mirasçılar kimlerdir?',
        description: 'Zümre listesi. Pay hesabı sayfasına link.',
        keywords: ['yasal mirasçılar', 'mirasçılık sırası'],
      },
      'esin-miras-payi': {
        angle: 'Eş payı',
        title: 'Eşin Miras Payı Ne Kadardır?',
        h1: 'Sağ kalan eşin miras payı',
        description: 'Eş + alt soy senaryoları. Genel pay hesabı linki.',
        keywords: ['eşin miras payı', 'sağ kalan eş miras'],
      },
      'sakli-pay-nedir': {
        angle: 'Saklı pay',
        title: 'Saklı Pay ve Tenkis',
        h1: 'Saklı pay nedir?',
        description: 'Saklı pay oranları. Tenkis davası spoke; pay hesabı linki.',
        keywords: ['saklı pay nedir', 'saklı pay oranları'],
      },
      'tenkis-davasi-nedir': {
        angle: 'Tenkis',
        title: 'Tenkis Davası Nedir?',
        h1: 'Tenkis davası nasıl açılır?',
        description: 'Saklı pay ihlali davası. Saklı pay tanımı linki.',
        keywords: ['tenkis davası', 'saklı pay tenkis'],
      },
      'vasiyetname-nasil-yapilir': {
        angle: 'Vasiyet yapma',
        title: 'Vasiyetname Nasıl Yapılır?',
        h1: 'Vasiyetname nasıl yapılır?',
        description: 'Resmi/el yazılı. İptal ve saklı pay linkleri.',
        keywords: ['vasiyetname nasıl yapılır', 'noter vasiyet'],
      },
      'vasiyetname-iptali': {
        angle: 'İptal',
        title: 'Vasiyetname İptali Davası',
        h1: 'Vasiyetname nasıl iptal ettirilir?',
        description: 'Ehliyet/şekil. Vasiyet yapma linki.',
        keywords: ['vasiyetname iptali'],
      },
      'mirasin-reddi': {
        angle: 'Red',
        title: 'Mirasın Reddi Süresi ve Usul',
        h1: 'Mirasın reddi nasıl yapılır?',
        description: 'Red süresi. Veraset ilamı ana rehberde.',
        keywords: ['mirasın reddi', 'miras reddi süresi'],
      },
      'muris-muvazaasi': {
        angle: 'Muris muvazaası',
        title: 'Muris Muvazaası ve Tapu İptal',
        h1: 'Muris muvazaası davası nedir?',
        description: 'Tapu iptal. Saklı pay ve veraset linkleri.',
        keywords: ['muris muvazaası', 'muris muvazaası tapu iptal'],
      },
      'miras-ortakligi-nedir': {
        angle: 'Elbirliği',
        title: 'Miras Ortaklığı Nedir?',
        h1: 'Miras ortaklığı nasıl yönetilir?',
        description: 'Elbirliği mülkiyeti. İzale ve pay linkleri.',
        keywords: ['miras ortaklığı', 'elbirliği mülkiyeti miras'],
      },
      'miras-paylasim-sozlesmesi': {
        angle: 'Paylaşım sözleşmesi',
        title: 'Miras Paylaşım Sözleşmesi',
        h1: 'Miras nasıl paylaşılır?',
        description: 'Taksim. Pay hesabı ve izale linkleri.',
        keywords: ['miras paylaşım sözleşmesi', 'miras taksimi'],
      },
      'miras-sebebiyle-istihkak': {
        angle: 'İstihkak',
        title: 'Miras Sebebiyle İstihkak',
        h1: 'Miras sebebiyle istihkak nedir?',
        description: 'Malın mirasçıya geçmesi. Veraset ve tapu iptal linkleri.',
        keywords: ['miras sebebiyle istihkak'],
      },
      'veraset-ve-intikal-vergisi': {
        angle: 'Vergi',
        title: 'Veraset ve İntikal Vergisi',
        h1: 'Veraset ve intikal vergisi nasıl ödenir?',
        description: 'Beyan ve oran. Veraset ilamı sonrası adım.',
        keywords: ['veraset ve intikal vergisi', 'miras vergisi'],
      },
      'olume-bagli-tasarruf': {
        angle: 'Ölüme bağlı tasarruf',
        title: 'Ölüme Bağlı Tasarruf Nedir?',
        h1: 'Ölüme bağlı tasarruflar nelerdir?',
        description: 'Vasiyet ve miras sözleşmesi. Vasiyetname linki.',
        keywords: ['ölüme bağlı tasarruf', 'miras sözleşmesi'],
      },
    },
  },
};

/**
 * Madde bridge: bilgi sayfası özet, ranking sinyali mevzuat sayfasına.
 * @type {Record<string, { canonicalPath: string, angle: string, title: string, h1: string, description: string, keywords: string[] }>}
 */
export const MADDE_BRIDGES = {
  'tbk-madde-125': {
    canonicalPath: '/mevzuat/tbk/madde-125',
    angle: 'Vatandaş özeti — tam metin ve şerh mevzuat sayfasında',
    title: 'TBK 125 Zamanaşımı — Vatandaş Özeti',
    h1: 'TBK m.125 zamanaşımı (vatandaş özeti)',
    description:
      'TBK m.125 genel zamanaşımı özeti. Resmî madde metni ve akademik şerh: avfethiguzel.com/mevzuat/tbk/madde-125',
    keywords: ['TBK 125 özet', 'zamanaşımı vatandaş', 'TBK genel zamanaşımı özet'],
  },
  'tbk-madde-49': {
    canonicalPath: '/mevzuat/tbk/madde-49',
    angle: 'Haksız fiil vatandaş özeti',
    title: 'TBK 49 Haksız Fiil — Vatandaş Özeti',
    h1: 'TBK m.49 haksız fiil (özet)',
    description: 'Haksız fiil unsurları özeti. Tam metin ve şerh mevzuat sayfasında.',
    keywords: ['TBK 49 özet', 'haksız fiil özet'],
  },
  'tbk-madde-112': {
    canonicalPath: '/mevzuat/tbk/madde-112',
    angle: 'Temerrüt özeti',
    title: 'TBK 112 Temerrüt — Vatandaş Özeti',
    h1: 'TBK m.112 borçlu temerrüdü (özet)',
    description: 'Temerrüt özeti. Tam metin /mevzuat/tbk/madde-112',
    keywords: ['TBK 112 özet', 'borçlu temerrüdü özet'],
  },
  'tmk-madde-166': {
    canonicalPath: '/mevzuat/tmk/madde-166',
    angle: 'Boşanma maddesi özeti',
    title: 'TMK 166 Boşanma — Vatandaş Özeti',
    h1: 'TMK m.166 boşanma (özet)',
    description: 'Evlilik birliğinin sarsılması özeti. Tam metin mevzuat sayfasında.',
    keywords: ['TMK 166 özet', 'boşanma maddesi özet'],
  },
  'tmk-madde-499': {
    canonicalPath: '/mevzuat/tmk/madde-499',
    angle: 'Yasal miras özeti',
    title: 'TMK 499 Yasal Miras — Özet',
    h1: 'TMK m.499 yasal miras (özet)',
    description: 'Yasal mirasçılık özeti. Tam metin mevzuat sayfasında.',
    keywords: ['TMK 499 özet', 'yasal miras özet'],
  },
  'tck-madde-86': {
    canonicalPath: '/mevzuat/tck/madde-86',
    angle: 'Kasten yaralama özeti',
    title: 'TCK 86 Kasten Yaralama — Özet',
    h1: 'TCK m.86 kasten yaralama (özet)',
    description: 'Suç özeti. Tam metin ve şerh mevzuat sayfasında.',
    keywords: ['TCK 86 özet', 'kasten yaralama özet'],
  },
  'tck-madde-106': {
    canonicalPath: '/mevzuat/tck/madde-106',
    angle: 'Tehdit özeti',
    title: 'TCK 106 Tehdit — Özet',
    h1: 'TCK m.106 tehdit (özet)',
    description: 'Tehdit suçu özeti. Tam metin mevzuat sayfasında.',
    keywords: ['TCK 106 özet', 'tehdit suçu özet'],
  },
  'tck-madde-125': {
    canonicalPath: '/mevzuat/tck/madde-125',
    angle: 'Hakaret özeti',
    title: 'TCK 125 Hakaret — Özet',
    h1: 'TCK m.125 hakaret (özet)',
    description: 'Hakaret suçu özeti. Tam metin mevzuat sayfasında.',
    keywords: ['TCK 125 özet', 'hakaret suçu özet'],
  },
  'hmk-madde-119': {
    canonicalPath: '/mevzuat/hmk/madde-119',
    angle: 'Dava dilekçesi unsurları özeti',
    title: 'HMK 119 Dava Dilekçesi — Özet',
    h1: 'HMK m.119 dava dilekçesi (özet)',
    description: 'Dilekçe unsurları özeti. Tam metin mevzuat sayfasında.',
    keywords: ['HMK 119 özet', 'dava dilekçesi unsurları özet'],
  },
  'hmk-madde-389': {
    canonicalPath: '/mevzuat/hmk/madde-389',
    angle: 'İhtiyati tedbir özeti',
    title: 'HMK 389 İhtiyati Tedbir — Özet',
    h1: 'HMK m.389 ihtiyati tedbir (özet)',
    description: 'Tedbir şartları özeti. Tam metin mevzuat sayfasında.',
    keywords: ['HMK 389 özet', 'ihtiyati tedbir özet'],
  },
  'iik-madde-62': {
    canonicalPath: '/mevzuat/iik/madde-62',
    angle: 'Ödeme emrine itiraz maddesi özeti',
    title: 'İİK 62 Ödeme Emrine İtiraz — Özet',
    h1: 'İİK m.62 ödeme emrine itiraz (özet)',
    description: 'Madde özeti. Tam metin mevzuat; pratik rehber /bilgi/odeme-emrine-itiraz',
    keywords: ['İİK 62 özet', 'ödeme emrine itiraz madde özet'],
  },
  'is-kanunu-madde-17': {
    canonicalPath: '/mevzuat/is-kanunu/madde-17',
    angle: 'İhbar süreleri madde özeti',
    title: 'İş Kanunu 17 İhbar — Özet',
    h1: 'İş Kanunu m.17 bildirim süreleri (özet)',
    description: 'Madde özeti. Tam metin mevzuat; tablo /bilgi/ihbar-suresi-tablosu',
    keywords: ['İş Kanunu 17 özet', 'ihbar maddesi özet'],
  },
  'is-kanunu-madde-25': {
    canonicalPath: '/mevzuat/is-kanunu/madde-25',
    angle: 'Haklı fesih madde özeti',
    title: 'İş Kanunu 25 Haklı Fesih — Özet',
    h1: 'İş Kanunu m.25 haklı fesih (özet)',
    description: 'Madde özeti. Tam metin mevzuat sayfasında.',
    keywords: ['İş Kanunu 25 özet', 'haklı fesih madde özet'],
  },
};

/** slug → { role, pillar?, angle?, clusterKey?, spokeMeta?, bridge? } */
export function resolveSeoRole(slug) {
  if (MADDE_BRIDGES[slug]) {
    return {
      role: 'bridge',
      bridge: MADDE_BRIDGES[slug],
      pillar: null,
      angle: MADDE_BRIDGES[slug].angle,
    };
  }

  // Tahliye cluster öncelikli (kira ile çakışan spoke’lar)
  for (const [key, cluster] of Object.entries(CLUSTERS)) {
    if (cluster.pillar === slug) {
      return { role: 'pillar', pillar: slug, clusterKey: key, angle: null, cluster };
    }
  }

  // Spoke: tahliye önce
  const order = ['tahliye', 'ise_iade', 'kidem', 'nafaka', 'arabuluculuk', 'bosanma', 'miras', 'icra', 'kira'];
  for (const key of order) {
    const cluster = CLUSTERS[key];
    if (!cluster) continue;
    if (cluster.spokes[slug]) {
      return {
        role: 'spoke',
        pillar: cluster.pillar,
        clusterKey: key,
        angle: cluster.spokes[slug].angle,
        spokeMeta: cluster.spokes[slug],
        cluster,
      };
    }
  }

  return { role: 'standard', pillar: null, angle: null };
}

export function getPillarSlugs() {
  return [...new Set(Object.values(CLUSTERS).map((c) => c.pillar))];
}

export function getSpokeSlugs() {
  const s = new Set();
  for (const c of Object.values(CLUSTERS)) {
    for (const k of Object.keys(c.spokes)) s.add(k);
  }
  return [...s];
}
