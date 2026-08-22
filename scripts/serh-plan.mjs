#!/usr/bin/env node
/**
 * Şerh kampanyası öncelik listesi.
 *
 *   node scripts/serh-plan.mjs            # tabloyu bas
 *   node scripts/serh-plan.mjs --yaz      # docs/SERH-KAMPANYASI.md dosyasını üret
 *
 * Öncelik neye göre?
 *
 * 8.088 maddenin hepsine şerh yazmak yıllar sürer; sıra bir yerden
 * başlamalı. En iyi ölçü elimizde zaten var: hangi maddenin Yargıtay'da
 * FİİLEN işlendiği. Atıf indeksi (mobile/data-src/mevzuat/atif.json.gz)
 * 23 binden fazla karar metninden çıkarıldı; bir maddeye ne kadar çok
 * karar atıf yapıyorsa o madde uygulamada o kadar sık dava konusu olmuş
 * demektir ve şerhi o kadar çok kişiye dokunur.
 *
 * Ham sıklık tek başına yetmez: TCK'nın takdiri indirim maddesi neredeyse
 * her ceza hükmünde anılır ama şerh açısından zengin değildir. Bu yüzden
 * çıktı bir SIRALAMA ÖNERİSİ olarak sunulur, otomatik bir emir değil;
 * seçimi yapan insandır.
 */
import { readFileSync, existsSync, writeFileSync, readdirSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { auditCommentary } from '../lib/content-quality.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const yaz = process.argv.includes('--yaz');

/** Kampanyanın kapsadığı kanunlar — kullanıcının seçtiği «omurga». */
const OMURGA = [
  ['tbk', 'Türk Borçlar Kanunu'],
  ['tmk', 'Türk Medeni Kanunu'],
  ['ttk', 'Türk Ticaret Kanunu'],
  ['is-kanunu', 'İş Kanunu'],
  ['hmk', 'Hukuk Muhakemeleri Kanunu'],
  ['iik', 'İcra ve İflas Kanunu'],
  ['tck', 'Türk Ceza Kanunu'],
  ['cmk', 'Ceza Muhakemesi Kanunu'],
];

const atifYolu = join(root, 'mobile', 'data-src', 'mevzuat', 'atif.json.gz');
if (!existsSync(atifYolu)) {
  console.error('Atıf indeksi yok — önce: node mobile/scripts/build-yargi-index.mjs');
  process.exit(1);
}
const atif = JSON.parse(gunzipSync(readFileSync(atifYolu)).toString());

/** Maddenin mevcut şerhi kalite kapısından geçiyor mu? */
function serhDurumu(kanunId, maddeNo) {
  const p = join(root, 'content', 'mevzuat', kanunId, `madde-${maddeNo}.md`);
  if (!existsSync(p)) return { var: false, gecer: false, baslik: '' };
  const s = readFileSync(p, 'utf8');
  const bas = s.indexOf('### Akademik Yorum');
  const baslikEsle = /^\*\*([\s\S]*?)\*\*/m.exec(s.split('---').slice(2).join('---').trim());
  const baslik = baslikEsle ? baslikEsle[1].replace(/\s*\n\s*/g, ' · ').trim() : '';
  if (bas < 0) return { var: false, gecer: false, baslik };
  const rapor = auditCommentary(kanunId, s.slice(bas));
  return { var: true, gecer: !!rapor.publishable, baslik };
}

const satirlar = [];
for (const [id, ad] of OMURGA) {
  const maddeler = [];
  for (const [anahtar, kayit] of Object.entries(atif)) {
    const [kanun, no] = anahtar.split('/');
    if (kanun !== id) continue;
    maddeler.push({ no: Number(no), atif: kayit.n });
  }
  maddeler.sort((a, b) => b.atif - a.atif);

  const dizin = join(root, 'content', 'mevzuat', id);
  const toplamMadde = existsSync(dizin)
    ? readdirSync(dizin).filter((f) => /^madde-\d+\.md$/.test(f)).length
    : 0;

  let yayinlanabilir = 0;
  const ilk = [];
  for (const m of maddeler.slice(0, 25)) {
    const d = serhDurumu(id, m.no);
    if (d.gecer) yayinlanabilir += 1;
    ilk.push({ ...m, ...d });
  }

  satirlar.push({ id, ad, toplamMadde, atifliMadde: maddeler.length, ilk, yayinlanabilir });
}

// ── Ekran çıktısı ───────────────────────────────────────────────────────────
console.log('\n══ ŞERH KAMPANYASI — ÖNCELİK ══\n');
for (const k of satirlar) {
  console.log(
    `${k.ad} (${k.id}) — ${k.toplamMadde} madde · ${k.atifliMadde} maddede içtihat atfı`
  );
  for (const m of k.ilk.slice(0, 10)) {
    const isaret = m.gecer ? '✓' : m.var ? '·' : ' ';
    console.log(
      `   ${isaret} m.${String(m.no).padEnd(5)} ${String(m.atif).padStart(4)} karar   ${m.baslik.slice(0, 58)}`
    );
  }
  console.log('');
}
console.log('✓ = şerh kalite kapısından geçiyor · · = kalıp metin, yeniden yazılacak\n');

// ── Dosya çıktısı ───────────────────────────────────────────────────────────
if (!yaz) {
  console.log('Dosyaya yazmak için: node scripts/serh-plan.mjs --yaz');
  process.exit(0);
}

const bugun = new Date().toISOString().slice(0, 10);
const md = [];
md.push('# Şerh kampanyası');
md.push('');
md.push(`_Üretim: \`node scripts/serh-plan.mjs --yaz\` · son güncelleme ${bugun}_`);
md.push('');
md.push('## Öncelik nasıl belirlendi');
md.push('');
md.push(
  'Sıra, maddeye **atıf yapan Yargıtay kararı sayısından** çıkarıldı. Atıf indeksi ' +
    '23 binden fazla karar metninin taranmasıyla üretilir ' +
    '(`mobile/scripts/build-yargi-index.mjs`); bir madde ne kadar çok kararda anılıyorsa ' +
    'uygulamada o kadar sık dava konusu olmuştur.'
);
md.push('');
md.push(
  'Ham sıklık tek ölçüt değildir. Ceza yargılamasının teknik maddeleri ' +
    '(takdiri indirim, hak yoksunlukları, gün adlî para cezası) neredeyse her hükümde ' +
    'anıldığı için listenin başına çıkar; şerh değeri ise sınırlıdır. Liste bu yüzden ' +
    'bir **öneri** olarak okunur, otomatik sıra olarak değil.'
);
md.push('');
md.push('## Durum');
md.push('');
md.push('| Kanun | Madde | İçtihat atfı olan madde | Kalite kapısından geçen şerh |');
md.push('|---|---:|---:|---:|');
for (const k of satirlar) {
  md.push(`| ${k.ad} | ${k.toplamMadde} | ${k.atifliMadde} | ${k.yayinlanabilir} / ilk 25 |`);
}
md.push('');
md.push('## Sıra');
md.push('');
md.push('`✓` kalite kapısından geçen şerh · `·` kalıp metin, yeniden yazılacak · boş = şerh yok');
md.push('');
for (const k of satirlar) {
  md.push(`### ${k.ad}`);
  md.push('');
  md.push('| | Madde | Atıf | Kenar başlığı |');
  md.push('|---|---|---:|---|');
  for (const m of k.ilk.slice(0, 15)) {
    const isaret = m.gecer ? '✓' : m.var ? '·' : '';
    md.push(`| ${isaret} | m.${m.no} | ${m.atif} | ${m.baslik.replace(/\|/g, '/').slice(0, 70)} |`);
  }
  md.push('');
}
md.push('## Yazım yolu');
md.push('');
md.push('```bash');
md.push('# 1. Maddenin kaynak dosyasını çıkar (resmî metin + atıf yapan kararlar)');
md.push('node scripts/serh-kaynak.mjs tbk 49 --adet=8');
md.push('');
md.push('# 2. Şerhi yaz (kanun-maddesi-yorumla skill kuralları)');
md.push('# 3. Kalite kapısını doğrula');
md.push('node scripts/serh-dogrula.mjs tbk 49');
md.push('```');
md.push('');
md.push(
  'Künyeler **yerel korpustan birebir** alınır; canlı scraper kullanılmaz ' +
    '(zaman aşımına uğruyor ve her koşuda başka sonuç veriyor). Doktrin atıfları yalnız ' +
    '`kanun-maddesi-yorumla` skill\'inin `doctrine-*.md` listelerindeki yazarlardan yapılır; ' +
    'sayfa numarası ve baskı yılı verilmez.'
);
md.push('');

const cikti = join(root, 'docs', 'SERH-KAMPANYASI.md');
writeFileSync(cikti, md.join('\n'));
console.log(`Yazıldı: docs/SERH-KAMPANYASI.md`);
