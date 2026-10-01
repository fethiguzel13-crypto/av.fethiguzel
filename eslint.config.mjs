import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Derleme çıktıları ve günlükler (Aylık plan G01): kaynak değil.
    "logs/**",
    "mobile/android/**",
    "mobile/www/**",
    "mobile/mobile/**",
    "public/**",
    // Kökteki eski tek seferlik araç betikleri (2026-05 dönemi); yeni kod scripts/ altındadır.
    "*.js",
  ]),
  // CommonJS betikleri (.cjs): paket "type": "module" olduğundan require kullanan eski betikler .cjs'e
  // taşındı (önceden .js uzantısıyla çalışmıyorlardı). CommonJS'te require doğru içe aktarma biçimidir.
  {
    files: ["**/*.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
]);

export default eslintConfig;
