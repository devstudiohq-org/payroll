import { Router, type Router as ExpressRouter } from 'express';

import type { AppEnv } from '../lib/env';
import type { Database } from '../lib/db';
import { createHealthRouter } from './health';
import { createCompaniesRouter } from './companies';
import { createEmployeesRouter } from './employees';
import { createPayrollRunsRouter } from './payroll-runs';

type RoutesOptions = {
  env: AppEnv;
  startedAt: number;
  db: Database;
};

export function createRoutes(options: RoutesOptions): ExpressRouter {
  const router = Router();

  router.use(createHealthRouter(options));
  router.use(createCompaniesRouter(options));
  router.use(createEmployeesRouter(options));
  router.use(createPayrollRunsRouter(options));

  return router;
}

