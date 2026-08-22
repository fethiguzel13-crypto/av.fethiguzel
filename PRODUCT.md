# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, deliberately kept separate rather than merged into one funnel:

1. **Prospective clients** in and around Van/Erciş (plus non-Turkish-speaking clients) seeking legal representation or consultation. Reached mainly through district-level local-SEO pages (Van, Erciş, Ağrı, Bitlis, Muradiye, Özalp, Patnos, Tatvan, Ahlat, Adilcevaz, Çaldıran) and an English-speaking-lawyer page.
2. **General public, lawyers, law students, and academics** using the legal reference platform: statute text + commentary search (mevzuat/şerh), daily case-law digest (içtihat), 30+ legal calculators (hesaplama), citizen guides (vatandaş rehberi / bilgi), lecture notes (ders notları), articles (makaleler), a legal-term glossary (kavram), and a **paid Yargıtay archive** (`/yargi-kararlari`) at 500 TL / 30 days. The archive is membership-only; decisions are read on-site with no file download. That price is digital-content access, not attorney/consultation fees (TBB advertising-ban still forbids publishing legal-service fees).

## Product Purpose

Dual-purpose site on one Next.js codebase: (a) an attorney's professional presence, compliant with Turkish Bar Association advertising restrictions, built to reach consultation/case clients in and around Van/Erciş; (b) a large open-access Turkish legal reference and tooling platform (statute search + academic commentary, daily case-law tracking, legal calculators, citizen guides) that exists independently of client acquisition and is further distributed through four companion Android apps for offline use.

## Positioning

An open, free, deeply cross-linked statute-and-commentary archive (8,088 articles across 47 laws, verified word-for-word against mevzuat.gov.tr) tied to practical calculators and daily-updated case law, maintained by a practicing attorney doing doctoral (PhD) work in private law — offered publicly on the same domain that carries the attorney's compliant professional presence. The reference platform's academic rigor is the credibility asset; it is not a marketing funnel dressed up as a library.

## Operating Context

- One Next.js codebase serves two funnels: district/region attorney-marketing pages (see Users §1) and the public reference platform (mevzuat, bilgi/rehber, hesaplama, icthat, ders-notlari, makaleler, kavram).
- **Four companion Android apps** (Capacitor-wrapped web views reusing the same web design system and components, each packaging a subset of the underlying data for offline use): general portal, hesap (calculator-only), icthat (case-law archive), rehber (citizen guide). Distributed via Google Play; store policy requires demonstrable offline functionality. Recorded here as an operating fact, not as a native platform — the design language is the web one, wrapped, not adapted per OS. Native design guidance (iOS/Android HIG) does not apply.
- **Content-quality gate is load-bearing, not cosmetic.** `lib/content-quality.mjs` runs at build/request time to detect template/boilerplate commentary and guide text. A prior corpus-wide measurement found roughly 93% of statute-commentary and citizen-guide sentences were copy-pasted boilerplate, not genuine analysis. Detected boilerplate is hidden from the visible page, the page is marked `noindex`, and a transparent "being rewritten" notice is shown instead. Any future page/component touching this content must preserve that gate rather than assume all commentary is trustworthy.
- Content pipeline: markdown source (`content/mevzuat/<kanunId>/madde-<n>.md`) → generated JSON packs (`content-packs/*.json.gz`) → both the Next.js site and the four apps' offline bundles.
- Daily automated case-law tracking and same-day distribution to X/Twitter are part of the operating rhythm.

## Capabilities and Constraints

- **Turkish Bar Association (TBB) advertising-ban compliance is a hard constraint** across every professional-presence page and all future copy: no outcome/success guarantees, no win-rate or percentage statistics, no named client testimonials or client logos, no published attorney/consultation fee figures. Exception: the Yargıtay archive membership (500 TL / 30 days) is a digital-content price and must stay labeled as such — never as vekâlet or danışmanlık ücreti.
- Legal figures that change on a periodic/statutory schedule (kıdem tavanı, faiz oranı, hakem heyeti parasal sınırı, imar ceza tutarları, and the like) are never hardcoded as static prose in this codebase — content links to the relevant calculator instead of stating a number that will go stale.
- Practice areas on the attorney-services pages: ceza (criminal), aile (family), miras (inheritance), gayrimenkul (real estate), iş (labor), ticaret (commercial), icra-iflas (enforcement/bankruptcy), idare (administrative), arabuluculuk (mediation).
- Reference-platform content types and current state: mevzuat (statute text + commentary, 47 laws / 8,088 articles — official text fully verified; commentary mostly template pending rewrite, ~95 articles hand-verified), vatandaş rehberi / bilgi (~554 guides, 33 hand-verified and published, remainder withheld), hesaplama (30+ calculators), içtihat (daily case-law digest — citation metadata only, no full decision text in the local archive), ders notları (lecture notes — currently fully withdrawn pending rewrite), makaleler (articles), kavram (glossary).
- Terminology: "şerh" = academic commentary appended below a statute article's official text (a separate block from the statute itself); "içtihat" = case law; "madde" = statute article.

## Brand Commitments

- Name: Av. Fethi Güzel — Avukat & Arabulucu (lawyer & mediator). Based in Erciş, Van, Turkey; office address and map data live in `lib/profile.ts` as the single source of truth (also feeds SEO, schema, About, Footer).
- Credentials stated on-site: doctoral (PhD) work in private law (medeni hukuk, borçlar, ticaret, medeni usul ekseninde); published monograph on e-duruşma (Seçkin Yayıncılık); professional working proficiency in English.
- Existing visual identity (in code; not yet in DESIGN.md): forest green primary `#2E4036`, burnt-orange accent `#CC5833`, cream `#F2F0E9` and off-white surface `#FFFEFA` backgrounds, charcoal `#1A1A1A` text. Type: Plus Jakarta Sans (sans/body), Outfit (heading), Cormorant Garamond italic (accent/"drama" serif), IBM Plex Mono (labels/mono).
- Social presence: Instagram @av.fethiguzel, X/Twitter @avfethiguzel (auto-posts daily case-law updates).
- Portrait and brand imagery already exist under `/public/images/`.

## Evidence on Hand

- Structured profile data (name, credentials, office address, languages, social links, book) lives in `lib/profile.ts`.
- 8,088 statute articles across 47 laws; official text verified word-for-word against mevzuat.gov.tr source PDFs (17.08.2026 rebuild — see `docs/RESMI-METIN-ONARIMI.md`).
- Only 33 citizen guides and ~95 statute commentaries are currently hand-verified. The rest of the ~554 guides and ~8,087 commentaries are known template boilerplate, hidden and noindexed pending rewrite — do not present them as authoritative in any new work.
- No client testimonials, case results, or named client references exist, and none may be fabricated (advertising-ban constraint above).
- Attorney/consultation fees are not published. The only listed price is Yargıtay archive membership: 500 TL per 30 days (`lib/uyelik/config.ts`).

## Product Principles

1. Two audiences, two paths, one codebase — client-acquisition pages and the open reference platform are built and judged separately, never blended into one generic funnel.
2. Never present what hasn't been verified — statute text is checked byte-for-byte against the official source; commentary and guides are gated by a mechanical quality check before being shown as authoritative; figures that change periodically link to their calculator instead of being hardcoded.
3. Advertising-ban compliance is structural, not stylistic — no outcome promises, no fabricated social proof, no published fees, on every current and future page.
4. The reference platform's academic credibility is the trust asset that also supports the attorney-services side of the site — the two halves reinforce each other while staying functionally distinct.

## Accessibility & Inclusion

Bilingual audience awareness: an English-speaking-lawyer page serves non-Turkish-speaking clients, but the primary content language throughout the site is Turkish. No further product-specific accessibility requirement has been established.
