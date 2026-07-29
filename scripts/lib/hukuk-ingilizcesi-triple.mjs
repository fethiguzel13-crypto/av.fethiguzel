/**
 * Hukuk İngilizcesi (Legal English) —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * hukuk-ingilizcesi dersiyle hizalı.
 */

function baseMeta(variant) {
  const labels = {
    'hukuk-ingilizcesi-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'Legal English · 1. yarı (temel hukuki İngilizce, mahkeme–taraf–sözleşme kelime dağarcığı, TR–EN eşleme)',
    },
    'hukuk-ingilizcesi-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'Legal English · 2. yarı (dava dili, ceza–usul terimleri, yazışma, karar okuma, sunum cümleleri)',
    },
    'hukuk-ingilizcesi-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope:
        'Hukuk İngilizcesi tam omurga · kelime + cümle kalıbı + metin okuma · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Temel legal vocabulary. Taraf, mahkeme, sözleşme ve hak dilini İngilizce kur.',
    promise:
      'Hukuki İngilizcenin temelleri, mahkeme ve taraf terimleri, sözleşme omurgası, kişiler–borç–eşya kelime setleri, TR–EN eşleme. Güz sınavında “doğru terim + doğru cümle” yazarsınız.',
    sixtySecond: [
      'Legal English ≠ günlük İngilizce; terim sabittir.',
      'Court / tribunal / jurisdiction ayrımı bilinir.',
      'Plaintiff–defendant / claimant–respondent bağlamı.',
      'Contract: offer, acceptance, consideration (common law çerçevesi).',
      'Right / duty / liability / remedy kutuları.',
      'TR terimi → EN karşılık → örnek cümle.',
    ],
    pillars: [
      'Hukuk İngilizcesinin amacı ve sınav mantığı',
      'Temel hukuk kelime dağarcığı',
      'Yargı ve mahkeme terimleri',
      'Taraf ve usul girişi',
      'Sözleşme (contract) omurgası',
      'Hak–yükümlülük–sorumluluk dili',
      'TR–EN eşleme disiplini',
      'Kısa cümle kalıpları (güz)',
    ],
    definitions: [
      {
        baslik: 'Legal English',
        govde:
          'Hukuki metin, konuşma ve yazışmada kullanılan özel İngilizce kaydıdır. Günlük dildeki kelime hukuki bağlamda farklı anlam taşıyabilir.',
      },
      {
        baslik: 'Jurisdiction',
        govde:
          'Yetki / yargı yetkisi. Hem “hangi mahkeme?” hem “hangi hukuk düzeni?” anlamında kullanılır. TR: yetki / yargı yetkisi.',
      },
      {
        baslik: 'Liability',
        govde:
          'Sorumluluk; hukuki sonuç yüklenebilirlik. Criminal liability / civil liability ayrımı sınavda sık sorulur.',
      },
      {
        baslik: 'Remedy',
        govde:
          'Hukuki çare / yaptırım yolu. Damages (tazminat), injunction (ihtiyati tedbir/men), specific performance (aynen ifa) örnekleri.',
      },
      {
        baslik: 'Consideration',
        govde:
          'Common law sözleşmesinde karşılık / bedel unsuru. Kıta Avrupası / Türk hukukunda birebir “bedel” ile her zaman örtüşmez; bağlam yazılır.',
      },
    ],
    traps: [
      'Court ile tribunal’ı her yerde aynı yazmak.',
      'Plaintiff / claimant / applicant karıştırmak (usul sistemi).',
      '“Responsibility” ile “liability”yi eşitlemek.',
      'Sözleşme terimlerini TR’den kelime kelime çevirmek.',
      'False friend: “actual” ≠ “aktüel”; “party” ≠ “parti”.',
    ],
    keyMadde: [
      'Contract vocabulary: offer · acceptance · breach · termination',
      'Court vocabulary: court · judge · judgment · appeal',
      'Parties: plaintiff / claimant · defendant · respondent · appellant',
      'Rights & duties: right · obligation · duty · liability · remedy',
      'Civil / criminal / administrative law (branch labels)',
      'Common law vs civil law (system labels — çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Bu ders ne işe yarar?',
        paragraphs: [
          'Amaç: uluslararası metin, karar özeti, staj ve sınavda hukuki İngilizceyi bozmadan kullanmak. Not Türkçe anlatır; terimler ve kalıplar İngilizcedir.',
          '1. dönem kelime ve temel cümle omurgasını taşır. Dava dili, yazışma ve karar okuma 2. döneme kalır.',
        ],
        hapBilgi: 'Terim sabit · cümle kısa · bağlam net.',
      },
      {
        heading: 'B. Temel kelime seti',
        paragraphs: [
          'Law, legal, statute, regulation, case, precedent, doctrine, principle. Her kelime için TR karşılık + bir örnek cümle ezberlenir.',
          'Branch labels: private law / public law; civil / criminal / administrative / commercial.',
        ],
        bullets: [
          'law / legal system',
          'statute / act / code',
          'case / judgment / precedent',
          'provision / article / section',
        ],
      },
      {
        heading: 'C. Mahkeme ve yargı',
        paragraphs: [
          'Court of first instance, appellate court, supreme court; judge, panel, hearing, judgment, order. Jurisdiction ve venue ayrımı bilinir.',
          'TR idari yargı / adli yargı farkı İngilizcede civil–administrative–criminal labels ile bağlanır; birebir çeviri tuzağına düşülmez.',
        ],
        kartlar: [
          { baslik: 'Court', govde: 'Mahkeme (genel).' },
          { baslik: 'Tribunal', govde: 'Özel yargı / kurul.' },
          { baslik: 'Hearing', govde: 'Duruşma / oturum.' },
          { baslik: 'Judgment', govde: 'Hüküm / karar.' },
        ],
      },
      {
        heading: 'D. Taraflar',
        paragraphs: [
          'Plaintiff/claimant vs defendant; appellant vs respondent; applicant. Hangi usul sisteminde hangi etiketin kullanıldığı not edilir.',
          'Counsel, attorney, barrister/solicitor (UK) farkı çerçevede tanınır; TR “avukat” karşılığı context’e göre lawyer / counsel olur.',
        ],
        uyari: 'Etiketi usul sistemine göre seç; ezbere plaintiff yazma.',
      },
      {
        heading: 'E. Sözleşme omurgası (Legal English)',
        paragraphs: [
          'Offer, acceptance, consideration (CL), intention, capacity, terms, conditions, warranties, breach, damages, termination, force majeure.',
          'TR TBK ile birebir eşleme her zaman mümkün değildir. Sınavda: İngilizce terim + kısa TR notu + örnek cümle.',
        ],
        hapBilgi: 'Contract chain: form → terms → breach → remedy.',
      },
      {
        heading: 'F. Hak, yükümlülük, sorumluluk',
        paragraphs: [
          'Right / duty / obligation / liability / responsibility ayrımı. Tort liability, contractual liability, strict liability etiketleri.',
          'Remedy ailesi: damages, injunction, specific performance, rescission (çerçeve).',
        ],
      },
      {
        heading: 'G. TR–EN eşleme disiplini',
        paragraphs: [
          'Üç sütun: TR terim | EN terim | örnek cümle. False friend listesi ayrı tutulur. Kelime kelime Google Translate yasağı zihinde işlenir.',
        ],
      },
    ],
    examples: [
      {
        title: 'Taraf etiketi',
        facts:
          'Öğrenci her davada “plaintiff” yazar; metin İngiltere idari başvurusudur.',
        analysis:
          'Applicant / claimant / plaintiff ayrımı. Usul bağlamı.',
        takeaway: 'Etiket = sistem + dava türü.',
      },
      {
        title: 'Liability',
        facts:
          '“The company is responsible for the damage” cümlesi sınavda zayıf bulunur.',
        analysis:
          'Liable / liability daha hukuki. Responsible günlük/ahlaki ton taşıyabilir.',
        takeaway: 'liability tercih et.',
      },
      {
        title: 'Sözleşme zinciri',
        facts:
          'Breach sorulur; öğrenci yalnız “bozma” yazar, remedy yok.',
        analysis:
          'Breach → damages / other remedies. Zincir eksik.',
        takeaway: 'İhlal + çare birlikte.',
      },
      {
        title: 'False friend',
        facts:
          '“Actual damages” → “aktüel zarar” çevirisi.',
        analysis:
          'Actual ≈ gerçek / fiili. False friend tuzağı.',
        takeaway: 'Günlük anlam ≠ hukuki anlam.',
      },
    ],
    mindmap: {
      center: 'Legal English · 1. dönem',
      branches: [
        { label: 'Core', items: ['Law', 'Court', 'Case'] },
        { label: 'Parties', items: ['Claimant', 'Defendant'] },
        { label: 'Contract', items: ['Offer', 'Breach', 'Remedy'] },
        { label: 'Method', items: ['TR–EN', 'Sentence'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Dava dili, ceza–usul terimleri, yazışma ve karar okuma. Cümleyi sahaya taşı.',
    promise:
      'Litigation vocabulary, ceza ve usul İngilizcesi, hukuki yazışma kalıpları, judgment okuma, oral presentation cümleleri. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Litigation: claim, defence, evidence, burden of proof.',
      'Criminal: offence, mens rea, actus reus, prosecution (çerçeve).',
      'Procedure: filing, service, hearing, appeal.',
      'Correspondence: formal letter / email kalıpları.',
      'Reading judgments: facts–issue–holding–reasoning.',
      'Speaking: “In my submission…”, “The court held that…”.',
    ],
    pillars: [
      'Dava ve yargılama dili',
      'İspat ve delil terimleri',
      'Ceza hukuku İngilizcesi (giriş)',
      'Usul ve kanun yolu etiketleri',
      'Hukuki yazışma kalıpları',
      'Karar / metin okuma yöntemi',
      'Sözlü sunum ve argüman cümleleri',
      '1. dönem kelime ile entegrasyon',
    ],
    definitions: [
      {
        baslik: 'Litigation',
        govde:
          'Dava / yargılama süreci. Claim, pleadings, evidence, trial/hearing, judgment, appeal omurgası.',
      },
      {
        baslik: 'Burden of proof',
        govde:
          'İspat yükü. Kim neyi ispatlar? Standard of proof (civil / criminal) ile birlikte yazılır.',
      },
      {
        baslik: 'Mens rea / actus reus',
        govde:
          'Ceza hukukunda manevi unsur / maddi unsur etiketleri (common law geleneği dili). TR TCK unsurlarıyla köprü kurulur; birebir kopya sanılmaz.',
      },
      {
        baslik: 'Holding',
        govde:
          'Kararın bağlayıcı / sonuç kısmı; mahkemenin hukuki sonucu. Ratio / reasoning ile birlikte okunur.',
      },
      {
        baslik: 'Without prejudice',
        govde:
          'Yazışmada “haklarım saklı / uzlaşma görüşmesi koruması” tonu taşıyan klasik etiket (bağlama dikkat; sistem farkı).',
      },
    ],
    traps: [
      'Evidence ile proof’u aynı saymak.',
      'Appeal / cassation / judicial review etiketlerini karıştırmak.',
      'Yazışmada aşırı günlük dil veya aşırı argo.',
      'Karar özetinde yalnız facts yazıp holding atlamak.',
      '1. dönem kelimeyi unutup 2. dönemde sıfırdan başlamak.',
    ],
    keyMadde: [
      'Litigation set: claim · defence · motion · order · costs',
      'Evidence set: witness · exhibit · testimony · cross-examination',
      'Criminal set: offence · charge · conviction · sentence · acquittal',
      'Appeal set: appeal · appellant · respondent · overturn / uphold',
      'Letter phrases: We hereby… / Please find enclosed… / We remain…',
      'Oral phrases: In my submission… / The issue is whether… / The court held…',
    ],
    sectionsExtra: [
      {
        heading: 'A. Litigation vocabulary',
        paragraphs: [
          'Claim, statement of claim, defence, counterclaim, interim measures, costs, settlement. TR HMK diliyle köprü: dava dilekçesi, cevap, ıslah, teminat (etiket dikkat).',
          'Hearing vs trial; judgment vs order; enforceable decision.',
        ],
        hapBilgi: 'Claim → defence → evidence → judgment → appeal.',
      },
      {
        heading: 'B. İspat dili',
        paragraphs: [
          'Evidence, witness, documentary evidence, expert report, burden of proof, standard of proof, on the balance of probabilities / beyond reasonable doubt (CL çerçeve).',
          'Sınavda: terim + hangi taraf + hangi standart.',
        ],
        kartlar: [
          { baslik: 'Evidence', govde: 'Delil.' },
          { baslik: 'Burden', govde: 'İspat yükü.' },
          { baslik: 'Standard', govde: 'İspat ölçüsü.' },
          { baslik: 'Witness', govde: 'Tanık.' },
        ],
      },
      {
        heading: 'C. Ceza İngilizcesi (giriş)',
        paragraphs: [
          'Offence, crime, prosecution, charge, indictment (bağlam), conviction, sentence, acquittal, parole (çerçeve). Mens rea / actus reus etiketleri.',
          'TR TCK ile isim eşlemesi yapılır; common law doktrinini Türk ceza gibi yazma.',
        ],
        uyari: 'Sistem farkını bir cümleyle işaretle.',
      },
      {
        heading: 'D. Kanun yolu etiketleri',
        paragraphs: [
          'Appeal, appellant, respondent, uphold, overturn, remand. Judicial review / cassation etiketleri sisteme göre ayrılır.',
          'İdari yargı / temyiz dilinde “appeal to the Council of State” gibi açıklayıcı cümle tercih edilebilir.',
        ],
      },
      {
        heading: 'E. Hukuki yazışma',
        paragraphs: [
          'Konu satırı, hitap, amaç cümlesi, talep, kapanış. Formal register: hereby, pursuant to, kindly, enclosed, further to.',
          'E-posta da profesyonel kalır; emoji ve argo yok. Kısa paragraflar.',
        ],
        hapBilgi: 'Purpose → facts → request → close.',
      },
      {
        heading: 'F. Karar okuma yöntemi',
        paragraphs: [
          'Facts → procedural history → issues → holdings → reasoning → disposition. Anahtar cümleleri işaretle; tüm metni ezberleme.',
          'Özet şablonu 6–8 cümle: who, what, issue, held, why, result.',
        ],
      },
      {
        heading: 'G. Sözlü sunum kalıpları',
        paragraphs: [
          'Opening: “The issue before us is…” Body: “First… Second…” Authority: “The court held that…” Close: “For these reasons…”.',
          'Sesli tekrar: günde 5 kalıp. Sınavda yazıya da taşınır.',
        ],
      },
    ],
    examples: [
      {
        title: 'Karar özeti',
        facts:
          'Öğrenci uzun facts yazar; holding yok.',
        analysis:
          'Issue + holding + result eksik. Puan düşük.',
        takeaway: 'FIHRD iskeleti (facts–issue–holding–reasoning–disposition).',
      },
      {
        title: 'Yazışma tonu',
        facts:
          '“Hey, send me the contract asap lol” taslağı.',
        analysis:
          'Register hatası. Formal legal correspondence.',
        takeaway: 'Purpose + formal phrases.',
      },
      {
        title: 'Appeal dili',
        facts:
          '“The defendant appealed and won” — kim appellant?',
        analysis:
          'Appellant/respondent etiketleri. Uphold/overturn.',
        takeaway: 'Rol + sonuç fiili.',
      },
      {
        title: 'İspat',
        facts:
          'Civil claim’de “beyond reasonable doubt” yazılır.',
        analysis:
          'Yanlış standard. Civil vs criminal.',
        takeaway: 'Standard of proof bağlamı.',
      },
    ],
    mindmap: {
      center: 'Legal English · 2. dönem',
      branches: [
        { label: 'Litigation', items: ['Claim', 'Evidence', 'Judgment'] },
        { label: 'Criminal', items: ['Offence', 'Charge', 'Sentence'] },
        { label: 'Skills', items: ['Letter', 'Reading', 'Speaking'] },
        { label: 'Appeal', items: ['Uphold', 'Overturn'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Temel legal vocabulary’den dava dili, yazışma ve karar okumaya tek omurga.',
    promise:
      '1. + 2. dönem birleşik; Hukuk İngilizcesi için “tek cilt” not. Kelime + kalıp + metin becerisi.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: kelime mi, cümle kalıbı mı, metin özeti mi?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: core vocab → contract/parties → litigation/evidence → letters/judgments → karma quiz.',
          'Her çalışmada: TR terim | EN terim | örnek cümle.',
        ],
        hapBilgi: 'Yıllık başarı = sabit terim + kısa cümle + bağlam.',
        bullets: [
          'Hafta 1–3: core law + court + parties',
          'Hafta 4–6: contract + rights/liability',
          'Hafta 7–10: litigation + evidence + criminal labels',
          'Hafta 11–14: correspondence + judgment reading + oral + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — TR–EN eşleme. Tip 2 — Contract chain. Tip 3 — Party labels. Tip 4 — Litigation path. Tip 5 — Letter. Tip 6 — Judgment summary.',
          'Karma soruda önce kelime kutusunu seç, sonra cümleyi kur. Uydurma idiom yazma; sınav kalıplarını kullan.',
        ],
        uyari: 'Google Translate cümlesi = false friend riski.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Legal English · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Vocab', 'Court', 'Contract'] },
        { label: '2. yarı', items: ['Litigation', 'Letters', 'Judgments'] },
        { label: 'Skills', items: ['TR–EN', 'Sentence', 'Summary'] },
        { label: 'Exam', items: ['Label', 'Phrase', 'Context'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'hukuk-ingilizcesi-donem-1': d1Content,
  'hukuk-ingilizcesi-donem-2': d2Content,
  'hukuk-ingilizcesi-yillik': yillikContent,
};

export const HUKUK_INGILIZCESI_VARIANTS = [
  'hukuk-ingilizcesi-donem-1',
  'hukuk-ingilizcesi-donem-2',
  'hukuk-ingilizcesi-yillik',
];

export function buildHukukIngilizcesiVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Hukuk İngilizcesi ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Hukuk İngilizcesi (Legal English) ${meta.h1Extra}`;
  const description = `${uni.name} için Hukuk İngilizcesi ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Hukuk İngilizcesi / Legal English ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: doğru terim, kısa cümle ve hukuki bağlam. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Anlatım Türkçe; terimler ve kalıplar İngilizcedir.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek → PDF. Her gün 10 TR–EN kart.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her terim: TR | EN | örnek cümle',
        'False friend listesini ayrı tut',
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
      paragraphs: ['İşler tanım = kullanım fısıldayan cümle.'],
      kartlar: bank.definitions,
    },
    {
      heading: '5. Pusula terim setleri',
      paragraphs: ['Soru tipine göre kelime aileleri. Bağlamı yaz; uydurma çeviri yapma.'],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Kelime kelime çeviri yasak; hukuki register kullan.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Hukuk İngilizcesi)',
      paragraphs: [
        `${uni.shortName} sınavlarında tipik format: eşleştirme, boşluk doldurma, kısa çeviri, mini yazışma veya metin özeti.`,
        'İskelet: (1) doğru terim (2) kısa cümle (3) bağlam (4) false friend kontrolü.',
      ],
      bullets: [
        'Önce EN etiketi seç',
        'Sonra kısa cümle kur',
        'TR notunu parantezde ver',
        'Günlük dil kaçın',
      ],
      hapBilgi: 'Doğru terim + kısa cümle = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Hukuk İngilizcesi ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Cevap iskeleti',
      steps: [
        'TR kavramı tanı',
        'EN terimi seç',
        'Kısa cümle kur',
        'Bağlamı yaz',
        'False friend kontrol',
        'Gözden geçir',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'hukuk-ingilizcesi-donem-2'
          ? [
              ['Evidence', 'Proof', 'Delil mi ispat sonucu mu?'],
              ['Appeal', 'Judicial review', 'Kanun yolu mu denetim mi?'],
              ['Holding', 'Obiter', 'Bağlayıcı sonuç mu yan not mu?'],
              ['Liable', 'Responsible', 'Hukuki sorumluluk mu genel mi?'],
            ]
          : variantCode === 'hukuk-ingilizcesi-donem-1'
            ? [
                ['Court', 'Tribunal', 'Genel mahkeme mi özel kurul mu?'],
                ['Right', 'Remedy', 'Hak mı hukuki çare mi?'],
                ['Liability', 'Responsibility', 'Hukuki mi günlük mi?'],
                ['Plaintiff', 'Claimant', 'Hangi usul sistemi?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Vocab/contract mı litigation/skill mi?'],
                ['Contract', 'Litigation', 'Sözleşme mi dava dili mi?'],
                ['Term', 'Phrase', 'Kelime mi kalıp mı?'],
                ['Translate', 'Equivalence', 'Kelime kelime mi eşdeğer mi?'],
              ],
    },
    {
      kind: 'ladder',
      title: 'Öğrenme merdiveni',
      levels: [
        '10 TR–EN kart / gün',
        'Zihin haritası çiz',
        'Tuzak listesi',
        '4 örnek cümle süreyle',
        'Mini letter + judgment summary',
      ],
    },
    {
      kind: 'fork',
      title: 'Soru tipi',
      leftTitle: 'Vocab / contract',
      rightTitle: 'Litigation / skills',
      left: 'Court–parties–contract–liability',
      right: 'Evidence–appeal–letter–judgment',
    },
    {
      kind: 'cycle',
      title: 'Haftalık döngü',
      steps: ['Cards', 'Phrases', 'Reading', 'Writing', 'Review'],
    },
  ];

  const faq = [
    {
      q: '1. dönem / 2. dönem / yıllık farkı ne?',
      a: '1. dönem temel vocabulary + court/parties/contract; 2. dönem litigation + criminal labels + yazışma + karar okuma; yıllık ikisini birleştirir.',
    },
    {
      q: 'Not Türkçe mi İngilizce mi?',
      a: 'Anlatım Türkçe; terimler, kalıplar ve örnek cümleler İngilizce. Sınavda her ikisini de yönetirsiniz.',
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
    'En az 3 örnek olayı / cümleyi süreyle çözdüm',
    '10 TR–EN kartı tekrar ettim',
    'PDF’i arşivledim',
    variantCode === 'hukuk-ingilizcesi-yillik'
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
      `${uni.shortName} hukuk ingilizcesi ${meta.short}`,
      `${uni.shortName} legal english ders notu`,
      `hukuk ingilizcesi ${meta.short} not pdf`,
      'legal english vocabulary contract litigation',
      'hukuk ingilizcesi yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} hukuk ingilizcesi`),
      'ücretsiz hukuk ders notu',
    ],
    lead,
    promise: bank.promise,
    sixtySecond: bank.sixtySecond,
    examBox: {
      calendar: uni.calendar,
      typicalWeights: 'Ara sınav ~%30–40 · Final ~%50–60 (yönetmeliğe göre)',
      format:
        uni.type === 'vakif'
          ? 'Eşleştirme + kısa yazma; ödev/sunum olabilir'
          : 'Eşleştirme, boşluk, kısa çeviri, mini metin',
      tips: [
        'Doğru EN terimi seç',
        'Kısa cümle kur',
        'False friend kontrol et',
        'Bağlamı bir kelimeyle yaz',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Hukuk İngilizcesi ${meta.short} kelime ve kalıplarını kullanır`,
      'Court–party–contract dilini kurar',
      'Litigation ve ispat etiketlerini ayırır',
      'Kısa yazışma ve karar özeti üretir',
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
    relatedCourses: HUKUK_INGILIZCESI_VARIANTS.filter((c) => c !== variantCode).concat([
      'hukuk-ingilizcesi',
      'hukuka-giris',
      'hukuk-felsefesi-yillik',
      'milletlerarasi-hukuk',
    ]),
    relatedBilgi: [],
    updated: '2026-07-30',
    wordTarget: variantCode === 'hukuk-ingilizcesi-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'hukuk-ingilizcesi',
    variantLabel: meta.label,
  };
}
