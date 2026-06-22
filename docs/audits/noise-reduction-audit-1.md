# EXPECTUM Noise Reduction Audit 1.0

## Overview

This is a documentation-only audit of noise across the current Expectum
system. It does not change application code, routes, pages, prompts, Supabase
logic, styling, or deployment settings.

The audit uses:

- the current `main` branch;
- Architecture Documentation 1.0;
- the draft Roadmap / System Map and Component Ownership Map;
- Prompt Audit 1.0;
- Memory Audit 1.0;
- direct inspection of every `app/**/page.tsx` and `app/api/**/route.ts`.

The governing principle is:

> Growth must preserve encounter, clarity, and space.

Noise reduction does not mean making Expectum smaller for its own sake. It
means reducing:

- unclear repetition;
- duplicated meaning;
- stale mirrors;
- excessive choice;
- unmarked amplification;
- overlapping destinations without distinct user needs;
- AI synthesis that accumulates more strongly than its source material.

The audit also preserves these product directions:

- do not erase memory for its own sake;
- do not remove useful traces;
- do not rank human and Aim contributions as higher or lower;
- preserve provenance;
- reduce duplication and unclear reuse;
- preserve encounter, space, and clarity.

### Scope

The audit covers:

- 31 page routes;
- 7 API routes;
- public orientation;
- participant encounter;
- memory and synthesis views;
- collective echo;
- admin operations;
- local and Supabase memory overlap;
- AI context construction and repeated synthesis.

### Classification terms

Routes may have more than one classification.

| Classification | Meaning in this audit |
| --- | --- |
| Core | Required for the present product spine or encounter |
| Supportive | Serves a clear secondary need |
| Hidden/admin | Operational or intentionally outside normal navigation |
| Legacy | Uses an older model, layout, or orphaned data path |
| Duplicate | Repeats another route's current user need or data presentation |
| Experimental | Prepared or exploratory behavior without settled product role |
| Candidate for removal | Likely no longer needs its own route, subject to decision |
| Candidate for merging | Could be represented inside another route without losing a distinct need |
| Candidate for quiet orientation only | Should remain light, non-dashboard, and low-navigation |

Classification is an audit recommendation, not an implementation decision.
Unresolved route changes are **Needs decision**.

### Overall assessment

Expectum's core encounter path is comparatively clear:

```text
enter → attunement/question → reflection → pause
```

Noise increases after the encounter, where the same traces can be represented
as:

- history;
- echo;
- timeline;
- themes;
- journey notices;
- trajectory;
- path;
- statistics;
- profile;
- shared echo;
- collective echo.

Most of these pages have a defensible individual purpose. The risk is their
combined effect:

- too many adjacent nouns;
- repeated cards and counts;
- multiple “overview” surfaces;
- local and remote views that can disagree;
- synthesis shown as if each layer were independent;
- a Memory page that offers nine destinations at the same level.

The highest-priority noise is not decorative. It is:

1. cumulative meeting snapshots and repeated AI context;
2. several summary/dashboard-like pages over the same traces;
3. legacy routes backed by orphaned local data;
4. duplicate collective-echo display routes;
5. synthesis layers feeding later synthesis without clear provenance;
6. unclear boundaries between Memory, Path, Journey, Theme, and Direction.

## Page-Level Noise

### Full page-route classification

| Route | Current purpose | Classification | Noise assessment | Recommendation |
| --- | --- | --- | --- | --- |
| `/` | Public landing and entry points | Core | Several public and participant choices, but it is the expected orientation threshold | Keep core; maintain a small number of primary actions |
| `/aim` | Explains Aim | Supportive | Overlaps `/human-and-ai` and `/aim-memory`, but owns Aim's direct conceptual introduction | Keep; public-concept consolidation is **Needs decision** |
| `/aim-memory` | Explains Aim memory principles | Supportive | Conceptually overlaps Memory Audit questions and `/aim`; useful as a boundary page | Keep supportive; reduce repeated explanation only after governance text is settled |
| `/collective-echo` | Public approved echoes and recurring words | Supportive, collective core | Overlaps `/shared-insights`; currently the richer and more public collective destination | Keep as likely canonical collective display |
| `/enter` | Sign-in and registration | Core | Clear single purpose | Keep core |
| `/expectum` | Main product explanation | Core public orientation | Links to several explanatory pages and can become an explanatory hub | Keep; ensure it orients rather than duplicates all child content |
| `/expectum-language` | Terminology and symbolic language | Supportive | Overlaps `/symbols`, but owns definitions while `/symbols` owns the visual reference | Keep or merge with `/symbols`; **Needs decision** |
| `/human-and-ai` | Explains human/Aim relationship | Supportive | Overlaps `/aim`; distinct governance need if concise | Keep supportive unless public-concept audit finds direct duplication |
| `/return` | Sign-out/rest destination | Supportive flow | Clear transition role | Keep |
| `/symbols` | Symbol reference | Supportive | Closely related to `/expectum-language`; separate route may be more choice than needed | Candidate for merging with `/expectum-language`; **Needs decision** |
| `/attunement` | Quiet opening before a participant-authored question | Core encounter | Clear threshold function | Keep core |
| `/attunement-question` | Aim-generated quiet question | Core/supportive encounter branch | Distinct alternative opening, but footer links add synthesis destinations during a threshold moment | Keep; review peripheral navigation separately |
| `/question` | Participant-authored question and meeting mode | Core encounter | Three modes are meaningful; explanatory mode text is necessary but can become choice-heavy | Keep core |
| `/reflection` | Main human/Aim encounter | Core encounter | Current central page; action choices for save/share/continue are relevant but accumulate during longer threads | Keep core; preserve focus on encounter |
| `/pause` | Pause or new rhythm | Core supportive transition | Clear single purpose | Keep |
| `/history` | Stored meetings and continuation | Core memory | Distinct retrieval and continuation role | Keep |
| `/landmarks` | Participant-selected echoes | Core memory | Distinct chosen-trace role | Keep |
| `/journey` | Generate and save cross-encounter noticing | Core synthesis | Purposeful, but automatic persistence and repeated generation create memory and AI noise | Keep; reduce context/persistence noise before page removal |
| `/journey-reflections` | List stored journey notices | Supportive memory | Overlaps Timeline and Path visually, but owns journey-notice history and clearing | Keep supportive; candidate to become a focused subview rather than a peer dashboard |
| `/themes` | Deterministically derive recurring configured themes | Supportive synthesis | Distinct derivation, but overlaps Path/Profile and feeds Direction; labels can look more authoritative than their simple matching logic | Keep for now; clarify role and provenance |
| `/trajectory` | Generate possible direction | Supportive synthesis | Distinct but close to Journey and Path; inherently high interpretation/noise risk | Keep pending prompt and memory decisions |
| `/trajectory-history` | List participant-saved directions | Supportive memory | Distinct chosen-history role | Keep supportive; could become a focused section under Memory |
| `/timeline` | Chronological combination of four trace types | Supportive orientation | Overlaps History, Journey Reflections, Trajectory History, and Path; unique value is chronology | Keep only if chronology is a confirmed user need; otherwise candidate for merging |
| `/path` | Aggregate latest traces and counts | Core orientation, dashboard risk | Repeats latest meeting, echo, theme, journey, direction, shared echo, and counts already available elsewhere | Keep as a quiet orientation page, but reduce dashboard behavior |
| `/statistics` | Counts and first/last dates | Supportive, dashboard-like | Repeats counts shown in Path and Memory; counts may be semantically misleading | Candidate for merging into `/settings` or removal; **Needs decision** |
| `/profile` | Local summary of top theme, echo, direction, and generated summary sentence | Hidden; candidate for quiet orientation only | Strongly overlaps Path, Themes, Timeline, and Statistics; local-only sources can disagree with remote views | Do not expand; keep hidden and quiet or remove after role decision |
| `/shared-insights` | Authenticated display of approved shared echoes | Duplicate/supportive | Reads the same approved collective rows shown by `/collective-echo`, but without recurring words; it does not show the participant's own pending status | Candidate for merging into `/collective-echo` |
| `/movement-map` | Legacy local journey-reflection parser | Legacy, duplicate, candidate for removal | No active writer for its local source; older standalone frame; overlaps Journey Reflections and Path | Highest-confidence removal/redirect candidate |
| `/theme-evolution` | Legacy local trend calculation | Legacy, duplicate, experimental, candidate for removal | Uses stale local mirrors; older standalone frame; overlaps Themes and Path | Highest-confidence removal/redirect candidate |
| `/admin/shared-insights` | Approve, hide, or delete collective submissions | Hidden/admin | Operational page, not participant choice noise | Keep hidden/admin; security is outside this audit |

### API route classification

API routes are not page-choice noise, but they shape data and AI-context noise.

| Route | Current role | Noise relevance |
| --- | --- | --- |
| `/api/attunement-question` | Generates one quiet question | Receives meeting, echo, journey, and collective context |
| `/api/reflect` | Generates encounter reflection | Uses recent local thread and collective context |
| `/api/journey` | Generates structured journey noticing | Receives all meetings, echoes, prior notices, sessions, and collective context |
| `/api/trajectory` | Generates possible direction | Receives recent records, local themes, and collective context |
| `/api/shared-insights` | Reads approved rows and accepts submissions | Duplicates part of collective display data; unbounded approved read |
| `/api/collective-echo` | Returns approved rows and recurring words | Canonical richer collective read candidate |
| `/api/admin/shared-insights` | Moderation operations | Hidden operational route |

Whether `/api/shared-insights` and `/api/collective-echo` should share one
public read model is **Needs decision**.

### Core page spine

The clearest current product spine is:

```text
Public orientation
  / → /expectum or /enter

Encounter
  /attunement
    → /question or /attunement-question
    → /reflection
    → /pause

Memory
  /settings
    → focused trace views

Orientation and synthesis
  /path
  /journey
  /themes
  /trajectory
```

Noise reduction should protect this spine rather than add a new replacement
hub.

### Public explanatory overlap

The public explanation set contains:

- `/expectum`;
- `/expectum-language`;
- `/symbols`;
- `/aim`;
- `/aim-memory`;
- `/human-and-ai`.

These are not automatically duplicate. They answer different questions:

- what Expectum is;
- what its language means;
- what symbols mean;
- what Aim is;
- how memory works;
- how human and Aim relate.

The noise risk is navigational and editorial:

- each page links to several siblings;
- concepts can be re-explained on multiple pages;
- a new visitor may not know which explanation is primary.

A public-content audit should compare paragraph-level duplication before any
merge. Current evidence is insufficient for removal. **Needs verification**.

### Memory destination density

`/settings` currently presents nine equal-weight destinations:

- History;
- Echoes;
- Timeline;
- Journey Reflections;
- Themes;
- Trajectory History;
- Shared Insights;
- Collective Echo;
- Statistics.

This gives access, but not hierarchy.

Potential conceptual groups:

```text
Meeting traces
  History
  Echoes

Journey traces
  Journey Reflections
  Themes
  Saved Directions

Views
  Timeline
  Statistics

Collective
  Shared / Collective Echo
```

Whether these groups should be UI sections, progressive disclosure, or only
documentation concepts is **Needs decision**.

### Focused route analysis

#### `/profile`

Current content:

- top local theme;
- latest local echo;
- latest local saved trajectory;
- a deterministic summary sentence;
- links to Path, Timeline, and Memory.

Noise:

- repeats Path and other Memory views;
- local-only data can be stale or absent on another browser;
- “profile” suggests identity even though the page denies evaluation;
- “strongest theme” can sound more authoritative than keyword matching;
- it adds another summary layer without a unique action.

Assessment:

- not a major feature;
- not primary navigation;
- candidate for quiet orientation only;
- possible removal remains **Needs decision**.

If retained, it should orient toward existing places rather than reproduce
their content.

#### `/movement-map`

Current content:

- reads legacy `expectum_journey_reflections`;
- parses sections from stored text;
- shows change and landmark excerpts;
- clears only the legacy local key.

Noise:

- no active writer for the source key was found;
- overlaps Journey Reflections and Path;
- duplicates stored synthesis;
- uses older standalone layout;
- is not auth-gated;
- its terminology differs from current “Journey noticing.”

Assessment:

- legacy;
- duplicate;
- candidate for removal or redirect;
- highest-confidence page-level cleanup.

#### `/theme-evolution`

Current content:

- reads legacy local history, landmarks, and journey reflections;
- calculates 30/90-day trend labels;
- calls themes strengthening, fading, or stable.

Noise:

- depends on stale local mirrors;
- overlaps `/themes`;
- introduces stronger evaluative trend language;
- uses older standalone layout;
- is not auth-gated;
- no current inbound navigation was found.

Assessment:

- legacy;
- experimental;
- duplicate;
- candidate for removal or redirect;
- highest-confidence page-level cleanup.

#### `/themes`

Current content:

- recomputes configured keyword matches from remote meetings, echoes, and
  journey notices;
- caches results locally;
- shows matched labels and keywords.

Noise:

- participant and Aim language are combined without visible provenance;
- keyword presence can look like a meaningful theme;
- results repeat on Path, Profile, Statistics, and Trajectory context;
- local cache can outlive the source state.

Assessment:

- supportive and functionally distinct;
- not a removal candidate yet;
- candidate for reduced reuse and clearer provenance;
- its independent page role is **Needs decision** after data-quality review.

#### `/journey-reflections`

Current content:

- lists every stored Aim-generated journey notice;
- shows source counts;
- clears all notices.

Noise:

- overlaps Timeline and Path;
- repeated notices can differ without new source material;
- a list of summaries can amplify synthesis.

Assessment:

- supportive and distinct as a journey-history view;
- not a removal candidate now;
- candidate for quieter grouping, archive, or bounded display after Memory
  decisions.

#### `/path`

Current content:

- four explanatory cards;
- latest meeting;
- latest echo;
- top local theme;
- latest journey notice;
- latest saved direction;
- latest local shared submission;
- counts.

Noise:

- behaves like a dashboard despite quiet visual styling;
- repeats nearly every Memory category;
- mixes local and remote sources;
- repeated “latest” items can imply a unified story;
- summary counts duplicate Statistics;
- explanatory cards repeat concepts shown by content cards.

Assessment:

- core orientation;
- not a removal candidate;
- candidate for quiet orientation only rather than comprehensive dashboard;
- should help choose a next place, not restate every place.

#### `/timeline`

Current content:

- merges meeting rows, echoes, journey notices, and directions by timestamp.

Noise:

- repeats content from four focused pages;
- cumulative meeting snapshots can create repeated timeline entries;
- long history has no grouping or pagination.

Unique value:

- chronological relationship across trace types.

Assessment:

- supportive if chronology is a validated need;
- candidate for merging into History or Path only if chronology is not
  independently valuable;
- **Needs decision**.

#### `/statistics`

Current content:

- row counts by meeting mode;
- echo, journey, theme, direction, and local shared counts;
- first and last meeting dates.

Noise:

- repeats counts in Path and Journey;
- mixes remote and local counts;
- “meeting” counts may count snapshots rather than encounters;
- exploration is counted as an ordinary meeting;
- encourages measurement in a product that says it is not measuring.

Assessment:

- dashboard-like;
- candidate for merging into a small Memory status area;
- candidate for removal if counts do not support a clear user need;
- **Needs decision**.

#### `/shared-insights`

Current content:

- displays all approved shared rows;
- shows question, echo, date, and question count.

Noise:

- name suggests the participant's own submissions, but it shows the approved
  collective set;
- duplicates `/collective-echo`;
- does not show pending/approved status for the current participant;
- requires authentication while the richer collective page is public.

Assessment:

- strongest merge candidate;
- either merge display into `/collective-echo`, or redefine this page as a
  participant-owned submission/status view after ownership exists;
- current role is **Needs decision**.

#### `/collective-echo`

Current content:

- approved echoes;
- recurring word counts;
- public orientation to collective memory.

Noise:

- repeats the approved list from `/shared-insights`;
- word counts can be mistaken for meaningful themes;
- can become visually long as records grow.

Assessment:

- likely canonical collective display;
- keep;
- clarify recurrence limits and add bounded display later.

## Memory Noise

Memory Audit 1.0 found that the main memory risk is not memory itself. It is
duplication, unclear provenance, stale mirrors, and uncontrolled reuse.

### Cumulative meeting snapshots

Every successful Reflection response inserts a new `meetings` row containing
the full cumulative thread.

For one encounter:

```text
row 1: U1 A1
row 2: U1 A1 U2 A2
row 3: U1 A1 U2 A2 U3 A3
```

Noise effects:

- repeated storage;
- inflated meeting counts;
- repeated Timeline entries;
- History requires deduplication;
- Journey reconstructs sessions without the same deduplication;
- repeated text can receive accidental AI weight.

Severity: **Critical for noise reduction sequencing**.

The first implementation decision should be the durable unit of a meeting:
turn, snapshot, or encounter. **Needs decision**.

### Local and remote divergence

Duplicated categories include:

- local history and remote meetings;
- local landmarks and remote echoes;
- local trajectory history and remote directions;
- local shared markers and remote shared insights;
- latest local Journey/Direction plus remote durable records;
- local theme cache derived from remote records.

Known divergence examples:

- removing an echo in Reflection removes only the local marker;
- removing an echo in Landmarks removes only the remote row;
- saving a direction updates local history before remote success;
- clearing Journey or Direction history leaves related local latest/history
  keys;
- Path and Statistics show local shared markers rather than current remote
  state.

Noise effect:

- the same concept has different answers on different pages or devices.

### Stale local mirrors

Highest-risk stale keys:

- `expectum_history`;
- `expectum_landmarks`;
- `expectum_trajectory_history`;
- `expectum_detected_themes`;
- `expectum_shared_insights`;
- `expectum_journey_reflections`.

`expectum_journey_reflections` has readers but no active writer.

Noise effect:

- obsolete data keeps pages alive;
- old data appears as current orientation;
- page-removal decisions are obscured by compatibility uncertainty.

### Repeated Journey summaries

Journey:

- loads all prior notices;
- generates a new structured notice;
- stores it automatically if exact text/count checks differ;
- allows manual regeneration;
- sends all prior notices back to Aim later.

Noise effect:

- summaries summarize summaries;
- stylistic model variation creates durable growth;
- repeated synthesis can appear more established than the meeting material.

Healthy continuity should remain possible. The risk is unbounded and unmarked
recursion.

### Repeated trajectory summaries

Trajectory:

- reads recent meetings, echoes, prior Journey notices, and local themes;
- generates a latest local trajectory;
- lets the participant save copies locally and remotely.

Current AI routes do not read saved directions back, so the generative feedback
loop is smaller than Journey's.

Noise remains through:

- latest local output plus local history plus remote history;
- Path, Profile, Timeline, Statistics, and Trajectory History displays;
- duplicate save possibility;
- source layers that already contain AI synthesis.

### Shared echo amplification

The collective path is:

```text
human question
  → Aim reflection
  → participant-selected echo
  → shared submission
  → admin approval
  → public display
  → collective word counts
  → context for all four OpenAI routes
```

This loop can be healthy when provenance and consent remain clear.

Noise risk begins when:

- Aim's wording is counted as independent collective recurrence;
- the same style returns to Aim and is amplified;
- the original human/Aim/shared-thread provenance is lost;
- one approved echo appears on two pages and in several prompts;
- participants cannot withdraw or see status.

### Provenance loss

Current views distinguish “Sina” and “Aim” inside active/history threads, but
later layers often do not:

- an echo is Aim text selected by a participant;
- a Journey notice is Aim synthesis;
- a direction is Aim synthesis selected by a participant;
- a theme combines human and Aim wording;
- shared echo combines human question, Aim response, participant consent, and
  admin approval.

This distinction is not a value ranking. Both human and Aim participate in the
meeting.

Provenance is needed to prevent:

- unmarked repetition;
- false independence;
- unclear user control;
- synthesis being treated as direct participant expression.

## Prompt and AI-Context Noise

Prompt Audit 1.0 found that Aim's essence is substantially aligned, but prompt
and context design can still create noise.

### Over-synthesis

Highest-risk routes:

1. Journey;
2. Trajectory;
3. Expansion mode;
4. Attunement when memory is dense.

Journey and Trajectory ask Aim to turn several memory layers into a structured
whole. This can help orientation, but it can also create:

- a narrative stronger than the sources;
- repeated interpretation;
- a sense that movement must always exist;
- an impression of certainty.

### Forced structure under thin evidence

Journey requires five sections.

Trajectory requires four sections.

Even though prompts contain restraint clauses, mandatory headings create
pressure to fill:

- themes;
- change;
- echo;
- direction;
- strengthening;
- fading;
- a question.

Noise effect:

- words are produced because a section exists, not because the encounter
  supports them.

A future prompt decision should permit a genuinely absent section or a
no-synthesis result. **Needs decision**.

### Collective memory authority

All four OpenAI routes receive:

- recent approved collective echoes;
- recurring words from approved echoes.

Noise risks:

- collective context is always present when available, regardless of meeting
  type;
- recurrence can look like importance;
- approved text is interpolated into system-message content;
- the same collective language can enter Attunement, Reflection, Journey, and
  Trajectory;
- Aim may sound increasingly like its own approved prior output.

Whether every route needs collective context is **Needs decision**.

### Repeated AI synthesis versus original meeting

Possible context chain:

```text
meeting
  → reflection
  → saved echo
  → journey notice
  → derived theme
  → trajectory
  → collective echo
  → future attunement/reflection/journey/trajectory
```

Each step can be useful. Noise appears when later synthesis is:

- not marked as synthesis;
- repeated in several inputs;
- treated as independent corroboration;
- allowed to outweigh the shared meeting thread.

The goal is not to rank human above Aim or Aim above human. It is to preserve
the origin and transformation history of what returns.

### Repeated prompt identity clauses

Aim's invariant boundaries are copied into route prompts rather than fully
owned by one shared essence contract.

Noise effects:

- long prompts;
- difficult review;
- wording drift;
- route-specific expression mixed with identity governance.

This is maintenance noise rather than user-facing page noise. Any later
centralization must preserve different meeting expressions.

## User Experience Noise

### Excessive equal-weight choices

The clearest example is Memory with nine cards.

Other choice clusters:

- public landing links into both explanatory and participant routes;
- public explanation pages cross-link repeatedly;
- Path footer offers Journey, Memory, and Attunement;
- synthesis pages cross-link to one another;
- Reflection offers save, share, continue, and pause actions.

Not all choices should be removed. The issue is when primary, secondary, and
rare actions look equally important.

### Unclear page purpose

Highest-risk labels:

- `Path` versus `Journey`;
- `Journey noticing` versus `Journey Reflections`;
- `Theme` versus `Theme Evolution`;
- `Direction` versus `Saved Directions`;
- `Shared Echo` versus `Collective Echo`;
- `Profile` versus `Path`;
- `Memory` versus the many pages inside it.

The Estonian product terms may be meaningful internally while still requiring
a clearer user-level distinction. User comprehension is **Needs verification**.

### Duplicate labels and near-synonyms

Examples:

- Kohtumine / Minu kohtumised;
- Kaja / Jagatud Kaja / Ühine Kaja;
- Liikumise märkamine / Liikumise märkamised / Liikumise kaart;
- Suund / Nähtavale tulnud suund / Hoitud suunad;
- Teekond / Minu teekond / Teekonna profiil;
- Teema / Teemade areng;
- Mälu / Aim Mälu.

Repeated vocabulary is part of the Expectum language system, but route labels
need to identify different actions and destinations.

### Dashboard-like routes

Most dashboard-like:

1. `/path`;
2. `/statistics`;
3. `/profile`;
4. `/settings`;
5. `/timeline`.

Quiet styling does not remove dashboard behavior when a page:

- aggregates many categories;
- displays counts;
- selects “top” or “latest” items;
- implies a unified state;
- offers many onward destinations.

### Explanatory duplication

Potential pairs or clusters:

- `/expectum-language` and `/symbols`;
- `/aim`, `/human-and-ai`, and `/aim-memory`;
- Path's explanatory cards and its trace cards;
- Settings introduction and Aim Memory principles;
- Shared Insights and Collective Echo introductions.

Paragraph-level comparison is required before removing public explanation.
**Needs verification**.

### Quiet orientation instead of feature expansion

Some pages can remain valuable if they do less:

- Path can orient without reproducing every trace;
- Profile can point quietly toward existing places;
- Settings can group choices instead of becoming a deeper dashboard;
- Statistics can become a small status note rather than a route;
- Timeline can become an optional chronological lens rather than a primary
  destination.

## Candidate Removals

No removal is authorized by this audit.

### Highest-confidence candidates

#### `/movement-map`

Reasons:

- legacy source key with no active writer;
- no current inbound navigation found;
- overlaps Journey Reflections and Path;
- older standalone frame;
- not auth-gated;
- separate local deletion behavior.

Recommended future action:

- verify bookmarks and production usage;
- verify whether any legacy data needs migration;
- then redirect rather than immediately return 404.

Status: **Candidate for removal — Needs decision**.

#### `/theme-evolution`

Reasons:

- legacy local mirrors;
- no current inbound navigation found;
- overlaps Themes and Path;
- stronger trend claims than the source model supports;
- older standalone frame;
- not auth-gated.

Recommended future action:

- verify production usage;
- decide whether any trend need is real;
- redirect to Themes if no unique need remains.

Status: **Candidate for removal — Needs decision**.

### Conditional candidates

#### `/statistics`

Remove as a standalone route only if:

- counts have no validated participant need;
- a small Memory status can replace useful information;
- meeting-count semantics are corrected first.

Status: **Candidate for merging or removal — Needs decision**.

#### `/profile`

Remove only if no unique quiet orientation role is approved.

Do not expand it to justify its existence.

Status: **Quiet orientation or removal — Needs decision**.

## Candidate Merges

No merge is authorized by this audit.

### `/shared-insights` into `/collective-echo`

Current overlap:

- both display approved shared rows;
- both show question and echo;
- both act as collective-memory destinations.

Possible merged model:

- one canonical Collective Echo page;
- approved echoes and recurrence;
- participant submission status only if ownership is later supported.

Do not merge until public/auth intent and participant withdrawal are decided.

Priority: **High**.

### `/statistics` into `/settings`

Possible merged model:

- a quiet, compact Memory status;
- distinct session counts rather than snapshot-row counts;
- no scoring or progress framing;
- optional disclosure rather than a primary card.

Priority: **Medium**.

### `/symbols` into `/expectum-language`

Possible merged model:

- one language and symbol reference;
- anchors or sections rather than two sibling routes.

Risk:

- one page may become too long;
- visual symbol browsing may deserve its own quiet space.

Priority: **Low; Needs verification**.

### `/timeline` into History or Path

Possible models:

- chronological tab/lens inside History;
- optional chronology section inside Path.

Risk:

- adding tabs or modes can move noise rather than reduce it;
- chronology may be a unique user need.

Priority: **Low to medium; Needs decision**.

### Memory history pages under one grouped shell

Potential group:

- meetings;
- echoes;
- journey notices;
- saved directions.

This does not necessarily mean one route. Shared hierarchy, navigation, and
language may reduce choice noise without merging data or behavior.

Priority: **Medium**.

## Quiet Orientation Candidates

### `/path`

Recommended role:

- the primary quiet orientation after several encounters;
- show what kinds of traces exist;
- gently point to Journey, Themes, Direction, or Memory;
- avoid showing every latest item and every count.

Must not become:

- a dashboard;
- an identity summary;
- a progress report;
- a replacement for focused memory pages.

Status: **Core quiet orientation — Needs decision on exact content**.

### `/profile`

Recommended role if retained:

- direct-URL or rare secondary orientation;
- one short statement of what is currently visible;
- links toward Path, Memory, Journey Reflections, or Themes;
- no “strongest” identity-like classification;
- no major navigation placement.

Status: **Quiet orientation only — Needs decision**.

### `/settings`

Recommended role:

- Memory threshold and control surface;
- grouped destinations;
- clear active/archive/release/withdrawal semantics when decided;
- not another comprehensive summary.

Status: **Core control/orientation page**.

### `/timeline`

Recommended role if retained:

- optional chronological lens;
- secondary, not equal to every primary Memory destination;
- bounded or grouped for long histories.

Status: **Optional quiet orientation — Needs decision**.

### `/statistics`

If retained at all:

- quiet factual status;
- no interpretation;
- no progress implication;
- counts must have correct semantics.

Status: **Prefer merge over standalone orientation**.

## Smallest Safe Improvements

These are recommendations only.

### Priority A — Clarify the model

1. Decide what one durable meeting record represents.
2. Define provenance for human text, Aim reflection, shared thread, and later
   synthesis.
3. Define canonical source of truth for each memory category.
4. Decide whether `/collective-echo` is the canonical shared-echo display.
5. Approve a one-sentence role for Path, Profile, Timeline, and Statistics.
6. Decide whether Journey and Trajectory may return no synthesis.

### Priority B — Prepare small implementation PRs

1. Replace `/movement-map` with a redirect after usage verification.
2. Replace `/theme-evolution` with a redirect after usage verification.
3. Remove duplicate meeting messages from Journey context.
4. Bound Journey retrieval and persistence growth.
5. Align local and remote echo state.
6. Group Memory destinations without adding new pages.
7. Consolidate Shared Echo display after ownership/withdrawal decisions.

### Priority C — Editorial and navigation refinement

1. Compare public explanatory pages paragraph by paragraph.
2. Clarify route labels without replacing the Expectum vocabulary.
3. Reduce repeated explanatory cards on Path.
4. Move rare views behind secondary disclosure.
5. Add pagination or bounded display where histories grow.

### Safe sequencing

Recommended sequence:

```text
decisions
  → provenance and meeting unit
  → legacy redirects
  → Journey context deduplication
  → Memory hierarchy
  → collective display consolidation
  → public editorial review
```

Do not combine all noise reduction into one application-code PR.

## Decisions Needed

1. Is `/path` the canonical participant orientation page?
   **Needs decision**.
2. Should `/profile` remain a direct-URL quiet orientation page or be removed?
   **Needs decision**.
3. Should `/statistics` remain a standalone route?
   **Needs decision**.
4. Is chronology a sufficiently distinct need to keep `/timeline`?
   **Needs decision**.
5. Should `/shared-insights` merge into `/collective-echo`?
   **Needs decision**.
6. Should `/expectum-language` and `/symbols` remain separate?
   **Needs decision**.
7. Can `/movement-map` redirect to `/journey-reflections` after legacy-data
   verification? **Needs decision**.
8. Can `/theme-evolution` redirect to `/themes` after usage verification?
   **Needs decision**.
9. What does one stored `meetings` row represent?
   **Needs decision**.
10. Which source is authoritative for echoes, directions, themes, and shared
    submissions? **Needs decision**.
11. Which traces are active, archived, hidden, released from AI context, or
    withdrawn from collective space? **Needs decision**.
12. Should collective memory influence every meeting type?
    **Needs decision**.
13. May Journey and Direction omit sections when evidence is thin?
    **Needs decision**.
14. How should human, Aim, shared-thread, and synthesis provenance be shown
    without ranking contributions? **Needs decision**.
15. Which Memory destinations should be primary, secondary, or rare?
    **Needs decision**.

### Needs verification

1. Production traffic and bookmarks for legacy and hidden routes.
2. User comprehension of Path, Journey, Memory, Theme, and Direction.
3. Whether Timeline and Statistics are actively used.
4. Whether public explanatory pages contain material paragraph-level
   duplication.
5. Existing legacy local data requiring migration.
6. Actual distribution of cumulative meeting snapshots in production.
7. Provenance mix of approved collective echoes.
8. Supabase schema, RLS, constraints, and record counts.
9. Provider retention and logging.
10. Whether shared insight is intended as participant status, collective
    display, or both.

## Recommended Next Work

### 1. Decision note: participant orientation

Create a short documentation decision covering:

- Path;
- Profile;
- Timeline;
- Statistics;
- Settings.

Give each one one unique user need or mark it for merge/removal.

### 2. Meeting-record evidence check

Inspect anonymized structure or safe development data to confirm:

- rows per session;
- repeated messages per row;
- effect on counts;
- effect on Journey context.

No production content should be copied into documentation.

### 3. Legacy route cleanup proposal

Prepare, but do not implement until approved:

- `/movement-map` → `/journey-reflections`;
- `/theme-evolution` → `/themes`;
- legacy local-key handling;
- bookmark and migration behavior.

### 4. Collective Echo decision

Decide:

- canonical display route;
- participant submission/status view;
- ownership and withdrawal;
- provenance;
- prompt reuse;
- recurrence limits.

### 5. Memory hierarchy proposal

Define primary and secondary destinations without creating new features.

The goal is fewer equal-weight choices, not fewer useful traces.

### 6. Prompt-context reduction proposal

After Prompt and Memory audit approval, document:

- which source layers each AI route truly needs;
- deduplication;
- limits;
- insufficient-evidence behavior;
- provenance labels;
- collective context boundaries.

### Final conclusion

Expectum does not have one noise problem. It has several interacting forms:

- page noise;
- choice noise;
- storage duplication;
- stale mirrors;
- repeated synthesis;
- collective amplification;
- conceptual overlap.

The safest reduction strategy is not deletion-first.

It is:

1. clarify unique purpose;
2. preserve provenance;
3. choose canonical sources;
4. stop unmarked repetition;
5. reduce equal-weight choices;
6. remove only what has no remaining distinct need.

This preserves encounter, space, and clarity while allowing useful memory and
human/Aim continuity to remain.
