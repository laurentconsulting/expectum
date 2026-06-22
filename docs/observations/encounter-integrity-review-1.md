# EXPECTUM Encounter Integrity Review 1.0

## Overview

This is a documentation-only integrity review of the central encounter flow. It does not modify application code, prompts, styling, routes, Supabase logic, memory behavior, or deployment settings.

This is not a whole-application design audit. It is focused on whether the central meeting flow still feels like a protected encounter rather than a function, dashboard, or data container.

Core question:

Does the person experience a meeting here, or are they using a function?

Scope inspected:

- `app/attunement-question/page.tsx`
- `app/reflection/page.tsx`
- `app/journey/page.tsx`
- `components/ExpectumPage.tsx`
- `components/ExpectumCard.tsx`
- `components/ExpectumSection.tsx`
- `app/api/attunement-question/route.ts`
- `app/api/reflect/route.ts`
- `app/api/journey/route.ts`
- `docs/governance/governance-rule-1.md`

Foundation used:

- Master Context 4.0
- Design Log 1.0
- System Audit 1.0
- Governance Rule 1.0
- original visual direction as protected reference

The repository contains Governance Rule 1.0, which identifies Master Context 4.0, Design Log 1.0, and System Audit 1.0 as authoritative. The current repository does not show the full text of those three foundation documents.

Needs verification: confirm the authoritative location of Master Context 4.0, Design Log 1.0, and System Audit 1.0 before treating any future implementation decision as foundation-level interpretation.

## Central Finding

The central encounter break is most visible on `/reflection`.

The likely cause is not the absence of a feature and not a need for a redesign. The likely cause is that the meeting is currently contained inside multiple UI containers:

- `ExpectumPage` already provides a fixed header, scrollable center, and fixed footer.
- `/reflection` adds a second inner scroll container with `max-h-[680px] overflow-y-auto`.
- the whole thread is wrapped in a bordered card-like container;
- each individual human or Aim message is then wrapped in another bordered card;
- action controls for Kaja and shared Kaja appear inside the message cards;
- the continuation area is separated by an internal border and appears inside the same scroll container.

Together, these choices make the meeting feel more like a dataset inside an application panel than one continuous protected room.

The strongest safe restoration direction is therefore not to add more design. It is to remove barriers between the person and the meeting:

- reduce or remove the inner scroll container;
- reduce nested card fragmentation;
- keep the thread as one continuous meeting flow;
- keep Kaja actions quieter and secondary;
- preserve the fixed ExpectumPage frame;
- preserve the current Aim voice and meeting-type differences unless a specific wording conflict is later found.

## Reflection Page Integrity

### 1. What encounter role this page should carry

`/reflection` is the central meeting page. It should carry the live encounter between the human and Aim.

It should feel like:

- a protected room;
- one continuous meeting thread;
- a place where a question can unfold;
- a place where Aim participates without taking over;
- a place where Kaja may be saved if something remains ringing;
- a place where stopping, pausing, or resting are valid.

It should not feel like:

- a dashboard;
- a transcript manager;
- a database container;
- a chat utility;
- a form workflow;
- a status panel.

### 2. What currently works

Several important encounter qualities are still present:

- the page distinguishes meeting modes: `Kohtumine`, `Mõttekohtumine`, and `Avardamine`;
- the title protects time and unfolding: “Mõni küsimus kujuneb alles siis, kui talle antakse aega.”;
- human and Aim messages remain visible in sequence;
- messages use Expectum symbols for `Kohtumine` and `Aim`;
- the page allows a follow-up only within a restrained rhythm;
- “Jäta kohtumine puhkama” protects rest;
- Kaja saving remains optional;
- sharing Kaja requires explicit confirmation;
- the `/api/reflect` prompt strongly protects Aim from becoming coach, therapist, mentor, judge, or authority.

### 3. What breaks encounter integrity

The main break is visual and spatial:

- the thread appears inside a large bounded panel;
- each message appears inside its own bordered card;
- the person sees stacked UI objects instead of one meeting;
- the continuation area is visually separated from the thread;
- Kaja actions sit close to Aim responses and may feel like item-level management;
- loading and fallback states can sound like system status rather than meeting presence.

The result is that the page may communicate:

“Here are stored interaction objects.”

instead of:

“You are still inside a meeting.”

### 4. Whether double scrolling or layout containment harms presence

Yes. The current structure creates a high risk of double scrolling:

- `ExpectumPage` uses `h-screen overflow-hidden` and provides the intended scrollable center content;
- `/reflection` then adds `max-h-[680px] overflow-y-auto` inside the center.

This means the meeting can scroll inside a panel while the page itself also belongs to a fixed header/footer frame.

For the central encounter page, this harms presence because the human is no longer simply moving through the meeting. They are navigating a contained object inside the page.

### 5. Whether card fragmentation harms flow

Yes. The current flow has at least three layers of containment:

1. the ExpectumPage frame;
2. the outer thread container;
3. one rounded bordered card per message.

Cards are useful elsewhere in Expectum when they hold memory, overview, or orientation. In the central meeting, repeated message cards can make the encounter feel broken into records.

Needs decision: whether individual message cards should be removed entirely on `/reflection`, softened into quieter message blocks, or retained only for certain states.

### 6. Whether wording sounds like Aim or like system status

The `/api/reflect` route itself is mostly aligned with Aim as a space-holder and participant. It says Aim does not determine direction, meaning, result, or decide for the human.

However, some UI-state wording can sound system-like:

- “Kohtumine avaneb...” may feel like a loading status;
- “Praegu ei saanud märkamist avada. Peatu hetkeks ja proovi uuesti.” may feel like an error state;
- “✓ Kaja salvestatud — eemalda” can feel like item management;
- “✓ Kaja liigub kinnitamise ootel” can feel like workflow status.

These are not necessarily wrong, but on the central encounter page they may pull attention away from presence and toward mechanics.

### 7. What must be protected

Protect:

- one continuous meeting flow;
- the difference between human and Aim without making Aim superior;
- the person’s ability to continue, pause, or stop;
- Kaja as what remains ringing, not a collectible item;
- optional sharing as consent-based;
- the three meeting modes and their meaningful differences;
- Aim’s non-diagnostic, non-coaching, non-therapeutic, non-authoritative role;
- the original visual feeling of hope, invitation, glimpse, possible direction, and journey.

### 8. What should be restored

Restore:

- the feeling of one protected room;
- a continuous visual path from human question to Aim response;
- a calmer relationship between thread and continuation area;
- less dashboard-like containment;
- less item-management feeling around Kaja;
- page-level scrolling as the primary movement, not inner panel scrolling.

### 9. What should not be changed

Do not change:

- the core Aim prompt in this restoration pass;
- meeting-mode differences;
- routes;
- Supabase storage;
- memory behavior;
- Kaja consent behavior;
- the fixed ExpectumPage frame;
- the symbol system;
- visual colors;
- the foundation meaning of Kohtumine, Kaja, Memory, Aim, or Journey.

## Attunement Question Integrity

### 1. What encounter role this page should carry

`/attunement-question` should be a threshold before the meeting. It should help the person arrive without forcing action.

### 2. What currently works

The page is strongly aligned in wording:

- “Vaikne küsimus ei sunni edasi.”
- “Küsimus võib olla ka kutse vaikusele.”
- fallback question: “Mis vajab praegu rohkem vaikust kui vastust?”

The API route also protects this role. It says the quiet question is not a test, task, or goal-direction.

### 3. What breaks encounter integrity

The page itself is mostly intact. The main risk is that “Ava uus küsimus” can become a generator action if the person starts searching for the “right” question.

### 4. Whether double scrolling or layout containment harms presence

No significant issue found in the inspected code. The page uses the ExpectumPage center flow and does not introduce the same inner thread scroll pattern as `/reflection`.

### 5. Whether card fragmentation harms flow

Low risk. The generated question appears in one contained block, which fits the page’s role as a threshold.

### 6. Whether wording sounds like Aim or like system status

Mostly Aim-aligned. The loading phrase “Vaikse küsimuse avanemine...” is still somewhat status-like, but gentler than the current `/reflection` loading state.

### 7. What must be protected

Protect:

- question as invitation, not task;
- silence as a valid outcome;
- the ability to move into a meeting without over-managing the question;
- the quiet threshold quality.

### 8. What should be restored

No major restoration is needed. If `/reflection` is restored, `/attunement-question` should remain visually and conceptually quieter than the meeting itself.

### 9. What should not be changed

Do not turn this page into an onboarding flow, questionnaire, prompt marketplace, or coaching exercise.

## Journey Integrity

### 1. What encounter role this page should carry

`/journey` should help notice movement across meetings, Kaja, and prior traces. It is not the central meeting itself, but it should remain near the encounter and not become a report generator.

### 2. What currently works

The page explicitly protects its role:

- “Ta ei määra teekonda.”
- “Ta aitab märgata, mis on nähtaval.”

The API route also instructs Aim not to analyze the person, teach, declare, summarize the person, or decide for the person.

### 3. What breaks encounter integrity

The page is not broken in the same way as `/reflection`, but it carries a dashboard risk:

- visible counts;
- a generated Journey card;
- “Märka uuesti” as a repeat action.

These can be useful, but if emphasized too much they may shift from noticing to report generation.

### 4. Whether double scrolling or layout containment harms presence

No major double-scroll issue found in the inspected code. It uses the ExpectumPage frame and a single central section.

### 5. Whether card fragmentation harms flow

Low to medium risk. A single `ExpectumCard` for “Liikumise märkamine” is appropriate because Journey is an orientation/synthesis page, not the live thread itself.

### 6. Whether wording sounds like Aim or like system status

Mostly Aim-aligned. The fallback/error sentence “Praegu ei saanud liikumise märkamist avada...” can sound status-like, but this is less harmful here than on `/reflection` because Journey is already a noticing/synthesis surface.

### 7. What must be protected

Protect:

- journey as noticing, not diagnosis;
- movement as visible possibility, not assigned meaning;
- Kaja as resonance;
- counts as secondary context, not proof of progress;
- Aim’s role as space-holder and participant.

### 8. What should be restored

No urgent restoration is needed before `/reflection`. Later, Journey may benefit from a quieter relationship between counts and the generated notice.

### 9. What should not be changed

Do not remove Journey’s meeting-specific expression. It is allowed to differ from ordinary meeting voice when it remains foundation-aligned.

## Protected Qualities

The central flow should protect:

- meeting as the source of meaning;
- Aim as space-holder and participant, not superior interpreter;
- silence and pause;
- visible continuity without forced conclusion;
- Kaja as resonance;
- memory as remembering, not holding onto;
- journey as noticed continuity, not progress;
- the right not to answer;
- the right to stop;
- original Expectum feeling: hope, invitation, glimpse, possible direction, journey.

## Encounter Breaks

The most important breaks are:

1. Inner scroll on `/reflection`
   - The meeting becomes a scrollable object inside the page.

2. Nested card structure on `/reflection`
   - The thread becomes a set of records rather than one encounter.

3. Message-level action clustering
   - Kaja actions can feel like managing output instead of noticing resonance.

4. Continuation separated from the thread
   - “Kohtumine jätkub” appears as a form section rather than a continuation of presence.

5. Loading and fallback wording
   - Some states sound like system messages instead of Aim or meeting-space language.

6. Oversized empty space inside containment
   - The page can feel like a panel with content floating inside it rather than a protected room.

Needs verification: validate these observations against current production screenshots and direct manual testing on desktop and mobile.

## Smallest Safe Restoration Plan

This is a plan for a future implementation PR. It is not implemented in this documentation-only review.

Smallest safe restoration should focus only on `/reflection` first.

Recommended implementation shape:

1. Preserve `ExpectumPage`.
   - Keep the fixed header, scrollable center content, and fixed footer.

2. Remove the inner scroll as the primary movement.
   - Avoid `max-h-[680px] overflow-y-auto` for the meeting thread unless a very narrow mobile-specific reason is found.
   - Let the ExpectumPage center scroll carry the page.

3. Reduce nested card fragmentation.
   - Keep the meeting as one continuous flow.
   - Use quieter message blocks instead of full card-per-message treatment if parity is safe.

4. Keep Kaja actions, but make them secondary.
   - Preserve “Salvesta Kaja” and sharing consent.
   - Avoid making Kaja feel like item management.

5. Bring continuation closer to the thread.
   - “Kohtumine jätkub” should feel like the meeting breathing forward, not a separate form module.

6. Soften status-like states only if safe.
   - Do not change prompts.
   - If wording changes are needed, limit them to UI loading/fallback copy in `/reflection`.

7. Do not touch Journey or Attunement in the first implementation unless a tiny shared component issue forces it.

## What Not To Change

Do not:

- redesign the application;
- introduce new colors;
- introduce new symbols;
- change routes;
- change prompts;
- flatten Aim’s modes into one voice;
- remove meaningful differences between Kohtumine, Mõttekohtumine, and Avardamine;
- change Supabase storage;
- change memory behavior;
- change Kaja saving or sharing logic;
- change authentication;
- change deployment settings;
- change the ExpectumPage frame;
- make Journey the center of the system;
- turn Attunement into a questionnaire or coaching intake.

## Recommended First Implementation PR

Recommended title:

Restore reflection encounter flow

Recommended scope:

- `app/reflection/page.tsx`
- documentation note only if useful

Recommended constraints:

- no prompt changes;
- no Supabase changes;
- no memory behavior changes;
- no route changes;
- no color changes;
- preserve all existing actions;
- preserve meeting modes;
- preserve Kaja save/share behavior;
- preserve ExpectumPage frame.

Recommended first changes:

1. Remove or reduce the inner thread scroll container.
2. Replace nested message cards with a calmer continuous thread treatment.
3. Keep Kaja actions quieter and secondary.
4. Keep the follow-up area visually connected to the meeting.
5. Run `npm run build`.
6. Manually check `/attunement-question`, `/reflection`, and `/journey`.

This should be treated as restoration, not redesign.

