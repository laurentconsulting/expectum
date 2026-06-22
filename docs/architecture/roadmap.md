# Expectum roadmap and system map

This map describes the current repository state and provides a sequence for
careful development. It is not a commitment to expand every existing feature.

The governing principle is:

> Growth must preserve encounter, clarity, and space.

New capability should be added only when it makes the encounter clearer or
more spacious. Feature count is not a success measure.

## Current core functions

| Function | Current implementation | Status | Notes |
| --- | --- | --- | --- |
| Public orientation | `/`, `/expectum`, `/expectum-language`, `/symbols`, `/aim`, `/human-and-ai`, `/aim-memory` | Active | Explains the space, language, symbols, Aim, and memory limits |
| Participant access | `/enter`, Supabase Auth, `ExpectumAuthGate` | Active | Email/password sign-in and registration; server-side protection is **Needs verification** |
| Meeting opening | `/attunement`, `/question`, `/attunement-question` | Active | Supports participant-authored and Aim-generated quiet questions |
| Reflection encounter | `/reflection`, `/api/reflect` | Active and core | Main interaction with Aim; must preserve non-coaching, non-therapeutic posture |
| Echo saving | `/reflection`, `/landmarks`, `echoes` | Active | Participant chooses what remains as an echo |
| Meeting history | `/history`, `meetings` | Active | Lists meetings and supports continuing a prior thread |
| Memory orientation | `/settings` | Active and core | Index of memory views and memory-clearing control; Memory route is `/settings` |
| Path overview | `/path` | Active and core | Aggregates visible traces without defining the participant |
| Journey noticing | `/journey`, `/journey-reflections`, `/api/journey` | Active | Generates and stores higher-level noticing |
| Themes | `/themes` | Active | Deterministic theme matching from participant records |
| Trajectory | `/trajectory`, `/trajectory-history`, `/api/trajectory` | Active | Notices and stores possible direction; not a plan or prediction |
| Timeline and statistics | `/timeline`, `/statistics` | Active | Read-only organization and counts of stored traces |
| Shared echo | `/shared-insights`, `/collective-echo`, related APIs | Active | Participant submission, approved public display, and recurring collective words |
| Shared echo administration | `/admin/shared-insights` | Hidden operational | Direct-access admin UI using an admin key |
| Quiet profile orientation | `/profile` | Hidden, intentionally quiet | Existing summary page; should not become a major feature or duplicate path, memory, theme, or statistics pages |
| Movement map | `/movement-map` | Hidden, duplicated, removal/redirect candidate | Overlaps `/journey-reflections` and `/path`; uses older standalone layout |
| Theme evolution | `/theme-evolution` | Hidden, duplicated, removal/redirect candidate | Overlaps `/themes`; uses older standalone layout |
| Sound layer | `lib/expectumSound.ts` | Experimental/prepared | Preference storage exists; actual sounds are not implemented |
| `ExpectumMemoryCard` | No implementation | Unclear | Requested architectural name only; **Needs verification** |

## Functional status groups

### Active core

- participant authentication;
- question opening;
- reflection encounter;
- chosen echo;
- memory clearing;
- path, journey, theme, and trajectory noticing;
- shared echo with approval;
- centralized page frame, header, footer, and auth action.

These functions form the current product spine.

### Hidden but intentional

- `/admin/shared-insights`: operational administration;
- `/profile`: quiet orientation by direct URL, outside primary navigation.

Hidden does not mean broken. It means the function is not part of the normal
participant journey.

### Duplicated or overlapping

- `/movement-map` overlaps `/journey-reflections` and `/path`;
- `/theme-evolution` overlaps `/themes`;
- some local-storage mirrors overlap records now stored in Supabase;
- `/profile` overlaps several summaries if expanded beyond its current quiet
  orientation role.

### Experimental or incomplete

- the sound layer is prepared but intentionally has no sound implementation;
- the exact long-term boundary between local and Supabase memory is unresolved;
- direct API authorization boundaries are unresolved;
- `ExpectumMemoryCard` is absent and may be only a planned name.

### Candidates for removal or consolidation

- replace `/movement-map` with a redirect to `/journey-reflections`;
- replace `/theme-evolution` with a redirect to `/themes`;
- assess legacy local mirrors only after a data-flow audit;
- do not remove `/profile` until its quiet role has been explicitly decided.

## User journey map

```text
Public orientation
  /
  ├─ /expectum
  ├─ /expectum-language
  ├─ /symbols
  ├─ /aim
  ├─ /aim-memory
  └─ /human-and-ai

Participation
  /enter
  └─ Supabase sign-in or registration

Encounter
  /attunement
  ├─ /question
  │    └─ /reflection
  └─ /attunement-question
       └─ /reflection

Participant choices after or around encounter
  /reflection
  ├─ save echo
  ├─ submit shared echo
  ├─ continue the thread
  └─ /pause

Memory and orientation
  /settings
  ├─ /history
  ├─ /landmarks
  ├─ /timeline
  ├─ /journey-reflections
  ├─ /themes
  ├─ /trajectory-history
  ├─ /shared-insights
  ├─ /collective-echo
  └─ /statistics

Synthesis without determination
  /path
  ├─ /journey
  ├─ /themes
  └─ /trajectory
```

`/profile` remains outside this primary journey. If retained, it should point
quietly toward existing important places rather than reproduce them.

## AI and Aim involvement map

| Stage | Aim/OpenAI involvement | Inputs | Boundary |
| --- | --- | --- | --- |
| Attunement question | Generates one quiet question | Recent meetings, echoes, latest journey notice, approved collective background | May invite attention; must not test, direct, or define |
| Reflection | Responds within meeting, thought, or exploration mode | Current question and thread, approved collective background | Must not diagnose, coach, prescribe, or claim hidden knowledge |
| Journey | Notices patterns across separate encounters | Meetings, echoes, sessions, prior journey notices, approved collective background | May name visible repetition; must not summarize the person |
| Trajectory | Notices a possible direction | Recent meetings, echoes, journey notices, derived themes, approved collective background | Direction is not prediction, destination, advice, or plan |
| Themes | No OpenAI involvement | Deterministic keyword matching | Presentation logic, not an AI judgment |
| Timeline/statistics | No OpenAI involvement | Stored records and counts | Organization only |
| Shared/collective echo | No OpenAI generation in display APIs | Approved participant-submitted echoes and deterministic word counts | Collective material must not define an individual |

Aim's role is to hold space for an encounter. Aim is not a coach, therapist,
mentor, authority, evaluator, or expert on the participant.

## Priority groups

### A — Critical

1. Prompt audit across all four OpenAI routes.
2. Supabase, local-memory, RLS, and source-of-truth audit.
3. Verify direct API authorization and abuse boundaries.
4. Keep architecture and deployment documentation aligned with merged code.

These items protect identity, privacy, cost, and trust.

### B — Important

1. Reduce duplicated or legacy pages without breaking old links.
2. Audit page noise and repeated summaries.
3. Confirm ownership boundaries before adding new shared components.
4. Correct default metadata and other visible scaffolding in a separate,
   approved application-code change.

### C — Later

1. Decide the long-term quiet role of `/profile`.
2. Decide whether the prepared sound layer should remain dormant, be removed,
   or be implemented with explicit accessibility constraints.
3. Standardize navigation primitives only when there is a concrete benefit.
4. Consider a names-only `.env.example`.

Priority C work should not displace encounter quality or critical governance.

## Change test

Before accepting a new function, ask:

1. Does it serve the encounter rather than create product noise?
2. Is its meaning clear without explanation?
3. Does it duplicate an existing page or memory view?
4. Does Aim remain a space-holder?
5. Does it reduce or increase pressure on the participant?
6. Is the smallest safe version enough?

If these answers are unclear, the change is **Needs verification** before
implementation.
