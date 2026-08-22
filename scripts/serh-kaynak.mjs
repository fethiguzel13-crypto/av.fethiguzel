#!/usr/bin/env node
/**
 * Şerh kaynak dosyası — bir madde için elde ne varsa tek ekranda.
 *
 *   node scripts/serh-kaynak.mjs tmk 2
 *   node scripts/serh-kaynak.mjs tbk 49 --tam        (karar metinlerini uzun ver)
 *
 * Neden var: akademik şerh yazarken en büyük risk uydurma künyedir. Canlı
 * Yargıtay scraper'ı zaman aşımına uğruyor ve her koşuda başka sonuç
 * veriyor. Oysa depoda 23 binden fazla kararın TAM METNİ ve hangi kararın
 * hangi maddeye atıf yaptığını gösteren ters indeks zaten duruyor
 * (mobile/scripts/build-yargi-index.mjs üretiyor).
 *
 * Bu betik o iki kaynağı birleştirir: bir madde numarası verilir, o maddeye
 * ATIF YAPAN kararların künyesi ve maddenin geçtiği paragraflar dökülür.
 * Künye korpustan birebir kopyalanır; şerhi yazan taraf hiçbir künyeyi
 * kendi üretmez.
 *
 * Çıktı, doğrudan şerh yazımına girdi olacak biçimde markdown'dur.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const kanunId = (process.argv[2] || '').toLowerCase();
const maddeNo = Number(process.argv[3]);
const tamMetin = process.argv.includes('--tam');
const enCok = Number((process.argv.find((a) => a.startsWith('--adet=')) || '').split('=')[1]) || 10;

if (!kanunId || !Number.isFinite(maddeNo)) {
  console.error('Kullanım: node scripts/serh-kaynak.mjs <kanunId> <maddeNo> [--tam] [--adet=N]');
  process.exit(1);
}

// ── 1. Maddenin resmî metni ve mevcut şerh durumu ───────────────────────────
const maddeYolu = join(root, 'content', 'mevzuat', kanunId, `madde-${maddeNo}.md`);
if (!existsSync(maddeYolu)) {
  console.error(`Madde dosyası yok: ${maddeYolu}`);
  process.exit(1);
}
// Dosyaların bir kısmı CRLF; satır sonu normalize edilmezse frontmatter
// ayrıştırması sessizce başarısız oluyor ve künye alanları boş geliyor.
const ham = readFileSync(maddeYolu, 'utf8').replace(/\r?\n/g, '\n');
const fmEsle = /^---\n([\s\S]*?)\n---\n/.exec(ham);
const frontmatter = fmEsle ? fmEsle[1] : '';
const govde = fmEsle ? ham.slice(fmEsle[0].length) : ham;

const kanunAdi = (/^kanun:\s*"?(.+?)"?\s*$/m.exec(frontmatter) || [])[1] || kanunId.toUpperCase();
const durum = (/^commentaryStatus:\s*"?(.+?)"?\s*$/m.exec(frontmatter) || [])[1] || 'yok';
const sonInceleme = (/^lastReviewed:\s*"?(.+?)"?\s*$/m.exec(frontmatter) || [])[1] || '—';

// Resmî metin: ilk `---` ayracına kadar olan blok
const resmiEsle = /^\*\*([\s\S]*?)\*\*\s*\n+---\n([\s\S]*?)(?:\n---|\n###|$)/.exec(govde.trim());
const kenarBaslik = resmiEsle ? resmiEsle[1].replace(/\s*\n\s*/g, ' · ').trim() : '';
const resmiMetin = resmiEsle ? resmiEsle[2].trim() : govde.split('###')[0].trim();

console.log(`# Şerh kaynağı — ${kanunAdi} m. ${maddeNo}`);
console.log('');
console.log(`- Dosya: \`content/mevzuat/${kanunId}/madde-${maddeNo}.md\``);
console.log(`- Mevcut şerh durumu: **${durum}** (son inceleme: ${sonInceleme})`);
if (kenarBaslik) console.log(`- Kenar başlığı: **${kenarBaslik}**`);
console.log('');
console.log('## Resmî metin');
console.log('');
console.log('```');
console.log(resmiMetin);
console.log('```');
console.log('');

// ── 2. Bu maddeye atıf yapan kararlar ───────────────────────────────────────
const atifYolu = join(root, 'mobile', 'data-src', 'mevzuat', 'atif.json.gz');
if (!existsSync(atifYolu)) {
  console.log('## Yargıtay kararları');
  console.log('');
  console.log('> Atıf indeksi yok. Önce `node mobile/scripts/build-yargi-index.mjs` çalıştırın.');
  process.exit(0);
}

const atif = JSON.parse(gunzipSync(readFileSync(atifYolu)).toString());
const kayit = atif[`${kanunId}/${maddeNo}`];

if (!kayit || !kayit.ids.length) {
  console.log('## Yargıtay kararları');
  console.log('');
  console.log(
    '> Yerel arşivde bu maddeye YAPISAL ATIF yapan karar bulunamadı. ' +
      'Şerhin içtihat bölümü, kullanıcı bir karar paylaşmadıkça boş bırakılır — ' +
      'künye uydurulmaz.'
  );
  process.exit(0);
}

// Künye ve dosya yolları index.jsonl'den
const indexYolu = join(root, 'data', 'yargi-kararlari', 'index.jsonl');
const meta = new Map();
for (const satir of readFileSync(indexYolu, 'utf8').split('\n')) {
  if (!satir.trim()) continue;
  try {
    const r = JSON.parse(satir);
    meta.set(String(r.id), r);
  } catch {
    /* bozuk satır atlanır */
  }
}

const ENT = {
  '&ldquo;': '“', '&rdquo;': '”', '&rsquo;': '’', '&lsquo;': '‘', '&hellip;': '…',
  '&acirc;': 'â', '&nbsp;': ' ', '&amp;': '&', '&quot;': '"', '&#39;': "'",
  '&ccedil;': 'ç', '&uuml;': 'ü', '&ouml;': 'ö', '&Ccedil;': 'Ç',
};
const coz = (s) => String(s || '').replace(/&[a-zA-Z]+;|&#\d+;/g, (m) => ENT[m] ?? ' ');

const KADEME = {
  yibk: 'İçtihadı Birleştirme',
  hgk: 'Hukuk Genel Kurulu',
  cgk: 'Ceza Genel Kurulu',
  hdbk: 'Hukuk Daireleri Başkanlar Kurulu',
};

console.log(`## Bu maddeye atıf yapan kararlar (${kayit.n} karar, ilk ${Math.min(enCok, kayit.ids.length)} tanesi)`);
console.log('');
console.log(
  '> Künyeler yerel korpustan BİREBİR alınmıştır ' +
    '(`data/yargi-kararlari/`, kaynak: karararama.yargitay.gov.tr). ' +
    'Şerhte kullanılırken değiştirilmez.'
);
console.log('');

let yazilan = 0;
for (const id of kayit.ids) {
  if (yazilan >= enCok) break;
  const r = meta.get(String(id));
  if (!r) continue;
  const dosya = join(root, 'data', 'yargi-kararlari', r.file);
  if (!existsSync(dosya)) continue;

  let d;
  try {
    d = JSON.parse(readFileSync(dosya, 'utf8'));
  } catch {
    continue;
  }

  const metin = coz(d.text || '').replace(/\r/g, '');
  const kademe = KADEME[r.tierId || r.alan] || r.daire || '';

  console.log(`### ${yazilan + 1}. ${d.kunye}`);
  console.log('');
  if (kademe) console.log(`- Kademe: ${kademe}`);
  console.log(`- Kaynak: ${d.documentUrl || 'karararama.yargitay.gov.tr'}`);
  console.log('');

  // Maddenin geçtiği paragraflar — şerhte hangi görüş için kullanılacağı
  // buradan görülür.
  const desenler = [
    new RegExp(`${maddeNo}\\s*(?:\\/\\s*\\d+\\s*)?(?:nc[ıi]|üncü|inci|uncu|ncı)?\\.?\\s*maddes[ıi]`, 'i'),
    new RegExp(`\\bm\\.\\s*${maddeNo}\\b`, 'i'),
    new RegExp(`Madde\\s+${maddeNo}\\b`, 'i'),
  ];

  const paragraflar = metin
    .split(/\n+/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter((p) => p.length > 60);

  const ilgili = paragraflar.filter((p) => desenler.some((re) => re.test(p)));
  const gosterilecek = (ilgili.length ? ilgili : paragraflar.slice(0, 2)).slice(0, tamMetin ? 6 : 2);

  if (ilgili.length === 0) {
    console.log('_Madde numarası paragraf içinde geçmiyor; kararın açılış paragrafları:_');
    console.log('');
  }
  for (const p of gosterilecek) {
    console.log('> ' + (tamMetin ? p : p.slice(0, 700) + (p.length > 700 ? '…' : '')));
    console.log('>');
  }
  console.log('');
  yazilan += 1;
}

console.log('---');
console.log('');
console.log(
  `Toplam ${kayit.n} karar bu maddeye atıf yapıyor. ` +
    'Daha fazlası için `--adet=N`, paragrafların tamamı için `--tam`.'
);
