# ─────────────────────────────────────────────────────────────────────────────
# R8 kuralları — release'te minifyEnabled true.
#
# Capacitor köprüsü eklentileri ve @PluginMethod işaretli metotları çalışma
# anında reflection ile bulur. Bu sınıflar küçültülürse uygulama derlenir,
# kurulur ve ilk eklenti çağrısında sessizce çöker — bu yüzden aşağıdaki
# kurallar isteğe bağlı değildir.
# ─────────────────────────────────────────────────────────────────────────────

# Capacitor çekirdeği ve tüm eklentiler
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keepclassmembers class * {
    @com.getcapacitor.PluginMethod public <methods>;
}
-keep class * extends com.getcapacitor.Plugin { *; }

# Cordova köprüsü (capacitor-cordova-android-plugins modülü)
-keep class org.apache.cordova.** { *; }

# JavaScript arayüzüne açılan metotlar
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# WebView JS köprüsü genel koruması
-keepattributes JavascriptInterface
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes EnclosingMethod
-keepattributes InnerClasses

# Yığın izlerinin okunabilir kalması (Play Console çökme raporları)
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# AndroidX splash screen
-keep class androidx.core.splashscreen.** { *; }

# Uygulama giriş noktası
-keep class com.avfethiguzel.hukuk.MainActivity { *; }

# JSON model sınıfları (eklentiler JSONObject üzerinden konuşur)
-keep class org.json.** { *; }

# Uyarı bastırma — isteğe bağlı bağımlılıklar
-dontwarn org.apache.cordova.**
-dontwarn com.google.android.gms.**
