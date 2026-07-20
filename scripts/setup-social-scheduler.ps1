# Daily social DRAFT agent at 10:00 + at logon
# Usage: powershell -ExecutionPolicy Bypass -File scripts\setup-social-scheduler.ps1

$ErrorActionPreference = "Stop"
$projectDir = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$nodePath = (Get-Command node -ErrorAction Stop).Source
$scriptPath = Join-Path $projectDir "scripts\startup-social.js"
$logDir = Join-Path $projectDir "logs"
$logPath = Join-Path $logDir "startup-social.log"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$envFile = Join-Path $projectDir ".env"
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*#' -or $_ -notmatch '=') { return }
    $parts = $_.Split('=', 2)
    if ($parts.Count -eq 2 -and $parts[0].Trim()) {
      [System.Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), "User")
    }
  }
  Write-Host "v .env keys loaded into User environment"
}

# Wrapper cmd for reliable scheduling
$wrapper = Join-Path $projectDir "scripts\run-social-daily.cmd"
@"
@echo off
cd /d "$projectDir"
"$nodePath" "$scriptPath" >> "$logPath" 2>&1
"@ | Set-Content -Path $wrapper -Encoding ASCII

$action = New-ScheduledTaskAction -Execute $wrapper -WorkingDirectory $projectDir
$triggerDaily = New-ScheduledTaskTrigger -Daily -At "10:00AM"
$triggerLogon = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 2) -StartWhenAvailable

Register-ScheduledTask -TaskName "FethiGuzel-SocialDraft" -Action $action -Trigger $triggerDaily -Settings $settings -Force | Out-Null
Register-ScheduledTask -TaskName "FethiGuzel-SocialDraft-Logon" -Action $action -Trigger $triggerLogon -Settings $settings -Force | Out-Null

Write-Host "v Tasks registered: FethiGuzel-SocialDraft (10:00), FethiGuzel-SocialDraft-Logon"
Write-Host "  Log: $logPath"
Write-Host "  Mode: DRAFT ONLY (no auto post)"
Write-Host "  Publish after approval: node scripts/social-publish.js --date YYYY-MM-DD"
