"use client";

import React from "react";

/**
 * FG Monogram — Konsept A: Serif Kenetlenme.
 *
 * F ve G harfleri serif tipografiyle kenetleniyor; F'nin yatay çubuğu
 * hafifçe uzanarak iki yanından ince çizgiyle terazi kefeleri sarkıtıyor.
 *
 * İki varyant:
 *   - `variant="light"` → beyaz, koyu zemin üstüne (hero, mobil başlık)
 *   - `variant="brand"` → terracotta (#CC5833), açık zemin üstüne (navbar scrolled)
 *
 * Üç boyut:
 *   - `size="sm"` → 28px (navbar, mobil başlık)
 *   - `size="md"` → 40px (footer, kartlar)
 *   - `size="lg"` → 64px (hero, splash)
 */

type BrandProps = {
  size?: "sm" | "md" | "lg";
  variant?: "brand" | "light";
  className?: string;
};

const SIZES = { sm: 28, md: 40, lg: 64 } as const;

export default function BrandMark({
  size = "sm",
  variant = "brand",
  className = "",
}: BrandProps) {
  const px = SIZES[size];
  const fill = variant === "light" ? "#FFFFFF" : "#CC5833";

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="FG Hukuk"
      role="img"
    >
      {/*
        F harfi — sol tarafta, klasik serif.
        Dikme (stem) kalın, serifleri belirgin.
      */}
      {/* F dikme */}
      <rect x="14" y="18" width="12" height="84" rx="1" fill={fill} />
      {/* F üst serif (sol) */}
      <rect x="8" y="18" width="18" height="7" rx="1" fill={fill} />
      {/* F alt serif (sol) */}
      <rect x="8" y="95" width="18" height="7" rx="1" fill={fill} />
      {/* F üst çubuk */}
      <rect x="14" y="18" width="52" height="9" rx="1" fill={fill} />
      {/* F üst çubuk serif (sağ uç) */}
      <rect x="60" y="18" width="8" height="5" rx="1" fill={fill} />
      {/* F orta çubuk — terazi çubuğu */}
      <rect x="14" y="52" width="56" height="7" rx="1" fill={fill} />

      {/*
        Terazi — F'nin orta çubuğunun iki ucundan sarkan kefeler.
        Sol kefe çubuğun sol ucundan, sağ kefe sağ ucundan.
      */}
      {/* Sol terazi ipi */}
      <line x1="18" y1="59" x2="14" y2="74" stroke={fill} strokeWidth="1.5" />
      <line x1="18" y1="59" x2="22" y2="74" stroke={fill} strokeWidth="1.5" />
      {/* Sol kefe */}
      <path d="M10 74 L14 74 L18 74 L22 74 L26 74 L23 80 L13 80 Z" fill={fill} opacity="0.85" />

      {/* Sağ terazi ipi */}
      <line x1="66" y1="59" x2="62" y2="74" stroke={fill} strokeWidth="1.5" />
      <line x1="66" y1="59" x2="70" y2="74" stroke={fill} strokeWidth="1.5" />
      {/* Sağ kefe */}
      <path d="M58 74 L62 74 L66 74 L70 74 L74 74 L71 80 L61 80 Z" fill={fill} opacity="0.85" />

      {/*
        G harfi — sağ tarafta, F ile kenetleniyor.
        C formu + ortadan sağa dönen iç çubuk.
      */}
      {/* G ana kavsi */}
      <path
        d="M100 30
           C82 14, 54 20, 54 60
           C54 100, 82 106, 100 90
           L100 84
           C86 96, 62 92, 62 60
           C62 28, 86 22, 100 36
           Z"
        fill={fill}
      />
      {/* G iç çubuk (yatay) */}
      <rect x="82" y="56" width="24" height="8" rx="1" fill={fill} />
      {/* G iç çubuk (dikey kısa) */}
      <rect x="98" y="56" width="8" height="36" rx="1" fill={fill} />
      {/* G alt serif */}
      <rect x="92" y="86" width="18" height="6" rx="1" fill={fill} />
    </svg>
  );
}
