/**
 * Node'un yerleşik tip-sıyırma desteği .ts dosyalarını çalıştırabiliyor; eksik
 * olan tek şey Next.js'in `@/…` takma adı ile uzantısız göreli içe aktarımlar.
 * Bu çözümleyici ikisini kapatır, böylece testler kopya değil GERÇEK kaynağı
 * ölçer.
 */
import { statSync } from 'node:fs';
import { resolve as pathResolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const KOK = pathResolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

function dosyaMi(p) {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
}

function ilkVarOlan(temel) {
  for (const aday of [temel, `${temel}.ts`, `${temel}.tsx`, `${temel}.mjs`, `${temel}.js`, pathResolve(temel, 'index.ts')]) {
    if (dosyaMi(aday)) return aday;
  }
  return null;
}

export async function resolve(specifier, context, next) {
  let hedef = null;

  if (specifier.startsWith('@/')) {
    hedef = ilkVarOlan(pathResolve(KOK, specifier.slice(2)));
  } else if (
    (specifier.startsWith('./') || specifier.startsWith('../')) &&
    context.parentURL?.startsWith('file:')
  ) {
    hedef = ilkVarOlan(fileURLToPath(new URL(specifier, context.parentURL)));
  }

  if (hedef) return next(pathToFileURL(hedef).href, context);
  return next(specifier, context);
}
