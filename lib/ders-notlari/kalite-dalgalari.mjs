/**
 * Ders notu kalite dalgaları: kanonik katman yazılan temsilci notlar (`gorevler/G19.md`, `gorevler/G23.md`).
 * Ölçüm: `node scripts/ders-kanonik-olc.mjs --dalga=2`.
 */
export const DALGALAR = {
  // G19: anayasa notu yok; ticari işletme ve şirketler iki ayrı ders.
  1: [
    'borclar-genel',
    'medeni-usul',
    'ceza-genel',
    'icra-iflas',
    'miras-hukuku',
    'esya-hukuku',
    'is-hukuku',
    'ticari-isletme',
    'ticaret-sirketler',
    'idare-hukuku',
  ],
  // G23: yerel kanun dosyasıyla bütünüyle dayanaklanabilen on ders.
  2: [
    'aile-hukuku',
    'borclar-ozel',
    'medeni-baslangic',
    'kiymetli-evrak',
    'sigorta-hukuku',
    'ceza-ozel',
    'ceza-muhakemesi',
    'tuketici-hukuku',
    'arabuluculuk',
    'vergi-hukuku',
  ],
};
