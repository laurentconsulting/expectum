# EXPECTUM Design System Audit 1.0

## Overview

This is a documentation-only audit. It does not modify application code,
styling, routes, prompts, Supabase logic, deployment settings, database schema,
or runtime behavior.

Goal: verify whether the current application feels like one coherent Expectum
space, and identify the smallest safe design-finish work that would improve
alignment, consistency, and visual quietness without creating a new visual
language.

This audit is based on repository inspection of the current App Router pages,
core components, global CSS, and architecture documentation. It is not a full
browser/device visual QA pass.

**Needs verification:** live screenshot review on mobile and desktop after any
future design-finish implementation.

### Audited page files

- `app/page.tsx`
- `app/aim/page.tsx`
- `app/aim-memory/page.tsx`
- `app/attunement/page.tsx`
- `app/attunement-question/page.tsx`
- `app/collective-echo/page.tsx`
- `app/enter/page.tsx`
- `app/expectum/page.tsx`
- `app/expectum-language/page.tsx`
- `app/history/page.tsx`
- `app/human-and-ai/page.tsx`
- `app/journey/page.tsx`
- `app/journey-reflections/page.tsx`
- `app/landmarks/page.tsx`
- `app/movement-map/page.tsx`
- `app/path/page.tsx`
- `app/pause/page.tsx`
- `app/profile/page.tsx`
- `app/question/page.tsx`
- `app/reflection/page.tsx`
- `app/return/page.tsx`
- `app/settings/page.tsx`
- `app/shared-insights/page.tsx`
- `app/statistics/page.tsx`
- `app/symbols/page.tsx`
- `app/theme-evolution/page.tsx`
- `app/themes/page.tsx`
- `app/timeline/page.tsx`
- `app/trajectory/page.tsx`
- `app/trajectory-history/page.tsx`
- `app/admin/shared-insights/page.tsx`

### Audited component files

- `components/ExpectumPage.tsx`
- `components/ExpectumHeader.tsx`
- `components/ExpectumFooter.tsx`
- `components/ExpectumCard.tsx`
- `components/ExpectumSection.tsx`
- `components/ExpectumMemoryCard.tsx` — not present in the current repository
- `components/ExpectumButton.tsx`
- `components/ExpectumSymbol.tsx`
- `components/ExpectumBackground.tsx`
- `components/AuthStatus.tsx`
- `components/ExpectumAuthGate.tsx`
- `app/globals.css`
- `app/layout.tsx`

**Needs verification:** whether `ExpectumMemoryCard` was intentionally removed,
renamed, or planned but never added. It is referenced by earlier documentation
requirements but is not present as a component file in the current repository.

## Consistent Elements

### Page frame

`ExpectumPage` is the strongest design-system anchor. It provides:

- the full-screen frame;
- hidden outer overflow;
- a fixed-position feeling for header and footer;
- a scrollable center region;
- the shared background;
- consistent page text color;
- the centralized footer.

Most current user-facing pages use `ExpectumPage`. This gives the application a
recognizable spatial structure even when individual page content varies.

`ExpectumHeader` and `ExpectumFooter` now form a coherent frame pair. Header and
footer both use small uppercase navigation, muted brown-gray text, quiet hover
states, and `ExpectumSymbol` for symbolic anchors. The centralized footer change
has significantly reduced page-level drift.

### Background and atmosphere

`ExpectumBackground` and `app/globals.css` create a stable visual atmosphere:

- warm off-white base;
- soft blurred background movement;
- reduced-motion handling for breathing animations;
- restrained, low-contrast motion.

This is one of the clearest strengths of the current design system. The space
feels calmer than a typical product interface.

### Color language

The app mostly stays within the same palette:

- text: `#4f4942`, `#5f574f`, `#6d655d`, `#8a8278`;
- accent: `#8b642f`, `#b78a4a`, `#c9a36a`;
- borders: `#d7b985`, `#efe6d9`, `#d8d1c7`;
- backgrounds: `#faf7f2`, `#f7f1e8`, `white/45`, `white/50`, `white/55`,
  `white/60`.

No new colors are recommended. The existing palette is coherent enough; the
main issue is not color invention but repeated one-off application.

### Typography voice

Across most pages, headings use light weight, large size, and generous leading.
Labels use uppercase text with wide tracking. Body text uses relaxed or loose
leading and restrained color. This creates a recognizable Expectum rhythm:
spacious, quiet, and non-dashboard-like.

### Symbol system

`ExpectumSymbol` now supports `header`, `footer`, `card`, and `hero` sizes. The
same symbol vocabulary appears in header, footer, concept pages, and many page
headers. This helps bind the product together.

### Buttons

`ExpectumButton` provides a consistent rounded button treatment. It is used by
key flow pages such as the home page, question/reflection flow, journey,
trajectory, settings, and history. The button system is directionally sound.

### Core card rhythm

`ExpectumCard` gives newer memory/path/collective pages a consistent card
language:

- rounded `2rem` corners;
- light border;
- translucent white background;
- generous padding;
- optional uppercase label.

Where used, it reduces page-specific styling noise.

## Inconsistent Elements

### Legacy pages outside the shared frame

Two routes still bypass `ExpectumPage` and render their own `<main>` frame:

- `app/movement-map/page.tsx`
- `app/theme-evolution/page.tsx`

These pages use related colors and card-like shapes, but they do not use the
central Expectum frame, header, footer, background, or auth gate conventions.
They visually feel like earlier standalone experiments rather than fully joined
rooms inside the current system.

This audit does not recommend removing them in this PR. It confirms that they
remain the clearest visual consistency risk.

### Manual section headers instead of `ExpectumSection`

Many pages repeat the same section pattern manually:

- centered `section`;
- small uppercase symbolic label;
- `ExpectumSymbol size="header"`;
- large light heading;
- supporting intro text.

Examples include:

- `app/aim/page.tsx`
- `app/attunement/page.tsx`
- `app/attunement-question/page.tsx`
- `app/enter/page.tsx`
- `app/history/page.tsx`
- `app/journey/page.tsx`
- `app/journey-reflections/page.tsx`
- `app/landmarks/page.tsx`
- `app/pause/page.tsx`
- `app/profile/page.tsx`
- `app/question/page.tsx`
- `app/reflection/page.tsx`
- `app/settings/page.tsx`
- `app/statistics/page.tsx`
- `app/timeline/page.tsx`
- `app/trajectory-history/page.tsx`

This is not visually broken. The repeated pattern is mostly coherent. The risk
is maintenance drift: small spacing, tracking, margin, and intro-text variations
will accumulate over time.

### Manual card patterns instead of `ExpectumCard`

Several pages manually recreate card treatment with:

- `rounded-3xl`;
- `border border-[#d7b985]`;
- `bg-white/45` or nearby variants;
- `p-8`;
- text-left layout.

Examples include:

- `app/aim/page.tsx`
- `app/expectum/page.tsx`
- `app/expectum-language/page.tsx`
- `app/history/page.tsx`
- `app/human-and-ai/page.tsx`
- `app/journey-reflections/page.tsx`
- `app/landmarks/page.tsx`
- `app/pause/page.tsx`
- `app/profile/page.tsx`
- `app/settings/page.tsx`
- `app/statistics/page.tsx`
- `app/symbols/page.tsx`
- `app/timeline/page.tsx`
- `app/trajectory-history/page.tsx`

This is the biggest design-system duplication after the page frame. The visual
language is consistent enough for users, but implementation is duplicated and
therefore fragile.

### Button-like anchors still appear manually

Some pages use manual `<a>` or `<button>` styles that visually match
`ExpectumButton` but do not use it. This is acceptable today and should not be
mass-refactored casually, but it remains a future drift point.

Examples include:

- `app/attunement/page.tsx`
- `app/pause/page.tsx`
- `app/movement-map/page.tsx`
- `app/theme-evolution/page.tsx`
- `app/admin/shared-insights/page.tsx`

### Route purpose and visual weight

Pages such as `history`, `timeline`, `statistics`, `path`, `journey`,
`journey-reflections`, `themes`, and `trajectory-history` are visually similar
and conceptually adjacent. This is partly appropriate because they are all
memory/path views. The risk is that they can begin to feel like multiple
versions of the same dashboard.

The design issue is not that they share patterns. The issue is that their
visual hierarchy does not always clarify why this page exists separately from
nearby pages.

### `ExpectumMemoryCard`

The requested audit list includes `ExpectumMemoryCard`, but the repository does
not currently contain `components/ExpectumMemoryCard.tsx`. Memory-related pages
use `ExpectumCard` or manual card styles instead.

**Needs verification:** whether a dedicated memory-card abstraction is still a
product/design goal. If not, documentation should stop referring to it as a core
component.

## Empty State Audit

Current empty states are generally gentle and aligned with the product voice.
Examples include:

- `app/path/page.tsx` shows quiet cards such as `Kohtumine`, `Kaja`, `Teema`,
  `Liikumise märkamine`, `Suund`, `Jagatud Kaja`, and `Mälu hoiab` when there is
  little or no path material.
- `app/history/page.tsx`, `app/journey-reflections/page.tsx`,
  `app/timeline/page.tsx`, `app/trajectory-history/page.tsx`, and
  `app/landmarks/page.tsx` use card-like empty-state messages.
- `app/shared-insights/page.tsx` and `app/collective-echo/page.tsx` show quiet
  loading and absence states through `ExpectumCard`.
- `app/themes/page.tsx` uses `ExpectumCard` for loading and empty theme states.
- `app/statistics/page.tsx` keeps the empty state simple inside one card.

Strength: empty states usually avoid product pressure. They do not push users
into action aggressively.

Inconsistency: empty states are written and styled page-by-page. Some use
`ExpectumCard`; others use manual rounded cards; some use a simple paragraph.
This is acceptable now, but future finish work could define one or two standard
empty-state patterns.

Smallest safe improvement: document and later extract a quiet empty-state
pattern only after confirming the exact recurring copy and spacing needs. Do not
invent new empty-state visuals.

## Mobile Audit

This is a code-level audit only.

Strengths:

- Most pages use responsive Tailwind prefixes such as `md:text-6xl`,
  `md:flex-row`, `md:grid-cols-2`, and `md:grid-cols-[1fr_auto_1fr]`.
- `ExpectumFooter` collapses to one column on smaller screens and becomes a
  three-column footer on medium screens.
- `ExpectumHeader` navigation wraps, which reduces immediate overflow risk.
- `ExpectumPage` keeps only the center content scrollable, preserving the frame.

Risks:

- Header plus footer plus `h-screen` can leave limited center space on small
  screens, especially when browser UI is visible.
- Wide tracking on labels and navigation may feel dense on narrow screens.
- Manual pages with large `p-8`, `mb-12`, `mb-16`, or `mt-20` spacing can become
  visually heavy on mobile.
- `app/reflection/page.tsx` and `app/history/page.tsx` contain nested scrollable
  regions that should be checked carefully on small screens.
- Legacy routes `movement-map` and `theme-evolution` do not use the same mobile
  frame as the rest of the app.

**Needs verification:** browser screenshots for at least root, enter,
reflection, settings, path, history, timeline, journey, trajectory, collective
resources, and legacy routes at mobile width.

## Desktop Audit

This is a code-level audit only.

Strengths:

- The `max-w-6xl` frame in `ExpectumPage` keeps the app from becoming too wide.
- Most content sections constrain to `max-w-3xl`, `max-w-4xl`, or `max-w-5xl`.
- Desktop typography is spacious and visually calm.
- Cards generally have enough breathing room.
- The fixed header/footer frame gives the app a strong room-like identity.

Risks:

- Some dense memory pages can start to feel like dashboards because many cards
  have equal visual weight.
- Page-specific cards with `bg-white/45`, `bg-white/50`, `bg-white/55`, and
  `bg-white/60` are close enough visually, but repeated variations may become
  noisy over time.
- Very long explanatory pages such as `expectum`, `expectum-language`, and
  `symbols` have their own internal structure and could drift from the newer
  `ExpectumSection`/`ExpectumCard` system.

**Needs verification:** desktop screenshot pass after any future card/section
consolidation.

## Visual Noise Findings

### 1. Legacy independent frames

`movement-map` and `theme-evolution` are the clearest visual outliers because
they bypass the central page frame. This repeats earlier navigation and page
reduction findings.

### 2. Many card equivalents

There are three main card treatments in practice:

1. `ExpectumCard`;
2. manual rounded cards using `border-[#d7b985] bg-white/45 p-8`;
3. specialized nested scroll/card treatments in history/reflection/admin pages.

The visual family is coherent, but implementation duplication increases drift.

### 3. Many section equivalents

`ExpectumSection` exists, but many pages manually render the same symbolic
section header. This is not an urgent problem, but it is a strong candidate for
future reduction.

### 4. Dashboard gravity

Memory-related routes risk becoming too count/card/list heavy. The issue is not
visual loudness in color; it is conceptual and structural visual noise: many
quiet cards can still become a dashboard when too many similar summaries sit at
the same hierarchy level.

Affected pages include:

- `app/path/page.tsx`
- `app/history/page.tsx`
- `app/timeline/page.tsx`
- `app/statistics/page.tsx`
- `app/journey-reflections/page.tsx`
- `app/trajectory-history/page.tsx`
- `app/profile/page.tsx`

### 5. Footer/header strength exposes page-level drift

The centralized frame now makes outlier pages more visible. That is good: the
system has a stable reference point. Future cleanup can be small and targeted.

## Smallest Safe Improvements

These are implementation candidates only. This audit does not change code.

1. **Convert legacy pages to the shared frame or retire them.**
   - Candidate files: `app/movement-map/page.tsx`,
     `app/theme-evolution/page.tsx`.
   - Benefit: removes the largest visual-frame inconsistency.
   - Risk: these routes were previously identified as legacy/hidden; decide
     whether to remove, redirect, or reframe before touching code.

2. **Create or extend one quiet card abstraction only if needed.**
   - Candidate component: existing `ExpectumCard`, or a documented variant.
   - Benefit: reduces repeated card class strings.
   - Risk: a broad conversion could unintentionally change spacing. Do this one
     page family at a time.

3. **Use `ExpectumSection` more consistently for standard page openings.**
   - Benefit: reduces section/header drift.
   - Risk: some pages intentionally need custom hierarchy. Do not flatten all
     pages into the same structure.

4. **Define a small empty-state convention.**
   - Prefer one card-based quiet absence state and one inline quiet message.
   - Benefit: less page-by-page empty-state drift.
   - Risk: avoid turning emptiness into a product prompt or CTA.

5. **Audit nested scroll regions after the central frame fix.**
   - Candidate files: `app/reflection/page.tsx`, `app/history/page.tsx`.
   - Benefit: better mobile usability.
   - Risk: do not break the fixed header/footer and scrollable center frame.

6. **Keep `/profile` quiet.**
   - `app/profile/page.tsx` should remain an orientation page, not become a
     dashboard or major feature.
   - Benefit: aligns with prior product direction.
   - Risk: adding more cards or metrics would increase noise.

## Implementation Note: Symbol Consistency Pass 1.0

The first symbol consistency implementation pass replaced the remaining
hardcoded user-facing Expectum concept symbols found outside
`ExpectumSymbol` itself.

- `app/reflection/page.tsx` now uses `ExpectumSymbol` for the reflection thread
  labels `Kohtumine` and `Aim` instead of hardcoded `○` and `✧` characters.
- `components/ExpectumSymbol.tsx` remains the intentional source of the symbol
  characters and their visual balance.
- No symbol meanings, colors, routes, prompts, Supabase logic, auth, deployment,
  memory behavior, or visual language were changed.

No additional hardcoded concept-symbol UI instances were found during this
pass. Future explanatory symbol pages may intentionally keep prose examples
where replacing them with rendered components would weaken explanation.

## Implementation Note: Card and Section Consistency Pass 1.0

The first card/section consistency implementation pass chose the smallest safe
target from the memory/path overview family: `app/statistics/page.tsx`.

- The statistics summary panel now uses `ExpectumCard` instead of a repeated
  manual rounded card wrapper.
- `ExpectumCard` gained a backward-compatible `contentClassName` option so the
  existing text rhythm can be preserved without changing existing card users.
- The page's existing border, background, padding, text, data loading behavior,
  counts, routes, auth, Supabase logic, memory behavior, and visual language
  were preserved.

Intentional exception: the statistics page header was not converted to
`ExpectumSection` in this pass because the current `ExpectumSection` spacing is
not a one-to-one parity match for this page. Forcing the conversion would be a
layout finish decision rather than an obvious consistency cleanup.

## Implementation Note: Card and Section Consistency Pass 1.0b

The next smallest safe target from the inspected memory/path overview pages was
`app/timeline/page.tsx`.

- Timeline loading, empty, and timeline item panels now use `ExpectumCard`
  instead of repeated manual rounded card wrappers.
- Existing rounded corners, border color, background opacity, padding, text,
  ordering, data loading behavior, routes, auth, Supabase logic, memory
  behavior, and visual language were preserved.

Intentional exceptions:

- `app/path/page.tsx` was left unchanged because it already uses
  `ExpectumSection` and `ExpectumCard`.
- `app/settings/page.tsx` was left unchanged because its repeated card-like
  elements are navigation anchors; converting them to `ExpectumCard` would need
  a separate link-card decision.
- The Timeline page header was not converted to `ExpectumSection` because the
  current spacing is not a one-to-one parity match.

## Recommended Design Finish Pass

A safe future design finish pass should be deliberately small:

1. Confirm product decision for `movement-map` and `theme-evolution`: remove,
   redirect, or bring into `ExpectumPage`.
2. Pick one page family for card consolidation, preferably memory/path pages,
   and convert only where class parity is obvious.
3. Pick one page family for `ExpectumSection` consolidation, preserving pages
   that need custom rhythm.
4. Define empty-state wording/layout conventions in documentation before broad
   implementation.
5. Run mobile and desktop screenshot review after each small pass.

Do not introduce new colors. Do not redesign the app. Do not add a new visual
language. Expectum already has the right atmosphere; the next design work should
mostly remove duplicated implementation and quiet the places where adjacent
pages compete for the same role.
