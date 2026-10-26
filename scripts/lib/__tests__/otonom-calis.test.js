// scripts/lib/__tests__/otonom-calis.test.js
// Otonom çalıştırıcının (scripts/otonom/calis.ps1) kullanım sınırı iletisini tanıması ve yenilenme saatini okuması.
// Betik çağrılınca oturum başlattığından çalıştırılmaz: işlevler AST'den ayıklanıp yalnız tanımları yüklenir.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const BETIK = fileURLToPath(new URL('../../otonom/calis.ps1', import.meta.url));
const WINDOWS_DEGIL = process.platform !== 'win32' && 'calis.ps1 Windows PowerShell 5.1 içindir';

// Her ileti için { limit, saat } döner; saat yenilenme anının HH:mm biçimidir, okunamazsa null.
function denetle(ornekler) {
  const ps = `
$ErrorActionPreference = 'Stop'
$hatalar = $null
$ast = [System.Management.Automation.Language.Parser]::ParseFile($env:OTONOM_BETIK, [ref]$null, [ref]$hatalar)
if ($hatalar.Count) { throw "calis.ps1 ayristirilamadi: $($hatalar[0].Message)" }
$istenen = 'Limit-Mesaji', 'Yenilenme-Zamani'
$fonk = $ast.FindAll({ param($d) $d -is [System.Management.Automation.Language.FunctionDefinitionAst] }, $true) |
  Where-Object { $istenen -contains $_.Name }
foreach ($f in $fonk) { . ([scriptblock]::Create($f.Extent.Text)) }
$sonuc = @(foreach ($o in ($env:OTONOM_ORNEKLER | ConvertFrom-Json)) {
  $y = Yenilenme-Zamani $o.metin
  [pscustomobject]@{ limit = [bool](Limit-Mesaji $o.metin $o.kod); saat = $(if ($y) { $y.ToString('HH:mm') } else { $null }) }
})
ConvertTo-Json -InputObject $sonuc -Compress
`;
  const r = spawnSync(
    'powershell.exe',
    ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', Buffer.from(ps, 'utf16le').toString('base64')],
    { encoding: 'utf8', env: { ...process.env, OTONOM_BETIK: BETIK, OTONOM_ORNEKLER: JSON.stringify(ornekler) } },
  );
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
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
