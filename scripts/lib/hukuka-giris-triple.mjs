/**
 * Hukuka Giriş / Hukukun Temel Kavramları —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * hukuka-giris dersiyle hizalı (mufredat: year 1).
 */

function baseMeta(variant) {
  const labels = {
    'hukuka-giris-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'Hukuka giriş · 1. yarı (hukuk nedir, kaynaklar, normlar hiyerarşisi, hak–yükümlülük, hukuk dalları girişi)',
    },
    'hukuka-giris-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'Hukuka giriş · 2. yarı (yorum, uygulama, yargı örgütü, usul girişi, yaptırım, temel kavram haritası)',
    },
    'hukuka-giris-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope:
        'Hukuka giriş tam omurga · kavram + kaynak + uygulama · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Hukuk nedir, nereden gelir, nasıl dallanır? Temel kavram kapısı burada açılır.',
    promise:
      'Hukukun tanımı ve işlevi, hukuk–ahlak–din, kaynaklar, normlar hiyerarşisi, hak ve yükümlülük, kamu–özel ayrımı. Güz finalinde “kavram + kaynak + dal” bozulmadan yazarsınız.',
    sixtySecond: [
      'Hukuk: toplumda bağlayıcı kurallar ve kurumlar bütünü.',
      'Ahlak ve dinden ayrılır; etkileşim vardır.',
      'Kaynak: Anayasa, kanun, CBK/tüzük–yönetmelik, örf, içtihat (çerçeve).',
      'Normlar hiyerarşisi: üst norm altı bağlar.',
      'Hak = korunabilir menfaat / yetki; yükümlülük karşı yüzdür.',
      'Kamu hukuku / özel hukuk ana ayrım omurgasıdır.',
    ],
    pillars: [
      'Hukukun tanımı ve işlevleri',
      'Hukuk–ahlak–din ilişkisi',
      'Hukukun kaynakları',
      'Normlar hiyerarşisi',
      'Hukuki işlem ve fiil girişi',
      'Hak ve yükümlülük',
      'Kamu hukuku / özel hukuk',
      'Temel hukuk dalları haritası',
    ],
    definitions: [
      {
        baslik: 'Hukuk',
        govde:
          'Toplumsal yaşamı düzenleyen, yaptırımla desteklenen bağlayıcı kurallar ve bu kuralları uygulayan kurumlar bütünüdür. Tanımlar okuldan okula değişir; sınavda işlev + yaptırım vurgusu işe yarar.',
      },
      {
        baslik: 'Hukuk kaynağı',
        govde:
          'Hukuki kuralın geçerlilik ve bilinme dayanağıdır. Yazılı kaynaklar (Anayasa, kanun, düzenleyici işlemler) ile yazısız kaynaklar (örf ve âdet) ayrılır.',
      },
      {
        baslik: 'Normlar hiyerarşisi',
        govde:
          'Hukuk düzeninde normların üstünlük sırasıdır. Alt norm üst norme aykırı olamaz; aykırılık yaptırımı (iptal, uygulanmama) doğurur.',
      },
      {
        baslik: 'Hak',
        govde:
          'Hukuk düzeninin kişiye tanıdığı, korunabilir menfaat veya yetkidir. Mutlak–nispi, mali–şahsi gibi sınıflandırmalar bilinir.',
      },
      {
        baslik: 'Yaptırım',
        govde:
          'Hukuka aykırılığın sonuçlandırılmasıdır: ceza, tazminat, iptal, cebri icra vb. Yaptırımsız kural “hukuk” tartışmasına girer.',
      },
    ],
    traps: [
      'Hukuku yalnız “kanun maddesi” sanmak — kurum + uygulama da hukuk.',
      'Ahlak ile hukuku tamamen aynı veya tamamen ayrı sanmak.',
      'Hiyerarşiyi ezberleyip aykırılık sonucunu unutmak.',
      'Hak ile yetkiyi / talep hakkını karıştırmak.',
      'Kamu–özel ayrımını mutlak duvar sanmak — kesişim alanları var.',
    ],
    keyMadde: [
      'Anayasa — üst norm ve temel haklar (çerçeve)',
      'Anayasa m.2 — hukuk devleti (köprü)',
      'TMK m.1 — kanunun uygulanması / örf / hâkim (çerçeve)',
      'TMK m.2 — dürüstlük kuralı (köprü)',
      'Kanun / CBK / yönetmelik hiyerarşisi (çerçeve)',
      'Yargı kararları — bağlayıcılık ve emsal (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Hukuka giriş ne işe yarar?',
        paragraphs: [
          'Sonraki tüm dogmatik derslerin ortak dilini kurar. Sınavda tanım + örnek + karşıt kavram beklenir. 1. dönem kavram ve kaynak omurgasını taşır; yorum, yargı ve uygulama 2. döneme kalır.',
        ],
        hapBilgi: 'Hukuk = kural + yaptırım + kurum.',
      },
      {
        heading: 'B. Hukuk–ahlak–din',
        paragraphs: [
          'Ortak alan: dürüstlük, zarar vermeme. Ayrım: yaptırım türü, kaynak, evrensellik iddiası. Uç cümleler zayıftır: “hiç ilişki yok / tamamen aynı”.',
        ],
        bullets: [
          'Bağlayıcılık',
          'Yaptırım',
          'Kaynak',
          'Kapsam (kişi / inanç)',
        ],
      },
      {
        heading: 'C. Kaynaklar',
        paragraphs: [
          'Anayasa, kanun, Cumhurbaşkanlığı kararnamesi (yetki sınırıyla), tüzük/yönetmelik, tebliğ; örf ve âdet; içtihat ve doktrin yardımcı kaynaktır (çerçeve).',
          'Yazılı kaynak önceliği ile örfün tamamlayıcı rolü TMK m.1 köprüsüyle yazılır.',
        ],
        kartlar: [
          { baslik: 'Anayasa', govde: 'En üst norm.' },
          { baslik: 'Kanun', govde: 'TBMM iradesi.' },
          { baslik: 'Düzenleyici', govde: 'Yönetmelik vb.' },
          { baslik: 'Örf', govde: 'Yazısız tamamlayıcı.' },
        ],
      },
      {
        heading: 'D. Normlar hiyerarşisi',
        paragraphs: [
          'Üst norm altı bağlar. Anayasaya aykırı kanun / kanuna aykırı yönetmelik sonuçları bilinir (iptal, yokluk tartışması çerçevede).',
          'Sınav cümlesi: “Hangi norm üstün? Aykırılığın sonucu ne?”',
        ],
        uyari: 'Hiyerarşi listesi yetmez; aykırılık sonucunu yaz.',
      },
      {
        heading: 'E. Hak ve yükümlülük',
        paragraphs: [
          'Hak sahibi, yükümlü, konu. Mutlak hak herkese; nispi hak belirli kişiye karşı. Kamu hakkı / özel hak ayrımı girişi.',
          'Hak ehliyeti / fiil ehliyeti ayrımı kişi hukuku köprüsüdür (TMK).',
        ],
        hapBilgi: 'Hak = korunabilir yetki; karşısında borç/yükümlülük.',
      },
      {
        heading: 'F. Kamu / özel hukuk',
        paragraphs: [
          'Kamu: devlet–birey, üstünlük, idare–ceza–anayasa. Özel: eşitler arası, medeni–borçlar–ticaret. Karma alanlar: iş, tüketici, çevre.',
        ],
      },
      {
        heading: 'G. Dal haritası (giriş)',
        paragraphs: [
          'Anayasa, idare, ceza, usul; medeni, borçlar, ticaret, iş. Amaç ezber liste değil; “bu uyuşmazlık hangi dalda?” sorusuna cevap verebilmek.',
        ],
      },
    ],
    examples: [
      {
        title: 'Kaynak',
        facts:
          'Yönetmelik kanuna aykırı hüküm koyar.',
        analysis:
          'Hiyerarşi. Alt norm. Aykırılık sonucu.',
        takeaway: 'Üst norm bağlar.',
      },
      {
        title: 'Hukuk–ahlak',
        facts:
          '“Yalan söylemek ahlaken kötüdür; hukuken her yalan suç mudur?”',
        analysis:
          'Ayrım + kesişim. Yaptırım farkı.',
        takeaway: 'Her ahlak kuralı hukuk değildir.',
      },
      {
        title: 'Hak türü',
        facts:
          'Mülkiyet ile alacak hakkı aynı torbada anlatılır.',
        analysis:
          'Mutlak / nispi. Herkese karşı / kişiye karşı.',
        takeaway: 'Hak sınıfını yaz.',
      },
      {
        title: 'Dal seçimi',
        facts:
          'Belediye ruhsat iptali “borçlar” diye çözülür.',
        analysis:
          'İdare hukuku / idari yargı. Yanlış dal.',
        takeaway: 'Dal haritasını kullan.',
      },
    ],
    mindmap: {
      center: 'Hukuka Giriş · 1. dönem',
      branches: [
        { label: 'Kavram', items: ['Tanım', 'İşlev'] },
        { label: 'Kaynak', items: ['Yazılı', 'Örf'] },
        { label: 'Yapı', items: ['Hiyerarşi', 'Hak'] },
        { label: 'Dal', items: ['Kamu', 'Özel'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Yorum, yargı ve yaptırım. Kuralın hayata geçtiği yer.',
    promise:
      'Hukukun uygulanması ve yorumu, yargı örgütü, dava ve usul girişi, ispat fikri, yaptırımlar, hukuk devleti ve temel kavram tekrarı. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Uygulama: somut olaya kuralı taşımak.',
      'Yorum: lafzî, sistematik, tarihsel, amaçsal.',
      'Boşluk: kıyas, yaratıcı faaliyet (TMK m.1 köprüsü).',
      'Yargı: adli, idari, anayasa yargısı (çerçeve).',
      'Dava: talep + merc + usul + ispat fikri.',
      'Yaptırım: ceza / tazminat / iptal / icra.',
    ],
    pillars: [
      'Hukukun uygulanması',
      'Yorum yöntemleri',
      'Kanun boşluğu ve kıyas',
      'Yargı örgütü girişi',
      'Dava ve usul fikri',
      'İspat ve delil girişi',
      'Yaptırım türleri',
      'Hukuk devleti ve temel kavram sentezi',
    ],
    definitions: [
      {
        baslik: 'Yorum',
        govde:
          'Norm metninin somut olaya uygulanabilir anlamının belirlenmesidir. Yöntem seçimi gerekçelenir; salt lafız her zaman yetmez.',
      },
      {
        baslik: 'Kanun boşluğu',
        govde:
          'Uygulanacak kuralın bulunmaması veya yetersiz kalmasıdır. TMK m.1 çerçevesinde örf ve hâkimin hukuk yaratması tartışılır.',
      },
      {
        baslik: 'Yargı yetkisi',
        govde:
          'Uyuşmazlıkların bağımsız mahkemelerce çözülmesidir. Adli / idari / anayasa yargısı ayrımı temeldir.',
      },
      {
        baslik: 'Dava',
        govde:
          'Bir hakkın korunması veya hukuki durumun tespiti için yargı organına yapılan başvurudur. Ehliyet, menfaat, merc, süre usul derslerinde derinleşir.',
      },
      {
        baslik: 'Hukuk devleti',
        govde:
          'Kamusal gücün hukuka bağlı, öngörülebilir ve denetime açık kullanılması idealidir. Biçimsel ve maddi boyutları bilinir.',
      },
    ],
    traps: [
      'Yorumu “istediğim anlam” sanmak — yöntem + gerekçe.',
      'Kıyası sınırsız kullanmak — cezada kıyas yasağı köprüsü.',
      'Her uyuşmazlığı aynı mahkemeye yazmak — yargı kolu.',
      'İspatı yalnız “tanık” sanmak — delil çeşitleri.',
      '1. dönem kavramlarını unutup 2. dönemi havada bırakmak.',
    ],
    keyMadde: [
      'TMK m.1 — uygulama, örf, hâkim (çerçeve)',
      'TMK m.2 — dürüstlük / hakkın kötüye kullanılması',
      'Anayasa — yargı bağımsızlığı / yargı yolu (çerçeve)',
      'HMK / CMK / İYUK — usul omurgası girişi (köprü)',
      'Anayasa m.2 — hukuk devleti',
      'Temel haklar — sınırlama rejimi girişi (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Uygulama ve yorum',
        paragraphs: [
          'Olay → kural bulma → yorum → sonuç. Lafzî yorum başlangıçtır; sistem, tarih ve amaç tamamlar.',
          'Sınavda yöntem adı + bir cümle gerekçe yazılır.',
        ],
        hapBilgi: 'Yorum = gerekçeli anlam seçimi.',
      },
      {
        heading: 'B. Boşluk ve kıyas',
        paragraphs: [
          'Gerçek boşluk / sahte boşluk tartışması çerçevede. Kıyas özel hukukta mümkün; cezada kıyas yasağı (lehe olanlar ayrı).',
          'Hâkimin hukuk yaratması keyfilik değildir; gerekçe ve ilke gerekir.',
        ],
        kartlar: [
          { baslik: 'Boşluk', govde: 'Kural yok/yetersiz.' },
          { baslik: 'Örf', govde: 'TMK m.1 basamağı.' },
          { baslik: 'Kıyas', govde: 'Benzerlikle taşıma.' },
          { baslik: 'Sınır', govde: 'Ceza / emredici norm.' },
        ],
      },
      {
        heading: 'C. Yargı örgütü',
        paragraphs: [
          'Adli yargı (hukuk–ceza), idari yargı, Anayasa Mahkemesi, uyuşmazlık mercileri (çerçeve). İlk derece / istinaf / temyiz fikri.',
          'Görev ve yetki ayrımı usul dersinin kapısıdır; burada isim ve işlev yeter.',
        ],
        uyari: 'Yanlış yargı kolu = kapı hatası.',
      },
      {
        heading: 'D. Dava ve ispat fikri',
        paragraphs: [
          'Talep sonucu, taraf, merc, süre, harç fikri. İspat yükü ve delil çeşitleri (belge, tanık, bilirkişi, keşif) giriş düzeyinde.',
          'Hukuki dinlenilme hakkı ve adil yargılanma köprüsü.',
        ],
      },
      {
        heading: 'E. Yaptırımlar',
        paragraphs: [
          'Ceza yaptırımı, hukuki tazminat, idari yaptırım, geçersizlik/iptal, cebri icra. Aynı fiil birden fazla yaptırım doğurabilir (ceza + tazminat).',
        ],
        hapBilgi: 'Yaptırım türünü soruya göre seç.',
      },
      {
        heading: 'F. Hukuk devleti sentezi',
        paragraphs: [
          'Kanunilik, belirlilik, yargısal denetim, temel haklar. 1. dönem kaynak ve hiyerarşi buraya bağlanır.',
        ],
      },
      {
        heading: 'G. Kavram tekrarı',
        paragraphs: [
          'Hak, borç, hukuki işlem, hukuki fiil, ehliyet, süre, zamanaşımı / hak düşürücü süre ayrımı (giriş). Sonraki derslerin iskeleti burada sabitlenir.',
        ],
      },
    ],
    examples: [
      {
        title: 'Yorum',
        facts:
          'Belirsiz madde; öğrenci yalnız sözlük anlamı yazar.',
        analysis:
          'Lafız + amaç + sistem. Gerekçe eksik.',
        takeaway: 'Yöntemi yaz.',
      },
      {
        title: 'Yargı kolu',
        facts:
          'İdari işlemin iptali asliye hukukta istenir.',
        analysis:
          'İdari yargı. Görev. Kapı hatası.',
        takeaway: 'Doğru mercı seç.',
      },
      {
        title: 'Yaptırım',
        facts:
          'Haksız fiilde yalnız “ceza” yazılır; zarar var.',
        analysis:
          'Hukuki tazminat. Ceza ayrı olabilir.',
        takeaway: 'Yaptırım kutusunu çoğalt.',
      },
      {
        title: 'Boşluk',
        facts:
          'Kanunda açık kural yok; öğrenci susar.',
        analysis:
          'TMK m.1 basamakları. Örf / yaratma. Gerekçe.',
        takeaway: 'Boşlukta yöntem var.',
      },
    ],
    mindmap: {
      center: 'Hukuka Giriş · 2. dönem',
      branches: [
        { label: 'Uygulama', items: ['Yorum', 'Boşluk'] },
        { label: 'Yargı', items: ['Kol', 'Dava'] },
        { label: 'İspat', items: ['Yük', 'Delil'] },
        { label: 'Sonuç', items: ['Yaptırım', 'Hukuk devleti'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Temel kavramlardan yoruma, kaynaklardan yargı ve yaptırıma tek omurga.',
    promise:
      '1. + 2. dönem birleşik; hukuka giriş / temel kavramlar için “tek cilt” not. Tüm hukuk fakültesi dilinin iskeleti.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: kavram/kaynak mı, yorum/yargı mı?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: tanım–kaynak–hiyerarşi → hak/dal → yorum–yargı → yaptırım → karma.',
          'Her soruda: “Kavram mı? Kaynak mı? Uygulama/yargı mı?”',
        ],
        hapBilgi: 'Yıllık başarı = net tanım + doğru kaynak + gerekçeli uygulama.',
        bullets: [
          'Hafta 1–3: hukuk nedir + ahlak/din + kaynaklar',
          'Hafta 4–6: hiyerarşi + hak + kamu/özel',
          'Hafta 7–10: yorum + boşluk + yargı örgütü',
          'Hafta 11–14: dava/ispat + yaptırım + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Tanım. Tip 2 — Kaynak/hiyerarşi. Tip 3 — Hak türü. Tip 4 — Dal seçimi. Tip 5 — Yorum. Tip 6 — Yargı kolu/yaptırım.',
          'Dogmatik derslere köprü: her kavram bir üst derste geri döner. Uydurma madde yazma; çerçeve dayanak yeterli.',
        ],
        uyari: 'Ezber liste değil; örnekli tanım yaz.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Hukuka Giriş · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Kavram', 'Kaynak', 'Hak'] },
        { label: '2. yarı', items: ['Yorum', 'Yargı', 'Yaptırım'] },
        { label: 'Yöntem', items: ['Tanım', 'Örnek', 'Ayrım'] },
        { label: 'Köprü', items: ['TMK m.1–2', 'Anayasa'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'hukuka-giris-donem-1': d1Content,
  'hukuka-giris-donem-2': d2Content,
  'hukuka-giris-yillik': yillikContent,
};

export const HUKUKA_GIRIS_VARIANTS = [
  'hukuka-giris-donem-1',
  'hukuka-giris-donem-2',
  'hukuka-giris-yillik',
];

export function buildHukukaGirisVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Hukuka Giriş ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Hukuka Giriş / Temel Kavramlar ${meta.h1Extra}`;
  const description = `${uni.name} için Hukuka Giriş ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Hukuka Giriş / Hukukun Temel Kavramları ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: hukuk dilini, kaynakları ve uygulama iskeletini sınavda bozmadan kurmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Sonraki dogmatik derslerin ortak alfabesidir; ezber listeden çok örnekli tanım hedeflenir.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her kavram: tanım + karşıt + örnek',
        'Kaynak ve hiyerarşiyi şemayla tekrar et',
      ],
      hapBilgi: bank.oneLiner,
    },
    {
      heading: '2. 60 saniyede omurga',
      paragraphs: ['Sesli oku, kapat, yaz.'],
      bullets: bank.sixtySecond,
    },
    {
      heading: '3. Kavram haritası ve omurga',
      paragraphs: [`Omurga: ${bank.pillars.join('; ')}.`],
      bullets: bank.pillars.map((p, i) => `${i + 1}) ${p}`),
      hapBilgi: bank.promise,
    },
    {
      heading: '4. Tanım kartları',
      paragraphs: ['İşler tanım = unsur fısıldayan cümle.'],
      kartlar: bank.definitions,
    },
    {
      heading: '5. Pusula dayanaklar',
      paragraphs: [
        'Anayasa ve TMK m.1–2 köprü dayanaklardır. Amaç madde yarışı değil; kavramı dayanağa bağlamaktır.',
      ],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma madde yazmayın; çerçeve dayanak kullanın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Hukuka Giriş)',
      paragraphs: [
        `${uni.shortName} klasiklerinde kısa tanım + örnek + ayrım puan getirir. 60 dk / 3–4 soruda planlı yazın.`,
        'İskelet: (1) tanım (2) unsur/ayrım (3) örnek (4) köprü dayanak.',
      ],
      bullets: [
        'Tanımı tek cümlede kur',
        'Karşıt kavramı yaz',
        'Bir somut örnek ver',
        'Kaynak/hiyerarşi sorularında sonuç yaz',
      ],
      hapBilgi: 'Net tanım + örnek = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Hukuka Giriş ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Kavramı tanımla',
        'Ayrımı yaz',
        'Kaynak/dayanak bağla',
        'Örnek ver',
        'Sonuç cümlesi',
        'Tuzak kontrolü',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'hukuka-giris-donem-2'
          ? [
              ['Yorum', 'Kıyas', 'Anlam mı boşluk doldurma mı?'],
              ['Adli yargı', 'İdari yargı', 'Hangi uyuşmazlık türü?'],
              ['Ceza yaptırımı', 'Tazminat', 'Kamusal mı özel mi?'],
              ['Zamanaşımı', 'Hak düşürücü süre', 'Hangi süre rejimi?'],
            ]
          : variantCode === 'hukuka-giris-donem-1'
            ? [
                ['Hukuk', 'Ahlak', 'Yaptırım türü nedir?'],
                ['Kanun', 'Yönetmelik', 'Hangi norm üstün?'],
                ['Mutlak hak', 'Nispi hak', 'Kime karşı ileri sürülür?'],
                ['Kamu hukuku', 'Özel hukuk', 'Taraflar eşit mi?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Kavram/kaynak mı yorum/yargı mı?'],
                ['Kaynak', 'Yorum', 'Nereden gelir mi ne anlama gelir mi?'],
                ['Hak', 'Yaptırım', 'Yetki mi sonuç mu?'],
                ['Kamu', 'Özel', 'Hangi dal?'],
              ],
    },
    {
      kind: 'ladder',
      title: 'Öğrenme merdiveni',
      levels: [
        'Tanım kartları',
        'Zihin haritası çiz',
        'Tuzak listesi',
        '4 örnek olay süreyle',
        'Karma deneme + yanlış defteri',
      ],
    },
    {
      kind: 'fork',
      title: 'Soru tipi',
      leftTitle: 'Kavram / kaynak',
      rightTitle: 'Yorum / yargı',
      left: 'Tanım–kaynak–hiyerarşi–hak',
      right: 'Yorum–boşluk–yargı kolu–yaptırım',
    },
    {
      kind: 'cycle',
      title: 'Haftalık döngü',
      steps: ['Tanım', 'Şema', 'Örnek', 'Quiz', 'Yanlış defteri'],
    },
  ];

  const faq = [
    {
      q: '1. dönem / 2. dönem / yıllık farkı ne?',
      a: '1. dönem hukuk nedir–kaynak–hiyerarşi–hak–kamu/özel; 2. dönem yorum–yargı–dava/ispat–yaptırım; yıllık ikisini birleştirir.',
    },
    {
      q: 'Bu ders ezber mi?',
      a: 'Ezber listeden çok örnekli tanım ve ayrım. Sonraki derslerin dilini kurar.',
    },
    {
      q: 'PDF nasıl indirilir?',
      a: '“PDF indir / Yazdır” veya …/pdf → Ctrl+P → PDF olarak kaydet.',
    },
    {
      q: 'Ücretli mi?',
      a: 'Hayır. Av. Fethi Güzel Hukuk Portalı üzerinden ücretsizdir.',
    },
  ];

  const checklist = [
    '60 sn omurgayı kapalı yazdım',
    'Tanım kartlarını ezberden yazdım',
    'Zihin haritasını çizdim',
    'Tuzak listesinden 5 madde işaretledim',
    'En az 3 örnek olayı süreyle çözdüm',
    'Kaynak hiyerarşisi şemasını çizdim',
    'PDF’i arşivledim',
    variantCode === 'hukuka-giris-yillik'
      ? '1. ve 2. dönem notlarıyla çapraz tekrar yaptım'
      : 'Diğer yarı / yıllık notla bağlantıyı kontrol ettim',
  ];

  return {
    uniSlug: uni.slug,
    courseCode: variantCode,
    slug: `${uni.slug}__${variantCode}`,
    title,
    description,
    h1,
    keywords: [
      `${uni.shortName} hukuka giriş ${meta.short}`,
      `${uni.shortName} hukukun temel kavramları ders notu`,
      `hukuka giriş ${meta.short} not pdf`,
      'hukuk kaynakları normlar hiyerarşisi',
      'hukuka giriş yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} hukuka giriş`),
      'ücretsiz hukuk ders notu',
    ],
    lead,
    promise: bank.promise,
    sixtySecond: bank.sixtySecond,
    examBox: {
      calendar: uni.calendar,
      typicalWeights: 'Ara sınav ~%30–40 · Final ~%50–60 (yönetmeliğe göre)',
      format: uni.type === 'vakif' ? 'Kısa cevap + klasik; quiz olabilir' : 'Klasik yazılı ağırlıklı',
      tips: [
        'Tanımı net yaz',
        'Karşıt kavramı ekle',
        'Bir örnek ver',
        'Hiyerarşi sorularında sonuç yaz',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Hukuka giriş ${meta.short} kavramlarını ayırır`,
      'Kaynak ve normlar hiyerarşisini kurar',
      'Hak–yükümlülük ve kamu/özel ayrımını uygular',
      'Yorum, yargı ve yaptırım dilini kullanır',
      'PDF notla düzenli tekrar yapar',
    ],
    sections,
    examples: bank.examples.map((e, i) => ({
      ...e,
      title: `Örnek ${i + 1} — ${e.title}`,
    })),
    diagrams,
    faq,
    checklist,
    relatedCourses: HUKUKA_GIRIS_VARIANTS.filter((c) => c !== variantCode).concat([
      'hukuka-giris',
      'hukuk-felsefesi-yillik',
      'anayasa-1',
      'medeni-baslangic',
    ]),
    relatedBilgi: [],
    updated: '2026-07-30',
    wordTarget: variantCode === 'hukuka-giris-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'hukuka-giris',
    variantLabel: meta.label,
  };
}
