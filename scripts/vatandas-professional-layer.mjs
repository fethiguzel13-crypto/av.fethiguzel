/**
 * Profesyonel katman: örnek, senaryo, tablo, checklist, keyInsight, visual.
 * Her makaleye konuya özgü (seed’li) zengin blok ekler — kelime + UX.
 */
import { CAT_BANK } from './vatandas-content-engine.mjs';

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick(arr, seed, salt = 0) {
  if (!arr?.length) return '';
  return arr[(seed + salt * 17) % arr.length];
}

function pickN(arr, seed, n) {
  if (!arr?.length) return [];
  const out = [];
  const used = new Set();
  for (let i = 0; i < n * 4 && out.length < n; i++) {
    const idx = (seed + i * 31) % arr.length;
    if (used.has(idx)) continue;
    used.add(idx);
    out.push(arr[idx]);
  }
  return out;
}

const VISUALS = ['process', 'fork', 'clock', 'scale', 'stack', 'shield'];

/**
 * @param {object} t topic
 * @param {object} body { lead, sections, steps, faq }
 * @param {'pillar'|'spoke'|'bridge'|'standard'} role
 * @param {{ angle?: string, pillar?: string }} meta
 */
export function applyProfessionalLayer(t, body, role = 'standard', meta = {}) {
  const seed = hash(t.slug + (meta.angle || ''));
  const cat = t.category || 'Usul';
  const bank = CAT_BANK[cat] || CAT_BANK.Usul;
  const k0 = t.keywords?.[0] || t.h1;
  const k1 = t.keywords?.[1] || k0;
  const angle = meta.angle || k0;
  const topicClean = String(t.h1 || '').replace(/\?$/, '');

  const visual = VISUALS[seed % VISUALS.length];

  const keyInsight =
    role === 'bridge'
      ? `Kısa özet yetermez. Resmî maddeyi okuyun. Çelişirse madde esastır.`
      : role === 'spoke'
        ? `Bu sayfa sadece «${angle}» içindir. Süre veya feragat riski varsa ana rehbere gidin.`
        : `Üç şey: doğru merci · doğru süre · doğru belge. Tanım tek başına yetmez.`;

  // —— Examples (worked) ——
  const examples = [];
  if (role !== 'bridge') {
    examples.push({
      title: `Örnek 1 — «${angle}» tipik dosya`,
      body: `Varsayalım ki ${topicClean.toLocaleLowerCase('tr-TR')} kapsamında bir işlem veya uyuşmazlık doğdu. İlk iş, tebliğ/öğrenme veya olay tarihini yazılı sabitlemektir. Ardından ${pick(bank.merciler, seed, 0)} mercisine giden yolda ${pickN(bank.belgeler, seed, 3).join(', ')} belgelerini derlersiniz. ${pick(bank.sureler, seed, 1)} Bu örnek basitleştirilmiştir; somut dosyada ek şartlar çıkabilir.`,
      takeaway: `Tarihi sabitleyin → belgeyi toplayın → doğru mercie gidin → sonucu takip edin.`,
    });
    examples.push({
      title: `Örnek 2 — Sık yapılan hata`,
      body: `Kişi «${k1}» diye aratır, forumdan okuduğu tek cümleye güvenir ve ${pick(bank.riskler, seed, 2).toLocaleLowerCase('tr-TR') || 'süreyi kaçırır'}. Oysa ${bank.kanunlar.slice(0, 2).join(' / ')} çerçevesinde süre ve şekil şartı dosyaya göre değişir. Peşin ödeme, feragat veya ibraname metnini okumadan imzalamak çoğu zaman geri dönüşü zor sonuç doğurur.`,
      takeaway: `Kaynak: güncel mevzuat + resmî tebliğ + yazılı delil. Forum ≠ bağlayıcı kaynak.`,
    });
    if (role === 'pillar') {
      examples.push({
        title: `Örnek 3 — Paralel yol seçimi`,
        body: `Bazı dosyalarda idari başvuru ile yargı, arabuluculuk ile dava hazırlığı veya ödeme ile itiraz aynı dönemde gündeme gelebilir. «${k0}» için hangisinin önce geleceği dava şartı ve süre hesabına bağlıdır. Yanlış sırada ilerlemek, ${pick(bank.riskler, seed, 4) || 'hak kaybı'} riskini artırır. Ana rehberdeki adım sırası bu yüzden bilinçli okunmalıdır.`,
        takeaway: `Sıra = strateji. Dava şartını atlamayın; süreleri aynı takvimde tutun.`,
      });
    }
  } else {
    examples.push({
      title: 'Örnek — Madde okuma',
      body: `Vatandaş «${k0}» aramasında kısa özet ister; avukat veya dikkatli okuyucu ise fıkra, bent ve atıf maddelerini de ister. Özet ile yetinip işlem yapmak yerine önce tam madde metnine geçin, sonra süreç rehberine dönün.`,
      takeaway: `Özet → tam madde → süreç rehberi sırası.`,
    });
  }

  // —— Scenarios ——
  const scenarios = [
    {
      title: 'Senaryo A — Süreyi kaçırmak üzere',
      facts: `Tebliğ tarihi yaklaşıyor; «${k0}» için hangi mercie gideceğiniz net değil. Belgelerin bir kısmı eksik.`,
      outcome: `Önce tebliğ tarihini ve son günü takvime yazın. ${pick(bank.merciler, seed, 1)} ile ${pick(bank.merciler, seed, 2)} ayrımını netleştirin. Eksik belge için kurumdan süre uzatımı/ek süre mümkün mü diye sorun; mümkün değilse eldekiyle yazılı başvuruyu kaçırmayın.`,
    },
    {
      title: 'Senaryo B — Sözlü anlaşma',
      facts: `Karşı taraf «hallederiz» diyor; yazılı kayıt yok. «${k1}» konusunda güvence veriliyor.`,
      outcome: `Sözlü vaat tek başına çoğu mercide yetersizdir. Anlaşmayı e-posta, noter ihtarı veya tutanakla sabitleyin. Ödeme yapacaksanız dekont açıklamasına dosya/konu yazın. ${pick(bank.riskler, seed, 0)}`,
    },
  ];
  if (role === 'pillar' || role === 'spoke') {
    scenarios.push({
      title: 'Senaryo C — Elektronik kanal',
      facts: `e-Devlet / UYAP üzerinden işlem mümkün görünüyor; ancak asıl evrak istenip istenmediği belirsiz.`,
      outcome: `Önce kurumun güncel duyurusunu okuyun. Barkodlu çıktıyı saklayın; fiziki teslim veya noter şartı varsa randevuyu peşinen alın. Ekran görüntüsü + resmî kayıt birlikte güçlüdür.`,
    });
  }

  // —— Table ——
  const table = {
    caption: `«${k0}» — hızlı kontrol tablosu`,
    headers: ['Kontrol', 'Neden önemli?', 'Ne yapmalı?'],
    rows: [
      [
        'Tebliğ / öğrenme tarihi',
        'Süre çoğu zaman buradan başlar',
        'Mazbata, e-tebligat, SMS/e-posta kaydını saklayın',
      ],
      [
        'Doğru merci',
        'Yanlış kapı süre kaybettirir',
        `${pickN(bank.merciler, seed, 3).join(' / ')} ayrımını netleştirin`,
      ],
      [
        'Belge seti',
        'Eksik evrak usulden risk',
        `${pickN(bank.belgeler, seed, 4).join(', ')}`,
      ],
      [
        'Dava / işlem şartı',
        'Arabuluculuk vb. atlanırsa ret',
        'Kapsamdaysa tutanağı almadan dava açmayın',
      ],
      [
        'Feragat / ödeme metni',
        'Geri dönüş zor olabilir',
        'İmza öncesi kalem kalem okuyun',
      ],
      [
        'Güncel mevzuat',
        'Oran, tavan, sınır değişir',
        '/ara ve /mevzuat ile maddeyi doğrulayın',
      ],
    ],
  };

  // —— Checklist ——
  const checklist = [
    `«${k0}» için tebliğ/öğrenme veya olay tarihini yazdım`,
    `Doğru mercie karar verdim (${pick(bank.merciler, seed, 0)})`,
    `Temel belgeleri topladım (${pickN(bank.belgeler, seed, 2).join(', ')})`,
    `Dava şartı (arabuluculuk/idari başvuru) varsa tamamladım`,
    `Yazılı başvuruyu yaptım; numara/dekont sakladım`,
    `Sonuç ve kanun yolu süresini takvime işledim`,
    role === 'spoke'
      ? `Ana rehberi okudum veya okuyacağım (süreç iskeleti)`
      : `İlgili spoke sayfaları ve hesaplama araçlarını kontrol ettim`,
  ];

  // —— Extra deep sections (word count + quality) ——
  const extraSections = [];
  if (role === 'pillar') {
    extraSections.push({
      heading: 'Pratik karşılaştırma: acele mi, planlı mı?',
      paragraphs: [
        `Acele dosya: süre son günü yakındır, tebliğ sabittir, mercie gitmek zorunludur. Planlı dosya: belge seti ve strateji (arabuluculuk, idari başvuru, sulh) henüz kurgulanabilir. «${k0}» için hangisinde olduğunuzu netleştirmeden feragat veya peşin ödeme risklidir.`,
        `Planlı dosyada ${bank.adimlar?.slice(0, 3).join(' → ') || 'belge → merci → başvuru'} sırası izlenir. Acele dosyada ise süre koruma önceliklidir; eksik belge sonradan tamamlanabilir mi diye merciye sorun.`,
        `Her iki halde de yazılı iz: başvuru numarası, UYAP kaydı, kargo/teslim tutanağı. Sözlü «aldık» beyanı yetmez.`,
      ],
      bullets: ['Süre sonu yakınsa önce koruma', 'Planlıysa belge+strateji', 'Her adımı yazılı izle'],
    });
    extraSections.push({
      heading: 'Somut kontrol listesi (uygulama)',
      paragraphs: [
        `Aşağıdaki maddeleri zihnen değil, kâğıt veya not uygulamasında işaretleyin. «${k1}» dosyasında en sık kayıp, işaretlenmemiş tebliğ tarihidir.`,
        `Belgeleri klasörlere ayırın. Dijitalde de aynı klasör yapısını kullanın.`,
      ],
      bullets: [
        'Tebliğ ve tebliğ tarihi',
        'Esasa ilişkin deliller',
        'Ödeme dekontları',
        'Yazışmalar',
        'Vekâlet / kimlik',
        ...checklist,
      ],
    });
    extraSections.push({
      heading: 'Örnek zaman çizelgesi (şematik)',
      paragraphs: [
        'Aşağıdaki sıra şematiktir. Yasal süreler dosyaya göre değişir; kesin gün vaat edilmez.',
        `${pick(bank.sureler, seed, 2)} e-Tebligatta «açılmasa da tebliğ» kuralı takvimi öne çekebilir. Bildirimleri silmeyin; PDF saklayın.`,
      ],
      bullets: [
        'Gün 0 — Olay veya tebliğ',
        'Gün 0–2 — Belge ve tarih sabitleme',
        'Gün 2–5 — Merci ve dava şartı kontrolü',
        'Sonraki günler — Yazılı başvuru / arabuluculuk / dava',
        'Sonuç — Takip ve kanun yolu süresi',
      ],
    });
  } else if (role === 'spoke') {
    extraSections.push({
      heading: `«${angle}» için mini senaryo ve kontrol`,
      paragraphs: [
        `Dar niyet («${angle}») çoğu zaman tek bir sayı, şart veya belgeye indirgenir. Yine de tebliğ tarihi ve feragat metni bu dilimi etkiler. Ana rehbere dönmeden imza atmayın.`,
        `Çalışılmış örnek: «${k0}» diye arayan kişi aslında ${angle} öğrenmek ister; ardından «ne yapmalıyım?» sorusu gelir. İkinci soru için pillar sayfası zorunludur.`,
        `${pick(bank.sureler, seed, 0)} Delil seti: ${pickN(bank.belgeler, seed, 3).join(', ')}.`,
      ],
      bullets: checklist.slice(0, 5),
    });
    extraSections.push({
      heading: 'Karşılaştırmalı not: dar soru vs tam süreç',
      paragraphs: [
        `Dar soru bu sayfada; tam süreç, merciler ve belge iskeleti ana rehberde. İkisini aynı anahtar kelimelerle doldurmak SEO yamyamlığı ve okuyucu kafa karışıklığı yaratır.`,
        `Pratik kural: Cevabınız tek cümlelik «oran/şart/tanım» ise spoke yeterli olabilir. Cevabınız «hangi mahkeme, hangi süre, hangi dilekçe» ise pillar’a geçin.`,
      ],
    });
  } else {
    extraSections.push({
      heading: 'Maddeyi nasıl okumalısınız?',
      paragraphs: [
        `Önce madde başlığı ve sistematik yeri, sonra fıkralar, sonra atıf maddeleri. Tanım fıkrasını atlamak yanlış yoruma yol açar.`,
        `Özet (bu sayfa) arama niyetini karşılar; karar ve atıf için tam metin sayfası esastır. Şerh akademik bilgilendirmedir.`,
      ],
      bullets: [
        'Fıkra/bent atlama',
        'Yürürlük tarihini kontrol et',
        'Atıf maddelerini aç',
        'Süreç için /bilgi rehberine geç',
      ],
    });
  }

  // —— Extra FAQ ——
  const extraFaq = [
    {
      q: `«${k0}» için tek cümlelik formül var mı?`,
      a: 'Hayır. Merci, süre, belge ve somut olgu bir arada değerlendirilir. Formül vaat eden kaynaklara güvenmeyin.',
    },
    {
      q: 'Örnekler gerçek dosya mıdır?',
      a: 'Hayır. Öğretici senaryolardır; isim ve olay kurgusaldır. Somut dosyanızda avukat ve güncel mevzuat esastır.',
    },
    {
      q: 'Tablo ve checklist bağlayıcı mıdır?',
      a: 'Hayır. Pratik hatırlatmadır. Resmî şart listesi mercie ve yürürlükteki metne göredir.',
    },
  ];

  let sections = [...(body.sections || []), ...extraSections];
  const faq = [...(body.faq || []), ...extraFaq];
  // dedupe faq by q
  const seenQ = new Set();
  const faqDedup = [];
  for (const f of faq) {
    if (seenQ.has(f.q)) continue;
    seenQ.add(f.q);
    faqDedup.push(f);
  }

  // —— Evrensel normalizasyon: TÜM sayfalar aynı iskelet ——
  return normalizeUniversalLayout(
    {
      ...body,
      sections,
      faq: faqDedup,
      examples,
      scenarios,
      table,
      checklist,
      visual,
      keyInsight,
    },
    t,
    role,
    meta,
    bank,
    seed
  );
}

/** Hap lead: en fazla ~2 cümle / ~320 karakter */
function clampLead(lead, fallback) {
  let s = String(lead || fallback || '').replace(/\s+/g, ' ').trim();
  if (s.length <= 320) return s;
  const cut = s.slice(0, 300);
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  if (lastStop > 120) return cut.slice(0, lastStop + 1).trim();
  return cut.trim() + '…';
}

/** Paragraftaki (1)(2)(3) listelerini bullet'a çevir */
function explodeNumberedParagraphs(sections) {
  return (sections || []).map((sec) => {
    const paragraphs = [];
    const bullets = [...(sec.bullets || [])];
    for (const p of sec.paragraphs || []) {
      if (/\(\s*1\s*\)/.test(p) && /\(\s*2\s*\)/.test(p)) {
        const parts = p
          .split(/\(\s*\d+\s*\)\s*/)
          .map((x) =>
            x
              .replace(/^Tipik akış:\s*/i, '')
              .replace(/^Sonraki adım:\s*/i, '')
              .replace(/^Belgeleri klasörleyin:\s*/i, '')
              .replace(/[.;]\s*$/, '')
              .trim()
          )
          .filter((x) => x.length > 3 && !/:$/.test(x));
        if (parts.length >= 2) {
          const intro = (sec.paragraphs || []).length ? null : null;
          // kısa giriş bırak
          const first = p.split(/\(\s*1\s*\)/)[0].trim();
          if (first && first.length > 12 && first.length < 160) {
            paragraphs.push(first.replace(/:\s*$/, '.') + (first.endsWith('.') ? '' : ''));
          }
          for (const part of parts) {
            if (part.length < 120) bullets.push(part);
            else paragraphs.push(part);
          }
          continue;
        }
      }
      paragraphs.push(p);
    }
    // unique bullets
    const seen = new Set();
    const uniq = [];
    for (const b of bullets) {
      const k = b.toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k);
      uniq.push(b);
    }
    return { heading: sec.heading, paragraphs, bullets: uniq.length ? uniq : undefined };
  });
}

/**
 * Her rol için aynı okuma iskeleti:
 * hap lead + keyInsight + ≥5 steps + examples + scenarios + table + checklist + visual
 */
function normalizeUniversalLayout(body, t, role, meta, bank, seed) {
  const k0 = t.keywords?.[0] || t.h1 || 'bu konu';
  const angle = meta.angle || k0;
  const topicClean = String(t.h1 || k0).replace(/\?$/, '');

  const defaultSteps = (bank.adimlar || []).length
    ? bank.adimlar
    : [
        'Olayı ve tarihleri yazın (tebliğ / öğrenme).',
        'Gerekli belgeleri toplayın.',
        'Doğru mercie karar verin.',
        'Dava şartı varsa önce onu tamamlayın.',
        'Yazılı başvuruyu yapın; kaydı saklayın.',
        'Sonucu takip edin; süreleri kaçırmayın.',
      ];

  let steps = (body.steps || [])
    .map((s) => String(s).replace(/^\d+\.\s*/, '').replace(/^«[^»]+»:\s*/, '').trim())
    .filter(Boolean);

  if (steps.length < 5) {
    steps = [...steps, ...defaultSteps].slice(0, 7);
  }
  // konuşma diline çek: çok uzun adımları kısaltma (okunabilir tut)
  steps = steps.map((s) => (s.length > 160 ? s.slice(0, 157) + '…' : s));

  let lead = clampLead(
    body.lead,
    `${topicClean}: önce merci ve süreye bakın, belgeyi toplayın, sonra yazılı başvurun.`
  );

  let keyInsight =
    body.keyInsight ||
    (role === 'spoke'
      ? `Bu sayfa «${angle}» içindir. Tam süreç ana rehberdedir.`
      : role === 'bridge'
        ? 'Özet yetmez. Resmî maddeyi okuyun.'
        : 'Doğru merci · doğru süre · doğru belge.');

  keyInsight = clampLead(keyInsight, keyInsight);

  const sections = explodeNumberedParagraphs(body.sections || []);

  // Örnek / senaryo minimumları
  let examples = body.examples || [];
  if (examples.length < 2) {
    examples = [
      ...examples,
      {
        title: `Örnek — «${k0}»`,
        body: `Kısa senaryo: Tebliğ tarihini yazdınız, belgeleri derlediniz, ${pick(bank.merciler, seed, 0)} mercisine başvurmayı planlıyorsunuz. Bu sıra çoğu dosyada işe yarar.`,
        takeaway: 'Tarih → belge → merci → başvuru.',
      },
    ].slice(0, 3);
  }

  let scenarios = body.scenarios || [];
  if (scenarios.length < 2) {
    scenarios = [
      ...scenarios,
      {
        title: 'Senaryo — Süre yaklaşıyor',
        facts: 'Son gün yakın; belge eksik.',
        outcome: 'Önce süreyi koruyan yazılı başvuruyu yapın. Eksik belgeyi sonra tamamlayın.',
      },
    ].slice(0, 3);
  }

  const checklist =
    body.checklist?.length >= 5
      ? body.checklist
      : [
          'Tebliğ / olay tarihini yazdım',
          'Belgeleri topladım',
          'Mercii netleştirdim',
          'Dava şartını kontrol ettim',
          'Yazılı başvuruyu yaptım',
          'Sonucu takip ediyorum',
        ];

  const table = body.table || {
    caption: `«${k0}» — hızlı kontrol`,
    headers: ['Kontrol', 'Neden?', 'Ne yap?'],
    rows: [
      ['Tarih', 'Süre buradan başlar', 'Mazbatayı sakla'],
      ['Merci', 'Yanlış kapı zaman kaybettirir', 'Görev-yetkiyi kontrol et'],
      ['Belge', 'Eksik dosya riski', 'Listeyi tamamla'],
      ['Başvuru', 'Yazılı iz şart', 'Numara/dekont al'],
    ],
  };

  // visual: pillar/spoke için okunabilir process ağırlıklı
  const visual =
    role === 'bridge'
      ? body.visual || 'shield'
      : body.visual === 'process' || body.visual === 'stack' || !body.visual
        ? 'process'
        : body.visual;

  return {
    ...body,
    lead,
    keyInsight,
    steps,
    sections,
    examples,
    scenarios,
    table,
    checklist,
    visual,
    faq: body.faq || [],
  };
}
