import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildVisualPlan, visualSlotCount, primaryStamp } from '../visual-plan.ts';
import { buildVisualScene, hashSlug } from '../visual-scene.ts';
import type { VatandasArticle } from '../types.ts';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'rewritten');

function load(slug: string): VatandasArticle {
    return JSON.parse(readFileSync(join(dir, `${slug}.json`), 'utf8')) as VatandasArticle;
}

test('ödeme emri: yedi gün ve icra/mahkeme ayrımı metinden çıkar', () => {
    const plan = buildVisualPlan(load('odeme-emrine-itiraz'));
    assert.ok(plan.clocks.some((c) => c.days === 7 && c.unit === 'gün'));
    assert.ok(plan.fork);
    assert.ok(plan.trap);
    assert.ok(visualSlotCount(load('odeme-emrine-itiraz'), plan) >= 6);
});

test('kıdem: beş yıl ve 30 günlük ücret formülü; tavan tutarı uydurulmaz', () => {
    const a = load('kidem-tazminati-nasil-alinir');
    const plan = buildVisualPlan(a);
    assert.ok(plan.clocks.some((c) => c.unit === 'yıl' && c.amount === '5'));
    assert.equal(plan.clocks.some((c) => c.amount === '30' && c.unit === 'gün'), false);
    assert.ok(plan.measures.some((m) => /30 günlük/i.test(m.value)));
    assert.equal(
        JSON.stringify(plan).includes('2026'),
        false,
        'tavan tutarı veya yıl uydurulmamalı'
    );
});

test('veraset: noter / sulh hukuk ayrımı ve üç ay', () => {
    const plan = buildVisualPlan(load('veraset-ilami-nasil-alinir'));
    assert.ok(plan.fork);
    const blob = JSON.stringify(plan.fork).toLocaleLowerCase('tr-TR');
    assert.ok(blob.includes('noter') || blob.includes('sulh'));
    assert.ok(plan.clocks.some((c) => c.amount === '3' && c.unit === 'ay'));
});

test('boşanma: bir yıl evlilik şartı damgası', () => {
    const plan = buildVisualPlan(load('bosanma-davasi-nasil-acilir'));
    assert.ok(plan.clocks.some((c) => c.amount === '1' && c.unit === 'yıl'));
});

test('aynı slug aynı sahne, farklı slug farklı sahne', () => {
    const a = buildVisualScene('kidem-tazminati-nasil-alinir', 'İş', '5 yıl', 'kıdem');
    const b = buildVisualScene('kidem-tazminati-nasil-alinir', 'İş', '5 yıl', 'kıdem');
    const c = buildVisualScene('odeme-emrine-itiraz', 'İcra', '7 gün', 'ödeme');
    assert.equal(a.seed, b.seed);
    assert.equal(a.layout, b.layout);
    assert.notEqual(hashSlug('kidem-tazminati-nasil-alinir'), hashSlug('odeme-emrine-itiraz'));
    assert.notEqual(a.layout + a.sealX, c.layout + c.sealX);
});

test('kahraman damgası yanıltıcı süreyi seçmez', () => {
    const kidem = load('kidem-tazminati-nasil-alinir');
    const odeme = load('odeme-emrine-itiraz');
    const veraset = load('veraset-ilami-nasil-alinir');
    assert.equal(primaryStamp(buildVisualPlan(kidem).clocks, kidem), '5 yıl');
    assert.equal(primaryStamp(buildVisualPlan(odeme).clocks, odeme), '7 gün');
    assert.equal(primaryStamp(buildVisualPlan(veraset).clocks, veraset), '3 ay');
});

test('her rehberde en az kahraman + süreç + evrak sığar', () => {
    const a = load('issizlik-maasi-sartlari');
    assert.ok(visualSlotCount(a) >= 4);
});
