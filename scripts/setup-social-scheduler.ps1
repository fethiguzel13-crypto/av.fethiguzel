# Daily social DRAFT agent at 10:00 + at logon
$ErrorActionPreference = "Stop"
$projectDir = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$nodePath = (Get-Command node -ErrorAction Stop).Source
$scriptPath = Join-Path $projectDir "scripts\startup-social.js"
$logDir = Join-Path $projectDir "logs"
$logPath = Join-Path $logDir "startup-social.log"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$wrapper = Join-Path $projectDir "scripts\run-social-daily.cmd"
$cmdLines = @(
  "@echo off"
  "cd /d `"$projectDir`""
  "`"$nodePath`" `"$scriptPath`" >> `"$logPath`" 2>&1"
)
$cmdLines -join "`r`n" | Set-Content -Path $wrapper -Encoding ASCII

$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$wrapper`"" -WorkingDirectory $projectDir
$triggerDaily = New-ScheduledTaskTrigger -Daily -At 10am
$triggerLogon = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

Register-ScheduledTask -TaskName "FethiGuzel-SocialDraft" -Action $action -Trigger $triggerDaily -Settings $settings -Force | Out-Null
Register-ScheduledTask -TaskName "FethiGuzel-SocialDraft-Logon" -Action $action -Trigger $triggerLogon -Settings $settings -Force | Out-Null

Write-Host "OK FethiGuzel-SocialDraft (10:00) + Logon"
Write-Host "Log: $logPath"
Write-Host "Draft only. Publish: node scripts/social-publish.js --date YYYY-MM-DD"
