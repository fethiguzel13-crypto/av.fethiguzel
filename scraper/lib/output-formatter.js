// Tüm scraper'lar bu formatta JSON üretir
// Skill bu yapıyı bilerek brifing oluşturur

export function makeOutput({ source, fetchedAt, ok, items = [], error = null, meta = {} }) {
  return {
    source,
    fetchedAt: fetchedAt || new Date().toISOString(),
    ok,
    itemCount: items.length,
    items,
    error,
    meta,
  };
}

export function printJSON(obj) {
  process.stdout.write(JSON.stringify(obj, null, 2) + "\n");
}

export function printError(source, error, meta = {}) {
  printJSON(
    makeOutput({
      source,
      ok: false,
      error: error instanceof Error ? { message: error.message, stack: error.stack } : String(error),
      meta,
    })
  );
}
