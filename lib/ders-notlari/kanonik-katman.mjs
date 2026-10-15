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
import esyaHukuku from './kanonik/esya-hukuku.mjs';
import isHukuku from './kanonik/is-hukuku.mjs';
import ticariIsletme from './kanonik/ticari-isletme.mjs';
import ticaretSirketler from './kanonik/ticaret-sirketler.mjs';
import idareHukuku from './kanonik/idare-hukuku.mjs';
import aileHukuku from './kanonik/aile-hukuku.mjs';
import borclarOzel from './kanonik/borclar-ozel.mjs';
import medeniBaslangic from './kanonik/medeni-baslangic.mjs';
import kiymetliEvrak from './kanonik/kiymetli-evrak.mjs';
import sigortaHukuku from './kanonik/sigorta-hukuku.mjs';
import cezaOzel from './kanonik/ceza-ozel.mjs';
import cezaMuhakemesi from './kanonik/ceza-muhakemesi.mjs';
import tuketiciHukuku from './kanonik/tuketici-hukuku.mjs';
import arabuluculuk from './kanonik/arabuluculuk.mjs';
import vergiHukuku from './kanonik/vergi-hukuku.mjs';

export const KATMANLAR = [
  borclarGenel,
  medeniUsul,
  cezaGenel,
  icraIflas,
  mirasHukuku,
  esyaHukuku,
  isHukuku,
  ticariIsletme,
  ticaretSirketler,
  idareHukuku,
  aileHukuku,
  borclarOzel,
  medeniBaslangic,
  kiymetliEvrak,
  sigortaHukuku,
  cezaOzel,
  cezaMuhakemesi,
  tuketiciHukuku,
  arabuluculuk,
  vergiHukuku,
];

const KATMAN = new Map(KATMANLAR.map((k) => [k.ders, k]));

/** Alıntı başındaki ham kanun başlığı: `«**II. Öneri ve kabul** --- MADDE 3- ` ya da kırpılmış `«Genel olarak** --- MADDE 1- `. */
const HAM_BASLIK = /«(?:[^«»]*?\*\*\s*)?-{3}\s*MADDE\s+\d+(?:\/?[A-Z])?\s*[-–—]\s*/gi;
const ALINTI = /«([^«»]*)»/g;

/** Alıntıdan başlık artığını ve `MADDE n-` önekini atar; alıntı metnine dokunmaz. */
export const alintiTemizle = (paragraf) => paragraf.replace(HAM_BASLIK, '«');

/**
 * Bölüm paragraflarını temizler: Alıntılar başlık artığından arındırılır, alıntısı aynı bölümde daha önce geçmiş bir alıntının
 * parçası olan paragraf (üreticinin "ikinci katman", "üçüncü okuma" yinelemeleri) düşer. Bölümde en az iki paragraf kalır.
 */
export function bolumTemizle(sec) {
  const paragraflar = (sec.paragraphs || []).map(alintiTemizle);
  const gorulen = [];
  let kalan = paragraflar.length;
  const sonuc = paragraflar.filter((p) => {
    const alintilar = [...p.matchAll(ALINTI)].map((m) => m[1].trim()).filter((a) => a.length > 0);
    const yineleme = alintilar.length > 0 && alintilar.every((a) => gorulen.some((g) => g.includes(a)));
    gorulen.push(...alintilar);
    if (yineleme && kalan > 2) {
      kalan -= 1;
      return false;
    }
    return true;
  });
  return { ...sec, paragraphs: sonuc };
}

/** Üreticinin iç sürüm etiketi (G20 devri): `Yıllık (Konsolide Master)` başlıkta, kartta ve paragraflarda `Yıllık` olarak görünür. */
export const etiketTemizle = (metin) => metin.replaceAll(' (Konsolide Master)', '');

/** Nottaki bütün metin alanlarına `etiketTemizle` uygular; yapıya dokunmaz. */
const derinTemizle = (deger) => {
  if (typeof deger === 'string') return etiketTemizle(deger);
  if (Array.isArray(deger)) return deger.map(derinTemizle);
  if (deger && typeof deger === 'object') return Object.fromEntries(Object.entries(deger).map(([a, d]) => [a, derinTemizle(d)]));
  return deger;
};

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

  const temiz = derinTemizle(note);

  return {
    ...temiz,
    sections: (temiz.sections || []).map(bolumTemizle),
    // Üretilmiş konu soruları dayanaksızdır ve yarısı kalıptır (G23 adım 5); yerlerini katmanın kısa testi alır.
    topics: (temiz.topics || []).map((t) => ({ ...t, mcq: [] })),
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
