/**
 * OTOMATİK ÜRETİLDİ — scripts/build-flavor.mjs (flavor: asistan)
 * Elle düzenlemeyin; yeniden üretmek için:
 *   node scripts/build-flavor.mjs --app=asistan
 */
const config = {
  "appId": "com.avfethiguzel.hesap",
  "appName": "Av. Fethi Güzel Hukuk Asistanı",
  "webDir": "www",
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 600,
      "launchAutoHide": false,
      "backgroundColor": "#2E4036",
      "showSpinner": false,
      "androidSplashResourceName": "splash",
      "splashFullScreen": false,
      "splashImmersive": false
    },
    "StatusBar": {
      "style": "DARK",
      "backgroundColor": "#2E4036",
      "overlaysWebView": false
    },
    "LocalNotifications": {
      "smallIcon": "ic_stat_notify",
      "iconColor": "#2E4036"
    }
  },
  "android": {
    "allowMixedContent": false,
    "backgroundColor": "#F2F0E9",
    "webContentsDebuggingEnabled": false,
    "allowNavigation": [
      "avfethiguzel.com",
      "*.avfethiguzel.com",
      "play.google.com"
    ]
  }
} as const;
export default config;
