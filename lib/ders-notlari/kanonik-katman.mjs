/**
 * Kanonik katman (Aylık plan G19): Dersin dizine açık temsilci notuna (`dizin-kanonik.json`) elle yazılmış örnek olay, sınav
 * iskeleti, tuzak defteri ve kısa test eklenir. Üretilmiş not dosyalarına dokunulmaz; katman yalnız temsilci nota uygulanır, ad
 * değiştirmeli kopyalar ve dönem sürümleri olduğu gibi kalır.
 *
 * Her hukuki önerme bir `dayanak` ({ kanun, madde, ifade }) taşır; ifade depodaki kanun metninde aynen geçer
 * (`lib/__tests__/ders-kanonik-katman.test.mjs`). Katmana doktrin görüşü, yazar adı ve içtihat künyesi yazılmaz.
 */
import { tabanKod } from './semalar.mjs';
import borclarGenel from './kanonik/borclar-genel.mjs';
import medeniUsul from './kanonik/medeni-usul.mjs';
import cezaGenel from './kanonik/ceza-genel.mjs';
import icraIflas from './kanonik/icra-iflas.mjs';
import mirasHukuku from './kanonik/miras-hukuku.mjs';

export const KATMANLAR = [borclarGenel, medeniUsul, cezaGenel, icraIflas, mirasHukuku];

const KATMAN = new Map(KATMANLAR.map((k) => [k.ders, k]));

/**
 * Temsilci notsa (katmanın `temsilci` alanı, `dizin-kanonik.json` ile testte eşitlenir) katmanı uygulanmış yeni nesne, değilse notun kendisi.
 * @template T
 * @param {T} note
 */
export function kanonikKatmanUygula(note) {
  if (!note) return note;
  const ders = tabanKod(note.courseCode);
  const katman = KATMAN.get(ders);
  const temsilci = katman?.temsilci;
  if (!katman || !temsilci || temsilci.uni !== note.uniSlug || temsilci.ders !== note.courseCode) return note;

  const kaynaklar = [...(note.sources || [])];
  for (const s of katman.kaynaklar) if (!kaynaklar.some((x) => x.url === s.url)) kaynaklar.push(s);

  return {
    ...note,
    examples: katman.ornekOlaylar.map((o) => ({
      title: o.baslik,
      facts: o.olay,
      analysis: o.cozum,
      takeaway: o.sonuc,
      dayanaklar: o.dayanaklar,
    })),
    sinavIskeleti: katman.sinavIskeleti,
    tuzakDefteri: katman.tuzakDefteri,
    kisaTest: katman.kisaTest,
    sources: kaynaklar,
    updated: katman.guncelleme,
  };
}
