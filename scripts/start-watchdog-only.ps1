$root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $root 'scripts\serh-watchdog.ps1'))) {
    $root = Join-Path $PSScriptRoot '..'
}
$root = (Resolve-Path $root).Path
$wd = @(Get-CimInstance Win32_Process | Where-Object {
        $_.CommandLine -and ($_.CommandLine -match 'serh-watchdog\.ps1')
    })
if ($wd.Count -eq 0) {
    Start-Process -FilePath 'powershell' -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', (Join-Path $root 'scripts\serh-watchdog.ps1')) `
        -WorkingDirectory $root `
        -WindowStyle Hidden
    Write-Output 'watchdog started'
}
else {
    Write-Output ('watchdog already {0}' -f $wd[0].ProcessId)
}
