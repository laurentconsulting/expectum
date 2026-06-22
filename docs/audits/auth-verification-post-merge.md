# EXPECTUM Auth Verification Post-Merge

## Overview

This is a documentation-only post-merge verification after PR #34, `Clarify auth state and access rules`, was merged into `main`.

Merge commit:

- `0e62bbd5eae55e317062bc347baa8019c16699de`

Verified from:

- merged source on `main`;
- GitHub PR metadata;
- Vercel deployment status;
- route/auth structure documented in `docs/audits/auth-state-access-review-1.md`.

This verification does not introduce application code changes.

Needs verification: a final manual browser test should still be performed with a real Supabase user session, because this document verifies source behavior and deployment status, not a credential-backed end-to-end login session.

## Deployment Status

Vercel deployment for the merge commit was checked after merge.

Status:

- Vercel deployment reached `success`.

## A. Logged-Out User

Expected:

- logged-out users cannot access authenticated pages;
- logged-out users are redirected appropriately.

Verified from source:

- Authenticated pages are wrapped in `ExpectumAuthGate`.
- `ExpectumAuthGate` calls `supabase.auth.getUser()` on mount.
- If no user exists:
  - `setUser(null)` runs;
  - `setChecking(false)` runs;
  - `router.replace("/enter")` runs;
  - protected children do not render because `if (!user) return null`.

Result:

- Source-level verification: pass.
- Manual browser verification with a real logged-out session: Needs verification.

Notes:

- Initial unauthenticated access redirects to `/enter`.
- Auth loss after a previous authenticated state redirects to `/return`.

## B. Logged-In User

Expected:

- logged-in users can access authenticated pages.

Verified from source:

- `ExpectumAuthGate` sets `user` from `supabase.auth.getUser()` when a Supabase user exists.
- `setChecking(false)` runs after user is set.
- Protected children render only when `user` is present.
- `onAuthStateChange` also sets `user` and `checking` when a session user exists.

Result:

- Source-level verification: pass.
- Manual browser verification with real credentials: Needs verification.

## C. Logout

Expected:

- local auth state clears immediately;
- redirect happens correctly;
- authenticated navigation disappears;
- protected pages no longer render;
- protected pages cannot be accessed after logout unless Supabase session is valid again.

Verified from source:

- `AuthStatus.signOut()` now:
  - guards against duplicate sign-out clicks with `signingOut`;
  - sets local `user` to `null`;
  - calls `onUserChange?.(null)`;
  - calls `supabase.auth.signOut()`;
  - uses `router.replace("/return")` in `finally`.
- `ExpectumAuthGate` now handles signed-out auth state by:
  - setting local `user` to `null`;
  - setting `checking` to `false`;
  - replacing route with `/return`;
  - returning `null` for protected children when no user exists.

Result:

- Source-level verification: pass.
- Manual browser verification after clicking `Välju`: Needs verification.

Important behavior now corrected:

- Protected content is no longer allowed to remain mounted only because redirect navigation has not completed.

## D. Footer

Expected:

- authenticated: show `Välju`;
- unauthenticated: show `Ava kohtumine`.

Verified from source:

- `ExpectumFooter` renders `AuthStatus` as the right-side dynamic footer action.
- `AuthStatus` renders `Ava kohtumine` when:
  - no user is present; or
  - current path is `/return`.
- `AuthStatus` renders `Välju` when:
  - a user is present; and
  - current path is not `/return`.

Result:

- Source-level verification: pass.
- Manual visual verification on production: Needs verification.

## E. Header

Expected:

- authenticated navigation appears only when authenticated;
- public pages remain public;
- public pages do not show authenticated-only navigation.

Verified from source:

- `ExpectumHeader` loads Supabase user state.
- `ExpectumHeader` subscribes to auth state changes.
- Authenticated navigation renders only when:
  - `user` exists; and
  - `!isPublicPath`.
- Public paths include:
  - `/`
  - `/expectum`
  - `/expectum-language`
  - `/symbols`
  - `/aim`
  - `/human-and-ai`
  - `/enter`
  - `/return`

Result:

- Source-level verification: pass.
- Manual visual verification on production: Needs verification.

## Auth Verification Results

| Area | Source-level result | Manual browser result |
| --- | --- | --- |
| Logged-out users blocked from authenticated pages | Pass | Needs verification |
| Logged-in users can access authenticated pages | Pass | Needs verification |
| Logout clears local footer auth state | Pass | Needs verification |
| Logout clears protected-page gate state | Pass | Needs verification |
| Logout redirects to `/return` | Pass | Needs verification |
| Authenticated footer shows `Välju` | Pass | Needs verification |
| Unauthenticated footer shows `Ava kohtumine` | Pass | Needs verification |
| Header auth navigation requires user and non-public page | Pass | Needs verification |
| Public pages remain public | Pass | Needs verification |

## Remaining Auth Risks

### 1. API route auth enforcement

Several API routes still rely on authenticated caller pages rather than explicit server-side user auth checks.

Risk:

- page-level auth can prevent normal UI access, but direct API calls are a separate surface.

Status:

- Needs verification in a future API auth audit.

### 2. Client-side auth gate

`ExpectumAuthGate` is a client-side gate.

Risk:

- protected page content is now hidden reliably in the browser after auth state changes, but server-side protection or middleware is not currently documented as implemented.

Status:

- Acceptable for current architecture after PR #34, but Needs decision if stronger server-side route protection becomes required.

### 3. `/return` sign-out fallback is client-side

`/return` signs out through `AuthStatus` after hydration because `ExpectumPage` includes the footer.

Risk:

- this is reliable for normal browser use, but it is not a server-side logout endpoint.

Status:

- Acceptable for current client-side architecture.
- Needs decision if Expectum later needs server-controlled logout.

### 4. Hidden legacy/public routes

`/movement-map` and `/theme-evolution` remain hidden legacy routes outside the authenticated participant route list.

Risk:

- not part of the immediate logout bug, but still part of access-governance cleanup.

Status:

- Needs decision.

## Recommended Manual Verification Checklist

Use a real browser session and a real Supabase user:

1. Open `/return` while logged out.
   - Expected: page loads; footer shows `Ava kohtumine`; no auth navigation.

2. Open `/reflection` while logged out.
   - Expected: redirect to `/enter`; protected content does not appear.

3. Log in through `/enter`.
   - Expected: redirect to `/attunement`; authenticated navigation appears on authenticated pages.

4. Open `/reflection`, `/settings`, and `/path`.
   - Expected: pages load.

5. Click `Välju`.
   - Expected: immediate redirect to `/return`; footer shows `Ava kohtumine`; header auth navigation disappears.

6. Use browser back or manually open `/reflection`.
   - Expected: redirected to `/enter` or `/return`; protected content does not render.

7. Refresh browser on an authenticated route after logout.
   - Expected: no restored access unless Supabase session is valid again.

## Conclusion

PR #34 corrected the main stale-auth-state risk at source level:

- footer auth state clears immediately;
- protected page gate state clears immediately;
- redirects use `replace`;
- `/return` remains public and acts as logout fallback;
- authenticated navigation remains conditioned on a valid Supabase user and non-public route.

The remaining work is not another immediate code change. The next safe step is a manual browser verification with a real account, followed later by a separate API/server auth audit if stronger protection is required.

