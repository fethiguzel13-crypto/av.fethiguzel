import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    isAllowlisted,
    parseRobots,
    pathAllowed,
    fetchPublic,
    assertNoStealth,
    DEFAULT_UA,
} from '../source-broker.mjs';

test('allowlist: ankara hukuk geçer, rastgele blog geçmez', () => {
    assert.equal(isAllowlisted('https://www.law.ankara.edu.tr/ders-icerikleri/'), true);
    assert.equal(isAllowlisted('https://acikders.ankara.edu.tr/course/view.php?id=1'), true);
    assert.equal(isAllowlisted('https://atauni.edu.tr/hukuk-fakultesi/'), true);
    assert.equal(isAllowlisted('https://notpazari.com/borclar.pdf'), false);
    assert.equal(isAllowlisted('https://evil.example/moodle'), false);
});

test('robots.txt Disallow yolu keser, Allow daha özgülse geçer', () => {
    const rules = parseRobots(`
User-agent: *
Disallow: /private
Allow: /private/open
Disallow: /course/view.php
`);
    assert.equal(pathAllowed('/ders-icerikleri/', rules), true);
    assert.equal(pathAllowed('/private/secret', rules), false);
    assert.equal(pathAllowed('/private/open/x', rules), true);
});

test('stealth bayrağı atılır', () => {
    assert.throws(() => assertNoStealth({ stealth: true }), /stealth kapalı/);
    assert.throws(() => assertNoStealth({ maskWebdriver: 1 }), /stealth kapalı/);
});

test('allowlist dışı fetchPublic HOST_DENIED', async () => {
    await assert.rejects(() => fetchPublic('https://notpazari.com/x'), (err) => err.code === 'HOST_DENIED');
});

test('robots disallow fetchPublic ROBOTS_DISALLOW', async () => {
    await assert.rejects(
        () =>
            fetchPublic('https://law.ankara.edu.tr/private/notes', {
                robotsText: 'User-agent: *\nDisallow: /private',
            }),
        (err) => err.code === 'ROBOTS_DISALLOW'
    );
});

test('kimlikli UA ile allowlist fetch', async () => {
    let seenUa = '';
    const fakeFetch = async (url, init) => {
        seenUa = init.headers['User-Agent'];
        return {
            ok: true,
            status: 200,
            headers: { get: () => 'text/html' },
            text: async () => '<html>Bologna HKZ201</html>',
        };
    };
    const r = await fetchPublic('https://law.ankara.edu.tr/ders-icerikleri/', {
        fetchImpl: fakeFetch,
        robotsText: 'User-agent: *\nDisallow:',
        lastFetchAt: new Map(),
        sleep: async () => { },
    });
    assert.equal(r.text.includes('HKZ201'), true);
    assert.equal(seenUa, DEFAULT_UA);
    assert.match(seenUa, /AvFethiGuzelBot/);
});
