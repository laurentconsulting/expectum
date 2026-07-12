# Next audit plan

The audits below are ordered by recommended sequence. Each audit should begin
as evidence gathering and documentation. Any implementation should be a
separate, narrowly scoped, explicitly approved pull request.

## 1. Prompt audit

### Goal

Verify that all Aim prompts preserve Expectum's identity and remain mutually
consistent:

- Aim is a space-holder, not a coach, therapist, mentor, expert, evaluator, or
  authority;
- prompts do not diagnose, prescribe, pressure, over-interpret, or create
  invented depth;
- collective echo remains background rather than evidence about a person;
- fallback behavior is clear and safe;
- model and cost boundaries are understood.

### Files likely involved

- `app/api/attunement-question/route.ts`
- `app/api/reflect/route.ts`
- `app/api/journey/route.ts`
- `app/api/trajectory/route.ts`
- `lib/expectumVoice.ts`
- `lib/collectiveAimMemory.ts`
- `lib/collectiveEchoThemes.ts`
- `docs/architecture/ai-routes.md`

### Risks

- subtle coaching or therapeutic language;
- conflict between shared voice and route-specific instructions;
- prompt growth that makes behavior less clear;
- direct API usage without verified authorization or rate limits;
- collective context influencing individual interpretation;
- unnecessary token and model cost.

### Smallest safe first step

Create a comparison table of every system prompt:

- shared clauses;
- route-specific clauses;
- output contract;
- fallback;
- prohibited behavior;
- data included.

Record findings without editing prompts.

### Change allowance

**Documentation-only for the audit.** Prompt or API code changes require a
separate approved PR after findings are reviewed.

## 2. Supabase and Memory audit

### Goal

Establish the authoritative data model and verify privacy, deletion, and access
boundaries across Supabase and `localStorage`.

### Files likely involved

- `lib/supabaseClient.ts`
- `lib/supabaseAdmin.ts`
- `lib/expectumStorage.ts`
- `app/enter/page.tsx`
- `app/reflection/page.tsx`
- `app/history/page.tsx`
- `app/landmarks/page.tsx`
- `app/journey/page.tsx`
- `app/journey-reflections/page.tsx`
- `app/path/page.tsx`
- `app/settings/page.tsx`
- `app/themes/page.tsx`
- `app/trajectory/page.tsx`
- `app/trajectory-history/page.tsx`
- `app/api/shared-insights/route.ts`
- `app/api/admin/shared-insights/route.ts`
- Supabase schema and RLS configuration: **Needs verification**

### Risks

- unclear source of truth between local and remote data;
- stale or divergent local mirrors;
- service-role exposure or over-broad server operations;
- missing or incorrect RLS;
- incomplete memory clearing;
- participant-submitted shared insight surviving local memory clearing without
  clear expectation;
- admin key persistence in browser storage.

### Smallest safe first step

Produce a field-level data-flow matrix:

- source;
- destination;
- read/write/delete locations;
- user ownership;
- retention;
- clear-memory behavior;
- RLS policy.

Do not change storage behavior until the matrix and actual Supabase policies
are verified.

### Change allowance

**Documentation-only for the audit.** Auth, schema, RLS, migration, API, or
memory changes require separate approved PRs and deployment planning.

## 3. Page reduction / noise audit

### Goal

Reduce duplication and cognitive noise while preserving useful paths,
bookmarks, and the quiet rhythm of the encounter.

### Files likely involved

- all `app/**/page.tsx` files;
- `components/ExpectumHeader.tsx`;
- `components/ExpectumFooter.tsx`;
- `components/ExpectumPage.tsx`;
- `docs/architecture/routes.md`;
- `docs/architecture/roadmap.md`.

Initial candidates:

- `/movement-map`;
- `/theme-evolution`;
- repeated summary surfaces across `/path`, `/statistics`, `/profile`,
  `/themes`, and memory pages.

### Risks

- removing a useful but hidden workflow;
- breaking bookmarks or external links;
- replacing quiet orientation with a dense dashboard;
- moving too many links into primary navigation;
- confusing Memory, Path, Journey, Theme, and Trajectory roles.

### Smallest safe first step

Create a page-purpose matrix containing:

- unique user need;
- data shown;
- actions offered;
- inbound navigation;
- overlap;
- keep, redirect, merge, hide, or remove recommendation.

No page changes should occur in this first step.

### Change allowance

**Documentation-only for the audit.** Redirects or page removal may be allowed
later in separate small PRs with Preview verification.

## 4. Profile quiet role decision

### Goal

Decide whether `/profile` should:

- remain a direct-URL quiet orientation page;
- point gently toward existing pages;
- be renamed;
- or be removed.

It must not become a major feature, dashboard, evaluation, identity profile,
or duplicate of `/path`, `/settings`, `/journey-reflections`, `/themes`, or
`/statistics`.

### Files likely involved

- `app/profile/page.tsx`
- `app/path/page.tsx`
- `app/settings/page.tsx`
- `app/journey-reflections/page.tsx`
- `app/themes/page.tsx`
- `app/statistics/page.tsx`
- `docs/architecture/routes.md`
- `docs/architecture/roadmap.md`

### Risks

- implying that Expectum can define or summarize the participant;
- duplicating existing views;
- adding navigation noise;
- turning a quiet page into a product dashboard;
- treating derived themes or directions as identity.

### Smallest safe first step

Write a one-paragraph role statement and compare every current profile block
with existing pages. Mark each block as unique, duplicated, or potentially
misleading.

### Change allowance

**Documentation-only until the role is approved.** Any page or navigation
change requires a separate PR.

## 5. Governance docs review

### Goal

Verify that documentation remains accurate, usable, and aligned with merged
code and Expectum identity.

### Files likely involved

- `docs/architecture/overview.md`
- `docs/architecture/routes.md`
- `docs/architecture/components.md`
- `docs/architecture/data-and-memory.md`
- `docs/architecture/ai-routes.md`
- `docs/architecture/deployment.md`
- `docs/architecture/roadmap.md`
- `docs/architecture/component-ownership.md`
- `docs/audits/next-audit-plan.md`
- relevant current source files for evidence.

### Risks

- documenting an open PR as if it were merged;
- stale route, component, environment, or ownership information;
- accidental inclusion of secret values;
- converting uncertainty into unsupported certainty;
- identity drift in descriptions of Aim;
- governance documents becoming too large or repetitive.

### Smallest safe first step

For every statement that can change, attach it to:

- a current repository file;
- a GitHub/Vercel setting marked **Needs verification**;
- or a clearly labeled product decision.

Remove repeated prose where a cross-link is enough.

### Change allowance

**Documentation-only.** Governance review must not silently alter application
behavior.

## Audit completion standard

An audit is complete when:

1. evidence and scope are explicit;
2. unknowns are marked **Needs verification**;
3. risks are ranked;
4. the smallest safe next action is identified;
5. no application change is bundled into the audit without separate approval;
6. Aim remains a space-holder and the encounter remains primary.
