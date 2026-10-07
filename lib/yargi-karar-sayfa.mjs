/**
 * Yargıtay karar sayfasının sunucuda basılan bilgisi (Aylık plan G14 adım 4). Kaynak, yayın indeksinin satırıdır
 * (`data/yayin/yargi-index.json.gz`, `lib/uyelik/karar-text.ts`). Herkese açık olan yalnız künye, daire, tarih, konu
 * ve kararın başıdır (indeksteki `e`, en çok ~240 karakter); tam metin üyelik API'sinden istemcide gelir.
 */

/**
 * Karar sayfaları dizine kapalıdır. ~39 bin sayfanın dizine açılması ince içerik riskini (G11) yeniden doğurur ve ücretli
 * içerik için ayrı yapılandırılmış veri ister; karar kullanıcıdadır (raporlar/kullaniciya-sorular.md, soru 20).
 */
export const KARAR_SAYFASI_DIZINDE = false;

export const ACIKLAMA_SINIRI = 160;
const BASLIK_SINIRI = 110;

/** API rotasıyla aynı kural (`app/api/yargi/[...path]/route.ts`). */
export function kararKimligiGecerli(id) {
  return typeof id === 'string' && /^[0-9A-Za-z._-]{3,64}$/.test(id);
}

function sade(metin) {
  return String(metin || '').replace(/\s+/g, ' ').trim();
}

function kes(metin, sinir) {
  if (metin.length <= sinir) return metin;
  const parca = metin.slice(0, sinir - 1);
  const bosluk = parca.lastIndexOf(' ');
  const govde = (bosluk > sinir * 0.6 ? parca.slice(0, bosluk) : parca).replace(/[\s,;:.…]+$/, '');
  return `${govde}…`;
}

/**
 * @param {{ i: string, k: string, d?: string, t?: string, e?: string, j?: string[] }} satir  yayın indeksi satırı
 * @returns {{ id: string, kunye: string, daire: string, tarih: string, konu: string[], ozet: string,
 *   baslik: string, aciklama: string }}
 */
export function kararSayfaBilgisi(satir) {
  const kunye = sade(satir.k);
  const daire = sade(satir.d);
  const tarih = sade(satir.t);
  const konu = Array.isArray(satir.j) ? satir.j.map(sade).filter(Boolean) : [];
  const ozet = sade(satir.e);

  const konulu = konu.length ? `${kunye} · ${konu[0]}` : kunye;
  const baslik = konulu.length <= BASLIK_SINIRI ? konulu : kunye;

  const mahkeme = daire ? (/^Yargıtay\b/.test(daire) ? daire : `Yargıtay ${daire}`) : 'Yargıtay';
  const giris = tarih ? `${mahkeme}, ${tarih}.` : `${mahkeme}.`;
  const govde = ozet || `${kunye}. Künye ve kararın başı herkese açık, tam metin üyelikle okunur.`;
  const aciklama = kes(`${giris} ${govde}`, ACIKLAMA_SINIRI);

  return { id: String(satir.i), kunye, daire, tarih, konu, ozet, baslik, aciklama };
}
