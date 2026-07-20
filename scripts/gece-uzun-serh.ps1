# Gece uzun serh motoru — Grok session kapansa da calisir
$ErrorActionPreference = "Continue"
$Root = "c:\Users\HUAWEI\Desktop\internet\fethiguzel-portal"
Set-Location $Root
$env:PYTHONIOENCODING = "utf-8"
$log = Join-Path $Root "logs\gece-uzun-serh.log"
$err = Join-Path $Root "logs\gece-uzun-serh.err.log"

$order = @(
    "cek", "otv", "kmk", "aile-koruma", "jandarma", "pvsk", "buyuksehir", "cck",
    "dernekler", "arabuluculuk", "kamu-ihale-sozlesmeleri", "katmulkiyeti",
    "imar", "kamulastirma", "tvk", "nhk", "tebligat", "il-idaresi", "vakiflar",
    "rkhk", "belediye", "devlet-ihale", "yukk", "tsk-ic-hizmet", "spk", "bk",
    "ktk", "iik", "dmk", "kdvk", "gvk", "hmk", "vuk", "aatuhk", "ttk"
)

function Write-Log($m) {
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $m"
    Add-Content -Path $log -Value $line -Encoding UTF8
    Write-Host $line
}

Write-Log "=== GECE UZUN SERH BASLADI ==="

foreach ($k in $order) {
    $dir = Join-Path $Root "content\mevzuat\$k"
    if (-not (Test-Path $dir)) { continue }
    Write-Log "KANUN $k basliyor"
    try {
        $out = & python scripts\write_long_serh.py $k pending 2>> $err
        $out | ForEach-Object { Write-Log $_ }
    }
    catch {
        Write-Log "HATA $k $_"
    }
    # ara envanter
    try {
        $pending = (Get-ChildItem $dir -Filter "*.md" | Where-Object {
                (Get-Content $_.FullName -Raw) -notmatch 'commentaryStatus:\s*"completed"'
            }).Count
        Write-Log "KANUN $k bitti; kalan pending ~$pending"
    }
    catch {}
}

Write-Log "=== GECE UZUN SERH BITTI ==="
# ozet
& python -c @"
import os,re
root='content/mevzuat'
T=C=P=0
for d in os.listdir(root):
  p=os.path.join(root,d)
  if not os.path.isdir(p): continue
  for f in os.listdir(p):
    if not f.endswith('.md'): continue
    T+=1
    t=open(os.path.join(p,f),encoding='utf-8',errors='ignore').read()
    if 'commentaryStatus: \"completed\"' in t: C+=1
    else: P+=1
print(f'TOPLAM {T} tamam {C} bekleyen {P} oran {round(100*C/T)}%')
"@ 2>> $err | ForEach-Object { Write-Log $_ }
