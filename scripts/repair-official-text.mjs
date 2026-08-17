#!/usr/bin/env node
/**
 * Resmî madde metnini mevzuat.gov.tr kaynağından yeniden yazma önerisi üretir.
 *
 * İki kusuru birden onarır:
 *  · Özetlenmiş metin — `official` alanında kanun metni yerine kanun metni
 *    HAKKINDA cümle bulunan maddeler (`audit-official-text.mjs` bulur).
 *  · Kirlenmiş metin — madde metnine yapışmış bölüm başlıkları, dipnot
 *    gövdeleri ve OCR kelime bölünmeleri (`--tumu` ile).
 *
 * Ayrıntılı gerekçe, tasarım kararları ve yol boyunca yakalanan tuzaklar:
 * `docs/RESMI-METIN-ONARIMI.md`.
 *
 * ── Neden iki adım ──────────────────────────────────────────────────────
 * Bu depo resmî metni değiştiren hiçbir işlemi tek komutla yapmaz. Betik
 * varsayılan olarak SADECE öneri üretir; `--apply` verilmedikçe hiçbir
 * dosyaya dokunmaz. Öneriler `data/official-repair/<kanunId>.md` altına
 * yazılır ve gözle karşılaştırılır.
 *
 * ── Kaynak metin nasıl elde edilir ──────────────────────────────────────
 *   curl -sk -o 6331.pdf https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6331.pdf
 *   node <pdf→txt aracı> 6331.pdf 6331.txt
 * PDF'ten düz metne çevirme bu depoya bağımlılık eklememek için dışarıda
 * bırakılmıştır; her araç olur, yeter ki satır sırası ve sayfa sınırları
 * korunsun — sayfa sınırı dipnotun nerede bittiğini söyleyen işarettir.
 *
 * ── Kullanım ────────────────────────────────────────────────────────────
 *   # yalnız özetlenmiş maddeler
 *   node scripts/repair-official-text.mjs --kanun=isg --kaynak=6331.txt
 *
 *   # kanunun bütün maddeleri, kaynak künyesi doğrulanarak
 *   node scripts/repair-official-text.mjs --kanun=tmk --kaynak=4721.txt \
 *        --kanunNo=4721 --tumu
 *
 *   # uygula, sonra MUTLAKA doğrula
 *   … --tumu --apply
 *   node scripts/compare-official-text.mjs --kanun=tmk --kaynak=4721.txt
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isSummarized } from './lib/summary-markers.mjs';
import {
  MADDE_BASI,
  SAYFA_SINIRI,
  baslikGorunumlu,
  dipnotAyikla,
  kunyeAyikla,
  satirlaraBol,
  supheliSatir,
} from './lib/official-text.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const arg = (name) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
};
const has = (name) => process.argv.includes(`--${name}`);

const kanunId = arg('kanun');
const kaynakYolu = arg('kaynak');
const tekMadde = arg('madde');
const uygula = has('apply');
/**
 * `--tumu`: yalnız özetlenmiş maddeleri değil, kanunun BÜTÜN maddelerini
 * kaynaktan yeniden yazar. Mevcut külliyatta madde metinlerine bölüm
 * başlıkları ve dipnot gövdeleri yapışmış durumda; bunları ayıklamanın
 * tek güvenilir yolu metni kaynaktan yeniden almaktır.
 *
 * Doğrulaması var: uyguladıktan sonra
 *   node scripts/compare-official-text.mjs --kanun=<id> --kaynak=<txt>
 * neredeyse tamamı "birebir aynı" demeli. Demiyorsa uygulama hatalıdır.
 */
const tumu = has('tumu');

if (!kanunId || !kaynakYolu) {
  console.error('kullanım: node scripts/repair-official-text.mjs --kanun=isg --kaynak=6331.txt [--madde=14] [--apply]');
  process.exit(1);
}

const icerikDizini = join(root, 'content', 'mevzuat', kanunId);
if (!existsSync(icerikDizini)) {
  console.error(`bulunamadı: ${icerikDizini}`);
  process.exit(1);
}

/* ── 1. Kaynak metni maddelere böl ──────────────────────────────────── */

/**
 * Sayfa başlıklarını, sayfa numaralarını ve dipnot gövdelerini eler.
 *
 * Dipnotlar resmî PDF'te sayfa altında durur ve düz metne çevrildiğinde
 * madde metninin ortasına düşebilir. Bunları ayıklamak yerine İŞARETLERİZ;
 * kararı insan verir. Sessizce silmek, metni bozmanın bir başka yoludur.
 */
/**
 * Tek harf onarımı: alfabetik bent dizisinde `l)` yerine `1)` okunması.
 *
 * Resmî PDF'in yazı tipinde tek başına duran küçük «l» harfi düz metne
 * rakam «1» olarak düşüyor. Sözcük içindeki l'ler doğru çıkıyor; sorun
 * yalnız bent işaretinde.
 *
 * Bu, metne dokunma yasağının BİLİNÇLİ ve DAR bir istisnasıdır. Ancak
 * satırın kendisi ispat ediyorsa uygulanır: bir önceki bent `k)`, bir
 * sonraki bent `m)` olmak zorundadır. Türk alfabesinde k ile m arasında
 * rakam bulunamaz; dolayısıyla düzeltme çıkarım değil, tespittir.
 *
 * Her düzeltme rapora yazılır.
 */
function bentHarfiOnar(satirlar) {
  const onarim = [];
  const bentBasi = (s) => (s.match(/^([a-zçğıöşü1])\)\s/) || [])[1];

  const cikti = satirlar.map((s, i) => {
    if (bentBasi(s) !== '1') return s;
    let onceki = '';
    for (let j = i - 1; j >= 0; j--) {
      const b = bentBasi(satirlar[j]);
      if (b) {
        onceki = b;
        break;
      }
    }
    let sonraki = '';
    for (let j = i + 1; j < satirlar.length; j++) {
      const b = bentBasi(satirlar[j]);
      if (b) {
        sonraki = b;
        break;
      }
    }
    if (onceki !== 'k' || sonraki !== 'm') return s;
    const yeni = s.replace(/^1\)/, 'l)');
    onarim.push(`${s.slice(0, 60)}…  →  ${yeni.slice(0, 60)}…`);
    return yeni;
  });

  return { cikti, onarim };
}

const kaynak = readFileSync(kaynakYolu, 'utf8');

const satirlar = satirlaraBol(kaynak);

/*
 * Yanlış kanunun metnini yazmak, en sessiz ve en ağır hata olurdu: madde
 * numaraları tuttuğu için hiçbir uyarı çıkmaz, yalnız içerik başka kanuna
 * ait olur. `--kanunNo` verildiğinde kaynağın künyesi doğrulanır.
 */
const beklenenKanunNo = arg('kanunNo');
if (beklenenKanunNo) {
  const kunye = satirlar.slice(0, 40).join('\n');
  const bulunan = (kunye.match(/Kanun\s+Numarası\s*:?\s*(\d+)/i) || [])[1];
  if (bulunan !== beklenenKanunNo) {
    console.error(
      `[onarım] KAYNAK UYUŞMUYOR: beklenen kanun no ${beklenenKanunNo}, kaynakta ${bulunan ?? 'bulunamadı'}`,
    );
    process.exit(1);
  }
}

const bloklar = [];
/** İlk maddeden önceki satırlar: kanun künyesi, bölüm ve kenar başlıkları. */
const onsoz = [];
let simdiki = null;
for (const satir of satirlar) {
  const m = satir.match(MADDE_BASI);
  if (m) {
    if (simdiki) bloklar.push(simdiki);
    simdiki = {
      tur: m[1].replace(/\s+/g, ' ').toLocaleUpperCase('tr'),
      // İİK harf ekini küçük yazar (`Madde 8/a`), İSG büyük (`MADDE 24/A`).
      // Dosya adları büyük harfli; anahtar tek biçime çekilir.
      anahtar: `${m[2]}${(m[3] || '').toLocaleUpperCase('tr')}`,
      baslik: '',
      satirlar: [satir],
    };
    continue;
  }
  if (simdiki) simdiki.satirlar.push(satir);
  else onsoz.push(satir);
}
if (simdiki) bloklar.push(simdiki);

/**
 * Bir maddenin gövdesinin SONUNDA duran başlık satırları aslında bir
 * SONRAKİ maddeye aittir; resmî metinde kenar başlığı maddenin üstünde
 * yazılır. Bunları taşımazsak külliyatta "…saklıdır. ÜÇÜNCÜ BÖLÜM
 * VAKIFLAR" gibi metne yapışmış başlıklar kalır — mevcut külliyatın
 * hâli tam olarak budur.
 */
for (let i = 0; i < bloklar.length; i++) {
  const govde = bloklar[i].satirlar;
  const tasinan = [];
  // Sayfa numarası başlık satırlarının ARASINA düşebilir; atlanır ama
  // döngüyü durdurmaz — durdurursa başlığın üst satırları maddede kalır.
  while (govde.length > 1) {
    const son = govde[govde.length - 1];
    if (/^\d{1,4}$/.test(son) || son === SAYFA_SINIRI) {
      govde.pop();
      continue;
    }
    if (!baslikGorunumlu(son)) break;
    tasinan.unshift(govde.pop());
  }
  if (bloklar[i + 1]) bloklar[i + 1].baslik = kunyeAyikla(tasinan).join('\n');
}

// İlk maddenin başlığı önceki maddeden gelemez; önsözün sonundan alınır.
if (bloklar[0]) {
  const ilkBaslik = [];
  for (let i = onsoz.length - 1; i >= 0 && baslikGorunumlu(onsoz[i]); i--) {
    ilkBaslik.unshift(onsoz[i]);
  }
  // Künyeden sonra kalan başlık satırlarının yalnız SONU alınır; kanunun
  // bütün kısım/bölüm/ayırım başlıklarını ilk maddeye yığmanın anlamı yok.
  bloklar[0].baslik = kunyeAyikla(ilkBaslik).slice(-4).join('\n');
}

const kaynakMaddeleri = new Map();
for (const b of bloklar) {
  if (b.tur !== 'MADDE') continue;
  const govde = [...b.satirlar];
  const sonrakiBaslik = '';
  if (kaynakMaddeleri.has(b.anahtar)) {
    console.warn(`  ! kaynakta MADDE ${b.anahtar} birden fazla kez geçiyor; ilki korundu`);
    continue;
  }
  const { kalan, atilan, cozulemeyen } = dipnotAyikla(govde);
  const { cikti, onarim } = bentHarfiOnar(kalan);
  kaynakMaddeleri.set(b.anahtar, {
    baslik: b.baslik,
    metin: cikti.join('\n'),
    sonrakiBaslik,
    atilan,
    harfOnarimi: onarim,
    // Ayıklamadan sonra hâlâ şüpheli satır varsa madde otomatik onarılmaz.
    supheli: [...cozulemeyen, ...cikti.filter(supheliSatir)],
  });
}

/* ── 2. Onarılacak maddeleri bul ────────────────────────────────────── */

/**
 * Resmî metin bloğu, yorum başlığına kadar sürer. Başlıktan hemen önce
 * bazı dosyalarda `---` ayracı var, bazılarında yok — 1.030 TMK dosyasının
 * 84'ünde yok. Sabit bir ayraç metni aramak bu dosyaları sessizce atlar.
 */
const YORUM_BASLIGI = '### Akademik Yorum ve Analiz';

function resmiMetinSonu(ham, baslangic) {
  const yorumBasi = ham.indexOf(YORUM_BASLIGI, baslangic);
  if (yorumBasi === -1) return null;

  // Başlığın üstündeki boş satırlar ve `---` ayracı resmî metnin parçası
  // değildir; gösterilirken de yeniden yazılırken de dışarıda kalmalı.
  let metinSonu = yorumBasi;
  for (;;) {
    const oncekiSatirBasi = ham.lastIndexOf('\n', metinSonu - 2) + 1;
    const oncekiSatir = ham.slice(oncekiSatirBasi, metinSonu - 1).trim();
    if (oncekiSatir !== '' && oncekiSatir !== '---') break;
    metinSonu = oncekiSatirBasi;
    if (metinSonu === 0) break;
  }

  // İKİ ayrı indis döner ve karıştırılmamalıdır: `metinSonu` eski metnin
  // nerede bittiğini, `yorumBasi` yeni metnin arkasına neyin ekleneceğini
  // söyler. Tek indis kullanıldığında ayraç hem silinip hem korunuyor ve
  // dosyada çift `---` kalıyordu.
  return { metinSonu, yorumBasi };
}

const dosyalar = readdirSync(icerikDizini).filter((f) => f.endsWith('.md'));
const raporlar = [];

const elle = [];

for (const dosya of dosyalar) {
  // `madde-24A.md` → kaynakta `MADDE 24/A`. Harf eki anahtarın parçasıdır.
  const m = dosya.match(/^madde-(\d+)([A-Za-z]?)\.md$/);
  if (!m) {
    elle.push(dosya);
    continue;
  }
  const anahtar = `${m[1]}${m[2].toLocaleUpperCase('tr')}`;
  if (tekMadde && anahtar !== tekMadde) continue;

  const yol = join(icerikDizini, dosya);
  // Depodaki dosyalar CRLF; ayraç aramasını bozmasın diye tek biçime çekilir.
  const ham = readFileSync(yol, 'utf8').replace(/\r\n/g, '\n');

  const fmSon = ham.indexOf('\n---\n', 4);
  if (!ham.startsWith('---') || fmSon === -1) continue;
  const govdeBasi = fmSon + 5;

  const sinir = resmiMetinSonu(ham, govdeBasi);
  if (!sinir) continue;

  const mevcutResmi = ham.slice(govdeBasi, sinir.metinSonu);
  if (!tumu && !isSummarized(mevcutResmi)) continue;

  const kaynakMadde = kaynakMaddeleri.get(anahtar);
  if (!kaynakMadde) {
    raporlar.push({ anahtar, dosya, durum: 'KAYNAKTA YOK', mevcutResmi, oneri: null });
    continue;
  }

  // Kaynaktaki blok gerçekten bu maddeyle mi başlıyor? Harf eki karışması
  // hâlinde metin başka maddeye ait olur; sessizce yazmaktansa uyarırız.
  const ilkSatir = kaynakMadde.metin.split('\n')[0];
  const harfKalibi = m[2] ? `\\/\\s*[${m[2].toLocaleUpperCase('tr')}${m[2].toLocaleLowerCase('tr')}]` : '';
  const beklenen = new RegExp(`^(?:MADDE|Madde)\\s+${m[1]}\\s*${harfKalibi}\\s*(?:[–—-]|[A-ZÇĞİÖŞÜ(])`);
  const uyumsuz = !beklenen.test(ilkSatir);

  const basA = kaynakMadde.baslik ? `\n**${kaynakMadde.baslik}**\n\n---\n` : '';
  const oneri = `${basA}\n${kaynakMadde.metin}\n\n---\n\n`;
  raporlar.push({
    anahtar,
    dosya,
    uyumsuz,
    yol,
    durum: kaynakMadde.supheli.length ? 'ŞÜPHELİ SATIR VAR' : 'HAZIR',
    mevcutResmi,
    oneri,
    supheli: kaynakMadde.supheli,
    atilan: kaynakMadde.atilan,
    harfOnarimi: kaynakMadde.harfOnarimi,
    tamKapsam: { govdeBasi, yorumBasi: sinir.yorumBasi },
    ham,
  });
}

raporlar.sort(
  (a, b) => parseInt(a.anahtar, 10) - parseInt(b.anahtar, 10) || a.anahtar.localeCompare(b.anahtar, 'tr'),
);

/* ── 3. Rapor ───────────────────────────────────────────────────────── */

const raporDizini = join(root, 'data', 'official-repair');
mkdirSync(raporDizini, { recursive: true });

const rapor = [
  `# Resmî metin onarım önerisi — ${kanunId}`,
  '',
  `Kaynak: \`${kaynakYolu}\``,
  `Onarılacak madde: ${raporarSayisi(raporlar)}`,
  '',
  'Bu dosya ÖNERİDİR. Her madde gözle karşılaştırılmadan `--apply` verilmez.',
  '',
  ...(elle.length
    ? ['## Elle onarılacaklar', '', 'Harf ekli maddeler otomatik eşleştirilmez:', '', ...elle.map((f) => `- ${f}`), '']
    : []),
];

function raporarSayisi(r) {
  return `${r.length} (hazır ${r.filter((x) => x.durum === 'HAZIR').length}, şüpheli ${r.filter((x) => x.durum === 'ŞÜPHELİ SATIR VAR').length}, uyumsuz ${r.filter((x) => x.uyumsuz).length}, kaynakta yok ${r.filter((x) => x.durum === 'KAYNAKTA YOK').length})`;
}

// `--tumu` modunda her maddenin iki metnini birden yazmak raporu okunmaz
// kılar. Sorunlular tam yazılır, sorunsuzlardan yalnız bir örneklem.
const ornek = new Set(raporlar.filter((r) => r.durum === 'HAZIR' && !r.uyumsuz).slice(0, 8).map((r) => r.anahtar));
const tamYaz = (r) => !tumu || r.durum !== 'HAZIR' || r.uyumsuz || ornek.has(r.anahtar);

if (tumu) {
  rapor.push(
    `> \`--tumu\` modu: ${raporlar.length} madde. Sorunsuz olanlardan yalnız ${ornek.size} tanesinin`,
    '> metni aşağıda gösterilir; sorunlu olanların tamamı gösterilir.',
    '',
  );
}

for (const r of raporlar) {
  rapor.push(`## madde-${r.anahtar} — ${r.durum}${r.uyumsuz ? ' · MADDE NUMARASI UYUŞMUYOR' : ''}`, '');
  if (!tamYaz(r)) {
    rapor.push('');
    continue;
  }
  if (r.uyumsuz) {
    rapor.push('Kaynaktan alınan blok bu madde numarasıyla başlamıyor. Uygulanmaz.', '');
  }
  if (r.supheli?.length) {
    rapor.push('Çözülemeyen şüpheli satırlar — bu madde uygulanmaz:', '');
    for (const s of r.supheli) rapor.push(`> ${s}`);
    rapor.push('');
  }
  if (r.atilan?.length) {
    rapor.push('Dipnot/sayfa numarası olarak atılan satırlar:', '');
    for (const s of r.atilan) rapor.push(`> ~~${s}~~`);
    rapor.push('');
  }
  if (r.harfOnarimi?.length) {
    rapor.push('Bent harfi onarımı — `1)` → `l)` (k ile m arasında):', '');
    for (const s of r.harfOnarimi) rapor.push(`> ${s}`);
    rapor.push('');
  }
  rapor.push(tumu ? '### Mevcut' : '### Mevcut (özet)', '', '```', r.mevcutResmi.trim(), '```', '');
  if (r.oneri) rapor.push('### Öneri (kaynaktan)', '', '```', r.oneri.trim(), '```', '');
  rapor.push('');
}

const raporYolu = join(raporDizini, `${kanunId}.md`);
writeFileSync(raporYolu, rapor.join('\n'), 'utf8');

console.log(`[onarım] ${kanunId}: ${raporarSayisi(raporlar)}`);
console.log(`[onarım] rapor → ${raporYolu}`);

if (!uygula) {
  console.log('[onarım] --apply verilmedi; hiçbir dosya değiştirilmedi.');
  process.exit(0);
}

/* ── 4. Uygula ──────────────────────────────────────────────────────── */

let yazilan = 0;
for (const r of raporlar) {
  if (!r.oneri || r.durum !== 'HAZIR' || r.uyumsuz) continue;
  const yeni = r.ham.slice(0, r.tamKapsam.govdeBasi) + r.oneri + r.ham.slice(r.tamKapsam.yorumBasi);
  // Yeni değerin NE OLDUĞUNA bakılır; eskisinden farklı olmasına değil.
  // Bu depoda null bir değer "farklı" sayılıp üç dosyayı silmişti.
  if (typeof yeni !== 'string' || yeni.length < 500 || !yeni.includes('### Akademik Yorum ve Analiz')) {
    console.error(`[onarım] madde-${r.anahtar}: üretilen içerik geçersiz, atlandı`);
    continue;
  }
  writeFileSync(r.yol, yeni, 'utf8');
  yazilan++;
}
console.log(`[onarım] ${yazilan} dosya güncellendi. Paketleri yeniden üretin.`);
