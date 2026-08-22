$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $root 'scripts\rewrite-serh-until-done.mjs'))) {
    $root = Join-Path $PSScriptRoot '..'
}
$root = (Resolve-Path $root).Path
Set-Location $root
$out = Join-Path $root 'logs\serh-until-done.out.log'
$err = Join-Path $root 'logs\serh-until-done.err.log'
$doneMark = Join-Path $root 'logs\serh-until-done.FINISHED'
New-Item -ItemType Directory -Force -Path (Join-Path $root 'logs') | Out-Null

function Alive {
    @(Get-CimInstance Win32_Process | Where-Object {
            $_.CommandLine -and ($_.CommandLine -match 'rewrite-serh-until-done\.mjs')
        }).Count -gt 0
}

while (-not (Test-Path $doneMark)) {
    if (-not (Alive)) {
        $stamp = Get-Date -Format 'yyyy-MM-ddTHH:mm:ss'
        Add-Content -Path $out -Value "[$stamp] watchdog restart"
        $cmd = "node scripts/rewrite-serh-until-done.mjs >> `"$out`" 2>> `"$err`""
        Start-Process -FilePath 'cmd.exe' -ArgumentList @('/c', $cmd) -WorkingDirectory $root -WindowStyle Hidden
    }
    Start-Sleep -Seconds 45
}
