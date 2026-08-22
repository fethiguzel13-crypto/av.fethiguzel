$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $root 'scripts\rewrite-serh-until-done.mjs'))) {
    $root = Join-Path $PSScriptRoot '..'
}
$root = (Resolve-Path $root).Path
Set-Location $root
New-Item -ItemType Directory -Force -Path (Join-Path $root 'logs') | Out-Null
$out = Join-Path $root 'logs\serh-until-done.out.log'
$err = Join-Path $root 'logs\serh-until-done.err.log'

$alive = @(Get-CimInstance Win32_Process | Where-Object {
        $_.CommandLine -and ($_.CommandLine -match 'rewrite-serh-until-done\.mjs')
    })
if ($alive.Count -eq 0) {
    $cmd = "node scripts/rewrite-serh-until-done.mjs >> `"$out`" 2>> `"$err`""
    Start-Process -FilePath 'cmd.exe' -ArgumentList @('/c', $cmd) -WorkingDirectory $root -WindowStyle Hidden
}

$wd = @(Get-CimInstance Win32_Process | Where-Object {
        $_.CommandLine -and ($_.CommandLine -match 'serh-watchdog\.ps1')
    })
if ($wd.Count -eq 0) {
    Start-Process -FilePath 'powershell' -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', (Join-Path $root 'scripts\serh-watchdog.ps1')) `
        -WorkingDirectory $root `
        -WindowStyle Hidden
}

Start-Sleep -Seconds 3
Get-CimInstance Win32_Process | Where-Object {
    $_.CommandLine -and ($_.CommandLine -match 'rewrite-serh|serh-watchdog')
} | ForEach-Object {
    Write-Output ("PID={0} {1}" -f $_.ProcessId, $_.CommandLine)
}
