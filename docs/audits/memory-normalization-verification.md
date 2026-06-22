# EXPECTUM Memory Normalization Post-Merge Verification

## Overview

This documentation-only verification reviews the memory-normalization behavior
present on `main` after:

- PR #19, read-time meeting/thread normalization;
- PR #20, user-facing meeting count normalization;
- merge commit `bb2c4a10c71215151e627153b203b1a0d70075a4`;
- successful Vercel deployment for that merge commit.

The verification is based on the deployed source paths and build/deployment
status. It does not inspect or copy production participant content.

No application code, database schema, stored data, prompts, Supabase policies,
visual design, or deployment settings are changed by this audit.

## Verification Summary

| Area | Result | Notes |
| --- | --- | --- |
| History display | Verified | Cumulative thread snapshots are normalized into distinct session messages at read time |
| Path counts | Verified | User-facing meeting total uses distinct encounter/session identities |
| Statistics counts | Verified | Total and mode-specific meeting counts use distinct encounter/session identities |
| Journey saved metadata | Verified with compatibility note | Raw rows remain in `history_count`; normalized encounters are stored in `sessions_count` |
| Journey Reflections display | Verified | Displays `sessions_count` when available and falls back to historical `history_count` |
| Timeline consistency | Partial | Timeline still maps one item per raw meeting row and can repeat a multi-turn encounter |
| Source record mutation | None found | Normalization helpers return copied read-time projections |
| Data deletion | None introduced | Existing deletion flows are unchanged |
| Count inflation | Reduced | Meeting totals no longer normally count each cumulative row as a separate encounter |
| Raw technical counts | Preserved | Journey retains raw row count in `history_count` |

## History Display

Files:

- `app/history/page.tsx`;
- `lib/expectumMemoryNormalize.ts`.

Observed behavior:

1. History reads the existing `meetings` rows.
2. `normalizeMeetingThreadSnapshots` processes copied rows in chronological
   meeting order.
3. Exact duplicate messages are removed only when role, text, `createdAt`,
   `sessionId`, and mode match.
4. Messages without `createdAt` are preserved rather than deduplicated by
   inference.
5. Messages are grouped by session and normalized again within the assembled
   session.
6. The visible History list and “Ava kohtumine” continuation use the normalized
   session messages.

Result:

- repeated messages from cumulative snapshots are less likely to appear more
  than once in the visible encounter;
- chronological order and available provenance fields are preserved;
- distinct messages with similar text remain separate when their exact identity
  differs;
- the original Supabase rows remain unchanged.

Status: **Verified from code.**

## Path Counts

Files:

- `app/path/page.tsx`;
- `lib/expectumMemoryNormalize.ts`.

Observed behavior:

- Path now selects `id`, `thread`, and mode alongside the existing meeting
  fields;
- `getMeetingCountSummary` derives distinct encounter identities from message
  `sessionId`;
- when a row has no session identifier, its row ID is retained as one
  conservative fallback encounter;
- the “Mälu hoiab” meeting total uses `encounterCount`, not
  `meetings.length`.

Result:

- multiple cumulative rows from one identified session count as one encounter;
- rows without enough session provenance are not aggressively merged;
- echo, Journey notice, direction, theme, and shared-submission counts are not
  changed by this normalization.

Status: **Verified from code.**

## Statistics Counts

Files:

- `app/statistics/page.tsx`;
- `lib/expectumMemoryNormalize.ts`.

Observed behavior:

- the overall meeting total uses distinct encounter/session identities;
- ordinary meetings, thought meetings, and explorations/Avardamine are counted
  by the mode associated with each distinct encounter;
- echo, Journey notice, and direction totals remain exact Supabase row counts;
- theme and shared-submission totals remain localStorage array counts;
- first and last dates still come from the ordered raw meeting rows.

Result:

- cumulative meeting rows no longer normally inflate the displayed total or
  mode breakdown;
- exploration is no longer folded silently into ordinary meetings;
- date boundaries and non-meeting counts retain their previous source
  semantics.

Mixed-source warning:

Statistics still combines:

- normalized remote encounter counts;
- remote row counts for echoes, notices, and directions;
- local array counts for themes and shared submissions.

This is documented in Memory Refactor Plan 1.0 as **Needs decision**. The
post-merge normalization did not attempt to redefine those authorities.

Status: **Verified from code; mixed-source model remains an explicit follow-up.**

## Journey Saved Metadata

Files:

- `app/journey/page.tsx`;
- `lib/expectumMemoryNormalize.ts`.

Observed behavior:

1. Count semantics are derived from the raw meeting rows before thread content
   is deduplicated.
2. AI context receives normalized copies of those meeting rows.
3. The Journey page displays `encounterCount` as its meeting total.
4. New Journey notices store:
   - `history_count`: raw meeting-row count;
   - `sessions_count`: normalized encounter/session count;
   - `echoes_count`: raw echo-row count.
5. The already-saved check compares both raw rows and normalized sessions.
6. Historical notices with `sessions_count = null` remain compatible and do
   not create a duplicate notice solely because the new count field is now
   available.

Result:

- user-facing meeting meaning and technical storage diagnostics are separated;
- raw row information remains recoverable;
- existing Journey notices are not migrated or rewritten;
- normalized context reduces repeated message input without changing prompts.

Status: **Verified from code.**

## Journey Reflections Display

File:

- `app/journey-reflections/page.tsx`.

Observed behavior:

- new notices display `sessions_count` as “Kohtumised”;
- older notices without a session count fall back to `history_count`;
- echo count remains the stored `echoes_count`;
- no historical row is updated to create this display behavior.

Result:

- newly generated Journey notices show the less-inflated encounter count;
- historical notices remain readable;
- older fallback values may still reflect raw meeting rows because normalized
  metadata did not exist when they were saved.

Status: **Verified with historical fallback caveat.**

## Timeline Consistency

File:

- `app/timeline/page.tsx`.

Observed behavior:

- Timeline reads meeting rows without their thread or session identifiers;
- it creates one Timeline item for every `meetings` row;
- echoes, Journey notices, and directions also map one item per durable row;
- Timeline does not display a meeting count, so PR #20 did not alter its count
  semantics.

Consistency assessment:

- chronological ordering remains internally consistent with stored rows;
- it is not yet consistent with the encounter-oriented meaning used by
  History, Path, Statistics, and Journey;
- a multi-turn encounter stored as cumulative rows can still appear as several
  Timeline meeting items.

This is not a regression introduced by PR #19 or PR #20. It is a remaining
read-model issue.

Recommended smallest follow-up:

1. inspect whether Timeline is intended to show turns, snapshots, or
   encounters;
2. if encounters are intended, load thread/session identity and assemble one
   Timeline item per normalized encounter;
3. preserve raw rows and avoid changing non-meeting Timeline items.

Final Timeline semantics are **Needs decision**.

Status: **Partially consistent; follow-up required if Timeline is meant to show
encounters.**

## Source Record and Deletion Safety

### Source records

The normalization utilities:

- clone messages and meeting objects;
- do not call Supabase;
- do not mutate input arrays;
- do not update source records;
- do not migrate historical records.

The consuming pages use normalized values only after Supabase reads.

Confirmation: **No source-record mutation was introduced.**

### Data deletion

PR #19 and PR #20 did not change:

- Settings memory clearing;
- History deletion;
- Journey notice deletion;
- echo deletion;
- direction deletion;
- shared-echo moderation or withdrawal.

Confirmation: **No data deletion was introduced or changed.**

## Count Inflation Assessment

Before normalization, one encounter with cumulative rows could be represented
as several user-facing meetings.

After normalization:

- History groups messages by session;
- Path displays distinct encounters;
- Statistics displays distinct total and mode counts;
- Journey displays and stores normalized session count separately;
- Journey Reflections prefers the normalized stored count.

Therefore, user-facing meeting counts are less inflated where stable session
identity is available.

Conservative fallback:

- if no session ID is present, each source row remains a separate encounter;
- this prefers preserving too much over incorrectly merging distinct meetings.

Actual production reduction magnitude depends on the presence and quality of
stored `sessionId` values. **Needs verification** through privacy-preserving
aggregate diagnostics; production participant content should not be copied
into an audit.

## Raw Technical Counts

Raw technical counts remain available where currently needed:

- `getMeetingCountSummary.rowCount` retains the input meeting-row count;
- Journey stores that value in `journey_notices.history_count`;
- normalized encounter count is stored separately in `sessions_count`;
- existing historical fields and rows are preserved.

No new technical dashboard or participant-facing raw-row count was introduced.

Confirmation: **Raw meeting-row metadata remains available without being used
as the primary user-facing encounter count.**

## Warnings and Follow-Up Items

1. **Timeline remains row-oriented.**
   - It can repeat one multi-turn encounter.
   - Final Timeline unit is **Needs decision**.

2. **Historical Journey fallback can remain inflated.**
   - Old notices without `sessions_count` display `history_count`.
   - This preserves compatibility and avoids data migration.

3. **Missing session IDs limit normalization.**
   - The conservative fallback counts the row separately.
   - Production coverage is **Needs verification**.

4. **Mode assignment uses the first observed mode for a session identity.**
   - Current meeting flow normally keeps one mode for a session.
   - Mixed-mode historical sessions are **Needs verification**.

5. **Statistics and Path remain mixed-source views.**
   - Themes and shared-submission markers are local;
   - durable participant counts are remote.
   - Their long-term source of truth is **Needs decision**.

6. **Normalization is exact, not semantic.**
   - Similar wording with different timestamps or provenance remains separate;
   - this is intentional to avoid removing meaningful traces.

## Conclusion

The merged normalization behaves as a conservative read-time layer:

- encounter history remains stored;
- exact repeated thread messages are reduced in assembled reads;
- user-facing meeting counts prefer distinct sessions;
- raw row counts remain available as technical Journey metadata;
- no schema, source record, migration, prompt, policy, design, shared echo, or
  deletion behavior was changed.

The primary remaining inconsistency is Timeline, which is still raw-row
oriented. This should be decided and addressed separately rather than folded
into the completed count-normalization work.
