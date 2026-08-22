#!/usr/bin/env node
/**
 * Şerhlerdeki ÜRETİM ARTIKLARINI temizler.
 *
 *   node scripts/serh-temizle.mjs --dene              # rapor, dosyaya dokunmaz
 *   node scripts/serh-temizle.mjs --dene --ornek gvk/1
 *   node scripts/serh-temizle.mjs --uygula
 *
 * ─── Neyi temizler ──────────────────────────────────────────────────────────
 *
 * Kurtarılan şerhler gerçek akademik metin; ne var ki üretildikleri ortamdan
 * metne bulaşmış artıklar taşıyorlar. Bunlar hukuk metninin parçası değil ve
 * yayımlanmış bir şerhte durduklarında yazarın güvenilirliğine doğrudan
 * zarar verir:
 *
 *   1. HAM OTURUM KİMLİĞİ  «Conversation: 14fd14ca-… (turn 1)»
 *   2. ÜRETİM İMZASI       «…incelemeye geçmeye hazırsınız.» — genellikle
 *                          metnin sonuna eklenmiş komple bir blok
 *   3. BOŞTA DİPNOT        «…gerekmektedir [1].» ama hiçbir yerde «[1]:» yok
 *   4. EMOJİ / SÜS         🏛️ ✅ ➡️
 *   5. ÜRETİM METASI       «kaynak grounding standartlarına tam uyum…»
 *   6. İŞARETSİZ OLAY      «**Olay 1:**» → «**Olay 1 (kurmaca senaryo):**»
 *
 * ─── Neye DOKUNMAZ ──────────────────────────────────────────────────────────
 *
 * Cümlelerin kendisine, doktrin tartışmasına, Yargıtay künyelerine, madde
 * göndermelerine ve Metodolojik Not bölümüne dokunulmaz. Parantez içi
 * Latince terimler de KALIR: yazım kılavuzu bunları yazarın kendi makale ve
 * kitapları için yasaklar, ama beş bin şerhi düzenli ifadeyle yeniden
 * yazmak, kurtardığımız metni bozma riski taşır. O düzeltme madde madde
 * elden geçirilirken yapılır.
 *
 * ─── Neden düzenli ifadeyle cümle avlanmıyor ────────────────────────────────
 *
 * İlk sürüm `[^.!?\n]*ANAHTAR[^.!?\n]*[.!?]` biçiminde desenler kullanıyordu.
 * Bu, 20 KB'lık bir metinde her başlangıç konumu için cümle sonuna kadar
 * tarayıp geri döndüğü için karesel çalışıyor ve tarama on altı dakikaya
 * çıkıyordu. Şimdi önce ANAHTAR düz metin aramasıyla bulunuyor, sonra
 * cümle sınırları koddan genişletiliyor: aynı sonuç, doğrusal maliyet.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const uygula = process.argv.includes('--uygula');
const ornekArg = process.argv.includes('--ornek')
  ? process.argv[process.argv.indexOf('--ornek') + 1]
  : null;

const BASLIK = '### Akademik Yorum';

// ── Anahtarlar ──────────────────────────────────────────────────────────────

/** Üretim imzası — okura seslenen ya da işin bittiğini duyuran ifadeler. */
const IMZA_ANAHTARLARI = [
  'geçmeye hazırsınız',
  'incelemeye geçmeye',
  'incelemeye geçebilirsiniz',
  'ister misiniz',
  'geçelim mi',
  'hazırlamamı ister',
  'bir sonraki madde şerhine',
  'şerh çalışmasıyla',
  'analizi başarıyla tamamlanmıştır',
  'sırada yer alan',
];

/** Üretim sürecini anlatan meta cümleler. */
const META_ANAHTARLARI = [
  'grounding',
  'halüsinasyon üretilmemi',
  'tam uyum sağlanmıştır',
  'köşeli parantez içi referans numarası kullanılmamış',
];

const RE_OTURUM = /^[ \t]*(?:Conversation|conversation_id)\s*[:=]\s*[0-9a-fA-F-]{8,}.*$/gm;
const RE_UUID =
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b(?:\s*\(turn \d+\))?/gi;
const RE_EMOJI =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{2190}-\u{21FF}]/gu;
const RE_OLAY = /\*\*Olay\s+(\d+)\s*:\*\*/g;
const RE_DIPNOT_ISARET = /\s?\[\d{1,2}\](?!:)/g;
const RE_DIPNOT_TANIM = /^\[\d{1,2}\]:/m;

/**
 * Anahtar kelimeyi içeren CÜMLELERİ siler.
 *
 * Anahtar düz metin aramasıyla bulunur; cümle sınırları oradan geriye ve
 * ileriye yürünerek belirlenir. Satır sonu da sınır sayılır, yoksa madde
 * imi listelerinde bir öge komşusunu yutuyordu.
 */
/**
 * Verilen konumdaki nokta gerçekten cümle sonu mu?
 *
 * Hukuk metni kısaltma ve numara dolu: «AATUHK m. 1)», «TBK m. 49», «s. 12»,
 * «2004 sayılı». Bunların noktasını cümle sonu saymak, silme sınırını
 * cümlenin ortasına taşıyıp geriye «istisnaları (AATUHK m.» gibi kırık bir
 * parça bırakıyordu. Nokta ancak ARDINDAN boşluk gelir ve ÖNÜNDE kısaltma
 * ya da rakam yoksa cümleyi bitirir.
 */
const KISALTMALAR = new Set([
  'm', 'md', 'mad', 's', 'vd', 'vb', 'bkz', 'no', 'c', 'e', 'k', 't', 'f',
  'ss', 'age', 'agm', 'bs', 'çev', 'ed', 'sy', 'fık', 'bent', 'par',
]);

function cumleSonuMu(s, i) {
  if (!'.!?'.includes(s[i])) return false;
  if (s[i] !== '.') return true;

  // Ardından boşluk ya da metin sonu gelmiyorsa cümle bitmemiştir
  const sonraki = s[i + 1];
  if (sonraki !== undefined && !/\s/.test(sonraki)) return false;

  // Öncesindeki sözcük kısaltma ya da rakamsa nokta cümleyi bitirmez
  let j = i - 1;
  let kelime = '';
  while (j >= 0 && /[\p{L}\p{N}]/u.test(s[j]) && kelime.length < 6) {
    kelime = s[j] + kelime;
    j -= 1;
  }
  if (!kelime) return true;
  if (/^\d+$/.test(kelime)) return false;
  return !KISALTMALAR.has(kelime.toLocaleLowerCase('tr-TR'));
}

function cumleleriSil(metin, anahtarlar) {
  let s = metin;
  let silinen = 0;

  for (const anahtar of anahtarlar) {
    const kucukAnahtar = anahtar.toLocaleLowerCase('tr-TR');
    let guvenlik = 0;
    for (;;) {
      const i = s.toLocaleLowerCase('tr-TR').indexOf(kucukAnahtar);
      if (i < 0) break;
      if (++guvenlik > 40) break;

      let bas = i;
      while (bas > 0 && s[bas - 1] !== '\n' && !cumleSonuMu(s, bas - 1)) bas -= 1;

      let son = i + anahtar.length;
      while (son < s.length && s[son] !== '\n' && !cumleSonuMu(s, son)) son += 1;
      if (son < s.length && '.!?'.includes(s[son])) son += 1;

      s = s.slice(0, bas) + s.slice(son);
      silinen += 1;
    }
  }

  return { metin: s, silinen };
}

/** Metnin sonundaki üretim imzası bloğunu bütünüyle atar. */
function imzaBloguSil(metin) {
  let s = metin;
  let silinen = 0;

  for (let tur = 0; tur < 3; tur += 1) {
    // Dosyaların bir kısmı CRLF; `\r` hesaba katılmazsa ayraç hiç eşleşmiyor
    // ve blok silme sessizce çalışmıyordu.
    const bloklar = s.trimEnd().split(/\r?\n[ \t]*---[ \t]*\r?\n/);
    if (bloklar.length < 2) break;
    const son = bloklar[bloklar.length - 1];
    const kucuk = son.toLocaleLowerCase('tr-TR');
    const imzali = IMZA_ANAHTARLARI.some((a) => kucuk.includes(a.toLocaleLowerCase('tr-TR')));
    // Kısa VE imzalı blok üretim kapanışıdır; uzun bir bölümü tek eşleşme
    // yüzünden atmayız.
    if (imzali && son.split(/\s+/).length <= 130) {
      bloklar.pop();
      s = bloklar.join('\n\n---\n\n');
      silinen += 1;
    } else break;
  }

  return { metin: s, silinen };
}

// ── Ucuz ön kontrol ─────────────────────────────────────────────────────────
// Şerhlerin çoğunda aranan artıkların hiçbiri yok; düz metin araması bu
// dosyaları anında eler ve pahalı işlemler hiç çalışmaz.
const IPUCLARI = [
  'Conversation',
  'conversation_id',
  ...IMZA_ANAHTARLARI,
  ...META_ANAHTARLARI,
  '**Olay ',
];

function ipucuVar(s) {
  if (RE_EMOJI.test(s)) {
    RE_EMOJI.lastIndex = 0;
    return true;
  }
  RE_EMOJI.lastIndex = 0;
  if (/\[\d{1,2}\](?!:)/.test(s)) return true;
  const kucuk = s.toLocaleLowerCase('tr-TR');
  for (const ip of IPUCLARI) if (kucuk.includes(ip.toLocaleLowerCase('tr-TR'))) return true;
  return false;
}

const BOS_RAPOR = () => ({ oturum: 0, imza: 0, meta: 0, emoji: 0, dipnot: 0, olay: 0 });

// ── Temizlik ────────────────────────────────────────────────────────────────

export function temizle(serh) {
  if (!ipucuVar(serh)) return { metin: serh, rapor: BOS_RAPOR(), degisti: false };

  const rapor = BOS_RAPOR();
  let s = serh;

  // 1. Oturum kimliği
  rapor.oturum += (s.match(RE_OTURUM) || []).length;
  s = s.replace(RE_OTURUM, '');
  rapor.oturum += (s.match(RE_UUID) || []).length;
  s = s.replace(RE_UUID, '');

  // 2. Üretim imzası — önce blok, kalırsa cümle
  const blok = imzaBloguSil(s);
  s = blok.metin;
  rapor.imza += blok.silinen;
  const imzaCumle = cumleleriSil(s, IMZA_ANAHTARLARI);
  s = imzaCumle.metin;
  rapor.imza += imzaCumle.silinen;

  // 3. Üretim metası
  const meta = cumleleriSil(s, META_ANAHTARLARI);
  s = meta.metin;
  rapor.meta = meta.silinen;

  // 4. Emoji ve süs
  rapor.emoji = (s.match(RE_EMOJI) || []).length;
  s = s.replace(RE_EMOJI, '');

  // 5. Boşta kalan dipnot işaretleri — tanım varsa DOKUNULMAZ
  if (!RE_DIPNOT_TANIM.test(s)) {
    rapor.dipnot = (s.match(RE_DIPNOT_ISARET) || []).length;
    s = s.replace(RE_DIPNOT_ISARET, '');
  }

  // 6. Olay başlıklarına kurmaca işareti
  rapor.olay = (s.match(RE_OLAY) || []).length;
  s = s.replace(RE_OLAY, '**Olay $1 (kurmaca senaryo):**');

  // 7. Toparlama
  s = s
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]+$/gm, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\n---[ \t]*\n[ \t]*\n?---[ \t]*\n/g, '\n---\n')
    .replace(/\n+---[ \t]*$/, '')
    .trim();

  const degisti = Object.values(rapor).some((v) => v > 0);
  return { metin: s + '\n', rapor, degisti };
}

// ── Yürütme ─────────────────────────────────────────────────────────────────

const mevzuat = join(root, 'content', 'mevzuat');
const toplamRapor = BOS_RAPOR();
let dokunulan = 0;
let bakilan = 0;
const kanunRapor = {};

const hedefKanunlar = ornekArg
  ? [ornekArg.split('/')[0]]
  : readdirSync(mevzuat).filter((k) => statSync(join(mevzuat, k)).isDirectory());

const t0 = Date.now();

for (const kanunId of hedefKanunlar) {
  const dizin = join(mevzuat, kanunId);
  if (!existsSync(dizin)) continue;
  let dosyalar = readdirSync(dizin).filter((f) => /^madde-\d+\.md$/.test(f));
  if (ornekArg) dosyalar = dosyalar.filter((f) => f === `madde-${ornekArg.split('/')[1]}.md`);

  let k = 0;
  for (const dosya of dosyalar) {
    const yol = join(dizin, dosya);
    const icerik = readFileSync(yol, 'utf8');
    const i = icerik.indexOf(BASLIK);
    if (i < 0) continue;
    bakilan += 1;
    if (!ornekArg && bakilan % 500 === 0) {
      process.stderr.write(`\r[temizle] ${bakilan}…   `);
    }

    const bas = icerik.slice(0, i);
    const { metin, rapor, degisti } = temizle(icerik.slice(i));
    if (!degisti) continue;

    dokunulan += 1;
    k += 1;
    for (const alan of Object.keys(toplamRapor)) toplamRapor[alan] += rapor[alan];

    if (ornekArg) {
      console.log(`── ${kanunId}/${dosya} — ${JSON.stringify(rapor)}`);
      console.log('\n--- TEMİZLİK SONRASI SON 600 KARAKTER ---');
      console.log(metin.slice(-600));
      continue;
    }

    if (uygula) writeFileSync(yol, bas + metin, 'utf8');
  }
  if (k) kanunRapor[kanunId] = k;
}

process.stderr.write('\r');
if (ornekArg) process.exit(0);

console.log('kanun                    temizlenen şerh');
for (const [k, v] of Object.entries(kanunRapor).sort((a, b) => b[1] - a[1]).slice(0, 18)) {
  console.log(`  ${k.padEnd(24)}${String(v).padStart(6)}`);
}
console.log('');
console.log(`incelenen şerh   : ${bakilan}`);
console.log(`temizlenen şerh  : ${dokunulan}`);
console.log(`süre             : ${((Date.now() - t0) / 1000).toFixed(0)} sn`);
console.log('');
console.log(`  ham oturum kimliği : ${toplamRapor.oturum}`);
console.log(`  üretim imzası      : ${toplamRapor.imza}`);
console.log(`  üretim metası      : ${toplamRapor.meta}`);
console.log(`  emoji / süs        : ${toplamRapor.emoji}`);
console.log(`  boşta dipnot       : ${toplamRapor.dipnot}`);
console.log(`  kurmaca işareti    : ${toplamRapor.olay}`);
console.log('');
console.log(uygula ? 'DOSYALAR YAZILDI.' : 'Deneme koşusu — hiçbir dosyaya dokunulmadı. Yazmak için: --uygula');
