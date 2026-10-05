/**
 * Kırıntı yolu tek kaynak (Aylık plan G12 adım 1): görünür kırıntı ve BreadcrumbList şeması aynı öğe listesinden.
 * 2026-10-05 derlemesinde dizine açık 804 sayfanın 261'inde şema yoktu; kanun, kavram, makale sayfaları kırıntıyı
 * gösterip şemayı basmıyordu, şema beş ayrı yerde elle kuruluyordu.
 *   node --test lib/__tests__/kirinti.test.mjs
 */
import { register } from 'node:module';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { kirintiLd } from '../kirinti.mjs';
import { jsonLdDenetle } from '../../scripts/lib/jsonld-denetim.mjs';

register('../uyelik/__tests__/ts-hooks.mjs', import.meta.url);
register('./tsx-hooks.mjs', import.meta.url);

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OGELER = [
  { ad: 'Kavramlar', yol: '/kavram' },
  { ad: 'Haksız fiil', yol: '/kavram/haksiz-fiil' },
];

async function ciz(props) {
  const { createElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { default: Kirinti } = await import(pathToFileURL(join(KOK, 'components/Kirinti.tsx')).href);
  return renderToStaticMarkup(createElement(Kirinti, props));
}

describe('kirintiLd', () => {
  it('ana sayfayı başa ekler, sırayı 1..n ve adresleri mutlak yazar', () => {
    const ld = kirintiLd(OGELER);
    assert.equal(ld['@type'], 'BreadcrumbList');
    assert.deepEqual(
      ld.itemListElement.map((e) => [e.position, e.name, e.item]),
      [
        [1, 'Ana sayfa', 'https://www.avfethiguzel.com/'],
        [2, 'Kavramlar', 'https://www.avfethiguzel.com/kavram'],
        [3, 'Haksız fiil', 'https://www.avfethiguzel.com/kavram/haksiz-fiil'],
      ]
    );
  });

  it('Türkçe karakterli yolu kodlar ve şema denetiminden geçer', () => {
    const ld = kirintiLd([{ ad: 'Yapı ruhsatı', yol: '/bilgi/yapı-ruhsati-nedir' }]);
    assert.equal(ld.itemListElement[1].item, 'https://www.avfethiguzel.com/bilgi/yap%C4%B1-ruhsati-nedir');
    assert.deepEqual(jsonLdDenetle({ '@context': 'https://schema.org', ...ld }), []);
  });

  it('adsız öğeyi ve göreli olmayan yolu reddeder', () => {
    assert.throws(() => kirintiLd([{ ad: ' ', yol: '/x' }]), /ad/);
    assert.throws(() => kirintiLd([{ ad: 'Dış', yol: 'https://ornek.com/x' }]), /yol/);
  });
});

describe('<Kirinti>', () => {
  it('son öğe dışındakileri bağlar, son öğe geçerli sayfa; görünür adlar şemayla aynı', async () => {
    const html = await ciz({ ogeler: OGELER, className: 'k' });
    assert.match(html, /<nav[^>]*aria-label="Konum"[^>]*class="k"|<nav[^>]*class="k"[^>]*aria-label="Konum"/);
    const baglantilar = [...html.matchAll(/<a [^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map((m) => [m[1], m[2]]);
    assert.deepEqual(baglantilar, [['/', 'Ana sayfa'], ['/kavram', 'Kavramlar']]);
    assert.match(html, /<span[^>]*aria-current="page"[^>]*>Haksız fiil<\/span>/);
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.equal(ld['@context'], 'https://schema.org');
    assert.deepEqual(ld.itemListElement.map((e) => e.name), ['Ana sayfa', 'Kavramlar', 'Haksız fiil']);
  });

  it('şemayı kendi grafiğine koyan sayfa için ld={false} betiği basmaz', async () => {
    const html = await ciz({ ogeler: OGELER, ld: false });
    assert.doesNotMatch(html, /application\/ld\+json/);
  });
});

// Adım 2: kırıntıyı gösterip şemayı basmayan sayfalar (kanun 46, kavram 31, makale 17, bölge yazısı 12, hesaplama 34).
describe('sayfalar kırıntıyı bileşenden basar', () => {
  const DOSYALAR = [
    'app/mevzuat/[kanunId]/page.tsx',
    'app/kavram/[slug]/page.tsx',
    'app/[category]/page.tsx',
    'app/[category]/[slug]/page.tsx',
    'components/BolgeMakaleView.tsx',
    'app/hesaplama/[slug]/page.tsx',
  ];
  for (const dosya of DOSYALAR) {
    it(dosya, async () => {
      const { readFileSync } = await import('node:fs');
      const kaynak = readFileSync(join(KOK, dosya), 'utf8');
      assert.match(kaynak, /<Kirinti\b/);
      assert.doesNotMatch(kaynak, /aria-label="(Konum|Breadcrumb|Sayfa konumu)"/, 'elle yazılmış kırıntı kalmış');
    });
  }
});
