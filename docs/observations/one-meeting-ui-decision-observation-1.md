# ONE MEETING UI DECISION OBSERVATION 1.0

## Purpose

This is a documentation-only observation.

It does not modify code, prompts, routes, Supabase logic, styling, memory,
authentication, or deployment.

It does not implement One Meeting.

The purpose is to observe whether the current UI still asks the participant to
choose a function or destination instead of allowing one encounter to hold
different movements organically.

Codex is first an observer, then an embodier.

> Viibime.

## Sources Used

This observation reads the current repository state through:

- One Meeting Decision 1.0;
- One Meeting Transition Plan 1.0;
- Aim Presence Exploration 1.0;
- One Space Observation 1.0;
- Stewardship Backlog 1.0;
- Reduction Principle 1.0;
- Emergence Principle 1.0.

Inspected implementation surfaces:

- `app/page.tsx`;
- `app/attunement/page.tsx`;
- `app/question/page.tsx`;
- `app/attunement-question/page.tsx`;
- `app/reflection/page.tsx`;
- `app/journey/page.tsx`;
- `app/history/page.tsx`;
- `app/statistics/page.tsx`;
- `app/timeline/page.tsx`;
- `lib/expectumStorage.ts`;
- `lib/expectumTypes.ts`.

## 1. Where The Participant Still Feels Required To Choose

The strongest explicit-mode interruption is `app/question/page.tsx`.

The participant is asked to choose between:

- `Kohtumine`;
- `Mõttekohtumine`;
- `Avardamine`.

The page also explains the three forms:

- `Kohtumine` responds more simply and directly;
- `Mõttekohtumine` moves more freely among thoughts and meanings;
- `Avardamine` creates room for questions, perspectives, and thinking-with.

This protects real differences, but it also asks the participant to decide what
kind of meeting they are entering before the meeting has fully begun.

The homepage also still exposes a mode-shaped invitation for signed-in
participants:

- `Ava kohtumine`;
- `Ava avardamine`;
- `Vaata teekonda`.

This is quieter than the earlier public CTA duplication, but it still makes
`Avardamine` visible as a separate destination from the first screen after sign
in.

The reflection page continues to show the current mode label at the top and
again near the thread opening. This preserves continuity and explains what kind
of movement is active, but it can also make the meeting feel categorized.

Memory surfaces also preserve mode categories:

- History labels sessions as `Kohtumine`, `Mõttekohtumine`, or `Avardamine`;
- Statistics counts ordinary meetings, thought meetings, and expansions
  separately;
- Timeline labels meeting items based on mode, though current timeline mapping
  appears to show `Mõttekohtumine` separately and otherwise falls back to
  `Kohtumine`;
- Journey receives mode metadata as part of normalized meeting context.

These are not necessarily wrong. They may be needed for compatibility,
provenance, and remembering. But they keep the three movements visible as
separate categories.

## 2. Where One Encounter Could Already Hold Different Movements

The current system already contains places where One Meeting is partly visible.

`app/attunement/page.tsx` does not ask for a mode. It simply opens a meeting
through pause:

> Peatu hetkeks.

This is one of the clearest places where the participant enters the room rather
than chooses a function.

`app/attunement-question/page.tsx` also behaves more like a movement within one
encounter. It opens a quiet question from memory, echo, and journey context, but
does not ask the participant to classify the meeting. Its actions are:

- open another quiet question;
- carry this question into the meeting.

`app/reflection/page.tsx` already holds continuation inside one thread. The
recent wording pass reduced form-like language:

- `Kirjutan siia`;
- `Saada`;
- “Kirjuta siia, kui midagi tahab veel nähtavale tulla...”

This makes the continuation feel less like selecting a tool and more like
remaining in the same encounter.

The stored thread model also already carries mixed material inside one session.
Messages have `sessionId`, `mode`, role, text, and timestamp. This means the
system can remember movement without necessarily forcing every future movement
to become a separate visible destination.

Viibime.

## 3. What Currently Protects The Essential Qualities

### Silence

Silence is protected by:

- `app/attunement/page.tsx`, which starts with pause rather than input demand;
- `app/attunement-question/page.tsx`, which frames the quiet question as not
  forcing movement;
- `/reflection` limit behavior, where after several turns the page says not
  everything opens through the next question.

Risk: explicit mode choice can interrupt silence by asking for classification
before the question has had time to form.

### Brevity

Brevity is protected by the original `Kohtumine` meaning and by the current
reflection flow staying visually continuous rather than becoming a chat panel.

Risk: `Avardamine` remains visible as a named separate path, which can imply
that expansion is a fuller or better form unless the UI makes proportion clear.

### Thought Exploration

Thought exploration is protected by `Mõttekohtumine`. The current explicit mode
keeps this movement available and named.

Risk: if modes are hidden too early, thought-nearness could be flattened into
ordinary reflection.

### Expansion

Expansion is protected by `Avardamine`. The current UI and storage preserve it
as a distinct movement.

Risk: if expansion remains a separate homepage destination, it may feel like a
function or advanced option rather than something the encounter may sometimes
need.

### Participant Agency

Participant agency is currently protected by explicit choice. The participant
can choose the movement rather than having Aim silently choose it.

Risk: if One Meeting is implemented by hiding all movement decisions from the
participant, Aim could gain hidden authority. That would conflict with Aim
non-centrality.

### Aim Non-Centrality

Aim non-centrality is protected by:

- the restored reflection flow;
- the quieter continuation wording;
- the foundation rule that Aim is not coach, therapist, mentor, expert, judge,
  or authority;
- the One Meeting Decision principle: one encounter, many possible movements,
  Aim present, never central.

Risk: if Aim is later asked to choose movement organically without visible
participant agency, Aim may become too central.

## Current Explicit Mode Surfaces

Participant-facing explicit surfaces:

- `app/question/page.tsx`
  - mode buttons: `Kohtumine`, `Mõttekohtumine`, `Avardamine`;
  - explanatory mode copy;
  - mode stored before routing to `/reflection`.
- `app/page.tsx`
  - signed-in CTA: `Ava avardamine` routes to `/question?mode=exploration`.
- `app/reflection/page.tsx`
  - current mode label shown in the page opening and thread area.
- `app/history/page.tsx`
  - session mode label shown for restored meetings.
- `app/statistics/page.tsx`
  - separate counts for ordinary meetings, thought meetings, and expansions.
- `app/timeline/page.tsx`
  - timeline meeting titles depend on mode.

Internal or compatibility surfaces:

- `lib/expectumTypes.ts`
  - `ReflectionMode = "meeting" | "thought" | "exploration"`;
  - thread messages and history items can carry mode.
- `lib/expectumStorage.ts`
  - `reflectionMode`;
  - `thread`;
  - `currentSession`;
  - `questionCount`.
- Supabase `meetings` reads and writes include `mode`.
- Journey, history, path, statistics, timeline, attunement-question, and
  trajectory reads preserve mode metadata.

Prompt surface:

- `app/api/reflect/route.ts` uses mode to select different response
  instructions.

This observation does not recommend prompt changes.

## Current Storage And Compatibility Constraints

The current implementation stores mode in multiple places:

- localStorage `expectum_reflection_mode`;
- localStorage thread messages;
- localStorage history;
- Supabase `meetings.mode`;
- normalized read-time meeting/session summaries;
- statistics and timeline count/title derivation;
- Journey context.

Any future One Meeting embodiment must preserve compatibility with existing
stored modes. Stored modes are not noise by themselves. They carry provenance:
they remember which movement was active when the meeting happened.

The product question is not whether mode should disappear from storage.

The question is whether the participant-facing UI must keep asking for mode as
an explicit destination.

Needs decision.

## What Can Remain Internal

The following may be able to remain internal, if future decisions allow it:

- stored mode values;
- thread message mode metadata;
- Supabase `meetings.mode`;
- prompt selection or response-shaping context;
- memory normalization and statistics compatibility;
- mode history for provenance.

Keeping these internal could protect continuity without making the participant
choose a tool too early.

Viibime.

## What Should Remain Visible To The Participant

The participant should not lose access to the meanings learned through the
three forms.

What may need to remain visible:

- quiet meeting as a real possibility;
- thought exploration as legitimate meeting material;
- expansion as a possible widening, not a superior form;
- participant agency over whether the meeting should stay quiet, think more, or
  open wider;
- enough language to understand why a response feels brief, thoughtful, or
  expansive.

Needs decision: whether these remain as named buttons, softer movement
language, inline choices during the encounter, or another form.

## What Must Not Be Flattened

One Meeting must not flatten:

- `Kohtumine` into generic chat;
- `Mõttekohtumine` into ordinary reflection;
- `Avardamine` into default long answering;
- silence into missing output;
- brevity into lesser care;
- thought into analysis;
- expansion into teaching;
- participant agency into hidden Aim choice;
- memory mode metadata into irrelevant technical residue.

The three forms were discoveries. They should not be erased merely because the
interface becomes quieter.

## What Must Not Be Removed Yet

Do not remove yet:

- mode storage;
- mode values;
- mode-aware prompts;
- existing routes;
- current reflection behavior;
- current memory/history compatibility;
- ability to begin thought meeting or expansion;
- visible mode labels in memory/history surfaces;
- statistics compatibility.

The decision is not clear enough for implementation.

Viibime.

## 4. Smallest Decision Before Implementation

The principal decision gate is:

> Should One Meeting reduce participant-facing mode choice now, or should
> explicit mode choice remain until a safer movement language is found?

This includes several smaller decisions:

- Does the participant still need to choose `Kohtumine`, `Mõttekohtumine`, or
  `Avardamine` before writing?
- Should the homepage expose `Ava avardamine` as a separate signed-in CTA?
- Should `/reflection` display the mode label twice, once, or not at all?
- Should memory pages preserve mode labels visibly as provenance?
- Can movement be offered inside the encounter without giving Aim hidden
  authority?
- Is there language for movement that does not sound like a feature menu?

Needs decision.

## Decision Gates

Before any implementation:

1. Decide whether participant-facing mode choice remains explicit.
2. Decide whether `Avardamine` should remain a signed-in homepage CTA.
3. Decide whether movement language should replace mode language, and if so
   what word can carry it without becoming explanatory.
4. Decide whether Aim may adapt organically, and how participant agency remains
   visible.
5. Decide which surfaces are provenance/memory and which are active encounter
   choices.
6. Confirm that no storage, prompt, route, or memory behavior changes are
   included in the first implementation.

## Smallest Safe Future Embodiment Candidate

The smallest natural next embodiment is still not implementation.

It is a participant-facing mode-surface map:

- list every visible mode surface;
- classify each as active choice, provenance, memory label, statistic, or
  prompt context;
- mark which must remain visible and which could become internal later.

Only after that should a copy-only implementation candidate be considered.

If a code PR later becomes approved, the smallest possible candidate would be a
copy/navigation-only pass on one visible surface, likely the signed-in homepage
or `app/question/page.tsx`, with no prompt, storage, route, Supabase, memory, or
styling change.

This is not authorization to implement.

Viibime.

## Strongest Explicit-Mode Interruption

The strongest explicit-mode interruption is the mode button group on
`app/question/page.tsx`, supported by explanatory copy and by the signed-in
homepage CTA `Ava avardamine`.

Together these can make the participant feel they are choosing a function before
entering the encounter.

## Strongest Already-Visible One Meeting Behavior

The strongest already-visible One Meeting behavior is the path:

`/attunement` → `/question` → `/reflection`

when entered through pause rather than through mode selection.

The other strong One Meeting surface is `/attunement-question`, where the system
offers a quiet question and lets it move into the meeting without asking the
participant to classify the movement.

## Principal Decision Gate

Needs decision:

> How should participant agency remain visible if explicit mode choice becomes
> quieter?

This is the core gate because removing visible mode choice too early may give
Aim hidden authority, while keeping it as-is may preserve app-like function
selection.

## Smallest Natural Next Embodiment

The smallest natural next embodiment is a mode-surface map, not a UI change.

Viibime.
