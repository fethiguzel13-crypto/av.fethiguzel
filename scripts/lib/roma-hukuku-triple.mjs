/**
 * Roma Hukuku —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * roma-hukuku dersiyle hizalı (mufredat: year 1).
 */

function baseMeta(variant) {
  const labels = {
    'roma-hukuku-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'Roma hukuku · 1. yarı (tarih, kaynaklar, ius civile–gentium, kişiler, aile, ehliyet)',
    },
    'roma-hukuku-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'Roma hukuku · 2. yarı (eşya, borçlar, actio, usul, Justinianus ve modern hukuk etkisi)',
    },
    'roma-hukuku-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope:
        'Roma hukuku tam omurga · kişiler + eşya + borçlar + usul · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Roma hukukunun kaynakları, kişi ve aile. Modern medeni hukukun kök haritası burada açılır.',
    promise:
      'Roma hukukunun dönemleri, ius civile / gentium / naturale, kaynaklar, kişi halleri, ehliyet, aile ve velayet omurgası. Güz finalinde “kaynak + statü + aile” bozulmadan yazarsınız.',
    sixtySecond: [
      'Roma hukuku: antik Roma’nın özel hukuk omurgası; modern kıta Avrupası’nın kökü.',
      'Dönemler: monarşi–cumhuriyet–prensip–dominat (çerçeve).',
      'Ius civile / ius gentium / ius naturale ayrımı bilinir.',
      'Kaynak: lex, plebiscitum, senatus consultum, edictum, jurisprudentia, constitutio.',
      'Kişi: status libertatis, civitatis, familiae.',
      'Aile: pater familias, manus, velayet ve miras girişi.',
    ],
    pillars: [
      'Roma hukukunun önemi ve modern etkiye girişi',
      'Tarihsel dönemler',
      'Hukuk türleri: civile, gentium, naturale',
      'Hukuk kaynakları',
      'Kişi ve statü',
      'Ehliyet ve kölelik/özgürlük',
      'Aile hukuku omurgası',
      'Vasiyet ve miras girişi',
    ],
    definitions: [
      {
        baslik: 'Ius civile',
        govde:
          'Roma yurttaşlarına özgü hukuktur. Dar anlamda yurttaşlık bağıyla uygulanan kurallar bütününü ifade eder.',
      },
      {
        baslik: 'Ius gentium',
        govde:
          'Yurttaş ile yabancı arasındaki ilişkilerde ve ticarete uygun genelleşmiş kurallardır. “Milletler hukuku” diline evrilmiştir; modern kamu hukuku ile karıştırılmaz.',
      },
      {
        baslik: 'Ius naturale',
        govde:
          'Doğa / akıl ölçütüne dayanan hukuk fikridir. Kölelik tartışmalarında ve klasik felsefede yer bulur; dogmatik kural listesi değildir.',
      },
      {
        baslik: 'Pater familias',
        govde:
          'Aile reisi; sui iuris kişidir. Aile üzerinde potestas yetkisi taşır. Modern velayet ile birebir eşlenmez; tarihsel kurumdur.',
      },
      {
        baslik: 'Status',
        govde:
          'Kişinin hukuki konumudur. Özgürlük, yurttaşlık ve aile statüsü üçlüsü (tripertita) klasik şemadır.',
      },
    ],
    traps: [
      'Ius gentium’u modern uluslararası kamu hukuku sanmak.',
      'Pater familias’ı bugünkü baba velayetiyle eşitlemek.',
      'Latince terimi ezberleyip işlev yazmamak.',
      'Köleliği “sözleşme tarafı” gibi anlatmak — res / kişi gerilimi.',
      'Kaynak listesini tarihsel dönemden koparmak.',
    ],
    keyMadde: [
      'Corpus Iuris Civilis — Justinianus derlemesi (çerçeve; 2. dönem bağ)',
      'Institutions / Digesta / Codex / Novellae iskeleti (giriş)',
      'XII Levha — erken dönem kaynak (çerçeve)',
      'Praetor buyrukları (edictum) — hukuk yaratımı (çerçeve)',
      'TMK / TBK — Roma mirası köprüsü (modern etki; 2. dönem)',
      'Latince anahtar: persona, res, actio, obligatio',
    ],
    sectionsExtra: [
      {
        heading: 'A. Neden Roma hukuku?',
        paragraphs: [
          'Kıta Avrupası medeni hukukunun kavram fabrikasıdır: kişi, eşya, borç, dava. Sınavda “tarih hikâyesi” değil, kurum + modern köprü puan getirir.',
          '1. dönem kaynak ve kişi–aile omurgasını taşır; eşya–borç–actio 2. döneme kalır.',
        ],
        hapBilgi: 'Roma = kavram kökü; modern = dönüşmüş uygulama.',
      },
      {
        heading: 'B. Tarihsel dönemler',
        paragraphs: [
          'Krallık, cumhuriyet, prensip (principatus), dominat. Klasik hukuk (yaklaşık I–III. yy) ve postklasik dönem ayrımı bilinir.',
          'Justinianus derlemesi geç dönem sentezidir; 2. dönemde açılır.',
        ],
        bullets: [
          'Erken dönem / XII Levha',
          'Klasik hukukçular',
          'Praetor hukuku',
          'İmparatorluk anayasaları',
        ],
      },
      {
        heading: 'C. Ius civile – gentium – naturale',
        paragraphs: [
          'Üçlü şema sınav klasiğidir. Civile dar, gentium geniş ve pratik, naturale ölçüt / ideal. Karıştırmayın.',
        ],
        kartlar: [
          { baslik: 'Civile', govde: 'Yurttaşa özgü.' },
          { baslik: 'Gentium', govde: 'Genel / ticari pratik.' },
          { baslik: 'Naturale', govde: 'Doğa / akıl ölçütü.' },
        ],
      },
      {
        heading: 'D. Kaynaklar',
        paragraphs: [
          'Yasa, plebisit, senato kararı, praetor buyruğu, hukukçu görüşü (responsa), imparator anayasası. Hangi dönemde hangisinin ağır bastığı yazılır.',
          'Jurisprudentia: hukuk biliminin yaratıcı rolü.',
        ],
        uyari: 'Kaynak adı + işlev. Salt liste yetmez.',
      },
      {
        heading: 'E. Kişi ve statü',
        paragraphs: [
          'Persona. Özgür / köle; yurttaş / Latin / yabancı; sui iuris / alieni iuris. Capitis deminutio (statü kaybı) girişi.',
          'Ehliyet: hak ehliyeti ile fiil ehliyeti modern dilde köprülenir; Roma’da potestas altında olmak fiil alanını daraltır.',
        ],
        hapBilgi: 'Statü üçlüsü: özgürlük + yurttaşlık + aile.',
      },
      {
        heading: 'F. Aile',
        paragraphs: [
          'Agnatik aile, potestas, manus’lu / manus’suz evlilik, velayet, vesayet (tutela) ve cura. Kadın ve çocukların hukuki konumu tarihsel çerçevede yazılır.',
        ],
      },
      {
        heading: 'G. Miras girişi',
        paragraphs: [
          'Yasal miras ve vasiyet. Heres, legatum. Detay fakültelere göre değişir; iskelet: kime ne geçer, vasiyet özgürlüğü sınırları.',
        ],
      },
    ],
    examples: [
      {
        title: 'Ius gentium',
        facts:
          'Öğrenci “uluslararası kamu hukuku” diye yazar.',
        analysis:
          'Yanlış köprü. Roma özel hukuk pratiği. Modern IPP/kamu ayrımı.',
        takeaway: 'Gentium ≠ modern kamu uluslararası.',
      },
      {
        title: 'Statü',
        facts:
          'Köle “sözleşme yapar” denir; ehliyet yok sayılır.',
        analysis:
          'Köle hukuken res. Temsil / peculium istisnaları çerçeve.',
        takeaway: 'Statüyü ilk yaz.',
      },
      {
        title: 'Pater familias',
        facts:
          'Modern “aile reisi” ile birebir eşleme.',
        analysis:
          'Potestas tarihsel. TMK velayet farklı.',
        takeaway: 'Köprü kur, eşitleme.',
      },
      {
        title: 'Kaynak',
        facts:
          'Praetor edictum’u “kanun” sanılır.',
        analysis:
          'Buyruk / hukuk yaratımı. Yasa ile fark.',
        takeaway: 'Kaynak türünü ayır.',
      },
    ],
    mindmap: {
      center: 'Roma Hukuku · 1. dönem',
      branches: [
        { label: 'Tarih', items: ['Dönemler', 'Klasik'] },
        { label: 'Ius', items: ['Civile', 'Gentium', 'Naturale'] },
        { label: 'Kaynak', items: ['Lex', 'Edictum', 'Jurispr.'] },
        { label: 'Kişi', items: ['Status', 'Aile'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Res, obligatio, actio. Eşya–borç–dava üçlüsü ve modern miras.',
    promise:
      'Eşya (res), ayni haklar, borç ilişkileri (sözleşme ve haksız fiil), actio ve usul, Justinianus derlemesi, modern medeni hukuka etki. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Res: mallar; mancipi / nec mancipi, taşınır–taşınmaz köprüsü.',
      'Mülkiyet (dominium) ve iyelik (possessio) ayrılır.',
      'Obligatio: dare, facere, praestare — borç içeriği.',
      'Sözleşme türleri: emptio venditio, locatio, societas, mandatum…',
      'Delicta: haksız fiil ailesi (furtum, damnum, iniuria…).',
      'Actio: dava hakkı; usul dönemleri (legis actio, formulare, cognitio).',
    ],
    pillars: [
      'Eşya (res) sınıflandırması',
      'Mülkiyet ve iyelik',
      'Ayni haklar ve devir (mancipatio, traditio)',
      'Borç ilişkisi (obligatio)',
      'Sözleşmeler',
      'Haksız fiiller (delicta)',
      'Actio ve yargılama usulü',
      'Justinianus ve modern etki',
    ],
    definitions: [
      {
        baslik: 'Dominium',
        govde:
          'Roma’da tam mülkiyettir. Kullanma, yararlanma ve tasarruf yetkilerini içerir. İyelikten (possessio) ayrılır.',
      },
      {
        baslik: 'Possessio',
        govde:
          'Fiilî hâkimiyet + animus (iyelik iradesi). Koruma davaları mülkiyetten bağımsız işleyebilir.',
      },
      {
        baslik: 'Obligatio',
        govde:
          'Alacaklıya belirli bir edimi talep yetkisi, borçluya edim yükü veren hukuki bağdır. Kaynak: sözleşme, haksız fiil, sanki-sözleşme/sanki-haksız fiil (klasik şema).',
      },
      {
        baslik: 'Actio',
        govde:
          'Dava hakkıdır. Roma’da hak çoğu zaman actio üzerinden görünür. “Hak yoksa dava yok” düşüncesine yakındır; modern sübjektif hak dilinden farkı bilinir.',
      },
      {
        baslik: 'Corpus Iuris Civilis',
        govde:
          'Justinianus’un derlemesidir: Institutions, Digesta (Pandectae), Codex, Novellae. Ortaçağ ve modern resepsiyonun temel metnidir.',
      },
    ],
    traps: [
      'Dominium ile possessio’yu eşitlemek.',
      'Her borcu modern TBK tipi sanmak — actio odaklı düşün.',
      'Mancipatio / traditio devir farkını atlamak.',
      'Justinianus’u “tek kanun koyucu hikâye” sanmak — derleme + reform.',
      'Latince isim yığıp kurum işlevi yazmamak.',
    ],
    keyMadde: [
      'Res mancipi / nec mancipi — devir biçimi (çerçeve)',
      'Emptio venditio — satım (çerçeve)',
      'Locatio conductio — kira / istisna / hizmet (çerçeve)',
      'Delicta — furtum, damnum iniuria datum, iniuria (çerçeve)',
      'Formulalı usul — intentio, condemnatio (çerçeve)',
      'TBK / TMK — Roma kökenli kurumlar (satım, vekâlet, rehin…)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Eşya (res)',
        paragraphs: [
          'Res corporales / incorporales; mancipi / nec mancipi. Devir: mancipatio, in iure cessio, traditio. Usucapio (kazandırıcı zamanaşımı) girişi.',
          'Modern taşınır–taşınmaz ve tescil ile köprü kurulur; birebir eşleme yapılmaz.',
        ],
        hapBilgi: 'Mal sınıfı → devir biçimi.',
      },
      {
        heading: 'B. Mülkiyet ve iyelik',
        paragraphs: [
          'Dominium ex iure Quiritium. İyelik koruması (interdicta). İyi niyetli iyelik ve zamanaşımı bağlantısı.',
        ],
        kartlar: [
          { baslik: 'Dominium', govde: 'Tam mülkiyet.' },
          { baslik: 'Possessio', govde: 'Fiilî hâkimiyet.' },
          { baslik: 'Usucapio', govde: 'Zamanaşımıyla iktisap.' },
          { baslik: 'Actio', govde: 'Koruma davası.' },
        ],
      },
      {
        heading: 'C. Obligatio',
        paragraphs: [
          'Edim türleri: dare, facere, praestare. Stricti iuris / bonae fidei sözleşmeler. Temerrüt ve imkânsızlık girişi.',
        ],
      },
      {
        heading: 'D. Sözleşmeler',
        paragraphs: [
          'Konsensüel: satım, kira (locatio), ortaklık, vekâlet. Real / verbal / litteris sözleşmeler çerçevede anılır.',
          'Modern TBK özel borç ilişkilerine köprü: satım, kira, vekâlet, eser.',
        ],
        uyari: 'İsim listesi yetmez; kuruluş + borçlar yaz.',
      },
      {
        heading: 'E. Delicta',
        paragraphs: [
          'Furtum (hırsızlık), damnum iniuria datum (zarar), iniuria (hakaret/saldırı). Cezaî–tazminî karışık karakter. Modern haksız fiil ile köprü.',
        ],
      },
      {
        heading: 'F. Actio ve usul',
        paragraphs: [
          'Legis actiones, formulalı usul, cognitio extra ordinem. Formula parçaları: intentio, demonstratio, condemnatio (çerçeve).',
          'Hak–dava birlikteliği modern sübjektif hak anlayışından farklı vurgulanır.',
        ],
        hapBilgi: 'Roma’da çoğu zaman hak, actio ile görünür.',
      },
      {
        heading: 'G. Justinianus ve modern etki',
        paragraphs: [
          'Corpus Iuris Civilis parçaları ve işlevi. Ortaçağ glosatörleri, usus modernus, Fransız–Alman kodifikasyonları, Türk medeni hukukuna resepsiyon hattı.',
          'Sınav cümlesi: “Bu Roma kurumu bugün TBK/TMK’de nasıl dönüştü?”',
        ],
      },
    ],
    examples: [
      {
        title: 'Dominium / possessio',
        facts:
          'Malı elinde tutan “malik” sayılır; ispat yok.',
        analysis:
          'İyelik ≠ mülkiyet. Koruma davası farkı.',
        takeaway: 'İki kurumu ayır.',
      },
      {
        title: 'Satım',
        facts:
          'Emptio venditio; rıza var, mal devri yok.',
        analysis:
          'Borç doğuran sözleşme. Mülkiyet devri ayrı işlem.',
        takeaway: 'Borç / ayni devir ayrımı.',
      },
      {
        title: 'Actio',
        facts:
          'Öğrenci yalnız “hak var” der; dava türü yok.',
        analysis:
          'Roma’da actio seçimi kritik. Formula / talep.',
        takeaway: 'Hangi actio?',
      },
      {
        title: 'Modern köprü',
        facts:
          'Vekâlet (mandatum) TBK ile ilişkilendirilmez.',
        analysis:
          'Resepsiyon. Dönüşüm. Farklar.',
        takeaway: 'Roma → modern bir cümle.',
      },
    ],
    mindmap: {
      center: 'Roma Hukuku · 2. dönem',
      branches: [
        { label: 'Res', items: ['Dominium', 'Possessio'] },
        { label: 'Obligatio', items: ['Sözleşme', 'Delictum'] },
        { label: 'Actio', items: ['Formula', 'Usul'] },
        { label: 'Miras', items: ['Corpus', 'Resepsiyon'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Kaynak ve kişiden eşya–borç–actio’ya, Justinianus’tan modern medeni hukuka tek omurga.',
    promise:
      '1. + 2. dönem birleşik; Roma hukuku için “tek cilt” not. Kurum + Latince anahtar + modern köprü.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: kişi/kaynak mı, res/obligatio/actio mu?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: dönemler–ius–kaynak → kişi/aile → res/dominium → obligatio/actio → Justinianus–modern → karma.',
          'Her soruda: “Kurum ne? Latince adı? Modern köprü?”',
        ],
        hapBilgi: 'Yıllık başarı = kurum + işlev + modern bağ.',
        bullets: [
          'Hafta 1–3: tarih + ius türleri + kaynaklar',
          'Hafta 4–6: kişi + aile + miras girişi',
          'Hafta 7–10: res + mülkiyet + borçlar',
          'Hafta 11–14: actio + usul + Corpus + modern + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Ius civile/gentium. Tip 2 — Status. Tip 3 — Dominium/possessio. Tip 4 — Obligatio/sözleşme. Tip 5 — Actio. Tip 6 — Modern resepsiyon.',
          'Latince terimi yalnız bırakma; bir cümle işlev ekle. Uydurma tarih ve alıntı yazma.',
        ],
        uyari: 'Ezber glos değil; kurumsal işlev yaz.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Roma Hukuku · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Kaynak', 'Kişi', 'Aile'] },
        { label: '2. yarı', items: ['Res', 'Borç', 'Actio'] },
        { label: 'Yöntem', items: ['Terim', 'İşlev', 'Köprü'] },
        { label: 'Mirası', items: ['Corpus', 'TMK/TBK'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'roma-hukuku-donem-1': d1Content,
  'roma-hukuku-donem-2': d2Content,
  'roma-hukuku-yillik': yillikContent,
};

export const ROMA_HUKUKU_VARIANTS = [
  'roma-hukuku-donem-1',
  'roma-hukuku-donem-2',
  'roma-hukuku-yillik',
];

export function buildRomaHukukuVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Roma Hukuku ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Roma Hukuku ${meta.h1Extra}`;
  const description = `${uni.name} için Roma Hukuku ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Roma Hukuku ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: Latince anahtar kurumları işlevleriyle kurmak ve modern medeni hukuka köprülemek. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Latince terim + Türkçe işlev + (mümkünse) modern köprü üçlüsü hedeflenir.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her terim: Latince | işlev | modern bağ',
        'Ezber listeden çok kurum haritası',
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
      paragraphs: ['İşler tanım = işlev fısıldayan cümle.'],
      kartlar: bank.definitions,
    },
    {
      heading: '5. Pusula dayanaklar / anahtarlar',
      paragraphs: [
        'Birincil metinler tarihsel derlemelerdir. Modern köprü için TMK/TBK kurum adları yeter; uydurma Latince alıntı yasak.',
      ],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma Latince cümle / tarih yazmayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Roma Hukuku)',
      paragraphs: [
        `${uni.shortName} klasiklerinde tanım + ayrım + modern köprü puan getirir. 60 dk / 2–3 soruda planlı yazın.`,
        'İskelet: (1) kurum (2) Latince ad (3) işlev (4) ayrım (5) modern bağ.',
      ],
      bullets: [
        'Latince adı doğru yaz',
        'İşlevi bir cümlede ver',
        'Karşıt kurumu ayır',
        'TMK/TBK köprüsü ekle',
      ],
      hapBilgi: 'Terim + işlev + köprü = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Roma Hukuku ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Kurumu adlandır',
        'Latince karşılık',
        'İşlevi yaz',
        'Ayrımı kur',
        'Modern köprü',
        'Kısa sonuç',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'roma-hukuku-donem-2'
          ? [
              ['Dominium', 'Possessio', 'Mülkiyet mi iyelik mi?'],
              ['Obligatio', 'Actio', 'Borç bağı mı dava hakkı mı?'],
              ['Sözleşme', 'Delictum', 'Rıza mı haksız fiil mi?'],
              ['Mancipatio', 'Traditio', 'Hangi devir biçimi?'],
            ]
          : variantCode === 'roma-hukuku-donem-1'
            ? [
                ['Ius civile', 'Ius gentium', 'Yurttaşa özgü mü genel mi?'],
                ['Sui iuris', 'Alieni iuris', 'Potestas altında mı?'],
                ['Özgür', 'Köle', 'Persona mı res mi?'],
                ['Lex', 'Edictum', 'Yasa mı praetor buyruğu mu?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Kişi/kaynak mı res/borç mu?'],
                ['Status', 'Dominium', 'Kişi hali mi mal mı?'],
                ['Obligatio', 'Actio', 'Borç mu dava mı?'],
                ['Roma kurumu', 'Modern kurum', 'Nasıl dönüştü?'],
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
        'Modern köprü denemesi',
      ],
    },
    {
      kind: 'fork',
      title: 'Soru tipi',
      leftTitle: 'Kaynak / kişi',
      rightTitle: 'Res / borç / actio',
      left: 'Ius–kaynak–status–aile',
      right: 'Dominium–obligatio–actio–Corpus',
    },
    {
      kind: 'cycle',
      title: 'Haftalık döngü',
      steps: ['Terim', 'Şema', 'Örnek', 'Köprü', 'Quiz'],
    },
  ];

  const faq = [
    {
      q: '1. dönem / 2. dönem / yıllık farkı ne?',
      a: '1. dönem tarih–kaynak–ius türleri–kişi/aile; 2. dönem res–borç–actio–Justinianus/modern etki; yıllık ikisini birleştirir.',
    },
    {
      q: 'Latince ezber şart mı?',
      a: 'Anahtar terimler evet; fakat puan işlev ve ayrım cümlesindedir. Salt glos listesi yetmez.',
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
    '5 Latince terimi işleviyle yazdım',
    'PDF’i arşivledim',
    variantCode === 'roma-hukuku-yillik'
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
      `${uni.shortName} roma hukuku ${meta.short}`,
      `${uni.shortName} ius civile ders notu`,
      `roma hukuku ${meta.short} not pdf`,
      'dominium obligatio actio justinianus',
      'roma hukuku yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} roma hukuku`),
      'ücretsiz hukuk ders notu',
    ],
    lead,
    promise: bank.promise,
    sixtySecond: bank.sixtySecond,
    examBox: {
      calendar: uni.calendar,
      typicalWeights: 'Ara sınav ~%30–40 · Final ~%50–60 (yönetmeliğe göre)',
      format: uni.type === 'vakif' ? 'Kısa tanım + klasik; Latince terim sorusu olabilir' : 'Klasik yazılı + tanım/ayrım',
      tips: [
        'Latince adı doğru yaz',
        'İşlevi bir cümlede ver',
        'Karşıt kurumu ayır',
        'Modern köprü ekle',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Roma hukuku ${meta.short} kurumlarını ayırır`,
      'Kaynak ve kişi–aile omurgasını kurar',
      'Res–obligatio–actio dilini kullanır',
      'Modern medeni hukuka köprü kurar',
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
    relatedCourses: ROMA_HUKUKU_VARIANTS.filter((c) => c !== variantCode).concat([
      'roma-hukuku',
      'hukuka-giris-yillik',
      'medeni-baslangic',
      'borclar-genel-yillik',
      'esya-hukuku-yillik',
    ]),
    relatedBilgi: [],
    updated: '2026-07-30',
    wordTarget: variantCode === 'roma-hukuku-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'roma-hukuku',
    variantLabel: meta.label,
  };
}
