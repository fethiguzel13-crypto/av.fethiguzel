<#
  Aylık Mükemmellik Planı — otonom çalıştırıcı (1–30 Ekim 2026)

    .\scripts\otonom\calis.ps1 -Kur      # "FethiGuzel-OtonomCalisma" görevini kur (saatte bir)
    .\scripts\otonom\calis.ps1 -Deneme   # başsız Claude'un çalıştığını 1 turla doğrula
    .\scripts\otonom\calis.ps1           # (görevin kendisi) bir otonom oturum çalıştır
    .\scripts\otonom\calis.ps1 -Kaldir   # görevi sil

  Duraklatmak için: docs\aylik-plan\DURAKLAT dosyası oluşturun (silince devam eder).
  Kullanım limiti: oturum limit mesajıyla biterse yenilenme saati çıktıdan okunur ve o saatten 3 dk
  sonraya tek seferlik "FethiGuzel-OtonomYenileme" görevi kurulur; okunamazsa saatlik tetik yakalar.
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
$YenilemeGorevi = "FethiGuzel-OtonomYenileme"
$Lock = Join-Path $LogDir "calis.lock"

function L([string]$m) {
  Add-Content -Path (Join-Path $LogDir "calis.log") -Value ("[{0}] {1}" -f (Get-Date -Format "o"), $m) -Encoding UTF8
}

function Gorev-Eylemi {
  $ps = Join-Path $env:WINDIR "System32\WindowsPowerShell\v1.0\powershell.exe"
  $arg = '-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "{0}"' -f $PSCommandPath
  return New-ScheduledTaskAction -Execute $ps -Argument $arg -WorkingDirectory $Portal
}

function Gorev-Ayarlari {
  return New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable `
    -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Hours 2 -Minutes 45)
}

# Claude Code'un limit mesajından yenilenme anını çıkarır. Bilinen biçimler:
#   "Claude AI usage limit reached|1759345200"          (Unix saniyesi)
#   "5-hour limit reached ∙ resets 9pm" / "resets at 21:30"  (yerel saat)
# Okunamazsa $null döner; saatlik tetik yine yakalar.
function Yenilenme-Zamani([string]$metin) {
  if ($metin -match 'limit reached\|(\d{10})') {
    return [DateTimeOffset]::FromUnixTimeSeconds([long]$Matches[1]).LocalDateTime
  }
  if ($metin -match '(?i)resets?\s+(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?') {
    $h = [int]$Matches[1]
    $m = 0
    if ($Matches[2]) { $m = [int]$Matches[2] }
    $ap = "$($Matches[3])".ToLower()
    if ($ap -eq 'pm' -and $h -lt 12) { $h += 12 }
    if ($ap -eq 'am' -and $h -eq 12) { $h = 0 }
    if ($h -gt 23 -or $m -gt 59) { return $null }
    $t = (Get-Date).Date.AddHours($h).AddMinutes($m)
    if ($t -le (Get-Date)) { $t = $t.AddDays(1) }
    return $t
  }
  return $null
}

if ($Kaldir) {
  Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
  Unregister-ScheduledTask -TaskName $YenilemeGorevi -Confirm:$false -ErrorAction SilentlyContinue
  L "görev silindi"
  exit 0
}

if ($Kur) {
  # Saatte bir: limit yenilenince en geç 1 saat içinde iş başlar; süren oturum varsa kilit atlatır.
  $first = (Get-Date).Date.AddHours((Get-Date).Hour + 1)
  $trigger = New-ScheduledTaskTrigger -Once -At $first -RepetitionInterval (New-TimeSpan -Hours 1)
  $trigger.EndBoundary = $Bitis.ToString("s")
  Register-ScheduledTask -TaskName $TaskName -Action (Gorev-Eylemi) -Trigger $trigger -Settings (Gorev-Ayarlari) `
    -Description "Aylık Mükemmellik Planı: saatte bir başsız Claude oturumu (docs/aylik-plan/OTONOM.md). Push yok." -Force | Out-Null
  L ("görev kuruldu, ilk çalışma {0}" -f $first.ToString("s"))
  Write-Host ("Görev kuruldu: {0} — ilk çalışma {1}, sonra saatte bir, bitiş {2}" -f $TaskName, $first, $Bitis)
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
  $metin = Get-Content $out -Raw -ErrorAction SilentlyContinue
  if ($metin -and $metin -match '(?i)usage limit|limit reached|hit your limit|limit will reset') {
    $yen = Yenilenme-Zamani $metin
    # Yalnız gelecekteki an: geçmiş tarihli tek seferlik görev StartWhenAvailable ile hemen tetiklenir ve
    # limit doluyken kendini yeniden kuran bir döngüye girerdi.
    if ($yen -and $yen -gt (Get-Date).AddMinutes(1) -and $yen -lt $Bitis) {
      $at = $yen.AddMinutes(3)
      $tek = New-ScheduledTaskTrigger -Once -At $at
      Register-ScheduledTask -TaskName $YenilemeGorevi -Action (Gorev-Eylemi) -Trigger $tek -Settings (Gorev-Ayarlari) `
        -Description "Kullanım limiti yenilenince tek seferlik otonom oturum (calis.ps1 kurar)." -Force | Out-Null
      L ("kullanım limiti doldu; yenilenme {0} → tek seferlik oturum {1}" -f $yen.ToString("s"), $at.ToString("s"))
    } else {
      L "kullanım limiti doldu; yenilenme saati okunamadı → saatlik tetik bekleniyor"
    }
  }
} finally {
  Remove-Item $Lock -Force -ErrorAction SilentlyContinue
}
