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

describe('yazı tipleri', () => {
  // Ölçüm (2026-10-05): ana sayfada fonts.googleapis.com stil dosyası 724 ms; her sayfada işlemeyi engelliyordu ve
  // yüklediği Source Serif 4 yalnız hiçbir bileşende kullanılmayan `.madde-prose` sınıfındaydı. Yazı tipleri
  // next/font ile kendi alan adımızdan gelir.
  it('kök yerleşim dış yazı tipi stil dosyası yüklemez', () => {
    const kaynak = readFileSync(join(KOK, 'app/layout.tsx'), 'utf8');
    assert.ok(!kaynak.includes('fonts.googleapis.com/css'), 'layout hâlâ Google Fonts stil dosyası bağlıyor');
    assert.ok(!kaynak.includes('href="https://fonts.g'), 'kullanılmayan yazı tipi alanına ön bağlantı');
  });

  // Ölçüm (2026-10-06, derlenmiş HTML): her sayfa 14 yazı tipi dosyasını (~290 KB) önden yüklüyordu; ~200 KB'ı ilk
  // ekranda gerekmeyen süs (Cormorant Garamond) ve eş aralıklı (IBM Plex Mono) ailelerden. Yavaş bağlantıda gövde
  // metni ve betiklerle bant genişliği için yarışıyordu. Bu iki aile kullanıldığı anda yüklenir (display: swap).
  it('yalnız gövde ve başlık yazı tipi önden yüklenir', () => {
    const kaynak = readFileSync(join(KOK, 'app/layout.tsx'), 'utf8');
    const ayar = (aile) => {
      const m = kaynak.match(new RegExp(`=\\s*${aile}\\(\\{([\\s\\S]*?)\\}\\)`));
      assert.ok(m, `${aile} çağrısı bulunamadı`);
      return m[1];
    };
    for (const aile of ['Cormorant_Garamond', 'IBM_Plex_Mono']) {
      assert.match(ayar(aile), /preload:\s*false/, `${aile} hâlâ önden yükleniyor`);
    }
    for (const aile of ['Plus_Jakarta_Sans', 'Outfit']) {
      assert.doesNotMatch(ayar(aile), /preload:\s*false/, `${aile} ilk ekranda gerekli`);
    }
  });
});
