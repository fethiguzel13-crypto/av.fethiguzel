// scripts/lib/__tests__/otonom-calis.test.js
// Otonom çalıştırıcının (scripts/otonom/calis.ps1) kullanım sınırı iletisini tanıması, yenilenme saatini okuması ve
// kilidi tek çalıştırıcıya vermesi. Betik çağrılınca oturum başlattığından çalıştırılmaz: işlevler AST'den ayıklanıp
// yalnız tanımları yüklenir.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BETIK = fileURLToPath(new URL('../../otonom/calis.ps1', import.meta.url));
const WINDOWS_DEGIL = process.platform !== 'win32' && 'calis.ps1 Windows PowerShell 5.1 içindir';

// calis.ps1'deki adı verilen işlevleri yükleyip gövdeyi çalıştıran PowerShell komutunun argümanları.
function psArgumanlari(adlar, govde) {
  const ps = `
$ErrorActionPreference = 'Stop'
$hatalar = $null
$ast = [System.Management.Automation.Language.Parser]::ParseFile($env:OTONOM_BETIK, [ref]$null, [ref]$hatalar)
if ($hatalar.Count) { throw "calis.ps1 ayristirilamadi: $($hatalar[0].Message)" }
$istenen = @(${adlar.map((a) => `'${a}'`).join(', ')})
$fonk = @($ast.FindAll({ param($d) $d -is [System.Management.Automation.Language.FunctionDefinitionAst] }, $true) |
  Where-Object { $istenen -contains $_.Name })
if ($fonk.Count -ne $istenen.Count) { throw "calis.ps1 islevleri eksik: $($istenen -join ', ')" }
foreach ($f in $fonk) { . ([scriptblock]::Create($f.Extent.Text)) }
# İşlevler betikteki gibi sonlandırıcı olmayan hatalarla sürer.
$ErrorActionPreference = 'Continue'
${govde}
`;
  return ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', Buffer.from(ps, 'utf16le').toString('base64')];
}

function psCalistir(adlar, govde, env) {
  const r = spawnSync('powershell.exe', psArgumanlari(adlar, govde), {
    encoding: 'utf8',
    env: { ...process.env, OTONOM_BETIK: BETIK, ...env },
  });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
}

// Her ileti için { limit, saat } döner; saat yenilenme anının HH:mm biçimidir, okunamazsa null.
function denetle(ornekler) {
  const govde = `
$sonuc = @(foreach ($o in ($env:OTONOM_ORNEKLER | ConvertFrom-Json)) {
  $y = Yenilenme-Zamani $o.metin
  [pscustomobject]@{ limit = [bool](Limit-Mesaji $o.metin $o.kod); saat = $(if ($y) { $y.ToString('HH:mm') } else { $null }) }
})
ConvertTo-Json -InputObject $sonuc -Compress
`;
  return psCalistir(['Limit-Mesaji', 'Yenilenme-Zamani'], govde, { OTONOM_ORNEKLER: JSON.stringify(ornekler) });
}

async function bekle(kosul, ileti, sure = 30_000) {
  const son = Date.now() + sure;
  while (!kosul()) {
    if (Date.now() > son) throw new Error(`bekleme süresi doldu: ${ileti}`);
    await new Promise((coz) => setTimeout(coz, 25));
  }
}

describe('otonom çalıştırıcı: kullanım sınırı', { skip: WINDOWS_DEGIL }, () => {
  it('logs/otonom günlüklerinde görülen sınır iletilerini tanır ve yenilenme saatini okur', () => {
    const sonuc = denetle([
      // 2026-10-23, 2026-10-24 ve 2026-10-26 13:00-15:00 oturumları
      { metin: "You've hit your session limit · resets 3:40pm (Europe/Istanbul)", kod: 1 },
      // 2026-10-17 21:00 - 2026-10-18 14:00 oturumları
      { metin: "You've hit your weekly limit · resets 3pm (Europe/Istanbul)", kod: 1 },
      // betiğin baştan bildiği iki eski biçim
      { metin: '5-hour limit reached ∙ resets 9pm', kod: 1 },
      { metin: 'Claude AI usage limit reached|1759345200', kod: 1 },
    ]);
    assert.deepEqual(sonuc.map((s) => s.limit), [true, true, true, true]);
    assert.deepEqual(sonuc.slice(0, 3).map((s) => s.saat), ['15:40', '15:00', '21:00']);
  });

  it('kimlik doğrulama hatasını ve başarıyla biten oturumun özetini sınır saymaz', () => {
    const sonuc = denetle([
      // 2026-10-24 16:00 - 2026-10-26 10:00: yenileme görevi kurulursa giriş yapılmadan boşa çalışır
      { metin: 'Failed to authenticate: OAuth session expired and could not be refreshed', kod: 1 },
      // başarılı oturumun son yanıtı sınır iletisini aktarabilir; çıkış kodu 0 iken yenileme kurulmaz
      { metin: "13:00 oturumu `You've hit your session limit · resets 3:40pm` iletisiyle bitmiştir.", kod: 0 },
    ]);
    assert.deepEqual(sonuc.map((s) => s.limit), [false, false]);
  });
});

describe('otonom çalıştırıcı: kilit', { skip: WINDOWS_DEGIL }, () => {
  it('boş kilidi alır, sahibi yaşayan kilidi bırakır, sahibi ölmüş ya da bozuk kilidi devralır', () => {
    const dizin = mkdtempSync(join(tmpdir(), 'otonom-kilit-'));
    try {
      const govde = `
$yol = Join-Path $env:OTONOM_DIZIN 'calis.lock'
$ben = [string]$PID
$s = [ordered]@{ ben = $ben }
$s.bos = [bool](Kilit-Al $yol $ben)
$s.bosSahip = [string](Get-Content $yol | Select-Object -First 1)
$s.dolu = [bool](Kilit-Al $yol '4')
$s.doluSahip = [string](Get-Content $yol | Select-Object -First 1)
Set-Content $yol '2147483644' -Encoding ascii
$s.olu = [bool](Kilit-Al $yol $ben)
$s.oluSahip = [string](Get-Content $yol | Select-Object -First 1)
Set-Content $yol 'bozuk' -Encoding ascii
$s.bozuk = [bool](Kilit-Al $yol $ben)
$s.dosyalar = @(Get-ChildItem $env:OTONOM_DIZIN -Name | ForEach-Object { [string]$_ })
ConvertTo-Json -InputObject $s -Compress
`;
      const s = psCalistir(['Kilit-Al'], govde, { OTONOM_DIZIN: dizin });
      assert.equal(s.bos, true);
      assert.equal(s.bosSahip, s.ben);
      assert.equal(s.dolu, false, 'sahibi yaşayan kilit ikinci çalıştırıcıya verildi');
      assert.equal(s.doluSahip, s.ben);
      assert.equal(s.olu, true);
      assert.equal(s.oluSahip, s.ben);
      assert.equal(s.bozuk, true);
      assert.deepEqual(s.dosyalar, ['calis.lock'], 'geçici kilit dosyası geride kaldı');
    } finally {
      rmSync(dizin, { recursive: true, force: true });
    }
  });

  it('aynı anda başlayan çalıştırıcılardan yalnız biri kilidi alır', { timeout: 60_000 }, async () => {
    // 2026-10-27 18:29:42: kapak açılınca kaçan 18:00 saatlik tetiği ile 18:23 yenileme görevi aynı saniyede başlamış,
    // ikisi de kilidi yokken görüp calis.log'a "oturum başladı" yazmıştır.
    const dizin = mkdtempSync(join(tmpdir(), 'otonom-kilit-'));
    const govde = `
$d = $env:OTONOM_DIZIN
New-Item -ItemType File (Join-Path $d "hazir-$PID") | Out-Null
while (-not (Test-Path (Join-Path $d 'basla'))) { Start-Sleep -Milliseconds 1 }
$aldi = [bool](Kilit-Al (Join-Path $d 'calis.lock') ([string]$PID))
[Console]::Out.WriteLine("SONUC $aldi")
while (-not (Test-Path (Join-Path $d 'bitir'))) { Start-Sleep -Milliseconds 20 }
`;
    const surecler = Array.from({ length: 4 }, () => {
      const c = spawn('powershell.exe', psArgumanlari(['Kilit-Al'], govde), {
        env: { ...process.env, OTONOM_BETIK: BETIK, OTONOM_DIZIN: dizin },
      });
      const s = { c, cikti: '', hata: '', kod: null };
      c.stdout.setEncoding('utf8').on('data', (p) => { s.cikti += p; });
      c.stderr.setEncoding('utf8').on('data', (p) => { s.hata += p; });
      s.bitti = new Promise((coz) => c.on('close', (kod) => { s.kod = kod; coz(); }));
      return s;
    });
    const coktuMu = () => {
      const s = surecler.find((x) => x.kod !== null && x.kod !== 0);
      if (s) throw new Error(`PowerShell ${s.kod} koduyla çıktı: ${s.hata}`);
    };
    try {
      await bekle(() => (coktuMu(), readdirSync(dizin).filter((a) => a.startsWith('hazir-')).length === surecler.length), 'hazır');
      writeFileSync(join(dizin, 'basla'), '');
      await bekle(() => (coktuMu(), surecler.every((s) => /SONUC (True|False)/.test(s.cikti))), 'sonuç');
      writeFileSync(join(dizin, 'bitir'), '');
      await Promise.all(surecler.map((s) => s.bitti));
    } finally {
      for (const s of surecler) if (s.kod === null) s.c.kill();
      await Promise.all(surecler.map((s) => s.bitti));
      rmSync(dizin, { recursive: true, force: true, maxRetries: 5 });
    }
    const alanlar = surecler.filter((s) => s.cikti.includes('SONUC True')).length;
    assert.equal(alanlar, 1, `kilidi ${alanlar} çalıştırıcı aldı`);
  });
});
