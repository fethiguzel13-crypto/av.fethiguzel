# Overnight rate-limit ramp + harvest keepalive + periodic core-select.
# WMI-launched; safe to re-run (single instance via lock).
$ErrorActionPreference = "Continue"
$Portal = "c:\Users\HUAWEI\Desktop\internet\fethiguzel-portal"
$Node = "C:\Program Files\nodejs\node.exe"
$ConfigPath = Join-Path $Portal "scripts\yargi-kararlari\config.json"
$UntilDone = Join-Path $Portal "scripts\yargi-kararlari\until-done.mjs"
$WatchScript = Join-Path $Portal "scripts\yargi-kararlari\watch-until-done.ps1"
$CoreSelect = Join-Path $Portal "scripts\yargi-kararlari\core-100k\select-core.mjs"
$StateDir = Join-Path $Portal "data\yargi-kararlari\_state"
$Log = Join-Path $StateDir "overnight-ramp.log"
$Lock = Join-Path $StateDir "overnight-ramp.lock"
$HarvestLog = Join-Path $StateDir "until-done-controller.log"
$Ps = "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"

function L([string]$m) {
  $line = "[{0}] {1}" -f (Get-Date -Format "o"), $m
  Add-Content -Path $Log -Value $line -Encoding UTF8
}

if (Test-Path $Lock) {
  $old = Get-Content $Lock -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($old -and (Get-Process -Id $old -ErrorAction SilentlyContinue)) {
    L "another ramp alive pid=$old - exit"
    exit 0
  }
}
$PID | Set-Content $Lock -Encoding ascii
L "overnight-ramp start"

# Stages every ~90 minutes: raise daily + per-run caps, gently tighten delays
$stages = @(
  @{ day = 4500; run = 200; searchDay = 1500; searchPages = 18; minFt = 3800; maxFt = 10000; pauseN = 55; pauseMin = 40000; pauseMax = 90000 },
  @{ day = 5500; run = 230; searchDay = 1600; searchPages = 20; minFt = 3500; maxFt = 9000;  pauseN = 60; pauseMin = 35000; pauseMax = 80000 },
  @{ day = 6500; run = 260; searchDay = 1800; searchPages = 22; minFt = 3200; maxFt = 8500;  pauseN = 65; pauseMin = 30000; pauseMax = 75000 },
  @{ day = 7500; run = 290; searchDay = 2000; searchPages = 24; minFt = 3000; maxFt = 8000;  pauseN = 70; pauseMin = 28000; pauseMax = 70000 },
  @{ day = 8500; run = 320; searchDay = 2200; searchPages = 25; minFt = 2800; maxFt = 7500;  pauseN = 75; pauseMin = 25000; pauseMax = 65000 },
  @{ day = 9500; run = 350; searchDay = 2400; searchPages = 28; minFt = 2500; maxFt = 7000;  pauseN = 80; pauseMin = 22000; pauseMax = 60000 }
)

function Apply-Stage($s, $idx) {
  try {
    $raw = [System.IO.File]::ReadAllText($ConfigPath)
    $cfg = $raw | ConvertFrom-Json
    $cfg.rateLimit.maxFullTextPerDay = [int]$s.day
    $cfg.rateLimit.maxFullTextPerRun = [int]$s.run
    $cfg.rateLimit.maxSearchCallsPerDay = [int]$s.searchDay
    $cfg.rateLimit.maxSearchPagesPerRun = [int]$s.searchPages
    $cfg.rateLimit.minDelayMsBetweenFullText = [int]$s.minFt
    $cfg.rateLimit.maxDelayMsBetweenFullText = [int]$s.maxFt
    $cfg.rateLimit.pauseEveryNFullText = [int]$s.pauseN
    $cfg.rateLimit.pauseMinMs = [int]$s.pauseMin
    $cfg.rateLimit.pauseMaxMs = [int]$s.pauseMax
    $json = $cfg | ConvertTo-Json -Depth 30
    [System.IO.File]::WriteAllText($ConfigPath, $json, (New-Object System.Text.UTF8Encoding $false))
    L ("stage {0} applied day={1} run={2} minFt={3} maxFt={4} pauseN={5}" -f $idx, $s.day, $s.run, $s.minFt, $s.maxFt, $s.pauseN)
  } catch {
    L ("stage apply failed: {0}" -f $_.Exception.Message)
  }
}

function Ensure-UntilDone {
  $pids = @(
    Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
      Where-Object { $_.CommandLine -and ($_.CommandLine -like "*until-done.mjs*") } |
      Select-Object -ExpandProperty ProcessId
  )
  if ($pids.Count -gt 0) {
    L ("until-done ok pids={0}" -f ($pids -join ";"))
    return
  }
  L "until-done missing - starting"
  $cmd = '"{0}" "{1}" --log="{2}"' -f $Node, $UntilDone, $HarvestLog
  $r = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
    CommandLine = $cmd
    CurrentDirectory = $Portal
  }
  L ("start until-done Return={0} PID={1}" -f $r.ReturnValue, $r.ProcessId)
}

function Ensure-Watchdog {
  $lockWd = Join-Path $StateDir "watch-until-done.lock"
  $alive = $false
  if (Test-Path $lockWd) {
    $lp = Get-Content $lockWd -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($lp -and (Get-Process -Id $lp -ErrorAction SilentlyContinue)) { $alive = $true }
  }
  if ($alive) { return }
  if (Test-Path $lockWd) { Remove-Item $lockWd -Force -ErrorAction SilentlyContinue }
  $cmd = '"{0}" -NoProfile -ExecutionPolicy Bypass -File "{1}"' -f $Ps, $WatchScript
  $null = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
    CommandLine = $cmd
    CurrentDirectory = $Portal
  }
  L "watchdog restarted"
}

function Run-CoreSelect {
  try {
    L "core-select start"
    $errLog = Join-Path $StateDir "core-select-last.err.log"
    $outLog = Join-Path $StateDir "core-select-last.out.log"
    $p = Start-Process -FilePath $Node -ArgumentList "`"$CoreSelect`"" -WorkingDirectory $Portal -Wait -PassThru -NoNewWindow -RedirectStandardError $errLog -RedirectStandardOutput $outLog
    L ("core-select exit={0}" -f $p.ExitCode)
  } catch {
    L ("core-select fail: {0}" -f $_.Exception.Message)
  }
}

function Status-Line {
  try {
    $statusScript = Join-Path $Portal "scripts\yargi-kararlari\archive-yargitay.mjs"
    $out = & $Node $statusScript --status 2>&1 | Out-String
    $dl = "?"
    $ft = "?"
    $q = "?"
    if ($out -match "downloaded:\s*(\d+)") { $dl = $Matches[1] }
    if ($out -match "fullText\s+(\d+)/(\d+)") { $ft = "$($Matches[1])/$($Matches[2])" }
    if ($out -match "Kuyruk:\s*(\d+)") { $q = $Matches[1] }
    L "status dl=$dl ft=$ft queue=$q"
  } catch {
    L "status fail"
  }
}

$stageIdx = 0
Apply-Stage $stages[0] $stageIdx
Ensure-Watchdog
Ensure-UntilDone
Status-Line

$start = Get-Date
$lastCore = Get-Date
$stageMinutes = 90
$maxHours = 12

while (((Get-Date) - $start).TotalHours -lt $maxHours) {
  Start-Sleep -Seconds 180
  Ensure-Watchdog
  Ensure-UntilDone
  Status-Line

  $elapsedMin = [int]((Get-Date) - $start).TotalMinutes
  $wantStage = [Math]::Min(($stages.Count - 1), [int][Math]::Floor($elapsedMin / $stageMinutes))
  if ($wantStage -gt $stageIdx) {
    $stageIdx = $wantStage
    Apply-Stage $stages[$stageIdx] $stageIdx
  }

  if (((Get-Date) - $lastCore).TotalMinutes -ge 180) {
    Run-CoreSelect
    $lastCore = Get-Date
  }
}

L "overnight window ended - final core-select"
Run-CoreSelect
Status-Line
Remove-Item $Lock -Force -ErrorAction SilentlyContinue
L "ramp exit 0"
exit 0
