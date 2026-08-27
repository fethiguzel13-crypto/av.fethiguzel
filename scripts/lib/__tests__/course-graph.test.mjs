import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = join(process.cwd());
const graphDir = join(root, 'lib/ders-notlari/graphs');
const graphs = readdirSync(graphDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(graphDir, f), 'utf8')));

function yamlIds(block) {
    return [...block.matchAll(/^\s+-\s+id:\s+([a-z0-9çğıöşü-]+)/gmi)].map((m) => m[1]);
}

for (const graph of graphs) {
    test(`${graph.courseCode} coverage id’lerini kapsar`, () => {
        const yamlPath = join(root, 'docs/ders-notlari/coverage', `${graph.courseCode}.yaml`);
        assert.ok(existsSync(yamlPath), `coverage yok: ${graph.courseCode}`);
        const coverage = readFileSync(yamlPath, 'utf8');
        const ids = new Set(graph.institutions.map((i) => i.id));
        for (const id of yamlIds(coverage)) {
            assert.ok(ids.has(id), `${graph.courseCode} grafda yok: ${id}`);
        }
    });

    test(`${graph.courseCode} güz/bahar dilimleri graf kurumlarına bağlanır`, () => {
        const ids = new Set(graph.institutions.map((i) => i.id));
        for (const id of [...graph.guzInstitutionIds, ...graph.baharInstitutionIds]) {
            assert.ok(ids.has(id), `${graph.courseCode} dilim id grafda yok: ${id}`);
        }
    });

    test(`${graph.courseCode} statuteRef dosyaları var`, () => {
        for (const inst of graph.institutions) {
            assert.ok(inst.definition.length > 40, `${inst.id} tanımı kısa`);
            assert.ok(inst.elements.length >= 3, `${inst.id} unsur eksik`);
            for (const ref of inst.statuteRefs) {
                const p = join(root, 'content/mevzuat', ref.kanunId, `madde-${ref.maddeNo}.md`);
                assert.ok(existsSync(p), `madde yok: ${ref.kanunId}/${ref.maddeNo} (${inst.id})`);
            }
        }
    });

    test(`${graph.courseCode} künye alanı boş veya tam künye`, () => {
        for (const inst of graph.institutions) {
            for (const c of inst.caseRefs) {
                assert.match(c.kunye, /E\.\s*\d{4}\/\d+,\s*K\.\s*\d{4}\/\d+/);
            }
        }
    });
}
