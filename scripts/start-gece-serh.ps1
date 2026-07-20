# Gece serh uretimi + NotebookLM cookie keepalive
# Kullanim: powershell -ExecutionPolicy Bypass -File scripts\start-gece-serh.ps1

$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

if (-not (Test-Path "logs")) { New-Item -ItemType Directory -Path "logs" | Out-Null }

$env:SERH_NO_PUSH = "1"
$env:PYTHONIOENCODING = "utf-8"

# Onceki ayni isleri durdurma (yalniz bu script'in baslattigi process)
$marker = Join-Path $Root "logs\serh-gece.pid"
if (Test-Path $marker) {
  $old = Get-Content $marker -ErrorAction SilentlyContinue
  if ($old) {
    Stop-Process -Id ([int]$old) -Force -ErrorAction SilentlyContinue
  }
}

# Cookie keepalive her 15 dk (ayri process)
$keepalive = @"
while (`$true) {
  try { notebooklm auth refresh --quiet 2>> '$Root\logs\nlm-keepalive.err' } catch {}
  Start-Sleep -Seconds 900
}
"@
$kaPath = Join-Path $Root "logs\nlm-keepalive.ps1"
Set-Content -Path $kaPath -Value $keepalive -Encoding UTF8
$ka = Start-Process -FilePath "powershell" -ArgumentList "-NoProfile","-ExecutionPolicy","Bypass","-File",$kaPath -WindowStyle Hidden -PassThru
Set-Content -Path (Join-Path $Root "logs\nlm-keepalive.pid") -Value $ka.Id

# Ana uretim
$log = Join-Path $Root "logs\serh-gece.log"
$err = Join-Path $Root "logs\serh-gece.err.log"
$p = Start-Process -FilePath "node" `
  -ArgumentList "generate-kanun-commentary-nlm.mjs","pending" `
  -WorkingDirectory $Root `
  -RedirectStandardOutput $log `
  -RedirectStandardError $err `
  -WindowStyle Hidden `
  -PassThru

Set-Content -Path $marker -Value $p.Id
"Baslatildi PID=$($p.Id) keepalive=$($ka.Id)"
"Log: $log"
