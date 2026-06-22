# Core components

## `ExpectumPage`

**File:** `components/ExpectumPage.tsx`

**Purpose:** Shared page frame for most public and authenticated pages.

**Used by:** The landing page and nearly all current Expectum pages except the
two legacy standalone pages (`/movement-map` and `/theme-evolution`).

**Architectural notes:**

- owns the full-height `h-screen` frame;
- renders `ExpectumBackground`, `ExpectumHeader`, and `ExpectumFooter`;
- keeps the middle region independently scrollable;
- vertically centers short content through an inner `min-h-full` wrapper;
- accepts page-specific footer links;
- does not provide authentication by itself.

## `ExpectumHeader`

**File:** `components/ExpectumHeader.tsx`

**Purpose:** Global Expectum mark and authenticated primary navigation.

**Used by:** `ExpectumPage`.

**Architectural notes:**

- subscribes directly to Supabase auth state;
- hides participant navigation on known public paths;
- exposes `Kohtumine`, `Teekond`, and `Mälu`;
- computes active states for route families;
- currently uses ordinary `<a>` navigation.

The `publicPaths` list is a display decision, not a route-security boundary.

## `ExpectumFooter`

**File:** `components/ExpectumFooter.tsx`

**Purpose:** Centralized footer navigation and auth-sensitive action.

**Used by:** `ExpectumPage`.

**Architectural notes:**

- accepts typed `ExpectumFooterLink` entries;
- uses Next.js `Link` for footer links;
- uses `ExpectumSymbol` with the `footer` size;
- renders a single `AuthStatus` on the right;
- has no border, divider, shadow, or background of its own.

## `AuthStatus`

**File:** `components/AuthStatus.tsx`

**Purpose:** Displays either `Ava kohtumine` or the dynamic `Välju` action.

**Used by:** `ExpectumFooter`.

**Architectural notes:**

- reads the current Supabase user;
- subscribes to `onAuthStateChange`;
- signs out explicitly before navigating to `/return`;
- also signs out when mounted on `/return`;
- can report user changes through an optional callback.

## `ExpectumSymbol`

**File:** `components/ExpectumSymbol.tsx`

**Purpose:** Renders the symbolic visual vocabulary used across Expectum.

**Used by:** Header, footer, sections, cards/pages, and route-specific labels.

**Architectural notes:**

- supports `meeting`, `echo`, `theme`, `direction`, `path`, `memory`, and
  `aim`;
- supports `header`, `footer`, `card`, and `hero` sizes;
- balances individual glyphs with per-symbol scale ratios;
- is decorative and sets `aria-hidden="true"`.

## `ExpectumSection`

**File:** `components/ExpectumSection.tsx`

**Purpose:** Standard centered section heading, label, symbol, intro, and
content container.

**Used by:** The Expectum explanation, Aim memory, path, themes, trajectory,
shared-insight, collective-echo, and admin shared-insight pages.

**Architectural notes:**

- standardizes heading hierarchy and readable widths;
- composes `ExpectumSymbol`;
- accepts a class override for wider sections;
- contains no data or auth logic.

## `ExpectumCard`

**File:** `components/ExpectumCard.tsx`

**Purpose:** Standard quiet bordered content surface.

**Used by:** Aim memory, journey, path, themes, trajectory, shared insights,
collective echo, and shared-insight administration.

**Architectural notes:**

- provides optional uppercase label text;
- preserves line breaks in content;
- contains no interaction or persistence logic;
- accepts additional classes for page-specific layout.

## `ExpectumMemoryCard`

**Requested architectural name:** `ExpectumMemoryCard`

No `components/ExpectumMemoryCard.tsx` file or imports of this component exist
in the current repository.

**Needs verification:** determine whether this name refers to the ad hoc cards
rendered from `memoryLinks` in `app/settings/page.tsx`, or to a component
planned but not yet implemented. This documentation does not invent or add the
component.

## `ExpectumButton`

**File:** `components/ExpectumButton.tsx`

**Purpose:** Shared pill-shaped action/link styling.

**Used by:** Landing, question, reflection, history, journey, trajectory, and
settings pages.

**Architectural notes:**

- renders an `<a>` when `href` is provided;
- otherwise renders a `<button>`;
- supports `primary` and `soft` variants;
- forwards `onClick`, `type`, `disabled`, and extra classes;
- does not use Next.js `Link`.

## `ExpectumBackground`

**File:** `components/ExpectumBackground.tsx`

**Purpose:** Fixed decorative page background.

**Used by:** `ExpectumPage`.

**Architectural notes:**

- creates a base color and two blurred breathing shapes;
- is pointer-transparent and decorative;
- animation behavior is defined in `app/globals.css`;
- reduced-motion users receive no animation.

## `ExpectumAuthGate`

**File:** `components/ExpectumAuthGate.tsx`

**Purpose:** Client-side participant-page authentication gate.

**Used by:** Attunement, question, reflection, journey, memory, path, theme,
trajectory, history, timeline, statistics, profile, and related participant
pages.

**Architectural notes:**

- checks `supabase.auth.getUser()`;
- subscribes to Supabase auth-state changes;
- sends unauthenticated users to `/enter`;
- renders a loading message while checking;
- is a client-side gate, not server middleware.

Server-side authorization and database Row Level Security remain separate
concerns and are **Needs verification**.
