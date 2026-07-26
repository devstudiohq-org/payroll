import type { RequestHandler } from 'express';
import type { UpsertTaxConfigInput } from '@starter/db';

import type { Database } from '../lib/db';
import type { ValidatedRequest } from '../types/http';
import { getTaxConfig, upsertTaxConfig } from '../services/tax-config-service';
import { getCompany } from '../services/companies-service';

type Options = {
  db: Database;
};

export function getTaxConfigController({ db }: Options): RequestHandler {
  return async (req, res, next) => {
    try {
      const { companyId } = (req as ValidatedRequest).validated?.params as { companyId: string };
      const config = await getTaxConfig(db, companyId);
      res.status(200).json({ config });
    } catch (error) {
      next(error);
    }
  };
}

export function upsertTaxConfigController({ db }: Options): RequestHandler {
  return async (req, res, next) => {
    try {
      const { companyId } = (req as ValidatedRequest).validated?.params as { companyId: string };
      const company = await getCompany(db, companyId);

      if (!company) {
        res.status(404).json({ error: { message: 'Company not found' } });
        return;
      }

      const input = (req as ValidatedRequest).validated?.body as UpsertTaxConfigInput;
      const config = await upsertTaxConfig(db, companyId, input);
      res.status(200).json({ config });
    } catch (error) {
      next(error);
    }
  };
}
