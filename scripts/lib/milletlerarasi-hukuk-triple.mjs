/**
 * Milletlerarası Hukuk / Uluslararası Hukuk —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * milletlerarasi-hukuk dersiyle hizalı (mufredat: year 2).
 */

function baseMeta(variant) {
  const labels = {
    'milletlerarasi-hukuk-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'Milletlerarası hukuk · 1. yarı (nitelik, kaynaklar, antlaşmalar, özneler, egemenlik, tanınma)',
    },
    'milletlerarasi-hukuk-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'Milletlerarasi hukuk · 2. yarı (sorumluluk, kuvvet kullanma, BM, UAD, insan hakları–uluslararası ceza girişi)',
    },
    'milletlerarasi-hukuk-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope:
        'Milletlerarası hukuk tam omurga · kaynak + özne + sorumluluk + kurumlar · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Kaynak, özne, antlaşma. Uluslararası hukukun bağlayıcılık kapısı burada açılır.',
    promise:
      'Milletlerarası hukukun niteliği, kaynaklar (antlaşma–örf–genel ilkeler), antlaşmalar hukuku, devlet ve diğer özneler, egemenlik ve tanınma. Güz finalinde “kaynak + özne + antlaşma” bozulmadan yazarsınız.',
    sixtySecond: [
      'Milletlerarası hukuk: egemenler arası ilişkileri düzenleyen kamu hukuku.',
      'Kaynak: antlaşma, teamül (örf), genel hukuk ilkeleri (UAD Statüsü m.38 çerçevesi).',
      'Antlaşma: müzakere–imza–onay–yürürlük; Viyana Antlaşmalar Hukuku Sözleşmesi omurgası.',
      'Özne: devlet (asli), uluslararası örgüt, (sınırlı) birey.',
      'Egemenlik: iç üstünlük + dış bağımsızlık; bağlayıcılık rıza temelli tartışılır.',
      'Tanınma: kurucu / açıklayıcı teoriler; de facto / de jure.',
    ],
    pillars: [
      'Milletlerarası hukukun niteliği ve bağlayıcılığı',
      'Kaynaklar teorisi',
      'Antlaşmalar hukuku',
      'Teamül (örfî hukuk)',
      'Devlet ve egemenlik',
      'Tanınma ve ardıllık girişi',
      'Uluslararası örgütler girişi',
      'İç hukuk–uluslararası hukuk ilişkisi',
    ],
    definitions: [
      {
        baslik: 'Milletlerarası hukuk',
        govde:
          'Başlıca egemen devletler ile uluslararası örgütler arasındaki ilişkileri düzenleyen, rıza ve teamüle dayanan kamu hukuku dalıdır. MÖHUK (devletler özel) ile karıştırılmaz.',
      },
      {
        baslik: 'Antlaşma',
        govde:
          'Uluslararası hukuk özneleri arasında yazılı (kural) ve hukuken bağlayıcı anlaşmadır. Adı ne olursa olsun (sözleşme, pakt, protokol) bağlayıcılık iradeye bağlıdır.',
      },
      {
        baslik: 'Teamül (örfî hukuk)',
        govde:
          'Devletlerin genel ve sürekli uygulaması (usus) ile hukuki bağlayıcılık inancı (opinio juris) birleşince oluşan yazısız kaynaktır.',
      },
      {
        baslik: 'Egemenlik',
        govde:
          'Devletin ülke üzerinde en üstün otorite ve dış ilişkilerde bağımsızlık niteliğidir. Milletlerarası hukuk egemenliği hem tanır hem sınırlar.',
      },
      {
        baslik: 'Tanınma',
        govde:
          'Bir devletin veya hükümetin, diğerleri tarafından uluslararası toplumda varlığının kabul edilmesidir. Hukuki sonuçları teoriye göre değişir.',
      },
    ],
    traps: [
      'MÖHUK ile milletlerarası kamu hukukunu karıştırmak.',
      'Antlaşmayı “imza = yürürlük” sanmak — onay/yürürlük şartı.',
      'Teamülü yalnız “çok devlet yaptı” diye kurmak — opinio juris şart.',
      'BM kararını her hâlde bağlayıcı antlaşma sanmak — organ ve tür.',
      'Bireyi tam egemen özne saymak — sınırlı öznellik.',
    ],
    keyMadde: [
      'UAD Statüsü m.38 — kaynaklar (çerçeve)',
      '1969 Viyana Antlaşmalar Hukuku Sözleşmesi (VCLT) — çerçeve',
      'BM Antlaşması — amaç ve ilkeler (çerçeve; 2. dönem bağ)',
      'Devlet egemen eşitliği — BM m.2 (çerçeve)',
      'Monist / dualist iç hukuk ilişkisi (Anayasa köprüsü, çerçeve)',
      'Devlet ardıllığı / tanınma — teamül ve uygulama (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Milletlerarası hukuk nedir?',
        paragraphs: [
          'Egemenler arası düzen; yaptırım merkezi bir “dünya polisi” değil, karşılıklılık, karşı önlem, kurumsal mekanizmalardır. 1. dönem kaynak ve özne omurgasını taşır.',
          'MÖHUK yabancı unsurlu özel ilişkileri; bu ders kamu uluslararası ilişkileri düzenler.',
        ],
        hapBilgi: 'Kamu uluslararası ≠ MÖHUK.',
      },
      {
        heading: 'B. Kaynaklar',
        paragraphs: [
          'UAD Statüsü m.38 iskeleti: antlaşma, teamül, genel ilkeler; yardımcı: yargı kararları ve doktrin. Soft law bağlayıcı kaynak değildir ama etki eder.',
        ],
        bullets: [
          'Antlaşma',
          'Teamül (usus + opinio juris)',
          'Genel hukuk ilkeleri',
          'Yardımcı araçlar',
        ],
      },
      {
        heading: 'C. Antlaşmalar hukuku',
        paragraphs: [
          'Müzakere, kabul, imza, onay, katılma, çekince, yürürlük, yorum, tadil, sona erme, geçersizlik sebepleri (VCLT çerçevesi).',
          'Pacta sunt servanda ve iyi niyet. İç hukuk engeli kural olarak öne sürülemez (istisnalarla).',
        ],
        kartlar: [
          { baslik: 'Kuruluş', govde: 'İrade + usul.' },
          { baslik: 'Çekince', govde: 'Sınırlı kabul.' },
          { baslik: 'Yorum', govde: 'Lafız + amaç + bağlam.' },
          { baslik: 'Sona erme', govde: 'Fesih / imkânsızlık…' },
        ],
        hapBilgi: 'İmza ≠ her zaman bağlayıcı yürürlük.',
      },
      {
        heading: 'D. Teamül',
        paragraphs: [
          'Usus: genel, sürekli, tutarlı uygulama. Opinio juris: hukuk zorunluluğu inancı. Özel teamül / bölgesel teamül mümkün. Persistent objector tartışması çerçevede.',
        ],
        uyari: 'Tek başına pratik yetmez; opinio juris yaz.',
      },
      {
        heading: 'E. Özneler: devlet',
        paragraphs: [
          'Montevideo unsurları (çerçeve): daimi nüfus, belirli ülke, hükümet, diğer devletlerle ilişki kurma ehliyeti. Egemen eşitlik.',
          'Tanıma ve ardıllık (succession) giriş düzeyinde.',
        ],
      },
      {
        heading: 'F. Örgütler ve birey',
        paragraphs: [
          'Uluslararası örgütler tüzel kişilik ve yetki devri ile özne olur. Birey: insan hakları ve uluslararası ceza hukukunda sınırlı öznellik (2. dönem bağ).',
        ],
      },
      {
        heading: 'G. İç hukuk ilişkisi',
        paragraphs: [
          'Monizm / dualizm. Türkiye’de antlaşmaların iç hukuktaki yeri Anayasa çerçevesinde yazılır; uydurma madde yok, güncel metin doğrulanır.',
        ],
      },
    ],
    examples: [
      {
        title: 'Kaynak',
        facts:
          'Devlet “imzaladım ama onaylamadım, bağlı değilim” der.',
        analysis:
          'Onay/yürürlük. Geçici uygulama istisnası. VCLT çerçevesi.',
        takeaway: 'Bağlayıcılık anını yaz.',
      },
      {
        title: 'Teamül',
        facts:
          'Çok devlet uyguluyor; hukuki inanç yok.',
        analysis:
          'Usus var, opinio juris eksik. Teamül kurulmaz.',
        takeaway: 'İki unsur birlikte.',
      },
      {
        title: 'MÖHUK karışıklığı',
        facts:
          'Yabancı unsurlu satım “uluslararası hukuk” diye çözülür.',
        analysis:
          'MÖHUK / özel hukuk. Yanlış dal.',
        takeaway: 'Dalı seç.',
      },
      {
        title: 'Tanınma',
        facts:
          'Yeni devlet fiilen var; tanınmıyor.',
        analysis:
          'Kurucu/açıklayıcı. De facto ilişkiler. Sonuçlar.',
        takeaway: 'Tanınma teorisini yaz.',
      },
    ],
    mindmap: {
      center: 'Milletlerarası Hukuk · 1. dönem',
      branches: [
        { label: 'Kaynak', items: ['Antlaşma', 'Teamül'] },
        { label: 'Özne', items: ['Devlet', 'Örgüt'] },
        { label: 'İlke', items: ['Egemenlik', 'Rıza'] },
        { label: 'İlişki', items: ['İç hukuk', 'Tanınma'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Sorumluluk, kuvvet yasağı, BM ve yargı. Kurallar sahada test edilir.',
    promise:
      'Devlet sorumluluğu, kuvvet kullanma yasağı ve meşru müdafaa, BM sistemi, UAD ve uyuşmazlık çözümü, insan hakları ve uluslararası ceza hukuku girişi. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Sorumluluk: uluslararası aykırı fiil + isnat + sonuç (tazmin).',
      'Kuvvet kullanma yasağı (BM m.2/4); istisna: meşru müdafaa, GK yetkisi.',
      'BM: GK, GA, UAD — yetki ve bağlayıcılık farkı.',
      'UAD: rızaya dayalı yargı yetkisi; karar bağlayıcı (taraflar için).',
      'İnsan hakları: sözleşme rejimleri ve denetim organları girişi.',
      'Uluslararası ceza: bireysel cezai sorumluluk (UCM girişi).',
    ],
    pillars: [
      'Devletlerin uluslararası sorumluluğu',
      'Kuvvet kullanma yasağı',
      'Meşru müdafaa ve Güvenlik Konseyi',
      'Birleşmiş Milletler sistemi',
      'Uyuşmazlıkların barışçıl çözümü',
      'Uluslararası Adalet Divanı',
      'İnsan hakları hukuku girişi',
      'Uluslararası ceza hukuku girişi',
    ],
    definitions: [
      {
        baslik: 'Uluslararası haksız fiil',
        govde:
          'Devlete isnat edilebilen ve uluslararası bir yükümlülüğü ihlal eden fiildir. Sorumluluk doğurur (ILC maddeleri çerçevesi).',
      },
      {
        baslik: 'Meşru müdafaa',
        govde:
          'Silahlı saldırıya karşı, gereklilik ve orantılılık koşullarıyla başvurulan meşru kuvvet kullanma hakkıdır (BM m.51 çerçevesi).',
      },
      {
        baslik: 'Güvenlik Konseyi',
        govde:
          'BM’nin barış ve güvenlikten sorumlu organıdır. VII. Bölüm kararları bağlayıcı olabilir. veto mekanizması bilinir.',
      },
      {
        baslik: 'UAD yargı yetkisi',
        govde:
          'Divan’ın bir uyuşmazlığa bakabilmesi için tarafların rızası gerekir (antlaşma, özel anlaşma, ihtiyari beyan vb.).',
      },
      {
        baslik: 'Erga omnes',
        govde:
          'Tüm uluslararası topluma karşı borç olunan yükümlülüklerdir. İhlalde dava ehliyeti tartışmaları doğar (çerçeve).',
      },
    ],
    traps: [
      'Her BM kararını aynı bağlayıcılıkta sanmak.',
      'Meşru müdafaayı “önleyici savaş”a genişletmek — sıkı şartlar.',
      'UAD’yi zorunlu evrensel mahkeme sanmak — rıza şartı.',
      'Sorumlulukta isnadı atlamak — kim yaptı?',
      'İnsan hakları ile silahlı çatışma hukukunu tamamen aynı torbaya atmak.',
    ],
    keyMadde: [
      'BM Antlaşması m.2/4 — kuvvet yasağı',
      'BM Antlaşması m.51 — meşru müdafaa',
      'BM VII. Bölüm — GK yetkileri (çerçeve)',
      'ILC Devlet Sorumluluğu Maddeleri (çerçeve; soft/kodifikasyon)',
      'UAD Statüsü — yetki ve yargılama (çerçeve)',
      'İHEB / temel insan hakları sözleşmeleri (giriş)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Devlet sorumluluğu',
        paragraphs: [
          'Unsurlar: uluslararası yükümlülük ihlali, devlete isnat, (bazen) zarar. Halleri: fiilî organ, de facto kontrol vb. (çerçeve).',
          'Sonuçlar: sona erdirme, teminat, tazmin (restitusyon, tazminat, tatmin).',
        ],
        hapBilgi: 'İhlal + isnat = sorumluluk iskeleti.',
      },
      {
        heading: 'B. Kuvvet kullanma',
        paragraphs: [
          'Genel yasak (m.2/4). İstisnalar dar yorumlanır: meşru müdafaa, GK yetkilendirmesi. İnsani müdahale tartışmalı; sınavda “tartışmalı / teamül belirsiz” dili dikkatli kullanılır.',
        ],
        kartlar: [
          { baslik: 'Yasak', govde: 'm.2/4.' },
          { baslik: 'Müdafaa', govde: 'm.51 + orantı.' },
          { baslik: 'GK', govde: 'VII. Bölüm.' },
          { baslik: 'Sınır', govde: 'Dar istisna.' },
        ],
        uyari: 'Geniş “haklı savaş” dili puan kaybettirir.',
      },
      {
        heading: 'C. BM sistemi',
        paragraphs: [
          'Amaçlar ve ilkeler. Organlar: GK, Genel Kurul, ECOSOC, Vesayet (tarihsel), UAD, Sekretarya. GK veto ve bağlayıcılık.',
          'GA tavsiye nitelikli kararlar (kural); bütçe ve iç işler istisnaları çerçevede.',
        ],
      },
      {
        heading: 'D. Uyuşmazlık çözümü',
        paragraphs: [
          'Müzakere, arabuluculuk, soruşturma, uzlaştırma, tahkim, yargı. Barışçıl çözüm yükümlülüğü (BM m.2/3 çerçevesi).',
        ],
      },
      {
        heading: 'E. UAD',
        paragraphs: [
          'Taraf ehliyeti (devletler). Yetki rızası. Geçici tedbir. Kararın bağlayıcılığı ve icra (GK rolü sınırlı/çerçeve). Danışma görüşleri bağlayıcı değildir.',
        ],
        hapBilgi: 'UAD = rıza + devlet taraflar (esas).',
      },
      {
        heading: 'F. İnsan hakları girişi',
        paragraphs: [
          'Evrensel ve bölgesel rejimler. Sözleşme organları, bireysel başvuru (sisteme göre). AİHS/AİHM Türkiye için önemli köprü; ayrı ders derinliği insan haklarında.',
        ],
      },
      {
        heading: 'G. Uluslararası ceza girişi',
        paragraphs: [
          'Soykırım, insanlığa karşı suç, savaş suçları, saldırı suçu. UCM ve tamamlayıcılık ilkesi. Bireysel cezai sorumluluk — devlet sorumluluğundan ayrı.',
        ],
      },
    ],
    examples: [
      {
        title: 'Meşru müdafaa',
        facts:
          'Devlet “tehdit var” diye saldırır; silahlı saldırı ispatı yok.',
        analysis:
          'm.51 şartları. Orantılılık. Yasak riski.',
        takeaway: 'Saldırı + orantı şart.',
      },
      {
        title: 'Sorumluluk',
        facts:
          'Paramiliter grup sınır ötesi saldırı; devlet “biz değiliz” der.',
        analysis:
          'İsnat / kontrol testi. Sorumluluk.',
        takeaway: 'İsnadı kur.',
      },
      {
        title: 'UAD yetkisi',
        facts:
          'Davacı doğrudan UAD’ye gider; davalı rıza beyanı yok.',
        analysis:
          'Yetki yok. Rıza temelli yargı.',
        takeaway: 'Önce yetki rızası.',
      },
      {
        title: 'GK kararı',
        facts:
          'GA kararı ile GK VII. Bölüm kararı aynı bağlayıcılıkta yazılır.',
        analysis:
          'Organ ve bölüm farkı. Bağlayıcılık.',
        takeaway: 'Hangi organ, hangi nitelik?',
      },
    ],
    mindmap: {
      center: 'Milletlerarası Hukuk · 2. dönem',
      branches: [
        { label: 'Sorumluluk', items: ['İhlal', 'İsnat', 'Tazmin'] },
        { label: 'Kuvvet', items: ['Yasak', 'Müdafaa', 'GK'] },
        { label: 'Kurum', items: ['BM', 'UAD'] },
        { label: 'Birey', items: ['İnsan hakları', 'Ceza'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Kaynak ve özneden sorumluluk, kuvvet yasağı ve BM yargısına tek omurga.',
    promise:
      '1. + 2. dönem birleşik; milletlerarası / uluslararası hukuk için “tek cilt” not. Kaynak + kurum + yaptırım iskeleti.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: kaynak/özne mi, sorumluluk/kuvvet/BM mi?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: nitelik–kaynak → antlaşma–teamül → özne → sorumluluk–kuvvet → BM/UAD → karma.',
          'Her soruda: “Kaynak mı? Özne mi? İhlal/sorumluluk mu? Kurumsal yetki mi?”',
        ],
        hapBilgi: 'Yıllık başarı = doğru kaynak + doğru özne + doğru istisna.',
        bullets: [
          'Hafta 1–3: nitelik + m.38 kaynaklar + antlaşma',
          'Hafta 4–6: teamül + devlet/egemenlik + tanınma',
          'Hafta 7–10: sorumluluk + kuvvet yasağı + BM',
          'Hafta 11–14: UAD + insan hakları/ceza girişi + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Kaynak türü. Tip 2 — Antlaşma bağlayıcılığı. Tip 3 — Teamül unsurları. Tip 4 — Sorumluluk. Tip 5 — Kuvvet/meşru müdafaa. Tip 6 — UAD yetkisi.',
          'MÖHUK ile karıştırma. Uydurma madde/çözüm yazma; çerçeve dayanak ve ilke dili kullan.',
        ],
        uyari: 'Soft law’u bağlayıcı antlaşma gibi sunma.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Milletlerarası Hukuk · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Kaynak', 'Özne', 'Antlaşma'] },
        { label: '2. yarı', items: ['Sorumluluk', 'Kuvvet', 'BM/UAD'] },
        { label: 'Yöntem', items: ['Rıza', 'Teamül', 'İstisna'] },
        { label: 'Köprü', items: ['İç hukuk', 'İnsan hakları'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'milletlerarasi-hukuk-donem-1': d1Content,
  'milletlerarasi-hukuk-donem-2': d2Content,
  'milletlerarasi-hukuk-yillik': yillikContent,
};

export const MILLETLERARASI_HUKUK_VARIANTS = [
  'milletlerarasi-hukuk-donem-1',
  'milletlerarasi-hukuk-donem-2',
  'milletlerarasi-hukuk-yillik',
];

export function buildMilletlerarasiHukukVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Milletlerarası Hukuk ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Milletlerarası / Uluslararası Hukuk ${meta.h1Extra}`;
  const description = `${uni.name} için Milletlerarası Hukuk ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Milletlerarası Hukuk (uluslararası kamu hukuku) ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: kaynak, özne, antlaşma ve sorumluluk–kuvvet–BM iskeletini sınavda bozmadan yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. MÖHUK ile karıştırılmaz; bu ders kamu uluslararası hukuktur.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her soruda: kaynak mı, özne mi, ihlal mi?',
        'Kuvvet istisnalarını dar yaz',
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
        'BM Antlaşması, VCLT, UAD Statüsü m.38 omurgadır. Madde yazacaksanız güncel metinden doğrulayın.',
      ],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma madde / bağlayıcılık iddiası yazmayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Milletlerarası Hukuk)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık işe yarar. Kaynak sorularında unsur; kuvvet sorularında istisna darlığı yazın.`,
        'İskelet: (1) konu kutusu (2) kaynak/dayanak (3) özne (4) şart/istisna (5) sonuç.',
      ],
      bullets: [
        'MÖHUK ile karıştırma',
        'Teamülde iki unsuru yaz',
        'Kuvvet yasağında istisnayı dar tut',
        'UAD’de rıza şartını unutma',
      ],
      hapBilgi: 'Doğru kaynak + dar istisna = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Milletlerarası Hukuk ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Konu kutusunu seç',
        'Kaynak / dayanak',
        'Özne ve isnat',
        'Şart veya istisna',
        'Kurumsal yetki',
        'Sonuç',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'milletlerarasi-hukuk-donem-2'
          ? [
              ['Meşru müdafaa', 'GK yetkisi', 'Kim / hangi şart?'],
              ['GK kararı', 'GA kararı', 'Bağlayıcılık?'],
              ['UAD karar', 'Danışma görüşü', 'Taraflar için bağlar mı?'],
              ['Devlet sorumluluğu', 'Bireysel ceza', 'Kim sorumlu?'],
            ]
          : variantCode === 'milletlerarasi-hukuk-donem-1'
            ? [
                ['Antlaşma', 'Teamül', 'Yazılı rıza mı usus+opinio mı?'],
                ['Milletlerarası hukuk', 'MÖHUK', 'Kamu egemenler mi özel ilişki mi?'],
                ['İmza', 'Onay/yürürlük', 'Bağlayıcılık ne zaman?'],
                ['Devlet', 'Örgüt', 'Asli özne mi türetilmiş mi?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Kaynak/özne mi sorumluluk/kuvvet mi?'],
                ['Antlaşma', 'Soft law', 'Bağlayıcı mı?'],
                ['Yasak', 'İstisna', 'Kuvvet kullanma meşru mu?'],
                ['UAD', 'İç mahkeme', 'Rıza ve taraf ehliyeti?'],
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
      leftTitle: 'Kaynak / özne',
      rightTitle: 'Sorumluluk / kuvvet / kurum',
      left: 'Antlaşma–teamül–devlet–tanınma',
      right: 'İhlal–m.2/4–BM–UAD',
    },
    {
      kind: 'cycle',
      title: 'Haftalık döngü',
      steps: ['Kaynak', 'Şema', 'Örnek', 'Quiz', 'Yanlış defteri'],
    },
  ];

  const faq = [
    {
      q: '1. dönem / 2. dönem / yıllık farkı ne?',
      a: '1. dönem nitelik–kaynak–antlaşma–özne–egemenlik; 2. dönem sorumluluk–kuvvet–BM–UAD–insan hakları/ceza girişi; yıllık ikisini birleştirir.',
    },
    {
      q: 'MÖHUK ile farkı nedir?',
      a: 'MÖHUK yabancı unsurlu özel hukuk ilişkilerinde uygulanacak hukuku gösterir. Milletlerarası hukuk egemenler arası kamu hukukudur.',
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
    'Teamül ve kuvvet istisnası unsurlarını yazdım',
    'PDF’i arşivledim',
    variantCode === 'milletlerarasi-hukuk-yillik'
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
      `${uni.shortName} milletlerarası hukuk ${meta.short}`,
      `${uni.shortName} uluslararası hukuk ders notu`,
      `uluslararası hukuk ${meta.short} not pdf`,
      'antlaşma teamül BM UAD devlet sorumluluğu',
      'milletlerarası hukuk yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} uluslararası hukuk`),
      'ücretsiz hukuk ders notu',
    ],
    lead,
    promise: bank.promise,
    sixtySecond: bank.sixtySecond,
    examBox: {
      calendar: uni.calendar,
      typicalWeights: 'Ara sınav ~%30–40 · Final ~%50–60 (yönetmeliğe göre)',
      format: uni.type === 'vakif' ? 'Klasik + ara; vaka olabilir' : 'Klasik yazılı + vaka analizi',
      tips: [
        'Kaynak kutusunu seç',
        'Teamülde iki unsuru yaz',
        'Kuvvet istisnasını dar tut',
        'UAD rızasını unutma',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Milletlerarası hukuk ${meta.short} kurumlarını ayırır`,
      'Kaynak ve antlaşma rejimini kurar',
      'Sorumluluk ve kuvvet yasağını uygular',
      'BM ve UAD yetki dilini kullanır',
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
    relatedCourses: MILLETLERARASI_HUKUK_VARIANTS.filter((c) => c !== variantCode).concat([
      'milletlerarasi-hukuk',
      'devletler-ozel-yillik',
      'anayasa-yillik',
      'insan-haklari',
    ]),
    relatedBilgi: [],
    updated: '2026-07-30',
    wordTarget: variantCode === 'milletlerarasi-hukuk-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'milletlerarasi-hukuk',
    variantLabel: meta.label,
  };
}
