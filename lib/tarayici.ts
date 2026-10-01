import { useSyncExternalStore } from "react";

const bosAbone = () => () => {};

/**
 * Yalnız tarayıcıda okunabilen bir değer (uygulama içi mi, çerez, pencere özelliği): sunucuda ve
 * hydration sırasında `sunucuDegeri`, sonra tarayıcı değeri döner. "useEffect içinde setState" kalıbının
 * yerine geçer: fazladan çizim turu ve hydration uyuşmazlığı olmaz (Aylık plan G01b).
 * `oku` her çizimde çağrılır; ilkel değer (boolean, string, null) döndürmelidir.
 */
export function useTarayiciDegeri<T>(oku: () => T, sunucuDegeri: T): T {
  return useSyncExternalStore(bosAbone, oku, () => sunucuDegeri);
}
