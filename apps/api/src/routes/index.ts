import { Router, type Router as ExpressRouter } from 'express';

import type { AppEnv } from '../lib/env';
import { createHealthRouter } from './health';

type RoutesOptions = {
  env: AppEnv;
  startedAt: number;
};

export function createRoutes(options: RoutesOptions): ExpressRouter {
  const router = Router();

  router.use(createHealthRouter(options));

  return router;
}
