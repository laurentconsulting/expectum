<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

`expectum` is a single Next.js 16 (App Router) / React 19 web app (package manager: **npm**). Commands live in `package.json`: `npm run dev` (port 3000, Turbopack), `npm run build`, `npm run lint`. There is **no test suite**.

- **Env vars are required to run.** `lib/supabaseClient.ts` / `lib/supabaseAdmin.ts` call `createClient` at module load, and pages/API routes read these at runtime. Create `.env.local` (gitignored) with: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `OPENAI_REFLECTION_MODEL`, `OPENAI_JOURNEY_MODEL`, `OPENAI_ATTUNEMENT_MODEL`, and (admin route only) `EXPECTUM_ADMIN_KEY`. Placeholder values let the server boot and pages render, but auth ("Failed to fetch" on login) and AI features need a real Supabase project and OpenAI key.
- **External services:** Supabase (hosted Postgres + Auth; expects `profiles` and `shared_insights` tables) gates almost every page via `ExpectumAuthGate`; OpenAI powers the core "Aim" meeting/reflection feature (`/api/reflect`, `/api/journey`, `/api/trajectory`, `/api/attunement-question`). No local DB/containers and no migrations are in the repo.
- `npm run lint` currently reports pre-existing errors in the app code (e.g. `react-hooks/*`, `@next/next/no-html-link-for-pages`); the lint toolchain itself works.
