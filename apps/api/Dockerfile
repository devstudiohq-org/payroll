FROM node:24-alpine AS builder
WORKDIR /repo
RUN corepack enable

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY eslint.config.mjs prettier.config.mjs ./
COPY apps/api ./apps/api
COPY packages ./packages

RUN npx pnpm@11.5.2 install --frozen-lockfile=false
RUN npx pnpm@11.5.2 --filter @starter/api build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
ENV API_PREFIX=/api

COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/apps/api/package.json ./apps/api/package.json
COPY --from=builder /repo/apps/api/dist ./apps/api/dist

EXPOSE 8080
CMD ["node", "apps/api/dist/index.js"]
