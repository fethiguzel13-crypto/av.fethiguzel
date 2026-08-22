#!/usr/bin/env node
/**
 * Kalıpla ezilen şerhleri git geçmişinden kurtarır.
 *
 *   node scripts/serh-kurtar.mjs --dene     # yalnız rapor, dosyaya dokunmaz
 *   node scripts/serh-kurtar.mjs --uygula   # kurtarmayı yaz
 *
 * ─── Ne oldu ────────────────────────────────────────────────────────────────
 *
 * 20 Temmuz 2026'daki toplu üretim işi (`122ffc253 — 7800+ madde icin uzun
 * akademik serhler`) 45 kanunun 7.586 maddesinde şerhi tek bir Çek Kanunu
 * metninin kopyasıyla değiştirdi. Türk Ceza Kanunu'nun takdiri indirim
 * maddesinin şerhi, çekin tedavül kabiliyetini anlatır hâle geldi.
 *
 * Bu işlemden ÖNCE elle yazılmış gerçek şerhler vardı ve hepsi git
 * geçmişinde duruyor. Hiçbir metin kaybolmadı; yalnız üzerine yazıldı.
 *
 * ─── Nasıl kurtarılıyor ─────────────────────────────────────────────────────
 *
 * Tarihî anlık görüntüler geçici bir dizine çıkarılır. Her madde için
 * bugünkü şerh ile geçmişteki sürümler kalite kapısından geçirilir
 * (lib/content-quality.mjs). Bugünkü kalıpsa ve geçmişte kapıyı geçen bir
 * sürüm varsa, o sürümün ŞERH BÖLÜMÜ bugünkü dosyaya geri konur.
 *
 * ─── Neyin geri konmadığı ───────────────────────────────────────────────────
 *
 * RESMÎ METİN GERİ ALINMAZ. Madde metinleri 17 Ağustos 2026'da
 * mevzuat.gov.tr kaynağından yeniden yazıldı ve doğrulandı; eski sürüme
 * dönmek o düzeltmeyi geri almak olurdu. Kurtarma yalnız şerh bölümünü
 * taşır, resmî metne ve frontmatter'daki künyeye dokunmaz.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

import { auditCommentary } from '../lib/content-quality.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const uygula = process.argv.includes('--uygula');
const snapKok = process.argv.includes('--snap')
  ? process.argv[process.argv.indexOf('--snap') + 1]
  : join(tmpdir(), 'snap');

/**
 * Anlık görüntüler — YENİDEN ESKİYE doğru sıralı.
 * İlk kapıyı geçen sürüm kazanır: ezilmeden önceki en güncel hâl.
 */
const SNAPSHOTLAR = [
  { ad: 'A', aciklama: '19.07.2026 — toplu üretimden hemen önce' },
  { ad: 'B', aciklama: '30.06.2026 — haziran sonu' },
  { ad: 'C', aciklama: '31.05.2026 — mayıs sonu, elle yazılan şerhler' },
];

const BASLIKLAR = ['### Akademik Yorum', '### Bizim Yorumumuz', '### Akademik Şerh'];

/** Dosyadan şerh bölümünü ayırır. */
function serhBolumu(icerik) {
  for (const b of BASLIKLAR) {
    const i = icerik.indexOf(b);
    if (i >= 0) return icerik.slice(i).trim();
  }
  return '';
}

/** Yer tutucu mu? («yakında eklenecektir») */
function yerTutucu(s) {
  return /yak[ıi]nda eklenecek|hen[üu]z yaz[ıi]lmad/i.test(s) && s.length < 400;
}

function kapidanGecer(kanunId, serh) {
  if (!serh || yerTutucu(serh)) return false;
  // Anlamlı uzunluk: 120 kelimenin altındaki bir metin şerh değildir
  if (serh.split(/\s+/).length < 120) return false;
  return !!auditCommentary(kanunId, serh).publishable;
}

// ── Anlık görüntülerin varlığı ──────────────────────────────────────────────
const mevcutSnap = SNAPSHOTLAR.filter((s) =>
  existsSync(join(snapKok, s.ad, 'content', 'mevzuat'))
);
if (!mevcutSnap.length) {
  console.error(`Anlık görüntü yok: ${snapKok}/<A|B|C>/content/mevzuat`);
  console.error('Önce çıkarın:  git archive <ref> content/mevzuat | tar -x -C <dizin>');
  process.exit(1);
}
console.log(`Anlık görüntü: ${mevcutSnap.map((s) => s.ad).join(', ')}\n`);

// ── Tarama ──────────────────────────────────────────────────────────────────
const mevzuat = join(root, 'content', 'mevzuat');
const kanunlar = readdirSync(mevzuat).filter((k) =>
  existsSync(join(mevzuat, k, 'madde-1.md')) || existsSync(join(mevzuat, k))
);

let toplam = 0;
let bugunTemiz = 0;
let kurtarilan = 0;
let kurtarilamayan = 0;
const kanunOzet = {};
const kaynakSayaci = {};

for (const kanunId of kanunlar) {
  const dizin = join(mevzuat, kanunId);
  let dosyalar;
  try {
    dosyalar = readdirSync(dizin).filter((f) => /^madde-\d+\.md$/.test(f));
  } catch {
    continue;
  }

  let k = 0;
  let t = 0;
  let y = 0;

  for (const dosya of dosyalar) {
    toplam += 1;
    const yol = join(dizin, dosya);
    const icerik = readFileSync(yol, 'utf8');
    const bugunSerh = serhBolumu(icerik);

    if (kapidanGecer(kanunId, bugunSerh)) {
      bugunTemiz += 1;
      t += 1;
      continue;
    }

    // Geçmişte kapıyı geçen en güncel sürümü ara
    let bulunan = null;
    for (const snap of mevcutSnap) {
      const eskiYol = join(snapKok, snap.ad, 'content', 'mevzuat', kanunId, dosya);
      if (!existsSync(eskiYol)) continue;
      let eski;
      try {
        eski = readFileSync(eskiYol, 'utf8');
      } catch {
        continue;
      }
      const eskiSerh = serhBolumu(eski);
      if (kapidanGecer(kanunId, eskiSerh)) {
        bulunan = { snap: snap.ad, serh: eskiSerh };
        break;
      }
    }

    if (!bulunan) {
      kurtarilamayan += 1;
      y += 1;
      continue;
    }

    kurtarilan += 1;
    k += 1;
    kaynakSayaci[bulunan.snap] = (kaynakSayaci[bulunan.snap] || 0) + 1;

    if (!uygula) continue;

    // ── Yaz: frontmatter ve resmî metin BUGÜNKÜ hâliyle kalır ───────────────
    const fm = /^---\n[\s\S]*?\n---\n/.exec(icerik);
    const bas = fm ? fm[0] : '';
    const govde = fm ? icerik.slice(fm[0].length) : icerik;

    let kesim = -1;
    for (const b of BASLIKLAR) {
      const i = govde.indexOf(b);
      if (i >= 0 && (kesim < 0 || i < kesim)) kesim = i;
    }
    const resmi = (kesim >= 0 ? govde.slice(0, kesim) : govde).replace(/\s+$/, '');

    writeFileSync(yol, `${bas}\n${resmi}\n\n${bulunan.serh}\n`, 'utf8');
  }

  if (k || y) kanunOzet[kanunId] = { kurtarilan: k, temiz: t, kurtarilamayan: y, toplam: dosyalar.length };
}

// ── Rapor ───────────────────────────────────────────────────────────────────
console.log('kanun                     kurtarılan  zaten temiz  kurtarılamayan  toplam');
for (const [k, v] of Object.entries(kanunOzet).sort(
  (a, b) => b[1].kurtarilan - a[1].kurtarilan
)) {
  console.log(
    `${k.padEnd(24)}${String(v.kurtarilan).padStart(11)}${String(v.temiz).padStart(13)}${String(v.kurtarilamayan).padStart(16)}${String(v.toplam).padStart(8)}`
  );
}

console.log('');
console.log(`toplam madde        : ${toplam}`);
console.log(`bugün zaten temiz   : ${bugunTemiz}`);
console.log(`KURTARILAN          : ${kurtarilan}`);
console.log(`kurtarılamayan      : ${kurtarilamayan}`);
console.log('');
for (const s of mevcutSnap) {
  const n = kaynakSayaci[s.ad] || 0;
  if (n) console.log(`  ${s.ad} (${s.aciklama}): ${n} madde`);
}
console.log('');
console.log(uygula ? 'DOSYALAR YAZILDI.' : 'Deneme koşusu — hiçbir dosyaya dokunulmadı. Yazmak için: --uygula');
