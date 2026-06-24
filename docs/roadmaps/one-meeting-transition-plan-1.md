# ONE MEETING TRANSITION PLAN 1.0

## Current State

Expectum currently carries the central meeting through three explicit forms:

- `Kohtumine`
- `Mõttekohtumine`
- `Avardamine`

In implementation terms, these appear as `meeting`, `thought`, and `exploration` modes. The mode is visible in the question entry flow, reflection flow, saved meeting records, memory/history surfaces, statistics, timeline labels, and the reflection API prompt selection.

The current structure is meaningful. It preserves real discoveries:

- quiet meeting protects restraint and space;
- thought meeting protects thinking-with material that is still forming;
- expansion protects wider context and opening.

The current risk is that these forms can feel like separate destinations or tools instead of movements within one protected encounter.

## Target State

The target state is not mode deletion.

The target state is:

> One encounter. Many possible movements. Aim present, never central.

In this target state:

- `Kohtumine`, `Mõttekohtumine`, and `Avardamine` remain protected learnings;
- they are understood as movements within one encounter rather than separate destinations;
- the participant is not forced into app-like mode-thinking more than necessary;
- Aim may be quiet, near thought, or gently expansive without becoming the center;
- silence, brevity, and expansion all remain valid.

This target state should emerge gradually and only after each transition step proves safe.

## What Must Be Protected

The transition must protect:

- the quietness and restraint of original `Kohtumine`;
- the dignity of short responses;
- silence as presence, not absence;
- thought as something that can be met without being analyzed;
- expansion as room-opening, not teaching;
- user agency;
- Aim as space-holder and participant;
- the human as the source of meaning;
- Kaja as a trace of meeting, not a productivity artifact;
- memory as remembering, not accumulation;
- the original visual direction: hope, invitation, glimpse, possible direction, and journey.

The system must not become simpler by becoming generic.

## What Must Not Be Changed Yet

Do not change yet:

- prompts;
- mode values in storage;
- database schema;
- Supabase logic;
- memory normalization;
- history migration;
- routes;
- authentication;
- visual styling;
- saved meeting behavior;
- Kaja behavior;
- public explanations;
- the actual availability of `Kohtumine`, `Mõttekohtumine`, or `Avardamine`.

The next safe work should clarify before it changes.

## Likely Affected Pages

If implementation work is later approved, likely affected pages include:

- `app/question/page.tsx` — current explicit mode selection and explanatory mode copy.
- `app/reflection/page.tsx` — current mode label, current mode stored in thread messages, continued meeting flow.
- `app/history/page.tsx` — mode labels and restored-mode behavior.
- `app/statistics/page.tsx` — separate counts for meeting/thought/exploration.
- `app/timeline/page.tsx` — timeline labels based on meeting mode.
- `app/path/page.tsx` — memory and encounter summaries that may still surface mode-shaped counts or traces.
- `app/journey/page.tsx` — journey context assembled from meetings with mode metadata.
- `app/attunement-question/page.tsx` and `app/trajectory/page.tsx` — read meeting history and mode metadata.
- Public explanation pages such as `app/expectum/page.tsx`, `app/aim/page.tsx`, `app/human-and-ai/page.tsx`, `app/aim-memory/page.tsx`, and `app/expectum-language/page.tsx` if language around meeting movements is later clarified.

This list is for orientation only. It is not authorization to change these pages.

## Likely Affected Prompts

If prompt work is later approved, likely affected prompt areas include:

- `app/api/reflect/route.ts` — currently contains distinct instructions for `meeting`, `thought`, and `exploration`.
- `lib/expectumVoice.ts` — shared voice layer, if a common one-encounter boundary is ever added.
- `app/api/attunement-question/route.ts` — may need to remain aware of meeting movements without making Aim directive.
- `app/api/journey/route.ts` — may need to preserve movement history without turning it into identity.
- `app/api/trajectory/route.ts` — may need to preserve possible direction without treating movement as advice.

No prompt change is recommended in this plan. Prompt work must not begin until the product decision is translated into a precise prompt-alignment brief.

## Smallest Safe First Implementation Candidates

These are candidates only. They are not implementation instructions.

1. **Language-only review of participant-facing mode copy**
   - Goal: identify where copy makes the three forms feel like separate destinations.
   - Safe output: documentation or a small copy-only PR after approval.
   - Risk: accidentally implying the modes are already gone.

2. **Mode-label audit before code changes**
   - Goal: list every place where `Kohtumine`, `Mõttekohtumine`, and `Avardamine` are shown to participants.
   - Safe output: documentation-only audit.
   - Risk: none if no code changes occur.

3. **Prompt transition brief**
   - Goal: describe how prompt language could eventually treat modes as movements without flattening Aim.
   - Safe output: documentation-only brief.
   - Risk: becoming a prompt rewrite too early.

4. **Prototype decision for language, not behavior**
   - Goal: decide whether future wording should say “liikumine” or another term.
   - Safe output: decision document.
   - Risk: choosing terminology before seeing it in context.

5. **One-page implementation spike only after approval**
   - Goal: if later authorized, test the smallest copy-only shift on `app/question/page.tsx`.
   - Safe boundary: no prompt, storage, route, memory, or schema changes.
   - Risk: visual or conceptual drift if done before language is settled.

The safest immediate next step is still documentation: a mode-label and participant-facing language audit.

## Risks

The transition risks are:

- collapsing three meaningful movements into a generic response style;
- losing the quiet original meeting;
- making Aim responsible for choosing too much;
- hiding user agency;
- changing prompt behavior before language is clear;
- changing stored mode semantics too early;
- breaking memory/history/statistics expectations;
- making expansion feel like the default or best form;
- treating brevity as lesser care;
- turning “one encounter” into chatbot continuation;
- reducing useful distinctions before understanding their value.

The largest risk is not moving too slowly. The largest risk is making the system simpler by making it less true.

## Non-Goals

This transition plan does not:

- remove modes;
- rename modes;
- change UI;
- change prompts;
- change routes;
- change API behavior;
- change database schema;
- migrate stored data;
- change memory behavior;
- change Supabase logic;
- change styling;
- change auth;
- change deployment;
- decide final terminology;
- authorize implementation.

## Recommended Documentation Sequence

Before any implementation PR, create or complete:

1. Mode-label and participant-facing language audit.
2. Prompt transition brief.
3. Decision on terminology for movements within one encounter.
4. Smallest-safe implementation scope proposal.

Only after those are reviewed should a code PR be considered.

## Decision Gate

Implementation should not begin until there is explicit human approval for:

- whether participant-facing mode choice remains;
- whether language changes from “modes” to “movements” or another term;
- whether Aim may adapt organically or only within explicit participant choice;
- whether the first implementation should touch copy, UI, prompts, or none yet.

Until then, the transition remains conceptual and governance-level.
