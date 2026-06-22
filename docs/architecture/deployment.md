# Deployment and delivery

## Repository

- GitHub repository: `laurentconsulting/expectum`
- Default integration branch: `main`
- Application package: private npm package named `expectum`
- Production build command: `npm run build`
- Production start command: `npm run start`

## Branch and pull-request workflow

The current working convention is:

1. update from `main`;
2. create a narrowly scoped branch, normally `codex/<description>`;
3. change only files in the agreed scope;
4. validate locally;
5. commit with a concise message;
6. push the branch;
7. create a draft pull request against `main`;
8. review the diff and Vercel Preview result;
9. mark the pull request ready;
10. merge only after approval;
11. verify the Production deployment and public site.

Draft pull requests are preferred while work or validation remains. Codex does
not merge unless explicitly authorized.

No tracked GitHub Actions workflow was found. Vercel currently provides the
observed pull-request deployment status. Additional repository rules and
branch protections are **Needs verification** in GitHub settings.

## Vercel Preview deployments

Vercel creates a Preview deployment for pull-request branches.

Preview is used to:

- verify the production build in the hosted environment;
- inspect affected pages;
- confirm environment-variable coverage;
- report success or failure to the GitHub pull request.

Environment variables required during build must be enabled for the Preview
environment as well as Production.

## Vercel Production deployments

Merging to `main` triggers the Production deployment.

The public site is served at:

- `https://www.expectum.org`

Observed production verification includes:

- Vercel deployment status is `Ready`;
- the merged commit is the source of the deployment;
- affected public routes and layouts are checked in the browser.

The exact domain, deployment-retention, rollback, and protection settings are
managed outside this repository and are **Needs verification** in Vercel.

## Required environment variables

Names only:

### Supabase

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### OpenAI

- `OPENAI_API_KEY`
- `OPENAI_ATTUNEMENT_MODEL`
- `OPENAI_REFLECTION_MODEL`
- `OPENAI_JOURNEY_MODEL`

### Expectum administration

- `EXPECTUM_ADMIN_KEY`

No secret values should be committed to Git, documentation, pull-request
descriptions, screenshots, logs, or chat.

## Environment scope

- `NEXT_PUBLIC_*` values are exposed to browser bundles by design.
- `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, and `EXPECTUM_ADMIN_KEY` must
  remain server-only.
- Model-name variables are consumed only by server route handlers.

The repository has no tracked `.env.example`. Whether to add a names-only
template is **Needs verification**.

## Validation

For application-code changes, the expected baseline is:

```bash
npm run build
```

Documentation-only changes do not require a production build unless they
change repository tooling or generated documentation. This architecture
documentation is hand-maintained Markdown and does not affect the application
bundle.
