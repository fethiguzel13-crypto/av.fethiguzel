/**
 * Kanun kütüğü — paket kimliği ile kanunun GERÇEK adı arasındaki tek kaynak.
 *
 * Neden var: paket manifestindeki ad, kanun klasörünün adından üretiliyordu ve
 * dört kanunda içerikle tutmuyordu. Aşağıdaki adların her biri kanunun KENDİ
 * resmî metninden doğrulandı (madde 1 metni ve kenar başlığı):
 *
 *   bk    → manifest "bk"                        · metin: "finansal piyasalarda
 *           güven ve istikrarın sağlanmasına…"   → Bankacılık Kanunu
 *   cck   → manifest "Çocuk Koruma Kanunu"       · metin: "ceza ve güvenlik
 *           tedbirlerinin infazına ilişkin…"     → İnfaz Kanunu
 *   kmk   → manifest "Kaçakçılıkla Mücadele"     · metin: "Kabahatlere ilişkin
 *           genel ilkeler…"                      → Kabahatler Kanunu
 *   nhk   → manifest "Nüfus Hizmetleri Kanunu"   · metin: "NOTERLİK KANUNU …
 *           Noterlik bir kamu hizmetidir."       → Noterlik Kanunu
 *
 * Yanlış ad, hukukçuyu yanlış kanuna götürür. Bu tablo manifesti EZER.
 *
 * Kanun numarası bilerek yazılmadı: paketlerin hiçbirinde "Kanun Numarası"
 * başlığı yok ve numarayı hafızadan yazmak, doğrulanmamış bilgi üretmek olur.
 * Numara gerektiğinde kanunun resmî kaynağından okunur.
 */

export type KanunKategori =
  | 'ozel'
  | 'usul'
  | 'ceza'
  | 'is'
  | 'mali'
  | 'kamu'
  | 'kisi'
  | 'kolluk';

export type KanunMeta = {
  id: string;
  /** Kanunun tam adı — metinden doğrulanmış */
  ad: string;
  /** Rozet için kısa kod */
  kod: string;
  kategori: KanunKategori;
  /** Aramada bu kanuna götüren ek anahtarlar */
  arama?: string[];
  /** Kullanıcıya gösterilecek uyarı — karışma riski ya da kapsam sınırı */
  not?: string;
};

export const KATEGORI: Record<KanunKategori, { ad: string; renk: string; sira: number }> = {
  ozel: { ad: 'Özel hukuk', renk: '#2E4036', sira: 1 },
  usul: { ad: 'Yargılama, icra ve noterlik', renk: '#1B4F72', sira: 2 },
  ceza: { ad: 'Ceza ve kabahatler', renk: '#7B241C', sira: 3 },
  is: { ad: 'İş ve sosyal güvenlik', renk: '#6B4F3A', sira: 4 },
  mali: { ad: 'Vergi, mali piyasa ve rekabet', renk: '#4A5D23', sira: 5 },
  kamu: { ad: 'Kamu yönetimi, imar ve ihale', renk: '#4B3F72', sira: 6 },
  kisi: { ad: 'Kişi hâlleri, aile koruma ve yabancılar', renk: '#8A5A2B', sira: 7 },
  kolluk: { ad: 'Kolluk, trafik ve askerî mevzuat', renk: '#33484F', sira: 8 },
};

export const KANUNLAR: KanunMeta[] = [
  // ── Özel hukuk ────────────────────────────────────────────────────────────
  { id: 'tmk', ad: 'Türk Medeni Kanunu', kod: 'TMK', kategori: 'ozel',
    arama: ['medeni', 'aile', 'miras', 'eşya', 'boşanma', 'velayet', 'nafaka', 'tapu'] },
  { id: 'tbk', ad: 'Türk Borçlar Kanunu', kod: 'TBK', kategori: 'ozel',
    arama: ['borçlar', 'borclar', 'sözleşme', 'haksız fiil', 'kira', 'satım', 'bk'] },
  { id: 'ttk', ad: 'Türk Ticaret Kanunu', kod: 'TTK', kategori: 'ozel',
    arama: ['ticaret', 'şirket', 'anonim', 'limited', 'kıymetli evrak', 'sigorta', 'deniz'] },
  { id: 'cek', ad: 'Çek Kanunu', kod: 'ÇEK', kategori: 'ozel',
    arama: ['çek', 'karşılıksız çek', 'keşideci'] },
  { id: 'katmulkiyeti', ad: 'Kat Mülkiyeti Kanunu', kod: 'KMK', kategori: 'ozel',
    arama: ['kat mülkiyeti', 'apartman', 'aidat', 'yönetim planı', 'ortak alan'] },
  { id: 'tkhk', ad: 'Tüketicinin Korunması Hakkında Kanun', kod: 'TKHK', kategori: 'ozel',
    arama: ['tüketici', 'ayıplı mal', 'cayma', 'tüketici hakem heyeti'] },

  // ── Yargılama, icra ve noterlik ───────────────────────────────────────────
  { id: 'hmk', ad: 'Hukuk Muhakemeleri Kanunu', kod: 'HMK', kategori: 'usul',
    arama: ['usul', 'yargılama', 'dava', 'delil', 'istinaf', 'temyiz', 'ihtiyati tedbir'] },
  { id: 'cmk', ad: 'Ceza Muhakemesi Kanunu', kod: 'CMK', kategori: 'usul',
    arama: ['ceza usul', 'soruşturma', 'kovuşturma', 'tutuklama', 'iddianame'] },
  { id: 'iik', ad: 'İcra ve İflas Kanunu', kod: 'İİK', kategori: 'usul',
    arama: ['icra', 'iflas', 'haciz', 'takip', 'itirazın iptali', 'ihale', 'konkordato'] },
  { id: 'tebligat', ad: 'Tebligat Kanunu', kod: 'TEB', kategori: 'usul',
    arama: ['tebligat', 'tebliğ', 'elektronik tebligat', 'muhatap'] },
  { id: 'arabuluculuk', ad: 'Hukuk Uyuşmazlıklarında Arabuluculuk Kanunu', kod: 'ARB', kategori: 'usul',
    arama: ['arabuluculuk', 'arabulucu', 'dava şartı', 'anlaşma belgesi'] },
  { id: 'nhk', ad: 'Noterlik Kanunu', kod: 'NOT', kategori: 'usul',
    arama: ['noter', 'noterlik', 'düzenleme', 'onaylama', 'vekâletname'],
    not: 'Paket kimliği (nhk) geçmişte Nüfus Hizmetleri Kanunu sanılmıştı; içerik Noterlik Kanunudur.' },

  // ── Ceza ve kabahatler ────────────────────────────────────────────────────
  { id: 'tck', ad: 'Türk Ceza Kanunu', kod: 'TCK', kategori: 'ceza',
    arama: ['ceza', 'suç', 'hapis', 'kasten yaralama', 'dolandırıcılık', 'hakaret'] },
  { id: 'cck', ad: 'Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun', kod: 'İNFAZ', kategori: 'ceza',
    arama: ['infaz', 'denetimli serbestlik', 'koşullu salıverilme', 'açık ceza infaz kurumu'],
    not: 'Paket kimliği (cck) geçmişte Çocuk Koruma Kanunu sanılmıştı; içerik İnfaz Kanunudur.' },
  { id: 'kmk', ad: 'Kabahatler Kanunu', kod: 'KAB', kategori: 'ceza',
    arama: ['kabahat', 'idari para cezası', 'idari yaptırım'],
    not: 'Paket kimliği (kmk) geçmişte Kaçakçılıkla Mücadele Kanunu sanılmıştı; içerik Kabahatler Kanunudur.' },

  // ── İş ve sosyal güvenlik ─────────────────────────────────────────────────
  { id: 'is-kanunu', ad: 'İş Kanunu', kod: 'İŞ K.', kategori: 'is',
    arama: ['iş', 'işçi', 'işveren', 'fesih', 'ihbar', 'fazla mesai', 'yıllık izin'] },
  { id: 'is-kanunu-1475', ad: '1475 sayılı İş Kanunu', kod: '1475', kategori: 'is',
    arama: ['kıdem tazminatı', 'eski iş kanunu', '1475'],
    not: 'Bu kanunun yalnız kıdem tazminatını düzenleyen 14. maddesi yürürlüktedir.' },
  { id: 'isg', ad: 'İş Sağlığı ve Güvenliği Kanunu', kod: 'İSG', kategori: 'is',
    arama: ['iş sağlığı', 'iş güvenliği', 'risk değerlendirmesi', 'iş kazası'] },
  { id: 'sendikalar', ad: 'Sendikalar ve Toplu İş Sözleşmesi Kanunu', kod: 'STİSK', kategori: 'is',
    arama: ['sendika', 'toplu iş sözleşmesi', 'grev', 'lokavt', 'yetki tespiti'] },
  { id: 'ssgssk', ad: 'Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu', kod: 'SGK', kategori: 'is',
    arama: ['sgk', 'sigorta', 'emeklilik', 'prim', 'hizmet tespiti', 'genel sağlık'] },

  // ── Vergi, mali piyasa ve rekabet ─────────────────────────────────────────
  { id: 'vuk', ad: 'Vergi Usul Kanunu', kod: 'VUK', kategori: 'mali',
    arama: ['vergi usul', 'tarhiyat', 'ceza', 'defter', 'fatura', 'zamanaşımı'] },
  { id: 'gvk', ad: 'Gelir Vergisi Kanunu', kod: 'GVK', kategori: 'mali',
    arama: ['gelir vergisi', 'stopaj', 'beyanname', 'serbest meslek'] },
  { id: 'kvk', ad: 'Kurumlar Vergisi Kanunu', kod: 'KVK', kategori: 'mali',
    arama: ['kurumlar vergisi', 'tasfiye', 'transfer fiyatlandırması'] },
  { id: 'kdvk', ad: 'Katma Değer Vergisi Kanunu', kod: 'KDV', kategori: 'mali',
    arama: ['kdv', 'katma değer', 'istisna', 'tevkifat'] },
  { id: 'otv', ad: 'Özel Tüketim Vergisi Kanunu', kod: 'ÖTV', kategori: 'mali',
    arama: ['ötv', 'özel tüketim'] },
  { id: 'aatuhk', ad: 'Amme Alacaklarının Tahsil Usulü Hakkında Kanun', kod: '6183', kategori: 'mali',
    arama: ['amme alacağı', 'ödeme emri', 'haciz', 'tecil', 'gecikme zammı'] },
  { id: 'bk', ad: 'Bankacılık Kanunu', kod: 'BANK', kategori: 'mali',
    arama: ['banka', 'bankacılık', 'bddk', 'kredi', 'mevduat'],
    not: 'Paket kimliği (bk) Borçlar Kanunu değildir. Borçlar için Türk Borçlar Kanununa bakınız.' },
  { id: 'spk', ad: 'Sermaye Piyasası Kanunu', kod: 'SPK', kategori: 'mali',
    arama: ['sermaye piyasası', 'halka arz', 'izahname', 'borsa', 'yatırım'] },
  { id: 'rkhk', ad: 'Rekabetin Korunması Hakkında Kanun', kod: 'RKHK', kategori: 'mali',
    arama: ['rekabet', 'kartel', 'hâkim durum', 'birleşme devralma'] },

  // ── Kamu yönetimi, imar ve ihale ──────────────────────────────────────────
  { id: 'dmk', ad: 'Devlet Memurları Kanunu', kod: 'DMK', kategori: 'kamu',
    arama: ['memur', 'disiplin', 'atama', 'özlük', 'kamu görevlisi'] },
  { id: 'belediye', ad: 'Belediye Kanunu', kod: 'BEL', kategori: 'kamu',
    arama: ['belediye', 'meclis', 'encümen', 'belediye başkanı'] },
  { id: 'buyuksehir', ad: 'Büyükşehir Belediyesi Kanunu', kod: 'BŞB', kategori: 'kamu',
    arama: ['büyükşehir', 'ilçe belediyesi'] },
  { id: 'il-idaresi', ad: 'İl İdaresi Kanunu', kod: 'İL', kategori: 'kamu',
    arama: ['vali', 'kaymakam', 'il idaresi', 'mülki amir'] },
  { id: 'imar', ad: 'İmar Kanunu', kod: 'İMAR', kategori: 'kamu',
    arama: ['imar', 'ruhsat', 'yapı', 'plan', 'kaçak yapı', 'iskân'] },
  { id: 'kamulastirma', ad: 'Kamulaştırma Kanunu', kod: 'KAM', kategori: 'kamu',
    arama: ['kamulaştırma', 'bedel tespiti', 'acele kamulaştırma', 'kamulaştırmasız elatma'] },
  { id: 'devlet-ihale', ad: 'Devlet İhale Kanunu', kod: '2886', kategori: 'kamu',
    arama: ['devlet ihale', 'ihale', 'artırma eksiltme'] },
  { id: 'kamu-ihale-sozlesmeleri', ad: 'Kamu İhale Sözleşmeleri Kanunu', kod: 'KİSK', kategori: 'kamu',
    arama: ['kamu ihale sözleşmesi', 'yapım sözleşmesi', 'fiyat farkı', 'mücbir sebep'] },
  { id: 'dernekler', ad: 'Dernekler Kanunu', kod: 'DER', kategori: 'kamu',
    arama: ['dernek', 'genel kurul', 'denetim'] },
  { id: 'vakiflar', ad: 'Vakıflar Kanunu', kod: 'VAK', kategori: 'kamu',
    arama: ['vakıf', 'mazbut vakıf', 'mülhak vakıf', 'vakıflar genel müdürlüğü'] },

  // ── Kişi hâlleri, aile koruma ve yabancılar ───────────────────────────────
  { id: 'tvk', ad: 'Türk Vatandaşlığı Kanunu', kod: 'TVK', kategori: 'kisi',
    arama: ['vatandaşlık', 'mavi kart', 'çıkma izni', 'istisnai vatandaşlık'] },
  { id: 'yukk', ad: 'Yabancılar ve Uluslararası Koruma Kanunu', kod: 'YUKK', kategori: 'kisi',
    arama: ['yabancı', 'ikamet izni', 'sınır dışı', 'uluslararası koruma', 'mülteci'] },
  { id: 'aile-koruma', ad: 'Ailenin Korunması ve Kadına Karşı Şiddetin Önlenmesine Dair Kanun', kod: '6284', kategori: 'kisi',
    arama: ['koruma kararı', 'uzaklaştırma', 'şiddet', 'tedbir kararı', '6284'] },
  { id: 'kvkk', ad: 'Kişisel Verilerin Korunması Kanunu', kod: 'KVKK', kategori: 'kisi',
    arama: ['kişisel veri', 'aydınlatma', 'açık rıza', 'veri sorumlusu', 'kvkk'] },

  // ── Kolluk, trafik ve askerî mevzuat ──────────────────────────────────────
  { id: 'ktk', ad: 'Karayolları Trafik Kanunu', kod: 'KTK', kategori: 'kolluk',
    arama: ['trafik', 'kaza', 'ehliyet', 'sürücü', 'zorunlu mali sorumluluk'] },
  { id: 'pvsk', ad: 'Polis Vazife ve Salâhiyet Kanunu', kod: 'PVSK', kategori: 'kolluk',
    arama: ['polis', 'önleme araması', 'kimlik sorma', 'zor kullanma'] },
  { id: 'jandarma', ad: 'Jandarma Teşkilat, Görev ve Yetkileri Kanunu', kod: 'JAN', kategori: 'kolluk',
    arama: ['jandarma', 'kolluk'] },
  { id: 'tsk-ic-hizmet', ad: 'Türk Silâhlı Kuvvetleri İç Hizmet Kanunu', kod: 'TSK', kategori: 'kolluk',
    arama: ['askeri', 'silahlı kuvvetler', 'iç hizmet', 'ast üst'] },
];

const BY_ID = new Map(KANUNLAR.map((k) => [k.id, k]));

export function kanunMeta(id: string): KanunMeta | undefined {
  return BY_ID.get(id);
}

/** Kanunun gösterilecek adı. Kütükte yoksa manifest adına, o da yoksa kimliğe düşer. */
export function kanunAdi(id: string, fallback?: string): string {
  const meta = BY_ID.get(id);
  if (meta) return meta.ad;
  if (fallback && fallback !== id) return fallback;
  return id.toLocaleUpperCase('tr-TR');
}

/** Rozet kodu — «TBK», «İİK». Kütükte yoksa kimlikten üretilir. */
export function kanunKodu(id: string): string {
  return BY_ID.get(id)?.kod ?? id.slice(0, 4).toLocaleUpperCase('tr-TR');
}

/** Madde başlığı için «TBK m. 13» biçimi. */
export function maddeBasligi(kanunId: string, maddeNo: number | string): string {
  return `${kanunKodu(kanunId)} m. ${maddeNo}`;
}

export type KategoriGrubu = {
  key: KanunKategori;
  ad: string;
  renk: string;
  kanunlar: KanunMeta[];
};

/**
 * Kanunları kategoriye göre gruplar.
 *
 * Kütükte olmayan bir paket kimliği gelirse kaybolmaz: «Diğer» grubuna
 * düşer. Alfabetik tek liste 46 kanunu «bk, spk, yukk» gibi anlaşılmaz bir
 * çorbaya çeviriyordu; kategori, hukukçunun zihnindeki tasnifi ekrana taşır.
 */
export function kategoriGruplari(ids: string[]): KategoriGrubu[] {
  const bilinen = new Set(ids);
  const gruplar: KategoriGrubu[] = [];

  for (const key of (Object.keys(KATEGORI) as KanunKategori[]).sort(
    (a, b) => KATEGORI[a].sira - KATEGORI[b].sira
  )) {
    const kanunlar = KANUNLAR.filter((k) => k.kategori === key && bilenen(k.id));
    if (kanunlar.length) {
      gruplar.push({ key, ad: KATEGORI[key].ad, renk: KATEGORI[key].renk, kanunlar });
    }
  }

  const kapsanan = new Set(gruplar.flatMap((g) => g.kanunlar.map((k) => k.id)));
  const artan = ids.filter((id) => !kapsanan.has(id));
  if (artan.length) {
    gruplar.push({
      key: 'kamu',
      ad: 'Diğer',
      renk: '#5A5A5A',
      kanunlar: artan.map((id) => ({
        id,
        ad: id.toLocaleUpperCase('tr-TR'),
        kod: id.slice(0, 4).toLocaleUpperCase('tr-TR'),
        kategori: 'kamu' as const,
      })),
    });
  }

  return gruplar;

  function bilenen(id: string): boolean {
    return bilinen.has(id);
  }
}
