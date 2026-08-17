import type { VatandasArticle } from '../types';

import aidatBorcu from './aidat-borcu.json';
import arabuluculuk from './arabuluculuk.json';
import bosanmaDavasi from './bosanma-davasi.json';
import calismaKosullarindaDegisiklik from './calisma-kosullarinda-degisiklik.json';
import davaNasilAcilir from './dava-nasil-acilir.json';
import fazlaMesaiUcreti from './fazla-mesai-ucreti.json';
import haczedilemeyenMallar from './haczedilemeyen-mallar.json';
import hakliNedenleFesih from './hakli-nedenle-fesih.json';
import icraTakibiBaslatma from './icra-takibi-baslatma.json';
import ihbarTazminati from './ihbar-tazminati.json';
import iseIadeDavasi from './ise-iade-davasi.json';
import istinafVeTemyiz from './istinaf-ve-temyiz.json';
import kacakYapi from './kacak-yapi.json';
import kamulastirma from './kamulastirma.json';
import kidemTazminati from './kidem-tazminati.json';
import kiraArtisOrani from './kira-artis-orani.json';
import kiracininTahliyesi from './kiracinin-tahliyesi.json';
import kvkkBasvuru from './kvkk-basvuru.json';
import malRejimiTasfiyesi from './mal-rejimi-tasfiyesi.json';
import mesafeliSatisCayma from './mesafeli-satis-cayma.json';
import mirasPaylasimi from './miras-paylasimi.json';
import mirasinReddi from './mirasin-reddi.json';
import nafakaTurleri from './nafaka-turleri.json';
import odemeEmrineItiraz from './odeme-emrine-itiraz.json';
import sucDuyurusu from './suc-duyurusu.json';
import tenkisDavasi from './tenkis-davasi.json';
import tuketiciHakemHeyeti from './tuketici-hakem-heyeti.json';
import usulsuzTebligat from './usulsuz-tebligat.json';
import verasetIlami from './veraset-ilami.json';
import vergiCezasiItiraz from './vergi-cezasi-itiraz.json';
import yillikIzinHakki from './yillik-izin-hakki.json';
import zamanasimiSureleri from './zamanasimi-sureleri.json';
import zilyetlikleTescil from './zilyetlikle-tescil.json';

/**
 * Elle yazılan rehberler.
 *
 * ── Kaynak ve türev ─────────────────────────────────────────────────────────
 * Metinler `<slug>.ts` dosyalarında yazılır; orada tip denetimi çalışır ve
 * hangi maddeden doğrulandığı dosya başındaki yorumda durur. `prebuild`
 * bunları `<slug>.json` olarak üretir (scripts/authored-to-json.mjs).
 *
 * Buradan JSON içe aktarılır, TS değil. Sebebi: site haritası, kalite denetimi
 * ve mobil uygulama derleyicisi düz Node betikleridir ve TypeScript'i içe
 * aktaramazlar. Tek kaynaktan beslenmezlerse site ile uygulama farklı listeler
 * gösterir — bu proje o hatayı zaten bir kez yaşadı.
 *
 * Sapma olmadığını `scripts/__tests__/authored-guides.test.mjs` doğrular.
 *
 * ── Yeni rehber ekleme ──────────────────────────────────────────────────────
 *   1. <slug>.ts yaz  →  2. node scripts/authored-to-json.mjs
 *   3. buraya import ekle  →  4. npm run audit:content
 */
const ARTICLES = [
  // İş hukuku
  kidemTazminati,
  ihbarTazminati,
  hakliNedenleFesih,
  iseIadeDavasi,
  fazlaMesaiUcreti,
  yillikIzinHakki,
  calismaKosullarindaDegisiklik,
  // İcra
  icraTakibiBaslatma,
  odemeEmrineItiraz,
  haczedilemeyenMallar,
  // Kira
  kiraArtisOrani,
  kiracininTahliyesi,
  // Aile
  bosanmaDavasi,
  nafakaTurleri,
  malRejimiTasfiyesi,
  // Miras
  verasetIlami,
  mirasPaylasimi,
  mirasinReddi,
  tenkisDavasi,
  // Eşya
  aidatBorcu,
  zilyetlikleTescil,
  // Tüketici
  tuketiciHakemHeyeti,
  mesafeliSatisCayma,
  // Kişisel veri
  kvkkBasvuru,
  // Ceza
  sucDuyurusu,
  // İdare · imar
  kamulastirma,
  kacakYapi,
  // Vergi
  vergiCezasiItiraz,
  // Usul
  davaNasilAcilir,
  istinafVeTemyiz,
  arabuluculuk,
  usulsuzTebligat,
  zamanasimiSureleri,
] as unknown as VatandasArticle[];

export const AUTHORED_ARTICLES: VatandasArticle[] = ARTICLES;

export const AUTHORED_SLUGS = new Set(AUTHORED_ARTICLES.map((a) => a.slug));
