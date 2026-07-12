# EXPECTUM Consolidation Plan 1.0

## Executive Summary

This plan converts the findings of Expectum Architecture 1.0, Prompt Audit 1.0, Memory Audit 1.0, and Noise Reduction Audit 1.0 into an implementation sequence.

The recommended direction is consolidation before expansion:

1. make memory provenance and reuse explicit;
2. prevent cumulative records and repeated synthesis from silently amplifying themselves;
3. preserve one stable Aim essence while allowing meeting-specific expression;
4. reduce duplicated routes, summaries, and equal-weight choices;
5. keep orientation pages quiet rather than turning them into additional dashboards.

The plan does not assume that memory should be erased. It distinguishes a trace remaining in the journey from that trace remaining active in future AI context. Human-originated text, Aim-originated reflection, shared meeting threads, and later synthesis should remain distinguishable for clarity and noise control without ranking one participant above the other.

Implementation should proceed through small, reversible pull requests. Product decisions should be documented before storage, prompt, or route behavior is changed.

Priority meanings:

- **Critical** — unresolved behavior can distort future meetings, weaken provenance, or amplify derived material as if it were new evidence.
- **Important** — materially improves clarity, agency, maintainability, or navigational coherence after the critical safeguards are established.
- **Optional** — useful reduction that can wait without increasing immediate systemic risk.
- **Future** — requires evidence, scale, or product decisions not yet available.

## Critical Issues

### Critical 1 — Define memory provenance and active-use rules

- **Problem:** Stored material can include participant text, Aim reflection, shared meeting threads, and later synthesis, but those roles are not represented consistently when material is retrieved or reused.
- **Why it matters:** Without provenance, repeated synthesis may look like independent evidence. A retained trace may also continue influencing future AI responses even when the participant no longer wants it to remain active.
- **Smallest safe implementation:** Write and approve a memory decision record defining provenance categories, which categories may enter each AI route, and the distinction between retention, display, active AI use, archive, and collective withdrawal. Do not change schema until this decision is approved.
- **Expected benefit:** Creates a stable basis for later memory controls, retrieval filters, prompt context, and user-facing language.
- **Implementation risk:** **Low** for the decision record; **high** if schema or deletion behavior is changed before the model is agreed.

### Critical 2 — Stop cumulative meeting snapshots from becoming repeated evidence

- **Problem:** Successive meeting records can contain cumulative thread snapshots. Later retrieval may therefore send the same human and Aim contributions to synthesis more than once.
- **Why it matters:** Repetition can increase token use, blur chronology, and make earlier wording appear more significant merely because it is duplicated.
- **Smallest safe implementation:** Add a read-only evidence check and tests that measure duplicate message identifiers or repeated normalized text in Journey input. Then choose one storage granularity: append-only message records or one authoritative session snapshot. **Needs decision** before persistence changes.
- **Expected benefit:** Cleaner continuity, lower context volume, and less risk of unmarked amplification.
- **Implementation risk:** **High** because changing storage granularity can affect history, Journey generation, and existing records. Measurement and tests should precede migration.

### Critical 3 — Bound and label collective context used by Aim

- **Problem:** Stored collective text can return inside AI context and may pass through repeated Aim-to-collective-to-Aim loops.
- **Why it matters:** Collective material can become overly authoritative, lose source boundaries, or influence an individual meeting beyond what the route requires.
- **Smallest safe implementation:** Define route-specific collective-context policy. For each AI route, specify whether collective context is necessary, how much may be included, how it is labelled as fallible prior material, and when it must be omitted. Apply the policy first to the highest-context synthesis route.
- **Expected benefit:** Preserves collective echo without allowing it to become hidden instruction or accumulated authority.
- **Implementation risk:** **Medium** because reducing context can change response character. Use fixture-based comparisons before rollout.

### Critical 4 — Establish one invariant Aim essence contract

- **Problem:** Aim’s non-coaching, non-therapeutic, non-diagnostic, non-authoritative essence is partly centralized and partly repeated or implied across route prompts.
- **Why it matters:** Route-specific wording can drift toward hidden inference, direction, judgment, or forced synthesis even when the intended meeting expression is appropriate.
- **Smallest safe implementation:** Define one compact invariant essence block in the existing voice layer and review every OpenAI route against it. Preserve route-specific expressions separately: reflection, exploration, expansion, continuity, movement, and collective echo.
- **Expected benefit:** More consistent boundaries with less duplicated prompt wording and easier future review.
- **Implementation risk:** **Medium** because even small system-prompt changes can alter outputs. Change one route family at a time and compare representative cases.

### Critical 5 — Permit insufficient-evidence outcomes in synthesis

- **Problem:** Journey, trajectory, expansion, or collective synthesis may be pushed toward structured conclusions when available evidence is thin.
- **Why it matters:** Forced structure can manufacture coherence, turn possibility into apparent direction, and strengthen later feedback loops.
- **Smallest safe implementation:** Add an explicit permission to return “not enough has become visible yet” or an equivalent quiet outcome. Avoid requiring every output section when evidence does not support it.
- **Expected benefit:** Less over-synthesis, greater fidelity to the meeting, and fewer low-signal summaries stored as durable memory.
- **Implementation risk:** **Low to medium**; downstream UI may currently expect populated sections and must be verified before prompt changes.

## Important Improvements

### Important 1 — Define one source of truth for each memory category

- **Problem:** Local browser state and Supabase records can represent overlapping direction, reflection, journey, or display state without a clearly documented authority.
- **Why it matters:** Divergence creates stale mirrors, inconsistent clearing behavior, and uncertainty about what future Aim responses actually use.
- **Smallest safe implementation:** Create a source-of-truth matrix for every active localStorage key and Supabase-backed category. Mark each as authoritative, cache, draft, migration residue, or display preference.
- **Expected benefit:** Makes later cleanup safe and prevents new duplicate persistence.
- **Implementation risk:** **Low** for classification; **medium** when retiring or migrating existing keys.

### Important 2 — Separate retaining a trace from using it actively

- **Problem:** “Puhasta mälu” can imply full deletion even though Expectum may need to preserve traces while releasing them from active use.
- **Why it matters:** The current concept may not match the product’s view of meeting and journey, and it does not express archive, hide, inactive context, or collective withdrawal.
- **Smallest safe implementation:** Decide the long-term control vocabulary and state model before changing the button. Evaluate: reduce active memory, release from AI context, hide from the current journey, archive, and withdraw from shared space.
- **Expected benefit:** More honest user agency without treating memory preservation and privacy control as opposites.
- **Implementation risk:** **Medium to high** because UI language, API behavior, storage, and collective ownership may all be affected. **Needs decision.**

### Important 3 — Reconcile echo deletion and collective withdrawal

- **Problem:** Individual memory controls and collective/shared records may not have equivalent withdrawal semantics.
- **Why it matters:** A participant may believe a trace is no longer active while a shared derivative remains available or continues influencing collective context.
- **Smallest safe implementation:** Document and then implement one explicit withdrawal path for participant-linked shared material, including what can be removed, anonymized, retained, or excluded from future synthesis.
- **Expected benefit:** Stronger agency and clearer boundaries between personal memory and collective echo.
- **Implementation risk:** **High** due to ownership, policy, and possible multi-participant effects. Supabase policies and product meaning require verification before code changes.

### Important 4 — Bound Journey retrieval and avoid unchanged persistence

- **Problem:** Journey synthesis can grow with the full meeting history and may persist a new summary even when little has changed.
- **Why it matters:** Context and stored summaries can grow faster than meaningful new evidence.
- **Smallest safe implementation:** Add deterministic retrieval limits based on recency and distinct evidence, then add an “insufficient meaningful change” check before saving a new Journey summary.
- **Expected benefit:** Lower context noise, fewer near-duplicate summaries, and more meaningful journey continuity.
- **Implementation risk:** **Medium** because retrieval reduction may omit useful older traces. Preserve explicit access to older material outside the default synthesis window.

### Important 5 — Clarify the roles of Memory, Path, Journey, Theme, and Direction

- **Problem:** Several routes describe overlapping views of continuity and can appear as equal destinations without a clear hierarchy.
- **Why it matters:** Participants face too many choices and may not know whether they are viewing stored traces, synthesis, movement, themes, or orientation.
- **Smallest safe implementation:** Approve a one-sentence responsibility for each concept and use it to revise existing labels and grouping. Do not create new pages.
- **Expected benefit:** A simpler mental model and a basis for later page merging.
- **Implementation risk:** **Low**, provided this begins as content and navigation clarification rather than route removal.

### Important 6 — Consolidate collective display around `/collective-echo`

- **Problem:** `/shared-insights` and `/collective-echo` overlap as surfaces for collective material.
- **Why it matters:** Duplicate display routes weaken the meaning of Collective Echo and create parallel maintenance paths.
- **Smallest safe implementation:** Decide `/collective-echo` as the primary destination, move any unique useful display responsibility into it, and only then redirect or retire `/shared-insights`.
- **Expected benefit:** One understandable collective surface and less duplicate UI.
- **Implementation risk:** **Medium** because hidden links, admin use, or distinct data semantics may remain. **Needs verification** before redirecting.

### Important 7 — Resolve the two highest-confidence legacy routes

- **Problem:** `/movement-map` and `/theme-evolution` overlap with current Path/Journey and Theme responsibilities and are not part of the visible navigation.
- **Why it matters:** Legacy pages expand the route surface, preserve old design assumptions, and make architectural ownership less clear.
- **Smallest safe implementation:** Verify there are no external dependencies or unique data operations, then replace each with a redirect to the approved current destination in separate small changes.
- **Expected benefit:** Less route noise without losing reachable content.
- **Implementation risk:** **Low to medium**; external bookmarks and any unique page behavior must be checked first.

### Important 8 — Reduce the settings destination list into clear groups

- **Problem:** The Memory/settings page presents many equal-weight destinations.
- **Why it matters:** A control and orientation page can begin to feel like a dashboard, increasing choice rather than clarity.
- **Smallest safe implementation:** Group existing destinations by purpose and reduce explanatory repetition. Keep `/profile` absent unless a distinct quiet role is approved.
- **Expected benefit:** Faster orientation with no new functionality.
- **Implementation risk:** **Low** if routes and behavior remain unchanged.

### Important 9 — Preserve output provenance in displays

- **Problem:** Later summaries can be displayed without enough indication of whether they are participant text, Aim reflection, a shared thread, or later synthesis.
- **Why it matters:** Participants need to understand what they are seeing and repeated Aim language should not silently become stronger evidence.
- **Smallest safe implementation:** Define a small presentation vocabulary for origin and synthesis stage, then apply it first to Journey and collective displays.
- **Expected benefit:** Better interpretability without ranking human and Aim contributions.
- **Implementation risk:** **Medium** because labels can add visual noise. Use quiet metadata and test for clarity.

### Important 10 — Add fixture-based prompt and memory regression checks

- **Problem:** Prompt and retrieval changes can alter Aim’s role or context composition without obvious compile-time failures.
- **Why it matters:** Consolidation work touches subtle product behavior that ordinary build checks cannot protect.
- **Smallest safe implementation:** Create a small set of non-sensitive fixtures covering ordinary meeting, thought meeting, expansion, sparse evidence, journey continuity, direction noticing, and collective echo. Assert context composition and required boundaries rather than exact prose.
- **Expected benefit:** Safer incremental prompt and memory changes.
- **Implementation risk:** **Low to medium**; brittle exact-output assertions must be avoided.

## Optional Improvements

### Optional 1 — Merge Statistics into Memory/settings

- **Problem:** `/statistics` adds a standalone dashboard-like destination for derived counts.
- **Why it matters:** Counts can compete with the encounter and duplicate orientation responsibilities.
- **Smallest safe implementation:** Preserve only the few useful counts as a quiet section within `/settings`, then redirect the standalone route after usage and dependencies are verified.
- **Expected benefit:** One less dashboard surface and fewer equal-weight destinations.
- **Implementation risk:** **Low to medium**. **Needs decision** on whether any statistic is genuinely useful.

### Optional 2 — Decide a quiet role for Profile or retire it

- **Problem:** `/profile` is reachable directly but lacks a settled navigational role and risks becoming another comprehensive dashboard.
- **Why it matters:** Expanding it would duplicate Path, Memory, Journey reflections, and Themes.
- **Smallest safe implementation:** Choose between two bounded options: retain it as a sparse orientation page linking to existing destinations, or redirect it to the chosen orientation surface. Do not add feature content.
- **Expected benefit:** Removes ambiguity while respecting the previous decision not to make Profile a major feature.
- **Implementation risk:** **Low** after the product decision; **Needs decision.**

### Optional 3 — Place Timeline under an existing history responsibility

- **Problem:** `/timeline` can duplicate chronological history already implied by Memory and Path.
- **Why it matters:** Another standalone lens increases navigation and maintenance cost.
- **Smallest safe implementation:** Verify its unique value. If it is only a chronological view, expose it as a mode or subsection of the existing history owner and redirect the old route.
- **Expected benefit:** Fewer parallel summary pages.
- **Implementation risk:** **Medium** because combining views may make the receiving page noisy.

### Optional 4 — Consolidate Symbols with Expectum Language

- **Problem:** `/symbols` and `/expectum-language` may explain closely related vocabulary.
- **Why it matters:** Public explanatory pages can repeat meaning and require duplicate editorial upkeep.
- **Smallest safe implementation:** Perform paragraph-level content comparison. Move only unique symbol explanations into the language page if the audiences and purpose are the same.
- **Expected benefit:** A clearer public explanation with less repetition.
- **Implementation risk:** **Low**; **Needs verification** that the two pages do not serve distinct reading flows.

### Optional 5 — Bound long memory displays

- **Problem:** History and summary pages may grow without pagination or quiet disclosure.
- **Why it matters:** Large displays increase visual noise and make recent or relevant traces harder to find.
- **Smallest safe implementation:** Add bounded initial display with explicit “show more” behavior to the most rapidly growing list after measuring real record counts.
- **Expected benefit:** Quieter pages without deleting traces.
- **Implementation risk:** **Low to medium**; hidden older content must remain discoverable.

### Optional 6 — Retire verified orphaned localStorage keys

- **Problem:** Legacy local keys can remain as stale mirrors after responsibility moves to Supabase or another key.
- **Why it matters:** They complicate debugging and can unexpectedly repopulate old state.
- **Smallest safe implementation:** Instrument or inspect each suspected legacy key, document migration behavior, and remove one verified orphan at a time.
- **Expected benefit:** Simpler client state and fewer divergence paths.
- **Implementation risk:** **Medium** because browser-held state is difficult to inventory centrally.

## Future Opportunities

### Future 1 — Memory observability

- **Problem:** The system lacks a simple view of which memory categories are growing, duplicated, retrieved, or entering AI context.
- **Why it matters:** Noise can return gradually even after consolidation.
- **Smallest safe implementation:** Add privacy-preserving operational counts and context-composition diagnostics only after provenance categories are stable.
- **Expected benefit:** Earlier detection of growth and feedback-loop problems.
- **Implementation risk:** **Medium**; observability must not expose meeting content or become another participant dashboard.

### Future 2 — Derived-memory recomputation

- **Problem:** Persisted summaries can become stale when their source traces or participation state changes.
- **Why it matters:** Old synthesis may continue to look current.
- **Smallest safe implementation:** Identify summaries that can be regenerated from authoritative source records and store version/source references before considering recomputation.
- **Expected benefit:** Less stale derived memory and clearer lineage.
- **Implementation risk:** **High** due to model variability, cost, and historical consistency.

### Future 3 — Explicit archive and release controls

- **Problem:** Long-term memory agency may require more than delete/keep.
- **Why it matters:** Expectum’s product direction distinguishes preserving a trace from keeping it active.
- **Smallest safe implementation:** After the memory state model is approved, prototype one control for releasing a trace from future AI context while retaining it in personal history.
- **Expected benefit:** Nuanced agency aligned with the meeting-and-journey model.
- **Implementation risk:** **High** because retrieval, UI, policies, and collective derivatives must agree.

### Future 4 — Context budgeting by meeting type

- **Problem:** Different meeting types may need different amounts and kinds of prior context.
- **Why it matters:** A universal context bundle can add noise or authority where a lighter encounter would be more faithful.
- **Smallest safe implementation:** After route policies and regression fixtures exist, define conservative context budgets for reflection, exploration, expansion, journey, direction, and collective echo.
- **Expected benefit:** More appropriate Aim expression with lower token and synthesis pressure.
- **Implementation risk:** **Medium**; insufficient context could weaken continuity if budgets are set without evidence.

## Memory Roadmap

The roadmap sections sequence recommendations already classified above. They do not introduce separate unclassified features.

### Phase M1 — Decisions and evidence

1. Approve provenance categories.
2. Approve the distinction between retained, visible, archived, active for AI, and shared/collective states.
3. Produce the source-of-truth matrix for localStorage and Supabase.
4. Measure cumulative meeting duplication and Journey context composition.
5. Decide meeting storage granularity.

No destructive migration should occur in this phase.

### Phase M2 — Retrieval safeguards

1. Deduplicate or normalize Journey evidence at retrieval.
2. Bound Journey context by distinct evidence and recency.
3. Label collective context and restrict it by route.
4. Avoid saving unchanged or insufficiently changed summaries.

### Phase M3 — Agency and lifecycle

1. Replace ambiguous clearing semantics only after the state model is approved.
2. Align personal release, shared withdrawal, and collective derivatives.
3. Add quiet provenance indicators to stored and displayed synthesis.
4. Retire verified stale local mirrors one category at a time.

### Phase M4 — Scale controls

1. Add bounded list displays.
2. Add privacy-preserving memory observability.
3. Consider derived-memory recomputation only when source lineage is reliable.

## Prompt Roadmap

### Phase P1 — Contract

1. Centralize the invariant Aim essence.
2. Keep meeting-specific expression separate from the invariant.
3. Remove invitations to infer hidden content.
4. Permit uncertainty and insufficient evidence.

### Phase P2 — Context policy

1. Define allowed memory categories for each AI route.
2. Label prior Aim synthesis and collective material as fallible context.
3. Remove collective context from routes where it does not solve a demonstrated need.
4. Bound context size and repeated material.

### Phase P3 — Validation

1. Add fixture-based checks for essence, expression, sparse evidence, and provenance.
2. Review Journey and trajectory first because they synthesize across time.
3. Review collective echo next because it can amplify shared derivatives.
4. Review ordinary reflection last, preserving its lighter role.

Prompt changes should not be bundled with schema, navigation, or large UI changes.

## Navigation Roadmap

### Phase N1 — Responsibility map

1. Approve one-sentence roles for Memory, Path, Journey, Theme, Direction, Timeline, Profile, Statistics, and Collective Echo.
2. Identify the primary route for each responsibility.
3. Verify external and internal dependencies before any redirect.

### Phase N2 — High-confidence reduction

1. Redirect `/movement-map` to the approved current Path/Journey destination.
2. Redirect `/theme-evolution` to the approved Themes destination.
3. Consolidate `/shared-insights` into `/collective-echo`.

Each route change should be its own small PR or a tightly related redirect pair.

### Phase N3 — Conditional consolidation

1. Decide whether Statistics belongs inside `/settings`.
2. Decide whether Profile remains a quiet orientation page or redirects.
3. Decide whether Timeline is a distinct lens or belongs under History/Path.
4. Compare Symbols and Expectum Language before merging explanatory content.

### Navigation guardrail

Do not create a new route to solve a responsibility that an existing route can absorb. Do not expose every valid route as an equal navigation choice.

## UI / Design Roadmap

### UI 1 — Reduce equal-weight choices

- **Classification:** Important.
- **Problem:** Orientation pages can present too many destinations with similar visual weight.
- **Why it matters:** Choice density turns quiet orientation into dashboard behavior.
- **Smallest safe implementation:** Group existing actions by purpose and establish one primary next step per page where appropriate.
- **Expected benefit:** Clearer movement without removing access.
- **Implementation risk:** **Low**.

### UI 2 — Use quiet provenance indicators

- **Classification:** Important.
- **Problem:** Origin and synthesis stage are not always visible.
- **Why it matters:** Unmarked AI or collective derivatives can be mistaken for direct meeting evidence.
- **Smallest safe implementation:** Introduce restrained labels or metadata in Journey and collective displays, avoiding badges or controls that dominate the page.
- **Expected benefit:** Greater clarity with minimal visual expansion.
- **Implementation risk:** **Medium** because metadata can itself become noise.

### UI 3 — Keep orientation pages sparse

- **Classification:** Important.
- **Problem:** Path, Profile, Settings, Timeline, and Statistics can accumulate overlapping summaries.
- **Why it matters:** Multiple dashboards move attention away from encounter and reflection.
- **Smallest safe implementation:** Give each retained orientation page one clear question and link outward to existing detail owners rather than duplicating their content.
- **Expected benefit:** Reduced repetition and stronger page identity.
- **Implementation risk:** **Low to medium**.

### UI 4 — Reveal depth progressively

- **Classification:** Optional.
- **Problem:** Long memory and history views can overwhelm the first screen.
- **Why it matters:** Preserving traces does not require showing all traces at once.
- **Smallest safe implementation:** Show a bounded meaningful subset with explicit access to older material.
- **Expected benefit:** Quieter reading while retaining continuity.
- **Implementation risk:** **Low** if older material remains reachable.

## Technical Debt Roadmap

### Debt 1 — Prompt duplication

- **Classification:** Critical.
- **Problem:** Aim identity and safety clauses are repeated across route implementations.
- **Why it matters:** Repetition allows semantic drift.
- **Smallest safe implementation:** Centralize only invariant clauses; keep route expressions local and explicit.
- **Expected benefit:** Easier audits and consistent boundaries.
- **Implementation risk:** **Medium** because centralization can accidentally flatten meeting-specific expression.

### Debt 2 — Mixed memory authorities

- **Classification:** Important.
- **Problem:** Browser and Supabase state can overlap without explicit ownership.
- **Why it matters:** Bugs become difficult to reproduce and clearing behavior becomes ambiguous.
- **Smallest safe implementation:** Add typed ownership documentation near storage helpers after the source-of-truth matrix is approved.
- **Expected benefit:** Safer maintenance and migration.
- **Implementation risk:** **Low** for documentation and types; **medium** for behavioral changes.

### Debt 3 — Unbounded retrieval and display

- **Classification:** Important.
- **Problem:** Some historical retrieval and presentation paths can grow with the entire record set.
- **Why it matters:** Performance, context quality, and readability degrade together.
- **Smallest safe implementation:** Measure current volumes, then add route-specific bounds and pagination without deleting records.
- **Expected benefit:** Predictable performance and less noise.
- **Implementation risk:** **Medium** because bounds can hide relevant context if chosen arbitrarily.

### Debt 4 — Legacy route ownership

- **Classification:** Important.
- **Problem:** Hidden legacy routes remain part of the deployed surface without active component ownership.
- **Why it matters:** They preserve old assumptions and increase audit scope.
- **Smallest safe implementation:** Add explicit redirect tests and remove page implementations only after dependency verification.
- **Expected benefit:** Smaller maintained surface.
- **Implementation risk:** **Low to medium**.

### Debt 5 — Derived data lineage

- **Classification:** Future.
- **Problem:** Journey, trajectory, and collective synthesis do not yet have a fully explicit lineage model.
- **Why it matters:** Stale or repeated synthesis is difficult to identify and safely withdraw.
- **Smallest safe implementation:** Define source references and synthesis versions before introducing recomputation or complex lifecycle controls.
- **Expected benefit:** Better provenance and future migration safety.
- **Implementation risk:** **High** if schema changes are attempted prematurely.

## Recommended Order Of Execution

### 1. Approve product decisions before behavioral code

Produce and approve two short decision records:

1. memory provenance, lifecycle, active-use, and collective-withdrawal model;
2. route responsibility and consolidation map.

These decisions unblock every later phase and prevent incompatible fixes.

### 2. Add measurement and regression protection

Before changing storage or prompts:

1. measure duplicate meeting material entering Journey;
2. record context composition by category without exposing content;
3. add non-sensitive prompt and retrieval fixtures;
4. verify downstream UI expectations for sparse outputs.

### 3. Apply critical prompt-context safeguards

In separate small PRs:

1. centralize Aim’s invariant essence;
2. permit insufficient-evidence outcomes;
3. remove hidden-inference wording;
4. label and bound collective context;
5. reduce collective context route by route.

### 4. Stabilize memory retrieval before changing persistence

First deduplicate and bound what is read. Only after the meeting storage decision is approved should writes, schema, or migration behavior change.

### 5. Clarify user-facing memory agency

Implement the chosen distinction between retention and active use. Align personal controls with shared and collective consequences. Avoid presenting full deletion as the only meaningful control unless that is the explicit product decision.

### 6. Perform high-confidence route consolidation

After dependency checks:

1. redirect `/movement-map`;
2. redirect `/theme-evolution`;
3. consolidate `/shared-insights` into `/collective-echo`.

Do not combine these changes with prompt or memory work.

### 7. Reduce orientation and dashboard noise

Clarify and group Settings choices. Then decide, in order:

1. Statistics;
2. Profile;
3. Timeline;
4. Symbols and Expectum Language.

Prefer absorption into an existing page over a new destination.

### 8. Add scale controls only where evidence requires them

Use actual growth and usage data to introduce pagination, bounded displays, observability, or derived-memory recomputation. Do not add infrastructure solely because it may become useful later.

### Execution guardrails

- One behavioral concern per pull request.
- No combined prompt, schema, navigation, and design refactor.
- Preserve existing traces during early consolidation.
- Make provenance clearer without ranking human and Aim contributions.
- Treat repeated synthesis as context, not stronger evidence.
- Keep Aim a space-holder rather than coach, therapist, mentor, judge, or authority.
- Prefer removal, grouping, redirect, or quieter presentation over new features.
- Mark unresolved product choices **Needs decision** and uncertain technical assumptions **Needs verification**.
