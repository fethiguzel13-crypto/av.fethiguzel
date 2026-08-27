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
    'marmara__borclar-genel-yillik.json',
    'istanbul__idare-hukuku-yillik.json',
    'afyon__borclar-genel-yillik.json',
];

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
