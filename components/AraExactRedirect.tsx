'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { parseMaddeQuery } from '@/lib/parse-madde-query';

/**
 * «TBK 13» / «TBK m.13» gibi tam madde sorgularında
 * kullanıcıyı kanonik madde sayfasına yönlendirir.
 */
export default function AraExactRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams?.get('q') ?? '';

  useEffect(() => {
    const exact = parseMaddeQuery(q);
    if (exact) {
      router.replace(exact.href);
    }
  }, [q, router]);

  return null;
}
