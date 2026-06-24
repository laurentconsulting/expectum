# EXPECTUM Memory Audit 1.0

This is a documentation-only audit of the memory architecture represented by
the repository's `main` branch on June 22, 2026.

No application code, prompts, database schema, Supabase policies, routes,
components, or deployment settings are changed by this audit.

The audit distinguishes observed behavior from intended policy. Where the
repository does not establish intent, retention, database policy, or external
service behavior, the finding is marked **Needs verification**.

## 1. Current Memory Architecture

### 1.1 System shape

Expectum currently has four overlapping memory layers:

1. **Active browser state**
   - current question;
   - current conversation thread;
   - session identifier;
   - meeting mode;
   - pending-generation state;
   - question count.

2. **Browser-persistent local memory**
   - local meeting-history mirror;
   - local echo mirror;
   - latest journey noticing;
   - legacy journey-reflection history;
   - latest trajectory;
   - local trajectory history;
   - derived themes;
   - locally remembered shared submissions.

3. **Participant-associated Supabase memory**
   - profile identity;
   - meetings and cumulative threads;
   - saved echoes;
   - journey notices;
   - saved directions.

4. **Collective Supabase memory**
   - submitted shared insights;
   - approval state;
   - approved public echoes;
   - recurring words derived from approved echoes;
   - approved collective material returned to future AI prompts.

The current architecture is hybrid rather than single-source. Some records are
duplicated locally and remotely, some exist only locally, some exist only
remotely, and several views combine both.

The authoritative source for every category is **Needs verification**.

### 1.2 Primary files audited

Memory control and local key definitions:

- `app/settings/page.tsx`;
- `lib/expectumStorage.ts`;
- `lib/expectumTypes.ts`;
- `lib/expectumSound.ts`.

Creation and active-session flow:

- `app/question/page.tsx`;
- `app/attunement-question/page.tsx`;
- `app/reflection/page.tsx`;
- `app/pause/page.tsx`;
- `app/enter/page.tsx`.

Participant memory retrieval and display:

- `app/history/page.tsx`;
- `app/landmarks/page.tsx`;
- `app/journey/page.tsx`;
- `app/journey-reflections/page.tsx`;
- `app/themes/page.tsx`;
- `app/trajectory/page.tsx`;
- `app/trajectory-history/page.tsx`;
- `app/timeline/page.tsx`;
- `app/path/page.tsx`;
- `app/statistics/page.tsx`;
- `app/profile/page.tsx`.

Collective memory:

- `app/shared-insights/page.tsx`;
- `app/collective-echo/page.tsx`;
- `app/admin/shared-insights/page.tsx`;
- `app/api/shared-insights/route.ts`;
- `app/api/collective-echo/route.ts`;
- `app/api/admin/shared-insights/route.ts`;
- `lib/collectiveAimMemory.ts`;
- `lib/collectiveEchoThemes.ts`.

AI memory consumers:

- `app/api/attunement-question/route.ts`;
- `app/api/reflect/route.ts`;
- `app/api/journey/route.ts`;
- `app/api/trajectory/route.ts`.

Legacy memory consumers:

- `app/movement-map/page.tsx`;
- `app/theme-evolution/page.tsx`.

Supabase clients:

- `lib/supabaseClient.ts`;
- `lib/supabaseAdmin.ts`.

### 1.3 Storage locations

#### Browser `localStorage`

Keys registered in `EXPECTUM_STORAGE`:

| Constant | Browser key | Observed content |
| --- | --- | --- |
| `question` | `expectum_question` | Current participant question or Aim-generated attunement question |
| `questionCount` | `expectum_question_count` | Number of follow-up questions in the active flow |
| `thread` | `expectum_thread` | Current cumulative user/Aim conversation |
| `history` | `expectum_history` | Local cumulative history snapshots written after successful reflection generation |
| `landmarks` | `expectum_landmarks` | Local copies of Aim responses selected by the participant as echoes |
| `journey` | `expectum_journey` | Latest Aim-generated journey noticing |
| `journeyReflections` | `expectum_journey_reflections` | Legacy journey-reflection list; no active writer was found |
| `trajectory` | `expectum_trajectory` | Latest Aim-generated direction noticing |
| `trajectoryHistory` | `expectum_trajectory_history` | Local list of direction notices the participant chose to save |
| `detectedThemes` | `expectum_detected_themes` | Deterministically derived theme names, counts, and keyword matches |
| `sharedInsights` | `expectum_shared_insights` | Local record of Aim responses submitted for collective approval |
| `reflectionPending` | `expectum_reflection_pending` | Whether Reflection should request a new Aim response |
| `currentSession` | `expectum_current_session` | Current browser-generated session UUID |
| `reflectionMode` | `expectum_reflection_mode` | `meeting`, `thought`, or `exploration` |

Additional local keys outside `EXPECTUM_STORAGE`:

| Browser key | Observed content | Cleared by Memory clear? |
| --- | --- | --- |
| `expectum_admin_key` | Manually entered collective-echo admin key | No |
| `expectum_sound_enabled` | Prepared sound-layer preference | No |

Supabase Auth may also use browser persistence internally. Its exact storage,
duration, and relationship to the application's Memory clear action are
**Needs verification**.

#### Supabase

Tables referenced in the repository:

| Table | Observed fields | Memory role |
| --- | --- | --- |
| `profiles` | `id`, `email` | Persistent participant identity |
| `meetings` | `id`, `user_id`, `question`, `reflection`, `thread`, `mode`, `created_at` | Hybrid participant/Aim encounter history |
| `echoes` | `id`, `user_id`, `text`, `question`, `created_at` | Participant-selected Aim response and originating question |
| `journey_notices` | `id`, `user_id`, `text`, `history_count`, `echoes_count`, `sessions_count`, `created_at` | Aim-generated cross-encounter synthesis |
| `directions` | `id`, `user_id`, `text`, `created_at` | Participant-saved Aim-generated direction |
| `shared_insights` | `id`, `question`, `text`, `question_count`, `approved`, `created_at` | Collective submission and approval memory |

The repository does not contain the complete schema, constraints, indexes,
retention rules, migrations, or Row Level Security policies. All are **Needs
verification**.

### 1.4 Memory hierarchy

#### Transient memory

Observed items:

- React component state;
- form input before submission;
- loading and confirmation state;
- API request bodies in transit;
- current rendered response before persistence.

Expected lifetime:

- current render, navigation, or request.

Actual provider-side request retention and logging are **Needs verification**.

#### Session memory

Observed items:

- current question;
- question count;
- current session UUID;
- current thread;
- reflection mode;
- pending-reflection flag.

Primary storage:

- `localStorage`.

Observed lifetime:

- survives reload and browser restart until reset, overwritten, or cleared.

Calling this “session” memory is conceptual, not equivalent to browser
`sessionStorage`.

#### Reflection memory

Observed items:

- participant question;
- Aim response;
- full cumulative thread;
- meeting mode;
- timestamp;
- optional participant-selected echo.

Primary storage:

- `meetings` in Supabase;
- `expectum_history` locally;
- current thread locally;
- selected echoes in `echoes` and `expectum_landmarks`.

Origin:

- hybrid participant/Aim.

#### Journey memory

Observed items:

- Aim-generated journey noticing;
- source counts for meetings, echoes, and sessions;
- prior journey notices used as future context.

Primary storage:

- `journey_notices`;
- latest text in `expectum_journey`;
- legacy `expectum_journey_reflections` key, with no active writer found.

Origin:

- Aim-generated from hybrid source material.

#### Trajectory memory

Observed items:

- latest Aim-generated possible direction;
- participant-saved direction history.

Primary storage:

- latest text in `expectum_trajectory`;
- local saved list in `expectum_trajectory_history`;
- remote saved rows in `directions`.

Origin:

- Aim-generated, participant-selected when saved.

#### Collective memory

Observed items:

- an Aim response selected by a participant;
- its preceding participant question;
- question count;
- approval state;
- public approved echo;
- deterministic recurring-word counts;
- recent approved text and recurring words returned to AI prompts.

Primary storage:

- `shared_insights`;
- local submission marker in `expectum_shared_insights`.

Origin:

- hybrid: participant question, Aim response, participant sharing consent, and
  admin approval.

#### Persistent identity

Observed items:

- Supabase Auth user;
- `profiles.id`;
- `profiles.email`.

Memory clear does not remove:

- the Auth user;
- the profile row.

Intended account lifetime, profile deletion process, and account-deletion
policy are **Needs verification**.

### 1.5 Retention model

No time-to-live, archival, expiry, maximum-record, or automatic deletion policy
was found in application code.

Observed persistence:

| Memory category | Observed persistence |
| --- | --- |
| Local active/session keys | Until overwritten, manually reset, browser data removal, or Memory clear |
| Local mirrors and derived memory | Until Memory clear or specific local action |
| Participant Supabase memory | Until participant deletion action succeeds |
| Profile and Auth identity | Persists after Memory clear |
| Collective submissions | Persists until an admin hides or deletes the row |
| Approved collective echo | Persists and remains publicly retrievable while approved |
| External provider logs/backups | **Needs verification** |

The intended retention period for every category is **Needs verification**.

## 2. Memory Inventory

### 2.1 Detailed inventory

| Memory item | Classification | Origin | Stored where | Why stored | Retrieval | User display | Future AI influence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Auth identity | Persistent identity | User/system | Supabase Auth | Sign-in and ownership | Supabase auth client | Auth state and entry flow | Indirectly controls access |
| Profile email | Persistent identity | User/system | `profiles` | Minimal identity record | No participant profile retrieval found | Not shown as memory | No direct prompt use |
| Current question | Session | User or Aim | `expectum_question` | Continue active encounter | Reflection page | Reflection heading/thread context | Yes, direct Reflection input |
| Question count | Session | System-derived | `expectum_question_count` | Limit/describe active continuation | Reflection and shared submission | Continuation behavior; collective question count | No semantic prompt influence |
| Current thread | Session/reflection | Hybrid | `expectum_thread` | Continue conversation | Reflection; History continuation rewrites it | Reflection conversation | Yes, last eight messages to Reflection |
| Current session ID | Session | Browser-generated | `expectum_current_session` | Group messages into encounters | Question, Reflection, History continuation | Used indirectly by History grouping | Indirectly through grouping |
| Reflection mode | Session | User choice | `expectum_reflection_mode` | Select prompt expression | Reflection | Mode label | Yes, selects prompt mode |
| Pending flag | Transient/session | System-derived | `expectum_reflection_pending` | Prevent or trigger generation on page load | Reflection | Not directly shown | Controls whether AI call occurs |
| Local history | Reflection/legacy mirror | Hybrid | `expectum_history` | Local continuity and legacy views | Legacy Theme Evolution; clear action | Not used by current History page | No current main AI route found |
| Meeting rows | Reflection | Hybrid | `meetings` | Durable encounter history | History, Journey, Themes, Timeline, Path, Statistics, Attunement, Trajectory | Multiple participant views | Yes, Attunement, Journey, Trajectory |
| Local landmarks | Reflection mirror | Aim-generated, user-selected | `expectum_landmarks` | Immediate selection state and legacy/local views | Reflection, Profile, legacy Theme Evolution | Reflection selection and Profile | No current AI route reads local copy |
| Echo rows | Reflection | Aim-generated, user-selected | `echoes` | Durable chosen echo | Landmarks, Journey, Themes, Timeline, Path, Attunement, Trajectory, Statistics | Multiple participant views | Yes, Attunement, Journey, Trajectory |
| Latest journey | Journey | Aim-generated | `expectum_journey` | Keep latest generated noticing locally | No active display reader found outside storage clear | Journey keeps state in component during visit | No direct reader found |
| Journey notice rows | Journey | Aim-generated, auto-saved | `journey_notices` | Cross-encounter continuity | Journey, Journey Reflections, Themes, Timeline, Path, Statistics, Attunement, Trajectory | Multiple participant views | Yes, Attunement, Journey, Trajectory |
| Legacy journey reflections | Journey/legacy | Aim-generated | `expectum_journey_reflections` | Older Movement Map and Theme Evolution | Legacy pages | Legacy pages | No active writer or current AI use found |
| Derived themes | Journey/derived | Deterministic hybrid derivative | `expectum_detected_themes` | Show recurring configured keywords | Path, Profile, Statistics, Trajectory | Themes, Path, Profile, Statistics | Yes, Trajectory |
| Latest trajectory | Trajectory | Aim-generated | `expectum_trajectory` | Avoid regeneration and show last generated direction | Trajectory on mount | Trajectory page | No current AI reuse found |
| Local trajectory history | Trajectory mirror | Aim-generated, user-selected | `expectum_trajectory_history` | Local saved-direction continuity | Profile | Profile | No current AI reuse found |
| Direction rows | Trajectory | Aim-generated, user-selected | `directions` | Durable saved directions | Trajectory History, Timeline, Path, Statistics | Multiple participant views | No current AI route reads directions |
| Local shared markers | Collective mirror | Hybrid | `expectum_shared_insights` | Remember submissions made in this browser | Reflection, Path, Statistics | Submission state, Path, Statistics | No direct AI use |
| Shared insight rows | Collective | Hybrid | `shared_insights` | Moderation, public collective echo, prompt background | Shared APIs, admin API, collective helpers | Shared Insights and Collective Echo | Yes, all four OpenAI routes when approved |
| Collective recurring words | Collective derivative | Deterministic derivative | Calculated at request time | Show recurrence and provide prompt background | Collective Echo and collective Aim helper | Collective Echo | Yes, all four OpenAI routes |
| Admin key | Operational local state | Admin-entered | `expectum_admin_key` | Convenience for admin API requests | Admin page | Password input state | No |
| Sound preference | Preference | User/system | `expectum_sound_enabled` | Prepared sound feature | Sound helper | No implemented sound UI found | No |

### 2.2 User-generated, Aim-generated, and hybrid memory

#### User-generated

- participant-authored questions;
- participant-authored follow-up messages;
- email identity;
- explicit meeting-mode choice;
- explicit consent to save an Aim response as echo;
- explicit consent to submit a saved response to shared review.

#### Aim-generated

- reflection responses;
- attunement questions;
- journey notices;
- trajectory notices;
- fallback responses generated by application code;
- Aim text inside cumulative meeting threads.

#### Hybrid

- `meetings`: participant and Aim text in one cumulative record;
- `echoes`: Aim text selected by the participant and linked to a participant
  question;
- `directions`: Aim text retained through participant choice;
- `shared_insights`: participant question plus Aim response, participant
  consent, and admin approval;
- detected themes: deterministic matches across both participant and Aim text;
- collective recurring words: deterministic counts over approved hybrid echo
  text;
- Path, Timeline, Profile, and Statistics views: projections combining
  several origins.

No separate “approved reflections” table or model was found. The closest
observed flow is:

1. Aim creates a reflection.
2. The participant saves it as an echo.
3. The participant submits it as shared insight.
4. An admin approves it.

Whether the product uses “approved reflection” as another intended concept is
**Needs verification**.

### 2.3 Retrieval patterns

#### Reflection

- reads active local keys;
- sends only the last eight local thread messages to `/api/reflect`;
- stores the full updated local thread after each successful response;
- inserts a new `meetings` row after each successful response.

#### Attunement

- reads the ten most recent meeting rows;
- reads the ten most recent echo rows;
- reads the latest journey notice;
- combines them with collective Aim memory.

#### Journey

- reads all meeting rows;
- reads all echo rows;
- reads all prior journey notices;
- groups meeting rows by session;
- combines all of them with collective Aim memory.

No retrieval limit was found for participant history in Journey.

#### Trajectory

- reads five recent meetings;
- reads five recent echoes;
- reads three recent journey notices;
- reads all locally stored detected themes;
- combines them with collective Aim memory.

#### Collective memory

- collective Aim memory reads eight recent approved shared insights;
- collective recurring-word calculation reads up to fifty approved insights;
- public `/api/shared-insights` reads all approved rows without an application
  limit;
- public `/api/collective-echo` returns up to fifty approved rows through the
  helper.

### 2.4 Display patterns

| View | Source-of-truth behavior |
| --- | --- |
| History | Supabase meetings; deduplicates repeated messages for display |
| Landmarks | Supabase echoes |
| Journey Reflections | Supabase journey notices |
| Trajectory History | Supabase directions |
| Themes | Recomputes from Supabase, then caches locally |
| Timeline | Supabase meetings, echoes, notices, directions |
| Path | Supabase core records plus local themes and local shared markers |
| Statistics | Supabase counts plus local themes and local shared markers |
| Profile | Local echoes, themes, and trajectory history only |
| Shared Insights | All approved remote shared insights |
| Collective Echo | Approved remote echoes plus calculated recurring words |
| Movement Map | Legacy local journey-reflection key only |
| Theme Evolution | Legacy local history, landmarks, and journey-reflection keys |

The same conceptual memory can therefore appear differently across devices or
views because some views use Supabase and others use local mirrors.

## 3. Memory Feedback Loop Analysis

Feedback is a natural part of an encounter. Human words can shape Aim's
reflection, and Aim's reflection can shape what the human notices or says next.
The return of Aim's words is therefore not inherently a defect.

The audit concern is narrower:

- repetition that is not visible as repetition;
- amplification without an intentional boundary;
- loss of provenance;
- duplicated storage or context;
- later synthesis being treated as stronger evidence merely because it has
  been repeated.

### 3.1 Severity scale

- **Critical:** can materially affect cross-user memory, privacy, or repeated AI
  behavior at system level.
- **High:** can strongly amplify, duplicate, or harden AI-generated material in
  a participant's future encounters.
- **Medium:** useful continuity with meaningful drift, stale-state, or control
  risks.
- **Low:** limited scope or primarily presentational inconsistency.

### 3.2 Loop inventory

| Loop | Path | Benefit | Risk | Severity |
| --- | --- | --- | --- | --- |
| Active reflection continuity | Aim response → local thread → next Reflection prompt | Maintains conversational continuity | Aim responds partly to its own prior language; errors or framing can reinforce | Medium |
| Continued saved meeting | Meeting thread → Supabase → History continuation → local thread → Reflection | Reopens a prior encounter | Old Aim framing re-enters as current context; no visible provenance distinction beyond role | Medium |
| Meeting-to-attunement | Aim response in `meetings` → Attunement history → new Aim question | Makes the next opening context-aware | Generated interpretation may shape future questions as if it were participant memory | High |
| Echo loop | Aim response → participant saves echo → `echoes` → Attunement/Journey/Trajectory | Gives agency to what should remain | Selected Aim wording can be repeated and amplified without its provenance or earlier context remaining visible | High |
| Journey recursion | Meetings/echoes/prior notices → Aim journey notice → `journey_notices` → future Journey | Supports continuity across encounters | Earlier AI synthesis becomes evidence for later synthesis and can harden into a narrative | High |
| Journey-to-attunement | Aim journey notice → Attunement → new Aim question | Connects current opening with earlier movement | A summary can steer the next encounter even when the participant did not explicitly select it | High |
| Journey-to-direction | Aim journey notices → Trajectory → Aim direction | Allows movement to be noticed over time | Multiple layers of AI synthesis can produce false coherence or indirect guidance | High |
| Theme-to-direction | User/Aim text + journey notices → deterministic themes → local cache → Trajectory | Gives a compact recurrence signal | Keyword presence becomes AI context without source excerpts, freshness, or confidence | High |
| Collective AI loop | Aim response → participant submission → admin approval → collective prompt memory → later Aim outputs | Allows chosen echoes to enrich shared context | Aim can learn from and amplify its own generated language across users | Critical |
| Collective recurrence loop | Approved hybrid text → word counts → collective prompt memory → Aim output → future shared text | Notices common words | Frequency can become self-reinforcing social meaning; sample and provenance are hidden | High |
| Attunement bridge | Aim-generated quiet question → local question → Reflection prompt | Connects attunement to encounter | Aim initiates both question and response, reducing participant-originated grounding | Medium |
| Trajectory display loop | Aim trajectory → local/remote save → Path/Profile/Timeline | Gives the participant continuity | No current AI route reads saved directions, so current effect is presentational rather than generative | Low |

### 3.3 Cumulative meeting-snapshot loop

The most important participant-memory growth issue is how Reflection persists
meetings.

After every successful Aim response:

1. the full updated thread is stored locally;
2. a new local history item is prepended;
3. a new Supabase `meetings` row is inserted;
4. the new row contains the full cumulative thread.

For a multi-turn encounter, later rows repeat earlier messages.

Example:

```text
Row 1 thread: U1, A1
Row 2 thread: U1, A1, U2, A2
Row 3 thread: U1, A1, U2, A2, U3, A3
```

Consequences:

- storage grows faster than the number of unique messages;
- the same participant and Aim text appears in several rows;
- History has explicit deduplication logic to hide repeated messages;
- Timeline treats each row as a meeting item;
- Path and Statistics count rows, not distinct sessions;
- Journey groups rows by session but does not deduplicate messages while
  rebuilding its session list;
- Journey can therefore send repeated earlier messages to the AI;
- source-count metadata can describe response snapshots as meetings.

Benefit:

- each row is a recoverable snapshot.

Risks:

- duplicated storage;
- inflated counts;
- inflated AI context;
- repeated wording receiving accidental weight;
- increasing token cost;
- confusing “meeting,” “turn,” “row,” and “session.”

Severity: **High**.

Whether snapshot persistence is intentional is **Needs verification**.

### 3.4 Echo consistency loop

Saving an echo creates:

- a local `expectum_landmarks` entry with a timestamp-based local ID;
- a separate Supabase `echoes` row with a database-generated ID.

When the participant clicks the active Reflection button to remove a saved
echo, only the local entry is removed. The Supabase row is not deleted.

Consequences:

- the active encounter can show the echo as unsaved while it remains remotely
  stored;
- Landmarks can show the echo again after reload;
- the remote echo continues to influence Attunement, Journey, Themes, and
  Trajectory;
- saving the same Aim response again can insert another remote row because the
  local marker was removed.

Severity: **High**.

### 3.5 Journey growth loop

Opening Journey automatically generates a notice and saves it when the exact
text and selected source counts differ from the latest notice.

Because model output can vary while source counts remain the same, repeated
generation can create additional notices from unchanged underlying records.

The duplicate check compares:

- exact text;
- meeting-row count;
- echo count.

It does not include `sessions_count` in the equality condition.

Consequences:

- repeated “Märka uuesti” actions can grow memory without new participant
  material;
- each new notice becomes input for the next Journey request;
- the prior-notice list and prompt payload grow without a retrieval limit;
- later notices may increasingly summarize earlier summaries.

Severity: **High**.

### 3.6 Collective feedback loop

Shared insight submission stores:

- the preceding participant question;
- the selected Aim response;
- question count;
- approval state;
- timestamp.

The table insert does not include a `user_id` in current application code.

After admin approval:

- the record becomes publicly visible;
- its text enters collective word counting;
- up to eight recent approved texts can enter every OpenAI prompt;
- it can influence participants other than the original submitter.

Benefits:

- participant-approved echoes can contribute to a wider human context;
- collective recurrence can become visible without publishing an identity.

Risks:

- no application-level ownership link for participant withdrawal;
- Aim-generated text can be mistaken for participant-authored insight;
- Aim can recursively amplify its own phrasing;
- one participant's selected text can influence another's encounter;
- collective text is inserted into system-prompt content;
- retention after personal Memory clear is not obvious from the user action.

Severity: **Critical**.

## 4. User Agency Analysis

### 4.1 What participants can currently create or choose

Participants can:

- create questions and follow-up messages;
- choose meeting mode;
- begin a new browser session rhythm;
- choose an Aim response as an echo;
- choose to submit a saved Aim response to shared review;
- choose to save an Aim-generated trajectory;
- request regeneration of attunement, journey, and trajectory output.

Journey notices are saved automatically after generation. No separate save
confirmation is required.

### 4.2 What participants can edit

Participants can edit:

- a question before submitting it;
- a follow-up before submitting it;
- the admin key input, if they have access to the hidden admin page.

No participant editing flow was found for:

- saved meetings;
- stored threads;
- saved echoes;
- journey notices;
- saved directions;
- submitted shared insights;
- profile identity.

### 4.3 What participants can delete

Participants can:

- delete an individual Supabase echo from Landmarks;
- delete an individual Supabase direction from Trajectory History;
- delete all meeting rows from History;
- delete all journey notices from Journey Reflections;
- delete all directions from Trajectory History;
- delete meetings, echoes, journey notices, and directions together from
  Settings;
- clear registered local Expectum memory from Settings;
- clear active session state from Pause;
- clear legacy local movement-map data.

Important limitations:

- History has no individual meeting/session deletion;
- Journey Reflections has no individual notice deletion;
- active Reflection “remove echo” removes only the local marker;
- no participant-facing shared-insight withdrawal exists;
- no profile or Auth account deletion exists;
- no user-facing deletion for public collective echoes exists;
- no user-facing control over provider logs, backups, or caches exists.

### 4.4 What participants can approve

There are two approval layers:

1. participant consent to submit an Aim response to the collective queue;
2. admin approval to make it approved collective memory.

The participant cannot approve public visibility directly.

The admin can:

- approve;
- hide;
- delete.

### 4.5 What participants cannot currently control

Participants cannot currently:

- see a complete provenance label distinguishing their text, Aim text, and
  derived text across all views;
- edit stored memory;
- withdraw a submitted shared insight;
- identify a shared-insight database record as theirs;
- see whether a submitted echo is pending, approved, hidden, or deleted after
  local browser state is lost;
- prevent automatically generated Journey notices from being saved;
- choose which earlier journey notices return to future AI context;
- choose whether collective memory influences a specific encounter;
- remove one meeting from a multi-turn session;
- reconcile local and remote copies;
- see which stored items were included in a particular AI request;
- define retention duration;
- export all memory;
- delete persistent identity from the Memory page;
- verify that all remote deletion operations were atomic;
- control external OpenAI or Supabase operational retention.

### 4.6 Memory clear behavior

Settings runs four independent Supabase deletions in parallel:

- `directions`;
- `journey_notices`;
- `echoes`;
- `meetings`.

If any deletion reports an error:

- local memory is not cleared;
- an error message is shown.

However, the four remote deletes are not an application-level transaction.
Some tables may already be deleted while another fails.

This can produce partial remote clearing while local memory remains.

Memory clear does not remove:

- profile;
- Auth user;
- shared insights;
- admin key;
- sound preference.

The confirmation mentions meetings, echoes, journey notices, and saved
directions, but does not explain that previously submitted collective echoes
remain.

Severity: **High** for agency clarity and partial-state risk.

### 4.7 Source-of-truth agency mismatch

Several controls affect only one copy:

| Action | Local result | Remote result | Risk |
| --- | --- | --- | --- |
| Remove echo in active Reflection | Removes local landmark | Remote echo remains | High |
| Delete echo in Landmarks | Local landmark may remain | Remote echo removed | Medium |
| Save trajectory before remote insert | Local history updated first | Remote insert may fail | Medium |
| Clear meetings in History | Local legacy history removed | Remote deletion may fail but UI is set empty | Medium |
| Clear journey notices page | Latest local `expectum_journey` remains | Remote notices removed | Medium |
| Clear directions page | Local trajectory history remains | Remote directions removed | Medium |
| Submit shared insight | Local marker saved after API success | Remote row has separate ID and no current user ownership field | High |

This makes “saved,” “removed,” and “cleared” dependent on which page the
participant uses.

## 5. Growth and Noise Analysis

### 5.1 Likely growth areas

#### Meetings

Likely fastest-growing participant table because:

- each successful Aim response inserts a row;
- each row can contain the full cumulative thread;
- multi-turn sessions repeat prior messages.

Risk: **High**.

#### Journey notices

Growth is automatic:

- opening Journey generates;
- “Märka uuesti” generates;
- exact-text variation can create new records without new source material;
- all previous notices are retrieved for future Journey.

Risk: **High**.

#### Shared insights

Potentially unbounded:

- no retention or submission maximum found;
- no uniqueness check found;
- no participant ownership field inserted by application code;
- approved rows remain public and reusable.

Risk: **High**, and **Critical** when considering cross-user AI influence.

#### Local mirrors

Local arrays are prepended without size limits:

- history;
- landmarks;
- trajectory history;
- shared-insight markers.

Browser storage quota and failure handling are **Needs verification**.

### 5.2 Duplication risks

1. cumulative meeting snapshots repeat messages;
2. local history duplicates Supabase meeting history;
3. local landmarks duplicate Supabase echoes with unrelated IDs;
4. local trajectory history duplicates Supabase directions;
5. local shared markers duplicate Supabase submissions without remote IDs;
6. latest journey and trajectory text duplicate generated display state;
7. detected themes duplicate a derivation that can be recomputed;
8. Aim-generated text can be present in meetings, echoes, shared insights,
   journey notices, and later AI outputs.

### 5.3 Noise risks

- repeated messages can be weighted more strongly in Journey;
- repeated AI summaries can outweigh original participant text;
- counts can measure rows rather than encounters;
- local and remote views can disagree;
- collective recurrence can reflect Aim's vocabulary rather than independent
  human recurrence;
- old local derived themes can survive until explicitly recomputed or cleared;
- Profile can show local data that differs from Supabase-backed Memory pages;
- Path and Statistics combine remote records with local-only derived state;
- legacy local keys can preserve stale data no longer written by current flows.

### 5.4 Retrieval complexity risks

#### Journey

Journey retrieves:

- every meeting row;
- every echo;
- every prior journey notice.

It then reconstructs sessions without the History page's duplicate-message
check.

As data grows:

- browser transformation cost grows;
- request payload grows;
- OpenAI context grows;
- repeated snapshots amplify token use;
- output may depend more on duplicated history than unique encounters.

Severity: **High**.

#### Mixed-source views

Path, Statistics, and Profile do not share one retrieval strategy:

- Path: remote core + local themes + local shared markers;
- Statistics: remote counts + local themes + local shared markers;
- Profile: local mirrors only.

Cross-device consistency is therefore not guaranteed.

#### Collective retrieval

- `/api/shared-insights` returns all approved rows;
- collective echo helper limits to fifty;
- collective Aim memory uses eight texts plus words derived from fifty;
- no pagination UI was found.

As approved memory grows, user display and prompt background represent
different windows of the same collection.

### 5.5 Count semantics

Several displayed counts can be misleading:

- `meetings.length` counts stored rows, not necessarily distinct sessions;
- Journey stores both `history_count` and `sessions_count`, revealing the
  distinction but not resolving it;
- Statistics counts all non-`thought` rows as ordinary meetings, including
  `exploration`;
- Timeline creates one meeting item per row;
- Path reports meeting-row count;
- local shared count measures submissions remembered by one browser, not
  current remote approval or existence.

The intended meaning of “meeting count” is **Needs verification**.

### 5.6 Legacy memory

`expectum_journey_reflections` has readers and clearing logic but no active
writer was found.

It remains used by:

- `/movement-map`;
- `/theme-evolution`.

This suggests orphaned legacy memory. Its migration, removal, and compatibility
requirements are **Needs verification**.

## 6. Smallest Safe Improvements

These are recommendations only. No implementation is included.

### Priority A — Clarify before changing

#### 1. Define memory provenance

Every durable memory category should have an explicit origin classification:

- participant-authored;
- Aim-authored;
- participant-selected Aim text;
- system-derived;
- collective-approved;
- mixed.

The smallest first step is a documented provenance field plan, not a schema
change.

#### 2. Define one source of truth per category

Document whether the authority is:

- active local state;
- Supabase;
- recomputed derivative;
- collective store.

Do not remove local mirrors until all consumers are mapped and migration
behavior is approved.

#### 3. Decide meeting storage granularity

Choose and document whether a durable `meetings` row represents:

- a whole encounter/session;
- one user/Aim turn;
- a cumulative snapshot.

The smallest first step is to compare current rows for one multi-turn session
and quantify duplication.

#### 4. Define collective ownership and withdrawal

Before changing the table:

- decide whether a participant must be able to see submission status;
- decide whether they can withdraw pending or approved content;
- define whether an ownership link may be retained without public identity;
- define what Memory clear promises about collective submissions.

#### 5. Define memory provenance and reuse roles

Document that:

- participant text;
- Aim reflection;
- participant-selected echo;
- Aim journey summary;
- derived theme;
- collective recurrence

have different origins and reuse paths.

This distinction is not a ranking of the human above Aim or Aim above the
human. Both participate in the meeting. Provenance is needed so later systems
can control duplication, explain context, and avoid treating repeated
synthesis as newly independent support.

### Priority B — Small future implementation candidates

#### 6. Align echo deletion

Future implementation should make local and remote echo removal one explicit
operation with one stable identifier.

#### 7. Add insufficient-change checks for Journey persistence

Separate “generate for viewing” from “save as durable journey memory,” or
otherwise avoid durable growth when source material has not changed.

#### 8. Bound Journey retrieval

After determining the correct unit:

- deduplicate messages;
- use distinct sessions rather than cumulative snapshots;
- limit source windows;
- preserve participant-selected echoes with explicit weighting;
- avoid sending all prior AI summaries.

#### 9. Reconcile local and remote direction state

Do not present local save success before remote persistence is known, or clearly
label local-only state.

#### 10. Make Memory clear semantics explicit

Future UI copy should distinguish:

- active local state;
- participant Supabase memory;
- profile/Auth identity;
- collective submissions;
- operational preferences.

It should not assume that permanent deletion of every trace is the only
desirable long-term model.

#### 11. Add pagination or bounded display

Potential future targets:

- approved shared insights;
- collective echoes;
- long histories;
- timeline;
- journey notices.

### Priority C — Later cleanup

#### 12. Retire or migrate orphaned legacy keys

Only after confirming compatibility requirements:

- `expectum_journey_reflections`;
- local legacy history consumers;
- legacy movement and theme pages.

#### 13. Recompute derived memory where possible

Themes and counts may be safer as reproducible views than durable local memory,
provided performance and offline behavior are acceptable.

#### 14. Add memory observability

Consider a private diagnostic view or audit tool that can show:

- category;
- source;
- timestamp;
- local/remote presence;
- AI influence;
- deletion status.

This should not become a participant-scoring dashboard.

## Product Direction Clarifications

### Reconsider “Puhasta mälu”

The current application implements “Puhasta mälu” as deletion of selected
participant-associated Supabase records plus removal of registered local
storage keys.

This audit documents that behavior, but does not assume that complete deletion
is the desired long-term meaning of memory in Expectum.

In Expectum, a trace may remain part of a meeting or journey even when it
should no longer be active in the present encounter. Future product models to
evaluate include:

- reduce active memory;
- release active use of selected traces;
- hide a trace from the current journey;
- archive a trace;
- stop using selected traces as future AI context;
- allow participant-controlled withdrawal from shared or collective space;
- permanently delete a trace where deletion is appropriate or legally
  required.

These models are not equivalent. The final product model, terminology, and
interaction design are **Needs decision**.

The user-facing phrase “Puhasta mälu” should not be treated as settled product
language until that decision is made.

### Human and Aim contributions

The meeting is central. Both the human and Aim participate in it.

The audit distinguishes:

- human-originated text;
- Aim-originated reflection;
- the shared meeting thread;
- later synthesis such as Journey or Direction;
- participant-selected and collectively approved traces.

This distinction exists for:

- clarity;
- provenance;
- user agency;
- noise control;
- explaining later reuse;
- preventing accidental duplication.

It does not mean that Aim-originated text is merely lower-value derived
content, nor does it rank one participant above the other.

The unresolved product question is how each contribution should be named,
displayed, retained, and reused while preserving the meeting as the primary
unit. This is **Needs decision**.

### Feedback loops

Not every feedback loop is harmful.

A healthy meeting can include:

1. the human speaks;
2. Aim reflects;
3. the human responds to that reflection;
4. the shared thread changes what becomes visible next.

Continuity can also legitimately return an earlier trace to a later meeting.

Risk begins when:

- repeated material is unmarked;
- one phrase is amplified across several storage layers;
- provenance is lost;
- an earlier synthesis is mistaken for fresh independent evidence;
- collective recurrence is treated as proof;
- the participant cannot see or control important reuse.

Future design should preserve useful continuity while controlling these failure
modes. The acceptable boundaries for participant, journey, and collective
feedback are **Needs decision**.

### Noise reduction principle

The goal is not to erase memory.

The goal is to reduce:

- duplicate storage;
- uncontrolled growth;
- stale local mirrors;
- repeated context;
- unclear reuse;
- synthesis that accumulates without new meeting material.

A quieter memory architecture may retain traces while changing whether they
are active, visible, archived, or eligible for future AI context.

The long-term balance between preservation, release, archive, withdrawal, and
deletion is **Needs decision**.

## 7. Items Requiring Verification

### Database and policy

1. Complete Supabase schema.
2. Row Level Security policies for every participant table.
3. Whether `shared_insights` intentionally has no participant ownership field.
4. Foreign keys, uniqueness constraints, indexes, and deletion behavior.
5. Backup, point-in-time recovery, log, and cache retention.
6. Whether service-role API use is bounded as intended.
7. Whether partial Settings deletion can be made transactional.

### Retention

8. Intended lifetime of meetings, echoes, journey notices, directions, and
   shared insights.
9. Intended lifetime of local browser memory.
10. Whether stale local state should expire.
11. OpenAI request, response, abuse-monitoring, and log retention.
12. Vercel function-log retention for request or error data.
13. Supabase Auth browser-session persistence.

### Product meaning

14. Whether one `meetings` row means a turn, snapshot, or encounter.
15. Whether “meeting count” should mean rows, turns, or distinct sessions.
16. Whether Journey notices should save automatically.
17. Whether repeated Journey generation without new source material should be
    durable.
18. Whether direction notices should ever influence future AI.
19. Whether the latest local journey and trajectory keys are still required.
20. Whether `expectum_journey_reflections` must remain for compatibility.
21. Whether Profile should use local mirrors or Supabase.
22. Whether Path and Statistics should show pending local shared submissions,
    approved remote submissions, or both.

### User agency

23. Whether participants must be able to edit stored memory.
24. Whether participants must be able to delete individual meetings and
    journey notices.
25. Whether participants must be able to withdraw collective submissions.
26. Whether Memory clear should remove collective submissions.
27. Whether account/profile deletion belongs in Settings or a separate flow.
28. Whether users need export or portability.
29. Whether a participant should choose when Journey output becomes durable.
30. Whether collective-memory influence can be disabled for an encounter.

### Provenance and AI influence

31. Provenance mix of existing `shared_insights`.
32. Whether approved shared text is participant-authored, Aim-authored, or
    mixed.
33. Whether Aim-generated text should be permitted to re-enter Aim through
    collective memory.
34. Whether prior journey notices should be treated as evidence or only as
    tentative context.
35. Whether derived themes should be included in Trajectory prompts without
    supporting excerpts.
36. Whether repeated cumulative thread snapshots currently inflate Journey
    context in production data.

### Security and privacy

37. Authentication and rate limiting for memory-related APIs.
38. Prompt-injection isolation for approved collective text.
39. Privacy review of public approved question/echo pairs.
40. Admin-key storage and rotation expectations.
41. Whether error logs can include participant content through upstream error
    objects.

## Audit Conclusion

Expectum's memory architecture already expresses an important principle:
memory is meant to preserve continuity without determining meaning.

The current implementation partially supports that principle through:

- participant-selected echoes;
- explicit direction saving;
- clear participant views;
- a central Memory page;
- broad personal-memory clearing;
- collective approval before public display.

The largest risks come from blurred distinctions:

- a row versus a meeting;
- local versus remote authority;
- the provenance of human text, Aim reflection, shared thread, and later
  synthesis;
- generated synthesis versus evidence;
- personal memory versus collective memory;
- hidden persistence versus visible user control.

The next safe step is not a broad memory refactor. It is to approve:

1. a provenance model;
2. a source-of-truth map;
3. a meeting-storage unit;
4. collective ownership and withdrawal rules;
5. the context and reuse role of each memory layer;
6. the product meaning of active memory, archive, release, withdrawal, and
   deletion.

Only then should implementation changes be divided into small, separately
reviewed pull requests.
