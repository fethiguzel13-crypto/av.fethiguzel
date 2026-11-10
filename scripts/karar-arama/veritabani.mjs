/**
 * Karar arama — SQLite veritabanı (Node'un yerleşik node:sqlite'ı; FTS5 tam metin dizini).
 *
 * kararlar : künye alanları + temizlenmiş özgün metin (gösterim için); kopya=1 → aynı künye başka kimlikle
 *            zaten var (Yargıtay bazı kararları iki kimlikle yayımlar), listede gösterilmez
 * ara      : katlanmış künye ve metnin FTS5 dizini; içerik saklamaz (contentless), rowid = kararlar.rid
 * bilgi    : son güncelleme gibi anahtar/değer kayıtları
 *
 * Aynı dosyayı yerel sunucu okur, kur.mjs yazar; WAL kipi ikisinin aynı anda çalışmasına izin verir.
 */
import { DatabaseSync } from "node:sqlite";
import { basliktanBilgi, ftsIfadesi, isoTarih, katla, kararTuru, numaraAyir, sorguCoz, temizMetin, vurgula } from "./metin.mjs";

const SEMA = `
CREATE TABLE IF NOT EXISTS kararlar (
  rid INTEGER PRIMARY KEY,
  id TEXT NOT NULL UNIQUE,
  daire TEXT NOT NULL DEFAULT '',
  tur TEXT NOT NULL DEFAULT 'hukuk',
  esas TEXT NOT NULL DEFAULT '',
  karar TEXT NOT NULL DEFAULT '',
  tarih TEXT NOT NULL DEFAULT '',
  tarih_iso TEXT NOT NULL DEFAULT '',
  yil INTEGER,
  esas_yil INTEGER, esas_no INTEGER,
  karar_yil INTEGER, karar_no INTEGER,
  kunye TEXT NOT NULL DEFAULT '',
  kaynak TEXT NOT NULL DEFAULT '',
  metin TEXT NOT NULL DEFAULT '',
  kopya INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS kararlar_kunye ON kararlar(kunye);
CREATE INDEX IF NOT EXISTS kararlar_esas ON kararlar(esas_yil, esas_no);
CREATE INDEX IF NOT EXISTS kararlar_karar ON kararlar(karar_yil, karar_no);
CREATE INDEX IF NOT EXISTS kararlar_tarih ON kararlar(tarih_iso);
CREATE INDEX IF NOT EXISTS kararlar_daire ON kararlar(daire);
CREATE VIRTUAL TABLE IF NOT EXISTS ara USING fts5(
  kunye, metin, content='', contentless_delete=1, tokenize='unicode61 remove_diacritics 2'
);
CREATE TABLE IF NOT EXISTS bilgi (anahtar TEXT PRIMARY KEY, deger TEXT);
`;

const hazirlar = new WeakMap();
function hazir(db, sql) {
  let m = hazirlar.get(db);
  if (!m) hazirlar.set(db, (m = new Map()));
  let s = m.get(sql);
  if (!s) m.set(sql, (s = db.prepare(sql)));
  return s;
}

/** Veritabanını açar, gerekirse şemayı kurar. */
export function ac(yol, { saltOkunur = false } = {}) {
  const db = new DatabaseSync(yol, saltOkunur ? { readOnly: true } : {});
  db.exec("PRAGMA busy_timeout = 10000");
  if (!saltOkunur) {
    if (yol !== ":memory:") db.exec("PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL");
    db.exec(SEMA);
  }
  return db;
}

/** Bir karar dosyasını (hasat motorunun JSON'u) ekler; aynı kimlik varsa yenisiyle değiştirir. */
export function ekle(db, k) {
  const metin = temizMetin(k.text ?? k.metin ?? "");
  let { daire = "", esas = "", karar = "", tarih = "", kunye = "" } = k;
  if (!daire || !esas) {
    const b = basliktanBilgi(metin);
    if (b) {
      daire ||= b.daire;
      esas ||= b.esas;
      karar ||= b.karar;
      tarih ||= b.tarih;
      kunye = `Yargıtay ${daire}, E. ${esas}, K. ${karar}${tarih ? `, T. ${tarih}` : ""}`;
    }
  }
  const e = numaraAyir(esas);
  const kr = numaraAyir(karar);
  const iso = isoTarih(tarih);
  const yil = iso ? Number(iso.slice(0, 4)) : (kr?.yil ?? null);

  const eski = hazir(db, "SELECT rid FROM kararlar WHERE id = ?").get(String(k.id));
  if (eski) {
    hazir(db, "DELETE FROM ara WHERE rowid = ?").run(eski.rid);
    hazir(db, "DELETE FROM kararlar WHERE rid = ?").run(eski.rid);
  }
  // Künyesi olan bir kararın aynısı başka kimlikle zaten varsa bu kayıt kopyadır.
  const kopya = esas && hazir(db, "SELECT 1 AS x FROM kararlar WHERE kunye = ? AND kopya = 0").get(kunye) ? 1 : 0;
  const { lastInsertRowid: rid } = hazir(
    db,
    `INSERT INTO kararlar (id, daire, tur, esas, karar, tarih, tarih_iso, yil, esas_yil, esas_no, karar_yil, karar_no, kunye, kaynak, metin, kopya)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    String(k.id), daire, kararTuru(daire), esas, karar, tarih, iso, yil,
    e?.yil ?? null, e?.no ?? null, kr?.yil ?? null, kr?.no ?? null,
    kunye, k.documentUrl ?? "", metin, kopya,
  );
  hazir(db, "INSERT INTO ara (rowid, kunye, metin) VALUES (?, ?, ?)").run(rid, katla(kunye), katla(metin));
}

/**
 * Arama. Sorgu boşsa yalnız süzgeçler uygulanır.
 * Numara içeren sorguda esas/karar numarası tutan kararlar önce ("numara"), metninde o numara geçenler sonra
 * ("metin") gelir. Sıralama: yeni (karar tarihi, varsayılan) ya da ilgili (FTS5 bm25).
 */
export function ara(db, sorgu, { tur, daire, yil1, yil2, sirala = "yeni", sayfa = 1, boyut = 20 } = {}) {
  const t0 = performance.now();
  const c = sorguCoz(sorgu);
  const fts = ftsIfadesi(c);

  const nerede = ["k.kopya = 0"];
  const neredeD = [];
  if (tur) nerede.push("k.tur = ?"), neredeD.push(String(tur));
  if (daire) nerede.push("k.daire = ?"), neredeD.push(String(daire));
  if (yil1) nerede.push("k.yil >= ?"), neredeD.push(Number(yil1));
  if (yil2) nerede.push("k.yil <= ?"), neredeD.push(Number(yil2));

  let numaraSql = "";
  const numaraD = [];
  if (c.numaralar.length) {
    const E = "(k.esas_yil = ? AND k.esas_no = ?)";
    const K = "(k.karar_yil = ? AND k.karar_no = ?)";
    const parca = c.numaralar.map((n) => {
      if (n.tur === "E") return numaraD.push(n.yil, n.no), E;
      if (n.tur === "K") return numaraD.push(n.yil, n.no), K;
      numaraD.push(n.yil, n.no, n.yil, n.no);
      return `(${E} OR ${K})`;
    });
    numaraSql = `(${parca.join(" OR ")})`;
    const metinde = ftsIfadesi({ kelimeler: [], ifadeler: [], numaralar: c.numaralar }, { numaralarMetinde: true });
    nerede.push(`(${numaraSql} OR k.rid IN (SELECT rowid FROM ara WHERE ara MATCH ?))`);
    neredeD.push(...numaraD, metinde);
  }

  const kaynak = fts ? "kararlar k JOIN (SELECT rowid AS r, rank FROM ara WHERE ara MATCH ?) a ON a.r = k.rid" : "kararlar k";
  const kaynakD = fts ? [fts] : [];
  const where = `WHERE ${nerede.join(" AND ")}`;
  const eslesme = numaraSql ? `CASE WHEN ${numaraSql} THEN 'numara' ELSE 'metin' END` : "'metin'";
  const eslesmeD = numaraSql ? numaraD : [];
  const sira = [
    ...(numaraSql ? ["eslesme = 'metin'"] : []),
    sirala === "ilgili" && fts ? "a.rank" : "k.tarih_iso DESC",
    "k.rid DESC",
  ].join(", ");

  const boy = Math.min(Math.max(Number(boyut) || 20, 1), 100);
  const say = Math.max(Number(sayfa) || 1, 1);
  const toplam = db.prepare(`SELECT count(*) AS n FROM ${kaynak} ${where}`).get(...kaynakD, ...neredeD).n;
  const satirlar = db
    .prepare(
      `SELECT k.id, k.kunye, k.daire, k.tur, k.esas, k.karar, k.tarih, k.metin, ${eslesme} AS eslesme
       FROM ${kaynak} ${where} ORDER BY ${sira} LIMIT ? OFFSET ?`,
    )
    .all(...eslesmeD, ...kaynakD, ...neredeD, boy, (say - 1) * boy);

  const sonuclar = satirlar.map(({ metin, ...s }) => ({ ...s, parca: vurgula(metin, c, { pencere: 320 }) }));
  return { toplam, sayfa: say, boyut: boy, sonuclar, sure: Math.round(performance.now() - t0) };
}

/** Tek kararın tamamı; sorgu verilirse metin vurgulu parçalara bölünmüş olarak da döner. */
export function getir(db, id, sorgu) {
  const k = hazir(db, "SELECT id, kunye, daire, tur, esas, karar, tarih, kaynak, metin FROM kararlar WHERE id = ?").get(String(id));
  if (!k) return null;
  return sorgu ? { ...k, parca: vurgula(k.metin, sorguCoz(sorgu), { pencere: 0 }) } : { ...k };
}

const TUR_SIRA = { ibk: 0, hgk: 1, cgk: 2, hukuk: 3, ceza: 4 };

/** Süzgeç listesi: daireler, kurullar önce, sonra daire numarasına göre. */
export function daireler(db) {
  return db
    .prepare("SELECT daire, tur, count(*) AS sayi FROM kararlar WHERE daire <> '' AND kopya = 0 GROUP BY daire")
    .all()
    .map((x) => ({ ...x }))
    .sort((a, b) => TUR_SIRA[a.tur] - TUR_SIRA[b.tur] || (parseInt(a.daire) || 0) - (parseInt(b.daire) || 0) || a.daire.localeCompare(b.daire, "tr"));
}

export function bilgiYaz(db, anahtar, deger) {
  hazir(db, "INSERT INTO bilgi (anahtar, deger) VALUES (?, ?) ON CONFLICT(anahtar) DO UPDATE SET deger = excluded.deger").run(anahtar, String(deger));
}

export function durum(db) {
  const karar = hazir(db, "SELECT count(*) AS n FROM kararlar WHERE kopya = 0").get().n;
  const g = hazir(db, "SELECT deger FROM bilgi WHERE anahtar = 'guncelleme'").get();
  return { karar, guncelleme: g?.deger ?? null };
}

/** Veritabanındaki karar kimlikleri (artımlı güncelleme yalnız yenileri ekler). */
export function varOlanlar(db) {
  return new Set(hazir(db, "SELECT id FROM kararlar").all().map((r) => r.id));
}
