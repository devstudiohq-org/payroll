import express, { type Express } from 'express';

import { createDatabaseClient } from '@starter/db';
import type { AppEnv } from './lib/env';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found';
import { createRoutes } from './routes';

export function createApp(env: AppEnv, startedAt = Date.now()): Express {
  const app = express();
  const { db } = createDatabaseClient(env.DATABASE_URL);

  app.use(express.json());
  app.use(env.API_PREFIX, createRoutes({ env, startedAt, db }));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

