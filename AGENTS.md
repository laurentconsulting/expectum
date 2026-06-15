<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

`expectum` is a single Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + Tailwind v4 app. Package manager is **npm** (`package-lock.json`). Scripts live in `package.json`: `npm run dev` (port 3000), `npm run build`, `npm run start`, `npm run lint` (ESLint). There is **no test framework/script** in this repo.

Environment variables: the app reads Supabase + OpenAI config from env (loaded by Next from `.env.local`). Required names: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `OPENAI_REFLECTION_MODEL`, `OPENAI_JOURNEY_MODEL`, `OPENAI_ATTUNEMENT_MODEL`, `EXPECTUM_ADMIN_KEY`. A gitignored `.env.local` with placeholder values is enough to boot the app, run `lint`, and run `build` — the homepage and public/info pages (`/`, `/expectum`, `/enter`, `/symbols`) render fully with placeholders.

Non-obvious caveats:
- Supabase and OpenAI are **hosted services**, not run locally. There are no migrations/schema or Supabase config in the repo, so a local Supabase will not have the app's tables (`profiles`, `meetings`, `echoes`, `journey_notices`, `directions`, `shared_insights`). Real auth + AI end-to-end requires real credentials for a provisioned Supabase project and an OpenAI key.
- With placeholder env vars, `lib/supabaseClient.ts`/`lib/supabaseAdmin.ts` still construct (the URL just needs to be a valid URL like `http://localhost:54321`), but any auth/data call fails with `Failed to fetch`, and AI routes (`app/api/*`) return a graceful 500 fallback.
- Most pages are behind `components/ExpectumAuthGate.tsx`, which redirects unauthenticated users to `/enter`; you need a working Supabase Auth session to reach them.
- `npm run lint` currently reports pre-existing errors/warnings in app code — these are not caused by environment setup.
