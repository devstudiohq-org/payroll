import { Router, type Router as ExpressRouter } from 'express';
import { companyIdParamSchema, createCompanySchema } from '@starter/db';

import type { Database } from '../lib/db';
import { validateRequest } from '../middleware/validate-request';
import {
  createCompanyController,
  getCompanyController,
  listCompaniesController,
} from '../controllers/companies-controller';

type Options = {
  db: Database;
};

export function createCompaniesRouter({ db }: Options): ExpressRouter {
  const router = Router();

  router.get('/companies', listCompaniesController({ db }));

  router.post(
    '/companies',
    validateRequest({ body: createCompanySchema }),
    createCompanyController({ db }),
  );

  router.get(
    '/companies/:id',
    validateRequest({ params: companyIdParamSchema }),
    getCompanyController({ db }),
  );

  return router;
}
