$root = 'c:\Users\HUAWEI\Desktop\internet\fethiguzel-portal'
Write-Host '=== NODE ==='
Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' } | ForEach-Object {
    $cmd = $_.CommandLine
    if (-not $cmd) { $cmd = '(no cmdline)' }
    '{0} {1}' -f $_.ProcessId, $cmd.Substring(0, [Math]::Min(220, $cmd.Length))
}
Write-Host '=== PS1 ==='
Get-CimInstance Win32_Process | Where-Object { $_.Name -match 'powershell' -and $_.CommandLine -match 'serh' } | ForEach-Object {
    '{0} {1}' -f $_.ProcessId, $_.CommandLine
}
Write-Host '=== HEARTBEAT ==='
$hb = Join-Path $root 'logs\serh-heartbeat.txt'
if (Test-Path $hb) { Get-Content $hb } else { Write-Host '(yok)' }
Write-Host '=== OUT ==='
$out = Join-Path $root 'logs\serh-until-done.out.log'
if (Test-Path $out) { Get-Content $out -Tail 40 } else { Write-Host '(yok)' }
Write-Host '=== ERR ==='
$err = Join-Path $root 'logs\serh-until-done.err.log'
if (Test-Path $err -and (Get-Item $err).Length -gt 0) { Get-Content $err -Tail 40 } else { Write-Host '(bos)' }
Write-Host '=== PROGRESS ==='
$p = Get-Content (Join-Path $root 'logs\serh-gemini-progress.json') -Raw | ConvertFrom-Json
Write-Host ("done={0} failed={1} updated={2}" -f @($p.done.PSObject.Properties).Count, @($p.failed.PSObject.Properties).Count, $p.updatedAt)
if (@($p.failed.PSObject.Properties).Count -gt 0) { $p.failed | ConvertTo-Json -Compress }
