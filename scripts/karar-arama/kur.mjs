#!/usr/bin/env node
/**
 * Karar arama veritabanını kurar ya da günceller (yalnız yeni kararları ekler).
 *
 *   node scripts/karar-arama/kur.mjs              # artımlı
 *   node scripts/karar-arama/kur.mjs --yeniden    # hepsini baştan dizinle
 *   node scripts/karar-arama/kur.mjs --sinir=2000 # deneme: yalnız ilk 2000 yeni karar
 *
 * Kaynak: data/yargi-kararlari/index.jsonl (hasat motorunun karar listesi) + decisions/ altındaki JSON'lar.
 * Hasat motorunun dosyalarına yalnız okumak için dokunur.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { DB, VERI, durumYaz, kilitAl, kilitBirak } from "./ayar.mjs";
import { ac, bilgiYaz, durum, ekle, varOlanlar } from "./veritabani.mjs";

const yeniden = process.argv.includes("--yeniden");
const sessiz = process.argv.includes("--sessiz");
// Deneme için: yalnız ilk N yeni kararı ekle.
const sinir = Number((process.argv.find((a) => a.startsWith("--sinir=")) || "").slice(8)) || Infinity;
const yaz = (...a) => !sessiz && console.log(...a);

function listeOku() {
  const yol = join(VERI, "index.jsonl");
  if (!existsSync(yol)) throw new Error(`karar listesi yok: ${yol}`);
  const dosyalar = new Map();
  for (const satir of readFileSync(yol, "utf8").split("\n")) {
    if (!satir.trim()) continue;
    try {
      const j = JSON.parse(satir);
      if (j.id && j.file) dosyalar.set(String(j.id), j.file);
    } catch {
      /* yarım yazılmış son satır */
    }
  }
  return dosyalar;
}

function calis() {
  if (!kilitAl()) {
    yaz("Başka bir güncelleme sürüyor; çıkılıyor.");
    return 0;
  }
  const baslangic = new Date().toISOString();
  const db = ac(DB);
  try {
    if (yeniden) {
      yaz("Dizin baştan kuruluyor…");
      db.exec("DELETE FROM ara; DELETE FROM kararlar;");
    }
    const liste = listeOku();
    const var_ = varOlanlar(db);
    const yeniler = [...liste].filter(([id]) => !var_.has(id)).slice(0, sinir);
    const toplam = yeniler.length;
    yaz(`Listede ${liste.size} karar; veritabanında ${var_.size}; eklenecek ${toplam}. Veritabanı: ${DB}`);
    durumYaz({ calisiyor: true, islenen: 0, toplam, eklenen: 0, baslangic });

    let islenen = 0;
    let eklenen = 0;
    let eksik = 0;
    let bozuk = 0;
    const PARTI = 1000;
    db.exec("BEGIN");
    for (const [id, dosya] of yeniler) {
      islenen++;
      const yol = join(VERI, dosya);
      let k;
      try {
        k = JSON.parse(readFileSync(yol, "utf8"));
      } catch (e) {
        if (e.code === "ENOENT") eksik++;
        else bozuk++;
        continue;
      }
      if (!k.text) {
        eksik++;
        continue;
      }
      ekle(db, { ...k, id });
      eklenen++;
      if (islenen % PARTI === 0) {
        db.exec("COMMIT");
        durumYaz({ calisiyor: true, islenen, toplam, eklenen, baslangic });
        if (islenen % 10000 === 0) yaz(`  ${islenen}/${toplam}`);
        db.exec("BEGIN");
      }
    }
    db.exec("COMMIT");
    if (eklenen > 10000) {
      yaz("Dizin sıkıştırılıyor…");
      db.exec("INSERT INTO ara(ara) VALUES ('optimize')");
    }
    const bitis = new Date().toISOString();
    if (eklenen || yeniden) bilgiYaz(db, "guncelleme", bitis);
    const son = durum(db);
    durumYaz({ calisiyor: false, islenen, toplam, eklenen, eksik, bozuk, baslangic, bitis, karar: son.karar });
    yaz(`Bitti: ${eklenen} karar eklendi (metni olmayan/eksik ${eksik}, bozuk ${bozuk}). Toplam ${son.karar}.`);
    return 0;
  } catch (e) {
    try {
      db.exec("ROLLBACK");
    } catch {
      /* işlem açık değil */
    }
    durumYaz({ calisiyor: false, hata: String(e?.message || e), baslangic, bitis: new Date().toISOString() });
    console.error(e);
    return 1;
  } finally {
    db.close();
    kilitBirak();
  }
}

process.exitCode = calis();
