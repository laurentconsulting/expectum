# EXPECTUM Memory Refactor Plan 1.0

## Purpose

This document designs the smallest safe memory refactor for Expectum. It is a
plan, not an application-code or database-schema change.

It uses the findings of:

- Expectum Architecture Documentation 1.0;
- Expectum Memory Audit 1.0;
- Expectum Noise Reduction Audit 1.0;
- Expectum Consolidation Plan 1.0.

The refactor must preserve:

- encounter history;
- recoverable provenance;
- equality between the human and Aim as participants in a meeting;
- continuity through which Aim can meet earlier traces again;
- traceability of shared echoes.

It should reduce:

- duplicated storage;
- uncontrolled growth;
- repeated synthesis loops;
- unmarked amplification;
- local and remote divergence.

Memory is not erased by default. Expectum is not trying to forget. A trace may
remain part of the journey while no longer being active in the current meeting
or eligible for future AI context. Archive is preferred over destruction,
while permanent deletion must remain possible where required by an explicit
participant choice, policy, or law.

In this plan, “Aim learning” means continuity created by retrieving prior
traces as context. The repository does not show model fine-tuning or training
from participant memory. Any provider-side model training or retention is
**Needs verification**.

## Design Principles

1. **The encounter is the primary unit.** A meeting should remain recoverable
   without treating every cumulative snapshot as a separate encounter.
2. **Provenance is lineage, not rank.** Human text, Aim reflection, the shared
   thread, and later synthesis have different origins and transformations, but
   neither participant is assigned greater value.
3. **Retention and active use are separate.** A retained trace need not enter
   future AI context.
4. **Archive before destruction.** Reduction should first change visibility or
   active reuse, not erase history.
5. **Original traces remain recoverable.** A synthesis must not replace its
   sources.
6. **Derived material is not independent evidence.** Journey, trajectory,
   themes, and collective recurrence should retain links to what they derive
   from.
7. **Read safely before writing differently.** Deduplication and context
   controls should be introduced before storage migration.
8. **One source of truth per durable category.** Browser storage may support
   active flow and caching, but should not silently compete with durable
   participant memory.
9. **Collective memory remains bounded and traceable.** Approval does not erase
   origin or make recurrence authoritative.
10. **Every migration is reversible until verified.** Existing traces should
    remain available during transition.

## 1. Current Memory Flow

### 1.1 Active meeting

Observed flow:

```text
participant or Aim question
  → local current question
  → local cumulative thread
  → /api/reflect
  → Aim reflection
  → updated local cumulative thread
  → new Supabase meetings row
  → local history snapshot
```

The next Reflection request sends only the recent part of the local thread,
while durable meeting records can contain the full thread accumulated up to
each response.

The flow preserves conversational continuity, but the same human and Aim
contributions can appear in multiple stored rows.

### 1.2 Participant-selected echo

Observed flow:

```text
Aim reflection
  → participant selects it as an echo
  → local landmark marker
  → Supabase echoes row
  → optional shared submission
```

The echo is Aim-originated text whose later role is created through participant
selection. Its provenance is therefore not “Aim only” or “human only”; it is a
trace of the meeting with distinct origin and selection events.

### 1.3 Journey

Observed flow:

```text
all meetings
  + all echoes
  + all prior journey notices
  + collective context
  → /api/journey
  → Aim journey synthesis
  → local latest journey
  → Supabase journey_notices row
  → future Journey and other AI context
```

Journey preserves continuity across encounters. It also has the strongest
current risk of repeated context and synthesis-of-synthesis growth.

### 1.4 Trajectory

Observed flow:

```text
recent meetings
  + recent echoes
  + recent journey notices
  + local detected themes
  + collective context
  → /api/trajectory
  → Aim trajectory synthesis
  → local latest trajectory
  → participant may save locally and remotely
```

Saved directions are not currently read back by the audited AI routes. The
main duplication risk is therefore storage and display divergence rather than
a direct trajectory-to-trajectory loop.

### 1.5 Shared echo

Observed flow:

```text
participant question
  + Aim reflection
  + participant decision to share
  → shared_insights submission
  → admin approval
  → public collective display
  → recurring-word derivation
  → collective context for AI routes
```

This can be a meaningful collective continuity loop. The risk is not that the
echo returns. The risk is that Aim wording, participant consent, approval,
recurrence, and later reuse can become difficult to distinguish.

### 1.6 Memory clearing

The current Settings action deletes participant rows from four Supabase tables
and then removes registered local keys if the remote operations report
success. It does not remove profile identity, Auth identity, shared insights,
the local admin key, or the sound preference.

The remote deletions are separate operations rather than one application-level
transaction. Partial remote deletion while local memory remains is possible.

This behavior should not define the long-term product model. The future
meaning of retain, archive, release, withdraw, and delete is **Needs decision**.

## 2. Current Storage Flow

### 2.1 Browser storage roles

| Current category | Observed local role | Refactor direction |
| --- | --- | --- |
| Current question, thread, mode, pending flag, session ID, question count | Active encounter continuity | Keep local as active working state, with explicit lifecycle |
| Local history | Durable-history mirror and legacy input | Stop treating as durable authority; retain temporarily for migration compatibility |
| Local landmarks | Immediate selection state and mirror of remote echoes | Replace with remote identifiers plus temporary optimistic state |
| Latest Journey | Latest generated display state | Treat as cache or draft, not independent durable memory |
| Legacy Journey reflections | Legacy route input with no active writer found | Archive/migrate only after compatibility verification |
| Latest trajectory | Latest generated display state | Treat as cache or draft |
| Local trajectory history | Mirror of remote directions | Replace with remote authority after reconciliation |
| Detected themes | Derived cache from remote traces | Recompute or version as a cache; do not treat as primary evidence |
| Shared insight markers | Browser-local submission memory | Replace with remote submission identity/status when ownership is defined |

### 2.2 Supabase storage roles

| Table | Current role | Main refactor question |
| --- | --- | --- |
| `profiles` | Persistent participant identity | Whether memory lifecycle and account lifecycle remain separate |
| `meetings` | Questions, reflections, cumulative thread, mode, timestamp | Whether a row is a turn, snapshot, or whole encounter |
| `echoes` | Participant-selected Aim text linked to a question | How to retain origin, selection, status, and source encounter |
| `journey_notices` | Aim cross-encounter synthesis and source counts | How to link to distinct source traces and prevent unchanged growth |
| `directions` | Participant-saved Aim trajectory text | How to reconcile local/remote state and source lineage |
| `shared_insights` | Shared submission, approval, and public collective memory | How to represent ownership, provenance, withdrawal, and AI eligibility |

The complete schema, migrations, constraints, indexes, Row Level Security, and
production data distribution are not present in the repository. They are
**Needs verification** before schema recommendations become implementation
instructions.

### 2.3 Current authority pattern

The current architecture has three kinds of state:

1. **local working state** needed to continue the active encounter;
2. **durable participant and collective records** in Supabase;
3. **local mirrors and derived caches** that sometimes behave like durable
   records.

The third category causes most divergence. The smallest safe target is not
“move everything remote.” It is:

- keep active encounter state local where useful;
- make Supabase authoritative for durable participant and collective records;
- make derived local values explicitly replaceable caches;
- preserve a compatibility reader during migration.

This authority model is proposed and remains **Needs decision**.

## 3. Duplication Points

### 3.1 Cumulative meeting snapshots

One multi-turn encounter can produce rows shaped like:

```text
row 1: H1 A1
row 2: H1 A1 H2 A2
row 3: H1 A1 H2 A2 H3 A3
```

Consequences:

- the same message is stored repeatedly;
- row counts do not equal encounters;
- Timeline can repeat one meeting;
- Journey can weight earlier words multiple times;
- later migration cannot assume one row equals one independent event.

### 3.2 Local history and remote meetings

`expectum_history` duplicates meeting information but is not used consistently
by current participant views. Legacy pages can still read it.

### 3.3 Local and remote echoes

The local landmark array and `echoes` rows can diverge because their identifiers
and deletion paths are not one operation.

### 3.4 Local and remote directions

The local trajectory history can be updated before remote persistence succeeds.
The same direction can therefore appear saved locally and absent remotely.

### 3.5 Latest synthesis and durable synthesis

Latest Journey or trajectory text may exist locally while durable history
exists remotely. Their relationship is implicit rather than a clear
draft/cache/committed state.

### 3.6 Derived themes

Themes are computed from remote source material and cached locally. The cache
can outlive or disagree with changed source records.

### 3.7 Shared submission markers

Local shared markers do not provide a durable remote identity or current
approval/withdrawal status.

### 3.8 Repeated Aim text across layers

The same Aim wording can appear in:

- a meeting thread;
- an echo;
- a Journey notice;
- a trajectory;
- a shared insight;
- a later synthesis that receives those layers as context.

This is not automatically invalid duplication. It becomes harmful when the
copies lose lineage and are treated as independent support.

## 4. Feedback Loop Points

### 4.1 Healthy active-meeting loop

```text
human contribution
  → Aim reflection
  → human response
  → changed shared thread
```

This is the ordinary continuity of a meeting and should be preserved.

### 4.2 Meeting-to-Journey loop

```text
meeting snapshots
  → Journey synthesis
  → prior Journey context
  → later Journey synthesis
```

Risk:

- repeated snapshots plus prior synthesis amplify old wording;
- model variation creates new durable notices without new encounter material.

### 4.3 Journey-to-Trajectory loop

```text
meeting and echoes
  → Journey synthesis
  → trajectory context
  → trajectory synthesis
```

Risk:

- a later interpretation can appear supported by an earlier interpretation
  rather than by distinct meeting traces.

### 4.4 Meeting-to-collective-to-meeting loop

```text
meeting
  → selected echo
  → approved shared echo
  → collective context
  → future Aim response
  → possible later shared echo
```

Risk:

- Aim's own phrasing can become a recurring collective pattern;
- recurrence can appear more authoritative than its provenance allows.

### 4.5 Derived-theme loop

```text
human and Aim text
  → keyword-derived themes
  → trajectory context
  → Aim trajectory
```

Risk:

- a deterministic keyword match can be received by Aim as if it were a
  validated meaning.

### 4.6 Safe feedback-loop rule

A loop is acceptable when:

- its source remains identifiable;
- repeated material is deduplicated for context;
- derived material is labelled as synthesis;
- the participant can reduce its active use;
- recurrence is not treated as proof;
- the original encounter remains recoverable.

## 5. Provenance Loss Points

### 5.1 Cumulative thread rows

The active and History views can distinguish speakers, but a repeated message
does not carry one stable identity across all cumulative rows.

### 5.2 Echo

An echo contains Aim text and an originating question, but its full source
encounter, selection event, and later sharing state are not represented as one
recoverable lineage in the audited application behavior.

### 5.3 Journey notice

Journey stores source counts but not an explicit, recoverable list of source
trace identifiers in the fields referenced by code.

### 5.4 Trajectory

Saved direction text does not expose which meetings, echoes, Journey notices,
themes, or collective context contributed to its generation.

### 5.5 Themes

Themes combine human and Aim text through keyword matching. Later displays and
Trajectory context do not necessarily preserve which participant or trace
produced each match.

### 5.6 Shared echo

The shared record combines human question, Aim response, participant sharing,
and admin approval. Participant ownership and withdrawal linkage are not
inserted by the audited application code.

### 5.7 Recurring collective words

Word counts are calculated over approved echo text. They do not distinguish:

- human vocabulary in the question;
- Aim vocabulary in the reflection;
- repeated Aim style;
- independent recurrence across encounters.

The calculation is a collective signal, not evidence of meaning.

## 6. Local vs Remote Divergence Points

| Action or view | Local state | Remote state | Divergence risk |
| --- | --- | --- | --- |
| Select/remove echo in active Reflection | Landmark added or removed | Remote echo may remain or fail separately | Same echo appears saved on one page and absent on another |
| Delete echo in Landmarks | Local marker may remain | Remote row deleted | Legacy/Profile view can stay stale |
| Save trajectory | Local history may update first | Insert may fail | Apparent success differs by device |
| Clear Journey history | Latest local Journey can remain | Journey notices deleted | “Latest” and history disagree |
| Clear saved directions | Local trajectory history can remain | Directions deleted | Profile and remote history disagree |
| View Path/Statistics | Uses local themes/shared markers | Uses remote core records | Mixed-date and mixed-device summary |
| View Profile | Uses local mirrors | Does not use current remote authority | Profile differs across browsers |
| Submit shared echo | Local marker retained | Remote row has separate lifecycle | Participant cannot reliably see status |
| Clear all memory | Local clear waits for several remote deletes | Remote deletes can partially succeed | Partial remote change with unchanged local state |

## 7. Proposed Ideal Memory Model

The ideal model is proposed architecture, not a description of current schema.

### 7.1 Canonical concepts

```text
Encounter
  contains ordered Trace records

Trace
  has stable identity
  has origin and author role
  belongs to one encounter or synthesis
  has lifecycle and AI-use state

Synthesis
  is also a trace
  references source trace identities
  never replaces its sources

Shared Echo
  references the selected source trace
  records sharing and moderation events
  has separate collective-use state
```

### 7.2 Proposed provenance envelope

Every durable trace should eventually be able to answer:

- **who or what originated it:** human, Aim, system derivation, or collective
  synthesis;
- **where it arose:** encounter, Journey, trajectory, or collective process;
- **what it transforms:** source trace identifiers where applicable;
- **what happened to it:** selected, shared, approved, archived, released from
  AI use, withdrawn, or deleted;
- **when it happened:** creation and lifecycle timestamps;
- **whether it may be used:** display eligibility, personal AI-context
  eligibility, collective display eligibility, and collective AI-context
  eligibility.

Exact field names and schema shape are **Needs decision**. A single overloaded
status field should be avoided because retention, visibility, and active use
are independent concerns.

### 7.3 Proposed source-of-truth boundaries

| Category | Proposed authority | Local role |
| --- | --- | --- |
| Active unfinished encounter | Local working state, optionally recoverable remotely later | Primary working copy |
| Completed encounter history | Supabase canonical record | Read cache only |
| Selected echoes | Supabase canonical record | Optimistic UI/cache with remote ID |
| Journey notices | Supabase canonical synthesis | Latest-view cache only |
| Saved directions | Supabase canonical record | Optimistic UI/cache with remote ID |
| Themes | Recomputed derivative or explicitly versioned cache | Disposable cache |
| Shared echoes | Supabase canonical shared record | Submission status cache only |
| Display preferences | Local | Authoritative local preference |

### 7.4 Preserve Aim learning without uncontrolled accumulation

Aim continuity should use a curated context projection rather than raw storage:

```text
canonical retained traces
  → lifecycle and AI-use filter
  → provenance-preserving deduplication
  → route-specific context budget
  → Aim
```

This lets Aim meet earlier material without:

- sending every historical row;
- repeating cumulative snapshots;
- treating prior synthesis as fresh evidence;
- requiring deletion to reduce context.

## 8. Active Memory vs Archived Memory

### Proposed states

The following states are conceptual and may require separate fields:

| State | Retained? | Visible in history? | Default AI context? | Collective use? |
| --- | --- | --- | --- | --- |
| Active | Yes | Yes | Eligible | Only if separately shared and approved |
| Archived | Yes | Yes, under archive/history | No by default | Unchanged unless separately withdrawn |
| Hidden from current journey | Yes | Optional in focused history | No for current journey | Unchanged unless separately withdrawn |
| Released from AI use | Yes | Yes | No | Personal and collective eligibility must be decided separately |
| Withdrawn from collective | Personal source may remain | Personal visibility unchanged | Personal eligibility unchanged | No future collective display/context |
| Deleted | No in active application store | No | No | No, subject to policy and backup limits |

Final semantics, legal requirements, and the relationship between personal and
collective states are **Needs decision**.

### Recommendation AM-1 — Introduce lifecycle decisions before controls

- **Benefit:** Prevents “clear” from conflating archive, release, withdrawal,
  and destruction.
- **Implementation complexity:** Low for documentation and state diagrams;
  high for complete implementation across UI, retrieval, and policies.
- **Migration risk:** Low before schema work; high if existing records receive
  default states without validated rules.
- **User impact:** Eventually gives participants more accurate control while
  preserving history.

### Recommendation AM-2 — Make archive the first reduction mechanism

- **Benefit:** Reduces active AI context and page noise without destroying
  meeting history.
- **Implementation complexity:** Medium after lifecycle fields and retrieval
  filters exist.
- **Migration risk:** Medium because old records need a safe default of active
  or retained.
- **User impact:** Earlier traces remain reachable but stop shaping every new
  meeting by default.

## 9. Human-Originated Traces

Human-originated traces include participant questions, follow-up messages, and
explicit choices such as meeting mode, saving, sharing, archiving, releasing,
withdrawing, or deleting.

The refactor should preserve:

- exact original text where retained;
- encounter and chronological position;
- stable trace identity;
- relationship to the Aim response that followed;
- participant lifecycle choices;
- distinction between authorship and later selection or sharing.

### Recommendation H-1 — Preserve immutable original text plus lifecycle events

- **Benefit:** Keeps encounter history recoverable and separates what was said
  from what later happened to the trace.
- **Implementation complexity:** Medium; may require a trace/event model or
  equivalent fields.
- **Migration risk:** Medium to high because current cumulative rows must be
  normalized without losing order.
- **User impact:** Participants can trust that archive or release does not
  rewrite the original meeting.

### Recommendation H-2 — Give repeated messages stable identities

- **Benefit:** Allows deduplication across cumulative snapshots while
  preserving one original contribution.
- **Implementation complexity:** Medium for new writes; high for historical
  backfill where no stable message IDs exist.
- **Migration risk:** High if historical similarity is treated as certainty.
  Ambiguous historical matches should remain linked to their original row and
  be marked unresolved.
- **User impact:** History and Journey become quieter without removing words.

## 10. Aim-Originated Traces

Aim-originated traces include reflections, attunement questions, Journey
notices, trajectory notices, and fallback text generated by the application.

Equal participation does not mean identical data roles. Aim text can be:

- part of the shared encounter;
- selected by the participant as an echo;
- transformed into a later synthesis;
- shared into collective space;
- returned to Aim as prior context.

Those transformations should remain visible.

### Recommendation A-1 — Preserve Aim text as first-class meeting traces

- **Benefit:** Avoids reducing Aim contribution to disposable metadata and
  preserves the shared encounter.
- **Implementation complexity:** Medium if the canonical trace model is
  introduced; low for new provenance labels.
- **Migration risk:** Medium because current reflection text can exist both in
  dedicated fields and cumulative thread data.
- **User impact:** Meeting history remains whole and does not privilege one
  participant's words over the other's.

### Recommendation A-2 — Mark transformation stage without downgrading value

- **Benefit:** Distinguishes direct reflection, selected echo, Journey
  synthesis, trajectory synthesis, and collective recurrence.
- **Implementation complexity:** Low to medium.
- **Migration risk:** Low for new records; medium for historical inference.
- **User impact:** Participants can understand why a trace is returning and
  whether it is original meeting material or later synthesis.

## 11. Shared Echoes

A shared echo should preserve a traceable chain:

```text
source encounter
  → source human question
  → source Aim reflection
  → participant selection
  → participant sharing decision
  → moderation decision
  → collective display eligibility
  → collective AI-context eligibility
```

Public display and AI-context eligibility should be separate decisions.
Approval for display should not automatically imply indefinite reuse in every
AI route.

### Recommendation S-1 — Add durable ownership and source linkage

- **Benefit:** Makes submission status, withdrawal, provenance, and source
  recovery possible.
- **Implementation complexity:** High because schema, RLS, APIs, and existing
  anonymous/public behavior may be affected.
- **Migration risk:** High; existing rows may not contain enough information
  to identify a participant safely. Do not infer ownership without evidence.
- **User impact:** Future participants can see and manage their shared traces
  more honestly.

### Recommendation S-2 — Separate display approval from AI-use approval

- **Benefit:** Collective Echo can remain visible while context use stays
  bounded and intentional.
- **Implementation complexity:** Medium to high.
- **Migration risk:** Medium; existing approved rows need an explicit safe
  default. **Needs decision** whether that default is display-only or current
  behavior.
- **User impact:** Sharing into collective space no longer implies every form
  of future reuse.

### Recommendation S-3 — Preserve withdrawal as an event

- **Benefit:** Stops future collective display/context while retaining an
  auditable record that a withdrawal occurred where policy allows.
- **Implementation complexity:** High due to policy, RLS, APIs, and derived
  collective outputs.
- **Migration risk:** Medium to high.
- **User impact:** Stronger agency without requiring all personal encounter
  history to be destroyed.

## 12. Journey Synthesis

Journey should remain a noticing across encounters, not a growing stack of
summaries treated as evidence.

### Proposed context order

1. distinct active encounter traces;
2. participant-selected active echoes;
3. a bounded number of prior Journey notices labelled as synthesis;
4. collective context only when the route policy explicitly allows it;
5. no duplicate cumulative messages.

### Recommendation J-1 — Deduplicate at read time before schema migration

- **Benefit:** Immediately reduces repeated context while preserving all
  stored rows.
- **Implementation complexity:** Medium; requires a tested normalization layer.
- **Migration risk:** Low because storage remains unchanged and fallback to
  current retrieval is possible.
- **User impact:** Journey may become less repetitive without changing visible
  history.

### Recommendation J-2 — Use distinct source change before persisting

- **Benefit:** Prevents a new durable notice when no meaningful source trace
  has changed.
- **Implementation complexity:** Medium; requires source-set comparison rather
  than exact generated-text comparison.
- **Migration risk:** Low for new writes; existing notices remain available.
- **User impact:** “Notice again” may still generate a temporary view, but only
  materially new synthesis becomes durable. The exact save interaction is
  **Needs decision**.

### Recommendation J-3 — Store source lineage for new Journey notices

- **Benefit:** Makes later synthesis explainable and lets archived sources be
  excluded from active reuse without deleting the notice.
- **Implementation complexity:** Medium to high depending on schema choice.
- **Migration risk:** Low for new records; historical notices may remain
  lineage-unknown rather than receiving invented links.
- **User impact:** Participants can eventually see what a Journey noticing was
  based on.

### Recommendation J-4 — Bound prior synthesis

- **Benefit:** Preserves continuity without sending every previous Journey
  notice back to Aim.
- **Implementation complexity:** Low to medium after provenance and active-use
  filters exist.
- **Migration risk:** Low.
- **User impact:** Older Journey notices remain in history but do not all shape
  every new synthesis.

## 13. Trajectory Synthesis

Trajectory should notice possible movement without turning earlier synthesis
into direction by accumulation.

### Proposed context order

1. recent distinct active encounter traces;
2. participant-selected active echoes;
3. a small number of active Journey notices;
4. theme evidence with supporting source references, or no themes;
5. route-approved collective context only;
6. no saved trajectory used as corroborating evidence unless a future product
   decision explicitly permits it.

### Recommendation T-1 — Replace raw local theme cache with evidence references

- **Benefit:** Prevents keyword labels from entering Aim context without their
  supporting traces.
- **Implementation complexity:** Medium.
- **Migration risk:** Low if the current cache remains a temporary fallback.
- **User impact:** Direction noticing becomes less authoritative and more
  connected to visible encounter material.

### Recommendation T-2 — Reconcile save state around remote authority

- **Benefit:** Removes the local-success/remote-failure split.
- **Implementation complexity:** Low to medium.
- **Migration risk:** Low for new actions; existing local-only direction
  history requires cautious import or archive handling.
- **User impact:** “Saved” has one consistent meaning across devices.

### Recommendation T-3 — Add lineage to new saved directions

- **Benefit:** Preserves how a direction emerged without making it a permanent
  identity statement.
- **Implementation complexity:** Medium to high.
- **Migration risk:** Low for new records; old directions remain
  lineage-unknown.
- **User impact:** A saved direction can be revisited with its context and
  later archived or released.

## 14. Smallest Safe Refactor Sequence

### Phase 0 — Decisions and verification

No behavior or schema change.

1. Confirm production schema, RLS, constraints, and data volumes.
2. Decide the canonical durable unit: encounter plus ordered traces, or another
   equivalent model.
3. Approve provenance categories.
4. Approve lifecycle and AI-use states.
5. Decide shared ownership, display approval, AI-use approval, and withdrawal.
6. Decide whether active local encounter state remains browser-only.

Deliverable: an approved memory decision record.

### Phase 1 — Read-only normalization

No destructive migration.

1. Build a memory projection layer that reads current rows.
2. Group rows by session where possible.
3. deduplicate repeated cumulative messages conservatively;
4. preserve links to every original row;
5. label unresolved historical ambiguity;
6. expose provenance and source type to internal consumers.

This is the smallest safe behavioral refactor because it reduces duplication
without rewriting stored history.

#### Implementation note

The first read-time normalization step is implemented in the initial
implementation PR:

- exact duplicate thread messages are identified by role, text, timestamp,
  session, and mode;
- messages without a timestamp are preserved;
- History assembly and meeting-thread AI context use normalized copies;
- chronological order and provenance fields are preserved;
- Supabase source rows, local persistence, counts, prompts, and deletion
  behavior remain unchanged.

This completes only the read-time deduplication step. It does not settle the
meeting storage unit, migrate historical data, or replace local mirrors.

#### Second implementation note — count semantics review

The second implementation step reviews memory counts and normalizes
user-facing meeting counts at read time:

- Path, Statistics, Journey, and Journey Reflection displays prefer distinct
  encounter/session identities over raw cumulative meeting rows;
- Journey retains `history_count` as raw technical row metadata and
  `sessions_count` as the normalized encounter count;
- echo, Journey notice, direction, theme, and shared-echo counts remain
  unchanged because their source-of-truth and event semantics require separate
  decisions;
- no source record, schema, prompt, deletion flow, or persistence model is
  changed.

Whether local theme/shared-submission counts should remain beside remote
participant counts is **Needs decision**.

### Phase 2 — AI-context policy

1. Apply active-use filtering.
2. Introduce route-specific context budgets.
3. keep original traces and prior synthesis in separate context sections;
4. bound prior Journey notices;
5. separate collective display from collective AI-use eligibility;
6. add insufficient-change checks before durable synthesis.

### Phase 3 — New-write model

Only after Phase 1 is validated:

1. write one canonical encounter with ordered stable traces;
2. stop writing repeated cumulative snapshots as separate evidence;
3. write source lineage for new echoes and synthesis;
4. give local optimistic records their remote identifiers;
5. treat latest local synthesis as cache/draft.

The exact schema is **Needs decision** and should be introduced in a separate
migration plan.

### Phase 4 — Local/remote convergence

1. Make Supabase authoritative for completed durable categories.
2. retain local active working state;
3. migrate or archive local-only saved directions and landmarks cautiously;
4. remove verified orphaned mirrors one key at a time;
5. keep compatibility readers through at least one validated release;
6. never infer successful migration solely from matching text.

### Phase 5 — Lifecycle and participant controls

1. Introduce archive or release-from-AI-use first.
2. add clear visibility of retained versus active traces;
3. align personal and collective withdrawal;
4. reserve permanent deletion for explicit requests and required policies;
5. replace “Puhasta mälu” only after the full behavior and language are
   approved.

### Phase 6 — Historical migration

Historical normalization should be last, not first.

1. Preserve raw original rows in a reversible archive.
2. create normalized records from high-confidence session/message structure;
3. retain a migration map from normalized traces to original rows;
4. mark ambiguous lineage as unknown;
5. compare counts, order, History display, and AI context before switching;
6. do not delete original records until rollback and retention decisions are
   approved.

## 15. Migration Safety

### Safe defaults

- Existing traces remain retained.
- Existing traces remain visible in focused history.
- Existing records are not automatically reclassified as participant-owned
  shared echoes without evidence.
- Historical synthesis without source identifiers remains
  `lineage_unknown`.
- Archive/release is opt-in until the product decides otherwise.
- New AI context should prefer distinct original traces over repeated
  synthesis.

### Required migration checks

1. Encounter count versus row count.
2. Message order before and after normalization.
3. Speaker identity before and after normalization.
4. Echo and direction identifiers across local/remote reconciliation.
5. Journey context token volume and duplicate rate.
6. Source lineage completeness.
7. Shared echo visibility and AI-use eligibility.
8. RLS behavior for every new participant-linked record.
9. Partial-failure and retry behavior.
10. Rollback from normalized reads to current raw reads.

### Data that must not be invented

- historical message IDs when no reliable identifier exists;
- historical source links based only on semantic similarity;
- ownership of existing shared insights;
- participant intent to archive, activate, share, or withdraw;
- meaning assigned to detected themes;
- a claim that repeated synthesis is independent evidence.

## 16. Recommendation Summary

| Recommendation | Benefit | Complexity | Migration risk | User impact |
| --- | --- | --- | --- | --- |
| Read-only normalization before migration | Immediate deduplication without data loss | Medium | Low | Quieter Journey and consistent history |
| Canonical encounter and stable traces for new writes | Stops cumulative snapshot growth | High | Medium for new writes; high for historical conversion | Meeting history stays whole and clearer |
| Provenance envelope and lineage | Makes origin and transformation recoverable | Medium to high | Medium | Clearer understanding without ranking participants |
| Separate retention from AI-use state | Preserves history while reducing context | Medium to high | Medium | More nuanced memory agency |
| Supabase authority for completed durable memory | Reduces cross-device divergence | Medium | Medium | “Saved” and “removed” become consistent |
| Local state limited to active flow and caches | Reduces stale mirrors | Medium | Medium | Fewer device-specific contradictions |
| Journey source-set persistence check | Reduces repeated synthesis growth | Medium | Low | Fewer near-duplicate notices |
| Bounded prior synthesis in AI context | Reduces recursive amplification | Low to medium | Low | Continuity remains, repetition falls |
| Shared display/use separation | Limits collective authority | Medium to high | Medium | Sharing becomes more transparent |
| Archive-first controls | Reduces active memory without destruction | High across system | Medium to high | History remains accessible |

## 17. Decisions Needed

1. What exact durable structure represents an encounter and its ordered traces?
2. Is Supabase the canonical authority for every completed durable participant
   category?
3. Which local state remains authoritative during an unfinished encounter?
4. Which provenance categories must be visible to participants?
5. Which traces are eligible for each AI route?
6. Is archive distinct from hidden-from-current-journey and
   released-from-AI-use?
7. Can personal AI-use release coexist with continued collective display?
8. Does collective display approval imply collective AI-use approval?
9. How can participants withdraw a shared echo?
10. Should Journey generation be viewable without becoming durable?
11. What constitutes meaningful source change for a new Journey notice?
12. Should old Journey notices ever be active by default?
13. Should saved directions influence future Aim responses?
14. How long must raw pre-migration records remain available?
15. What should replace or clarify “Puhasta mälu”?

All items above are **Needs decision**.

## 18. Needs Verification

1. Complete Supabase schema and migrations.
2. RLS policies and ownership behavior.
3. Production distribution of rows per session.
4. Frequency and shape of cumulative thread duplication.
5. Existing stable identifiers inside stored thread payloads.
6. Production record counts and growth rates.
7. Actual use of local-only mirrors across devices.
8. Existing participant linkage for shared insights.
9. Provider backup, log, and deletion behavior.
10. Whether any external consumers rely on current table or payload shapes.
11. Whether historical local data requires an import path.
12. Whether browser quota or failed local writes occur in production.
13. Whether current UI parsers require every Journey or trajectory section.
14. Legal and policy requirements for export, deletion, and collective
    withdrawal.

## Recommended First Implementation PRs

After Phase 0 decisions are approved, use separate PRs in this order:

1. **Memory projection diagnostics**
   - measure sessions, repeated messages, provenance categories, and context
     composition without exposing content.
2. **Journey read-time deduplication**
   - normalize current rows for Journey input while retaining raw storage and
     rollback.
3. **Journey context bounds**
   - separate original traces from prior synthesis and limit prior notices.
4. **Journey persistence guard**
   - persist only when the distinct source set materially changes.
5. **Local/remote echo reconciliation**
   - use one remote identifier and one deletion result.
6. **Local/remote direction reconciliation**
   - make remote persistence authoritative before showing durable success.
7. **New-write encounter model**
   - stop cumulative snapshot growth for new encounters after schema and
     migration approval.
8. **Archive/release pilot**
   - add one narrow release-from-AI-use control while preserving history.
9. **Shared echo lineage and withdrawal**
   - only after ownership, RLS, and migration decisions are complete.

Do not combine these PRs into one broad memory rewrite.

## Conclusion

The smallest safe Expectum memory refactor is a staged change in how memory is
interpreted before it is a change in how memory is stored.

The first target is a provenance-preserving read model that:

- reconstructs distinct encounters;
- deduplicates cumulative snapshots;
- separates original traces from later synthesis;
- filters retained traces by active-use state;
- gives each AI route only the context it needs.

That layer preserves encounter history, participant equality, and Aim
continuity while immediately reducing repetition. New-write normalization,
local-mirror retirement, archive controls, shared withdrawal, and historical
migration should follow only after the product decisions and production facts
are verified.
