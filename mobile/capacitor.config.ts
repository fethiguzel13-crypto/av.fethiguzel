/**
 * Capacitor config for the Android wrapper app.
 * Kept free of @capacitor/cli imports so the root Next.js tsconfig
 * never fails typecheck on Vercel (mobile deps are not installed there).
 */
const config = {
  appId: 'com.avfethiguzel.hukuk',
  appName: 'Av. Fethi Güzel',
  webDir: 'www',
  server: {
    // Canlı portal — mevzuat/şerh her zaman güncel
    url: 'https://www.avfethiguzel.com',
    cleartext: false,
    allowNavigation: [
      'avfethiguzel.com',
      '*.avfethiguzel.com',
      'www.avfethiguzel.com',
      // Harita / mağaza dış bağlantıları
      'maps.google.com',
      '*.google.com',
      'play.google.com',
    ],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 900,
      launchAutoHide: true,
      backgroundColor: '#2E4036',
      showSpinner: false,
      androidSplashResourceName: 'splash',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#2E4036',
    },
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#F2F0E9',
    // WebView geri tuşu / gezinme
    webContentsDebuggingEnabled: false,
  },
};

export default config as const;
