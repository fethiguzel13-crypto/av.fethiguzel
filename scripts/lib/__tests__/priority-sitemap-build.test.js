/**
 * Builds real priority-sitemap via the shipped script entry and asserts
 * core hub + TBK m.13 discovery URLs are present (no mocked XML).
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const script = join(root, 'scripts', 'build-priority-sitemap.mjs');
const out = join(root, 'public', 'priority-sitemap.xml');

describe('build-priority-sitemap (real script)', () => {
  it('writes priority-sitemap with core hubs and TBK madde-13', () => {
    const r = spawnSync(process.execPath, [script], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(r.status, 0, r.stderr || r.stdout);
    assert.ok(existsSync(out));
    const xml = readFileSync(out, 'utf8');
    assert.match(xml, /https:\/\/www\.avfethiguzel\.com\/mevzuat\/tbk<\/loc>/);
    assert.match(
      xml,
      /https:\/\/www\.avfethiguzel\.com\/mevzuat\/tbk\/madde-13<\/loc>/
    );
    assert.match(xml, /https:\/\/www\.avfethiguzel\.com\/mevzuat\/tmk<\/loc>/);
    assert.match(xml, /https:\/\/www\.avfethiguzel\.com\/mevzuat\/tck\/madde-86<\/loc>/);
    assert.ok((xml.match(/<loc>/g) || []).length >= 100);
  });
});
