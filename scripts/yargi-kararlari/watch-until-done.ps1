# Durable watchdog: keep yargi until-done alive until harvest complete.
# Launched outside agent job objects (WMI). Safe to re-run (single instance via lock).
$ErrorActionPreference = "Continue"
$PortalRoot = "c:\Users\HUAWEI\Desktop\internet\fethiguzel-portal"
$Node = "C:\Program Files\nodejs\node.exe"
$UntilDone = Join-Path $PortalRoot "scripts\yargi-kararlari\until-done.mjs"
$StatusScript = Join-Path $PortalRoot "scripts\yargi-kararlari\archive-yargitay.mjs"
$LogDir = Join-Path $PortalRoot "data\yargi-kararlari\_state"
$WatchLog = Join-Path $LogDir "watch-until-done.log"
$PidFile = Join-Path $LogDir "until-done.watch.pid"
$LockFile = Join-Path $LogDir "watch-until-done.lock"
$HarvestLog = Join-Path $LogDir "until-done-controller.log"

function WLog([string]$msg) {
  $line = "[{0}] {1}" -f (Get-Date -Format "o"), $msg
  Add-Content -Path $WatchLog -Value $line -Encoding UTF8
}

if (Test-Path $LockFile) {
  $oldPid = (Get-Content $LockFile -ErrorAction SilentlyContinue | Select-Object -First 1)
  if ($oldPid -and (Get-Process -Id $oldPid -ErrorAction SilentlyContinue)) {
    WLog "another watchdog alive pid=$oldPid - exit"
    exit 0
  }
}
$PID | Set-Content $LockFile -Encoding ascii
WLog "watchdog start portal=$PortalRoot"

function IsHarvestComplete {
  try {
    $out = & $Node $StatusScript --status 2>&1 | Out-String
    if ($out -match "COMPLETE:\s*true") { return $true }
  } catch {}
  return $false
}

function GetUntilDonePids {
  Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -and ($_.CommandLine -like "*until-done.mjs*") } |
    Select-Object -ExpandProperty ProcessId
}

function StartUntilDone {
  $cmd = '"{0}" "{1}" --log="{2}"' -f $Node, $UntilDone, $HarvestLog
  $r = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
    CommandLine = $cmd
    CurrentDirectory = $PortalRoot
  }
  WLog ("start until-done Return={0} PID={1}" -f $r.ReturnValue, $r.ProcessId)
  if ($r.ProcessId) { $r.ProcessId | Set-Content $PidFile -Encoding ascii }
  return $r.ProcessId
}

while ($true) {
  if (IsHarvestComplete) {
    WLog "HARVEST COMPLETE - watchdog exit 0"
    Remove-Item $LockFile -Force -ErrorAction SilentlyContinue
    exit 0
  }
  $pids = @(GetUntilDonePids)
  if ($pids.Count -eq 0) {
    WLog "until-done missing while incomplete - restarting"
    StartUntilDone | Out-Null
  } else {
    $joined = ($pids | ForEach-Object { "$_" }) -join ";"
    WLog "ok until-done pids=$joined"
  }
  Start-Sleep -Seconds 120
}
