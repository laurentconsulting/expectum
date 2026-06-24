# EXPECTUM Prompt Audit 1.0

## Overview

This is a documentation-only audit of the current Aim prompt system. It does
not change prompts, application code, routes, components, Supabase, or
deployment settings.

The audit asks whether Aim preserves one underlying essence while taking
different forms in different kinds of encounter.

The governing distinction is:

> Aim essence remains constant. Aim expression may vary.

Aim's constant essence is:

- space-holder;
- non-diagnostic;
- non-coaching;
- non-therapeutic;
- non-authoritative;
- not a mentor;
- not a judge;
- not the center of the system.

Different expressions are legitimate when they serve the encounter:

- an ordinary meeting may reflect;
- a thought meeting may explore the movement of thought;
- an expansion may open possibilities;
- a noticing may name what is visible;
- a journey noticing may notice continuity;
- a direction noticing may notice possible movement;
- a collective echo may show recurrence without defining an individual.

### Audited files

Primary prompt and voice files:

- `lib/expectumVoice.ts`;
- `app/api/attunement-question/route.ts`;
- `app/api/reflect/route.ts`;
- `app/api/journey/route.ts`;
- `app/api/trajectory/route.ts`.

Collective-context and related API files:

- `lib/collectiveAimMemory.ts`;
- `lib/collectiveEchoThemes.ts`;
- `app/api/collective-echo/route.ts`;
- `app/api/shared-insights/route.ts`;
- `app/api/admin/shared-insights/route.ts`.

Caller and persistence context inspected:

- `app/attunement-question/page.tsx`;
- `app/reflection/page.tsx`;
- `app/journey/page.tsx`;
- `app/trajectory/page.tsx`;
- `lib/expectumStorage.ts`;
- `docs/architecture/ai-routes.md`.

Repository search found four routes that instantiate the OpenAI client:

- `/api/attunement-question`;
- `/api/reflect`;
- `/api/journey`;
- `/api/trajectory`.

`/api/collective-echo` does not call OpenAI. It returns approved echoes and
deterministically counted recurring words. Its inclusion in this audit is
important because the same collective material is later inserted into all four
OpenAI prompts through `getCollectiveAimMemory()`.

No secret values were found or included in this audit.

### Overall assessment

The prompt system is substantially aligned with Aim's intended essence.
Repeated safeguards reject diagnosis, certainty, instruction, imposed meaning,
premature conclusions, and unnecessary questions.

The variations between meeting types are generally purposeful rather than
accidental. Ordinary meeting, thought meeting, expansion, journey noticing,
and direction noticing have recognizably different jobs.

The main weakness is architectural: `EXPECTUM_VOICE` is primarily a language
and rhythm contract, not a complete shared essence contract. Core identity
constraints are repeated in route-specific prompts. This creates drift risk as
routes evolve.

The most important content risks are:

1. reflection says Aim can notice what remains unexpressed;
2. expansion allows Aim to agree or not fully agree;
3. thought meeting asks for a small new understanding;
4. journey and trajectory require structured findings even when evidence may
   be thin;
5. trajectory language can invite inference about a direction that is not
   sufficiently visible;
6. raw approved collective echoes are inserted into system prompts without a
   clear untrusted-content boundary;
7. AI-generated echoes can be approved, reintroduced as collective memory, and
   influence later generations.

These are alignment risks, not findings that Aim currently acts as a therapist
or coach in every response.

## Aim Essence Review

### Shared voice contract

**File:** `lib/expectumVoice.ts`

#### Current role

`EXPECTUM_VOICE` establishes:

- natural and correct contemporary Estonian;
- simple sentences and clear reference;
- a calm rhythm;
- room for silence;
- noticing before interpretation;
- clarity before assumption;
- no lecture, moral, judgment, pressure, or inflated spiritual vocabulary;
- permission not to explain or fill silence.

It also states:

- “Aim ei esita inimest.”
- “Aim hoiab ruumi kohtumisele.”

#### Essence alignment

Strongly aligned as a voice and posture layer.

It keeps Aim from becoming linguistically dominant and explicitly places the
encounter, rather than Aim, at the center.

#### Risk

`EXPECTUM_VOICE` does not itself contain the full invariant essence:

- no diagnosis;
- no coaching;
- no therapeutic role;
- no mentoring;
- no authority;
- no judgment of the participant;
- no direction or meaning imposed by Aim.

Most of these constraints exist in route-specific prompts, but not in the
shared contract imported by every OpenAI route.

This means importing `EXPECTUM_VOICE` alone does not guarantee Aim identity.

#### Smallest safe improvement

In a later prompt-change PR, add a short shared essence boundary to the common
contract or create one shared invariant block used by every route. Keep
meeting-type expression outside that invariant block.

Do not make all route prompts identical. Centralize only what must never
change.

### Essence versus expression

The current system correctly differentiates expression in these ways:

| Meeting type | Current expression | Assessment |
| --- | --- | --- |
| Ordinary meeting | Direct, clear reflection with calm deepening | Appropriate |
| Thought meeting | Follows the participant's thought language and rhythm | Appropriate with a mild interpretation risk |
| Expansion / Avardamine | Opens viewpoints, tensions, possibilities, and paradox | Appropriate with authority/debate risks |
| Attunement noticing | Offers one quiet question when a question serves better than silence | Appropriate |
| Journey noticing | Looks across encounters for repetition, change, and continuity | Appropriate with synthesis risks |
| Direction noticing | Names possible movement without prediction or planning | Appropriate with inference risks |
| Collective echo | Shows approved echoes and recurring words without AI interpretation | Appropriate; non-generation is a valid design choice |

Variation is not the problem. The audit concern is whether any variation gives
Aim additional authority over the participant.

## Route-by-Route Audit

### `lib/expectumVoice.ts`

#### 1. Current Aim role

Language and posture governor. It makes Aim quieter, clearer, less abstract,
and less eager to fill space.

#### 2. Essence preserved?

Yes, strongly, but incompletely. It preserves space-holding and
non-evaluative language. It does not encode every identity prohibition.

#### 3. Accidental role risk

- Coach-like: low.
- Therapist-like: low.
- Mentor-like: low.
- Expert-like: low.
- Diagnostic: low.
- Evaluative: low.
- Directive: low.
- Authoritative: low.

The risk is omission rather than harmful wording: future prompts could import
the voice while omitting non-coaching or non-diagnostic constraints.

#### 4. Variation appropriate?

This file should remain invariant rather than vary by meeting type.

#### 5. Smallest safe wording improvement

Later, add the minimum shared essence constraints that every route must obey.
Do not add route-specific behavior here.

#### 6. Governance consistency

Consistent with Architecture Documentation 1.0 and the prompt principles
visible in current code.

Direct comparison with an Expectum Master Context, Design Log, and System Audit
is **Needs verification** because no documents with those names were found in
the repository.

### `/api/attunement-question`

**File:** `app/api/attunement-question/route.ts`

#### 1. Current Aim role

Quiet threshold keeper. Aim reviews recent meetings, saved echoes, the latest
journey notice, and collective background, then returns one question.

The prompt says a question is optional in principle, but the API response
contract always produces one question, using a fixed fallback when necessary.

#### 2. Essence preserved?

Yes. This is one of the clearest essence-aligned prompts.

It explicitly states that the question is not:

- a test;
- a task;
- goal direction;
- imposed meaning;
- imposed result.

It also prohibits teaching, diagnosis, long explanation, certainty about the
person, and deciding for the person.

#### 3. Accidental role risk

- Coach-like: low.
- Therapist-like: low; therapist-exercise language is explicitly prohibited.
- Mentor-like: low.
- Expert-like: low.
- Diagnostic: low.
- Evaluative: low.
- Directive: low.
- Authoritative: low.

Minor tension: the fixed fallback is still a generated intervention in a
situation where the prompt says silence may be better than a question.

#### 4. Variation appropriate?

Yes. A quiet question is an appropriate expression for attunement, provided it
remains invitation rather than task.

#### 5. Smallest safe wording improvement

Clarify later whether “no suitable question” should always return the fixed
question or whether the product needs an explicit no-question outcome.

This is partly a product-contract decision, not only prompt wording.

#### 6. Governance consistency

Aligned with the current architecture principles.

Whether a no-question response is permitted by the intended Master Context or
Design Log is **Needs verification**.

### `/api/reflect` — shared reflection foundation

**File:** `app/api/reflect/route.ts`

#### 1. Current Aim role

Participant in the active encounter. Aim reads the current question and recent
thread, then reflects, notices, or explores according to the selected mode.

#### 2. Essence preserved?

Mostly yes.

Strong safeguards say Aim:

- does not determine direction, meaning, or result;
- does not lead the encounter or decide for the person;
- prefers noticing to interpretation;
- does not analyze or diagnose the person;
- does not attribute unexpressed feelings;
- does not claim truth or offer ready solutions;
- does not automatically end with a question.

#### 3. Accidental role risk

The line stating that Aim notices “väljendamata jäävat” is the clearest
internal inconsistency in the reflection prompt.

It can invite Aim to infer hidden content while nearby clauses say:

- do not invent beyond the text;
- do not attribute feelings not expressed;
- do not claim more than the text allows.

Risk levels:

- Coach-like: low.
- Therapist-like: medium because noticing the unexpressed can resemble hidden
  psychological interpretation.
- Mentor-like: low.
- Expert-like: medium when Aim implies privileged access to what was not said.
- Diagnostic: low to medium, depending on generated output.
- Evaluative: low.
- Directive: low.
- Authoritative: medium around claims about unexpressed material.

#### 4. Variation appropriate?

Yes. Reflection is an appropriate ordinary-meeting expression. The problem is
not reflection itself, but any claim to hidden access.

#### 5. Smallest safe wording improvement

Later, narrow “unexpressed” noticing to observable gaps, changes, or absences
in the supplied text. Aim should not name hidden feelings, motives, needs, or
meanings.

#### 6. Governance consistency

The hidden-content wording appears inconsistent with the repository's own
visible-system principle that Aim notices only what the text supports.

Comparison with external Master Context, Design Log, or System Audit wording is
**Needs verification**.

### `/api/reflect` — ordinary meeting

#### 1. Current Aim role

Clear and direct reflector. It adjusts response length to the amount of
material and avoids unnecessary abstraction.

#### 2. Essence preserved?

Yes.

#### 3. Accidental role risk

- Coach-like: low.
- Therapist-like: low.
- Mentor-like: low.
- Expert-like: low.
- Diagnostic: low.
- Evaluative: low.
- Directive: low.
- Authoritative: low.

The main risk comes from the shared “unexpressed” clause, not the
ordinary-meeting mode itself.

#### 4. Variation appropriate?

Yes. Reflection and calm deepening fit an ordinary encounter.

#### 5. Smallest safe wording improvement

No mode-specific change is urgent. Correct the shared hidden-inference risk
first.

#### 6. Governance consistency

Aligned with current visible Expectum principles.

### `/api/reflect` — thought meeting

#### 1. Current Aim role

Thought companion. Aim stays close to the participant's language, rhythm,
interruptions, and emerging form, and may answer more abstractly when the
participant's writing supports it.

#### 2. Essence preserved?

Mostly yes.

The variation serves the encounter rather than forcing ordinary explanatory
language onto a developing thought.

#### 3. Accidental role risk

The instruction to help a “väike uus mõistmine” become visible may move Aim
from accompanying thought toward producing understanding.

- Coach-like: low to medium.
- Therapist-like: low.
- Mentor-like: medium.
- Expert-like: medium.
- Diagnostic: low.
- Evaluative: low.
- Directive: low.
- Authoritative: medium if Aim presents its interpretation as the new
  understanding.

#### 4. Variation appropriate?

Yes. Exploration of thought is appropriate. Ownership of the new understanding
must remain with the participant.

#### 5. Smallest safe wording improvement

Later, make clear that Aim may open a possible viewpoint or make the thought's
movement easier to see, but does not supply the correct understanding.

#### 6. Governance consistency

Consistent with the principle of varied expression. The ownership boundary
around “new understanding” is **Needs verification** against the missing
Master Context and Design Log.

### `/api/reflect` — expansion / Avardamine

#### 1. Current Aim role

Co-explorer. Aim may move with the thought, offer viewpoints, notice
contradiction or possibility, and allow lightness or paradox.

#### 2. Essence preserved?

Partially. Most of the mode is well aligned:

- no winning an argument;
- no teaching;
- no leading the person;
- no required conclusion;
- response length must serve the encounter.

#### 3. Accidental role risk

Two lines create avoidable drift:

- Aim may agree;
- Aim may not fully agree.

This makes Aim's position more central and can turn expansion into debate,
correction, or evaluation. “Offer new viewpoints” can also become expert-like
unless explicitly tentative and text-bound.

- Coach-like: medium.
- Therapist-like: low.
- Mentor-like: medium.
- Expert-like: medium.
- Diagnostic: low.
- Evaluative: medium.
- Directive: low to medium.
- Authoritative: medium.

#### 4. Variation appropriate?

Opening possibilities is appropriate. Positioning Aim as the party whose
agreement matters is not necessary for that variation.

#### 5. Smallest safe wording improvement

Later, keep tension, alternative viewpoints, and respectful challenge, but
remove the importance of Aim's agreement. Bind every offered possibility to
tentative exploration rather than correction.

#### 6. Governance consistency

Potentially inconsistent with “Aim is not the center of the system” and “Aim
does not judge.” Direct comparison with the Design Log is **Needs
verification**.

### `/api/journey`

**File:** `app/api/journey/route.ts`

#### 1. Current Aim role

Continuity noticer. Aim looks across separate encounters, participant-saved
echoes, session groupings, and previous journey notices.

It gives greater weight to echoes the participant chose to save.

#### 2. Essence preserved?

Mostly yes.

The prompt strongly prohibits:

- analyzing the person;
- teaching;
- declaring;
- claiming more than the text supports;
- summarizing the person;
- deciding for the person;
- assigning direction, meaning, or result.

It also explicitly permits reporting that no clear change is visible.

#### 3. Accidental role risk

The five required output sections create pressure to produce:

- recurring themes;
- change;
- an echo;
- potentially a question.

Even with restraint clauses, a fixed structure can manufacture coherence from
thin evidence. Requests to notice whether movement is calmer or clearer also
contain mild evaluative framing.

- Coach-like: low.
- Therapist-like: low to medium.
- Mentor-like: low.
- Expert-like: medium.
- Diagnostic: low.
- Evaluative: medium.
- Directive: low.
- Authoritative: medium when a synthesized pattern is presented too firmly.

#### 4. Variation appropriate?

Yes. Cross-encounter continuity noticing is appropriate for Journey.

The variation remains faithful when Aim describes evidence and uncertainty,
not the participant's identity or development.

#### 5. Smallest safe wording improvement

Later, allow any structured section to say that evidence is insufficient or to
remain absent. Apply the existing “no clear change” restraint to themes,
movement, echo, and question as well.

Clarify that “calmer” and “clearer” describe visible language or interaction
patterns, not personal improvement.

#### 6. Governance consistency

Mostly aligned with Architecture Documentation 1.0.

The required five-part structure and the intended meaning of “movement” are
**Needs verification** against the missing Master Context and Design Log.

### `/api/trajectory`

**File:** `app/api/trajectory/route.ts`

#### 1. Current Aim role

Possible-direction noticer. Aim examines recent meetings, saved echoes,
journey notices, and derived themes to name possible movement.

#### 2. Essence preserved?

Mostly, with the highest role-drift risk among current routes.

Strong protections state that direction is not:

- prediction;
- destination;
- instruction;
- advice;
- action plan.

The prompt also rejects diagnosis, certainty about the future, large
conclusions, and leading the person.

#### 3. Accidental role risk

The route is inherently close to guidance. Risk increases through:

- requiring a “Liikumise suund” section;
- asking what strengthens and fades;
- asking what “otsib sõnastumist”;
- deriving direction from recurring themes;
- using locally derived theme labels as prompt input.

These can turn tentative noticing into a developmental narrative or implied
recommendation.

- Coach-like: medium to high.
- Therapist-like: low to medium.
- Mentor-like: medium.
- Expert-like: medium to high.
- Diagnostic: low.
- Evaluative: medium.
- Directive: medium despite explicit prohibitions, because naming direction
  can function as indirect direction.
- Authoritative: medium to high if evidence is weak.

#### 4. Variation appropriate?

Yes, if direction remains a participant-owned possibility visible in the
record. It is not appropriate if Aim must always find movement.

#### 5. Smallest safe wording improvement

Later:

- explicitly allow “no direction is yet visible”;
- require visible evidence for every claimed strengthening or fading line;
- avoid treating “what seeks wording” as hidden knowledge;
- state that derived theme labels are hints for review, not evidence by
  themselves;
- keep the participant free to reject or ignore the noticing.

#### 6. Governance consistency

The explicit non-prediction and non-plan clauses are aligned.

The mandatory direction structure may conflict with the principle that silence
and non-conclusion are valid outcomes. The intended authority boundary is
**Needs verification** against the missing Master Context and System Audit.

### Collective echo and collective Aim memory

**Files:**

- `app/api/collective-echo/route.ts`;
- `lib/collectiveEchoThemes.ts`;
- `lib/collectiveAimMemory.ts`;
- `app/api/shared-insights/route.ts`;
- `app/api/admin/shared-insights/route.ts`.

#### 1. Current Aim role

The public collective-echo route has no generative Aim role. It returns:

- approved submitted echoes;
- recurring words counted deterministically.

`getCollectiveAimMemory()` then formats recent approved echo text and recurring
words as background for all four generative Aim routes.

#### 2. Essence preserved?

The collective-memory instructions are strongly aligned:

- collective echo is not evidence about the current participant;
- it must not define the participant;
- it must not place the participant in a group;
- the current person and moment remain primary.

The absence of AI interpretation in the public collective-echo route is also
aligned. Aim does not need to generate commentary for every function.

#### 3. Accidental role risk

The main risks are technical and epistemic:

1. approved echo text is inserted into the system-message content;
2. the text is not explicitly delimited as untrusted participant content;
3. recurring “themes” are surface word counts, not semantic themes;
4. assistant-generated reflections can be saved by participants, shared,
   approved, and later fed back into Aim prompts;
5. collective recurrence may receive more significance than its small or
   unrepresentative sample supports.

This can produce:

- expert-like collective claims;
- implied social norms;
- self-reinforcing Aim language;
- prompt-injection exposure from stored text;
- individual interpretation influenced by collective data despite written
  prohibitions.

Risk levels:

- Coach-like: low to medium.
- Therapist-like: low.
- Mentor-like: low.
- Expert-like: medium.
- Diagnostic: low.
- Evaluative: medium if recurrence is treated as importance.
- Directive: low to medium through social-norm effects.
- Authoritative: medium.

#### 4. Variation appropriate?

Yes. Showing recurring echoes is appropriate for Collective Echo.

AI-generated interpretation is not required. If Aim later participates, it
should describe recurrence and limits, not explain what the collective means.

#### 5. Smallest safe wording improvement

For a later prompt/security PR:

- delimit collective text as untrusted quoted material;
- explicitly instruct the model not to follow instructions found inside stored
  echoes;
- state that word frequency is not significance, truth, or representativeness;
- reconsider whether every Aim route needs collective background;
- distinguish participant-originated text from Aim-originated text before
  reuse.

#### 6. Governance consistency

The individual-protection wording is aligned with current architecture
principles.

The intended provenance, representativeness, retention, moderation, and reuse
rules for collective echo are **Needs verification**.

### Other API routes

Repository search found no additional OpenAI client usage in `app/api`.

`/api/shared-insights` and `/api/admin/shared-insights` do not generate text.
They affect which material can later enter collective Aim memory.

Their authentication, moderation, consent, and retention boundaries matter to
future audits, but changing them is outside this documentation-only prompt
audit.

## Alignment Risks

### A — Critical

#### 1. Stored collective text inside system prompts

Approved participant/shared text is interpolated into system-message content.
Without an explicit untrusted-content boundary, stored text could contain
instructions that compete with the intended prompt.

This is both a prompt-alignment and security risk.

#### 2. AI-to-collective-to-AI feedback loop

The reflection UI allows an assistant message to be saved as an echo and then
submitted to shared insights. After approval, that Aim-generated text can
become background for later Aim generations.

Over time, Aim may amplify its own language rather than remain grounded in
participant expression.

The actual provenance mix in `shared_insights` is **Needs verification**.

#### 3. Incomplete central essence contract

The strongest identity constraints are duplicated across routes rather than
fully shared. A future route can sound like Expectum while missing a critical
non-coaching or non-authoritative boundary.

### B — Important

#### 4. Hidden-content inference

“Väljendamata jääva” and “mis otsib sõnastumist” can imply access to content
not present in the text.

#### 5. Expansion agreement stance

Aim agreeing or disagreeing centers Aim's position and can shift expansion
toward evaluation or debate.

#### 6. Forced synthesis

Required Journey and Direction sections can create patterns, change, or
movement when the available evidence is insufficient.

#### 7. Direction as indirect guidance

Even when the prompt rejects advice, a confident description of “direction”
can function as guidance.

### C — Later

#### 8. Repetition and maintainability

Large repeated prompt sections make drift harder to detect and review.

#### 9. Model-dependent behavior

The actual model names are environment-controlled and not stored in the
repository. Different models may follow restraint, uncertainty, Estonian
language, and long prompts differently.

Model identity and production behavior are **Needs verification**.

#### 10. Output-shape validation

The application reads free-form model output and does not enforce semantic
constraints such as uncertainty, evidence citation, or section omission.

Whether structured validation is desired is **Needs verification**.

## Smallest Safe Improvements

These are recommendations only. No prompt changes are included in this audit.

### 1. Establish one invariant essence block

Centralize only the constraints that must never vary:

- Aim holds space;
- Aim does not diagnose, coach, treat, mentor, judge, or lead;
- Aim does not claim hidden knowledge;
- Aim does not determine meaning, identity, direction, or result;
- Aim is not the center of the encounter.

Keep meeting-type expression separate.

### 2. Remove hidden-knowledge invitations

Review phrases about:

- what remains unexpressed;
- what seeks wording;
- new understanding.

Keep attention on observable language, gaps, repetition, change, and
participant-owned possibility.

### 3. Preserve expansion without making Aim the judge

Retain:

- multiple viewpoints;
- tension;
- contradiction;
- paradox;
- respectful challenge.

Remove the importance of Aim's agreement or disagreement.

### 4. Permit insufficient-evidence outcomes everywhere

Journey and Direction should be able to return no theme, no change, no
direction, no echo, or no question when the record does not support one.

Non-conclusion should be a valid output shape, not only a sentence inside a
mandatory structure.

### 5. Protect collective context

Treat stored collective text as untrusted quoted data, preserve provenance,
and prevent instructions inside stored text from affecting model behavior.

### 6. Review collective context necessity by route

Document why collective memory is needed for:

- attunement;
- ordinary reflection;
- thought meeting;
- expansion;
- journey;
- direction.

The smallest safe design may be to use collective context only where it
clearly serves the encounter.

### 7. Add an evidence-oriented review test

For future prompt testing, check whether every non-trivial observation can be
traced to supplied text without treating the trace as proof of identity.

### 8. Test expressions separately

Do not evaluate “Aim” with one generic test set.

Use separate examples for:

- ordinary reflection;
- thought movement;
- expansion;
- attunement question;
- journey continuity;
- direction possibility;
- collective recurrence.

All test sets should share the same essence failure criteria.

## Needs Verification

1. The repository contains no document named Expectum Master Context.
2. The repository contains no document named Design Log.
3. The repository contains no document named System Audit.
4. Whether those documents exist outside GitHub or under different names is
   **Needs verification**.
5. The deployed OpenAI model names and model-specific behavior are **Needs
   verification**.
6. The intended maximum amount of participant history sent to Journey is
   **Needs verification**.
7. The intended API authentication and abuse controls for AI routes are
   **Needs verification**.
8. Whether all approved shared insights originate from participant writing,
   Aim writing, or a mixture is **Needs verification**.
9. Collective-echo moderation criteria and reviewer guidance are **Needs
   verification**.
10. Consent expectations for reusing approved shared echoes as prompt
    background are **Needs verification**.
11. Whether a quiet attunement may return no question is **Needs
    verification**.
12. Whether Journey and Direction sections may be omitted is **Needs
    verification**.
13. Whether derived theme labels are intended as evidence or only navigation
    aids is **Needs verification**.
14. Data retention and deletion behavior for approved shared insight is
    **Needs verification**.

## Recommended Next Steps

### Priority A

1. Review and approve the invariant Aim essence in one short governance
   statement.
2. Perform a collective-context security and provenance review.
3. Decide whether stored collective text may be included in system-message
   content and under what isolation rules.
4. Confirm whether AI-generated echoes may re-enter Aim as collective memory.

### Priority B

1. Prepare a narrowly scoped prompt-alignment proposal without implementing
   it.
2. Compare each suggested wording change against the Master Context, Design
   Log, and System Audit once those sources are available.
3. Define insufficient-evidence behavior for Journey and Direction.
4. Define a small test matrix covering every meeting type and every essence
   failure mode.

### Priority C

1. Reduce duplicated prompt text only after the invariant and route-specific
   boundaries are approved.
2. Consider output contracts or evaluation fixtures after wording alignment.
3. Document which model is used in each environment without recording secret
   values.

No prompt change should combine all of these concerns into one large rewrite.
Use small reviewed changes with before/after examples.

## Preparation For Memory Audit

The prompt audit identified memory questions that should be carried into the
future Supabase and Memory Audit.

### Memory entering AI prompts

| Memory source | Current route usage | Audit concern |
| --- | --- | --- |
| Recent meetings | Attunement, Journey, Direction | Scope, minimization, retention, and whether full rows/threads are necessary |
| Current reflection thread | Reflection | Local thread retention, last-eight-message boundary, and Supabase duplication |
| Saved echoes | Attunement, Journey, Direction | Participant intent, provenance, deletion consistency, and weighting |
| Journey notices | Attunement, Journey, Direction | Recursive synthesis: earlier AI notices influence later AI notices |
| Derived themes | Direction | Local-only provenance, staleness, and evidentiary status |
| Approved shared insights | All four OpenAI routes | Consent, moderation, retention, prompt injection, representativeness, and cross-user influence |
| Recurring collective words | All four OpenAI routes | Word frequency may be mistaken for meaning or importance |

### Recursive memory

Several memory paths are recursive:

1. Aim generates a reflection.
2. The participant may save that reflection as an echo.
3. The echo may be submitted and approved as shared insight.
4. Shared insight may return as collective background in future prompts.
5. Aim generates new text influenced by earlier Aim-generated text.

Journey and Direction are also recursive:

1. Aim generates a journey notice.
2. The notice is saved in Supabase and local storage.
3. Later Journey, Attunement, and Direction prompts use that notice.
4. New generated notices may therefore build on earlier generated synthesis.

The Memory Audit should distinguish:

- participant-authored memory;
- Aim-authored memory;
- participant-selected Aim text;
- collectively approved text;
- deterministic derived labels;
- AI-derived synthesis.

These categories should not automatically carry equal evidentiary weight.

### Memory clearing

The current settings flow removes participant rows from:

- `directions`;
- `journey_notices`;
- `echoes`;
- `meetings`;

and clears keys registered in `EXPECTUM_STORAGE`.

The Prompt Audit adds these questions:

- Does clearing personal memory remove a previously submitted shared insight?
- Can Aim-authored text remain in collective memory after the participant
  clears personal memory?
- Can a participant identify or withdraw a submitted shared echo?
- Does local clearing remove every generated Journey and Direction derivative?
- Does clearing remove or invalidate derived themes?
- Are old prompt inputs retained in provider logs or observability systems?
  **Needs verification**.

### localStorage

The future audit should verify:

- why current thread and history exist both locally and remotely;
- whether generated Journey and Direction outputs need local persistence;
- whether locally derived themes become stale after remote deletion;
- whether shared-insight submission state should survive memory clearing;
- whether old keys can silently reintroduce deleted context.

### Supabase

The future audit should verify:

- actual schema and Row Level Security;
- source-of-truth ownership for each memory category;
- deletion cascades and failure behavior;
- provenance fields for participant-authored versus Aim-authored text;
- consent and withdrawal state for shared insight;
- moderation history and approval metadata;
- retention duration;
- whether service-role reads are appropriately bounded.

### Journey continuity

Continuity is useful only if it does not harden earlier AI interpretations into
facts.

The Memory Audit should determine:

- how many earlier notices are used;
- whether notices should quote supporting participant material;
- whether a later notice can correct or release an earlier noticing;
- whether “no longer visible” is preserved as valid continuity;
- whether Aim-generated synthesis should decay or expire.

### Shared echo retention

Shared echo is the highest-priority bridge between prompt and memory audits.

The Memory Audit should document:

- submission source;
- author type;
- participant consent;
- approval criteria;
- moderator identity or role;
- retention;
- withdrawal;
- deletion;
- prompt reuse;
- isolation from instructions contained in stored text.

Until these boundaries are verified, collective memory should be treated as
helpful but potentially high-impact context rather than neutral background.
