/**
 * Core-100k scoring: source priority, quality signals, formula penalty,
 * domain/era tags, ratio summary, n-gram fingerprints for uniqueness.
 */

const PRINCIPLE_RE =
  /yerleşik\s+i[çc]tihat|ilke\s+olarak|emsal\s+(karar|nitelik)|kabul\s+edilmiş(tir)?|benimsen(en|miştir)|HGK.?ca|CGK.?ca|i[çc]tihad[ıi]\s+birleştir|yol\s+gösterici|sürekli\s+uygulama|istikrar\s+kazan|kural\s+olarak|hukuk[iî]\s+güvenlik/gi;

const FORMULA_RE =
  /dairenin\s+karar[ıi]\s+onanmış|onama\s+karar[ıi]|aşağıdaki\s+gerek[çc]e\s+ile\s+onandı|usul\s+ve\s+yasaya\s+uygun|yerinde\s+g[öo]r[üu]lm[üu]ş|temyiz\s+itirazlar[ıi]\s+yerinde\s+de[ğg]il|bozma\s+nedenine?\s+g[öo]re|h[üu]km[üu]n\s+bozulmas[ıi]na\s+karar\s+verildi(?![.\s\S]{200,})/gi;

const CITE_RE =
  /\b\d{4}\/\d+\s*E\.?\s*,?\s*\d{4}\/\d+\s*K\.?|\bE\.\s*\d{4}\/\d+|\bK\.\s*\d{4}\/\d+/g;

const DOMAIN_RULES = [
  { id: "borclar", re: /bor[çc]lar|haks[ıi]z\s+fiil|sebepsiz\s+zengin|temerr[üu]t|kefalet|vekalet|eser\s+s[öo]z|kira\s+s[öo]z|s[öo]zle[şs]me\s+borc/i },
  { id: "esya_tapu", re: /elatma|m[üu]lkiyet|tapu|zilyet|irtifak|rehin|kat\s+m[üu]lkiyet|payl[ıi]\s+m[üu]lkiyet|elbirli[ğg]i/i },
  { id: "aile", re: /bo[şs]anma|nafaka|velayet|mal\s+rejimi|edinilmi[şs]\s+mal|ki[şs]isel\s+ili[şs]ki|aile\s+konut/i },
  { id: "miras", re: /miras|tenkis|sakl[ıi]\s+pay|vasiyet|miras[çc][ıi]|tereke|reddi\s+miras/i },
  { id: "is_sgk", re: /i[şs]\s+s[öo]zle[şs]|i[şs][çc]i|k[ıi]dem|ihbar\s+tazmin|fazla\s+mesai|SGK|sosyal\s+g[üu]venlik|i[şs]kazas[ıi]|i[şs]\s+g[üu]vencesi/i },
  { id: "ticaret", re: /anonim\s+[şs]irket|limited\s+[şs]irket|ticari\s+i[şs]let|bono|[çc]ek|poli[çc]e|ticaret\s+unvan|haks[ıi]z\s+rekabet|ta[şs][ıi]ma/i },
  { id: "tuketici", re: /t[üu]ketici|ay[ıi]pl[ıi]\s+mal|mesafeli\s+s[öo]zle[şs]|TKHK/i },
  { id: "icra_iflas", re: /icra|iflas|haciz|ihtiyati\s+haciz|s[ıi]ra\s+cetvel|konkordato|itiraz[ıi]n\s+iptali|menfi\s+tespit/i },
  { id: "usul_hukuk", re: /HMK|HUMK|g[öo]rev\s+ve\s+yetki|kesin\s+h[üu]k[üu]m|delil|temyiz\s+s[üu]resi|istinaf|dava\s+[şs]art/i },
  { id: "ceza_genel", re: /kast|taksir|te[şs]ebb[üu]s|i[şs]tirak|zincirleme|i[çc]tima|ceza\s+sorum|TCK\s+m\.?\s*2[0-9]/i },
  { id: "ceza_ozel", re: /h[ıi]rs[ıi]zl[ıi]k|doland[ıi]r[ıi]c[ıi]l[ıi]k|yaralama|[öo]ld[üu]rme|cinsel\s+sald[ıi]r[ıi]|uy[uü][şs]turucu|g[üu]veni\s+k[öo]t[üu]ye/i },
  { id: "ceza_usul", re: /CMK|tutuklama|adli\s+kontrol|arama|elkoyma|iddianame|kovu[şs]turma|soru[şs]turma/i },
  { id: "idare", re: /idari\s+i[şs]lem|iptal\s+davas[ıi]|tam\s+yarg[ıi]|kamu\s+g[öo]revlisi|disiplin\s+cezas[ıi]|imarc[ıi]l[ıi]k|belediye/i },
  { id: "vergi", re: /vergi|KDV|stopaj|tarhiyat|vergi\s+ziya[ıi]|usuls[üu]zl[üu]k\s+cezas[ıi]|m[üu]kellef/i },
  { id: "kamulastirma", re: /kamula[şs]t[ıi]rma|bedel\s+tespit|acele\s+kamula/i },
];

const SOURCE_SCORE = {
  yibk: 1.0,
  hgk: 0.95,
  cgk: 0.95,
  "kurul-diger": 0.85,
  hdbk: 0.85,
  cdbk: 0.85,
  "hukuk-daire": 0.62,
  "ceza-daire": 0.62,
  "icra-daire": 0.64,
  "danistay-iddk": 0.9,
  "danistay-vddk": 0.9,
  "danistay-daire": 0.68,
  default: 0.55,
};

export function yearOf(tarih) {
  const m = String(tarih || "").match(/(\d{4})/);
  return m ? parseInt(m[1], 10) : null;
}

export function eraOf(year) {
  if (year == null) return "unknown";
  if (year < 2010) return "pre2010";
  if (year < 2020) return "y2010_2019";
  return "y2020plus";
}

export function classifyGroup(rec) {
  const daire = String(rec.daire || "");
  const tier = String(rec.tierId || rec.alan || "");
  if (/Büyük Genel|İçtihadı Birleştir|Ictihadi Birles/i.test(daire) || tier === "yibk") return "yibk";
  if (/Hukuk Genel Kurulu/i.test(daire) || tier === "hgk") return "hgk";
  if (/Ceza Genel Kurulu/i.test(daire) || tier === "cgk") return "cgk";
  if (/Başkanlar Kurulu|HDBK|CDBK/i.test(daire) || /hdbk|cdbk/.test(tier)) return "kurul-diger";
  if (/İdare Dava Daireleri|İDDK/i.test(daire) || tier === "danistay-iddk") return "danistay-iddk";
  if (/Vergi Dava Daireleri|VDDK/i.test(daire) || tier === "danistay-vddk") return "danistay-vddk";
  if (/Danıştay|Danistay/i.test(daire) || /danistay/.test(tier)) return "danistay-daire";
  if (/İcra|İflas|Icra|Iflas/i.test(daire) || /icra/.test(tier)) return "icra-daire";
  if (/Ceza Dairesi/i.test(daire) || /ceza/.test(tier)) return "ceza-daire";
  if (/Hukuk Dairesi/i.test(daire) || /daire|borclar|medeni|is-|ticaret/.test(tier)) return "hukuk-daire";
  return "hukuk-daire";
}

export function classifyDomain(text, daire = "") {
  const blob = `${daire}\n${text || ""}`.slice(0, 12000);
  let best = { id: "diger", score: 0 };
  for (const rule of DOMAIN_RULES) {
    const m = blob.match(rule.re);
    if (m) {
      const score = m.length + (blob.toLowerCase().includes(rule.id.split("_")[0]) ? 1 : 0);
      if (score > best.score) best = { id: rule.id, score };
    }
  }
  // chamber hints
  if (/9\.|10\.|22\.|21\./.test(daire) && /Hukuk/.test(daire)) return "is_sgk";
  if (/12\.|19\./.test(daire) && /Hukuk/.test(daire)) return "icra_iflas";
  return best.id;
}

function decodeEntities(s) {
  return String(s || "")
    .replace(/&ldquo;|&rdquo;|&#8220;|&#8221;/g, '"')
    .replace(/&lsquo;|&rsquo;|&#8216;|&#8217;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => {
      try {
        return String.fromCharCode(parseInt(n, 10));
      } catch {
        return "";
      }
    });
}

export function extractRatioSummary(text, maxSentences = 2) {
  const t = decodeEntities(String(text || ""))
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
  if (!t) return "";

  // Prefer block after common markers
  const markers = [
    /HUKUK GENEL KURULU KARARI/i,
    /CEZA GENEL KURULU KARARI/i,
    /GEREK[ÇC]E/i,
    /\"İçtihat Metni\"/i,
    /İçtihat Metni/i,
  ];
  let start = 0;
  for (const re of markers) {
    const m = t.search(re);
    if (m >= 0) {
      start = m;
      break;
    }
  }
  let body = t.slice(start, start + 6000);
  // Drop huge citation lists of statutes at top
  body = body.replace(/\d+\s*S\.\s+[A-ZÇĞİÖŞÜa-zçğıöşü \.]+\s*\[\s*Madde\s*\d+\s*\]/g, " ");

  const sentences = body
    .split(/(?<=[\.!\?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 60 && s.length < 520)
    .filter((s) => !/^\d+\s*S\./.test(s))
    .filter((s) => !/temyiz eden|taraflar aras[ıi]nda/i.test(s))
    .filter((s) => !/davac[ıi]\s+vekil[iı]\s+[öo]zetle|daval[ıi]\s+vekil[iı]\s+[öo]zetle|dava\s+dilek[çc]esinde\s+[öo]zetle/i.test(s))
    .filter((s) => !/yeniden\s+yap[ıi]lan\s+yarg[ıi]lama\s+sonunda|direnilmi[şs]tir/i.test(s) || s.length > 180);

  // Prefer sentences with principle language / normative force
  const ranked = sentences
    .map((s, i) => {
      const principle = (s.match(PRINCIPLE_RE) || []).length;
      const formula = (s.match(FORMULA_RE) || []).length;
      const normative = /\b(gerekir|zorundad[ıi]r|kabul\s+edilmelidir|uyulmak|uygulan[ıi]r|anla[şs][ıi]lmal[ıi]d[ıi]r|de[ğg]erlendirilmelidir)\b/i.test(s)
        ? 2
        : 0;
      return {
        s,
        i,
        score: principle * 4 + normative - formula * 2 + Math.min(s.length / 120, 2.5),
      };
    })
    .sort((a, b) => b.score - a.score || a.i - b.i);

  const picked = [];
  for (const r of ranked) {
    if (picked.length >= maxSentences) break;
    if (picked.some((p) => jaccard(tokenize(p), tokenize(r.s)) > 0.6)) continue;
    picked.push(r.s);
  }
  if (!picked.length && sentences[0]) picked.push(sentences[0]);
  return picked.join(" ").slice(0, 480);
}

function tokenize(s) {
  return String(s || "")
    .toLocaleLowerCase("tr-TR")
    .replace(/[^a-zçğıöşü0-9\s]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function jaccard(a, b) {
  if (!a.length || !b.length) return 0;
  const A = new Set(a);
  const B = new Set(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}

/** Char 5-gram multiset fingerprint for cosine-ish similarity */
export function fingerprint(text, n = 5) {
  const s = String(text || "")
    .toLocaleLowerCase("tr-TR")
    .replace(/\s+/g, " ")
    .slice(0, 8000);
  const map = new Map();
  for (let i = 0; i <= s.length - n; i++) {
    const g = s.slice(i, i + n);
    map.set(g, (map.get(g) || 0) + 1);
  }
  return map;
}

export function cosineMaps(a, b) {
  if (!a?.size || !b?.size) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const [, v] of a) na += v * v;
  for (const [, v] of b) nb += v * v;
  if (!na || !nb) return 0;
  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  for (const [k, v] of small) {
    if (large.has(k)) dot += v * large.get(k);
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function sourceScoreOf(group) {
  return SOURCE_SCORE[group] ?? SOURCE_SCORE.default;
}

export function scoreDecision(rec, plan) {
  const text = rec.text || "";
  const len = text.length;
  const group = classifyGroup(rec);
  const year = yearOf(rec.tarih);
  const era = eraOf(year);
  const domain = classifyDomain(text, rec.daire);
  const isKurul = /yibk|hgk|cgk|kurul|iddk|vddk/.test(group);
  const q = plan?.quality || {};
  const minLen = isKurul ? q.minTextLenKurul ?? 900 : q.minTextLenDefault ?? 1500;

  const principleHits = (text.match(PRINCIPLE_RE) || []).length;
  const formulaHits = (text.match(FORMULA_RE) || []).length;
  const citeHits = (text.match(CITE_RE) || []).length;

  // length quality 0..1
  let lenScore = 0;
  if (len < minLen) lenScore = Math.max(0, len / minLen) * 0.35;
  else if (len < (q.preferLenSweetMin ?? 4000)) lenScore = 0.55 + 0.2 * ((len - minLen) / Math.max(1, (q.preferLenSweetMin ?? 4000) - minLen));
  else if (len <= (q.preferLenSweetMax ?? 40000)) lenScore = 0.9;
  else lenScore = 0.75; // very long still ok but slightly lower

  const principleScore = Math.min(1, principleHits / 6);
  const formulaPenalty = Math.min(1, formulaHits / 4);
  const citeScore = Math.min(1, citeHits / 8);

  // Short formula-heavy decisions
  const shortFormula = len < 2500 && formulaHits >= 1 && principleHits === 0;

  let quality =
    0.4 * lenScore +
    0.3 * principleScore +
    0.15 * citeScore +
    0.15 * (1 - formulaPenalty);

  if (shortFormula) quality *= 0.35;
  if (principleHits >= 2 && len > 5000) quality = Math.min(1, quality + 0.08);

  const source = sourceScoreOf(group);
  const eraBalance =
    era === "y2020plus" ? 0.72 : era === "y2010_2019" ? 0.78 : era === "pre2010" ? 0.7 : 0.5;

  // uniqueness filled later in select pass; provisional = 1
  const uniqueness = 1;
  const w = plan?.weights || { source: 0.32, quality: 0.38, uniqueness: 0.22, eraBalance: 0.08 };
  const composite =
    w.source * source + w.quality * quality + w.uniqueness * uniqueness + w.eraBalance * eraBalance;

  const ratioOzeti = extractRatioSummary(text);
  const fp = fingerprint(ratioOzeti || text.slice(0, 3000));

  return {
    id: String(rec.id),
    mahkeme: rec.mahkeme || (group.startsWith("danistay") ? "Danıştay" : "Yargıtay"),
    daire: rec.daire || "",
    esas: rec.esas || "",
    karar: rec.karar || "",
    tarih: rec.tarih || "",
    kunye: rec.kunye || "",
    group,
    domain,
    era,
    year,
    textLen: len,
    ratioOzeti,
    sourceScore: round3(source),
    qualityScore: round3(quality),
    uniquenessScore: 1,
    eraScore: round3(eraBalance),
    compositeScore: round3(composite),
    signals: {
      principleHits,
      formulaHits,
      citeHits,
      shortFormula,
    },
    _fp: fp,
  };
}

export function recomputeComposite(row, plan) {
  const w = plan?.weights || { source: 0.32, quality: 0.38, uniqueness: 0.22, eraBalance: 0.08 };
  row.compositeScore = round3(
    w.source * row.sourceScore +
      w.quality * row.qualityScore +
      w.uniqueness * (row.uniquenessScore ?? 1) +
      w.eraBalance * (row.eraScore ?? 0.7)
  );
  return row;
}

function round3(x) {
  return Math.round(x * 1000) / 1000;
}

export function assignUniquenessWithinPool(rows, threshold = 0.85) {
  // Sort by quality+source first so keepers are strong
  const sorted = [...rows].sort(
    (a, b) => b.qualityScore + b.sourceScore - (a.qualityScore + a.sourceScore) || b.textLen - a.textLen
  );
  const keepers = [];
  const rejected = [];

  for (const row of sorted) {
    let maxSim = 0;
    let nearest = null;
    for (const k of keepers) {
      // only compare same group+domain for speed & legal sense
      if (k.group !== row.group) continue;
      if (k.domain !== row.domain && k.group.endsWith("daire")) continue;
      const sim = cosineMaps(row._fp, k._fp);
      if (sim > maxSim) {
        maxSim = sim;
        nearest = k.id;
      }
      if (sim >= threshold) break;
    }
    if (maxSim >= threshold) {
      rejected.push({
        id: row.id,
        similarTo: nearest,
        similarity: round3(maxSim),
        group: row.group,
      });
      continue;
    }
    // uniquenessScore: 1 - maxSim (higher = more unique)
    row.uniquenessScore = round3(1 - maxSim);
    keepers.push(row);
  }
  return { keepers, rejected };
}
