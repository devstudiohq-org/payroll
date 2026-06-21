import cors from 'cors';
import express, { type Express } from 'express';

import type { AppEnv } from './lib/env';
import { getDb, type Database } from './lib/db';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found';
import { createRoutes } from './routes';

type CreateAppOptions = {
  startedAt?: number;
  db?: Database;
};

export function createApp(env: AppEnv, options: CreateAppOptions = {}): Express {
  const { startedAt = Date.now(), db = getDb(env.DATABASE_URL) } = options;
  const app = express();

  // Allow the web app (a different origin in dev) to call the API. CORS_ORIGINS
  // can be a comma-separated allowlist; omit it to reflect any origin.
  app.use(
    cors({
      origin: env.CORS_ORIGINS.length > 0 ? env.CORS_ORIGINS : true,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(env.API_PREFIX, createRoutes({ env, startedAt, db }));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
