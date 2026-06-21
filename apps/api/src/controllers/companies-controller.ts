import type { RequestHandler } from 'express';
import type { CreateCompanyInput } from '@starter/db';

import type { Database } from '../lib/db';
import type { ValidatedRequest } from '../types/http';
import { createCompany, getCompany, listCompanies } from '../services/companies-service';

type Options = {
  db: Database;
};

export function listCompaniesController({ db }: Options): RequestHandler {
  return async (_req, res, next) => {
    try {
      const companies = await listCompanies(db);
      res.status(200).json({ companies });
    } catch (error) {
      next(error);
    }
  };
}

export function getCompanyController({ db }: Options): RequestHandler {
  return async (req, res, next) => {
    try {
      const { id } = (req as ValidatedRequest).validated?.params as { id: string };
      const company = await getCompany(db, id);

      if (!company) {
        res.status(404).json({ error: { message: 'Company not found' } });
        return;
      }

      res.status(200).json({ company });
    } catch (error) {
      next(error);
    }
  };
}

export function createCompanyController({ db }: Options): RequestHandler {
  return async (req, res, next) => {
    try {
      const input = (req as ValidatedRequest).validated?.body as CreateCompanyInput;
      const company = await createCompany(db, input);
      res.status(201).json({ company });
    } catch (error) {
      next(error);
    }
  };
}
