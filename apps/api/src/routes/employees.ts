import { Router, type Router as ExpressRouter } from 'express';
import {
  companyScopeParamSchema,
  createEmployeeSchema,
  employeeParamSchema,
  updateEmployeeSchema,
} from '@starter/db';

import type { Database } from '../lib/db';
import { validateRequest } from '../middleware/validate-request';
import {
  createEmployeeController,
  listEmployeesController,
  updateEmployeeController,
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

  router.patch(
    '/companies/:companyId/employees/:employeeId',
    validateRequest({ params: employeeParamSchema, body: updateEmployeeSchema }),
    updateEmployeeController({ db }),
  );

  return router;
}
