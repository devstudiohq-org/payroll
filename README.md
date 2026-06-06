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
