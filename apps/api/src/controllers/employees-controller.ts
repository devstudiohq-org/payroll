import type { RequestHandler } from 'express';
import type { CreateEmployeeInput, UpdateEmployeeInput } from '@starter/db';

import type { Database } from '../lib/db';
import type { ValidatedRequest } from '../types/http';
import { createEmployee, listEmployees, updateEmployee } from '../services/employees-service';
import { getCompany } from '../services/companies-service';

type Options = {
  db: Database;
};

export function listEmployeesController({ db }: Options): RequestHandler {
  return async (req, res, next) => {
    try {
      const { companyId } = (req as ValidatedRequest).validated?.params as { companyId: string };
      const employees = await listEmployees(db, companyId);
      res.status(200).json({ employees });
    } catch (error) {
      next(error);
    }
  };
}

export function createEmployeeController({ db }: Options): RequestHandler {
  return async (req, res, next) => {
    try {
      const { companyId } = (req as ValidatedRequest).validated?.params as { companyId: string };
      const company = await getCompany(db, companyId);

      if (!company) {
        res.status(404).json({ error: { message: 'Company not found' } });
        return;
      }

      const input = (req as ValidatedRequest).validated?.body as CreateEmployeeInput;
      const employee = await createEmployee(db, companyId, input);
      res.status(201).json({ employee });
    } catch (error) {
      next(error);
    }
  };
}

export function updateEmployeeController({ db }: Options): RequestHandler {
  return async (req, res, next) => {
    try {
      const { companyId, employeeId } = (req as ValidatedRequest).validated?.params as {
        companyId: string;
        employeeId: string;
      };
      const input = (req as ValidatedRequest).validated?.body as UpdateEmployeeInput;
      const employee = await updateEmployee(db, companyId, employeeId, input);

      if (!employee) {
        res.status(404).json({ error: { message: 'Employee not found' } });
        return;
      }

      res.status(200).json({ employee });
    } catch (error) {
      next(error);
    }
  };
}
