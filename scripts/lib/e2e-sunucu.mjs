/**
 * Uçtan uca koşucunun sunucu kararları (Aylık plan G22). Yan etkisizdir; süreç başlatma ve öldürme
 * `scripts/e2e-calistir.mjs`'tedir. Testler: `scripts/__tests__/e2e-sunucu.test.mjs`.
 */

/** `netstat -ano` çıktısında verilen portu LISTENING durumunda tutan sürecin kimliği, yoksa null. */
export function portSahibi(netstatCikti, port) {
  for (const satir of String(netstatCikti).split(/\r?\n/)) {
    const alan = satir.trim().split(/\s+/);
    if (alan.length < 5 || alan[3] !== 'LISTENING') continue;
    if (alan[1].endsWith(`:${port}`)) return Number(alan[4]);
  }
  return null;
}

/**
 * Port boşsa sunucu başlatılır. Doluysa koşucu durur: Kesilen bir oturumdan kalan `next start` eski derlemeyi
 * ve başlatıldığı andaki `next.config`'i sınar, ama başka bir oturumun canlı ölçümü de olabilir; öldürmek kullanıcıya bırakılır.
 */
export function portKarari(sahip) {
  if (!sahip) return { eylem: 'baslat' };
  const nextMi = /next(\.js)?["']?\s+start|next[\\/]dist[\\/]bin[\\/]next["']?\s+start/.test(sahip.komut || '');
  const ne = nextMi ? 'bir next start sunucusu' : 'başka bir süreç';
  return {
    eylem: 'dur',
    mesaj:
      `Port tutuluyor: ${ne} (pid ${sahip.pid}). Koşucu bu sürece dokunmaz.` +
      (nextMi ? ' Eski derlemeyi sınamamak için sunucuyu kapatıp yeniden deneyin (next start).' : ''),
  };
}

/** `getir(url)` 200 dönene kadar bekler; `sureMs` dolarsa hata verir. Bağlantı hatası beklemenin parçasıdır. */
export async function hazirBekle(url, { sureMs = 60_000, aralikMs = 500, getir = fetch } = {}) {
  const son = Date.now() + sureMs;
  for (;;) {
    try {
      const yanit = await getir(url);
      if (yanit.status === 200) return true;
    } catch {
      // sunucu henüz dinlemiyor
    }
    if (Date.now() >= son) throw new Error(`${url} ${sureMs} ms içinde 200 dönmedi`);
    await new Promise((r) => setTimeout(r, aralikMs));
  }
}
