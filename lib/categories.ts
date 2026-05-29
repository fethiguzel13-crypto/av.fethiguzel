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
    id: 'tasima-hukuku',
    slug: 'tasima-hukuku',
    name: 'Taşıma Hukuku',
    description: 'Türk Ticaret Kanunu (Madde 850-930)',
    kanunId: 'ttk',
    startMadde: 850,
    endMadde: 930,
    icon: 'fa-solid fa-truck-fast'
  },
  {
    id: 'deniz-ticareti',
    slug: 'deniz-ticareti',
    name: 'Deniz Ticareti Hukuku',
    description: 'Türk Ticaret Kanunu (Madde 931-1400)',
    kanunId: 'ttk',
    startMadde: 931,
    endMadde: 1400,
    icon: 'fa-solid fa-ship'
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
  },
  {
    id: 'ttk-son-hukumler',
    slug: 'ttk-son-hukumler',
    name: 'Yürürlük ve Son Hükümler',
    description: 'Türk Ticaret Kanunu (Madde 1521-1535)',
    kanunId: 'ttk',
    startMadde: 1521,
    endMadde: 1535,
    icon: 'fa-solid fa-calendar-check'
  },
  {
    id: 'tck-genel',
    slug: 'tck-genel',
    name: 'Genel Hükümler',
    description: 'Türk Ceza Kanunu (Madde 1-75)',
    kanunId: 'tck',
    startMadde: 1,
    endMadde: 75,
    icon: 'fa-solid fa-scale-balanced'
  },
  {
    id: 'tck-uluslararasi',
    slug: 'tck-uluslararasi',
    name: 'Uluslararası Suçlar',
    description: 'Türk Ceza Kanunu (Madde 76-80)',
    kanunId: 'tck',
    startMadde: 76,
    endMadde: 80,
    icon: 'fa-solid fa-earth-europe'
  },
  {
    id: 'tck-kisiler',
    slug: 'tck-kisiler',
    name: 'Kişilere Karşı Suçlar',
    description: 'Türk Ceza Kanunu (Madde 81-173)',
    kanunId: 'tck',
    startMadde: 81,
    endMadde: 173,
    icon: 'fa-solid fa-person'
  },
  {
    id: 'tck-toplum',
    slug: 'tck-toplum',
    name: 'Topluma Karşı Suçlar',
    description: 'Türk Ceza Kanunu (Madde 174-246)',
    kanunId: 'tck',
    startMadde: 174,
    endMadde: 246,
    icon: 'fa-solid fa-people-group'
  },
  {
    id: 'tck-devlet',
    slug: 'tck-devlet',
    name: 'Millete ve Devlete Karşı Suçlar',
    description: 'Türk Ceza Kanunu (Madde 247-345)',
    kanunId: 'tck',
    startMadde: 247,
    endMadde: 345,
    icon: 'fa-solid fa-landmark-flag'
  },
  // ── Usul Hukuku ──────────────────────────────────────────────────────────
  {
    id: 'hmk',
    slug: 'hmk',
    name: 'Hukuk Muhakemeleri Kanunu',
    description: 'Hukuk Muhakemeleri Kanunu (Madde 1-445)',
    kanunId: 'hmk',
    startMadde: 1,
    endMadde: 500,
    icon: 'fa-solid fa-gavel'
  },
  {
    id: 'iik',
    slug: 'iik',
    name: 'İcra ve İflas Kanunu',
    description: 'İcra ve İflas Kanunu (Madde 1-433)',
    kanunId: 'iik',
    startMadde: 1,
    endMadde: 500,
    icon: 'fa-solid fa-file-invoice-dollar'
  },
  {
    id: 'cmk',
    slug: 'cmk',
    name: 'Ceza Muhakemesi Kanunu',
    description: 'Ceza Muhakemesi Kanunu (Madde 1-332)',
    kanunId: 'cmk',
    startMadde: 1,
    endMadde: 400,
    icon: 'fa-solid fa-magnifying-glass'
  },
  // ── Vergi Hukuku ─────────────────────────────────────────────────────────
  {
    id: 'vuk',
    slug: 'vuk',
    name: 'Vergi Usul Kanunu',
    description: 'Vergi Usul Kanunu (Madde 1-416)',
    kanunId: 'vuk',
    startMadde: 1,
    endMadde: 500,
    icon: 'fa-solid fa-receipt'
  },
  {
    id: 'gvk',
    slug: 'gvk',
    name: 'Gelir Vergisi Kanunu',
    description: 'Gelir Vergisi Kanunu (Madde 1-126)',
    kanunId: 'gvk',
    startMadde: 1,
    endMadde: 200,
    icon: 'fa-solid fa-coins'
  },
  {
    id: 'kvk',
    slug: 'kvk',
    name: 'Kurumlar Vergisi Kanunu',
    description: 'Kurumlar Vergisi Kanunu (Madde 1-40)',
    kanunId: 'kvk',
    startMadde: 1,
    endMadde: 50,
    icon: 'fa-solid fa-building-columns'
  },
  {
    id: 'kdvk',
    slug: 'kdvk',
    name: 'Katma Değer Vergisi Kanunu',
    description: 'KDV Kanunu (Madde 1-63)',
    kanunId: 'kdvk',
    startMadde: 1,
    endMadde: 100,
    icon: 'fa-solid fa-percent'
  },
  {
    id: 'aatuhk',
    slug: 'aatuhk',
    name: 'Amme Alacakları Tahsil Usulü',
    description: 'AATUHK (Madde 1-116)',
    kanunId: 'aatuhk',
    startMadde: 1,
    endMadde: 200,
    icon: 'fa-solid fa-hand-holding-dollar'
  },
  // ── İdare Hukuku ─────────────────────────────────────────────────────────
  {
    id: 'dmk',
    slug: 'dmk',
    name: 'Devlet Memurları Kanunu',
    description: 'Devlet Memurları Kanunu (Madde 1-231)',
    kanunId: 'dmk',
    startMadde: 1,
    endMadde: 300,
    icon: 'fa-solid fa-user-tie'
  },
  {
    id: 'kmk',
    slug: 'kmk',
    name: 'Kaçakçılıkla Mücadele Kanunu',
    description: 'Kaçakçılıkla Mücadele Kanunu (Madde 1-27)',
    kanunId: 'kmk',
    startMadde: 1,
    endMadde: 30,
    icon: 'fa-solid fa-shield-halved'
  },
  // ── Ticaret & Finans ─────────────────────────────────────────────────────
  {
    id: 'bk',
    slug: 'bk',
    name: 'Bankacılık Kanunu',
    description: 'Bankacılık Kanunu (Madde 1-167)',
    kanunId: 'bk',
    startMadde: 1,
    endMadde: 200,
    icon: 'fa-solid fa-building-columns'
  },
  {
    id: 'spk',
    slug: 'spk',
    name: 'Sermaye Piyasası Kanunu',
    description: 'Sermaye Piyasası Kanunu (Madde 1-158)',
    kanunId: 'spk',
    startMadde: 1,
    endMadde: 200,
    icon: 'fa-solid fa-chart-line'
  },
  {
    id: 'rkhk',
    slug: 'rkhk',
    name: 'Rekabetin Korunması Hakkında Kanun',
    description: 'Rekabet Kanunu (Madde 1-65)',
    kanunId: 'rkhk',
    startMadde: 1,
    endMadde: 100,
    icon: 'fa-solid fa-scale-unbalanced'
  },
  {
    id: 'cek',
    slug: 'cek',
    name: 'Çek Kanunu',
    description: 'Çek Kanunu (Madde 1-11)',
    kanunId: 'cek',
    startMadde: 1,
    endMadde: 20,
    icon: 'fa-solid fa-money-check'
  },
  // ── Tüketici & Özel ──────────────────────────────────────────────────────
  {
    id: 'tkhk',
    slug: 'tkhk',
    name: 'Tüketicinin Korunması Hakkında Kanun',
    description: 'Tüketici Kanunu (Madde 1-90)',
    kanunId: 'tkhk',
    startMadde: 1,
    endMadde: 100,
    icon: 'fa-solid fa-cart-shopping'
  },
  {
    id: 'kvkk',
    slug: 'kvkk',
    name: 'Kişisel Verilerin Korunması Kanunu',
    description: 'KVKK (Madde 1-32)',
    kanunId: 'kvkk',
    startMadde: 1,
    endMadde: 50,
    icon: 'fa-solid fa-lock'
  },
  // ── İdare (ek) ───────────────────────────────────────────────────────────
  {
    id: 'imar',
    slug: 'imar',
    name: 'İmar Kanunu',
    description: 'İmar Kanunu (Madde 1-50)',
    kanunId: 'imar',
    startMadde: 1,
    endMadde: 60,
    icon: 'fa-solid fa-city'
  },
  {
    id: 'dernekler',
    slug: 'dernekler',
    name: 'Dernekler Kanunu',
    description: 'Dernekler Kanunu (Madde 1-42)',
    kanunId: 'dernekler',
    startMadde: 1,
    endMadde: 50,
    icon: 'fa-solid fa-people-group'
  },
  {
    id: 'vakiflar',
    slug: 'vakiflar',
    name: 'Vakıflar Kanunu',
    description: 'Vakıflar Kanunu (Madde 1-82)',
    kanunId: 'vakiflar',
    startMadde: 1,
    endMadde: 100,
    icon: 'fa-solid fa-hand-holding-heart'
  },
  {
    id: 'ktk',
    slug: 'ktk',
    name: 'Karayolları Trafik Kanunu',
    description: 'Karayolları Trafik Kanunu (Madde 1-141)',
    kanunId: 'ktk',
    startMadde: 1,
    endMadde: 200,
    icon: 'fa-solid fa-car'
  },
  // ── Aile & Kişiler ───────────────────────────────────────────────────────
  {
    id: 'aile-koruma',
    slug: 'aile-koruma',
    name: 'Ailenin Korunması Kanunu',
    description: 'Ailenin Korunması ve Kadına Karşı Şiddetin Önlenmesi (Madde 1-25)',
    kanunId: 'aile-koruma',
    startMadde: 1,
    endMadde: 30,
    icon: 'fa-solid fa-house-chimney-crack'
  },
  {
    id: 'cck',
    slug: 'cck',
    name: 'Çocuk Koruma Kanunu',
    description: 'Çocuk Koruma Kanunu (Madde 1-57)',
    kanunId: 'cck',
    startMadde: 1,
    endMadde: 70,
    icon: 'fa-solid fa-child-reaching'
  },
  {
    id: 'katmulkiyeti',
    slug: 'katmulkiyeti',
    name: 'Kat Mülkiyeti Kanunu',
    description: 'Kat Mülkiyeti Kanunu (Madde 1-75)',
    kanunId: 'katmulkiyeti',
    startMadde: 1,
    endMadde: 100,
    icon: 'fa-solid fa-building'
  },
  // ── Vatandaşlık & Yabancılar ─────────────────────────────────────────────
  {
    id: 'tvk',
    slug: 'tvk',
    name: 'Türk Vatandaşlığı Kanunu',
    description: 'Türk Vatandaşlığı Kanunu (Madde 1-48)',
    kanunId: 'tvk',
    startMadde: 1,
    endMadde: 60,
    icon: 'fa-solid fa-passport'
  },
  {
    id: 'nhk',
    slug: 'nhk',
    name: 'Nüfus Hizmetleri Kanunu',
    description: 'Nüfus Hizmetleri Kanunu (Madde 1-77)',
    kanunId: 'nhk',
    startMadde: 1,
    endMadde: 100,
    icon: 'fa-solid fa-id-card'
  },
  {
    id: 'yukk',
    slug: 'yukk',
    name: 'Yabancılar ve Uluslararası Koruma Kanunu',
    description: 'YUKK (Madde 1-123)',
    kanunId: 'yukk',
    startMadde: 1,
    endMadde: 150,
    icon: 'fa-solid fa-earth-europe'
  },
  // ── İş Hukuku ────────────────────────────────────────────────────────────
  {
    id: 'is-kanunu',
    slug: 'is-kanunu',
    name: 'İş Kanunu',
    description: 'İş Kanunu (Madde 1-119)',
    kanunId: 'is-kanunu',
    startMadde: 1,
    endMadde: 150,
    icon: 'fa-solid fa-briefcase'
  },
  {
    id: 'ssgssk',
    slug: 'ssgssk',
    name: 'Sosyal Sigortalar ve GSS Kanunu',
    description: 'SSGSSK (Madde 1-106)',
    kanunId: 'ssgssk',
    startMadde: 1,
    endMadde: 150,
    icon: 'fa-solid fa-hospital'
  },
  {
    id: 'sendikalar',
    slug: 'sendikalar',
    name: 'Sendikalar ve Toplu İş Sözleşmesi Kanunu',
    description: 'Sendikalar Kanunu (Madde 1-83)',
    kanunId: 'sendikalar',
    startMadde: 1,
    endMadde: 100,
    icon: 'fa-solid fa-people-carry-box'
  },
  {
    id: 'isg',
    slug: 'isg',
    name: 'İş Sağlığı ve Güvenliği Kanunu',
    description: 'İSG Kanunu (Madde 1-40)',
    kanunId: 'isg',
    startMadde: 1,
    endMadde: 50,
    icon: 'fa-solid fa-hard-hat'
  },
  // ── Usul (ek) ─────────────────────────────────────────────────────────────
  {
    id: 'tebligat',
    slug: 'tebligat',
    name: 'Tebligat Kanunu',
    description: 'Tebligat Kanunu (Madde 1-64)',
    kanunId: 'tebligat',
    startMadde: 1,
    endMadde: 100,
    icon: 'fa-solid fa-envelope'
  },
  {
    id: 'arabuluculuk',
    slug: 'arabuluculuk',
    name: 'Arabuluculuk Kanunu',
    description: 'Hukuk Uyuşmazlıklarında Arabuluculuk Kanunu (Madde 1-38)',
    kanunId: 'arabuluculuk',
    startMadde: 1,
    endMadde: 50,
    icon: 'fa-solid fa-handshake-angle'
  },
  // ── Güvenlik Hukuku ───────────────────────────────────────────────────────
  {
    id: 'pvsk',
    slug: 'pvsk',
    name: 'Polis Vazife ve Salâhiyet Kanunu',
    description: 'PVSK (Madde 1-30)',
    kanunId: 'pvsk',
    startMadde: 1,
    endMadde: 40,
    icon: 'fa-solid fa-shield-halved'
  },
  {
    id: 'jandarma',
    slug: 'jandarma',
    name: 'Jandarma Teşkilat, Görev ve Yetkileri Kanunu',
    description: 'Jandarma Kanunu (Madde 1-29)',
    kanunId: 'jandarma',
    startMadde: 1,
    endMadde: 40,
    icon: 'fa-solid fa-star-of-life'
  },
  {
    id: 'tsk-ic-hizmet',
    slug: 'tsk-ic-hizmet',
    name: 'TSK İç Hizmet Kanunu',
    description: 'TSK İç Hizmet Kanunu (Madde 1-118)',
    kanunId: 'tsk-ic-hizmet',
    startMadde: 1,
    endMadde: 150,
    icon: 'fa-solid fa-star'
  },
  // ── Vergi (ek) ────────────────────────────────────────────────────────────
  {
    id: 'otv',
    slug: 'otv',
    name: 'Özel Tüketim Vergisi Kanunu',
    description: 'ÖTV Kanunu (Madde 1-22)',
    kanunId: 'otv',
    startMadde: 1,
    endMadde: 30,
    icon: 'fa-solid fa-gas-pump'
  },
  // ── Yerel Yönetimler ──────────────────────────────────────────────────────
  {
    id: 'il-idaresi',
    slug: 'il-idaresi',
    name: 'İl İdaresi Kanunu',
    description: 'İl İdaresi Kanunu (Madde 1-65)',
    kanunId: 'il-idaresi',
    startMadde: 1,
    endMadde: 80,
    icon: 'fa-solid fa-landmark'
  },
  {
    id: 'belediye',
    slug: 'belediye',
    name: 'Belediye Kanunu',
    description: 'Belediye Kanunu (Madde 1-87)',
    kanunId: 'belediye',
    startMadde: 1,
    endMadde: 100,
    icon: 'fa-solid fa-city'
  },
  {
    id: 'buyuksehir',
    slug: 'buyuksehir',
    name: 'Büyükşehir Belediyesi Kanunu',
    description: 'Büyükşehir Belediyesi Kanunu (Madde 1-31)',
    kanunId: 'buyuksehir',
    startMadde: 1,
    endMadde: 40,
    icon: 'fa-solid fa-city'
  },
  // ── Kamu İhale ────────────────────────────────────────────────────────────
  {
    id: 'kamu-ihale-sozlesmeleri',
    slug: 'kamu-ihale-sozlesmeleri',
    name: 'Kamu İhale Sözleşmeleri Kanunu',
    description: 'Kamu İhale Sözleşmeleri Kanunu (Madde 1-41)',
    kanunId: 'kamu-ihale-sozlesmeleri',
    startMadde: 1,
    endMadde: 50,
    icon: 'fa-solid fa-file-signature'
  },
  {
    id: 'devlet-ihale',
    slug: 'devlet-ihale',
    name: 'Devlet İhale Kanunu',
    description: 'Devlet İhale Kanunu (Madde 1-93)',
    kanunId: 'devlet-ihale',
    startMadde: 1,
    endMadde: 100,
    icon: 'fa-solid fa-file-contract'
  },
  // ── Mülkiyet (ek) ─────────────────────────────────────────────────────────
  {
    id: 'kamulastirma',
    slug: 'kamulastirma',
    name: 'Kamulaştırma Kanunu',
    description: 'Kamulaştırma Kanunu (Madde 1-43)',
    kanunId: 'kamulastirma',
    startMadde: 1,
    endMadde: 50,
    icon: 'fa-solid fa-map-location-dot'
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}
