---
target: Hukuk Asistanı mobil uygulama - ana ekran ve dört bölüm
total_score: 28
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-08-17T19-50-07Z
slug: mobile-app-src-src-apps-asistanapp-tsx
---
Method: dual-agent (A: a2771c54683daab81 · B: ab49d52b6886ee577)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3/4 | Offline banner, loading skeletons, refresh spinner all present. Docked: bottom nav bolds "Ana" while actually on /diger or /ayarlar — confirmed by screenshot. |
| 2 | Match System / Real World | 3/4 | Correct legal terms, apt icons, "§" mark works. Docked for calculator emoji that don't map intuitively (🔏 for "Saklı Pay"). |
| 3 | User Control and Freedom | 3/4 | Good back-button/search-clear handling. Docked: "Tüm yerel verileri sil" is one tap, irreversible, no confirmation. |
| 4 | Consistency and Standards | 2/4 | Card patterns consistent; tint colors and icon language (Lucide vs. emoji) are not — confirmed by detector's `overused-font` firing on 5/6 screens. |
| 5 | Error Prevention | 2/4 | Good defensive coding generally, but MorePage renders a dead heading with no length guard — confirmed empty by screenshot. |
| 6 | Recognition Rather Than Recall | 4/4 | Search placeholders teach query syntax by example across all four sections; genuine strength. |
| 7 | Flexibility and Efficiency | 3/4 | "TBK 13" direct-jump works well. Unevenly applied: Hesap has "recent" list, Mevzuat (highest-frequency lawyer surface) doesn't. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Calm layout, but detector confirms flat type hierarchy (1.5–1.9:1 ratio, below the 2.0 floor) on every single screen — the intended heading/mono/body distinction isn't reaching the render. |
| 9 | Error Recovery | 4/4 | ErrorBoundary/EmptyState copy is calm, specific, actionable in Turkish throughout. |
| 10 | Help and Documentation | 1/4 | No onboarding/glossary; "ŞERH" badge appears with zero in-app explanation. |

**Total: 28/40 (Acceptable band — significant improvements needed before users are happy, but the foundation is solid.)**

## Design Specificity Verdict

**Content is specific; the shell is generic and half-delivered.** Real statute abbreviations, real article/decision counts, real calculator names, a "§" brand mark — this isn't a labels-swapped template. But the one typographic device meant to give the app a distinct voice, the Cormorant Garamond "drama" serif, is declared in `tailwind.config.mjs` and never loaded or ever referenced by any component. The deterministic scan independently confirms the downstream effect at the pixel level: `overused-font` (a single typeface running 91–99% of visible text) fired on 5 of 6 screens, and `flat-type-hierarchy` (size-ratio below 2.0) fired on all 6 — two different measurement methods (source-reading and rendered-DOM inspection) converging on the same conclusion without seeing each other's work. One tap from the home screen, the Lucide-icon grammar the new home screen establishes is also abandoned for full-color emoji in Hesaplama.

**Overlay note:** browser injection succeeded and captured real console findings on all 6 screens (detail below), but the assessment ran in an isolated background process that has already been torn down — there is no live `[Human]`-tab overlay open right now for you to click through. The six screenshots the design review took are saved and I've inspected two of them directly (linked below) to confirm the findings myself before writing this report.

## Overall Impression

The bones are good — real offline-first architecture, calm and specific error/empty copy, a search pattern that teaches itself. What's missing is finishing, not rethinking: a typography system that was designed but never shipped, one section (Diğer) that ships visibly empty, and a navigation state bug that tells users they're on the wrong screen. None of the five priority issues below require a redesign; all five are concrete, boundable fixes.

## What's Working

1. **Offline-first is real product thinking, not just a claim.** The cache → seed → network fallback chain plus the honest, non-blocking offline banner ("Çevrimdışısınız — indirilmiş içerik ve hesaplamalar çalışmaya devam eder") is exactly right for a tool that has to work in a courthouse with no signal.
2. **Error/empty-state copy is calm and specific everywhere, not just on a showcase screen.** "Verileriniz cihazınızda duruyor; yeniden başlatmak çoğu durumda yeterli oluyor" reassures without being condescending — held consistently across all four sections.
3. **Search placeholders teach by example, as a system.** "TBK 13" genuinely jumps straight to the article. This is recognition-over-recall executed everywhere, not a one-off flourish.

## Priority Issues

**[P1] "Diğer" screen ships with a visibly empty section.**
Why it matters: `SIBLINGS` now filters to zero apps (all four standalone apps were marked `published:false` in today's merge), but `MorePage.tsx` never guards the "Aynı ailedeki diğer uygulamalar" heading on that being empty. Confirmed by screenshot: the heading renders, then blank space, then the next section starts. This is the single most "looks unfinished" moment in the app, one tap from Home — exactly what a Play reviewer or a skeptical lawyer sizing up the app would notice first.
Fix: wrap the section in a length check (`{SIBLINGS.length > 0 && (...)}`) in `mobile/app-src/src/shell/MorePage.tsx`.
Suggested command: `/impeccable polish`

**[P1] The brand typography system is declared but never ships.**
Why it matters: no `@font-face`/`<link>`/`@import` for Plus Jakarta Sans, Outfit, IBM Plex Mono, or Cormorant Garamond exists anywhere — confirmed absent in both source and the built output. Independently, the detector measured the downstream effect on every screen it visited: a single fallback typeface at 91–99% of visible text, and a type-scale ratio (1.5–1.9:1) below the 2.0 threshold that would read as genuine hierarchy. This is two independent methods (code-reading, rendered-DOM measurement) reaching the same conclusion without seeing each other's output — the strongest-evidenced finding in this report.
Fix: self-host the four font files (not a CDN link — this is an offline-first app, store policy requires it to work with no network) and wire real `@font-face` declarations into `app.css`; then re-establish a real size scale so headings, mono labels, and body text are visually distinct at a glance.
Files: `mobile/app-src/index.html`, `mobile/app-src/src/app.css`, `mobile/tailwind.config.mjs`.
Suggested command: `/impeccable typeset`

**[P2] Rehber's category badges: 100+ undersized-text instances concentrated on one screen.**
Why it matters: the detector counted 107 `undersized-ui-text` findings on `/rehber` alone (vs. 5 on every other screen) — the small "N rehber" captions under all 8+ category tiles and the tiny uppercase category label ("EŞYA", "USUL"...) repeated above every one of the 94 guide cards. I opened the screenshot myself: it's real, and it's the same pattern repeated at scale rather than one bad element. This is Sam's (accessibility persona) and Jordan's (anxious-first-timer persona) screen — exactly the audience least equipped to strain through sub-11px text.
Fix: raise the category-count caption and card-eyebrow label to at least an 11–12px floor; consider whether 8+ equal-weight category tiles at once (also flagged as a cognitive-load "≤4 visible options" failure) should progressively disclose instead.
Suggested command: `/impeccable typeset`, then `/impeccable layout`

**[P2] Bottom navigation shows the wrong active tab on shell routes.**
Why it matters: `activeTabId()` falls back to "Ana" whenever the current route isn't one of the four content sections — which is exactly true on `/diger` and `/ayarlar` by design. Confirmed by screenshot: standing on the More page, the nav bar bolds and colors "Ana" as if you were on the home screen. This is a direct Nielsen #1 violation — the app is telling the user something false about where they are.
Fix: give the nav a fifth (unhighlighted-by-default) state for shell routes, or treat `/diger`/`/ayarlar` as extensions of whichever tab launched them rather than defaulting to tab zero.
File: `mobile/app-src/src/lib/nav.ts`.
Suggested command: `/impeccable polish`

**[P2] Icon language breaks one tap from the screen it was just established on.**
Why it matters: `AsistanApp.tsx` sets up tinted Lucide-icon squares as the app's visual grammar across all four home cards. `HesapApp.tsx`'s 33 tool entries use full-color emoji instead (🏛️🔏💼🔄📑⏰...). The root cause predates today's merge (it's in the shared `components/hesaplama/HesaplamaTools.tsx`), but it's now the very next screen after the one this session built, and it's core evidence for the design-specificity verdict above.
Suggested command: `/impeccable polish` (scoped to Hesaplama's tool-list icons)

## Persona Red Flags

**Alex (power-user lawyer, daily case work).**
- Opens İçtihat first thing → every visible "today" card duplicates its own title as its summary with a stray `—`/`-` artifact. First content of the day looks broken.
- "TBK 13" search works exactly as advertised — genuine win.
- Wants to re-open yesterday's madde → no "recently viewed" in Mevzuat, unlike Hesap's equivalent.
- Taps "Diğer" to size up the app (a natural professional-audit move) → hits the dead sibling-apps section at the exact moment they're evaluating trustworthiness.

**Jordan (anxious first-time citizen).**
- Home framing is genuinely good: "Merci, süre ve belge — adım adım" is plain, non-intimidating.
- But Rehber organizes by law-school subject ("Eşya," "Usul," "İdare") rather than by citizen problem — she has to translate her real problem into legal taxonomy before she can even browse, and the category tiles she'd use to do that carry the smallest, least legible text in the app.
- "ŞERH" badges appear with zero in-app explanation anywhere.
- Disclaimer copy is honest rather than falsely reassuring — a real positive specifically for her.

**Sam (accessibility).**
- The 4-step font-scale control in Settings is genuinely well-built (labeled, `aria-pressed`, deliberate reasoning in the code comment).
- But bigger text doesn't fix contrast or the sub-11px floor the detector measured — those stay broken regardless of font-scale setting.
- Icon-only header buttons (40px) and inline search-clear buttons (32px) both sit under the ~44px accessible touch-target convention.
- Real counterweight: every icon-only button carries a correct `aria-label`, and pinch-zoom isn't locked — deliberate choices that shouldn't get lost next to the contrast/size findings.

## Minor Observations

- `#1B4F72` (İçtihat's card tint) has no relationship to the forest-green/burnt-orange brand palette — reads as a leftover from the pre-merge standalone app.
- Guide count is inconsistent across three sources: PRODUCT.md says 33 hand-verified, one code comment says 67, the live build says 94 — likely just docs drift as verification continues, worth reconciling.
- Mevzuat's law list is ordered by descending article count rather than by the "core statutes" the code itself already privileges elsewhere for search — worth a second look for the lawyer persona.
- App forces light mode with no override — a reasonable brand-consistency trade, not a defect, just noted.
- The detector's `kicker-above-heading` flag on the home screen (the "AV. FETHİ GÜZEL" eyebrow above "Hukuk Asistanı") is almost certainly a deliberate, correct pattern rather than a real problem — noted so it doesn't get "fixed" by accident.

## Questions to Consider

1. If none of the four standalone apps will ever be `published: true` again, should the sibling-apps concept be deleted outright rather than patched to hide gracefully?
2. Both Rehber and Hesaplama organize their primary browse surface by legal subject-matter category. Has this been tested on someone who doesn't yet know their problem is legally called "Eşya Hukuku"?
3. Three documents give three different guide counts (33 / 67 / 94) — which is authoritative right now, and does the content-quality gate PRODUCT.md describes as load-bearing actually cover what ships in this bundle specifically?
