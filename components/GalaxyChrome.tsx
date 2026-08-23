'use client';

import { Suspense } from 'react';
import { useGalaxy } from '@/lib/galaxy/useGalaxy';

/*
  Yüzen dil rozeti KALDIRILDI.

  Rozet `fixed top-0 z-[55]` idi; site gezinme çubuğu ise `fixed top-6
  z-[900]`. İkisi aynı bandı paylaşıyor ve çubuk üstte kaldığı için rozet
  ana sayfa dışındaki her sayfada altında kalıp kırpık bir dilim olarak
  görünüyordu. Rozetin taşıdığı uygulama adı da çubuktaki markanın
  tekrarıydı.

  Dil seçici gezinme çubuğuna taşındı; kullanıcı onu zaten orada arar.
  Bu bileşen yalnız ekran okuyucuya okunan yasal notu taşımayı sürdürür.
*/
function GalaxyBar() {
  const { t, ready } = useGalaxy();
  if (!ready) return null;
  return <span className="sr-only">{t('common.disclaimer')}</span>;
}
/** Dil seçici + aktif galaxy uygulaması etiketi (Suspense: useSearchParams) */
export default function GalaxyChrome() {
  return (
    <Suspense fallback={null}>
      <GalaxyBar />
    </Suspense>
  );
}
