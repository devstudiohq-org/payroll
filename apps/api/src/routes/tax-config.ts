import { Router, type Router as ExpressRouter } from 'express';
import { companyScopeParamSchema, upsertTaxConfigSchema } from '@starter/db';

import type { Database } from '../lib/db';
import { validateRequest } from '../middleware/validate-request';
import {
  getTaxConfigController,
  upsertTaxConfigController,
} from '../controllers/tax-config-controller';

type Options = {
  db: Database;
};

export function createTaxConfigRouter({ db }: Options): ExpressRouter {
  const router = Router();

  router.get(
    '/companies/:companyId/tax-config',
    validateRequest({ params: companyScopeParamSchema }),
    getTaxConfigController({ db }),
  );

  router.put(
    '/companies/:companyId/tax-config',
    validateRequest({ params: companyScopeParamSchema, body: upsertTaxConfigSchema }),
    upsertTaxConfigController({ db }),
  );

  return router;
}
