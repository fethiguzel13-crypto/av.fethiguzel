<#
  Yargıtay hasat motoru v2 — Windows servis yöneticisi

    .\scripts\yargi-kararlari\hasat-servis.ps1 -Kur      # eski yığını durdur, durumu yedekle, görevi kur, motoru başlat
    .\scripts\yargi-kararlari\hasat-servis.ps1 -Durum    # durum raporu
    .\scripts\yargi-kararlari\hasat-servis.ps1 -Durdur   # görevi devre dışı bırak + motoru nazikçe durdur
    .\scripts\yargi-kararlari\hasat-servis.ps1 -Devam    # görevi etkinleştir + motoru başlat
    .\scripts\yargi-kararlari\hasat-servis.ps1 -Kaldir   # motoru durdur, görevi sil
    .\scripts\yargi-kararlari\hasat-servis.ps1 -Baslat   # (görevin kendisi kullanır) çalışmıyorsa başlat

  Motor, zamanlanmış görevin iş nesnesine bağlı kalmasın diye WMI ile başlatılır;
  görev yalnız "çalışıyor mu?" kontrolü yapar. Tek kopya kilidi çift çalışmayı engeller.
#>
param([switch]$Kur, [switch]$Baslat, [switch]$Durdur, [switch]$Devam, [switch]$Kaldir, [switch]$Durum)

$ErrorActionPreference = "Continue"
$Portal = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$Entry = Join-Path $PSScriptRoot "hasat.mjs"
$State = Join-Path $Portal "data\yargi-kararlari\_state"
$ServisLog = Join-Path $State "hasat-servis.log"
$TaskName = "YargiHasatMotoru"
$OldTask = "YargiKararHarvestMonitor"
$Node = (Get-Command node.exe -ErrorAction SilentlyContinue).Source
if (-not $Node) { $Node = "C:\Program Files\nodejs\node.exe" }

function SLog([string]$m) {
  $line = "[{0}] {1}" -f (Get-Date -Format "o"), $m
  Write-Host $line
  Add-Content -Path $ServisLog -Value $line -Encoding UTF8 -ErrorAction SilentlyContinue
}

function Test-MotorCanli {
  & $Node $Entry --canli | Out-Null
  return ($LASTEXITCODE -eq 0)
}

function Get-NodeProcs([string]$pattern) {
  @(Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -and ($_.CommandLine -like $pattern) })
}

function Start-Motor {
  if (Test-MotorCanli) { return }
  $cmd = '"{0}" "{1}" --sessiz' -f $Node, $Entry
  $r = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
    CommandLine = $cmd
    CurrentDirectory = $Portal
  }
  SLog ("motor başlatıldı Return={0} PID={1}" -f $r.ReturnValue, $r.ProcessId)
}

function Stop-EskiYigin {
  # 1) Eski zamanlanmış izleyici (silinmez; geri dönüş: Enable-ScheduledTask -TaskName YargiKararHarvestMonitor)
  $t = Get-ScheduledTask -TaskName $OldTask -ErrorAction SilentlyContinue
  if ($t -and $t.State -ne "Disabled") {
    Disable-ScheduledTask -TaskName $OldTask | Out-Null
    SLog "eski görev $OldTask devre dışı bırakıldı"
  }
  # 2) Eski izleyici / watchdog PowerShell süreçleri
  Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -and ($_.CommandLine -like "*yargi-3000-monitor.ps1*" -or $_.CommandLine -like "*watch-until-done.ps1*") } |
    ForEach-Object {
      Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
      SLog ("eski izleyici durduruldu pid={0}" -f $_.ProcessId)
    }
  # 3) until-done denetleyicisi (yeni parti başlatmasın)
  Get-NodeProcs "*until-done.mjs*" | ForEach-Object {
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
    SLog ("until-done durduruldu pid={0}" -f $_.ProcessId)
  }
  # 4) Çalışan parti: yalnız "[wait]" uykusundayken (progress.json yazmıyorken) durdur
  $runLog = Join-Path $State "run.log"
  $deadline = (Get-Date).AddMinutes(10)
  while ($true) {
    $procs = Get-NodeProcs "*archive-yargitay.mjs*"
    if ($procs.Count -eq 0) { break }
    $safe = $false
    try {
      $fi = Get-Item $runLog
      $last = Get-Content $runLog -Tail 1
      if ($last -match "\[wait\]" -and ((Get-Date) - $fi.LastWriteTime).TotalSeconds -lt 2) { $safe = $true }
    } catch {}
    if ($safe -or (Get-Date) -gt $deadline) {
      foreach ($p in $procs) {
        Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue
        SLog ("eski arşivleyici durduruldu pid={0} (uyku anında={1})" -f $p.ProcessId, $safe)
      }
      Start-Sleep -Seconds 1
    } else {
      Start-Sleep -Milliseconds 400
    }
  }
}

function Backup-State {
  $dir = Join-Path $State ("yedek-" + (Get-Date -Format "yyyyMMdd-HHmmss"))
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  foreach ($f in @("progress.json", "queue.jsonl", "daily.json", "harvest-cursor.json")) {
    $p = Join-Path $State $f
    if (Test-Path $p) { Copy-Item $p $dir }
  }
  SLog "durum yedeği alındı: $dir"
}

function Register-Gorev {
  $ps = Join-Path $env:WINDIR "System32\WindowsPowerShell\v1.0\powershell.exe"
  $arg = '-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "{0}" -Baslat' -f $PSCommandPath
  $action = New-ScheduledTaskAction -Execute $ps -Argument $arg -WorkingDirectory $Portal
  $atLogon = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
  $every10 = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(2) -RepetitionInterval (New-TimeSpan -Minutes 10)
  $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable `
    -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 5)
  Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger @($atLogon, $every10) -Settings $settings `
    -Description "Yargıtay hasat motoru v2 (hasat.mjs): çalışmıyorsa başlatır. Tek kopya kilidi çift çalışmayı engeller." -Force | Out-Null
  SLog "zamanlanmış görev kuruldu: $TaskName (oturum açılışında + 10 dakikada bir kontrol)"
}

if ($Baslat) {
  $t = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
  if ($t -and $t.State -eq "Disabled") { exit 0 }
  Start-Motor
  exit 0
}

if ($Kur) {
  SLog "=== kurulum: eski yığın -> hasat motoru v2 ==="
  Stop-EskiYigin
  Backup-State
  Register-Gorev
  Start-Motor
  Start-Sleep -Seconds 10
  & $Node $Entry --durum
  exit 0
}

if ($Durdur) {
  $t = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
  if ($t) { Disable-ScheduledTask -TaskName $TaskName | Out-Null; SLog "görev devre dışı: $TaskName" }
  & $Node $Entry --dur
  exit $LASTEXITCODE
}

if ($Devam) {
  $t = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
  if ($t) { Enable-ScheduledTask -TaskName $TaskName | Out-Null; SLog "görev etkin: $TaskName" }
  Start-Motor
  exit 0
}

if ($Kaldir) {
  & $Node $Entry --dur
  Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
  SLog "görev silindi: $TaskName. Eski sisteme dönmek için: Enable-ScheduledTask -TaskName $OldTask"
  exit 0
}

& $Node $Entry --durum
