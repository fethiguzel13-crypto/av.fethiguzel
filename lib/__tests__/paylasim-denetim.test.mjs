/**
 * Paylaşım etiketi denetimi (Aylık plan G20 adım 1). 2026-10-09 derlemesinde ana sayfa dahil sayfalarda `og:image`
 * yoktu: Sayfanın `openGraph` nesnesi kök yerleşiminkini bütünüyle değiştiriyor, görsel ve site adı düşüyordu.
 *   node --test lib/__tests__/paylasim-denetim.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { dizinde, paylasimDenetle, siteIciYol } from '../paylasim-denetim.mjs';

const TAM = [
  '<meta property="og:title" content="Başlık"/>',
  '<meta property="og:description" content="Açıklama"/>',
  '<meta property="og:url" content="https://www.avfethiguzel.com/bilgi/x"/>',
  '<meta property="og:type" content="article"/>',
  '<meta property="og:site_name" content="Av. Fethi Güzel Hukuk Portalı"/>',
  '<meta property="og:locale" content="tr_TR"/>',
  '<meta property="og:image" content="https://www.avfethiguzel.com/og/rehber/x"/>',
  '<meta property="og:image:width" content="1200"/>',
  '<meta property="og:image:height" content="630"/>',
  '<meta property="og:image:alt" content="Başlık"/>',
  '<meta name="twitter:card" content="summary_large_image"/>',
  '<meta name="twitter:image" content="https://www.avfethiguzel.com/og/rehber/x"/>',
].join('');

describe('paylasimDenetle', () => {
  it('tam etiketli sayfada eksik yok', () => {
    const s = paylasimDenetle(TAM);
    assert.deepEqual(s.eksik, []);
    assert.deepEqual(s.gorseller, ['https://www.avfethiguzel.com/og/rehber/x']);
  });

  it('2026-10-09 ana sayfa biçimi: görsel, tür, site adı ve dil eksik bulunur', () => {
    const html =
      '<meta property="og:title" content="Av. Fethi Güzel"/><meta property="og:description" content="d"/>' +
      '<meta property="og:url" content="https://www.avfethiguzel.com"/><meta name="twitter:card" content="summary_large_image"/>' +
      '<meta name="twitter:image" content="https://www.avfethiguzel.com/images/av-fethi-guzel-og.jpg"/>';
    assert.deepEqual(paylasimDenetle(html).eksik, ['og:type', 'og:site_name', 'og:locale', 'og:image']);
  });

  it('küçük Twitter kartı eksik sayılır', () => {
    const s = paylasimDenetle(TAM.replace('summary_large_image', 'summary'));
    assert.deepEqual(s.eksik, ['twitter:card=summary_large_image']);
    assert.equal(s.twitterKart, 'summary');
  });

  it('görselin boyut ve alt metni de aranır', () => {
    const html = TAM.replace(/<meta property="og:image:(width|alt)"[^>]*\/>/g, '');
    assert.deepEqual(paylasimDenetle(html).eksik, ['og:image:width', 'og:image:alt']);
  });
});

describe('dizinde', () => {
  it('noindex taşıyan sayfa dizin dışıdır', () => {
    assert.equal(dizinde('<meta name="robots" content="noindex, follow"/>'), false);
    assert.equal(dizinde('<meta name="robots" content="index, follow"/>'), true);
    assert.equal(dizinde('<title>x</title>'), true);
  });
});

describe('siteIciYol', () => {
  it('mutlak ve göreli adresten yolu, sorgu dizgisiz verir', () => {
    assert.equal(siteIciYol('https://www.avfethiguzel.com/og/kanun/tbk?abc'), '/og/kanun/tbk');
    assert.equal(siteIciYol('/og/site/genel'), '/og/site/genel');
    assert.equal(siteIciYol('https://example.com/a.png'), null);
  });
});
