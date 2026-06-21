# Starter Monorepo Shell

A minimal full-stack pnpm workspace shaped like a modern Turborepo starter. It includes a React web app, an Express API, a Drizzle/PostgreSQL package, shared types, and shared config without any business-domain features.

## Workspace layout

- `apps/web`: React 19 + Vite + React Router v7 + Tailwind CSS v4 + React Query + Zustand + Vitest
- `apps/api`: Express + TypeScript + Zod + Jest + Supertest
- `packages/db`: Drizzle ORM + PostgreSQL tooling shell
- `packages/types`: shared TypeScript contracts
- `packages/config`: shared TypeScript and ESLint configuration

## Getting started

1. Copy `.env.example` to `.env`.
2. Start local infrastructure with `docker compose up -d`.
3. Install dependencies with `npx pnpm@11.5.2 install`.
4. If pnpm blocks build scripts on first install, run `npx pnpm@11.5.2 approve-builds` and approve the requested entries.
5. Start the workspace with either `npx turbo dev` or `npx pnpm@11.5.2 dev`.

## Running the app (local dev)

The web app and API run as two long-lived dev servers. `pnpm dev` (Turbo) starts **both**:

1. Copy `.env.example` to `.env` (once).
2. Start Postgres: `docker compose up -d postgres`.
3. Apply the schema and seed sample data (once, or after schema changes):
   - `pnpm db:migrate`
   - `pnpm db:seed` — seeds four sample companies (Acme, TechNova, Global Retail, Healthcare Plus) and a few employees.
4. Start everything: `pnpm dev`.

Ports and routing:

- Web (Vite): http://localhost:3000
- API (Express): http://localhost:4000, routes under `/api`
- The web dev server **proxies `/api` → the API** (see `apps/web/vite.config.ts`), so the browser stays same-origin and no CORS config is needed in dev. The client uses the relative `/api` base unless `VITE_API_URL` is set.

You should see this line once the API is up:

```
API server listening { apiPrefix: '/api', env: 'development', port: 4000 }
```

### Troubleshooting "Couldn't load companies"

This means the browser's request to `/api/...` didn't reach the API. Check, in order:

1. **Is the API running?** A `[vite] http proxy error ... ECONNREFUSED 127.0.0.1:4000` in the web logs means nothing is listening on 4000. Run `pnpm dev` (starts both) or `pnpm --filter @starter/api dev`.
2. **Don't double-bind port 4000** — running a standalone API and `pnpm dev` together causes an `EADDRINUSE` crash.
3. **Is Postgres up?** `docker compose ps`. If the DB is down the API returns a 500 (not `ECONNREFUSED`); start it with `docker compose up -d postgres`.
4. **Restart Vite after changing `vite.config.ts`** — proxy config changes are not hot-reloaded.

## Turbo commands

- `npx turbo dev`
- `npx turbo build`
- `npx turbo lint`
- `npx turbo test`
- `npx turbo type-check`

## Package script equivalents

- `npx pnpm@11.5.2 dev`
- `npx pnpm@11.5.2 build`
- `npx pnpm@11.5.2 lint`
- `npx pnpm@11.5.2 test`
- `npx pnpm@11.5.2 type-check`
- `npx pnpm@11.5.2 db:generate`
- `npx pnpm@11.5.2 db:migrate`
- `npx pnpm@11.5.2 db:seed`

## Docker commands

- `docker compose up -d`
- `docker compose down`
- `docker compose ps`
- `docker compose logs -f postgres`
- `docker compose logs -f adminer`

## Deployment shell

- Firebase Hosting placeholder config lives in `firebase.json`.
- Cloud Run placeholder service config lives in `deploy/cloudrun.service.yaml`.
- The API container shell lives in `apps/api/Dockerfile`.
