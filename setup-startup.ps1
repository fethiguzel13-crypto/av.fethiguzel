param(
  [string]$ApiKey = $env:ANTHROPIC_API_KEY
)

if (-not $ApiKey) {
  Write-Error "ANTHROPIC_API_KEY parametresi gerekli: .\setup-startup.ps1 -ApiKey sk-ant-..."
  exit 1
}

$projectDir = $PSScriptRoot
$nodePath   = (Get-Command node -ErrorAction Stop).Source
$scriptPath = Join-Path $projectDir "scripts\startup-tweet.js"
$logDir     = Join-Path $projectDir "logs"
$logPath    = Join-Path $logDir "startup-tweet.log"

New-Item -ItemType Directory -Force -Path $logDir | Out-Null

# ANTHROPIC_API_KEY'i kullanıcı ortam değişkeni olarak kaydet
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", $ApiKey, "User")
Write-Output "v ANTHROPIC_API_KEY kullanici ortam degiskeni olarak kaydedildi"

$psArgs = "-NonInteractive -WindowStyle Hidden -Command `"node '$scriptPath' >> '$logPath' 2>&1`""

$action   = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $psArgs -WorkingDirectory $projectDir
$trigger  = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Minutes 15) -StartWhenAvailable

Register-ScheduledTask `
  -TaskName "FethiGuzel-TwitterBot" `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Force | Out-Null

Write-Output "v Task Scheduler gorevi olusturuldu: FethiGuzel-TwitterBot"
Write-Output "  Tetikleyici: kullanici oturumu acildiginda"
Write-Output "  Log: $logPath"
Write-Output ""
Write-Output "Kurulum tamamlandi. Bir sonraki acilista otomatik calisacak."
Write-Output "Manuel test: Start-ScheduledTask -TaskName 'FethiGuzel-TwitterBot'"
