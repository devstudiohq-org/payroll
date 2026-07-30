import type { RequestHandler } from 'express';
import type { CreatePayrollRunInput, UpdatePayslipInput } from '@starter/db';

import type { Database } from '../lib/db';
import type { ValidatedRequest } from '../types/http';
import {
  createPayrollRun,
  listPayrollRuns,
  listPayslipLines,
  updatePayslipItem,
} from '../services/payroll-runs-service';
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

export function listPayslipsController({ db }: Options): RequestHandler {
  return async (req, res, next) => {
    try {
      const { runId } = (req as ValidatedRequest).validated?.params as { runId: string };
      const lines = await listPayslipLines(db, runId);
      res.status(200).json({ lines });
    } catch (error) {
      next(error);
    }
  };
}

export function updatePayslipController({ db }: Options): RequestHandler {
  return async (req, res, next) => {
    try {
      const { runId, payslipId } = (req as ValidatedRequest).validated?.params as {
        runId: string;
        payslipId: string;
      };
      const input = (req as ValidatedRequest).validated?.body as UpdatePayslipInput;
      const line = await updatePayslipItem(db, runId, payslipId, input);

      if (!line) {
        res.status(404).json({ error: { message: 'Payslip not found' } });
        return;
      }

      res.status(200).json({ line });
    } catch (error) {
      next(error);
    }
  };
}
