/**
 * Temsilci ders notunun kalite ölçütleri (Aylık plan G19, `docs/ders-notlari/KALITE-VE-ARASTIRMA.md` §4).
 *
 * Yedi ölçüt: paragraf anlatım, en az üç gerçek örnek olay, sınav iskeleti, tuzak defteri, doğrulanmış kaynak, şema, kısa test.
 * Hukuki önerme taşıyan her kalem bir `dayanak` ({ kanun, madde, ifade }) taşır; ifade depodaki kanun metninde aynen geçmelidir
 * (`mevzuat-metni.mjs`). Ölçüt metnin doğruluğunu değil, doğrulanabilirliğini ve biçimini sınar; içerik elle okunur.
 */
import { dersSemalari } from './semalar.mjs';
import { maddeMetni as yerelMaddeMetni, kucuk } from './mevzuat-metni.mjs';

export const OLCUTLER = ['paragraf', 'ornekOlay', 'sinavIskeleti', 'tuzakDefteri', 'kaynak', 'sema', 'kisaTest'];

/** Öğretim dışı bölümler (DersNotuView'daki çalışma tekniği deseni ve kapanış bölümleri). */
const META_BOLUM =
  /nasıl oku|nasıl birleşir|haftalık|mini plan|tempo|sınav tekniği|sınav kâğıdı|sınav iskeleti|bu notu bitirince|okumalısın/i;
/** Kanun alıntısında ham başlık artığı: `**…**` kalın işaret ya da `--- MADDE` ayracı. */
const HAM_ARTIK = /\*\*|---\s*MADDE/;
/** İki örnek olayın kalıptan çıktığını gösteren ortak sözcük dizisi uzunluğu. */
const KALIP_ESIGI = 8;

const sozcukler = (s) => kucuk(s).replace(/[^\p{L}\p{N}\s]/gu, ' ').split(' ').filter(Boolean);

/** İki metindeki en uzun ortak ardışık sözcük dizisinin uzunluğu. */
export function ortakDizi(a, b) {
  const x = sozcukler(a);
  const y = sozcukler(b);
  let enUzun = 0;
  let onceki = new Array(y.length + 1).fill(0);
  for (let i = 1; i <= x.length; i++) {
    const simdi = new Array(y.length + 1).fill(0);
    for (let j = 1; j <= y.length; j++) {
      if (x[i - 1] === y[j - 1]) {
        simdi[j] = onceki[j - 1] + 1;
        if (simdi[j] > enUzun) enUzun = simdi[j];
      }
    }
    onceki = simdi;
  }
  return enUzun;
}

const sonuc = (gecti, deger, ayrinti) => ({ gecti, deger, ayrinti });

/**
 * @param {object} note Katman uygulanmış ders notu
 * @param {{ maddeMetni?: (kanun: string, madde: string) => string | null }} [secenek]
 */
export function kanonikKalite(note, { maddeMetni = yerelMaddeMetni } = {}) {
  const dayanakGecerli = (d) => {
    if (!d || !d.kanun || !d.madde || !d.ifade) return false;
    const metin = maddeMetni(d.kanun, String(d.madde));
    return Boolean(metin) && metin.includes(kucuk(d.ifade));
  };

  /** @type {Record<string, {gecti: boolean, deger: number, ayrinti: string}>} */
  const k = {};

  const ogretim = (note.sections || []).filter((s) => !META_BOLUM.test(s.heading));
  const artik = ogretim.flatMap((s) => s.paragraphs || []).filter((p) => HAM_ARTIK.test(p)).length;
  const tekParagraf = ogretim.filter((s) => (s.paragraphs || []).length < 2).map((s) => s.heading);
  k.paragraf = sonuc(
    ogretim.length > 0 && artik === 0 && tekParagraf.length === 0,
    artik,
    `${ogretim.length} öğretim bölümü, ham başlık artığı ${artik}, tek paragraflı bölüm ${tekParagraf.length}`,
  );

  const ornekler = note.examples || [];
  let kalip = 0;
  for (let i = 0; i < ornekler.length; i++) {
    for (let j = i + 1; j < ornekler.length; j++) {
      kalip = Math.max(kalip, ortakDizi(ornekler[i].facts, ornekler[j].facts));
    }
  }
  const dayanaksizOrnek = ornekler.filter((e) => !(e.dayanaklar || []).some(dayanakGecerli)).length;
  k.ornekOlay = sonuc(
    ornekler.length >= 3 && kalip < KALIP_ESIGI && dayanaksizOrnek === 0,
    ornekler.length,
    `${ornekler.length} olay, en uzun ortak dizi ${kalip} sözcük, dayanaksız ${dayanaksizOrnek}`,
  );

  const iskelet = note.sinavIskeleti || [];
  k.sinavIskeleti = sonuc(iskelet.length >= 4, iskelet.length, `${iskelet.length} adım`);

  const tuzaklar = note.tuzakDefteri || [];
  const dayanaksizTuzak = tuzaklar.filter((t) => !t.dayanak).length;
  k.tuzakDefteri = sonuc(
    tuzaklar.length >= 5 && dayanaksizTuzak === 0,
    tuzaklar.length,
    `${tuzaklar.length} kalem, dayanaksız ${dayanaksizTuzak}`,
  );

  const sorular = note.kisaTest || [];
  const tumDayanaklar = [
    ...ornekler.flatMap((e) => e.dayanaklar || []),
    ...tuzaklar.map((t) => t.dayanak).filter(Boolean),
    ...sorular.map((q) => q.dayanak).filter(Boolean),
  ];
  const gecersiz = tumDayanaklar.filter((d) => !dayanakGecerli(d));
  const adresli = (note.sources || []).filter((s) => /^https:\/\//.test(s.url || '')).length;
  k.kaynak = sonuc(
    adresli >= 1 && tumDayanaklar.length > 0 && gecersiz.length === 0,
    tumDayanaklar.length - gecersiz.length,
    `${adresli} adresli kaynak, ${tumDayanaklar.length} dayanak, doğrulanamayan ${gecersiz.length}` +
      (gecersiz.length ? `: ${gecersiz.map((d) => `${d.kanun} m.${d.madde}`).join(', ')}` : ''),
  );

  const semalar = dersSemalari(note.courseCode || '');
  k.sema = sonuc(semalar.length >= 1, semalar.length, semalar.map((s) => s.id).join(', ') || 'şema yok');

  const bozukSoru = sorular.filter(
    (q) =>
      !Array.isArray(q.choices) ||
      q.choices.length !== 4 ||
      new Set(q.choices.map(kucuk)).size !== 4 ||
      !Number.isInteger(q.answer) ||
      q.answer < 0 ||
      q.answer > 3 ||
      !q.reason ||
      !q.dayanak,
  ).length;
  k.kisaTest = sonuc(sorular.length >= 5 && bozukSoru === 0, sorular.length, `${sorular.length} soru, bozuk ${bozukSoru}`);

  k.gecen = OLCUTLER.filter((o) => k[o].gecti).length;
  return k;
}
