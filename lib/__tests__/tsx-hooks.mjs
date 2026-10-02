/**
 * Bileşen testleri için yükleyici: Node tip sıyırmayla `.ts` çalıştırır ama JSX'i çeviremez. `.tsx` kaynağını
 * projedeki TypeScript ile (react-jsx) ESM'e çevirir; `@/…` çözümlemesi `lib/uyelik/__tests__/ts-hooks.mjs`'te kalır.
 *   register("../uyelik/__tests__/ts-hooks.mjs", import.meta.url);
 *   register("./tsx-hooks.mjs", import.meta.url);
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

/** `next` paketinin `exports` haritası yok; ESM `next/link` gibi uzantısız alt yolları çözemez. */
export async function resolve(specifier, context, next) {
  if (/^next\/[\w-]+$/.test(specifier)) return next(`${specifier}.js`, context);
  return next(specifier, context);
}

export async function load(url, context, next) {
  if (!url.startsWith('file:') || !url.endsWith('.tsx')) return next(url, context);
  const kaynak = await readFile(fileURLToPath(url), 'utf8');
  const { outputText } = ts.transpileModule(kaynak, {
    fileName: fileURLToPath(url),
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      verbatimModuleSyntax: false,
    },
  });
  return { format: 'module', source: outputText, shortCircuit: true };
}
