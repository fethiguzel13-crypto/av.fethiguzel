/**
 * Yayınlanabilir rehber seçimi — sayfa (published.ts), site haritası ve arama (scripts/lib/read-guides.mjs)
 * için tek kural (Aylık plan G11).
 *
 * Öncelik: ELLE YAZILAN > yeniden yazılan (makine) > üretilen (makine). İnsanın yazdığı metin her zaman kazanır.
 * Makine çıktısının iki kovası da kalite kapısından geçer; ince bulunan yeniden yazım yayından düşer ve aynı
 * slugdaki üretilmiş sürüm onun yerine geçmez (o da kalıp metindir). Elenen rehber silinmez; sayfası noindex kalır.
 *
 * @template {{ slug: string }} T
 * @param {{ authored: T[], rewritten: T[], generated: T[] }} kovalar
 * @param {(a: T) => boolean} denetle  kalite kapısı (auditGuide(a).publishable)
 * @returns {{ published: T[], rewritten: T[], withdrawn: number }}
 */
export function rehberleriSec({ authored, rewritten, generated }, denetle) {
  const elle = new Set(authored.map((a) => a.slug));
  const makine = rewritten.filter((a) => !elle.has(a.slug));
  const makineGecen = makine.filter(denetle);
  const alinan = new Set([...elle, ...makine.map((a) => a.slug)]);
  const uretim = generated.filter((a) => !alinan.has(a.slug));
  const uretimGecen = uretim.filter(denetle);
  return {
    published: [...authored, ...makineGecen, ...uretimGecen],
    rewritten: makineGecen,
    withdrawn: makine.length - makineGecen.length + (uretim.length - uretimGecen.length),
  };
}

/**
 * Rehber sayfasının durumu; sayfa robots kararını yalnız buradan alır, böylece haritayla ayrışmaz.
 * Yayındaysa seçilen sürüm dizine açıktır. Değilse yuvayı tutan sürüm (önce yeniden yazım, yoksa üretilmiş)
 * yayından düşme gerekçesiyle döner; üretilmiş sürüm kapıdan geçse de dizine açılmaz (yukarıdaki kural).
 *
 * @template {{ slug: string }} T
 * @param {string} slug
 * @param {T[]} published  rehberleriSec(...).published
 * @param {{ rewritten: T[], generated: T[] }} kovalar
 * @param {(a: T) => string | undefined} gerekce  yayından düşme gerekçesi (auditGuide(a).reason)
 * @returns {{ article: T, publishable: boolean, reason?: string } | null}
 */
export function rehberSayfaDurumu(slug, published, { rewritten, generated }, gerekce) {
  const yayinda = published.find((a) => a.slug === slug);
  if (yayinda) return { article: yayinda, publishable: true };
  const article = rewritten.find((a) => a.slug === slug) || generated.find((a) => a.slug === slug);
  if (!article) return null;
  return { article, publishable: false, reason: gerekce(article) };
}

/**
 * "Bunlar da işinize yarar" listesi (G12): yalnız yayındaki rehberler. Önce kaynağın kendi `related` sırası,
 * eksik kalırsa aynı kategorideki yayındaki rehberler; kaynak ve tekrar atlanır.
 *
 * @template {{ slug: string, category?: string, related?: string[] }} T
 * @param {T} kaynak
 * @param {T[]} published
 * @param {number} sinir
 * @returns {T[]}
 */
export function ilgiliRehberler(kaynak, published, sinir) {
  const bySlug = new Map(published.map((a) => [a.slug, a]));
  const alinan = new Set([kaynak.slug]);
  const out = [];
  const ekle = (a) => {
    if (!a || alinan.has(a.slug) || out.length >= sinir) return;
    alinan.add(a.slug);
    out.push(a);
  };
  for (const s of kaynak.related || []) ekle(bySlug.get(s));
  for (const a of published) if (a.category === kaynak.category) ekle(a);
  return out;
}

/**
 * Rehber sayfasının iç bağlantıları (G12): yalnız açık hedefe. Yayından düşen rehbere ve var olmayan kategoriye giden
 * bağlantı, aynı adresin tekrarı ve yayından düşen ana rehber (`pillar`) göndermesi çıkar; kaynak nesne değişmez.
 *
 * @template {{ links?: { label: string, href: string }[], pillar?: string }} T
 * @param {T} article
 * @param {{ rehberler: Set<string>, kategoriler: Set<string> }} acik
 * @returns {T}
 */
export function rehberBaglantilariniSuz(article, { rehberler, kategoriler }) {
  const goruldu = new Set();
  const links = (article.links || []).filter((l) => {
    if (goruldu.has(l.href)) return false;
    goruldu.add(l.href);
    const m = String(l.href).match(/^\/(bilgi|kategori)\/([^/?#]+)$/);
    if (!m) return true;
    return (m[1] === 'bilgi' ? rehberler : kategoriler).has(decodeURIComponent(m[2]));
  });
  const { pillar, ...geri } = article;
  return pillar && rehberler.has(pillar) ? { ...geri, pillar, links } : { ...geri, links };
}
