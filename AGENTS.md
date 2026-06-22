<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

`expectum` is a single Next.js 16 (App Router, Turbopack) web app; package manager is **npm**. Scripts live in `package.json`: `npm run dev` (port 3000), `npm run build`, `npm run lint`. There is no automated test suite.

### Required environment variables
The app reads these at module load with no fallbacks, so they must be set (e.g. in `.env.local`, which is gitignored) for build/dev to work:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (Supabase auth + Postgres).
- `OPENAI_API_KEY`, `OPENAI_REFLECTION_MODEL`, `OPENAI_JOURNEY_MODEL`, `OPENAI_ATTUNEMENT_MODEL` (the AI "Aim" features).
- `EXPECTUM_ADMIN_KEY` (optional; only for `/api/admin/shared-insights`).

### Non-obvious gotchas
- **Build/dev hard-fails with an empty/unset `OPENAI_API_KEY`.** The OpenAI client is constructed at module top-level (`app/api/*/route.ts`); the new SDK throws "Missing credentials" during `next build` page-data collection and on route eval. A *non-empty* placeholder is enough to build and run; a *real* key is only needed for genuine AI responses (otherwise `/api/reflect`, `/api/journey`, `/api/trajectory`, `/api/attunement-question` return graceful Estonian fallback text). Supabase clients (`lib/supabaseClient.ts`, `lib/supabaseAdmin.ts`) use `process.env...!` non-null assertions, so missing Supabase URL/keys breaks the build and page render too.
- For real functionality, set genuine Supabase + OpenAI values via Cursor Secrets. For offline auth/DB testing, run a **local Supabase** instead (`supabase start`, requires Docker daemon running). Local signups **auto-confirm** (no email verification), so create-account → sign-in works immediately. The app expects `public.profiles` (`id uuid`, `email text`) and `public.shared_insights` (`id, question, text, question_count, approved, created_at`) tables — create them manually; they are not auto-migrated (no `supabase/migrations` in repo). The `collective-echo` / `shared-insights` API routes swallow errors and return empty arrays, so missing data degrades gracefully.
- UI text is Estonian. Most personal state is stored in browser `localStorage` (`lib/expectumStorage.ts`); personal pages are auth-gated by `ExpectumAuthGate`, which redirects unauthenticated users to `/enter`.
- `npm run lint` currently reports pre-existing lint errors in the app code (unrelated to environment setup).
