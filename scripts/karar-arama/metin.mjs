/**
 * Karar arama — saf metin işlevleri. Veritabanı ve sunucu bunları kullanır; yan etkisi yoktur.
 *
 * Katlama karakter başına tek karakter üretir (uzunluk korunur). Böylece katlanmış metinde bulunan konum,
 * özgün metinde aynı konumdur ve vurgu özgün yazımla ("İşçinin") gösterilir.
 */

const HARITA = {
  I: "i", İ: "i", ı: "i", Ş: "s", ş: "s", Ç: "c", ç: "c", Ğ: "g", ğ: "g",
  Ö: "o", ö: "o", Ü: "u", ü: "u", Â: "a", â: "a", Î: "i", î: "i", Û: "u", û: "u",
};

/** Küçük harfe indirir ve Türkçe harfleri ASCII karşılığına katlar; UTF-16 uzunluğu değişmez. */
export function katla(s) {
  let o = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const m = HARITA[ch];
    if (m) {
      o += m;
      continue;
    }
    const k = ch.toLowerCase();
    o += k.length === 1 ? k : ch;
  }
  return o;
}

const SOZCUK = /[\p{L}\p{N}]+/gu;
const parcala = (s) => katla(s).match(SOZCUK) ?? [];

// "2024/1234", "E. 2024/1234", "2024/1234 K." — yıl 4 hane, sıra 1-7 hane.
// "T.B.K. 2024/5" içindeki K bir kısaltmanın parçasıdır: önünde harf, rakam ya da nokta varsa tür sayılmaz.
// Genel kurul esası "2010/11-312" biçimindedir: ortadaki daire numarası atlanır, sıra 312'dir.
const NUMARA = /(?:(?<![\p{L}\p{N}.])([EK])\s*\.?\s*:?\s*)?\b((?:19|20)\d{2})\s*\/\s*(?:\d{1,3}\s*-\s*)?(\d{1,7})\b(?:\s*([EK])\b\.?)?/giu;

/**
 * Sorguyu üç öbeğe ayırır: esas/karar numaraları, tırnaklı ifadeler, kalan kelimeler.
 * Her ifade ve kelime katlanmış sözcük dizisidir; "T.B.K." gibi bir kelime birden çok sözcük taşıyabilir.
 */
export function sorguCoz(sorgu) {
  let kalan = String(sorgu ?? "").replace(/[“”„«»]/g, '"');
  const numaralar = [];
  kalan = kalan.replace(NUMARA, (_, onTur, yil, no, sonTur) => {
    const tur = (onTur || sonTur || "").toUpperCase() || null;
    numaralar.push({ yil: Number(yil), no: Number(no), tur });
    return " ";
  });
  const ifadeler = [];
  kalan = kalan.replace(/"([^"]*)"/g, (_, ic) => {
    const s = parcala(ic);
    if (s.length) ifadeler.push(s);
    return " ";
  });
  // Boşlukla ayrılan her parça bir kelimedir; kapanmamış ya da kelime içinde kalmış tırnak da ayırıcı sayılır.
  const kelimeler = kalan
    .split(/[\s"]+/)
    .map(parcala)
    .filter((s) => s.length);
  return { numaralar, ifadeler, kelimeler, bos: !numaralar.length && !ifadeler.length && !kelimeler.length };
}

const tirnakla = (sozcukler) => `"${sozcukler.join(" ")}"`;

/**
 * FTS5 MATCH ifadesi: tek sözcüklü kelime önekli ("isci"*), çok sözcüklü kelime ve tırnaklı ifade birebir.
 * Sözcükler yalnız harf/rakamdan oluştuğundan FTS5 sözdizimine sızamaz.
 */
export function ftsIfadesi(c, { numaralarMetinde = false } = {}) {
  const parcalar = [];
  for (const k of c.kelimeler) parcalar.push(k.length === 1 ? `${tirnakla(k)}*` : tirnakla(k));
  for (const f of c.ifadeler) parcalar.push(tirnakla(f));
  if (numaralarMetinde) for (const n of c.numaralar) parcalar.push(tirnakla([String(n.yil), String(n.no)]));
  return parcalar.join(" AND ");
}

const kacis = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const SINIR_ONCE = "(?<![\\p{L}\\p{N}])";
const SINIR_SONRA = "(?![\\p{L}\\p{N}])";
const ARA = "[^\\p{L}\\p{N}]+";

/** Sorgudaki her terimi katlanmış metinde bulan düzenli ifadeler; ifadeler önce gelir (pencere onlara ortalanır). */
function terimDesenleri(c) {
  const desen = [];
  for (const f of c.ifadeler) desen.push(SINIR_ONCE + f.map(kacis).join(ARA) + SINIR_SONRA);
  for (const n of c.numaralar) desen.push(SINIR_ONCE + `${n.yil}\\s*\\/\\s*${n.no}` + SINIR_SONRA);
  for (const k of c.kelimeler) {
    desen.push(SINIR_ONCE + k.map(kacis).join(ARA) + (k.length === 1 ? "[\\p{L}\\p{N}]*" : SINIR_SONRA));
  }
  return desen.map((d) => new RegExp(d, "gu"));
}

/**
 * Metni [{t, v}] parçalarına böler; v=true olan parça vurgulanır. pencere > 0 ise ilk eşleşmenin çevresinden
 * yaklaşık o kadar karakterlik bir kesit alınır ve kesilen uçlara "…" konur. Parçalar HTML değil düz metindir.
 */
export function vurgula(metin, c, { pencere = 280 } = {}) {
  const kat = katla(metin);
  const desenler = terimDesenleri(c);
  let bas = 0;
  let son = metin.length;
  if (pencere > 0 && metin.length > pencere) {
    let ilk = -1;
    for (const d of desenler) {
      d.lastIndex = 0;
      const m = d.exec(kat);
      if (m && (ilk < 0 || m.index < ilk)) ilk = m.index;
      if (ilk >= 0 && desenler.indexOf(d) < c.ifadeler.length) break;
    }
    bas = Math.max(0, ilk < 0 ? 0 : ilk - Math.floor(pencere / 3));
    son = Math.min(metin.length, bas + pencere);
    bas = kelimeBasi(metin, bas);
    son = kelimeSonu(metin, son);
  }
  const araliklar = [];
  for (const d of desenler) {
    d.lastIndex = bas;
    let m;
    while ((m = d.exec(kat)) && m.index < son) {
      if (!m[0].length) {
        d.lastIndex++;
        continue;
      }
      araliklar.push([m.index, Math.min(son, m.index + m[0].length)]);
    }
  }
  araliklar.sort((a, b) => a[0] - b[0]);
  const birlesik = [];
  for (const a of araliklar) {
    const s = birlesik[birlesik.length - 1];
    if (s && a[0] <= s[1]) s[1] = Math.max(s[1], a[1]);
    else birlesik.push([...a]);
  }
  const parcalar = [];
  let i = bas;
  for (const [a, b] of birlesik) {
    if (a > i) parcalar.push({ t: metin.slice(i, a), v: false });
    parcalar.push({ t: metin.slice(a, b), v: true });
    i = b;
  }
  if (i < son) parcalar.push({ t: metin.slice(i, son), v: false });
  if (bas > 0) parcalar.unshift({ t: "…", v: false });
  if (son < metin.length) parcalar.push({ t: "…", v: false });
  return parcalar;
}

function kelimeBasi(s, i) {
  if (i <= 0) return 0;
  const j = s.lastIndexOf(" ", i);
  return j < 0 || i - j > 30 ? i : j + 1;
}

function kelimeSonu(s, i) {
  if (i >= s.length) return s.length;
  const j = s.indexOf(" ", i);
  return j < 0 || j - i > 30 ? i : j;
}

const VARLIK = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’",
  laquo: "«", raquo: "»", ndash: "–", mdash: "—", hellip: "…", bull: "•", middot: "·", sect: "§", deg: "°",
};

/** Yargıtay metinlerinde kalan HTML karakter kodları (&ldquo; &#39; &#x15F;) gerçek karaktere çevrilir. */
function varlikCoz(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (tam, ad) => {
    if (ad[0] === "#") {
      const kod = ad[1] === "x" || ad[1] === "X" ? parseInt(ad.slice(2), 16) : parseInt(ad.slice(1), 10);
      return kod > 0 && kod < 0x110000 ? String.fromCodePoint(kod) : tam;
    }
    return VARLIK[ad.toLowerCase()] ?? tam;
  });
}

/** Ham karar metnindeki HTML kodlarını, \r'yi, satır sonu boşluklarını ve boş satır yığınlarını düzeltir. */
export function temizMetin(t) {
  return varlikCoz(String(t ?? ""))
    .replace(/\r/g, "")
    .replace(/[ \t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** "2025/9261" → {yil, no}; HGK'nin "2010/8-17" biçiminde son sayı esas sırasıdır. */
export function numaraAyir(s) {
  const m = /^\s*(\d{4})\s*\/\s*(?:\d+\s*-\s*)?(\d+)/.exec(String(s ?? ""));
  return m ? { yil: Number(m[1]), no: Number(m[2]) } : null;
}

/** Arama süzgecindeki tür: ibk | hgk | cgk | ceza | hukuk. */
export function kararTuru(daire) {
  const d = katla(String(daire ?? ""));
  if (/birlestirme|buyuk genel kurul/.test(d)) return "ibk";
  if (/hukuk genel kurulu/.test(d)) return "hgk";
  if (/ceza genel kurulu/.test(d)) return "cgk";
  if (/ceza/.test(d)) return "ceza";
  return "hukuk";
}

const BASLIK = /^\s*([^\n\d]*?(?:Dairesi|Kurulu))\s+(\d{4}\/[\d-]+)\s*E\.\s*,\s*(\d{4}\/\d+)\s*K\./u;
const TARIH = /\b(\d{1,2})\.(\d{1,2})\.(\d{4})\s+gün/gu;

/** Künyesi kaybolmuş (kurtarılmış) kararın ilk satırından daire/esas/karar, son "… günü" ibaresinden tarih. */
export function basliktanBilgi(metin) {
  const t = String(metin ?? "");
  const m = BASLIK.exec(t);
  if (!m) return null;
  let tarih = "";
  for (const d of t.slice(-1500).matchAll(TARIH)) tarih = `${d[1].padStart(2, "0")}.${d[2].padStart(2, "0")}.${d[3]}`;
  return { daire: m[1].trim(), esas: m[2], karar: m[3], tarih };
}

/** "07.01.2026" → "2026-01-07"; geçersizse "". */
export function isoTarih(t) {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(t ?? "").trim());
  return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
}
