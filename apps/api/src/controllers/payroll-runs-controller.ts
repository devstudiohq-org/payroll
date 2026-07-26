import type { RequestHandler } from 'express';
import type { CreatePayrollRunInput } from '@starter/db';

import type { Database } from '../lib/db';
import type { ValidatedRequest } from '../types/http';
import { createPayrollRun, listPayrollRuns } from '../services/payroll-runs-service';
import { getCompany } from '../services/companies-service';

type Options = {
  db: Database;
};

export function listPayrollRunsController({ db }: Options): RequestHandler {
  return async (req, res, next) => {
    try {
      const { companyId } = (req as ValidatedRequest).validated?.params as { companyId: string };
      const runs = await listPayrollRuns(db, companyId);
      res.status(200).json({ runs });
    } catch (error) {
      next(error);
    }
  };
}

export function createPayrollRunController({ db }: Options): RequestHandler {
  return async (req, res, next) => {
    try {
      const { companyId } = (req as ValidatedRequest).validated?.params as { companyId: string };
      const company = await getCompany(db, companyId);

      if (!company) {
        res.status(404).json({ error: { message: 'Company not found' } });
        return;
      }

      const input = (req as ValidatedRequest).validated?.body as CreatePayrollRunInput;
      const run = await createPayrollRun(db, companyId, input);
      res.status(201).json({ run });
    } catch (error) {
      next(error);
    }
  };
}
