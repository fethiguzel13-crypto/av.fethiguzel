/**
 * Test yükleyicisi: Next kaynağı JSON'u öznitelik vermeden içe aktarır (`import x from './a.json'`); Node ESM ise
 * `with { type: 'json' }` ister. Bu kanca eksik özniteliği ekler.
 *   register("./json-hooks.mjs", import.meta.url);
 */
export async function load(url, context, next) {
  if (url.startsWith('file:') && url.endsWith('.json') && !context.importAttributes?.type) {
    return next(url, { ...context, importAttributes: { ...context.importAttributes, type: 'json' } });
  }
  return next(url, context);
}
