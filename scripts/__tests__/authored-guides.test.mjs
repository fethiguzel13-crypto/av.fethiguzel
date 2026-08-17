import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { auditGuide } from '../../lib/content-quality.mjs';
import { readAuthored, readPublished } from '../lib/read-guides.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const dir = join(root, 'lib', 'vatandas-rehberi', 'authored');
const authored = readAuthored(root);

test('en az bir elle yazılmış rehber var', () => {
  assert.ok(authored.length > 0, 'authored/*.json boş');
});

test('her TS kaynağının JSON karşılığı üretilmiş', () => {
  // TS yazılıp JSON üretilmezse site elle yazılan metni gösterir, uygulama
  // göstermez. Sapmayı burada yakalıyoruz.
  const ts = readdirSync(dir).filter((f) => f.endsWith('.ts') && f !== 'index.ts');
  for (const f of ts) {
    const jsonPath = join(dir, f.replace(/\.ts$/, '.json'));
    assert.ok(
      existsSync(jsonPath),
      `${f} için JSON yok — node scripts/authored-to-json.mjs çalıştırın`
    );
  }
});

test('JSON, TS kaynağıyla aynı slug ve başlığı taşıyor', () => {
  const ts = readdirSync(dir).filter((f) => f.endsWith('.ts') && f !== 'index.ts');
  for (const f of ts) {
    const src = readFileSync(join(dir, f), 'utf8');
    const json = JSON.parse(readFileSync(join(dir, f.replace(/\.ts$/, '.json')), 'utf8'));
    assert.ok(
      src.includes(`slug: '${json.slug}'`),
      `${f}: JSON slug (${json.slug}) TS kaynağında bulunamadı — JSON eskimiş olabilir`
    );
    assert.ok(
      src.includes(json.h1),
      `${f}: JSON başlığı TS kaynağında yok — JSON eskimiş`
    );
  }
});

test('zorunlu alanlar dolu', () => {
  for (const a of authored) {
    assert.match(a.slug, /^[a-z0-9-]+$/, `${a.slug}: geçersiz slug`);
    assert.ok(a.h1?.length > 10, `${a.slug}: h1 eksik`);
    assert.ok(a.title?.length > 10, `${a.slug}: title eksik`);
    assert.ok(a.description?.length > 40, `${a.slug}: description kısa`);
    assert.ok(a.category, `${a.slug}: kategori yok`);
    assert.ok(a.lead?.length > 60, `${a.slug}: kısa cevap yetersiz`);
    assert.ok(a.sections?.length >= 3, `${a.slug}: en az üç bölüm bekleniyor`);
    assert.ok(a.faq?.length >= 3, `${a.slug}: en az üç soru bekleniyor`);
    assert.ok(a.links?.length >= 1, `${a.slug}: mevzuat bağlantısı yok`);
    assert.ok(a.updated, `${a.slug}: güncelleme tarihi yok`);
  }
});

test('her rehber en az bir kanun maddesine gönderiyor', () => {
  // "Yasal süre vardır" deyip süreyi söylememe hatasının panzehiri:
  // metin somut bir maddeye dayanmalı.
  for (const a of authored) {
    const hasMevzuat = (a.links || []).some((l) => l.href?.startsWith('/mevzuat/'));
    assert.ok(hasMevzuat, `${a.slug}: hiçbir mevzuat maddesine gönderme yok`);
  }
});

test('elle yazılan rehberler kalite kapısından geçiyor', () => {
  for (const a of authored) {
    const r = auditGuide(a);
    assert.equal(r.publishable, true, `${a.slug}: ${r.verdict} — ${r.reason ?? ''}`);
  }
});

test('doğrulanmamış içtihat işareti kalmamış', () => {
  // Depodaki karar arşivi yalnız künye taşır, karar metni yoktur; okumadığımız
  // bir karara görüş atfetmiyoruz. Yazım sırasında bırakılan işaret varsa
  // yayına çıkmadan yakalanmalı.
  for (const a of authored) {
    const text = JSON.stringify(a);
    assert.ok(!text.includes('TODO_ICTIHAT'), `${a.slug}: doldurulmamış içtihat işareti var`);
    assert.ok(!/\bTODO\b/.test(text), `${a.slug}: TODO kalmış`);
  }
});

test('kaçamak ifade kullanılmamış', () => {
  // Otomatik üretilen metinlerin imzası: bilgi vaat edip vermemek.
  const WEASEL = [
    /yasal süre vardır/i,
    /süre kaçırılırsa hak kaybı doğar\.?$/i,
    /somut dosyaya göre değişir\.\s*$/i,
  ];
  for (const a of authored) {
    const text = [a.lead, ...(a.sections || []).flatMap((s) => s.paragraphs || [])].join(' ');
    for (const re of WEASEL) {
      assert.ok(!re.test(text), `${a.slug}: kaçamak ifade — ${re}`);
    }
  }
});

test('elle yazılan rehber, aynı slug\'lı üretilmiş sürümü değiştiriyor', () => {
  const { published } = readPublished(root);
  for (const a of authored) {
    const matches = published.filter((p) => p.slug === a.slug);
    assert.equal(matches.length, 1, `${a.slug}: listede ${matches.length} kez var`);
    assert.equal(matches[0].updated, a.updated, `${a.slug}: üretilmiş sürüm kazanmış`);
  }
});
