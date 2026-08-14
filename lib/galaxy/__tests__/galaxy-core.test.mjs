/**
 * Shipped pure.mjs + real locale JSON + catalog.json
 * node --test lib/galaxy/__tests__/galaxy-core.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ACTIVE_LOCALES,
  appHomeUrl,
  deepLinkFor,
  getGalaxyApp,
  inferAppFromPath,
  isLocale,
  localized,
  normalizeLocale,
  pathFromAppUrl,
  tabsForApp,
  translate,
  webUrlFor,
} from '../pure.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '../../..');

function loadJson(rel) {
  return JSON.parse(readFileSync(join(root, rel), 'utf8'));
}

const catalog = loadJson('mobile/galaxy/catalog.json');
const apps = catalog.apps;
const dicts = {
  tr: loadJson('locales/tr.json'),
  en: loadJson('locales/en.json'),
  de: loadJson('locales/de.json'),
  fr: loadJson('locales/fr.json'),
  ar: loadJson('locales/ar.json'),
};

describe('locale normalize / isLocale', () => {
  it('accepts tr/en/de/fr/ar', () => {
    for (const l of ['tr', 'en', 'de', 'fr', 'ar']) {
      assert.equal(isLocale(l), true);
      assert.equal(normalizeLocale(l), l);
    }
  });
  it('maps en-US → en and unknown → tr', () => {
    assert.equal(normalizeLocale('en-US'), 'en');
    assert.equal(normalizeLocale('de-DE'), 'de');
    assert.equal(normalizeLocale('zz'), 'tr');
    assert.equal(normalizeLocale(null), 'tr');
  });
  it('ACTIVE_LOCALES is tr+en only', () => {
    assert.deepEqual(ACTIVE_LOCALES, ['tr', 'en']);
  });
});

describe('translate (real locale files)', () => {
  it('resolves common.* for TR and EN without key fallthrough', () => {
    const keys = [
      'common.home',
      'common.search',
      'common.guide',
      'common.calc',
      'common.cases',
      'common.offline',
      'common.sisterApps',
      'common.language',
      'common.retry',
      'common.share',
    ];
    for (const key of keys) {
      const tr = translate(dicts, 'tr', key);
      const en = translate(dicts, 'en', key);
      assert.notEqual(tr, key, `TR missing ${key}`);
      assert.notEqual(en, key, `EN missing ${key}`);
      assert.notEqual(tr, en, `TR/EN should differ for ${key}`);
    }
  });
  it('apps.* and shell.* resolve for TR/EN', () => {
    for (const id of ['portal', 'hesap', 'icthat', 'rehber']) {
      assert.notEqual(translate(dicts, 'tr', `apps.${id}.name`), `apps.${id}.name`);
      assert.notEqual(translate(dicts, 'en', `apps.${id}.name`), `apps.${id}.name`);
    }
    assert.match(translate(dicts, 'en', 'shell.opening'), /Opening|portal/i);
    assert.match(translate(dicts, 'tr', 'shell.opening'), /açılıyor|portal/i);
  });
  it('DE/FR/AR packs do not crash and resolve common.home', () => {
    for (const loc of ['de', 'fr', 'ar']) {
      const s = translate(dicts, loc, 'common.home');
      assert.equal(typeof s, 'string');
      assert.ok(s.length > 0);
      assert.notEqual(s, 'common.home');
    }
  });
  it('interpolates {n} in shell.retrying', () => {
    const s = translate(dicts, 'en', 'shell.retrying', { n: 3 });
    assert.match(s, /3/);
    assert.equal(s.includes('{n}'), false);
  });
});

describe('catalog lookup (catalog.json)', () => {
  it('has four apps with distinct package ids', () => {
    assert.equal(apps.length, 4);
    const packages = apps.map((a) => a.packageId);
    assert.deepEqual(
      new Set(packages).size,
      4,
      'package ids must be unique'
    );
    assert.equal(getGalaxyApp(apps, 'portal').packageId, 'com.avfethiguzel.hukuk');
    assert.equal(getGalaxyApp(apps, 'hesap').packageId, 'com.avfethiguzel.hesap');
    assert.equal(getGalaxyApp(apps, 'icthat').packageId, 'com.avfethiguzel.icthat');
    assert.equal(getGalaxyApp(apps, 'rehber').packageId, 'com.avfethiguzel.rehber');
  });
  it('home paths match wave-1 contract', () => {
    assert.equal(getGalaxyApp(apps, 'portal').path, '/');
    assert.equal(getGalaxyApp(apps, 'hesap').path, '/hesaplama');
    assert.equal(getGalaxyApp(apps, 'icthat').path, '/icthat');
    assert.equal(getGalaxyApp(apps, 'rehber').path, '/bilgi');
  });
  it('unknown id falls back to first app (portal)', () => {
    assert.equal(getGalaxyApp(apps, 'nope').id, 'portal');
  });
  it('localized name uses locale with en fallback', () => {
    const app = getGalaxyApp(apps, 'hesap');
    assert.equal(localized(app.name, 'tr'), 'Hukuki Hesap');
    assert.equal(localized(app.name, 'en'), 'Legal Calc TR');
  });
  it('appHomeUrl embeds app + lang', () => {
    const url = appHomeUrl(getGalaxyApp(apps, 'hesap'), 'en');
    assert.match(url, /hesaplama/);
    assert.match(url, /app=hesap/);
    assert.match(url, /lang=en/);
  });
  it('webUrlFor and deepLinkFor', () => {
    assert.equal(webUrlFor(apps, 'rehber'), 'https://www.avfethiguzel.com/bilgi');
    assert.equal(deepLinkFor('icthat'), 'avfethiguzel://icthat');
    assert.equal(deepLinkFor('hesap', 'kidem'), 'avfethiguzel://hesap/kidem');
  });
});

describe('inferAppFromPath', () => {
  it('maps core paths', () => {
    assert.equal(inferAppFromPath('/'), 'portal');
    assert.equal(inferAppFromPath('/hesaplama'), 'hesap');
    assert.equal(inferAppFromPath('/hesaplama/kidem'), 'hesap');
    assert.equal(inferAppFromPath('/icthat'), 'icthat');
    assert.equal(inferAppFromPath('/yargi-kararlari'), 'icthat');
    assert.equal(inferAppFromPath('/bilgi'), 'rehber');
    assert.equal(inferAppFromPath('/rehber/x'), 'rehber');
    assert.equal(inferAppFromPath('/mevzuat/tbk'), 'portal');
  });
});

describe('tabsForApp matches catalog', () => {
  it('portal has 5 tabs; satellites have catalog order', () => {
    assert.deepEqual(tabsForApp(apps, 'portal'), [
      'home',
      'search',
      'guide',
      'calc',
      'cases',
    ]);
    assert.deepEqual(tabsForApp(apps, 'hesap'), ['calc', 'home', 'guide', 'cases']);
    assert.deepEqual(tabsForApp(apps, 'icthat'), ['cases', 'search', 'home', 'calc']);
    assert.deepEqual(tabsForApp(apps, 'rehber'), ['guide', 'calc', 'home', 'cases']);
  });
});

describe('pathFromAppUrl deep links', () => {
  it('maps avfethiguzel://appId to app home with app query', () => {
    const p = pathFromAppUrl('avfethiguzel://hesap', apps);
    assert.ok(p);
    assert.match(p, /^\/hesaplama/);
    assert.match(p, /app=hesap/);
  });
  it('maps subpaths under app id', () => {
    const p = pathFromAppUrl('avfethiguzel://rehber/foo', apps);
    assert.ok(p);
    assert.match(p, /^\/bilgi\/foo/);
    assert.match(p, /app=rehber/);
  });
  it('maps https site URLs and injects app if missing', () => {
    const p = pathFromAppUrl('https://www.avfethiguzel.com/icthat', apps);
    assert.ok(p);
    assert.match(p, /^\/icthat/);
    assert.match(p, /app=icthat/);
  });
  it('rejects foreign hosts', () => {
    assert.equal(pathFromAppUrl('https://evil.example/x', apps), null);
  });
  it('portal scheme root', () => {
    const p = pathFromAppUrl('avfethiguzel://portal', apps);
    assert.ok(p);
    assert.match(p, /^\//);
    assert.match(p, /app=portal/);
  });
});
