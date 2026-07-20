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
        // Live portal — always up to date with the website
        url: 'https://avfethiguzel.com',
        cleartext: false,
        allowNavigation: [
            'avfethiguzel.com',
            '*.avfethiguzel.com',
            'www.avfethiguzel.com',
        ],
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 1200,
            backgroundColor: '#2E4036',
            showSpinner: false,
            launchAutoHide: true,
        },
        StatusBar: {
            style: 'DARK',
            backgroundColor: '#2E4036',
        },
    },
    android: {
        allowMixedContent: false,
        backgroundColor: '#F2F0E9',
    },
};

export default config as const;
