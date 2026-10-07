import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import { RENKLER } from "./lib/tasarim-jetonlari.mjs";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Tek kaynak lib/tasarim-jetonlari.mjs; metin tonları (accent-ink, accent-light, ink-muted) kontrast testlidir (G15).
      colors: {
        ...RENKLER,
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['var(--font-sans)', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'Outfit', 'system-ui', 'sans-serif'],
        drama: ['var(--font-drama)', '"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', '"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(26, 26, 26, 0.08), 0 1px 3px rgba(26, 26, 26, 0.04)',
        lift: '0 20px 50px -16px rgba(26, 26, 26, 0.14), 0 4px 12px rgba(26, 26, 26, 0.06)',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [typography],
};
export default config;
