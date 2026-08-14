# Upload keystore olusturur (Play Store). JKS dosyasini git'e eklemeyin.
# Kullanim: .\scripts\create-upload-keystore.ps1
# Isteğe bagli: -Password "sifreniz"  (vermezseniz sorulur)

param(
  [string]$Alias = "fethiguzel",
  [string]$OutFile = "",
  [string]$Password = ""
)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
if (-not $OutFile) {
  $OutFile = Join-Path $root "fethiguzel-upload.jks"
}

$keytool = Get-Command keytool -ErrorAction SilentlyContinue
if (-not $keytool) {
  $candidates = @(
    "C:\Program Files\Java\jdk-17\bin\keytool.exe",
    "C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe",
    "C:\Program Files\Java\jdk-13.0.2\bin\keytool.exe"
  )
  foreach ($c in $candidates) {
    if (Test-Path $c) { $keytool = $c; break }
  }
}
if (-not $keytool) {
  throw "keytool bulunamadi. JDK kurun veya PATH'e ekleyin."
}

if (Test-Path $OutFile) {
  throw "Zaten var: $OutFile — silmeden uzerine yazilmaz."
}

if (-not $Password) {
  $sec = Read-Host "Keystore sifresi (en az 6 karakter)" -AsSecureString
  $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
  $Password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

if ($Password.Length -lt 6) {
  throw "Sifre en az 6 karakter olmali."
}

$dname = "CN=Av Fethi Guzel, O=AvFethiGuzel, L=Ercis, ST=Van, C=TR"
& $keytool -genkeypair -v `
  -keystore $OutFile `
  -keyalg RSA -keysize 2048 -validity 10000 `
  -alias $Alias `
  -storepass $Password `
  -keypass $Password `
  -dname $dname

Write-Host ""
Write-Host "Olustu: $OutFile"
Write-Host "SHA-256 (assetlinks.json icin):"
& $keytool -list -v -keystore $OutFile -alias $Alias -storepass $Password |
  Select-String "SHA256"

$props = Join-Path $root "android\keystore.properties"
$relStore = "../" + (Split-Path $OutFile -Leaf)
# Eger jks mobile/ altindaysa storeFile=../fethiguzel-upload.jks
if ((Split-Path $OutFile -Parent) -eq $root) {
  $relStore = "../$(Split-Path $OutFile -Leaf)"
}

@"
storeFile=$relStore
storePassword=$Password
keyAlias=$Alias
keyPassword=$Password
"@ | Set-Content -Path $props -Encoding UTF8

Write-Host "Yazildi: $props (git'e eklemeyin)"
Write-Host "GitHub secret icin base64:"
Write-Host ([Convert]::ToBase64String([IO.File]::ReadAllBytes($OutFile)).Substring(0, [Math]::Min(40, ([IO.File]::ReadAllBytes($OutFile).Length))) + "...")
Write-Host "(Tam base64 panoya: [Convert]::ToBase64String([IO.File]::ReadAllBytes('$OutFile')) | Set-Clipboard)"
