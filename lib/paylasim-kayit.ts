/**
 * Paylaşım kartlarının kapalı kümesi — Aylık plan G20.
 *
 * `app/og/[tur]/[anahtar]/route.tsx` yalnız buradaki kartları derlemede üretir (`dynamicParams = false`); listede
 * olmayan adres 404'tür. Kart başlıkları sayfaların kendi veri kaynaklarından gelir. Sayfa başına kart yalnız derlemede
 * üretilen ve dizine açık sayfalara verilir; kitlesel dinamik adresler (madde) kanun kartını kullanır. Ders notları ve karar arşivi 2026-11'de siteden kaldırıldı.
 * Bölge sayfaları (reklam yasağı sorusu 10 açık) genel site kartını kullanır.
 */
import { getKanunOzetleri } from '@/lib/api';
import { BOLGE_MAKALELER } from '@/lib/bolge-makaleler';
import { HESAPLAMA_ARACLAR } from '@/lib/hesaplama-meta';
import { KAVRAMLAR } from '@/lib/kavramlar';
import { lawCategories } from '@/lib/laws';
import { paylasimAnahtari, PAYLASIM_TURLERI, type PaylasimTuru } from '@/lib/paylasim';
import { getGuidePageSlugs, getGuidePageState, getPublishedCategories } from '@/lib/vatandas-rehberi/published';

export type PaylasimKarti = { tur: PaylasimTuru; anahtar: string; baslik: string; ust?: string };

const tr = (n: number) => n.toLocaleString('tr-TR');

/** Sabit sayfalar ve türlerin genel kartları. */
const SABIT_KARTLAR: PaylasimKarti[] = [
  { tur: 'site', anahtar: 'genel', baslik: 'Kanun, şerh ve içtihat kütüphanesi', ust: 'Açık erişimli dijital hukuk kütüphanesi' },
  { tur: 'bolum', anahtar: 'ara', baslik: 'Kanun maddesi arama', ust: 'Madde metni ve akademik şerh' },
  { tur: 'bolum', anahtar: 'hesaplama', baslik: 'Hukuki hesaplama araçları', ust: `${tr(HESAPLAMA_ARACLAR.length)} araç · kıdem, faiz, miras, harç` },
  { tur: 'bolum', anahtar: 'bilgi', baslik: 'Vatandaş bilgi rehberleri', ust: 'Süreç, belge ve süre notları' },
  { tur: 'bolum', anahtar: 'kavram', baslik: 'Hukuk kavramları', ust: `${tr(KAVRAMLAR.length)} kavram · kısa tanım ve dayanak madde` },
  { tur: 'bolum', anahtar: 'bolge-yazi', baslik: 'Bölge yazıları', ust: 'Şehir, tarih ve hukuk üzerine denemeler' },
  { tur: 'bolum', anahtar: 'hizmet-bolgeleri', baslik: 'Bölgesel hukuki bilgilendirme', ust: 'Genel bilgilendirme rehberleri' },
  { tur: 'rehber', anahtar: 'genel', baslik: 'Vatandaş bilgi rehberi', ust: 'Süreç, belge ve süre notları' },
  { tur: 'yazar', anahtar: 'avukat-fethi-guzel', baslik: 'Yazar ve akademik profil', ust: 'Özel hukuk alanında doktora çalışmaları' },
  { tur: 'yazar', anahtar: 'akademik-profil', baslik: 'Akademik profil', ust: 'Doktora çalışmaları ve yayımlanmış eser' },
  { tur: 'yazar', anahtar: 'e-durusma', baslik: 'e-Duruşma', ust: 'Monografi, akademik bağlam ve ilgili mevzuat' },
];

/** Bütün kartlar; anahtarlar tür içinde tektir (`lib/__tests__/paylasim.test.mjs`). */
export async function paylasimKartlari(): Promise<PaylasimKarti[]> {
  const kanunlar = await getKanunOzetleri();
  const toplamMadde = kanunlar.reduce((t, k) => t + k.maddeSayisi, 0);
  const kartlar: PaylasimKarti[] = [
    ...SABIT_KARTLAR,
    { tur: 'bolum', anahtar: 'mevzuat', baslik: 'Kanun maddeleri ve akademik şerhler', ust: `${tr(kanunlar.length)} kanun · ${tr(toplamMadde)} madde` },
    ...kanunlar.map((k) => ({ tur: 'kanun' as const, anahtar: k.kanunId, baslik: k.kanun, ust: `${k.kanunId.toUpperCase()} · ${tr(k.maddeSayisi)} madde` })),
    ...lawCategories.flatMap((c) => [
      { tur: 'alan' as const, anahtar: c.slug, baslik: c.name, ust: c.kanunAdi },
      ...c.subCategories.map((s) => ({ tur: 'alan' as const, anahtar: `${c.slug}-${s.slug}`, baslik: s.name, ust: `${c.kanunAdi} · m. ${s.startMadde}-${s.endMadde}` })),
    ]),
    ...KAVRAMLAR.map((k) => ({ tur: 'kavram' as const, anahtar: k.slug, baslik: k.baslik })),
    ...HESAPLAMA_ARACLAR.map((a) => ({ tur: 'hesaplama' as const, anahtar: a.id, baslik: a.baslik, ust: a.tag })),
    ...getGuidePageSlugs().flatMap((slug) => {
      const durum = getGuidePageState(slug);
      return durum?.publishable ? [{ tur: 'rehber' as const, anahtar: slug, baslik: durum.article.h1, ust: durum.article.category }] : [];
    }),
    ...getPublishedCategories().map((cat) => ({ tur: 'rehber' as const, anahtar: `kategori-${cat}`, baslik: `${cat} rehberleri` })),
    ...BOLGE_MAKALELER.map((m) => ({ tur: 'yazi' as const, anahtar: m.slug, baslik: m.h1 })),
  ];
  return kartlar.map((k) => ({ ...k, anahtar: paylasimAnahtari(k.anahtar) }));
}

/** Kartın görünen tür etiketi. */
export function turEtiketi(tur: PaylasimTuru): string {
  return PAYLASIM_TURLERI[tur];
}
