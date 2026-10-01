import Link from "next/link";
import type { ComponentProps } from "react";
import { rotaIsleyicisiMi } from "@/lib/rota-isleyici";

type Props = ComponentProps<typeof Link>;

/**
 * next/link ile aynı API. Hedef bir rota işleyicisiyse (madde sayfaları) düz <a> verir: önden
 * yükleme ve tıklamadaki boş RSC isteği olmaz (Vercel fonksiyon kotası; bkz. lib/rota-isleyici.ts).
 * Diğer tüm hedeflerde next/link'e aynen geçer.
 */
export default function SiteLink(props: Props) {
  const { href, prefetch, replace, scroll, onNavigate, ...rest } = props;
  if (typeof href === "string" && rotaIsleyicisiMi(href)) {
    return <a href={href} {...(rest as ComponentProps<"a">)} />;
  }
  return <Link href={href} prefetch={prefetch} replace={replace} scroll={scroll} onNavigate={onNavigate} {...rest} />;
}
