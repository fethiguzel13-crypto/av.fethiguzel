<#
  Aylık Mükemmellik Planı — otonom çalıştırıcı (1–30 Ekim 2026)

    .\scripts\otonom\calis.ps1 -Kur      # "FethiGuzel-OtonomCalisma" görevini kur (3 saatte bir)
    .\scripts\otonom\calis.ps1 -Deneme   # başsız Claude'un çalıştığını 1 turla doğrula
    .\scripts\otonom\calis.ps1           # (görevin kendisi) bir otonom oturum çalıştır
    .\scripts\otonom\calis.ps1 -Kaldir   # görevi sil

  Duraklatmak için: docs\aylik-plan\DURAKLAT dosyası oluşturun (silince devam eder).
  Oturumlar docs/aylik-plan/OTONOM.md yordamını uygular; push .git/hooks/pre-push ile engellidir,
  ayrıca git push / vercel / npm publish araç düzeyinde yasaklıdır.
#>
param([switch]$Kur, [switch]$Deneme, [switch]$Kaldir)

$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [Text.Encoding]::UTF8
$Portal = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$LogDir = Join-Path $Portal "logs\otonom"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
$Bitis = Get-Date "2026-10-30T23:59:00"
$Claude = Join-Path $env:USERPROFILE ".local\bin\claude.exe"
$TaskName = "FethiGuzel-OtonomCalisma"
$Lock = Join-Path $LogDir "calis.lock"

function L([string]$m) {
  Add-Content -Path (Join-Path $LogDir "calis.log") -Value ("[{0}] {1}" -f (Get-Date -Format "o"), $m) -Encoding UTF8
}

if ($Kaldir) {
  Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
  L "görev silindi"
  exit 0
}

if ($Kur) {
  $ps = Join-Path $env:WINDIR "System32\WindowsPowerShell\v1.0\powershell.exe"
  $arg = '-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "{0}"' -f $PSCommandPath
  $action = New-ScheduledTaskAction -Execute $ps -Argument $arg -WorkingDirectory $Portal
  $first = (Get-Date).Date.AddHours([Math]::Ceiling((Get-Date).Hour / 3 + 0.01) * 3)
  $trigger = New-ScheduledTaskTrigger -Once -At $first -RepetitionInterval (New-TimeSpan -Hours 3)
  $trigger.EndBoundary = $Bitis.ToString("s")
  $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable `
    -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Hours 2 -Minutes 45)
  Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings `
    -Description "Aylık Mükemmellik Planı: 3 saatte bir başsız Claude oturumu (docs/aylik-plan/OTONOM.md). Push yok." -Force | Out-Null
  L ("görev kuruldu, ilk çalışma {0}" -f $first.ToString("s"))
  Write-Host ("Görev kuruldu: {0} — ilk çalışma {1}, sonra 3 saatte bir, bitiş {2}" -f $TaskName, $first, $Bitis)
  exit 0
}

if ((Get-Date) -gt $Bitis) { L "dönem bitti — çalışmıyor"; exit 0 }
$Duraklat = Join-Path $Portal "docs\aylik-plan\DURAKLAT"
if (Test-Path $Duraklat) {
  # İçinde tarih varsa o ana kadar geçerli (etkileşimli oturum kısa süreli koyar); boşsa süresiz.
  $raw = (Get-Content $Duraklat -Raw -ErrorAction SilentlyContinue)
  $until = [datetime]::MinValue
  if ($raw -and [datetime]::TryParse($raw.Trim(), [ref]$until) -and (Get-Date) -gt $until) {
    Remove-Item $Duraklat -Force -ErrorAction SilentlyContinue
    L "süresi dolmuş DURAKLAT kaldırıldı"
  } else {
    L "DURAKLAT dosyası var — atlandı"
    exit 0
  }
}
if (Test-Path $Lock) {
  $old = Get-Content $Lock -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($old -and (Get-Process -Id $old -ErrorAction SilentlyContinue)) { L "önceki oturum sürüyor (pid $old) — atlandı"; exit 0 }
}
$PID | Set-Content $Lock -Encoding ascii

try {
  Set-Location $Portal
  # Kullanıcı ortamındaki ANTHROPIC_API_KEY (sitenin günlük betikleri için) claude.ai girişinin önüne
  # geçer ve ücretli API kredisini kullandırır; 2026-09-30 18:00/21:00 oturumları "Credit balance is
  # too low" ile düştü. Yalnız bu süreçten kaldırılır → oturum abonelik girişiyle çalışır.
  foreach ($n in "ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN") { Remove-Item "Env:$n" -ErrorAction SilentlyContinue }
  # Uykudan uyanınca ağ birkaç dakika gelmeyebilir (2026-10-01 09:18: ENOTFOUND). 5 dk'ya kadar bekle.
  $agHazir = $false
  for ($i = 0; $i -lt 30; $i++) {
    try { [void][System.Net.Dns]::GetHostAddresses("api.anthropic.com"); $agHazir = $true; break } catch { Start-Sleep -Seconds 10 }
  }
  if (-not $agHazir) { L "ağ 5 dk içinde gelmedi — atlandı"; exit 0 }
  $out = Join-Path $LogDir ("{0}.log" -f (Get-Date -Format "yyyyMMdd-HHmm"))
  if ($Deneme) {
    $prompt = "Yalnızca 'otonom hazır' yaz ve dur. Hiçbir araç kullanma."
    $turns = "2"
  } else {
    $prompt = ("docs/aylik-plan/OTONOM.md dosyasını oku ve oradaki yordamı eksiksiz uygula. Bugün {0}. " +
      "Bu oturum başsızdır; kullanıcıya soru sorma, gerekli kararı en güvenli seçenekle ver ve kaydet.") -f (Get-Date -Format "yyyy-MM-dd HH:mm")
    $turns = "400"
  }
  $cargs = @("-p", $prompt, "--dangerously-skip-permissions", "--output-format", "text", "--max-turns", $turns,
    "--disallowedTools", "Bash(git push:*)", "Bash(vercel:*)", "Bash(npx vercel:*)", "Bash(npm publish:*)")
  L "oturum başladı → $out"
  & $Claude @cargs 2>&1 | ForEach-Object { "$_" } | Out-File -FilePath $out -Encoding utf8
  L ("oturum bitti, çıkış kodu {0}" -f $LASTEXITCODE)
} finally {
  Remove-Item $Lock -Force -ErrorAction SilentlyContinue
}
