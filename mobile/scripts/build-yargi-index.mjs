#!/usr/bin/env node
/**
 * Yargı arşivini KÜNYE LİSTESİ olmaktan çıkarır.
 *
 * Sorun: uygulama "18.910 karar" diyordu ama listede yalnız künye vardı —
 * üst üste dizilmiş "Yargıtay 2. Hukuk Dairesi, E. 2026/3322, K. 2026/6178"
 * satırları. Hangi karar neyi çözüyor, hangisi hangi maddeyle ilgili;
 * ekrandan okunamıyordu.
 *
 * Bu betik karar metinlerinin İÇİNİ okur ve şunları çıkarır:
 *
 *   1. KONU  — kararın ne hakkında olduğu (üç ayrı strateji, aşağıda).
 *   2. DAVA  — künye paragrafındaki tırnak içi dava türü.
 *   3. ATIF  — kararda anılan kanun maddeleri. Yargıtay bunları yapısal
 *              biçimde yazar: «TÜRK CEZA KANUNU (TCK) (5237) Madde 43» ya da
 *              «5271 S. CEZA MUHAKEMESİ KANUNU [ Madde 230 ]».
 *
 * Atıflar TERS ÇEVRİLİR: her kanun maddesi için o maddeye atıf yapan kararlar
 * listesi üretilir. Mevzuat bölümü böylece «TBK m.49» sayfasında "bu maddeye
 * atıf yapan 37 karar" gösterebilir. Uygulamada mevzuatla içtihadı birbirine
 * bağlayan tek yer burasıdır.
 *
 * Kanun numarası → paket eşlemesi UYDURULMAZ; korpusun kendisinden çıkarılır:
 * numara ile ad birlikte geçtiği için (numara, ad) çiftleri sayılır, ad bizim
 * kanun kütüğümüzle eşleştirilir. Aynı ada iki numara düşerse (5237/765 Türk
 * Ceza Kanunu gibi) YÜRÜRLÜKTEKİ olan seçilir: mülga kanun anılırken metinde
 * "mülga / yürürlükten kalkan" ifadesinin yakınında geçer, bu oran ölçülür.
 *
 * Üretir:
 *   data-src/icthat/archive.json.gz   — zenginleştirilmiş indeks
 *   data-src/mevzuat/atif.json.gz     — madde → karar ters indeksi
 *   data-src/mevzuat/atif-meta.json   — denetim raporu
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { gzipSync, gunzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const mobile = join(here, '..');
const portal = join(mobile, '..');
const yargiRoot = join(portal, 'data', 'yargi-kararlari');
const decisionsRoot = join(yargiRoot, 'decisions');
const outIcthat = join(mobile, 'data-src', 'icthat');
const outMevzuat = join(mobile, 'data-src', 'mevzuat');
const packsDir = join(mobile, 'data-src', 'packs');

mkdirSync(outIcthat, { recursive: true });
mkdirSync(outMevzuat, { recursive: true });

// ── Kanun kütüğü ────────────────────────────────────────────────────────────
// app-src/src/lib/kanunlar.ts ile aynı adlar. Betik TypeScript okuyamadığı
// için adlar burada da durur; eşleşme sayısı rapora yazılır, ikisi ayrışırsa
// oradan görülür.
const KUTUK = [
  ['tmk', 'Türk Medeni Kanunu'],
  ['tbk', 'Türk Borçlar Kanunu'],
  ['ttk', 'Türk Ticaret Kanunu'],
  ['cek', 'Çek Kanunu'],
  ['katmulkiyeti', 'Kat Mülkiyeti Kanunu'],
  ['tkhk', 'Tüketicinin Korunması Hakkında Kanun'],
  ['hmk', 'Hukuk Muhakemeleri Kanunu'],
  ['cmk', 'Ceza Muhakemesi Kanunu'],
  ['iik', 'İcra ve İflas Kanunu'],
  ['tebligat', 'Tebligat Kanunu'],
  ['arabuluculuk', 'Hukuk Uyuşmazlıklarında Arabuluculuk Kanunu'],
  ['nhk', 'Noterlik Kanunu'],
  ['tck', 'Türk Ceza Kanunu'],
  ['cck', 'Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun'],
  ['kmk', 'Kabahatler Kanunu'],
  ['is-kanunu', 'İş Kanunu'],
  ['isg', 'İş Sağlığı ve Güvenliği Kanunu'],
  ['sendikalar', 'Sendikalar ve Toplu İş Sözleşmesi Kanunu'],
  ['ssgssk', 'Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu'],
  ['vuk', 'Vergi Usul Kanunu'],
  ['gvk', 'Gelir Vergisi Kanunu'],
  ['kvk', 'Kurumlar Vergisi Kanunu'],
  ['kdvk', 'Katma Değer Vergisi Kanunu'],
  ['otv', 'Özel Tüketim Vergisi Kanunu'],
  ['aatuhk', 'Amme Alacaklarının Tahsil Usulü Hakkında Kanun'],
  ['bk', 'Bankacılık Kanunu'],
  ['spk', 'Sermaye Piyasası Kanunu'],
  ['rkhk', 'Rekabetin Korunması Hakkında Kanun'],
  ['dmk', 'Devlet Memurları Kanunu'],
  ['belediye', 'Belediye Kanunu'],
  ['buyuksehir', 'Büyükşehir Belediyesi Kanunu'],
  ['il-idaresi', 'İl İdaresi Kanunu'],
  ['imar', 'İmar Kanunu'],
  ['kamulastirma', 'Kamulaştırma Kanunu'],
  ['devlet-ihale', 'Devlet İhale Kanunu'],
  ['kamu-ihale-sozlesmeleri', 'Kamu İhale Sözleşmeleri Kanunu'],
  ['dernekler', 'Dernekler Kanunu'],
  ['vakiflar', 'Vakıflar Kanunu'],
  ['tvk', 'Türk Vatandaşlığı Kanunu'],
  ['yukk', 'Yabancılar ve Uluslararası Koruma Kanunu'],
  ['aile-koruma', 'Ailenin Korunması ve Kadına Karşı Şiddetin Önlenmesine Dair Kanun'],
  ['kvkk', 'Kişisel Verilerin Korunması Kanunu'],
  ['ktk', 'Karayolları Trafik Kanunu'],
  ['pvsk', 'Polis Vazife ve Salâhiyet Kanunu'],
  ['jandarma', 'Jandarma Teşkilat, Görev ve Yetkileri Kanunu'],
  ['tsk-ic-hizmet', 'Türk Silâhlı Kuvvetleri İç Hizmet Kanunu'],
];

/** «TÜRK CEZA KANUNU (TCK)» → «turk ceza kanunu» */
function normalizeAd(s) {
  return String(s || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[ıİ]/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\bmulga\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const KUTUK_NORM = new Map(KUTUK.map(([id, ad]) => [normalizeAd(ad), id]));

const ENT = {
  '&ldquo;': '“', '&rdquo;': '”', '&rsquo;': '’', '&lsquo;': '‘',
  '&hellip;': '…', '&acirc;': 'â', '&Acirc;': 'Â', '&icirc;': 'î', '&Icirc;': 'Î',
  '&ucirc;': 'û', '&ocirc;': 'ô', '&nbsp;': ' ', '&amp;': '&', '&quot;': '"',
  '&#39;': "'", '&ccedil;': 'ç', '&Ccedil;': 'Ç', '&uuml;': 'ü', '&Uuml;': 'Ü',
  '&ouml;': 'ö', '&Ouml;': 'Ö', '&mdash;': '—', '&ndash;': '–',
  '&lt;': '<', '&gt;': '>', '&deg;': '°', '&euro;': '€',
};

function decodeEntities(s) {
  return String(s || '').replace(/&[a-zA-Z]+;|&#\d+;/g, (m) => {
    if (ENT[m]) return ENT[m];
    const code = /^&#(\d+);$/.exec(m);
    if (code) {
      const n = Number(code[1]);
      if (n > 31 && n < 0x10000) return String.fromCharCode(n);
    }
    return ' ';
  });
}

// ── Atıf desenleri ──────────────────────────────────────────────────────────
// «5271 S. CEZA MUHAKEMESİ KANUNU [ Madde 230 ]»
const RE_BRACKET =
  /(\d{3,4})\s*S\.\s*([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ0-9 .,()'’-]{4,90}?)\s*\[\s*Madde\s+(\d+)/g;
// «TÜRK CEZA KANUNU (TCK) (5237) Madde 43»
const RE_PAREN =
  /([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ0-9 .,'’-]{4,90}?)\s*(?:\([A-ZÇĞİÖŞÜ]{2,8}\)\s*)?\((\d{3,4})\)\s*Madde\s+(\d+)/g;
// «5237 sayılı Türk Ceza Kanunu'nun 43. maddesi»
const RE_PROSE =
  /(\d{3,4})\s*say[ıi]l[ıi]\s+([A-ZÇĞİÖŞÜa-zçğıöşü .,'’-]{6,70}?)\s*(?:['’][a-zçğıöşü]{1,4}\s*)?(\d{1,4})\s*(?:\/\s*\d+\s*)?(?:nc[ıi]|üncü|inci|uncu|ncı)?\s*maddes[ıi]/g;

/**
 * «mülga 6762 sayılı», «yürürlükten kalkan 1086 sayılı» — numaranın HEMEN
 * ÖNÜNDEKİ nitelemeyi yakalar.
 *
 * Önceki sürüm numaranın ±90 karakterlik komşuluğuna bakıyordu ve
 * «6102 sayılı Türk Ticaret Kanunu, mülga 6762 sayılı Türk Ticaret Kanunu»
 * cümlesinde İKİ numarayı da mülga sayıyordu; TTK bu yüzden mülga 6762'ye
 * bağlanmıştı. Niteleme numaranın önünde durur, pencerede değil.
 */
const RE_MULGA_ONCE =
  /(?:m[üu]lga|y[üu]r[üu]rl[üu]kten\s+kalk\w*|eski)\s+(?:olan\s+)?(\d{3,4})\s*say[ıi]l[ıi]/gi;
const RE_YURURLUK_ONCE =
  /(?:y[üu]r[üu]rl[üu]kteki|y[üu]r[üu]rl[üu]kte\s+olan|halen\s+y[üu]r[üu]rl[üu]kte\s+bulunan)\s+(\d{3,4})\s*say[ıi]l[ıi]/gi;

/** Karar metnindeki tüm atıfları toplar. */
function citationsOf(text) {
  const out = [];
  for (const m of text.matchAll(RE_BRACKET)) {
    out.push({ num: m[1], ad: m[2].trim().replace(/\s+/g, ' '), madde: Number(m[3]), yapisal: true });
  }
  for (const m of text.matchAll(RE_PAREN)) {
    out.push({ num: m[2], ad: m[1].trim().replace(/\s+/g, ' '), madde: Number(m[3]), yapisal: true });
  }
  for (const m of text.matchAll(RE_PROSE)) {
    const madde = Number(m[3]);
    if (!Number.isFinite(madde) || madde < 1 || madde > 6500) continue;
    out.push({ num: m[1], ad: m[2].trim().replace(/\s+/g, ' '), madde, yapisal: false });
  }
  return out;
}

/**
 * Kararın KONUSU.
 *
 * Yargıtay konuyu üç ayrı biçimde yazar; hiçbiri her kararda yok:
 *
 *   1. Künyeden sonra AYRI SATIRLARDA büyük harfle ("ELATMANIN ÖNLENMESİ").
 *   2. Künye satırının DEVAMINDA, yine büyük harfle.
 *   3. Hiç yazmaz; konu gövdenin ilk cümlesinden okunur
 *      ("Taraflar arasındaki «hizmet tespiti» davasından…",
 *       "Rüşvet almak suçundan sanık…").
 *
 * Üçü sırayla denenir. Hiçbiri tutmazsa BOŞ döner — uydurma bir başlık
 * yazmaktansa liste satırı daireyle ve künyeyle yetinir.
 */
function subjectsOf(text) {
  const head = text.split('"İçtihat Metni"')[0] || text.slice(0, 1500);

  const satirdan = capsSatirlari(head);
  if (satirdan.length) return satirdan;

  const kunyeden = kunyeSatirindanKaps(head);
  if (kunyeden.length) return kunyeden;

  const govdeden = budaKonu(govdedenKonu(text.slice(0, 4500)));
  return govdeden ? [govdeden] : [];
}

const ATLA_BASLIK =
  /^(MAHKEMES[İI]|TAR[İI]H[İI]|NUMARASI|DAVACI|DAVALI|TÜRK M[İI]LLET[İI]|TEBL[İI][ĞG]NAME|[İI]T[İI]RAZNAME|GÜNÜ|SAYISI|YARGITAY DA[İI]RES[İI]|[İI]NCELENEN)/i;

/** Künyeden sonra ayrı satırlarda duran büyük harfli konu başlıkları. */
function capsSatirlari(head) {
  const body = head
    .replace(RE_BRACKET, ' ')
    .replace(RE_PAREN, ' ')
    .replace(/\d{3,4}\s*S\.\s*[A-ZÇĞİÖŞÜ][^\n\]]{4,90}\]?/g, ' ')
    .replace(/\[[^\]]*\]|\]/g, ' ');

  const out = [];
  const seen = new Set();
  for (const raw of body.split(/[\r\n]+/)) {
    const line = raw.replace(/\s+/g, ' ').trim();
    if (line.length < 6 || line.length > 110) continue;
    if (/\d{4}\s*\/\s*[\d-]+\s*E\./.test(line) || /\bK\.\s*$/.test(line)) continue;
    if (ATLA_BASLIK.test(line)) continue;
    if (!/^[A-ZÇĞİÖŞÜ0-9][A-ZÇĞİÖŞÜ0-9 .,()'’/-]*$/.test(line)) continue;
    if (!/[A-ZÇĞİÖŞÜ]{3}/.test(line)) continue;
    const key = line.toLocaleLowerCase('tr-TR');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(toTitle(line));
    if (out.length >= 4) break;
  }
  return out;
}

/** «… 2013/25 K. PARADA SAHTECILIK …» — künyeyle aynı satırda. */
function kunyeSatirindanKaps(head) {
  const m =
    /\d{4}\/[\d.A-ZÇĞİÖŞÜ-]+\s*E\.\s*,?\s*\d{4}\/\d+\s*K\.\s+([A-ZÇĞİÖŞÜI][A-ZÇĞİÖŞÜI ]{8,160}?)(?=\s+[A-ZÇĞİÖŞÜ ]{3,}\s*\(|\s+\d{3,4}\s*S\.|\n|$)/.exec(head);
  if (!m) return [];
  return m[1]
    .trim()
    .split(/\s{2,}/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5 && s.length < 110)
    .slice(0, 4)
    .map(toTitle);
}

/** Gövdenin ilk cümlesinden dava türü ya da suç adı. */
function govdedenKonu(t) {
  // «Taraflar arasındaki "hizmet tespiti" davasından» — iç içe tırnak dâhil
  let m = /aras[ıi]ndaki\s*["'“‘]\s*(?:[\s\S]{0,14}?["'“‘])?\s*([^"'”’\n]{4,90})["'”’]/i.exec(t);
  if (m) return temizKonu(m[1]);

  // «Taraflar arasındaki menfi tespit davasından» — tırnaksız
  m = /aras[ıi]ndaki\s+([a-zçğıöşüA-ZÇĞİÖŞÜ ,-]{6,70}?)\s+davas[ıi]/i.exec(t);
  if (m && !/^\s*dava/i.test(m[1])) return temizKonu(m[1]);

  // «Dava, … istemine ilişkindir.»
  m = /\b(?:Dava|Uyu[şs]mazl[ıi]k|[İI]stem|Talep)[,:]\s*([^.;\n]{8,130}?)\s*(?:istemine|talebine)?\s*ili[şs]kindir/i.exec(t);
  if (m) return temizKonu(m[1]);

  // «Rüşvet almak suçundan sanık…», «görevi kötüye kullanma suçundan beraatına»
  m = /([^.;:\n]{6,130}?)\s+su[çc](?:undan|lar[ıi]ndan|una|lar[ıi]na)\b/i.exec(t);
  if (m) {
    const konu = temizKonu(sucAdiniAyikla(m[1]));
    if (konu && konu.length >= 8) return konu + ' suçu';
  }

  return '';
}

/**
 * «suçundan» öncesindeki USUL cümlesini atıp yalnız suç adını bırakır.
 *
 * 2026 tarihli Ceza Genel Kurulu kararları suç adını uzun bir usul
 * cümlesinin sonuna gömüyor:
 *
 *   «Sanık hakkında İzmir 11. Ağır Ceza Mahkemesince yapılan yargılama
 *    neticesinde konutta ve eklentilerinde yağma suçundan…»
 *
 * Aranan başlık «konutta ve eklentilerinde yağma»; öncesi kararın konusu
 * değil, nasıl geldiği. Son usul kelimesinden sonrası alınır.
 *
 * Virgülden bölmek YANLIŞ olurdu: «Sanığın defter, kayıt ve belgeleri
 * gizleme suçundan» cümlesinde suçun adı virgülün iki yanına yayılıyor.
 * Onun yerine baştaki fail sıfatı ayrıca ayıklanır.
 */
const USUL_SINIRI =
  /\b(?:neticesinde|sonucunda|sonunda|üzerine|dolay[ıi]s[ıi]yla|nedeniyle|hakk[ıi]nda|ili[şs]kin|yarg[ıi]lama|mahkemesince|dairesince|ba[şs]savc[ıi]l[ıi][ğg][ıi]nca|kurulunca)\b/gi;

const FAIL_SIFATI =
  /^(?:san[ıi][ğgk](?:[ıi]n|lar[ıi]n)?|su[çc]a\s+s[üu]r[üu]klenen\s+[çc]ocu[ğg]un|h[üu]k[üu]ml[üu](?:n[üu]n|lerin)?|[şs][üu]pheli(?:nin|lerin)?|kat[ıi]lan(?:[ıi]n)?|m[üu][şs]teki(?:nin)?|davac[ıi](?:n[ıi]n)?|daval[ıi](?:n[ıi]n)?)\s+/i;

function sucAdiniAyikla(parca) {
  let s = String(parca || '');

  // Son usul kelimesinden sonrasını al
  let sonSinir = -1;
  for (const m of s.matchAll(USUL_SINIRI)) sonSinir = m.index + m[0].length;
  if (sonSinir > 0) s = s.slice(sonSinir);

  // Baştaki fail sıfatını at («Sanığın defter, kayıt…» → «defter, kayıt…»)
  s = s.trim().replace(FAIL_SIFATI, '');

  return s.trim();
}

/**
 * Usul cümlesinden kopmuş parça mı?
 *
 * «Ağır Ceza Mahkemesince yapılan yargılama neticesinde konutta ve
 * eklentilerinde» gibi çıktılar kararın konusu değil, künye paragrafının
 * ortasıdır. Bunlar başlık diye gösterilirse liste yine okunmaz hâle gelir;
 * yanlış başlık, başlıksızlıktan kötüdür.
 */
const USUL_PARCASI =
  /(mahkemes(i|ince|inde)|yarg[ıi]lama|neticesinde|sonucunda|ba[şs]savc[ıi]l[ıi]|tebli[ğg]name|temyiz|dairesi(nce|nin)?|ilam[ıi]|hükmün|kurulunca|incelenmesi|istenilmesi)/i;

/**
 * Anlamsız baş parçalar.
 *
 * İki kaynağı var: (1) «Ya yönelik…», «Hakkında…» gibi bağlaç artıkları,
 * (2) karar metninde ad kısaltıldığı için ortada kalan EK parçaları —
 * «M.K.'in nitelikli dolandırıcılık» cümlesinden «İn nitelikli
 * dolandırıcılık» kalması gibi. İkisi de başlığı bozuk gösterir.
 */
const BAS_DOLGU =
  /^(?:yönelik|hakk[ıi]nda|ile|ve|üzere|kar[şs][ıi]|adl[ıi]|isimli|olan|olarak|bu|[ıiuü]n|n[ıiuü]n|[ıiuü]?nin|[ıiuü]?nun|ya|ye|[dn]?[ae]n|[dn][ae]|y?l[ae]|[a-zçğıöşüA-ZÇĞİÖŞÜ])\s+/i;

/** Konu adayını son bir kez süzer; kabul edilmezse boş döner. */
function budaKonu(s) {
  let out = String(s || '').trim();
  if (!out) return '';
  if (USUL_PARCASI.test(out)) return '';

  // Baştaki dolgu sözcüklerini at (en çok üç tur — döngü kilidi)
  for (let i = 0; i < 3 && BAS_DOLGU.test(out); i += 1) {
    out = out.replace(BAS_DOLGU, '').trim();
  }
  if (out.length < 8 || out.length > 110) return '';
  // Tek kelimelik «Alacak» gibi başlıklar bilgi taşımaz sayılmaz; kalsın,
  // ama iki harfli kırıntılar elenir.
  if (!/[a-zçğıöşü]{4}/i.test(out)) return '';
  return out.charAt(0).toLocaleUpperCase('tr-TR') + out.slice(1);
}

/** Baştaki kişi/sıfat kalıntılarını ve fazla boşluğu atar. */
function temizKonu(s) {
  let out = String(s || '')
    .replace(/\s+/g, ' ')
    .replace(/^[\s'"‘’“”.,-]+/, '')
    .replace(/[\s'"‘’“”.,-]+$/, '');
  out = out
    .replace(/^(?:san[ıi]k(?:lar)?|hükümlü(?:ler)?|[şs]üpheli(?:ler)?|kat[ıi]lan(?:lar)?|davac[ıi]|daval[ıi])\S*\s*/i, '')
    .replace(/^(?:[A-ZÇĞİÖŞÜ]\.?\s*){2,}/, '')
    .trim();
  if (out.length < 5 || out.length > 110) return '';
  return out.charAt(0).toLocaleUpperCase('tr-TR') + out.slice(1);
}

/** «KAMULAŞTIRMASIZ ELATMA» → «Kamulaştırmasız elatma» */
function toTitle(s) {
  const lower = String(s || '').trim().toLocaleLowerCase('tr-TR');
  return lower.charAt(0).toLocaleUpperCase('tr-TR') + lower.slice(1);
}

/** Künyedeki tırnak içi dava türü. */
function davaTuruOf(text) {
  const m =
    /(?:aras[ıi]ndaki|dolay[ıi]s[ıi]yla|nedeniyle)\s*["'“‘]([^"'”’\n]{4,90})["'”’]/i.exec(
      text.slice(0, 2600)
    );
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
}

/** İlk derece mahkemesi: «MAHKEMESİ : Kayseri 2. İş Mahkemesi» */
function mahkemeOf(text) {
  const m = /MAHKEMES[İI]\s*:\s*([^\r\n]{3,80})/i.exec(text.slice(0, 2600));
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
}

// ── Dosyaları gez ───────────────────────────────────────────────────────────
function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.json')) out.push(p);
  }
  return out;
}

console.log('[yargi] karar dosyaları taranıyor…');
const files = walk(decisionsRoot);
console.log(`[yargi] ${files.length} dosya`);

const enrich = new Map();
const numStat = new Map();
const mulgaStat = new Map();
const rawCites = [];

let scanned = 0;
let withSubjects = 0;
let withCites = 0;
const t0 = Date.now();

for (const f of files) {
  let d;
  try {
    d = JSON.parse(readFileSync(f, 'utf8'));
  } catch {
    continue;
  }
  scanned += 1;
  if (scanned % 2500 === 0) process.stdout.write(`\r[yargi] ${scanned}/${files.length}…`);

  const text = decodeEntities(d.text || '');
  if (!text) continue;

  const konu = subjectsOf(text);
  if (konu.length) withSubjects += 1;

  const uniq = new Map();
  for (const c of citationsOf(text)) {
    const key = c.num + '#' + c.madde;
    const onceki = uniq.get(key);
    if (!onceki || (c.yapisal && !onceki.yapisal)) uniq.set(key, c);
  }
  if (uniq.size) withCites += 1;

  for (const c of uniq.values()) {
    rawCites.push([String(d.id), c.num, c.madde]);
    if (!numStat.has(c.num)) numStat.set(c.num, { adlar: new Map(), toplam: 0 });
    const s = numStat.get(c.num);
    s.adlar.set(c.ad, (s.adlar.get(c.ad) || 0) + 1);
    s.toplam += 1;
  }

  // Mülga/yürürlük nitelemeleri ayrı sayaçta: numStat o an henüz bu numarayı
  // görmemiş olabilir ve sayım eksik kalırdı.
  for (const m of text.matchAll(/(\d{3,4})\s*say[ıi]l[ıi]/gi)) {
    const num = m[1];
    if (!mulgaStat.has(num)) mulgaStat.set(num, { toplam: 0, mulga: 0, yururluk: 0 });
    mulgaStat.get(num).toplam += 1;
  }
  for (const m of text.matchAll(RE_MULGA_ONCE)) {
    const s = mulgaStat.get(m[1]);
    if (s) s.mulga += 1;
  }
  for (const m of text.matchAll(RE_YURURLUK_ONCE)) {
    const s = mulgaStat.get(m[1]);
    if (s) s.yururluk += 1;
  }

  enrich.set(String(d.id), {
    konu,
    dava: davaTuruOf(text),
    mahkeme: mahkemeOf(text),
    cites: [...uniq.values()].map((c) => [c.num, c.madde]),
    chars: text.length,
  });
}
process.stdout.write('\r');
console.log(
  `[yargi] ${scanned} karar okundu · ${withSubjects} konulu · ${withCites} atıflı · ` +
    `${((Date.now() - t0) / 1000).toFixed(0)} sn`
);

// ── Numara → paket eşlemesi ─────────────────────────────────────────────────
const adaylar = new Map();
for (const [num, s] of numStat) {
  const enSik = [...s.adlar.entries()].sort((a, b) => b[1] - a[1])[0];
  if (!enSik) continue;
  const packId = KUTUK_NORM.get(normalizeAd(enSik[0]));
  if (!packId) continue;
  const ms = mulgaStat.get(num);
  // Skor: «mülga X sayılı» ne kadar çok, «yürürlükteki X sayılı» ne kadar az
  // ise o kadar yüksek. Düşük skor = yürürlükteki kanun.
  const mulgaOran = ms && ms.toplam ? (ms.mulga - ms.yururluk) / ms.toplam : 0.5;
  if (!adaylar.has(packId)) adaylar.set(packId, []);
  adaylar.get(packId).push({
    num,
    ad: enSik[0],
    atif: s.toplam,
    mulgaOran,
    mulgaSayi: ms ? ms.mulga : 0,
    yururlukSayi: ms ? ms.yururluk : 0,
  });
}

const numToPack = new Map();
const eslemeRaporu = [];
for (const [packId, list] of adaylar) {
  // Yürürlükteki kanun: «mülga» ifadesine en az komşu olan numara.
  list.sort((a, b) => a.mulgaOran - b.mulgaOran || b.atif - a.atif);
  const kazanan = list[0];
  numToPack.set(kazanan.num, packId);
  eslemeRaporu.push({
    packId,
    secilen: kazanan.num,
    ad: kazanan.ad,
    atif: kazanan.atif,
    mulgaOran: Number(kazanan.mulgaOran.toFixed(3)),
    elenenler: list.slice(1).map((x) => ({
      num: x.num,
      atif: x.atif,
      mulgaOran: Number(x.mulgaOran.toFixed(3)),
    })),
  });
}
eslemeRaporu.sort((a, b) => b.atif - a.atif);
console.log(`[yargi] kanun eşlemesi: ${numToPack.size}/${KUTUK.length} kanun bağlandı`);

// ── Maddenin paketimizde gerçekten var olduğunu doğrula ─────────────────────
const packArticles = new Map();
if (existsSync(packsDir)) {
  for (const f of readdirSync(packsDir).filter((x) => x.endsWith('.json.gz'))) {
    const id = f.replace('.json.gz', '');
    try {
      const pack = JSON.parse(gunzipSync(readFileSync(join(packsDir, f))).toString());
      packArticles.set(id, new Set(Object.values(pack).map((e) => e.n).filter(Boolean)));
    } catch {
      /* bozuk paket eşlemeyi durdurmasın */
    }
  }
}

function cozumle(num, madde) {
  const packId = numToPack.get(num);
  if (!packId) return null;
  const arts = packArticles.get(packId);
  // Paketimizde olmayan madde numarası: büyük olasılıkla mülga sürüme atıf
  if (arts && arts.size && !arts.has(madde)) return null;
  return packId + '/' + madde;
}

// ── Ters indeks ─────────────────────────────────────────────────────────────
const atif = new Map();
let linked = 0;
let unlinked = 0;
for (const [id, num, madde] of rawCites) {
  const key = cozumle(num, madde);
  if (!key) {
    unlinked += 1;
    continue;
  }
  if (!atif.has(key)) atif.set(key, new Set());
  atif.get(key).add(id);
  linked += 1;
}
console.log(
  `[yargi] bağlanan atıf ${linked} · bağlanamayan ${unlinked} · kapsanan madde ${atif.size}`
);

const indexRows = readFileSync(join(yargiRoot, 'index.jsonl'), 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((l) => {
    try {
      return JSON.parse(l);
    } catch {
      return null;
    }
  })
  .filter(Boolean);

const meta = new Map(indexRows.map((r) => [String(r.id), r]));
const TIER_RANK = { yibk: 0, hgk: 1, cgk: 1, hdbk: 2 };
function rank(id) {
  const r = meta.get(id);
  if (!r) return 9;
  const t = TIER_RANK[r.tierId || r.alan];
  return t === undefined ? 5 : t;
}
function isoOf(id) {
  const r = meta.get(id);
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(r && r.tarih ? r.tarih : ''));
  return m ? m[3] + m[2] + m[1] : '0';
}

const MAX_PER_ARTICLE = 40;
const atifOut = {};
for (const [key, set] of atif) {
  const list = [...set].sort((a, b) => rank(a) - rank(b) || isoOf(b).localeCompare(isoOf(a)));
  atifOut[key] = { n: set.size, ids: list.slice(0, MAX_PER_ARTICLE) };
}

writeFileSync(
  join(outMevzuat, 'atif.json.gz'),
  gzipSync(Buffer.from(JSON.stringify(atifOut), 'utf8'), { level: 9 })
);

writeFileSync(
  join(outMevzuat, 'atif-meta.json'),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      taranan: scanned,
      konuBulunan: withSubjects,
      atifBulunan: withCites,
      baglananAtif: linked,
      baglanamayanAtif: unlinked,
      kapsananMadde: atif.size,
      maddeBasiEnCok: MAX_PER_ARTICLE,
      esleme: eslemeRaporu,
    },
    null,
    2
  )
);

// ── Zenginleştirilmiş arşiv ─────────────────────────────────────────────────
const archivePath = join(outIcthat, 'archive.json.gz');
if (!existsSync(archivePath)) {
  console.error('[yargi] archive.json.gz yok — önce scripts/build-icthat-data.mjs çalıştırın');
  process.exit(1);
}
const rows = JSON.parse(gunzipSync(readFileSync(archivePath)).toString());
let enriched = 0;
for (const row of rows) {
  const e = enrich.get(String(row.i));
  if (!e) continue;
  if (e.konu.length) row.j = e.konu;
  if (e.dava) row.v = e.dava;
  if (e.mahkeme) row.h = e.mahkeme;
  if (e.chars) row.c = e.chars;
  const refs = [];
  for (const [num, madde] of e.cites) {
    const key = cozumle(num, madde);
    if (key) refs.push(key);
  }
  if (refs.length) row.m = [...new Set(refs)].slice(0, 12);
  enriched += 1;
}

writeFileSync(archivePath, gzipSync(Buffer.from(JSON.stringify(rows), 'utf8'), { level: 9 }));

/*
 * Aranabilir katlanmış dizin.
 *
 * Arama, satırın künyesini ve konusunu Türkçe'ye duyarsız biçimde katlayıp
 * içinde arar. Bu katlama önceden CIHAZDA, her tuş vuruşunda yapılıyordu:
 * 23 bin satır × ICU `toLocaleLowerCase('tr-TR')` + yedi regex. Ölçüldüğünde
 * orta sınıf bir telefonda tek tuş 4,8 saniye sürüyordu — arama kutusu
 * uygulamayı donduruyordu.
 *
 * İş buraya taşındı. Cihaz artık hazır katlanmış metni `indexOf` ile tarar.
 * Dizin satır satır, arşivle AYNI SIRADA yazılır; i'inci satır i'inci karara
 * aittir. Ayrı dosya olması bilinçli: arama yapılmayan ekranlarda hiç
 * indirilmez ve arşiv indeksini şişirmez.
 */
const foldTr = (x) =>
  String(x || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');

const foldSatirlari = rows.map((r) =>
  foldTr(
    [r.k, r.d, r.a, r.e, r.r, r.v, r.h, ...(r.j || []), ...(r.w || [])]
      .filter(Boolean)
      .join(' ')
  ).replace(/\s+/g, ' ')
);

const foldPath = join(outIcthat, 'arama.txt.gz');
writeFileSync(
  foldPath,
  gzipSync(Buffer.from(foldSatirlari.join('\n'), 'utf8'), { level: 9 })
);
console.log(
  `[yargi] arama dizini: ${foldSatirlari.length} satır · ` +
    `${(readFileSync(foldPath).length / 1024).toFixed(0)} KB`
);

const konuluSatir = rows.filter((r) => r.j && r.j.length).length;
const atifliSatir = rows.filter((r) => r.m && r.m.length).length;
console.log(
  `[yargi] arşiv: ${enriched}/${rows.length} satır eşleşti · ` +
    `${(readFileSync(archivePath).length / 1024).toFixed(0)} KB`
);
console.log(
  `[yargi] konulu satır ${konuluSatir} (%${((konuluSatir / rows.length) * 100).toFixed(0)}) · ` +
    `madde atıflı satır ${atifliSatir} (%${((atifliSatir / rows.length) * 100).toFixed(0)})`
);

/*
  Sitenin arama indeksi de konu başlıklarını alır.

  `build-icthat-data.mjs` public/data/yargi-index.json.gz dosyasını bu
  betikten ÖNCE yazar; konu çıkarımı ise burada yapılır. Sıra böyle olduğu
  için site indeksi konusuz kalıyordu: mobil uygulamada satırlar
  «Konutta silahlı yağma suçu» derken sitede aynı kararlar
  «Yargıtay Ceza Genel Kurulu, E. 2025/585, K. 2026/353» künye duvarı
  olarak diziliyordu. Aynı veriden iki farklı kalite çıkıyordu.

  Zenginleştirme burada, konu çıkarıldıktan sonra uygulanır. Site indeksi
  yoksa adım sessizce atlanır — mobil derlemesi web klasörüne bağımlı
  olmamalıdır.
*/
/**
 * Özetin başındaki usul başlığını atar.
 *
 * Karar metinleri büyük harfli bir alan listesiyle başlar:
 * «İTİRAZIN İNCELENMEKSİZİN İADESİ KARARI KARARI VEREN YARGITAY DAİRESİ :
 * 6. Ceza Dairesi MAHKEMESİ :Ceza Dairesi SAYISI : 41-1463». Liste iki
 * satırlık özetin tamamını yiyor, geriye kararın tek cümlesi kalmıyordu —
 * üstelik aynı bilgi rozette ve künyede zaten duruyor.
 *
 * Alan listesi hemen her kararda `SAYISI : <numara>` ile biter; kesim orada
 * yapılır. Desen bulunamazsa özet olduğu gibi bırakılır.
 */
const OZET_VARLIK = {
  '&ldquo;': '“',
  '&rdquo;': '”',
  '&lsquo;': '‘',
  '&rsquo;': '’',
  '&quot;': '"',
  '&apos;': "'",
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&nbsp;': ' ',
  '&hellip;': '…',
  '&ndash;': '–',
  '&mdash;': '—',
  // Türkçede düzeltme işaretli harfler kaynakta varlık olarak geliyordu:
  // «â» yerine ekranda ham «&acirc;» görünüyordu.
  '&acirc;': 'â',
  '&icirc;': 'î',
  '&ucirc;': 'û',
  '&ocirc;': 'ô',
  '&ecirc;': 'ê',
  '&shy;': '',
  '&not;': '',
};

/**
 * Alan listesini bitiren etiketler.
 *
 * Başlık bloğu bunlardan biriyle biter; sonrasında kararın anlatısı başlar.
 * `Mahkemesi` tek başına bitirici DEĞİLDİR: değeri mahkeme adıdır ve anlatıya
 * ayraçsız karışır, kesim orada yapılırsa cümlenin başı kesilir.
 */
const OZET_SON_ETIKET = /(SAYISI|Sayısı|NUMARASI|Numarası|ESAS NO|KARAR NO)\s*:\s*/g;

function ozetiTemizle(e) {
  let s = String(e || '');

  // Kaçmamış HTML varlıkları ekranda ham görünüyordu: «&ldquo;takibin iptali&rdquo;»
  s = s.replace(/&[a-z]+;/gi, (m) => OZET_VARLIK[m.toLowerCase()] ?? m);
  s = s.replace(/&#(\d+);/g, (m, d) => {
    const n = Number(d);
    return n > 31 && n < 0x10000 ? String.fromCharCode(n) : m;
  });

  // Başlık bloğunun EN SON alanını bul, değerini de atla.
  OZET_SON_ETIKET.lastIndex = 0;
  let son = null;
  let m;
  while ((m = OZET_SON_ETIKET.exec(s)) !== null) {
    if (m.index > 400) break;
    son = m;
  }

  if (son) {
    const sonrasi = s.slice(son.index + son[0].length);
    /*
      Değer: numara, tarih ve esas/karar ekleri.

      «2011/23 E-2011/97 K.» gibi diziler tek bir değerdir; parçaları
      sırayla değil DÖNÜŞÜMLÜ olarak tükettirilir, yoksa sondaki «K.»
      artakalıp özetin başına yapışıyordu.
    */
    const deger = /^(?:[\d./\-–\s]+|[EK]\.?(?=[\s\-–]|$)[\s\-–]*)+/.exec(sonrasi);
    const kalan = (deger ? sonrasi.slice(deger[0].length) : sonrasi).trim();
    if (kalan.length > 60) return kalan;
  }

  return s.trim();
}

const siteIndexPath = join(portal, 'public', 'data', 'yargi-index.json.gz');
if (existsSync(siteIndexPath)) {
  try {
    const siteRows = JSON.parse(gunzipSync(readFileSync(siteIndexPath)).toString());
    const konuHarita = new Map();
    for (const r of rows) if (r.j && r.j.length) konuHarita.set(String(r.i), r.j);

    let eslesen = 0;
    let ozetTemiz = 0;
    for (const r of siteRows) {
      if (r.e) {
        const t = ozetiTemizle(r.e);
        if (t !== r.e) {
          r.e = t;
          ozetTemiz += 1;
        }
      }
      const j = konuHarita.get(String(r.i));
      if (!j) continue;
      r.j = j;
      eslesen += 1;
    }

    writeFileSync(
      siteIndexPath,
      gzipSync(Buffer.from(JSON.stringify(siteRows), 'utf8'), { level: 9 })
    );
    console.log(
      `[yargi] site indeksi: ${eslesen}/${siteRows.length} satır konu başlığı aldı ` +
        `(%${((eslesen / siteRows.length) * 100).toFixed(0)}) · ` +
        `${ozetTemiz} özetten usul başlığı atıldı`
    );
  } catch (e) {
    console.warn(`[yargi] site indeksi zenginleştirilemedi: ${e.message}`);
  }
}
if (konuluSatir < rows.length * 0.2) {
  console.error('[yargi] konu çıkarımı %20 eşiğinin altında — çıkarım bozulmuş olabilir');
  process.exit(1);
}
