<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

**Expectum** is a single Next.js 16 (App Router, Turbopack) web app — auth + data via Supabase, AI flows via OpenAI. Standard scripts are in `package.json`: `npm run dev` (http://localhost:3000), `npm run build`, `npm run lint`. There is no test framework/script.

- Required env vars (read at module load; the app will crash or routes will 500 without them): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `OPENAI_REFLECTION_MODEL`, `OPENAI_JOURNEY_MODEL`, `OPENAI_ATTUNEMENT_MODEL`. `EXPECTUM_ADMIN_KEY` is only needed for `/api/admin/shared-insights`. Put these in `.env.local` (gitignored).
- Gotcha: `lib/supabaseClient.ts` / `lib/supabaseAdmin.ts` call `createClient(...)` at import time, so a missing `NEXT_PUBLIC_SUPABASE_URL` breaks `next build` during "Collecting page data" (error `supabaseUrl is required`) and breaks page render — not just the API routes. Placeholder values (e.g. `https://placeholder.supabase.co` + any non-empty keys) are enough to boot/build and render the public UI, but real Supabase + OpenAI credentials are required for actual sign-in and AI reflection responses.
- `npm run lint` currently reports pre-existing errors in the repo source (React hooks / next-link rules); this is the codebase's current state, not an environment problem.
