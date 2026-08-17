import React from 'react';

type State = { error: Error | null };

/**
 * Beyaz ekran yerine kurtarılabilir bir hata sayfası.
 *
 * WebView'da yakalanmamış bir React hatası uygulamayı tamamen boş bırakır;
 * kullanıcı "uygulama açılmıyor" diye tek yıldız verir. Play'de en sık
 * görülen düşük puan sebeplerinden biri budur.
 */
export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Yerel tanı kaydı — Play Console çökme raporuna girmeyen JS hataları için
    try {
      const log = JSON.parse(localStorage.getItem('galaxy:errors') || '[]');
      log.unshift({
        at: new Date().toISOString(),
        message: error.message,
        stack: (error.stack || '').slice(0, 1200),
        component: (info.componentStack || '').slice(0, 800),
      });
      localStorage.setItem('galaxy:errors', JSON.stringify(log.slice(0, 10)));
    } catch {
      /* depolama dolu olabilir */
    }
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-[100dvh] grid place-items-center px-6 text-center bg-cream">
        <div className="max-w-sm">
          <div className="w-14 h-14 rounded-2xl grid place-items-center mx-auto mb-4 text-2xl"
               style={{ background: 'var(--brand-soft)' }}>
            §
          </div>
          <h1 className="text-lg font-heading font-bold mb-2">Bir şeyler ters gitti</h1>
          <p className="text-sm text-charcoal/60 leading-relaxed mb-5">
            Ekran yüklenirken beklenmedik bir hata oluştu. Verileriniz cihazınızda duruyor;
            yeniden başlatmak çoğu durumda yeterli oluyor.
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="btn-brand w-full"
              onClick={() => {
                this.setState({ error: null });
                window.location.hash = '/';
                window.location.reload();
              }}
            >
              Uygulamayı yeniden başlat
            </button>
            <button
              type="button"
              className="btn-ghost w-full"
              onClick={() => this.setState({ error: null })}
            >
              Bu ekranı atla
            </button>
          </div>
          <p className="mt-4 text-[11px] text-charcoal/35 font-mono break-words">
            {error.message}
          </p>
        </div>
      </div>
    );
  }
}
