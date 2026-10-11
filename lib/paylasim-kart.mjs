/**
 * Paylaşım kartı (Open Graph görseli, 1200×630) — Aylık plan G20.
 * `app/og/[tur]/[anahtar]/route.tsx` bu ağacı `next/og` ImageResponse ile PNG'ye çevirir. JSX yerine `createElement`
 * kullanılır; böylece kart ağacı ve metin sığdırma kuralları derleyicisiz `node --test` ile sınanır.
 *
 * Reklam yasağı (TBB Reklam Yasağı Yönetmeliği m.7/1-d, m.7/1-e; G07): Kartta içerik başlığı, içerik türü, unvan ve ad
 * ("Av. Fethi Güzel") ile alan adı bulunur. Telefon, çağrı, "arabulucu" gibi sıfat ve "yer + avukat" kalıbı yoktur.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement as h } from 'react';
import { muhurSvg } from './marka-fg.mjs';
import { RENKLER } from './tasarim-jetonlari.mjs';

export const KART_BOYUT = { width: 1200, height: 630 };
export const KART_AD = 'Av. Fethi Güzel';
export const KART_ALAN = 'avfethiguzel.com';

/**
 * Kartın yazı tipleri (`assets/og/`, SIL OFL 1.1). Türkçe ğ, İ, ş `latin-ext` alt kümesindedir. Aynı aile adıyla
 * yüklenen ikinci alt küme Satori'de yok sayılıyor, eksik harf başka yazı tipinden çiziliyordu (2026-10-11 deneme
 * görüntüsü). Alt kümeler bu yüzden ayrı adla yüklenir ve `fontFamily` iki adı sırayla verir.
 * @returns {{ name: string, data: Buffer, weight: 500 | 600, style: 'normal' }[]}
 */
export function kartFontlari(kok = process.cwd()) {
  const oku = (ad) => readFileSync(join(kok, 'assets', 'og', ad));
  return [
    { name: 'Outfit', data: oku('outfit-latin-600-normal.woff'), weight: 600, style: 'normal' },
    { name: 'OutfitExt', data: oku('outfit-latin-ext-600-normal.woff'), weight: 600, style: 'normal' },
    { name: 'Jakarta', data: oku('plus-jakarta-sans-latin-500-normal.woff'), weight: 500, style: 'normal' },
    { name: 'JakartaExt', data: oku('plus-jakarta-sans-latin-ext-500-normal.woff'), weight: 500, style: 'normal' },
  ];
}

/** Başlığın uzunluğuna göre punto; en uzun başlık sözcük sınırında kısaltılır (en çok üç satır). */
export function baslikOlcusu(baslik) {
  const temiz = String(baslik).replace(/\s+/g, ' ').trim();
  const SINIR = 120;
  let metin = temiz;
  if (temiz.length > SINIR) {
    const kesik = temiz.slice(0, SINIR);
    const bosluk = kesik.lastIndexOf(' ');
    metin = `${kesik.slice(0, bosluk > 80 ? bosluk : SINIR).replace(/[\s,;:.—–-]+$/, '')}…`;
  }
  const n = metin.length;
  const punto = n <= 38 ? 76 : n <= 64 ? 64 : n <= 92 ? 54 : 48;
  return { metin, punto };
}

function muhurAdresi() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${muhurSvg(RENKLER.primary, RENKLER.cream)}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * @param {{ tur: string, baslik: string, ust?: string }} girdi  `tur` görünen tür etiketi ("Mevzuat ve şerh"),
 *   `ust` başlığın altındaki kısa bilgi satırı (ör. kanun numarası ya da madde sayısı).
 */
export function kartAgaci({ tur, baslik, ust }) {
  const { metin, punto } = baslikOlcusu(baslik);
  return h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: RENKLER.cream,
        padding: '64px 80px 0 80px',
        fontFamily: 'Jakarta, JakartaExt',
        color: RENKLER.charcoal,
      },
    },
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      h(
        'div',
        {
          style: {
            display: 'flex',
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: RENKLER.accent.ink,
            marginBottom: 28,
          },
        },
        tur,
      ),
      h(
        'div',
        {
          style: {
            display: 'flex',
            fontFamily: 'Outfit, OutfitExt',
            fontWeight: 600,
            fontSize: punto,
            lineHeight: 1.12,
            maxWidth: 1040,
          },
        },
        metin,
      ),
      ust
        ? h('div', { style: { display: 'flex', fontSize: 28, color: RENKLER.ink.muted, marginTop: 26 } }, ust)
        : null,
    ),
    h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: `2px solid ${RENKLER.primary}`,
          padding: '26px 0 40px 0',
        },
      },
      h(
        'div',
        { style: { display: 'flex', alignItems: 'center' } },
        h('img', { src: muhurAdresi(), width: 64, height: 64, style: { marginRight: 20 } }),
        h('div', { style: { display: 'flex', fontFamily: 'Outfit, OutfitExt', fontWeight: 600, fontSize: 34, color: RENKLER.primary } }, KART_AD),
      ),
      h('div', { style: { display: 'flex', fontSize: 26, color: RENKLER.ink.muted } }, KART_ALAN),
    ),
  );
}

/** Kartta görünen bütün metin (testler reklam kalıplarını bunun üzerinde arar). */
export function kartMetni(girdi) {
  const parcalar = [];
  (function topla(dugum) {
    if (dugum == null || typeof dugum === 'boolean') return;
    if (typeof dugum === 'string' || typeof dugum === 'number') return void parcalar.push(String(dugum));
    const cocuk = dugum.props?.children;
    (Array.isArray(cocuk) ? cocuk : [cocuk]).forEach(topla);
  })(kartAgaci(girdi));
  return parcalar.join(' | ');
}
