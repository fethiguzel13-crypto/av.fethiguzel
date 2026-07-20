# İmza (keystore)

Play Store yüklemesi için bir upload keystore oluşturun (**bu klasöre koymayın / git’e eklemeyin**):

```bash
keytool -genkeypair -v -keystore fethiguzel-upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias fethiguzel -dname "CN=Av Fethi Guzel, O=AvFethiGuzel, L=Ercis, ST=Van, C=TR"
```

GitHub Actions için secrets:

- `ANDROID_KEYSTORE_BASE64` — jks dosyasının base64 hali  
- `ANDROID_KEYSTORE_PASSWORD`  
- `ANDROID_KEY_ALIAS` = `fethiguzel`  
- `ANDROID_KEY_PASSWORD`

Base64 (PowerShell):

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("fethiguzel-upload.jks")) | Set-Clipboard
```
