import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { cosine, hashEmbed } from '../embed.mjs';
import { openStore } from '../store.mjs';
import { citeLine, isRealKunye, retrieve, retrieveStructural } from '../retrieve.mjs';

test('aynı metin kosinüsü ~1', () => {
    const a = hashEmbed('icap ve kabul ile sözleşme kurulur');
    const b = hashEmbed('icap ve kabul ile sözleşme kurulur');
    assert.ok(cosine(a, b) > 0.99);
});

test('künye doğrulama uydurmayı keser', () => {
    assert.equal(isRealKunye('Yargıtay Büyük Genel Kurulu, E. 2017/1, K. 2017/9, T. 08.12.2017'), true);
    assert.equal(isRealKunye('Yargıtay 13. HD, E. 2020/12'), false);
    assert.equal(isRealKunye('öğretide kabul edilmiştir'), false);
});

test('yapısal madde + atıf; olmayan künye yok sayılır', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'rag-'));
    const dbPath = join(dir, 'rag.sqlite');
    const store = openStore(dbPath);
    const vec = hashEmbed('TBK m.1 irade açıklaması');
    store.upsert({
        id: 'mevzuat:tbk/1',
        corpus: 'mevzuat',
        kanun_id: 'tbk',
        madde_no: '1',
        karar_id: null,
        course_code: 'borclar-genel',
        kunye: null,
        text: 'Sözleşme, tarafların iradelerini karşılıklı ve birbirine uygun olarak açıklamalarıyla kurulur.',
        source_uri: 'mevzuat://tbk/madde-1',
        embedding: vec,
    });
    store.upsert({
        id: 'yargi:1',
        corpus: 'yargi',
        kanun_id: 'tbk',
        madde_no: '1',
        karar_id: '1',
        course_code: null,
        kunye: 'Yargıtay 13. Hukuk Dairesi, E. 2019/100, K. 2019/200, T. 01.02.2019',
        text: 'İcap belirli olmalıdır.',
        source_uri: 'yargi://1',
        embedding: hashEmbed('icap belirli sözleşme'),
    });
    store.upsert({
        id: 'yargi:fake',
        corpus: 'yargi',
        kanun_id: 'tbk',
        madde_no: '1',
        karar_id: 'fake',
        course_code: null,
        kunye: 'uydurma karar 12',
        text: 'bu künye geçersiz',
        source_uri: 'yargi://fake',
        embedding: hashEmbed('uydurma'),
    });
    store.addAtif('tbk', '1', '1');
    store.addAtif('tbk', '1', 'missing-id');

    const st = retrieveStructural(store, { kanunId: 'tbk', maddeNo: '1' });
    assert.equal(st.ictihat, 'var');
    assert.equal(st.hits[0].via, 'structural-atif');
    assert.ok(st.cites.every((c) => isRealKunye(c.cite)));
    assert.equal(st.cites.some((c) => c.karar_id === 'fake'), false);
    assert.equal(store.byKarar('missing-id'), null);

    const sem = await retrieve(store, { query: 'sözleşme irade açıklaması', courseCode: 'borclar-genel', k: 5 });
    assert.ok(sem.hits.some((h) => h.corpus === 'mevzuat'));
    assert.match(citeLine(st), /Yerel arşiv künyesi/);
    assert.match(citeLine({ ictihat: 'yok', cites: [] }), /künye yoktur/);

    store.close();
    rmSync(dir, { recursive: true, force: true });
});

test('depo yoksa içtihat yok', () => {
    const r = retrieveStructural(null, { kanunId: 'tbk', maddeNo: '1' });
    assert.equal(r.ictihat, 'yok');
    assert.match(citeLine(r), /uydurulmadı|yoktur/);
});
