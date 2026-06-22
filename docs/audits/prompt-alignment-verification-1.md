# EXPECTUM Prompt Alignment Verification 1.0

## Overview

This is a documentation-only verification audit. It does not change prompts,
application code, routes, Supabase logic, styling, deployment settings, models,
or features.

The purpose is not to improve prompts. The purpose is to verify whether current
differences between Aim prompt behaviors are:

- intentional and foundation-aligned variation; or
- genuine foundation conflicts.

The governing principle is:

> Aim essence remains constant. Aim expression may vary by meeting type.

This audit does not assume that alignment means identical wording. Expectum is
not building a mechanically uniform assistant voice. Expectum is protecting a
space for encounter, and Aim may have different modes of presence depending on
the meeting type.

### Audited files

- `lib/expectumVoice.ts`
- `lib/collectiveAimMemory.ts`
- `lib/collectiveEchoThemes.ts`
- `app/api/attunement-question/route.ts`
- `app/api/reflect/route.ts`
- `app/api/journey/route.ts`
- `app/api/trajectory/route.ts`
- `app/api/collective-echo/route.ts`
- `app/api/shared-insights/route.ts`
- `app/api/admin/shared-insights/route.ts`

Repository search found four API routes that instantiate the OpenAI client:

- `/api/attunement-question`
- `/api/reflect`
- `/api/journey`
- `/api/trajectory`

`/api/collective-echo`, `/api/shared-insights`, and
`/api/admin/shared-insights` do not call OpenAI directly. They are included
because collective echo material can later enter the prompt context through
`getCollectiveAimMemory()`.

No secret values were found or included.

## Foundation Review

The authoritative foundation documents for this verification are:

- Master Context 4.0
- Design Log 1.0
- System Audit 1.0
- Governance Rule 1.0

`docs/governance/governance-rule-1.md` is present in the repository and was
reviewed. It states that future audits, refactors, prompt work, memory work,
design work, and feature work must remain aligned with the foundation
documents.

The repository does not currently contain visible files named Master Context
4.0, Design Log 1.0, or System Audit 1.0.

**Needs verification:** where the authoritative copies of Master Context 4.0,
Design Log 1.0, and System Audit 1.0 are kept and how future audits should
quote or reference them.

Prompt Audit 1.0 was inspected from the existing prompt-audit branch, but it is
not present on `main` at the time of this verification.

**Needs verification:** whether Prompt Audit 1.0 should be merged, superseded,
or treated as advisory context only.

## Protected Aim Variation Principle

The following are protected as legitimate differences unless they clearly
contradict the foundation:

- ordinary meeting may reflect simply and directly;
- thought meeting may stay closer to thought-language, rhythm, abstraction,
  interruption, and formation;
- avardamine may open perspectives, tension, possibility, paradox, and
  co-thinking;
- attunement may offer one quiet question when a question serves the encounter;
- journey noticing may look across meetings for continuity, recurrence, change,
  and absence;
- direction noticing may notice possible movement without becoming prediction,
  advice, destination, or plan;
- collective echo may show recurrence without turning recurrence into truth,
  authority, diagnosis, or social norm.

These differences should not be flattened into one universal assistant voice.

Only mark a prompt as a real conflict when it clearly makes Aim:

- a coach;
- a therapist;
- a mentor;
- an expert;
- an authority;
- a judge;
- a diagnostic system;
- the center of the encounter;
- the system that decides meaning for the human.

## Route-by-Route Verification

### `lib/expectumVoice.ts`

1. **Current Aim role:** shared voice and posture governor. It favors simple
   Estonian, calm rhythm, clarity, silence, and noticing before interpretation.
2. **Meeting type:** invariant cross-route voice layer.
3. **Variation intentional?** Not applicable. This file should remain common.
4. **Foundation preserved?** Yes, from repository-visible material. Aim is not
   centered and does not present the human.
5. **Prompt Audit 1.0 concern still valid?** Yes. The concern that the shared
   voice layer is not a complete Aim essence contract remains valid.
6. **Classification:** needs decision. This is not a direct conflict, but it is
   a drift risk because route-specific prompts carry many identity boundaries.
7. **Future wording change recommended?** Possibly. A small shared invariant
   essence block may be useful, but only after checking the foundation
   documents that are not visible in the repository.

### `/api/attunement-question`

1. **Current Aim role:** quiet threshold keeper that may open one question from
   recent meetings, saved echoes, journey noticing, and collective background.
2. **Meeting type:** attunement / quiet question.
3. **Variation intentional?** Yes. The route is intentionally question-shaped.
4. **Foundation preserved?** Yes. The prompt says the question is not a test,
   task, therapeutic exercise, or goal direction. It rejects diagnosis,
   teaching, and deciding for the human.
5. **Prompt Audit 1.0 concern still valid?** Partly. The fixed fallback question
   remains a product-contract question, not a proven foundation conflict.
6. **Classification:** acceptable variation; needs decision about whether the
   product should ever return no question.
7. **Future wording change recommended?** Not before a product decision. If the
   foundation allows silence as the whole response, the API contract may need a
   separate review.

### `/api/reflect` — shared reflection prompt

1. **Current Aim role:** participant in the active encounter that notices,
   reflects, or explores according to the selected mode.
2. **Meeting type:** ordinary meeting, thought meeting, or avardamine.
3. **Variation intentional?** Yes. The route has explicit mode-specific
   instructions.
4. **Foundation preserved?** Mostly yes. The prompt repeatedly says Aim does
   not determine direction, meaning, result, or decisions for the human. It
   rejects diagnosis, ready solutions, and claims beyond the supplied text.
5. **Prompt Audit 1.0 concern still valid?** Yes. The phrase about noticing
   what remains unexpressed can still invite hidden-content inference.
6. **Classification:** needs decision / future alignment candidate. It is not
   confirmed as an actual conflict because nearby safeguards restrict Aim to
   the text, but the wording is a meaningful risk.
7. **Future wording change recommended?** Yes, if foundation review confirms
   that Aim should name only observable text, gaps, absences, rhythm, and
   movement rather than unexpressed inner content.

### `/api/reflect` — ordinary meeting

1. **Current Aim role:** calm reflector that begins clearly and deepens only
   when the material supports it.
2. **Meeting type:** ordinary meeting.
3. **Variation intentional?** Yes.
4. **Foundation preserved?** Yes.
5. **Prompt Audit 1.0 concern still valid?** The shared hidden-inference concern
   applies, but the ordinary-meeting variation itself is aligned.
6. **Classification:** acceptable variation.
7. **Future wording change recommended?** No mode-specific change is
   recommended from this verification.

### `/api/reflect` — thought meeting

1. **Current Aim role:** thought companion that stays closer to the human's
   thought-language, rhythm, interruption, and formation.
2. **Meeting type:** thought meeting.
3. **Variation intentional?** Yes.
4. **Foundation preserved?** Mostly yes. This variation preserves encounter by
   not forcing all thought into ordinary explanatory language.
5. **Prompt Audit 1.0 concern still valid?** Yes, but softened. The wording
   around a “small new understanding” may invite Aim to provide understanding
   rather than make thought movement visible.
6. **Classification:** protected intentional difference with a future alignment
   candidate.
7. **Future wording change recommended?** Possibly. If changed, preserve the
   thought-meeting difference and avoid flattening it into ordinary reflection.

### `/api/reflect` — avardamine

1. **Current Aim role:** co-explorer that can move with thought, open
   perspectives, notice tension, possibility, lightness, and paradox.
2. **Meeting type:** avardamine / expansion.
3. **Variation intentional?** Yes.
4. **Foundation preserved?** Mostly yes. The prompt says Aim does not teach,
   lead, or argue to win.
5. **Prompt Audit 1.0 concern still valid?** Yes. The lines allowing Aim to
   agree or not fully agree can make Aim's position too central if generated
   poorly.
6. **Classification:** protected intentional difference with a needs-decision
   boundary. Difference, tension, and challenge are legitimate; Aim's agreement
   becoming evaluative would be a conflict.
7. **Future wording change recommended?** Possibly. Keep avardamine alive, but
   consider wording that opens another view without making Aim the judge of the
   human's view.

### `/api/journey`

1. **Current Aim role:** continuity noticer across separate encounters, saved
   echoes, session groupings, and previous journey notices.
2. **Meeting type:** journey noticing.
3. **Variation intentional?** Yes.
4. **Foundation preserved?** Mostly yes. The prompt rejects analysis of the
   person, teaching, declaring, deciding for the human, and assigning meaning,
   direction, or result.
5. **Prompt Audit 1.0 concern still valid?** Yes. The five-part structure can
   create pressure to synthesize themes, change, echo, or question when
   evidence is thin.
6. **Classification:** acceptable variation with a needs-decision boundary.
   Journey noticing itself is aligned. Forced synthesis would be the risk.
7. **Future wording change recommended?** Possibly. The smallest future change
   would allow any section to say there is not enough visible evidence, without
   removing the journey-noticing form.

### `/api/trajectory`

1. **Current Aim role:** possible-direction noticer across recent meetings,
   saved echoes, journey notices, and derived themes.
2. **Meeting type:** direction noticing.
3. **Variation intentional?** Yes.
4. **Foundation preserved?** Mostly yes. The prompt explicitly says direction
   is not prediction, destination, instruction, advice, or action plan.
5. **Prompt Audit 1.0 concern still valid?** Yes. Direction noticing remains the
   highest-risk variation because naming direction can be received as guidance.
6. **Classification:** acceptable variation with high-risk needs-decision
   boundary. It is not an actual conflict while it remains tentative and
   evidence-bound. It would become a conflict if Aim must always find a
   direction or if the direction becomes advice.
7. **Future wording change recommended?** Possibly. A future wording pass could
   more explicitly allow “no visible direction yet” and clarify that derived
   theme labels are hints, not evidence.

### `/api/collective-echo`

1. **Current Aim role:** no generative Aim role. The route returns approved
   echoes and recurring words from deterministic logic.
2. **Meeting type:** collective echo.
3. **Variation intentional?** Yes. Non-generation is an intentional, quiet form.
4. **Foundation preserved?** Yes. The route does not interpret the collective
   for the human.
5. **Prompt Audit 1.0 concern still valid?** Indirectly. The route itself is not
   the risk; later reuse of approved collective material in Aim prompts remains
   a context-authority and provenance risk.
6. **Classification:** protected intentional difference.
7. **Future wording change recommended?** Not for this route alone.

### `lib/collectiveAimMemory.ts`

1. **Current Aim role:** formats approved collective echoes and recurring words
   as quiet background for generative Aim routes.
2. **Meeting type:** shared collective context used by multiple meeting types.
3. **Variation intentional?** Yes.
4. **Foundation preserved?** Mostly yes. The text already says collective echo
   is not evidence, generalization, or a basis for defining the human.
5. **Prompt Audit 1.0 concern still valid?** Yes. Stored text is inserted into
   system prompt context, and word recurrence can be overread if not bounded.
6. **Classification:** acceptable variation with a future alignment/security
   candidate. Not an actual conflict because the current wording already
   protects the individual from collective definition.
7. **Future wording change recommended?** Possibly. A future prompt/security
   pass may delimit collective text as context rather than instruction and
   clarify that frequency is not authority, truth, or representativeness.

### `/api/shared-insights` and `/api/admin/shared-insights`

1. **Current Aim role:** no generative Aim role.
2. **Meeting type:** collective echo submission and admin approval flow.
3. **Variation intentional?** Yes.
4. **Foundation preserved?** Needs verification. These routes affect which
   material becomes available as collective memory, but they do not generate
   Aim text.
5. **Prompt Audit 1.0 concern still valid?** Yes for provenance, consent,
   moderation, and reuse boundaries.
6. **Classification:** needs verification for governance and memory policy, not
   a prompt conflict.
7. **Future wording change recommended?** No prompt wording change. Future work
   belongs in memory/governance, provenance, and collective echo policy.

## Acceptable Variations

- Attunement is allowed to be question-shaped.
- Ordinary meeting is allowed to be simple, direct, and reflective.
- Thought meeting is allowed to be more abstract when the human's text carries
  that abstraction.
- Avardamine is allowed to open perspectives, tensions, paradox, and
  co-thinking.
- Journey noticing is allowed to synthesize continuity across encounters.
- Direction noticing is allowed to notice possible movement when it does not
  become advice, prediction, plan, or authority.
- Collective echo is allowed to be non-generative and deterministic.

These are not defects merely because they sound or behave differently.

## Protected Intentional Differences

The strongest protected differences are:

1. **Thought meeting language.** It should not be flattened into ordinary
   explanatory prose.
2. **Avardamine.** It may hold tension and alternative views. The protected
   difference is exploration, not correction.
3. **Attunement.** It may take the form of a quiet question rather than a
   reflection.
4. **Journey noticing.** It may look across time, but must not turn continuity
   into identity.
5. **Direction noticing.** It may name possible movement, but must not become a
   directive path.
6. **Collective echo.** It may show recurrence, but must not make recurrence
   authoritative.

## Actual Conflicts

No prompt was confirmed as a clear foundation conflict from the repository
materials available for this verification.

No audited prompt explicitly instructs Aim to act as a coach, therapist,
mentor, expert, judge, diagnostic system, or central authority over the human.

Several concerns from Prompt Audit 1.0 remain valid as future alignment
candidates, but this verification classifies them as risks or needs-decision
items rather than confirmed conflicts until the unavailable foundation
documents can be inspected.

## Needs Decision

- Whether Prompt Audit 1.0 should be merged, superseded, or treated as advisory
  context only.
- Where Master Context 4.0, Design Log 1.0, and System Audit 1.0 are kept and
  how audits should verify against them.
- Whether `EXPECTUM_VOICE` should contain a short invariant Aim essence block.
- Whether attunement may return no question, or whether the fallback question
  is a deliberate product rule.
- Whether “what remains unexpressed” may refer only to observable textual
  gaps/absence/rhythm, or whether the current phrase is foundation-approved.
- Whether avardamine should allow Aim to agree/disagree, or whether it should
  express tension without centering Aim's position.
- Whether Journey sections may explicitly say insufficient evidence rather than
  always filling the structure.
- Whether Trajectory may return no visible direction and how strongly that
  should be represented in the prompt.
- Whether derived theme labels are prompt evidence or navigation hints.
- Whether collective memory should be included in all generative Aim routes.
- Whether approved collective text needs explicit untrusted-context delimiters
  before entering system prompt content.

## Future Alignment Candidates

These are candidates only. They are not implemented in this audit.

1. Add a minimal shared Aim essence boundary to the common voice layer, if
   foundation review confirms the wording.
2. Narrow hidden-content language so Aim notices observable text, gaps,
   absences, rhythm, and movement rather than implied inner states.
3. Preserve avardamine while reducing the importance of Aim's agreement or
   disagreement.
4. Allow Journey and Trajectory sections to say there is insufficient visible
   evidence.
5. Clarify that derived themes and collective recurrence are context, not
   authority.
6. Delimit collective text as contextual material, not instructions to follow.

Future alignment work should remain small. It should not rewrite all prompt
voices into one style.

## Recommended Next Step

Before applying prompt changes, make the foundation documents available in a
reviewable location or record how they should be referenced.

Then choose one small implementation candidate, preferably the least
controversial shared boundary:

- either add a minimal invariant Aim essence block; or
- clarify collective context as non-authoritative contextual material.

Do not combine all prompt concerns into one broad rewrite. Preserve meaningful
differences between meeting types unless a difference clearly contradicts the
foundation.
