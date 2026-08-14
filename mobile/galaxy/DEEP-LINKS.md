# Galaxy deep links

Scheme: `avfethiguzel://`

| App | Package | Scheme | Web |
|-----|---------|--------|-----|
| portal | com.avfethiguzel.hukuk | `avfethiguzel://portal` | `https://www.avfethiguzel.com/?app=portal` |
| hesap | com.avfethiguzel.hesap | `avfethiguzel://hesap` | `https://www.avfethiguzel.com/hesaplama?app=hesap` |
| icthat | com.avfethiguzel.icthat | `avfethiguzel://icthat` | `https://www.avfethiguzel.com/icthat?app=icthat` |
| rehber | com.avfethiguzel.rehber | `avfethiguzel://rehber` | `https://www.avfethiguzel.com/bilgi?app=rehber` |

Subpaths: `avfethiguzel://hesap/kidem` → `/hesaplama/kidem?app=hesap`

Cross-app on web: `?app=<id>&lang=tr|en`

Implementation: `lib/galaxy/pure.mjs` → `pathFromAppUrl`, `deepLinkFor`.
