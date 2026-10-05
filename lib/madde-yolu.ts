/**
 * Madde sayfasının kanonik yolu (G12). Veride kimlik "madde-17A" biçiminde de geçer; rota işleyicisi
 * büyük harfli adresi küçük harfe 308 ile yönlendirir. Bağlantı ve site haritası doğrudan kanonik adrese gider.
 * Saf işlev: istemci bileşenlerinden de çağrılır (lib/api.ts sunucu modülüdür).
 */
export function maddeYolu(kanunId: string, id: string): string {
  return `/mevzuat/${kanunId}/${id.toLowerCase()}`;
}
