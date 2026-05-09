export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  kanunId: string;
  startMadde: number;
  endMadde: number;
  icon: string;
}

export const categories: Category[] = [
  {
    id: 'tmk-baslangic',
    slug: 'tmk-baslangic',
    name: 'Başlangıç Hükümleri',
    description: 'Türk Medeni Kanunu (Madde 1-7)',
    kanunId: 'tmk',
    startMadde: 1,
    endMadde: 7,
    icon: 'fa-solid fa-book-open'
  },
  {
    id: 'kisiler-hukuku',
    slug: 'kisiler-hukuku',
    name: 'Kişiler Hukuku',
    description: 'Türk Medeni Kanunu (Madde 8-117)',
    kanunId: 'tmk',
    startMadde: 8,
    endMadde: 117,
    icon: 'fa-solid fa-users'
  },
  {
    id: 'aile-hukuku',
    slug: 'aile-hukuku',
    name: 'Aile Hukuku',
    description: 'Türk Medeni Kanunu (Madde 118-494)',
    kanunId: 'tmk',
    startMadde: 118,
    endMadde: 494,
    icon: 'fa-solid fa-house-chimney-window'
  },
  {
    id: 'miras-hukuku',
    slug: 'miras-hukuku',
    name: 'Miras Hukuku',
    description: 'Türk Medeni Kanunu (Madde 495-682)',
    kanunId: 'tmk',
    startMadde: 495,
    endMadde: 682,
    icon: 'fa-solid fa-scroll'
  },
  {
    id: 'esya-hukuku',
    slug: 'esya-hukuku',
    name: 'Eşya Hukuku',
    description: 'Türk Medeni Kanunu (Madde 683-1027)',
    kanunId: 'tmk',
    startMadde: 683,
    endMadde: 1027,
    icon: 'fa-solid fa-building-columns'
  },
  {
    id: 'borclar-genel',
    slug: 'borclar-genel',
    name: 'Borçlar Genel Hükümler',
    description: 'Türk Borçlar Kanunu (Madde 1-206)',
    kanunId: 'tbk',
    startMadde: 1,
    endMadde: 206,
    icon: 'fa-solid fa-file-contract'
  },
  {
    id: 'borclar-ozel',
    slug: 'borclar-ozel',
    name: 'Borçlar Özel Hükümler',
    description: 'Türk Borçlar Kanunu (Madde 207-649)',
    kanunId: 'tbk',
    startMadde: 207,
    endMadde: 649,
    icon: 'fa-solid fa-handshake'
  },
  {
    id: 'ticari-isletme',
    slug: 'ticari-isletme',
    name: 'Ticari İşletme Hukuku',
    description: 'Türk Ticaret Kanunu (Madde 1-123)',
    kanunId: 'ttk',
    startMadde: 1,
    endMadde: 123,
    icon: 'fa-solid fa-shop'
  },
  {
    id: 'ticari-sirketler',
    slug: 'ticari-sirketler',
    name: 'Ticaret Şirketleri',
    description: 'Türk Ticaret Kanunu (Madde 124-644)',
    kanunId: 'ttk',
    startMadde: 124,
    endMadde: 644,
    icon: 'fa-solid fa-building'
  },
  {
    id: 'kiymetli-evrak',
    slug: 'kiymetli-evrak',
    name: 'Kıymetli Evrak Hukuku',
    description: 'Türk Ticaret Kanunu (Madde 645-849)',
    kanunId: 'ttk',
    startMadde: 645,
    endMadde: 849,
    icon: 'fa-solid fa-file-invoice-dollar'
  },
  {
    id: 'sigorta-hukuku',
    slug: 'sigorta-hukuku',
    name: 'Sigorta Hukuku',
    description: 'Türk Ticaret Kanunu (Madde 1401-1520)',
    kanunId: 'ttk',
    startMadde: 1401,
    endMadde: 1520,
    icon: 'fa-solid fa-shield-halved'
  }
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}
