/**
 * Performans (Aylık plan G13). Ölçüm (2026-10-05, Playwright, mobil görünüm): Footer'daki Google Haritalar gömmesi
 * `loading="lazy"` taşısa da kısa sayfalarda tarayıcının erken yükleme eşiğine giriyor; rehber sayfasında ~400 KB harita
 * betiği ve 600 ms'yi aşan CPU. Harita yalnız Footer görünür alana yaklaşınca yüklenir.
 *   node --test lib/__tests__/performans.test.mjs
 */
import { register } from 'node:module';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

register('../uyelik/__tests__/ts-hooks.mjs', import.meta.url);
register('./tsx-hooks.mjs', import.meta.url);

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SRC = 'https://www.google.com/maps/embed?pb=ornek';
const ARAMA = 'https://www.google.com/maps/search/?api=1&query=ornek';

async function ciz(props) {
  const { createElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { default: ErtelenmisHarita } = await import(pathToFileURL(join(KOK, 'components/ErtelenmisHarita.tsx')).href);
  return renderToStaticMarkup(createElement(ErtelenmisHarita, props));
}

describe('ertelenmiş harita', () => {
  it('sunucu çiziminde iframe ve harita adresi yok; yerinde haritayı açan bağlantı var', async () => {
    const html = await ciz({ src: SRC, title: 'Ofis konumu', aramaUrl: ARAMA });
    assert.ok(!html.includes('<iframe'), html);
    assert.ok(!html.includes(SRC));
    assert.match(html, /<a [^>]*href="https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=ornek"/);
  });

  it('Footer haritayı doğrudan gömmez, ertelenmiş bileşenden çizer', () => {
    const kaynak = readFileSync(join(KOK, 'components/Footer.tsx'), 'utf8');
    assert.ok(!kaynak.includes('<iframe'), 'Footer hâlâ doğrudan iframe çiziyor');
    assert.ok(kaynak.includes('ErtelenmisHarita'));
  });
});

