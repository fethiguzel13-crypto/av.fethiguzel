# Karar Arama - masaustune "Karar Arama" kisayolunu kurar (bir kez calistirmak yeter).
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts\karar-arama\kisayol-olustur.ps1
# Kisayol, baslat.vbs uzerinden yerel sunucuyu penceresiz baslatir ve tarayiciyi acar.
$ErrorActionPreference = 'Stop'
$dizin = Split-Path -Parent $MyInvocation.MyCommand.Path
$baslatici = Join-Path $dizin 'baslat.vbs'
$masaustu = [Environment]::GetFolderPath('Desktop')
$yol = Join-Path $masaustu 'Karar Arama.lnk'
$sh = New-Object -ComObject WScript.Shell
$k = $sh.CreateShortcut($yol)
$k.TargetPath = Join-Path $env:SystemRoot 'System32\wscript.exe'
$k.Arguments = '"' + $baslatici + '"'
$k.WorkingDirectory = $dizin
$k.IconLocation = (Join-Path $env:SystemRoot 'System32\shell32.dll') + ',22'
$k.Description = 'Yargitay kararlarinda yerel arama (internetsiz)'
$k.Save()
Write-Output "Kisayol olusturuldu: $yol"
