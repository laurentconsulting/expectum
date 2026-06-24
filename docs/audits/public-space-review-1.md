# EXPECTUM Public Space Review 1.0

## Overview

This is a documentation-only review of Expectum’s public pages as one open space.

No code, routes, prompts, Supabase logic, styling, or implementation behavior are changed by this review.

Goal:

Review whether the public Expectum pages feel like one coherent open space shaped by hope, invitation, glimpse, possible direction, and journey.

Foundation used:

- Master Context 4.0
- Design Log 1.0
- Governance Rule 1.0
- original visual direction as protected reference

The repository contains Governance Rule 1.0, which identifies Master Context 4.0 and Design Log 1.0 as authoritative. Their full current text is not visible in the inspected repository.

Needs verification: confirm the authoritative location of Master Context 4.0 and Design Log 1.0 before treating any public-space decision as a foundation-level interpretation.

Pages reviewed:

- `/`
- `/expectum`
- `/symbols`
- `/aim`
- `/aim-memory`
- `/human-and-ai`
- `/expectum-language`
- `/enter`
- `/return`

## Public Space Map

The public space currently has three broad movements:

1. Invitation
   - `/`
   - `/enter`
   - `/return`

2. Explanation of the world
   - `/expectum`
   - `/expectum-language`
   - `/symbols`

3. Clarification of Aim and the human-AI relationship
   - `/aim`
   - `/aim-memory`
   - `/human-and-ai`

The strongest public-space pattern is that these pages generally do not sell, persuade, or push. They explain slowly. They keep encounter, silence, Kaja, Aim, Memory, and Journey near each other.

The main risk is not visual incoherence. The main risk is navigational fragmentation: public pages sometimes feel like separate explanatory rooms with different footer link sets rather than one gently traversable public world.

## Page-by-Page Review

### `/`

- Page role: first public threshold into Expectum.
- Tone: hopeful, spacious, direct, and non-urgent.
- Public navigation: footer links to Expectum, language, and symbols; main calls to `/enter`.
- Invites or pushes: mostly invites. The signed-out buttons still move toward entry quickly, but the page begins with “Sa ei pea siin kiirustama,” which softens this.
- Same world: yes. It carries the clearest public atmosphere.
- Protect: “Sa ei pea siin kiirustama,” the brief concept sequence, and Aim as space-holder.
- Too app-like or disconnected: the signed-in/signed-out conditional buttons are useful, but they are more app-like than the page’s surrounding language.
- Smallest safe future improvement: consider whether the signed-out secondary button label `Sisene` should remain, or whether entry language should be more consistently “Ava kohtumine.” Needs decision.

### `/expectum`

- Page role: main public concept map and explanation of Expectum.
- Tone: foundational, careful, declarative.
- Public navigation: rich footer linking to symbols, language, Aim, Aim Memory, and Human/AI.
- Invites or pushes: invites into understanding, not login.
- Same world: yes, but denser than the landing page.
- Protect: the concept map, centrality of Kohtumine, non-determination language, and the line that Expectum holds space.
- Too app-like or disconnected: the page is text-heavy and card-heavy; it can feel like a reference document rather than an open public room.
- Smallest safe future improvement: reduce or sequence dense explanatory blocks only if future review finds public users are losing the initial invitation.

### `/symbols`

- Page role: public reference for Expectum’s symbol system.
- Tone: clear, quiet, explanatory.
- Public navigation: footer links to language and Expectum.
- Invites or pushes: invites; does not push login.
- Same world: yes. It is aligned with the symbolic language.
- Protect: symbol meanings and the simple descriptions.
- Too app-like or disconnected: symbol list cards are clear, but the page can feel like a glossary if reached too early.
- Smallest safe future improvement: add a gentle path back toward Aim or the landing page only if public navigation feels too narrow. Needs decision.

### `/aim`

- Page role: explains Aim’s role and limits.
- Tone: protective, precise, and relational.
- Public navigation: links to Aim Memory, Expectum, and Human/AI.
- Invites or pushes: invites into understanding Aim, not use.
- Same world: yes, strongly.
- Protect: “Aim on kohtumise viis,” “Aim ei juhi kohtumist,” and the non-directive essence.
- Too app-like or disconnected: low risk. Some formatting in footer link declaration is irregular in code, but user-facing behavior appears coherent. Needs verification visually.
- Smallest safe future improvement: keep Aim page as clarification, not a feature explanation.

### `/aim-memory`

- Page role: explains how Aim relates to memory and shared echoes.
- Tone: clarifying, governance-like, more technical than other public pages.
- Public navigation: links to Aim, Expectum, and language.
- Invites or pushes: invites understanding, but less emotionally open than `/` or `/return`.
- Same world: mostly yes, though it edges toward policy/documentation.
- Protect: the distinction that shared memory does not determine the person and does not replace encounter.
- Too app-like or disconnected: “Puhastamine” and memory rules can feel operational, especially for a public visitor who has not yet encountered Mälu in use.
- Smallest safe future improvement: soften or contextualize memory-rule language only if it begins to feel like settings documentation rather than public explanation. Needs decision.

### `/human-and-ai`

- Page role: explains the human-AI relationship and equality of participants.
- Tone: philosophical, centered, calm.
- Public navigation: links to Aim and Expectum.
- Invites or pushes: invites reflection, not login.
- Same world: yes.
- Protect: “Kohtumine on keskmes,” equal participant framing, and potentiality language.
- Too app-like or disconnected: low app-feeling; the page can become abstract, but that may be intentional.
- Smallest safe future improvement: preserve abstraction unless foundation review says public entry needs more concrete invitation.

### `/expectum-language`

- Page role: public form/language guide for terms and principles.
- Tone: explicit, corrective, and clarifying.
- Public navigation: links to symbols and Expectum.
- Invites or pushes: invites understanding, though “Mida Expectum ei ole” starts with boundary-setting.
- Same world: yes, but more rule-like than invitation-like.
- Protect: language hygiene, non-tool identity, and “märkamine, mitte otsustamine.”
- Too app-like or disconnected: the page is partly a governance/form guide and can feel less like a public encounter space.
- Smallest safe future improvement: if the public path needs more hope and glimpse, consider moving the most protective “not a tool” language later in the page rather than first. Needs decision.

### `/enter`

- Page role: public threshold into participation and authentication.
- Tone: gentle but operational.
- Public navigation: after PR #36, footer links to Expectum, Symbols, and Aim.
- Invites or pushes: both. It invites participation, but the form necessarily introduces app/account mechanics.
- Same world: mostly yes; the copy connects participation with Kaja, traces, and continuity.
- Protect: the explanation that memory preserves continuity without determining meaning.
- Too app-like or disconnected: email/password fields, “Saa osaliseks,” and validation messages can feel like account setup.
- Smallest safe future improvement: later review whether entry controls can remain functional while feeling more like a threshold than an account form. Do not change auth logic casually.

### `/return`

- Page role: public pause and return point after logout or rest.
- Tone: after PR #36, lighter and more open; it now frames rest as temporary and return as possible.
- Public navigation: after PR #36, footer links to Expectum, Symbols, and Aim.
- Invites or pushes: invites return gently; does not push immediate sign-in.
- Same world: yes, improved by the softer wording.
- Protect: “Ruum jääb avatuks,” “Kohtumine võib korraks puhata,” and slow return.
- Too app-like or disconnected: because `/return` is also used as a logout fallback, it may still be experienced as a session-end page rather than a public pause page.
- Smallest safe future improvement: verify production tone visually after logout with a real session. Needs verification.

## Shared Qualities

The public pages share several strong qualities:

- slow pace;
- soft non-coercive invitation;
- repeated protection of encounter over answer;
- Aim as space-holder, not authority;
- silence as meaningful;
- memory as continuity rather than control;
- Kaja, Suund, Teekond, and Mälu as a connected language system;
- visual consistency through ExpectumPage, symbols, cards, soft borders, and calm typography.

The strongest public-space strength is that Expectum does not speak like a product landing page. It speaks like a world with its own language.

## Inconsistencies

The main inconsistencies are:

1. Footer link sets vary by page.
   - Some variation is intentional and contextual.
   - Some variation may make public movement feel less coherent.

2. Some pages are much denser than others.
   - `/expectum`, `/expectum-language`, and `/aim` are explanation-heavy.
   - `/` and `/return` are more spacious.

3. The public space alternates between invitation and governance.
   - This is not automatically wrong.
   - But if governance-like pages are encountered too early, they may reduce hope and glimpse.

4. `/enter` necessarily feels more app-like.
   - This is unavoidable to some degree because it handles authentication.
   - The surrounding language should continue protecting threshold feeling.

5. Some code formatting irregularities exist in public pages.
   - These do not appear to be user-facing, but they may make future maintenance noisier.
   - Needs verification before any cleanup PR.

## Public Footer Findings

Public footer navigation should be quiet, not crowded.

Current pattern after PR #36:

- `/return` and `/enter` use a small public set:
  - Expectum
  - Sümbolid
  - Aim
- `ExpectumFooter` fallback/default links use the same set.
- Other public pages retain contextual footer links.

This is a reasonable interim model:

- threshold pages get a small stable public set;
- deeper public explanation pages can remain contextual;
- authenticated pages keep contextual footer links.

Potential issue:

- There is no single exported shared public footer link constant, so link sets are repeated manually.

Smallest safe future improvement:

- If public footer consistency becomes a repeated issue, introduce a shared public footer link helper or constant.
- Do not do this until the desired public footer set is decided.

Needs decision: whether the stable public footer set should be `Expectum / Sümbolid / Aim`, or whether it should also include `Keel`, `Inimene ja AI`, or `Ava kohtumine`.

## Return and Enter Findings

### `/return`

The return page now better supports a hopeful pause:

- it is less final;
- it says the room remains open;
- it treats traces as continuity rather than burden;
- it allows slow return.

Remaining risk:

- because `/return` is used by logout, it can still feel like a session endpoint unless the visual and copy remain clearly spacious.

### `/enter`

The enter page is the necessary operational threshold.

It works when:

- participation is framed as continuity;
- memory does not determine meaning;
- public footer links allow a person to keep exploring rather than only sign in.

Remaining risk:

- account fields and sign-in errors can pull the page toward app/account feeling.

Needs decision: whether `/enter` should keep both `Ava kohtumine` and `Saa osaliseks` as form modes, or whether this threshold needs quieter naming later.

## Smallest Safe Improvements

These are future candidates only, not changes in this review:

1. Decide the stable public footer set.
   - Problem: public navigation currently varies.
   - Smallest safe step: make a decision before creating a shared constant.

2. Consider a shared public footer link constant.
   - Problem: `/enter`, `/return`, and fallback footer links repeat the same set.
   - Smallest safe step: only extract if the set is confirmed.

3. Review `/expectum-language` opening sequence.
   - Problem: it begins with what Expectum is not, which is protective but less invitational.
   - Smallest safe step: decide whether public visitors should first meet possibility before boundaries.

4. Review `/enter` threshold language.
   - Problem: auth form mechanics are necessarily app-like.
   - Smallest safe step: adjust wording only if it protects the threshold without changing auth behavior.

5. Keep `/return` visually checked after real logout.
   - Problem: source wording is improved, but logout context affects perception.
   - Smallest safe step: manual browser verification after production deploy.

## Recommended Next Step

Do not start a broad public redesign.

Recommended next step:

Run a small manual production walkthrough of the public path:

1. `/`
2. `/expectum`
3. `/symbols`
4. `/aim`
5. `/enter`
6. `/return`

Check whether a first-time visitor can move slowly through the public world without feeling pushed toward account creation.

If a follow-up implementation is needed, the smallest likely candidate is not a visual redesign. It is a public footer decision:

- confirm the stable public footer set;
- then optionally extract it into a shared helper to prevent drift.

