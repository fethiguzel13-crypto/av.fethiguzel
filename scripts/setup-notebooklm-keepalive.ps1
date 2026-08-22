# NotebookLM çerezlerini 20 dakikada bir yenile.
# Oturum düşerse tarayıcıda login açılır (kullanıcı 22.08.2026 yetkisi).
$ErrorActionPreference = "Stop"
$projectDir = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$py = $null
foreach ($c in @("python", "py")) {
    $cmd = Get-Command $c -ErrorAction SilentlyContinue
    if ($cmd) { $py = $cmd.Source; break }
}
if (-not $py) { throw "python bulunamadı" }

$logDir = Join-Path $projectDir "logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$wrapper = Join-Path $projectDir "scripts\run-notebooklm-keepalive.cmd"
$scriptPath = Join-Path $projectDir "scripts\notebooklm-keepalive.py"
@(
    "@echo off"
    "cd /d `"$projectDir`""
    "`"$py`" `"$scriptPath`" >> `"$logDir\notebooklm-keepalive.cmd.log`" 2>&1"
) -join "`r`n" | Set-Content -Path $wrapper -Encoding ASCII

$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$wrapper`"" -WorkingDirectory $projectDir
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew
$start = (Get-Date).AddMinutes(1)
$trigger = New-ScheduledTaskTrigger -Once -At $start -RepetitionInterval (New-TimeSpan -Minutes 20) -RepetitionDuration (New-TimeSpan -Days 3650)

Register-ScheduledTask -TaskName "FethiGuzel-NotebookLM-Keepalive" -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null
Write-Host "OK FethiGuzel-NotebookLM-Keepalive (her 20 dk)"
Write-Host "Log: $logDir\notebooklm-keepalive.log"
Write-Host "Hemen bir tur: $py $scriptPath"
