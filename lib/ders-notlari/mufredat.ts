import type { CurriculumCourse } from './types';

/** Çekirdek + seçmeli iskelet — hukuk fakültelerinde okutulan ana dersler */
export const CURRICULUM: CurriculumCourse[] = [
  // 1. sınıf
  { code: 'hukuka-giris', title: 'Hukuka Giriş / Hukukun Temel Kavramları', year: 1, semester: 'guz', area: 'genel', keywords: ['hukuka giriş', 'hukukun temel kavramları'], core: true },
  { code: 'anayasa-1', title: 'Anayasa Hukuku I (Genel Esaslar)', year: 1, semester: 'guz', area: 'kamu', keywords: ['anayasa hukuku', 'temel haklar'], core: true },
  { code: 'roma-hukuku', title: 'Roma Hukuku', year: 1, semester: 'guz', area: 'genel', keywords: ['roma hukuku', 'ius civile'], core: true },
  { code: 'medeni-baslangic', title: 'Medeni Hukuka Giriş ve Başlangıç Hükümleri', year: 1, semester: 'bahar', area: 'ozel', keywords: ['medeni hukuk', 'TMK başlangıç', 'kişiler hukuku giriş'], core: true },
  { code: 'anayasa-2', title: 'Anayasa Hukuku II (Türk Anayasa Düzeni)', year: 1, semester: 'bahar', area: 'kamu', keywords: ['anayasa organları', 'yasama yürütme yargı'], core: true },
  { code: 'hukuk-felsefesi', title: 'Hukuk Felsefesi ve Sosyolojisi', year: 1, semester: 'bahar', area: 'genel', keywords: ['hukuk felsefesi', 'hukuk sosyolojisi'], core: true },
  { code: 'hukuk-ingilizcesi', title: 'Hukuk İngilizcesi / Legal English', year: 1, semester: 'guz', area: 'genel', keywords: ['hukuk ingilizcesi', 'legal english', 'hukuki terminoloji'], core: true },

  // 2. sınıf
  { code: 'borclar-genel', title: 'Borçlar Hukuku Genel Hükümler', year: 2, semester: 'guz', area: 'ozel', keywords: ['borçlar hukuku', 'TBK genel', 'sözleşme'], core: true },
  { code: 'aile-hukuku', title: 'Aile Hukuku', year: 2, semester: 'guz', area: 'ozel', keywords: ['aile hukuku', 'boşanma', 'mal rejimi'], core: true },
  { code: 'ceza-genel', title: 'Ceza Hukuku Genel Hükümler', year: 2, semester: 'guz', area: 'kamu', keywords: ['ceza hukuku genel', 'TCK genel', 'suç teorisi'], core: true },
  { code: 'idare-hukuku', title: 'İdare Hukuku', year: 2, semester: 'bahar', area: 'kamu', keywords: ['idare hukuku', 'idari işlem'], core: true },
  { code: 'milletlerarasi-hukuk', title: 'Milletlerarası Hukuk', year: 2, semester: 'bahar', area: 'kamu', keywords: ['milletlerarası hukuk', 'uluslararası hukuk'], core: true },
  { code: 'ticari-isletme', title: 'Ticari İşletme Hukuku', year: 2, semester: 'bahar', area: 'ticaret', keywords: ['ticari işletme', 'tacir', 'TTK'], core: true },

  // 3. sınıf
  { code: 'borclar-ozel', title: 'Borçlar Hukuku Özel Hükümler', year: 3, semester: 'guz', area: 'ozel', keywords: ['borçlar özel', 'satım', 'kira', 'vekalet'], core: true },
  { code: 'esya-hukuku', title: 'Eşya Hukuku', year: 3, semester: 'guz', area: 'ozel', keywords: ['eşya hukuku', 'mülkiyet', 'rehin', 'irtifak'], core: true },
  { code: 'ceza-ozel', title: 'Ceza Hukuku Özel Hükümler', year: 3, semester: 'guz', area: 'kamu', keywords: ['ceza özel', 'kasten yaralama', 'hırsızlık'], core: true },
  { code: 'medeni-usul', title: 'Medeni Usul Hukuku', year: 3, semester: 'bahar', area: 'usul', keywords: ['medeni usul', 'HMK', 'dava'], core: true },
  { code: 'ceza-muhakemesi', title: 'Ceza Muhakemesi Hukuku', year: 3, semester: 'bahar', area: 'usul', keywords: ['CMK', 'ceza muhakemesi', 'soruşturma'], core: true },
  { code: 'is-hukuku', title: 'İş ve Sosyal Güvenlik Hukuku', year: 3, semester: 'bahar', area: 'ozel', keywords: ['iş hukuku', 'kıdem', 'iş sözleşmesi'], core: true },
  { code: 'vergi-hukuku', title: 'Vergi Hukuku', year: 3, semester: 'bahar', area: 'kamu', keywords: ['vergi hukuku', 'VUK', 'vergi uyuşmazlığı'], core: true },
  { code: 'idari-yargilama', title: 'İdari Yargılama Hukuku', year: 3, semester: 'bahar', area: 'usul', keywords: ['idari yargı', 'iptal davası', 'tam yargı'], core: true },

  // 4. sınıf
  { code: 'miras-hukuku', title: 'Miras Hukuku', year: 4, semester: 'guz', area: 'ozel', keywords: ['miras hukuku', 'saklı pay', 'yasal mirasçılık'], core: true },
  { code: 'ticaret-sirketler', title: 'Ticaret Şirketleri Hukuku', year: 4, semester: 'guz', area: 'ticaret', keywords: ['anonim şirket', 'limited şirket', 'TTK şirketler'], core: true },
  { code: 'kiymetli-evrak', title: 'Kıymetli Evrak Hukuku', year: 4, semester: 'guz', area: 'ticaret', keywords: ['kıymetli evrak', 'çek', 'bono', 'poliçe'], core: true },
  { code: 'icra-iflas', title: 'İcra ve İflas Hukuku', year: 4, semester: 'bahar', area: 'usul', keywords: ['icra iflas', 'İİK', 'haciz', 'iflas'], core: true },
  { code: 'devletler-ozel', title: 'Devletler Özel Hukuku / MÖHUK', year: 4, semester: 'bahar', area: 'ozel', keywords: ['MÖHUK', 'yabancı unsur', 'yetki hukuku'], core: true },
  { code: 'insan-haklari', title: 'İnsan Hakları Hukuku', year: 4, semester: 'guz', area: 'kamu', keywords: ['insan hakları', 'AİHS', 'bireysel başvuru'], core: true },
  { code: 'fikri-mulkiyet', title: 'Fikri Mülkiyet Hukuku', year: 4, semester: 'bahar', area: 'secmeli', keywords: ['fikri mülkiyet', 'marka', 'patent', 'telif'], core: true },
  { code: 'tuketici-hukuku', title: 'Tüketici Hukuku', year: 4, semester: 'bahar', area: 'secmeli', keywords: ['tüketici hukuku', 'TKHK', 'ayıplı mal'], core: true },
  { code: 'sigorta-hukuku', title: 'Sigorta Hukuku', year: 4, semester: 'bahar', area: 'ticaret', keywords: ['sigorta hukuku', 'TTK sigorta', 'poliçe', 'riziko'], core: true },

  // Seçmeli şablonlar (genişletilebilir)
  { code: 'bilisim-hukuku', title: 'Bilişim Hukuku', year: 4, semester: 'guz', area: 'secmeli', keywords: ['bilişim hukuku', 'KVKK', 'siber'], core: false },
  { code: 'cevre-hukuku', title: 'Çevre Hukuku', year: 4, semester: 'bahar', area: 'secmeli', keywords: ['çevre hukuku'], core: false },
  { code: 'spor-hukuku', title: 'Spor Hukuku', year: 4, semester: 'bahar', area: 'secmeli', keywords: ['spor hukuku'], core: false },
  { code: 'saglik-hukuku', title: 'Sağlık / Tıp Hukuku', year: 4, semester: 'guz', area: 'secmeli', keywords: ['tıp hukuku', 'malpraktis'], core: false },
  { code: 'enerji-hukuku', title: 'Enerji Hukuku', year: 4, semester: 'bahar', area: 'secmeli', keywords: ['enerji hukuku'], core: false },
  { code: 'sermaye-piyasasi', title: 'Sermaye Piyasası Hukuku', year: 4, semester: 'guz', area: 'secmeli', keywords: ['sermaye piyasası', 'SPK'], core: false },
  { code: 'rekabet-hukuku', title: 'Rekabet Hukuku', year: 4, semester: 'bahar', area: 'secmeli', keywords: ['rekabet hukuku'], core: false },
  { code: 'arabuluculuk', title: 'Arabuluculuk Hukuku', year: 4, semester: 'guz', area: 'secmeli', keywords: ['arabuluculuk', 'dava şartı'], core: false },
];

export function getCoreCourses(): CurriculumCourse[] {
  return CURRICULUM.filter((c) => c.core);
}

export function getCourseByCode(code: string): CurriculumCourse | undefined {
  return CURRICULUM.find((c) => c.code === code);
}
