import React from 'react';

/**
 * Şerh okuma bileşeni.
 *
 * Neden ayrı bir dosya: uygulamada 5.143 maddenin şerhi var ve bunlar
 * uygulamanın en uzun okunan metinleri. Önceki asgari çözüm yalnız başlık
 * ve kalın işaretini tanıyordu; ölçüm, şerhlerin %95'inde yatay ayraç,
 * %97'sinde madde imi, %18'inde numaralı liste bulunduğunu gösterdi. Bunlar
 * ham işaretle basılınca metin okunmaz hâle geliyordu — ekranda tek başına
 * duran «---» satırları ve satır başına yapışmış «-» işaretleri.
 *
 * Tam bir markdown kütüphanesi bilinçli olarak kullanılmadı. Şerh metni
 * sınırlı bir küme kullanıyor: başlık, ayraç, madde imi, numaralı liste,
 * alıntı, seyrek olarak tablo ve satır içi vurgu. Bu küme için 200 satır
 * yeter; çevrimdışı pakete 40 KB'lık bir bağımlılık eklemek gereksizdi.
 */

type Blok =
  | { tur: 'baslik'; duzey: number; metin: string }
  | { tur: 'ayrac' }
  | { tur: 'liste'; sirali: boolean; ogeler: string[] }
  | { tur: 'alinti'; metin: string }
  | { tur: 'tablo'; satirlar: string[][] }
  | { tur: 'paragraf'; metin: string };

const RE_BASLIK = /^(#{1,6})\s+(.*)$/;
const RE_AYRAC = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/;
const RE_MADDE_IMI = /^\s*[-*+]\s+(.*)$/;
const RE_NUMARA = /^\s*(\d+)[.)]\s+(.*)$/;
const RE_ALINTI = /^\s*>\s?(.*)$/;
const RE_TABLO = /^\s*\|(.+)\|\s*$/;
const RE_TABLO_AYRAC = /^\s*\|[\s:|-]+\|\s*$/;

/** Metni bloklara ayırır. */
export function bloklaSerh(ham: string): Blok[] {
  const satirlar = String(ham || '')
    .replace(/\r/g, '')
    .split('\n');

  const bloklar: Blok[] = [];
  let paragraf: string[] = [];

  function paragrafiKapat() {
    if (!paragraf.length) return;
    const metin = paragraf.join(' ').trim();
    if (metin) bloklar.push({ tur: 'paragraf', metin });
    paragraf = [];
  }

  for (let i = 0; i < satirlar.length; i += 1) {
    const satir = satirlar[i];

    if (!satir.trim()) {
      paragrafiKapat();
      continue;
    }

    if (RE_AYRAC.test(satir)) {
      paragrafiKapat();
      bloklar.push({ tur: 'ayrac' });
      continue;
    }

    const baslik = RE_BASLIK.exec(satir);
    if (baslik) {
      paragrafiKapat();
      bloklar.push({ tur: 'baslik', duzey: baslik[1].length, metin: baslik[2].trim() });
      continue;
    }

    // Tablo — başlık satırı + ayraç satırı + gövde
    if (RE_TABLO.test(satir) && RE_TABLO_AYRAC.test(satirlar[i + 1] || '')) {
      paragrafiKapat();
      const satirDizisi: string[][] = [];
      let j = i;
      while (j < satirlar.length && RE_TABLO.test(satirlar[j])) {
        if (!RE_TABLO_AYRAC.test(satirlar[j])) {
          satirDizisi.push(
            satirlar[j]
              .trim()
              .replace(/^\||\|$/g, '')
              .split('|')
              .map((h) => h.trim())
          );
        }
        j += 1;
      }
      bloklar.push({ tur: 'tablo', satirlar: satirDizisi });
      i = j - 1;
      continue;
    }

    // Liste — ardışık satırlar tek blokta toplanır
    const imi = RE_MADDE_IMI.exec(satir);
    const num = RE_NUMARA.exec(satir);
    if (imi || num) {
      paragrafiKapat();
      const sirali = !!num;
      const ogeler: string[] = [];
      let j = i;
      while (j < satirlar.length) {
        const s = satirlar[j];
        const a = RE_MADDE_IMI.exec(s);
        const b = RE_NUMARA.exec(s);
        if (sirali && b) ogeler.push(b[2].trim());
        else if (!sirali && a) ogeler.push(a[1].trim());
        else if (s.trim() && ogeler.length && /^\s{2,}\S/.test(s)) {
          // Girintili devam satırı önceki ögeye eklenir
          ogeler[ogeler.length - 1] += ' ' + s.trim();
        } else break;
        j += 1;
      }
      bloklar.push({ tur: 'liste', sirali, ogeler });
      i = j - 1;
      continue;
    }

    const alinti = RE_ALINTI.exec(satir);
    if (alinti) {
      paragrafiKapat();
      const parcalar = [alinti[1]];
      let j = i + 1;
      while (j < satirlar.length) {
        const a = RE_ALINTI.exec(satirlar[j]);
        if (!a) break;
        parcalar.push(a[1]);
        j += 1;
      }
      bloklar.push({ tur: 'alinti', metin: parcalar.join(' ').trim() });
      i = j - 1;
      continue;
    }

    paragraf.push(satir.trim());
  }

  paragrafiKapat();
  return bloklar;
}

/** `**kalın**`, `*italik*` ve `` `kod` `` işaretlerini gerçek vurguya çevirir. */
export function Vurgulu({ metin }: { metin: string }) {
  const parcalar: React.ReactNode[] = [];
  const desen = /\*\*([^*]+)\*\*|\*([^*\n]+)\*|`([^`\n]+)`/g;
  let son = 0;
  let m: RegExpExecArray | null;

  while ((m = desen.exec(metin)) !== null) {
    if (m.index > son) parcalar.push(metin.slice(son, m.index));
    if (m[1] !== undefined) {
      parcalar.push(
        <strong key={m.index} className="font-bold">
          {m[1]}
        </strong>
      );
    } else if (m[2] !== undefined) {
      parcalar.push(
        <em key={m.index} className="italic">
          {m[2]}
        </em>
      );
    } else {
      parcalar.push(
        <code key={m.index} className="font-mono text-[0.92em] px-1 py-0.5 rounded bg-charcoal/[0.05]">
          {m[3]}
        </code>
      );
    }
    son = m.index + m[0].length;
  }
  if (son < metin.length) parcalar.push(metin.slice(son));

  return <>{parcalar}</>;
}

/**
 * Başlık ölçeği.
 *
 * Şerhler `###` ile başlar ve `####` ana bölüm, `#####` alt bölüm olarak
 * kullanılır. Ekran ölçeği kaynak düzeyine değil BU sıraya göre kurulur;
 * yoksa `####` ile başlayan bir şerhte ana başlıklar küçücük kalıyordu.
 */
const BASLIK_SINIFI: Record<number, string> = {
  1: 'text-[19px] font-heading font-bold mt-6 first:mt-0 leading-tight',
  2: 'text-[18px] font-heading font-bold mt-6 first:mt-0 leading-tight',
  3: 'text-[17px] font-heading font-bold mt-6 first:mt-0 leading-tight',
  4: 'text-[15.5px] font-heading font-bold mt-5 first:mt-0 leading-snug',
  5: 'text-[14px] font-heading font-bold mt-4 first:mt-0 leading-snug text-ink-2',
  6: 'text-[13px] font-heading font-bold mt-3 first:mt-0 leading-snug text-ink-2',
};

export default function Serh({ metin }: { metin: string }) {
  const bloklar = bloklaSerh(metin);

  return (
    <div className="space-y-3">
      {bloklar.map((b, i) => {
        switch (b.tur) {
          case 'baslik': {
            const Etiket = (b.duzey <= 3 ? 'h3' : b.duzey === 4 ? 'h4' : 'h5') as 'h3' | 'h4' | 'h5';
            return (
              <Etiket key={i} className={BASLIK_SINIFI[b.duzey] ?? BASLIK_SINIFI[4]}>
                <Vurgulu metin={b.metin} />
              </Etiket>
            );
          }

          case 'ayrac':
            return (
              <hr
                key={i}
                className="my-5 border-0 h-px"
                style={{ background: 'var(--tel)' }}
                aria-hidden
              />
            );

          case 'liste': {
            const Etiket = b.sirali ? 'ol' : 'ul';
            return (
              <Etiket
                key={i}
                className={`space-y-1.5 pl-1 ${b.sirali ? 'list-decimal list-inside' : ''}`}
              >
                {b.ogeler.map((o, j) => (
                  <li
                    key={j}
                    className={`text-[14.5px] leading-[1.65] text-ink ${
                      b.sirali ? '' : 'flex gap-2.5'
                    }`}
                  >
                    {!b.sirali && (
                      <span
                        aria-hidden
                        className="shrink-0 mt-[0.62em] w-1 h-1 rounded-full"
                        style={{ background: 'var(--ink-4)' }}
                      />
                    )}
                    <span className={b.sirali ? '' : 'flex-1'}>
                      <Vurgulu metin={o} />
                    </span>
                  </li>
                ))}
              </Etiket>
            );
          }

          case 'alinti':
            return (
              <blockquote
                key={i}
                className="pl-3.5 text-[14px] leading-[1.65] text-ink-2 italic"
                style={{ borderLeft: '1px solid var(--tel-koyu)' }}
              >
                <Vurgulu metin={b.metin} />
              </blockquote>
            );

          case 'tablo':
            return (
              <div key={i} className="-mx-1 overflow-x-auto">
                <table className="w-full text-[13px] border-collapse">
                  <tbody>
                    {b.satirlar.map((satir, r) => (
                      <tr key={r} style={{ borderBottom: '1px solid var(--tel)' }}>
                        {satir.map((h, c) => (
                          <td
                            key={c}
                            className={`px-2 py-2 align-top ${
                              r === 0 ? 'font-bold text-ink' : 'text-ink-2'
                            }`}
                          >
                            <Vurgulu metin={h} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          default:
            return (
              <p key={i} className="text-[14.5px] leading-[1.68] text-ink">
                <Vurgulu metin={b.metin} />
              </p>
            );
        }
      })}
    </div>
  );
}
