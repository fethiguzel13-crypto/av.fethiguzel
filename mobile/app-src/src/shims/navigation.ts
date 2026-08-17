import { navigate, useRoute } from '../lib/router';

/**
 * `next/navigation` karşılığı — portal bileşenlerinin kullandığı üç kanca.
 * Sunucu bileşeni API'leri (redirect, notFound) mobilde anlamsız olduğu için
 * yönlendirmeye indirgenir.
 */

export function useRouter() {
  return {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href, { replace: true }),
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    refresh: () => {},
    prefetch: () => {},
  };
}

export function usePathname(): string {
  const route = useRoute();
  return route.path;
}

export function useSearchParams(): URLSearchParams {
  const route = useRoute();
  return route.query;
}

export function useParams(): Record<string, string> {
  const route = useRoute();
  return route.params;
}

export function redirect(href: string): never {
  navigate(href, { replace: true });
  throw new Error('GALAXY_REDIRECT');
}

export function notFound(): never {
  navigate('/404', { replace: true });
  throw new Error('GALAXY_NOT_FOUND');
}
