import { Fragment } from 'react';
import Link from '@/components/SiteLink';
import { jsonLdHtml } from '@/lib/json-ld';
import { kirintiLd, kirintiOgeleri } from '@/lib/kirinti.mjs';

type Oge = { ad: string; yol: string };

/**
 * Görünür kırıntı + BreadcrumbList şeması, aynı öğe listesinden (Aylık plan G12). Sayfalardaki eski elle yazılmış
 * kırıntının biçimini korur: bağlantılar, "/" ayracı, son öğe düz metin. Şemayı kendi `@graph`'ına koyan sayfa
 * `ld={false}` verir ve `kirintiLd`'yi grafiğe ekler.
 */
export default function Kirinti({
  ogeler,
  className = 'text-[11px] text-ink-muted mb-5 flex flex-wrap gap-1.5',
  baglantiSinifi = 'hover:text-accent',
  sonSinif = 'text-ink-muted',
  ayracSinifi,
  ld = true,
  anaSayfa,
}: {
  ogeler: Oge[];
  className?: string;
  baglantiSinifi?: string;
  sonSinif?: string;
  ayracSinifi?: string;
  ld?: boolean;
  /** İlk basamağın adı; yabancı dildeki sayfa kendi dilinde verir (varsayılan "Ana sayfa"). */
  anaSayfa?: string;
}) {
  const liste = kirintiOgeleri(ogeler, anaSayfa);
  const son = liste.length - 1;
  return (
    <>
      {ld && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdHtml({ '@context': 'https://schema.org', ...kirintiLd(ogeler, anaSayfa) }),
          }}
        />
      )}
      <nav className={className} aria-label="Konum">
        {liste.map((o, i) => (
          <Fragment key={o.yol}>
            {i > 0 && (
              <span className={ayracSinifi} aria-hidden="true">
                /
              </span>
            )}
            {i < son ? (
              <Link href={o.yol} className={baglantiSinifi}>
                {o.ad}
              </Link>
            ) : (
              <span className={sonSinif} aria-current="page">
                {o.ad}
              </span>
            )}
          </Fragment>
        ))}
      </nav>
    </>
  );
}
