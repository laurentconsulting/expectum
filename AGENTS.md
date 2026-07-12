<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

**Product:** `expectum` is a single Next.js 16 (App Router) web app (Estonian UI). It depends on two external services: **Supabase** (auth + Postgres; gates most pages) and **OpenAI** (powers the `/api/reflect`, `/api/attunement-question`, `/api/journey`, `/api/trajectory` routes).

**Commands** (see `package.json`): `npm run dev` (port 3000), `npm run build`, `npm run lint`. There is no automated test suite. `npm run lint` currently reports pre-existing errors in app code — that is expected, not an environment problem.

**Local backend (Supabase via Docker).** A local Supabase stack is used for dev instead of a hosted project. It is NOT started automatically. Start it each session in this order:
1. Ensure the Docker daemon is running: `sudo dockerd` (run in a background tmux session) and `sudo chmod 666 /var/run/docker.sock`. Docker 29 + `fuse-overlayfs` is preconfigured in `/etc/docker/daemon.json` (with `containerd-snapshotter` disabled — required for fuse-overlayfs on Docker 29).
2. `supabase start` (Supabase CLI is installed). Studio: http://localhost:54323, API: http://localhost:54321.
3. `npm run dev`.

**Env vars:** `.env.local` (gitignored) holds the config. The local Supabase keys are stable demo defaults, so the file can be recreated from `supabase status -o env` if missing. `OPENAI_API_KEY` is NOT set by default — the AI reflection flows return a graceful fallback message until a real key is provided; auth and all non-AI pages work without it.

**Schema:** `supabase/migrations/00000000000000_expectum_init.sql` creates the `profiles` and `shared_insights` tables the app needs. Apply with `supabase db reset` (this also reapplies on a fresh `supabase start` with no volume). `shared_insights` is accessed via the service-role admin client (bypasses RLS).

**Auth note:** email confirmations are disabled in `supabase/config.toml`, so sign-up immediately yields a usable account (no email step). Most pages are wrapped in `ExpectumAuthGate`, which redirects unauthenticated users to `/enter`.
