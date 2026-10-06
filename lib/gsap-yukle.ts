type Gsap = typeof import('gsap').gsap;

/**
 * GSAP + ScrollTrigger'ı ilk yükten ayırır (Aylık plan G13).
 *
 * Kaydırma animasyonları ekranın altındaki bölümlerde; 140 KB'lık kütüphane ana sayfanın ilk yükünde iniyor ve
 * değerlendiriliyordu. Bölüm görünür alana yaklaşınca yüklenir, `kur` GSAP bağlamı içinde çalışır. Gözlemcisi
 * olmayan tarayıcıda animasyon kurulmaz; içerik zaten görünürdür.
 *
 * Dönen işlev effect temizliğidir: gözlemciyi kapatır, kurulan animasyonları geri alır.
 */
export function gsapGorununce(el: Element | null, kur: (gsap: Gsap) => void): () => void {
  if (!el || typeof window === 'undefined' || !('IntersectionObserver' in window)) return () => {};
  let iptal = false;
  let baglam: { revert(): void } | undefined;
  const gozlemci = new IntersectionObserver(
    (girdiler) => {
      if (!girdiler.some((g) => g.isIntersecting)) return;
      gozlemci.disconnect();
      Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
        if (iptal) return;
        gsap.registerPlugin(ScrollTrigger);
        baglam = gsap.context(() => kur(gsap), el);
      });
    },
    { rootMargin: '300px' },
  );
  gozlemci.observe(el);
  return () => {
    iptal = true;
    gozlemci.disconnect();
    baglam?.revert();
  };
}
