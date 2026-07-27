# Periodik bakım: tarife hatırlatma + haftalık içtihat + link kontrol
$ErrorActionPreference = "Stop"
$projectDir = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$nodePath = (Get-Command node -ErrorAction Stop).Source
$scriptPath = Join-Path $projectDir "scripts\startup-maintenance.js"
$logDir = Join-Path $projectDir "logs\maintenance"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$logPath = Join-Path $logDir "startup-maintenance.log"

$wrapper = Join-Path $projectDir "scripts\run-maintenance.cmd"
$cmdLines = @(
  "@echo off"
  "cd /d `"$projectDir`""
  "set LINK_CHECK_BASE=https://avfethiguzel.com"
  "`"$nodePath`" `"$scriptPath`" >> `"$logPath`" 2>&1"
)
$cmdLines -join "`r`n" | Set-Content -Path $wrapper -Encoding ASCII

$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$wrapper`"" -WorkingDirectory $projectDir
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# Her Pazartesi 09:00
$triggerWeekly = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At 9am
# Her ayın 1'i 09:30 (tarife ayları için)
$triggerMonthly = New-ScheduledTaskTrigger -Weekly -WeeksInterval 4 -DaysOfWeek Monday -At 9:30am

Register-ScheduledTask -TaskName "FethiGuzel-Maintenance-Weekly" -Action $action -Trigger $triggerWeekly -Settings $settings -Force | Out-Null
Register-ScheduledTask -TaskName "FethiGuzel-Maintenance-MonthlyProbe" -Action $action -Trigger $triggerMonthly -Settings $settings -Force | Out-Null

# Ocak & Temmuz hatırlatma (tarife sezonu) — ayın 2'si
$tarifeWrapper = Join-Path $projectDir "scripts\run-tarife-check.cmd"
@(
  "@echo off"
  "cd /d `"$projectDir`""
  "`"$nodePath`" `"$projectDir\scripts\check-tarifeler.js`" >> `"$logPath`" 2>&1"
) -join "`r`n" | Set-Content -Path $tarifeWrapper -Encoding ASCII
$actionTarife = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$tarifeWrapper`"" -WorkingDirectory $projectDir
$triggerTarife = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Tuesday -At 10am
Register-ScheduledTask -TaskName "FethiGuzel-TarifeCheck" -Action $actionTarife -Trigger $triggerTarife -Settings $settings -Force | Out-Null

# Forum taslakları — Çarşamba 11:00 (haftalık bakım + ekstra hatırlatma)
$forumWrapper = Join-Path $projectDir "scripts\run-forum-draft.cmd"
@(
  "@echo off"
  "cd /d `"$projectDir`""
  "`"$nodePath`" `"$projectDir\scripts\forum-draft.js`" --count 5 >> `"$logPath`" 2>&1"
) -join "`r`n" | Set-Content -Path $forumWrapper -Encoding ASCII
$actionForum = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$forumWrapper`"" -WorkingDirectory $projectDir
$triggerForum = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Wednesday -At 11am
Register-ScheduledTask -TaskName "FethiGuzel-ForumDraft" -Action $actionForum -Trigger $triggerForum -Settings $settings -Force | Out-Null

Write-Host "OK FethiGuzel-Maintenance-Weekly (Mon 09:00)"
Write-Host "OK FethiGuzel-Maintenance-MonthlyProbe"
Write-Host "OK FethiGuzel-TarifeCheck (Tue 10:00)"
Write-Host "OK FethiGuzel-ForumDraft (Wed 11:00)"
Write-Host "Log: $logPath"
Write-Host "Flag file when tarife due: logs\maintenance\TARIFE-ACTION-REQUIRED.txt"
Write-Host "Forum drafts: logs\forum-drafts\"
