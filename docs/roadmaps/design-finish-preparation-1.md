# EXPECTUM DESIGN FINISH PREPARATION 1.0

## What Has Been Completed

Expectum has completed the main clarification work needed before a final Design Finish Pass can begin:

- The foundation and governance layer is now explicit through Architecture Documentation 1.0, Governance Rule 1.0, the Design System Audit, Public Space Review, Encounter Integrity Review, and related roadmap documents.
- The centralized page frame has been restored around `ExpectumPage`, `ExpectumHeader`, and `ExpectumFooter`.
- Footer behavior, public footer tone, and `/return` tone have been brought closer to the public Expectum space.
- `/reflection` has been restored away from an inner-scroll, dashboard-like container and back toward one continuous encounter flow.
- The first memory refactor work has reduced duplicated memory at read time across History, Path, Statistics, Journey, Journey Reflections, and Timeline.
- Symbol usage has been consolidated around `ExpectumSymbol` without changing symbol meanings.
- Early card and section consistency work has begun, including Settings / Mälu link-card alignment.

This means the Design Finish Pass no longer needs to invent the system. It should finish, reduce, and align what already exists.

## What Is Stable

The following areas should be treated as stable unless a clear foundation conflict is found:

- The original visual direction: hope, invitation, glimpse, possible direction, and journey.
- The central role of `Kohtumine`.
- Aim as a space-holder and participant, not a coach, therapist, mentor, expert, judge, or authority.
- The current color world and quiet visual language.
- The `ExpectumPage` frame model: header, scrollable center, footer.
- The centralized footer and `AuthStatus` dynamic action.
- The symbol system and current meanings.
- The restored `/reflection` encounter direction.
- Read-time memory normalization as a protective layer, not a deletion or migration strategy.

The Design Finish Pass should assume these are foundations to protect, not open questions to redesign.

## Remaining Visual Inconsistencies

Remaining issues are mostly finishing-level inconsistencies, not reasons for a redesign:

- Some page families still use manual cards or manual section treatments where `ExpectumCard` or `ExpectumSection` may eventually fit.
- Empty states are generally quiet, but not yet fully consistent across pages.
- Memory, Path, Statistics, Timeline, and related pages can still lean toward dashboard feeling when many counts or summaries appear together.
- Public pages feel coherent overall, but the public footer set and page-to-page movement still need one final decision.
- Long explanatory public pages may feel dense on smaller screens.
- Legacy or hidden routes remain a design-finish question because they may sit outside the current visual system.

Needs verification: a fresh mobile and desktop screenshot pass should confirm whether these inconsistencies are visible in production after the latest merged changes.

## Remaining Public Space Decisions

The public space is now more coherent, but a few choices remain:

- Needs decision: whether the public footer should use one stable shared link set everywhere or remain partly contextual.
- Needs decision: whether `/expectum-language` should continue opening with boundary language or begin with a more invitational sequence.
- Needs decision: whether `/enter` should remain as direct as it is now, or receive a lighter threshold treatment later.
- Needs decision: whether `/return` should remain only a quiet pause page or also become a gentle orientation point into the public pages.

These are tone and movement decisions. They should not become feature work.

## Remaining Legacy Decisions

Known legacy or hidden areas should be resolved before the final Design Finish Pass closes:

- `/movement-map` remains a likely legacy route candidate.
- `/theme-evolution` remains a likely legacy route candidate.
- `/profile` should remain quiet orientation only if kept visible anywhere.
- Hidden admin routes should remain outside participant-facing design decisions unless explicitly reviewed.

Recommended direction: decide whether legacy pages should be removed, redirected, or left hidden before spending finishing attention on them.

## Symbol Notes

The symbol system is stable and protected.

- Do not change symbol meanings.
- Do not invent new symbols.
- Do not replace the symbol system.
- Keep `ExpectumSymbol` as the source of reusable Expectum concept symbol rendering.
- Public explanatory pages may keep plain prose examples where that helps explanation.
- Any final symbol work should be about consistency of use, not reinterpretation.

The Design Finish Pass should protect visual balance rather than optimize symbols mechanically.

## Typography Notes

Typography already carries much of Expectum’s quietness:

- Large, light headings support spaciousness.
- Uppercase tracked labels support ritual and navigation.
- Body text is generally calm and readable.

Remaining risks:

- Wide letter spacing may become dense on mobile.
- Long public explanation pages may need reduction or sequencing rather than typographic redesign.
- Page-specific labels and empty states may drift in tone.

Do not replace the typography system. If needed, reduce density before changing typographic language.

## Empty State Notes

Empty states should preserve the feeling that absence is allowed.

Remaining work:

- Align empty-state wording across memory and journey pages.
- Avoid turning every empty state into a call to action.
- Preserve quietness when there is no data.
- Make sure empty states do not sound like system status messages.

Smallest safe future step: document one empty-state tone convention before changing many pages.

## Mobile Notes

Mobile remains the area most in need of direct visual verification.

Check:

- Whether the `h-screen` page frame still leaves enough room between header and footer.
- Whether public footer links remain quiet and not crowded.
- Whether `/reflection` retains one continuous encounter flow without an inner scroll feeling.
- Whether `/enter` forms feel like a threshold rather than an app panel.
- Whether long public pages preserve breath and readable rhythm.

Needs verification: complete a production mobile screenshot pass before broad visual finish work.

## Final Design Finish Candidates

The final Design Finish Pass should be small and sequenced. Candidate work:

1. Production screenshot review across core public and authenticated pages.
2. Legacy route decision for `/movement-map` and `/theme-evolution`.
3. Public footer link-set decision.
4. Empty-state tone convention.
5. One page-family card/section consistency pass only where parity is obvious.
6. Mobile density check and minimal spacing reductions only if needed.
7. Final review of `/reflection`, `/enter`, `/return`, `/settings`, `/path`, and `/timeline`.

Avoid broad refactors. Avoid redesign. Avoid adding new pages.

## Recommended Order

1. Run a desktop and mobile visual walkthrough on production.
2. Decide legacy route handling before touching legacy visuals.
3. Decide the public footer model.
4. Write or confirm empty-state tone guidance.
5. Apply one small design consistency pass only if the screenshots show a clear mismatch.
6. Recheck `/reflection` as the protected central encounter page.
7. Close with a final “do not touch” list for protected qualities.

The Design Finish Pass can begin when the remaining decisions are explicit and the screenshot pass confirms that remaining issues are finishing work rather than foundation or encounter issues.
