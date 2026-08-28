"use client";

import React from "react";
import { FG_PATH, FG_TRANSFORM, DISK_R } from "@/lib/marka-fg.mjs";

/**
 * MARKA İŞARETİ — «FG» mührü.
 *
 * Av. Fethi Güzel'in baş harfleri, dolu bir disk üzerine oyulmuş hâlde.
 *
 * ─── Neden monogram ────────────────────────────────────────────────────────
 * Marka, kişinin adının kendisi. Terazi, tokmak, kitap gibi stok simgeler her
 * hukuk sitesinde bulunur ve kimseyi işaret etmez; baş harfler yalnız bir
 * kişiyi gösterir. Dolu disk + oyuk harf düzeni mühür geleneğine yaslanır —
 * hukuk metninin kendi görsel dili.
 *
 * ─── Neden YOL, yazı tipi değil ────────────────────────────────────────────
 * Harf gövdeleri daha önce elle dikdörtgenlerle yaklaşık olarak kuruluyordu.
 * Şimdi gerçek bir yazı tipinin dış hattı kullanılıyor; hiçbir yazı tipinin
 * kurulu olmasına bağlı değil. Bu bir kez ölçülerek öğrenildi:
 * `font-family="Cormorant Garamond"` yazan bir SVG, o yazı tipi bulunmayan
 * makinede var olmayan bir fontla BİREBİR aynı çıktıyı veriyordu — logo
 * sessizce bozuluyordu.
 *
 * Kaynak: Lora Italic (SIL Open Font License 1.1 — dış hattan logo türetmeye
 * açıkça izin verir). Çizim `lib/marka-fg.mjs` içinde; MOBİL UYGULAMA DA aynı
 * dosyayı okur, iki yüzey ayrışamaz.
 *
 * ─── Neden maske ───────────────────────────────────────────────────────────
 * Harfler diskten OYULUR, üstüne çizilmez. İşaret tek renkle tanımlanır ve
 * altındaki zemin harflerin içinden görünür.
 */

type BrandProps = {
  size?: "sm" | "md" | "lg";
  variant?: "brand" | "light" | "dark";
  className?: string;
};

const SIZES = { sm: 28, md: 40, lg: 64 } as const;

const RENK = {
  /** Açık zemin üstünde — sitenin kiremit turuncusu. */
  brand: "#CC5833",
  /** Koyu zemin üstünde. */
  light: "#FFFFFF",
  /** Turuncu zemin üstünde. */
  dark: "#1A1A1A",
} as const;

export default function BrandMark({
  size = "sm",
  variant = "brand",
  className = "",
}: BrandProps) {
  const px = SIZES[size];
  const fill = RENK[variant] ?? RENK.brand;

  /*
    Maske kimliği sayfada benzersiz olmalı: Navbar ve Footer aynı anda
    çizildiğinde iki işaret de ilk maskeyi kullanır ve biri kaybolur.

    `useId` kullanılır çünkü sayaç sunucu ve istemcide farklı değer üretiyor
    ve React hidrasyon uyuşmazlığı bildiriyordu.
  */
  const id = React.useId();

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 512 512"
      className={className}
      aria-label="Av. Fethi Güzel"
      role="img"
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
      <rect width="512" height="512" fill={fill} mask={`url(#${id})`} />
    </svg>
  );
}
