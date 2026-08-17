#!/usr/bin/env node
/**
 * İçtihat Günü uygulaması için gömülü veri.
 *
 * İki dosya üretir:
 *   app-src/public/icthat/seed.json       — son günlük özet (uygulamayla gelir)
 *   app-src/public/icthat/archive.json.gz — karar arşivi indeksi (3.800+ künye)
 *
 * Neden gömülü: uygulama ilk açılışta ağ beklemeden dolu görünsün. Play
 * incelemecisi uçak modunda açtığında boş ekran görürse "asgari işlevsellik"
 * değerlendirmesi olumsuz sonuçlanıyor. Uygulama açılınca canlı veriyi çeker
 * ve gömülü tohumun üzerine yazar.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const mobile = join(here, '..');
const portal = join(mobile, '..');

// data-src: derlemeye girmeyen ham varlık deposu. build-app.mjs buradan
// yalnız ilgili uygulamanın ihtiyacı olanı app-src/public'e kopyalar; aksi
// hâlde Vite hepsini dört uygulamaya birden koyuyordu (hesap uygulaması
// 2,9 MB mevzuat paketi taşıyordu).
const outDir = join(mobile, 'data-src', 'icthat');
mkdirSync(outDir, { recursive: true });

// ─── Günlük özet tohumu ─────────────────────────────────────────────────────
const dailyPath = join(portal, 'public', 'data', 'daily.json');
if (existsSync(dailyPath)) {
  const daily = JSON.parse(readFileSync(dailyPath, 'utf8'));

  // Uygulamada kullanılmayan alanları at — paket küçülsün
  const slim = {
    generatedAt: daily.generatedAt,
    dateLabel: daily.dateLabel,
    items: daily.items,
    highlights: daily.highlights ?? [],
    stats: daily.stats,
  };
  writeFileSync(join(outDir, 'seed.json'), JSON.stringify(slim));
  console.log(
    `[icthat] tohum: ${daily.stats?.totalItems ?? 0} kayıt (${daily.dateLabel})`
  );
} else {
  writeFileSync(
    join(outDir, 'seed.json'),
    JSON.stringify({
      generatedAt: '',
      dateLabel: '',
      items: { resmigazete: [], yargitay: [], aym: [], hudoc: [], mevzuat: [] },
      highlights: [],
      stats: { totalItems: 0, perSource: {} },
    })
  );
  console.warn('[icthat] public/data/daily.json yok — boş tohum yazıldı');
}

// ─── Karar arşivi ───────────────────────────────────────────────────────────
const idxPath = join(portal, 'data', 'yargi-kararlari', 'index.jsonl');
if (existsSync(idxPath)) {
  const lines = readFileSync(idxPath, 'utf8').split('\n').filter(Boolean);
  const rows = [];
  const seen = new Set();

  for (const line of lines) {
    let r;
    try {
      r = JSON.parse(line);
    } catch {
      continue;
    }
    if (!r?.id || seen.has(r.id)) continue;
    seen.add(r.id);
    rows.push({
      i: r.id,
      k: r.kunye || '',
      a: r.alan || '',
      t: r.tarih || '',
      d: r.daire || '',
      w: Array.isArray(r.keywords) ? r.keywords.slice(0, 6) : [],
      s: r.slug || '',
    });
  }

  // Yeniden eskiye — kullanıcı önce yeni kararı görsün
  rows.sort((a, b) => toIso(b.t).localeCompare(toIso(a.t)));

  const gz = gzipSync(Buffer.from(JSON.stringify(rows), 'utf8'), { level: 9 });
  writeFileSync(join(outDir, 'archive.json.gz'), gz);
  console.log(`[icthat] arşiv: ${rows.length} karar · ${(gz.length / 1024).toFixed(0)} KB`);
} else {
  writeFileSync(join(outDir, 'archive.json.gz'), gzipSync(Buffer.from('[]', 'utf8')));
  console.warn('[icthat] yargi-kararlari/index.jsonl yok — boş arşiv yazıldı');
}

/** «08.06.2026» → «2026-06-08» (sıralanabilir) */
function toIso(tr) {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(tr || ''));
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '0000-00-00';
}
