/**
 * Generates lib/vatandas-rehberi/data.ts — SEO citizen guides.
 * Run: node scripts/generate-vatandas-rehberi.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dir, '..', 'lib', 'vatandas-rehberi', 'data.ts');
const UPDATED = '2026-07-27';

/** @typedef {{ slug: string, title: string, description: string, h1: string, keywords: string[], category: string, related: string[], links: {label:string,href:string}[], seed: string }} Topic */

/** @type {Topic[]} */
const TOPICS = [
  {
    slug: 'emlak-vergisi-nedir',
    title: 'Emlak Vergisi Nedir? Nasıl Hesaplanır ve Ödenir?',
    description:
      'Emlak vergisi nedir, kimler öder, oranlar, beyan, taksit ve e-Devlet ödeme. Vatandaşlar için güncel bilgilendirme rehberi.',
    h1: 'Emlak vergisi nedir? Nasıl hesaplanır ve ödenir?',
    keywords: ['emlak vergisi nedir', 'emlak vergisi nasıl ödenir', 'emlak vergisi oranları', 'emlak vergisi beyanı'],
    category: 'Vergi',
    related: ['vergi-borcu-yapislandirma', 'tapu-devri-nasil-yapilir', 'veraset-ilami-nasil-alinir'],
    links: [
      { label: 'Vergi Usul Kanunu maddeleri', href: '/kategori/vuk' },
      { label: 'Hukuki hesaplama araçları', href: '/hesaplama' },
    ],
    seed: 'emlak_vergisi',
  },
  {
    slug: 'veraset-ilami-nasil-alinir',
    title: 'Veraset İlamı Nasıl Alınır? e-Devlet ve Noter',
    description:
      'Veraset ilamı nedir, e-Devletten nasıl alınır, noter ve mahkeme yolu, gerekli belgeler. Adım adım vatandaş rehberi.',
    h1: 'Veraset ilamı nasıl alınır?',
    keywords: ['veraset ilamı nasıl alınır', 'veraset ilamı e-devlet', 'mirasçılık belgesi', 'veraset belgesi'],
    category: 'Miras',
    related: ['miras-payi-nasil-hesaplanir', 'e-devlet-veraset', 'tapu-devri-nasil-yapilir'],
    links: [
      { label: 'Miras hukuku (TMK)', href: '/kategori/miras-hukuku' },
      { label: 'Miras payı hesaplama', href: '/hesaplama/miras' },
    ],
    seed: 'veraset',
  },
  {
    slug: 'trafik-cezasina-itiraz',
    title: 'Trafik Cezasına İtiraz Nasıl Yapılır?',
    description:
      'Trafik cezasına itiraz süresi, usulü, e-Devlet, sulh ceza hakimliği ve idari yargı yolları. Adım adım bilgilendirme.',
    h1: 'Trafik cezasına itiraz nasıl yapılır?',
    keywords: ['trafik cezasına itiraz', 'trafik cezası itiraz süresi', 'EDS ceza itiraz', 'HTS itiraz'],
    category: 'Trafik',
    related: ['idari-dava-nasil-acilir', 'tebligat-usulsuzlugu', 'ehliyet-alma-sartlari'],
    links: [
      { label: 'Karayolları Trafik Kanunu', href: '/kategori/ktk' },
      { label: 'Mevzuat arama', href: '/ara?q=trafik' },
    ],
    seed: 'trafik',
  },
  {
    slug: 'idari-dava-nasil-acilir',
    title: 'İdari Dava Nasıl Açılır? Süre, Görev ve Dilekçe',
    description:
      'İdari dava nedir, iptal ve tam yargı, 60 günlük süre, görevli mahkeme, dilekçe unsurları. Vatandaş rehberi.',
    h1: 'İdari dava nasıl açılır?',
    keywords: ['idari dava nasıl açılır', 'iptal davası', 'tam yargı davası', 'idari yargı süresi'],
    category: 'İdare',
    related: ['hukuk-davasi-nasil-acilir', 'trafik-cezasina-itiraz', 'kamulastirma-nedir'],
    links: [
      { label: 'Mevzuat bankası', href: '/mevzuat' },
      { label: 'İçtihat takibi', href: '/icthat' },
    ],
    seed: 'idari',
  },
  {
    slug: 'hukuk-davasi-nasil-acilir',
    title: 'Hukuk Davası Nasıl Açılır? Görev, Yetki, Harç',
    description:
      'Hukuk davası açma süreci, görevli mahkeme, yetki, harç, tebligat ve arabuluculuk dava şartı. Adım adım rehber.',
    h1: 'Hukuk davası nasıl açılır?',
    keywords: ['hukuk davası nasıl açılır', 'dava dilekçesi', 'mahkeme harcı', 'arabuluculuk dava şartı'],
    category: 'Usul',
    related: ['idari-dava-nasil-acilir', 'arabuluculuk-nasil-yapilir', 'ihtiyati-tedbir-nedir'],
    links: [
      { label: 'HMK maddeleri', href: '/kategori/hmk' },
      { label: 'Arabuluculuk rehberi', href: '/rehber/arabuluculuk' },
    ],
    seed: 'hukuk',
  },
  {
    slug: 'engelli-araci-nasil-alinir',
    title: 'Engelli Aracı Nasıl Alınır? ÖTV Muafiyeti ve Plaka',
    description:
      'Engelli aracı alma şartları, ÖTV muafiyeti, engelli raporu, plaka ve devir kuralları. Vatandaş bilgilendirme rehberi.',
    h1: 'Engelli aracı nasıl alınır?',
    keywords: ['engelli aracı nasıl alınır', 'engelli ÖTV muafiyeti', 'engelli plaka', 'engelli araç şartları'],
    category: 'Engelli Hakları',
    related: ['engelli-raporu-nasil-alinir', 'emlak-vergisi-nedir', 'vergi-borcu-yapislandirma'],
    links: [
      { label: 'ÖTV Kanunu', href: '/kategori/otv' },
      { label: 'Mevzuat arama', href: '/ara?q=%C3%96TV' },
    ],
    seed: 'engelli_arac',
  },
  {
    slug: 'bosanma-davasi-nasil-acilir',
    title: 'Boşanma Davası Nasıl Açılır? Anlaşmalı ve Çekişmeli',
    description:
      'Anlaşmalı ve çekişmeli boşanma, nafaka, velayet, mal rejimi ve süreç. Adım adım vatandaş bilgilendirmesi.',
    h1: 'Boşanma davası nasıl açılır?',
    keywords: ['boşanma davası nasıl açılır', 'anlaşmalı boşanma', 'çekişmeli boşanma', 'boşanma dilekçesi'],
    category: 'Aile',
    related: ['nafaka-davasi-nedir', 'velayet-davasi', 'koruma-karari-6284'],
    links: [
      { label: 'Aile hukuku', href: '/kategori/aile-hukuku' },
      { label: 'Hesaplama araçları', href: '/hesaplama' },
    ],
    seed: 'bosanma',
  },
  {
    slug: 'nafaka-davasi-nedir',
    title: 'Nafaka Davası Nedir? Türleri ve Hesaplama',
    description:
      'İştirak, yoksulluk ve tedbir nafakası nedir, nasıl istenir, neye göre belirlenir. Bilgilendirme rehberi.',
    h1: 'Nafaka davası nedir? Türleri ve süreç',
    keywords: ['nafaka davası', 'yoksulluk nafakası', 'iştirak nafakası', 'nafaka nasıl hesaplanır'],
    category: 'Aile',
    related: ['bosanma-davasi-nasil-acilir', 'velayet-davasi', 'hukuk-davasi-nasil-acilir'],
    links: [
      { label: 'Nafaka hesaplama', href: '/hesaplama/nafaka' },
      { label: 'Aile hukuku', href: '/kategori/aile-hukuku' },
    ],
    seed: 'nafaka',
  },
  {
    slug: 'icra-takibi-nedir',
    title: 'İcra Takibi Nedir? Nasıl Başlatılır ve Durdurulur?',
    description:
      'İcra takibi nedir, ilamlı/ilamsız takip, ödeme emri, haciz ve itiraz. Vatandaşlar için sade anlatım.',
    h1: 'İcra takibi nedir? Nasıl işler?',
    keywords: ['icra takibi nedir', 'icra takibi nasıl başlatılır', 'haciz nedir', 'ödeme emri'],
    category: 'İcra',
    related: ['odeme-emrine-itiraz', 'icra-dosyasi-sorgulama', 'senet-icra-takibi'],
    links: [
      { label: 'İİK maddeleri', href: '/kategori/iik' },
      { label: 'Faiz hesaplama', href: '/hesaplama/faiz' },
    ],
    seed: 'icra',
  },
  {
    slug: 'odeme-emrine-itiraz',
    title: 'Ödeme Emrine İtiraz Nasıl Yapılır? Süre ve Sonuç',
    description:
      'Ödeme emrine itiraz süresi (7 gün), usulü, itirazın iptali ve menfi tespit. Adım adım rehber.',
    h1: 'Ödeme emrine itiraz nasıl yapılır?',
    keywords: ['ödeme emrine itiraz', '7 gün itiraz', 'itirazın iptali', 'icra itirazı'],
    category: 'İcra',
    related: ['icra-takibi-nedir', 'tebligat-usulsuzlugu', 'hukuk-davasi-nasil-acilir'],
    links: [
      { label: 'İİK şerhleri', href: '/kategori/iik' },
      { label: 'Tebligat Kanunu', href: '/kategori/tebligat' },
    ],
    seed: 'odeme_emri',
  },
  {
    slug: 'arabuluculuk-nasil-yapilir',
    title: 'Arabuluculuk Nasıl Yapılır? Dava Şartı ve Süreç',
    description:
      'Arabuluculuk nedir, hangi davalarda zorunlu, başvuru, anlaşma belgesi ve mahkeme ilişkisi. Bilgilendirme.',
    h1: 'Arabuluculuk nasıl yapılır?',
    keywords: ['arabuluculuk nedir', 'zorunlu arabuluculuk', 'arabuluculuk başvurusu', 'anlaşma belgesi'],
    category: 'Usul',
    related: ['hukuk-davasi-nasil-acilir', 'is-sozlesmesi-feshi', 'tuketici-hakem-heyeti'],
    links: [
      { label: 'Arabuluculuk rehberi', href: '/rehber/arabuluculuk' },
      { label: 'Arabuluculuk Kanunu', href: '/kategori/arabuluculuk' },
    ],
    seed: 'arabuluculuk',
  },
  {
    slug: 'kira-artis-orani-nasil-hesaplanir',
    title: 'Kira Artış Oranı Nasıl Hesaplanır?',
    description:
      'Konut ve işyeri kira artışı, yasal sınır, TÜFE ve sözleşme hükmü. Vatandaş bilgilendirme rehberi.',
    h1: 'Kira artış oranı nasıl hesaplanır?',
    keywords: ['kira artış oranı', 'kira zammı nasıl hesaplanır', 'konut kira artışı', 'TÜFE kira'],
    category: 'Kira',
    related: ['hukuk-davasi-nasil-acilir', 'arabuluculuk-nasil-yapilir', 'tapu-devri-nasil-yapilir'],
    links: [
      { label: 'Kira artış hesaplama', href: '/hesaplama/kira' },
      { label: 'TBK kira hükümleri', href: '/kategori/borclar-ozel' },
    ],
    seed: 'kira',
  },
  {
    slug: 'tapu-devri-nasil-yapilir',
    title: 'Tapu Devri Nasıl Yapılır? Belgeler ve Masraflar',
    description:
      'Tapuda satış ve devir işlemi, gerekli belgeler, harç, randevu ve dikkat edilecekler. Adım adım rehber.',
    h1: 'Tapu devri nasıl yapılır?',
    keywords: ['tapu devri nasıl yapılır', 'tapu satış işlemleri', 'tapu harcı', 'tapu randevu'],
    category: 'Eşya',
    related: ['iskan-belgesi-nedir', 'emlak-vergisi-nedir', 'veraset-ilami-nasil-alinir'],
    links: [
      { label: 'Eşya hukuku / TMK', href: '/kategori/esya-hukuku' },
      { label: 'Kat mülkiyeti', href: '/kategori/katmulkiyeti' },
    ],
    seed: 'tapu',
  },
  {
    slug: 'iskan-belgesi-nedir',
    title: 'İskan Belgesi Nedir? Nasıl Alınır?',
    description:
      'Yapı kullanma izni (iskan) nedir, neden gerekir, başvuru ve eksik iskan riskleri. Bilgilendirme rehberi.',
    h1: 'İskan belgesi (yapı kullanma izni) nedir?',
    keywords: ['iskan belgesi nedir', 'iskan nasıl alınır', 'yapı kullanma izni', 'iskansız daire'],
    category: 'İmar',
    related: ['kacak-yapi-cezasi', 'tapu-devri-nasil-yapilir', 'kamulastirma-nedir'],
    links: [
      { label: 'İmar Kanunu', href: '/kategori/imar' },
      { label: 'Belediye Kanunu', href: '/kategori/belediye' },
    ],
    seed: 'iskan',
  },
  {
    slug: 'tuketici-hakem-heyeti',
    title: 'Tüketici Hakem Heyeti Başvurusu Nasıl Yapılır?',
    description:
      'Tüketici hakem heyeti başvuru şartları, e-Devlet, parasal sınır, süre ve itiraz. Vatandaş rehberi.',
    h1: 'Tüketici hakem heyetine nasıl başvurulur?',
    keywords: ['tüketici hakem heyeti', 'tüketici şikayeti', 'e-devlet tüketici', 'tüketici davası'],
    category: 'Tüketici',
    related: ['abonelik-iptali-tuketici', 'hukuk-davasi-nasil-acilir', 'arabuluculuk-nasil-yapilir'],
    links: [
      { label: 'Tüketicinin Korunması Kanunu', href: '/kategori/tkhk' },
      { label: 'Mevzuat arama', href: '/ara?q=t%C3%BCketici' },
    ],
    seed: 'tuketici',
  },
  {
    slug: 'savcilik-suc-duyurusu',
    title: 'Savcılığa Suç Duyurusu Nasıl Yapılır?',
    description:
      'Suç duyurusu nedir, dilekçe, e-şikayet, delil ve süreç. Vatandaşlar için bilgilendirme rehberi.',
    h1: 'Savcılığa suç duyurusu nasıl yapılır?',
    keywords: ['suç duyurusu nasıl yapılır', 'savcılığa şikayet', 'e-şikayet', 'suç duyurusu dilekçesi'],
    category: 'Ceza',
    related: ['hukuk-davasi-nasil-acilir', 'koruma-karari-6284', 'tebligat-usulsuzlugu'],
    links: [
      { label: 'CMK maddeleri', href: '/kategori/cmk' },
      { label: 'TCK', href: '/kategori/tck-genel' },
    ],
    seed: 'suc',
  },
  {
    slug: 'koruma-karari-6284',
    title: '6284 Koruma Kararı Nedir? Nasıl Alınır?',
    description:
      '6284 sayılı Kanun kapsamında koruma ve uzaklaştırma kararı, başvuru mercileri ve süre. Bilgilendirme.',
    h1: '6284 koruma kararı nedir? Nasıl alınır?',
    keywords: ['6284 koruma kararı', 'uzaklaştırma kararı', 'aile içi şiddet', 'ŞÖNİM başvuru'],
    category: 'Aile',
    related: ['bosanma-davasi-nasil-acilir', 'savcilik-suc-duyurusu', 'velayet-davasi'],
    links: [
      { label: 'Ailenin Korunması Kanunu', href: '/kategori/aile-koruma' },
      { label: 'Aile hukuku', href: '/kategori/aile-hukuku' },
    ],
    seed: 'k6284',
  },
  {
    slug: 'velayet-davasi',
    title: 'Velayet Davası Nedir? Nasıl Açılır?',
    description:
      'Velayet nedir, boşanmada velayet, kişisel ilişki ve çocuğun üstün yararı. Vatandaş bilgilendirme rehberi.',
    h1: 'Velayet davası nedir? Nasıl yürütülür?',
    keywords: ['velayet davası', 'çocuk velayeti', 'kişisel ilişki', 'velayet değişikliği'],
    category: 'Aile',
    related: ['bosanma-davasi-nasil-acilir', 'nafaka-davasi-nedir', 'koruma-karari-6284'],
    links: [
      { label: 'Aile hukuku', href: '/kategori/aile-hukuku' },
      { label: 'Çocuk Koruma Kanunu', href: '/kategori/cck' },
    ],
    seed: 'velayet',
  },
  {
    slug: 'is-kazasi-tazminati',
    title: 'İş Kazası Tazminatı Nedir? Nasıl Alınır?',
    description:
      'İş kazası bildirimi, SGK, maddi-manevi tazminat ve zamanaşımı. İşçi ve yakınları için rehber.',
    h1: 'İş kazası tazminatı nedir? Nasıl talep edilir?',
    keywords: ['iş kazası tazminatı', 'iş kazası bildirimi', 'manevi tazminat iş kazası', 'SGK iş kazası'],
    category: 'İş',
    related: ['kidem-tazminati-nasil-alinir', 'is-sozlesmesi-feshi', 'arabuluculuk-nasil-yapilir'],
    links: [
      { label: 'İş Kanunu', href: '/kategori/is-kanunu' },
      { label: 'İSG Kanunu', href: '/kategori/isg' },
    ],
    seed: 'is_kazasi',
  },
  {
    slug: 'kidem-tazminati-nasil-alinir',
    title: 'Kıdem Tazminatı Nasıl Alınır? Şartlar ve Hesap',
    description:
      'Kıdem tazminatı şartları, hak eden haller, tavan, arabuluculuk ve dava. Vatandaş bilgilendirme rehberi.',
    h1: 'Kıdem tazminatı nasıl alınır?',
    keywords: ['kıdem tazminatı nasıl alınır', 'kıdem tazminatı şartları', 'kıdem hesabı', 'işten çıkınca tazminat'],
    category: 'İş',
    related: ['is-sozlesmesi-feshi', 'arabuluculuk-nasil-yapilir', 'is-kazasi-tazminati'],
    links: [
      { label: 'Kıdem rehberi', href: '/rehber/kidem-tazminati' },
      { label: 'Kıdem hesaplama', href: '/hesaplama/kidem' },
    ],
    seed: 'kidem',
  },
  {
    slug: 'e-devlet-veraset',
    title: 'e-Devlet Veraset İlamı Sorgulama ve Alma',
    description:
      'e-Devlet üzerinden veraset/mirasçılık belgesi alma ve sorgulama adımları. Pratik vatandaş rehberi.',
    h1: 'e-Devlet ile veraset ilamı nasıl alınır?',
    keywords: ['e-devlet veraset ilamı', 'mirasçılık belgesi e-devlet', 'veraset sorgulama'],
    category: 'Miras',
    related: ['veraset-ilami-nasil-alinir', 'miras-payi-nasil-hesaplanir', 'tapu-devri-nasil-yapilir'],
    links: [
      { label: 'Miras payı hesaplama', href: '/hesaplama/miras' },
      { label: 'Miras hukuku', href: '/kategori/miras-hukuku' },
    ],
    seed: 'edevlet_veraset',
  },
  {
    slug: 'miras-payi-nasil-hesaplanir',
    title: 'Miras Payı Nasıl Hesaplanır? Yasal Mirasçılık',
    description:
      'Yasal miras payları, zümre sistemi, eşin payı ve saklı pay. Hesaplama aracıyla bilgilendirme.',
    h1: 'Miras payı nasıl hesaplanır?',
    keywords: ['miras payı nasıl hesaplanır', 'yasal mirasçılık', 'eşin miras payı', 'saklı pay'],
    category: 'Miras',
    related: ['veraset-ilami-nasil-alinir', 'e-devlet-veraset', 'tapu-devri-nasil-yapilir'],
    links: [
      { label: 'Miras paylaşımı rehberi', href: '/rehber/miras-paylasimi' },
      { label: 'Miras hesaplama', href: '/hesaplama/miras' },
    ],
    seed: 'miras_pay',
  },
  {
    slug: 'tebligat-usulsuzlugu',
    title: 'Tebligat Usulsüzlüğü Nedir? Ne Yapılır?',
    description:
      'Usulsüz tebligat, öğrenme tarihi, itiraz ve hak kaybını önleme. Vatandaş bilgilendirme rehberi.',
    h1: 'Tebligat usulsüzlüğü nedir? Ne yapılmalı?',
    keywords: ['tebligat usulsüzlüğü', 'usulsüz tebligat', 'tebligat itirazı', 'e-tebligat'],
    category: 'Usul',
    related: ['odeme-emrine-itiraz', 'hukuk-davasi-nasil-acilir', 'icra-takibi-nedir'],
    links: [
      { label: 'Tebligat Kanunu', href: '/kategori/tebligat' },
      { label: 'HMK', href: '/kategori/hmk' },
    ],
    seed: 'tebligat',
  },
  {
    slug: 'ihtiyati-tedbir-nedir',
    title: 'İhtiyati Tedbir Nedir? Nasıl İstenir?',
    description:
      'İhtiyati tedbir şartları, teminat, başvuru ve kaldırılması. Hukuk davalarında koruyucu tedbir rehberi.',
    h1: 'İhtiyati tedbir nedir? Nasıl alınır?',
    keywords: ['ihtiyati tedbir nedir', 'ihtiyati tedbir nasıl alınır', 'tedbir kararı', 'teminat'],
    category: 'Usul',
    related: ['hukuk-davasi-nasil-acilir', 'icra-takibi-nedir', 'tapu-devri-nasil-yapilir'],
    links: [
      { label: 'HMK maddeleri', href: '/kategori/hmk' },
      { label: 'Mevzuat arama', href: '/ara?q=ihtiyati%20tedbir' },
    ],
    seed: 'tedbir',
  },
  {
    slug: 'engelli-raporu-nasil-alinir',
    title: 'Engelli Raporu Nasıl Alınır? Sağlık Kurulu',
    description:
      'Engelli sağlık kurulu raporu başvurusu, oran, e-Devlet ve haklar. Vatandaş bilgilendirme rehberi.',
    h1: 'Engelli raporu nasıl alınır?',
    keywords: ['engelli raporu nasıl alınır', 'sağlık kurulu raporu', 'engelli oranı', 'engelli kimlik'],
    category: 'Engelli Hakları',
    related: ['engelli-araci-nasil-alinir', 'emlak-vergisi-nedir', 'vergi-borcu-yapislandirma'],
    links: [
      { label: 'Mevzuat arama', href: '/ara?q=engelli' },
      { label: 'Hesaplama araçları', href: '/hesaplama' },
    ],
    seed: 'engelli_rapor',
  },
  {
    slug: 'vergi-borcu-yapislandirma',
    title: 'Vergi Borcu Yapılandırma Nedir? Nasıl Başvurulur?',
    description:
      'Vergi ve kamu alacağı yapılandırması, başvuru kanalları, peşin/taksit ve dikkat edilecekler.',
    h1: 'Vergi borcu yapılandırma nedir? Nasıl başvurulur?',
    keywords: ['vergi borcu yapılandırma', 'vergi affı', 'e-devlet yapılandırma', 'kamu alacağı yapılandırma'],
    category: 'Vergi',
    related: ['emlak-vergisi-nedir', 'icra-takibi-nedir', 'odeme-emrine-itiraz'],
    links: [
      { label: 'AATUHK', href: '/kategori/aatuhk' },
      { label: 'VUK', href: '/kategori/vuk' },
    ],
    seed: 'yapilandirma',
  },
  {
    slug: 'kamulastirma-nedir',
    title: 'Kamulaştırma Nedir? Bedel ve Dava Yolları',
    description:
      'Kamulaştırma süreci, bedel tespiti, idari ve yargısal itiraz. Mal sahipleri için bilgilendirme.',
    h1: 'Kamulaştırma nedir? Haklarınız nelerdir?',
    keywords: ['kamulaştırma nedir', 'kamulaştırma bedeli', 'acele kamulaştırma', 'kamulaştırmasız el atma'],
    category: 'İdare',
    related: ['idari-dava-nasil-acilir', 'tapu-devri-nasil-yapilir', 'kacak-yapi-cezasi'],
    links: [
      { label: 'Kamulaştırma Kanunu', href: '/kategori/kamulastirma' },
      { label: 'İmar Kanunu', href: '/kategori/imar' },
    ],
    seed: 'kamulastirma',
  },
  {
    slug: 'kacak-yapi-cezasi',
    title: 'Kaçak Yapı Cezası Nedir? Yıkım ve İtiraz',
    description:
      'Ruhsatsız yapı, idari para cezası, mühürleme ve yargı yolu. Vatandaş bilgilendirme rehberi.',
    h1: 'Kaçak yapı cezası nedir? Ne yapılır?',
    keywords: ['kaçak yapı cezası', 'ruhsatsız yapı', 'yıkım kararı', 'imar kirliliği'],
    category: 'İmar',
    related: ['iskan-belgesi-nedir', 'idari-dava-nasil-acilir', 'kamulastirma-nedir'],
    links: [
      { label: 'İmar Kanunu', href: '/kategori/imar' },
      { label: 'Belediye', href: '/kategori/belediye' },
    ],
    seed: 'kacak',
  },
  {
    slug: 'abonelik-iptali-tuketici',
    title: 'Abonelik İptali Nasıl Yapılır? Tüketici Hakları',
    description:
      'İnternet, GSM, dergi abonelik iptali, cayma hakkı ve tüketici başvurusu. Pratik rehber.',
    h1: 'Abonelik iptali nasıl yapılır?',
    keywords: ['abonelik iptali', 'internet abonelik iptali', 'cayma hakkı', 'taahhütname cezası'],
    category: 'Tüketici',
    related: ['tuketici-hakem-heyeti', 'hukuk-davasi-nasil-acilir', 'arabuluculuk-nasil-yapilir'],
    links: [
      { label: 'TKHK maddeleri', href: '/kategori/tkhk' },
      { label: 'Tüketici arama', href: '/ara?q=t%C3%BCketici' },
    ],
    seed: 'abonelik',
  },
  {
    slug: 'ehliyet-alma-sartlari',
    title: 'Ehliyet Alma Şartları Nelerdir? Süreç Rehberi',
    description:
      'Sürücü belgesi alma şartları, kurs, sınav, sağlık raporu ve e-Devlet işlemleri. Bilgilendirme.',
    h1: 'Ehliyet alma şartları nelerdir?',
    keywords: ['ehliyet alma şartları', 'sürücü belgesi nasıl alınır', 'ehliyet sınavı', 'ehliyet yenileme'],
    category: 'Trafik',
    related: ['trafik-cezasina-itiraz', 'engelli-araci-nasil-alinir', 'idari-dava-nasil-acilir'],
    links: [
      { label: 'Karayolları Trafik Kanunu', href: '/kategori/ktk' },
      { label: 'Mevzuat', href: '/mevzuat' },
    ],
    seed: 'ehliyet',
  },
  {
    slug: 'nufus-kayit-ornegi',
    title: 'Nüfus Kayıt Örneği Nasıl Alınır? e-Devlet',
    description:
      'Nüfus kayıt örneği (vukuatlı) e-Devlet ve Nüfus Müdürlüğü yolu. Gerekli yerler ve kullanım.',
    h1: 'Nüfus kayıt örneği nasıl alınır?',
    keywords: ['nüfus kayıt örneği', 'vukuatlı nüfus kayıt', 'e-devlet nüfus', 'nüfus cüzdanı sureti'],
    category: 'Nüfus',
    related: ['veraset-ilami-nasil-alinir', 'e-devlet-veraset', 'bosanma-davasi-nasil-acilir'],
    links: [
      { label: 'Nüfus Hizmetleri', href: '/kategori/nhk' },
      { label: 'Mevzuat arama', href: '/ara?q=n%C3%BCfus' },
    ],
    seed: 'nufus',
  },
  {
    slug: 'icra-dosyasi-sorgulama',
    title: 'İcra Dosyası Sorgulama Nasıl Yapılır? UYAP',
    description:
      'İcra dosyası UYAP ve e-Devlet sorgulama, dosya numarası ve taraf erişimi. Bilgilendirme.',
    h1: 'İcra dosyası nasıl sorgulanır?',
    keywords: ['icra dosyası sorgulama', 'UYAP icra', 'e-devlet icra dosyası', 'icra dosya numarası'],
    category: 'İcra',
    related: ['icra-takibi-nedir', 'odeme-emrine-itiraz', 'senet-icra-takibi'],
    links: [
      { label: 'İİK', href: '/kategori/iik' },
      { label: 'Faiz hesaplama', href: '/hesaplama/faiz' },
    ],
    seed: 'icra_sorgu',
  },
  {
    slug: 'senet-icra-takibi',
    title: 'Senetle İcra Takibi Nasıl Yapılır?',
    description:
      'Bonoya/senede dayalı icra takibi, kambiyo senetlerine özgü yol, itiraz ve süreler. Rehber.',
    h1: 'Senetle icra takibi nasıl yapılır?',
    keywords: ['senet icra takibi', 'bono icra', 'kambiyo senetleri', 'senet ödeme emri'],
    category: 'İcra',
    related: ['icra-takibi-nedir', 'odeme-emrine-itiraz', 'hukuk-davasi-nasil-acilir'],
    links: [
      { label: 'İİK', href: '/kategori/iik' },
      { label: 'TTK kıymetli evrak', href: '/kategori/kiymetli-evrak' },
    ],
    seed: 'senet',
  },
  {
    slug: 'is-sozlesmesi-feshi',
    title: 'İş Sözleşmesi Feshi Nedir? Haklı ve Bildirimli Fesih',
    description:
      'İşçi ve işveren feshi, haklı neden, ihbar ve kıdem ilişkisi. İş hukuku vatandaş rehberi.',
    h1: 'İş sözleşmesi feshi nedir? Nelere dikkat edilmeli?',
    keywords: ['iş sözleşmesi feshi', 'haklı fesih', 'işten çıkarma', 'istifa tazminat'],
    category: 'İş',
    related: ['kidem-tazminati-nasil-alinir', 'arabuluculuk-nasil-yapilir', 'is-kazasi-tazminati'],
    links: [
      { label: 'İş Kanunu', href: '/kategori/is-kanunu' },
      { label: 'Kıdem hesaplama', href: '/hesaplama/kidem' },
    ],
    seed: 'fesih',
  },
  {
    slug: 'gayrimenkul-satis-vaadi',
    title: 'Gayrimenkul Satış Vaadi Sözleşmesi Nedir?',
    description:
      'Satış vaadi, noter şekli, tapu şerhi ve aykırılıkta dava. Alıcı-satıcı bilgilendirme rehberi.',
    h1: 'Gayrimenkul satış vaadi sözleşmesi nedir?',
    keywords: ['gayrimenkul satış vaadi', 'satış vaadi sözleşmesi', 'tapuya şerh', 'ön satış sözleşmesi'],
    category: 'Eşya',
    related: ['tapu-devri-nasil-yapilir', 'iskan-belgesi-nedir', 'hukuk-davasi-nasil-acilir'],
    links: [
      { label: 'TBK', href: '/kategori/borclar-ozel' },
      { label: 'Eşya hukuku', href: '/kategori/esya-hukuku' },
    ],
    seed: 'satis_vaadi',
  },
];

/** Topic-specific body packs for unique long-form SEO content */
const BODIES = {
  emlak_vergisi: {
    lead: 'Emlak vergisi, Türkiye’de taşınmaz maliki olanların belediyeye ödemekle yükümlü olduğu yıllık bir vergidir. Konut, işyeri ve arsa için farklı oranlar uygulanır; muafiyet ve indirimler engellilik, şehit yakını ve küçük konut gibi hallerde gündeme gelebilir. Bu sayfa genel bilgilendirmedir; oran ve muafiyet için ilgili yılın mevzuatı ile belediyenizin duyuruları esas alınmalıdır.',
    sections: [
      {
        heading: 'Emlak vergisi kime aittir?',
        paragraphs: [
          'Kural olarak verginin mükellefi taşınmazın malikidir. Paylı mülkiyette her paydaş kendi payı oranında sorumlu olabilir; elbirliği mülkiyette ortak sorumluluk kuralları devreye girer. Kiracı kural olarak asıl mükellef değildir; sözleşmeyle kira bedeline yansıtma borçlar hukuku meselesidir.',
          'Yıl içinde el değiştiren taşınmazlarda devir tarihine göre mükellefiyet ve beyan yükümlülükleri değişebilir. Tapu devrinden sonra belediyeye bildirim ve borç sorgusu ihmal edilmemelidir.',
        ],
        bullets: ['Malik / paydaş esası', 'Devir yılında bildirim', 'Belediye yetki alanı'],
      },
      {
        heading: 'Nasıl hesaplanır?',
        paragraphs: [
          'Emlak vergisi, vergi değeri üzerinden kanunda ve oran cetvellerinde öngörülen oranlarla hesaplanır. Büyükşehir ve diğer belediyelerde oranlar farklılaşabilir; konut ile işyeri/arsa ayrımı kritiktir.',
          'İndirimli oran veya muafiyet şartları her yıl güncellenebileceği için belediye ve Gelir İdaresi duyuruları kontrol edilmelidir. Sitedeki hesap araçları kabaca fikir verir; resmî borç tutarı belediye kaydıdır.',
        ],
      },
      {
        heading: 'Ne zaman ve nasıl ödenir?',
        paragraphs: [
          'Uygulamada emlak vergisi çoğu belediyede iki eşit taksitte tahsil edilir. e-Devlet, belediye veznesi, anlaşmalı bankalar ve online kanallar yaygındır. Gecikmede gecikme zammı gündeme gelebilir.',
          'Borcun zamanında ödenmemesi tapu işlemlerinde veya belediye hizmetlerinde sorun çıkarabilir; devir öncesi güncel borç sıfırlaması yapılmalıdır.',
        ],
        bullets: ['Taksit takvimini belediyeden doğrulayın', 'e-Devlet / online ödeme', 'Dekontu saklayın'],
      },
      {
        heading: 'Sık yapılan hatalar',
        paragraphs: [
          '«Borç yok» sanmak; devralınan taşınmazda önceki dönem borçlarını kontrol etmemek; muafiyet belgelerini vermemek; işyeri/konut niteliğini yanlış beyan etmek en sık risklerdir.',
        ],
      },
    ],
    steps: [
      'Ada-parsel ve belediyeyi tespit edin.',
      'e-Devlet veya belediye sisteminden borç ve beyanı sorgulayın.',
      'Muafiyet/indirim belgelerini tamamlayın.',
      'Taksit veya peşin ödemeyi resmî kanaldan yapın.',
      'Satış/devir öncesi borç sıfırlamasını doğrulayın.',
    ],
    faq: [
      {
        q: 'Kiracı emlak vergisi öder mi?',
        a: 'Asıl mükellef maliktir. Sözleşmeyle yansıtma kararlaştırılmış olabilir; bu, vergi hukukundaki mükellefiyeti kendiliğinden kiracıya geçirmez.',
      },
      {
        q: 'Ödemezsem ne olur?',
        a: 'Gecikme zammı, takibat ve işlem engelleri gündeme gelebilir. Somut yaptırım ilgili tahsil mevzuatına göre değişir.',
      },
      {
        q: 'Emlak vergisi ile ÇTV aynı mı?',
        a: 'Hayır. Çevre temizlik vergisi ayrı bir yükümlülük olabilir.',
      },
    ],
  },
  veraset: {
    lead: 'Veraset ilamı (mirasçılık belgesi), bir kişinin ölümü üzerine yasal veya atanmış mirasçıları ve paylarını gösteren resmî belgedir. Tapu devri, banka işlemleri ve birçok miras işlemi için pratikte vazgeçilmezdir. e-Devlet, noter ve sulh hukuk mahkemesi yolları gündeme gelebilir; hangi yolun açık olduğu somut olaya ve yürürlükteki usule bağlıdır.',
    sections: [
      {
        heading: 'Veraset ilamı ne işe yarar?',
        paragraphs: [
          'Belge, mirasçı sıfatını ve pay oranlarını ispatlamaya yarar. Tapuda intikal, bankadaki hesap ve kiralık kasa, araç devri gibi işlemlerde istenir. Tek başına taşınmazın fiilen bölünmesini sağlamaz; paylaşma ve tescil ayrı adımlardır.',
        ],
      },
      {
        heading: 'Hangi yollarla alınır?',
        paragraphs: [
          'Uygulamada e-Devlet üzerinden belirli şartlarla mirasçılık belgesi üretilebilen haller, noterden alınabilen belgeler ve sulh hukuk mahkemesinden alınan veraset ilamı birlikte değerlendirilir. Anlaşmazlık, yurtdışı unsuru, vasiyet veya karmaşık mirasçılık tablosu varsa mahkeme yolu öne çıkar.',
          'Gerekli belgeler arasında nüfus kayıtları, ölüm belgesi ve kimlik bilgileri yer alır. Eksik veya çelişkili kayıtlarda süreç uzayabilir.',
        ],
        bullets: ['e-Devlet (uygun hallerde)', 'Noter', 'Sulh hukuk mahkemesi'],
      },
      {
        heading: 'Sonraki adımlar',
        paragraphs: [
          'Belge alındıktan sonra tapu intikali, vergi daireleri ve bankalarla işlemler planlanır. Mirasın reddi, tenkis, tereke tespiti gibi uyuşmazlıklar ayrı davalardır.',
        ],
      },
    ],
    steps: [
      'Ölüm kaydı ve aile nüfus bilgilerini toplayın.',
      'e-Devlet uygunluğunu kontrol edin.',
      'Uygun değilse noter veya mahkeme yolunu değerlendirin.',
      'Belgeyi tapu, banka ve diğer kurumlarda kullanın.',
      'Paylaşım ve devir için ayrı işlemleri planlayın.',
    ],
    faq: [
      {
        q: 'e-Devletten herkes alabilir mi?',
        a: 'Hayır. Sistemin açık olduğu haller sınırlıdır; karmaşık dosyalarda mahkeme gerekebilir.',
      },
      {
        q: 'Veraset ile miras payı hesabı aynı mı?',
        a: 'Belge payları gösterir; fiilî paylaşım ve saklı pay uyuşmazlıkları ayrı değerlendirilir.',
      },
    ],
  },
  trafik: {
    lead: 'Trafik idari para cezasına itiraz, tebliğ tarihinden itibaren kanunda öngörülen süre içinde yapılmalıdır. Süre kaçırılırsa ceza kesinleşebilir. İtiraz mercileri ceza türüne ve tebliğ usulüne göre değişir; e-Devlet ve ilgili yargı mercileri uygulamada sık kullanılır. Bu metin genel bilgilendirmedir.',
    sections: [
      {
        heading: 'Süre neden kritik?',
        paragraphs: [
          'İdari para cezalarında itiraz ve ödeme süreleri kısadır. Tebliğ tarihi (e-tebligat, PTT, araç üzerine yapıştırma vb.) doğru tespit edilmezse hak kaybı riski doğar. Usulsüz tebligat iddiası ayrıca ileri sürülebilir.',
        ],
      },
      {
        heading: 'Nasıl itiraz edilir?',
        paragraphs: [
          'Ceza türüne göre sulh ceza hâkimliği veya ilgili idari yargı yolu gündeme gelebilir. Dilekçede plaka, ceza numarası, tebliğ tarihi, olaya ilişkin savunma ve deliller (fotoğraf, tanık, kamera) yazılmalıdır.',
          'Ödeme indirimi ile itiraz yolu birbirine karıştırılmamalıdır. Erken ödeme indirimi, itiraz hakkından feragat anlamına gelebilecek şekilde düzenlenmiş olabilir; metni dikkatle okuyun.',
        ],
        bullets: ['Tebliğ tarihini sabitleyin', 'Süre gününü hesaplayın', 'Delilleri ekleyin', 'Yetkili mercie verin'],
      },
    ],
    steps: [
      'Ceza tebliğ belgesini ve e-Devlet kaydını inceleyin.',
      'İtiraz süresini hesaplayın.',
      'Delil ve savunmayı hazırlayın.',
      'Yetkili mercie dilekçe verin; evrak numarasını alın.',
      'Sonucu takip edin; gerekirse üst mercilere bakın.',
    ],
    faq: [
      {
        q: 'Ödeme yaptım, itiraz edebilir miyim?',
        a: 'Ödeme ve indirim, itiraz imkânını etkileyebilir. Somut tebliğ ve ödeme metnine bakılmalıdır.',
      },
      {
        q: 'Araç satıldıktan sonra ceza gelirse?',
        a: 'Tescil ve zilyetlik tarihi önemlidir. Noter satış tarihi ve tescil gecikmesi dosyayı etkiler.',
      },
    ],
  },
  idari: {
    lead: 'İdari dava, idarenin işlem veya eylemlerine karşı idari yargıda açılan davadır. En bilinen türleri iptal davası ve tam yargı (tazminat) davasıdır. Süreler kısadır; kural olarak yazılı bildirimi izleyen günden itibaren altmış gün gibi süreler uygulanır (özel kanunlar farklı süre öngörebilir). İYUK m.2/2 çerçevesinde mahkemeden idari işlem tesisini istemek yerine, kural olarak işlemin iptali ve varsa tazminat talep edilir.',
    sections: [
      {
        heading: 'İptal ve tam yargı ayrımı',
        paragraphs: [
          'İptal davası, hukuka aykırı idari işlemin ortadan kaldırılmasını; tam yargı davası ise uğranılan zararın tazminini hedefler. Aynı olayda ikisi birlikte veya ayrı ayrı gündeme gelebilir.',
        ],
      },
      {
        heading: 'Görevli ve yetkili mahkeme',
        paragraphs: [
          'İdare mahkemesi, vergi mahkemesi ve Danıştay arasında görev ayrımı vardır. Yetki, işlemi yapan idare ve kanundaki özel kurallara göre belirlenir. Yanlış mercie başvuru süre kaybına yol açabilir.',
        ],
      },
      {
        heading: 'Dilekçede neler olmalı?',
        paragraphs: [
          'Taraflar, konu, olaylar, hukuki sebepler, deliller ve sonuç talebi açık yazılmalıdır. İYUK’ta öngörülen şekil şartlarına uyulması gerekir. Vekâlet, harç ve tebligat usulü de unutulmamalıdır.',
        ],
      },
    ],
    steps: [
      'İdari işlemi ve tebliğ tarihini tespit edin.',
      'Özel başvuru yolu (itiraz, üst makam) var mı bakın.',
      'Dava süresini hesaplayın.',
      'Dilekçe ve ekleri hazırlayın.',
      'Görevli mahkemeye başvurun; UYAP takibi yapın.',
    ],
    faq: [
      {
        q: 'Mahkeme atama yapsın diyebilir miyim?',
        a: 'İdari yargıda kural, idari işlem tesisini mahkemeden istemek değil; hukuka aykırı işlemin iptalini istemektir.',
      },
      {
        q: 'Süre kaçtıysa ne olur?',
        a: 'Süre kamu düzenindendir; geç başvuruda ret riski yüksektir. Usulsüz tebliğ/ öğrenme tarihi argümanları ayrıca incelenir.',
      },
    ],
  },
  hukuk: {
    lead: 'Hukuk davası, özel hukuk uyuşmazlıklarının adliye mahkemelerinde çözülmesidir. Görev (asliye hukuk, sulh hukuk, iş, aile, tüketici vb.), yetki, harç, tebligat ve bazı davalarda arabuluculuk dava şartı sürecin omurgasını oluşturur. Dava açmadan önce delil, zamanaşımı ve masraf planı yapılmalıdır.',
    sections: [
      {
        heading: 'Dava açmadan önce',
        paragraphs: [
          'Uyuşmazlığın türüne göre zorunlu arabuluculuk olup olmadığı kontrol edilir. Yetkili ve görevli mahkeme belirlenir. Deliller (sözleşme, mesaj, tanık, ekspertiz ihtiyacı) toplanır.',
        ],
      },
      {
        heading: 'Dilekçe ve harç',
        paragraphs: [
          'HMK m.119 ve devamındaki unsurlara uygun dilekçe yazılır. Harç ve gider avansı yatırılmazsa dosya işlemden kalkabilir. Tebligat adresi ve UYAP kaydı önemlidir.',
        ],
      },
      {
        heading: 'Süreç özeti',
        paragraphs: [
          'Dava açılır, davalıya tebliğ edilir, cevap ve delil sunumu, ön inceleme, tahkikat, karar ve kanun yolları izlenir. Her aşamada süre kaçırma riski vardır.',
        ],
      },
    ],
    steps: [
      'Uyuşmazlık türünü ve dava şartlarını belirleyin.',
      'Arabuluculuk zorunluysa başvurun.',
      'Dilekçe ve delilleri hazırlayın.',
      'Harç yatırarak dava açın.',
      'Tebligat ve duruşmaları takip edin.',
    ],
    faq: [
      {
        q: 'Avukatsız dava açılır mı?',
        a: 'Kural olarak mümkündür; ancak usul ve süre hataları hak kaybına yol açabilir.',
      },
      {
        q: 'Ne kadar sürer?',
        a: 'Dosya türü, mahkeme yoğunluğu ve delil durumuna göre değişir; kesin süre vaadi verilemez.',
      },
    ],
  },
  engelli_arac: {
    lead: 'Engelli aracı alımında ÖTV muafiyeti, engelli sağlık kurulu raporu, engellilik oranı ve araç cinsi kritik unsurlardır. Plaka, devir kısıtları ve süre şartları sık değişebildiği için güncel ÖTV mevzuatı ve GİB/not duyuruları kontrol edilmelidir. Bu sayfa bilgilendirme amaçlıdır.',
    sections: [
      {
        heading: 'Temel şartlar',
        paragraphs: [
          'Genellikle belirli engellilik oranı ve rapor formatı aranır. Araç bedeli üst sınırı, silindir hacmi veya elektrikli araç kuralları dönemsel olarak değişebilir.',
          'Raporun «özel tertibatlı» veya «tertibatlı/terti batsız» ayrımı, kimlerin araç kullanabileceği ve devir yasağı süreleri uygulamada en çok karıştırılan noktalardır.',
        ],
      },
      {
        heading: 'Süreç özeti',
        paragraphs: [
          'Rapor alınır, uygun araç ve satıcı seçilir, ÖTV muafiyet evrakı tamamlanır, tescil ve plaka işlemleri yapılır. Sonradan devir ve ikinci el kuralları ayrı rejimdir.',
        ],
        bullets: ['Güncel engelli raporu', 'ÖTV muafiyet evrakı', 'Tescil / plaka', 'Devir kısıtlarını okuyun'],
      },
    ],
    steps: [
      'Yetkili hastaneden engelli sağlık kurulu raporu alın.',
      'Güncel ÖTV muafiyet şartlarını doğrulayın.',
      'Uygun araç ve satıcıyla evrak listesini netleştirin.',
      'Tescil ve plaka işlemlerini tamamlayın.',
      'Devir/ süre yasağına uyun.',
    ],
    faq: [
      {
        q: 'Yakınım için alabilir miyim?',
        a: 'Belli hâllerde vasi/ veli veya belirli yakınlık kuralları uygulanır; rapor ve mevzuat metni esastır.',
      },
      {
        q: 'Aracı hemen satabilir miyim?',
        a: 'Muafiyetli araçlarda devir süre kısıtı sık görülür; erken devir vergi ve ceza riski doğurur.',
      },
    ],
  },
  bosanma: {
    lead: 'Boşanma davası anlaşmalı veya çekişmeli açılabilir. Anlaşmalı boşanmada taraflar protokolde nafaka, velayet, mal rejimini düzenler; çekişmeli boşanmada kusur, delil ve yargılama süresi uzayabilir. Aile mahkemesi görevlidir. Bu metin genel bilgilendirmedir.',
    sections: [
      {
        heading: 'Anlaşmalı boşanma',
        paragraphs: [
          'TMK’daki şartlar (evlilik süresi, irade açıklaması, protokol) aranır. Hâkim çocuğun üstün yararını denetler. Protokol eksikse dava çekişmeliye dönebilir.',
        ],
      },
      {
        heading: 'Çekişmeli boşanma',
        paragraphs: [
          'Genel ve özel boşanma sebepleri ileri sürülebilir. Delil, tanık, sosyal inceleme raporu ve tedbir nafakası / tedbir velayet uygulamada sık görülür.',
        ],
      },
      {
        heading: 'Mal rejimi ve nafaka',
        paragraphs: [
          'Edinilmiş mallara katılma rejiminde tasfiye ayrı talep ve hesap gerektirir. Yoksulluk ve iştirak nafakası boşanma ile bağlantılı ama kendi kurallarına tabidir.',
        ],
      },
    ],
    steps: [
      'Anlaşmalı mı çekişmeli mi karar verin.',
      'Protokol veya delil dosyasını hazırlayın.',
      'Aile mahkemesinde dava açın.',
      'Tedbir taleplerini (nafaka, konut) değerlendirin.',
      'Karar kesinleşince nüfus ve mal işlemlerini yapın.',
    ],
    faq: [
      {
        q: 'Anlaşmalı boşanma tek celsede biter mi?',
        a: 'Çoğu dosyada kısa sürer; protokol ve dinleme şartlarına bağlıdır. Kesin vaat verilemez.',
      },
      {
        q: 'Yurtdışında yaşayan eş?',
        a: 'Tebligat ve yetki kuralları özel dikkat ister; süreler uzayabilir.',
      },
    ],
  },
  nafaka: {
    lead: 'Nafaka; tedbir, yoksulluk ve iştirak nafakası gibi türlere ayrılır. Miktar, tarafların geliri, çocukların ihtiyacı ve hakkaniyet ölçütleriyle belirlenir. Artırım, indirim ve kaldırılma ayrı davalara konu olabilir.',
    sections: [
      {
        heading: 'Nafaka türleri',
        paragraphs: [
          'Tedbir nafakası yargılama sırasında; yoksulluk nafakası boşanma sonrası yoksulluğa düşen eş için; iştirak nafakası çocukların bakım ve eğitim ihtiyaçları içindir.',
        ],
      },
      {
        heading: 'Nasıl belirlenir?',
        paragraphs: [
          'Mahkeme sabit bir «formül»le bağlı değildir; gelir-gider dengesi, yaşam standardı ve çocuğun üstün yararı esas alınır. Sitedeki hesap araçları yalnızca kabaca fikir verir.',
        ],
      },
    ],
    steps: [
      'Nafaka türünü ve talebi netleştirin.',
      'Gelir-gider belgelerini toplayın.',
      'Dava veya anlaşmalı protokole yazın.',
      'Ödemeleri belgelendirin.',
      'Değişen şartlarda artırım/indirim değerlendirin.',
    ],
    faq: [
      {
        q: 'Nafaka ödenmezse ne olur?',
        a: 'İcra takibi ve kanundaki cezaî yaptırımlar gündeme gelebilir.',
      },
      {
        q: 'Çocuk 18 olunca iştirak biter mi?',
        a: 'Eğitim ve bakım ihtiyacı devam ediyorsa farklı değerlendirme yapılabilir; somut dosyaya bakılır.',
      },
    ],
  },
  icra: {
    lead: 'İcra takibi, alacağın cebri icra yoluyla tahsilidir. İlamlı ve ilamsız takip ayrımı, ödeme emri, itiraz, haciz ve satış aşamaları vardır. Borçlu ve alacaklı için süreler çok kısadır.',
    sections: [
      {
        heading: 'Takip türleri',
        paragraphs: [
          'İlamlı takip mahkeme kararına; ilamsız takip fatura, senet, sözleşme gibi belgelere dayanabilir. Kambiyo senetlerine özgü yol ayrıca düzenlenmiştir.',
        ],
      },
      {
        heading: 'Borçlu ne yapmalı?',
        paragraphs: [
          'Ödeme emri tebliğini okuyun, süreyi hesaplayın, itiraz veya ödeme seçeneklerini değerlendirin. Usulsüz tebligat ve imza inkârı gibi savunmalar dosyaya göre değişir.',
        ],
      },
    ],
    steps: [
      'Takip türünü ve dayanağı öğrenin.',
      'Tebliğ tarihini sabitleyin.',
      'İtiraz / ödeme / taksit seçeneklerini değerlendirin.',
      'Haciz riskine karşı malvarlığını yasal çerçevede yönetin.',
      'Gerekiyorsa itirazın iptali/menfi tespit davalarını planlayın.',
    ],
    faq: [
      {
        q: 'İcra dosyası e-Devletten görünür mü?',
        a: 'Taraf veya vekil erişimiyle UYAP/e-Devlet sorguları mümkündür; herkes her dosyayı göremez.',
      },
      {
        q: 'Haciz ev eşyasına gelir mi?',
        a: 'Kanunda haczedilmezlik kuralları vardır; somut mal ve durum önemlidir.',
      },
    ],
  },
  odeme_emri: {
    lead: 'İlamsız icrada ödeme emrine itiraz süresi uygulamada sıklıkla yedi gündür. Süre tebliğden itibaren işler. Süresinde itiraz takibi durdurur; alacaklı itirazın iptali veya kaldırılması yollarına gidebilir.',
    sections: [
      {
        heading: 'İtiraz dilekçesi',
        paragraphs: [
          'İcra dairesine verilir. İmza inkârı, borç yokluğu, zamanaşımı gibi sebepler yazılabilir. Genel itiraz ile imzaya itirazın sonuçları farklıdır.',
        ],
      },
      {
        heading: 'İtirazdan sonra',
        paragraphs: [
          'Alacaklı 1 yıllık süre içinde itirazın iptali davası açabilir (süreler kanuna göre kontrol edilmelidir). Haksız itirazda icra inkâr tazminatı riski doğabilir.',
        ],
      },
    ],
    steps: [
      'Ödeme emri tebliğini alın ve tarihi not edin.',
      '7 günlük süreyi hesaplayın.',
      'İtiraz sebebini belirleyin.',
      'İcra dairesine itirazı verin; evrak alın.',
      'Sonraki dava riskini avukatla değerlendirin.',
    ],
    faq: [
      {
        q: 'Süreyi kaçırdım, ne olur?',
        a: 'Takip kesinleşebilir; haciz aşamasına geçilebilir. Olağanüstü yollar sınırlıdır.',
      },
      {
        q: 'Kısmi itiraz olur mu?',
        a: 'Evet, borcun bir kısmına itiraz mümkündür; tutar açık yazılmalıdır.',
      },
    ],
  },
  arabuluculuk: {
    lead: 'Arabuluculuk, uyuşmazlığın mahkeme dışında tarafsız arabulucu eşliğinde çözülmesidir. İş, ticaret ve bazı tüketici uyuşmazlıklarında dava şartı olabilir. Anlaşma belgesi ilam niteliği taşıyabilir.',
    sections: [
      {
        heading: 'Zorunlu arabuluculuk',
        paragraphs: [
          'Kanunun öngördüğü dava türlerinde arabuluculuğa gitmeden dava açılırsa usulden ret riski doğar. Başvuru arabuluculuk bürosu üzerinden yapılır.',
        ],
      },
      {
        heading: 'Süreç',
        paragraphs: [
          'Taraflar bilgilendirilir, toplantılar yapılır, anlaşma veya anlaşamama tutanağı düzenlenir. Anlaşamamazlık belgesi dava için gerekli olabilir.',
        ],
      },
    ],
    steps: [
      'Uyuşmazlığın dava şartı olup olmadığını kontrol edin.',
      'Arabuluculuk bürosuna başvurun.',
      'Toplantılara katılın; yetki belgesi götürün.',
      'Anlaşma sağlanırsa belgeyi alın.',
      'Anlaşılmazsa tutanakla dava yolunu planlayın.',
    ],
    faq: [
      {
        q: 'Arabuluculuk ücretini kim öder?',
        a: 'Tarife ve anlaşmaya göre değişir; bazı dosyalarda tarife esaslı paylaşım uygulanır.',
      },
      {
        q: 'Anlaşma belgesi icra edilebilir mi?',
        a: 'Kanundaki şartları taşıyan belgeler ilam gibi icra edilebilir.',
      },
    ],
  },
  kira: {
    lead: 'Konut ve çatılı işyeri kiralarında artış, TBK ve dönemsel yasal sınırlara tabidir. Sözleşmedeki oran yasal tavanı aşamaz. TÜFE ve yasal sınır her yıl kontrol edilmelidir.',
    sections: [
      {
        heading: 'Yasal çerçeve',
        paragraphs: [
          'TBK m.344 çevresinde yenilenen kira dönemlerinde artış kuralı vardır. Geçici yasal sınırlar (yüzde tavanı) dönemsel olarak getirilebilir; güncel oranı resmî kaynaklardan doğrulayın.',
        ],
      },
      {
        heading: 'Hesaplama',
        paragraphs: [
          'Eski kira bedeli × (yasal sınır veya sözleşmedeki daha düşük oran). Sitemizdeki kira aracı kabaca hesap sunar; uyuşmazlıkta mahkeme ve bilirkişi devreye girebilir.',
        ],
      },
    ],
    steps: [
      'Sözleşme maddesini okuyun.',
      'Güncel yasal tavanı kontrol edin.',
      'Hesabı yazılı bildirin.',
      'Anlaşmazlıkta arabuluculuk/dava seçeneklerini değerlendirin.',
    ],
    faq: [
      {
        q: 'Kiracı zammı kabul etmezse?',
        a: 'Kira tespit/adaptasyon ve tahliye sebepleri ayrı kurumlar; dosyaya göre yol seçilir.',
      },
    ],
  },
  tapu: {
    lead: 'Taşınmaz mülkiyetinin devri kural olarak tapu sicilinde tescille olur. Satışta taraflar, kimlik, taşınmaz bilgisi, harç ve varsa ipotek/ rehin temizliği gerekir. Randevu sistemi ve e-Devlet randevuları yaygındır.',
    sections: [
      {
        heading: 'Gerekli belgeler (tipik)',
        paragraphs: [
          'Kimlik, tapu senedi veya ada-parsel, fotoğraf, deprem sigortası (DASK), belediye rayiç/harç belgesi uygulamada sık istenir. Liste müdürlüğe göre değişebilir.',
        ],
        bullets: ['Kimlikler', 'DASK', 'Rayiç / harç', 'Vekâlet (varsa)', 'Yetki belgesi (şirket)'],
      },
      {
        heading: 'Dikkat',
        paragraphs: [
          'Emlak vergisi borcu, ipotek, haciz, şerh ve iskan durumu devirden önce kontrol edilmelidir. Ödeme yeri ve senetleşme riski yüksektir; banka dekontu tercih edilir.',
        ],
      },
    ],
    steps: [
      'Tapu kaydı ve şerhleri inceleyin.',
      'Borç ve DASK durumunu netleştirin.',
      'Randevu alın.',
      'Harç ve ödemeyi tamamlayın.',
      'Tescil belgesini alın.',
    ],
    faq: [
      {
        q: 'Noterde satış yeterli mi?',
        a: 'Mülkiyet devri için tapuda tescil gerekir. Noter satış vaadi ayrı bir sözleşmedir.',
      },
    ],
  },
  iskan: {
    lead: 'İskan (yapı kullanma izni), yapının imar ve fen bakımından kullanıma uygun olduğunu gösteren belgedir. Eksik iskan; abonelik, kredi ve satışta sorun çıkarabilir.',
    sections: [
      {
        heading: 'Neden önemli?',
        paragraphs: [
          'Belediye ve ilgili idareler abonelik ve bazı işlemlerde iskan arar. Kat irtifakından kat mülkiyetine geçişte de iskan/ uygunluk süreçleri devreye girer.',
        ],
      },
      {
        heading: 'Nasıl alınır?',
        paragraphs: [
          'Yüklenici veya malik, proje, yapı denetim ve belediye evrakıyla başvurur. Eksik imalat ve ruhsat aykırılığı engel olabilir.',
        ],
      },
    ],
    steps: [
      'Tapu ve ruhsat durumunu öğrenin.',
      'Belediyeden iskan/ dosya durumunu sorun.',
      'Eksikleri yükleniciyle tamamlayın.',
      'Başvuru ve kontrol sürecini takip edin.',
    ],
    faq: [
      {
        q: 'İskansız daire alınır mı?',
        a: 'Alınabilir ancak risk yüksektir; sözleşme ve fiyat buna göre değerlendirilmelidir.',
      },
    ],
  },
  tuketici: {
    lead: 'Tüketici hakem heyeti, belirli parasal sınırlar içindeki tüketici uyuşmazlıklarında hızlı başvuru yoludur. e-Devlet üzerinden başvuru yaygındır. Sınır üstü tutarlarda tüketici mahkemesi gündeme gelir.',
    sections: [
      {
        heading: 'Kimler başvurur?',
        paragraphs: [
          'Tüketici sıfatıyla mal veya hizmet alanlar. Ticari işlerde tüketici sıfatı tartışmalı olabilir.',
        ],
      },
      {
        heading: 'Süreç',
        paragraphs: [
          'Başvuru, delil yükleme, satıcı/sağlayıcı savunması ve karar. Karara itiraz tüketici mahkemesine yapılabilir.',
        ],
      },
    ],
    steps: [
      'Parasal sınırı kontrol edin.',
      'Fatura, sözleşme, yazışmaları toplayın.',
      'e-Devletten başvuru yapın.',
      'Kararı takip edin; itiraz süresine dikkat edin.',
    ],
    faq: [
      {
        q: 'Avukat zorunlu mu?',
        a: 'Hakem heyetinde kural olarak zorunlu değildir.',
      },
    ],
  },
  suc: {
    lead: 'Suç duyurusu, bir suçun işlendiği iddiasıyla Cumhuriyet savcılığına yapılan başvurudur. Yazılı dilekçe, e-şikayet veya kolluk aracılığıyla yapılabilir. Delil ve olay anlatımı net olmalıdır.',
    sections: [
      {
        heading: 'Dilekçede neler yazılmalı?',
        paragraphs: [
          'Olayın kim, ne zaman, nerede, nasıl gerçekleştiği; deliller; şüpheli bilgisi (biliniyorsa); talep (soruşturma) açık yazılır. Hakaret içeren abartılı ifadelere gerek yoktur.',
        ],
      },
      {
        heading: 'Sonrası',
        paragraphs: [
          'Savcılık soruşturma açabilir, kovuşturmaya yer olmadığına karar verebilir veya ek delil isteyebilir. Şikâyete bağlı suçlarda süre ve feragat önemlidir.',
        ],
      },
    ],
    steps: [
      'Olay ve delilleri derleyin.',
      'Yetkili savcılığa başvurun.',
      'Başvuru numarasını alın.',
      'Sonucu takip edin; itiraz yollarını öğrenin.',
    ],
    faq: [
      {
        q: 'İsimsiz şikâyet olur mu?',
        a: 'Uygulamada kimlikli başvuru etkilidir; isimsiz ihbar sınırlı değerlendirilir.',
      },
    ],
  },
  k6284: {
    lead: '6284 sayılı Kanun, aile içi şiddet ve kadına yönelik şiddetle mücadelede koruyucu ve önleyici tedbirler öngörür. Mülki amir veya aile mahkemesinden tedbir istenebilir. Acil hallerde kolluk devreye girer.',
    sections: [
      {
        heading: 'Hangi tedbirler verilebilir?',
        paragraphs: [
          'Uzaklaştırma, konuta yaklaşmama, silah teslimi, nafaka, geçici koruma gibi tedbirler örneklenir. Tedbir ihlali ayrıca yaptırıma bağlanmıştır.',
        ],
      },
      {
        heading: 'Başvuru',
        paragraphs: [
          'ŞÖNİM, kolluk, savcılık ve mahkeme kanalları kullanılır. Delil olmasa bile beyan önem taşır; yine de mevcut belgeler sunulmalıdır.',
        ],
      },
    ],
    steps: [
      'Güvenli ortama geçin; 112/155 ile irtibat kurun.',
      'ŞÖNİM veya kolluğa başvurun.',
      'Tedbir talebini yazılı/sözlü iletin.',
      'Kararı tebliğ alın; ihlalde derhal bildirin.',
    ],
    faq: [
      {
        q: 'Erkekler de başvurabilir mi?',
        a: 'Kanun mağduriyet esasına göre koruma sağlar; somut olay ve madde metni esastır.',
      },
    ],
  },
  velayet: {
    lead: 'Velayet, çocuğun bakım, eğitim ve temsilini kapsar. Boşanmada velayet çocuğun üstün yararına göre verilir. Kişisel ilişki (görüşme) velayetten ayrı düzenlenir.',
    sections: [
      {
        heading: 'Nasıl belirlenir?',
        paragraphs: [
          'Yaş, bağ, kardeşlerin birlikte kalması, şiddet öyküsü, sosyal inceleme raporu gibi ölçütler kullanılır. Anne veya babaya peşin üstünlük varsayımı yerine somut yarar aranır.',
        ],
      },
      {
        heading: 'Değişiklik',
        paragraphs: [
          'Şartlar değişirse velayet değişikliği davası açılabilir. İcra ile çocuk teslimi kuralları özel rejimlere tabidir.',
        ],
      },
    ],
    steps: [
      'Çocuğun yararını merkeze alan dosya hazırlayın.',
      'Delil ve tanık listesini çıkarın.',
      'Tedbir velayet/kişisel ilişki talep edin.',
      'Sosyal inceleme sürecine katılın.',
    ],
    faq: [
      {
        q: 'Ortak velayet olur mu?',
        a: 'Uygulama ve Yargıtay yaklaşımı dosyaya göre değişir; mutlak kural yoktur.',
      },
    ],
  },
  is_kazasi: {
    lead: 'İş kazası, işyerinde veya iş nedeniyle oluşan, işçiyi bedenen ya da ruhen engelli hâle getiren olaydır. Bildirim, SGK süreci ve işverene karşı tazminat davaları ayrı kanallardır.',
    sections: [
      {
        heading: 'Bildirim',
        paragraphs: [
          'İşveren kanuni sürede SGK’ya bildirim yapmalıdır. Yapılmazsa idari yaptırım ve ispat sorunları doğar. İşçi de sağlık kuruluşu kayıtlarını saklamalıdır.',
        ],
      },
      {
        heading: 'Tazminat',
        paragraphs: [
          'Maddi (tedavi, iş göremezlik, destekten yoksun kalma) ve manevi tazminat gündeme gelebilir. Kusur oranları bilirkişiyle tartışılır. Zamanaşımı ve arabuluculuk kuralına dikkat edilmelidir.',
        ],
      },
    ],
    steps: [
      'Sağlık kaydı ve raporları alın.',
      'SGK/işveren bildirimini takip edin.',
      'Kusur ve zarar belgelerini toplayın.',
      'Arabuluculuk/dava yolunu planlayın.',
    ],
    faq: [
      {
        q: 'İş çıkışında mı sayılır?',
        a: 'İş kazası tanımı olayın iş ile bağlantısına göre belirlenir; salt «işyerinde olmak» her zaman yeterli olmayabilir.',
      },
    ],
  },
  kidem: {
    lead: 'Kıdem tazminatı, kanunda sayılan sona erme hâllerinde ve en az bir yıllık kıdem şartıyla gündeme gelir. Tavan uygulaması ve giydirilmiş ücret hesabı kritiktir. İş davalarında arabuluculuk dava şartı olabilir.',
    sections: [
      {
        heading: 'Kimler alır?',
        paragraphs: [
          'Belirli fesih türleri, emeklilik, muvazzaf askerlik, kadın işçinin evlilik nedeniyle feshi gibi hâller uygulamada sık görülür. İstifa kural olarak kıdem doğurmaz; istisnalar vardır.',
        ],
      },
      {
        heading: 'Hesap',
        paragraphs: [
          'Her tam yıl için otuz günlük giydirilmiş ücret esası ve tavan kontrolü yapılır. Sitemizdeki araç bilgilendirme amaçlıdır.',
        ],
      },
    ],
    steps: [
      'Fesih türünü ve tarihi netleştirin.',
      'Ücret bordrolarını toplayın.',
      'Arabuluculuğa başvurun (gerekliyse).',
      'Anlaşmazlıkta iş mahkemesini değerlendirin.',
    ],
    faq: [
      {
        q: 'İbraname imzaladım, hakkım bitti mi?',
        a: 'İbra sıkı şekil şartlarına tabidir; geçersiz ibra iddiası dosyaya göre tartışılır.',
      },
    ],
  },
  edevlet_veraset: {
    lead: 'e-Devlet üzerinden mirasçılık belgesi/veraset işlemleri, sistemin uygun gördüğü dosyalarda hızlı çözüm sunar. Her miras dosyası e-Devletten çıkmaz; yurtdışı, vasiyet veya uyuşmazlıkta mahkeme gerekir.',
    sections: [
      {
        heading: 'Nasıl bakılır?',
        paragraphs: [
          'e-Devlet’e giriş yapıp «mirasçılık belgesi» veya ilgili nüfus/noter hizmetlerini aratın. Kimlik doğrulama ve yetkili mirasçı girişi gerekir.',
        ],
      },
      {
        heading: 'Belge alındıktan sonra',
        paragraphs: [
          'Tapu ve banka işlemleri için asıl/onaylı suret istenebilir. Paylar üzerinde anlaşmazlık varsa belge tek başına paylaşımı bitirmez.',
        ],
      },
    ],
    steps: [
      'e-Devlet girişi yapın.',
      'Mirasçılık belgesi hizmetini arayın.',
      'Uygunsa belgeyi oluşturun/indirin.',
      'Uygun değilse noter/mahkeme yoluna geçin.',
    ],
    faq: [
      {
        q: 'PDF yeterli mi?',
        a: 'Kuruma göre değişir; bazı yerler ıslak imzalı veya barkodlu doğrulama ister.',
      },
    ],
  },
  miras_pay: {
    lead: 'Yasal miras payları TMK zümre sistemine göre belirlenir. Sağ kalan eşin payı, birlikte mirasçı olduğu zümreye göre değişir. Saklı pay ve vasiyet tenkisi ayrı kurumlardır.',
    sections: [
      {
        heading: 'Zümre sistemi',
        paragraphs: [
          'Birinci zümre altsoy, ikinci ana-baba ve onların altsoyu, üçüncü büyük ana-baba hattıdır. Önceki zümre varken sonrakiler mirasçı olmaz.',
        ],
      },
      {
        heading: 'Eşin payı',
        paragraphs: [
          'Eş altsoy ile birlikteyken daha düşük, ana-baba zümresiyle daha yüksek, onlar yoksa daha geniş pay alır. Somut oranlar TMK m.499 çevresindedir.',
        ],
      },
    ],
    steps: [
      'Mirasçı tablosunu çıkarın.',
      'Eş ve zümre durumunu belirleyin.',
      'Hesap aracıyla kabaca kontrol edin.',
      'Uyuşmazlıkta tenkis/paylaşım davasını değerlendirin.',
    ],
    faq: [
      {
        q: 'Vasiyet payları bozar mı?',
        a: 'Saklı payı ihlal eden tasarruflar tenkise tabi olabilir.',
      },
    ],
  },
  tebligat: {
    lead: 'Usulsüz tebligat, kanuna aykırı yapılan tebligattır. Usulsüz tebliğ, muhatabın öğrendiği tarihte yapılmış sayılır; öğrenme tarihinin ispatı önemlidir. e-Tebligat kuralları ayrıca düzenlenmiştir.',
    sections: [
      {
        heading: 'Ne zaman usulsüz sayılır?',
        paragraphs: [
          'Yanlış adrese çıkarma, usule aykırı komşuya/ kapıcıya teslim, imza ve beyana aykırılıklar örneklenir. Her şekil eksikliği aynı sonucu doğurmayabilir.',
        ],
      },
      {
        heading: 'Ne yapılmalı?',
        paragraphs: [
          'Öğrenme tarihi belgelenmeli, ilgili mercie (icra, mahkeme) süre içinde bildirilmelidir. Süreler dosya türüne göre değişir.',
        ],
      },
    ],
    steps: [
      'Tebliğ evrağını inceleyin.',
      'Öğrenme anını belgelendirin.',
      'Yetkili mercie itiraz/beyan verin.',
      'Asıl işleme (itiraz, dava) süresini kaçırmayın.',
    ],
    faq: [
      {
        q: 'e-Tebligatı açmazsam süre işlemez mi?',
        a: 'e-Tebligatta kanuni karineler vardır; «açmadım» her zaman süreyi durdurmaz.',
      },
    ],
  },
  tedbir: {
    lead: 'İhtiyati tedbir, hakların dava sonuçlanana kadar korunması için verilen geçici korumadır. Yaklaşık ispat ve çoğu zaman teminat aranır. Haksız tedbirde tazminat riski vardır.',
    sections: [
      {
        heading: 'Şartlar',
        paragraphs: [
          'Hakkın varlığı hakkında kuvvetli izlenim ve gecikmede zarar tehlikesi aranır. Tapu şerhi, ödeme yasağı, malın muhafazası örnek tedbirlerdir.',
        ],
      },
    ],
    steps: [
      'Tedbir sebebini ve delilleri hazırlayın.',
      'Teminat imkânını değerlendirin.',
      'Görevli mahkemeden talep edin.',
      'Kararı tebliğ/ icra edin.',
      'Esas davayı süresinde açın/ yürüteğin.',
    ],
    faq: [
      {
        q: 'Tedbir kalıcı mıdır?',
        a: 'Hayır, geçicidir; şartlar değişince kaldırılabilir veya değiştirilebilir.',
      },
    ],
  },
  engelli_rapor: {
    lead: 'Engelli sağlık kurulu raporu, engellilik oranını ve bazı haklardan yararlanmayı sağlar. Yetkili hastanelerden alınır; e-rapor sistemleri yaygındır.',
    sections: [
      {
        heading: 'Başvuru',
        paragraphs: [
          'Devlet/ üniversite hastanelerinin engelli sağlık kurullarına başvurulur. Poliklinik muayeneleri ve kurul kararı sonrası rapor düzenlenir.',
        ],
      },
      {
        heading: 'Kullanım alanları',
        paragraphs: [
          'Vergi indirimi, araç ÖTV muafiyeti, eğitim ve istihdam hakları, engelli kimlik kartı gibi alanlarda kullanılır. Her hak farklı oran ve belge isteyebilir.',
        ],
      },
    ],
    steps: [
      'Yetkili hastaneyi seçin.',
      'Randevu ve evrak listesini alın.',
      'Kurul sürecini tamamlayın.',
      'Raporu e-Devlet/ basılı alın.',
      'İlgili kurum başvurusunu yapın.',
    ],
    faq: [
      {
        q: 'Rapor süreli olabilir mi?',
        a: 'Evet, süreli veya sürekli rapor düzenlenebilir; süre bitiminde yenileme gerekir.',
      },
    ],
  },
  yapilandirma: {
    lead: 'Vergi ve bazı kamu alacaklarında dönemsel yapılandırma kanunları çıkarılabilir. Başvuru e-Devlet, GİB ve ilgili idareler üzerinden yapılır. Peşin ödeme indirimi ve taksit aksatma kuralları kritiktir.',
    sections: [
      {
        heading: 'Dikkat',
        paragraphs: [
          'Yapılandırma her borç türünü kapsamaz. Süre kaçınca hak kaybı olur. Taksit bozulursa kanundaki sonuçlar uygulanır.',
        ],
      },
    ],
    steps: [
      'Borç dökümünü alın.',
      'Yapılandırma kapsamını okuyun.',
      'e-Devlet/GİB’den başvurun.',
      'Peşinat/taksitleri aksatmayın.',
    ],
    faq: [
      {
        q: 'Her yıl yapılandırma çıkar mı?',
        a: 'Hayır. Dönemsel kanunlara bağlıdır; spekülasyon yapılmamalıdır.',
      },
    ],
  },
  kamulastirma: {
    lead: 'Kamulaştırma, kamu yararı için özel mülkiyete idarece el konulması ve bedel ödenmesidir. Bedel tespiti ve tescil davaları, idari işlemlere itiraz ve kamulaştırmasız el atma ayrı kurumlardır.',
    sections: [
      {
        heading: 'Süreç',
        paragraphs: [
          'Kamu yararı kararı, satın alma teklifi, anlaşmazlıkta bedel tespiti ve tescil aşamaları izlenir. Acele kamulaştırmada tempo farklıdır.',
        ],
      },
      {
        heading: 'Hak arama',
        paragraphs: [
          'Bedele itiraz, idari işlemin iptali ve ecrimisil/el atma tazminatı yolları dosyaya göre seçilir. Süreler kaçırılmamalıdır.',
        ],
      },
    ],
    steps: [
      'Tebliğ ve kamulaştırma evrakını saklayın.',
      'Bedel teklifini değerlendirin.',
      'Anlaşmazlıkta dava sürelerini hesaplayın.',
      'Bilirkişi ve keşif sürecine katılın.',
    ],
    faq: [
      {
        q: 'Bedeli beğenmezsem?',
        a: 'Kanuni süre içinde bedele itiraz/dava yolları açıktır; süre dosya türüne göre değişir.',
      },
    ],
  },
  kacak: {
    lead: 'Ruhsatsız veya ruhsata aykırı yapı imar mevzuatında yaptırıma tabidir. Para cezası, mühürleme, yıkım ve idari işlemler gündeme gelebilir. İtiraz ve iptal davası süreye bağlıdır.',
    sections: [
      {
        heading: 'Ne yapılır?',
        paragraphs: [
          'Tebliğ edilen tutanağı inceleyin, süreleri not edin, teknik aykırılığı mimar/mühendis raporuyla değerlendirin. Gerekirse idari dava açın.',
        ],
      },
    ],
    steps: [
      'Tutanak ve tebliği alın.',
      'Ruhsat/proje durumunu çıkarın.',
      'İdari itiraz ve yargı yolunu planlayın.',
      'Yıkım riskine karşı tedbir değerlendirin.',
    ],
    faq: [
      {
        q: 'İmar barışı sürüyor mu?',
        a: 'Dönemsel uygulamalardır; güncel mevzuata bakılmalıdır.',
      },
    ],
  },
  abonelik: {
    lead: 'Tüketici aboneliklerinde cayma, fesih ve taahhütname cezaları TKHK ve ikincil mevzuata tabidir. Yazılı/ e-Devlet/ operatör kanallarından iptal belgelenmelidir.',
    sections: [
      {
        heading: 'Cayma ve fesih',
        paragraphs: [
          'Mesafeli sözleşmelerde cayma hakkı süreye bağlıdır. Taahhütlü hatlarda erken fesih ücreti hesaplanır; haksız şart tartışılabilir.',
        ],
      },
    ],
    steps: [
      'Sözleşme ve taahhütnameyi bulun.',
      'İptal talebini yazılı/kayıtlı yapın.',
      'İptal numarasını alın.',
      'Haksız ücret için hakem heyetine gidin.',
    ],
    faq: [
      {
        q: 'Sadece telefonla iptal yeterli mi?',
        a: 'Kayıt ve teyit alın; mümkünse yazılı/ e-posta ile sabitleyin.',
      },
    ],
  },
  ehliyet: {
    lead: 'Sürücü belgesi için yaş, eğitim, sağlık raporu ve sınav şartları aranır. Sınıfına göre (B, A vb.) şartlar değişir. e-Devlet randevu ve başvuru adımları kullanılır.',
    sections: [
      {
        heading: 'Genel adımlar',
        paragraphs: [
          'Direksiyon kursu kaydı, teorik ve direksiyon sınavı, sağlık raporu ve harçlar tipik süreçtir. Sabıka ve engel hâlleri kontrol edilir.',
        ],
      },
    ],
    steps: [
      'Uygun ehliyet sınıfını seçin.',
      'Sağlık raporunu alın.',
      'Kursa kaydolun ve sınavlara girin.',
      'Belgeyi e-Devlet/nüfus süreçleriyle tamamlayın.',
    ],
    faq: [
      {
        q: 'Ehliyet yenileme nasıl?',
        a: 'Süre bitimine yakın e-Devlet ve nüfus/trafik birimleri üzerinden yenilenir; sağlık raporu istenebilir.',
      },
    ],
  },
  nufus: {
    lead: 'Nüfus kayıt örneği (vukuatlı/özlü) kimlik ve medeni durum işlemlerinde istenir. e-Devlet’ten barkodlu belge almak yaygındır; bazı kurumlar ıslak imzalı suret arar.',
    sections: [
      {
        heading: 'Nasıl alınır?',
        paragraphs: [
          'e-Devlet → Nüfus ve Vatandaşlık işlemleri üzerinden örnek alınabilir. Nüfus müdürlüğünden de talep edilir.',
        ],
      },
    ],
    steps: [
      'e-Devlet girişi yapın.',
      'Nüfus kayıt örneği hizmetini seçin.',
      'Barkodlu PDF’i indirin.',
      'Kurum ıslak imza isterse müdürlüğe gidin.',
    ],
    faq: [
      {
        q: 'Vukuatlı ile özet farkı nedir?',
        a: 'Vukuatlı kayıt olay geçmişini daha ayrıntılı gösterir; istenen tür kuruma göre değişir.',
      },
    ],
  },
  icra_sorgu: {
    lead: 'İcra dosyası sorgulama UYAP Vatandaş / e-Devlet üzerinden, taraf veya vekil sıfatıyla yapılabilir. Dosya esas numarası ve icra dairesi bilgisi gerekir.',
    sections: [
      {
        heading: 'Nasıl bakılır?',
        paragraphs: [
          'e-Devlet’te icra dosyası sorgulama veya UYAP Vatandaş Portal kullanılır. SMS/e-posta bilgilendirme tercih edilebilir.',
        ],
      },
    ],
    steps: [
      'T.C. kimlik ile giriş yapın.',
      'İcra dosyası menüsünü açın.',
      'Dosya ve borç dökümünü inceleyin.',
      'Ödeme veya itiraz için daireyle iletişime geçin.',
    ],
    faq: [
      {
        q: 'Başkasının dosyasını görebilir miyim?',
        a: 'Hayır. Yalnızca taraf, vekil veya kanunen yetkili kişiler erişebilir.',
      },
    ],
  },
  senet: {
    lead: 'Bono ve benzeri kambiyo senetlerinde icra takibi, kambiyo senetlerine özgü yol ile hızlı ilerleyebilir. Borçlunun itiraz imkânları ve süreleri özeldir.',
    sections: [
      {
        heading: 'Alacaklı için',
        paragraphs: [
          'Senedin şekil unsurları (keşideci, lehtar, meblağ, tarih, imza) kontrol edilir. Takip talebi ve ödeme emri kambiyo usulüne göre düzenlenir.',
        ],
      },
      {
        heading: 'Borçlu için',
        paragraphs: [
          'İmzaya itiraz ve borca itirazın süre ve sonuçları farklıdır. Süreyi kaçırmak haczi hızlandırır.',
        ],
      },
    ],
    steps: [
      'Senedi ve tebliği inceleyin.',
      'Süreleri hesaplayın.',
      'İtiraz/ödeme kararını verin.',
      'Gerekiyorsa menfi tespit veya istirdat planlayın.',
    ],
    faq: [
      {
        q: 'Fotokopi senetle takip olur mu?',
        a: 'Asıl senet kural olarak aranır; istisnalar dar yorumlanır.',
      },
    ],
  },
  fesih: {
    lead: 'İş sözleşmesi bildirimli veya haklı nedenle feshedilebilir. Fesih türü kıdem, ihbar ve işe iade haklarını belirler. Yazılı bildirim ve delil saklama kritiktir.',
    sections: [
      {
        heading: 'İşçi feshi',
        paragraphs: [
          'İstifa kural olarak kıdem doğurmaz; haklı nedenle fesihte kıdem gündeme gelebilir. İhbar sürelerine uyulmazsa ihbar tazminatı doğabilir.',
        ],
      },
      {
        heading: 'İşveren feshi',
        paragraphs: [
          'Geçerli ve haklı neden ayrımı işe iade davalarında önemlidir. Savunma alınması gereken hâller vardır.',
        ],
      },
    ],
    steps: [
      'Fesih sebebini yazılılaştırın.',
      'Tazminat kalemlerini listeleyin.',
      'Arabuluculuğa başvurun.',
      'Süre içinde dava açın.',
    ],
    faq: [
      {
        q: 'Sözlü fesih geçerli mi?',
        a: 'İspat sorunludur; yazılı bildirim tercih edilmelidir.',
      },
    ],
  },
  satis_vaadi: {
    lead: 'Gayrimenkul satış vaadi, ileride tapuda devri taahhüt eden sözleşmedir. Geçerlilik için noter resmi şekli aranır. Tapuya şerh, alıcıyı üçüncü kişilere karşı güçlendirir.',
    sections: [
      {
        heading: 'Şekil',
        paragraphs: [
          'Noterlikçe düzenleme şekline uyulmazsa geçersizlik riski doğar. Harici «sözleşme» tek başına mülkiyet devretmez.',
        ],
      },
      {
        heading: 'Aykırılık',
        paragraphs: [
          'Satıcı devirden kaçınırsa tapu tescil davası ve tazminat yolları gündeme gelir. Ödeme makbuzları ve şerh hayati delildir.',
        ],
      },
    ],
    steps: [
      'Noter satış vaadi yaptırın.',
      'Mümkünse tapuya şerh verdirin.',
      'Ödemeleri banka üzerinden yapın.',
      'Devir gününü sözleşmeye bağlayın.',
    ],
    faq: [
      {
        q: 'Kat karşılığı inşaat da aynı mı?',
        a: 'Benzer fikirde olsa da arsa payı karşılığı inşaat özel hüküm ve uygulamalara tabidir.',
      },
    ],
  },
};

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function buildArticle(t) {
  const b = BODIES[t.seed];
  if (!b) throw new Error('missing body ' + t.seed);
  return {
    slug: t.slug,
    title: t.title,
    description: t.description,
    h1: t.h1,
    keywords: t.keywords,
    category: t.category,
    related: t.related,
    links: t.links,
    lead: b.lead,
    sections: b.sections,
    steps: b.steps || [],
    faq: b.faq || [],
    updated: UPDATED,
  };
}

const articles = TOPICS.map(buildArticle);

const file = `/* AUTO-GENERATED by scripts/generate-vatandas-rehberi.mjs — do not hand-edit */
import type { VatandasArticle } from './types';

export const VATANDAS_ARTICLES: VatandasArticle[] = ${JSON.stringify(articles, null, 2)};

export function getAllVatandasSlugs(): string[] {
  return VATANDAS_ARTICLES.map((a) => a.slug);
}

export function getVatandasBySlug(slug: string): VatandasArticle | undefined {
  return VATANDAS_ARTICLES.find((a) => a.slug === slug);
}

export function getVatandasCategories(): string[] {
  return Array.from(new Set(VATANDAS_ARTICLES.map((a) => a.category))).sort((a, b) =>
    a.localeCompare(b, 'tr')
  );
}

export function getRelatedArticles(slug: string, limit = 4): VatandasArticle[] {
  const a = getVatandasBySlug(slug);
  if (!a) return [];
  const out: VatandasArticle[] = [];
  for (const s of a.related) {
    const x = getVatandasBySlug(s);
    if (x) out.push(x);
    if (out.length >= limit) break;
  }
  if (out.length < limit) {
    for (const x of VATANDAS_ARTICLES) {
      if (x.slug === slug) continue;
      if (out.some((o) => o.slug === x.slug)) continue;
      if (x.category === a.category) out.push(x);
      if (out.length >= limit) break;
    }
  }
  return out;
}
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, file, 'utf8');
console.log('Wrote', OUT, 'articles:', articles.length);
