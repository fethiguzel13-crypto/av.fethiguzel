import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/*
  G17 adım 4: Karar arşivi istatistik sayfası (`/yargi-kararlari/istatistik`). Veri `public/data/yargi-dagilim.json`'dan
  (adım 1) gelir, grafikler `components/grafik/`'tendir (adım 3). Sayfa dizine açık bir içerik sayfasıdır: kendi canonical'ı,
  kırıntısı ve site haritası kaydı vardır, arşiv sayfasından ve ana sayfadaki karar önizlemesinden bağlantı alır (G12).
  Açıklamalar yalnız sayımı betimler; yıl grafiği Yargıtay'ın yıllık karar sayısını değil, arşivin kapsamını gösterir.
*/
const kok = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const oku = (d) => readFileSync(join(kok, d), 'utf8');
const SAYFA = 'app/yargi-kararlari/istatistik/page.tsx';
const YOL = '/yargi-kararlari/istatistik';

test('sayfa veriyi dağılım dosyasından alır ve üç grafik bileşenini kullanır', () => {
  const s = oku(SAYFA);
  assert.match(s, /from '@\/public\/data\/yargi-dagilim\.json'/);
  for (const b of ['CubukGrafik', 'ZamanGrafik', 'GrafikTablo']) {
    assert.match(s, new RegExp(`import ${b} from '@/components/grafik/${b}'`), b);
  }
  // Sayılar elle yazılmaz.
  assert.doesNotMatch(s, /\b(?:114\.?625|39\.?718|74\.?907)\b/);
});

test('kendi canonical adresi, kırıntısı ve site haritası kaydı vardır', () => {
  const s = oku(SAYFA);
  assert.match(s, new RegExp(`'https://www\\.avfethiguzel\\.com${YOL}'`));
  assert.match(s, /canonical: (?:ADRES|'https:)/);
  assert.match(s, /\{ ad: 'Yargıtay karar arşivi', yol: '\/yargi-kararlari' \}/);
  assert.match(s, new RegExp(`yol: '${YOL}'`));
  assert.match(oku('app/sitemap.ts'), new RegExp(`\\$\\{baseUrl\\}${YOL}\``));
});

test('arşiv sayfası ve ana sayfadaki karar önizlemesi sayfaya bağlanır, sayfa arşive geri bağlanır', () => {
  assert.match(oku('app/yargi-kararlari/page.tsx'), new RegExp(`href="${YOL}"`));
  assert.match(oku('components/YargiPreview.tsx'), new RegExp(`href="${YOL}"`));
  assert.match(oku(SAYFA), /href="\/yargi-kararlari"/);
});

test('yıl grafiğinin kapsam notu ve süzgeç açıklaması yazılıdır, reklam dili yoktur', () => {
  const s = oku(SAYFA);
  assert.match(s, /yıllık karar sayısını göstermez/);
  assert.match(s, /benzer|emsal niteliği zayıf/);
  assert.doesNotMatch(s, /en iyi|en başarılı|uzman avukat|lider|garanti|kazan|hemen ara|bizi arayın|ücretsiz danışma|en kapsamlı|en büyük/i);
});

test('tasarım denetimi listesinde yer alır', async () => {
  const { DENETIM_SAYFALARI } = await import('../tasarim-denetim.mjs');
  assert.ok(DENETIM_SAYFALARI.some((p) => p.yol === YOL));
});
