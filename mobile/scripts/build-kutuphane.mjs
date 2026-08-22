#!/usr/bin/env node
/**
 * Akademik eserler külliyatı — makaleler cihazda OKUNABİLİR hâle gelir.
 *
 * Portalda makaleler `public/makaleler/` altında .docx ve .pdf olarak duruyor
 * ve site onları indirtiyor. Mobilde indirme kötü bir cevap: kullanıcı
 * uygulamadan çıkıp harici bir okuyucuya düşüyor, çevrimdışıysa hiç açamıyor.
 *
 * Bu betik metni ÇIKARIR ve uygulamanın kendi okuma görünümünde
 * gösterilebilecek yapıya çevirir:
 *
 *   data-src/kutuphane/eserler.json.gz  — [{ slug, baslik, kategori,
 *                                            paragraflar, kelime, kaynak }]
 *
 * .docx bir zip'tir; word/document.xml içindeki <w:p> düğümleri paragraf,
 * <w:t> düğümleri metin taşır. Harici bağımlılık gerektirmeden okunur.
 * .pdf için sistemdeki `pdftotext` kullanılır; yoksa o dosya atlanır ve
 * uyarı basılır — sessizce eksik külliyat üretmek en kötüsü.
 */
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  statSync,
} from 'node:fs';
import { execFileSync } from 'node:child_process';
import { gzipSync, inflateRawSync } from 'node:zlib';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const mobile = join(here, '..');
const portal = join(mobile, '..');
const srcDir = join(portal, 'public', 'makaleler');
const outDir = join(mobile, 'data-src', 'kutuphane');

mkdirSync(outDir, { recursive: true });

if (!existsSync(srcDir)) {
  console.error('[kutuphane] kaynak yok:', srcDir);
  process.exit(1);
}

// ── ZIP okuma (docx) ────────────────────────────────────────────────────────
/**
 * Zip merkezî dizininden tek bir girdiyi çıkarır.
 *
 * Tam bir zip kütüphanesi gerekmez: docx'te aradığımız tek dosya
 * `word/document.xml` ve o da ya deflate ya da store ile saklanır.
 */
function zipEntry(buf, wanted) {
  // End of central directory
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0 && i > buf.length - 66000; i -= 1) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) return null;

  const count = buf.readUInt16LE(eocd + 10);
  let ptr = buf.readUInt32LE(eocd + 16);

  for (let i = 0; i < count; i += 1) {
    if (buf.readUInt32LE(ptr) !== 0x02014b50) return null;
    const method = buf.readUInt16LE(ptr + 10);
    const compSize = buf.readUInt32LE(ptr + 20);
    const nameLen = buf.readUInt16LE(ptr + 28);
    const extraLen = buf.readUInt16LE(ptr + 30);
    const commentLen = buf.readUInt16LE(ptr + 32);
    const localOff = buf.readUInt32LE(ptr + 42);
    const name = buf.toString('utf8', ptr + 46, ptr + 46 + nameLen);

    if (name === wanted) {
      const lnameLen = buf.readUInt16LE(localOff + 26);
      const lextraLen = buf.readUInt16LE(localOff + 28);
      const start = localOff + 30 + lnameLen + lextraLen;
      const raw = buf.subarray(start, start + compSize);
      if (method === 0) return raw;
      if (method === 8) return inflateRawSync(raw);
      return null;
    }
    ptr += 46 + nameLen + extraLen + commentLen;
  }
  return null;
}

/** word/document.xml → paragraf dizisi */
function docxParagraphs(file) {
  const xml = zipEntry(readFileSync(file), 'word/document.xml');
  if (!xml) return [];
  const text = xml.toString('utf8');
  const paragraflar = [];

  for (const m of text.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)) {
    const blok = m[0];
    let parca = '';
    for (const t of blok.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)) {
      parca += t[1];
    }
    // Sekme ve satır sonu düğümleri
    const duz = parca
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
    if (duz) paragraflar.push(duz);
  }
  return paragraflar;
}

/** pdftotext ile PDF metni; araç yoksa boş döner. */
function pdfParagraphs(file) {
  const out = join(tmpdir(), `eser-${Date.now()}-${Math.round(Math.random() * 1e6)}.txt`);
  try {
    execFileSync('pdftotext', ['-layout', '-enc', 'UTF-8', file, out], { stdio: 'ignore' });
  } catch {
    return null;
  }
  if (!existsSync(out)) return null;
  const text = readFileSync(out, 'utf8');
  return text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter((p) => p.length > 40);
}

// ── Slug ────────────────────────────────────────────────────────────────────
function slugify(s) {
  return String(s || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/[ıİ]/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

/** «ESER SÖZLEŞMESİNDE YÜKLENİCİNİN SORUMLULUĞU» → düzgün başlık */
function baslikDuzelt(ad) {
  const temiz = ad
    .replace(/\s*\(\d+\)\s*$/, '')
    .replace(/[_]+/g, ' ')
    // Dosya adına yazarın kendi adı sızmış olabilir; başlık eserin adıdır
    .replace(/\bfethi\s+g[üu]zel\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!temiz) return '';
  if (temiz !== temiz.toLocaleUpperCase('tr-TR')) {
    return temiz.charAt(0).toLocaleUpperCase('tr-TR') + temiz.slice(1);
  }
  const kucuk = temiz.toLocaleLowerCase('tr-TR');
  return kucuk.charAt(0).toLocaleUpperCase('tr-TR') + kucuk.slice(1);
}

/** Dosya adı eserin adını taşımıyor mu? */
const ANLAMSIZ_AD =
  /^(yeni\s+microsoft\s+word\s+belgesi|belge\d*|document\d*|adsız|untitled|makale\d*|deneme)$/i;

/**
 * Başlığı belgenin İÇİNDEN bulur.
 *
 * «Yeni Microsoft Word Belgesi.docx» diye kaydedilmiş bir miras hukuku
 * makalesini kütüphanede o adla listelemek, eseri yok saymaktır. Böyle
 * durumlarda ilk anlamlı paragraf (çoğunlukla başlık satırı) kullanılır.
 */
function belgedenBaslik(paragraflar, klasor) {
  for (const p of paragraflar.slice(0, 12)) {
    const s = p.trim();
    if (s.length < 12 || s.length > 130) continue;
    if (/^(giriş|içindekiler|özet|abstract|kaynakça|anahtar)/i.test(s)) continue;
    // Başlık satırı cümle noktalamasıyla bitmez
    if (/[.!?]$/.test(s)) continue;
    // Bölüm numarasıyla başlıyorsa («I. …», «1) …») numara başlığın parçası değil
    return baslikDuzelt(s.replace(/^(?:[IVXLC]{1,5}|\d{1,2})\s*[.)-]\s*/, ''));
  }
  return klasor ? baslikDuzelt(klasor) : '';
}

// ── Dosyaları topla ─────────────────────────────────────────────────────────
function dosyalar(dir, kategori = '') {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...dosyalar(p, e.name));
      continue;
    }
    const ext = extname(e.name).toLowerCase();
    if (ext === '.docx' || ext === '.pdf') out.push({ path: p, kategori, ad: e.name, ext });
  }
  return out;
}

const bulunan = dosyalar(srcDir);
console.log(`[kutuphane] ${bulunan.length} dosya bulundu`);

const eserler = [];
let atlanan = 0;

for (const f of bulunan) {
  const adSade = basename(f.ad, f.ext);
  let paragraflar = null;

  if (f.ext === '.docx') paragraflar = docxParagraphs(f.path);
  else paragraflar = pdfParagraphs(f.path);

  if (!paragraflar || paragraflar.length === 0) {
    console.warn(`  ! metin çıkarılamadı: ${f.ad}`);
    atlanan += 1;
    continue;
  }

  // Çok kısa parçalar (sayfa numarası, üstbilgi) elenir
  const govde = paragraflar.filter((p) => p.length > 25);
  const kelime = govde.join(' ').split(/\s+/).length;

  if (kelime < 150) {
    console.warn(`  ! çok kısa, atlandı: ${f.ad} (${kelime} kelime)`);
    atlanan += 1;
    continue;
  }

  let baslik = baslikDuzelt(adSade);
  if (!baslik || ANLAMSIZ_AD.test(adSade.trim())) {
    baslik = belgedenBaslik(govde, f.kategori) || baslikDuzelt(adSade);
  }

  eserler.push({
    slug: slugify(baslik),
    baslik,
    kategori: f.kategori ? baslikDuzelt(f.kategori) : 'Makaleler',
    ozet: govde.find((p) => p.length > 120)?.slice(0, 260) ?? govde[0].slice(0, 260),
    paragraflar: govde,
    kelime,
    kaynakBiçim: f.ext.replace('.', '').toUpperCase(),
    bayt: statSync(f.path).size,
  });
  console.log(`  ✓ ${baslik} — ${kelime.toLocaleString('tr-TR')} kelime`);
}

if (eserler.length === 0) {
  console.error('[kutuphane] hiçbir eser çıkarılamadı — bölüm boş kalır');
  process.exit(1);
}

eserler.sort((a, b) => b.kelime - a.kelime);

const gz = gzipSync(Buffer.from(JSON.stringify(eserler), 'utf8'), { level: 9 });
writeFileSync(join(outDir, 'eserler.json.gz'), gz);

const toplamKelime = eserler.reduce((n, e) => n + e.kelime, 0);
console.log(
  `[kutuphane] ${eserler.length} eser · ${toplamKelime.toLocaleString('tr-TR')} kelime · ` +
    `${(gz.length / 1024).toFixed(0)} KB${atlanan ? ` · ${atlanan} atlandı` : ''}`
);
