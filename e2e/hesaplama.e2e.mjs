/**
 * Hesaplama akışı (G22 adım 3). Beklenen değerler bileşenin kodundan bağımsız, elle hesaplanmıştır; dayanak sabitler
 * birincil kaynaktan doğrulanmıştır (künyeler `docs/aylik-plan/raporlar/g22-e2e.md`):
 * - Kıdem tavanı 2026/I 64.948,77 TL (HMB genelgesi 06.01.2026, Sıra No 1), 2026/II 73.729,87 TL (HMB genelgesi 03.07.2026,
 *   27998389-010.06.02-4870801, Sıra No 5, m.2). Damga vergisi ‰7,59.
 * - Asgari ücret günlük 1.101 TL, aylık 33.030 TL (Asgari Ücret Tespit Komisyonu Kararı 2025/1, RG 26.12.2025/33119).
 * - SGK prime esas kazanç üst sınırı alt sınırın 9 katı, 297.270 TL (7566 s.K. m.24, RG 19.12.2025/33112; 1.1.2026'dan).
 *   İşveren MYÖ hissesi %12 (7566 s.K. m.23), işveren toplamı %2,25 + %12 + %7,5 = %21,75; işsizlik işveren %2.
 * - Ücret gelirleri tarifesi 190.000 / 400.000 / 1.500.000 / 5.300.000 TL (GV Genel Tebliği Seri No 332 m.3/3, RG 31.12.2025/33124 5. Mük.).
 * - AAÜT 2025-2026 (RG 04.11.2025/33067): Üçüncü Kısım %16-%1 basamakları, asliye maktu 45.000 TL, sulh hukuk 30.000 TL,
 *   icra dairesi 9.000 TL; takip miktarı 56.250 TL'ye kadar icra takibinde ücret asıl alacağı geçemez (m.11/1).
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const TABAN = process.env.E2E_TABAN || 'http://localhost:3123';
let tarayici;

before(async () => {
  tarayici = await chromium.launch();
});
after(async () => {
  await tarayici?.close();
});

async function aracAc(id) {
  const sayfa = await tarayici.newPage();
  const yanit = await sayfa.goto(`${TABAN}/hesaplama/${id}`, { waitUntil: 'networkidle', timeout: 60_000 });
  assert.equal(yanit.status(), 200);
  // Hidrasyondan önce yazılan değeri React, bileşen durumuna geri çeker (yavaş makinede ilk alan varsayılanda kalır).
  // React olay dinleyicisini bağladığında DOM düğümüne `__reactProps…` anahtarını ekler; o ana kadar beklenir.
  await sayfa.waitForFunction(
    () => {
      const alan = document.querySelector('main input');
      return !!alan && Object.keys(alan).some((k) => k.startsWith('__reactProps'));
    },
    null,
    { timeout: 60_000 },
  );
  return sayfa;
}

/** Sonuç kartındaki satırın değeri: etiket ve değer kardeş `span`'lardır. */
async function satir(sayfa, etiket) {
  const deger = sayfa.getByText(etiket, { exact: true }).first().locator('xpath=following-sibling::span[1]');
  return (await deger.innerText({ timeout: 15_000 })).trim();
}

/**
 * Seçim kutusu `<label>` içindedir; Chromium erişilebilir ada seçili seçeneğin metnini de kattığından (ör. «Dava Tipi Nispi
 * (Konusu Para Olan Davalar)») `getByLabel(…, { exact: true })` eşleşmez. Ad, etiketle başlayan combobox olarak aranır.
 */
function secim(sayfa, etiket) {
  const kacisli = etiket.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  return sayfa.getByRole('combobox', { name: new RegExp(`^${kacisli}\\b`) });
}

async function alanDoldur(sayfa, etiket, deger) {
  const alan = sayfa.getByLabel(etiket, { exact: true });
  await alan.fill(deger);
}

test('kıdem: ayrılış 01.07.2026 ise 2026/II tavanı uygulanır (10 yıl, tavan üstü ücret)', async () => {
  const sayfa = await aracAc('kidem');
  try {
    // 03.07.2016 → 01.07.2026 = 3.650 gün = 10 yıl. Ücret 100.000 TL tavanı aşar.
    await alanDoldur(sayfa, 'İşe Giriş Tarihi', '2016-07-03');
    await alanDoldur(sayfa, 'İşten Ayrılış Tarihi', '2026-07-01');
    await alanDoldur(sayfa, 'Aylık Brüt Maaş (TL)', '100000');
    assert.equal(await satir(sayfa, 'Uygulanan tavan dönemi'), '2026/II');
    // 73.729,87 × 10 = 737.298,70; damga 737.298,70 × 0,00759 = 5.596,10; net 731.702,60
    assert.equal(await satir(sayfa, 'Brüt Kıdem Tazminatı'), '737.298,70 TL');
    assert.equal(await satir(sayfa, 'Net Kıdem Tazminatı'), '731.702,60 TL');
  } finally {
    await sayfa.close();
  }
});

test('kıdem: ayrılış 30.06.2026 ise 2026/I tavanı uygulanır', async () => {
  const sayfa = await aracAc('kidem');
  try {
    // 02.07.2016 → 30.06.2026 = 3.650 gün.
    await alanDoldur(sayfa, 'İşe Giriş Tarihi', '2016-07-02');
    await alanDoldur(sayfa, 'İşten Ayrılış Tarihi', '2026-06-30');
    await alanDoldur(sayfa, 'Aylık Brüt Maaş (TL)', '100000');
    assert.equal(await satir(sayfa, 'Uygulanan tavan dönemi'), '2026/I');
    // 64.948,77 × 10 = 649.487,70; damga 4.929,61; net 644.558,09
    assert.equal(await satir(sayfa, 'Brüt Kıdem Tazminatı'), '649.487,70 TL');
    assert.equal(await satir(sayfa, 'Net Kıdem Tazminatı'), '644.558,09 TL');
  } finally {
    await sayfa.close();
  }
});

test('net-brüt: 60.000 TL brüt, ocak ayı (tavan altı)', async () => {
  const sayfa = await aracAc('net-brut-maas');
  try {
    await alanDoldur(sayfa, 'Brüt Aylık Ücret (TL)', '60000');
    await alanDoldur(sayfa, 'Bordro Ayı (1–12)', '1');
    // SGK 8.400 + işsizlik 600 → matrah 51.000; GV 7.650 − asgari ücret istisnası 4.211,325 = 3.438,675;
    // damga (60.000 − 33.030) × 0,00759 = 204,7023; net 60.000 − 8.400 − 600 − 3.438,675 − 204,7023 = 47.356,62
    assert.equal(await satir(sayfa, 'SGK İşçi Primi (%14)'), '−8.400,00 TL');
    assert.equal(await satir(sayfa, 'NET ELE GEÇEN'), '47.356,62 TL');
    // İşveren: 60.000 + 60.000 × %21,75 (13.050) + 60.000 × %2 (1.200) = 74.250
    assert.equal(await satir(sayfa, 'İşverene Toplam Maliyeti (indirim hariç)'), '74.250,00 TL');
  } finally {
    await sayfa.close();
  }
});

test('net-brüt: 400.000 TL brütte SGK primi 297.270 TL tavandan kesilir', async () => {
  const sayfa = await aracAc('net-brut-maas');
  try {
    await alanDoldur(sayfa, 'Brüt Aylık Ücret (TL)', '400000');
    await alanDoldur(sayfa, 'Bordro Ayı (1–12)', '1');
    // SGK 297.270 × %14 = 41.617,80; işsizlik 2.972,70; matrah 355.409,50;
    // GV 28.500 + 165.409,50 × %20 = 61.581,90 − 4.211,325 = 57.370,575; damga (400.000 − 33.030) × 0,00759 = 2.785,3023;
    // net 400.000 − 41.617,80 − 2.972,70 − 57.370,575 − 2.785,3023 = 295.253,62
    assert.equal(await satir(sayfa, 'SGK İşçi Primi (%14)'), '−41.617,80 TL');
    assert.equal(await satir(sayfa, 'İşsizlik Primi (%1)'), '−2.972,70 TL');
    assert.equal(await satir(sayfa, 'NET ELE GEÇEN'), '295.253,62 TL');
  } finally {
    await sayfa.close();
  }
});

test('vekalet: 2.000.000 TL asliye davasında basamaklı nispi ücret ve kısmi kabul', async () => {
  const sayfa = await aracAc('vekalet');
  try {
    await alanDoldur(sayfa, 'Dava Değeri / Müddeabih (TL)', '2000000');
    // 600.000 × %16 + 600.000 × %15 + 800.000 × %14 = 96.000 + 90.000 + 112.000 = 298.000
    assert.equal(await satir(sayfa, 'Tam Kabulde Vekalet Ücreti'), '298.000,00 TL');
    await alanDoldur(sayfa, 'Davanın Kabul Oranı (%)', '50');
    // Kabul 1.000.000: 96.000 + 400.000 × %15 = 156.000; ret de 1.000.000 → 156.000
    assert.equal(await satir(sayfa, 'Kabul Edilen Kısım (davacı lehine)'), '156.000,00 TL');
    assert.equal(await satir(sayfa, 'Reddedilen Kısım (davalı lehine)'), '156.000,00 TL');
  } finally {
    await sayfa.close();
  }
});

test('vekalet: nispi ücret maktu alt sınırın altına inmez, icra takibinde asıl alacağı geçmez', async () => {
  const sayfa = await aracAc('vekalet');
  try {
    await alanDoldur(sayfa, 'Dava Değeri / Müddeabih (TL)', '100000');
    // 100.000 × %16 = 16.000 < asliye maktu 45.000
    assert.equal(await satir(sayfa, 'Tam Kabulde Vekalet Ücreti'), '45.000,00 TL');
    await secim(sayfa, 'Mahkeme / İşlem Tipi').selectOption({ label: 'İcra Dairelerinde Takip' });
    await alanDoldur(sayfa, 'Dava Değeri / Müddeabih (TL)', '5000');
    // maktu 9.000 > asıl alacak 5.000 → 5.000 (AAÜT m.11/1)
    assert.equal(await satir(sayfa, 'Maktu Alt Sınır'), '9.000,00 TL');
    assert.equal(await satir(sayfa, 'Tam Kabulde Vekalet Ücreti'), '5.000,00 TL');
  } finally {
    await sayfa.close();
  }
});

test('vekalet: hükmedilen ücret kabul ya da ret edilen miktarı geçemez (AAÜT m.13/2)', async () => {
  const sayfa = await aracAc('vekalet');
  try {
    await alanDoldur(sayfa, 'Dava Değeri / Müddeabih (TL)', '30000');
    // asliye maktu 45.000 > dava değeri 30.000 → 30.000
    assert.equal(await satir(sayfa, 'Tam Kabulde Vekalet Ücreti'), '30.000,00 TL');
    await alanDoldur(sayfa, 'Dava Değeri / Müddeabih (TL)', '60000');
    // tam kabul: max(9.600, 45.000) = 45.000 ≤ 60.000
    assert.equal(await satir(sayfa, 'Tam Kabulde Vekalet Ücreti'), '45.000,00 TL');
    await alanDoldur(sayfa, 'Davanın Kabul Oranı (%)', '50');
    // kabul 30.000 ve ret 30.000: maktu 45.000 her iki tarafta miktara iner
    assert.equal(await satir(sayfa, 'Kabul Edilen Kısım (davacı lehine)'), '30.000,00 TL');
    assert.equal(await satir(sayfa, 'Reddedilen Kısım (davalı lehine)'), '30.000,00 TL');
  } finally {
    await sayfa.close();
  }
});

test('vekalet: icra mahkemesinde ücret maktuyu geçemez (m.11/3), tahliye takibinde maktu uygulanır (m.11/5)', async () => {
  const sayfa = await aracAc('vekalet');
  try {
    await secim(sayfa, 'Mahkeme / İşlem Tipi').selectOption({ label: 'İcra Mahkemelerinde Dava (duruşmalı)' });
    await alanDoldur(sayfa, 'Dava Değeri / Müddeabih (TL)', '1000000');
    // Üçüncü Kısım 156.000 olurdu; m.11/3 uyarınca 18.000'i geçemez
    assert.equal(await satir(sayfa, 'Tam Kabulde Vekalet Ücreti'), '18.000,00 TL');
    await alanDoldur(sayfa, 'Dava Değeri / Müddeabih (TL)', '10000');
    // m.13/2: 10.000 TL davada ücret 10.000'i geçemez
    assert.equal(await satir(sayfa, 'Tam Kabulde Vekalet Ücreti'), '10.000,00 TL');
    await secim(sayfa, 'Mahkeme / İşlem Tipi').selectOption({ label: 'Tahliyeye İlişkin İcra Takibi' });
    await alanDoldur(sayfa, 'Dava Değeri / Müddeabih (TL)', '1000000');
    assert.equal(await satir(sayfa, 'Tam Kabulde Vekalet Ücreti'), '20.000,00 TL');
  } finally {
    await sayfa.close();
  }
});

test('vekalet: konusu para olmayan sulh hukuk davasında maktu 30.000 TL', async () => {
  const sayfa = await aracAc('vekalet');
  try {
    await secim(sayfa, 'Dava Tipi').selectOption('maktu');
    await secim(sayfa, 'Mahkeme / İşlem Tipi').selectOption({ label: 'Sulh Hukuk Mahkemesi' });
    assert.equal(await satir(sayfa, 'Maktu Vekalet Ücreti'), '30.000,00 TL');
  } finally {
    await sayfa.close();
  }
});
