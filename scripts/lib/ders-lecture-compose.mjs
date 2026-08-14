/**
 * Tek hatlı ders anlatısı — yoğun, birleşik, akademik.
 *
 * Yasak: meta-öğüt, staccato cümle dizisi, “sınavda şunu sorun” didaktiği.
 * Hedef: uzun birleşik cümleler; olup / zira / ne var ki / -ken; gereksiz dolgu yok.
 */
import { getDeep, sliceForVariant, familyOf } from './ders-deep-teach.mjs';

const META_HEADING =
  /nasıl oku|haftalık|mini plan|tempo|sınav tekniği|sınav kâğıdı|okumalısın|bu notu bitirince|bu dersin hattı|tek parça kâğıt/i;

/** Didaktik / meta cümle kalıpları — silinir */
const META_SENTENCE =
  /^(Sınavda|Kâğıtta|Anlatı|Hattı burada|Bir sonraki bölüm|Az önce|Slayt|Bu notu|Okurken her|Her bölümün sonunda|Tersinden başlayan|Dağınık doğru|Başlıkları I,|“Bence haklıdır”|Ezberlenen sıfatlar|Puan getirir|hocanın kırmızı)/i;

const THREAD = {
  'borclar-genel':
    'Kaynak seçilmeden unsur kurulmaz, ilişki kurulmadan rejim seçilmez ve rejim seçilmeden süre ile sonuç yazılmaz; omurga budur.',
  'borclar-ozel':
    'Sözleşmenin türü bir kez seçildikten sonra özel hükümler genel hükümlerin üzerine biner; tersi yol kapalıdır ve her edim bozulması kendi rejimini çağırır.',
  'hukuka-giris':
    'Kural yaptırımıyla tanınır, kamu–özel ayrımı mercı verir ve hak ile ehliyet ancak bu zeminde işleme dökülür.',
  'aile-hukuku':
    'Boşanma yolu seçilir, çocuğun üstün yararı velayeti taşır ve mal rejimi tasfiyesi çoğu kez ayrı bir hesap olarak yürür.',
  'ceza-genel':
    'Tipiklik, hukuka aykırılık ve kusur katmanları bozulmadan okunur; katman atlayan çözüm kısa devre yapar.',
  'ceza-ozel':
    'Genel teori üzerine suç tipi oturtulur ve rızanın niteliği, hırsızlığı dolandırıcılıktan ayıran çizgiyi çizer.',
  'ceza-muhakemesi':
    'Önce soruşturma–kovuşturma evresi, sonra tedbirin şartı ile süresi, en sonda hukuka aykırı delilin akıbeti yazılır.',
  'is-hukuku':
    'Bağımlılık sözleşmeyi kurar, fesih türü alacak kalemini seçer ve süre ile arabuluculuk kapıyı açar ya da kapatır.',
  'esya-hukuku':
    'Zilyetlik fiilî hâkimiyet, mülkiyet ayni haktır ve dava türü bu ayrımdan çıkar; tescil ile iyiniyet birlikte tartılır.',
  'medeni-usul':
    'Görev konuya, yetki yere bakar ve dava şartı esasa girilip girilmeyeceğini söyler; karıştırılan usul, yakılan süredir.',
  'icra-iflas':
    'Takip yolu seçilir, tebliğ tarihi yazılır ve süre kaçarsa itiraz kapısı kapanır; ilamlı ile ilamsız aynı rejim değildir.',
  'miras-hukuku':
    'Mal rejimi tasfiyesi mirastan önce gelir, zümre eşin payını belirler ve saklı pay tenkis ile korunur.',
  anayasa:
    'Normlar hiyerarşisi tepeden iner; temel hak sınırlanırken kanunilik, ölçülülük ve hakkın özü birlikte yazılır.',
  'idare-hukuku':
    'İdari işlem beş unsurla kurulur, sakatlık iptal davasını ve zarar tam yargıyı açar.',
  'idari-yargilama':
    'İptal işlemi, tam yargı zararı ister ve süre tebliğle başlar; merci yanlışsa hak da kaybolabilir.',
  'ticaret-sirketler':
    'Tüzel kişilik kuraldır ve istisna yazılmadan ortağa geçilmez; organ kararı ile temsil ayrı kutulardır.',
  'kiymetli-evrak':
    'Şekil katıdır ve eksik unsur kambiyo sıfatını düşürür; ciro zinciri hak sahipliğini taşır.',
  'medeni-baslangic':
    'm.1 uygulamayı, m.2 dürüstlüğü, m.3 iyiniyeti ve m.6 ispat yükünü kurar; bu dörtlü her derse sızar.',
  'roma-hukuku':
    'Persona–res–actio üçlüsü bugünkü hak–eşya–dava ayrımının atasıdır ve modern kurumlar bu iskeletten okunur.',
  'tuketici-hukuku':
    'Sıfat tüketiciyse ayıp ile cayma ayrı kapılardır ve merci parasal sınıra bakar.',
  'milletlerarasi-hukuk':
    'Özne ve kaynak seçilir; antlaşma iç hukuka ancak usulüne göre girer.',
  'devletler-ozel':
    'Yabancı unsur bağlama kuralını çağırır ve yetki ile uygulanacak hukuk ayrı sorulardır.',
  'ticari-isletme':
    'Tacir ve ticari iş karinesi ispatı ile faizi değiştirir; esnaf ayrımı bu kapının eşiğidir.',
  'sigorta-hukuku':
    'Riziko, prim ve teminat poliçeyi kurar; ihbar gecikmesi red doğurabilir.',
  'hukuk-felsefesi':
    'Geçerlilik ile adalet ayrılır ve pozitivizm ile tabiî hukuk aynı soruya farklı kapı açar.',
  'hukuk-sosyolojisi':
    'Metindeki hukuk ile yaşayan hukuk ayrılır; uygulanmayan kural sosyolojik olarak sönmeye yüz tutar.',
  'turk-hukuk-tarihi':
    'Mecelle’den Medeni Kanun’a geçiş resepsiyondur ve süreklilik ile kopuş aynı anlatıda yazılır.',
  'insan-haklari':
    'Hak sınırlanırken kanunilik, meşru amaç ve ölçülülük yazılır; AİHM denetimi iç hukukun üstüne binebilir.',
  'vergi-hukuku':
    'Vergi kanundan doğar; tarh, tebliğ, süre ve dava merdiveni kaçırılmaz.',
  'deniz-ticareti':
    'Gemi, navlun ve çarter ayrı sözleşmelerdir ve deniz alacağı özel teminata bağlanır.',
  'adli-tip':
    'Rapor hukuki sonuca delildir ve yaralanma derecesi tipi ile cezayı değiştirir.',
  'insaat-hukuku':
    'Eser sonucu borçlanır; ayıp ile gecikme ayrı rejimler olup ruhsat kamu düzenine aittir.',
  'saglik-hukuku':
    'Onam tedaviye kapı açar ve komplikasyon her zaman hata sayılmaz.',
  arabuluculuk:
    'Dava şartı olan yerde tutanak yoksa mahkeme kapısı kapalıdır ve süreler sıkı işler.',
  'hukuk-ingilizcesi':
    'Terim rastgele çevrilmez; contract, tort ve property ayrı rejimler olarak taşınır.',
};

function threadOf(code) {
  const fam = familyOf(code);
  return (
    THREAD[fam] ||
    THREAD[code] ||
    'Kurum adlandırılır, unsurlar kurulur, olay unsura yedirilir ve istisna ile süre kapatılır; bu sıra bozulmaz.'
  );
}

function bareTitle(note, uni) {
  let t = String(note.h1 || note.courseCode || 'bu ders');
  if (uni?.shortName) {
    t = t.replace(new RegExp(uni.shortName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '');
  }
  t = t
    .replace(/\s*Ders Notu(ları)?.*$/i, '')
    .replace(/ücretsiz|pdf|şematik/gi, '')
    .replace(/\s*[—|:]\s*$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return t || 'bu ders';
}

/** Kısaltma ve madde göndermelerini cümle bölünmesinden koru */
function protect(text) {
  let t = String(text || '');
  // tırnak içi
  const quotes = [];
  t = t.replace(/[“"]([^”"]+)[”"]/g, (_, inner) => {
    quotes.push(inner);
    return `«Q${quotes.length - 1}»`;
  });
  t = t
    .replace(/\b(m|md|vb|vd|vs|No|no)\.\s*/gi, '§$1¤')
    .replace(/\b(TBK|TMK|TCK|TTK|HMK|İİK|CMK|VUK|İYUK)\s+m\.\s*/g, '$1 m¤')
    .replace(/(\d)\.\s*(\d)/g, '$1¤$2')
    .replace(/m¤\s*(\d)/g, 'm¤$1');
  return { text: t, quotes };
}

function unprotect(text, quotes = []) {
  let t = String(text || '')
    .replace(/§(m|md|vb|vd|vs|No|no)¤/gi, (_, a) => `${a}. `)
    .replace(/\bm¤/g, 'm.')
    .replace(/¤/g, '.');
  t = t.replace(/«Q(\d+)»/g, (_, i) => `“${quotes[Number(i)] || ''}”`);
  return t.replace(/\s+/g, ' ').replace(/\s+([,;:])/g, '$1').trim();
}

function splitSentences(text) {
  const { text: p0, quotes } = protect(text);
  const p = p0.replace(/\s+/g, ' ').trim();
  if (!p) return [];
  // Yalnızca cümle sonu noktası: harf/tırnak sonrası . ! ?
  return p
    .split(/(?<=\S[.!?…])\s+(?=[A-ZÇĞİÖŞÜ“«])/)
    .map((s) => unprotect(s.trim(), quotes))
    .filter(Boolean);
}

function wordCount(s) {
  return String(s || '')
    .split(/\s+/)
    .filter(Boolean).length;
}

function isMeta(sentence) {
  const s = sentence.trim();
  if (META_SENTENCE.test(s)) return true;
  if (/bir bölümü atlayan|sonrakini de kaybeder|masada anlatılan destek/i.test(s)) return true;
  if (/^Hattı bozmadan/i.test(s)) return true;
  if (/^Sınav cümlesi/i.test(s)) return true;
  if (/puan (getirir|kırılır|kaybettirir)/i.test(s) && wordCount(s) < 18) return true;
  if (/klasik sıfır|kırmızı kalem/i.test(s) && wordCount(s) < 16) return true;
  return false;
}

function lowerJoin(s) {
  const body = s.replace(/[.!?…]+$/, '').trim();
  if (!body) return body;
  // Kısaltma / kod / tırnak ile başlıyorsa dokunma
  if (/^(TBK|TMK|TCK|TTK|HMK|İİK|CMK|AİHM|AYM|I+|«|“|")/.test(body)) return body;
  if (/^[A-ZÇĞİÖŞÜ]{2,}(\s|$)/.test(body) && !/^(Bu|Şu|O|Bir|Her|İlk|Son|Ama|Ne|Ve)/.test(body)) {
    return body;
  }
  return body.charAt(0).toLocaleLowerCase('tr-TR') + body.slice(1);
}

const JOINERS = [
  (a, b) => `${a} olup ${b}.`,
  (a, b) => `${a}; zira ${b}.`,
  (a, b) => `${a}; ne var ki ${b}.`,
  (a, b) => `${a}; buna karşılık ${b}.`,
  (a, b) => `${a}; kaldı ki ${b}.`,
  (a, b) => `${a} ve ${b}.`,
];

/**
 * Kısa cümleleri ölçülü birleştirir.
 * - Paragraf başına en fazla bir "olup"
 * - Cümle başına en fazla bir birleştirme
 * - Tırnak ve madde göndermeleri bozulmaz
 */
export function densifyProse(text) {
  if (!text || typeof text !== 'string') return text;
  let raw = text.replace(/\s+/g, ' ').trim();
  raw = raw
    .replace(/^Az önce[^.]{0,120}\.\s*/i, '')
    .replace(/\s*Hattı burada bırakmayın:[^.]*\.\s*/gi, ' ')
    .replace(/\s*Bir sonraki bölüm bu ayrımı hazır sayacak\.\s*/gi, ' ')
    .replace(/\s*Kâğıtta yeni hikâye açmayın\.[^.]*\.\s*/gi, ' ')
    .replace(/\s*Bu halka gevşek kalırsa[^.]*\.\s*/gi, ' ');

  const sents = splitSentences(raw).filter((s) => s && !isMeta(s));
  if (!sents.length) return '';

  const out = [];
  let i = 0;
  let joinIdx = 0;
  let usedOlup = false;

  while (i < sents.length) {
    let cur = sents[i].replace(/\s+/g, ' ').trim();
    if (!/[.!?…]$/.test(cur)) cur += '.';

    // Yalnızca gerçekten kısa cümleyi bir kez birleştir
    if (i + 1 < sents.length && wordCount(cur) < 16) {
      let next = sents[i + 1].replace(/\s+/g, ' ').trim();
      if (!isMeta(next) && wordCount(next) <= 28) {
        let joinerFn = JOINERS[joinIdx % JOINERS.length];
        // olup yalnızca bir kez
        if (joinIdx % JOINERS.length === 0 && usedOlup) {
          joinerFn = JOINERS[1];
          joinIdx = 1;
        }
        if (joinIdx % JOINERS.length === 0) usedOlup = true;
        joinIdx += 1;
        const left = cur.replace(/[.!?…]+$/, '');
        const right = lowerJoin(next);
        cur = joinerFn(left, right)
          .replace(/\s+/g, ' ')
          .replace(/\.\./g, '.')
          .trim();
        i += 1;
      }
    }

    if (cur.length > 18) out.push(cur);
    i += 1;
  }

  if (!out.length) return '';
  if (out.length === 1) return out[0];
  // 2 cümle: tek paragraf
  if (out.length === 2) return `${out[0]} ${out[1]}`;
  // 3+: iki paragrafa böl (her biri birleşik cümleler)
  const mid = Math.ceil(out.length / 2);
  return [out.slice(0, mid).join(' '), out.slice(mid).join(' ')];
}

function densifyParagraphs(paragraphs) {
  const result = [];
  for (const p of paragraphs || []) {
    const d = densifyProse(p);
    if (!d) continue;
    if (Array.isArray(d)) result.push(...d.filter(Boolean));
    else result.push(d);
  }
  // Aşırı kısa artıkları bağla — olup kullanmadan
  const merged = [];
  for (const p of result) {
    if (merged.length && wordCount(merged[merged.length - 1]) < 20 && wordCount(p) < 28) {
      const prev = merged[merged.length - 1].replace(/[.!?…]+$/, '');
      merged[merged.length - 1] = `${prev}; ${lowerJoin(p)}`;
    } else {
      merged.push(p);
    }
  }
  return merged.filter((p) => wordCount(p) >= 12);
}

function voiceLead(uni, note, thread) {
  const city = uni?.city || '';
  const short = uni?.shortName || note.uniSlug || '';
  const title = bareTitle(note, uni);
  const place = city ? `${short} (${city})` : short;
  // Zaten uzun birleşik cümleler — densify'a sokma
  return `${place} fakültesinin ${title} notu, dağınık bir kurum yığını olarak değil, tek bir hukuki omurga etrafında kurulmuş yoğun bir anlatı olarak okunmalıdır: ${thread} Omurga bozulduğunda unsurlar boşlukta asılı kalır; bozulmadan ilerletildiğinde her kurum bir öncekinin sonucunu taşır ve sonuç cümlesi kendiliğinden oturur.`;
}

function closingSection(deep, thread, i) {
  return {
    heading: `${i}. Sonuç omurgası`,
    paragraphs: [
      `Sonuç yukarıdaki omurgadan çıkar: ${thread} Önce nitelendirme ve madde, ardından unsurların olay cümlelerine yedirilmesi, en sonda istisna ile süre kapatılarak hüküm söylenir; dağınık doğrular bütünlüklü bir çözümün yerini tutmaz, zira okuyan parçaları değil hattı arar.`,
    ],
    hapBilgi: thread,
  };
}

/** Banka zaten elevate edilmiş; burada yalnızca başlık ve boşluk düzeni. */
function polishSection(section) {
  const heading = String(section.heading || '')
    .replace(/^\d+[a-z]?\.\s*/, '')
    .replace(/\s*\(tek cümle yetmez\)\s*/i, '')
    .trim();
  const paragraphs = (section.paragraphs || [])
    .map((p) => String(p || '').replace(/\s+/g, ' ').trim())
    .filter((p) => p.length > 40);
  if (!paragraphs.length) return null;
  return {
    ...section,
    heading,
    paragraphs,
    hapBilgi: section.hapBilgi,
    uyari: section.uyari,
  };
}

export function composeLecture(note, uni) {
  const deep = getDeep(note.courseCode);
  const thread = threadOf(note.courseCode);

  // Fakülteye özgü (amfi, OBS vb.) kısa bilgi — didaktik değilse kalsın
  const keepFaculty = (note.sections || []).filter((s) => {
    if (META_HEADING.test(s.heading)) return false;
    const blob = `${s.heading} ${(s.paragraphs || []).join(' ')}`;
    return /Cebeci|amfi|OBS|İÜHF|AÜHF|MÜHF|GSÜ|fakülteye özgü|ders program/i.test(blob);
  });

  let body = [];
  if (deep?.teach?.length) {
    body = sliceForVariant(deep.teach, note.courseCode).map((s) => ({
      heading: s.heading,
      paragraphs: s.paragraphs,
      hapBilgi: s.hapBilgi,
      uyari: s.uyari,
      kartlar: s.kartlar,
      bullets: s.bullets,
    }));
  } else {
    body = (note.sections || [])
      .filter((s) => !META_HEADING.test(s.heading))
      .map((s) => ({
        ...s,
        heading: s.heading.replace(/^\d+[a-z]?\.\s*/, ''),
        paragraphs: (s.paragraphs || []).filter((p) => p && p.length > 40),
      }))
      .filter((s) => s.paragraphs.length);
    if (body.length < 2) {
      body.push({
        heading: 'Kurumun kuruluşu',
        paragraphs: [
          `${thread} Bu omurga hem okumayı hem yazmayı taşır; zira her kurumda adlandırma, unsurlama, olaya bağlama ve istisnanın söylenmesi aynı sırayı izler.`,
        ],
      });
    }
  }

  let n = 1;
  const sections = [];

  if (keepFaculty[0]) {
    const fac = polishSection(keepFaculty[0], 0);
    if (fac) {
      sections.push({ ...fac, heading: `${n}. ${fac.heading}` });
      n += 1;
    }
  }

  // Açılış: omurgayı içeriğe gömen tek yoğun paragraf — didaktik meta yok
  sections.push({
    heading: `${n}. Omurga`,
    paragraphs: [
      `${bareTitle(note, uni)}, birbirinden kopuk maddeler yığını değil, tek bir hukuki soruya hizmet eden kurumlar dizisidir: ${thread} Kaynak ya da yol seçilmeden unsura atlamak, tür seçilmeden ayıp yazmak ve evre seçilmeden tedbir kurmak aynı kopmayı üretir; oysa her bölüm bir öncekinin ayrımını hazır sayarak ilerler ve sonuç cümlesi bu hat üzerinde kurulur.`,
    ],
    hapBilgi: thread,
  });
  n += 1;

  for (const s of body) {
    if (META_HEADING.test(s.heading)) continue;
    const polished = polishSection(s, n);
    if (!polished) continue;
    sections.push({
      ...polished,
      heading: `${n}. ${polished.heading}`,
    });
    n += 1;
  }

  sections.push(closingSection(deep, thread, n));

  const examples = [];
  const seen = new Set();
  for (const e of [...(deep?.examples || []), ...(note.examples || [])]) {
    const k = `${e.title}|${(e.facts || '').slice(0, 32)}`;
    if (seen.has(k)) continue;
    seen.add(k);
    examples.push({
      ...e,
      analysis: densifyProse(e.analysis || '') || e.analysis,
      takeaway: e.takeaway || thread,
    });
    if (examples.length >= 4) break;
  }

  const sixty = note.sixtySecond?.length
    ? note.sixtySecond
    : thread
        .split(/[.;]/)
        .map((x) => x.trim())
        .filter((x) => x.length > 12)
        .slice(0, 6);

  const lead = voiceLead(uni, note, thread);

  return {
    ...note,
    lead: Array.isArray(lead) ? lead.join(' ') : lead,
    promise: thread,
    sixtySecond: sixty,
    sections,
    examples,
    qualityTier: 'curated',
    updated: '2026-08-14',
    wordTarget: Math.max(note.wordTarget || 0, 3200),
  };
}

export { threadOf };
