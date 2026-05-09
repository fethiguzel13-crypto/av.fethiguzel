/**
 * Hukuk Kategorileri Hiyerarşisi
 * Ana dallar → Alt dallar → Kanun maddeleri bağlantısı
 * SEO-uyumlu slug'lar ile URL yapısı: /medeni-hukuk/aile-hukuku/madde-166
 */

export interface LawSubCategory {
  slug: string;
  name: string;
  description: string;
  kanunId: string;       // 'tmk' | 'tbk' | 'ttk'
  startMadde: number;
  endMadde: number;
  seoKeywords: string[];
}

export interface LawCategory {
  slug: string;
  name: string;
  description: string;
  kanunAdi: string;
  subCategories: LawSubCategory[];
  seoKeywords: string[];
}

export const lawCategories: LawCategory[] = [
  {
    slug: 'medeni-hukuk',
    name: 'Medeni Hukuk',
    description: 'Türk Medeni Kanunu kapsamında kişiler, aile, miras ve eşya hukukuna ilişkin kanun maddeleri, Yargıtay kararları ve akademik analizler.',
    kanunAdi: 'Türk Medeni Kanunu (TMK)',
    seoKeywords: [
      'medeni hukuk', 'türk medeni kanunu', 'TMK', 'boşanma avukatı',
      'miras avukatı', 'velayet davası', 'vesayet', 'tapu iptal tescil',
      'Van avukat', 'Erciş avukat', 'Fethi Güzel'
    ],
    subCategories: [
      {
        slug: 'baslangic-hukumleri',
        name: 'Başlangıç Hükümleri',
        description: 'Türk Medeni Kanunu Başlangıç Hükümleri (Madde 1-7) – Hukukun uygulanması, dürüstlük kuralı, ispat yükü ve hakimin takdir yetkisine ilişkin temel düzenlemeler.',
        kanunId: 'tmk',
        startMadde: 1,
        endMadde: 7,
        seoKeywords: ['dürüstlük kuralı', 'ispat yükü', 'hakimin takdir yetkisi', 'TMK madde 1']
      },
      {
        slug: 'kisiler-hukuku',
        name: 'Kişiler Hukuku',
        description: 'Türk Medeni Kanunu Kişiler Hukuku (Madde 8-117) – Gerçek ve tüzel kişiler, hak ehliyeti, fiil ehliyeti, kişilik hakları ve dernekler hukukuna dair düzenlemeler.',
        kanunId: 'tmk',
        startMadde: 8,
        endMadde: 117,
        seoKeywords: ['kişiler hukuku', 'hak ehliyeti', 'fiil ehliyeti', 'kişilik hakları', 'vesayet']
      },
      {
        slug: 'aile-hukuku',
        name: 'Aile Hukuku',
        description: 'Türk Medeni Kanunu Aile Hukuku (Madde 118-494) – Nişanlanma, evlenme, boşanma, velayet, nafaka, mal rejimi ve soybağına ilişkin hükümler.',
        kanunId: 'tmk',
        startMadde: 118,
        endMadde: 494,
        seoKeywords: ['boşanma', 'velayet', 'nafaka', 'mal rejimi', 'aile hukuku', 'boşanma avukatı Van']
      },
      {
        slug: 'miras-hukuku',
        name: 'Miras Hukuku',
        description: 'Türk Medeni Kanunu Miras Hukuku (Madde 495-682) – Yasal ve atanmış mirasçılar, saklı pay, tenkis davaları, vasiyetname, miras paylaşımı ve ortaklığın giderilmesi (izale-i şuyu).',
        kanunId: 'tmk',
        startMadde: 495,
        endMadde: 682,
        seoKeywords: ['miras hukuku', 'miras davası', 'tenkis davası', 'muris muvazaası', 'saklı pay', 'izale-i şuyu', 'ortaklığın giderilmesi']
      },
      {
        slug: 'esya-hukuku',
        name: 'Eşya Hukuku',
        description: 'Türk Medeni Kanunu Eşya Hukuku (Madde 683-1027) – Mülkiyet, zilyetlik, tapu sicili, ipotek, irtifak hakları ve tapu iptal tescil davalarına ilişkin düzenlemeler.',
        kanunId: 'tmk',
        startMadde: 683,
        endMadde: 1027,
        seoKeywords: ['eşya hukuku', 'tapu iptal tescil', 'ipotek', 'zilyetlik', 'tapu sicili']
      },
    ]
  },
  {
    slug: 'borclar-hukuku',
    name: 'Borçlar Hukuku',
    description: 'Türk Borçlar Kanunu kapsamında sözleşmeler, haksız fiil, sebepsiz zenginleşme ve özel borç ilişkilerine dair kanun maddeleri ve akademik analizler.',
    kanunAdi: 'Türk Borçlar Kanunu (TBK)',
    seoKeywords: [
      'borçlar hukuku', 'türk borçlar kanunu', 'TBK', 'sözleşmeler hukuku',
      'tazminat davası', 'haksız fiil', 'kira davaları', 'malpraktis',
      'Van avukat', 'Erciş avukat', 'Avukat Fethi Güzel'
    ],
    subCategories: [
      {
        slug: 'genel-hukumler',
        name: 'Genel Hükümler',
        description: 'Türk Borçlar Kanunu Genel Hükümler (Madde 1-206) – Sözleşmenin kurulması, borçların ifası, haksız fiil, sebepsiz zenginleşme, zamanaşımı ve genel sorumluluk halleri.',
        kanunId: 'tbk',
        startMadde: 1,
        endMadde: 206,
        seoKeywords: ['haksız fiil', 'tazminat', 'adam çalıştıranın sorumluluğu', 'malpraktis', 'zamanaşımı', 'sözleşmeler hukuku']
      },
      {
        slug: 'ozel-hukumler',
        name: 'Özel Hükümler',
        description: 'Türk Borçlar Kanunu Özel Hükümler (Madde 207-649) – Satış, kira, eser, vekâlet, hizmet sözleşmeleri ve diğer özel borç ilişkileri.',
        kanunId: 'tbk',
        startMadde: 207,
        endMadde: 649,
        seoKeywords: ['kira sözleşmesi', 'kira davaları', 'eser sözleşmesi', 'vekâlet sözleşmesi', 'iş sözleşmesi', 'haksız fesih']
      },
    ]
  },
  {
    slug: 'ticaret-hukuku',
    name: 'Ticaret Hukuku',
    description: 'Türk Ticaret Kanunu kapsamında ticari işletme, şirketler, kıymetli evrak ve sigorta hukukuna ilişkin kanun maddeleri ve akademik değerlendirmeler.',
    kanunAdi: 'Türk Ticaret Kanunu (TTK)',
    seoKeywords: [
      'ticaret hukuku', 'türk ticaret kanunu', 'TTK', 'şirketler hukuku',
      'çek', 'bono', 'poliçe', 'kıymetli evrak', 'ticari dava',
      'Van avukat', 'Erciş avukat', 'Fethi Güzel'
    ],
    subCategories: [
      {
        slug: 'ticari-isletme-hukuku',
        name: 'Ticari İşletme Hukuku',
        description: 'Türk Ticaret Kanunu Ticari İşletme Hukuku (Madde 1-123) – Tacir, ticari iş, ticaret sicili, ticaret unvanı, haksız rekabet ve cari hesap.',
        kanunId: 'ttk',
        startMadde: 1,
        endMadde: 123,
        seoKeywords: ['ticari işletme', 'tacir', 'haksız rekabet', 'ticaret sicili']
      },
      {
        slug: 'sirketler-hukuku',
        name: 'Şirketler Hukuku',
        description: 'Türk Ticaret Kanunu Şirketler Hukuku (Madde 124-644) – Anonim, limited, kollektif ve komandit şirketler, yönetim kurulu, genel kurul ve pay devirleri.',
        kanunId: 'ttk',
        startMadde: 124,
        endMadde: 644,
        seoKeywords: ['şirketler hukuku', 'anonim şirket', 'limited şirket', 'pay devri', 'genel kurul']
      },
      {
        slug: 'kiymetli-evrak-hukuku',
        name: 'Kıymetli Evrak Hukuku',
        description: 'Türk Ticaret Kanunu Kıymetli Evrak Hukuku (Madde 645-849) – Çek, bono, poliçe, emre yazılı senetler ve hamile yazılı senetler.',
        kanunId: 'ttk',
        startMadde: 645,
        endMadde: 849,
        seoKeywords: ['kıymetli evrak', 'çek', 'bono', 'poliçe', 'kambiyo senetleri']
      },
      {
        slug: 'sigorta-hukuku',
        name: 'Sigorta Hukuku',
        description: 'Türk Ticaret Kanunu Sigorta Hukuku (Madde 1401-1520) – Sigorta sözleşmesi, hasar, tazminat, rücu ve sigorta türleri.',
        kanunId: 'ttk',
        startMadde: 1401,
        endMadde: 1520,
        seoKeywords: ['sigorta hukuku', 'sigorta sözleşmesi', 'hasar tazminat', 'kasko', 'trafik sigortası']
      },
    ]
  }
];

/**
 * Slug'a göre ana kategori bul
 */
export function getLawCategoryBySlug(slug: string): LawCategory | undefined {
  return lawCategories.find(c => c.slug === slug);
}

/**
 * Slug'a göre alt kategori bul (tüm ana kategorilerde ara)
 */
export function getLawSubCategoryBySlug(parentSlug: string, subSlug: string): LawSubCategory | undefined {
  const parent = getLawCategoryBySlug(parentSlug);
  if (!parent) return undefined;
  return parent.subCategories.find(sc => sc.slug === subSlug);
}

/**
 * Tüm alt kategorileri düz liste olarak getir
 */
export function getAllSubCategories(): (LawSubCategory & { parentSlug: string; parentName: string })[] {
  const result: (LawSubCategory & { parentSlug: string; parentName: string })[] = [];
  for (const cat of lawCategories) {
    for (const sub of cat.subCategories) {
      result.push({ ...sub, parentSlug: cat.slug, parentName: cat.name });
    }
  }
  return result;
}
