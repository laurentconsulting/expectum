# Component and behavior ownership

This map identifies the primary owner for shared behavior. Ownership means
“the first place to inspect or change,” not exclusive control over every
visual detail.

## Shared shell and presentation

| Feature or behavior | Responsible component or file | Ownership boundary |
| --- | --- | --- |
| Full page frame | `components/ExpectumPage.tsx` | Owns viewport height, fixed header/footer composition, center scrolling, background composition, and page-specific footer-link plumbing |
| Header | `components/ExpectumHeader.tsx` | Owns Expectum mark, authenticated primary navigation visibility, active states, and its own auth-state subscription |
| Footer | `components/ExpectumFooter.tsx` | Owns footer layout, page-supplied footer navigation, symbols, and placement of the dynamic auth action |
| Dynamic footer action | `components/AuthStatus.tsx` | Owns `Ava kohtumine` versus `Välju`, sign-out, `/return` behavior, and footer auth-state updates |
| Symbols | `components/ExpectumSymbol.tsx` | Owns symbol names, glyphs, balance ratios, and header/footer/card/hero sizing |
| Section heading structure | `components/ExpectumSection.tsx` | Owns standard section label, optional symbol, title, intro, width, and heading rhythm |
| General content cards | `components/ExpectumCard.tsx` | Owns shared card surface, optional label, spacing, typography, and preserved line breaks |
| Settings memory-link cards | `app/settings/page.tsx` | Currently rendered inline from `memoryLinks`; no `ExpectumMemoryCard` implementation exists. **Needs verification** before creating a new abstraction |
| Shared action styling | `components/ExpectumButton.tsx` | Owns primary/soft pill styling and link-versus-button rendering |
| Decorative background | `components/ExpectumBackground.tsx` and `app/globals.css` | Component owns layers; global CSS owns breathing animations and reduced-motion disabling |

## Authentication and access

| Feature or behavior | Responsible component or file | Ownership boundary |
| --- | --- | --- |
| Participant page auth gate | `components/ExpectumAuthGate.tsx` | Owns client-side user check, auth-state subscription, loading state, and redirect to `/enter` |
| Sign-in and registration UI | `app/enter/page.tsx` | Owns email/password entry, sign-in versus registration mode, profile upsert, and navigation to attunement |
| Browser Supabase client | `lib/supabaseClient.ts` | Owns creation of the anonymous-key client used by browser components |
| Server Supabase client | `lib/supabaseAdmin.ts` | Owns creation of the service-role client; must remain server-only |
| Admin shared-insight key check | `app/api/admin/shared-insights/route.ts` | Owns `x-admin-key` comparison and admin API rejection |

Client-side gating is not a substitute for Row Level Security or server API
authorization. Those boundaries are **Needs verification**.

## Participant encounter

| Feature or behavior | Responsible component or file | Ownership boundary |
| --- | --- | --- |
| Attunement opening | `app/attunement/page.tsx` | Owns the quiet entry into a participant-authored question |
| Participant-authored question | `app/question/page.tsx` | Owns mode selection, session initialization, local thread setup, and transition to reflection |
| Aim-generated quiet question | `app/attunement-question/page.tsx` and `app/api/attunement-question/route.ts` | Page owns inputs and selection; API owns generation prompt and fallback |
| Main reflection encounter | `app/reflection/page.tsx` and `app/api/reflect/route.ts` | Page owns thread state, persistence choices, and submission; API owns Aim response generation |
| Pause and fresh rhythm | `app/pause/page.tsx` | Owns resetting active meeting state and returning to `/question` |

## Memory and orientation

| Feature or behavior | Responsible component or file | Ownership boundary |
| --- | --- | --- |
| Memory page | `app/settings/page.tsx` | Owns the Memory index, memory clearing confirmation, Supabase deletion sequence, and local key removal |
| Local key registry | `lib/expectumStorage.ts` | Owns canonical names for active-flow, history, journey, trajectory, theme, and shared-insight local keys |
| Meeting history | `app/history/page.tsx` | Owns meeting listing, continuation setup, and meeting deletion/clearing behavior |
| Echo memory | `app/landmarks/page.tsx` | Owns saved echo listing and removal |
| Timeline | `app/timeline/page.tsx` | Owns chronological composition of meetings, echoes, notices, and directions |
| Statistics | `app/statistics/page.tsx` | Owns record counts and locally derived summary counts |
| Quiet profile | `app/profile/page.tsx` | Owns a quiet local orientation summary only; must not become a duplicate path, memory, themes, or statistics feature |

## Path, journey, themes, and trajectory

| Feature or behavior | Responsible component or file | Ownership boundary |
| --- | --- | --- |
| Path page | `app/path/page.tsx` | Owns the current aggregate view of latest participant traces; it should notice, not define |
| Journey generation | `app/journey/page.tsx` and `app/api/journey/route.ts` | Page owns source loading and notice persistence; API owns journey prompt and fallback |
| Journey history | `app/journey-reflections/page.tsx` | Owns stored `journey_notices` listing and removal |
| Theme derivation | `app/themes/page.tsx` and `lib/expectumThemes.ts` | Page owns participant-data loading and derived-theme persistence; library owns keyword vocabulary |
| Trajectory generation | `app/trajectory/page.tsx` and `app/api/trajectory/route.ts` | Page owns source loading and save choice; API owns possible-direction generation |
| Trajectory history | `app/trajectory-history/page.tsx` | Owns stored directions listing and removal |
| Legacy movement map | `app/movement-map/page.tsx` | Older overlapping owner; candidate for redirect/removal after approval |
| Legacy theme evolution | `app/theme-evolution/page.tsx` | Older overlapping owner; candidate for redirect/removal after approval |

## Shared and collective echo

| Feature or behavior | Responsible component or file | Ownership boundary |
| --- | --- | --- |
| Participant shared-insight view | `app/shared-insights/page.tsx` | Owns participant-facing display of approved/local shared insight |
| Shared-insight submission/read API | `app/api/shared-insights/route.ts` | Owns public approved reads and unapproved submissions |
| Collective echo page | `app/collective-echo/page.tsx` | Owns public display of approved echoes and recurring collective themes |
| Collective echo API | `app/api/collective-echo/route.ts` | Owns public response composition |
| Collective theme calculation | `lib/collectiveEchoThemes.ts` | Owns deterministic word normalization, counting, filtering, and result limits |
| Collective Aim background | `lib/collectiveAimMemory.ts` | Owns safe prompt background assembled from approved echoes and recurring words |
| Shared-insight administration | `app/admin/shared-insights/page.tsx` and `app/api/admin/shared-insights/route.ts` | Page owns review UI; API owns admin-key enforcement and mutations |

## AI language and governance

| Feature or behavior | Responsible component or file | Ownership boundary |
| --- | --- | --- |
| OpenAI voice | `lib/expectumVoice.ts` | Owns shared Estonian language, clarity, restraint, silence, and non-authoritative posture |
| Attunement prompt | `app/api/attunement-question/route.ts` | Owns quiet-question constraints |
| Reflection prompts and modes | `app/api/reflect/route.ts` | Owns meeting, thought, and exploration prompt differences |
| Journey prompt | `app/api/journey/route.ts` | Owns cross-encounter noticing structure |
| Trajectory prompt | `app/api/trajectory/route.ts` | Owns possible-direction structure and prohibition on planning/prediction |

No individual route may redefine Aim as coach, therapist, mentor, expert, or
authority. Shared voice and route-specific prompts must remain aligned.

## Deployment and workflow ownership

| Feature or behavior | Responsible location | Ownership boundary |
| --- | --- | --- |
| npm scripts | `package.json` | Owns local dev, build, start, and lint commands |
| Vercel deployment behavior | Vercel project settings and GitHub integration | External to repository; exact settings are **Needs verification** |
| Branch and PR state | GitHub repository | Source of truth for review, draft status, and merge |
| Architecture documentation | `docs/architecture/` | Must describe merged/current code and explicitly mark uncertainty |
| Audit planning | `docs/audits/` | Owns ordered audit scope, not application implementation |
