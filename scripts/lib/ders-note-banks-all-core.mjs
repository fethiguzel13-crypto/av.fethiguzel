/**
 * 28 çekirdek ders — altın standart bankalar (tek tek mükemmelleştirilmiş).
 * Her banka: codeHint, oneLiner, pillars, definitions, traps, examples, mindmap, keyMadde?
 */

function B(o) {
  return o;
}

/** @type {Record<string, object>} */
export const CORE_COURSE_BANKS = {
  // ─── 1. SINIF ───────────────────────────────────────
  'hukuka-giris': B({
    codeHint: 'Hukukun temel kavramları · kaynaklar · dallar',
    oneLiner: 'Hukuk nedir, nereden gelir, nasıl dallanır? Kavramı somut kuruma bağla.',
    pillars: [
      'Hukukun tanımı ve işlevi',
      'Hukuk kuralları ile diğer sosyal kurallar',
      'Hukukun kaynakları (yazılı / yazısız)',
      'Kamu hukuku – özel hukuk ayrımı',
      'Hukuki işlem, hak, borç, ehliyet girişi',
      'Yorum ve uygulama ilkeleri (giriş)',
    ],
    definitions: [
      {
        baslik: 'Hukuk kuralı',
        govde:
          'Toplumsal düzeni sağlamak üzere devletin yaptırım gücüyle desteklenen genel, soyut ve sürekli davranış kurallarıdır.',
      },
      {
        baslik: 'Hukuki işlem',
        govde:
          'Hukuki sonuç doğurmaya yönelik irade beyanıdır. Tek taraflı / çok taraflı; borçlandırıcı / tasarrufi ayrımı önemlidir.',
      },
      {
        baslik: 'Sübjektif hak',
        govde:
          'Hukuk düzeninin kişiye tanıdığı yetkidir. Mutlak / nisbi; ayni / şahsi ayrımları sınav klasikidir.',
      },
      {
        baslik: 'Yaptırım',
        govde:
          'Kurala aykırılığın hukuki sonucudur (ceza, tazminat, butlan, iptal…). Türü, kuralın niteliğine göre değişir.',
      },
    ],
    traps: [
      'Ahlak / din / örf kurallarını hukuk kuralı sanmak (yaptırım ve kaynak farkı).',
      'Kamu–özel ayrımını “devlet taraf mı” diye basitleştirmek.',
      'Hak ile yetkiyi / borç ile yükümlülüğü karıştırmak.',
    ],
    examples: [
      {
        title: 'Kural ayrımı',
        facts: 'Toplumda “komşuya selam” teamülü ile “borç öde” kuralı yan yana anılır.',
        analysis: 'Yaptırım, genellik, devlet gücü. Hangisi hukuk kuralı, hangisi sosyal kural?',
        takeaway: 'Yaptırım + kaynak testi uygula.',
      },
      {
        title: 'Hukuki işlem',
        facts: 'A, B’ye “satıyorum” der; B “alıyorum” der. Ayrıca A tek başına vasiyet yazar.',
        analysis: 'Çok taraflı sözleşme vs tek taraflı ölüme bağlı tasarruf. İrade beyanı + hukuki sonuç.',
        takeaway: 'Taraf sayısı + sonuç türü.',
      },
      {
        title: 'Kamu / özel',
        facts: 'Belediye ruhsat iptali ile komşu gürültü davası.',
        analysis: 'İdari işlem / özel hukuk uyuşmazlığı. Mercı ve usul farklıdır.',
        takeaway: 'İlişkinin niteliği mercı belirler.',
      },
    ],
    mindmap: {
      center: 'Hukuka giriş',
      branches: [
        { label: 'Kavram', items: ['Tanım', 'İşlev', 'Yaptırım'] },
        { label: 'Kaynak', items: ['Kanun', 'Örf', 'İçtihat'] },
        { label: 'Dallar', items: ['Kamu', 'Özel', 'Usul'] },
        { label: 'Araçlar', items: ['Hak', 'İşlem', 'Ehliyet'] },
      ],
    },
    keyMadde: ['Anayasa m.2 (hukuk devleti girişi)', 'TMK m.1 (uygulama)', 'TMK m.2 (dürüstlük)'],
  }),

  'anayasa-1': B({
    codeHint: 'Anayasa hukuku genel esaslar · temel haklar girişi',
    oneLiner: 'Devletin kuruluş ilkeleri + temel hakların çerçevesi. Normlar hiyerarşisini unutma.',
    pillars: [
      'Anayasa kavramı ve türleri',
      'Egemenlik, kuvvetler ayrılığı',
      'Hukuk devleti ve demokratik devlet',
      'Temel hak ve özgürlükler: genel rejim',
      'Sınırlama ölçütleri (ölçülülük vb.)',
      'Anayasa yargısına giriş',
    ],
    definitions: [
      {
        baslik: 'Anayasa',
        govde:
          'Devletin temel organlarını, işleyişini ve bireylerin temel haklarını düzenleyen en üst normdur.',
      },
      {
        baslik: 'Kuvvetler ayrılığı',
        govde:
          'Yasama, yürütme ve yargının birbirinden ayrılması ve denetlenmesi ilkesidir. Katı / yumuşak modeller tartışılır.',
      },
      {
        baslik: 'Hukuk devleti',
        govde:
          'Devletin hukukla bağlı olduğu, işlemlerinin yargı denetimine açık olduğu düzendir.',
      },
      {
        baslik: 'Ölçülülük',
        govde:
          'Hak sınırlamasında elverişlilik, gereklilik ve orantılılık testidir. Anayasa Mahkemesi uygulamasında merkezidir.',
      },
    ],
    traps: [
      'Her sınırlamayı “kamu yararı” deyip geçmek — ölçülülük şart.',
      'Temel hakları yalnızca “liste” ezberlemek; genel rejim unutulur.',
      'Anayasa yargısını idari yargı ile karıştırmak.',
    ],
    examples: [
      {
        title: 'Hak sınırlaması',
        facts: 'Bir yasa, toplantı hakkını genişçe kısıtlar; “güvenlik” gerekçe gösterilir.',
        analysis: 'Anayasal dayanak + ölçülülük (elverişli mi, gerekli mi, orantılı mı?) + özüne dokunma.',
        takeaway: 'Gerekçe yetmez; test yaz.',
      },
      {
        title: 'Normlar hiyerarşisi',
        facts: 'Kanun ile anayasa çelişir iddiası.',
        analysis: 'Üst norm–alt norm. Anayasaya aykırılık yolu (iptal / somut norm / bireysel başvuru ayrımı giriş).',
        takeaway: 'Hangi denetim yolu?',
      },
      {
        title: 'Kuvvetler ayrılığı',
        facts: 'Yürütme, yargı kararını uygulamamakla eleştirilir.',
        analysis: 'Yargı bağımsızlığı ve kararların bağlayıcılığı. Hukuk devleti boyutu.',
        takeaway: 'Denetim ve bağlayıcılık cümlesi kur.',
      },
    ],
    mindmap: {
      center: 'Anayasa I',
      branches: [
        { label: 'Devlet', items: ['Egemenlik', 'Organlar', 'İlkeler'] },
        { label: 'Haklar', items: ['Katalog', 'Sınırlama', 'Güvence'] },
        { label: 'Denetim', items: ['AYM', 'Yargı', 'Siyasal'] },
        { label: 'Norm', items: ['Hiyerarşi', 'Üstünlük'] },
      ],
    },
    keyMadde: ['AY m.2', 'AY m.5', 'AY m.13', 'AY m.14'],
  }),

  'anayasa-2': B({
    codeHint: 'Türk Anayasa düzeni · organlar',
    oneLiner: 'TBMM – Cumhurbaşkanı – yargı: kim neyi yapar, nasıl denetlenir?',
    pillars: [
      'Yasama organı: kuruluş ve işlevler',
      'Yasa yapımı ve denetim',
      'Yürütme: Cumhurbaşkanlığı sistemi çerçevesi',
      'Yargı: bağımsızlık ve tarafsızlık',
      'Anayasa Mahkemesi: iptal, itiraz, bireysel başvuru',
      'Siyasal partiler ve seçim hukukuna giriş',
    ],
    definitions: [
      {
        baslik: 'Yasama yetkisi',
        govde: 'Genel, soyut ve sürekli kurallar koyma yetkisidir. Devredilemezlik ve istisnaları tartışılır.',
      },
      {
        baslik: 'Bireysel başvuru',
        govde:
          'Anayasa ve AİHS kapsamındaki temel hak ihlali iddiasıyla AYM’ye yapılan başvurudur. İkincillik ve kabul edilebilirlik şartları vardır.',
      },
      {
        baslik: 'Somut norm denetimi',
        govde:
          'Görülmekte olan davada uygulanacak kuralın anayasaya aykırılığı itirazıdır. AYM’ye giden yol ve sonuçları ayrı yazılır.',
      },
    ],
    traps: [
      'İptal davası ile bireysel başvuruyu aynı torbaya koymak.',
      'Yürütme işlemlerini hep “idare” sanmak — anayasal organ boyutu.',
      'Yargı bağımsızlığını “keyfilik” sanmak — hukuka bağlılık.',
    ],
    examples: [
      {
        title: 'İptal / itiraz',
        facts: 'Bir kanun hükmü davada uygulanacaktır; taraf anayasaya aykırılık iddia eder.',
        analysis: 'Somut norm denetimi şartları, mahkemenin AYM’ye başvurması, sonuç.',
        takeaway: 'Soyut iptal ≠ somut itiraz.',
      },
      {
        title: 'Bireysel başvuru',
        facts: 'Yargılaması biten kişi, adil yargılanma ihlali iddia eder.',
        analysis: 'Kabul edilebilirlik (süre, başvuru yollarının tüketilmesi, konu). Esas inceleme ayrı.',
        takeaway: 'Önce kabul edilebilirlik filtresi.',
      },
      {
        title: 'Yasama–yürütme',
        facts: 'Cumhurbaşkanlığı kararnamesi ile kanun alanı çakışması iddiası.',
        analysis: 'Yetki alanı, saklı alanlar, yargısal denetim imkânı.',
        takeaway: 'Konu + yetki + denetim yolu.',
      },
    ],
    mindmap: {
      center: 'Anayasa II',
      branches: [
        { label: 'Yasama', items: ['TBMM', 'Yasa', 'Denetim'] },
        { label: 'Yürütme', items: ['CB', 'İşlemler'] },
        { label: 'Yargı', items: ['Bağımsızlık', 'Yüksek mahkemeler'] },
        { label: 'AYM', items: ['İptal', 'İtiraz', 'Bireysel'] },
      ],
    },
    keyMadde: ['AY m.7', 'AY m.8', 'AY m.9', 'AY m.148', 'AY m.148/3'],
  }),

  'roma-hukuku': B({
    codeHint: 'Roma hukuku · ius civile / ius gentium · kurumlar',
    oneLiner: 'Bugünkü medeni hukukun DNA’sı: kişi, mal, borç, dava. Kavramın Roma kökünü bil.',
    pillars: [
      'Roma hukukunun dönemleri ve kaynakları',
      'Kişiler: status, ehliyet',
      'Aile ve miras (giriş)',
      'Eşya: dominium, possessio',
      'Borçlar: contractus, delictum',
      'Usul ve actio düşüncesi',
    ],
    definitions: [
      {
        baslik: 'Ius civile',
        govde: 'Roma yurttaşlarına özgü hukuktur. Ius gentium ise daha evrensel ticaret/ilişki kurallarını ifade eder.',
      },
      {
        baslik: 'Dominium',
        govde: 'Tam mülkiyet yetkisidir. Modern mülkiyet kavramının atası olarak okunur.',
      },
      {
        baslik: 'Actio',
        govde: 'Hak arama yolu / dava formu düşüncesidir. “Hak varsa actio vardır” zihniyeti usul tarihine bağlanır.',
      },
      {
        baslik: 'Possessio',
        govde: 'Zilyetliktir. Mülkiyetten ayrılır; koruma ve ispat işlevi modern zilyetlikle karşılaştırılır.',
      },
    ],
    traps: [
      'Roma kurumunu bugünkü maddeyle birebir eşitlemek (anakronizm).',
      'Possessio ile dominium’u aynı sanmak.',
      'Sadece Latince ezber; bağlantı kurmamak.',
    ],
    examples: [
      {
        title: 'Mülkiyet–zilyetlik',
        facts: 'Bir malı elinde tutan ile malik farklı kişilerdir.',
        analysis: 'Possessio vs dominium. Modern TMK zilyetlik/mülkiyet ayrımına köprü.',
        takeaway: 'Fiilî hâkimiyet ≠ mülkiyet.',
      },
      {
        title: 'Sözleşme / haksız fiil',
        facts: 'Roma’da contractus ve delictum ayrımı.',
        analysis: 'Borç kaynakları. Bugünkü sözleşme–haksız fiil ikiliğine giden yol.',
        takeaway: 'Kaynak ayrımı evrenseldir.',
      },
      {
        title: 'Actio',
        facts: 'Hak var ama hangi yolla aranır?',
        analysis: 'Formül usulü ve hak–dava bağı. Modern dava ehliyeti / hukuki yarar düşüncesine giriş.',
        takeaway: 'Hak + yol birlikte düşün.',
      },
    ],
    mindmap: {
      center: 'Roma hukuku',
      branches: [
        { label: 'Kaynak', items: ['Lex', 'Edictum', 'Iurisprudentia'] },
        { label: 'Kişi', items: ['Status', 'Familia'] },
        { label: 'Mal', items: ['Dominium', 'Possessio'] },
        { label: 'Borç', items: ['Contractus', 'Delictum'] },
      ],
    },
    keyMadde: ['Karşılaştırma: TMK m.683 vd. (mülkiyet)', 'TMK m.973 vd. (zilyetlik)', 'TBK m.49 (haksız fiil girişi)'],
  }),

  'hukuk-felsefesi': B({
    codeHint: 'Hukuk felsefesi ve sosyolojisi',
    oneLiner: 'Hukuk adil mi, etkili mi, meşru mu? Teoriyi somut kurumla konuştur.',
    pillars: [
      'Doğal hukuk – hukuki pozitivizm',
      'Adalet teorilerine giriş',
      'Hukuk ve ahlak ilişkisi',
      'Hukuk sosyolojisi: hukukun toplumsal işlevi',
      'Yorum ve takdir',
      'İnsan hakları felsefesine köprü',
    ],
    definitions: [
      {
        baslik: 'Hukuki pozitivizm',
        govde: 'Hukuku, olgusal olarak konmuş kurallar bütünü olarak gören yaklaşımdır. “Geçerli hukuk” ile “adil hukuk” ayrılabilir.',
      },
      {
        baslik: 'Doğal hukuk',
        govde: 'Hukukun ahlaki/ussal bir temele dayandığını; adaletten kopuk kuralın “hukuk” sayılmayabileceğini savunan yaklaşımlar ailesidir.',
      },
      {
        baslik: 'Meşruiyet',
        govde: 'İktidarın ve kuralların kabul edilebilirlik zeminidir. Rıza, usul ve adalet tartışmalarıyla bağlanır.',
      },
    ],
    traps: [
      'Felsefeyi “güzel söz” yazısı sanmak — tez + karşı tez + örnek kurum.',
      'Pozitivizmi “ahlaksız hukuk” diye karikatürize etmek.',
      'Somut maddeye hiç inmemek.',
    ],
    examples: [
      {
        title: 'Adaletsiz yasa',
        facts: 'Biçimsel olarak usulüne uygun çıkmış ama ağır adaletsiz bir kural tartışılır.',
        analysis: 'Pozitivist geçerlilik vs doğal hukuk eleştirisi. Radbruch formülü girişi (dikkatli).',
        takeaway: 'Geçerlilik ≠ meşruiyet tartışmasını ayır.',
      },
      {
        title: 'Yorum',
        facts: 'Hakim belirsiz bir kuralı somut olaya uygular.',
        analysis: 'Yorum yöntemleri + takdir. Keyfilik iddiasına karşı gerekçe zorunluluğu.',
        takeaway: 'Yorum gerekçeyle gösterilir.',
      },
      {
        title: 'Toplumsal etki',
        facts: 'Bir yasa değişikliği toplumsal davranışı değiştirmez iddiası.',
        analysis: 'Hukuk sosyolojisi: etkililik, bilme, yaptırım, kültür.',
        takeaway: 'Kâğıt üzerindeki kural ≠ saha.',
      },
    ],
    mindmap: {
      center: 'Hukuk felsefesi',
      branches: [
        { label: 'Teori', items: ['Pozitivizm', 'Doğal hukuk'] },
        { label: 'Adalet', items: ['Dağıtıcı', 'Denkleştirici'] },
        { label: 'Toplum', items: ['Etkililik', 'Meşruiyet'] },
        { label: 'Uygulama', items: ['Yorum', 'Takdir'] },
      ],
    },
    keyMadde: ['AY m.2', 'TMK m.1', 'TMK m.4 (hakkaniyet / takdir)'],
  }),

  // ─── 2. SINIF (eksikler) ────────────────────────────
  'idare-hukuku': B({
    codeHint: 'İdare hukuku · idari işlem · kamu gücü',
    oneLiner: 'İdare kamu gücüyle işlem yapar; yetki–şekil–sebep–konu–amaç test edilir.',
    pillars: [
      'İdare ve kamu tüzel kişiliği',
      'İdari işlem: tanım ve unsurlar',
      'Yetki, şekil, sebep, konu, amaç',
      'İdari sözleşmeler girişi',
      'Kamu malları',
      'İdarenin sorumluluğu girişi',
    ],
    definitions: [
      {
        baslik: 'İdari işlem',
        govde:
          'İdarenin kamu gücü kullanarak, tek yanlı iradesiyle hukukî sonuç doğuran işlemidir. Birel / düzenleyici ayrımı önemlidir.',
      },
      {
        baslik: 'Yetki',
        govde: 'İşlemi yapmaya kanunen ehil makamdır. Yetkisizlik işlemi sakatlar; türleri (kişisel, konu, yer, zaman) yazılır.',
      },
      {
        baslik: 'Kamu yararı',
        govde: 'İdari faaliyetin yöneldiği kollektif yarardır. Amaç unsurunda sapma, sakatlık doğurabilir.',
      },
      {
        baslik: 'Takdir yetkisi',
        govde: 'İdarenin kanunun çizdiği çerçevede seçim yapabilmesidir. Keyfilik değildir; hukuka uygunluk denetimine tabidir.',
      },
    ],
    traps: [
      'İdari işlemi özel hukuk işlemi gibi “icapsız” anlatmak.',
      'Takdir yetkisini yargı denetimi dışı sanmak.',
      'Beş unsuru (yetki şekil sebep konu amaç) eksik yazmak.',
    ],
    examples: [
      {
        title: 'Ruhsat iptali',
        facts: 'Belediye, işletme ruhsatını iptal eder; gerekçe belirsizdir.',
        analysis: 'Yetki + sebep + amaç. Gerekçesizlik / sebep sakatlığı. İptal davası yolu (İYUK girişi).',
        takeaway: 'Sebep somut ve hukuka uygun olmalı.',
      },
      {
        title: 'Yetkisizlik',
        facts: 'Yanlış makam işlem yapar.',
        analysis: 'Yetki unsuru. İşlemin yokluk/iptal yaptırımı tartışması (öğreti dikkatli).',
        takeaway: 'Önce “kim yaptı?”',
      },
      {
        title: 'Takdir',
        facts: 'İdare iki seçenekten birini tercih eder; eşitlik iddiası doğar.',
        analysis: 'Takdir yetkisinin sınırları, eşitlik, ölçülülük, keyfilik yasağı.',
        takeaway: 'Takdir ≠ keyfilik.',
      },
    ],
    mindmap: {
      center: 'İdare hukuku',
      branches: [
        { label: 'Özne', items: ['İdare', 'Kamu tüzel kişisi'] },
        { label: 'İşlem', items: ['Unsurlar', 'Sakatlık'] },
        { label: 'Sözleşme', items: ['İdari sözleşme'] },
        { label: 'Sorumluluk', items: ['Hizmet kusuru', 'Kusursuz'] },
      ],
    },
    keyMadde: ['İYUK m.2', 'İYUK m.7 (süre girişi)', 'AY m.125'],
  }),

  'milletlerarasi-hukuk': B({
    codeHint: 'Milletlerarası (uluslararası) hukuk',
    oneLiner: 'Devletlerarası düzen: kaynak, kişilik, sorumluluk, kuvvet kullanma yasağı.',
    pillars: [
      'Uluslararası hukukun niteliği ve kaynakları (antlaşma, teamül)',
      'Devlet ve uluslararası örgütler',
      'Antlaşmalar hukuku girişi',
      'Devletlerin yetkisi ve bağışıklık',
      'Uluslararası sorumluluk',
      'Kuvvet kullanma yasağı ve istisnalar (giriş)',
    ],
    definitions: [
      {
        baslik: 'Uluslararası teamül',
        govde: 'Devlet uygulaması + hukuki inanç (opinio juris) ile oluşan yazılı olmayan kaynaktır.',
      },
      {
        baslik: 'Antlaşma',
        govde: 'Uluslararası hukuk kişileri arasında yazılı ve hukukî bağ yaratma iradesiyle yapılan anlaşmadır.',
      },
      {
        baslik: 'Egemen eşitlik',
        govde: 'Devletlerin hukukî eşitliği ilkesidir. BM sisteminin temel taşlarından biridir.',
      },
    ],
    traps: [
      'İç hukuk ile uluslararası hukuku aynı yargı kolu sanmak.',
      'Teamülü “alışkanlık” diye küçümsemek — opinio juris şart.',
      'Kuvvet kullanma yasağının istisnalarını ezbere şişirmek.',
    ],
    examples: [
      {
        title: 'Antlaşma bağlayıcılığı',
        facts: 'Devlet imzaladığı antlaşmayı iç siyasete aykırı bulur.',
        analysis: 'Pacta sunt servanda. İç hukuk mazereti kural olarak ileri sürülemez (Viyana Konvansiyonu zihniyeti).',
        takeaway: 'Uluslararası taahhüt ciddiyet ister.',
      },
      {
        title: 'Teamül',
        facts: 'Yazılı antlaşma yok; uzun uygulama var.',
        analysis: 'Uygulama + opinio juris. İspat zorluğu.',
        takeaway: 'İki unsur birlikte.',
      },
      {
        title: 'Sorumluluk',
        facts: 'Devlet organı hukuka aykırı fiil işler.',
        analysis: 'Atfedilebilirlik + ihlal. Zarar ve tazmin.',
        takeaway: 'Organ fiili devlete bağlanır.',
      },
    ],
    mindmap: {
      center: 'Milletlerarası hukuk',
      branches: [
        { label: 'Kaynak', items: ['Antlaşma', 'Teamül', 'Genel ilkeler'] },
        { label: 'Kişiler', items: ['Devlet', 'Örgüt'] },
        { label: 'Yüküm', items: ['Sorumluluk', 'Bağışıklık'] },
        { label: 'Barış', items: ['Kuvvet yasağı', 'BM'] },
      ],
    },
    keyMadde: ['BM Antlaşması m.2/4', 'Viyana Antlaşmalar Hukuku Konvansiyonu (zihniyet)', 'AY m.90'],
  }),

  'ticari-isletme': B({
    codeHint: 'TTK ticari işletme · tacir · ticaret unvanı',
    oneLiner: 'Ticari işletme + tacir sıfatı = TTK’nın kapısı. Sıfatı doğru tespit et.',
    pillars: [
      'Ticari işletme kavramı',
      'Tacir sıfatı ve sonuçları',
      'Ticaret unvanı ve işletme adı',
      'Ticari iş karinesi ve faiz',
      'Haksız rekabet girişi',
      'Cari hesap / ticari defterlere giriş',
    ],
    definitions: [
      {
        baslik: 'Ticari işletme',
        govde:
          'Esnaf işletmesi için öngörülen sınırı aşan düzeyde gelir sağlamayı hedefleyen faaliyetlerin devamlı ve bağımsız şekilde yürütüldüğü birimdir (TTK çerçevesi).',
      },
      {
        baslik: 'Tacir',
        govde: 'Bir ticari işletmeyi kısmen de olsa kendi adına işleten kişidir. Sıfatın sonuçları (iflas, faiz, basiretli iş adamı) ağırdır.',
      },
      {
        baslik: 'Ticari iş karinesi',
        govde: 'Tacirler bakımından bir işin ticari sayılmasına ilişkin karinedir. İspat yükünü etkiler.',
      },
      {
        baslik: 'Haksız rekabet',
        govde: 'Aldatıcı veya dürüstlük kuralına aykırı rekabet uygulamalarıdır. TTK’da özel rejim vardır.',
      },
    ],
    traps: [
      'Esnaf ile taciri karıştırmak.',
      'Tacir sıfatının sonuçlarını yazmamak (sadece tanım).',
      'Ticari iş karinesini her olaya körlemesine basmak.',
    ],
    examples: [
      {
        title: 'Tacir sıfatı',
        facts: 'Kişi dükkân işletir; “ben esnafım” der; alacaklı ticari faiz ister.',
        analysis: 'İşletme ölçeği + devamlılık + bağımsızlık. Sıfat sonucu: faiz, ispat, iflas vb.',
        takeaway: 'Önce sıfat, sonra sonuç.',
      },
      {
        title: 'Unvan',
        facts: 'İki işletme benzer unvan kullanır.',
        analysis: 'Unvanın ayırt ediciliği, tescil, haksız rekabet kesişimi.',
        takeaway: 'Karışıklık riski testi.',
      },
      {
        title: 'Haksız rekabet',
        facts: 'Rakip, yanıltıcı reklam yapar.',
        analysis: 'Dürüstlük / aldatıcılık. Talepler: men, maddi-manevi, tazminat.',
        takeaway: 'Fiil + zarar + illiyet.',
      },
    ],
    mindmap: {
      center: 'Ticari işletme',
      branches: [
        { label: 'İşletme', items: ['Tanım', 'Esnaf sınırı'] },
        { label: 'Tacir', items: ['Sıfat', 'Sonuçlar'] },
        { label: 'Kimlik', items: ['Unvan', 'İşletme adı'] },
        { label: 'Piyasa', items: ['Haksız rekabet', 'Defter'] },
      ],
    },
    keyMadde: ['TTK m.11 vd.', 'TTK m.12', 'TTK m.18', 'TTK m.54 vd.'],
  }),

  // ─── 3. SINIF ───────────────────────────────────────
  'borclar-ozel': B({
    codeHint: 'TBK özel borç ilişkileri (satım, kira, eser, vekâlet…)',
    oneLiner: 'Her sözleşme tipinin kendi omurgası var: satım ≠ kira ≠ eser ≠ vekâlet.',
    pillars: [
      'Satım: devir, ayıp, zapto',
      'Kira: kullanım, bedel, tahliye sebepleri girişi',
      'Eser: sonuç borcu, ayıp',
      'Vekâlet: özen borcu',
      'Kefalet / garanti girişi',
      'Tip seçimi ve karma sözleşmeler',
    ],
    definitions: [
      {
        baslik: 'Satım',
        govde: 'Saticının satılanın zilyetlik ve mülkiyetini devir, alıcının semeni ödeme borcudur.',
      },
      {
        baslik: 'Ayıp',
        govde: 'Satılandaki değer veya yarara ilişkin eksikliktir. Bildirim ve seçimlik haklar süreye bağlıdır.',
      },
      {
        baslik: 'Eser sözleşmesi',
        govde: 'Yüklenicinin bir eser meydana getirip teslim, iş sahibinin bedel ödeme borcudur. Sonuç borcu vurgusu vardır.',
      },
      {
        baslik: 'Vekâlet',
        govde: 'Vekilin vekâlet verenin menfaatine ve iradesine uygun iş görmesidir. Özen ve sadakat borçları merkezidir.',
      },
    ],
    traps: [
      'Eser ile vekâleti karıştırmak (sonuç borcu vs özen).',
      'Kira tahliyesini tek maddeye indirgemek.',
      'Ayıp bildirim süresini atlamak.',
    ],
    examples: [
      {
        title: 'Ayıplı satım',
        facts: 'Alıcı malı devralır; sonra gizli ayıp ortaya çıkar.',
        analysis: 'Gözden geçirme + bildirim + seçimlik haklar (dönme, indirim, onarım, yenisi). Süreler.',
        takeaway: 'Bildirim kaçarsa hak zayıflar.',
      },
      {
        title: 'Eser ayıbı',
        facts: 'İnşaat teslim edilir; çatlaklar çıkar.',
        analysis: 'Eserin ayıplı ifası. İş sahibinin hakları. Zamanaşımı özel rejimleri.',
        takeaway: 'Eser = sonuç; ayıp rejimini yaz.',
      },
      {
        title: 'Vekâlette özen',
        facts: 'Avukat / danışman süre kaçırır.',
        analysis: 'Özen borcu ölçüsü (basiretli vekil). Tazminat. Vekâlet sözleşmesi ispatı.',
        takeaway: 'Özen + illiyet + zarar.',
      },
    ],
    mindmap: {
      center: 'TBK özel',
      branches: [
        { label: 'Satım', items: ['Devir', 'Ayıp', 'Zapto'] },
        { label: 'Kira', items: ['Kullanım', 'Bedel', 'Tahliye'] },
        { label: 'Eser', items: ['Sonuç', 'Ayıp'] },
        { label: 'Vekâlet', items: ['Özen', 'Sadakat'] },
      ],
    },
    keyMadde: ['TBK m.207 vd.', 'TBK m.299 vd.', 'TBK m.470 vd.', 'TBK m.502 vd.'],
  }),

  'ceza-ozel': B({
    codeHint: 'TCK özel hükümler (kişilere / mallara karşı suçlar…)',
    oneLiner: 'Her suç tipinin kendi kanuni tanımı var: unsurları tipte ara, genel hükümlerle birleştir.',
    pillars: [
      'Kasten öldürme / yaralama',
      'Taksirle öldürme / yaralama',
      'Hakaret ve özel hayat',
      'Hırsızlık – yağma – dolandırıcılık',
      'Güveni kötüye kullanma / karşılıksız yararlanma',
      'Genel hükümlerle içtima / teşebbüs bağlantısı',
    ],
    definitions: [
      {
        baslik: 'Yaralama',
        govde: 'Vücut dokunulmazlığına karşı kasten işlenen fiillerdir. Netice ve nitelikli hâller cezayı değiştirir.',
      },
      {
        baslik: 'Hırsızlık',
        govde: 'Zilyedinin rızası olmadan malı bulunduğu yerden alma fiilidir. Yağmadan rıza/ cebir farkıyla ayrılır.',
      },
      {
        baslik: 'Dolandırıcılık',
        govde: 'Hileli davranışlarla bir kimseyi aldatıp yarar sağlama fiilidir. Hile + zarar + illiyet yazılmalıdır.',
      },
    ],
    traps: [
      'Genel hükümleri (kast, teşebbüs) özel tipe uygulamadan yazmak.',
      'Hırsızlık / yağma / dolandırıcılık sınırını bulanık bırakmak.',
      'Nitelikli hâlleri “ağırlaşmış” diye geçiştirmek — maddeyi işaretle.',
    ],
    examples: [
      {
        title: 'Yaralama neticesi',
        facts: 'Tartışmada tokat; kemik kırığı oluşur.',
        analysis: 'Kastın kapsamı, netice sebebiyle ağırlaşmış yaralama, delil.',
        takeaway: 'Neticeyi kastla bağla.',
      },
      {
        title: 'Hırsızlık mı dolandırıcılık mı?',
        facts: 'Fail, sahte kimlikle mal teslim alır.',
        analysis: 'Rıza sakatlığı / hile. Zilyetliğin devri. Tip seçimi.',
        takeaway: 'Rıza nasıl oluştu?',
      },
      {
        title: 'Teşebbüs',
        facts: 'Hırsızlık için içeri girer, malı alamadan yakalanır.',
        analysis: 'İcra başlangıcı + elverişlilik. Gönüllü vazgeçme var mı?',
        takeaway: 'Özel tip + genel teşebbüs.',
      },
    ],
    mindmap: {
      center: 'Ceza özel',
      branches: [
        { label: 'Kişi', items: ['Öldürme', 'Yaralama', 'Hakaret'] },
        { label: 'Mal', items: ['Hırsızlık', 'Yağma', 'Dolandırıcılık'] },
        { label: 'Güven', items: ['Güveni kötüye kullanma'] },
        { label: 'Genel', items: ['Teşebbüs', 'İştirak', 'İçtima'] },
      ],
    },
    keyMadde: ['TCK m.81 vd.', 'TCK m.86 vd.', 'TCK m.141 vd.', 'TCK m.157'],
  }),

  'ceza-muhakemesi': B({
    codeHint: 'CMK · soruşturma–kovuşturma',
    oneLiner: 'Delil hukuka uygun mu, haklar korundu mu, usul tamam mı?',
    pillars: [
      'Soruşturma ve kovuşturma aşamaları',
      'Şüpheli / sanık hakları',
      'Koruma tedbirleri (yakalama, tutuklama, arama, el koyma)',
      'İddianame ve duruşma',
      'Delil ve yasak deliller',
      'Kanun yolları girişi',
    ],
    definitions: [
      {
        baslik: 'Soruşturma',
        govde: 'Suç şüphesinin öğrenilmesinden iddianamenin kabulüne kadar süren aşamadır. Cumhuriyet savcısı yönetir.',
      },
      {
        baslik: 'Tutuklama',
        govde: 'Kuvvetli suç şüphesi + tutuklama nedeni + ölçülülük şartlarına bağlı koruma tedbiridir. Gerekçe zorunludur.',
      },
      {
        baslik: 'Yasak delil',
        govde: 'Hukuka aykırı elde edilen ve yargılamada kullanılamayan delildir. Elde ediliş usulü kritiktir.',
      },
      {
        baslik: 'İddianame',
        govde: 'Savcının kamu davası açmak üzere mahkemeye sunduğu belgedir. İade sebepleri ayrı rejimdir.',
      },
    ],
    traps: [
      'Tutuklamayı “otomatik ceza” sanmak.',
      'Arama–elkoyma şekil şartlarını yazmamak.',
      'Maddi gerçeği usulsüz delille “kanıtladım” demek.',
    ],
    examples: [
      {
        title: 'Tutuklama incelemesi',
        facts: 'Şüpheli tutuklanır; “kaçma şüphesi” genel cümleyle yazılır.',
        analysis: 'Kuvvetli şüphe + somut tutuklama nedeni + adli kontrol alternatifi + ölçülülük.',
        takeaway: 'Somut gerekçe şart.',
      },
      {
        title: 'Yasak delil',
        facts: 'Rıza dışı, usulsüz dinleme kaydı dosyaya konur.',
        analysis: 'Elde ediliş hukuka aykırı mı? Değerlendirme yasağı. Zincirleme etki tartışması.',
        takeaway: 'Nasıl elde edildi?',
      },
      {
        title: 'İddianame iadesi',
        facts: 'Eksik soruşturma ile dava açılır.',
        analysis: 'CMK iddianame unsurları ve iade. Kovuşturma kapısı erken açılmaz.',
        takeaway: 'Dosya olgun mu?',
      },
    ],
    mindmap: {
      center: 'CMK',
      branches: [
        { label: 'Aşama', items: ['Soruşturma', 'Kovuşturma'] },
        { label: 'Haklar', items: ['Müdafi', 'Susma', 'Bilgi'] },
        { label: 'Tedbir', items: ['Tutuklama', 'Arama', 'El koyma'] },
        { label: 'Delil', items: ['Hukuka uygunluk', 'Yasak'] },
      ],
    },
    keyMadde: ['CMK m.2', 'CMK m.100 vd.', 'CMK m.116 vd.', 'CMK m.170', 'CMK m.206'],
  }),

  'is-hukuku': B({
    codeHint: 'İş K. · iş sözleşmesi · güvenceler',
    oneLiner: 'İşçi–işveren: sözleşme türü, fesih, kıdem/ihbar, işe iade, arabuluculuk.',
    pillars: [
      'İş sözleşmesi ve türleri',
      'İşçi / işveren / işyeri',
      'Çalışma ve dinlenme süreleri girişi',
      'Fesih: bildirimli / bildirimsiz',
      'Kıdem ve ihbar',
      'İşe iade ve arabuluculuk (dava şartı)',
    ],
    definitions: [
      {
        baslik: 'İş sözleşmesi',
        govde: 'Bir tarafın (işçi) bağımlı olarak iş görmeyi, diğer tarafın (işveren) ücret ödemeyi üstlendiği sözleşmedir.',
      },
      {
        baslik: 'Kıdem tazminatı',
        govde: 'Kanunda sayılan hallerde işçinin yıpranma karşılığı niteliğindeki tazminattır. Şartlar ve tavan ayrı yazılır.',
      },
      {
        baslik: 'İşe iade',
        govde: 'Belirli şartlarda feshin geçersizliğinin tespiti ve işe iadeye ilişkin özel rejimdir. Süre ve arabuluculuk kritiktir.',
      },
      {
        baslik: 'Geçerli fesih',
        govde: 'İşletme / işyeri / işin gerekleri veya işçinin yeterliliği-davranışları sebebine dayanan, keyfi olmayan fesihtir (iş güvencesi kapsamında).',
      },
    ],
    traps: [
      'Her feshin kıdem doğurduğunu sanmak.',
      'İşe iade sürelerini kaçırmak.',
      'Arabuluculuk dava şartını unutmak.',
    ],
    examples: [
      {
        title: 'Fesih ve kıdem',
        facts: 'İşveren işçiyi “performans” gerekçesiyle çıkarır; kıdem ister.',
        analysis: 'Fesih türü, haklı neden, kıdem şartları, ispat. İbraname / ibraname denetimi.',
        takeaway: 'Fesih sebebi dosyayı böler.',
      },
      {
        title: 'İşe iade',
        facts: '30+ işçi işyeri; 6+ ay kıdemli işçi; belirsiz süreli sözleşme.',
        analysis: 'İş güvencesi kapsamı + süre + arabuluculuk + feshin geçersizliği.',
        takeaway: 'Kapsam + süre + arabuluculuk.',
      },
      {
        title: 'Fazla çalışma',
        facts: 'İşçi fazla mesai alacağı ister; bordroda imza vardır.',
        analysis: 'İspat, gerçeğe aykırı ibraname, tanık/delil. Ücret alacaklarında zamanaşımı.',
        takeaway: 'İmza tek başına bitirmez her zaman.',
      },
    ],
    mindmap: {
      center: 'İş hukuku',
      branches: [
        { label: 'Sözleşme', items: ['Tür', 'Hükümler'] },
        { label: 'Fesih', items: ['Bildirim', 'Haklı neden'] },
        { label: 'Alacak', items: ['Kıdem', 'İhbar', 'Ücret'] },
        { label: 'Güvence', items: ['İşe iade', 'Arabuluculuk'] },
      ],
    },
    keyMadde: ['İş K. m.8', 'İş K. m.17', 'İş K. m.18 vd.', 'İş K. m.25', '7036 s. K. (arabuluculuk)'],
  }),

  'vergi-hukuku': B({
    codeHint: 'Vergi hukuku · VUK · tarh–tebliğ–tahsil',
    oneLiner: 'Vergi ödevi anayasal; usul (tarh, tebliğ, dava) kaçırılırsa hak kaybı riski büyür.',
    pillars: [
      'Verginin anayasal temelleri',
      'Vergi ödevi ve taraflar',
      'Tarh, tebliğ, tahakkuk, tahsil',
      'Vergi hataları ve düzeltme',
      'Vergi cezaları girişi',
      'Vergi yargısı ve süreler',
    ],
    definitions: [
      {
        baslik: 'Tarh',
        govde: 'Vergi alacağının hesaplanarak miktar olarak saptanmasıdır.',
      },
      {
        baslik: 'Tebliğ',
        govde: 'Vergi işlemlerinin muhataba bildirilmesi usulüdür. Süreler çoğunlukla tebliğden işler.',
      },
      {
        baslik: 'Vergi ziyaı',
        govde: 'Vergi alacağının zamanında tarh/tahakkuk ettirilmemesi veya eksik ettirilmesidir (ceza rejimine bağlanır).',
      },
    ],
    traps: [
      'Dava süresini “genel 60 gün” diye her yere basmak — somut yolu kontrol et.',
      'İdari itiraz / dava ayrımını karıştırmak.',
      'Tebliğ usulünü yok saymak.',
    ],
    examples: [
      {
        title: 'Tebliğ ve süre',
        facts: 'İkmalen tarhiyat yapılır; mükellef geç öğrenir.',
        analysis: 'Tebliğ tarihi + dava/itiraz süresi. Usulsüz tebliğ iddiası.',
        takeaway: 'Takvim tebliğle başlar.',
      },
      {
        title: 'Hata düzeltme',
        facts: 'Hesap hatası vardır; ceza da kesilmiştir.',
        analysis: 'Vergi hatası türleri, düzeltme yolu, ceza ilişkisi.',
        takeaway: 'Hata mı ziya mı?',
      },
      {
        title: 'Yargı yolu',
        facts: 'Mükellef tarhiyatı haksız bulur.',
        analysis: 'Vergi mahkemesi, süre, yürütmenin durdurulması girişi.',
        takeaway: 'Doğru merci + süre.',
      },
    ],
    mindmap: {
      center: 'Vergi hukuku',
      branches: [
        { label: 'Esas', items: ['Ödev', 'Matrah', 'Oran'] },
        { label: 'Usul', items: ['Tarh', 'Tebliğ', 'Tahsil'] },
        { label: 'Yaptırım', items: ['Ziya', 'Usulsüzlük'] },
        { label: 'Yargı', items: ['Dava', 'Süre'] },
      ],
    },
    keyMadde: ['AY m.73', 'VUK tarh–tebliğ hükümleri', 'İYUK / vergi yargısı süreleri'],
  }),

  'idari-yargilama': B({
    codeHint: 'İYUK · iptal ve tam yargı',
    oneLiner: 'İdari işleme karşı: doğru dava türü, doğru süre, doğru merci.',
    pillars: [
      'İdari yargının görev alanı',
      'İptal davası',
      'Tam yargı davası',
      'Dava açma süreleri',
      'Yürütmenin durdurulması',
      'Kararların uygulanması',
    ],
    definitions: [
      {
        baslik: 'İptal davası',
        govde: 'İdari işlemin yetki, şekil, sebep, konu, amaç yönlerinden hukuka aykırılığı nedeniyle iptalini isteyen davadır.',
      },
      {
        baslik: 'Tam yargı davası',
        govde: 'İdari eylem/işlemden doğan zararların tazminine yönelik davadır.',
      },
      {
        baslik: 'Subjektif ehliyet (menfaat)',
        govde: 'İptal davasında güncel ve meşru bir menfaat bağının varlığıdır. Herkes dava açamaz.',
      },
    ],
    traps: [
      'Süre kaçırıp esasa girilmesini beklemek.',
      'İptal ile tam yargıyı aynı dilekçede plansız karıştırmak (bağlantı kuralları).',
      'Menfaat bağını yazmamak.',
    ],
    examples: [
      {
        title: 'İptal süresi',
        facts: 'İşlem tebliğ edilir; 80 gün sonra dava açılır.',
        analysis: 'Kural süre + tebliğ. Hak düşürücü nitelik. İstisnai süreler.',
        takeaway: 'Süre dosyanın kaderidir.',
      },
      {
        title: 'YD (yürütmenin durdurulması)',
        facts: 'İşlem uygulanırsa telafisi güç zarar doğacak.',
        analysis: 'Hukuka aykırılık görünümü + telafisi güç zarar. Teminat.',
        takeaway: 'İki şart birlikte.',
      },
      {
        title: 'Tam yargı',
        facts: 'İdari eylemle zarar doğar; işlem yoktur.',
        analysis: 'Ön karar / başvuru yolları, süre, zarar–illiyet–hizmet kusuru.',
        takeaway: 'Zarar dosyası ayrı iskelet ister.',
      },
    ],
    mindmap: {
      center: 'İdari yargı',
      branches: [
        { label: 'Dava', items: ['İptal', 'Tam yargı'] },
        { label: 'Kapı', items: ['Görev', 'Menfaat', 'Süre'] },
        { label: 'Geçici', items: ['YD'] },
        { label: 'Sonuç', items: ['İptal', 'Tazmin', 'Uygulama'] },
      ],
    },
    keyMadde: ['İYUK m.2', 'İYUK m.7', 'İYUK m.27', 'AY m.125'],
  }),

  // ─── 4. SINIF ───────────────────────────────────────
  'ticaret-sirketler': B({
    codeHint: 'TTK şirketler (AŞ, Ltd. Şti.)',
    oneLiner: 'Tüzel kişilik + organlar + pay/ortaklık hakları + sorumluluk.',
    pillars: [
      'Ticaret şirketlerinin ortak hükümleri',
      'Anonim şirket: organlar',
      'Limited şirket: yapı ve devir',
      'Pay / esas sermaye',
      'Temsil ve sorumluluk',
      'Sona erme / tasfiye girişi',
    ],
    definitions: [
      {
        baslik: 'Anonim şirket',
        govde: 'Sermayesi belirli ve paylara bölünmüş, borçlarından dolayı yalnız malvarlığıyla sorumlu şirkettir.',
      },
      {
        baslik: 'Limited şirket',
        govde: 'Bir veya daha fazla ortaklı, sermayesi belli, ortakların sorumluluğu kural olarak koydukları sermaye ile sınırlı şirkettir.',
      },
      {
        baslik: 'Organ',
        govde: 'Tüzel kişinin iradesini oluşturan ve yürüten zorunlu yapılardır (GK, YK, murakabe vb.).',
      },
    ],
    traps: [
      'AŞ ile Ltd farkını “sadece isim” sanmak.',
      'Temsil yetkisini iç yönergeyle sınırsız sanmak (iyiniyetli üçüncü kişi).',
      'Pay devrini her şirkette aynı usulle yazmak.',
    ],
    examples: [
      {
        title: 'Temsil',
        facts: 'Müdür, şirket adına olağandışı borçlanır.',
        analysis: 'Temsil yetkisi, tescil, iyiniyetli üçüncü kişi, iç ilişki–dış ilişki.',
        takeaway: 'Dışa karşı görünüm önemli.',
      },
      {
        title: 'Pay devri (Ltd)',
        facts: 'Ortak payını satar; şirket onaylamaz.',
        analysis: 'Ltd’de devir kısıtları, genel kurul, tescil.',
        takeaway: 'Ltd payı serbestçe devredilmeyebilir.',
      },
      {
        title: 'Sorumluluk',
        facts: 'Şirket borcu ödenmez; alacaklı ortağa gider.',
        analysis: 'Tüzel kişilik perdesi, istisnai sorumluluk hâlleri (dikkatli).',
        takeaway: 'Kural: şirket malvarlığı.',
      },
    ],
    mindmap: {
      center: 'Şirketler',
      branches: [
        { label: 'AŞ', items: ['GK', 'YK', 'Pay'] },
        { label: 'Ltd', items: ['Ortak', 'Müdür', 'Devir'] },
        { label: 'Ortak', items: ['Hak', 'Borç', 'Sorumluluk'] },
        { label: 'Sona erme', items: ['Fesih', 'Tasfiye'] },
      ],
    },
    keyMadde: ['TTK m.124 vd.', 'TTK m.329 vd.', 'TTK m.573 vd.'],
  }),

  'kiymetli-evrak': B({
    codeHint: 'TTK kıymetli evrak · poliçe–bono–çek',
    oneLiner: 'Şekle sıkı bağlı senet: unsur eksikse kıymetli evrak sıfatı sarsılır.',
    pillars: [
      'Kıymetli evrak kavramı',
      'Poliçe',
      'Bono (emre yazılı senet)',
      'Çek',
      'Ciro ve devir',
      'Başvuru hakları ve zamanaşımı girişi',
    ],
    definitions: [
      {
        baslik: 'Kıymetli evrak',
        govde: 'Belgeye bağlanmış hakkın, belgenin ibrazı/devri olmadan ileri sürülemeyeceği senet türüdür.',
      },
      {
        baslik: 'Ciro',
        govde: 'Emre yazılı senedin devir ve teminat fonksiyonu gören yazılı beyandır. Türleri (tam, beyaz, tahsil) önemlidir.',
      },
      {
        baslik: 'Başvuru hakkı',
        govde: 'Muhatap/keşideci vb. ödemezse önceki imza sahiplerine yönelme imkânıdır. Koşulları ve süreleri sıkıdır.',
      },
    ],
    traps: [
      'Çek ile bonoyu aynı unsur listesiyle yazmak.',
      'Ciro zincirini atlamak.',
      'İbraz sürelerini unutmak.',
    ],
    examples: [
      {
        title: 'Eksik unsur',
        facts: 'Senette vade / keşideci imzası tartışmalıdır.',
        analysis: 'Zorunlu unsur listesi. Eksikliğin sonucu (kıymetli evrak sıfatı / adi senet).',
        takeaway: 'Önce şekil kontrolü.',
      },
      {
        title: 'Ciro',
        facts: 'Senet birkaç kez devredilir; bir ciro şüpheli.',
        analysis: 'Ciro zinciri, yetkili hamil, def’iler.',
        takeaway: 'Zincir kopuk mu?',
      },
      {
        title: 'Karşılıksız çek',
        facts: 'Çek ödenmez; hamil ne yapar?',
        analysis: 'İbraz, başvuru, yasal imkânlar (hukuki; ceza boyutu ayrı dikkat).',
        takeaway: 'Usul + süre.',
      },
    ],
    mindmap: {
      center: 'Kıymetli evrak',
      branches: [
        { label: 'Tür', items: ['Poliçe', 'Bono', 'Çek'] },
        { label: 'Şekil', items: ['Unsurlar', 'Eksiklik'] },
        { label: 'Devir', items: ['Ciro', 'Teslim'] },
        { label: 'Hak', items: ['İbraz', 'Başvuru'] },
      ],
    },
    keyMadde: ['TTK m.645 vd.', 'TTK m.671 vd.', 'TTK m.776 vd.', 'TTK m.780 vd.'],
  }),

  'devletler-ozel': B({
    codeHint: 'MÖHUK · yabancılık unsuru',
    oneLiner: 'Uyuşmazlıkta yabancı unsur varsa: hangi hukuk, hangi mahkeme?',
    pillars: [
      'Yabancılık unsuru',
      'Yetki (uluslararası usul) girişi',
      'Kanunlar ihtilafı: bağlama kuralları',
      'Sözleşmelerde hukuk seçimi',
      'Aile ve mirasta bağlama (giriş)',
      'Yabancı mahkeme / hakem kararlarının tanınması–tenfizi girişi',
    ],
    definitions: [
      {
        baslik: 'Yabancılık unsuru',
        govde: 'Uyuşmazlığın birden fazla hukuk düzeniyle bağını kuran olgudur (tabiiyet, yer, işlem yeri vb.).',
      },
      {
        baslik: 'Bağlama kuralı',
        govde: 'Hangi hukukun uygulanacağını gösteren kanuni anahtardır (ör. mutad mesken, ifa yeri).',
      },
      {
        baslik: 'Hukuk seçimi',
        govde: 'Tarafların sözleşmeye uygulanacak hukuku seçmesidir. Sınırları ve şekli MÖHUK’ta düzenlenir.',
      },
    ],
    traps: [
      'Hep Türk hukuku uygula demek — yabancılık unsurunu yok saymak.',
      'Yetki ile uygulanacak hukuku karıştırmak.',
      'Kamu düzeni istisnasını her dosyaya yapıştırmak.',
    ],
    examples: [
      {
        title: 'Sözleşmede hukuk seçimi',
        facts: 'Taraflar “İsviçre hukuku” seçer; ifa Türkiye’dedir.',
        analysis: 'Seçimin geçerliliği, sınırları, zorunlu kurallar / kamu düzeni.',
        takeaway: 'Seçim var mı, geçerli mi?',
      },
      {
        title: 'Yetki',
        facts: 'Davalı yurt dışında; sözleşme Türkiye’de ifa edilecek.',
        analysis: 'Uluslararası yetki bağları. Forum shopping tartışması giriş.',
        takeaway: 'Yetki ≠ esas hukuk.',
      },
      {
        title: 'Tanıma–tenfiz',
        facts: 'Yabancı ilam Türkiye’de icra edilmek istenir.',
        analysis: 'Şartlar, kamu düzeni, karşı tarafın hakları.',
        takeaway: 'Tenfiz ayrı davadır.',
      },
    ],
    mindmap: {
      center: 'MÖHUK',
      branches: [
        { label: 'Kapı', items: ['Yabancı unsur'] },
        { label: 'Yetki', items: ['Türk mahkemesi?'] },
        { label: 'Hukuk', items: ['Bağlama', 'Seçim'] },
        { label: 'Karar', items: ['Tanıma', 'Tenfiz'] },
      ],
    },
    keyMadde: ['MÖHUK m.1', 'MÖHUK m.24 vd.', 'MÖHUK m.40 vd.', 'MÖHUK m.50 vd.'],
  }),

  'insan-haklari': B({
    codeHint: 'İnsan hakları · AİHS · anayasal güvenceler',
    oneLiner: 'Hak ihlali iddiasında: hangi hak, müdahale var mı, meşru mu, ölçülü mü?',
    pillars: [
      'İnsan haklarının kaynakları',
      'AİHS sistemine giriş',
      'Adil yargılanma hakkı',
      'Özgürlük ve güvenlik',
      'İfade / özel hayat örnekleri',
      'Bireysel başvuru (AYM / AİHM) girişi',
    ],
    definitions: [
      {
        baslik: 'Müdahale',
        govde: 'Hakka yönelik devlet (veya bazı hâllerde özel) kısıtlamasıdır. Önce müdahalenin varlığı saptanır.',
      },
      {
        baslik: 'Meşru amaç',
        govde: 'Sınırlamanın anayasa/AİHS’te sayılan meşru amaçlardan birine dayanmasıdır.',
      },
      {
        baslik: 'Ölçülülük',
        govde: 'Elverişlilik, gereklilik, orantılılık testidir. İnsan hakları denetiminin kalbidir.',
      },
    ],
    traps: [
      'Doğrudan “ihlal var” demek — test yazmamak.',
      'AİHM içtihadını ezbere yapıştırmak; olaya bağlamamak.',
      'Bireysel başvuru ön şartlarını atlamak.',
    ],
    examples: [
      {
        title: 'İfade özgürlüğü',
        facts: 'Bir paylaşım nedeniyle ceza verilir.',
        analysis: 'Müdahale + kanunilik + meşru amaç + ölçülülük. Demokratik toplumda gereklilik.',
        takeaway: 'Dört adım testi.',
      },
      {
        title: 'Adil yargılanma',
        facts: 'Duruşma gecikir; silahların eşitliği bozulur iddiası.',
        analysis: 'Makul süre, silahların eşitliği, gerekçeli karar. AİHS m.6 zihniyeti.',
        takeaway: 'Usul güvenceleri tek tek.',
      },
      {
        title: 'Bireysel başvuru',
        facts: 'İç yollar bitmeden AYM’ye gidilir.',
        analysis: 'İkincillik, kabul edilebilirlik. Erken başvuru reddi.',
        takeaway: 'Önce iç hukuk yolları.',
      },
    ],
    mindmap: {
      center: 'İnsan hakları',
      branches: [
        { label: 'Kaynak', items: ['Anayasa', 'AİHS', 'Evrensel'] },
        { label: 'Test', items: ['Müdahale', 'Amaç', 'Ölçülülük'] },
        { label: 'Haklar', items: ['Yaşam', 'İfade', 'Adil yargılanma'] },
        { label: 'Yol', items: ['AYM', 'AİHM'] },
      ],
    },
    keyMadde: ['AY m.12 vd.', 'AY m.36', 'AİHS m.5–10', 'AY m.148/3'],
  }),

  'fikri-mulkiyet': B({
    codeHint: 'Fikri mülkiyet · marka · eser · patent girişi',
    oneLiner: 'Korunan ne? Kim hak sahibi? İhlal var mı? Hangi talep?',
    pillars: [
      'Fikri mülkiyetin konusu ve amaçları',
      'Eser (telif) hukuku girişi',
      'Marka hukuku girişi',
      'Patent / faydalı model girişi',
      'İhlal ve talepler',
      'Sözleşmeler (lisans) girişi',
    ],
    definitions: [
      {
        baslik: 'Eser',
        govde: 'Sahibinin hususiyetini taşıyan ve ilim-edebiyat, musiki, güzel sanatlar veya sinema eserleri olarak sayılan fikri üründür (FSEK zihniyeti).',
      },
      {
        baslik: 'Marka',
        govde: 'Bir teşebbüsün mall/hizmetlerini diğerlerinden ayırmaya yarayan işarettir. Tescil ve kullanma önemli rejimlerdir.',
      },
      {
        baslik: 'Lisans',
        govde: 'Hak sahibinin kullanım yetkisini başkasına vermesidir. İnhisari / gayri inhisari ayrımı vardır.',
      },
    ],
    traps: [
      'Her fikri ürünü otomatik “eser” sanmak — hususiyet.',
      'Marka ile ticaret unvanını karıştırmak.',
      'İhlalde yalnızca ceza düşünmek — özel hukuk talepleri zengin.',
    ],
    examples: [
      {
        title: 'Eser ihlali',
        facts: 'Metin izinsiz kopyalanır ve satılır.',
        analysis: 'Eser şartları + mali/manevi haklar + ihlal + talepler (men, tazminat, elkoyma).',
        takeaway: 'Hak sahibi + fiil + zarar.',
      },
      {
        title: 'Marka karışıklığı',
        facts: 'Benzer ibareyle ürün satılır.',
        analysis: 'Karıştırılma ihtimali, benzer mal/hizmet, kötüniyet.',
        takeaway: 'Tüketici gözü testi.',
      },
      {
        title: 'Lisans',
        facts: 'Lisans alan sınır dışı kullanır.',
        analysis: 'Sözleşme kapsamı, inhisar, ihlal.',
        takeaway: 'Kapsamı oku.',
      },
    ],
    mindmap: {
      center: 'Fikri mülkiyet',
      branches: [
        { label: 'Telif', items: ['Eser', 'Haklar'] },
        { label: 'Marka', items: ['Tescil', 'Kullanım'] },
        { label: 'Patent', items: ['Yenilik', 'Buluş'] },
        { label: 'Koruma', items: ['Men', 'Tazminat'] },
      ],
    },
    keyMadde: ['FSEK temel hükümler', 'SMK (sınai mülkiyet) marka–patent', 'TBK haksız fiil tamamlayıcı'],
  }),

  'tuketici-hukuku': B({
    codeHint: 'TKHK · tüketici sözleşmeleri',
    oneLiner: 'Tüketici zayıf taraf; bilgilendirme, ayıp, cayma, aykırılıkta özel koruma.',
    pillars: [
      'Tüketici ve satıcı/sağlayıcı',
      'Tüketici işlemi',
      'Ayıplı mal / hizmet',
      'Cayma hakkı (mesafeli vb.)',
      'Haksız şartlar',
      'Tüketici uyuşmazlıkları: hakem heyeti / mahkeme',
    ],
    definitions: [
      {
        baslik: 'Tüketici',
        govde: 'Ticari veya mesleki olmayan amaçlarla hareket eden gerçek veya tüzel kişidir (kanuni tanım çerçevesi).',
      },
      {
        baslik: 'Ayıplı mal',
        govde: 'Sözleşmede kararlaştırılan / makul olarak beklenebilecek nitelikleri taşımayan maldır. Seçimlik haklar vardır.',
      },
      {
        baslik: 'Cayma hakkı',
        govde: 'Belirli tüketici sözleşmelerinde süre içinde gerekçe göstermeksizin dönme imkânıdır. İstisnaları unutulmamalıdır.',
      },
      {
        baslik: 'Haksız şart',
        govde: 'Tüketici aleyhine dürüstlük kuralına aykırı olarak dengeyi bozan sözleşme koşullarıdır. Yazılmamış sayılma yaptırımı gündeme gelebilir.',
      },
    ],
    traps: [
      'Tacir–tacir uyuşmazlığına tüketici rejimini basmak.',
      'Cayma istisnalarını yazmamak.',
      'Parasal sınıra göre merci seçimini atlamak.',
    ],
    examples: [
      {
        title: 'Ayıplı telefon',
        facts: 'Tüketici, ayıplı cihaz alır; satıcı “garantiye gönder” der.',
        analysis: 'Seçimlik haklar (ücretsiz onarım, yenisi, indirim, sözleşmeden dönme). Süreler.',
        takeaway: 'Seçim tüketiciye aittir (şartlar dâhilinde).',
      },
      {
        title: 'Mesafeli satış',
        facts: 'İnternetten alınan üründen caymak ister.',
        analysis: 'Cayma süresi, istisnalar (kişisel üretim, hijyen vb.), iade maliyeti.',
        takeaway: 'Önce istisna listesi.',
      },
      {
        title: 'Haksız şart',
        facts: 'Sözleşmede “hiçbir şekilde iade yok” maddesi.',
        analysis: 'Denetim, yazılmamış sayılma, şeffaflık.',
        takeaway: 'Aleyhe denge bozulmuş mu?',
      },
    ],
    mindmap: {
      center: 'Tüketici',
      branches: [
        { label: 'Taraf', items: ['Tüketici', 'Satıcı'] },
        { label: 'Sözleşme', items: ['Ayıp', 'Cayma', 'Haksız şart'] },
        { label: 'Hak', items: ['Seçimlik', 'Tazminat'] },
        { label: 'Çözüm', items: ['Hakem', 'Mahkeme'] },
      ],
    },
    keyMadde: ['TKHK m.3', 'TKHK ayıp hükümleri', 'TKHK cayma', 'TKHK haksız şart'],
  }),
};
