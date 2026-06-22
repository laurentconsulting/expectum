# Routes

This inventory reflects the Next.js App Router files on `main` on June 22,
2026.

## Authentication model

- **Public**: no `ExpectumAuthGate` is present.
- **Authenticated**: the page is wrapped in `ExpectumAuthGate`; unauthenticated
  users are sent to `/enter` on the client.
- **Admin key**: the UI is hidden from normal navigation and its API requires
  `x-admin-key`.

Server-side route protection and Supabase Row Level Security are
**Needs verification**. `ExpectumAuthGate` is a client-side gate.

## Public routes

| Path | Purpose | Auth requirement | Page file |
| --- | --- | --- | --- |
| `/` | Public landing page and entry points into Expectum | Public | `app/page.tsx` |
| `/aim` | Explains Aim and links to related public material | Public | `app/aim/page.tsx` |
| `/aim-memory` | Explains the principles and limits of Aim memory | Public | `app/aim-memory/page.tsx` |
| `/collective-echo` | Displays approved shared echoes and recurring collective themes | Public | `app/collective-echo/page.tsx` |
| `/enter` | Email/password sign-in and participant registration | Public | `app/enter/page.tsx` |
| `/expectum` | Main explanation of the Expectum concept | Public | `app/expectum/page.tsx` |
| `/expectum-language` | Explains Expectum terminology and symbolic language | Public | `app/expectum-language/page.tsx` |
| `/human-and-ai` | Explains the relationship between the human participant and AI | Public | `app/human-and-ai/page.tsx` |
| `/return` | Rest/return page; `AuthStatus` signs out when this path is mounted | Public | `app/return/page.tsx` |
| `/symbols` | Reference page for Expectum symbols | Public | `app/symbols/page.tsx` |

## Authenticated routes

| Path | Purpose | Auth requirement | Page file |
| --- | --- | --- | --- |
| `/attunement` | Quiet opening page before entering a question | Supabase user via `ExpectumAuthGate` | `app/attunement/page.tsx` |
| `/attunement-question` | Generates a quiet question from recent memory and collective background | Supabase user via `ExpectumAuthGate` | `app/attunement-question/page.tsx` |
| `/history` | Lists saved meetings and allows a meeting thread to continue | Supabase user via `ExpectumAuthGate` | `app/history/page.tsx` |
| `/journey` | Generates and stores a journey-level noticing | Supabase user via `ExpectumAuthGate` | `app/journey/page.tsx` |
| `/journey-reflections` | Lists stored journey notices | Supabase user via `ExpectumAuthGate` | `app/journey-reflections/page.tsx` |
| `/landmarks` | Lists and removes saved echoes | Supabase user via `ExpectumAuthGate` | `app/landmarks/page.tsx` |
| `/path` | Aggregated view of latest meetings, echoes, themes, notices, directions, and shared insight | Supabase user via `ExpectumAuthGate` | `app/path/page.tsx` |
| `/pause` | Pause page that can start a fresh meeting rhythm | Supabase user via `ExpectumAuthGate` | `app/pause/page.tsx` |
| `/profile` | Quiet orientation summary assembled from locally available themes, echoes, and trajectory history | Supabase user via `ExpectumAuthGate`; hidden from primary navigation | `app/profile/page.tsx` |
| `/question` | User-authored question with meeting, thought, and exploration modes | Supabase user via `ExpectumAuthGate` | `app/question/page.tsx` |
| `/reflection` | Main Aim meeting/reflection thread and echo-sharing UI | Supabase user via `ExpectumAuthGate` | `app/reflection/page.tsx` |
| `/settings` | Memory index and memory-clearing controls | Supabase user via `ExpectumAuthGate` | `app/settings/page.tsx` |
| `/shared-insights` | Participant view of approved and locally shared echoes | Supabase user via `ExpectumAuthGate` | `app/shared-insights/page.tsx` |
| `/statistics` | Counts stored meetings, echoes, notices, directions, themes, and shared insights | Supabase user via `ExpectumAuthGate` | `app/statistics/page.tsx` |
| `/themes` | Derives recurring themes from participant records | Supabase user via `ExpectumAuthGate` | `app/themes/page.tsx` |
| `/timeline` | Chronological view of meetings, echoes, notices, and directions | Supabase user via `ExpectumAuthGate` | `app/timeline/page.tsx` |
| `/trajectory` | Generates and saves a possible direction of movement | Supabase user via `ExpectumAuthGate` | `app/trajectory/page.tsx` |
| `/trajectory-history` | Lists and removes saved directions | Supabase user via `ExpectumAuthGate` | `app/trajectory-history/page.tsx` |

## Admin route

| Path | Purpose | Auth requirement | Page file |
| --- | --- | --- | --- |
| `/admin/shared-insights` | Review, approve, hide, or delete submitted shared echoes | Hidden UI; API requests require `EXPECTUM_ADMIN_KEY` through `x-admin-key`; the page itself has no `ExpectumAuthGate` | `app/admin/shared-insights/page.tsx` |

The admin key is stored in browser `localStorage` after entry. Whether the
admin page should also require Supabase authentication is **Needs
verification**.

## API routes

| Path | Methods | Purpose | Auth requirement | Route file |
| --- | --- | --- | --- | --- |
| `/api/attunement-question` | `POST` | Generates a quiet question with OpenAI | No explicit route-handler auth check; caller page is authenticated. **Needs verification.** | `app/api/attunement-question/route.ts` |
| `/api/reflect` | `POST` | Generates an Aim reflection for a meeting thread | No explicit route-handler auth check; caller page is authenticated. **Needs verification.** | `app/api/reflect/route.ts` |
| `/api/journey` | `POST` | Generates a journey noticing | No explicit route-handler auth check; caller page is authenticated. **Needs verification.** | `app/api/journey/route.ts` |
| `/api/trajectory` | `POST` | Generates a possible movement direction | No explicit route-handler auth check; caller page is authenticated. **Needs verification.** | `app/api/trajectory/route.ts` |
| `/api/shared-insights` | `GET`, `POST` | Reads approved shared insights and accepts new unapproved submissions | No explicit user-auth check; uses the Supabase service-role client | `app/api/shared-insights/route.ts` |
| `/api/collective-echo` | `GET` | Returns approved shared echoes and recurring word themes | Public read; uses service-role-backed helper | `app/api/collective-echo/route.ts` |
| `/api/admin/shared-insights` | `GET`, `PATCH`, `DELETE` | Admin review and mutation of shared insights | Requires matching `x-admin-key` | `app/api/admin/shared-insights/route.ts` |

## Legacy and hidden routes

| Path | Status | Notes | Page file |
| --- | --- | --- | --- |
| `/movement-map` | Hidden legacy route | No inbound user-facing navigation was found. Uses an older standalone layout and local journey-reflection data. It overlaps with `/journey-reflections` and `/path`. | `app/movement-map/page.tsx` |
| `/theme-evolution` | Hidden legacy route | No inbound user-facing navigation was found. Uses an older standalone layout and overlaps with `/themes`. | `app/theme-evolution/page.tsx` |
| `/profile` | Hidden orientation route | Authenticated and built with shared components, but intentionally absent from primary navigation. | `app/profile/page.tsx` |
| `/admin/shared-insights` | Hidden operational route | Intended for direct admin access rather than participant navigation. | `app/admin/shared-insights/page.tsx` |

There is no `/memory` route. The participant Memory destination is
`/settings`.
