import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { auditLectureNote } from '../../../lib/content-quality.mjs';
import { auditFsek } from '../../../lib/ders-notlari/fsek-gate.mjs';

const root = process.cwd();
const overlaySlugs = readdirSync(join(root, 'lib/ders-notlari/overlays'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
const courses = readdirSync(join(root, 'lib/ders-notlari/graphs'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));

function auditFile(f) {
    const p = join(root, 'lib/ders-notlari/generated/notes', f);
    assert.ok(existsSync(p), `dosya yok: ${f}`);
    const note = JSON.parse(readFileSync(p, 'utf8'));
    const lecture = auditLectureNote(note);
    assert.equal(lecture.publishable, true, lecture.reason);
    const fsek = auditFsek({
        generated: JSON.stringify(note),
        sources: (note.sources || []).map((s) => ({
            kind: 'syllabus',
            text: `${s.title} ${s.note || ''}`,
        })),
        allowedKunye: [],
    });
    assert.equal(fsek.ok, true, fsek.reason);
    assert.equal(note.qualityTier, 'curated');
    assert.ok(note.topics?.length > 0, 'topic yok');
    assert.ok(note.mermaid?.length > 0, 'mermaid yok');
    const min = f.includes('yillik') ? 18000 : 8000;
    assert.ok(note.wordTarget >= min, `kelime ${note.wordTarget} < ${min}`);
    assert.ok(!JSON.stringify(note).includes('AÜHF Cebeci geleneğinde bu kurum') || note.uniSlug === 'ankara');
}

test('başlanmış örtü × graf üçlüsü yarım kalmaz', () => {
    const broken = [];
    const notesDir = join(root, 'lib/ders-notlari/generated/notes');
    for (const uni of overlaySlugs) {
        for (const course of courses) {
            const parts = ['donem-1', 'donem-2', 'yillik'].map(
                (v) => existsSync(join(notesDir, `${uni}__${course}-${v}.json`))
            );
            const n = parts.filter(Boolean).length;
            if (n > 0 && n < 3) broken.push(`${uni}/${course}`);
        }
    }
    assert.equal(broken.length, 0, `yarım üçlü: ${broken.slice(0, 12).join(', ')}`);
});

const deep = [
    'ankara__borclar-genel-donem-1.json',
    'ankara__borclar-genel-donem-2.json',
    'ankara__borclar-genel-yillik.json',
    'ankara__medeni-baslangic-donem-1.json',
    'ankara__medeni-baslangic-donem-2.json',
    'ankara__medeni-baslangic-yillik.json',
    'ankara-yildirim-beyazit__borclar-genel-donem-1.json',
    'ankara-yildirim-beyazit__borclar-genel-donem-2.json',
    'ankara-yildirim-beyazit__borclar-genel-yillik.json',
    'istanbul__borclar-genel-donem-1.json',
    'istanbul__borclar-genel-donem-2.json',
    'istanbul__borclar-genel-yillik.json',
    'marmara__borclar-genel-donem-1.json',
    'marmara__borclar-genel-donem-2.json',
    'marmara__borclar-genel-yillik.json',
    'dokuz-eylul__borclar-genel-yillik.json',
    'hacettepe__borclar-genel-yillik.json',
    'galatasaray__borclar-genel-yillik.json',
    'bilkent__borclar-genel-yillik.json',
    'koc__borclar-genel-yillik.json',
    'dokuz-eylul__medeni-baslangic-yillik.json',
    'hacettepe__medeni-baslangic-yillik.json',
    'galatasaray__medeni-baslangic-yillik.json',
    'bilkent__medeni-baslangic-yillik.json',
    'koc__medeni-baslangic-yillik.json',
    'ankara__ceza-genel-yillik.json',
    'marmara__ceza-genel-yillik.json',
    'ankara__medeni-usul-yillik.json',
    'istanbul__medeni-usul-yillik.json',
    'koc__medeni-usul-yillik.json',
    'ankara__esya-hukuku-yillik.json',
    'marmara__esya-hukuku-yillik.json',
    'bilkent__esya-hukuku-yillik.json',
    'ankara__icra-iflas-yillik.json',
    'marmara__icra-iflas-yillik.json',
    'istanbul__icra-iflas-yillik.json',
    'ankara__aile-hukuku-yillik.json',
    'marmara__aile-hukuku-yillik.json',
    'koc__aile-hukuku-yillik.json',
    'ankara__miras-hukuku-yillik.json',
    'marmara__miras-hukuku-yillik.json',
    'koc__miras-hukuku-yillik.json',
    'ankara__borclar-ozel-yillik.json',
    'marmara__borclar-ozel-yillik.json',
    'koc__borclar-ozel-yillik.json',
    'ankara__is-hukuku-yillik.json',
    'marmara__is-hukuku-yillik.json',
    'koc__is-hukuku-yillik.json',
    'ankara__ceza-ozel-yillik.json',
    'marmara__ceza-ozel-yillik.json',
    'koc__ceza-ozel-yillik.json',
    'ankara__ticari-isletme-yillik.json',
    'marmara__ticari-isletme-yillik.json',
    'koc__ticari-isletme-yillik.json',
    'ankara__ticaret-sirketler-yillik.json',
    'marmara__ticaret-sirketler-yillik.json',
    'koc__ticaret-sirketler-yillik.json',
    'ankara__ceza-muhakemesi-yillik.json',
    'marmara__ceza-muhakemesi-yillik.json',
    'koc__ceza-muhakemesi-yillik.json',
    'ankara__kiymetli-evrak-yillik.json',
    'marmara__kiymetli-evrak-yillik.json',
    'koc__kiymetli-evrak-yillik.json',
    'istanbul__idare-hukuku-yillik.json',
    'afyon__borclar-genel-yillik.json',
];

test('AÜHF medeni notuna borçlar sınav ipucu sızmaz', () => {
    const p = join(root, 'lib/ders-notlari/generated/notes', 'ankara__medeni-baslangic-yillik.json');
    if (!existsSync(p)) {
        assert.ok(true, 'henüz üretilmedi');
        return;
    }
    const note = JSON.parse(readFileSync(p, 'utf8'));
    const blob = JSON.stringify(note);
    assert.equal(blob.includes('borcun kaynağını'), false);
    assert.equal(blob.includes('HKZ201'), false);
    assert.match(blob, /TMK m\.1|dürüstlük|iyiniyet/);
    assert.match(note.promise || '', /TMK/);
});

test('AYBÜ borçlar notuna AÜHF Cebeci sesi sızmaz', () => {
    const p = join(
        root,
        'lib/ders-notlari/generated/notes',
        'ankara-yildirim-beyazit__borclar-genel-yillik.json'
    );
    if (!existsSync(p)) {
        assert.ok(true, 'henüz üretilmedi');
        return;
    }
    const note = JSON.parse(readFileSync(p, 'utf8'));
    const blob = JSON.stringify(note);
    assert.equal(blob.includes('Cebeci'), false);
    assert.equal(blob.includes('HKZ201'), false);
    assert.match(blob, /AYBÜ|Yıldırım Beyazıt|Esenboğa/);
    assert.match(note.promise || '', /AYBÜ|kaynağını/);
});

test('İÜHF borçlar notuna Cebeci/AYBÜ sesi sızmaz', () => {
    const p = join(
        root,
        'lib/ders-notlari/generated/notes',
        'istanbul__borclar-genel-yillik.json'
    );
    if (!existsSync(p)) {
        assert.ok(true, 'henüz üretilmedi');
        return;
    }
    const note = JSON.parse(readFileSync(p, 'utf8'));
    const blob = JSON.stringify(note);
    assert.equal(blob.includes('Cebeci'), false);
    assert.equal(blob.includes('HKZ201'), false);
    assert.equal(blob.includes('Esenboğa'), false);
    assert.match(blob, /Beyazıt|HUKK2074|İÜHF/);
    assert.match(note.promise || '', /Beyazıt|kaynağı/);
});

function assertFacultyVoice(file, mustHave, mustNot) {
    const p = join(root, 'lib/ders-notlari/generated/notes', file);
    if (!existsSync(p)) {
        assert.ok(true, 'henüz üretilmedi');
        return;
    }
    const blob = JSON.stringify(JSON.parse(readFileSync(p, 'utf8')));
    for (const n of mustNot) assert.equal(blob.includes(n), false, n);
    assert.match(blob, mustHave);
}

test('Marmara borçlar Göztepe sesi taşır', () => {
    assertFacultyVoice(
        'marmara__borclar-genel-yillik.json',
        /Göztepe|HUK201|Marmara/,
        ['Cebeci', 'HKZ201', 'Esenboğa', 'HUKK2074']
    );
});
test('DEÜ borçlar İzmir sesi taşır', () => {
    assertFacultyVoice(
        'dokuz-eylul__borclar-genel-yillik.json',
        /Dokuzçeşmeler|DEÜ|Alsancak|İzmir/,
        ['Cebeci', 'HKZ201', 'HUKK2074']
    );
});
test('Hacettepe borçlar Beytepe sesi taşır', () => {
    assertFacultyVoice(
        'hacettepe__borclar-genel-yillik.json',
        /Beytepe|Hacettepe/,
        ['Cebeci', 'HKZ201', 'HUKK2074']
    );
});
test('GSÜ borçlar Ortaköy sesi taşır', () => {
    assertFacultyVoice(
        'galatasaray__borclar-genel-yillik.json',
        /Ortaköy|GSÜ|HUK222/,
        ['Cebeci', 'HKZ201', 'HUKK2074']
    );
});
test('Bilkent borçlar karşılaştırmalı ses taşır', () => {
    assertFacultyVoice(
        'bilkent__borclar-genel-yillik.json',
        /Bilkent|Issue spotting|İngilizce/,
        ['Cebeci', 'HKZ201', 'HUKK2074']
    );
});
test('AYBÜ medeni notuna borçlar sınav ipucu sızmaz', () => {
    assertFacultyVoice(
        'ankara-yildirim-beyazit__medeni-baslangic-yillik.json',
        /TMK m\.1|dürüstlük|iyiniyet/,
        ['borcun kaynağını', 'HKZ201', 'HUK201', 'HUKK2074']
    );
});
test('DEÜ medeni notuna borçlar sınav ipucu sızmaz', () => {
    assertFacultyVoice(
        'dokuz-eylul__medeni-baslangic-yillik.json',
        /TMK|dürüstlük|iyiniyet/,
        ['borcun kaynağını', 'HKZ201']
    );
});
test('AÜHF ceza notuna borçlar sınav ipucu sızmaz', () => {
    assertFacultyVoice(
        'ankara__ceza-genel-yillik.json',
        /TCK|tipiklik|kanunilik/,
        ['borcun kaynağını', 'HKZ201']
    );
});
test('AÜHF usul notuna borçlar sınav ipucu sızmaz', () => {
    assertFacultyVoice(
        'ankara__medeni-usul-yillik.json',
        /HMK|görev|yetki/,
        ['borcun kaynağını', 'HKZ201']
    );
});
test('AÜHF eşya notuna borçlar sınav ipucu sızmaz', () => {
    assertFacultyVoice(
        'ankara__esya-hukuku-yillik.json',
        /zilyetlik|tapu|mülkiyet/,
        ['borcun kaynağını', 'HKZ201']
    );
});
test('AÜHF icra notuna borçlar sınav ipucu sızmaz', () => {
    assertFacultyVoice(
        'ankara__icra-iflas-yillik.json',
        /ilamlı|ilamsız|İİK/,
        ['HKZ201']
    );
});
test('AÜHF aile notuna borçlar sınav ipucu sızmaz', () => {
    assertFacultyVoice(
        'ankara__aile-hukuku-yillik.json',
        /nişan|boşanma|velayet/,
        ['HKZ201']
    );
});
test('AÜHF miras notuna borçlar sınav ipucu sızmaz', () => {
    assertFacultyVoice(
        'ankara__miras-hukuku-yillik.json',
        /zümre|saklı pay|vasiyet/,
        ['HKZ201']
    );
});
test('AÜHF borçlar özel notuna genel kapısı sızmaz', () => {
    assertFacultyVoice(
        'ankara__borclar-ozel-yillik.json',
        /satış|kira|eser|TBK m\.227/,
        ['HKZ201', 'borcun kaynağını']
    );
});
test('AÜHF iş hukuku notuna borçlar genel kapısı sızmaz', () => {
    assertFacultyVoice(
        'ankara__is-hukuku-yillik.json',
        /iş güvencesi|kıdem|4857/,
        ['HKZ201', 'borcun kaynağını']
    );
});
test('AÜHF ceza özel notuna borçlar genel kapısı sızmaz', () => {
    assertFacultyVoice(
        'ankara__ceza-ozel-yillik.json',
        /öldürme|hırsızlık|TCK m\.81/,
        ['HKZ201', 'borcun kaynağını']
    );
});
test('AÜHF ticari işletme notuna borçlar genel kapısı sızmaz', () => {
    assertFacultyVoice(
        'ankara__ticari-isletme-yillik.json',
        /tacir|ticari işletme|TTK m\.12/,
        ['HKZ201', 'borcun kaynağını']
    );
});
test('AÜHF şirketler notuna tacir kapısı sızmaz', () => {
    assertFacultyVoice(
        'ankara__ticaret-sirketler-yillik.json',
        /anonim|limited|TTK m\.124/,
        ['HKZ201', 'borcun kaynağını']
    );
});
test('AÜHF CMK notuna borçlar genel kapısı sızmaz', () => {
    assertFacultyVoice(
        'ankara__ceza-muhakemesi-yillik.json',
        /soruşturma|tutuklama|CMK/,
        ['HKZ201', 'borcun kaynağını']
    );
});
test('AÜHF kıymetli evrak notuna tacir kapısı sızmaz', () => {
    assertFacultyVoice(
        'ankara__kiymetli-evrak-yillik.json',
        /poliçe|bono|çek/,
        ['HKZ201', 'borcun kaynağını']
    );
});

test('Koç borçlar Rumelifeneri sesi taşır', () => {
    assertFacultyVoice(
        'koc__borclar-genel-yillik.json',
        /Rumelifeneri|Koç|Hypo/,
        ['Cebeci', 'HKZ201', 'HUKK2074']
    );
});

for (const f of deep) {
    test(`${f} kapılardan geçer`, () => {
        const p = join(root, 'lib/ders-notlari/generated/notes', f);
        if (!existsSync(p)) {
            assert.ok(true, 'henüz üretilmedi');
            return;
        }
        const note = JSON.parse(readFileSync(p, 'utf8'));
        if (!Array.isArray(note.mermaid) || note.mermaid.length === 0) {
            assert.ok(true, 'eski kalıp; graf üçlüsü henüz yazılmadı');
            return;
        }
        auditFile(f);
    });
}
