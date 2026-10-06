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

describe('ana sayfa görselleri', () => {
  // Ölçüm (2026-10-06, Lighthouse mobil): kahraman arka planı her ekrana 2000 px (134 KB), 44 px'lik portre
  // 900×900 dosyadan (90 KB; mobilde gizliyken de iniyor).
  const hero = () => readFileSync(join(KOK, 'components/Hero.tsx'), 'utf8');

  it('arka plan görseli ekran genişliğine göre seçilir', () => {
    const img = hero().match(/<img\s+src="https:\/\/images\.unsplash[\s\S]*?\/>/)?.[0];
    assert.ok(img, 'arka plan görseli bulunamadı');
    assert.match(img, /srcSet=\{\[640,/, 'en küçük aday 640 px olmalı');
    assert.match(img, /sizes="100vw"/);
  });

  it('kahraman portresi küçük dosyadan gelir', async () => {
    const m = hero().match(/src="(\/images\/av-fethi-guzel[^"]*)"[\s\S]{0,120}?width=\{44\}/);
    assert.ok(m, 'portre bulunamadı');
    const { statSync } = await import('node:fs');
    const kb = statSync(join(KOK, 'public', m[1])).size / 1024;
    assert.ok(kb < 12, `portre ${kb.toFixed(0)} KB`);
  });
});

describe('GSAP', () => {
  // Ölçüm (2026-10-06, ana sayfa, Lighthouse mobil): LCP öğesi kahraman paragrafı; GSAP hidrasyonda opaklığı 0'a çekip
  // yeniden açtığı için LCP bütün betiklerin bitişine bağlanıyordu (render delay 5,5 sn). GSAP + ScrollTrigger 140 KB
  // ilk yükteydi; yalnız ekranın altındaki kaydırma animasyonları kullanıyor.
  const oku = (ad) => readFileSync(join(KOK, 'components', ad), 'utf8');

  it('kahraman girişi CSS ile; Hero GSAP yüklemez', () => {
    assert.doesNotMatch(oku('Hero.tsx'), /from ['"]gsap/);
    const css = readFileSync(join(KOK, 'app/globals.css'), 'utf8');
    assert.match(css, /\.hero-fade\s*\{[^}]*animation:/);
    assert.match(css, /prefers-reduced-motion[\s\S]{0,400}\.hero-fade/);
  });

  it('kaydırma animasyonları GSAP\'ı ilk yükte değil, sonradan yükler', () => {
    for (const ad of ['About.tsx', 'Articles.tsx', 'DailyNewsCards.tsx']) {
      const kaynak = oku(ad);
      assert.doesNotMatch(kaynak, /^import[^\n]*from ['"]gsap/m, `${ad} GSAP'ı statik içe aktarıyor`);
      assert.match(kaynak, /gsapGorununce\(/, `${ad} gsapGorununce kullanmıyor`);
    }
    const yardimci = readFileSync(join(KOK, 'lib/gsap-yukle.ts'), 'utf8');
    assert.doesNotMatch(yardimci, /^import[^\n]*from ['"]gsap/m);
    assert.match(yardimci, /import\(['"]gsap['"]\)/);
    assert.match(yardimci, /IntersectionObserver/);
  });
});

describe('ön getirme', () => {
  // Ölçüm (2026-10-06, makale sayfası, mobil): yüklemeden sonra 18 RSC ön getirmesi; alt menünün beş sekmesi her
  // sayfada görünür alanda olduğundan beş rota (ana sayfanın 140 KB'lık GSAP parçası dahil) her görüntülemede iniyordu.
  // Sekme ön getirmesi dokunma anına çekilir (pointerdown → tıklamadan ~100 ms önce).
  it('alt menü sekmeleri görünür alana girince ön getirilmez, dokununca getirilir', () => {
    const kaynak = readFileSync(join(KOK, 'components/MobileBottomNav.tsx'), 'utf8');
    const link = kaynak.match(/<Link\b[\s\S]*?>/)?.[0];
    assert.ok(link, 'Link bulunamadı');
    assert.match(link, /prefetch=\{false\}/);
    assert.match(link, /onPointerDown=/);
    assert.match(kaynak, /router\.prefetch\(/);
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
  // 2026-10-06 sonra ölçümü: Plex Mono'yu önden yüklememek ders notunda CLS'yi 0'dan 0,137'ye çıkardı; h1'in üstündeki
  // eş aralıklı etiket satırı yedek yazı tipiyle bir satır fazla kırılıyor, yazı tipi gelince sayfa 15 px kayıyordu.
  it('süs yazı tipi önden yüklenmez; gövde, başlık ve ilk ekrandaki eş aralıklı etiketler önden yüklenir', () => {
    const kaynak = readFileSync(join(KOK, 'app/layout.tsx'), 'utf8');
    const ayar = (aile) => {
      const m = kaynak.match(new RegExp(`=\\s*${aile}\\(\\{([\\s\\S]*?)\\}\\)`));
      assert.ok(m, `${aile} çağrısı bulunamadı`);
      return m[1];
    };
    for (const aile of ['Cormorant_Garamond']) {
      assert.match(ayar(aile), /preload:\s*false/, `${aile} hâlâ önden yükleniyor`);
    }
    for (const aile of ['Plus_Jakarta_Sans', 'Outfit', 'IBM_Plex_Mono']) {
      assert.doesNotMatch(ayar(aile), /preload:\s*false/, `${aile} ilk ekranda gerekli`);
    }
  });
});

describe('önbellek başlıkları', () => {
  // `public/` dosyaları Next'te varsayılan `Cache-Control: public, max-age=0` ile sunulur; görseller her ziyarette yeniden
  // doğrulanıyordu (kahraman portresi, hakkında fotoğrafı, bölge görselleri). Çalışma anında çekilen veri `/data/` altında.
  const kurallar = async () => {
    const { default: yapilandirma } = await import(pathToFileURL(join(KOK, 'next.config.ts')).href);
    return yapilandirma.headers();
  };
  const maxAge = (liste, kaynak) => {
    const deger = liste.find((k) => k.source === kaynak)?.headers.find((b) => b.key === 'Cache-Control')?.value || '';
    return Number(deger.match(/max-age=(\d+)/)?.[1] || 0);
  };

  it('çalışma anında çekilen veri dosyaları önbellekte kalır', async () => {
    assert.ok(maxAge(await kurallar(), '/data/:path*') > 0);
  });

  it('içerik özeti taşımayan görsel klasörleri en az bir gün önbellekte kalır', async () => {
    const liste = await kurallar();
    for (const kaynak of ['/images/:path*', '/bolge/:path*']) assert.ok(maxAge(liste, kaynak) >= 86400, kaynak);
  });
});

describe('ilk yük betik bütçesi', () => {
  // G13 adım 6: anahtar sayfaların ilk yük betik toplamı derleme taramasında tabana bağlanır; taban yalnız düşer.
  const modul = () => import(pathToFileURL(join(KOK, 'scripts/lib/betik-butce.mjs')).href);

  it('ilk yük betikleri: Next parçaları, tekrar ve noModule dolgusu hariç', async () => {
    const { ilkYukBetikleri } = await modul();
    const html =
      '<script src="/_next/static/chunks/a.js" async=""></script><script src="/_next/static/chunks/b.js" noModule=""></script>' +
      '<script src="/_next/static/chunks/a.js" async=""></script><script src="https://www.googletagmanager.com/gtm.js"></script>' +
      '<script id="_R_" src="/_next/static/chunks/c.js" async=""></script><script type="application/ld+json">{}</script>';
    assert.deepEqual(ilkYukBetikleri(html), ['/_next/static/chunks/a.js', '/_next/static/chunks/c.js']);
  });

  it('bütçe: payı aşan artış kırar, düşüş tabanı indirir, artış tabanı yükseltmez', async () => {
    const { butceKarsilastir } = await modul();
    const taban = { '/': 500, '/rehber': 300, '/kavram': 200 };
    const s = butceKarsilastir(taban, { '/': 520, '/rehber': 250, '/kavram': 203 }, 0.02);
    assert.deepEqual(s.asan.map((a) => a.sayfa), ['/']);
    assert.deepEqual(s.dusen.map((a) => a.sayfa), ['/rehber']);
    assert.deepEqual(s.yeniTaban, { '/': 500, '/rehber': 250, '/kavram': 200 });
  });

  it('tabandaki sayfa derlemede yoksa bütçe kırılır', async () => {
    const { butceKarsilastir } = await modul();
    assert.deepEqual(butceKarsilastir({ '/': 500 }, {}, 0.02).eksik, ['/']);
  });

  it('derleme taraması bütçe betiğini çalıştırır; taban anahtar sayfaları kapsar', async () => {
    const kalite = readFileSync(join(KOK, 'scripts/kalite.mjs'), 'utf8');
    assert.match(kalite, /derleme-butce-tara\.mjs/);
    const taban = JSON.parse(readFileSync(join(KOK, 'scripts/betik-butce-taban.json'), 'utf8'));
    for (const sayfa of ['/', '/rehber/kidem-tazminati', '/hesaplama/kidem', '/ders-notlari']) assert.ok(taban[sayfa] > 0, sayfa);
  });
});
