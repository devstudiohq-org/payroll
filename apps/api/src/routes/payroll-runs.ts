import { Router, type Router as ExpressRouter } from 'express';
import {
  companyScopeParamSchema,
  createPayrollRunSchema,
  payrollRunScopeParamSchema,
  payslipScopeParamSchema,
  updatePayslipSchema,
} from '@starter/db';

import type { Database } from '../lib/db';
import { validateRequest } from '../middleware/validate-request';
import {
  createPayrollRunController,
  listPayrollRunsController,
  listPayslipsController,
  updatePayslipController,
} from '../controllers/payroll-runs-controller';

type Options = {
  db: Database;
};

export function createPayrollRunsRouter({ db }: Options): ExpressRouter {
  const router = Router();

  router.get(
    '/companies/:companyId/payroll-runs',
    validateRequest({ params: companyScopeParamSchema }),
    listPayrollRunsController({ db }),
  );

  router.post(
    '/companies/:companyId/payroll-runs',
    validateRequest({ params: companyScopeParamSchema, body: createPayrollRunSchema }),
    createPayrollRunController({ db }),
  );

  router.get(
    '/companies/:companyId/payroll-runs/:runId/payslips',
    validateRequest({ params: payrollRunScopeParamSchema }),
    listPayslipsController({ db }),
  );

  router.patch(
    '/companies/:companyId/payroll-runs/:runId/payslips/:payslipId',
    validateRequest({ params: payslipScopeParamSchema, body: updatePayslipSchema }),
    updatePayslipController({ db }),
  );

  return router;
}
