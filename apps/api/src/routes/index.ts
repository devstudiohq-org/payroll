import { Router, type Router as ExpressRouter } from 'express';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import type * as schema from '@starter/db/schema';
import type { AppEnv } from '../lib/env';
import { createHealthRouter } from './health';
import { createEmployeeRouter } from './employees';

type Db = NodePgDatabase<typeof schema>;

type RoutesOptions = {
  env: AppEnv;
  startedAt: number;
  db: Db;
};

export function createRoutes(options: RoutesOptions): ExpressRouter {
  const router = Router();

  router.use(createHealthRouter(options));
  router.use(createEmployeeRouter({ db: options.db }));

  return router;
}
