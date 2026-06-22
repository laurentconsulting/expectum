# Expectum Architecture 1.0

This document describes the architecture represented by the `main` branch of
`laurentconsulting/expectum` on June 22, 2026.

## System shape

Expectum is a single Next.js application containing:

- public explanatory pages;
- Supabase-authenticated participant pages;
- server-side API route handlers;
- a mixed local and Supabase-backed memory layer;
- OpenAI-backed reflection and noticing flows;
- a hidden shared-insight administration page.

The browser renders the page UI, stores active-flow, derived, and compatibility
data in `localStorage`, and uses the Supabase browser client for authentication
and participant-associated records. Next.js route handlers call OpenAI and
perform service-role Supabase operations.

```text
Browser
  ├─ Next.js App Router pages and React client components
  ├─ Tailwind utility classes
  ├─ localStorage
  └─ Supabase browser client
       ├─ authentication
       └─ participant-owned records

Next.js route handlers
  ├─ OpenAI chat completions
  └─ Supabase service-role client
       └─ approved/shared insight operations

GitHub main branch
  └─ Vercel
       ├─ Preview deployments for pull requests
       └─ Production deployment after merge
```

## Web application

### Next.js App Router

The application uses Next.js 16 and the App Router:

- pages are under `app/**/page.tsx`;
- API handlers are under `app/api/**/route.ts`;
- the root layout is `app/layout.tsx`;
- global styles are loaded from `app/globals.css`.

Most participant-facing pages use the shared `ExpectumPage` shell. The shell
keeps the header and footer in a fixed-height frame and makes the center region
independently scrollable.

### React

The project uses React 19. Client components handle:

- Supabase authentication state;
- data fetching and mutations;
- local memory;
- meeting and reflection state;
- navigation after user actions.

There is no separate global state library. State is held in component state,
Supabase, and `localStorage`.

### Tailwind CSS

Tailwind CSS 4 is loaded through `@import "tailwindcss"` in
`app/globals.css`. Styling is primarily expressed as utility classes directly
in JSX. A small number of global animation classes support the background and
reduced-motion behavior.

There is no separate design-token package. Colors and spacing are currently
encoded in component utility classes.

## Supabase

In the current code, Supabase provides:

- email/password authentication;
- browser-side access to participant records;
- server-side service-role access for shared insights.

Two clients exist:

- `lib/supabaseClient.ts` uses the public URL and anonymous key;
- `lib/supabaseAdmin.ts` uses the public URL and service-role key.

Route-level authorization is mostly enforced in client components through
`ExpectumAuthGate`. Database Row Level Security policies and the complete SQL
schema are not present in this repository. The intended authoritative
source-of-truth boundary between Supabase and local storage is also **Needs
verification**.

## OpenAI

The OpenAI JavaScript SDK is used from server route handlers. Current AI
operations use Chat Completions for:

- a quiet attunement question;
- meeting reflection;
- journey noticing;
- trajectory noticing.

Prompts share the `EXPECTUM_VOICE` language contract and may include approved
collective insight as restrained background context. OpenAI calls are not made
directly from the browser.

## Vercel deployment

Vercel builds and hosts the application.

- Pull-request branches receive Preview deployments.
- Merges to `main` receive Production deployments.
- Vercel's GitHub integration reports deployment status back to pull requests.

No tracked `vercel.json` file or GitHub Actions workflow is present. Build and
deployment behavior beyond the observed Vercel integration is
**Needs verification** in the Vercel project settings.

## GitHub and Codex workflow

Repository: `https://github.com/laurentconsulting/expectum`

The working convention used for recent changes is:

1. start from `main`;
2. create a `codex/<description>` branch;
3. make a narrowly scoped change;
4. run the relevant local validation;
5. commit and push;
6. open a draft pull request;
7. wait for the Vercel Preview check;
8. mark ready and merge only after review;
9. verify the Production deployment.

Codex is used to inspect the repository, implement scoped changes, run local
checks, publish branches, and create draft pull requests. GitHub remains the
source of truth for review and merge state.

## Known architectural notes

- `app/layout.tsx` still contains default Create Next App metadata.
- `app/layout.tsx` imports `globals.css` twice.
- `app/movement-map/page.tsx` and `app/theme-evolution/page.tsx` are hidden
  legacy-style pages on the documented `main` branch.
- `app/profile/page.tsx` is an authenticated but hidden orientation page.
- The repository contains no implemented `ExpectumMemoryCard` component.

These notes describe current state; this documentation change does not alter
application code.
