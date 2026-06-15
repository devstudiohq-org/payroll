import { Router, type Router as ExpressRouter } from 'express';
import { companyScopeParamSchema, createEmployeeSchema } from '@starter/db';

import type { Database } from '../lib/db';
import { validateRequest } from '../middleware/validate-request';
import {
  createEmployeeController,
  listEmployeesController,
} from '../controllers/employees-controller';

type Options = {
  db: Database;
};

export function createEmployeesRouter({ db }: Options): ExpressRouter {
  const router = Router();

  router.get(
    '/companies/:companyId/employees',
    validateRequest({ params: companyScopeParamSchema }),
    listEmployeesController({ db }),
  );

  router.post(
    '/companies/:companyId/employees',
    validateRequest({ params: companyScopeParamSchema, body: createEmployeeSchema }),
    createEmployeeController({ db }),
  );

  return router;
}
