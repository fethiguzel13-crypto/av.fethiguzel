/**
 * Mevzuat içerik paketlerinin (`{kanun}.json.gz`) kaynak adresleri. `app/api/content-pack` ve
 * `app/api/pack-health` aynı süzgeci ve aynı güvenilir alan adı listesini kullanır (G04/B8–B9).
 */

const SITE_ALANLARI = ['avfethiguzel.com', 'www.avfethiguzel.com'];
const URETIM_PAKETLERI = 'https://www.avfethiguzel.com/content-packs';
const JSDELIVR_PAKETLERI = 'https://cdn.jsdelivr.net/gh/fethiguzel13-crypto/av.fethiguzel@main/content-packs';
const YEREL_RE = /^(localhost|127\.0\.0\.1)(:\d+)?$/;

type Ortam = Record<string, string | undefined>;

/** URL'den gelen kanun kimliği: küçük harf, yalnız `[a-z0-9-]`, en çok 64 karakter; uymazsa null. */
export function kanunKimligi(raw: unknown): string | null {
  const id = String(raw ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
  return id && id.length <= 64 ? id : null;
}

function alanAdi(deger: string | undefined): string {
  return String(deger || '').replace(/^https?:\/\//, '').replace(/\/.*$/, '');
}

/**
 * Denenecek adresler, öncelik sırasıyla. İsteğin kendi kökeni yalnız sitenin alan adı, bu dağıtımın
 * adresi ya da yerel sunucuysa kullanılır; Host başlığı istemcinin elindedir ve başka bir sunucuya
 * istek attırmak için kullanılamamalıdır.
 */
export function paketAdresleri(requestUrl: string, kanunId: string, env: Ortam = process.env): string[] {
  const dosya = `${encodeURIComponent(kanunId)}.json.gz`;
  const vercel = alanAdi(env.VERCEL_URL);
  const guvenilir = new Set([...SITE_ALANLARI, vercel, alanAdi(env.VERCEL_PROJECT_PRODUCTION_URL)].filter(Boolean));

  const adresler: string[] = [];
  try {
    const istek = new URL(requestUrl);
    if (guvenilir.has(istek.host) || YEREL_RE.test(istek.host)) {
      adresler.push(`${istek.origin}/packs/${dosya}`, `${istek.origin}/content-packs/${dosya}`);
    }
  } catch {
    /* geçersiz istek adresi: yalnız sabit kaynaklar */
  }
  if (vercel) adresler.push(`https://${vercel}/packs/${dosya}`, `https://${vercel}/content-packs/${dosya}`);
  adresler.push(`${URETIM_PAKETLERI}/${dosya}`, `${JSDELIVR_PAKETLERI}/${dosya}`);
  return [...new Set(adresler)];
}
