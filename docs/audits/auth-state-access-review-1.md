# EXPECTUM Auth State and Access Rules Review 1.0

## Current Behavior

Expectum currently uses Supabase browser auth through `lib/supabaseClient.ts`.

The main auth state surfaces inspected were:

- `components/AuthStatus.tsx`
- `components/ExpectumAuthGate.tsx`
- `components/ExpectumHeader.tsx`
- `components/ExpectumFooter.tsx`
- `components/ExpectumPage.tsx`
- `app/return/page.tsx`
- `app/enter/page.tsx`
- all routes currently wrapped in `ExpectumAuthGate`
- route and redirect usage found through `supabase.auth`, `router.push`, `window.location`, `href="/return"`, and auth state listeners

Current model:

- Public pages are accessible without login.
- Authenticated pages use the client-side `ExpectumAuthGate`.
- `AuthStatus` reads Supabase auth state and shows either `Välju` or `Ava kohtumine`.
- `/return` is public and triggers `AuthStatus` to call `supabase.auth.signOut()` when mounted.
- `ExpectumHeader` hides authenticated navigation on public pages and only shows it when a Supabase user is present.

Before this review, the key risk was in `ExpectumAuthGate`: when Supabase emitted a signed-out auth state, the gate redirected but did not immediately clear its local `user` state. That meant protected page content could remain rendered until navigation completed.

That behavior is too weak for authenticated-only pages.

## Expected Rules

### 1. Public pages

Public pages must be accessible without login.

They may show public entry actions such as `Ava kohtumine`, but must not require a Supabase session.

### 2. Authenticated pages

Authenticated pages must not render protected content unless a valid Supabase user/session is present.

If no user is found on initial check:

- protected content must not render;
- the user should be redirected to `/enter`.

If auth state changes to signed out while already inside a protected page:

- protected content must stop rendering immediately;
- the user should be redirected to `/return`.

### 3. Login

After successful login on `/enter`:

- Supabase auth state must establish a valid session;
- authenticated pages become accessible;
- current behavior sends the user to `/attunement`.

### 4. Logout

When the user clicks `Välju`:

- local React auth state should clear immediately;
- `supabase.auth.signOut()` must be called;
- the user should be redirected with replace semantics to `/return`;
- authenticated pages must stop rendering immediately when auth state is lost;
- browser refresh must not restore access unless Supabase still has a valid session.

### 5. `/return`

`/return` must remain public.

It may act as a logout fallback. It must not preserve authenticated access and must not show authenticated-only navigation.

### 6. Footer action

Footer dynamic action should be:

- authenticated: `Välju`;
- unauthenticated: `Ava kohtumine` or equivalent public entry action.

### 7. Header navigation

Authenticated navigation should appear only when:

- a Supabase user is present; and
- the current path is not one of the public paths.

### 8. No stale state

React state must not keep showing authenticated UI or protected page content after logout.

Redirects alone are not enough. The local protected-page user state must also clear.

## Public Routes

Public pages from the current route inventory:

- `/`
- `/aim`
- `/aim-memory`
- `/collective-echo`
- `/enter`
- `/expectum`
- `/expectum-language`
- `/human-and-ai`
- `/return`
- `/symbols`
- `/admin/shared-insights` is hidden/admin rather than participant-public; it does not use `ExpectumAuthGate`, and admin mutation APIs require `x-admin-key`.
- `/movement-map` and `/theme-evolution` are hidden legacy pages and are not part of authenticated participant navigation.

Needs decision: whether hidden legacy pages should remain public, be gated, redirected, or removed in a later cleanup.

Needs verification: whether `/admin/shared-insights` should also require Supabase authentication in addition to the admin key flow.

## Authenticated Routes

Authenticated pages currently wrapped in `ExpectumAuthGate`:

- `/attunement`
- `/attunement-question`
- `/history`
- `/journey`
- `/journey-reflections`
- `/landmarks`
- `/path`
- `/pause`
- `/profile`
- `/question`
- `/reflection`
- `/settings`
- `/shared-insights`
- `/statistics`
- `/themes`
- `/timeline`
- `/trajectory`
- `/trajectory-history`

These pages should not render protected content without a valid Supabase user.

## Logout Flow

Expected flow:

1. User clicks `Välju` in `AuthStatus`.
2. `AuthStatus` immediately clears its local user state.
3. `supabase.auth.signOut()` runs.
4. The router replaces the current location with `/return`.
5. Supabase auth state listeners receive the signed-out session.
6. `ExpectumAuthGate`, if mounted, clears its local user state immediately and redirects to `/return`.
7. Protected page content is no longer rendered.
8. `/return` remains public and does not show authenticated navigation.

Implementation note from this review:

- `AuthStatus` was updated to use `router.replace("/return")` after sign-out and guard against duplicate sign-out clicks.
- `ExpectumAuthGate` was updated to clear `user` and `checking` immediately when no session/user is present.
- `ExpectumAuthGate` now uses `router.replace`, not `router.push`, for auth redirects.

## Return Page Behavior

`/return` is public and uses `ExpectumPage`.

Because `ExpectumPage` includes `ExpectumFooter`, and the footer includes `AuthStatus`, `/return` triggers the `AuthStatus` return-page sign-out fallback.

Required behavior:

- `/return` must remain accessible without login;
- `/return` must not show authenticated header navigation;
- `/return` should show public footer action (`Ava kohtumine`);
- `/return` must not preserve access to authenticated pages.

Current status after this review:

- `ExpectumHeader` already treats `/return` as a public path.
- `AuthStatus` treats `/return` as unauthenticated UI and signs out if needed.

## Footer/AuthStatus Behavior

`ExpectumFooter` delegates its right-side dynamic action to `AuthStatus`.

Expected behavior:

- If `AuthStatus` has a user and the page is not `/return`, show `Välju`.
- If there is no user, show `Ava kohtumine`.
- On `/return`, always show `Ava kohtumine` and ensure sign-out has been attempted.

Risk before this review:

- logout depended on redirect completion while protected page gates did not immediately clear their own user state.

Fix included in this review:

- `AuthStatus` clears local user state before signing out;
- `AuthStatus` redirects with `router.replace("/return")`;
- `ExpectumAuthGate` clears local protected-page user state on signed-out auth events.

## Risks Found

### 1. Protected content could remain mounted during logout

Severity: high.

Before this review, `ExpectumAuthGate` redirected on signed-out auth state but did not set `user` to `null` or stop rendering immediately.

This could make the app briefly behave as if the user was still logged in after clicking `Välju`.

### 2. Redirects used push semantics

Severity: medium.

`router.push` can leave protected routes in browser history. For auth redirects, replace semantics are safer and clearer.

### 3. `/return` sign-out fallback depends on client-side `AuthStatus`

Severity: low to medium.

This is acceptable for current client-side auth architecture, but it means `/return` logout fallback happens after hydration, not on the server.

Needs verification: whether future middleware/server-side session handling should make `/return` sign-out stricter.

### 4. API route auth is separate from page auth

Severity: needs verification.

Several OpenAI and data routes rely on authenticated caller pages rather than explicit route-handler user auth.

This review did not change API route auth because the requested problem is login/logout/access behavior in the browser UI.

Needs verification: whether API routes should later enforce Supabase user auth server-side.

### 5. Legacy/hidden pages remain outside participant auth navigation

Severity: needs decision.

`/movement-map` and `/theme-evolution` are hidden legacy pages and do not use `ExpectumAuthGate`.

Needs decision: whether these should remain public hidden pages, be gated, redirected, or removed.

## Smallest Safe Fix Plan

Implemented in this PR because the cause was clear and the fix was small:

1. Update `ExpectumAuthGate`
   - On initial no-user state, clear local state, stop checking, and `router.replace("/enter")`.
   - On signed-out auth state, clear local state, stop checking, and `router.replace("/return")`.
   - This prevents protected content from remaining mounted after logout.

2. Update `AuthStatus`
   - Use `useRouter` and `router.replace("/return")`.
   - Clear local user state before calling Supabase sign-out.
   - Guard against duplicate sign-out clicks.
   - Keep `/return` as public sign-out fallback.

3. Do not change
   - Supabase project settings;
   - database schema;
   - prompts;
   - memory behavior;
   - visual design;
   - protected page content;
   - routes.

Recommended later audits:

- server/API auth enforcement review;
- legacy hidden route access decision;
- optional middleware review if Expectum later needs server-side route protection.

