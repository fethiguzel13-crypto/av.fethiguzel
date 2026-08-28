import React from 'react';
import { FG_PATH, FG_TRANSFORM, DISK_R } from '@/lib/marka-fg.mjs';

/**
 * MARKA İŞARETİ — «FG» mührü.
 *
 * Av. Fethi Güzel'in baş harfleri, dolu bir disk üzerine oyulmuş hâlde.
 * Çizim `lib/marka-fg.mjs` ortak kaynağından gelir; site ve uygulama aynı
 * dosyayı okur, ikisi ayrışamaz.
 *
 * ─── Neden monogram, neden stok ikon değil ─────────────────────────────────
 * Önce § (paragraf işareti), sonra terazi ikonu denendi. § küçük puntoda
 * harf gibi değil belirsiz bir kıvrım gibi okunuyordu; terazi ise her hukuk
 * uygulamasında bulunan stok bir simge ve kimseyi işaret etmiyordu. Marka,
 * kişinin ADI olmalı — baş harfler yalnız bir kişiyi gösterir.
 *
 * Dolu disk + oyuk harf düzeni mühür geleneğine yaslanır: hukuk metninin
 * kendi görsel dili. Ölçüldü, 28 pikselde bile okunur kalan tek varyant
 * buydu; halkalı ve yalın varyantlarda harfler o boyutta çamurlaşıyordu.
 *
 * ─── Neden maske ───────────────────────────────────────────────────────────
 * Harfler diskten OYULUR, üstüne çizilmez. Böylece işaret tek renkle
 * tanımlanır ve altındaki zemin harflerin içinden görünür — bildirim
 * çubuğunda olduğu gibi yalnız alfa kanalının kullanıldığı yerlerde de
 * doğru çalışır.
 */

export default function MarkaIsareti({
  size = 26,
  renk = 'currentColor',
  className,
}: {
  size?: number;
  renk?: string;
  className?: string;
}) {
  // Maske kimliği sayfada benzersiz olmalı; aynı anda iki işaret çizilirse
  // ikisi de ilk maskeyi kullanır ve biri kaybolur. `useId` SSR ile de uyumlu.
  const id = React.useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      className={className}
      role="img"
      aria-label="Av. Fethi Güzel"
    >
      <defs>
        <mask id={id}>
          <rect width="512" height="512" fill="black" />
          <circle cx="256" cy="256" r={DISK_R} fill="white" />
          <g transform={FG_TRANSFORM}>
            <path d={FG_PATH} fill="black" />
          </g>
        </mask>
      </defs>
      <rect width="512" height="512" fill={renk} mask={`url(#${id})`} />
    </svg>
  );
}
