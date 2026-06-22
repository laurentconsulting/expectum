# Settings Link Card Decision

## Overview

This is a documentation-only design decision note. It does not modify
`app/settings/page.tsx`, shared components, styling, routes, prompts, Supabase
logic, auth, memory behavior, deployment settings, or legacy pages.

The question: should the memory navigation links on `app/settings/page.tsx`
remain direct navigation anchors, or should they become `ExpectumCard`-based
link cards in a future design consistency pass?

## Current State

The Mälu page currently renders its memory links as direct `<a>` elements. Each
link is visually card-like:

- rounded corners;
- warm border;
- translucent white background;
- quiet title and supporting text;
- hover state;
- optional wide layout for the Koond link.

These elements are not passive content cards. They are navigation choices. Their
primary role is to move the user from Mälu into related memory/path areas:

- Kohtumised;
- Kaja;
- Liikumise ajajoon;
- Liikumise märkamised;
- Teema;
- Salvestatud suunad;
- Jagatud Kaja;
- Ühine Kaja;
- Koond.

## Why They Are Navigation Anchors

The current anchor implementation is semantically simple and direct. It makes
each card-like item an actual link without needing a wrapper abstraction.

This matters because the page is not only showing memory information. It is
offering quiet doors into other memory spaces. The current implementation keeps
that behavior explicit:

- the whole item is clickable;
- the target route is visible in the markup;
- no component abstraction hides the fact that these are links;
- keyboard and browser link behavior remain straightforward.

The design-system issue is not that the current elements are wrong. The issue is
that they repeat card styling manually, while newer consistency passes are
moving repeated passive panels toward `ExpectumCard`.

## Should They Become `ExpectumCard`-Based Link Cards?

Recommended direction: **yes, but only after a small link-card pattern is
decided.**

The Settings memory links should not be converted by simply wrapping
`ExpectumCard` inside an anchor or an anchor inside `ExpectumCard` without a
clear pattern. A future implementation should preserve link semantics while
aligning visual treatment.

Possible future models:

1. Add an optional `href` mode to `ExpectumCard`.
2. Create a small `ExpectumLinkCard` component.
3. Leave navigation anchors as anchors, but extract shared class treatment.

Recommended smallest safe model: create a small `ExpectumLinkCard` only if at
least one more page needs the same card-like navigation pattern. If Settings is
the only current case, a local, careful cleanup may be enough.

**Needs decision:** whether Expectum wants a shared link-card component or only
localized cleanup for `app/settings/page.tsx`.

## Risks Of Changing Navigation Cards Too Early

Changing these cards too early could introduce avoidable drift:

- link semantics could become less clear;
- keyboard or browser navigation behavior could accidentally change;
- hover/focus behavior could shift;
- the wide Koond item could lose its layout role;
- the page could start to feel like a dashboard rather than a quiet memory map;
- a generic card component could make navigation feel like passive content;
- a broad abstraction could encourage adding more links instead of reducing
  noise.

The Mälu page is especially sensitive because it gathers many nearby memory
destinations. Visual consistency should reduce noise, not make the page feel
more like a control panel.

## Preserving The Quiet Mälu Feeling

Any future link-card implementation should preserve:

- quiet, low-pressure navigation;
- clear distinction between memory spaces without over-explaining them;
- full-card clickability;
- existing route targets;
- existing labels and descriptions unless separately reviewed;
- the optional wide layout for Koond;
- warm, low-contrast card treatment;
- the page's role as orientation, not measurement or dashboard.

The link cards should feel like doors in a quiet room, not feature tiles.

## Recommended Smallest Safe Future Implementation

1. Do not change `app/settings/page.tsx` until the link-card pattern is chosen.
2. Confirm whether any other page needs the same card-like navigation pattern.
3. If Settings is the only clear case, keep the implementation local and change
   only class duplication where parity is exact.
4. If another page needs the same pattern, create a small `ExpectumLinkCard`
   component with:
   - required `href`;
   - title;
   - text;
   - optional `className`;
   - preserved full-card anchor semantics.
5. Convert only the Settings memory links in the first implementation.
6. Do not change memory clearing behavior, routes, auth, Supabase logic, or
   visual language.
7. Run `npm run build`.

Recommended first implementation, if approved later:

- create or choose a link-card pattern;
- convert only the `memoryLinks.map(...)` card-like anchors in
  `app/settings/page.tsx`;
- preserve all labels, descriptions, `href` values, grid behavior, hover state,
  and the wide Koond layout.

