# Data and memory

Expectum currently uses both Supabase and browser `localStorage`. The code uses
Supabase for participant-associated and shared records, while local storage
supports active meeting state, local mirrors, derived views, and legacy
compatibility. Which store is authoritative for every data category is
**Needs verification**.

## Supabase clients

| Client | File | Credentials | Intended use |
| --- | --- | --- | --- |
| Browser client | `lib/supabaseClient.ts` | Public URL and anonymous key | Authentication and participant-owned data |
| Admin client | `lib/supabaseAdmin.ts` | Public URL and service-role key | Server-only shared-insight reads and mutations |

The complete database schema, constraints, indexes, and Row Level Security
policies are not tracked in this repository. **Needs verification.**

## Supabase tables referenced in code

| Table | Purpose inferred from code | Main fields referenced |
| --- | --- | --- |
| `profiles` | Minimal participant profile created/upserted after sign-in or registration | `id`, `email` |
| `meetings` | Saved meeting questions, reflections, thread, mode, and timestamps | `id`, `user_id`, `question`, `reflection`, `thread`, `mode`, `created_at` |
| `echoes` | Participant-saved echoes/landmarks from reflections | `id`, `user_id`, `text`, `question`, `created_at` |
| `journey_notices` | Stored journey-level noticing with source-count metadata | `id`, `user_id`, `text`, `history_count`, `echoes_count`, `sessions_count`, `created_at` |
| `directions` | Saved trajectory/direction notices | `id`, `user_id`, `text`, `created_at` |
| `shared_insights` | Submitted and approved echoes for the collective space | `id`, `question`, `text`, `question_count`, `approved`, `created_at` |

Participant records are filtered by `user_id` in browser queries. The
`shared_insights` table is accessed through server routes using the service
role.

## Named Expectum local-storage keys

Defined in `lib/expectumStorage.ts`:

| Key constant | Browser key | Stored content |
| --- | --- | --- |
| `question` | `expectum_question` | Current or next question text |
| `questionCount` | `expectum_question_count` | Count within the current meeting/session |
| `thread` | `expectum_thread` | Current conversation thread |
| `history` | `expectum_history` | Local meeting history mirror/legacy history |
| `landmarks` | `expectum_landmarks` | Local saved echoes/landmarks |
| `journey` | `expectum_journey` | Latest generated journey noticing |
| `journeyReflections` | `expectum_journey_reflections` | Legacy local journey-reflection list |
| `trajectory` | `expectum_trajectory` | Latest generated trajectory |
| `trajectoryHistory` | `expectum_trajectory_history` | Local saved trajectory history |
| `detectedThemes` | `expectum_detected_themes` | Locally derived theme results |
| `sharedInsights` | `expectum_shared_insights` | Locally remembered shared-insight submissions |
| `reflectionPending` | `expectum_reflection_pending` | Whether a reflection request should run |
| `currentSession` | `expectum_current_session` | Current session UUID |
| `reflectionMode` | `expectum_reflection_mode` | `meeting`, `thought`, or `exploration` |

Additional keys:

| Browser key | Purpose |
| --- | --- |
| `expectum_admin_key` | Remembers the manually entered shared-insight admin key |
| `expectum_sound_enabled` | Feature flag for the prepared but not implemented sound layer |

## What is stored locally

Local storage is used for:

- the active question and meeting thread;
- session and question counters;
- reflection mode and pending state;
- local mirrors of meeting history and echoes;
- latest generated journey and trajectory text;
- derived themes;
- local shared-insight state;
- legacy journey-reflection data;
- admin-key convenience and sound preference.

Some information exists both locally and in Supabase. The code is in a
transitional hybrid state rather than a single-source architecture.

The ongoing requirement for `expectum_history`,
`expectum_journey_reflections`, and parts of the local mirror layer is
**Needs verification**.

## What is stored in Supabase

Supabase stores:

- authenticated users through Supabase Auth;
- minimal profile identity records;
- meetings;
- saved echoes;
- journey notices;
- saved directions;
- submitted and approved shared insights.

The client often reads Supabase for durable participant history and writes
local storage for immediate flow continuity or derived presentation state.

## Memory-clearing flow

The participant starts clearing from `app/settings/page.tsx`.

1. A browser confirmation explains that meetings, echoes, journey notices,
   and saved directions will be removed.
2. The current Supabase user is read.
3. If a user exists, the application deletes that user's rows from:
   - `directions`;
   - `journey_notices`;
   - `echoes`;
   - `meetings`.
4. If any Supabase deletion reports an error, local clearing does not proceed.
5. On successful remote deletion, all keys in `EXPECTUM_STORAGE` are removed.
6. A completion message is shown.

The flow does not delete:

- the Supabase Auth user;
- the `profiles` row;
- submitted `shared_insights`;
- `expectum_admin_key`;
- `expectum_sound_enabled`.

Whether profile deletion or withdrawal of previously submitted shared insight
should be part of “clear memory” is **Needs verification**.
