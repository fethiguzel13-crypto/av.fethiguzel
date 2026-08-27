import { test } from 'node:test';
import assert from 'node:assert/strict';
import { auditFsek, overlapRatio, ngrams } from '../fsek-gate.mjs';

const SLIDE = `
Borç ilişkisinin kurulmasında icap, belirli bir kişiye yönelmiş ve bağlanma iradesi taşıyan irade açıklamasıdır.
Kabulün icaba uygun düşmesiyle sözleşme kurulmuş sayılır ve taraflar edimlerini ifa yükümü altına girer.
`;

const ORIGINAL = `
Borç ilişkisi alacaklı ile borçlu arasında bir bağdır. İcap, yeterince belirli bir tekliftir.
Kabul zamanında ulaşmazsa sözleşme kurulmaz. Temerrüt, muaccel borcun zamanında ifa edilmemesidir.
İhtar kuraldır; istisnalar TBK'da ayrıca yazılır. Ayıp ile temerrüt aynı rejim değildir.
`;

test('8-gram üretir', () => {
    const g = ngrams('bir iki üç dört beş altı yedi sekiz dokuz', 8);
    assert.equal(g.length, 2);
    assert.equal(g[0].split(' ').length, 8);
    assert.ok(g[0].startsWith('bir iki'));
    assert.ok(g[0].includes('sekiz'));
});

test('kaynak slayt cümlesi kopyalanınca copy sayılır', () => {
    const r = auditFsek({
        generated: SLIDE + ' ' + ORIGINAL,
        sources: [{ kind: 'slide', text: SLIDE }],
    });
    assert.equal(r.ok, false);
    assert.equal(r.verdict, 'copy');
});

test('FSEK m.31 kanun metni n-gram kapısından muaftır', () => {
    const statute =
        'Madde 1 - Kanun, sözleşme ve borcun kaynaklarını düzenler. Sözleşme, tarafların karşılıklı ve birbirine uygun irade açıklamalarıyla kurulur.';
    const r = auditFsek({
        generated: statute + ' Öğrenci bu maddeyi icap-kabul hattında okur.',
        sources: [{ kind: 'statute', text: statute }],
    });
    assert.equal(r.ok, true, r.reason);
});

test('özgün anlatı kaynak slaytla düşük örtüşür', () => {
    const r = overlapRatio(ORIGINAL, SLIDE);
    assert.ok(r < 0.05, `örtüşme ${r}`);
    const a = auditFsek({ generated: ORIGINAL, sources: [{ kind: 'slide', text: SLIDE }] });
    assert.equal(a.ok, true, a.reason);
});

test('listede olmayan künye fake-kunye sayılır', () => {
    const r = auditFsek({
        generated: ORIGINAL + ' (Yargıtay 13. HD, E. 2019/1, K. 2020/2, T. 01.01.2020).',
        sources: [],
        allowedKunye: ['Yargıtay 3. HD, E. 2018/9, K. 2019/8, T. 02.02.2019'],
    });
    assert.equal(r.ok, false);
    assert.equal(r.verdict, 'fake-kunye');
});

test('izinli künye geçer', () => {
    const kunye = 'Yargıtay 13. HD, E. 2019/1, K. 2020/2, T. 01.01.2020';
    const r = auditFsek({
        generated: ORIGINAL + ` (${kunye}).`,
        sources: [],
        allowedKunye: [kunye],
    });
    assert.equal(r.ok, true, r.reason);
});

test('boş üretim empty', () => {
    const r = auditFsek({ generated: '  ' });
    assert.equal(r.verdict, 'empty');
});
